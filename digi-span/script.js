// Simple digit-span style participant + experimenter view
// No external dependencies

const STATE = {
  phase: 'instructions', // instructions | practice | task | done
  practiceTrialsTotal: 1,
  taskTrialsTotal: 10,
  currentTrialIndex: 0, // 0-based within current phase
  currentSpan: [],
  showingDigits: false,
  totalCorrect: 0, // main-task correct
  totalTrialsRun: 0, // includes practice + task
  participantId: null,
  trials: [], // log of all trials
};

function generateParticipantId() {
  const prefix = 'P';
  const num = Math.floor(Math.random() * 9000) + 1000; // 1000-9999
  return `${prefix}${num}`;
}

STATE.participantId = generateParticipantId();

// Predefined sequences (you can replace with random generation)
const PRACTICE_SEQUENCES = [
  [3, 1, 7], // 3 digits
];

const TASK_SEQUENCES = [
  [4, 9, 2],
  [1, 8, 6],
  [7, 3, 5],
  [9, 0, 4],
  [2, 6, 1],
  [5, 9, 3],
  [8, 4, 7],
  [0, 2, 9],
  [6, 1, 8],
  [3, 7, 0],
];

// DOM references
const screenInstructions = document.getElementById('screenInstructions');
const screenTrial = document.getElementById('screenTrial');
const screenThanks = document.getElementById('screenThanks');

const btnStartPractice = document.getElementById('btnStartPractice');
const phaseLabel = document.getElementById('phaseLabel');
const trialLabel = document.getElementById('trialLabel');
const progressFill = document.getElementById('progressFill');

const trialPhaseLabel = document.getElementById('trialPhaseLabel');
const trialHint = document.getElementById('trialHint');
const digitDisplay = document.getElementById('digitDisplay');

const responseForm = document.getElementById('responseForm');
const responseInput = document.getElementById('responseInput');
const btnSubmit = document.getElementById('btnSubmit');
const feedback = document.getElementById('feedback');

const summaryTrials = document.getElementById('summaryTrials');
const summaryCorrect = document.getElementById('summaryCorrect');

// Experimenter view DOM refs
const experimenterPanel = document.getElementById('experimenterPanel');
const btnToggleExperimenter = document.getElementById('btnToggleExperimenter');
const expParticipantId = document.getElementById('expParticipantId');
const expCompleted = document.getElementById('expCompleted');
const expCorrect = document.getElementById('expCorrect');
const expLogBody = document.getElementById('expLogBody');





// -------------------------------
// URL ?mode=config + password lock
// -------------------------------
const urlParams = new URLSearchParams(window.location.search);
const isExperimenterMode = urlParams.get('mode') === 'config';

let experimenterUnlocked = false;

if (isExperimenterMode) {
  const EXP_PASSWORD = 'digit2024'; // change if needed
  const entered = window.prompt('Experimenter password:');
  if (entered === EXP_PASSWORD) {
    experimenterUnlocked = true;
  } else {
    window.alert('Incorrect password. Showing participant view only.');
  }
}

// If not in config mode or wrong password, hide the experimenter toggle
if (!experimenterUnlocked && btnToggleExperimenter) {
  btnToggleExperimenter.style.display = 'none';
} else if (experimenterUnlocked && experimenterPanel) {
  // Optional: auto-open panel when unlocked
  experimenterPanel.classList.add('experimenter-panel--open');
}


function showScreen(name) {
  // Hide all
  screenInstructions.classList.remove('screen--active');
  screenTrial.classList.remove('screen--active');
  screenThanks.classList.remove('screen--active');

  if (name === 'instructions') {
    screenInstructions.classList.add('screen--active');
  } else if (name === 'trial') {
    screenTrial.classList.add('screen--active');
  } else if (name === 'thanks') {
    screenThanks.classList.add('screen--active');
  }
}

function updateHeaderAndProgress() {
  let labelText = '';
  let trialText = '';

  if (STATE.phase === 'instructions') {
    labelText = 'Instructions';
    trialText = 'Practice · 1 of 1';
    progressFill.style.width = '0%';
  } else if (STATE.phase === 'practice') {
    labelText = 'Practice round';
    trialText = `Practice · ${STATE.currentTrialIndex + 1} of ${STATE.practiceTrialsTotal}`;
    const pct =
      (STATE.currentTrialIndex / (STATE.taskTrialsTotal + STATE.practiceTrialsTotal)) * 100;
    progressFill.style.width = `${pct}%`;
  } else if (STATE.phase === 'task') {
    labelText = 'Main task';
    trialText = `Trial ${STATE.currentTrialIndex + 1} of ${STATE.taskTrialsTotal}`;
    const completed = STATE.practiceTrialsTotal + STATE.currentTrialIndex;
    const pct =
      (completed / (STATE.taskTrialsTotal + STATE.practiceTrialsTotal)) * 100;
    progressFill.style.width = `${pct}%`;
  } else if (STATE.phase === 'done') {
    labelText = 'Completed';
    trialText = 'All trials finished';
    progressFill.style.width = '100%';
  }

  phaseLabel.textContent = labelText;
  trialLabel.textContent = trialText;
}

function setFeedback(message, type = '') {
  feedback.textContent = message;
  feedback.classList.remove('feedback--correct', 'feedback--incorrect');
  if (type === 'correct') {
    feedback.classList.add('feedback--correct');
  } else if (type === 'incorrect') {
    feedback.classList.add('feedback--incorrect');
  }
}

function resetResponse() {
  responseInput.value = '';
  responseInput.disabled = true;
  responseInput.setAttribute('aria-disabled', 'true');
  btnSubmit.disabled = true;
}

// Experimenter view update
function updateExperimenterSummary() {
  if (!expParticipantId) return;

  expParticipantId.textContent = STATE.participantId;

  const completedTaskTrials = STATE.trials.filter((t) => t.phase === 'task').length;
  expCompleted.textContent = `${completedTaskTrials} / ${STATE.taskTrialsTotal}`;
  expCorrect.textContent = `${STATE.totalCorrect} / ${STATE.taskTrialsTotal}`;

  // rebuild log table
  expLogBody.innerHTML = '';
  STATE.trials.forEach((t) => {
    const tr = document.createElement('tr');
    const phaseLabel = t.phase === 'practice' ? 'Practice' : 'Task';
    tr.innerHTML = `
      <td>${phaseLabel}</td>
      <td>${t.trialNumber}</td>
      <td>${t.sequence}</td>
      <td>${t.response}</td>
      <td>${t.correct ? '✓' : '✕'}</td>
    `;
    expLogBody.appendChild(tr);
  });
}

// Show digit sequence one-by-one, then enable response
function runSequence(span) {
  STATE.showingDigits = true;
  resetResponse();
  setFeedback('');

  trialPhaseLabel.textContent = 'Memorize the digits…';
  trialHint.textContent = 'Pay attention to the order.';

  let index = 0;
  digitDisplay.textContent = '+';

  setTimeout(() => {
    const intervalId = setInterval(() => {
      if (index >= span.length) {
        clearInterval(intervalId);
        // Hide digits, show prompt
        digitDisplay.textContent = '• • •';
        trialPhaseLabel.textContent = 'Now type the digits.';
        trialHint.textContent = 'Use your keyboard, then press Enter or click Submit.';
        STATE.showingDigits = false;

        responseInput.disabled = false;
        responseInput.setAttribute('aria-disabled', 'false');
        btnSubmit.disabled = false;
        responseInput.focus();
      } else {
        digitDisplay.textContent = span[index];
        index += 1;
      }
    }, 900);
  }, 800);
}

function startNextTrial() {
  if (STATE.phase === 'practice') {
    if (STATE.currentTrialIndex >= STATE.practiceTrialsTotal) {
      // Move to main task
      STATE.phase = 'task';
      STATE.currentTrialIndex = 0;
    }
  } else if (STATE.phase === 'task') {
    if (STATE.currentTrialIndex >= STATE.taskTrialsTotal) {
      // Done
      finishTask();
      return;
    }
  }

  if (STATE.phase === 'task' || STATE.phase === 'practice') {
    updateHeaderAndProgress();
    showScreen('trial');
    setFeedback('');
    trialPhaseLabel.textContent = 'Get ready…';
    trialHint.textContent = 'Focus on the center of the screen.';
    digitDisplay.textContent = '+';

    // Determine current span
    if (STATE.phase === 'practice') {
      STATE.currentSpan =
        PRACTICE_SEQUENCES[STATE.currentTrialIndex % PRACTICE_SEQUENCES.length];
    } else {
      STATE.currentSpan =
        TASK_SEQUENCES[STATE.currentTrialIndex % TASK_SEQUENCES.length];
    }

    // Start showing digits shortly
    setTimeout(() => {
      runSequence(STATE.currentSpan);
    }, 700);
  }
}

function finishTask() {
  STATE.phase = 'done';
  updateHeaderAndProgress();
  showScreen('thanks');

  summaryTrials.textContent = String(STATE.totalTrialsRun);
  summaryCorrect.textContent = String(STATE.totalCorrect);

  updateExperimenterSummary();
}

// Event handlers

btnStartPractice.addEventListener('click', (e) => {
  e.preventDefault();
  if (STATE.phase !== 'instructions') return;

  STATE.phase = 'practice';
  STATE.currentTrialIndex = 0;
  updateHeaderAndProgress();
  startNextTrial();
});

// Keyboard shortcut: Space to start practice from instructions
window.addEventListener('keydown', (e) => {
  if (STATE.phase === 'instructions' && e.code === 'Space') {
    e.preventDefault();
    btnStartPractice.click();
  }
});

responseForm.addEventListener('submit', (e) => {
  e.preventDefault();
  if (STATE.showingDigits) return;

  const value = responseInput.value.trim();
  if (!value) {
    setFeedback('Please type the digits you remember.', 'incorrect');
    return;
  }

  const correctString = STATE.currentSpan.join('');
  const isCorrect = value === correctString;

  STATE.totalTrialsRun += 1;
  if (STATE.phase === 'task' && isCorrect) {
    STATE.totalCorrect += 1;
  }

  // Log trial for experimenter
  const trialNumber = STATE.currentTrialIndex + 1;
  STATE.trials.push({
    phase: STATE.phase,
    trialNumber,
    sequence: correctString,
    response: value,
    correct: isCorrect,
  });

  if (STATE.phase === 'practice') {
    if (isCorrect) {
      setFeedback(`Correct! The digits were ${correctString}.`, 'correct');
    } else {
      setFeedback(`For practice, the correct order was ${correctString}.`, 'incorrect');
    }
  } else if (STATE.phase === 'task') {
    if (isCorrect) {
      setFeedback('Correct!', 'correct');
    } else {
      setFeedback('Incorrect.', 'incorrect');
    }
  }

  responseInput.disabled = true;
  responseInput.setAttribute('aria-disabled', 'true');
  btnSubmit.disabled = true;

  updateExperimenterSummary();

  // Move to next trial after short pause
  setTimeout(() => {
    STATE.currentTrialIndex += 1;
    startNextTrial();
  }, 1300);
});

// Experimenter toggle
if (btnToggleExperimenter && experimenterPanel) {
  btnToggleExperimenter.addEventListener('click', () => {
    experimenterPanel.classList.toggle('experimenter-panel--open');
  });
}

// Initialize
updateHeaderAndProgress();
showScreen('instructions');
setFeedback('');
updateExperimenterSummary();
