const startBtn = document.getElementById("startBtn");
const toqueBtn = document.getElementById("toqueBtn");
const bpmInput = document.getElementById("bpm");
const beatIndicator = document.getElementById("beat-indicator");
const resultado = document.getElementById("resultado");
const grafico = document.getElementById("grafico");

let intervalId;
let startTime;
let beatTimes = [];
let toqueTimes = [];
const beatsTotal = 8;
let currentBeat = 0;
let intervaloMs;
let etapa = "espera"; // puede ser: "espera", "practica", "real"

const bip = new Audio("https://actions.google.com/sounds/v1/alarms/beep_short.ogg");

function reset() {
  clearInterval(intervalId);
  beatIndicator.innerText = "Esperando...";
  resultado.innerText = "";
  grafico.innerHTML = "";
  toqueBtn.disabled = true;
  beatTimes = [];
  toqueTimes = [];
  currentBeat = 0;
  etapa = "espera";
}

function startExercise() {
  reset();
  const bpm = parseInt(bpmInput.value);
  intervaloMs = 60000 / bpm;

  etapa = "practica";
  currentBeat = 0;
  beatIndicator.innerText = "⏳ Prueba: escucha el tempo...";

  intervalId = setInterval(() => {
    currentBeat++;
    //bip.play();
    beatIndicator.innerText = `🎧 Prueba - Beat ${currentBeat} / ${beatsTotal}`;
    if (currentBeat === beatsTotal) {
      clearInterval(intervalId);
      setTimeout(iniciarRondaReal, intervaloMs);
    }
  }, intervaloMs);
}

function iniciarRondaReal() {
  etapa = "real";
  currentBeat = 0;
  startTime = Date.now();
  beatTimes.push(startTime);
  beatIndicator.innerText = `▶️ Beat 1 / ${beatsTotal}`;
  toqueBtn.disabled = false;
 // bip.play();

  intervalId = setInterval(() => {
    currentBeat++;
   // bip.play();
    if (currentBeat >= beatsTotal) {
      clearInterval(intervalId);
      setTimeout(endExercise, intervaloMs);
      return;
    }
    const tiempoBeat = startTime + intervaloMs * currentBeat;
    beatTimes.push(tiempoBeat);
    beatIndicator.innerText = `▶️ Beat ${currentBeat + 1} / ${beatsTotal}`;
  }, intervaloMs);
}

function endExercise() {
  toqueBtn.disabled = true;
  beatIndicator.innerText = "✅ Ejercicio finalizado";
  mostrarResultados();
}

function registrarToque() {
  if (etapa !== "real") return;
  if (toqueTimes.length >= beatsTotal) return;
  const ahora = Date.now();
  toqueTimes.push(ahora);
  resultado.innerText = `🖱️ Toques registrados: ${toqueTimes.length} / ${beatsTotal}`;
}

function mostrarResultados() {
  grafico.innerHTML = "";

  for (let i = 0; i < beatsTotal; i++) {
    let esperado = beatTimes[i];
    let tocado = toqueTimes[i] || 0;
    let error = tocado - esperado;

    let clase;
    if (Math.abs(error) <= 150) {
      clase = "bueno";
    } else if (error > 150) {
      clase = "tarde";
    } else {
      clase = "temprano";
    }

    const barra = document.createElement("div");
    barra.classList.add("barra", clase);
    barra.setAttribute("data-num", i + 1);
    grafico.appendChild(barra);
  }
}
startBtn.addEventListener("click", startExercise);
toqueBtn.addEventListener("click", registrarToque);
