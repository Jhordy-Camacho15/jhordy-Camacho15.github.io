const descuentos = Array.from({ length: 16 }, (_, i) => `#${i + 1}`);
const colores = [
    '#120e16', '#d4c75f', '#c12a49', '#c09732',
    '#120e16', '#dcae25', '#adbbd8', '#9b7934',
    '#120e16', '#d4c75f', '#c12a49', '#c09732',
    '#120e16', '#dcae25', '#adbbd8', '#9b7934'
];
const ruleta = document.getElementById('ruleta');
const ctx = ruleta.getContext('2d');
const partes = descuentos.length;
let anguloActual = 0;
let girando = false;

function dibujarRuleta() {
    const radio = 200;
    const centroX = 200;
    const centroY = 200;
    ctx.clearRect(0, 0, 400, 400);
    for (let i = 0; i < partes; i++) {
        const angInicio = anguloActual + i * 2 * Math.PI / partes;
        const angFin = anguloActual + (i + 1) * 2 * Math.PI / partes;
        ctx.beginPath();
        ctx.moveTo(centroX, centroY);
        ctx.arc(centroX, centroY, radio, angInicio, angFin);
        ctx.closePath();
        ctx.fillStyle = colores[i % colores.length];
        ctx.fill();
        // Fondo blanco para el texto
        ctx.save();
        ctx.translate(centroX, centroY);
        ctx.rotate(angInicio + (angFin - angInicio) / 2);
        ctx.beginPath();
        ctx.arc(radio - 50, 0, 32, 0, 2 * Math.PI);
        ctx.fillStyle = '#fff';
        ctx.fill();
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = '#280e00';
        ctx.font = "bold 22px Segoe UI";
        ctx.fillText(descuentos[i], radio - 50, 0);
        ctx.restore();
    }
}

dibujarRuleta();

document.getElementById('girarBtn').addEventListener('click', function () {
    if (girando) return;
    girando = true;
    let tiempoGiro = Math.random() * 3 + 3; // 3 a 6 segundos
    let inicio = null;
    let velocidad = Math.random() * 0.15 + 0.25; // velocidad inicial
    let desaceleracion = velocidad / (tiempoGiro * 60); // frames

    function animarRuleta(timestamp) {
        if (!inicio) inicio = timestamp;
        if (velocidad > 0.01) {
            anguloActual += velocidad;
            velocidad -= desaceleracion;
            dibujarRuleta();
            requestAnimationFrame(animarRuleta);
        } else {
            girando = false;
            anguloActual = anguloActual % (2 * Math.PI);
            dibujarRuleta();
            mostrarPremio();
        }
    }
    requestAnimationFrame(animarRuleta);
});

function mostrarPremio() {
    // La flecha apunta hacia arriba (0 radianes)
    let anguloFlecha = (3 * Math.PI / 2 - anguloActual + 2 * Math.PI) % (2 * Math.PI);
    let indice = Math.floor(anguloFlecha / (2 * Math.PI / partes));
    let premio = descuentos[indice];
    document.getElementById('premioTexto').textContent = premio;
    document.getElementById('modal').style.display = 'flex';
}

function cerrarModal() {
    document.getElementById('modal').style.display = 'none';
}
window.cerrarModal = cerrarModal;