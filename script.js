let playerName = "";
let currentLevel = 1;
const totalLevels = 10;
let currentScore = 0;
let answeredIndices = new Set();
let answersRecord = [];

// 🔽 內嵌題庫（你可以自行擴充）
const questions = [
  { question: "舊約聖經第一卷是？",  options : ["出埃及記", "創世記", "利未記", "民數記"],  answer:  "創世記"},
  { question: "吃分別善惡樹果子的女人是誰？",  options : ["夏娃", "利百加", "拉結", "撒拉"],  answer:  "夏娃"},
  { question: "洪水後方舟停在哪座山？",  options : ["西乃山", "革尼山", "亞拉臘山", "基遍山"],  answer:  "亞拉臘山"},
  { question: "以色列的第十二個兒子是？",  options : ["約瑟", "便雅憫", "利未", "西緬"],  answer:  "便雅憫"},
  { question: "摩西帶領以色列人出哪個國度？",  options : ["埃及", "巴比倫", "亞述", "米甸"],  answer:  "埃及"},
  { question: "十誡是頒佈在哪座山？",  options : ["西乃山", "摩利亞山", "錫安山", "何烈山"],  answer:  "西乃山"},
  { question: "約書亞接替摩西帶領哪一族？",  options : ["猶太人", "非利士人", "以色列人", "摩押人"],  answer:  "以色列人"},
  { question: "掃羅是以色列的第幾任王？",  options : ["第一任", "第二任", "第三任", "末任"],  answer:  "第一任"},
  { question: "亞伯拉罕的兒子是？",  options : ["以撒", "雅各", "以實瑪利", "以東"],  answer:  "以撒"},
  { question: "大衛殺巨人用什麼？",  options : ["弓箭", "石頭", "刀劍", "長矛"],  answer:  "石頭"},
  { question: "誰夢見天梯？",  options : ["約瑟", "雅各", "以薩", "亞伯拉罕"],  answer:  "雅各"},
  { question: "摩西的姐姐是誰？",  options : ["米利暗", "底波拉", "哈拿", "利百加"],  answer:  "米利暗"},
  { question: "摩西受呼召時，神在什麼中顯現？",  options : ["火燒荊棘", "風暴", "彩虹", "洪水"],  answer:  "火燒荊棘"},
  { question: "舊約最大先知是哪位？",  options : ["以賽亞", "以利亞", "耶利米", "但以理"],  answer:  "以賽亞"},
  { question: "約拿在大魚腹中幾天？",  options : ["三天三夜", "一天", "七天", "五天"],  answer:  "三天三夜"},
  { question: "耶穌出生時，誰為他預備馬槽？",  options : ["瑪利亞", "約瑟", "牧羊人", "博士"],  answer:  "約瑟"},
  { question: "耶穌有多少使徒？",  options : ["10", "12", "70", "5"],  answer:  "12"},
  { question: "耶穌被釘十字架時頭上戴什麼？",  options : ["冠冕", "荊棘冠冕", "絲巾", "布帽"],  answer:  "荊棘冠冕"},
  { question: "以利亞登天時有什麼帶著他？",  options : ["雷聲", "旋風", "火車火馬", "鴿子"],  answer:  "火車火馬"},
  { question: "新約四福音書中最長的是？",  options : ["馬太", "馬可", "路加", "約翰"],  answer:  "路加"},
  { question: "五餅二魚餵飽多少人？",  options : ["五千人", "一千人", "七千人", "兩千人"],  answer:  "五千人"},
  { question: "使徒行傳中的執事殉道者？",  options : ["司提反", "腓力", "提摩太", "巴拿巴"],  answer:  "司提反"},
  { question: "彼得原名是？",  options : ["耶西", "西門", "雅各", "約翰"],  answer:  "西門"},
  { question: "寫啟示錄的是？",  options : ["保羅", "彼得", "約翰", "馬太"],  answer:  "約翰"},
  { question: "保羅本名？",  options : ["掃羅", "巴拿巴", "多馬", "亞波羅"],  answer:  "掃羅"},
  { question: "新約首卷書是？",  options : ["馬太福音", "馬可福音", "羅馬書", "使徒行傳"],  answer:  "馬太福音"},
  { question: "小兒子比喻出自何書？",  options : ["路加福音", "馬太福音", "馬可福音", "約翰福音"],  answer:  "路加福音"},
  { question: "撒母耳母親為誰？",  options : ["哈拿", "底波拉", "米利暗", "利百加"],  answer:  "哈拿"},
  { question: "出埃及時以色列人在曠野走幾年？",  options : ["40年", "20年", "10年", "7年"],  answer:  "40年"},
  { question: "亞伯拉罕將誰獻為祭？",  options : ["雅各", "以實瑪利", "以撒", "羅得"],  answer:  "以撒"},
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
