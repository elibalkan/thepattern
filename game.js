// THE PATTERN — Manual Daily Version
// Each day you edit TODAY_PUZZLE only.

const MAX_GUESSES = 3;

/*
====================================================
EDIT THIS OBJECT EACH DAY
====================================================
Change:
- start → the first 3 numbers
- next  → how to compute the next number
- ruleN → what to show on GAME OVER
====================================================
*/

const TODAY_PUZZLE = {
  start: [2, 3, 8],
  next: (n) => (n ** 2) - 1,
  ruleN: "n² - 1",
};

// ---------------------------------------------------

let seq = [...TODAY_PUZZLE.start];
let guessCount = 0;

const sequenceEl = document.getElementById("sequence");
const form = document.getElementById("guessForm");
const input = document.getElementById("guessInput");
const feedback = document.getElementById("feedback");

feedback.style.whiteSpace = "pre-line";

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

function nextAnswer() {
  const last = seq[seq.length - 1];
  return TODAY_PUZZLE.next(last);
}

function endGame(message, cls) {
  input.disabled = true;
  setFeedback(message, cls);
}

function start() {
  guessCount = 0;
  seq = [...TODAY_PUZZLE.start];
  input.disabled = false;
  renderSequence(true);
  setFeedback("", "");
  input.value = "";
  input.focus();
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  if (input.disabled) return;

  const guess = normalizeNumber(input.value);
  if (guess === null) {
    setFeedback("Enter a valid number.", "bad");
    return;
  }

  guessCount += 1;
  const ans = nextAnswer();

  if (guess === ans) {
    seq.push(ans);
    renderSequence(false);
    endGame(`GAME OVER\nGuesses used: ${guessCount}`, "good");
    return;
  }

  seq.push(ans);

  if (guessCount >= MAX_GUESSES) {
    renderSequence(false);
    endGame(`GAME OVER\n${TODAY_PUZZLE.ruleN}`, "bad");
    return;
  }

  renderSequence(true);
  setFeedback(
    `❌ Guesses remaining: ${MAX_GUESSES - guessCount}`,
    "bad"
  );

  input.value = "";
  input.focus();
});

// start game
start();