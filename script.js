let questions = [];
let currentScore = 0;
let currentLevel = 1;
let timeLeft = 600;
let answeredIndices = new Set();
let timerInterval = null;
let playerName = "";
let usedQuestions = [];

async function fetchQuestions() {
  questions = await fetch('questions.json').then(res => res.json());
}

window.onload = async function() {
  await fetchQuestions();
  document.getElementById("player-form").onsubmit = startGame;
  const bgMusic = document.getElementById("bg-music");
  if (bgMusic) {
    bgMusic.volume = 0.3;
    bgMusic.play().catch(()=>{}); // 部分瀏覽器自動播放限制
  }
  showLeaderboard();
}

function startGame(e) {
  e.preventDefault();
  playerName = document.getElementById('player-name').value.trim();
  if (!playerName) {
    alert('請輸入你的名字');
    document.getElementById('player-name').focus();
    return;
  }
  
  // 初始化狀態
  currentScore = 0;
  currentLevel = 1;
  timeLeft = 600;
  answeredIndices.clear();
  usedQuestions = [];
  
  // 隱藏輸入區，顯示遊戲與計時器
  document.getElementById('player-form').classList.add('hide');
  document.getElementById('game-area').classList.remove('hide');
  document.getElementById('timer').classList.remove('hide');
  document.querySelector('.blessing').classList.add('hide');
  document.getElementById('leaderboard').classList.add('hide');

  // 啟動計時器與顯示第一關題目
  startTimer();
  showNextLevel();
}

function startTimer() {
  updateTimer();
  if(timerInterval) clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    timeLeft--;
    updateTimer();
    if (timeLeft <= 0) {
      finishGame();
    }
  }, 1000);
}

function updateTimer() {
  let m = Math.floor(timeLeft / 60);
  let s = timeLeft % 60;
  const timerEl = document.getElementById('timer');
  timerEl.innerText = `剩餘時間：${m}:${s < 10 ? '0' : ''}${s}`;
  // 可加色彩變化提醒
  if (timeLeft <= 60) {
    timerEl.style.color = '#d00000';
  } else {
    timerEl.style.color = '#96421d';
  }
}

function showNextLevel() {
  if (currentLevel > 5) {
    finishGame();
    return;
  }
  showQuestionsForLevel(currentLevel);
}

function showQuestionsForLevel(level) {
  let area = document.getElementById('game-area');
  area.innerHTML = `<h2>第${level}關</h2><div id="questions"></div>`;

  let qindices = [];
  // 挑選本關10個未出現過的題目索引
  while (qindices.length < 10) {
    let idx = Math.floor(Math.random() * questions.length);
    if (!answeredIndices.has(idx)) {
      qindices.push(idx);
      answeredIndices.add(idx);
      usedQuestions.push(idx);
    }
  }

  let qHTML = "";
  qindices.forEach((qIdx, i) => {
    let q = questions[qIdx];
    let options = shuffle([...q.options]);
    qHTML += `
      <div class="question-block" data-ans="${q.answer}">
        <div><strong>Q${i + 1}.</strong> ${q.question}</div>
        <ul class="options-list">
          ${options.map(opt => `<li data-val="${opt}">${opt}</li>`).join('')}
        </ul>
      </div>
    `;
  });

  area.querySelector("#questions").innerHTML = qHTML;

  let answeredCount = 0; // 本關答題數

  area.querySelectorAll('.options-list').forEach(ul => {
    ul.onclick = function (event) {
      if (event.target.tagName === 'LI' && !ul.classList.contains('answered')) {
        let parent = ul.closest('.question-block');
        let correct = parent.dataset.ans;
        let val = event.target.dataset.val;

        ul.classList.add('answered');
        answeredCount++;

        if (val === correct) {
          event.target.classList.add('right');
          playSfx('right');
          currentScore++;
        } else {
          event.target.classList.add('wrong');
          [...ul.children].forEach(li => {
            if (li.textContent === correct) li.classList.add('right');
          });
          playSfx('wrong');
        }

        // 禁止再次點擊該題選項
        [...ul.children].forEach(li => li.style.pointerEvents = 'none');

        // 答完10題後自動跳下一關（延遲1200毫秒給玩家看標示）
        if (answeredCount === 10) {
          setTimeout(() => {
            currentLevel++;
            showNextLevel();
          }, 1200);
        }
      }
    };
  });
}

function playSfx(type) {
  let sfx = new Audio(type === 'right' ? 'sfx/right.mp3' : 'sfx/wrong.mp3');
  sfx.volume = 0.4;
  sfx.play();
}

function finishGame() {
  clearInterval(timerInterval);
  document.getElementById('game-area').classList.add('hide');
  document.getElementById('timer').classList.add('hide');
  const blessingEl = document.querySelector('.blessing');
  blessingEl.classList.remove('hide');
  blessingEl.innerText = getBlessing();
  saveScore();
  showLeaderboard();

  // 顯示重新輸入名字的表單，方便重新遊玩
  document.getElementById('player-form').classList.remove('hide');
}

function getBlessing() {
  const list = [
    "願主賜你智慧、知識與平安！(民6:24)",
    "主的愛常與你同在。(詩23:1)",
    "仰望耶和華，就是力量的開始。(賽40:31)"
  ];
  return list[Math.floor(Math.random() * list.length)];
}

function saveScore() {
  let data = JSON.parse(localStorage.getItem('bibleQuizRank') || '[]');
  data.push({ name: playerName, score: currentScore, timestamp: Date.now() });
  data.sort((a, b) => b.score - a.score);
  data = data.slice(0, 10); // 只保留前10名
  localStorage.setItem('bibleQuizRank', JSON.stringify(data));
}

function showLeaderboard() {
  let board = document.getElementById('leaderboard');
  let data = JSON.parse(localStorage.getItem('bibleQuizRank') || '[]');
  if (data.length === 0) {
    board.innerHTML = "<h3>排行榜</h3><li>暫無紀錄</li>";
  } else {
    board.innerHTML = '<h3>排行榜</h3>' +
      data.map((v, i) => `<li>${i + 1}. ${v.name} 分數: ${v.score}</li>`).join("");
  }
  board.classList.remove('hide');
}

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
