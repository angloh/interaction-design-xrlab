(function () {
  // ================================
  // CONFIG CONSTANTS
  // ================================
  const N_BLOCKS = 9;
  const PRACTICE_TRIALS = 1;
  const EXPERIMENT_TRIALS = 10;
  const SEQUENCE_LENGTH = 4;

  // ================================
  // EXPERIMENTER MODE (?mode=config)
  // ================================
  const urlParams = new URLSearchParams(window.location.search);
  const isExperimenterMode = urlParams.get("mode") === "config";

  let experimenterUnlocked = false;

  if (isExperimenterMode) {
    const EXP_PASSWORD = "corsi2024"; // change if you want
    const entered = window.prompt("Experimenter password:");
    if (entered === EXP_PASSWORD) {
      experimenterUnlocked = true;
    } else {
      window.alert("Incorrect password. Showing participant view only.");
    }
  }

  // Experimenter DOM (if present in HTML)
  const expToggle = document.getElementById("expToggle");
  const expPanel = document.getElementById("expPanel");
  const expClose = document.getElementById("expClose");

  const expParticipantId = document.getElementById("expParticipantId");
  const expPracticeDone = document.getElementById("expPracticeDone");
  const expExperimentDone = document.getElementById("expExperimentDone");
  const expCorrect = document.getElementById("expCorrect");
  const expLogBody = document.getElementById("expLogBody");

  // Participant ID helper
  function makeParticipantId() {
    return "P" + String(Math.floor(Math.random() * 9000) + 1000);
  }
  const PARTICIPANT_ID = makeParticipantId();

  // Apply lock: hide experimenter UI unless in config mode and unlocked
  if (!experimenterUnlocked) {
    if (expToggle) expToggle.style.display = "none";
    if (expPanel) expPanel.classList.remove("is-open");
  } else {
    if (expToggle) expToggle.style.display = "inline-flex";
    if (expPanel) expPanel.classList.add("is-open"); // auto-open when unlocked
    if (expParticipantId) expParticipantId.textContent = PARTICIPANT_ID;
  }

  // Experimenter panel open/close
  if (expToggle && expPanel) {
    expToggle.addEventListener("click", () => {
      expPanel.classList.add("is-open");
    });
  }

  if (expClose && expPanel) {
    expClose.addEventListener("click", () => {
      expPanel.classList.remove("is-open");
    });
  }

  // ================================
  // EXPERIMENTER LOGGING
  // ================================
  const EXP_LOG = []; // each entry: { phase, trialNum, seq, resp, correct }

  function updateExperimenterSummary() {
    if (!experimenterUnlocked) return;
    if (!expPracticeDone || !expExperimentDone || !expCorrect || !expLogBody) return;

    const practiceTrials = EXP_LOG.filter((t) => t.phase === "practice").length;
    const experimentTrials = EXP_LOG.filter((t) => t.phase === "experiment").length;
    const correctExperimentTrials = EXP_LOG.filter(
      (t) => t.phase === "experiment" && t.correct
    ).length;

    expPracticeDone.textContent = `${practiceTrials} / ${PRACTICE_TRIALS}`;
    expExperimentDone.textContent = `${experimentTrials} / ${EXPERIMENT_TRIALS}`;
    expCorrect.textContent = `${correctExperimentTrials} / ${EXPERIMENT_TRIALS}`;

    // rebuild table
    expLogBody.innerHTML = "";
    EXP_LOG.forEach((t) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${t.phase}</td>
        <td>${t.trialNum}</td>
        <td>${t.seq.join(", ")}</td>
        <td>${t.resp.join(", ")}</td>
        <td>${t.correct ? "✓" : "✕"}</td>
      `;
      expLogBody.appendChild(row);
    });
  }

  function logTrial(phase, trialNum, seq, resp, correct) {
    if (!experimenterUnlocked) return;
    // store copies
    EXP_LOG.push({
      phase,
      trialNum,
      seq: seq.slice(),
      resp: resp.slice(),
      correct: !!correct,
    });
    updateExperimenterSummary();
  }

  // ================================
  // PARTICIPANT VIEW DOM
  // ================================
  const instructionsScreen = document.getElementById("instructions-screen");
  const taskScreen = document.getElementById("task-screen");

  const startPracticeBtn = document.getElementById("start-practice-btn");
  const playSequenceBtn = document.getElementById("play-sequence-btn");
  const clearResponseBtn = document.getElementById("clear-response-btn");

  const stageLabelEl = document.getElementById("stage-label");
  const taskTitleEl = document.getElementById("task-title");
  const trialLabelEl = document.getElementById("trial-label");
  const feedbackEl = document.getElementById("feedback-text");
  const gridEl = document.getElementById("corsi-grid");
  const taskContentEl = document.getElementById("task-content");
  const thankyouContentEl = document.getElementById("thankyou-content");

  const stepPills = document.querySelectorAll(".step-pill");

  // ================================
  // STATE
  // ================================
  let blocks = [];
  let mode = "instructions"; // "instructions" | "practice" | "experiment" | "done"
  let practiceTrialIndex = 0;
  let experimentTrialIndex = 0;
  let isShowingSequence = false;
  let isAwaitingResponse = false;
  let currentSequence = [];
  let currentResponse = [];

  // ================================
  // HELPERS
  // ================================

  function createGrid() {
    const frag = document.createDocumentFragment();
    for (let i = 0; i < N_BLOCKS; i++) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "corsi-block disabled";
      btn.dataset.index = String(i);
      btn.setAttribute("aria-label", "Block " + (i + 1));

      const label = document.createElement("span");
      label.className = "label";
      label.textContent = String(i + 1);
      btn.appendChild(label);

      btn.addEventListener("click", () => onBlockClick(i));
      frag.appendChild(btn);
      blocks.push(btn);
    }
    gridEl.appendChild(frag);
  }

  function setBlocksDisabled(disabled) {
    blocks.forEach((b) => {
      if (disabled) {
        b.classList.add("disabled");
        b.setAttribute("tabindex", "-1");
      } else {
        b.classList.remove("disabled");
        b.removeAttribute("tabindex");
      }
    });
  }

  function setStagePills(currentStage) {
    // expects each .step-pill to have data-stage="instructions|practice|experiment|done"
    stepPills.forEach((pill) => {
      const stage = pill.getAttribute("data-stage");
      if (stage === currentStage) {
        pill.classList.add("active");
      } else {
        pill.classList.remove("active");
      }
    });
  }

  function feedback(message, type) {
    if (!feedbackEl) return;
    feedbackEl.textContent = message || "";
    feedbackEl.classList.remove("ok", "error");
    if (type === "ok") feedbackEl.classList.add("ok");
    if (type === "error") feedbackEl.classList.add("error");
  }

  function setMode(newMode) {
    mode = newMode;
    isShowingSequence = false;
    isAwaitingResponse = false;
    currentResponse = [];
    feedback("");
    clearResponseBtn.disabled = true;
    setBlocksDisabled(true);

    if (mode === "instructions") {
      setStagePills("instructions");
      instructionsScreen.hidden = false;
      taskScreen.hidden = true;
    } else if (mode === "practice") {
      setStagePills("practice");
      instructionsScreen.hidden = false;
      taskScreen.hidden = false; // we can show both if design wants
      instructionsScreen.hidden = true;
      taskScreen.hidden = false;

      stageLabelEl.textContent = "Practice";
      taskTitleEl.textContent =
        "Practice round: watch the sequence, then tap the same blocks.";
      trialLabelEl.textContent = "Practice trial 1 of 1";
      playSequenceBtn.disabled = false;
      taskContentEl.hidden = false;
      thankyouContentEl.hidden = true;
    } else if (mode === "experiment") {
      setStagePills("experiment");
      instructionsScreen.hidden = true;
      taskScreen.hidden = false;

      stageLabelEl.textContent = "Experiment";
      taskTitleEl.textContent =
        "Experiment trials: do your best to remember the sequences.";
      updateExperimentTrialLabel();
      playSequenceBtn.disabled = false;
      taskContentEl.hidden = false;
      thankyouContentEl.hidden = true;
    } else if (mode === "done") {
      setStagePills("done");
      instructionsScreen.hidden = true;
      taskScreen.hidden = false;

      stageLabelEl.textContent = "Finished";
      taskTitleEl.textContent = "You have completed all trials.";
      trialLabelEl.textContent = "";
      playSequenceBtn.disabled = true;
      clearResponseBtn.disabled = true;
      setBlocksDisabled(true);
      taskContentEl.hidden = true;
      thankyouContentEl.hidden = false;
    }
  }

  function updateExperimentTrialLabel() {
    const current = experimentTrialIndex + 1;
    trialLabelEl.textContent =
      "Experiment trial " + current + " of " + EXPERIMENT_TRIALS;
  }

  function generateSequence(length) {
    const result = [];
    while (result.length < length) {
      const idx = Math.floor(Math.random() * N_BLOCKS);
      if (!result.includes(idx)) {
        result.push(idx);
      }
    }
    return result;
  }

  // ================================
  // SEQUENCE PLAYBACK
  // ================================
  function playSequence() {
    if (mode !== "practice" && mode !== "experiment") return;
    if (isShowingSequence) return;

    currentSequence = generateSequence(SEQUENCE_LENGTH);
    currentResponse = [];
    isShowingSequence = true;
    isAwaitingResponse = false;

    playSequenceBtn.disabled = true;
    clearResponseBtn.disabled = true;
    setBlocksDisabled(true);
    feedback("Watch the blocks light up in order…");

    let i = 0;
    const ON_MS = 600;
    const OFF_MS = 260;

    function flashNext() {
      if (i >= currentSequence.length) {
        finishPlayback();
        return;
      }
      const idx = currentSequence[i];
      const block = blocks[idx];
      block.classList.add("highlight-playback");

      setTimeout(() => {
        block.classList.remove("highlight-playback");
        i++;
        setTimeout(flashNext, OFF_MS);
      }, ON_MS);
    }

    flashNext();
  }

  function finishPlayback() {
    isShowingSequence = false;
    isAwaitingResponse = true;
    setBlocksDisabled(false);
    clearResponseBtn.disabled = true; // enable after first tap
    feedback("Now tap the same blocks in the same order.");
  }

  // ================================
  // RESPONSE HANDLING
  // ================================
  function onBlockClick(idx) {
    if (!isAwaitingResponse) return;
    const block = blocks[idx];
    if (block.classList.contains("disabled")) return;

    currentResponse.push(idx);
    block.classList.add("highlight-response");
    setTimeout(() => block.classList.remove("highlight-response"), 180);

    if (currentResponse.length === 1) {
      clearResponseBtn.disabled = false;
    }

    if (currentResponse.length < currentSequence.length) {
      feedback(
        "Good. Keep tapping until you have touched " +
          currentSequence.length +
          " blocks."
      );
    } else if (currentResponse.length === currentSequence.length) {
      isAwaitingResponse = false;
      clearResponseBtn.disabled = true;
      setBlocksDisabled(true);
      evaluateResponse();
    }
  }

  function evaluateResponse() {
    const correct =
      currentResponse.length === currentSequence.length &&
      currentResponse.every((v, i) => v === currentSequence[i]);

    // 🔹 Log trial for experimenter view
    const phaseName = mode === "practice" ? "practice" : "experiment";
    const trialNum =
      phaseName === "practice" ? practiceTrialIndex + 1 : experimentTrialIndex + 1;
    logTrial(phaseName, trialNum, currentSequence, currentResponse, correct);

    // Participant feedback
    if (correct) {
      feedback("Correct! You matched the sequence.", "ok");
    } else {
      feedback(
        "That was not exactly the same sequence. That is okay — just try your best on the next one.",
        "error"
      );
    }

    // Progress logic
    if (mode === "practice") {
      practiceTrialIndex++;
      if (practiceTrialIndex >= PRACTICE_TRIALS) {
        feedback(
          "Practice finished. The experiment trials will start next.",
          correct ? "ok" : undefined
        );
        setTimeout(() => {
          practiceTrialIndex = 0;
          setMode("experiment");
        }, 900);
      } else {
        playSequenceBtn.disabled = false;
      }
    } else if (mode === "experiment") {
      experimentTrialIndex++;
      if (experimentTrialIndex >= EXPERIMENT_TRIALS) {
        setMode("done");
      } else {
        updateExperimentTrialLabel();
        playSequenceBtn.disabled = false;
      }
    }
  }

  function clearResponse() {
    if (!isAwaitingResponse) return;
    currentResponse = [];
    feedback("Your taps were cleared. Start again from the first block.");
    clearResponseBtn.disabled = true;
  }

  // ================================
  // EVENT WIRING
  // ================================

  // Start button (from instructions)
  if (startPracticeBtn) {
    startPracticeBtn.addEventListener("click", () => {
      if (mode !== "instructions") return;
      setMode("practice");
    });
  }

  // Space bar starts practice from instructions
  document.addEventListener("keydown", (evt) => {
    if (mode === "instructions" && (evt.code === "Space" || evt.key === " ")) {
      evt.preventDefault();
      setMode("practice");
    }
  });

  if (playSequenceBtn) {
    playSequenceBtn.addEventListener("click", () => {
      playSequence();
    });
  }

  if (clearResponseBtn) {
    clearResponseBtn.addEventListener("click", () => {
      clearResponse();
    });
  }

  // ================================
  // INIT
  // ================================
  createGrid();
  setMode("instructions");
})();
