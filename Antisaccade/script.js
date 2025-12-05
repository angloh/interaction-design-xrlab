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
  const expClose = document.getElementById('expClose');
  const expParticipantsDetail = document.getElementById('expParticipantsDetail');

  // ---------------------------
  // URL mode + experimenter lock
  // ---------------------------
  const params = new URLSearchParams(window.location.search);
  const mode = params.get('mode');            // ?mode=config
  const isExperimenterMode = mode === 'config';

  // simple password lock – not real security, but enough so subjects
  // can’t casually open the config screen
  let experimenterUnlocked = false;

  if (isExperimenterMode) {
    const EXP_PASSWORD = 'antisaccade';  // <<< change if you want
    const entered = window.prompt('Experimenter password:');

    if (entered === EXP_PASSWORD) {
      experimenterUnlocked = true;
    } else {
      window.alert('Incorrect password. Showing participant view instead.');
    }
  }

  // If not experimenter mode OR wrong password, hide the toggle button
  if (!isExperimenterMode || !experimenterUnlocked) {
    expToggle.style.display = 'none';
  }
  // ---------------------------

  const COLOR_CLASSES = ['cue-circle--red', 'cue-circle--green'];
  const STATE_CLASSES = ['cue-circle--active'];
  const FEEDBACK_CLASSES = ['feedback-text--correct', 'feedback-text--incorrect'];

  let phase = 'instructions'; // 'instructions' | 'practice' | 'main' | 'done'
  let trialState = 'idle'; // 'idle' | 'awaiting' | 'feedback' | 'afterPractice'
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
    trialCounter.textContent = `${trialIndex}/${totalTrials}`;
    if (phase === 'practice') {
      phaseLabel.textContent = 'Practice';
      phaseBigLabel.textContent = 'Practice';
    } else if (phase === 'main') {
      phaseLabel.textContent = 'Task';
      phaseBigLabel.textContent = '';
    }
  }

  function startPhase(newPhase) {
    phase = newPhase;
    if (phase === 'practice') {
      totalTrials = 3;
      trialIndex = 0;
      trialState = 'idle';
      clearCues();
      feedbackText.textContent = '';
      feedbackText.classList.remove(...FEEDBACK_CLASSES);
      bottomHint.textContent = '';
      bottomHint.style.visibility = 'hidden';
      showScreen('trials');
      startNextTrial(); // immediately show first cue
    } else if (phase === 'main') {
      totalTrials = 10;
      trialIndex = 0;
      trialState = 'idle';
      clearCues();
      feedbackText.textContent = '';
      feedbackText.classList.remove(...FEEDBACK_CLASSES);
      bottomHint.textContent = '';
      bottomHint.style.visibility = 'hidden';
      phaseBigLabel.textContent = '';
      // create a new participant
      const newId = participants.length + 1;
      currentParticipant = {
        id: newId,
        trials: [],
      };
      participants.push(currentParticipant);
      saveParticipants();
      renderParticipantsDetail();
      showScreen('trials');
      startNextTrial(); // immediately show first main cue
    }
  }

  function startNextTrial() {
    if (trialIndex >= totalTrials) {
      if (phase === 'practice') {
        // show practice over message
        trialState = 'afterPractice';
        clearTimeout(responseTimeoutId);
        responseTimeoutId = null;
        clearCues();
        feedbackText.classList.remove(...FEEDBACK_CLASSES);
        feedbackText.textContent =
          'Practice Trial is over. Press space to begin.';
        bottomHint.style.visibility = 'hidden';
        phaseBigLabel.textContent = '';
        trialCounter.textContent = '3/3';
        return;
      } else if (phase === 'main') {
        phase = 'done';
        clearCues();
        feedbackText.textContent = '';
        bottomHint.style.visibility = 'hidden';
        saveParticipants();
        renderParticipantsDetail();
        showScreen('thanks');
        return;
      }
    }

    trialIndex += 1;
    currentTrial = {
      index: trialIndex,
      side: Math.random() < 0.5 ? 'left' : 'right',
      color: Math.random() < 0.5 ? 'red' : 'green',
    };

    clearTimeout(responseTimeoutId);
    responseTimeoutId = null;

    clearCues();
    feedbackText.textContent = '';
    feedbackText.classList.remove(...FEEDBACK_CLASSES);
    bottomHint.style.visibility = 'visible';
    bottomHint.innerHTML =
      'Press <span class="key-hint key-hint--arrow">←</span> or ' +
      '<span class="key-hint key-hint--arrow">→</span> based on the cue.';
    updateTrialHeader();

    setCue(currentTrial.side, currentTrial.color);
    trialStartTime = performance.now();
    trialState = 'awaiting';

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
        index: currentTrial.index,
        color: currentTrial.color,
        side: currentTrial.side,
        correct: isCorrect,
        rt: rtRounded,
        timeout: !!fromTimeout,
      };
      currentParticipant.trials.push(trialData);
      saveParticipants();
      renderParticipantsDetail();
    }

    window.setTimeout(() => {
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

    // After-practice message
    if (phase === 'practice' && trialState === 'afterPractice') {
      if (event.key === ' ') {
        event.preventDefault();
        startPhase('main');
      }
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

  function renderParticipantsDetail() {
    expParticipantsDetail.innerHTML = '';
    if (!participants || participants.length === 0) {
      const p = document.createElement('p');
      p.textContent = 'No participants yet.';
      expParticipantsDetail.appendChild(p);
      return;
    }

    participants.forEach((participant) => {
      const trials = participant.trials || [];
      const totalCorrect = trials.filter((t) => t.correct).length;
      const avgRT =
        trials.length > 0
          ? Math.round(
              trials.reduce((sum, t) => sum + (t.rt || 0), 0) / trials.length
            )
          : null;

      const block = document.createElement('div');
      block.className = 'exp-participant-block';

      const header = document.createElement('div');
      header.className = 'exp-participant-header';
      header.textContent = `Participant ${participant.id}`;
      block.appendChild(header);

      const sub = document.createElement('div');
      sub.className = 'exp-participant-subheader';
      const avgText = avgRT === null ? '–' : `${avgRT} ms`;
      sub.textContent = `${totalCorrect}/10 correct • Avg RT: ${avgText}`;
      block.appendChild(sub);

      const table = document.createElement('table');
      table.innerHTML = `
        <thead>
          <tr>
            <th>Trial</th>
            <th>Color</th>
            <th>Side</th>
            <th>Correct</th>
            <th>RT (ms)</th>
          </tr>
        </thead>
        <tbody></tbody>
      `;
      const tbody = table.querySelector('tbody');

      trials.forEach((t) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${t.index}</td>
          <td>${t.color}</td>
          <td>${t.side}</td>
          <td>${t.correct ? '✓' : '✗'}</td>
          <td>${t.rt}</td>
        `;
        tbody.appendChild(tr);
      });

      block.appendChild(table);
      expParticipantsDetail.appendChild(block);
    });
  }

  expToggle.addEventListener('click', () => {
    expPanel.classList.add('is-open');
    renderParticipantsDetail();
  });

  expClose.addEventListener('click', () => {
    expPanel.classList.remove('is-open');
  });

  document.addEventListener('keydown', handleKeyDown);

  // Initial state
  loadParticipants();
  renderParticipantsDetail();
  showScreen('instructions');

  // If URL is ?mode=config and password was correct, open experimenter view
  if (isExperimenterMode && experimenterUnlocked) {
    expPanel.classList.add('is-open');
  }
})();
