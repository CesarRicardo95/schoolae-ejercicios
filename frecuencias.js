document.addEventListener('DOMContentLoaded', () => {
  // Lista de notas musicales para asignar nombres a frecuencias
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

  // Devuelve el nombre de la nota más cercana a una frecuencia
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

  // Genera una frecuencia entre 130 Hz y 523 Hz
  function generarFrecuenciaAleatoria() {
    return Math.random() * (523.25 - 130.81) + 130.81;
  }

  let audioCtx = null;
  let oscillator = null;
  let oscillatorTimeout = null;

  function playTone(frecuencia) {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (oscillator) {
      oscillator.stop();
      oscillator.disconnect();
      oscillator = null;
      clearTimeout(oscillatorTimeout);
    }

    oscillator = audioCtx.createOscillator();
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(frecuencia, audioCtx.currentTime);

    const gainNode = audioCtx.createGain();
    gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime); // volumen moderado

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    oscillator.start();
    oscillator.stop(audioCtx.currentTime + 1.5);
  }

  // Variables del ejercicio
  let tono1Freq = 0;
  let tono2Freq = 0;
  let rondaActual = 1;
  let aciertosTotales = 0;
  const totalRondas = 10;

  // Referencias al DOM
  const btnTono1 = document.getElementById('tono1Btn');
  const btnTono2 = document.getElementById('tono2Btn');
  const aceptarBtn = document.getElementById('aceptarBtn');
  const resultadoDiv = document.getElementById('resultado');
  const rondaDiv = document.getElementById('ronda');
  const radios = document.querySelectorAll('input[name="nota"]');

  function initEjercicio() {
    // Asegura que las frecuencias sean diferentes
    do {
      tono1Freq = generarFrecuenciaAleatoria();
      tono2Freq = generarFrecuenciaAleatoria();
    } while (Math.abs(tono1Freq - tono2Freq) < 10);

    aceptarBtn.disabled = true;
    resultadoDiv.textContent = '';
    resultadoDiv.style.color = '#333';
    radios.forEach(r => r.checked = false);
    rondaDiv.textContent = `Ronda ${rondaActual} de ${totalRondas}`;
  }

  btnTono1.addEventListener('click', () => playTone(tono1Freq));
  btnTono2.addEventListener('click', () => playTone(tono2Freq));

  radios.forEach(radio => {
    radio.addEventListener('change', () => {
      aceptarBtn.disabled = false;
      resultadoDiv.textContent = '';
    });
  });

  aceptarBtn.addEventListener('click', () => {
    const seleccionado = document.querySelector('input[name="nota"]:checked').value;
    const freqSeleccionada = seleccionado === 'tono1' ? tono1Freq : tono2Freq;
    const freqCorrecta = Math.max(tono1Freq, tono2Freq);
    const correcta = tono1Freq > tono2Freq ? 'tono1' : 'tono2';

    const notaCorrecta = frecuenciaANota(freqCorrecta);
    const notaSeleccionada = frecuenciaANota(freqSeleccionada);

    const comparacion = freqSeleccionada === freqCorrecta
      ? "más aguda"
      : freqSeleccionada > freqCorrecta
        ? "más aguda que la correcta"
        : "más grave que la correcta";

    if (seleccionado === correcta) {
      resultadoDiv.textContent = `✅ ¡Correcto! Seleccionaste ${notaSeleccionada}, que es la más aguda.`;
      resultadoDiv.style.color = "#4caf50";
      aciertosTotales++;
    } else {
      resultadoDiv.textContent = `❌ Incorrecto. Seleccionaste ${notaSeleccionada}, que es ${comparacion}. La correcta era ${notaCorrecta}.`;
      resultadoDiv.style.color = "#f44336";
    }

    rondaActual++;

    if (rondaActual > totalRondas) {
      setTimeout(() => {
        resultadoDiv.innerHTML = `🎯 Fin del ejercicio.<br>Resultado: <strong>${aciertosTotales} de ${totalRondas} aciertos</strong>`;
        resultadoDiv.style.color = "#000";
        setTimeout(() => {
          rondaActual = 1;
          aciertosTotales = 0;
          resultadoDiv.textContent = '';
          initEjercicio();
        }, 5000);
      }, 2000);
    } else {
      setTimeout(initEjercicio, 2000);
    }
  });

  initEjercicio();
});

