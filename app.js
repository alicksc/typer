let targetText = "the quick brown fox jumps over the lazy dog";
let typedText = "";
let startTime = null;
let timerRunning = false;
let tabPressed = false;

const targetDiv = document.getElementById("target-text");
const typeBox = document.getElementById("type-box");
const wpmSpan = document.getElementById("wpm");
const accuracySpan = document.getElementById("accuracy");
const hint = document.getElementById("restart-hint");

function renderTarget() {
  targetDiv.innerHTML = "";
  for (let i = 0; i < targetText.length; i++) {
    const span = document.createElement("span");
    span.innerText = targetText[i];
    targetDiv.appendChild(span);
  }
}

function updateDisplay() {
  const spans = targetDiv.querySelectorAll("span");
  for (let i = 0; i < targetText.length; i++) {
    const char = typedText[i];
    spans[i].className = "";
    if (char == null) continue;
    spans[i].className = char === targetText[i] ? "correct" : "incorrect";
  }
}

function updateStats() {
  let correct = 0;
  for (let i = 0; i < typedText.length; i++) {
    if (typedText[i] === targetText[i]) correct++;
  }
  const elapsed = (Date.now() - startTime) / 1000;
  const wpm = ((correct / 5) / (elapsed / 60)).toFixed(1);
  const accuracy = ((correct / typedText.length) * 100 || 100).toFixed(1);
  wpmSpan.textContent = `WPM: ${wpm}`;
  accuracySpan.textContent = `Accuracy: ${accuracy}%`;
}

typeBox.addEventListener("input", (e) => {
  if (!timerRunning) {
    startTime = Date.now();
    timerRunning = true;
  }
  typedText = e.target.value;
  updateDisplay();
  updateStats();
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Tab") {
    e.preventDefault();
    tabPressed = true;
    hint.style.display = "block";
  } else if (e.key === "Enter" && tabPressed) {
    restartTest();
    tabPressed = false;
  } else {
    tabPressed = false;
    hint.style.display = "none";
  }
});

function restartTest() {
  typedText = "";
  timerRunning = false;
  typeBox.value = "";
  startTime = null;
  hint.style.display = "none";
  renderTarget();
  wpmSpan.textContent = "WPM: 0";
  accuracySpan.textContent = "Accuracy: 100%";
}

renderTarget();