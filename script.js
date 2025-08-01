function showQuestionsForLevel(level) {
  let area = document.getElementById('game-area');
  area.innerHTML = `<h2>第${level}關</h2><div id="questions"></div>`;
  let qindices = [];
  while(qindices.length < 10) {
    let idx = Math.floor(Math.random() * questions.length);
    if(!answeredIndices.has(idx)) {
      qindices.push(idx);
      answeredIndices.add(idx);
    }
  }
  let qHTML = "";
  qindices.forEach((qIdx, i) => {
    let q = questions[qIdx];
    let options = shuffle([...q.options]);
    qHTML += `
      <div class="question-block" data-ans="${q.answer}">
        <div><strong>Q${i+1}.</strong> ${q.question}</div>
        <ul class="options-list">
          ${options.map(opt => `<li data-val="${opt}">${opt}</li>`).join("")}
        </ul>
      </div>
    `;
  });
  area.querySelector("#questions").innerHTML = qHTML;

  let answeredCount = 0;

  area.querySelectorAll('.options-list').forEach(ul => {
    ul.onclick = function(event) {
      if(event.target.tagName === 'LI' && !ul.classList.contains('answered')) {
        let parent = ul.closest('.question-block');
        let correct = parent.dataset.ans;
        let val = event.target.dataset.val;
        ul.classList.add('answered');
        answeredCount++;
        if(val == correct) {
          event.target.classList.add('right');
          playSfx('right');
          currentScore++;
        } else {
          event.target.classList.add('wrong');
          [...ul.children].forEach(li => {
            if(li.textContent === correct) li.classList.add('right');
          });
          playSfx('wrong');
        }
        [...ul.children].forEach(li => li.style.pointerEvents = 'none');

        if(answeredCount === 10){
          setTimeout(() => {
            currentLevel++;
            showNextLevel();
          }, 1200);
        }
      }
    };
  });
}
