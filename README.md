
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Smart Multi-Mode Calculator</title>
  <style>
    * { box-sizing: border-box; }
    body {
      font-family: Arial, sans-serif;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      margin: 0;
      background: linear-gradient(135deg, #0f2027, #203a43, #2c5364);
      transition: 0.3s;
    }
    body.light {
      background: #f0f0f0;
      color: #222;
    }

    .calculator {
      width: 340px;
      background: rgba(255,255,255,0.05);
      border-radius: 15px;
      box-shadow: 0 8px 25px rgba(0,0,0,0.5);
      padding: 15px;
      backdrop-filter: blur(10px);
      color: #fff;
      transition: 0.3s;
    }
    body.light .calculator {
      background: #fff;
      color: #000;
    }

    /* Display */
    .display {
      width: 100%;
      padding: 12px;
      font-size: 20px;
      border: none;
      border-radius: 10px;
      margin-bottom: 12px;
      text-align: right;
    }

    /* Mode Toggle */
    .mode-toggle {
      position: relative;
      margin-bottom: 12px;
    }
    .mode-btn {
      width: 100%;
      padding: 12px;
      font-size: 16px;
      font-weight: bold;
      border: none;
      border-radius: 10px;
      cursor: pointer;
      background: linear-gradient(135deg, #ff416c, #ff4b2b);
      color: #fff;
      transition: 0.3s;
    }
    .mode-btn:hover {
      box-shadow: 0 0 10px #ff416c;
    }
    .mode-menu {
      position: absolute;
      top: 110%;
      left: 0;
      width: 100%;
      background: rgba(255,255,255,0.1);
      border-radius: 10px;
      backdrop-filter: blur(15px);
      box-shadow: 0 5px 20px rgba(0,0,0,0.3);
      opacity: 0;
      transform: translateY(-10px);
      pointer-events: none;
      transition: all 0.3s ease;
      z-index: 10;
    }
    .mode-menu.active {
      opacity: 1;
      transform: translateY(0);
      pointer-events: auto;
    }
    .mode-menu button {
      width: 100%;
      padding: 12px;
      background: transparent;
      border: none;
      color: inherit;
      font-size: 15px;
      cursor: pointer;
      transition: 0.3s;
      text-align: left;
    }
    .mode-menu button:hover {
      background: linear-gradient(135deg, #1e3c72, #2a5298);
      color: #fff;
    }

    /* Buttons grid */
    .buttons {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 8px;
    }
    .buttons button {
      padding: 15px;
      font-size: 18px;
      border: none;
      border-radius: 10px;
      cursor: pointer;
      background: rgba(255,255,255,0.1);
      color: inherit;
      transition: 0.3s;
    }
    .buttons button:hover {
      background: linear-gradient(135deg, #1e3c72, #2a5298);
    }

    /* Dark mode toggle */
    .dark-toggle {
      margin: 10px 0;
      text-align: center;
    }
    .dark-toggle button {
      padding: 8px 15px;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      background: linear-gradient(135deg, #2193b0, #6dd5ed);
      color: #fff;
      font-weight: bold;
    }
  </style>
</head>
<body>
  <div class="calculator">
    <!-- Dark mode toggle -->
    <div class="dark-toggle">
      <button onclick="toggleDarkMode()">🌙 Toggle Dark Mode</button>
    </div>

    <!-- Mode Toggle -->
    <div class="mode-toggle">
      <button class="mode-btn" onclick="toggleMenu()">Select Mode ▼</button>
      <div class="mode-menu" id="modeMenu">
        <button onclick="setMode('basic')">Basic Calculator</button>
        <button onclick="setMode('scientific')">Scientific Calculator</button>
        <button onclick="setMode('unit')">Unit Converter</button>
        <button onclick="setMode('temp')">Temperature Converter</button>
        <button onclick="setMode('distance')">Distance Calculator</button>
      </div>
    </div>

    <!-- Display -->
    <input type="text" id="display" class="display" readonly>

    <!-- Buttons area -->
    <div class="buttons" id="buttonsArea"></div>
  </div>

  <script>
    let currentMode = 'basic';
    const display = document.getElementById("display");
    const buttonsArea = document.getElementById("buttonsArea");

    function toggleMenu() {
      document.getElementById("modeMenu").classList.toggle("active");
    }
    function toggleDarkMode() {
      document.body.classList.toggle("light");
    }

    function setMode(mode) {
      currentMode = mode;
      document.getElementById("modeMenu").classList.remove("active");
      loadMode();
    }

    function loadMode() {
      buttonsArea.innerHTML = "";
      display.value = "";
      if (currentMode === "basic") {
        ["7","8","9","+","4","5","6","-","1","2","3","*","0",".","/"].forEach(val=>{
          const btn = document.createElement("button");
          btn.textContent = val;
          btn.onclick = () => {
            display.value += val;
            autoCalculate();
          };
          buttonsArea.appendChild(btn);
        });
      }
      else if (currentMode === "scientific") {
        ["sin","cos","tan","sqrt","^","log","π","e"].forEach(fn=>{
          const btn = document.createElement("button");
          btn.textContent = fn;
          btn.onclick = () => {
            if(fn==="π") display.value+="3.1416";
            else if(fn==="e") display.value+="2.718";
            else display.value += fn+"(";
            autoCalculate();
          };
          buttonsArea.appendChild(btn);
        });
      }
      else if (currentMode === "unit") {
        buttonsArea.innerHTML = `<p>Example: 1 inch = 2.54 cm</p>`;
      }
      else if (currentMode === "temp") {
        buttonsArea.innerHTML = `
          <input type="number" id="tempInput" placeholder="Enter °C" 
          oninput="convertTemp()">
          <p id="tempResult"></p>`;
      }
      else if (currentMode === "distance") {
        buttonsArea.innerHTML = `
          <input type="number" id="distInput" placeholder="Enter km" 
          oninput="calcTime()">
          <p id="distResult"></p>`;
      }
    }

    function autoCalculate() {
      try {
        if (display.value) {
          let exp = display.value.replace("^","**");
          display.value = eval(exp);
        }
      } catch {
        // ignore errors until valid
      }
    }

    function convertTemp() {
      const val = parseFloat(document.getElementById("tempInput").value);
      if (!isNaN(val)) {
        const fahren = (val * 9/5) + 32;
        let status = val < 20 ? "❄️ Cold" : "🔥 Hot";
        document.getElementById("tempResult").textContent = 
          `${val}°C = ${fahren.toFixed(1)}°F → ${status}`;
      }
    }

    function calcTime() {
      const km = parseFloat(document.getElementById("distInput").value);
      if (!isNaN(km)) {
        const speed = 60; // assume avg 60 km/h
        const time = km / speed;
        const result = time < 1 
          ? `${Math.round(time*60)} min`
          : `${time.toFixed(1)} hours`;
        document.getElementById("distResult").textContent = 
          `${km} km → ~${result} at 60km/h`;
      }
    }

    // Load default
    loadMode();
  </script>
</body>
</html>
