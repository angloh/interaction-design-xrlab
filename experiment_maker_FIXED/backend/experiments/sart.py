"""
FILE: backend/experiments/sart.py
DIRECTORY: /backend/experiments/

FUNCTIONAL ROLE: SART (Sustained Attention to Response Task) implementation.
                  Participants respond to frequent targets but withhold response
                  to rare non-targets. Measures sustained attention and response
                  inhibition.

METHOD: Go/No-Go paradigm with infrequent No-Go trials
    - Digits 0-9 presented rapidly (default: 1 per 1.15 seconds)
    - Press key for all digits EXCEPT target (default: 3)
    - Target appears 11% of trials
    - Measures: commission errors (responding to target), 
                omission errors (missing non-targets),
                reaction time variability

TYPICAL PARADIGM (from Robertson et al., 1997):
    - 225 trials total
    - Digit displays 250ms, mask 900ms
    - Target digit "3" (25 occurrences, 11%)
    - Digits vary in size/font to prevent habituation

VERSION: 3.0.0
LAST MODIFIED: 2025-11-05

REFERENCES:
    Robertson, I. H., Manly, T., Andrade, J., Baddeley, B. T., & Yiend, J. (1997).
        'Oops!': Performance correlates of everyday attentional failures in 
        traumatic brain injured and normal subjects. Neuropsychologia, 35(6), 747-758.
    
    Smilek, D., Carriere, J. S., & Cheyne, J. A. (2010). Out of mind, out of sight:
        Eye blinking as indicator and embodiment of mind wandering. 
        Psychological Science, 21(6), 786-789.
"""

from typing import Dict, Any, List, Optional
import random
from .base_experiment import (
    BaseExperiment, ExperimentType, TrialData, ResponseData
)


class SARTExperiment(BaseExperiment):
    """
    SART (Sustained Attention to Response Task).
    
    Configuration options:
    - target_digit: The NO-GO digit (default 3)
    - total_trials: Number of trials (default 225)
    - target_frequency: Proportion of target trials (default 0.11)
    - digit_display_ms: How long digit shows (default 250)
    - mask_duration_ms: Blank/mask duration (default 900)
    - response_window_ms: Time allowed for response (default 900)
    - vary_font_size: Randomize digit size (default True)
    """
    
    def configure(self, config: Dict[str, Any]) -> None:
        """Parse SART specific configuration."""
        # Basic options
        self.target_digit = config.get("target_digit", 3)
        self.total_trials = config.get("total_trials", 225)
        self.target_frequency = config.get("target_frequency", 0.11)
        
        # Advanced timing options
        self.digit_display_ms = config.get("digit_display_ms", 250)
        self.mask_duration_ms = config.get("mask_duration_ms", 900)
        self.response_window_ms = config.get("response_window_ms", 900)
        
        # Advanced visual options
        self.vary_font_size = config.get("vary_font_size", True)
        self.font_sizes = config.get("font_sizes", [48, 72, 94, 100, 120])
        self.feedback_on_errors = config.get("feedback_on_errors", False)
        
        # Pre-generate trial sequence for consistency
        self.trial_sequence = self._generate_trial_sequence()
        self.trials_completed = 0
        
        # Performance tracking
        self.commission_errors = 0  # Responded to target (false alarm)
        self.omission_errors = 0     # Didn't respond to non-target (miss)
        self.correct_rejections = 0   # Correctly withheld to target
        self.hits = 0                 # Correctly responded to non-target
        self.reaction_times = []
    
    def _generate_trial_sequence(self) -> List[Dict[str, Any]]:
        """Generate balanced sequence of target and non-target trials."""
        num_targets = int(self.total_trials * self.target_frequency)
        num_non_targets = self.total_trials - num_targets
        
        # Create digit list
        non_target_digits = [d for d in range(10) if d != self.target_digit]
        
        trials = []
        
        # Add target trials
        for _ in range(num_targets):
            trials.append({
                "digit": self.target_digit,
                "is_target": True,
                "correct_response": "withhold"  # NO-GO
            })
        
        # Add non-target trials (balanced across other digits)
        for i in range(num_non_targets):
            digit = non_target_digits[i % len(non_target_digits)]
            trials.append({
                "digit": digit,
                "is_target": False,
                "correct_response": "respond"  # GO
            })
        
        # Shuffle
        random.shuffle(trials)
        
        # Add font sizes if varying
        if self.vary_font_size:
            for trial in trials:
                trial["font_size"] = random.choice(self.font_sizes)
        else:
            for trial in trials:
                trial["font_size"] = 72
        
        return trials
    
    def get_experiment_type(self) -> ExperimentType:
        return ExperimentType.SART
    
    def get_instructions(self) -> List[Dict[str, Any]]:
        """Return SART instruction screens."""
        return [
            {
                "type": "text",
                "title": "Sustained Attention Task",
                "content": f"""
                    <h2>Welcome to the Sustained Attention Task</h2>
                    <p>This task measures your ability to maintain attention 
                       and control your responses over time.</p>
                    <p><strong>Duration:</strong> About {int(self.total_trials * 1.15 / 60)} 
                       minutes</p>
                """,
                "duration_ms": None
            },
            {
                "type": "text",
                "title": "Your Task",
                "content": f"""
                    <h3>Here's What You'll Do</h3>
                    <p>You'll see digits (0-9) appear rapidly on the screen.</p>
                    <p><strong>Your job:</strong></p>
                    <ul>
                        <li>Press the <strong>SPACEBAR</strong> for every digit</li>
                        <li><strong>EXCEPT</strong> when you see the digit <strong 
                            style="font-size:150%;color:#e53e3e;">{self.target_digit}</strong></li>
                        <li>When you see <strong style="font-size:150%;color:#e53e3e;">{self.target_digit}</strong>, 
                            do NOT press anything</li>
                    </ul>
                    <div class="warning-box">
                        <p>⚠️ This is tricky! The digits come fast and you need to 
                           respond quickly, but you must also resist pressing when 
                           you see {self.target_digit}.</p>
                    </div>
                """,
                "duration_ms": None
            },
            {
                "type": "interactive_demo",
                "title": "Practice Examples",
                "content": f"""
                    <h3>Let's Practice</h3>
                    <p>Watch these examples:</p>
                    <div class="example">
                        <p>If you see: <strong>7</strong></p>
                        <p>You should: <strong>PRESS SPACEBAR</strong> ✓</p>
                    </div>
                    <div class="example">
                        <p>If you see: <strong style="color:#e53e3e;">{self.target_digit}</strong></p>
                        <p>You should: <strong>DO NOTHING</strong> ✓</p>
                    </div>
                    <div class="example">
                        <p>If you see: <strong>9</strong></p>
                        <p>You should: <strong>PRESS SPACEBAR</strong> ✓</p>
                    </div>
                """,
                "duration_ms": None
            },
            {
                "type": "text",
                "title": "Important Tips",
                "content": """
                    <h3>Tips for Success</h3>
                    <ul>
                        <li><strong>Stay focused</strong> - This task requires constant attention</li>
                        <li><strong>Respond quickly</strong> - But not so fast that you make mistakes</li>
                        <li><strong>Don't worry about occasional errors</strong> - They're normal!</li>
                        <li><strong>Take it seriously</strong> - Even though it's repetitive</li>
                        <li><strong>Keep your finger ready</strong> - Hover over spacebar</li>
                    </ul>
                    <div class="info-box">
                        <p>💡 The task will seem easy at first, but staying focused 
                           for several minutes is the real challenge!</p>
                    </div>
                """,
                "duration_ms": None
            },
            {
                "type": "text",
                "title": "Ready?",
                "content": f"""
                    <h3>Let's Begin</h3>
                    <p>Remember:</p>
                    <ul>
                        <li>Press SPACEBAR for all digits <strong>except {self.target_digit}</strong></li>
                        <li>Do NOT press anything when you see {self.target_digit}</li>
                    </ul>
                    <p>You'll do some practice trials first.</p>
                    <p>Click "Continue" when ready.</p>
                """,
                "duration_ms": None
            }
        ]
    
    def get_practice_trials(self) -> Optional[List[TrialData]]:
        """Generate 20 practice trials with same target frequency."""
        practice_sequence = []
        num_practice = 20
        num_targets = int(num_practice * self.target_frequency)
        
        # Add targets
        for _ in range(num_targets):
            practice_sequence.append({"digit": self.target_digit, "is_target": True})
        
        # Add non-targets
        non_target_digits = [d for d in range(10) if d != self.target_digit]
        for _ in range(num_practice - num_targets):
            practice_sequence.append({
                "digit": random.choice(non_target_digits),
                "is_target": False
            })
        
        random.shuffle(practice_sequence)
        
        # Convert to TrialData
        practice_trials = []
        for i, trial_info in enumerate(practice_sequence):
            practice_trials.append(TrialData(
                trial_number=i + 1,
                trial_type="practice",
                stimulus_data={
                    "digit": trial_info["digit"],
                    "is_target": trial_info["is_target"],
                    "font_size": random.choice(self.font_sizes) if self.vary_font_size else 72,
                    "digit_display_ms": self.digit_display_ms,
                    "mask_duration_ms": self.mask_duration_ms,
                    "response_window_ms": self.response_window_ms
                },
                correct_response="withhold" if trial_info["is_target"] else "respond"
            ))
        
        return practice_trials
    
    def get_next_trial(self) -> Optional[TrialData]:
        """Get next trial from pre-generated sequence."""
        if self.trials_completed >= len(self.trial_sequence):
            return None
        
        trial_info = self.trial_sequence[self.trials_completed]
        self.trials_completed += 1
        self.current_trial_number = self.trials_completed
        
        return TrialData(
            trial_number=self.current_trial_number,
            trial_type="test",
            stimulus_data={
                "digit": trial_info["digit"],
                "is_target": trial_info["is_target"],
                "font_size": trial_info["font_size"],
                "digit_display_ms": self.digit_display_ms,
                "mask_duration_ms": self.mask_duration_ms,
                "response_window_ms": self.response_window_ms
            },
            correct_response=trial_info["correct_response"],
            metadata={
                "trial_number": self.current_trial_number,
                "is_target": trial_info["is_target"]
            }
        )
    
    def record_response(self, response_data: ResponseData) -> Dict[str, Any]:
        """Process SART response and calculate performance metrics."""
        self.trial_history.append(response_data)
        
        # Get trial info
        is_target = response_data.metadata.get("is_target", False)
        responded = response_data.response not in [None, "", "no_response"]
        
        # Categorize response
        if is_target:  # NO-GO trial
            if responded:
                self.commission_errors += 1
                feedback = "✗ Remember: Don't press for 3!"
                correct = False
            else:
                self.correct_rejections += 1
                feedback = "✓ Correct! You withheld."
                correct = True
        else:  # GO trial
            if responded:
                self.hits += 1
                self.reaction_times.append(response_data.response_time_ms)
                feedback = "✓ Good!"
                correct = True
            else:
                self.omission_errors += 1
                feedback = "✗ You should have responded."
                correct = False
        
        # Only show feedback if enabled
        show_feedback = self.feedback_on_errors and not correct
        
        return {
            "correct": correct,
            "feedback_message": feedback if show_feedback else None,
            "continue": not self.is_complete()
        }
    
    def is_complete(self) -> bool:
        """Check if all trials completed."""
        return self.trials_completed >= self.total_trials
    
    def get_results(self) -> Dict[str, Any]:
        """Calculate SART performance metrics."""
        total_targets = sum(1 for t in self.trial_sequence if t["is_target"])
        total_non_targets = self.total_trials - total_targets
        
        # Calculate rates
        commission_error_rate = (self.commission_errors / total_targets * 100) if total_targets > 0 else 0
        omission_error_rate = (self.omission_errors / total_non_targets * 100) if total_non_targets > 0 else 0
        
        # Reaction time statistics
        if self.reaction_times:
            import statistics
            mean_rt = statistics.mean(self.reaction_times)
            std_rt = statistics.stdev(self.reaction_times) if len(self.reaction_times) > 1 else 0
            cv_rt = (std_rt / mean_rt) if mean_rt > 0 else 0  # Coefficient of variation
        else:
            mean_rt = 0
            std_rt = 0
            cv_rt = 0
        
        return {
            "commission_errors": self.commission_errors,
            "commission_error_rate": round(commission_error_rate, 2),
            "omission_errors": self.omission_errors,
            "omission_error_rate": round(omission_error_rate, 2),
            "correct_rejections": self.correct_rejections,
            "hits": self.hits,
            "total_trials": self.total_trials,
            "mean_reaction_time_ms": round(mean_rt, 2),
            "std_reaction_time_ms": round(std_rt, 2),
            "cv_reaction_time": round(cv_rt, 3),
            "interpretation": self._interpret_results(commission_error_rate, cv_rt)
        }
    
    def _interpret_results(self, commission_rate: float, cv_rt: float) -> Dict[str, str]:
        """Provide interpretation of SART results."""
        # Based on typical SART norms
        commission_interpretation = (
            "Low" if commission_rate < 30 else
            "Moderate" if commission_rate < 50 else
            "High"
        )
        
        rt_variability_interpretation = (
            "Low" if cv_rt < 0.20 else
            "Moderate" if cv_rt < 0.30 else
            "High"
        )
        
        return {
            "commission_errors": commission_interpretation,
            "rt_variability": rt_variability_interpretation,
            "summary": f"Commission errors: {commission_interpretation}, RT variability: {rt_variability_interpretation}"
        }
    
    def get_default_configuration(self) -> Dict[str, Any]:
        """Default SART settings."""
        return {
            "target_digit": 3,
            "total_trials": 225,
            "target_frequency": 0.11,
            "digit_display_ms": 250,
            "mask_duration_ms": 900,
            "response_window_ms": 900,
            "vary_font_size": True,
            "font_sizes": [48, 72, 94, 100, 120],
            "feedback_on_errors": False
        }
    
    def get_configuration_schema(self) -> Dict[str, Any]:
        """Configuration options for experimenter GUI."""
        return {
            "basic": {
                "target_digit": {
                    "type": "number",
                    "label": "Target Digit (NO-GO)",
                    "default": 3,
                    "min": 0,
                    "max": 9,
                    "description": "The digit participants should NOT respond to"
                },
                "total_trials": {
                    "type": "number",
                    "label": "Total Number of Trials",
                    "default": 225,
                    "min": 50,
                    "max": 500,
                    "step": 25,
                    "description": "More trials = longer test but more reliable data"
                },
                "feedback_on_errors": {
                    "type": "boolean",
                    "label": "Show Feedback on Errors",
                    "default": False,
                    "description": "Tell participants when they make mistakes (not typical for SART)"
                }
            },
            "advanced": {
                "target_frequency": {
                    "type": "number",
                    "label": "Target Frequency (proportion)",
                    "default": 0.11,
                    "min": 0.05,
                    "max": 0.30,
                    "step": 0.01,
                    "description": "Proportion of trials that are NO-GO (typical: 0.11)"
                },
                "digit_display_ms": {
                    "type": "number",
                    "label": "Digit Display Time (ms)",
                    "default": 250,
                    "min": 100,
                    "max": 1000,
                    "step": 50,
                    "description": "How long each digit appears"
                },
                "mask_duration_ms": {
                    "type": "number",
                    "label": "Mask/Blank Duration (ms)",
                    "default": 900,
                    "min": 500,
                    "max": 2000,
                    "step": 100,
                    "description": "Blank screen after digit (typical: 900ms)"
                },
                "response_window_ms": {
                    "type": "number",
                    "label": "Response Window (ms)",
                    "default": 900,
                    "min": 500,
                    "max": 2000,
                    "step": 100,
                    "description": "Time allowed for response"
                },
                "vary_font_size": {
                    "type": "boolean",
                    "label": "Vary Font Size",
                    "default": True,
                    "description": "Randomize digit size to prevent habituation"
                }
            }
        }
