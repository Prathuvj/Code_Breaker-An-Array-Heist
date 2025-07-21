/* Code Breaker — With Secret Pattern + Hint Button + Timer + Restart + Sounds */

(() => {
  const arrayBoard = document.getElementById('arrayBoard');
  const feedback = document.getElementById('feedback');
  const secretPatternDiv = document.getElementById('secretPattern');
  const hintBtn = document.getElementById('hintBtn');
  const timerEl = document.getElementById('timer');

  const indexInput = document.getElementById('indexInput');
  const valueInput = document.getElementById('valueInput');
  const patternInput = document.getElementById('patternInput');

  const insertBtn = document.getElementById('insertBtn');
  const deleteBtn = document.getElementById('deleteBtn');
  const searchBtn = document.getElementById('searchBtn');
  const resetBtn = document.getElementById('resetBtn');
  const restartBtn = document.getElementById('restartBtn');

  let arr = new Array(10).fill(null);
  let feedbackTimer = null;
  let secretPattern = [];

  // Timer
  let timeLeft = 60;
  let timerInterval = null;
  let gameOver = false;

  // === SOUND EFFECTS ===
  const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

  function playTone(freq, duration, type = 'sine') {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + duration);
  }

  function beep() {
    playTone(800, 0.1, 'square');
  }

  function buzz() {
    playTone(200, 0.2, 'sawtooth');
    setTimeout(() => playTone(150, 0.2, 'sawtooth'), 200);
  }

  function fanfare() {
    const notes = [523, 659, 784, 1046]; // C-E-G-C'
    notes.forEach((n, i) => {
      setTimeout(() => playTone(n, 0.2, 'triangle'), i * 250);
    });
  }

  // === Timer Functions ===
  function startTimer() {
    clearInterval(timerInterval);
    timeLeft = 60;
    timerEl.textContent = `⏳ ${timeLeft}s`;
    timerInterval = setInterval(() => {
      if (timeLeft > 0) {
        timeLeft--;
        timerEl.textContent = `⏳ ${timeLeft}s`;
      } else {
        clearInterval(timerInterval);
        gameOver = true;
        setFeedback('⏰ Time is up! Game Over.', 'bad');
        buzz();
      }
    }, 1000);
  }

  function stopTimer() {
    clearInterval(timerInterval);
  }

  // === Feedback Messages ===
  function setFeedback(msg, type = '') {
    feedback.className = 'feedback';
    if (type) feedback.classList.add(type);
    feedback.textContent = msg;

    feedback.classList.add('show');
    if (feedbackTimer) clearTimeout(feedbackTimer);
    feedbackTimer = setTimeout(() => {
      feedback.classList.remove('show');
    }, 3000);
  }

  // === Array Renderer ===
  function renderArray(highlights = new Set(), classes = {}) {
    arrayBoard.innerHTML = '';
    arr.forEach((val, i) => {
      const wrap = document.createElement('div');
      wrap.className = 'cell-wrap';

      const cell = document.createElement('div');
      cell.className = 'cell';
      cell.textContent = val === null ? '' : String(val);

      if (highlights.has(i)) cell.classList.add('match');
      if (classes[i]) cell.classList.add(classes[i]);

      const indexLabel = document.createElement('div');
      indexLabel.className = 'cell-index';
      indexLabel.textContent = i;

      wrap.appendChild(cell);
      wrap.appendChild(indexLabel);
      arrayBoard.appendChild(wrap);
    });
  }

  function parseIntStrict(s) {
    if (s === '' || s === null || s === undefined) return null;
    const n = Number(s);
    return Number.isInteger(n) ? n : null;
  }

  function parsePattern(s) {
    return s
      .split(',')
      .map(x => x.trim())
      .filter(x => x.length > 0)
      .map(x => Number(x))
      .filter(x => Number.isFinite(x));
  }

  // === Insert ===
  insertBtn.addEventListener('click', () => {
    if (gameOver) return;
    const idx = parseIntStrict(indexInput.value);
    const val = parseIntStrict(valueInput.value);

    if (idx === null || val === null) {
      setFeedback('❗ Provide both index and digit (0–9).', 'warn');
      buzz();
      return;
    }
    if (val < 0 || val > 9) {
      setFeedback('❌ Digit must be between 0 and 9.', 'bad');
      buzz();
      return;
    }
    if (idx < 0 || idx >= arr.length) {
      setFeedback('🚫 Index out of bounds!', 'bad');
      buzz();
      return;
    }

    for (let j = arr.length - 1; j > idx; j--) {
      arr[j] = arr[j - 1];
    }
    arr[idx] = val;

    setFeedback(`✅ Inserted ${val} at index ${idx}!`, 'ok');
    beep();
    renderArray(new Set(), { [idx]: 'inserted' });
  });

  // === Delete ===
  deleteBtn.addEventListener('click', () => {
    if (gameOver) return;
    const idx = parseIntStrict(indexInput.value);
    if (idx === null) {
      setFeedback('❗ Provide an index to delete.', 'warn');
      buzz();
      return;
    }
    if (idx < 0 || idx >= arr.length) {
      setFeedback('🚫 Index out of bounds!', 'bad');
      buzz();
      return;
    }

    for (let j = idx; j < arr.length - 1; j++) {
      arr[j] = arr[j + 1];
    }
    arr[arr.length - 1] = null;

    setFeedback(`🗑️ Deleted element at index ${idx}.`, 'ok');
    renderArray(new Set(), { [idx]: 'deleted' });
  });

  // === Search ===
  searchBtn.addEventListener('click', async () => {
    if (gameOver) return;
    const pattern = parsePattern(patternInput.value);
    if (pattern.length === 0) {
      setFeedback('❗ Enter a valid pattern (e.g., 1,2,3).', 'warn');
      buzz();
      return;
    }

    let found = -1;
    for (let i = 0; i <= arr.length - pattern.length; i++) {
      const highlights = new Set();
      for (let j = 0; j < pattern.length; j++) highlights.add(i + j);
      renderArray(highlights, Object.fromEntries([...highlights].map(h => [h, 'searching'])));
      await new Promise(r => setTimeout(r, 300));

      let ok = true;
      for (let j = 0; j < pattern.length; j++) {
        if (arr[i + j] !== pattern[j]) { ok = false; break; }
      }
      if (ok) {
        found = i;
        break;
      } else {
        renderArray(highlights, Object.fromEntries([...highlights].map(h => [h, 'search-fail'])));
        await new Promise(r => setTimeout(r, 200));
      }
    }

    if (found === -1) {
      setFeedback('🔎 Pattern not found.', 'bad');
      buzz();
      renderArray();
    } else {
      const matchSet = new Set();
      for (let k = 0; k < pattern.length; k++) matchSet.add(found + k);
      renderArray(matchSet);

      if (pattern.join(',') === secretPattern.join(',')) {
        stopTimer();
        const secondsTaken = 60 - timeLeft;
        setFeedback(`🎉 You cracked the code in ${secondsTaken} seconds!`, 'ok');
        fanfare();
        gameOver = true;
      } else {
        setFeedback(`✅ Pattern ${pattern.join(',')} found at index ${found}!`, 'ok');
      }
    }
  });

  // === Reset Array Only ===
  resetBtn.addEventListener('click', () => {
    if (gameOver) return;
    arr = new Array(10).fill(null);
    setFeedback('🔄 Array reset.', 'ok');
    renderArray();
  });

  // === Restart Game ===
  restartBtn.addEventListener('click', () => {
    arr = new Array(10).fill(null);
    generateSecretPattern();
    secretPatternDiv.classList.add('hidden');
    gameOver = false;
    renderArray();
    startTimer();
    setFeedback('🔄 New game started! Crack the new code.', 'ok');
  });

  // === Hint Button ===
  hintBtn.addEventListener('click', () => {
    if (gameOver) return;
    secretPatternDiv.classList.remove('hidden');
    secretPatternDiv.textContent = `Secret Pattern: [${secretPattern.join(', ')}]`;
    setFeedback('💡 Hint revealed!', 'warn');
  });

  // === Generate Secret Pattern ===
  function generateSecretPattern() {
    secretPattern = Array.from({ length: 3 }, () => Math.floor(Math.random() * 10));
    secretPatternDiv.textContent = '';
  }

  // Init
  generateSecretPattern();
  renderArray();
  setFeedback('💡 Ready. Insert digits to crack the code!', 'ok');
  startTimer();
})();