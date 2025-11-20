#!/usr/bin/env python3
"""
Experiment Maker - Fixed Version
Addresses critical security, reliability, and usability issues
"""

from flask import Flask, render_template, request, jsonify, redirect, url_for, send_from_directory, session, flash
from flask_wtf.csrf import CSRFProtect
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import secure_filename
from pathlib import Path
import sqlite3
import json
import time
import uuid
import datetime
import logging
import os
from functools import wraps
from contextlib import contextmanager

# Set up logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('app.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

from backend.experiments.base_experiment import BaseExperiment, ExperimentType
from backend.experiments.digit_span import DigitSpanExperiment
from backend.experiments.sart import SARTExperiment
from backend.experiments.stroop import StroopExperiment

# Configuration
class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or os.urandom(32).hex()
    DB_PATH = Path('database/app.db')
    UPLOAD_FOLDER = Path('uploads')
    MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 16MB max upload
    SESSION_COOKIE_SECURE = True  # Set to True in production with HTTPS
    SESSION_COOKIE_HTTPONLY = True
    SESSION_COOKIE_SAMESITE = 'Lax'
    WTF_CSRF_ENABLED = True
    
    # Simple auth (for student testing - replace with real auth for production)
    DEFAULT_USERNAME = os.environ.get('ADMIN_USERNAME', 'admin')
    DEFAULT_PASSWORD = os.environ.get('ADMIN_PASSWORD', 'change_me_now')

# Experiment registry
EXPERIMENT_REGISTRY = {
    'digit_span': DigitSpanExperiment,
    'sart': SARTExperiment,
    'stroop': StroopExperiment,
}

# Initialize Flask app
app = Flask(__name__,
            template_folder='frontend/templates',
            static_folder='frontend/static')
app.config.from_object(Config)

# Enable CSRF protection
csrf = CSRFProtect(app)

# Database connection pool (simple version for SQLite)
@contextmanager
def get_db():
    """Context manager for database connections with proper error handling"""
    conn = None
    try:
        conn = sqlite3.connect(Config.DB_PATH, timeout=10.0)
        conn.row_factory = sqlite3.Row  # Enable column access by name
        conn.execute('PRAGMA foreign_keys = ON')  # Enable foreign key constraints
        yield conn
        conn.commit()
    except sqlite3.Error as e:
        if conn:
            conn.rollback()
        logger.error(f"Database error: {e}")
        raise
    except Exception as e:
        if conn:
            conn.rollback()
        logger.error(f"Unexpected error: {e}")
        raise
    finally:
        if conn:
            conn.close()

def init_db():
    """Initialize database with proper schema and indices"""
    Config.DB_PATH.parent.mkdir(parents=True, exist_ok=True)
    
    try:
        with get_db() as conn:
            # Create tables with foreign keys
            conn.executescript('''
            CREATE TABLE IF NOT EXISTS subjects (
                id TEXT PRIMARY KEY,
                created_at TEXT NOT NULL DEFAULT (datetime('now')),
                updated_at TEXT
            );
            
            CREATE TABLE IF NOT EXISTS sessions (
                id TEXT PRIMARY KEY,
                subject_id TEXT NOT NULL,
                experiment_type TEXT NOT NULL,
                config_json TEXT NOT NULL,
                started_at TEXT NOT NULL DEFAULT (datetime('now')),
                completed_at TEXT,
                FOREIGN KEY (subject_id) REFERENCES subjects(id)
            );
            
            CREATE TABLE IF NOT EXISTS trials (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                session_id TEXT NOT NULL,
                trial_number INTEGER NOT NULL,
                is_practice INTEGER NOT NULL DEFAULT 0,
                stimulus_json TEXT,
                correct_response TEXT,
                metadata_json TEXT,
                presented_at TEXT NOT NULL DEFAULT (datetime('now')),
                FOREIGN KEY (session_id) REFERENCES sessions(id)
            );
            
            CREATE TABLE IF NOT EXISTS responses (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                session_id TEXT NOT NULL,
                trial_number INTEGER NOT NULL,
                response_value TEXT,
                response_time_ms REAL,
                correct INTEGER,
                feedback TEXT,
                recorded_at TEXT NOT NULL DEFAULT (datetime('now')),
                FOREIGN KEY (session_id) REFERENCES sessions(id)
            );
            
            CREATE TABLE IF NOT EXISTS gui_snapshots (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                session_id TEXT,
                experiment_type TEXT NOT NULL,
                filepath TEXT NOT NULL,
                notes TEXT,
                uploaded_at TEXT NOT NULL DEFAULT (datetime('now')),
                FOREIGN KEY (session_id) REFERENCES sessions(id)
            );
            
            -- Add indices for performance
            CREATE INDEX IF NOT EXISTS idx_sessions_subject ON sessions(subject_id);
            CREATE INDEX IF NOT EXISTS idx_sessions_type ON sessions(experiment_type);
            CREATE INDEX IF NOT EXISTS idx_trials_session ON trials(session_id);
            CREATE INDEX IF NOT EXISTS idx_responses_session ON responses(session_id);
            ''')
        logger.info("Database initialized successfully")
    except Exception as e:
        logger.error(f"Failed to initialize database: {e}")
        raise

# Simple authentication decorator
def login_required(f):
    """Decorator to require login for certain routes"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if not session.get('logged_in'):
            flash('Please log in to access this page.', 'warning')
            return redirect(url_for('login', next=request.url))
        return f(*args, **kwargs)
    return decorated_function

# Help texts
HELP_TEXTS = {
    'digit_span': 'Memorize the sequence, then type the digits in order and press Enter. Corrections allowed before Enter.',
    'sart': 'Press Space for GO digits. Do not press for target digit 3. Keep pace and minimize false alarms.',
    'stroop': 'Report the INK color, not the word: r=red, g=green, b=blue, y=yellow.'
}

# ============================================
# AUTHENTICATION ROUTES
# ============================================

@app.route('/login', methods=['GET', 'POST'])
def login():
    """Simple login for experimenter access"""
    if request.method == 'POST':
        username = request.form.get('username', '').strip()
        password = request.form.get('password', '')
        
        # Simple auth (replace with real auth in production)
        if username == Config.DEFAULT_USERNAME and password == Config.DEFAULT_PASSWORD:
            session['logged_in'] = True
            session['username'] = username
            logger.info(f"User {username} logged in")
            
            next_page = request.args.get('next')
            return redirect(next_page or url_for('home'))
        else:
            flash('Invalid credentials', 'danger')
            logger.warning(f"Failed login attempt for user: {username}")
    
    return render_template('login.html')

@app.route('/logout')
def logout():
    """Logout route"""
    username = session.get('username', 'Unknown')
    session.clear()
    logger.info(f"User {username} logged out")
    flash('You have been logged out', 'info')
    return redirect(url_for('home'))

# ============================================
# MAIN ROUTES
# ============================================

@app.route('/')
def home():
    """Home page with experiment list"""
    try:
        subject_id = request.args.get('subject_id', '').strip()
        cards = [{
            'experiment_type': key,
            'title': key.replace('_', ' ').title(),
            'description': f'Run or configure the {key} task.'
        } for key in EXPERIMENT_REGISTRY.keys()]
        
        return render_template('index.html', cards=cards, subject_id=subject_id)
    except Exception as e:
        logger.error(f"Error in home route: {e}")
        return render_template('error.html', error="Failed to load home page"), 500

@app.route('/consent', methods=['GET', 'POST'])
def consent():
    """Consent form for subjects"""
    if request.method == 'POST':
        try:
            # Get or generate subject ID
            sid = request.form.get('subject_id', '').strip() or str(uuid.uuid4())
            
            # Validate subject ID format
            if len(sid) > 100:
                flash('Subject ID too long', 'danger')
                return redirect(url_for('consent'))
            
            # Store in database
            with get_db() as conn:
                conn.execute(
                    'INSERT OR IGNORE INTO subjects (id, created_at) VALUES (?, ?)',
                    (sid, datetime.datetime.utcnow().isoformat())
                )
            
            logger.info(f"Subject {sid} consented")
            return redirect(url_for('home', subject_id=sid))
            
        except Exception as e:
            logger.error(f"Error in consent route: {e}")
            flash('An error occurred. Please try again.', 'danger')
            return redirect(url_for('consent'))
    
    return render_template('consent.html')

# ============================================
# EXPERIMENTER ROUTES (Require Login)
# ============================================

@app.route('/experimenter/<exp_type>')
@login_required
def experimenter(exp_type):
    """Experimenter configuration page"""
    try:
        # Validate experiment type
        if exp_type not in EXPERIMENT_REGISTRY:
            logger.warning(f"Unknown experiment type requested: {exp_type}")
            return render_template('error.html', error='Unknown experiment type'), 404

        # Special handling for Stroop - redirect to external HTML file
        if exp_type == 'stroop':
            return redirect('/experiments/stroop_experiment_v3.2.html?mode=config')

        # Get configuration schema
        inst = EXPERIMENT_REGISTRY[exp_type]()
        schema = inst.get_configuration_schema()

        return render_template('experimenter_config.html',
                             exp_type=exp_type,
                             schema=schema)

    except Exception as e:
        logger.error(f"Error in experimenter route for {exp_type}: {e}")
        return render_template('error.html', error='Failed to load experimenter page'), 500

@app.route('/data/export/<session_id>')
@login_required
def export_data(session_id):
    """Export session data as CSV"""
    try:
        with get_db() as conn:
            # Get session info
            session_row = conn.execute(
                'SELECT * FROM sessions WHERE id = ?', 
                (session_id,)
            ).fetchone()
            
            if not session_row:
                return jsonify({'error': 'Session not found'}), 404
            
            # Get all responses
            responses = conn.execute('''
                SELECT r.*, t.stimulus_json, t.correct_response as expected_response
                FROM responses r
                JOIN trials t ON r.session_id = t.session_id AND r.trial_number = t.trial_number
                WHERE r.session_id = ?
                ORDER BY r.trial_number
            ''', (session_id,)).fetchall()
            
            # Convert to CSV
            import csv
            from io import StringIO
            
            output = StringIO()
            if responses:
                writer = csv.DictWriter(output, fieldnames=responses[0].keys())
                writer.writeheader()
                for row in responses:
                    writer.writerow(dict(row))
            
            # Return as downloadable file
            from flask import Response
            return Response(
                output.getvalue(),
                mimetype='text/csv',
                headers={'Content-Disposition': f'attachment; filename=session_{session_id}.csv'}
            )
    
    except Exception as e:
        logger.error(f"Error exporting data for session {session_id}: {e}")
        return jsonify({'error': 'Failed to export data'}), 500

# ============================================
# SUBJECT ROUTES (No login required)
# ============================================

@app.route('/subject/<exp_type>')
def subject(exp_type):
    """Subject run page"""
    try:
        # Validate experiment type
        if exp_type not in EXPERIMENT_REGISTRY:
            return render_template('error.html', error='Unknown experiment type'), 404

        # Special handling for Stroop - redirect to external HTML file
        if exp_type == 'stroop':
            return redirect('/experiments/stroop_experiment_v3.2.html')

        subject_id = request.args.get('subject_id', '').strip()

        return render_template('subject_run.html',
                             exp_type=exp_type,
                             subject_id=subject_id)

    except Exception as e:
        logger.error(f"Error in subject route for {exp_type}: {e}")
        return render_template('error.html', error='Failed to load experiment'), 500

# ============================================
# API ROUTES
# ============================================

@app.route('/api/<exp_type>/help')
def api_help(exp_type):
    """Get help text for experiment"""
    try:
        txt = HELP_TEXTS.get(exp_type, 'No help text defined for this experiment yet.')
        return jsonify({'help_text': txt})
    except Exception as e:
        logger.error(f"Error getting help for {exp_type}: {e}")
        return jsonify({'error': 'Failed to get help text'}), 500

@app.route('/api/<exp_type>/schema')
def api_schema(exp_type):
    """Get configuration schema for experiment"""
    try:
        if exp_type not in EXPERIMENT_REGISTRY:
            return jsonify({'error': 'Unknown experiment type'}), 404
        
        inst = EXPERIMENT_REGISTRY[exp_type]()
        schema = inst.get_configuration_schema()
        
        return jsonify(schema)
    
    except Exception as e:
        logger.error(f"Error getting schema for {exp_type}: {e}")
        return jsonify({'error': 'Failed to get schema'}), 500

# In-memory session storage (use Redis in production)
_sessions = {}

@app.route('/api/<exp_type>/start', methods=['POST'])
@csrf.exempt
def api_start(exp_type):
    """Start a new experiment session"""
    try:
        # Validate experiment type
        if exp_type not in EXPERIMENT_REGISTRY:
            return jsonify({'error': 'Unknown experiment type'}), 404
        
        # Get request data
        data = request.get_json(force=True) or {}
        config = data.get('config', {})
        subject_id = data.get('subject_id', '').strip() or str(uuid.uuid4())
        
        # Validate inputs
        if not isinstance(config, dict):
            return jsonify({'error': 'Invalid configuration format'}), 400
        
        if len(subject_id) > 100:
            return jsonify({'error': 'Subject ID too long'}), 400
        
        # Handle keymap if it's a string
        if isinstance(config.get('keymap'), str):
            try:
                config['keymap'] = json.loads(config['keymap'])
            except json.JSONDecodeError:
                logger.warning(f"Failed to parse keymap for session")
        
        # Create experiment instance
        inst = EXPERIMENT_REGISTRY[exp_type]()
        inst.configure(config)
        
        # Generate session ID
        sid = f'{exp_type}-{int(time.time()*1000)}-{uuid.uuid4().hex[:8]}'
        _sessions[sid] = inst
        
        # Save to database
        now = datetime.datetime.utcnow().isoformat()
        with get_db() as conn:
            conn.execute('''
                INSERT INTO sessions 
                (id, subject_id, experiment_type, config_json, started_at, completed_at) 
                VALUES (?, ?, ?, ?, ?, NULL)
            ''', (sid, subject_id, exp_type, json.dumps(config), now))
        
        logger.info(f"Started session {sid} for subject {subject_id}, experiment {exp_type}")
        
        return jsonify({
            'session_id': sid,
            'subject_id': subject_id,
            'instructions': inst.get_instructions()
        })
    
    except Exception as e:
        logger.error(f"Error starting {exp_type} session: {e}")
        return jsonify({'error': 'Failed to start session'}), 500

@app.route('/api/<exp_type>/next', methods=['POST'])
@csrf.exempt
def api_next(exp_type):
    """Get next trial"""
    try:
        data = request.get_json(force=True) or {}
        sid = data.get('session_id', '').strip()
        
        # Validate session
        if not sid or sid not in _sessions:
            return jsonify({'error': 'Invalid session'}), 400
        
        inst = _sessions[sid]
        
        # Check if complete
        if inst.is_complete():
            results = inst.get_results()
            
            # Update database
            with get_db() as conn:
                conn.execute(
                    'UPDATE sessions SET completed_at = ? WHERE id = ?',
                    (datetime.datetime.utcnow().isoformat(), sid)
                )
            
            logger.info(f"Session {sid} completed")
            return jsonify({'trial': None, 'complete': True, 'results': results})
        
        # Get next trial
        trial = inst.get_next_trial()
        
        if trial is None:
            results = inst.get_results()
            
            with get_db() as conn:
                conn.execute(
                    'UPDATE sessions SET completed_at = ? WHERE id = ?',
                    (datetime.datetime.utcnow().isoformat(), sid)
                )
            
            logger.info(f"Session {sid} completed (no more trials)")
            return jsonify({'trial': None, 'complete': True, 'results': results})
        
        # Save trial to database
        with get_db() as conn:
            conn.execute('''
                INSERT INTO trials 
                (session_id, trial_number, is_practice, stimulus_json, 
                 correct_response, metadata_json, presented_at) 
                VALUES (?, ?, ?, ?, ?, ?, ?)
            ''', (
                sid,
                int(trial.get('trial_number', 0)),
                1 if trial.get('trial_type') == 'practice' else 0,
                json.dumps(trial.get('stimulus_data')),
                str(trial.get('correct_response', '')),
                json.dumps(trial.get('metadata', {})),
                datetime.datetime.utcnow().isoformat()
            ))
        
        return jsonify({'trial': trial})
    
    except Exception as e:
        logger.error(f"Error getting next trial for {exp_type}: {e}")
        return jsonify({'error': 'Failed to get next trial'}), 500

@app.route('/api/<exp_type>/record', methods=['POST'])
@csrf.exempt
def api_record(exp_type):
    """Record a response"""
    try:
        data = request.get_json(force=True) or {}
        sid = data.get('session_id', '').strip()
        
        # Validate session
        if not sid or sid not in _sessions:
            return jsonify({'error': 'Invalid session'}), 400
        
        inst = _sessions[sid]
        resp = data.get('response', {})
        
        # Validate response
        if not isinstance(resp, dict):
            return jsonify({'error': 'Invalid response format'}), 400
        
        # Record response
        fb = inst.record_response(resp)
        correct = int(bool(fb.get('correct'))) if isinstance(fb, dict) else None
        
        # Save to database
        with get_db() as conn:
            conn.execute('''
                INSERT INTO responses 
                (session_id, trial_number, response_value, response_time_ms, 
                 correct, feedback, recorded_at) 
                VALUES (?, ?, ?, ?, ?, ?, ?)
            ''', (
                sid,
                int(resp.get('trial_number', 0)),
                str(resp.get('response_value', '')),
                float(resp.get('response_time_ms', 0)),
                correct,
                json.dumps(fb),
                datetime.datetime.utcnow().isoformat()
            ))
        
        return jsonify({'feedback': fb})
    
    except Exception as e:
        logger.error(f"Error recording response for {exp_type}: {e}")
        return jsonify({'error': 'Failed to record response'}), 500

# ============================================
# FILE UPLOAD ROUTES
# ============================================

@app.route('/snapshot/upload', methods=['POST'])
@login_required
def snapshot_upload():
    """Upload GUI snapshot"""
    try:
        uploaded = request.files.get('file')
        session_id = request.form.get('session_id', '').strip()
        exp_type = request.form.get('experiment_type', '').strip()
        notes = request.form.get('notes', '').strip()
        
        # Validate inputs
        if not uploaded:
            flash('No file uploaded', 'danger')
            return redirect(request.referrer or url_for('home'))
        
        if not exp_type:
            flash('Experiment type required', 'danger')
            return redirect(request.referrer or url_for('home'))
        
        # Secure filename
        filename = secure_filename(uploaded.filename)
        if not filename:
            flash('Invalid filename', 'danger')
            return redirect(request.referrer or url_for('home'))
        
        # Create upload directory
        Config.UPLOAD_FOLDER.mkdir(parents=True, exist_ok=True)
        
        # Save file
        timestamp = int(time.time())
        safe_name = f'{exp_type}_{timestamp}_{filename}'
        save_path = Config.UPLOAD_FOLDER / safe_name
        
        uploaded.save(save_path)
        
        # Save to database
        with get_db() as conn:
            conn.execute('''
                INSERT INTO gui_snapshots 
                (session_id, experiment_type, filepath, notes, uploaded_at) 
                VALUES (?, ?, ?, ?, datetime('now'))
            ''', (session_id or None, exp_type, str(save_path), notes))
        
        logger.info(f"Uploaded snapshot: {safe_name}")
        flash('Snapshot uploaded successfully', 'success')
        
        return redirect(url_for('experimenter', exp_type=exp_type))
    
    except Exception as e:
        logger.error(f"Error uploading snapshot: {e}")
        flash('Failed to upload snapshot', 'danger')
        return redirect(request.referrer or url_for('home'))

# ============================================
# UTILITY ROUTES
# ============================================

@app.route('/psychopy/complete')
def psychopy_complete():
    """PsychoPy completion page"""
    try:
        token = request.args.get('token', '').strip()
        
        with get_db() as conn:
            conn.execute(
                'INSERT OR IGNORE INTO subjects (id, created_at) VALUES (?, ?)',
                (token or str(uuid.uuid4()), datetime.datetime.utcnow().isoformat())
            )
        
        return render_template('psychopy_complete.html', token=token)
    
    except Exception as e:
        logger.error(f"Error in psychopy_complete: {e}")
        return render_template('error.html', error='Completion page error'), 500

@app.route('/docs/<path:filename>')
def docs(filename):
    """Serve documentation files"""
    try:
        docs_dir = Path('docs')
        return send_from_directory(docs_dir, filename)
    except Exception as e:
        logger.error(f"Error serving doc {filename}: {e}")
        return "Document not found", 404

@app.route('/experiments/<path:filename>')
def experiments(filename):
    """Serve experiment HTML files"""
    try:
        experiments_dir = Path('experiments')
        return send_from_directory(experiments_dir, filename)
    except Exception as e:
        logger.error(f"Error serving experiment {filename}: {e}")
        return "Experiment not found", 404

# ============================================
# ERROR HANDLERS
# ============================================

@app.errorhandler(404)
def not_found(error):
    logger.warning(f"404 error: {request.url}")
    return render_template('error.html', error='Page not found'), 404

@app.errorhandler(500)
def internal_error(error):
    logger.error(f"500 error: {error}")
    return render_template('error.html', error='Internal server error'), 500

@app.errorhandler(Exception)
def handle_exception(error):
    logger.error(f"Unhandled exception: {error}", exc_info=True)
    return render_template('error.html', error='An unexpected error occurred'), 500

# ============================================
# MAIN
# ============================================

if __name__ == '__main__':
    # Initialize database
    try:
        init_db()
        logger.info("Application starting...")
        
        # Print important info
        print("=" * 60)
        print("EXPERIMENT MAKER - FIXED VERSION")
        print("=" * 60)
        print(f"Default admin username: {Config.DEFAULT_USERNAME}")
        print(f"Default admin password: {Config.DEFAULT_PASSWORD}")
        print("⚠️  CHANGE THE DEFAULT PASSWORD BEFORE DEPLOYMENT!")
        print("Set environment variables ADMIN_USERNAME and ADMIN_PASSWORD")
        print("=" * 60)
        
        # Run app
        app.run(host='0.0.0.0', port=5001, debug=False)  # debug=False for production
        
    except Exception as e:
        logger.critical(f"Failed to start application: {e}", exc_info=True)
        raise
