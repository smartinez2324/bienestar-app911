// Navegación entre secciones con guardado en localStorage
function mostrarSeccion(id) {
  document.querySelectorAll('main section').forEach(sec => {
    sec.classList.remove('active');
  });
  document.getElementById(id).classList.add('active');
  localStorage.setItem('seccionActiva', id);
}

// Al cargar la página, mostrar la sección guardada o por defecto "meditaciones"
const seccionGuardada = localStorage.getItem('seccionActiva') || 'meditaciones';
mostrarSeccion(seccionGuardada);

// Diario emocional
const diario = document.getElementById('entradaDiario');
diario.value = localStorage.getItem('diarioHoy') || '';
diario.addEventListener('input', () => {
  localStorage.setItem('diarioHoy', diario.value);
});

// Afirmaciones generales (día)
const afirmacionesGenerales = [
  "Soy suficiente tal y como soy.",
  "Merezco paz y bienestar.",
  "Hoy es un buen día para empezar de nuevo.",
  "Mi mente y mi cuerpo trabajan en armonía.",
  "Estoy a salvo, estoy en calma.",
  "Cada día tengo nuevas oportunidades para crecer.",
  "Respiro profundo, suelto el estrés."
];
const afirmacionDia = document.getElementById('afirmacion-dia');
const random = Math.floor(Math.random() * afirmacionesGenerales.length);
afirmacionDia.textContent = afirmacionesGenerales[random];

// Afirmaciones personalizadas del usuario con categoría
let afirmacionesUsuario = JSON.parse(localStorage.getItem('afirmacionesUsuario')) || [];

// Elementos del DOM
const lista = document.getElementById('lista-afirmaciones');
const input = document.getElementById('input-nueva-afirmacion');
const categoriaInput = document.getElementById('input-categoria-afirmacion');
const btnAgregar = document.getElementById('btn-agregar-afirmacion');
const filtroCategoria = document.getElementById('filtro-categoria');

function renderizarAfirmaciones() {
  lista.innerHTML = '';

  // Obtener categoría seleccionada para filtrar
  const filtro = filtroCategoria.value;

  afirmacionesUsuario.forEach((obj, index) => {
    // Mostrar solo si la categoría coincide o si es "todas"
    if (filtro === 'todas' || obj.categoria === filtro) {
      const li = document.createElement('li');
      li.style.marginBottom = '0.5rem';

      const texto = document.createElement('span');
      texto.textContent = obj.texto + ` (${obj.categoria})`;
      texto.style.marginRight = '0.5rem';

      const editarBtn = document.createElement('button');
      editarBtn.textContent = '✏️';
      editarBtn.style.marginRight = '0.3rem';
      editarBtn.setAttribute('aria-label', `Editar afirmación: ${obj.texto}`);
      editarBtn.onclick = () => {
        const nueva = prompt('Editar afirmación:', obj.texto);
        if (nueva && nueva.trim()) {
          obj.texto = nueva.trim();
          guardarYRenderizar();
        }
      };

      const eliminarBtn = document.createElement('button');
      eliminarBtn.textContent = '🗑️';
      eliminarBtn.setAttribute('aria-label', `Eliminar afirmación: ${obj.texto}`);
      eliminarBtn.onclick = () => {
        if (confirm('¿Estás seguro de que quieres eliminar esta afirmación?')) {
          afirmacionesUsuario.splice(index, 1);
          guardarYRenderizar();
        }
      };

      li.appendChild(texto);
      li.appendChild(editarBtn);
      li.appendChild(eliminarBtn);
      lista.appendChild(li);
    }
  });
}

function guardarYRenderizar() {
  localStorage.setItem('afirmacionesUsuario', JSON.stringify(afirmacionesUsuario));
  renderizarAfirmaciones();
}

// Añadir afirmación con categoría
btnAgregar.addEventListener('click', () => {
  const nueva = input.value.trim();
  const categoria = categoriaInput.value;
  if (nueva) {
    afirmacionesUsuario.push({ texto: nueva, categoria: categoria });
    input.value = '';
    guardarYRenderizar();
  }
});

// Cambiar filtro y renderizar
filtroCategoria.addEventListener('change', () => {
  renderizarAfirmaciones();
});

// Meditaciones con reproductor
const meditaciones = [
  {
    titulo: "Meditación para la calma",
    duracion: "5:30",
    descripcion: "Relájate y suelta la tensión con esta meditación guiada.",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
  },
  {
    titulo: "Respira profundo",
    duracion: "7:10",
    descripcion: "Ejercicios de respiración para equilibrar tu mente.",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3"
  },
  {
    titulo: "Visualización positiva",
    duracion: "6:45",
    descripcion: "Visualiza escenarios positivos y cultiva bienestar.",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3"
  }
];

const listaMeditaciones = document.getElementById('lista-meditaciones');
const playerMeditacion = document.getElementById('player-meditacion');

function renderizarMeditaciones() {
  listaMeditaciones.innerHTML = '';

  meditaciones.forEach((meditacion, index) => {
    const div = document.createElement('div');
    div.style.border = '1px solid #ccc';
    div.style.padding = '1rem';
    div.style.marginBottom = '1rem';
    div.style.borderRadius = '8px';
    div.style.cursor = 'pointer';

    div.innerHTML = `
      <h3>${meditacion.titulo} <small style="font-weight: normal; color: gray;">(${meditacion.duracion})</small></h3>
      <p style="margin-top: 0.3rem;">${meditacion.descripcion}</p>
    `;

    div.addEventListener('click', () => {
      playerMeditacion.src = meditacion.audioUrl;
      playerMeditacion.play();
    });

    listaMeditaciones.appendChild(div);
  });
}

// Inicializar renderizado meditaciones y afirmaciones
renderizarMeditaciones();
renderizarAfirmaciones();

// Tema claro / oscuro
const toggleBtn = document.getElementById('toggle-tema');
const body = document.body;
const temaGuardado = localStorage.getItem('tema');

if (temaGuardado === 'oscuro') {
  body.classList.add('modo-oscuro');
  toggleBtn.textContent = '☀️ Modo claro';
}

toggleBtn.addEventListener('click', () => {
  const modoOscuro = body.classList.toggle('modo-oscuro');
  if (modoOscuro) {
    toggleBtn.textContent = '☀️ Modo claro';
    localStorage.setItem('tema', 'oscuro');
  } else {
    toggleBtn.textContent = '🌙 Modo oscuro';
    localStorage.setItem('tema', 'claro');
  }
});


// Notificación diaria de afirmación o meditación
if ('Notification' in window) {
  if (Notification.permission !== 'granted' && Notification.permission !== 'denied') {
    Notification.requestPermission();
  }

  const ultimaNotificacion = localStorage.getItem('ultimaNotificacion');
  const hoy = new Date().toDateString();

  if (Notification.permission === 'granted' && ultimaNotificacion !== hoy) {
    const opciones = [
      "¿Ya respiraste profundo hoy? 🧘",
      "Tómate un momento para tu afirmación diaria 💬",
      "Vuelve al centro, respira, conecta 🌿"
    ];
    const mensaje = opciones[Math.floor(Math.random() * opciones.length)];

    new Notification('Bienestar App', {
      body: mensaje,
      icon: 'https://cdn-icons-png.flaticon.com/512/4320/4320337.png' // puedes usar otro ícono si prefieres
    });

    localStorage.setItem('ultimaNotificacion', hoy);
  }
}

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('./service-worker.js')
      .then((reg) => console.log('Service Worker registrado ✔️', reg))
      .catch((err) => console.error('Error al registrar Service Worker ❌', err));
  });
}

