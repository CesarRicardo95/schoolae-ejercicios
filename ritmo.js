// Figuras musicales y sus símbolos unicode simples para visual
const FIGURAS = {
  redonda: "𝅝",   // U+1D15D (puede que no se vea en todos los navegadores, usar alternativa)
  blanca: "𝅗𝅥",
  negra: "♩",
  corchea: "♪",
  fusa: "♫"
};

// Para mejor compatibilidad, vamos a usar letras como alternativa
const FIGURAS_ALT = {
  redonda: "R",
  blanca: "B",
  negra: "N",
  corchea: "C",
  fusa: "F"
};

// Secuencia correcta (4 pulsos):
// 1º Redonda, 2º Negra, 3º Blanca, 4º Fusa
const SECUENCIA_CORRECTA = ["redonda", "negra", "blanca", "fusa"];

// Opciones (una correcta y dos distractoras)
const OPCIONES = [
  ["redonda", "negra", "blanca", "fusa"],        // correcta
  ["blanca", "corchea", "negra", "fusa"],       // distractora 1
  ["negra", "negra", "blanca", "corchea"],      // distractora 2
];

const secuenciaDiv = document.getElementById("secuencia-animada");
const mostrarOpcionesBtn = document.getElementById("mostrarOpcionesBtn");
const opcionesDiv = document.getElementById("opciones");
const resultadoDiv = document.getElementById("resultado");

// Mostrar una figura con efecto activo
function crearFigura(tipo, activa = false) {
  const div = document.createElement("div");
  div.classList.add("figura");
  if (activa) div.classList.add("activa");

  // Usa símbolo unicode o alternativa
  // div.textContent = FIGURAS[tipo] || FIGURAS_ALT[tipo];
  div.textContent = FIGURAS_ALT[tipo] || "?";

  return div;
}

// Animar la secuencia, encendiendo cada figura secuencialmente
function animarSecuencia(secuencia, callback) {
  secuenciaDiv.innerHTML = "";
  secuencia.forEach((figura) => {
    const div = crearFigura(figura);
    secuenciaDiv.appendChild(div);
  });

  let i = 0;
  function animarPaso() {
    if (i > 0) {
      secuenciaDiv.children[i - 1].classList.remove("activa");
    }
    if (i < secuencia.length) {
      secuenciaDiv.children[i].classList.add("activa");
      i++;
      setTimeout(animarPaso, 800); // 800ms por pulso
    } else {
      // Apagar última figura
      if (i > 0) {
        secuenciaDiv.children[i - 1].classList.remove("activa");
      }
      if (callback) callback();
    }
  }
  animarPaso();
}

// Mostrar opciones para que el usuario elija
function mostrarOpciones() {
  opcionesDiv.innerHTML = "";
  opcionesDiv.style.display = "flex";
  resultadoDiv.textContent = "";

  OPCIONES.forEach((opcion, idx) => {
    const opcionDiv = document.createElement("div");
    opcionDiv.classList.add("opcion");
    opcionDiv.dataset.idx = idx;

    const contFiguras = document.createElement("div");
    contFiguras.classList.add("figura-opcion");

    opcion.forEach((fig) => {
      contFiguras.appendChild(crearFigura(fig));
    });

    opcionDiv.appendChild(contFiguras);
    opcionesDiv.appendChild(opcionDiv);

    opcionDiv.addEventListener("click", () => {
      verificarRespuesta(idx);
    });
  });
}

// Verificar si la opción elegida es correcta
function verificarRespuesta(idx) {
  if (idx === 0) {
    resultadoDiv.textContent = "¡Correcto! 🎉";
    resultadoDiv.style.color = "#4caf50";
  } else {
    resultadoDiv.textContent = "Incorrecto, intenta otra vez.";
    resultadoDiv.style.color = "#f44336";
  }
  // Mostrar colores de retroalimentación
  Array.from(opcionesDiv.children).forEach((child, i) => {
    child.classList.remove("correcta", "incorrecta");
    if (i === 0) child.classList.add("correcta");
    else child.classList.add("incorrecta");
  });
}

mostrarOpcionesBtn.addEventListener("click", () => {
  mostrarOpcionesBtn.disabled = true;
  animarSecuencia(SECUENCIA_CORRECTA, () => {
    mostrarOpciones();
  });
});
