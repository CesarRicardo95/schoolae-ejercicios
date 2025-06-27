let inicio, intervalo, visible = true;

function iniciarCrono() {
  clearInterval(intervalo);
  document.getElementById("resultado").innerText = "";

  const reloj = document.getElementById("reloj");

  if (visible) {
    reloj.style.visibility = "visible";
    reloj.classList.remove("oculto");
  } else {
    reloj.style.visibility = "hidden"; // Oculto visualmente
    reloj.classList.add("oculto");     // Se mantiene rojo cuando reaparece
  }

  reloj.innerText = "0.00 s";

  inicio = Date.now();

  intervalo = setInterval(() => {
    let tiempo = (Date.now() - inicio) / 1000;
    reloj.innerText = tiempo.toFixed(2) + " s";
  }, 50);
}

function detenerCrono() {
  clearInterval(intervalo);
  const reloj = document.getElementById("reloj");
  let final = (Date.now() - inicio) / 1000;

  reloj.style.visibility = "visible"; // Siempre visible al detener
  reloj.innerText = final.toFixed(2) + " s";

  document.getElementById("resultado").innerText =
    `⏳ Tiempo estimado: ${final.toFixed(2)} segundos`;

  visible = !visible; // Alterna visibilidad para siguiente intento
}

