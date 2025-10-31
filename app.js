let quote = "";
let authors = "";
let typedText = "";
let quotes = [];
let quoteIndex = -1;
let startTime = null;
let timerRunning = false;
let tabPressed = false;
let quoteDone = false;

const quoteDiv = document.getElementById("quote");
const typeBox = document.getElementById("type-box");
const wpmSpan = document.getElementById("wpm");
const accuracySpan = document.getElementById("accuracy");
const hint = document.getElementById("restart-hint");

/**
 * Later, fetch 50 quotes at a time and store in an array 
 * This allows for less API calls, instead of 50 API calls for 50 quotes
 * Logic: Store in array and de
 */
async function fetchQuotes() {
  const response = await fetch('http://localhost:3005/api/quotes');
  const data = await response.json();
  
  // Save 50 quotes 
  quotes = data;

  // Quote time!
  renderQuote();
}


/**
 * Load quote and render each word and chars from quote
 */
function renderQuote() {
  // Get next quote
  quoteIndex = (quoteIndex + 1) % quotes.length;
  const currentQuote = quotes[quoteIndex];
  quote = currentQuote.q;

  // Clear previous quote
  quoteDiv.innerHTML = "";

  // Split the quote into words (preserve punctuation)
  const words = quote.split(' ');
  console.log(words);

  for (let word of words) {
    const wordSpan = document.createElement("span");
    wordSpan.classList.add("word");

    // Add each character inside this word span
    for (let char of word) {
      const charSpan = document.createElement("span");
      charSpan.innerText = char;
      charSpan.classList.add("char");
      wordSpan.appendChild(charSpan);
    }

    // Add a space at the end of the word
    const spaceSpan = document.createElement("span");
    spaceSpan.innerText = " ";
    spaceSpan.classList.add("char");
    wordSpan.appendChild(spaceSpan);

    // Append the whole word to the quote container
    quoteDiv.appendChild(wordSpan);
  }
}


/**
 * WPM and accuracy checker
 */
function updateDisplay() {
  const spans = quoteDiv.querySelectorAll(".char");
  let wpm = 0;
  let accuracy = 100;
  let correct = 0;

  for (let i = 0; i < spans.length; i++) {
    spans[i].classList.remove("correct", "incorrect", "current");

    if (i < typedText.length) {
      if (typedText[i] === quote[i]) {
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

  if (typedText === quote) {
    quoteFinished = true;

    // Optionally disable the typeBox to lock user input visually
    typeBox.setAttribute("disabled", "true");

    // Optionally show a message
    console.log("✅ Quote complete!");
  }

  wpmSpan.textContent = `WPM: ${wpm}`;
  accuracySpan.textContent = `Accuracy: ${accuracy}%`;
}

typeBox.addEventListener("keydown", (e) => {
  e.preventDefault(); // prevent actual content editable input

  if (!startTime) startTime = Date.now();

  if (quoteDone) return;

  if (e.key.length === 1 && typedText.length < quote.length) {
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
  typeBox.removeAttribute("disabled");
  startTime = null;
  hint.style.display = "none";
  wpmSpan.textContent = "WPM: 0";
  accuracySpan.textContent = "Accuracy: 100%";
  quote = "";
  quoteDone = false;
  renderQuote();
}


// Run main
fetchQuotes();
typeBox.focus();
