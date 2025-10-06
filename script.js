let allQuestions = [];
let quizData = [];
let currentIndex = 0;
let score = 0;

const questionEl = document.getElementById("question");
const optionsEl = document.getElementById("options");
const nextBtn = document.getElementById("next-btn");
const resultBox = document.getElementById("result-box");
const quizBox = document.getElementById("quiz-box");
const scoreText = document.getElementById("score-text");
const restartBtn = document.getElementById("restart-btn");
const qrCodeDiv = document.getElementById("qr-code");

// Shuffle array and select num unique questions
function getRandomQuestions(arr, num) {
  if (num > arr.length) return [...arr];

  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled.slice(0, num);
}

// Start or restart quiz
function startNewQuiz(numQuestions) {
  quizData = getRandomQuestions(allQuestions, numQuestions);
  currentIndex = 0;
  score = 0;

  resultBox.classList.add("hidden");
  quizBox.classList.remove("hidden");
  nextBtn.style.display = "none";
  loadQuestion();
}

// Load current question
function loadQuestion() {
  const current = quizData[currentIndex];
  questionEl.textContent = `${currentIndex + 1}. ${current.question}`;
  optionsEl.innerHTML = "";
  nextBtn.style.display = "none";

  current.options.forEach(option => {
    const btn = document.createElement("button");
    btn.textContent = option;
    btn.addEventListener("click", () => checkAnswer(option));
    optionsEl.appendChild(btn);
  });
}

// Check answer
function checkAnswer(selected) {
  const correct = quizData[currentIndex].answer;
  const buttons = optionsEl.querySelectorAll("button");

  buttons.forEach(btn => {
    btn.disabled = true;
    if (btn.textContent === correct) {
      btn.style.background = "#28a745";
      btn.style.color = "white";
    } else if (btn.textContent === selected && selected !== correct) {
      btn.style.background = "#dc3545";
      btn.style.color = "white";
    }
  });

  if (selected === correct) score++;
  nextBtn.style.display = "block";
}

// Next button
nextBtn.addEventListener("click", () => {
  currentIndex++;
  nextBtn.style.display = "none";
  if (currentIndex < quizData.length) {
    loadQuestion();
  } else {
    showResult();
  }
});

// Show result & generate QR
function showResult() {
  quizBox.classList.add("hidden");
  resultBox.classList.remove("hidden");
  scoreText.textContent = `Your Score: ${score} / ${quizData.length}`;

  qrCodeDiv.innerHTML = "";
  const currentURL = window.location.href.split("?")[0];
  new QRCode(qrCodeDiv, {
    text: currentURL,
    width: 150,
    height: 150
  });
}

// Restart quiz
restartBtn.addEventListener("click", () => startNewQuiz(10));

// Load questions from JSON
fetch("questions.json")
  .then(res => res.json())
  .then(data => {
    allQuestions = data;
    startNewQuiz(10);
  })
  .catch(err => {
    questionEl.textContent = "❌ Error loading questions!";
    console.error(err);
  });
