(function () {
  // --- CONFIG ---
  const PRACTICE_BALLOONS = 1;
  const REAL_BALLOONS = 10;
  const PUMP_VALUE = 0.05; // $0.05 per pump
  const MAX_PUMPS_PER_BALLOON = 32;

  // --- DOM ---
  const screenIntro = document.getElementById("screen-intro");
  const screenGame = document.getElementById("screen-game");
  const screenResult = document.getElementById("screen-result");
  const screenExperimenter = document.getElementById("screen-experimenter");

  const btnStart = document.getElementById("btn-start");
  const btnPump = document.getElementById("btn-pump");
  const btnBank = document.getElementById("btn-bank");
  const btnExit = document.getElementById("btn-exit");
  const btnPlayAgain = document.getElementById("btn-play-again");
  const btnExpClose = document.getElementById("exp-close");

  const roundValueEl = document.getElementById("round-value");
  const totalBankedEl = document.getElementById("total-banked");
  const balloonCountEl = document.getElementById("balloon-count");
  const gameMessageEl = document.getElementById("game-message");
  const balloonEl = document.getElementById("balloon");
  const finalTotalEl = document.getElementById("final-total");

  const expP1Body = document.getElementById("exp-p1-body");
  const expP2Body = document.getElementById("exp-p2-body");
  const expP3Body = document.getElementById("exp-p3-body");

  // --- STATE ---
  let currentBalloonIndex = 0; // 0..(PRACTICE+REAL-1)
  let currentPumps = 0;
  let explosionPump = null;
  let roundValue = 0;
  let totalBanked = 0;
  let roundOver = false;
  let gameOver = false;

  function formatMoney(amount) {
    return "$" + amount.toFixed(2);
  }

  function isPractice() {
    return currentBalloonIndex < PRACTICE_BALLOONS;
  }

  function goToIntro() {
    gameOver = false;
    screenIntro.classList.remove("hidden");
    screenGame.classList.add("hidden");
    screenResult.classList.add("hidden");
    screenExperimenter.classList.add("hidden");
  }

  function goToGame() {
    screenIntro.classList.add("hidden");
    screenGame.classList.remove("hidden");
    screenResult.classList.add("hidden");
    screenExperimenter.classList.add("hidden");
    currentBalloonIndex = 0;
    totalBanked = 0;
    updateTotals();
    startNewBalloon();
  }

  function goToResult() {
    gameOver = true;
    screenIntro.classList.add("hidden");
    screenGame.classList.add("hidden");
    screenResult.classList.remove("hidden");
    screenExperimenter.classList.add("hidden");
    finalTotalEl.textContent = formatMoney(totalBanked);
  }

  function goToExperimenter() {
    screenIntro.classList.add("hidden");
    screenGame.classList.add("hidden");
    screenResult.classList.add("hidden");
    screenExperimenter.classList.remove("hidden");
  }

  function updateTotals() {
    totalBankedEl.textContent = formatMoney(totalBanked);
  }

  function updateBalloonLabel() {
    if (isPractice()) {
      balloonCountEl.textContent = "Practice";
    } else {
      const realIndex = currentBalloonIndex - PRACTICE_BALLOONS + 1;
      balloonCountEl.textContent = realIndex + " / " + REAL_BALLOONS;
    }
  }

  function updateRoundDisplay() {
    roundValueEl.textContent = formatMoney(roundValue);
    updateBalloonLabel();

    const scale = 1 + Math.min(currentPumps, 15) * 0.04;
    balloonEl.style.transform = "scale(" + scale.toFixed(2) + ")";
  }

  function startNewBalloon() {
    const totalBalloons = PRACTICE_BALLOONS + REAL_BALLOONS;
    if (currentBalloonIndex >= totalBalloons) {
      goToResult();
      return;
    }
    roundOver = false;
    currentPumps = 0;
    roundValue = 0;
    explosionPump =
      1 + Math.floor(Math.random() * MAX_PUMPS_PER_BALLOON); // 1..max
    balloonEl.classList.remove("balloon--popped");
    balloonEl.style.transform = "scale(1)";
    gameMessageEl.textContent = isPractice()
      ? "Practice balloon: press SPACE to pump and ENTER to bank. This one does not count."
      : "Real balloons: pump to earn money and bank before it pops.";
    btnPump.disabled = false;
    btnBank.disabled = false;
    updateRoundDisplay();
  }

  function handlePump() {
    if (roundOver || gameOver) return;
    currentPumps += 1;

    if (currentPumps >= explosionPump) {
      roundValue = 0;
      roundOver = true;
      balloonEl.classList.add("balloon--popped");
      gameMessageEl.textContent = isPractice()
        ? "The balloon popped, but this was just practice. The real balloons start next."
        : "The balloon popped! You earned $0.00 for this balloon.";
      btnPump.disabled = true;
      btnBank.disabled = true;

      setTimeout(() => {
        currentBalloonIndex += 1;
        startNewBalloon();
      }, 1100);
    } else {
      roundValue = currentPumps * PUMP_VALUE;
      gameMessageEl.textContent =
        "Keep pumping or press ENTER to bank this money.";
      updateRoundDisplay();
    }
  }

  function handleBank() {
    if (roundOver || gameOver) return;
    roundOver = true;

    if (isPractice()) {
      gameMessageEl.textContent =
        "Practice balloon finished. The real balloons start next.";
    } else {
      totalBanked += roundValue;
      updateTotals();
      gameMessageEl.textContent =
        "You banked " + formatMoney(roundValue) + " for this balloon.";
    }

    btnPump.disabled = true;
    btnBank.disabled = true;

    setTimeout(() => {
      currentBalloonIndex += 1;
      startNewBalloon();
    }, 900);
  }

  // Keyboard controls
  document.addEventListener("keydown", (evt) => {
    if (evt.repeat) return;

    const onGame = !screenGame.classList.contains("hidden");
    const onIntro = !screenIntro.classList.contains("hidden");

    if (onIntro) {
      if (evt.code === "Space" || evt.key === " ") {
        evt.preventDefault();
        goToGame();
        return;
      }
    }

    if (onGame) {
      if (evt.code === "Space" || evt.key === " ") {
        evt.preventDefault();
        handlePump();
        return;
      }
      if (evt.code === "Enter") {
        evt.preventDefault();
        handleBank();
        return;
      }
    }
  });

  // Button wiring
  if (btnStart) btnStart.addEventListener("click", goToGame);
  if (btnPump) btnPump.addEventListener("click", handlePump);
  if (btnBank) btnBank.addEventListener("click", handleBank);
  if (btnExit) btnExit.addEventListener("click", goToIntro);
  if (btnPlayAgain) btnPlayAgain.addEventListener("click", goToGame);
  if (btnExpClose)
    btnExpClose.addEventListener("click", () => {
      // strip ?mode=config when closing
      window.location.href = window.location.pathname;
    });

  // --- Experimenter dummy data ---
  const demoTrials = [
    { trial: 1, color: "red", side: "left", correct: false, rt: 1332 },
    { trial: 2, color: "red", side: "right", correct: false, rt: 2500 },
    { trial: 3, color: "red", side: "right", correct: false, rt: 2500 },
    { trial: 4, color: "red", side: "right", correct: false, rt: 2500 },
    { trial: 5, color: "green", side: "right", correct: false, rt: 2500 },
    { trial: 6, color: "green", side: "left", correct: false, rt: 2500 },
    { trial: 7, color: "red", side: "right", correct: false, rt: 2500 },
    { trial: 8, color: "green", side: "left", correct: false, rt: 2500 },
    { trial: 9, color: "green", side: "left", correct: false, rt: 2500 },
    { trial: 10, color: "red", side: "left", correct: false, rt: 2500 },
  ];

  function populateTable(tbody, mapper) {
    if (!tbody) return;
    tbody.innerHTML = "";
    demoTrials.forEach((trial) => {
      const row = document.createElement("tr");
      const data = mapper ? mapper(trial) : trial;
      ["trial", "color", "side", "correct", "rt"].forEach((key) => {
        const cell = document.createElement("td");
        let val = data[key];
        if (key === "correct") {
          val = val ? "✓" : "✗";
        }
        cell.textContent = val;
        row.appendChild(cell);
      });
      tbody.appendChild(row);
    });
  }

  populateTable(expP1Body, (t) => t);
  populateTable(expP2Body, (t) => ({ ...t, correct: true, rt: 700 + t.trial * 10 }));
  populateTable(expP3Body, (t) => ({
    ...t,
    correct: t.trial !== 3 && t.trial !== 7,
    rt: 550 + (t.trial % 3) * 20,
  }));

  // --- Initial mode based on URL ---
  const params = new URLSearchParams(window.location.search);
  const mode = params.get("mode");

  if (mode === "config") {
    goToExperimenter();
  } else {
    goToIntro();
  }
})();
