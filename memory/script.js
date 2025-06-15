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
        <div class="world-btn-group">
          <img src="mundo1.png" alt="Mundo Azul" class="world-img" />
          <button onclick="showLevels('azul')" class="mundo-btn azul">🔵 Mundo 1</button>
        </div>
        <div class="world-btn-group">
          <img src="mundo2.png" alt="Mundo Amarillo" class="world-img" />
          <button onclick="showLevels('amarillo')" class="mundo-btn amarillo">🟡 Mundo 2</button>
        </div>
        <div class="world-btn-group">
          <img src="mundo3.png" alt="Mundo Rojo" class="world-img" />
          <button onclick="showLevels('rojo')" class="mundo-btn rojo">🔴 Mundo 3</button>
        </div>
        <div class="world-btn-group">
          <img src="mundo4.png" alt="Mundo Extra" class="world-img" />
          <button onclick="showLevels('extra')" class="mundo-btn extra">🌍 Mundo 4</button>
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
      <h2>Niveles de ${world.charAt(0).toUpperCase() + world.slice(1)}</h2>
      <div class="levels-btns">
        <button onclick="showLevel1('${world}')" style="opacity:1;">Nivel 1</button>
        <button disabled style="opacity:0.5;">Nivel 2</button>
        <button disabled style="opacity:0.5;">Nivel 3</button>
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
        <span>🍊🍊🍊 + 🍊🍊 = ?</span>
      </div>
      <div style="display:flex;gap:12px;">
        <button onclick="alert('Incorrecto')">3</button>
        <button onclick="alert('Incorrecto')">4</button>
        <button onclick="alert('¡Correcto!'); showLevel1_2('${world}');">5</button>
        <button onclick="alert('Incorrecto')">6</button>
      </div>
      <button onclick="showLevels('${world}')" class="main-btn volver-btn">Volver</button>
    </div>
  `;
}

window.showLevel1_2 = function(world) {
  const app = document.getElementById('app');
  app.innerHTML = `
    <div class="container level1-2-bg level1-2-bg-${world}">
      <h2>Ejercicio 2</h2>
      <div style="margin:24px 0;">
        <span>1, 3, 5, ...</span>
      </div>
      <div style="display:flex;gap:12px;">
        <button onclick="alert('Incorrecto')">6</button>
        <button onclick="alert('¡Correcto!'); showLevels('${world}');">7</button>
        <button onclick="alert('Incorrecto')">8</button>
        <button onclick="alert('Incorrecto')">9</button>
      </div>
      <button onclick="showLevels('${world}')" class="main-btn volver-btn">Volver</button>
    </div>
  `;
}