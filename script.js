/* Code Breaker — With Operations Panel + Index Labels
   - Visual array of 10 cells with index labels
   - Insert (shift right), Delete (shift left), Search, Reset
*/

(() => {
  const arrayBoard = document.getElementById('arrayBoard');
  const feedback = document.getElementById('feedback');

  const indexInput = document.getElementById('indexInput');
  const valueInput = document.getElementById('valueInput');
  const patternInput = document.getElementById('patternInput');

  const insertBtn = document.getElementById('insertBtn');
  const deleteBtn = document.getElementById('deleteBtn');
  const searchBtn = document.getElementById('searchBtn');
  const resetBtn = document.getElementById('resetBtn');

  /** @type {(number|null)[]} */
  let arr = new Array(10).fill(null); // fixed size array of 10 cells

  function setFeedback(msg, type = '') {
    feedback.className = 'feedback';
    if (type) feedback.classList.add(type);
    feedback.textContent = msg;
  }

  function renderArray(highlights = new Set(), insertedIndex = null, deletedIndex = null) {
    arrayBoard.innerHTML = '';
    arr.forEach((val, i) => {
      const wrap = document.createElement('div');
      wrap.className = 'cell-wrap';

      const cell = document.createElement('div');
      cell.className = 'cell';
      cell.textContent = val === null ? '' : String(val);

      if (highlights.has(i)) cell.classList.add('match');
      if (insertedIndex === i) cell.classList.add('inserted');
      if (deletedIndex === i) cell.classList.add('deleted');

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

  function linearSubarraySearch(haystack, needle) {
    if (needle.length === 0) return -1;
    if (needle.length > haystack.length) return -1;

    for (let i = 0; i <= haystack.length - needle.length; i++) {
      let ok = true;
      for (let j = 0; j < needle.length; j++) {
        if (haystack[i + j] !== needle[j]) { ok = false; break; }
      }
      if (ok) return i;
    }
    return -1;
  }

  // Event handlers
  insertBtn.addEventListener('click', () => {
    const idxRaw = parseIntStrict(indexInput.value);
    const valRaw = parseIntStrict(valueInput.value);

    if (idxRaw === null || valRaw === null) {
      setFeedback('Provide both index and digit (0–9).', 'warn');
      return;
    }
    if (valRaw < 0 || valRaw > 9) {
      setFeedback('Digit must be between 0 and 9.', 'bad');
      return;
    }
    if (idxRaw < 0 || idxRaw >= arr.length) {
      setFeedback('Index out of bounds.', 'bad');
      return;
    }

    // Shift right
    for (let j = arr.length - 1; j > idxRaw; j--) {
      arr[j] = arr[j - 1];
    }
    arr[idxRaw] = valRaw;

    setFeedback(`Inserted ${valRaw} at index ${idxRaw} (shifted right).`, 'ok');
    renderArray(new Set(), idxRaw, null);
  });

  deleteBtn.addEventListener('click', () => {
    const idxRaw = parseIntStrict(indexInput.value);
    if (idxRaw === null) {
      setFeedback('Provide an index to delete.', 'warn');
      return;
    }
    if (idxRaw < 0 || idxRaw >= arr.length) {
      setFeedback('Index out of bounds.', 'bad');
      return;
    }

    // Shift left
    for (let j = idxRaw; j < arr.length - 1; j++) {
      arr[j] = arr[j + 1];
    }
    arr[arr.length - 1] = null;

    setFeedback(`Deleted value at index ${idxRaw} (shifted left).`, 'ok');
    renderArray(new Set(), null, idxRaw);
  });

  searchBtn.addEventListener('click', () => {
    const pattern = parsePattern(patternInput.value);
    if (pattern.length === 0) {
      setFeedback('Enter a comma-separated pattern, e.g., 2,1,4', 'warn');
      return;
    }

    const start = linearSubarraySearch(arr, pattern);
    if (start === -1) {
      setFeedback('Pattern not found.', 'bad');
      renderArray(new Set());
      return;
    }

    const highlightIdx = new Set();
    for (let k = 0; k < pattern.length; k++) highlightIdx.add(start + k);

    setFeedback(`Pattern found at index ${start}!`, 'ok');
    renderArray(highlightIdx);
  });

  resetBtn.addEventListener('click', () => {
    arr = new Array(10).fill(null);
    setFeedback('Array reset.', 'ok');
    renderArray();
  });

  // Initial paint
  renderArray();
  setFeedback('Ready.');
})();