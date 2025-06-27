// Tabla con notas y frecuencias para referencia (C4 = 261.63 Hz)
// Solo las notas naturales (sin sostenidos) para simplificar
const notasTabla = [
  { nombre: "Do3", frecuencia: 130.81 },
  { nombre: "Re3", frecuencia: 146.83 },
  { nombre: "Mi3", frecuencia: 164.81 },
  { nombre: "Fa3", frecuencia: 174.61 },
  { nombre: "Sol3", frecuencia: 196.00 },
  { nombre: "La3", frecuencia: 220.00 },
  { nombre: "Si3", frecuencia: 246.94 },
  { nombre: "Do4", frecuencia: 261.63 },
  { nombre: "Re4", frecuencia: 293.66 },
  { nombre: "Mi4", frecuencia: 329.63 },
  { nombre: "Fa4", frecuencia: 349.23 },
  { nombre: "Sol4", frecuencia: 392.00 },
  { nombre: "La4", frecuencia: 440.00 },
  { nombre: "Si4", frecuencia: 493.88 },
  { nombre: "Do5", frecuencia: 523.25 },
];

// Función para buscar la nota más cercana a una frecuencia dada
function frecuenciaANota(freq) {
  let notaCercana = notasTabla[0];
  let minDif = Math.abs(freq - notaCercana.frecuencia);

  for (const nota of notasTabla) {
    const dif = Math.abs(freq - nota.frecuencia);
    if (dif < minDif) {
      minDif = dif;
      notaCercana = nota;
    }
  }
  return notaCercana.nombre;
}

// Genera una frecuencia aleatoria entre 130Hz y 523Hz (Do3 a Do5)
function generarFrecuenciaAleatoria() {
  return Math.random() * (523.25 - 130.81) + 130.81;
}

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

  setTimeout(() => {
    oscillator.stop();
  }, 1500);
}

// Variables para las frecuencias generadas
let tono1Freq = 0;
let tono2Freq = 0;

const btnTono1 = document.getElementById('tono1Btn');
const btnTono2 = document.getElementById('tono2Btn');
const aceptarBtn = document.getElementById('aceptarBtn');
const resultadoDiv = document.getElementById('resultado');
const radios = document.querySelectorAll('input[name="nota"]');

// Inicializar ejercicio: generar dos tonos diferentes
function initEjercicio() {
  do {
    tono1Freq = generarFrecuenciaAleatoria();
    tono2Freq = generarFrecuenciaAleatoria();
  } while (Math.abs(tono1Freq - tono2Freq) < 15); // aseguramos diferencia suficiente

  aceptarBtn.disabled = true;
  resultadoDiv.textContent = '';
  radios.forEach(radio => radio.checked = false);
}

btnTono1.addEventListener('click', () => {
  playTone(tono1Freq);
});

btnTono2.addEventListener('click', () => {
  playTone(tono2Freq);
});

radios.forEach(radio => {
  radio.addEventListener('change', () => {
    aceptarBtn.disabled = false;
    resultadoDiv.textContent = '';
  });
});

aceptarBtn.addEventListener('click', () => {
  const seleccionado = document.querySelector('input[name="nota"]:checked').value;
  const correcta = (tono1Freq > tono2Freq) ? 'tono1' : 'tono2';

  const notaCorrecta = frecuenciaANota(Math.max(tono1Freq, tono2Freq));
  const notaSeleccionada = frecuenciaANota(seleccionado === 'tono1' ? tono1Freq : tono2Freq);

  if (seleccionado === correcta) {
    resultadoDiv.textContent = `¡Correcto! La nota más aguda es ${notaCorrecta}.`;
    resultadoDiv.style.color = "#4caf50";
  } else {
    resultadoDiv.textContent = `Incorrecto. La nota más aguda es ${notaCorrecta}, seleccionaste ${notaSeleccionada}.`;
    resultadoDiv.style.color = "#f44336";
  }

  // Reiniciar con nuevos tonos
  initEjercicio();
});

// Iniciar el ejercicio al cargar la página
window.addEventListener('load', initEjercicio);
