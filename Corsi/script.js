(function () {
  const N_BLOCKS = 9;
  const PRACTICE_TRIALS = 1;
  const EXPERIMENT_TRIALS = 10;
  const SEQUENCE_LENGTH = 4;

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

  // --- Experimenter controls DOM ---
  const expToggle = document.getElementById("expToggle");
  const expPanel = document.getElementById("expPanel");
  const expClose = document.getElementById("expClose");

  // ---------------------------------
  // URL ?mode=config + password lock
  // ---------------------------------
  const urlParams = new URLSearchParams(window.location.search);
  const urlMode = urlParams.get("mode"); // e.g., ?mode=config
  const isExperimenterMode = urlMode === "config";

  let experimenterUnlocked = false;

  if (isExperimenterMode) {
    const EXP_PASSWORD = "corsi2024"; // <--- change if you want
    const entered = window.prompt("Experimenter password:");
    if (entered === EXP_PASSWORD) {
      experimenterUnlocked = true;
    } else {
      window.alert("Incorrect password. Showing participant view instead.");
    }
  }

  // Hide experimenter button unless in config mode *and* password is correct
  if (!isExperimenterMode || !experimenterUnlocked) {
    expToggle.style.display = "none";
  }

  // ---------------------------------

  let blocks = [];
  let mode = "instructions"; // instructions | practice | experiment | done
  let practiceTrialIndex = 0;
  let experimentTrialIndex = 0;
  let isShowingSequence = false;
  let isAwaitingResponse = false;
  let currentSequence = [];
  let currentResponse = [];

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

  function setStagePills(current) {
    stepPills.forEach((pill) => {
      const stage = pill.getAttribute("data-stage");
      if (stage === current) {
        pill.classList.add("active");
      } else {
        pill.classList.remove("active");
      }
    });
  }

  function feedback(message, type) {
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

    if (correct) {
      feedback("Correct! You matched the sequence.", "ok");
    } else {
      feedback(
        "That was not exactly the same sequence. That is okay — just try your best on the next one.",
        "error"
      );
    }

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

  // ---- Experimenter overlay events ----
  expToggle.addEventListener("click", () => {
    expPanel.classList.add("is-open");
  });

  expClose.addEventListener("click", () => {
    expPanel.classList.remove("is-open");
  });
  // -------------------------------------

  // Event wiring for participant view

  startPracticeBtn.addEventListener("click", () => {
    if (mode !== "instructions") return;
    setMode("practice");
  });

  document.addEventListener("keydown", (evt) => {
    if (mode === "instructions" && (evt.code === "Space" || evt.key === " ")) {
      evt.preventDefault();
      setMode("practice");
    }
  });

  playSequenceBtn.addEventListener("click", () => {
    playSequence();
  });

  clearResponseBtn.addEventListener("click", () => {
    clearResponse();
  });

  // Init
  createGrid();
  setMode("instructions");

  // If we came in via ?mode=config with correct password, auto-open panel
  if (isExperimenterMode && experimenterUnlocked) {
    expPanel.classList.add("is-open");
  }
})();
