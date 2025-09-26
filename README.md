<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<title>Smart Student Calculator — Visible Keys</title>
<style>
  :root{
    --bg: linear-gradient(135deg,#0f2027,#203a43,#2c5364);
    --card: rgba(255,255,255,0.06);
    --key-grad: linear-gradient(135deg,#4facfe,#00f2fe); /* single gradient for all keys */
    --accent2: linear-gradient(135deg,#667eea,#764ba2);
    --glass: rgba(255,255,255,0.06);
    --text: #fff;
    --muted: rgba(255,255,255,0.75);
  }
  html,body{height:100%;margin:0;font-family:Inter,system-ui,Arial,sans-serif}
  body{
    display:flex;align-items:center;justify-content:center;padding:18px;
    background:var(--bg);color:var(--text);transition:background .25s ease,color .25s;
  }
  body.light{
    --bg: linear-gradient(180deg,#f0f4f8,#ffffff);
    --card: #fff;
    --glass: rgba(0,0,0,0.04);
    --text:#111827;
    --muted: rgba(0,0,0,0.65);
  }

  /* layout */
  .wrap{width:100%;max-width:1100px;display:grid;grid-template-columns:1fr 320px;gap:18px;align-items:start}
  @media (max-width:920px){ .wrap{grid-template-columns:1fr; } }

  .panel{background:var(--card);padding:16px;border-radius:14px;box-shadow:0 10px 30px rgba(0,0,0,0.45);backdrop-filter:blur(8px)}
  header.appbar{display:flex;justify-content:space-between;align-items:center;gap:12px;margin-bottom:12px}
  .logo{width:46px;height:46px;border-radius:10px;background:var(--accent2);display:flex;align-items:center;justify-content:center;font-weight:800}
  h1{font-size:18px;margin:0}
  p.subtitle{margin:0;font-size:13px;color:var(--muted)}

  .controls{display:flex;gap:8px;align-items:center}
  .btn{border:0;padding:10px 14px;border-radius:12px;cursor:pointer;font-weight:700;background:var(--accent2);color:#fff}
  .btn.small{padding:8px 10px;font-size:13px;border-radius:10px}
  .btn.ghost{background:transparent;border:1px solid rgba(255,255,255,0.08);color:var(--text)}

  /* mode dropdown */
  .mode-toggle{position:relative}
  .mode-button{padding:10px 14px;border-radius:12px;border:0;background:linear-gradient(135deg,#ff416c,#ff4b2b);color:#fff;font-weight:800;cursor:pointer}
  .mode-menu{position:absolute;left:0;top:calc(100% + 10px);width:260px;background:linear-gradient(180deg, rgba(255,255,255,0.02), rgba(0,0,0,0.08));border-radius:12px;padding:8px;opacity:0;transform:translateY(-10px);pointer-events:none;transition:all .18s}
  .mode-menu.show{opacity:1;transform:none;pointer-events:auto}
  .mode-item{padding:10px;border-radius:10px;cursor:pointer;font-weight:700;display:flex;gap:10px;align-items:center}
  .mode-item:hover{background:rgba(255,255,255,0.03)}

  /* calculator area */
  .calc{display:flex;flex-direction:column;gap:10px}
  .display{
    background:var(--glass);border-radius:12px;padding:12px 14px;text-align:right;font-size:22px;font-weight:800;color:var(--text);
    min-height:64px;overflow:hidden;word-wrap:anywhere;
  }
  .sub{font-size:14px;color:var(--muted);text-align:right;min-height:20px}

  /* keypad (phone style) - all keys same gradient */
  .keypad{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-top:6px}
  .key{
    background:var(--key-grad);border-radius:14px;padding:18px;font-size:18px;font-weight:800;color:#033; /* dark text for contrast */
    border:0;cursor:pointer;box-shadow:0 8px 18px rgba(0,0,0,0.2);transition:transform .12s,box-shadow .12s;
    display:flex;align-items:center;justify-content:center;
  }
  .key:active{transform:translateY(1px);box-shadow:0 6px 12px rgba(0,0,0,0.18)}
  .key.clear{background:var(--key-grad);opacity:.95}
  .key.eq{background:var(--key-grad);opacity:.95}
  .key.op{background:var(--key-grad);opacity:.95}
  .key.sci{background:var(--key-grad);opacity:.95}
  .key.big{grid-column:span 2}

  .sci-bar{display:flex;gap:8px;flex-wrap:wrap;margin-top:10px}

  /* converters */
  .converter{display:flex;flex-direction:column;gap:10px}
  .row{display:flex;gap:8px}
  .half{flex:1}
  input[type="number"],select{width:100%;padding:12px;border-radius:10px;border:0;background:rgba(255,255,255,0.02);color:var(--text);font-weight:700}
  .convert-btn{background:var(--accent2);color:#fff;border-radius:10px;padding:12px;border:0;font-weight:800;cursor:pointer}

  /* history side */
  .history{display:flex;flex-direction:column;gap:10px;height:100%}
  .history .title{display:flex;justify-content:space-between;align-items:center}
  .hist-list{max-height:640px;overflow:auto;padding:10px;border-radius:10px;background:linear-gradient(180deg, rgba(255,255,255,0.02), rgba(0,0,0,0.05))}
  .hist-item{padding:8px;border-radius:8px;margin-bottom:8px;background:rgba(0,0,0,0.08);font-weight:700;color:var(--text)}
  .hist-item small{display:block;font-weight:400;color:var(--muted);font-size:13px;margin-top:6px}

  /* scrollbar */
  .hist-list::-webkit-scrollbar{width:8px}
  .hist-list::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.12);border-radius:6px}
  body.light .hist-list::-webkit-scrollbar-thumb{background:rgba(0,0,0,0.12)}

  @media (max-width:740px){
    .wrap{grid-template-columns:1fr;gap:12px}
    .history{order:2}
    .hist-list{max-height:260px}
  }
</style>
</head>
<body>
  <div class="wrap">
    <!-- main panel -->
    <div class="panel">
      <header class="appbar">
        <div style="display:flex;gap:12px;align-items:center">
          <div class="logo">SS</div>
          <div>
            <h1>Smart Student Calculator</h1>
            <p class="subtitle">Phone-style keypad • One-key-style • Converters</p>
          </div>
        </div>

        <div class="controls">
          <div class="mode-toggle">
            <button id="modeBtn" class="mode-button">Calculator ▾</button>
            <div id="modeMenu" class="mode-menu" role="menu">
              <div class="mode-item" data-mode="calculator">Calculator</div>
              <div class="mode-item" data-mode="unit">Unit Converter</div>
              <div class="mode-item" data-mode="temp">Temperature</div>
              <div class="mode-item" data-mode="distance">Distance</div>
            </div>
          </div>
          <button id="darkToggle" class="btn small">🌙</button>
        </div>
      </header>

      <main id="appArea">
        <!-- Calculator -->
        <section id="calculatorView" class="calc">
          <div id="display" class="display" aria-live="polite">0</div>
          <div class="sub">= <span id="live"></span></div>

          <div style="display:flex;gap:8px;align-items:center">
            <button id="sciToggle" class="btn small">Show scientific</button>
            <div style="flex:1" class="muted">Tap big keys or type — press <strong>=</strong> to lock result.</div>
          </div>

          <div id="keypad" class="keypad" aria-hidden="false"></div>
          <div id="sciArea" class="sci-bar" style="display:none"></div>
        </section>

        <!-- Unit Converter -->
        <section id="unitView" class="converter" style="display:none">
          <div class="muted">Unit Converter — choose conversion then press Convert</div>
          <div class="row">
            <input id="unitVal" type="number" placeholder="Value" class="half">
            <select id="unitSel" class="half">
              <optgroup label="Mass">
                <option value="kg-lb">kg → lb</option>
                <option value="lb-kg">lb → kg</option>
                <option value="g-oz">g → oz</option>
                <option value="oz-g">oz → g</option>
              </optgroup>
              <optgroup label="Length">
                <option value="cm-in">cm → inch</option>
                <option value="in-cm">inch → cm</option>
                <option value="m-ft">m → ft</option>
                <option value="ft-m">ft → m</option>
              </optgroup>
            </select>
          </div>
          <button id="unitRun" class="convert-btn">Convert</button>
          <div id="unitOut" class="muted"></div>
        </section>

        <!-- Temperature -->
        <section id="tempView" class="converter" style="display:none">
          <div class="muted">Temperature — choose direction</div>
          <div class="row">
            <input id="tempVal" type="number" placeholder="Value" class="half">
            <select id="tempSel" class="half">
              <option value="C-F">°C → °F</option>
              <option value="F-C">°F → °C</option>
              <option value="C-K">°C → K</option>
              <option value="K-C">K → °C</option>
            </select>
          </div>
          <button id="tempRun" class="convert-btn">Convert</button>
          <div id="tempOut" class="muted"></div>
        </section>

        <!-- Distance -->
        <section id="distView" class="converter" style="display:none">
          <div class="muted">Distance — pick conversion. Time estimates for walking & driving.</div>
          <div class="row">
            <input id="distVal" type="number" placeholder="Value" class="half">
            <select id="distSel" class="half">
              <option value="km-mi">km → miles</option>
              <option value="mi-km">miles → km</option>
              <option value="m-ft">m → ft</option>
              <option value="ft-m">ft → m</option>
              <option value="cm-in">cm → inch</option>
              <option value="in-cm">inch → cm</option>
            </select>
          </div>
          <button id="distRun" class="convert-btn">Convert</button>
          <div id="distOut" class="muted"></div>
          <div id="timeOut" class="muted"></div>
        </section>
      </main>
    </div>

    <!-- right: history -->
    <aside class="panel history">
      <div class="title">
        <div>
          <h3 style="margin:0">History</h3>
          <div class="muted" style="font-size:13px">All calculations & conversions (scrollable)</div>
        </div>
        <button id="clearHistory" class="btn small">Clear</button>
      </div>
      <div id="histList" class="hist-list" role="log" aria-live="polite"></div>
    </aside>
  </div>

<script>
/* -------------------------
   Elements & state
   ------------------------- */
const modeBtn = document.getElementById('modeBtn');
const modeMenu = document.getElementById('modeMenu');
const modeItems = Array.from(document.querySelectorAll('.mode-item'));
const darkToggle = document.getElementById('darkToggle');

const calculatorView = document.getElementById('calculatorView');
const unitView = document.getElementById('unitView');
const tempView = document.getElementById('tempView');
const distView = document.getElementById('distView');

const displayEl = document.getElementById('display');
const liveEl = document.getElementById('live');
const keypadEl = document.getElementById('keypad');
const sciArea = document.getElementById('sciArea');
const sciToggle = document.getElementById('sciToggle');

const histList = document.getElementById('histList');
const clearHistoryBtn = document.getElementById('clearHistory');

let expression = "";
let showSci = false;
let history = [];

/* polyfills */
if(typeof Math.log10 !== 'function'){ Math.log10 = x => Math.log(x)/Math.LN10; }

/* -------------------------
   Mode dropdown
   ------------------------- */
modeBtn.addEventListener('click', ()=> modeMenu.classList.toggle('show'));
modeItems.forEach(it => it.addEventListener('click', ()=>{
  setMode(it.getAttribute('data-mode'));
  modeMenu.classList.remove('show');
}));
document.addEventListener('click', (e)=> { if(!modeMenu.contains(e.target) && e.target !== modeBtn) modeMenu.classList.remove('show'); });

/* dark toggle */
darkToggle.addEventListener('click', ()=> document.body.classList.toggle('light') );

/* set mode */
function hideAll(){ calculatorView.style.display='none'; unitView.style.display='none'; tempView.style.display='none'; distView.style.display='none'; }
function setMode(m){
  hideAll();
  if(m==='calculator'){ calculatorView.style.display='flex'; modeBtn.textContent='Calculator ▾'; expression=""; updateDisplay(); renderKeypad(); }
  if(m==='unit'){ unitView.style.display='block'; modeBtn.textContent='Unit Converter ▾'; }
  if(m==='temp'){ tempView.style.display='block'; modeBtn.textContent='Temperature ▾'; }
  if(m==='distance'){ distView.style.display='block'; modeBtn.textContent='Distance ▾'; }
}
setMode('calculator');

/* -------------------------
   Keypad rendering (single gradient for all keys)
   ------------------------- */
const baseKeys = [
  "7","8","9","/",
  "4","5","6","*",
  "1","2","3","-",
  "0",".","(",")",
  "C","=","+","⇧"
];
const sciKeys = ["sin","cos","tan","log","sqrt","^","π","e"];

function renderKeypad(){
  keypadEl.innerHTML = "";
  baseKeys.forEach(k=>{
    const btn = document.createElement('button');
    btn.className = 'key';
    if(k==='C'){ btn.classList.add('clear'); btn.textContent='C'; btn.onclick = ()=> { expression=""; updateDisplay(); } }
    else if(k==='='){ btn.classList.add('eq'); btn.textContent='='; btn.onclick = ()=> calculateEquals(); }
    else if(k==='⇧'){ btn.classList.add('op'); btn.textContent='Sci'; btn.onclick = ()=> toggleScientific(); }
    else { btn.textContent = k; btn.onclick = ()=> appendToken(k); }
    keypadEl.appendChild(btn);
  });
  renderSciArea();
}

function renderSciArea(){
  sciArea.innerHTML = "";
  if(!showSci){ sciArea.style.display='none'; return; }
  sciArea.style.display='flex';
  sciKeys.forEach(s=>{
    const b = document.createElement('button');
    b.className = 'key sci';
    b.textContent = s;
    b.onclick = ()=> appendSci(s);
    sciArea.appendChild(b);
  });
}

/* -------------------------
   Token append + display update
   ------------------------- */
function appendToken(t){
  if(expression==="" && ['+','*','/'].includes(t)) return;
  expression += t; updateDisplay();
}
function appendSci(s){
  if(s==='π'){ expression += 'π'; }
  else if(s==='e'){ expression += 'e'; }
  else if(s==='^'){ expression += '^'; }
  else if(s==='sqrt'){ expression += 'sqrt('; }
  else { expression += s + '('; }
  updateDisplay();
}
function updateDisplay(){ displayEl.textContent = expression || "0"; computeLive(); }

/* -------------------------
   Sanitize and compute
   ------------------------- */
function sanitize(expr){
  if(!expr) return "";
  let out = expr.replaceAll('π','Math.PI').replaceAll('e','Math.E').replaceAll('^','**');
  out = out.replace(/\bsin\(/g,'Math.sin(').replace(/\bcos\(/g,'Math.cos(').replace(/\btan\(/g,'Math.tan(');
  out = out.replace(/\bsqrt\(/g,'Math.sqrt(').replace(/\blog\(/g,'Math.log10(');
  out = out.replace(/[\+\-\*\/\^\.]+$/,'');
  return out;
}
function computeLive(){
  if(!expression){ liveEl.textContent=''; return; }
  try{
    const js = sanitize(expression);
    if(!js){ liveEl.textContent=''; return; }
    const fn = new Function('return ('+js+');');
    const val = fn();
    if(typeof val === 'number' && isFinite(val)) liveEl.textContent = formatNumber(val);
    else liveEl.textContent = '';
  }catch(e){ liveEl.textContent=''; }
}
function formatNumber(n){ if(Math.abs(n) > 1e12) return n.toExponential(6); if(Number.isInteger(n)) return n.toString(); return parseFloat(n.toFixed(8)).toString(); }

function calculateEquals(){
  if(!expression) return;
  try{
    const js = sanitize(expression);
    const fn = new Function('return ('+js+');');
    const res = fn();
    if(res===undefined || !isFinite(res)){ pushHistory('calc','Error'); displayEl.textContent='Error'; expression=''; liveEl.textContent=''; return; }
    const out = formatNumber(res).toString();
    pushHistory('calc', `${expression} = ${out}`);
    expression = out;
    updateDisplay();
  }catch(e){ pushHistory('calc','Error'); displayEl.textContent='Error'; expression=''; liveEl.textContent=''; }
}

/* typing support */
document.addEventListener('keydown',(e)=>{
  const allowed = "0123456789+-*/().^";
  if(allowed.includes(e.key)){ expression += e.key; updateDisplay(); e.preventDefault(); }
  else if(e.key === 'Enter'){ calculateEquals(); e.preventDefault(); }
  else if(e.key === 'Backspace'){ expression = expression.slice(0,-1); updateDisplay(); e.preventDefault(); }
});

/* sci toggle */
function toggleScientific(){ showSci = !showSci; sciToggle.textContent = showSci ? 'Hide scientific' : 'Show scientific'; renderSciArea(); }
sciToggle.addEventListener('click', toggleScientific);

/* -------------------------
   Converters + history
   ------------------------- */
function pushHistory(type, text){
  history.unshift({ type, text, time: new Date().toLocaleString() });
  if(history.length > 500) history.length = 500;
  renderHistory();
}
function renderHistory(){
  histList.innerHTML = "";
  if(history.length === 0){ histList.innerHTML = '<div class="muted">No history yet.</div>'; return; }
  history.forEach(it=>{
    const el = document.createElement('div');
    el.className = 'hist-item';
    el.innerHTML = `<div>${it.text}</div><small>${it.time}</small>`;
    histList.appendChild(el);
  });
}
clearHistoryBtn.addEventListener('click', ()=>{ history = []; renderHistory(); });

/* Unit convert */
document.getElementById('unitRun').addEventListener('click', ()=>{
  const v = parseFloat(document.getElementById('unitVal').value);
  const sel = document.getElementById('unitSel').value;
  const outEl = document.getElementById('unitOut');
  if(isNaN(v)){ outEl.textContent='Enter a number'; return; }
  let out='';
  switch(sel){
    case 'kg-lb': out = `${v} kg = ${(v*2.20462).toFixed(4)} lb`; break;
    case 'lb-kg': out = `${v} lb = ${(v/2.20462).toFixed(4)} kg`; break;
    case 'g-oz' : out = `${v} g = ${(v*0.035274).toFixed(4)} oz`; break;
    case 'oz-g' : out = `${v} oz = ${(v/0.035274).toFixed(4)} g`; break;
    case 'cm-in': out = `${v} cm = ${(v/2.54).toFixed(4)} in`; break;
    case 'in-cm': out = `${v} in = ${(v*2.54).toFixed(4)} cm`; break;
    case 'm-ft' : out = `${v} m = ${(v*3.28084).toFixed(4)} ft`; break;
    case 'ft-m' : out = `${v} ft = ${(v/3.28084).toFixed(4)} m`; break;
    default: out='Unsupported';
  }
  outEl.textContent = out; pushHistory('unit', out);
});

/* Temp convert */
document.getElementById('tempRun').addEventListener('click', ()=>{
  const v = parseFloat(document.getElementById('tempVal').value);
  const sel = document.getElementById('tempSel').value;
  const outEl = document.getElementById('tempOut');
  if(isNaN(v)){ outEl.textContent='Enter a number'; return; }
  let out='', celsius;
  function label(c){ if(c < 10) return '❄️ Cold'; if(c < 20) return '🧊 Cool'; if(c < 25) return '🌤 Warm'; return '🔥 Hot'; }
  switch(sel){
    case 'C-F': out = `${v}°C = ${(v*9/5+32).toFixed(2)}°F`; celsius=v; break;
    case 'F-C': celsius=(v-32)*5/9; out = `${v}°F = ${celsius.toFixed(2)}°C`; break;
    case 'C-K': out = `${v}°C = ${(v+273.15).toFixed(2)}K`; celsius=v; break;
    case 'K-C': celsius=v-273.15; out = `${v}K = ${celsius.toFixed(2)}°C`; break;
    default: out='Unsupported';
  }
  const full = `${out} → ${label(celsius)}`; outEl.textContent = full; pushHistory('temp', full);
});

/* Distance convert */
document.getElementById('distRun').addEventListener('click', ()=>{
  const v = parseFloat(document.getElementById('distVal').value);
  const sel = document.getElementById('distSel').value;
  const outEl = document.getElementById('distOut');
  const timeEl = document.getElementById('timeOut');
  if(isNaN(v)){ outEl.textContent='Enter a number'; timeEl.textContent=''; return; }
  let out='', kmEq=0;
  switch(sel){
    case 'km-mi': out = `${v} km = ${(v*0.621371).toFixed(4)} miles`; kmEq=v; break;
    case 'mi-km': out = `${v} mi = ${(v*1.60934).toFixed(4)} km`; kmEq=v*1.60934; break;
    case 'm-ft' : out = `${v} m = ${(v*3.28084).toFixed(4)} ft`; kmEq=v/1000; break;
    case 'ft-m' : out = `${v} ft = ${(v/3.28084).toFixed(4)} m`; kmEq=(v/3.28084)/1000; break;
    case 'cm-in': out = `${v} cm = ${(v/2.54).toFixed(4)} in`; kmEq=v/100000; break;
    case 'in-cm': out = `${v} in = ${(v*2.54).toFixed(4)} cm`; kmEq=(v*2.54)/100000; break;
    default: out='Unsupported';
  }
  outEl.textContent = out;
  if(kmEq>0){
    const walk = kmEq/5; const drive = kmEq/60;
    const fmt = h => h<1? `${Math.round(h*60)} min` : `${h.toFixed(1)} h`;
    const times = `Walking ≈ ${fmt(walk)} · Driving ≈ ${fmt(drive)}`;
    timeEl.textContent = times;
    pushHistory('distance', `${out} · ${times}`);
  } else { timeEl.textContent=''; pushHistory('distance', out); }
});

/* -------------------------
   Init: render keypad & history
   ------------------------- */
renderKeypad();
renderHistory();

/* helper functions (renderKeypad/renderSciArea defined earlier? define now) */
function renderKeypad(){
  keypadEl.innerHTML = "";
  baseKeys.forEach(k=>{
    const btn = document.createElement('button');
    btn.className = 'key';
    if(k==='C'){ btn.classList.add('clear'); btn.textContent='C'; btn.onclick = ()=> { expression=""; updateDisplay(); }; }
    else if(k==='='){ btn.classList.add('eq'); btn.textContent='='; btn.onclick = ()=> calculateEquals(); }
    else if(k==='⇧'){ btn.classList.add('op'); btn.textContent='Sci'; btn.onclick = ()=> toggleScientific(); }
    else { btn.textContent = k; btn.onclick = ()=> appendToken(k); }
    keypadEl.appendChild(btn);
  });
  renderSciArea();
  updateDisplay();
}
function renderSciArea(){
  sciArea.innerHTML = "";
  if(!showSci){ sciArea.style.display='none'; return; }
  sciArea.style.display='flex';
  sciKeys.forEach(s=>{
    const b = document.createElement('button');
    b.className = 'key sci';
    b.textContent = s;
    b.onclick = ()=> appendSci(s);
    sciArea.appendChild(b);
  });
}
/* functions for append/update already defined earlier; redefine minimal ones used here */
function appendToken(t){ if(expression==="" && ['+','*','/'].includes(t)) return; expression += t; updateDisplay(); }
function appendSci(s){ if(s==='π'){ expression += 'π'; } else if(s==='e'){ expression += 'e'; } else if(s==='^'){ expression += '^'; } else if(s==='sqrt'){ expression += 'sqrt('; } else { expression += s + '('; } updateDisplay(); }
function updateDisplay(){ displayEl.textContent = expression || "0"; computeLive(); }
function sanitize(expr){ if(!expr) return ""; let out = expr.replaceAll('π','Math.PI').replaceAll('e','Math.E').replaceAll('^','**'); out = out.replace(/\bsin\(/g,'Math.sin(').replace(/\bcos\(/g,'Math.cos(').replace(/\btan\(/g,'Math.tan('); out = out.replace(/\bsqrt\(/g,'Math.sqrt(').replace(/\blog\(/g,'Math.log10('); out = out.replace(/[\+\-\*\/\^\.]+$/,''); return out; }
function computeLive(){ if(!expression){ liveEl.textContent=''; return; } try{ const js = sanitize(expression); if(!js){ liveEl.textContent=''; return; } const fn = new Function('return ('+js+');'); const val = fn(); if(typeof val === 'number' && isFinite(val)) liveEl.textContent = formatNumber(val); else liveEl.textContent = ''; }catch(e){ liveEl.textContent=''; } }
function formatNumber(n){ if(Math.abs(n) > 1e12) return n.toExponential(6); if(Number.isInteger(n)) return n.toString(); return parseFloat(n.toFixed(8)).toString(); }
function calculateEquals(){ if(!expression) return; try{ const js = sanitize(expression); const fn = new Function('return ('+js+');'); const res = fn(); if(res===undefined || !isFinite(res)){ pushHistory('calc','Error'); displayEl.textContent='Error'; expression=''; liveEl.textContent=''; return; } const out = formatNumber(res).toString(); pushHistory('calc', `${expression} = ${out}`); expression = out; updateDisplay(); }catch(e){ pushHistory('calc','Error'); displayEl.textContent='Error'; expression=''; liveEl.textContent=''; } }

/* simple typing */
document.addEventListener('keydown',(e)=>{ const allowed = "0123456789+-*/().^"; if(allowed.includes(e.key)){ expression += e.key; updateDisplay(); e.preventDefault(); } else if(e.key === 'Enter'){ calculateEquals(); e.preventDefault(); } else if(e.key === 'Backspace'){ expression = expression.slice(0,-1); updateDisplay(); e.preventDefault(); } });

function toggleScientific(){ showSci = !showSci; sciToggle.textContent = showSci ? 'Hide scientific' : 'Show scientific'; renderSciArea(); }

/* history render (already declared earlier) implemented above */
function renderHistory(){ histList.innerHTML = ""; if(history.length === 0){ histList.innerHTML = '<div class="muted">No history yet.</div>'; return; } history.forEach(it=>{ const el = document.createElement('div'); el.className = 'hist-item'; el.innerHTML = `<div>${it.text}</div><small>${it.time}</small>`; histList.appendChild(el); }); }
function pushHistory(type, text){ history.unshift({ type, text, time: new Date().toLocaleString() }); if(history.length > 500) history.length = 500; renderHistory(); }

/* clear history */
clearHistoryBtn.addEventListener('click', ()=>{ history = []; renderHistory(); });

</script>
</body>
</html>
