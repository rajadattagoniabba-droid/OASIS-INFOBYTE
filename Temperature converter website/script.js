// Interactive Logic for the Temperature Converter

document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const card = document.getElementById('converter-card');
  const degreesInput = document.getElementById('degrees-input');
  const unitSelect = document.getElementById('unit-select');
  const degreesGroup = document.getElementById('degrees-group');
  const errorTooltip = document.getElementById('error-tooltip');
  
  const resultPrimary = document.getElementById('result-primary');
  const resultSecondary = document.getElementById('result-secondary');
  const convertBtn = document.getElementById('convert-btn');
  
  const themeToggle = document.getElementById('theme-toggle');
  const clearBtn = document.getElementById('clear-btn');
  
  const gaugeFill = document.getElementById('gauge-fill');
  const visualizerTempText = document.getElementById('visualizer-temp-text');

  // 1. Manual Light/Dark Theme Switcher (falls back to system settings)
  const savedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
    document.body.classList.add('dark-mode');
  } else {
    document.body.classList.remove('dark-mode');
  }

  themeToggle.addEventListener('click', () => {
    const isDark = document.body.classList.toggle('dark-mode');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  });

  // 2. Real-time Clock in the iOS Status Bar
  function tickClock() {
    const statusTime = document.getElementById('status-time');
    const now = new Date();
    let hours = now.getHours();
    let minutes = now.getMinutes();
    minutes = minutes < 10 ? '0' + minutes : minutes;
    statusTime.textContent = `${hours}:${minutes}`;
  }
  tickClock();
  setInterval(tickClock, 60000);

  // Formatting utility to avoid long trailing decimals, capping at 4 decimal places
  function formatTemp(value) {
    return Math.round(value * 10000) / 10000;
  }

  // Error styling handlers
  function showError(msg) {
    errorTooltip.textContent = msg;
    degreesGroup.classList.add('invalid');
  }

  function clearError() {
    degreesGroup.classList.remove('invalid');
  }

  function triggerShake() {
    card.classList.remove('shake');
    void card.offsetWidth; // trigger reflow
    card.classList.add('shake');
    setTimeout(() => {
      card.classList.remove('shake');
    }, 350);
  }

  // Reset visualizer gauge
  function resetVisualizer() {
    gaugeFill.style.width = '0%';
    gaugeFill.style.background = 'var(--border-color)';
    visualizerTempText.textContent = '--';
    visualizerTempText.style.color = 'var(--text-secondary)';
  }

  // Update visualizer thermometer gauge based on Celsius value
  function updateVisualizer(celsiusTemp) {
    // Map -20C to 50C as a 0% to 100% scale
    const minC = -20;
    const maxC = 50;
    let percentage = ((celsiusTemp - minC) / (maxC - minC)) * 100;
    percentage = Math.max(0, Math.min(100, percentage));
    
    // Set width
    gaugeFill.style.width = `${percentage}%`;
    
    // Set gradient color & text label color based on temperature range
    let gradient = '';
    let textColor = '';
    
    if (celsiusTemp < 0) {
      // Freezing (Ice Blue)
      gradient = 'linear-gradient(90deg, #1fa2ff 0%, #12d6df 100%)';
      textColor = '#007aff';
    } else if (celsiusTemp < 15) {
      // Cold (Teal)
      gradient = 'linear-gradient(90deg, #4facfe 0%, #00f2fe 100%)';
      textColor = '#00a2b3';
    } else if (celsiusTemp < 28) {
      // Pleasant (Emerald Green)
      gradient = 'linear-gradient(90deg, #11998e 0%, #38ef7d 100%)';
      textColor = '#28cd41';
    } else if (celsiusTemp < 38) {
      // Warm (Sunny Orange)
      gradient = 'linear-gradient(90deg, #f6d365 0%, #fda085 100%)';
      textColor = '#ff9500';
    } else {
      // Hot (Crimson Red)
      gradient = 'linear-gradient(90deg, #ff0844 0%, #ffb199 100%)';
      textColor = '#ff3b30';
    }
    
    gaugeFill.style.background = gradient;
    visualizerTempText.textContent = `${formatTemp(celsiusTemp)} °C`;
    visualizerTempText.style.color = textColor;
  }

  // 3. Clear Input Button Toggle
  function updateClearBtnVisibility() {
    if (degreesInput.value.length > 0) {
      clearBtn.style.display = 'flex';
    } else {
      clearBtn.style.display = 'none';
    }
  }

  clearBtn.addEventListener('click', () => {
    degreesInput.value = '';
    clearError();
    resetVisualizer();
    resultPrimary.value = '';
    resultSecondary.value = '';
    updateClearBtnVisibility();
    degreesInput.focus();
  });

  // Main Conversion Function
  function performConversion(silent = false) {
    const rawVal = degreesInput.value.trim();

    // 1. Validation checks
    if (rawVal === '') {
      if (!silent) {
        showError('Please enter a temperature');
        triggerShake();
      }
      resultPrimary.value = '--';
      resultSecondary.value = '--';
      resetVisualizer();
      return;
    }

    // A decimal/integer match including optional minus sign
    const numRegex = /^-?\d*\.?\d+$/;
    if (!numRegex.test(rawVal) || isNaN(parseFloat(rawVal))) {
      if (!silent) {
        showError('Please enter a valid number');
        triggerShake();
      }
      resultPrimary.value = '--';
      resultSecondary.value = '--';
      resetVisualizer();
      return;
    }

    // Success - clear errors
    clearError();
    
    const temp = parseFloat(rawVal);
    const unit = unitSelect.value;
    let converted1 = 0;
    let label1 = '';
    let converted2 = 0;
    let label2 = '';
    let celsiusVal = 0;

    // 2. Perform conversions and retrieve Celsius value for gauge
    switch (unit) {
      case 'F':
        // Fahrenheit to Celsius and Kelvin
        converted1 = (temp - 32) * 5/9;
        label1 = '°C';
        converted2 = (temp - 32) * 5/9 + 273.15;
        label2 = 'K';
        celsiusVal = converted1;
        break;
      case 'C':
        // Celsius to Fahrenheit and Kelvin
        converted1 = (temp * 9/5) + 32;
        label1 = '°F';
        converted2 = temp + 273.15;
        label2 = 'K';
        celsiusVal = temp;
        break;
      case 'K':
        // Kelvin to Celsius and Fahrenheit
        converted1 = temp - 273.15;
        label1 = '°C';
        converted2 = (temp - 273.15) * 9/5 + 32;
        label2 = '°F';
        celsiusVal = converted1;
        break;
    }

    // 3. Display Results
    resultPrimary.value = `${formatTemp(converted1)} ${label1}`;
    resultSecondary.value = `${formatTemp(converted2)} ${label2}`;

    // 4. Update the visual temperature thermometer scale
    updateVisualizer(celsiusVal);

    // 5. Trigger premium focus highlight animation (only if manually clicked or submitted)
    if (!silent) {
      [resultPrimary, resultSecondary].forEach(el => {
        el.classList.remove('result-highlight');
        void el.offsetWidth; // trigger reflow
        el.classList.add('result-highlight');
      });
    }
  }

  // Event Listeners
  convertBtn.addEventListener('click', () => performConversion(false));

  // Convert on pressing enter in the input field
  degreesInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      performConversion(false);
    }
  });

  // Automatically convert when changing the dropdown option
  unitSelect.addEventListener('change', () => {
    if (degreesInput.value.trim() !== '') {
      performConversion(true);
    }
  });

  // Real-time calculation listener as they type
  degreesInput.addEventListener('input', () => {
    updateClearBtnVisibility();
    const val = degreesInput.value.trim();

    // Reset results if empty
    if (val === '') {
      clearError();
      resultPrimary.value = '';
      resultSecondary.value = '';
      resetVisualizer();
      return;
    }

    // Don't show validation errors if the input is incomplete (e.g. typing minus sign "-")
    if (val === '-' || val === '.' || val === '-.') {
      resultPrimary.value = '--';
      resultSecondary.value = '--';
      resetVisualizer();
      return;
    }

    const numRegex = /^-?\d*\.?\d+$/;
    if (!numRegex.test(val) || isNaN(parseFloat(val))) {
      // Input is explicitly invalid (e.g., characters like "abc")
      showError('Please enter a valid number');
      resultPrimary.value = '--';
      resultSecondary.value = '--';
      resetVisualizer();
    } else {
      clearError();
      performConversion(true); // Convert silently during typing
    }
  });

  // Initialization
  resetVisualizer();
});
