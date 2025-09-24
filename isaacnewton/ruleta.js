// Ruleta
const ruletaCanvas = document.getElementById('ruleta');
const ctx = ruletaCanvas.getContext('2d');
const partes = 16;
const angulo = 2 * Math.PI / partes;
const colores = ['#f6ae01', '#fff', '#f6ae01', '#fff'];
let ruletaGirando = false;
let anguloActual = 0;

function dibujarRuleta() {
    ctx.clearRect(0, 0, ruletaCanvas.width, ruletaCanvas.height);
    for (let i = 0; i < partes; i++) {
        ctx.beginPath();
        ctx.moveTo(200, 200);
        ctx.arc(200, 200, 190, angulo * i + anguloActual, angulo * (i + 1) + anguloActual);
        ctx.closePath();
        ctx.fillStyle = colores[i % colores.length];
        ctx.fill();
        // Número
        ctx.save();
        ctx.translate(200, 200);
        ctx.rotate(angulo * (i + 0.5) + anguloActual);
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.font = 'bold 22px Segoe UI';
        ctx.fillStyle = '#280e00';
        ctx.fillText(`#${i + 1}`, 120, 0);
        ctx.restore();
    }
}
dibujarRuleta();

const girarBtn = document.getElementById('girar-btn');
const modalRuleta = document.getElementById('modal-ruleta');
const resultadoRuleta = document.getElementById('resultado-ruleta');
const cerrarModalRuleta = document.getElementById('cerrar-modal-ruleta');

girarBtn.addEventListener('click', () => {
    if (ruletaGirando) return;
    ruletaGirando = true;
    let vueltas = Math.floor(Math.random() * 3) + 5;
    let destino = Math.floor(Math.random() * partes);
    let anguloFinal = 2 * Math.PI * vueltas + (2 * Math.PI * destino / partes) + (angulo / 2) - Math.PI / 2;
    let inicio = anguloActual;
    let duracion = 3000;
    let start = null;
    function animarRuleta(ts) {
        if (!start) start = ts;
        let progreso = (ts - start) / duracion;
        if (progreso > 1) progreso = 1;
        anguloActual = inicio + (anguloFinal - inicio) * easeOutCubic(progreso);
        dibujarRuleta();
        if (progreso < 1) {
            requestAnimationFrame(animarRuleta);
        } else {
            ruletaGirando = false;
            let anguloAjustado = (anguloActual + Math.PI / 2 - (angulo / 2)) % (2 * Math.PI);
            if (anguloAjustado < 0) anguloAjustado += 2 * Math.PI;
            let idx = Math.round(partes - (anguloAjustado / angulo)) % partes;
            if (idx === 0) idx = partes;
            resultadoRuleta.textContent = `¡Te tocó el número #${idx}!`;
            modalRuleta.classList.remove('hidden');
        }
    }
    requestAnimationFrame(animarRuleta);
});

cerrarModalRuleta.addEventListener('click', () => {
    modalRuleta.classList.add('hidden');
});

function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
}
