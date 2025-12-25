// Variables globales
let appData = {};
let currentCourse = null;
let currentSubject = null;
let currentTopic = null;
let currentQuestionIndex = 0;
let userAnswers = [];
let correctAnswers = 0;
let shuffledQuestionIndices = []; // <-- Añade esto
let teoriaUtterance = null;

// Elementos del DOM
const sections = {
    cursos: document.getElementById('cursos-section'),
    asignaturas: document.getElementById('asignaturas-section'),
    temas: document.getElementById('temas-section'),
    teoria: document.getElementById('teoria-section'),
    leccion: document.getElementById('leccion-section'),
    resultados: document.getElementById('results-section')
};

// Elementos de contenido
const contentElements = {
    cursosList: document.getElementById('cursos-list'),
    asignaturasTitle: document.getElementById('asignaturas-title'),
    asignaturasList: document.getElementById('asignaturas-list'),
    temasTitle: document.getElementById('temas-title'),
    temasList: document.getElementById('temas-list'),
    teoriaTitle: document.getElementById('teoria-title'),
    teoriaContent: document.getElementById('teoria-content'),
    leccionTitle: document.getElementById('leccion-title'),
    preguntaText: document.getElementById('pregunta-text'),
    opcionesContainer: document.getElementById('opciones-container'),
    feedbackContainer: document.getElementById('feedback-container'),
    revealAnswerBtn: document.getElementById('reveal-answer'),
    nextQuestionBtn: document.getElementById('next-question'),
    resultsContainer: document.getElementById('results-container')
};

// Botones de acción
const actionButtons = {
    startLeccion: document.getElementById('start-leccion'),
    restartLeccion: document.getElementById('restart-leccion'),
    returnToTema: document.getElementById('return-to-tema')
};

// Botones de audio
const audioBtn = document.getElementById('audio-btn');
const audioPauseBtn = document.getElementById('audio-pause-btn');
const audioResumeBtn = document.getElementById('audio-resume-btn');
const audioRestartBtn = document.getElementById('audio-restart-btn');
const globalBackButton = document.getElementById('global-back-button');
const homeButton = document.getElementById('home-button');

// Estado inicial: solo audio-btn visible
function resetAudioButtons() {
    audioBtn.classList.add('audio-visible');
    audioPauseBtn.classList.remove('audio-visible');
    audioResumeBtn.classList.remove('audio-visible');
    audioRestartBtn.classList.remove('audio-visible');
}

// Mostrar pausa y reiniciar, ocultar audio-btn
function showPauseRestart() {
    audioBtn.classList.remove('audio-visible'); // OCULTA audio.png
    audioPauseBtn.classList.add('audio-visible');
    audioRestartBtn.classList.add('audio-visible');
    audioResumeBtn.classList.remove('audio-visible');
}

// Mostrar play, ocultar pausa
function showResume() {
    audioPauseBtn.classList.remove('audio-visible');
    audioResumeBtn.classList.add('audio-visible');
}

// Mostrar pausa, ocultar play
function showPause() {
    audioResumeBtn.classList.remove('audio-visible');
    audioPauseBtn.classList.add('audio-visible');
}

// Cargar datos JSON
fetch('data.json')
    .then(response => response.json())
    .then(data => {
        appData = data;
        loadCursos(); // Solo aquí
    })
    .catch(error => console.error('Error al cargar los datos:', error));

// Función para cargar cursos
function loadCursos() {
    contentElements.cursosList.innerHTML = '';
    
    appData.cursos.forEach(curso => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `<h3>${curso.nombre}</h3>`;
        card.addEventListener('click', () => showAsignaturas(curso));
        contentElements.cursosList.appendChild(card);
    });
    
    showSection('cursos');
}

// Función para mostrar asignaturas de un curso
function showAsignaturas(curso) {
    currentCourse = curso;
    contentElements.asignaturasTitle.textContent = curso.nombre;
    contentElements.asignaturasList.innerHTML = '';
    
    if (curso.asignaturas.length === 0) {
        contentElements.asignaturasList.innerHTML = '<p>No hay asignaturas disponibles para este curso.</p>';
    } else {
        curso.asignaturas.forEach(asignatura => {
            const card = document.createElement('div');
            card.className = 'card';
            card.innerHTML = `<h3>${asignatura.nombre}</h3>`;
            card.addEventListener('click', () => showTemas(asignatura));
            contentElements.asignaturasList.appendChild(card);
        });
    }
    
    showSection('asignaturas');
}

// Función para mostrar temas de una asignatura
function showTemas(asignatura) {
    currentSubject = asignatura;
    contentElements.temasTitle.textContent = asignatura.nombre;
    contentElements.temasList.innerHTML = '';
    
    if (asignatura.temas.length === 0) {
        contentElements.temasList.innerHTML = '<p>No hay temas disponibles para esta asignatura.</p>';
    } else {
        asignatura.temas.forEach(tema => {
            const card = document.createElement('div');
            card.className = 'card';
            card.innerHTML = `<h3>${tema.nombre}</h3>`;
            card.addEventListener('click', () => showTeoria(tema));
            contentElements.temasList.appendChild(card);
        });
    }
    
    showSection('temas');
}

// Función para mostrar teoría de un tema
function showTeoria(tema) {
    currentTopic = tema;
    contentElements.teoriaTitle.textContent = tema.nombre;
    contentElements.teoriaContent.innerHTML = '';
    
    if (tema.teoria.length === 0) {
        contentElements.teoriaContent.innerHTML = '<p>No hay contenido teórico disponible para este tema.</p>';
    } else {
        tema.teoria.forEach((parrafo, index) => {
            const p = document.createElement('p');
            p.textContent = parrafo;
            p.style.marginBottom = '15px';
            contentElements.teoriaContent.appendChild(p);
        });
    }
    
    resetAudioButtons(); // <-- Añade esto
    showSection('teoria');
}

// Función para comenzar lección
function startLeccion() {
    if (!currentTopic || currentTopic.lecciones.length === 0) {
        alert('No hay lecciones disponibles para este tema.');
        return;
    }

    currentQuestionIndex = 0;
    userAnswers = [];
    correctAnswers = 0;
    // Mezcla los índices de las preguntas
    shuffledQuestionIndices = shuffleArray([...Array(currentTopic.lecciones.length).keys()]);
    contentElements.leccionTitle.textContent = currentTopic.nombre;
    loadQuestion();
    showSection('leccion');
}

// Función para cargar pregunta
function loadQuestion() {
    const preguntaIndex = shuffledQuestionIndices[currentQuestionIndex];
    const pregunta = currentTopic.lecciones[preguntaIndex];

    // Mezclar opciones y guardar el nuevo índice de la respuesta correcta
    const opcionesOriginales = pregunta.opciones.map((op, idx) => ({
        texto: op,
        esCorrecta: idx === pregunta.respuesta
    }));
    const opcionesMezcladas = shuffleArray(opcionesOriginales.slice());

    // Guardar el índice de la opción correcta después de mezclar
    pregunta.opcionesMezcladas = opcionesMezcladas.map(op => op.texto);
    pregunta.respuestaMezclada = opcionesMezcladas.findIndex(op => op.esCorrecta);

    // Mostrar pregunta
    contentElements.preguntaText.textContent = pregunta.pregunta;
    contentElements.opcionesContainer.innerHTML = '';

    // Mostrar opciones mezcladas
    pregunta.opcionesMezcladas.forEach((opcion, index) => {
        const opcionElement = document.createElement('div');
        opcionElement.className = 'opcion';
        opcionElement.textContent = opcion;
        opcionElement.dataset.index = index;
        opcionElement.addEventListener('click', () => selectAnswer(index));
        contentElements.opcionesContainer.appendChild(opcionElement);
    });

    // Resetear botones y feedback
    contentElements.feedbackContainer.className = 'feedback hidden';
    contentElements.feedbackContainer.innerHTML = '';
    contentElements.revealAnswerBtn.classList.remove('hidden');
    contentElements.nextQuestionBtn.classList.add('hidden');

    updateProgressBar(); // <-- Añade esto aquí
}
// Función para seleccionar respuesta
function selectAnswer(selectedIndex) {
    const preguntaIndex = shuffledQuestionIndices[currentQuestionIndex];
    const pregunta = currentTopic.lecciones[preguntaIndex];
    const opciones = document.querySelectorAll('.opcion');

    // Marcar opción seleccionada
    opciones.forEach(opcion => opcion.classList.remove('selected'));
    opciones[selectedIndex].classList.add('selected');

    // Guardar respuesta del usuario
    userAnswers[currentQuestionIndex] = selectedIndex;

    // Mostrar botón para validar
    contentElements.revealAnswerBtn.classList.remove('hidden');
}

// Función para revelar respuesta
function revealAnswer() {
    const preguntaIndex = shuffledQuestionIndices[currentQuestionIndex];
    const pregunta = currentTopic.lecciones[preguntaIndex];
    const selectedIndex = userAnswers[currentQuestionIndex];
    const opciones = document.querySelectorAll('.opcion');

    // Marcar respuestas correctas e incorrectas
    opciones.forEach((opcion, index) => {
        if (index === pregunta.respuestaMezclada) {
            opcion.classList.add('correct');
        } else if (index === selectedIndex && selectedIndex !== pregunta.respuestaMezclada) {
            opcion.classList.add('incorrect');
        }
    });

    // Mostrar feedback
    contentElements.feedbackContainer.className = selectedIndex === pregunta.respuestaMezclada ? 'feedback correct' : 'feedback incorrect';

    if (selectedIndex === pregunta.respuestaMezclada) {
        contentElements.feedbackContainer.innerHTML = `
            <p><strong>¡Correcto!</strong></p>
            <p>${pregunta.explicacion}</p>
        `;
        correctAnswers++;
    } else {
        contentElements.feedbackContainer.innerHTML = `
            <p><strong>Respuesta incorrecta.</strong></p>
            <p>${pregunta.explicacion}</p>
        `;
    }

    // Mostrar botón siguiente
    contentElements.revealAnswerBtn.classList.add('hidden');
    contentElements.nextQuestionBtn.classList.remove('hidden');
}

// Función para pasar a la siguiente pregunta
function nextQuestion() {
    currentQuestionIndex++;
    
    if (currentQuestionIndex < currentTopic.lecciones.length) {
        loadQuestion();
    } else {
        showResults();
    }
}

// Función para mostrar resultados
function showResults() {
    const totalQuestions = currentTopic.lecciones.length;
    const percentage = Math.round((correctAnswers / totalQuestions) * 100);
    
    contentElements.resultsContainer.innerHTML = `
        <h3>Resultados de la lección</h3>
        <p>Has completado ${totalQuestions} preguntas.</p>
        <p>Respuestas correctas: ${correctAnswers} de ${totalQuestions}</p>
        <p>Porcentaje de aciertos: ${percentage}%</p>
    `;
    
    updateProgressBar(); // <-- Añade esto aquí para mostrar 100%
    showSection('resultados');
}

// Función para reiniciar lección
function restartLeccion() {
    startLeccion();
}

// Función para mostrar una sección específica
function showSection(sectionName) {
    stopAudio(); // <-- Añade esto aquí
    // Ocultar todas las secciones
    Object.values(sections).forEach(section => {
        section.classList.add('hidden');
    });
    // Mostrar la sección solicitada
    sections[sectionName].classList.remove('hidden');

    if (sectionName === 'cursos') {
        globalBackButton.classList.remove('is-active');
    } else {
        globalBackButton.classList.add('is-active');
    }
}

function startLeccion() {
    if (!currentTopic || currentTopic.lecciones.length === 0) {
        alert('No hay lecciones disponibles para este tema.');
        return;
    }

    currentQuestionIndex = 0;
    userAnswers = [];
    correctAnswers = 0;
    // Mezcla los índices de las preguntas
    shuffledQuestionIndices = shuffleArray([...Array(currentTopic.lecciones.length).keys()]);
    contentElements.leccionTitle.textContent = currentTopic.nombre;
    loadQuestion();
    showSection('leccion');
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// para ordenar aleatoriamente las opciones de las preguntas
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Función para actualizar la barra de progreso
function updateProgressBar() {
    const total = currentTopic?.lecciones?.length || 1;
    const current = Math.min(currentQuestionIndex + 1, total);
    const percent = Math.round((current / total) * 100);

    // Actualiza el ancho de la barra
    const progressFill = document.querySelector('.progress-fill');
    if (progressFill) {
        progressFill.style.width = percent + '%';
        // Cambia el color según el porcentaje
        if (percent < 40) {
            progressFill.style.backgroundColor = '#e23c1b'; // rojo
        } else if (percent < 80) {
            progressFill.style.backgroundColor = '#234f9e'; // azul
        } else {
            progressFill.style.backgroundColor = '#4caf50'; // verde
        }
    }

    // Actualiza el texto de progreso
    const progressText = document.querySelector('.progress-text');
    if (progressText) {
        progressText.textContent = `${current}/${total}`;
    }
}

// Event listeners
if (globalBackButton) {
    globalBackButton.addEventListener('click', () => {
        if (!globalBackButton.classList.contains('is-active')) {
            return;
        }

        if (!sections.asignaturas.classList.contains('hidden')) {
            showSection('cursos');
            return;
        }

        if (!sections.temas.classList.contains('hidden')) {
            showAsignaturas(currentCourse);
            return;
        }

        if (!sections.teoria.classList.contains('hidden')) {
            showTemas(currentSubject);
            return;
        }

        if (!sections.leccion.classList.contains('hidden')) {
            showTeoria(currentTopic);
            return;
        }

        if (!sections.resultados.classList.contains('hidden')) {
            showTemas(currentSubject);
        }
    });
}

if (homeButton) {
    homeButton.addEventListener('click', () => {
        showSection('cursos');
    });
}

actionButtons.startLeccion.addEventListener('click', startLeccion);
actionButtons.restartLeccion.addEventListener('click', restartLeccion);
actionButtons.returnToTema.addEventListener('click', () => showTeoria(currentTopic));

contentElements.revealAnswerBtn.addEventListener('click', revealAnswer);
contentElements.nextQuestionBtn.addEventListener('click', nextQuestion);



// Añadir funcionalidad de audio
function stopAudio() {
    window.speechSynthesis.cancel();
    teoriaUtterance = null;
    resetAudioButtons();
}

// AUDIO: reproducir teoría
if (audioBtn) {
    audioBtn.addEventListener('click', () => {
        const teoriaText = document.getElementById('teoria-content').innerText;
        if ('speechSynthesis' in window && teoriaText.trim() !== '') {
            stopAudio();
            teoriaUtterance = new SpeechSynthesisUtterance(teoriaText);
            teoriaUtterance.lang = 'es-ES';
            teoriaUtterance.onend = stopAudio;
            window.speechSynthesis.speak(teoriaUtterance);
            showPauseRestart();
        }
    });
}

if (audioPauseBtn) {
    audioPauseBtn.addEventListener('click', () => {
        if ('speechSynthesis' in window && window.speechSynthesis.speaking) {
            window.speechSynthesis.pause();
            showResume();
        }
    });
}

if (audioResumeBtn) {
    audioResumeBtn.addEventListener('click', () => {
        if ('speechSynthesis' in window && window.speechSynthesis.paused) {
            window.speechSynthesis.resume();
            showPause();
        }
    });
}

if (audioRestartBtn) {
    audioRestartBtn.addEventListener('click', () => {
        stopAudio();
        if (audioBtn) audioBtn.click();
    });
}

// Detener audio al cambiar de sección, iniciar lección, volver a inicio, etc.
function stopAudioOnSectionChange() {
    stopAudio();
}

// Llama a stopAudioOnSectionChange() en cada cambio de sección relevante
window.addEventListener('beforeunload', stopAudioOnSectionChange);

// Ejemplo: llama a stopAudioOnSectionChange() en tus funciones de navegación
// function showSection(sectionName) {
//     stopAudioOnSectionChange();
//     // ...tu lógica de mostrar sección...

