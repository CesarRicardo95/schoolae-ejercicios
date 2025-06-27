// Frecuencias para Do4 y Mi4 (notas conocidas)
const notas = {
  tono1: { nombre: "Do4 (C4)", frecuencia: 261.63 },
  tono2: { nombre: "Mi4 (E4)", frecuencia: 329.63 }
};

let audioCtx = null;
let oscillator = null;

function playTone(frecuencia) {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (oscillator) {
    oscillator.stop();
    oscillator.disconnect();
  }
  oscillator = audioCtx.createOscillator();
  oscillator.type = 'sine';
  oscillator.frequency.setValueAtTime(frecuencia, audioCtx.currentTime);
  oscillator.connect(audioCtx.destination);
  oscillator.start();

  // Para que suene 1.5 segundos
  setTimeout(() => {
    oscillator.stop();
  }, 1500);
}

document.getElementById('tono1Btn').addEventListener('click', () => {
  playTone(notas.tono1.frecuencia);
});

document.getElementById('tono2Btn').addEventListener('click', () => {
  playTone(notas.tono2.frecuencia);
});

const radios = document.querySelectorAll('input[name="nota"]');
const aceptarBtn = document.getElementById('aceptarBtn');
const resultadoDiv = document.getElementById('resultado');

radios.forEach(radio => {
  radio.addEventListener('change', () => {
    aceptarBtn.disabled = false;
    resultadoDiv.textContent = "";
  });
});

aceptarBtn.addEventListener('click', () => {
  const seleccionado = document.querySelector('input[name="nota"]:checked').value;

  // La más aguda es tono2 (Mi4)
  const correcta = "tono2";

  if (seleccionado === correcta) {
    resultadoDiv.textContent = `¡Correcto! La nota más aguda es ${notas[correcta].nombre}.`;
    resultadoDiv.style.color = "#4caf50";
  } else {
    resultadoDiv.textContent = `Incorrecto. La nota más aguda es ${notas[correcta].nombre}.`;
    resultadoDiv.style.color = "#f44336";
  }
});
