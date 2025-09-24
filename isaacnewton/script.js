// === Referencias DOM ===
const paresContainer = document.getElementById('pares-container');
const iniciarParesBtn = document.getElementById('iniciar-pares');
const reiniciarParesBtn = document.getElementById('reiniciar-pares');
const tiempoSpan = document.getElementById('tiempo');
const intentosSpan = document.getElementById('intentos');
const paresSpan = document.getElementById('pares');

// === Estado del juego ===
let cartas = [];
let abiertos = []; // índices de cartas actualmente abiertas
let paresEncontrados = 0;
let intentos = 0;
let puedeInteractuar = false; // bloquea clics durante animaciones
let tiempo = 60; // segundos por partida
let timer = null;

// Modal resultado
const modalPares = document.getElementById('modal-pares');
const resultadoPares = document.getElementById('resultado-pares');
const cerrarModalPares = document.getElementById('cerrar-modal-pares');

// === Utilidades ===
function mezclar(array) {
    return array.sort(() => Math.random() - 0.5);
}

// === Crear cartas ===
function crearCartas() {
    const imgs = [];
    for (let i = 1; i <= 8; i++) imgs.push(`anim${i}.png`);
    const pares = mezclar([...imgs, ...imgs]);
    // 'volteada: true' means the card is face-down (hidden). We'll flip to false to reveal.
    cartas = pares.map((img, idx) => ({ img, pareja: false, volteada: true, id: idx }));
}

// === Renderizar cartas ===
function renderCartas() {
    // Reuse existing DOM nodes when possible to preserve CSS transitions
    const visibles = cartas.filter(c => !c.pareja).length;
    if (paresContainer.children.length !== visibles) {
        paresContainer.innerHTML = '';
        cartas.forEach((carta, idx) => {
            // don't create DOM nodes for cards already matched
            if (carta.pareja) return;
            const el = document.createElement('div');
            el.className = 'carta' + (carta.volteada ? ' volteada' : '');
            el.dataset.idx = idx;
            el.innerHTML = `
                <div class="carta-inner">
                    <div class="carta-front"><img src="${carta.img}" alt="carta"></div>
                    <div class="carta-back"></div>
                </div>`;
            paresContainer.appendChild(el);
        });
    } else {
        cartas.forEach((carta, idx) => {
            const el = paresContainer.querySelector(`.carta[data-idx="${idx}"]`);
            // if the card was matched but element exists, remove it
            if (carta.pareja) {
                if (el) el.remove();
                return;
            }
            if (!el) {
                // element missing for a non-paired card — create it
                const newEl = document.createElement('div');
                newEl.className = 'carta' + (carta.volteada ? ' volteada' : '');
                newEl.dataset.idx = idx;
                newEl.innerHTML = `
                    <div class="carta-inner">
                        <div class="carta-front"><img src="${carta.img}" alt="carta"></div>
                        <div class="carta-back"></div>
                    </div>`;
                paresContainer.appendChild(newEl);
                return;
            }
            // update classes
            if (carta.volteada) el.classList.add('volteada'); else el.classList.remove('volteada');
            // update image if changed
            const img = el.querySelector('.carta-front img');
            if (img && !img.src.endsWith(carta.img)) img.src = carta.img;
        });
    }
    // actualizar contadores
    paresSpan.textContent = paresEncontrados;
    intentosSpan.textContent = intentos;
}

// === Mostrar preview al iniciar: cartas volteadas 1.5s y luego ocultas ===
function mostrarPreview() {
    // Voltear todas
    // Reveal images briefly (set volteada=false to show front), then hide again
    cartas.forEach(c => c.volteada = false);
    renderCartas();
    puedeInteractuar = false;
    setTimeout(() => {
        cartas.forEach(c => c.volteada = true);
        renderCartas();
        // allow user interaction after preview
        puedeInteractuar = true;
        // start timer
        startTimer();
    }, 1500);
}

// === Manejo de clics: abrir carta, controlar máximo 2 abiertas ===
paresContainer.addEventListener('click', (e) => {
    if (!puedeInteractuar) return;
    const cartaEl = e.target.closest('.carta');
    if (!cartaEl) return;
    const idx = Number(cartaEl.dataset.idx);
    const carta = cartas[idx];
    if (!carta || carta.pareja) return;
    // Only allow clicking a face-down card
    if (!carta.volteada) return; // already revealed
    // If already two open, ignore
    if (abiertos.length === 2) return;
    // Reveal (set volteada = false)
    carta.volteada = false;
    abiertos.push(idx);
    renderCartas();

    if (abiertos.length === 2) {
        puedeInteractuar = false; // block while comparing
        intentos++;
        intentosSpan.textContent = intentos;
        const [a, b] = abiertos;
        if (cartas[a].img === cartas[b].img) {
            setTimeout(() => {
                cartas[a].pareja = true;
                cartas[b].pareja = true;
                // remove DOM elements for these indices immediately to guarantee disappearance
                const elA = paresContainer.querySelector(`.carta[data-idx="${a}"]`);
                const elB = paresContainer.querySelector(`.carta[data-idx="${b}"]`);
                if (elA) elA.remove();
                if (elB) elB.remove();
                abiertos = [];
                paresEncontrados++;
                console.log('Pareja encontrada. Total pares:', paresEncontrados);
                // refresh counts and any remaining nodes
                renderCartas();
                puedeInteractuar = true;
                if (paresEncontrados === 8) {
                    puedeInteractuar = false;
                    stopTimer();
                    console.log('Todos pares encontrados. Mostrando resultado.');
                    mostrarResultado(true);
                }
            }, 500);
        } else {
            // hide again after a short delay
            setTimeout(() => {
                cartas[a].volteada = true;
                cartas[b].volteada = true;
                abiertos = [];
                renderCartas();
                puedeInteractuar = true;
            }, 900);
        }
    }
});

// === Timer functions ===
function startTimer() {
    if (timer) clearInterval(timer);
    tiempo = 60;
    tiempoSpan.textContent = tiempo;
    timer = setInterval(() => {
        tiempo--;
        tiempoSpan.textContent = tiempo;
        if (tiempo <= 0) {
            stopTimer();
            puedeInteractuar = false;
            mostrarResultado(false);
        }
    }, 1000);
    console.log('Timer iniciado');
}

function stopTimer() {
    if (timer) {
        clearInterval(timer);
        timer = null;
    }
    console.log('Timer detenido');
}

// === Mostrar modal de resultado ===
function mostrarResultado(ganaste) {
    if (ganaste) {
        resultadoPares.textContent = `¡Felicidades! Completaste el juego en ${60 - tiempo}s con ${intentos} intentos y ${paresEncontrados} pares.`;
    } else {
        resultadoPares.textContent = `¡Tiempo agotado! Lograste ${paresEncontrados} pares en ${intentos} intentos.`;
    }
    console.log('Mostrar resultado, ganaste=', ganaste);
    modalPares.classList.remove('hidden');
}

cerrarModalPares.addEventListener('click', () => {
    modalPares.classList.add('hidden');
    stopTimer();
});

// === Botones ===
iniciarParesBtn.addEventListener('click', () => {
    // reiniciar estado y mostrar preview
    paresEncontrados = 0;
    intentos = 0;
    crearCartas();
    renderCartas();
    mostrarPreview();
});

reiniciarParesBtn.addEventListener('click', () => {
    paresEncontrados = 0;
    intentos = 0;
    crearCartas();
    renderCartas();
    puedeInteractuar = false;
});

// === Init ===
crearCartas();
renderCartas();
