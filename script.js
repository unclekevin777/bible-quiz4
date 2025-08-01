console.log("✅ script.js 已經載入！");
let playerName = "";
let currentLevel = 1;
const totalLevels = 10;
let currentScore = 0;
let answeredIndices = new Set();
let questions = [];
let selectedQuestions = [];
let answersRecord = [];

document.getElementById("start-btn").onclick = () => {
  const nameInput = document.getElementById("player-name").value.trim();
  if (!nameInput) {
    alert("請輸入名字！");
    return;
  }
  playerName = nameInput;
  document.getElementById("name-section").style.display = "none";
  fetch("questions.json")
    .then(res => res.json())
    .then(data => {
      questions = data;
      startGame();
    })
    .catch(err => {
      document.getElementById("game-area").textContent = "無法載入題庫";
    });
};

console.log("✅ 題庫數量：", questions.length);
function startGame() {
  currentLevel = 1;
  currentScore = 0;
  answeredIndices = new Set();
  answersRecord = [];
  showQuestionsForLevel(currentLevel);
}

function showQuestionsForLevel(level) {
  const area = document.getElementById("game-area");
  area.innerHTML = "";
  area.style.display = "block";

  const available = questions.filter((_, idx) => !answeredIndices.has(idx));
  if (available.length < 10 || level > totalLevels) {
    console.warn("⚠️ 題庫數量不足，無法開始遊戲");
    return endGame();
  }

  selectedQuestions = [];
  while (selectedQuestions.length < 10) {
    let rand = Math.floor(Math.random() * questions.length);
    if (!answeredIndices.has(rand)) {
      selectedQuestions.push({ ...questions[rand], index: rand });
      answeredIndices.add(rand);
    }
  }

  let currentQuestion = 0;
  renderQuestion(currentQuestion);

  function renderQuestion(i) {
    const q = selectedQuestions[i];
    area.innerHTML = "";
    const title = document.createElement("div");
    title.textContent = `第 ${i + 1} 題：${q.question}`;
    area.appendChild(title);

    q.options.forEach(opt => {
      const btn = document.createElement("button");
      btn.textContent = opt;
      btn.onclick = () => {
        const correct = opt === q.answer;
        if (correct) currentScore++;
        answersRecord.push({
          question: q.question,
          answer: q.answer,
          user: opt,
          correct: correct
        });
        if (i < 9) {
          renderQuestion(i + 1);
        } else {
          currentLevel++;
          showQuestionsForLevel(currentLevel);
        }
      };
      area.appendChild(btn);
    });
  }
}

function endGame() {
  document.getElementById("game-area").style.display = "none";
  const result = document.getElementById("result");
  const scoreText = document.getElementById("final-score");
  const review = document.getElementById("answer-review");
  result.style.display = "block";
  scoreText.textContent = `${playerName}，你總共答對 ${currentScore} 題`;
  review.innerHTML = "";
  answersRecord.forEach(r => {
    const li = document.createElement("li");
    li.textContent = `題目: ${r.question}，你的答案: ${r.user}，正確答案: ${r.answer}`;
    review.appendChild(li);
  });

  saveLeaderboard();
  showLeaderboard();
}

function saveLeaderboard() {
  const board = JSON.parse(localStorage.getItem("bible_leaderboard") || "[]");
  board.push({ name: playerName, score: currentScore });
  board.sort((a, b) => b.score - a.score);
  localStorage.setItem("bible_leaderboard", JSON.stringify(board.slice(0, 10)));
}

function showLeaderboard() {
  const board = JSON.parse(localStorage.getItem("bible_leaderboard") || "[]");
  const list = document.getElementById("leaderboard-list");
  const boardDiv = document.getElementById("leaderboard");
  boardDiv.style.display = "block";
  list.innerHTML = "";
  board.forEach(entry => {
    const li = document.createElement("li");
    li.textContent = `${entry.name}：${entry.score} 分`;
    list.appendChild(li);
  });
}
