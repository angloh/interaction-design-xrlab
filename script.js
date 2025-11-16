(function () {
  const RESPONSE_TIMEOUT_MS = 2500;
  const FEEDBACK_MS = 700;

  const screens = {
    instructions: document.getElementById('screen-instructions'),
    trials: document.getElementById('screen-trials'),
    thanks: document.getElementById('screen-thanks'),
  };

  const leftCue = document.getElementById('leftCue');
  const rightCue = document.getElementById('rightCue');
  const feedbackText = document.getElementById('feedbackText');
  const phaseLabel = document.getElementById('phaseLabel');
  const trialCounter = document.getElementById('trialCounter');
  const bottomHint = document.getElementById('bottomHint');
  const phaseBigLabel = document.getElementById('phaseBigLabel');

  const expToggle = document.getElementById('expToggle');
  const expPanel = document.getElementById('expPanel');
  const expCurrentId = document.getElementById('expCurrentId');
  const expTotalCorrect = document.getElementById('expTotalCorrect');
  const expAvgRT = document.getElementById('expAvgRT');
  const expTrialRows = document.getElementById('expTrialRows');
  const expParticipantsTable = document.getElementById('expParticipantsTable');

  const COLOR_CLASSES = ['cue-circle--red', 'cue-circle--green'];
  const STATE_CLASSES = ['cue-circle--active'];
  const FEEDBACK_CLASSES = ['feedback-text--correct', 'feedback-text--incorrect'];

  let phase = 'instructions'; // 'instructions' | 'practice' | 'main' | 'done'
  let trialState = 'waitingStart'; // 'waitingStart' | 'awaiting' | 'feedback'
  let totalTrials = 0;
  let trialIndex = 0;
  let currentTrial = null;

  let trialStartTime = null;
  let responseTimeoutId = null;

  // Experimenter data
  let participants = [];
  let currentParticipant = null;

  function loadParticipants() {
    try {
      const raw = window.localStorage.getItem('antisaccadeParticipants');
      if (raw) {
        participants = JSON.parse(raw);
      } else {
        participants = [];
      }
    } catch (e) {
      participants = [];
    }
  }

  function saveParticipants() {
    try {
      window.localStorage.setItem(
        'antisaccadeParticipants',
        JSON.stringify(participants)
      );
    } catch (e) {
      // ignore
    }
  }

  function showScreen(name) {
    Object.values(screens).forEach((el) => el.classList.remove('is-active'));
    screens[name].classList.add('is-active');
  }

  function clearCues() {
    [leftCue, rightCue].forEach((c) => {
      c.classList.remove(...COLOR_CLASSES, ...STATE_CLASSES);
      c.classList.add('cue-circle--placeholder');
    });
  }

  function setCue(side, color) {
    clearCues();
    const target = side === 'left' ? leftCue : rightCue;
    const other = side === 'left' ? rightCue : leftCue;

    target.classList.remove('cue-circle--placeholder');
    other.classList.add('cue-circle--placeholder');

    const colorClass = color === 'red' ? 'cue-circle--red' : 'cue-circle--green';
    target.classList.add(colorClass, 'cue-circle--active');
  }

  function getCorrectKey(trial) {
    const sameSideKey = trial.side === 'left' ? 'ArrowLeft' : 'ArrowRight';
    const oppositeKey = trial.side === 'left' ? 'ArrowRight' : 'ArrowLeft';
    return trial.color === 'green' ? sameSideKey : oppositeKey;
  }

  function updateTrialHeader() {
    if (phase === 'practice') {
      trialCounter.textContent = `${trialIndex}/${totalTrials}`;
      phaseLabel.textContent = 'Practice';
      phaseBigLabel.textContent = 'Practice';
    } else if (phase === 'main') {
      trialCounter.textContent = `${trialIndex}/${totalTrials}`;
      phaseLabel.textContent = 'Task';
      phaseBigLabel.textContent = '';
    }
  }

  function startPhase(newPhase) {
    phase = newPhase;
    if (phase === 'practice') {
      totalTrials = 3;
    } else if (phase === 'main') {
      totalTrials = 10;
      // create a new participant
      const newId = participants.length + 1;
      currentParticipant = {
        id: newId,
        totalCorrect: 0,
        sumRT: 0,
        trials: [],
      };
      participants.push(currentParticipant);
      saveParticipants();
      renderParticipantsSummary();
      updateExperimenterCurrent();
    }

    trialIndex = 0;
    trialState = 'waitingStart';
    clearCues();
    feedbackText.textContent = '';
    feedbackText.classList.remove(...FEEDBACK_CLASSES);
    bottomHint.textContent = 'Press space to begin.';
    bottomHint.style.visibility = 'visible';
    updateTrialHeader();
    showScreen('trials');
  }

  function startNextTrial() {
    if (trialIndex >= totalTrials) {
      if (phase === 'practice') {
        // move to main phase intro
        startPhase('main');
      } else if (phase === 'main') {
        phase = 'done';
        clearCues();
        feedbackText.textContent = '';
        bottomHint.style.visibility = 'hidden';
        updateExperimenterCurrent();
        saveParticipants();
        showScreen('thanks');
      }
      return;
    }

    trialIndex += 1;
    currentTrial = {
      side: Math.random() < 0.5 ? 'left' : 'right',
      color: Math.random() < 0.5 ? 'red' : 'green',
    };

    clearTimeout(responseTimeoutId);
    responseTimeoutId = null;

    clearCues();
    feedbackText.textContent = '';
    feedbackText.classList.remove(...FEEDBACK_CLASSES);
    bottomHint.style.visibility = 'visible';
    bottomHint.textContent = 'Press ← or → based on the cue.';

    setCue(currentTrial.side, currentTrial.color);
    trialStartTime = performance.now();
    trialState = 'awaiting';
    updateTrialHeader();

    responseTimeoutId = window.setTimeout(() => {
      if (trialState === 'awaiting') {
        finishTrial(false, RESPONSE_TIMEOUT_MS, true);
      }
    }, RESPONSE_TIMEOUT_MS);
  }

  function finishTrial(isCorrect, rt, fromTimeout) {
    trialState = 'feedback';
    clearTimeout(responseTimeoutId);
    responseTimeoutId = null;
    clearCues();

    feedbackText.textContent = isCorrect ? 'Correct.' : 'Incorrect.';
    feedbackText.classList.add(
      isCorrect ? 'feedback-text--correct' : 'feedback-text--incorrect'
    );
    bottomHint.style.visibility = 'hidden';

    if (phase === 'main' && currentParticipant) {
      const rtRounded = Math.round(rt);
      const trialData = {
        index: trialIndex,
        color: currentTrial.color,
        side: currentTrial.side,
        correct: isCorrect,
        rt: rtRounded,
        timeout: !!fromTimeout,
      };
      currentParticipant.trials.push(trialData);
      if (isCorrect) {
        currentParticipant.totalCorrect += 1;
      }
      currentParticipant.sumRT += rtRounded;
      currentParticipant.avgRT =
        currentParticipant.sumRT / currentParticipant.trials.length;

      saveParticipants();
      updateExperimenterCurrent();
      renderParticipantsSummary();
    }

    window.setTimeout(() => {
      // automatically move on
      if (phase === 'practice' || phase === 'main') {
        startNextTrial();
      }
    }, FEEDBACK_MS);
  }

  function handleKeyDown(event) {
    if (phase === 'instructions') {
      if (event.key === ' ') {
        event.preventDefault();
        startPhase('practice');
      }
      return;
    }

    if (phase === 'done') {
      return;
    }

    // trial phases
    if (trialState === 'waitingStart' && event.key === ' ') {
      event.preventDefault();
      startNextTrial();
      return;
    }

    if (trialState !== 'awaiting') return;

    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;

    const rt = performance.now() - trialStartTime;
    const correctKey = getCorrectKey(currentTrial);
    const isCorrect = event.key === correctKey;
    finishTrial(isCorrect, rt, false);
  }

  // Experimenter view helpers

  function updateExperimenterCurrent() {
    if (!currentParticipant) {
      expCurrentId.textContent = '–';
      expTotalCorrect.textContent = '–';
      expAvgRT.textContent = '–';
      expTrialRows.innerHTML = '';
      return;
    }

    expCurrentId.textContent = String(currentParticipant.id);
    expTotalCorrect.textContent = `${currentParticipant.totalCorrect}/10`;
    expAvgRT.textContent =
      currentParticipant.trials.length === 0
        ? '–'
        : Math.round(currentParticipant.avgRT).toString();

    expTrialRows.innerHTML = '';
    currentParticipant.trials.forEach((t) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${t.index}</td>
        <td>${t.color}</td>
        <td>${t.side}</td>
        <td>${t.correct ? '✓' : '✗'}</td>
        <td>${t.rt}</td>
      `;
      expTrialRows.appendChild(tr);
    });
  }

  function renderParticipantsSummary() {
    expParticipantsTable.innerHTML = '';
    participants.forEach((p) => {
      const avgRT =
        p.trials && p.trials.length
          ? Math.round(
              p.trials.reduce((sum, t) => sum + (t.rt || 0), 0) / p.trials.length
            )
          : '–';
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${p.id}</td>
        <td>${p.totalCorrect || 0}/10</td>
        <td>${avgRT}</td>
      `;
      expParticipantsTable.appendChild(tr);
    });
  }

  expToggle.addEventListener('click', () => {
    expPanel.classList.toggle('is-open');
  });

  document.addEventListener('keydown', handleKeyDown);

  // Initial state
  loadParticipants();
  renderParticipantsSummary();
  showScreen('instructions');
})();