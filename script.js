let playerName = "";
let currentLevel = 1;
const totalLevels = 10;
let currentScore = 0;
let answeredIndices = new Set();
let answersRecord = [];

// 🔽 內嵌題庫（你可以自行擴充）
const questions = [
  { question: "舊約聖經第一卷是？", options: ["出埃及記", "創世記", "利未記", "民數記"], answer: "創世記" },
  { question: "吃分別善惡樹果子的女人是誰？", options: ["夏娃", "利百加", "拉結", "撒拉"], answer: "夏娃" },
  { question: "洪水後方舟停在哪座山？", options: ["西乃山", "革尼山", "亞拉臘山", "基遍山"], answer: "亞拉臘山" },
  { question: "以色列的第十二個兒子是？", options: ["約瑟", "便雅憫", "利未", "西緬"], answer: "便雅憫" },
  { question: "摩西帶領以色列人出哪個國度？", options: ["埃及", "巴比倫", "亞述", "米甸"], answer: "埃及" },
  { question: "十誡是頒佈在哪座山？", options: ["西乃山", "摩利亞山", "錫安山", "何烈山"], answer: "西乃山" },
  { question: "約書亞接替摩西帶領哪一族？", options: ["猶太人", "非利士人", "以色列人", "摩押人"], answer: "以色列人" },
  { question: "掃羅是以色列的第幾任王？", options: ["第一任", "第二任", "第三任", "末任"], answer: "第一任" },
  { question: "亞伯拉罕的兒子是？", options: ["以撒", "雅各", "以實瑪利", "以東"], answer: "以撒" },
  { question: "大衛殺巨人用什麼？", options: ["弓箭", "石頭", "刀劍", "長矛"], answer: "石頭" }
];

document.getElementById("start-btn").onclick = () => {
  const nameInput = document.getElementById("player-name").value.trim();
  if (!nameInput) {
    alert("請輸入名字！");
    return;
  }
  playerName = nameInput;
  document.getElementById("name-section").style.display = "none";
  startGame();
};

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
    return endGame();
  }

  let selectedQuestions = [];
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
