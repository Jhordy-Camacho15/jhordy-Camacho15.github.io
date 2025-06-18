// This file contains JavaScript code that will dynamically generate and manipulate HTML content within the index.html file.

// Variables globales
let data = null;
let currentGrade = null;
let currentSubject = null;
let currentLecture = null;
let currentPage = 0;
let fontSize = 18;

// Cargar datos JSON
async function loadData() {
  const res = await fetch('data.json');
  data = await res.json();
  showHome();
}

// Pantalla HOME
function showHome() {
  currentGrade = null;
  currentSubject = null;
  currentLecture = null;
  currentPage = 0;
  document.getElementById('app').innerHTML = `
    <div class="container home-container">
      <h1></h1>
      <img src="logo.png" alt="Logo" class="logo">
      <button class="main-btn" onclick="showGrades()">EMPEZAR</button>
    </div>
  `;
}

// Pantalla GRADOS
function showGrades() {
  let gradesHtml = data.grados.map(g => `
    <div class="grade-row" onclick="showSubjects('${g.id}')">
      <div class="grade-img"><img src="grado.png" alt="${g.nombre}"></div>
      <div class="grade-text">${g.nombre}</div>
    </div>
  `).join('');
  document.getElementById('app').innerHTML = `
    <div class="container grades-container">
      <button class="back-btn" onclick="showHome()">←</button>
      <div class="grades-list">${gradesHtml}</div>
    </div>
  `;
}

// Pantalla MATERIAS
function showSubjects(gradeId) {
  currentGrade = data.grados.find(g => g.id === gradeId);
  let subjects = currentGrade.materias;
  let subjectsHtml = subjects.map(m => `
    <div class="subject-row" onclick="showLectures('${m.id}')">
      <div class="subject-img"><img src="materia.png" alt="${m.nombre}"></div>
      <div class="subject-text">${m.nombre}</div>
    </div>
  `).join('');
  document.getElementById('app').innerHTML = `
    <div class="container subjects-container">
      <button class="back-btn" onclick="showGrades()">←</button>
      <div class="subjects-list">${subjectsHtml}</div>
    </div>
  `;
}

// Pantalla LECTURAS
function showLectures(subjectId) {
  currentSubject = currentGrade.materias.find(m => m.id === subjectId);
  let lectures = currentSubject.lecturas;
  let lecture = lectures[0]; // Solo una por ahora
  currentLecture = lecture;
  currentPage = 0;
  renderLecture();
}

// Renderizar pantalla de LECTURA
function renderLecture() {
  let lecture = currentLecture;
  let totalPages = lecture.paginas.length;
  let pageText = lecture.paginas[currentPage];
  document.getElementById('app').innerHTML = `
    <div class="container lecture-container">
      <button class="back-btn" onclick="showSubjects('${currentGrade.id}')">←</button>
      <div class="lecture-audio" id="audioBtn">
        <span>🔊 AUDIO</span>
      </div>
      <div class="lecture-content">
        <div class="lecture-title">${lecture.titulo}</div>
        <div class="lecture-text" id="lectureText" style="font-size: ${fontSize}px;">
          ${pageText}
        </div>
        <div class="lecture-nav">
          <button class="nav-btn" onclick="prevPage()" ${currentPage === 0 ? 'disabled' : ''}>⟵</button>
          <span>${currentPage + 1} / ${totalPages}</span>
          <button class="nav-btn" onclick="nextPage()" ${currentPage === totalPages - 1 ? 'disabled' : ''}>⟶</button>
        </div>
      </div>
      <div class="font-size-bar">
        <button onclick="changeFontSize(-2)">-</button>
        <input type="range" min="14" max="32" value="${fontSize}" oninput="setFontSize(this.value)">
        <button onclick="changeFontSize(2)">+</button>
      </div>
    </div>
  `;
  // Vincula el botón de audio después de renderizar
  document.getElementById('audioBtn').onclick = playAudio;
}

// Navegación de páginas
function nextPage() {
  window.speechSynthesis.cancel();
  if (currentPage < currentLecture.paginas.length - 1) {
    currentPage++;
    renderLecture();
  }
}
function prevPage() {
  window.speechSynthesis.cancel();
  if (currentPage > 0) {
    currentPage--;
    renderLecture();
  }
}

// Cambiar tamaño de fuente
function changeFontSize(delta) {
  fontSize = Math.max(14, Math.min(32, fontSize + delta));
  renderLecture();
}
function setFontSize(val) {
  fontSize = parseInt(val, 10);
  renderLecture();
}

// Reproducir audio o leer texto
function playAudio() {
  window.speechSynthesis.cancel(); // Detener cualquier lectura anterior
  const text = document.getElementById('lectureText')?.innerText;
  if (text) {
    const utterance = new window.SpeechSynthesisUtterance(text);
    utterance.lang = 'es-ES';
    window.speechSynthesis.speak(utterance);
  }
}

// Inicializar
window.onload = loadData;

// Hacer funciones globales para los onclicks en HTML
window.showHome = showHome;
window.showGrades = showGrades;
window.showSubjects = showSubjects;
window.showLectures = showLectures;
window.nextPage = nextPage;
window.prevPage = prevPage;
window.changeFontSize = changeFontSize;
window.setFontSize = setFontSize;
window.playAudio = playAudio;
