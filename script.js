/* Code Breaker — With Timer, Secret Pattern, Sound Effects & Levels */

(() => {
  const arrayBoard = document.getElementById('arrayBoard');
  const feedback = document.getElementById('feedback');
  const levelIndicator = document.getElementById('levelIndicator');

  const indexInput = document.getElementById('indexInput');
  const valueInput = document.getElementById('valueInput');
  const patternInput = document.getElementById('patternInput');

  const insertBtn = document.getElementById('insertBtn');
  const deleteBtn = document.getElementById('deleteBtn');
  const searchBtn = document.getElementById('searchBtn');
  const resetBtn = document.getElementById('resetBtn');

  let arr = new Array(10).fill(null);
  let feedbackTimer = null;

  // === Levels ===
  let level = 1;
  let secretPattern = [];

  function updateLevelIndicator() {
    levelIndicator.textContent = `🔥 Level ${level}`;
  }

  function generateSecretPattern() {
    if (level === 1) {
      secretPattern = [randDigit(), randDigit()];
    } else if (level === 2) {
      secretPattern = [randDigit(), randDigit(), randDigit()];
    } else if (level === 3) {
      secretPattern = [randDigit(), randDigit(), randDigit()].reverse();
    }
    updateLevelIndicator();
  }

  function randDigit() {
    return Math.floor(Math.random() * 10);
  }

  function advanceLevel() {
    if (level < 3) {
      level++;
      generateSecretPattern();
      startTimer();
      renderArray();
      setFeedback(`🚀 Level ${level} started!`, 'ok');
    } else {
      setFeedback(`🏆 You completed all levels!`, 'ok');
      playFanfare();
    }
  }

  // === Timer ===
  let timeLeft = 60;
  let timerInterval = null;
  let startTime = null;
  const timerDisplay = document.createElement('div');
  timerDisplay.className = 'timer';
  document.body.insertBefore(timerDisplay, arrayBoard);

  function startTimer() {
    startTime = Date.now();
    timeLeft = 60;
    updateTimer();
    if (timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(() => {
      timeLeft = 60 - Math.floor((Date.now() - startTime) / 1000);
      if (timeLeft <= 0) {
        clearInterval(timerInterval);
        setFeedback('⏰ Time’s up! Try again.', 'bad');
        playBuzz();
        arr = new Array(10).fill(null);
        renderArray();
      }
      updateTimer();
    }, 1000);
  }

  function updateTimer() {
    timerDisplay.textContent = `⏳ Level ${level} — Time Left: ${Math.max(timeLeft, 0)}s`;
  }

  // === Feedback System ===
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

  // === Array Rendering ===
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

  // === Utility ===
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

  // === Sound Effects ===
  const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

  function playBeep(freq = 440, duration = 0.15) {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.frequency.value = freq;
    osc.type = "sine";
    gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
    osc.start();
    osc.stop(audioCtx.currentTime + duration);
  }

  function playBuzz() {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.type = "square";
    osc.frequency.value = 120;
    gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.3);
  }

  function playFanfare() {
    const freqs = [523, 659, 784]; // C5, E5, G5
    freqs.forEach((f, i) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.frequency.value = f;
      osc.type = "triangle";
      gain.gain.setValueAtTime(0.1, audioCtx.currentTime + i * 0.2);
      osc.start(audioCtx.currentTime + i * 0.2);
      osc.stop(audioCtx.currentTime + i * 0.2 + 0.3);
    });
  }

  // === Insert ===
  insertBtn.addEventListener('click', () => {
    const idx = parseIntStrict(indexInput.value);
    const val = parseIntStrict(valueInput.value);

    if (idx === null || val === null) {
      setFeedback('❗ Provide both index and digit (0–9).', 'warn');
      playBuzz();
      return;
    }
    if (val < 0 || val > 9) {
      setFeedback('❌ Digit must be between 0 and 9.', 'bad');
      playBuzz();
      return;
    }
    if (idx < 0 || idx >= arr.length) {
      setFeedback('🚫 Index out of bounds!', 'bad');
      playBuzz();
      return;
    }

    for (let j = arr.length - 1; j > idx; j--) {
      arr[j] = arr[j - 1];
    }
    arr[idx] = val;

    setFeedback(`✅ Inserted ${val} at index ${idx}!`, 'ok');
    playBeep();
    renderArray(new Set(), { [idx]: 'inserted' });
  });

  // === Delete ===
  deleteBtn.addEventListener('click', () => {
    const idx = parseIntStrict(indexInput.value);
    if (idx === null) {
      setFeedback('❗ Provide an index to delete.', 'warn');
      playBuzz();
      return;
    }
    if (idx < 0 || idx >= arr.length) {
      setFeedback('🚫 Index out of bounds!', 'bad');
      playBuzz();
      return;
    }

    for (let j = idx; j < arr.length - 1; j++) {
      arr[j] = arr[j + 1];
    }
    arr[arr.length - 1] = null;

    setFeedback(`🗑️ Deleted element at index ${idx}.`, 'ok');
    playBeep(300);
    renderArray(new Set(), { [idx]: 'deleted' });
  });

  // === Search ===
  searchBtn.addEventListener('click', async () => {
    const pattern = parsePattern(patternInput.value);
    if (pattern.length === 0) {
      setFeedback('❗ Enter a valid pattern (e.g., 1,2,3).', 'warn');
      playBuzz();
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
      playBuzz();
      renderArray();
    } else {
      const matchSet = new Set();
      for (let k = 0; k < pattern.length; k++) matchSet.add(found + k);
      renderArray(matchSet);

      // === Check level success ===
      let targetPattern = secretPattern;
      if (level === 3) {
        targetPattern = [...secretPattern]; // already reversed
      }

      if (pattern.join(',') === targetPattern.join(',')) {
        clearInterval(timerInterval);
        const timeTaken = Math.floor((Date.now() - startTime) / 1000);
        setFeedback(`🎉 Level ${level} complete in ${timeTaken} seconds!`, 'ok');
        playFanfare();
        setTimeout(advanceLevel, 2000);
      } else {
        setFeedback(`✅ Pattern ${pattern.join(',')} found at index ${found}.`, 'ok');
        playBeep(600);
      }
    }
  });

  // === Reset ===
  resetBtn.addEventListener('click', () => {
    arr = new Array(10).fill(null);
    level = 1;
    generateSecretPattern();
    startTimer();
    setFeedback('🔄 Game reset. Back to Level 1.', 'ok');
    renderArray();
  });

  // === Init ===
  generateSecretPattern();
  renderArray();
  startTimer();
  setFeedback('💡 Ready. Level 1 started!', 'ok');
})();