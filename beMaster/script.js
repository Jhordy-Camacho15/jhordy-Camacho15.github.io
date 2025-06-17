// Variables globales
let appData = {};
let currentCourse = null;
let currentSubject = null;
let currentTopic = null;
let currentQuestionIndex = 0;
let userAnswers = [];
let correctAnswers = 0;

// Elementos del DOM
const sections = {
    cursos: document.getElementById('cursos-section'),
    asignaturas: document.getElementById('asignaturas-section'),
    temas: document.getElementById('temas-section'),
    teoria: document.getElementById('teoria-section'),
    leccion: document.getElementById('leccion-section'),
    resultados: document.getElementById('results-section')
};

// Botones de navegación
const backButtons = {
    cursos: document.getElementById('back-to-cursos'),
    asignaturas: document.getElementById('back-to-asignaturas'),
    temas: document.getElementById('back-to-temas'),
    teoria: document.getElementById('back-to-teoria')
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

// Cargar datos JSON
fetch('data.json')
    .then(response => response.json())
    .then(data => {
        appData = data;
        loadCursos();
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
    contentElements.leccionTitle.textContent = currentTopic.nombre;
    loadQuestion();
    showSection('leccion');
}

// Función para cargar pregunta
function loadQuestion() {
    const pregunta = currentTopic.lecciones[currentQuestionIndex];
    const totalQuestions = currentTopic.lecciones.length;
    
    // Actualizar barra de progreso
    const progressPercentage = (currentQuestionIndex / totalQuestions) * 100;
    document.querySelector('.progress-fill').style.width = `${progressPercentage}%`;
    document.querySelector('.progress-text').textContent = `${currentQuestionIndex + 1}/${totalQuestions}`;
    
    // Mostrar pregunta
    contentElements.preguntaText.textContent = pregunta.pregunta;
    contentElements.opcionesContainer.innerHTML = '';
    
    // Mostrar opciones
    pregunta.opciones.forEach((opcion, index) => {
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
}

// Función para seleccionar respuesta
function selectAnswer(selectedIndex) {
    const pregunta = currentTopic.lecciones[currentQuestionIndex];
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
    const pregunta = currentTopic.lecciones[currentQuestionIndex];
    const selectedIndex = userAnswers[currentQuestionIndex];
    const opciones = document.querySelectorAll('.opcion');
    
    // Marcar respuestas correctas e incorrectas
    opciones.forEach((opcion, index) => {
        if (index === pregunta.respuesta) {
            opcion.classList.add('correct');
        } else if (index === selectedIndex && selectedIndex !== pregunta.respuesta) {
            opcion.classList.add('incorrect');
        }
    });
    
    // Mostrar feedback
    contentElements.feedbackContainer.className = selectedIndex === pregunta.respuesta ? 'feedback correct' : 'feedback incorrect';
    
    if (selectedIndex === pregunta.respuesta) {
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
    
    showSection('resultados');
}

// Función para reiniciar lección
function restartLeccion() {
    startLeccion();
}

// Función para mostrar una sección específica
function showSection(sectionName) {
    // Ocultar todas las secciones
    Object.values(sections).forEach(section => {
        section.classList.add('hidden');
    });
    
    // Mostrar la sección solicitada
    sections[sectionName].classList.remove('hidden');
}

// Event listeners
backButtons.cursos.addEventListener('click', () => showSection('cursos'));
backButtons.asignaturas.addEventListener('click', () => showAsignaturas(currentCourse));
backButtons.temas.addEventListener('click', () => showTemas(currentSubject));
backButtons.teoria.addEventListener('click', () => showTeoria(currentTopic));

actionButtons.startLeccion.addEventListener('click', startLeccion);
actionButtons.restartLeccion.addEventListener('click', restartLeccion);
actionButtons.returnToTema.addEventListener('click', () => showTeoria(currentTopic));

contentElements.revealAnswerBtn.addEventListener('click', revealAnswer);
contentElements.nextQuestionBtn.addEventListener('click', nextQuestion);

// Inicializar aplicación
showSection('cursos');