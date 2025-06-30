// figuras.js

const bpmInput = document.getElementById("bpm");
const startBtn = document.getElementById("startBtn");
const replayBtn = document.getElementById("replayBtn");
const nextBtn = document.getElementById("nextBtn");
const submitBtn = document.getElementById("submitBtn");
const resultado = document.getElementById("resultado");
const bloques = document.querySelectorAll(".bloque");
const selects = document.querySelectorAll(".select-figura");
const bpmLinea = document.getElementById("bpm-linea");
const figuraLinea = document.getElementById("figura-linea");

const figuras = ["redonda", "blanca", "negra", "corchea", "semicorchea"];
const duraciones = {
  redonda: 4,
  blanca: 2,
  negra: 1,
  corchea: 0.5,
  semicorchea: 0.25,
};

let secuencia = [];
let ronda = 0;
let totalRondas = 5;
let aciertos = 0;

function generarSecuencia() {
  secuencia = [];
  for (let i = 0; i < 4; i++) {
    const figura = figuras[Math.floor(Math.random() * figuras.length)];
    secuencia.push(figura);
  }
}

function generarLineas(pulsosTotales) {
  bpmLinea.innerHTML = "";
  for (let i = 0; i < pulsosTotales; i++) {
    const p = document.createElement("div");
    p.classList.add("pulso");
    bpmLinea.appendChild(p);
  }

  figuraLinea.innerHTML = "";
  for (let figura of secuencia) {
    const pulsos = duraciones[figura] / 0.25; // porque semicorchea es 0.25 = 1 pulso visual
    for (let i = 0; i < pulsos; i++) {
      const f = document.createElement("div");
      f.classList.add("pulso-figura");
      figuraLinea.appendChild(f);
    }
  }
}

function iluminarSecuencia() {
  const bpm = parseInt(bpmInput.value);
  const intervalo = 60000 / bpm; // duración de una negra en ms

  const pulsos = secuencia.reduce((acc, figura) => acc + duraciones[figura] / 0.25, 0);
  generarLineas(pulsos);

  const todosPulsos = bpmLinea.querySelectorAll(".pulso");
  const todosFiguras = figuraLinea.querySelectorAll(".pulso-figura");

  let index = 0;
  const intervalId = setInterval(() => {
    if (index > 0) {
      todosPulsos[index - 1].classList.remove("activo");
      todosFiguras[index - 1].classList.remove("activo");
    }
    if (index < todosPulsos.length) {
      todosPulsos[index].classList.add("activo");
      todosFiguras[index].classList.add("activo");
      index++;
    } else {
      clearInterval(intervalId);
      activarSelects(true);
      submitBtn.disabled = false;
      replayBtn.disabled = false;
    }
  }, intervalo * 0.25); // semicorchea = 1 pulso base
}

function activarSelects(estado) {
  selects.forEach((sel) => (sel.disabled = !estado));
}

function verificarRespuesta() {
  let correctos = 0;
  selects.forEach((sel, i) => {
    if (sel.value === secuencia[i]) {
      correctos++;
    }
  });
  aciertos += correctos === 4 ? 1 : 0;
  resultado.textContent = `Ronda ${ronda + 1}: ${correctos} correctos`;
  nextBtn.disabled = false;
  submitBtn.disabled = true;
  activarSelects(false);
}

startBtn.onclick = () => {
  ronda = 0;
  aciertos = 0;
  iniciarRonda();
};

function iniciarRonda() {
  resultado.textContent = "";
  generarSecuencia();
  selects.forEach((sel) => (sel.value = ""));
  activarSelects(false);
  submitBtn.disabled = true;
  replayBtn.disabled = true;
  nextBtn.disabled = true;
  iluminarSecuencia();
}

replayBtn.onclick = () => {
  activarSelects(false);
  submitBtn.disabled = true;
  replayBtn.disabled = true;
  iluminarSecuencia();
};

nextBtn.onclick = () => {
  ronda++;
  if (ronda < totalRondas) {
    iniciarRonda();
  } else {
    resultado.textContent = `¡Completado! Aciertos: ${aciertos} de ${totalRondas}`;
    startBtn.disabled = false;
  }
};

submitBtn.onclick = verificarRespuesta;
