let targetText = "the quick brown fox jumps over the lazy dog";
let typedText = "";
let startTime = null;
let timerRunning = false;
let tabPressed = false;

const quoteDiv = document.getElementById("quote");
const typeBox = document.getElementById("type-box");
const wpmSpan = document.getElementById("wpm");
const accuracySpan = document.getElementById("accuracy");
const hint = document.getElementById("restart-hint");


/**
 * Render each character in from the quote
 */
function renderQuote() {
  quoteDiv.innerHTML = "";
  for (let i = 0; i < targetText.length; i++) {
    const span = document.createElement("span");
    span.innerText = targetText[i];
    span.classList.add("char");
    quoteDiv.appendChild(span);
  }
}


/**
 * WPM and accuracy checker
 */
function updateDisplay() {
  const spans = quoteDiv.querySelectorAll("span");
  let wpm = 0;
  let accuracy = 100;
  let correct = 0;

  for (let i = 0; i < spans.length; i++) {
    spans[i].classList.remove("correct", "incorrect", "current");

    if (i < typedText.length) {
      if (typedText[i] === targetText[i]) {
        spans[i].classList.add("correct");
        correct++;
      } else {
        spans[i].classList.add("incorrect");
      }
    }

    if (i === typedText.length) {
      spans[i].classList.add("current");
    }
  }

  // Don't start if user hasn't typed anything
  if (startTime && typedText.length > 0) {
    const elapsed = (Date.now() - startTime) / 1000;

    // WPM and accuracy calculation
    wpm = ((correct / 5) / (elapsed / 60)).toFixed(1);
    accuracy = ((correct / typedText.length) * 100).toFixed(1);
  }

  wpmSpan.textContent = `WPM: ${wpm}`;
  accuracySpan.textContent = `Accuracy: ${accuracy}%`;
}

typeBox.addEventListener("keydown", (e) => {
  e.preventDefault(); // prevent actual content editable input

  if (!startTime) startTime = Date.now();

  if (e.key.length === 1 && typedText.length < targetText.length) {
    typedText += e.key;
  } else if (e.key === "Backspace") {
    typedText = typedText.slice(0, -1);
  }

  updateDisplay();
});


/**
 * Allow tab + enter to restart test
 */
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


/**
 * Restart test
 */
function restartTest() {
  typedText = "";
  timerRunning = false;
  typeBox.value = "";
  startTime = null;
  hint.style.display = "none";
  renderQuote();
  wpmSpan.textContent = "WPM: 0";
  accuracySpan.textContent = "Accuracy: 100%";
}


// Run main
renderQuote();
typeBox.focus();
