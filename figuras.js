const startBtn = document.getElementById("startBtn");
const nextBtn = document.getElementById("nextBtn");
const submitBtn = document.getElementById("submitBtn");
const bpmInput = document.getElementById("bpm");
const resultadoDiv = document.getElementById("resultado");

const bloques = Array.from(document.querySelectorAll(".bloque"));
const selects = Array.from(document.querySelectorAll(".select-figura"));

const figuras = ["redonda", "blanca", "negra", "corchea", "semicorchea"];
const valores = {
  redonda: 4,
  blanca: 2,
  negra: 1,
  corchea: 0.5,
  semicorchea: 0.25,
};

let secuencia = [];
let rondaActual = 0;
const totalRondas = 5;
let resultados = [];

function esperar(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Genera una secuencia de 4 figuras aleatorias
function generarSecuencia() {
  return Array.from({ length: 4 }, () => figuras[Math.floor(Math.random() * figuras.length)]);
}

// Parpadea un bloque según la figura y BPM
async function animarBloque(bloque, figura, bpm) {
  const pulsoMs = 60000 / bpm;
  const pulsos = valores[figura];

  // Duración total del bloque: 4 pulsos (como base)
  const duracionBloque = pulsoMs * 4;

  // Tiempo para cada parpadeo:
  const intervalo = duracionBloque / pulsos;

  for (let i = 0; i < pulsos; i++) {
    bloque.classList.add("activo");
    await esperar(intervalo / 2);
    bloque.classList.remove("activo");
    await esperar(intervalo / 2);
  }
}

// Reproduce toda la secuencia con animación
async function reproducirSecuencia() {
  const bpm = parseInt(bpmInput.value);
  startBtn.disabled = true;
  submitBtn.disabled = true;
  nextBtn.disabled = true;
  selects.forEach((sel) => (sel.disabled = true));
  resultadoDiv.textContent = "";

  for (let i = 0; i < secuencia.length; i++) {
    await animarBloque(bloques[i], secuencia[i], bpm);
    await esperar(300); // pausa corta entre bloques
  }

  selects.forEach((sel) => (sel.disabled = false));
  submitBtn.disabled = false;
  startBtn.disabled = true;
  nextBtn.disabled = true;
}

// Evalúa las respuestas y muestra resultado
function evaluarRespuestas() {
  let aciertos = 0;
  let textoResultado = "";

  for (let i = 0; i < secuencia.length; i++) {
    const correcta = secuencia[i];
    const respuesta = selects[i].value;
    const acertado = correcta === respuesta;
    if (acertado) aciertos++;

    textoResultado += `Bloque ${i + 1}: Correcto = ${correcta}, Tu respuesta = ${respuesta || "(sin seleccionar)"} - ${
      acertado ? "✅" : "❌"
    }\n`;
  }

  textoResultado += `\nAciertos esta ronda: ${aciertos} / ${secuencia.length}`;

  resultados.push(aciertos);

  resultadoDiv.textContent = textoResultado;

  startBtn.disabled = true;
  submitBtn.disabled = true;
  nextBtn.disabled = false;
  selects.forEach((sel) => (sel.disabled = true));
}

// Prepara todo para la siguiente ronda
function siguienteRonda() {
  rondaActual++;
  if (rondaActual >= totalRondas) {
    mostrarResultadosFinales();
    return;
  }

  secuencia = generarSecuencia();
  resultadoDiv.textContent = "";
  selects.forEach((sel) => {
    sel.disabled = true;
    sel.value = "";
  });
  submitBtn.disabled = true;
  nextBtn.disabled = true;
  startBtn.disabled = false;
}

// Muestra resultados finales de todas las rondas
function mostrarResultadosFinales() {
  const suma = resultados.reduce((a, b) => a + b, 0);
  const total = totalRondas * secuencia.length;
  resultadoDiv.textContent = `¡Ejercicio terminado!\n\nAciertos totales: ${suma} de ${total} (${((suma / total) * 100).toFixed(2)}%)`;
  startBtn.disabled = true;
  submitBtn.disabled = true;
  nextBtn.disabled = true;
  selects.forEach((sel) => (sel.disabled = true));
}

startBtn.addEventListener("click", () => {
  rondaActual = 0;
  resultados = [];
  secuencia = generarSecuencia();
  reproducirSecuencia();
});

submitBtn.addEventListener("click", () => {
  evaluarRespuestas();
});

nextBtn.addEventListener("click", () => {
  siguienteRonda();
});
