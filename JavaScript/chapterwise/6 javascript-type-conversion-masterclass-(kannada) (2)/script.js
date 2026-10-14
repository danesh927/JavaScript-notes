/**
 * JavaScript Type Conversion Masterclass
 * Pure Vanilla JavaScript Interactive Learning Engine
 * Zero Frameworks, 100% Native DOM APIs
 */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initReadingProgress();
  initSidebar();
  initSearch();
  initCompletionTracker();
  initConversionLab();
  initCodeRunners();
  initAnimations();
  initQuiz();
});

/* ==========================================================================
   1. Theme Management (Light / Dark)
   ========================================================================== */
function initTheme() {
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const themeIconSun = document.getElementById('themeIconSun');
  const themeIconMoon = document.getElementById('themeIconMoon');
  
  const savedTheme = localStorage.getItem('js_tc_theme') || 
    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

  applyTheme(savedTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      applyTheme(newTheme);
      localStorage.setItem('js_tc_theme', newTheme);
    });
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    if (themeIconSun && themeIconMoon) {
      if (theme === 'dark') {
        themeIconSun.style.display = 'inline-block';
        themeIconMoon.style.display = 'none';
      } else {
        themeIconSun.style.display = 'none';
        themeIconMoon.style.display = 'inline-block';
      }
    }
  }
}

/* ==========================================================================
   2. Reading Progress & Back-to-Top
   ========================================================================== */
function initReadingProgress() {
  const progressBar = document.getElementById('readingProgressBar');
  const backToTopBtn = document.getElementById('backToTopBtn');
  const sections = document.querySelectorAll('.topic-section');
  const tocLinks = document.querySelectorAll('.toc-link');

  window.addEventListener('scroll', () => {
    const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = height > 0 ? (winScroll / height) * 100 : 0;

    if (progressBar) {
      progressBar.style.width = `${scrolled}%`;
    }

    if (backToTopBtn) {
      if (winScroll > 400) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }

    // Update active TOC item based on scroll position
    let currentSectionId = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      if (winScroll >= sectionTop) {
        currentSectionId = section.getAttribute('id');
      }
    });

    if (currentSectionId) {
      tocLinks.forEach(link => {
        if (link.getAttribute('href') === `#${currentSectionId}`) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      });
    }
  });

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
}

/* ==========================================================================
   3. Sidebar Navigation & Mobile Drawer
   ========================================================================== */
function initSidebar() {
  const menuToggleBtn = document.getElementById('menuToggleBtn');
  const sidebarLeft = document.getElementById('sidebarLeft');

  if (menuToggleBtn && sidebarLeft) {
    menuToggleBtn.addEventListener('click', () => {
      sidebarLeft.classList.toggle('open');
    });

    // Close when clicking a TOC link on mobile
    const links = sidebarLeft.querySelectorAll('.toc-link');
    links.forEach(link => {
      link.addEventListener('click', () => {
        if (window.innerWidth <= 900) {
          sidebarLeft.classList.remove('open');
        }
      });
    });

    // Close when clicking outside
    document.addEventListener('click', (e) => {
      if (window.innerWidth <= 900 && 
          !sidebarLeft.contains(e.target) && 
          !menuToggleBtn.contains(e.target) && 
          sidebarLeft.classList.contains('open')) {
        sidebarLeft.classList.remove('open');
      }
    });
  }
}

/* ==========================================================================
   4. Search & Filter
   ========================================================================== */
function initSearch() {
  const searchInput = document.getElementById('searchInput');
  const searchClearBtn = document.getElementById('searchClearBtn');
  const topicSections = document.querySelectorAll('.topic-section');

  if (!searchInput) return;

  searchInput.addEventListener('input', () => {
    const query = searchInput.value.trim().toLowerCase();

    if (searchClearBtn) {
      searchClearBtn.style.display = query ? 'inline-block' : 'none';
    }

    if (!query) {
      removeHighlights();
      topicSections.forEach(sec => sec.style.display = '');
      return;
    }

    topicSections.forEach(section => {
      const text = section.innerText.toLowerCase();
      if (text.includes(query)) {
        section.style.display = '';
      } else {
        section.style.display = 'none';
      }
    });
  });

  if (searchClearBtn) {
    searchClearBtn.addEventListener('click', () => {
      searchInput.value = '';
      searchClearBtn.style.display = 'none';
      topicSections.forEach(sec => sec.style.display = '');
      removeHighlights();
      searchInput.focus();
    });
  }

  function removeHighlights() {
    const highlights = document.querySelectorAll('mark.search-highlight');
    highlights.forEach(h => {
      const parent = h.parentNode;
      parent.replaceChild(document.createTextNode(h.textContent), h);
      parent.normalize();
    });
  }
}

/* ==========================================================================
   5. Topic Completion Tracker
   ========================================================================== */
function initCompletionTracker() {
  const completeButtons = document.querySelectorAll('.section-complete-btn');
  const completedCountSpan = document.getElementById('completedCount');
  const totalCountSpan = document.getElementById('totalCount');

  let completedSet = new Set(JSON.parse(localStorage.getItem('js_tc_completed') || '[]'));

  if (totalCountSpan) {
    totalCountSpan.textContent = completeButtons.length;
  }

  function updateUI() {
    completeButtons.forEach(btn => {
      const targetId = btn.getAttribute('data-target');
      const isCompleted = completedSet.has(targetId);
      const tocLink = document.querySelector(`.toc-link[href="#${targetId}"]`);

      if (isCompleted) {
        btn.classList.add('active');
        btn.querySelector('.btn-text').textContent = 'Completed ✓ (ಪೂರ್ಣಗೊಂಡಿದೆ)';
        if (tocLink) tocLink.classList.add('is-completed');
      } else {
        btn.classList.remove('active');
        btn.querySelector('.btn-text').textContent = 'Mark Completed (ಓದಿದ್ದೇನೆ)';
        if (tocLink) tocLink.classList.remove('is-completed');
      }
    });

    if (completedCountSpan) {
      completedCountSpan.textContent = completedSet.size;
    }

    localStorage.setItem('js_tc_completed', JSON.stringify(Array.from(completedSet)));
  }

  completeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target');
      if (completedSet.has(targetId)) {
        completedSet.delete(targetId);
      } else {
        completedSet.add(targetId);
      }
      updateUI();
    });
  });

  updateUI();
}

/* ==========================================================================
   6. Live Interactive Type Conversion Lab
   ========================================================================== */
function initConversionLab() {
  const labValueInput = document.getElementById('labValueInput');
  const labMethodSelect = document.getElementById('labMethodSelect');
  const labOriginalType = document.getElementById('labOriginalType');
  const labConvertedValue = document.getElementById('labConvertedValue');
  const labConvertedType = document.getElementById('labConvertedType');
  const labStatusBadge = document.getElementById('labStatusBadge');
  const labExplanationText = document.getElementById('labExplanationText');
  const presetChips = document.querySelectorAll('.preset-chip');

  if (!labValueInput || !labMethodSelect) return;

  function evaluateConversion() {
    const rawInput = labValueInput.value;
    const method = labMethodSelect.value;

    let originalVal;
    let originalTypeStr = 'unknown';

    // Parse user input safely into primitive or object
    try {
      if (rawInput === 'null') {
        originalVal = null;
        originalTypeStr = 'null';
      } else if (rawInput === 'undefined') {
        originalVal = undefined;
        originalTypeStr = 'undefined';
      } else if (rawInput === 'true') {
        originalVal = true;
        originalTypeStr = 'boolean';
      } else if (rawInput === 'false') {
        originalVal = false;
        originalTypeStr = 'boolean';
      } else if (rawInput === 'NaN') {
        originalVal = NaN;
        originalTypeStr = 'number (NaN)';
      } else if (rawInput === '[]') {
        originalVal = [];
        originalTypeStr = 'object (Array)';
      } else if (rawInput === '[1, 2]') {
        originalVal = [1, 2];
        originalTypeStr = 'object (Array)';
      } else if (rawInput === '{}') {
        originalVal = {};
        originalTypeStr = 'object (Object)';
      } else if (/^-?\d+(\.\d+)?$/.test(rawInput)) {
        originalVal = Number(rawInput);
        originalTypeStr = 'number';
      } else {
        // String literal representation
        let cleaned = rawInput;
        if ((cleaned.startsWith('"') && cleaned.endsWith('"')) || (cleaned.startsWith("'") && cleaned.endsWith("'"))) {
          cleaned = cleaned.slice(1, -1);
        }
        originalVal = cleaned;
        originalTypeStr = 'string';
      }
    } catch {
      originalVal = rawInput;
      originalTypeStr = 'string';
    }

    labOriginalType.textContent = originalTypeStr;

    let convertedVal;
    let convertedTypeStr = '';
    let statusText = 'Success (ಯಶಸ್ವಿ)';
    let isError = false;
    let explanation = '';

    try {
      switch (method) {
        case 'Number':
          convertedVal = Number(originalVal);
          convertedTypeStr = typeof convertedVal;
          if (Number.isNaN(convertedVal)) {
            statusText = 'NaN (Not a Number)';
            explanation = `JavaScript Engine '${formatVal(originalVal)}' ಅನ್ನು ಮಾನ್ಯ ಸಂಖ್ಯಾತ್ಮಕ ರೂಪಕ್ಕೆ ಪರಿವರ್ತಿಸಲು ವಿಫಲವಾದ್ದರಿಂದ 'NaN' (Not-a-Number) ನೀಡಿದೆ. ಗಮನಿಸಿ: NaN ನ ಪ್ರಕಾರ ಕೂಡ 'number' ಆಗಿದೆ!`;
          } else {
            explanation = `ECMAScript 'ToNumber' ನಿಯಮದಂತೆ '${formatVal(originalVal)}' ಅನ್ನು ${convertedVal} ಸಂಖ್ಯೆಯಾಗಿ ಯಶಸ್ವಿಯಾಗಿ ಪರಿವರ್ತಿಸಲಾಗಿದೆ.`;
          }
          break;

        case 'String':
          convertedVal = String(originalVal);
          convertedTypeStr = typeof convertedVal;
          explanation = `ECMAScript 'ToString' ನಿಯಮದಂತೆ ಮೌಲ್ಯವನ್ನು ಸ್ಟ್ರಿಂಗ್ ರೂಪಕ್ಕೆ ಬದಲಾಯಿಸಲಾಗಿದೆ. 'String(null)' -> "null", 'String(undefined)' -> "undefined" ಆಗುತ್ತದೆ ಮತ್ತು ಯಾವುದೇ Error ನೀಡುವುದಿಲ್ಲ.`;
          break;

        case 'Boolean':
          convertedVal = Boolean(originalVal);
          convertedTypeStr = typeof convertedVal;
          if (convertedVal === false) {
            explanation = `'${formatVal(originalVal)}' ಜಾವಾಸ್ಕ್ರಿಪ್ಟ್ನ 6 ಪ್ರಮುಖ Falsy ಮೌಲ್ಯಗಳಲ್ಲಿ (0, "", null, undefined, NaN, false) ಒಂದಾಗಿದೆ. ಆದ್ದರಿಂದ Boolean() ಫಲಿತಾಂಶ 'false' ಆಗಿದೆ.`;
          } else {
            explanation = `'${formatVal(originalVal)}' Falsy ಅಲ್ಲದ ಮೌಲ್ಯ (Truthy). ನೆನಪಿಡಿ: ಖಾಲಿ ಅರೇ [] ಮತ್ತು ಖಾಲಿ ಆಬ್ಜೆಕ್ಟ್ {} ಕೂಡ Truthy ಆಗಿರುತ್ತವೆ!`;
          }
          break;

        case 'parseInt':
          convertedVal = parseInt(String(originalVal), 10);
          convertedTypeStr = typeof convertedVal;
          if (Number.isNaN(convertedVal)) {
            statusText = 'NaN';
            explanation = `parseInt() ಮೊದಲ ಅಕ್ಷರದಿಂದಲೇ ಅಂಕೆಗಳನ್ನು ಹುಡುಕಲು ಆರಂಭಿಸುತ್ತದೆ. ಮೊದಲ ಅಕ್ಷರ ಸಂಖ್ಯೆಯಲ್ಲದಿದ್ದರೆ NaN ನೀಡುತ್ತದೆ.`;
          } else {
            explanation = `parseInt() ಸ್ಟ್ರಿಂಗ್ನ ಮೊದಲ ಅಂಕೆಗಳನ್ನು ಪೂರ್ಣಾಂಕವಾಗಿ (Integer) ಓದುತ್ತದೆ ಮತ್ತು ಅಕ್ಷರಗಳು ಎದುರಾದಲ್ಲಿ ನಿಲ್ಲಿಸುತ್ತದೆ.`;
          }
          break;

        case 'parseFloat':
          convertedVal = parseFloat(String(originalVal));
          convertedTypeStr = typeof convertedVal;
          explanation = `parseFloat() ದಶಮಾಂಶ ಬಿಂದು (decimal point) ಹೊಂದಿರುವ ಸಂಖ್ಯೆಗಳನ್ನು ನಿಖರವಾಗಿ ಪರಿವರ್ತಿಸುತ್ತದೆ.`;
          break;

        case 'unaryPlus':
          convertedVal = +originalVal;
          convertedTypeStr = typeof convertedVal;
          explanation = `Unary '+' ಆಪರೇಟರ್ Number() ಫಂಕ್ಷನ್ನಂತೆಯೇ ಆಂತರಿಕವಾಗಿ 'ToNumber' ಆಲ್ಗೋರಿದಂ ಅನ್ನು ಚಲಾಯಿಸುತ್ತದೆ.`;
          break;

        case 'toString':
          if (originalVal === null || originalVal === undefined) {
            throw new TypeError(`Cannot read properties of ${originalVal} (reading 'toString')`);
          }
          convertedVal = originalVal.toString();
          convertedTypeStr = typeof convertedVal;
          explanation = `.toString() ಆಬ್ಜೆಕ್ಟ್ ಪ್ರೋಟೋಟೈಪ್ ಮೆಥಡ್ ಆಗಿದ್ದು, ${formatVal(originalVal)} ಅನ್ನು ಸ್ಟ್ರಿಂಗ್ ಆಗಿ ಪರಿವರ್ತಿಸಿದೆ.`;
          break;
      }
    } catch (err) {
      isError = true;
      convertedVal = err.name;
      convertedTypeStr = 'Exception';
      statusText = 'TypeError (ದೋಷ)';
      explanation = `ವಿಶೇಷ ಎಚ್ಚರಿಕೆ: null ಅಥವಾ undefined ಮೇಲೆ .toString() ಮೆಥಡ್ ಕರೆದರೆ JavaScript 'TypeError' ಎಸೆಯುತ್ತದೆ! ಏಕೆಂದರೆ ಅವುಗಳಿಗೆ Object Wrapper ಇರುವುದಿಲ್ಲ. ಬದಲಿಗೆ ಸುರಕ್ಷಿತವಾಗಿ String(${originalVal}) ಬಳಸಬೇಕು.`;
    }

    labConvertedValue.textContent = formatVal(convertedVal);
    labConvertedType.textContent = convertedTypeStr;
    labStatusBadge.textContent = statusText;
    labStatusBadge.style.color = isError ? 'var(--accent-rose)' : (convertedVal === 'NaN' || Number.isNaN(convertedVal) ? 'var(--accent-amber)' : 'var(--accent-emerald)');
    labExplanationText.textContent = explanation;
  }

  function formatVal(v) {
    if (v === null) return 'null';
    if (v === undefined) return 'undefined';
    if (typeof v === 'string') return `"${v}"`;
    if (typeof v === 'object') return Array.isArray(v) ? `[${v.join(', ')}]` : '{...}';
    return String(v);
  }

  labValueInput.addEventListener('input', evaluateConversion);
  labMethodSelect.addEventListener('change', evaluateConversion);

  presetChips.forEach(chip => {
    chip.addEventListener('click', () => {
      labValueInput.value = chip.getAttribute('data-val');
      evaluateConversion();
    });
  });

  evaluateConversion();
}

/* ==========================================================================
   7. Code Runners & Playgrounds
   ========================================================================== */
function initCodeRunners() {
  const codeWrappers = document.querySelectorAll('.code-wrapper');

  codeWrappers.forEach(wrapper => {
    const runBtn = wrapper.querySelector('.btn-run');
    const resetBtn = wrapper.querySelector('.btn-reset');
    const copyBtn = wrapper.querySelector('.btn-copy');
    const stepBtn = wrapper.querySelector('.btn-step');
    const codePre = wrapper.querySelector('.code-pre');
    const outputContent = wrapper.querySelector('.output-content');
    const stepBox = wrapper.querySelector('.step-explanation-box');

    const defaultCode = codePre ? codePre.textContent : '';

    if (runBtn && outputContent && codePre) {
      runBtn.addEventListener('click', () => {
        executeSnippet(codePre.textContent, outputContent);
      });
    }

    if (resetBtn && codePre && outputContent) {
      resetBtn.addEventListener('click', () => {
        codePre.textContent = defaultCode;
        outputContent.textContent = 'Code reset. Click "Run Code" to execute.';
        outputContent.classList.remove('output-error');
      });
    }

    if (copyBtn && codePre) {
      copyBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(codePre.textContent).then(() => {
          const originalText = copyBtn.textContent;
          copyBtn.textContent = 'Copied! ✓';
          setTimeout(() => copyBtn.textContent = originalText, 1500);
        });
      });
    }

    if (stepBtn && stepBox) {
      stepBtn.addEventListener('click', () => {
        stepBox.classList.toggle('visible');
      });
    }
  });

  function executeSnippet(codeString, outputElement) {
    const logs = [];
    const customConsole = {
      log: (...args) => {
        logs.push(args.map(arg => {
          if (typeof arg === 'object') {
            try {
              return JSON.stringify(arg);
            } catch {
              return String(arg);
            }
          }
          return String(arg);
        }).join(' '));
      },
      error: (...args) => {
        logs.push('[Error] ' + args.join(' '));
      }
    };

    try {
      // Safe execution context without window/DOM manipulation
      const safeRunner = new Function('console', `
        "use strict";
        try {
          ${codeString}
        } catch(e) {
          console.error(e.name + ": " + e.message);
        }
      `);
      safeRunner(customConsole);

      if (logs.length > 0) {
        outputElement.textContent = logs.join('\n');
        outputElement.classList.remove('output-error');
      } else {
        outputElement.textContent = 'Code executed successfully (no console output).';
      }
    } catch (err) {
      outputElement.textContent = `Syntax/Runtime Error: ${err.message}`;
      outputElement.classList.add('output-error');
    }
  }
}

/* ==========================================================================
   8. Interactive Visual Animations
   ========================================================================== */
function initAnimations() {
  // Animation 1: Number conversion ("123" -> 123)
  const numAnimStage = document.getElementById('numAnimStage');
  const numAnimPlay = document.getElementById('numAnimPlay');
  const numAnimReset = document.getElementById('numAnimReset');

  if (numAnimStage && numAnimPlay) {
    numAnimPlay.addEventListener('click', () => {
      numAnimStage.classList.add('anim-active');
      const targetVal = numAnimStage.querySelector('.anim-target-val');
      const targetType = numAnimStage.querySelector('.anim-target-type');
      if (targetVal) targetVal.textContent = '123';
      if (targetType) targetType.textContent = 'number';
    });

    if (numAnimReset) {
      numAnimReset.addEventListener('click', () => {
        numAnimStage.classList.remove('anim-active');
        const targetVal = numAnimStage.querySelector('.anim-target-val');
        const targetType = numAnimStage.querySelector('.anim-target-type');
        if (targetVal) targetVal.textContent = '?';
        if (targetType) targetType.textContent = 'waiting...';
      });
    }
  }

  // Animation 2: Implicit Coercion ("5" + 2 vs "5" - 2)
  const opAnimPlus = document.getElementById('opAnimPlus');
  const opAnimMinus = document.getElementById('opAnimMinus');
  const opAnimResultVal = document.getElementById('opAnimResultVal');
  const opAnimResultType = document.getElementById('opAnimResultType');
  const opAnimDesc = document.getElementById('opAnimDesc');

  if (opAnimPlus && opAnimMinus) {
    opAnimPlus.addEventListener('click', () => {
      opAnimResultVal.textContent = '"52"';
      opAnimResultType.textContent = 'string';
      opAnimDesc.textContent = `"+" ಆಪರೇಟರ್ನಲ್ಲಿ ಒಂದು ಬದಿಯಲ್ಲಿ String ("5") ಇದ್ದರೆ, JavaScript ಎರಡನೇ ಮೌಲ್ಯವಾದ 2 ಅನ್ನು String ("2") ಆಗಿ ಪರಿವರ್ತಿಸಿ Concatenation (ಜೋಡಣೆ) ಮಾಡುತ್ತದೆ. ಫಲಿತಾಂಶ: "52"`;
      opAnimPlus.classList.add('active');
      opAnimMinus.classList.remove('active');
    });

    opAnimMinus.addEventListener('click', () => {
      opAnimResultVal.textContent = '3';
      opAnimResultType.textContent = 'number';
      opAnimDesc.textContent = `"-" ಆಪರೇಟರ್ String Concatenation ಮಾಡುವುದಿಲ್ಲ! ಇದು ಕೇವಲ ಗಣಿತದ ವ್ಯವಕಲನ ಮಾತ್ರ. ಆದ್ದರಿಂದ "5" ಅನ್ನು ಸಂಖ್ಯಾತ್ಮಕ 5 ಆಗಿ ಬದಲಾಯಿಸಿ 5 - 2 = 3 ನೀಡುತ್ತದೆ.`;
      opAnimMinus.classList.add('active');
      opAnimPlus.classList.remove('active');
    });
  }

  // Animation 3: Edge Cases Step Player
  const edgeCases = [
    { expr: 'true + false', step1: 'true → 1, false → 0', step2: '1 + 0', result: '1 (number)', desc: 'Boolean ಮೌಲ್ಯಗಳು ಗಣಿತದ "+" ಆಪರೇಟರ್ನಲ್ಲಿ 1 ಮತ್ತು 0 ಆಗಿ ಪರಿವರ್ತನೆಗೊಳ್ಳುತ್ತವೆ.' },
    { expr: '12 / "6"', step1: '"6" → 6 (Number coercion)', step2: '12 / 6', result: '2 (number)', desc: '"/" ಆಪರೇಟರ್ ಕೇವಲ ಸಂಖ್ಯೆಗಳನ್ನು ಮಾತ್ರ ವಿಭಾಗಿಸುತ್ತದೆ, ಆದ್ದರಿಂದ "6" ಸಂಖ್ಯೆ 6 ಆಗುತ್ತದೆ.' },
    { expr: 'null + 1', step1: 'null → 0 (ToNumber)', step2: '0 + 1', result: '1 (number)', desc: 'null ಅನ್ನು ಸಂಖ್ಯೆಯಾಗಿ ಬದಲಾಯಿಸಿದಾಗ 0 ಆಗುತ್ತದೆ. 0 + 1 = 1.' },
    { expr: 'undefined + 1', step1: 'undefined → NaN (ToNumber)', step2: 'NaN + 1', result: 'NaN (number)', desc: 'undefined ಅನ್ನು ಸಂಖ್ಯೆಯಾಗಿ ಬದಲಾಯಿಸಿದರೆ NaN ಆಗುತ್ತದೆ. NaN ನೊಂದಿಗೆ ಯಾವುದೇ ಲೆಕ್ಕಾಚಾರ ಮಾಡಿದರೂ ಫಲಿತಾಂಶ NaN!' },
    { expr: '+""', step1: '"" → 0 (Empty string to number)', step2: '+ 0', result: '0 (number)', desc: 'Unary + ಖಾಲಿ ಸ್ಟ್ರಿಂಗ್ ಅನ್ನು 0 ಆಗಿ ಪರಿವರ್ತಿಸುತ್ತದೆ.' },
    { expr: '[] + []', step1: '[].toString() → "", [].toString() → ""', step2: '"" + ""', result: '"" (empty string)', desc: 'ಖಾಲಿ ಅರೇಗಳು ಸ್ಟ್ರಿಂಗ್ ಆಗಿ ಬದಲಾದಾಗ ಖಾಲಿ ಸ್ಟ್ರಿಂಗ್ "" ನೀಡುತ್ತವೆ. "" + "" = "".' },
    { expr: '[] + {}', step1: '[].toString() → "", ({}).toString() → "[object Object]"', step2: '"" + "[object Object]"', result: '"[object Object]"', desc: 'ಅರೇ "" ಆಗುತ್ತದೆ ಮತ್ತು ಆಬ್ಜೆಕ್ಟ್ "[object Object]" ಆಗುತ್ತದೆ. ಎರಡೂ ಜೋಡಣೆಗೊಂಡು "[object Object]" ಬರುತ್ತದೆ.' }
  ];

  let currentEdgeIdx = 0;
  const edgeExprEl = document.getElementById('edgeExpr');
  const edgeStep1El = document.getElementById('edgeStep1');
  const edgeResultEl = document.getElementById('edgeResult');
  const edgeDescEl = document.getElementById('edgeDesc');
  const edgeNextBtn = document.getElementById('edgeNextBtn');
  const edgePrevBtn = document.getElementById('edgePrevBtn');

  function renderEdgeCase() {
    const item = edgeCases[currentEdgeIdx];
    if (!edgeExprEl) return;
    edgeExprEl.textContent = item.expr;
    edgeStep1El.textContent = `${item.step1} ➔ ${item.step2}`;
    edgeResultEl.textContent = item.result;
    edgeDescEl.textContent = item.desc;
  }

  if (edgeNextBtn) {
    edgeNextBtn.addEventListener('click', () => {
      currentEdgeIdx = (currentEdgeIdx + 1) % edgeCases.length;
      renderEdgeCase();
    });
  }

  if (edgePrevBtn) {
    edgePrevBtn.addEventListener('click', () => {
      currentEdgeIdx = (currentEdgeIdx - 1 + edgeCases.length) % edgeCases.length;
      renderEdgeCase();
    });
  }

  renderEdgeCase();
}

/* ==========================================================================
   9. Quiz & Self-Assessment Engine
   ========================================================================== */
function initQuiz() {
  const quizCards = document.querySelectorAll('.quiz-card');
  const quizScoreDisplay = document.getElementById('quizScoreDisplay');
  let score = 0;
  let answeredQuestions = new Set();

  quizCards.forEach((card, index) => {
    const options = card.querySelectorAll('.quiz-option-btn');
    const feedback = card.querySelector('.quiz-feedback');
    const correctIndex = parseInt(card.getAttribute('data-correct'), 10);
    const explanation = card.getAttribute('data-explanation');

    options.forEach((btn, optIndex) => {
      btn.addEventListener('click', () => {
        if (answeredQuestions.has(index)) return; // prevent multiple attempts per question
        answeredQuestions.add(index);

        options.forEach(b => b.disabled = true);

        if (optIndex === correctIndex) {
          btn.classList.add('correct');
          feedback.classList.add('visible', 'is-correct');
          feedback.innerHTML = `<strong>ಸರಿಯಾದ ಉತ್ತರ! ✓ (Correct)</strong><br>${explanation}`;
          score++;
        } else {
          btn.classList.add('incorrect');
          options[correctIndex].classList.add('correct');
          feedback.classList.add('visible', 'is-incorrect');
          feedback.innerHTML = `<strong>ತಪ್ಪಾದ ಉತ್ತರ ✗ (Incorrect)</strong><br>${explanation}`;
        }

        if (quizScoreDisplay) {
          quizScoreDisplay.textContent = `${score} / ${quizCards.length}`;
        }
      });
    });
  });
}
