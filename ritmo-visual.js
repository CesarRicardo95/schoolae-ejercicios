const figuras = {
  R: { nombre: "Redonda", duracion: 4, simbolo: "𝅝" },
  B: { nombre: "Blanca", duracion: 2, simbolo: "𝅗𝅥" },
  N: { nombre: "Negra", duracion: 1, simbolo: "♩" },
  C: { nombre: "Corchea", duracion: 0.5, simbolo: "♪" },
  S: { nombre: "Semicorchea", duracion: 0.25, simbolo: "𝅘𝅥𝅯" }
};

let rondaActual = 0;
let totalRondas = 5;
let secuencias = [];
let respuestas = [];

const startBtn = document.getElementById("startBtn");
const repeatBtn = document.getElementById("repeatBtn");
const submitBtn = document.getElementById("submitBtn");
const bpmInput = document.getElementById("bpm");
const bloques = [...document.querySelectorAll(".bloque")];
const selects = [...document.querySelectorAll("select")];
const resultadoFinal = document.getElementById("resultadoFinal");
const resultados = document.getElementById("resultados");
const respuestasSection = document.getElementById("respuestas");

function generarSecuencia() {
  const claves = Object.keys(figuras);
  return Array.from({ length: 4 }, () => claves[Math.floor(Math.random() * claves.length)]);
}

function mostrarSecuencia(secuencia, bpm) {
  let tiempoNegra = 60000 / bpm; // milisegundos
  let t = 0;

  secuencia.forEach((clave, i) => {
    const dur = figuras[clave].duracion * tiempoNegra;
    setTimeout(() => bloques[i].classList.add("activo"), t);
    setTimeout(() => bloques[i].classList.remove("activo"), t + dur);
    t += dur;
  });
}

function comenzarRonda() {
  if (rondaActual >= totalRondas) return;

  selects.forEach(sel => sel.value = "");
  respuestasSection.classList.add("oculto");

  const bpm = parseInt(bpmInput.value);
  const secuencia = generarSecuencia();
  secuencias[rondaActual] = secuencia;

  mostrarSecuencia(secuencia, bpm);

  repeatBtn.disabled = false;
  setTimeout(() => {
    respuestasSection.classList.remove("oculto");
  }, secuencia.reduce((acc, clave) => acc + figuras[clave].duracion * 60000 / bpm, 0));
}

function repetirSecuencia() {
  mostrarSecuencia(secuencias[rondaActual], parseInt(bpmInput.value));
}

function procesarRespuesta() {
  const respuesta = selects.map(sel => sel.value);
  respuestas[rondaActual] = respuesta;

  rondaActual++;

  if (rondaActual < totalRondas) {
    setTimeout(comenzarRonda, 1000);
  } else {
    mostrarResultados();
  }
}

function mostrarResultados() {
  startBtn.disabled = true;
  repeatBtn.disabled = true;
  respuestasSection.classList.add("oculto");
  resultadoFinal.classList.remove("oculto");
  resultados.innerHTML = "";

  let aciertos = 0;

  for (let i = 0; i < totalRondas; i++) {
    const sec = secuencias[i];
    const res = respuestas[i];
    const div = document.createElement("div");
    div.classList.add("resultado-item");

    const secText = sec.map(k => figuras[k].simbolo).join(" ");
    const resText = res.map(k => figuras[k]?.simbolo || "?").join(" ");

    if (JSON.stringify(sec) === JSON.stringify(res)) aciertos++;

    div.innerHTML = `
      <div><strong>Ronda ${i + 1}:</strong></div>
      <div>🎯 Secuencia: ${secText}</div>
      <div>✅ Respuesta: ${resText}</div>
    `;
    resultados.appendChild(div);
  }

  const resumen = document.createElement("div");
  resumen.innerHTML = `<h3>Total de aciertos: ${aciertos} / ${totalRondas}</h3>`;
  resultados.appendChild(resumen);
}

startBtn.addEventListener("click", () => {
  rondaActual = 0;
  secuencias = [];
  respuestas = [];
  startBtn.disabled = true;
  resultadoFinal.classList.add("oculto");
  comenzarRonda();
});

repeatBtn.addEventListener("click", repetirSecuencia);
submitBtn.addEventListener("click", procesarRespuesta);
