document.addEventListener("DOMContentLoaded", () => {
  const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

  const semitonos = {
    "C": 261.63,
    "C#": 277.18,
    "D": 293.66,
    "D#": 311.13,
    "E": 329.63,
    "F": 349.23,
    "F#": 369.99,
    "G": 392.00,
    "G#": 415.30,
    "A": 440.00,
    "A#": 466.16,
    "B": 493.88,
  };

  const notas = Object.values(semitonos);

  const reproducirBtn = document.getElementById("reproducirBtn");
  const aceptarBtn = document.getElementById("aceptarBtn");
  const resultado = document.getElementById("resultado");
  const radios = document.querySelectorAll("input[name='tipo']");
  const rondaTexto = document.getElementById("ronda");

  let tipoCorrecto = ""; // "mayor" o "menor"
  let rondaActual = 1;
  const totalRondas = 10;
  let aciertosTotales = 0;

  function crearAcorde(baseFreq, tipo) {
    const tercera = tipo === "mayor" ? baseFreq * Math.pow(2, 4 / 12) : baseFreq * Math.pow(2, 3 / 12);
    const quinta = baseFreq * Math.pow(2, 7 / 12);
    return [baseFreq, tercera, quinta];
  }

  function reproducirAcorde(frecuencias) {
    frecuencias.forEach(freq => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
      osc.start();
      osc.stop(audioCtx.currentTime + 1.5);
    });
  }

  function nuevaRonda() {
    const baseFreq = notas[Math.floor(Math.random() * notas.length)];
    tipoCorrecto = Math.random() > 0.5 ? "mayor" : "menor";
    const acorde = crearAcorde(baseFreq, tipoCorrecto);
    reproducirBtn.onclick = () => reproducirAcorde(acorde);

    radios.forEach(r => (r.checked = false));
    aceptarBtn.disabled = true;
    resultado.textContent = "";
    rondaTexto.textContent = `Ronda ${rondaActual} de ${totalRondas}`;
  }

  radios.forEach(radio => {
    radio.addEventListener("change", () => {
      aceptarBtn.disabled = false;
      resultado.textContent = "";
    });
  });

  aceptarBtn.addEventListener("click", () => {
    const seleccion = document.querySelector("input[name='tipo']:checked").value;

    if (seleccion === tipoCorrecto) {
      resultado.textContent = "✅ ¡Correcto!";
      resultado.style.color = "#4caf50";
      aciertosTotales++;
    } else {
      resultado.textContent = `❌ Incorrecto. Era un acorde ${tipoCorrecto}.`;
      resultado.style.color = "#f44336";
    }

    rondaActual++;

    if (rondaActual > totalRondas) {
      setTimeout(() => {
        resultado.innerHTML = `🎯 Fin del ejercicio.<br>Resultado: <strong>${aciertosTotales} de ${totalRondas} aciertos</strong>`;
        resultado.style.color = "#000";
        setTimeout(() => {
          rondaActual = 1;
          aciertosTotales = 0;
          nuevaRonda();
          resultado.textContent = "";
        }, 5000);
      }, 2000);
    } else {
      setTimeout(nuevaRonda, 2000);
    }
  });

  nuevaRonda();
});
