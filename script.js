let playerName = '';
let currentRound = 1;
const totalRounds = 10;
const questionsPerRound = 10;
let questions = [];
let usedQuestions = [];
let selected = [];
let score = 0;
let answersRecord = [];

const nameInput = document.getElementById('nameInput');
const startBtn = document.getElementById('startBtn');
const inputSection = document.getElementById('inputSection');
const quizSection = document.getElementById('quizSection');
const resultSection = document.getElementById('resultSection');
const leaderboardSection = document.getElementById('leaderboardSection');
const questionEl = document.getElementById('question');
const optionsEl = document.getElementById('options');
const nextBtn = document.getElementById('nextBtn');
const scoreEl = document.getElementById('score');
const answerListEl = document.getElementById('answerList');
const leaderboardEl = document.getElementById('leaderboard');

startBtn.onclick = () => {
  const name = nameInput.value.trim();
  if (!name) {
    alert('請輸入玩家名字');
    return;
  }
  playerName = name;
  inputSection.style.display = 'none';
  quizSection.style.display = 'block';
  fetch('questions.json')
    .then(res => res.json())
    .then(data => {
      questions = data;
      startRound();
    });
};

function startRound() {
  score = 0;
  answersRecord = [];
  const unused = questions.filter(q => !usedQuestions.includes(q.question));
  if (unused.length < questionsPerRound) {
    endGame();
    return;
  }
  selected = shuffle(unused).slice(0, questionsPerRound);
  usedQuestions.push(...selected.map(q => q.question));
  currentQuestionIndex = 0;
  showQuestion();
}

function shuffle(arr) {
  return arr.sort(() => Math.random() - 0.5);
}

function showQuestion() {
  const q = selected[currentQuestionIndex];
  questionEl.textContent = `第${currentQuestionIndex+1}題：${q.question}`;
  optionsEl.innerHTML = '';
  nextBtn.disabled = true;
  q.options.forEach(opt => {
    const btn = document.createElement('button');
    btn.className = 'option';
    btn.textContent = opt;
    btn.onclick = () => {
      const correct = (opt === q.answer);
      if(correct) score++;
      answersRecord.push({question: q.question, answer: q.answer, user: opt, correct});
      Array.from(optionsEl.children).forEach(b => b.disabled = true);
      nextBtn.disabled = false;
      btn.style.backgroundColor = correct ? 'lightgreen' : 'salmon';
    };
    optionsEl.appendChild(btn);
  });
}

nextBtn.onclick = () => {
  currentQuestionIndex++;
  if(currentQuestionIndex < selected.length) {
    showQuestion();
  } else {
    currentRound++;
    if(currentRound > totalRounds) {
      endGame();
    } else {
      alert(`第${currentRound-1}局結束，進入第${currentRound}局`);
      startRound();
    }
  }
};

function endGame() {
  quizSection.style.display = 'none';
  resultSection.style.display = 'block';

  scoreEl.textContent = `${playerName}，你總共答對 ${score} 題。`;
  answerListEl.innerHTML = '';
  answersRecord.forEach(item => {
    const li = document.createElement('li');
    li.textContent = `題目: ${item.question}，你的答案: ${item.user}，正確答案: ${item.answer}`;
    answerListEl.appendChild(li);
  });

  saveLeaderboard(playerName, score);
  showLeaderboard();
}

function saveLeaderboard(name, score) {
  const board = JSON.parse(localStorage.getItem('bibleQuizLeaderboard') || '[]');
  board.push({name, score});
  board.sort((a,b) => b.score - a.score);
  localStorage.setItem('bibleQuizLeaderboard', JSON.stringify(board.slice(0,10)));
}

function showLeaderboard() {
  leaderboardSection.style.display = 'block';
  const board = JSON.parse(localStorage.getItem('bibleQuizLeaderboard') || '[]');
  leaderboardEl.innerHTML = '';
  board.forEach((entry, i) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${i+1}</td><td>${entry.name}</td><td>${entry.score}</td>`;
    leaderboardEl.appendChild(tr);
  });
}