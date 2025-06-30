const startBtn = document.getElementById("startBtn");
const repeatBtn = document.getElementById("repeatBtn");
const bpmInput = document.getElementById("bpm");
const bloques = Array.from(document.querySelectorAll(".bloque"));

const figuras = ["redonda", "blanca", "negra", "corchea", "semicorchea"];
const valores = {
  redonda: 4,
  blanca: 2,
  negra: 1,
  corchea: 0.5,
  semicorchea: 0.25
};

let secuencia = [];

function generarSecuencia() {
  return Array.from({ length: 4 }, () => figuras[Math.floor(Math.random() * figuras.length)]);
}

function esperar(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function animarBloque(bloque, figura, pulsoMs) {
  const pulsos = valores[figura];
  const intervalo = (pulsoMs * valores["negra"]) / pulsos;

  for (let i = 0; i < pulsos; i++) {
    bloque.classList.add("activo");
    await esperar(intervalo / 2);
    bloque.classList.remove("activo");
    await esperar(intervalo / 2);
  }
}

async function reproducirSecuencia() {
  const bpm = parseInt(bpmInput.value);
  const pulsoMs = 60000 / bpm;

  for (let i = 0; i < secuencia.length; i++) {
    await animarBloque(bloques[i], secuencia[i], pulsoMs);
    await esperar(500); // pequeña pausa entre bloques
  }

  repeatBtn.disabled = false;
}

startBtn.addEventListener("click", () => {
  secuencia = generarSecuencia();
  repeatBtn.disabled = true;
  reproducirSecuencia();
});

repeatBtn.addEventListener("click", () => {
  repeatBtn.disabled = true;
  reproducirSecuencia();
});
