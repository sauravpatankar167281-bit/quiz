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

// Load questions from JSON
fetch("questions.json")
  .then(res => res.json())
  .then(data => {
    quizData = data;
    loadQuestion();
  })
  .catch(err => {
    questionEl.textContent = "❌ Error loading questions!";
    console.error(err);
  });

function loadQuestion() {
  const current = quizData[currentIndex];
  questionEl.textContent = `${currentIndex + 1}. ${current.question}`;
  optionsEl.innerHTML = "";

  current.options.forEach(option => {
    const button = document.createElement("button");
    button.textContent = option;
    button.addEventListener("click", () => checkAnswer(option));
    optionsEl.appendChild(button);
  });
}

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

nextBtn.addEventListener("click", () => {
  currentIndex++;
  nextBtn.style.display = "none";
  if (currentIndex < quizData.length) {
    loadQuestion();
  } else {
    showResult();
  }
});

function showResult() {
  quizBox.classList.add("hidden");
  resultBox.classList.remove("hidden");
  scoreText.textContent = `Your Score: ${score} / ${quizData.length}`;

  // Clear old QR
  qrCodeDiv.innerHTML = "";

  // Generate QR for the same quiz URL
  const currentURL = window.location.href.split("?")[0];
  new QRCode(qrCodeDiv, {
    text: currentURL,
    width: 150,
    height: 150
  });
}

restartBtn.addEventListener("click", () => {
  currentIndex = 0;
  score = 0;
  resultBox.classList.add("hidden");
  quizBox.classList.remove("hidden");
  nextBtn.style.display = "none";
  loadQuestion();
});

nextBtn.style.display = "none";
