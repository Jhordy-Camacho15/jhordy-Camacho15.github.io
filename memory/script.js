document.addEventListener('DOMContentLoaded', () => {
  showHome();
});

function showHome() {
  const app = document.getElementById('app');
  app.innerHTML = `
    <div class="container home-bg">
      <img src="mundo1.png" class="img-over img1" alt="Decoración 1">
      <img src="mundo2.png" class="img-over img2" alt="Decoración 2">
      <img src="mundo3.png" class="img-over img3" alt="Decoración 3">
      <img src="mundo4.png" class="img-over img4" alt="Decoración 4">
      <img src="nave.png" class="img-over img5" alt="Decoración 5">
      <button id="playBtn" class="main-btn">JUGAR AHORA</button>
    </div>
  `;
  document.getElementById('playBtn').onclick = showWorlds;
}

function showWorlds() {
  const app = document.getElementById('app');
  app.innerHTML = `
    <div class="container worlds-bg">
      <div class="worlds-btns">
        <div class="world-btn-group" onclick="showLevels('azul')">
          <img src="mundo1.png" alt="Mundo Azul" class="world-img" />
          <button class="mundo-btn azul">Mundo 1</button>
        </div>
        <div class="world-btn-group" onclick="showLevels('amarillo')">
          <img src="mundo2.png" alt="Mundo Amarillo" class="world-img" />
          <button class="mundo-btn amarillo">Mundo 2</button>
        </div>
        <div class="world-btn-group" onclick="showLevels('rojo')">
          <img src="mundo3.png" alt="Mundo Rojo" class="world-img" />
          <button class="mundo-btn rojo">Mundo 3</button>
        </div>
        <div class="world-btn-group" onclick="showLevels('extra')">
          <img src="mundo4.png" alt="Mundo Extra" class="world-img" />
          <button class="mundo-btn extra">Mundo 4</button>
        </div>
      </div>
      <button onclick="showHome()" class="main-btn volver-btn">Volver</button>
    </div>
  `;
}

window.showLevels = function(world) {
  const app = document.getElementById('app');
  app.innerHTML = `
    <div class="container levels-bg levels-bg-${world}">
      <div class="levels-btns">
        <div class="level-btn-group" onclick="showLevel1('${world}')">
          <img src="nivel1.png" alt="Nivel 1" class="level-img" />
          <button class="nivel-btn">Nivel 1</button>
        </div>
        <div class="level-btn-group" onclick="alert('Nivel 2');">
          <img src="nivel2.png" alt="Nivel 2" class="level-img" />
          <button class="nivel-btn">Nivel 2</button>
        </div>
        <div class="level-btn-group" onclick="alert('Nivel 3');">
          <img src="nivel3.png" alt="Nivel 3" class="level-img" />
          <button class="nivel-btn">Nivel 3</button>
        </div>
        <div class="level-btn-group" onclick="alert('Nivel 4');">
          <img src="nivel4.png" alt="Nivel 4" class="level-img" />
          <button class="nivel-btn">Nivel 4</button>
        </div>
        <div class="level-btn-group" onclick="alert('Nivel 5');">
          <img src="nivel5.png" alt="Nivel 5" class="level-img" />
          <button class="nivel-btn">Nivel 5</button>
        </div>
      </div>
      <button onclick="showWorlds()" class="main-btn volver-btn">Volver</button>
    </div>
  `;
}

window.showLevel1 = function(world) {
  const app = document.getElementById('app');
  app.innerHTML = `
    <div class="container level1-bg level1-bg-${world}">
      <h2>Ejercicio 1</h2>
      <div style="margin:24px 0;">
        <img src="ejercicio1.png" alt="Ejercicio Naranjas" style="width:100%;max-width:350px;display:block;margin:auto;">
      </div>
      <div style="display:flex;gap:12px;justify-content:center;">
        <button class="ejercicio-btn bg-secondary" id="btn-3">3</button>
        <button class="ejercicio-btn bg-naranja" id="btn-4">4</button>
        <button class="ejercicio-btn bg-primary" id="btn-5">5</button>
        <button class="ejercicio-btn bg-rojo" id="btn-6">6</button>
      </div>
      <button onclick="showLevels('${world}')" class="main-btn volver-btn" style="margin-top:24px;">Volver</button>
    </div>
  `;

  document.getElementById('btn-3').onclick = () => {
    showModal({
      title: 'Incorrecto',
      message: 'Intenta de nuevo.',
      btnText: 'INTENTAR OTRA VEZ'
    });
  };
  document.getElementById('btn-4').onclick = () => {
    showModal({
      title: 'Incorrecto',
      message: 'Intenta de nuevo.',
      btnText: 'INTENTAR OTRA VEZ'
    });
  };
  document.getElementById('btn-5').onclick = () => {
    showModal({
      title: '¡Correcto!',
      message: '¡Muy bien!',
      btnText: 'Siguiente',
      onClose: () => showLevel1_2(world)
    });
  };
  document.getElementById('btn-6').onclick = () => {
    showModal({
      title: 'Incorrecto',
      message: 'Intenta de nuevo.',
      btnText: 'INTENTAR OTRA VEZ'
    });
  };
}

window.showLevel1_2 = function(world) {
  const app = document.getElementById('app');
  app.innerHTML = `
    <div class="container level1-2-bg level1-2-bg-${world}">
      <h2>Ejercicio 2</h2>
      <div style="margin:24px 0; display:flex; gap:12px; justify-content:center;">
        <button class="ejercicio-btn bg-secondary" disabled>1</button>
        <button class="ejercicio-btn bg-naranja" disabled>3</button>
        <button class="ejercicio-btn bg-primary" disabled>5</button>
        <button class="ejercicio-btn bg-rojo" disabled>...</button>
      </div>
      <p>¿Qué número sigue en la secuencia?</p>
      <div style="display:flex;gap:12px;justify-content:center;">
        <button class="ejercicio-btn bg-secondary" id="btn-6">6</button>
        <button class="ejercicio-btn bg-naranja" id="btn-7">7</button>
        <button class="ejercicio-btn bg-primary" id="btn-8">8</button>
        <button class="ejercicio-btn bg-rojo" id="btn-9">9</button>
      </div>
      <button onclick="showLevels('${world}')" class="main-btn volver-btn" style="margin-top:24px;">Volver</button>
    </div>
  `;

  document.getElementById('btn-6').onclick = () => {
    showModal({
      title: 'Incorrecto',
      message: 'Intenta de nuevo.',
      btnText: 'INTENTAR OTRA VEZ'
    });
  };
  document.getElementById('btn-7').onclick = () => {
    showModal({
      title: '¡Correcto!',
      message: '¡Muy bien!',
      btnText: 'Finalizar',
      onClose: () => showLevels(world)
    });
  };
  document.getElementById('btn-8').onclick = () => {
    showModal({
      title: 'Incorrecto',
      message: 'Intenta de nuevo.',
      btnText: 'INTENTAR OTRA VEZ'
    });
  };
  document.getElementById('btn-9').onclick = () => {
    showModal({
      title: 'Incorrecto',
      message: 'Intenta de nuevo.',
      btnText: 'INTENTAR OTRA VEZ'
    });
  };
}

function showModal({ title, message, btnText, onClose }) {
  const modal = document.getElementById('modal');
  document.getElementById('modal-title').textContent = title;
  document.getElementById('modal-message').textContent = message;
  const btn = document.getElementById('modal-btn');
  btn.textContent = btnText;
  modal.style.display = 'flex';

  // Cerrar modal al hacer clic fuera del contenido
  function outsideClick(e) {
    if (e.target === modal) {
      close();
    }
  }
  function close() {
    modal.style.display = 'none';
    btn.removeEventListener('click', handleBtn);
    modal.removeEventListener('mousedown', outsideClick);
    if (onClose) onClose();
  }
  function handleBtn() {
    close();
  }
  btn.addEventListener('click', handleBtn);
  modal.addEventListener('mousedown', outsideClick);
}