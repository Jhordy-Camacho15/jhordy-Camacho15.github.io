// Variables globales
const DATA_FILES = {
    test: 'test.json',
    infografia: 'infografia.json',
    resumen: 'resumen.json',
    flashcard: 'flashcard.json',
    podcast: 'podcast.json',
    video: 'video.json'
};

const RESOURCE_BASE_PATH = 'recursos/6_apps/';

const OPTION_CONFIG = {
    test: {
        id: 'test',
        label: 'Test',
        fileName: 'test.json',
        itemsKey: 'lecciones',
        pluralLabel: 'tests',
        resourceBasePath: ''
    },
    infografia: {
        id: 'infografia',
        label: 'Infografía',
        fileName: 'infografia.json',
        itemsKey: 'infografias',
        pluralLabel: 'infografías',
        resourceBasePath: RESOURCE_BASE_PATH
    },
    resumen: {
        id: 'resumen',
        label: 'Resumen',
        fileName: 'resumen.json',
        itemsKey: 'resumenes',
        pluralLabel: 'resúmenes',
        resourceBasePath: RESOURCE_BASE_PATH
    },
    flashcard: {
        id: 'flashcard',
        label: 'FlashCard',
        fileName: 'flashcard.json',
        itemsKey: 'flashcards',
        pluralLabel: 'flashcards',
        resourceBasePath: RESOURCE_BASE_PATH
    },
    podcast: {
        id: 'podcast',
        label: 'Podcast',
        fileName: 'podcast.json',
        itemsKey: 'podcasts',
        pluralLabel: 'podcasts',
        resourceBasePath: RESOURCE_BASE_PATH
    },
    video: {
        id: 'video',
        label: 'Video',
        fileName: 'video.json',
        itemsKey: 'videos',
        pluralLabel: 'videos',
        resourceBasePath: RESOURCE_BASE_PATH
    }
};

const TOPIC_OPTION_IDS = ['test', 'infografia', 'resumen', 'flashcard', 'podcast', 'video'];
const TEMA_OPTIONS_SUBTITLE = 'Selecciona qué deseas hacer dentro del tema.';

let appData = null;
const contentStore = {};
let currentCourse = null;
let currentSubject = null;
let currentTopic = null;
let currentQuestionIndex = 0;
let userAnswers = [];
let correctAnswers = 0;
let shuffledQuestionIndices = [];
let teoriaUtterance = null;
let currentPodcastAudio = null;
let currentPodcastCard = null;
let podcastReturnSection = null;

// Elementos del DOM
const sections = {
    cursos: document.getElementById('cursos-section'),
    asignaturas: document.getElementById('asignaturas-section'),
    temas: document.getElementById('temas-section'),
    temaOpciones: document.getElementById('tema-options-section'),
    contenido: document.getElementById('contenido-section'),
    podcastGlobal: document.getElementById('podcast-section'),
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
    temaShortcutsPanel: document.getElementById('tema-shortcuts-panel'),
    temaShortcutsList: document.getElementById('tema-shortcuts-list'),
    temaOptionsTitle: document.getElementById('tema-options-title'),
    temaOptionsSubtitle: document.getElementById('tema-options-subtitle'),
    temaOptionsList: document.getElementById('tema-options-list'),
    contenidoTitle: document.getElementById('contenido-title'),
    contenidoSubtitle: document.getElementById('contenido-subtitle'),
    contenidoBody: document.getElementById('contenido-body'),
    podcastSubtitle: document.getElementById('podcast-subtitle'),
    podcastList: document.getElementById('podcast-list'),
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
const teoriaPlayer = document.getElementById('teoria-player');
const teoriaProgressFill = document.getElementById('teoria-progress-fill');
const globalAudioPlayer = document.getElementById('global-audio-player');
const globalAudioCloseBtn = document.getElementById('global-audio-close');
const globalAudioToggleBtn = document.getElementById('global-audio-toggle');
const globalAudioRestartBtn = document.getElementById('global-audio-restart');
const globalAudioSeek = document.getElementById('global-audio-seek');
const globalAudioCurrent = document.getElementById('global-audio-current');
const globalAudioDuration = document.getElementById('global-audio-duration');
const globalAudioTitle = document.getElementById('global-audio-title');
const SPEECH_ESTIMATED_CHARS_PER_SECOND = 15;

const globalPlaybackState = {
    type: null,
    audioElement: null,
    podcastCard: null,
    utterance: null,
    title: '',
    subject: '',
    allowSeeking: false,
    isPaused: true,
    totalChars: 0,
    estimatedDuration: 0,
    elapsedBeforePause: 0,
    startTimestamp: null,
    progressTimer: null
};

let speechProgressMeta = null;

// Estado inicial: solo audio-btn visible
function resetAudioButtons() {
    audioBtn.classList.add('audio-visible');
    audioPauseBtn.classList.remove('audio-visible');
    audioResumeBtn.classList.remove('audio-visible');
    audioRestartBtn.classList.remove('audio-visible');
}

// Mostrar pausa y reiniciar, ocultar audio-btn
function showPauseRestart() {
    audioBtn.classList.remove('audio-visible');
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

function updateTeoriaProgress(ratio) {
    if (!teoriaProgressFill) {
        return;
    }

    const bounded = Math.max(0, Math.min(1, Number.isFinite(ratio) ? ratio : 0));
    teoriaProgressFill.style.width = `${bounded * 100}%`;
}

function resetTeoriaProgress() {
    updateTeoriaProgress(0);
}

function setGlobalAudioTitle(title, subject) {
    if (!globalAudioTitle) {
        return;
    }

    const base = [title, subject].filter(Boolean).join(' · ');

    if (!base) {
        globalAudioTitle.textContent = '';
        return;
    }

    globalAudioTitle.innerHTML = `
        <span>${base}</span>
        <span aria-hidden="true">${base}</span>
    `;
}

function showGlobalAudioPlayer() {
    if (globalAudioPlayer) {
        globalAudioPlayer.classList.remove('hidden');
    }
}

function hideGlobalAudioPlayer() {
    if (globalAudioPlayer) {
        globalAudioPlayer.classList.add('hidden');
    }
}

function updateGlobalAudioToggleIcon() {
    if (!globalAudioToggleBtn) {
        return;
    }

    const isPaused = Boolean(globalPlaybackState.isPaused);
    globalAudioToggleBtn.innerHTML = isPaused ? '&#9654;' : '&#10074;&#10074;';
    globalAudioToggleBtn.setAttribute('aria-label', isPaused ? 'Reproducir' : 'Pausar');
}

function updateGlobalAudioUi() {
    if (!globalPlaybackState.type) {
        hideGlobalAudioPlayer();
        return;
    }

    showGlobalAudioPlayer();
    updateGlobalAudioToggleIcon();

    if (globalAudioSeek) {
        if (globalPlaybackState.allowSeeking) {
            globalAudioSeek.removeAttribute('disabled');
        } else {
            globalAudioSeek.setAttribute('disabled', 'disabled');
            globalAudioSeek.value = ((speechProgressMeta?.lastRatio || 0) * 100).toFixed(2);
        }
    }

    if (globalAudioCurrent && globalPlaybackState.type !== 'podcast') {
        const elapsedSeconds = (speechProgressMeta?.lastRatio || 0) * (globalPlaybackState.estimatedDuration || 0);
        globalAudioCurrent.textContent = formatTime(elapsedSeconds);
    }

    if (globalAudioDuration) {
        if (globalPlaybackState.type === 'podcast') {
            globalAudioDuration.textContent = Number.isFinite(globalPlaybackState.estimatedDuration)
                ? formatTime(globalPlaybackState.estimatedDuration)
                : '0:00';
        } else {
            globalAudioDuration.textContent = formatTime(globalPlaybackState.estimatedDuration || 0);
        }
    }
}

function clearGlobalPlaybackState() {
    if (globalPlaybackState.progressTimer) {
        clearInterval(globalPlaybackState.progressTimer);
    }

    globalPlaybackState.type = null;
    globalPlaybackState.audioElement = null;
    globalPlaybackState.podcastCard = null;
    globalPlaybackState.utterance = null;
    globalPlaybackState.title = '';
    globalPlaybackState.subject = '';
    globalPlaybackState.allowSeeking = false;
    globalPlaybackState.isPaused = true;
    globalPlaybackState.totalChars = 0;
    globalPlaybackState.estimatedDuration = 0;
    globalPlaybackState.elapsedBeforePause = 0;
    globalPlaybackState.startTimestamp = null;
    globalPlaybackState.progressTimer = null;
    speechProgressMeta = null;

    if (globalAudioSeek) {
        globalAudioSeek.value = 0;
        globalAudioSeek.max = 100;
        globalAudioSeek.setAttribute('disabled', 'disabled');
    }

    if (globalAudioCurrent) {
        globalAudioCurrent.textContent = '0:00';
    }

    if (globalAudioDuration) {
        globalAudioDuration.textContent = '0:00';
    }

    if (globalAudioTitle) {
        globalAudioTitle.textContent = '';
    }

    resetTeoriaProgress();
    hideGlobalAudioPlayer();
}

function activateGlobalPodcastPlayback(entry, audioElement, card) {
    if (!audioElement || !entry) {
        return;
    }

    globalPlaybackState.type = 'podcast';
    globalPlaybackState.audioElement = audioElement;
    globalPlaybackState.podcastCard = card || null;
    globalPlaybackState.utterance = null;
    globalPlaybackState.allowSeeking = true;
    globalPlaybackState.isPaused = audioElement.paused;
    globalPlaybackState.estimatedDuration = Number.isFinite(audioElement.duration) ? audioElement.duration : 0;
    globalPlaybackState.elapsedBeforePause = 0;
    globalPlaybackState.startTimestamp = null;
    setGlobalAudioTitle(entry.title || 'Podcast', entry.subjectName || entry.courseName || '');
    updateGlobalAudioUi();
    syncGlobalPodcastProgress(audioElement);
}

function syncGlobalPodcastProgress(audioElement) {
    if (!globalPlaybackState.audioElement || globalPlaybackState.audioElement !== audioElement) {
        return;
    }

    if (!globalAudioSeek || !globalAudioCurrent || !globalAudioDuration) {
        return;
    }

    if (Number.isFinite(audioElement.duration) && audioElement.duration > 0) {
        globalPlaybackState.estimatedDuration = audioElement.duration;
        globalAudioDuration.textContent = formatTime(audioElement.duration);
        globalAudioSeek.max = audioElement.duration;
        globalAudioSeek.value = audioElement.currentTime;
        globalAudioSeek.removeAttribute('disabled');
    } else {
        globalAudioDuration.textContent = '0:00';
        globalAudioSeek.value = 0;
        globalAudioSeek.setAttribute('disabled', 'disabled');
    }

    globalAudioCurrent.textContent = formatTime(audioElement.currentTime);
    updateGlobalAudioToggleIcon();
}

function activateGlobalSpeechPlayback(title, subject, totalChars) {
    globalPlaybackState.type = 'teoria';
    globalPlaybackState.audioElement = null;
    globalPlaybackState.podcastCard = null;
    globalPlaybackState.utterance = teoriaUtterance;
    globalPlaybackState.title = title || 'Contenido del tema';
    globalPlaybackState.subject = subject || '';
    globalPlaybackState.allowSeeking = false;
    globalPlaybackState.isPaused = false;
    globalPlaybackState.totalChars = totalChars;
    globalPlaybackState.estimatedDuration = totalChars > 0
        ? Math.max(totalChars / SPEECH_ESTIMATED_CHARS_PER_SECOND, 4)
        : 0;
    globalPlaybackState.elapsedBeforePause = 0;
    globalPlaybackState.startTimestamp = performance.now();
    setGlobalAudioTitle(globalPlaybackState.title, globalPlaybackState.subject);
    startSpeechProgress(totalChars);
    updateGlobalAudioUi();
}

function syncGlobalSpeechProgress(ratio) {
    if (globalPlaybackState.type !== 'teoria') {
        return;
    }

    updateTeoriaProgress(ratio);

    if (!globalAudioSeek || !globalAudioCurrent || !globalAudioDuration) {
        return;
    }

    const bounded = Math.max(0, Math.min(1, Number.isFinite(ratio) ? ratio : 0));
    const estimatedDuration = globalPlaybackState.estimatedDuration || 0;
    const currentSeconds = bounded * estimatedDuration;

    globalAudioSeek.value = (bounded * 100).toFixed(2);
    globalAudioCurrent.textContent = formatTime(currentSeconds);
    globalAudioDuration.textContent = formatTime(estimatedDuration);

    if (speechProgressMeta) {
        speechProgressMeta.lastRatio = bounded;
    }
}

function startSpeechProgress(totalChars) {
    clearSpeechProgressTracking();

    if (!totalChars || totalChars <= 0) {
        syncGlobalSpeechProgress(0);
        return;
    }

    const estimatedDuration = Math.max(totalChars / SPEECH_ESTIMATED_CHARS_PER_SECOND, 4);

    speechProgressMeta = {
        totalChars,
        estimatedDuration,
        lastRatio: 0
    };

    globalPlaybackState.estimatedDuration = estimatedDuration;
    globalPlaybackState.startTimestamp = performance.now();

    globalPlaybackState.progressTimer = setInterval(() => {
        if (!speechProgressMeta || globalPlaybackState.type !== 'teoria' || globalPlaybackState.isPaused) {
            return;
        }

        const start = globalPlaybackState.startTimestamp || performance.now();
        const elapsed = (performance.now() - start) / 1000 + (globalPlaybackState.elapsedBeforePause || 0);
        const ratio = Math.min(elapsed / speechProgressMeta.estimatedDuration, 0.99);
        syncGlobalSpeechProgress(ratio);
    }, 250);
}

function pauseSpeechProgressTracking() {
    if (globalPlaybackState.progressTimer) {
        clearInterval(globalPlaybackState.progressTimer);
        globalPlaybackState.progressTimer = null;
    }

    if (globalPlaybackState.type === 'teoria' && globalPlaybackState.startTimestamp) {
        const elapsed = (performance.now() - globalPlaybackState.startTimestamp) / 1000;
        globalPlaybackState.elapsedBeforePause += Math.max(0, elapsed);
    }
}

function resumeSpeechProgressTracking() {
    if (globalPlaybackState.type !== 'teoria') {
        return;
    }

    globalPlaybackState.startTimestamp = performance.now();

    if (!globalPlaybackState.progressTimer) {
        globalPlaybackState.progressTimer = setInterval(() => {
            if (!speechProgressMeta || globalPlaybackState.type !== 'teoria' || globalPlaybackState.isPaused) {
                return;
            }

            const start = globalPlaybackState.startTimestamp || performance.now();
            const elapsed = (performance.now() - start) / 1000 + (globalPlaybackState.elapsedBeforePause || 0);
            const ratio = Math.min(elapsed / speechProgressMeta.estimatedDuration, 0.99);
            syncGlobalSpeechProgress(ratio);
        }, 250);
    }
}

function clearSpeechProgressTracking() {
    if (globalPlaybackState.progressTimer) {
        clearInterval(globalPlaybackState.progressTimer);
        globalPlaybackState.progressTimer = null;
    }

    speechProgressMeta = null;
    globalPlaybackState.elapsedBeforePause = 0;
    globalPlaybackState.startTimestamp = null;
    resetTeoriaProgress();
}

// Cargar datos JSON
const dataFileEntries = Object.entries(DATA_FILES);

Promise.all(
    dataFileEntries.map(([key, filePath]) =>
        fetch(filePath)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`No se pudo cargar ${filePath}`);
                }
                return response.json();
            })
            .then(json => ({ key, json }))
            .catch(error => {
                console.error(`Error al cargar ${filePath}:`, error);
                return { key, json: null };
            })
    )
)
    .then(results => {
        results.forEach(({ key, json }) => {
            contentStore[key] = json;
        });

        appData = contentStore.test;

        if (!appData || !Array.isArray(appData.cursos)) {
            console.error('No se pudo cargar la estructura base de cursos.');
            contentElements.cursosList.innerHTML = '<p>No hay cursos disponibles.</p>';
            return;
        }

        ensureContentStructures();
        loadCursos();
    })
    .catch(error => console.error('Error al inicializar los datos:', error));

function ensureContentStructures() {
    TOPIC_OPTION_IDS.forEach(optionId => {
        if (optionId === 'test') {
            return;
        }

        const option = OPTION_CONFIG[optionId];
        if (!option) {
            return;
        }

        if (!contentStore[optionId] || !Array.isArray(contentStore[optionId]?.cursos)) {
            contentStore[optionId] = buildEmptyStructure(option.itemsKey);
            return;
        }

        alignStructureWithBase(optionId, option.itemsKey);
    });
}

function buildEmptyStructure(itemsKey) {
    if (!appData || !itemsKey) {
        return { cursos: [] };
    }

    return {
        cursos: appData.cursos.map(curso => ({
            id: curso.id,
            nombre: curso.nombre,
            asignaturas: curso.asignaturas.map(asignatura => ({
                id: asignatura.id,
                nombre: asignatura.nombre,
                temas: asignatura.temas.map(tema => ({
                    id: tema.id,
                    nombre: tema.nombre,
                    [itemsKey]: []
                }))
            }))
        }))
    };
}

function alignStructureWithBase(optionId, itemsKey) {
    if (!appData || !itemsKey) {
        return;
    }

    const optionData = contentStore[optionId];
    if (!optionData || !Array.isArray(optionData.cursos)) {
        return;
    }

    appData.cursos.forEach(baseCourse => {
        let course = optionData.cursos.find(curso => curso.id === baseCourse.id);
        if (!course) {
            course = {
                id: baseCourse.id,
                nombre: baseCourse.nombre,
                asignaturas: []
            };
            optionData.cursos.push(course);
        } else {
            course.nombre = baseCourse.nombre;
        }

        course.asignaturas = course.asignaturas || [];

        baseCourse.asignaturas.forEach(baseAsignatura => {
            let asignatura = course.asignaturas.find(item => item.id === baseAsignatura.id);
            if (!asignatura) {
                asignatura = {
                    id: baseAsignatura.id,
                    nombre: baseAsignatura.nombre,
                    temas: []
                };
                course.asignaturas.push(asignatura);
            } else {
                asignatura.nombre = baseAsignatura.nombre;
            }

            asignatura.temas = asignatura.temas || [];

            baseAsignatura.temas.forEach(baseTema => {
                let tema = asignatura.temas.find(item => item.id === baseTema.id);
                if (!tema) {
                    tema = {
                        id: baseTema.id,
                        nombre: baseTema.nombre
                    };
                    asignatura.temas.push(tema);
                } else {
                    tema.nombre = baseTema.nombre;
                }

                if (!Array.isArray(tema[itemsKey])) {
                    tema[itemsKey] = [];
                }
            });
        });
    });
}

// Función para cargar cursos
function loadCursos() {
    if (!appData || !Array.isArray(appData.cursos)) {
        return;
    }

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
            card.addEventListener('click', () => showTemaOptions(tema));
            contentElements.temasList.appendChild(card);
        });
    }

    renderTemaShortcuts();
    showSection('temas');
}

function renderTemaShortcuts() {
    const panel = contentElements.temaShortcutsPanel;
    const list = contentElements.temaShortcutsList;

    if (!panel || !list) {
        return;
    }

    list.innerHTML = '';

    const allPodcasts = collectPodcastEntries();

    if (allPodcasts.length === 0 || !currentCourse || !currentSubject) {
        panel.classList.add('hidden');
        return;
    }

    const hasSubjectEntries = allPodcasts.some(entry => entry.courseId === currentCourse.id && entry.subjectId === currentSubject.id);

    panel.classList.remove('hidden');

    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'shortcut-card';
    button.textContent = 'Podcast';
    button.addEventListener('click', () => {
        showPodcastGlobal({
            courseId: hasSubjectEntries ? currentCourse?.id : undefined,
            subjectId: hasSubjectEntries ? currentSubject?.id : undefined,
            returnTo: 'temas'
        });
    });

    list.appendChild(button);
}

function showTemaOptions(tema = currentTopic) {
    if (!tema) {
        return;
    }

    currentTopic = tema;

    if (contentElements.temaOptionsTitle) {
        contentElements.temaOptionsTitle.textContent = currentTopic.nombre || 'Tema';
    }

    if (contentElements.temaOptionsSubtitle) {
        contentElements.temaOptionsSubtitle.textContent = TEMA_OPTIONS_SUBTITLE;
    }

    if (contentElements.temaOptionsList) {
        contentElements.temaOptionsList.innerHTML = '';

        TOPIC_OPTION_IDS.forEach(optionId => {
            const option = OPTION_CONFIG[optionId];
            if (!option) {
                return;
            }

            const card = document.createElement('div');
            card.className = 'card';
            card.dataset.optionId = optionId;
            card.innerHTML = `<h3>${option.label}</h3>`;
            card.addEventListener('click', () => handleTopicOption(optionId));
            contentElements.temaOptionsList.appendChild(card);
        });
    }

    showSection('temaOpciones');
}

function handleTopicOption(optionId) {
    if (!currentTopic) {
        return;
    }

    if (optionId === 'test') {
        showTeoria(currentTopic);
        return;
    }

    if (optionId === 'podcast') {
        showPodcastGlobal({
            courseId: currentCourse?.id,
            subjectId: currentSubject?.id,
            topicId: currentTopic?.id,
            returnTo: 'temaOpciones'
        });
        return;
    }

    showAdditionalContent(optionId);
}

function showAdditionalContent(optionId) {
    if (optionId === 'podcast') {
        return;
    }

    const option = OPTION_CONFIG[optionId];

    if (!option) {
        return;
    }

    const data = contentStore[optionId];
    const topicData = getTopicDataByIds(data, currentCourse?.id, currentSubject?.id, currentTopic?.id);
    const itemsKey = option.itemsKey;
    const items = topicData && itemsKey ? topicData[itemsKey] : undefined;
    const hasItems = Array.isArray(items) && items.length > 0;

    if (contentElements.contenidoTitle) {
        contentElements.contenidoTitle.textContent = option.label;
    }

    if (contentElements.contenidoSubtitle) {
        contentElements.contenidoSubtitle.textContent = currentTopic ? currentTopic.nombre : '';
    }

    if (!hasItems) {
        const pathHint = option.resourceBasePath ? ` usando nombres relativos a <code>${option.resourceBasePath}</code>` : '';
        contentElements.contenidoBody.innerHTML = `
            <p>No hay ${option.pluralLabel} disponibles para este tema todavía.</p>
            <p>Agrega las entradas en <code>${option.fileName}</code>${pathHint}.</p>
        `;
    } else {
        const list = document.createElement('ul');
        list.className = 'content-list';

        items.forEach(item => {
            list.appendChild(createContentListItem(item, option));
        });

        contentElements.contenidoBody.innerHTML = '';
        contentElements.contenidoBody.appendChild(list);
    }

    showSection('contenido');
}

function getTopicDataByIds(data, courseId, subjectId, topicId) {
    if (!data || !Array.isArray(data.cursos)) {
        return null;
    }

    const course = data.cursos.find(item => item.id === courseId);
    if (!course || !Array.isArray(course.asignaturas)) {
        return null;
    }

    const subject = course.asignaturas.find(item => item.id === subjectId);
    if (!subject || !Array.isArray(subject.temas)) {
        return null;
    }

    return subject.temas.find(item => item.id === topicId) || null;
}
function showPodcastGlobal({ courseId, subjectId, topicId, returnTo } = {}) {
    const entries = collectPodcastEntries();
    podcastReturnSection = returnTo || null;

    if (!contentElements.podcastList) {
        return;
    }

    if (!entries.length) {
        if (contentElements.podcastSubtitle) {
            contentElements.podcastSubtitle.textContent = 'No se encontraron podcasts disponibles.';
        }
        contentElements.podcastList.innerHTML = '<p>No hay podcasts cargados aún. Añade entradas en <code>podcast.json</code>.</p>';
        showSection('podcastGlobal');
        return;
    }

    const prioritizedEntries = entries.map(entry => ({ ...entry, isActive: false }));
    let activeEntry = null;

    if (courseId || subjectId || topicId) {
        const activeIndex = prioritizedEntries.findIndex(entry => {
            if (courseId && entry.courseId !== courseId) return false;
            if (subjectId && entry.subjectId !== subjectId) return false;
            if (topicId && entry.topicId !== topicId) return false;
            return true;
        });

        if (activeIndex >= 0) {
            prioritizedEntries[activeIndex].isActive = true;
            activeEntry = prioritizedEntries[activeIndex];
        }
    }

    const subtitleText = buildPodcastSubtitle({ activeEntry, prioritizedEntries, courseId, subjectId });
    if (contentElements.podcastSubtitle) {
        contentElements.podcastSubtitle.textContent = subtitleText;
    }

    const listContainer = document.createElement('div');
    listContainer.className = 'podcast-list';

    let activeCardElement = null;

    prioritizedEntries.forEach((entry, index) => {
        const card = createPodcastCard(entry, index + 1);
        listContainer.appendChild(card);
        if (entry.isActive && !activeCardElement) {
            activeCardElement = card;
        }
    });

    contentElements.podcastList.innerHTML = '';
    contentElements.podcastList.appendChild(listContainer);

    showSection('podcastGlobal');

    if (activeCardElement) {
        requestAnimationFrame(() => {
            activeCardElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    }
}

function collectPodcastEntries() {
    const results = [];
    const data = contentStore.podcast;
    const option = OPTION_CONFIG.podcast;

    if (!data || !Array.isArray(data.cursos)) {
        return results;
    }

    data.cursos.forEach(curso => {
        if (!curso || !Array.isArray(curso.asignaturas)) {
            return;
        }

        curso.asignaturas.forEach(asignatura => {
            if (!asignatura || !Array.isArray(asignatura.temas)) {
                return;
            }

            asignatura.temas.forEach(tema => {
                if (!tema || !Array.isArray(tema.podcasts) || tema.podcasts.length === 0) {
                    return;
                }

                tema.podcasts.forEach(podcastItem => {
                    const normalized = normalizePodcastItem(podcastItem);
                    if (!normalized.fileName) {
                        return;
                    }

                    results.push({
                        courseId: curso.id,
                        courseName: curso.nombre,
                        subjectId: asignatura.id,
                        subjectName: asignatura.nombre,
                        topicId: tema.id,
                        topicName: tema.nombre,
                        fileName: normalized.fileName,
                        title: normalized.title,
                        description: normalized.description,
                        audioSrc: resolveResourcePath(normalized.fileName, option.resourceBasePath),
                        originalItem: podcastItem
                    });
                });
            });
        });
    });

    return results;
}

function normalizePodcastItem(item) {
    if (typeof item === 'string') {
        const trimmed = item.trim();
        return {
            fileName: trimmed,
            title: prettifyFileName(trimmed),
            description: null
        };
    }

    if (item && typeof item === 'object') {
        const fileName = item.archivo || item.file || item.ruta || item.path || item.enlace || item.url || null;
        const title = item.titulo || item.title || item.nombre || item.name || (fileName ? prettifyFileName(fileName) : '');
        const description = item.descripcion || item.description || item.detalle || item.detail || null;
        return { fileName, title, description };
    }

    return { fileName: null, title: '', description: null };
}

function buildPodcastSubtitle({ activeEntry, prioritizedEntries, courseId, subjectId }) {
    if (activeEntry) {
        return `Tema seleccionado: ${activeEntry.topicName} · ${activeEntry.subjectName}`;
    }

    if (subjectId) {
        const entry = prioritizedEntries.find(item => item.subjectId === subjectId);
        if (entry) {
            return `Asignatura: ${entry.subjectName} · ${entry.courseName}`;
        }
    }

    if (courseId) {
        const entry = prioritizedEntries.find(item => item.courseId === courseId);
        if (entry) {
            return `Curso: ${entry.courseName}`;
        }
    }

    return 'Explora todos los podcasts disponibles.';
}

function createPodcastCard(entry, index) {
    const card = document.createElement('div');
    card.className = 'podcast-card';
    card.dataset.courseId = entry.courseId;
    card.dataset.subjectId = entry.subjectId;
    card.dataset.topicId = entry.topicId;

    if (entry.isActive) {
        card.classList.add('is-active');
    }

    const header = document.createElement('div');
    header.className = 'podcast-header';

    const titleElement = document.createElement('h3');
    titleElement.textContent = entry.title || `Podcast ${index}`;
    header.appendChild(titleElement);

    const metadata = document.createElement('div');
    metadata.className = 'podcast-meta';

    const courseMeta = document.createElement('span');
    courseMeta.className = 'podcast-meta__item';
    courseMeta.textContent = entry.courseName;
    metadata.appendChild(courseMeta);

    const subjectMeta = document.createElement('span');
    subjectMeta.className = 'podcast-meta__item';
    subjectMeta.textContent = entry.subjectName;
    metadata.appendChild(subjectMeta);

    const topicMeta = document.createElement('span');
    topicMeta.className = 'podcast-meta__item';
    topicMeta.textContent = entry.topicName;
    metadata.appendChild(topicMeta);

    header.appendChild(metadata);

    if (entry.description) {
        const descriptionElement = document.createElement('p');
        descriptionElement.className = 'podcast-description';
        descriptionElement.textContent = entry.description;
        header.appendChild(descriptionElement);
    }

    card.appendChild(header);

    if (!entry.audioSrc) {
        const warning = document.createElement('p');
        warning.className = 'podcast-warning';
        warning.textContent = 'No se encontró un archivo de audio válido. Verifica la ruta en el JSON.';
        card.appendChild(warning);
        return card;
    }

    const audioElement = document.createElement('audio');
    audioElement.src = entry.audioSrc;
    audioElement.preload = 'metadata';
    audioElement.className = 'podcast-audio';
    card.appendChild(audioElement);

    const timeline = document.createElement('div');
    timeline.className = 'podcast-timeline';

    const currentTimeLabel = document.createElement('span');
    currentTimeLabel.className = 'podcast-time current';
    currentTimeLabel.textContent = '0:00';

    const durationLabel = document.createElement('span');
    durationLabel.className = 'podcast-time duration';
    durationLabel.textContent = '0:00';

    const slider = document.createElement('input');
    slider.type = 'range';
    slider.min = 0;
    slider.step = 0.1;
    slider.value = 0;
    slider.disabled = true;
    slider.className = 'podcast-slider';

    timeline.appendChild(currentTimeLabel);
    timeline.appendChild(slider);
    timeline.appendChild(durationLabel);
    card.appendChild(timeline);

    const controls = document.createElement('div');
    controls.className = 'podcast-controls';

    const resumeBtn = createPodcastButton('Reproducir', 'resume', '&#9654;');
    const pauseBtn = createPodcastButton('Pausa', 'pause', '&#10074;&#10074;');
    const restartBtn = createPodcastButton('Reiniciar', 'restart', '&#10226;');

    controls.appendChild(resumeBtn);
    controls.appendChild(pauseBtn);
    controls.appendChild(restartBtn);
    card.appendChild(controls);

    let isSeeking = false;

    const updateButtonStates = () => {
        const hasMetadata = Number.isFinite(audioElement.duration) && audioElement.duration > 0;
        slider.disabled = !hasMetadata;
        resumeBtn.disabled = !audioElement.paused && !audioElement.ended;
        pauseBtn.disabled = audioElement.paused;
        restartBtn.disabled = !hasMetadata && audioElement.currentTime === 0;
    };

    audioElement.addEventListener('loadedmetadata', () => {
        if (Number.isFinite(audioElement.duration)) {
            slider.max = audioElement.duration;
            durationLabel.textContent = formatTime(audioElement.duration);
            slider.disabled = false;
        }
        updateButtonStates();
        syncGlobalPodcastProgress(audioElement);
    });

    audioElement.addEventListener('timeupdate', () => {
        if (!isSeeking && !slider.disabled) {
            slider.value = audioElement.currentTime;
        }
        currentTimeLabel.textContent = formatTime(audioElement.currentTime);
        syncGlobalPodcastProgress(audioElement);
    });

    audioElement.addEventListener('play', () => {
        card.classList.add('is-playing');
        updateButtonStates();
        activateGlobalPodcastPlayback(entry, audioElement, card);
        globalPlaybackState.isPaused = false;
        updateGlobalAudioUi();
    });

    audioElement.addEventListener('pause', () => {
        card.classList.remove('is-playing');
        if (currentPodcastAudio === audioElement && audioElement.paused) {
            currentPodcastAudio = null;
            currentPodcastCard = null;
        }
        updateButtonStates();
        if (globalPlaybackState.audioElement === audioElement) {
            globalPlaybackState.isPaused = true;
            updateGlobalAudioUi();
        }
    });

    audioElement.addEventListener('ended', () => {
        slider.value = slider.max || 0;
        currentTimeLabel.textContent = durationLabel.textContent;
        card.classList.remove('is-playing');
        if (currentPodcastAudio === audioElement) {
            currentPodcastAudio = null;
            currentPodcastCard = null;
        }
        updateButtonStates();
        if (globalPlaybackState.audioElement === audioElement) {
            clearGlobalPlaybackState();
        }
    });

    let errorMessageAdded = false;

    audioElement.addEventListener('error', () => {
        card.classList.add('has-error');
        if (!errorMessageAdded) {
            const errorMessage = document.createElement('p');
            errorMessage.className = 'podcast-warning';
            errorMessage.textContent = 'No se pudo cargar el audio. Comprueba que el archivo exista y la ruta sea correcta.';
            card.appendChild(errorMessage);
            errorMessageAdded = true;
        }
        updateButtonStates();
    });

    slider.addEventListener('input', () => {
        if (slider.disabled) {
            return;
        }
        isSeeking = true;
        const newTime = Number(slider.value);
        currentTimeLabel.textContent = formatTime(newTime);
    });

    slider.addEventListener('change', () => {
        if (slider.disabled) {
            return;
        }
        const newTime = Number(slider.value);
        if (Number.isFinite(newTime)) {
            audioElement.currentTime = newTime;
        }
        isSeeking = false;
        syncGlobalPodcastProgress(audioElement);
    });

    resumeBtn.addEventListener('click', () => {
        playPodcast(audioElement, card, entry);
    });

    pauseBtn.addEventListener('click', () => {
        audioElement.pause();
    });

    restartBtn.addEventListener('click', () => {
        audioElement.currentTime = 0;
        playPodcast(audioElement, card, entry);
    });

    updateButtonStates();

    return card;
}

function createPodcastButton(label, action, iconHtml) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `podcast-button podcast-button--${action}`;

    if (iconHtml) {
        button.innerHTML = iconHtml;
        button.setAttribute('aria-label', label);
        button.title = label;
    } else {
        button.textContent = label;
    }

    return button;
}

function playPodcast(audioElement, card, metadata = null) {
    if (!audioElement) {
        return;
    }

    if (currentPodcastAudio && currentPodcastAudio !== audioElement) {
        currentPodcastAudio.pause();
    }

    currentPodcastAudio = audioElement;
    currentPodcastCard = card;

    if (metadata) {
        activateGlobalPodcastPlayback(metadata, audioElement, card);
    }

    audioElement.play().catch(error => {
        console.error('No se pudo reproducir el audio:', error);
    });
}

function resolveResourcePath(fileName, basePath = '') {
    if (!fileName) {
        return null;
    }

    const trimmed = String(fileName).trim();

    if (trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('/')) {
        return trimmed;
    }

    const normalizedBase = basePath || '';

    if (normalizedBase && trimmed.startsWith(normalizedBase)) {
        return trimmed;
    }

    return `${normalizedBase}${trimmed}`;
}

function prettifyFileName(fileName) {
    if (!fileName || typeof fileName !== 'string') {
        return '';
    }

    const nameWithoutExtension = fileName.replace(/\.[^/.]+$/, '');
    return nameWithoutExtension
        .replace(/[\-_]+/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
}

function formatTime(seconds) {
    if (!Number.isFinite(seconds) || seconds < 0) {
        return '0:00';
    }

    const totalSeconds = Math.floor(seconds);
    const minutes = Math.floor(totalSeconds / 60);
    const remainingSeconds = totalSeconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

function createContentListItem(item, option) {
    const listItem = document.createElement('li');
    const appendLink = (displayText, fileName) => {
        const text = displayText || fileName;

        if (!text) {
            listItem.textContent = '';
            return;
        }

        if (fileName) {
            const href = resolveResourcePath(fileName, option.resourceBasePath);
            const link = document.createElement('a');
            link.textContent = text;
            link.href = href;
            link.target = '_blank';
            link.rel = 'noopener noreferrer';
            listItem.appendChild(link);
        } else {
            listItem.textContent = text;
        }
    };

    if (typeof item === 'string') {
        appendLink(item, item);
        return listItem;
    }

    if (item && typeof item === 'object') {
        const title = item.titulo || item.title || item.nombre || item.name || null;
        const description = item.descripcion || item.description || item.detalle || item.detail || null;
        const fileName = item.archivo || item.file || item.ruta || item.path || item.enlace || null;

        if (fileName) {
            appendLink(title || fileName, fileName);
            if (description) {
                listItem.appendChild(document.createTextNode(` - ${description}`));
            }
            return listItem;
        }

        if (title || description) {
            const parts = [title, description].filter(Boolean);
            listItem.textContent = parts.join(' - ');
            return listItem;
        }

        listItem.textContent = JSON.stringify(item);
        return listItem;
    }

    listItem.textContent = String(item);
    return listItem;
}

// Función para mostrar teoría de un tema
function showTeoria(tema = currentTopic) {
    if (!tema) {
        return;
    }

    currentTopic = tema;
    contentElements.teoriaTitle.textContent = tema.nombre;
    contentElements.teoriaContent.innerHTML = '';

    if (!tema.teoria || tema.teoria.length === 0) {
        contentElements.teoriaContent.innerHTML = '<p>No hay contenido teórico disponible para este tema.</p>';
    } else {
        tema.teoria.forEach(parrafo => {
            const p = document.createElement('p');
            p.textContent = parrafo;
            p.style.marginBottom = '15px';
            contentElements.teoriaContent.appendChild(p);
        });
    }

    resetAudioButtons(); // <-- Añade esto
    showSection('teoria');
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

    if (sectionName !== 'podcastGlobal') {
        podcastReturnSection = null;
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

        if (!sections.podcastGlobal.classList.contains('hidden')) {
            const target = podcastReturnSection;
            podcastReturnSection = null;

            if (target === 'temaOpciones') {
                showTemaOptions();
                return;
            }

            if (target === 'temas') {
                showTemas(currentSubject);
                return;
            }

            showTemas(currentSubject);
            return;
        }

        if (!sections.temaOpciones.classList.contains('hidden')) {
            showTemas(currentSubject);
            return;
        }

        if (!sections.teoria.classList.contains('hidden')) {
            showTemaOptions();
            return;
        }

        if (!sections.contenido.classList.contains('hidden')) {
            showTemaOptions();
            return;
        }

        if (!sections.leccion.classList.contains('hidden')) {
            showTeoria(currentTopic);
            return;
        }

        if (!sections.resultados.classList.contains('hidden')) {
            showTemaOptions();
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
actionButtons.returnToTema.addEventListener('click', () => showTemaOptions());

contentElements.revealAnswerBtn.addEventListener('click', revealAnswer);
contentElements.nextQuestionBtn.addEventListener('click', nextQuestion);



// Añadir funcionalidad de audio
function stopPodcastPlayback() {
    if (!currentPodcastAudio) {
        return;
    }

    const audio = currentPodcastAudio;
    audio.pause();
    audio.currentTime = 0;

    if (currentPodcastCard) {
        currentPodcastCard.classList.remove('is-playing');
        const slider = currentPodcastCard.querySelector('.podcast-slider');
        if (slider) {
            slider.value = 0;
        }
        const currentLabel = currentPodcastCard.querySelector('.podcast-time.current');
        if (currentLabel) {
            currentLabel.textContent = '0:00';
        }
    }

    currentPodcastAudio = null;
    currentPodcastCard = null;
}

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
    stopPodcastPlayback();
}

// Llama a stopAudioOnSectionChange() en cada cambio de sección relevante
window.addEventListener('beforeunload', stopAudioOnSectionChange);

// Ejemplo: llama a stopAudioOnSectionChange() en tus funciones de navegación
// function showSection(sectionName) {
//     stopAudioOnSectionChange();
//     // ...tu lógica de mostrar sección...

