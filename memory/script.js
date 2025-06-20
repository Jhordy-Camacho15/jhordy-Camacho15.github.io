document.addEventListener('DOMContentLoaded', () => {
  showHome();
});

// 1. Pantalla de inicio
function showHome() {
  const app = document.getElementById('app');
  app.innerHTML = `
    <div class="background-img">
      <img src="fondo1.png" alt="Fondo pantalla inicio">
    </div>
    <div class="container home-bg">

      <img src="mundo2.png" class="img-over img2 anim-scale-rl" alt="Decoración 2">
      <img src="mundo3.png" class="img-over img3 anim-scale-bu" alt="Decoración 3">
      <img src="mundo4.png" class="img-over img4 anim-scale-ub" alt="Decoración 4">
      <img src="nave.png" class="img-over img5 anim-scale-center" alt="Decoración 5">
            <img src="logo.png" class="img-over img6 " alt="Decoración 5">

      <button id="playBtn" class="main-btn">JUGAR AHORA</button>
    </div>
  `;
  document.getElementById('playBtn').onclick = showWorlds;
}

// 2. Pantalla de mundos
function showWorlds() {
  const app = document.getElementById('app');
  app.innerHTML = `
  <div class="background-img">
  <img src="fondo2.png" alt="Fondo pantalla X">
</div>
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

// 3. Pantalla de niveles
window.showLevels = function (world) {
  const app = document.getElementById('app');
  app.innerHTML = `
  <div class="background-img">
  <img src="fondo3.png" alt="Fondo pantalla X">
</div>
    <div class="container levels-bg levels-bg-${world}">
      <h2></h2>
      <div class="levels-btns">
        <div class="level-btn-group" onclick="showExercise('${world}', 1)">
          <img src="nivel1.png" alt="Nivel 1" class="level-img" />
          <button class="nivel-btn">Nivel 1</button>
        </div>
        <div class="level-btn-group" onclick="showExercise('${world}', 2)">
          <img src="nivel2.png" alt="Nivel 2" class="level-img" />
          <button class="nivel-btn">Nivel 2</button>
        </div>
        <div class="level-btn-group" onclick="showExercise('${world}', 3)">
          <img src="nivel3.png" alt="Nivel 3" class="level-img" />
          <button class="nivel-btn">Nivel 3</button>
        </div>
        <div class="level-btn-group" onclick="showExercise('${world}', 4)">
          <img src="nivel4.png" alt="Nivel 4" class="level-img" />
          <button class="nivel-btn">Nivel 4</button>
        </div>
        <div class="level-btn-group" onclick="showExercise('${world}', 5)">
          <img src="nivel5.png" alt="Nivel 5" class="level-img" />
          <button class="nivel-btn">Nivel 5</button>
        </div>
      </div>
      <button onclick="showWorlds()" class="main-btn volver-btn">Volver</button>
    </div>
  `;
};












// 4. Ejercicios por nivel
window.showExercise = function (world, nivel) {
  const app = document.getElementById('app');
  // Determina la clase de fondo según el nivel
  const levelBgClass = `level${nivel}-bg level-bg-${world}`;
  // Ejercicio 1
  if (nivel === 1) {
    app.innerHTML = `
      ${renderProgressBar(world, nivel)}

      <div class="background-img">
        <img src="f-m1-n1.png" alt="f-m1-n1.png">
      </div>
      <div class="container ${levelBgClass}">
        <h2>Nivel 1</h2>
        <div style="margin:24px 0;">
          <img src="e-m1-n1.png" alt="Ejercicio Naranjas" style="width:100%;max-width:350px;display:block;margin:auto;">
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
    document.getElementById('btn-3').onclick = () => showModal({
      title: 'Incorrecto',
      message: 'Intenta de nuevo.',
      btnText: 'INTENTAR OTRA VEZ'
    });
    document.getElementById('btn-4').onclick = () => showModal({
      title: 'Incorrecto',
      message: 'Intenta de nuevo.',
      btnText: 'INTENTAR OTRA VEZ'
    });
    document.getElementById('btn-5').onclick = () => showModal({
      title: '¡Correcto!',
      message: '¡Muy bien!',
      btnText: 'Siguiente',
      onClose: () => showExercise(world, 2)
    });
    document.getElementById('btn-6').onclick = () => showModal({
      title: 'Incorrecto',
      message: 'Intenta de nuevo.',
      btnText: 'INTENTAR OTRA VEZ'
    });
  }
  // Ejercicio 2
  else if (nivel === 2) {
    app.innerHTML = `
      ${renderProgressBar(world, nivel)}

     <div class="background-img">
      <img src="f-m1-n2.png" alt="f-m1-n1.png">
    </div>
      <div class="container ${levelBgClass}">
        <h2>Nivel 2</h2>
        <div style="margin:24px 0;">
          <img src="e-m1-n2.png" alt="Uvas" style="width:100%;max-width:350px;display:block;margin:auto;">
        </div>
        <div style="display:flex;gap:12px;justify-content:center;">
          <button class="ejercicio-btn bg-secondary" id="btn-3">6</button>
          <button class="ejercicio-btn bg-naranja" id="btn-4">2</button>
          <button class="ejercicio-btn bg-primary" id="btn-5">3</button>
          <button class="ejercicio-btn bg-rojo" id="btn-6">5</button>
        </div>
        <button onclick="showLevels('${world}')" class="main-btn volver-btn" style="margin-top:24px;">Volver</button>
      </div>
    `;
    document.getElementById('btn-3').onclick = () => showModal({
      title: 'Incorrecto',
      message: 'Intenta de nuevo.',
      btnText: 'INTENTAR OTRA VEZ'
    });
    document.getElementById('btn-4').onclick = () => showModal({
      title: '¡Correcto!',
      message: '¡Muy bien!',
      btnText: 'Siguiente',
      onClose: () => showExercise(world, 3)


    });
    document.getElementById('btn-5').onclick = () => showModal({
      title: 'Incorrecto',
      message: 'Intenta de nuevo.',
      btnText: 'INTENTAR OTRA VEZ'
    });
    document.getElementById('btn-6').onclick = () => showModal({
      title: 'Incorrecto',
      message: 'Intenta de nuevo.',
      btnText: 'INTENTAR OTRA VEZ'
    });
  }
  // Ejercicio 3
  else if (nivel === 3) {
    app.innerHTML = `
      ${renderProgressBar(world, nivel)}

    <div class="background-img">
      <img src="f-m1-n3.png" alt="f-m1-n1.png">
    </div>
      <div class="container ${levelBgClass}">
        <h2>Nivel 3</h2>
        <div style="margin:24px 0;">
          <img src="e-m1-n3.png" alt="Ejercicio 3" style="width:100%;max-width:350px;display:block;margin:auto;">
        </div>
        <div style="display:flex;gap:12px;justify-content:center;">
          <button class="ejercicio-btn bg-secondary" id="btn-1">7</button>
          <button class="ejercicio-btn bg-naranja" id="btn-2">10</button>
          <button class="ejercicio-btn bg-primary" id="btn-3">6</button>
          <button class="ejercicio-btn bg-rojo" id="btn-4">9</button>
        </div>
        <button onclick="showLevels('${world}')" class="main-btn volver-btn" style="margin-top:24px;">Volver</button>
      </div>
    `;
    document.getElementById('btn-1').onclick = () => showModal({
      title: 'Incorrecto',
      message: 'Intenta de nuevo.',
      btnText: 'INTENTAR OTRA VEZ'
    });
    document.getElementById('btn-2').onclick = () => showModal({
      title: 'Incorrecto',
      message: 'Intenta de nuevo.',
      btnText: 'INTENTAR OTRA VEZ'
    });
    document.getElementById('btn-3').onclick = () => showModal({
      title: 'Incorrecto',
      message: 'Intenta de nuevo.',
      btnText: 'INTENTAR OTRA VEZ'
    });
    document.getElementById('btn-4').onclick = () => showModal({
      title: '¡Correcto!',
      message: '¡Muy bien!',
      btnText: 'Siguiente',
      onClose: () => showExercise(world, 4)


    });
  }
  // Ejercicio 4
  else if (nivel === 4) {
    app.innerHTML = `
      ${renderProgressBar(world, nivel)}

    <div class="background-img">
      <img src="f-m1-n4.png" alt="f-m1-n1.png">
    </div>
      <div class="container ${levelBgClass}">
        <h2>Nivel 4</h2>
        <div style="margin:24px 0;">
          <img src="e-m1-n4.png" alt="Ejercicio 4" style="width:100%;max-width:350px;display:block;margin:auto;">
        </div>
        <div style="display:flex;gap:12px;justify-content:center;">
          <button class="ejercicio-btn bg-secondary" id="btn-1">8</button>
          <button class="ejercicio-btn bg-naranja" id="btn-2">1</button>
          <button class="ejercicio-btn bg-primary" id="btn-3">9</button>
          <button class="ejercicio-btn bg-rojo" id="btn-4">20</button>
        </div>
        <button onclick="showLevels('${world}')" class="main-btn volver-btn" style="margin-top:24px;">Volver</button>
      </div>
    `;
    document.getElementById('btn-1').onclick = () => showModal({
      title: 'Incorrecto',
      message: 'Intenta de nuevo.',
      btnText: 'INTENTAR OTRA VEZ'
    });
    document.getElementById('btn-2').onclick = () => showModal({
      title: 'Incorrecto',
      message: 'Intenta de nuevo.',
      btnText: 'INTENTAR OTRA VEZ'
    });
    document.getElementById('btn-3').onclick = () => showModal({
      title: '¡Correcto!',
      message: '¡Muy bien!',
      btnText: 'Siguiente',
      onClose: () => showExercise(world, 5)
    });
    document.getElementById('btn-4').onclick = () => showModal({
      title: 'Incorrecto',
      message: 'Intenta de nuevo.',
      btnText: 'INTENTAR OTRA VEZ'
    });
  }
  // Ejercicio 5
  else if (nivel === 5) {
    app.innerHTML = `
      ${renderProgressBar(world, nivel)}

    <div class="background-img">
      <img src="f-m1-n5.png" alt="f-m1-n1.png">
    </div>
      <div class="container ${levelBgClass}">
        <h2>Ejercicio 5</h2>
        <div style="margin:24px 0;">
          <img src="e-m1-n5.png" alt="Ejercicio 5" style="width:100%;max-width:350px;display:block;margin:auto;">
        </div>
        <div style="display:flex;gap:12px;justify-content:center;">
          <button class="ejercicio-btn bg-secondary" id="btn-1">12</button>
          <button class="ejercicio-btn bg-naranja" id="btn-2">3</button>
          <button class="ejercicio-btn bg-primary" id="btn-3">5</button>
          <button class="ejercicio-btn bg-rojo" id="btn-4">2</button>
        </div>
        <button onclick="showLevels('${world}')" class="main-btn volver-btn" style="margin-top:24px;">Volver</button>
      </div>
    `;
    document.getElementById('btn-1').onclick = () => showModal({
      title: 'Incorrecto',
      message: 'Intenta de nuevo.',
      btnText: 'INTENTAR OTRA VEZ'
    });
    document.getElementById('btn-2').onclick = () => showModal({
      title: '¡Correcto!',
      message: '¡Has completado todos los ejercicios de este mundo!',
      btnText: 'Volver a Mundos',
      onClose: () => showWorlds()

    });
    document.getElementById('btn-3').onclick = () => showModal({
      title: 'Incorrecto',
      message: 'Intenta de nuevo.',
      btnText: 'INTENTAR OTRA VEZ'
    });
    document.getElementById('btn-4').onclick = () => showModal({
      title: 'Incorrecto',
      message: 'Intenta de nuevo.',
      btnText: 'INTENTAR OTRA VEZ'
    });
  }



































  // Mundo 2, Nivel 1: Secuencias geométricas
  if (world === 'amarillo' && nivel === 1) {
    app.innerHTML = `
      ${renderProgressBar(world, nivel)}

      <div class="background-img">
        <img src="f-m2-n1.png" alt="Fondo Mundo 2 Nivel 1">
      </div>
      <div class="container ${levelBgClass}">
        <h2>Nivel 1</h2>
        <div style="display: flex; gap: 18px; justify-content: center; margin-bottom: 32px;">
          <div class="geo-box bg-secondary">
            <div class="geo-shape square bg-rojo"></div>
          </div>
          <div class="geo-box bg-rojo">
            <div class="geo-shape circle bg-secondary"></div>
          </div>
          <div class="geo-box bg-secondary">
            <div class="geo-shape square bg-rojo"></div>
          </div>
          <div class="geo-box bg-rojo">
            <div class="geo-shape question">?</div>
          </div>
        </div>
        <p >¿Qué figura sigue en la secuencia?</p>
        <div style="display: flex; gap: 18px; justify-content: center;">
          <button class="geo-box bg-secondary" id="btn-1">
            <div class="geo-shape square bg-rojo"></div>
          </button>
          <button class="geo-box bg-primary" id="btn-2">
            <div class="geo-shape circle bg-rojo"></div>
          </button>
          <button class="geo-box bg-rojo" id="btn-3">
            <div class="geo-shape circle bg-secondary"></div>
          </button>
          <button class="geo-box bg-naranja" id="btn-4">
            <div class="geo-shape square bg-secondary"></div>
          </button>
        </div>
        <button onclick="showLevels('${world}')" class="main-btn volver-btn" style="margin-top:24px;">Volver</button>
      </div>
    `;
    // Respuesta correcta: opción 3
    document.getElementById('btn-1').onclick = () => showModal({
      title: 'Incorrecto',
      message: 'Intenta de nuevo.',
      btnText: 'INTENTAR OTRA VEZ'
    });
    document.getElementById('btn-2').onclick = () => showModal({
      title: 'Incorrecto',
      message: 'Intenta de nuevo.',
      btnText: 'INTENTAR OTRA VEZ'
    });
    document.getElementById('btn-3').onclick = () => showModal({
      title: '¡Correcto!',
      message: '¡Muy bien!',
      btnText: 'Siguiente',
      onClose: () => showExercise(world, 2)
    });
    document.getElementById('btn-4').onclick = () => showModal({
      title: 'Incorrecto',
      message: 'Intenta de nuevo.',
      btnText: 'INTENTAR OTRA VEZ'
    });
    return;
  }
  // Mundo 2, Nivel 2: Secuencias geométricas
  if (world === 'amarillo' && nivel === 2) {
    app.innerHTML = `
      ${renderProgressBar(world, nivel)}

      <div class="background-img">
        <img src="f-m2-n1.png" alt="Fondo Mundo 2 Nivel 2">
      </div>
      <div class="container level2-bg level-bg-amarillo">
        <h2>Nivel 2</h2>
        <div style="display: flex; gap: 5px; justify-content: center; margin-bottom: 32px;">
          <div class="geo-box bg-primary">
            <div class="geo-shape square bg-secondary"></div>
          </div>
          <div class="geo-box bg-secondary">
            <div class="geo-shape triangle bg-rojo"></div>
          </div>
          <div class="geo-box bg-primary">
            <div class="geo-shape question">?</div>
          </div>
          <div class="geo-box bg-secondary">
            <div class="geo-shape triangle bg-rojo"></div>
          </div>
          <div class="geo-box bg-primary">
            <div class="geo-shape square bg-secondary"></div>
          </div>
        </div>
        
        <p >¿Qué figura sigue en la secuencia?</p>

        <div style="display: flex; gap: 18px; justify-content: center;">
          <button class="geo-box bg-secondary" id="btn-1">
            <div class="geo-shape circle bg-rojo"></div>
          </button>
          <button class="geo-box bg-primary" id="btn-2">
            <div class="geo-shape square bg-secondary"></div>
          </button>
          <button class="geo-box bg-primary" id="btn-3">
            <div class="geo-shape circle bg-secondary"></div>
          </button>
          <button class="geo-box bg-naranja" id="btn-4">
            <div class="geo-shape triangle bg-rojo"></div>
          </button>
        </div>
        <button onclick="showLevels('${world}')" class="main-btn volver-btn" style="margin-top:24px;">Volver</button>
      </div>
    `;
    // Respuesta correcta: opción 2
    document.getElementById('btn-1').onclick = () => showModal({
      title: 'Incorrecto',
      message: 'Intenta de nuevo.',
      btnText: 'INTENTAR OTRA VEZ'
    });
    document.getElementById('btn-2').onclick = () => showModal({
      title: '¡Correcto!',
      message: '¡Muy bien!',
      btnText: 'Siguiente',
      onClose: () => showExercise(world, 3)
    });
    document.getElementById('btn-3').onclick = () => showModal({
      title: 'Incorrecto',
      message: 'Intenta de nuevo.',
      btnText: 'INTENTAR OTRA VEZ'
    });
    document.getElementById('btn-4').onclick = () => showModal({
      title: 'Incorrecto',
      message: 'Intenta de nuevo.',
      btnText: 'INTENTAR OTRA VEZ'
    });
    return;
  }
  // Mundo 2, Nivel 3: Secuencias geométricas
  if (world === 'amarillo' && nivel === 3) {
    app.innerHTML = `
      ${renderProgressBar(world, nivel)}

      <div class="background-img">
        <img src="f-m2-n1.png" alt="Fondo Mundo 2 Nivel 3">
      </div>
      <div class="container level3-bg level-bg-amarillo">
        <h2>Nivel 3</h2>
        <div style="display: flex; gap: 2px; justify-content: center; margin-bottom: 32px;">
          <div class="geo-box bg-primary">
            <div class="geo-shape question">?</div>
          </div>
          <div class="geo-box bg-rojo">
            <div class="geo-shape square bg-secondary"></div>
          </div>
          <div class="geo-box bg-primary">
            <div class="geo-shape circle bg-secondary"></div>
          </div>
          <div class="geo-box bg-rojo">
            <div class="geo-shape square bg-secondary"></div>
          </div>
          <div class="geo-box bg-primary">
            <div class="geo-shape circle bg-secondary"></div>
          </div>
        </div>
                <p >¿Qué figura sigue en la secuencia?</p>

        <div style="display: flex; gap: 18px; justify-content: center;">
          <button class="geo-box bg-secondary" id="btn-1">
            <div class="geo-shape square bg-rojo"></div>
          </button>
          <button class="geo-box bg-primary" id="btn-2">
            <div class="geo-shape circle bg-secondary"></div>
          </button>
          <button class="geo-box bg-primary" id="btn-3">
            <div class="geo-shape square bg-secondary"></div>
          </button>
          <button class="geo-box bg-naranja" id="btn-4">
            <div class="geo-shape triangle bg-rojo"></div>
          </button>
        </div>
        <button onclick="showLevels('${world}')" class="main-btn volver-btn" style="margin-top:24px;">Volver</button>
      </div>
    `;
    // Respuesta correcta: opción 2
    document.getElementById('btn-1').onclick = () => showModal({
      title: 'Incorrecto',
      message: 'Intenta de nuevo.',
      btnText: 'INTENTAR OTRA VEZ'
    });
    document.getElementById('btn-2').onclick = () => showModal({
      title: '¡Correcto!',
      message: '¡Muy bien!',
      btnText: 'Siguiente',
      onClose: () => showExercise(world, 4)
    });
    document.getElementById('btn-3').onclick = () => showModal({
      title: 'Incorrecto',
      message: 'Intenta de nuevo.',
      btnText: 'INTENTAR OTRA VEZ'
    });
    document.getElementById('btn-4').onclick = () => showModal({
      title: 'Incorrecto',
      message: 'Intenta de nuevo.',
      btnText: 'INTENTAR OTRA VEZ'
    });
    return;
  }
  // Mundo 2, Nivel 4: Secuencias geométricas
  if (world === 'amarillo' && nivel === 4) {
    app.innerHTML = `
      ${renderProgressBar(world, nivel)}

      <div class="background-img">
        <img src="f-m2-n1.png" alt="Fondo Mundo 2 Nivel 4">
      </div>
      <div class="container level4-bg level-bg-amarillo">
        <h2>Nivel 4</h2>
        <div style="display: flex; gap: 2px; justify-content: center; margin-bottom: 32px;">
          <div class="geo-box bg-primary">
            <div class="geo-shape square bg-secondary"></div>
          </div>
          <div class="geo-box bg-secondary">
            <div class="geo-shape circle bg-rojo"></div>
          </div>
          <div class="geo-box bg-rojo">
            <div class="geo-shape triangle bg-secondary"></div>
          </div>
          <div class="geo-box bg-secondary">
            <div class="geo-shape circle bg-rojo"></div>
          </div>
          <div class="geo-box bg-primary">
            <div class="geo-shape square bg-secondary"></div>
          </div>
          <div class="geo-box bg-rojo">
            <div class="geo-shape question">?</div>
          </div>
        </div>
        <p>¿Qué figura sigue en la secuencia?</p>
        <div style="display: flex; gap: 18px; justify-content: center;">
          <button class="geo-box bg-secondary" id="btn-1">
            <div class="geo-shape triangle bg-rojo"></div>
          </button>
          <button class="geo-box bg-primary" id="btn-2">
            <div class="geo-shape square bg-rojo"></div>
          </button>
          <button class="geo-box bg-primary" id="btn-3">
            <div class="geo-shape circle bg-secondary"></div>
          </button>
          <button class="geo-box bg-rojo" id="btn-4">
            <div class="geo-shape triangle bg-secondary"></div>
          </button>
        </div>
        <button onclick="showLevels('${world}')" class="main-btn volver-btn" style="margin-top:24px;">Volver</button>
      </div>
    `;
    // Respuesta correcta: opción 4
    document.getElementById('btn-1').onclick = () => showModal({
      title: 'Incorrecto',
      message: 'Intenta de nuevo.',
      btnText: 'INTENTAR OTRA VEZ'
    });
    document.getElementById('btn-2').onclick = () => showModal({
      title: 'Incorrecto',
      message: 'Intenta de nuevo.',
      btnText: 'INTENTAR OTRA VEZ'
    });
    document.getElementById('btn-3').onclick = () => showModal({
      title: 'Incorrecto',
      message: 'Intenta de nuevo.',
      btnText: 'INTENTAR OTRA VEZ'
    });
    document.getElementById('btn-4').onclick = () => showModal({
      title: '¡Correcto!',
      message: '¡Muy bien!',
      btnText: 'Siguiente',
      onClose: () => showExercise(world, 5)
    });
    return;
  }
  // Mundo 2, Nivel 5: Secuencias geométricas
  if (world === 'amarillo' && nivel === 5) {
    app.innerHTML = `
      ${renderProgressBar(world, nivel)}

    <div class="background-img">
      <img src="f-m2-n1.png" alt="Fondo Mundo 2 Nivel 5">
    </div>
    <div class="container level5-bg level-bg-amarillo">
      <h2>Nivel 5</h2>
      <div style="display: flex; gap: 2px; justify-content: center; margin-bottom: 32px;">
        <div class="geo-box bg-rojo">
          <div class="geo-shape circle bg-secondary"></div>
        </div>
        <div class="geo-box bg-primary">
          <div class="geo-shape question">?</div>
        </div>
        <div class="geo-box bg-secondary">
          <div class="geo-shape square bg-rojo"></div>
        </div>
        <div class="geo-box bg-rojo">
          <div class="geo-shape circle bg-secondary"></div>
        </div>
        <div class="geo-box bg-primary">
          <div class="geo-shape triangle bg-secondary"></div>
        </div>
        <div class="geo-box bg-secondary">
          <div class="geo-shape square bg-rojo"></div>
        </div>
      </div>
      <p>¿Qué figura sigue en la secuencia?</p>
      <div style="display: flex; gap: 18px; justify-content: center;">
        <button class="geo-box bg-primary" id="btn-1">
          <div class="geo-shape triangle bg-rojo"></div>
        </button>
        <button class="geo-box bg-rojo" id="btn-2">
          <div class="geo-shape square bg-secondary"></div>
        </button>
        <button class="geo-box bg-rojo" id="btn-3">
          <div class="geo-shape circle bg-secondary"></div>
        </button>
        <button class="geo-box bg-primary" id="btn-4">
          <div class="geo-shape triangle bg-secondary"></div>
        </button>
      </div>
      <button onclick="showLevels('${world}')" class="main-btn volver-btn" style="margin-top:24px;">Volver</button>
    </div>
  `;
    // Respuesta correcta: opción 4
    document.getElementById('btn-1').onclick = () => showModal({
      title: 'Incorrecto',
      message: 'Intenta de nuevo.',
      btnText: 'INTENTAR OTRA VEZ'
    });
    document.getElementById('btn-2').onclick = () => showModal({
      title: 'Incorrecto',
      message: 'Intenta de nuevo.',
      btnText: 'INTENTAR OTRA VEZ'
    });
    document.getElementById('btn-3').onclick = () => showModal({
      title: 'Incorrecto',
      message: 'Intenta de nuevo.',
      btnText: 'INTENTAR OTRA VEZ'
    });
    document.getElementById('btn-4').onclick = () => showModal({
      title: '¡Correcto!',
      message: '¡Has completado todos los ejercicios de este mundo!',
      btnText: 'Volver a Mundos',
      onClose: () => showWorlds()

    });
    return;
  }














  if (world === 'rojo' && nivel >= 1 && nivel <= 5) {
    const numPairs = 5 + nivel;
    const pares = getRandomMemoramaPairs(numPairs);
    const columns = pares.length > 12 ? 4 : 3;
    let grid = '';
    pares.forEach(par => {
      grid += `<button class="memorama-card ${par.color}" data-value="${par.valor}">${par.texto}</button>`;
    });
    app.innerHTML = `
      ${renderProgressBar(world, nivel)}
      <div class="background-img">
        <img src="f-m3-n1.png" alt="Fondo Mundo 3 Nivel ${nivel}">
      </div>
      <div class="container level${nivel}-bg level-bg-rojo">
        <p>Une los pares</p>
        <div id="memorama-grid" >
          ${grid}
        </div>
        <button onclick="showLevels('${world}')" class="main-btn volver-btn" style="margin-top:24px;">Volver</button>
      </div>
    `;
    let first = null, second = null, matched = 0, locked = false;
    const valueMap = {
      "1": "UNO", "UNO": "1",
      "2": "DOS", "DOS": "2",
      "3": "TRES", "TRES": "3",
      "4": "CUATRO", "CUATRO": "4",
      "5": "CINCO", "CINCO": "5",
      "6": "SEIS", "SEIS": "6",
      "7": "SIETE", "SIETE": "7",
      "8": "OCHO", "OCHO": "8",
      "9": "NUEVE", "NUEVE": "9",
      "10": "DIEZ", "DIEZ": "10"
    };
    const cards = Array.from(document.querySelectorAll('.memorama-card'));
    cards.forEach(card => {
      card.onclick = function () {
        if (locked || card.classList.contains('matched')) return;
        // Deseleccionar si ya está seleccionada
        if (card === first) {
          card.classList.remove('selected');
          first = null;
          return;
        }
        if (!first) {
          card.classList.add('selected');
          first = card;
        } else if (!second) {
          card.classList.add('selected');
          second = card;
          locked = true;
          // Solo es par si valor, color y texto/numero coinciden
          if (
            (valueMap[first.textContent] === second.textContent || valueMap[second.textContent] === first.textContent) &&
            first.dataset.value === second.dataset.value &&
            first.className === second.className
          ) {
            setTimeout(() => {
              first.classList.add('matched');
              second.classList.add('matched');
              first.style.opacity = "0.3";
              second.style.opacity = "0.3";
              first.classList.remove('selected');
              second.classList.remove('selected');
              matched += 2;
              first = null;
              second = null;
              locked = false;
              if (matched === numPairs * 2) {
                setTimeout(() => {
                  showModal({
                    title: '¡Correcto!',
                    message: nivel === 5
                      ? '¡Has completado todos los ejercicios de este mundo!'
                      : '¡Muy bien!',
                    btnText: nivel === 5 ? 'Volver a Mundos' : 'Siguiente',
                    onClose: () => {
                      if (nivel === 5) showWorlds();
                      else showExercise(world, nivel + 1);
                    }
                  });
                }, 400);
              }
            }, 400);
          } else {
            setTimeout(() => {
              first.classList.remove('selected');
              second.classList.remove('selected');
              first = null;
              second = null;
              locked = false;
            }, 600);
          }
        }
      };
    });
    return;
  }

  // --- MUNDO 4: NUEVO MEMORAMA ---
  if (world === 'extra' && nivel >= 1 && nivel <= 5) {
    const coloresBase = ["bg-secondary", "bg-naranja", "bg-primary", "bg-rojo"];
    const numPairs = (nivel === 5) ? 16 : 6 + (nivel - 1) * 2; // 6, 8, 10, 12, 16 cartas en nivel 5
    const paresCount = numPairs / 2;

    // Genera la lista de colores para los pares, repitiendo si es necesario
    let colores = [];
    while (colores.length < paresCount) {
      colores = colores.concat(coloresBase);
    }
    colores = colores.slice(0, paresCount);

    // Selecciona pares únicos aleatorios
    const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const textos = ["UNO", "DOS", "TRES", "CUATRO", "CINCO", "SEIS", "SIETE", "OCHO", "NUEVE", "DIEZ"];
    const indices = [];
    while (indices.length < paresCount) {
      let idx = Math.floor(Math.random() * nums.length);
      if (!indices.includes(idx)) indices.push(idx);
    }

    // Genera pares con el color correspondiente
    let pares = [];
    indices.forEach((idx, i) => {
      const color = colores[i];
      pares.push({ valor: nums[idx], color, texto: nums[idx].toString() });
      pares.push({ valor: nums[idx], color, texto: textos[idx] });
    });

    // Mezcla los pares
    for (let i = pares.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pares[i], pares[j]] = [pares[j], pares[i]];
    }
    // Determina columnas
    const columns = pares.length > 12 ? 4 : 3;
    let grid = '';
    pares.forEach((par, idx) => {
      grid += `
    <div class="memocarta ${par.color}" data-value="${par.valor}" data-text="${par.texto}" data-idx="${idx}">
      <div class="memocarta-inner">
        <div class="memocarta-front"></div>
        <div class="memocarta-back">${par.texto}</div>
      </div>
    </div>
  `;
    });

    app.innerHTML = `
  ${renderProgressBar(world, nivel)}
  <div class="background-img">
    <img src="f-m4-n1.png" alt="Fondo Mundo 4 Nivel ${nivel}">
  </div>
  <div class="container level${nivel}-bg level-bg-extra">
    <p>Memoriza y encuentra los pares</p>
    <div id="memorama-grid" >
      ${grid}
    </div>
    <button onclick="showLevels('${world}')" class="main-btn volver-btn" style="margin-top:24px;">Volver</button>
  </div>
`;

    // Lógica de memorama con giro 3D y máximo 2 abiertas
    let openCards = [];
    let matched = 0;
    let locked = false;
    const valueMap = {
      "1": "UNO", "UNO": "1",
      "2": "DOS", "DOS": "2",
      "3": "TRES", "TRES": "3",
      "4": "CUATRO", "CUATRO": "4",
      "5": "CINCO", "CINCO": "5",
      "6": "SEIS", "SEIS": "6",
      "7": "SIETE", "SIETE": "7",
      "8": "OCHO", "OCHO": "8",
      "9": "NUEVE", "NUEVE": "9",
      "10": "DIEZ", "DIEZ": "10"
    };
    const cards = Array.from(document.querySelectorAll('.memocarta'));
    cards.forEach(card => {
      card.onclick = function () {
        if (locked || card.classList.contains('matched') || card.classList.contains('open')) return;
        card.classList.add('open');
        openCards.push(card);

        if (openCards.length === 2) {
          locked = true;
          const [c1, c2] = openCards;
          // Comparación estricta: color, número y texto
          if (
            (valueMap[c1.querySelector('.memocarta-back').textContent] === c2.querySelector('.memocarta-back').textContent ||
              valueMap[c2.querySelector('.memocarta-back').textContent] === c1.querySelector('.memocarta-back').textContent) &&
            c1.dataset.value === c2.dataset.value &&
            c1.className === c2.className
          ) {
            setTimeout(() => {
              c1.classList.add('matched');
              c2.classList.add('matched');
              c1.classList.remove('open');
              c2.classList.remove('open');
              matched += 2;
              openCards = [];
              locked = false;
              if (matched === pares.length) {
                setTimeout(() => {
                  showModal({
                    title: '¡Correcto!',
                    message: nivel === 5
                      ? '¡Has completado todos los ejercicios de este mundo!'
                      : '¡Muy bien!',
                    btnText: nivel === 5 ? 'Volver a Mundos' : 'Siguiente',
                    onClose: () => {
                      if (nivel === 5) showWorlds();
                      else window.showExercise(world, nivel + 1);
                    }
                  });
                }, 400);
              }
            }, 600);
          } else {
            setTimeout(() => {
              c1.classList.remove('open');
              c2.classList.remove('open');
              openCards = [];
              locked = false;
            }, 900);
          }
        } else if (openCards.length > 2) {
          // Si por alguna razón hay más de 2 abiertas, ciérralas todas menos la última
          openCards.slice(0, -1).forEach(c => c.classList.remove('open'));
          openCards = [openCards[openCards.length - 1]];
          locked = false;
        }
      };
    });
    return;
  }

};


































































// Modal reutilizable
function showModal({ title, message, btnText, onClose }) {
  const modal = document.getElementById('modal');
  document.getElementById('modal-title').textContent = title;
  document.getElementById('modal-message').textContent = message;
  const btn = document.getElementById('modal-btn');
  btn.textContent = btnText;

  // Elimina estrella previa si existe
  const prevStar = modal.querySelector('.felicidad-estrella');
  if (prevStar) prevStar.remove();

  // Si es el mensaje de nivel 5 (ganó estrella), muestra la estrella
  if (
    (title.includes('¡Correcto!') || title.includes('¡Felicidades!')) &&
    (message.includes('completado') || message.includes('estrella') || message.includes('todos los ejercicios'))
  ) {
    const estrellaDiv = document.createElement('div');
    estrellaDiv.className = 'felicidad-estrella';
    estrellaDiv.innerHTML = `
      <svg width="120" height="120" viewBox="0 0 120 120" fill="gold" xmlns="http://www.w3.org/2000/svg">
        <polygon points="60,10 73,45 110,45 80,68 90,105 60,82 30,105 40,68 10,45 47,45"/>
      </svg>
      <div style="font-size:1.3em;font-weight:bold;color:#e74c3c;margin-top:8px;">¡Ganaste una estrella!</div>
    `;
    btn.parentNode.insertBefore(estrellaDiv, btn);
  }

  modal.style.display = 'flex';

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

// --- BARRA DE PROGRESO ---
function renderProgressBar(world, nivelActual) {
  const worldNames = {
    azul: "Mundo 1",
    amarillo: "Mundo 2",
    rojo: "Mundo 3",
    extra: "Mundo 4"
  };
  const worldColors = {
    azul: "var(--primary-color)",
    amarillo: "var(--secondary-color)",
    rojo: "var(--rojo)",
    extra: "var(--naranja)"
  };
  let progress = '';
  for (let i = 1; i <= 5; i++) {
    progress += `<div class="progress-step${i <= nivelActual ? ' active' : ''}"></div>`;
  }
  return `
    <div class="progress-bar-container">
      <span class="progress-world" style="color:${worldColors[world]};">${worldNames[world] || ''}</span>
      <div class="progress-bar">
        ${progress}
      </div>
    </div>
  `;
}

// --- MEMORAMA PAIRS GENERATOR ---
function getRandomMemoramaPairs(numPairs) {
  const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const textos = ["UNO", "DOS", "TRES", "CUATRO", "CINCO", "SEIS", "SIETE", "OCHO", "NUEVE", "DIEZ"];
  const colores = ["bg-secondary", "bg-naranja", "bg-primary", "bg-rojo"];
  const indices = [];
  while (indices.length < numPairs) {
    let idx = Math.floor(Math.random() * nums.length);
    if (!indices.includes(idx)) indices.push(idx);
  }
  let pares = [];
  indices.forEach(idx => {
    const color = colores[Math.floor(Math.random() * colores.length)];
    pares.push({ valor: nums[idx], color, texto: nums[idx].toString() });
    pares.push({ valor: nums[idx], color, texto: textos[idx] });
  });
  for (let i = pares.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pares[i], pares[j]] = [pares[j], pares[i]];
  }
  return pares;
}

// --- GUARDAMOS LA FUNCIÓN ORIGINAL ---
const originalShowExercise = window.showExercise;

// --- NUEVA FUNCIÓN UNIFICADA ---
window.showExercise = function (world, nivel) {
  // --- MUNDO 3: MEMORAMA ---
  if (world === 'rojo' && nivel >= 1 && nivel <= 5) {
    const numPairs = 5 + nivel;
    const pares = getRandomMemoramaPairs(numPairs);
    const columns = pares.length > 12 ? 4 : 3;
    let grid = '';
    pares.forEach(par => {
      grid += `<button class="memorama-card ${par.color}" data-value="${par.valor}">${par.texto}</button>`;
    });
    app.innerHTML = `
      ${renderProgressBar(world, nivel)}
      <div class="background-img">
        <img src="f-m4-n1.png" alt="Fondo Mundo 3 Nivel ${nivel}">
      </div>
      <div class="container level${nivel}-bg level-bg-rojo">
        <p>Une los pares</p>
        <div id="memorama-grid" >
          ${grid}
        </div>
        <button onclick="showLevels('${world}')" class="main-btn volver-btn" style="margin-top:24px;">Volver</button>
      </div>
    `;
    let first = null, second = null, matched = 0, locked = false;
    const valueMap = {
      "1": "UNO", "UNO": "1",
      "2": "DOS", "DOS": "2",
      "3": "TRES", "TRES": "3",
      "4": "CUATRO", "CUATRO": "4",
      "5": "CINCO", "CINCO": "5",
      "6": "SEIS", "SEIS": "6",
      "7": "SIETE", "SIETE": "7",
      "8": "OCHO", "OCHO": "8",
      "9": "NUEVE", "NUEVE": "9",
      "10": "DIEZ", "DIEZ": "10"
    };
    const cards = Array.from(document.querySelectorAll('.memorama-card'));
    cards.forEach(card => {
      card.onclick = function () {
        if (locked || card.classList.contains('matched')) return;
        // Deseleccionar si ya está seleccionada
        if (card === first) {
          card.classList.remove('selected');
          first = null;
          return;
        }
        if (!first) {
          card.classList.add('selected');
          first = card;
        } else if (!second) {
          card.classList.add('selected');
          second = card;
          locked = true;
          // Solo es par si valor, color y texto/numero coinciden
          if (
            (valueMap[first.textContent] === second.textContent || valueMap[second.textContent] === first.textContent) &&
            first.dataset.value === second.dataset.value &&
            first.className === second.className
          ) {
            setTimeout(() => {
              first.classList.add('matched');
              second.classList.add('matched');
              first.style.opacity = "0.3";
              second.style.opacity = "0.3";
              first.classList.remove('selected');
              second.classList.remove('selected');
              matched += 2;
              first = null;
              second = null;
              locked = false;
              if (matched === numPairs * 2) {
                setTimeout(() => {
                  showModal({
                    title: '¡Correcto!',
                    message: nivel === 5
                      ? '¡Has completado todos los ejercicios de este mundo!'
                      : '¡Muy bien!',
                    btnText: nivel === 5 ? 'Volver a Mundos' : 'Siguiente',
                    onClose: () => {
                      if (nivel === 5) showWorlds();
                      else showExercise(world, nivel + 1);
                    }
                  });
                }, 400);
              }
            }, 400);
          } else {
            setTimeout(() => {
              first.classList.remove('selected');
              second.classList.remove('selected');
              first = null;
              second = null;
              locked = false;
            }, 600);
          }
        }
      };
    });
    return;
  }

  // --- OTROS MUNDOS: LLAMA A LA FUNCIÓN ORIGINAL ---
  if (typeof originalShowExercise === "function") {
    // Agrega barra de progreso si es un nivel de 1 a 5
    if (nivel >= 1 && nivel <= 5 && (world === 'azul' || world === 'amarillo' || world === 'extra')) {
      // Renderiza la barra de progreso antes de llamar al original
      app.innerHTML = renderProgressBar(world, nivel) + app.innerHTML;
      // Llama al original después de un pequeño delay para asegurar que app.innerHTML no se sobreescriba
      setTimeout(() => originalShowExercise.apply(this, arguments), 0);
      return;
    }
    // Si no es un nivel de 1 a 5, solo llama al original
    return originalShowExercise.apply(this, arguments);
  }
};


