// THE PATTERN — 3 Stages (Easy / Medium / Hard)
// - 3 tries per stage
// - If wrong: append the correct next number (so player sees it) and continue
// - After stage ends (correct OR 3 tries), move to next stage
// - After all 3 stages: show results board (3 rows), then stop

const TRIES_PER_STAGE = 3;

/*
====================================================
EDIT THESE THREE STAGES DAILY
====================================================
Each stage:
- name: label shown to user
- start: 3 numbers shown
- next: how to compute next from the last number
====================================================
*/
const DAILY_STAGES = [
  {
    name: "EASY",
    start: [2, 3, 5],
    next: (n) => (n * 2) - 1,
    ruleN: "nₖ₊₁ = (nₖ x 2) − 1",
  },
  {
    name: "MEDIUM",
    start: [10, -14, -2,],
    next: (n) => (n / -2) -9,
    ruleN: "nₖ₊₁ = (nₖ / -2) -9",
  },
  {
  name: "HARD",
  start: [5, 9, 21],
  next: (n) => 3 * (n - 2),
  ruleN: "nₖ₊₁ = nₖ₋₁ + nₖ₋₂ + nₖ₋₃",
}
];
// ====================================================

let stageIndex = 0;
let triesUsedThisStage = 0;
let seq = [];

const results = [
  [], // stage 0: array of 'G'/'R'
  [],
  [],
];

// DOM
const sequenceEl = document.getElementById("sequence");
const form = document.getElementById("guessForm");
const input = document.getElementById("guessInput");
const feedback = document.getElementById("feedback");
const stageLabel = document.getElementById("stageLabel");
const resultsSection = document.getElementById("results");
const resultsGrid = document.getElementById("resultsGrid");

feedback.style.whiteSpace = "pre-line";

function flashLastTileGreen() {
  // renderSequence must already have been called
  const tiles = sequenceEl.querySelectorAll(".pill");
  const last = tiles[tiles.length - 1];
  if (!last) return;
  last.classList.add("correctFlash");
  setTimeout(() => last.classList.remove("correctFlash"), 1000);
}


function normalizeNumber(str) {
  const cleaned = str.replace(/,/g, "").trim();
  if (cleaned === "") return null;
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : null;
}

function setFeedback(text, cls) {
  feedback.className = `feedback ${cls || ""}`;
  feedback.textContent = text;
}

function renderSequence(showQuestionMark = true) {
  sequenceEl.innerHTML = "";

  for (const n of seq) {
    const d = document.createElement("div");
    d.className = "pill";
    d.textContent = String(n);
    sequenceEl.appendChild(d);
  }

  if (showQuestionMark) {
    const q = document.createElement("div");
    q.className = "pill";
    q.textContent = "?";
    sequenceEl.appendChild(q);
  }
}

function currentStage() {
  return DAILY_STAGES[stageIndex];
}

function nextAnswer() {
  const last = seq[seq.length - 1];
  return currentStage().next(last);
}

function startStage(i) {
  stageIndex = i;
  triesUsedThisStage = 0;

  const st = currentStage();
  seq = [...st.start];

  stageLabel.textContent = `Stage ${stageIndex + 1}`;

  input.disabled = false;
  input.value = "";
  input.focus();

  setFeedback("", "");
  renderSequence(true);
}
function finishStageAndAdvance(message, cls) {
  setFeedback(message, cls);

  // lock input during transition
  input.disabled = true;

  setTimeout(() => {
    if (stageIndex < 2) startStage(stageIndex + 1);
    else endGameShowResults();
  }, 2000);
}

function endGameShowResults() {
  input.disabled = true;
  renderSequence(false);
  stageLabel.textContent = "DONE";
  setFeedback("Game complete.", "good");

  resultsGrid.innerHTML = "";
  const labels = ["EASY", "MEDIUM", "HARD"];

  for (let r = 0; r < 3; r++) {
    const row = document.createElement("div");
    row.className = "resultsRow";

    const lab = document.createElement("div");
    lab.className = "resultsRowLabel";
    lab.textContent = labels[r];
    row.appendChild(lab);

    // boxes
    for (let c = 0; c < TRIES_PER_STAGE; c++) {
      const b = document.createElement("div");
      b.className = "box";

      const val = results[r][c];
      if (val === "G") b.classList.add("green");
      else if (val === "R") b.classList.add("red");
      else b.classList.add("empty");

      row.appendChild(b);
    }

    // ADD RULE DISPLAY
    const rule = document.createElement("div");
    rule.className = "ruleDisplay";
    rule.textContent = DAILY_STAGES[r].ruleN;
    row.appendChild(rule);

    resultsGrid.appendChild(row);
  }

  resultsSection.classList.remove("hidden");
}
// Main submit handler
form.addEventListener("submit", (e) => {
  e.preventDefault();
  if (input.disabled) return;

  const guess = normalizeNumber(input.value);
  if (guess === null) {
    setFeedback("Enter a valid number.", "bad");
    return;
  }

  const ans = nextAnswer();
  triesUsedThisStage += 1;

  // Update label to reflect try count (before potentially advancing)

  if (guess === ans) {
  results[stageIndex].push("G");
  seq.push(ans);

  // Show the appended answer as the last tile (no ?)
  renderSequence(false);

  // Turn that last tile green for 1 second
  flashLastTileGreen();

  // Wait 2 seconds then move on
  finishStageAndAdvance(`Correct`, "good");
  return;
}

  // Wrong: mark red, append correct answer (revealed), continue or end stage
  results[stageIndex].push("R");
  seq.push(ans);

  if (triesUsedThisStage >= TRIES_PER_STAGE) {
    renderSequence(false);
    finishStageAndAdvance(`❌ Out of tries. Moving on.`, "bad");
    return;
  }

  // Continue same stage
  renderSequence(true);
  setFeedback(`❌ ${TRIES_PER_STAGE - triesUsedThisStage} tries left`, "bad");
  input.value = "";
  input.focus();
});

// Start game
startStage(0);