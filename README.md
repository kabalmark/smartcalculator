<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Smart Calculator App</title>
  <style>
    * { box-sizing: border-box; }
    body {
      font-family: Arial, sans-serif;
      margin: 0;
      padding: 0;
      background: linear-gradient(135deg,#0f2027,#203a43,#2c5364);
      color: #fff;
      display: flex;
      flex-direction: column;
      align-items: center;
      min-height: 100vh;
      transition: 0.3s;
    }
    body.light { background: #f0f0f0; color: #222; }

    .top-bar {
      margin: 15px;
      display: flex;
      gap: 10px;
    }
    .top-bar button {
      padding: 10px 15px;
      border: none;
      border-radius: 8px;
      background: linear-gradient(135deg,#ff416c,#ff4b2b);
      color: #fff;
      font-weight: bold;
      cursor: pointer;
    }

    .app {
      display: flex;
      flex-wrap: wrap;
      max-width: 1000px;
      width: 100%;
      margin: 10px;
      gap: 15px;
    }

    /* Calculator */
    .calculator {
      flex: 2;
      background: rgba(255,255,255,0.08);
      border-radius: 15px;
      padding: 15px;
      min-width: 280px;
    }
    .display {
      width: 100%;
      padding: 15px;
      font-size: 22px;
      border: none;
      border-radius: 10px;
      margin-bottom: 8px;
      text-align: right;
      background: rgba(0,0,0,0.5);
      color: inherit;
    }
    .result {
      text-align: right;
      font-size: 18px;
      min-height: 24px;
      margin-bottom: 12px;
      color: #00ffcc;
    }
    .buttons {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 10px;
    }
    .buttons button {
      padding: 18px;
      font-size: 18px;
      border: none;
      border-radius: 12px;
      background: linear-gradient(135deg,#2193b0,#6dd5ed);
      color: #fff;
      font-weight: bold;
      cursor: pointer;
      transition: transform 0.15s, background 0.3s;
    }
    .buttons button:active { transform: scale(0.9); }
    .sci {
      display: none;
      grid-template-columns: repeat(3,1fr);
      gap: 8px;
      margin-top: 10px;
    }
    .sci button {
      padding: 15px;
      font-size: 16px;
    }
    .show-sci .sci { display: grid; }

    /* History */
    .history {
      flex: 1;
      background: rgba(255,255,255,0.08);
      border-radius: 15px;
      padding: 10px;
      max-height: 420px;
      overflow-y: auto;
      min-width: 200px;
    }
    .history h3 { margin: 0 0 10px; font-size: 16px; }
    .history p {
      margin: 4px 0;
      font-size: 14px;
      border-bottom: 1px solid rgba(255,255,255,0.2);
      padding-bottom: 3px;
    }

    /* Mode dropdown */
    .mode-menu {
      display: none;
      position: absolute;
      background: rgba(0,0,0,0.8);
      border-radius: 8px;
      margin-top: 5px;
    }
    .mode-menu.active { display: block; }
    .mode-menu button {
      display: block;
      padding: 10px;
      border: none;
      width: 100%;
      text-align: left;
      background: transparent;
      color: #fff;
      cursor: pointer;
    }
    .mode-menu button:hover { background: #1e3c72; }

    /* Converters */
    .converter {
      display: none;
      background: rgba(255,255,255,0.08);
      border-radius: 15px;
      padding: 15px;
      flex: 2;
      min-width: 280px;
    }
    .converter input, .converter select {
      width: 100%;
      padding: 10px;
      margin: 5px 0;
      border-radius: 8px;
      border: none;
    }
    .converter button {
      width: 100%;
      padding: 10px;
      margin-top: 5px;
      border: none;
      border-radius: 8px;
      background: linear-gradient(135deg,#00b09b,#96c93d);
      color: #fff;
      font-weight: bold;
      cursor: pointer;
    }
    .output { margin-top: 10px; font-weight: bold; }
  </style>
</head>
<body>
  <div class="top-bar">
    <button onclick="toggleDark()">🌙 Dark Mode</button>
    <button onclick="toggleMenu()">Select Mode ▼</button>
    <div class="mode-menu" id="modeMenu">
      <button onclick="setMode('calc')">Calculator</button>
      <button onclick="setMode('unit')">Unit Converter</button>
      <button onclick="setMode('temp')">Temperature Converter</button>
      <button onclick="setMode('dist')">Distance Calculator</button>
    </div>
  </div>

  <div class="app">
    <!-- Calculator -->
    <div class="calculator" id="calcBox">
      <input id="display" class="display" readonly>
      <div id="result" class="result"></div>
      <div class="buttons" id="mainKeys"></div>
      <button onclick="toggleSci()">🔽 Scientific Toggle</button>
      <div class="sci" id="sciKeys"></div>
    </div>

    <!-- History -->
    <div class="history">
      <h3>History</h3>
      <div id="historyList"></div>
    </div>

    <!-- Converters -->
    <div class="converter" id="unitBox">
      <h3>Unit Converter</h3>
      <input type="number" id="unitInput" placeholder="Enter value">
      <select id="unitType">
        <option value="cm-m">cm → m</option>
        <option value="m-cm">m → cm</option>
        <option value="kg-lb">kg → lb</option>
        <option value="lb-kg">lb → kg</option>
      </select>
      <button onclick="convertUnit()">Convert</button>
      <div class="output" id="unitOutput"></div>
    </div>

    <div class="converter" id="tempBox">
      <h3>Temperature Converter</h3>
      <input type="number" id="tempInput" placeholder="Enter value">
      <select id="tempType">
        <option value="c-f">Celsius → Fahrenheit</option>
        <option value="f-c">Fahrenheit → Celsius</option>
      </select>
      <button onclick="convertTemp()">Convert</button>
      <div class="output" id="tempOutput"></div>
    </div>

    <div class="converter" id="distBox">
      <h3>Distance Calculator</h3>
      <input type="number" id="distInput" placeholder="Distance (km)">
      <input type="number" id="speedInput" placeholder="Speed (km/h)">
      <button onclick="calcDist()">Calculate Time</button>
      <div class="output" id="distOutput"></div>
    </div>
  </div>

  <script>
    const display = document.getElementById("display");
    const result = document.getElementById("result");
    const historyList = document.getElementById("historyList");

    const mainKeys = ["7","8","9","/","4","5","6","*","1","2","3","-","0",".","C","+","DEL","="];
    const sciKeys = ["sin","cos","tan","√","^","π","log"];

    function buildKeys() {
      const mainArea = document.getElementById("mainKeys");
      mainArea.innerHTML="";
      mainKeys.forEach(k=>{
        let b=document.createElement("button");
        b.textContent=k;
        b.onclick=()=>handleKey(k);
        mainArea.appendChild(b);
      });
      const sciArea=document.getElementById("sciKeys");
      sciArea.innerHTML="";
      sciKeys.forEach(k=>{
        let b=document.createElement("button");
        b.textContent=k;
        b.onclick=()=>handleKey(k);
        sciArea.appendChild(b);
      });
    }

    function handleKey(v){
      if(v==="C"){ display.value=""; result.textContent=""; return; }
      if(v==="DEL"){ display.value=display.value.slice(0,-1); autoCalc(); return; }
      if(v==="="){ calculate(); return; }
      if(v==="√") v="Math.sqrt(";
      if(v==="π") v="Math.PI";
      if(v==="^") v="**";
      if(["sin","cos","tan","log"].includes(v)) v=`Math.${v}(`;
      display.value += v;
      autoCalc();
    }

    function autoCalc(){
      try{
        if(display.value) result.textContent=eval(display.value);
      }catch{ result.textContent=""; }
    }
    function calculate(){
      try{
        let ans=eval(display.value);
        result.textContent=ans;
        addHistory(display.value+" = "+ans);
        display.value=ans;
      }catch{ result.textContent="Error"; }
    }

    function addHistory(entry){
      let p=document.createElement("p");
      p.textContent=entry;
      historyList.prepend(p);
    }

    function toggleSci(){
      document.getElementById("calcBox").classList.toggle("show-sci");
    }

    function toggleDark(){
      document.body.classList.toggle("light");
    }
    function toggleMenu(){
      document.getElementById("modeMenu").classList.toggle("active");
    }
    function setMode(m){
      document.getElementById("calcBox").style.display = m==="calc"?"block":"none";
      document.getElementById("unitBox").style.display = m==="unit"?"block":"none";
      document.getElementById("tempBox").style.display = m==="temp"?"block":"none";
      document.getElementById("distBox").style.display = m==="dist"?"block":"none";
      document.getElementById("modeMenu").classList.remove("active");
    }

    // Unit converter with reference
    function convertUnit(){
      let v=parseFloat(document.getElementById("unitInput").value);
      let t=document.getElementById("unitType").value;
      let out="";
      if(t==="cm-m") out=(v/100)+" m";
      if(t==="m-cm") out=(v*100)+" cm";
      if(t==="kg-lb") out=(v*2.20462).toFixed(2)+" lb";
      if(t==="lb-kg") out=(v/2.20462).toFixed(2)+" kg";

      let ref="";
      if(t.includes("kg")) {
        if(v>=70) ref="≈ average adult human weight 🧍";
        else if(v<=5) ref="≈ a newborn baby 👶";
      }
      if(t.includes("cm")||t.includes("m")) {
        if(v>=200) ref="≈ tall door frame 🚪";
        else if(v<=50) ref="≈ small child’s height 🧒";
      }
      document.getElementById("unitOutput").textContent=out+" "+ref;
    }

    // Temperature converter with hot/cold
    function convertTemp(){
      let v=parseFloat(document.getElementById("tempInput").value);
      let t=document.getElementById("tempType").value;
      let out="", condition="";
      if(t==="c-f"){ out=(v*9/5+32).toFixed(1)+" °F"; condition=tempCondition(v,"C"); }
      if(t==="f-c"){ let c=((v-32)*5/9).toFixed(1); out=c+" °C"; condition=tempCondition(c,"C"); }
      document.getElementById("tempOutput").textContent=out+" → "+condition;
    }
    function tempCondition(val,unit){
      let c=unit==="C"?val:((val-32)*5/9);
      if(c<10) return "Cold ❄️";
      if(c<25) return "Warm 🌤️";
      return "Hot 🔥";
    }

    // Distance calculator with context
    function calcDist(){
      let d=parseFloat(document.getElementById("distInput").value);
      let s=parseFloat(document.getElementById("speedInput").value);
      if(d && s){
        let h=d/s;
        let min=(h*60).toFixed(1);
        let ref="";
        if(d<1) ref="Walking distance 🚶";
        else if(d<=20) ref="Short trip 🚗";
        else ref="Long travel ✈️";
        document.getElementById("distOutput").textContent=`${h.toFixed(2)} hours (${min} minutes) → ${ref}`;
      }
    }

    // Keyboard typing support
    document.addEventListener("keydown",e=>{
      if(/[0-9\+\-\*\/\.\(\)]/.test(e.key)){
        display.value+=e.key; autoCalc();
      }
      if(e.key==="Enter"){ calculate(); }
      if(e.key==="Backspace"){ display.value=display.value.slice(0,-1); autoCalc(); }
    });

    buildKeys();
    setMode("calc");
  </script>
</body>
</html>
