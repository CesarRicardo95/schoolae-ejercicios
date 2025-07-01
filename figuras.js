// figuras.js

const bpmInput = document.getElementById("bpm");
const startBtn = document.getElementById("startBtn");
const replayBtn = document.getElementById("replayBtn");
const nextBtn = document.getElementById("nextBtn");
const submitBtn = document.getElementById("submitBtn");
const resultado = document.getElementById("resultado");
const selects = document.querySelectorAll(".select-figura");
const bpmLinea = document.getElementById("bpm-linea");
const figuraLinea = document.getElementById("figura-linea");
const bloquesTop = document.getElementById("bloques-top");

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
    const pulsos = duraciones[figura] / 0.25;
    for (let i = 0; i < pulsos; i++) {
      const f = document.createElement("div");
      f.classList.add("pulso");
      figuraLinea.appendChild(f);
    }
  }
}

function iluminarBloques() {
  bloquesTop.innerHTML = "";
  for (let i = 0; i < 4; i++) {
    const b = document.createElement("div");
    b.classList.add("bloque");
    bloquesTop.appendChild(b);
  }
}

function reproducirSecuencia() {
  const bpm = parseInt(bpmInput.value);
  const pulsoMs = 60000 / bpm; // duración de una negra
  const semicorcheaDuracion = pulsoMs / 4; // 0.25 negra

  const totalPulsos = secuencia.reduce((acc, fig) => acc + duraciones[fig] / 0.25, 0);
  generarLineas(totalPulsos);
  iluminarBloques();

  const pulsosBase = bpmLinea.querySelectorAll(".pulso");
  const pulsosFiguras = figuraLinea.querySelectorAll(".pulso");
  const bloques = bloquesTop.querySelectorAll(".bloque");

  let i = 0;
  let pulsoIndex = 0;

  function marcarPulsos() {
    if (i > 0) {
      pulsosBase[i - 1].classList.remove("activo");
      pulsosFiguras[i - 1].classList.remove("activo");
    }
    if (i < pulsosBase.length) {
      pulsosBase[i].classList.add("activo");
      pulsosFiguras[i].classList.add("activo");
      i++;
      setTimeout(marcarPulsos, semicorcheaDuracion);
    }
  }

  function marcarBloques(j = 0) {
    if (j >= secuencia.length) return;
    const pulsos = duraciones[secuencia[j]] / 0.25;
    let parpadeos = 0;
    function parpadear() {
      bloques[j].classList.add("activo");
      setTimeout(() => {
        bloques[j].classList.remove("activo");
        parpadeos++;
        if (parpadeos < pulsos) {
          setTimeout(parpadear, semicorcheaDuracion);
        } else {
          marcarBloques(j + 1);
        }
      }, semicorcheaDuracion / 2);
    }
    parpadear();
  }

  marcarPulsos();
  marcarBloques();

  const totalDuracion = totalPulsos * semicorcheaDuracion;
  setTimeout(() => {
    activarSelects(true);
    submitBtn.disabled = false;
    replayBtn.disabled = false;
  }, totalDuracion + 200);
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
  reproducirSecuencia();
}

replayBtn.onclick = () => {
  activarSelects(false);
  submitBtn.disabled = true;
  replayBtn.disabled = true;
  reproducirSecuencia();
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

