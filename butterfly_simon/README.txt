╔═══════════════════════════════════════════════════════════════════════════════╗
║                    BUTTERFLY SIMON V2 - GUI PROTOTYPE                         ║
║                        Modular Cognitive Task System                          ║
╚═══════════════════════════════════════════════════════════════════════════════╝

📦 PACKAGE CONTENTS
═══════════════════════════════════════════════════════════════════════════════

  • experimenter.html ─── Experimenter setup and configuration interface
  • subject.html ──────── Subject-facing instruction and task screens
  • README.txt ───────── This documentation file

🚀 QUICK START
═══════════════════════════════════════════════════════════════════════════════

1. Extract the zip file to any location on your computer
2. Double-click experimenter.html to configure your experiment
3. Set parameters, customize instructions, and save configuration
4. Click "Open Subject View" to launch the task
5. Run Practice and Main blocks, then download CSV data

NO SERVER REQUIRED – Works completely offline!

📋 SYSTEM OVERVIEW
═══════════════════════════════════════════════════════════════════════════════

This is a complete implementation of the Butterfly Simon task, a cognitive 
control paradigm where participants respond to the COLOR of a butterfly while 
ignoring its LOCATION on screen.

SIMON EFFECT: When stimulus location and response location are incongruent 
(e.g., purple butterfly on right, requiring left response), reaction times 
increase. This measures the ability to inhibit prepotent spatial responses.

⚙️ ARCHITECTURE
═══════════════════════════════════════════════════════════════════════════════

Both HTML files follow a modular, single-responsibility architecture:

EXPERIMENTER.HTML MODULES:
───────────────────────────────────────────────────────────────────────────────
  Config    → Safe localStorage wrapper with quota handling & JSON guards
  UI        → Toast notifications, form data getters/setters
  Theme     → CSS variable token system (--purple, --yellow, etc.)
  
SUBJECT.HTML MODULES:
───────────────────────────────────────────────────────────────────────────────
  Config    → Load configuration from localStorage with defaults
  UI        → Component renderers (rule tiles, progress, feedback, butterflies)
  Theme     → Apply color tokens from config to CSS variables
  Task      → State machine (idle → showing → responding → isi → finish)
  Export    → CSV builder with proper headers

STATE MACHINE FLOW (Task Module):
───────────────────────────────────────────────────────────────────────────────
  idle ────────→ showing ────────→ responding ────────→ isi ────────→ next
    ↑              ↓                    ↓                  ↓              ↓
    │          display stimuli     capture response    blank period   increment
    │          start RT timer      validate min RT     hide stimuli   trial count
    │                              log data                            
    └──────────────────────────────────────────────────────────────────┘

🎨 CUSTOMIZATION GUIDE
═══════════════════════════════════════════════════════════════════════════════

EASY RESKINNING (Design Tokens):
───────────────────────────────────────────────────────────────────────────────
Edit the :root CSS variables at the top of each HTML file:

  --spacing-xs/sm/md/lg/xl  → Adjust all spacing at once
  --radius-sm/md/lg         → Change button/card roundness
  --font-sm/base/lg/xl      → Scale all typography
  --color-primary           → Main action color
  --color-ink               → Text color
  --color-border            → Border color
  --color-surface           → Background color
  --purple / --yellow       → Stimulus colors (set via config UI)

MODIFYING GUI COMPONENTS:
───────────────────────────────────────────────────────────────────────────────
All UI elements are rendered by pure functions in the UI module:

  renderRuleTile({color, label, keyHint})  → Instruction tiles
  updateProgress(current, total)           → Progress bar
  showFeedback(correct, isPractice)        → Correct/incorrect display
  setButterflyColors(leftColor, rightColor)→ Set stimulus colors

To change appearance, edit these functions. They use CSS classes defined 
in the <style> section.

ADDING NEW TRIAL TYPES:
───────────────────────────────────────────────────────────────────────────────
Edit Task.generateTrials(count):
  • Current: Random color (purple/yellow) × random position (left/right)
  • To add neutral trials: Add 'neutral' to colors array
  • To control congruency ratio: Weight the random selection
  • To add trial types: Extend trial object with new properties

CHANGING FEEDBACK POLICY:
───────────────────────────────────────────────────────────────────────────────
Edit UI.showFeedback() and Task.runTrial():
  • Practice: Currently shows ✓/✗ feedback (configurable in showFeedback)
  • Main: Silent by default (to protect RT measurements)
  • To add accuracy feedback: Remove isPractice check
  • To add RT feedback: Display response.rt in feedback div

📊 DATA LOGGING
═══════════════════════════════════════════════════════════════════════════════

CSV FORMAT:
───────────────────────────────────────────────────────────────────────────────
participant,phase,trial,targetColor,targetSideOnScreen,correctResponse,
responseSide,responseKey,rt_ms,correct

EXAMPLE ROW:
───────────────────────────────────────────────────────────────────────────────
P001,practice,1,purple,left,left,left,key:F,523,true

FIELDS EXPLAINED:
───────────────────────────────────────────────────────────────────────────────
  participant         → ID from experimenter config
  phase               → 'practice' or 'main'
  trial               → Trial number within phase (1-indexed)
  targetColor         → 'purple' or 'yellow'
  targetSideOnScreen  → Where colored butterfly appeared ('left' or 'right')
  correctResponse     → What side should be selected ('left' or 'right')
  responseSide        → Participant's response ('left' or 'right')
  responseKey         → Input method ('key:F', 'key:J', or 'mouse')
  rt_ms               → Reaction time in milliseconds (rounded)
  correct             → Boolean (true/false)

DATA ANALYSIS TIPS:
───────────────────────────────────────────────────────────────────────────────
  • CONGRUENT trials: targetSideOnScreen === correctResponse
  • INCONGRUENT trials: targetSideOnScreen !== correctResponse
  • Simon effect = mean RT(incongruent) - mean RT(congruent)
  • Filter out errors: correct === true
  • Filter outliers: rt_ms > 200 and rt_ms < 2000 (example)

🧠 COGNITIVE DESIGN PRINCIPLES
═══════════════════════════════════════════════════════════════════════════════

CLARITY & COGNITIVE LOAD:
───────────────────────────────────────────────────────────────────────────────
  ✓ One concept per screen (Instructions → Task)
  ✓ Short sentences in instructions
  ✓ Visual rule tiles (color-coded, arrows, key hints)
  ✓ Sticky header maintains context (title, participant ID, status)

AFFORDANCE & HIERARCHY:
───────────────────────────────────────────────────────────────────────────────
  ✓ Clear CTAs with action-oriented labels ("Run Practice", "Download CSV")
  ✓ Visual feedback hierarchy (fixation → stimulus → feedback → ISI)
  ✓ Prominent key hints in <kbd> style
  ✓ Progress bar shows completion status

FEEDBACK POLICY:
───────────────────────────────────────────────────────────────────────────────
  ✓ Practice: Immediate correctness feedback (learning phase)
  ✓ Main: Silent trials (protects RT from contamination)
  ✓ ARIA live regions announce feedback for screen readers

ACCESSIBILITY:
───────────────────────────────────────────────────────────────────────────────
  ✓ Keyboard-only operation (no mouse required)
  ✓ Focus indicators (3px outlines on interactive elements)
  ✓ High contrast defaults (4.5:1 minimum for text)
  ✓ ARIA roles and live regions for screen reader support
  ✓ Large default font sizes and touch targets

ERROR PREVENTION:
───────────────────────────────────────────────────────────────────────────────
  ✓ Configuration validation (participant ID required, unique keys)
  ✓ Minimum RT threshold prevents accidental presses
  ✓ Disabled states prevent duplicate runs
  ✓ Try/catch blocks around localStorage with quota handling

⚡ PERFORMANCE & TIMING
═══════════════════════════════════════════════════════════════════════════════

RT MEASUREMENT:
───────────────────────────────────────────────────────────────────────────────
  • Uses performance.now() for microsecond precision
  • Starts when stimuli appear, stops at valid response
  • Minimum RT threshold (default 120ms) filters anticipatory responses
  • Logs rounded milliseconds for analysis

ISI (INTER-STIMULUS INTERVAL):
───────────────────────────────────────────────────────────────────────────────
  • Configurable delay between trials (default 400ms)
  • Shows fixation cross during ISI
  • Prevents trial overlap and reduces stimulus fatigue

TRIAL SEQUENCE TIMING:
───────────────────────────────────────────────────────────────────────────────
  Fixation (ISI) → Stimulus → Response → Feedback* → ISI → Next trial
  *Only in practice phase

🔧 TROUBLESHOOTING
═══════════════════════════════════════════════════════════════════════════════

ISSUE: Configuration not saving
FIX: Check browser localStorage settings, ensure not in private/incognito mode

ISSUE: Subject.html shows default config
FIX: Save configuration in experimenter.html first, ensure same browser

ISSUE: Keys not responding
FIX: Click on arena area to ensure window has focus, check key configuration

ISSUE: CSV download not working
FIX: Check browser download settings, ensure popup blocker is disabled

ISSUE: Demo image not appearing
FIX: Enable "Show Demo Image" toggle and upload image in experimenter.html

ISSUE: Colors look wrong
FIX: Verify hex colors in experimenter config, check browser color support

💾 STORAGE DETAILS
═══════════════════════════════════════════════════════════════════════════════

STORAGE KEY: ButterflySimonV2Config
LOCATION: Browser localStorage (persistent across sessions)
DATA SIZE: ~2-5KB depending on demo image

SECURITY NOTES:
───────────────────────────────────────────────────────────────────────────────
  • localStorage is origin-specific (separate per domain)
  • Data stored in plain text (do not store sensitive information)
  • Demo images stored as base64 (increases storage size)
  • Clear storage button removes all configuration data

🎯 EXTENDING THE SYSTEM
═══════════════════════════════════════════════════════════════════════════════

TO ADD A NEW PARAMETER:
───────────────────────────────────────────────────────────────────────────────
1. Add form field in experimenter.html
2. Add to UI.getFormData() and UI.setFormData()
3. Add to Config.getDefaults() in subject.html
4. Use parameter in Task module logic

TO ADD A NEW INSTRUCTION SCREEN:
───────────────────────────────────────────────────────────────────────────────
1. Create new div with screen content in subject.html
2. Add "hidden" class by default
3. Add navigation buttons to show/hide screens
4. Update continue button to show your new screen

TO CHANGE STIMULUS APPEARANCE:
───────────────────────────────────────────────────────────────────────────────
1. Edit SVG butterfly path data in subject.html <svg> elements
2. Adjust viewBox and size in .butterfly CSS class
3. Modify colors via UI.setButterflyColors() or CSS variables
4. Add animations via CSS transitions/keyframes

TO ADD MORE TRIAL DATA:
───────────────────────────────────────────────────────────────────────────────
1. Extend trial object in Task.generateTrials()
2. Log additional fields in Task.runTrial() trialData.push()
3. Update CSV header in Export.buildCSV()
4. Add fields to CSV row mapping

📚 CODE QUALITY STANDARDS
═══════════════════════════════════════════════════════════════════════════════

✓ Vanilla JavaScript (ES6+) only – no frameworks or build tools
✓ Single-responsibility modules with clear separation of concerns
✓ Pure functions for components (input → output, no side effects)
✓ Inline comments explain WHY, not WHAT
✓ Defensive programming (try/catch, validation, error handling)
✓ Semantic HTML with proper heading hierarchy
✓ CSS follows BEM-like naming for clarity
✓ Accessibility-first design (ARIA, keyboard, focus management)

🔬 VALIDATION CHECKLIST
═══════════════════════════════════════════════════════════════════════════════

Before running your experiment, verify:

□ Experimenter.html saves/loads/clears config successfully
□ Subject.html loads config and displays custom instructions
□ Both screens render correctly (instructions → task)
□ Keyboard responses work with configured keys
□ Mouse clicks work (if enabled)
□ Practice block shows feedback
□ Main block is silent (no feedback)
□ Progress bar updates correctly
□ CSV downloads with all expected data
□ Fullscreen toggle works
□ No console errors in browser DevTools
□ Stimulus colors match experimenter config
□ Instruction words are colored correctly
□ Demo image appears (if configured)
□ Disclaimer appears (if configured)

🤝 SUPPORT & CREDITS
═══════════════════════════════════════════════════════════════════════════════

This implementation follows cognitive psychology best practices for:
  • Simon task paradigms (spatial compatibility effects)
  • Reaction time measurement (high-precision timing)
  • Practice-to-test transitions (feedback scaffolding)
  • Participant UX (clear instructions, progress feedback)
  • Data integrity (comprehensive logging, validated responses)

Built with principles from:
  • Simon & Rudell (1967) - Original Simon effect paper
  • Hommel (2011) - Cognitive control mechanisms
  • Wickens et al. (2013) - Human factors engineering

For issues or questions:
  • Check browser console for error messages (F12 → Console tab)
  • Verify localStorage is enabled (check browser settings)
  • Test in latest Chrome/Firefox/Edge for best compatibility

═══════════════════════════════════════════════════════════════════════════════
                              END OF DOCUMENTATION
═══════════════════════════════════════════════════════════════════════════════
