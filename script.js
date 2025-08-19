/* Code Breaker — With Secret Pattern + Hint Button */

(() => {
  const arrayBoard = document.getElementById('arrayBoard');
  const feedback = document.getElementById('feedback');
  const secretPatternDiv = document.getElementById('secretPattern');
  const hintBtn = document.getElementById('hintBtn');

  const indexInput = document.getElementById('indexInput');
  const valueInput = document.getElementById('valueInput');
  const patternInput = document.getElementById('patternInput');

  const insertBtn = document.getElementById('insertBtn');
  const deleteBtn = document.getElementById('deleteBtn');
  const searchBtn = document.getElementById('searchBtn');
  const resetBtn = document.getElementById('resetBtn');

  let arr = new Array(10).fill(null);
  let feedbackTimer = null;
  let secretPattern = [];

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
    const idx = parseIntStrict(indexInput.value);
    const val = parseIntStrict(valueInput.value);

    if (idx === null || val === null) {
      setFeedback('❗ Provide both index and digit (0–9).', 'warn');
      return;
    }
    if (val < 0 || val > 9) {
      setFeedback('❌ Digit must be between 0 and 9.', 'bad');
      return;
    }
    if (idx < 0 || idx >= arr.length) {
      setFeedback('🚫 Index out of bounds!', 'bad');
      return;
    }

    for (let j = arr.length - 1; j > idx; j--) {
      arr[j] = arr[j - 1];
    }
    arr[idx] = val;

    setFeedback(`✅ Inserted ${val} at index ${idx}!`, 'ok');
    renderArray(new Set(), { [idx]: 'inserted' });
  });

  // === Delete ===
  deleteBtn.addEventListener('click', () => {
    const idx = parseIntStrict(indexInput.value);
    if (idx === null) {
      setFeedback('❗ Provide an index to delete.', 'warn');
      return;
    }
    if (idx < 0 || idx >= arr.length) {
      setFeedback('🚫 Index out of bounds!', 'bad');
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
    const pattern = parsePattern(patternInput.value);
    if (pattern.length === 0) {
      setFeedback('❗ Enter a valid pattern (e.g., 1,2,3).', 'warn');
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
      renderArray();
    } else {
      const matchSet = new Set();
      for (let k = 0; k < pattern.length; k++) matchSet.add(found + k);
      renderArray(matchSet);

      if (pattern.join(',') === secretPattern.join(',')) {
        setFeedback('🎉 Level Complete! Secret pattern unlocked.', 'ok');
      } else {
        setFeedback(`✅ Pattern ${pattern.join(',')} found at index ${found}!`, 'ok');
      }
    }
  });

  // === Reset ===
  resetBtn.addEventListener('click', () => {
    arr = new Array(10).fill(null);
    setFeedback('🔄 Array reset.', 'ok');
    renderArray();
  });

  // === Hint Button ===
  hintBtn.addEventListener('click', () => {
    secretPatternDiv.classList.remove('hidden');
    secretPatternDiv.textContent = `Secret Pattern: [${secretPattern.join(', ')}]`;
    setFeedback('💡 Hint revealed!', 'warn');
  });

  // === Generate Secret Pattern on Load ===
  function generateSecretPattern() {
    secretPattern = Array.from({ length: 3 }, () => Math.floor(Math.random() * 10));
    // initially hidden
    secretPatternDiv.textContent = '';
  }

  // Init
  generateSecretPattern();
  renderArray();
  setFeedback('💡 Ready. Insert digits to crack the code!', 'ok');
})();