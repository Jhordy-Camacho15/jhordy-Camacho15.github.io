// geo.js - juego de geografía: pares país-capital en columnas
// Lista de países y capitales (iniciando por América, luego Europa)
const geoPairs = [
  // America (12)
  { country: 'Estados Unidos', capital: 'Washington, D.C.' },
  { country: 'Canadá', capital: 'Ottawa' },
  { country: 'México', capital: 'Ciudad de México' },
  { country: 'Brasil', capital: 'Brasilia' },
  { country: 'Argentina', capital: 'Buenos Aires' },
  { country: 'Colombia', capital: 'Bogotá' },
  { country: 'Chile', capital: 'Santiago' },
  { country: 'Perú', capital: 'Lima' },
  { country: 'Venezuela', capital: 'Caracas' },
  { country: 'Ecuador', capital: 'Quito' },
  { country: 'Bolivia', capital: 'Sucre' },
  { country: 'Uruguay', capital: 'Montevideo' },
  // Europa (12)
  { country: 'Reino Unido', capital: 'Londres' },
  { country: 'Francia', capital: 'París' },
  { country: 'Alemania', capital: 'Berlín' },
  { country: 'España', capital: 'Madrid' },
  { country: 'Italia', capital: 'Roma' },
  { country: 'Países Bajos', capital: 'Ámsterdam' },
  { country: 'Portugal', capital: 'Lisboa' },
  { country: 'Bélgica', capital: 'Bruselas' },
  { country: 'Suiza', capital: 'Berna' },
  { country: 'Suecia', capital: 'Estocolmo' },
  { country: 'Noruega', capital: 'Oslo' },
  { country: 'Irlanda', capital: 'Dublín' }
];

// Estado y referencias DOM
const geoCountriesEl = document.getElementById('geo-countries');
const geoCapitalsEl = document.getElementById('geo-capitals');
const geoFoundSpan = document.getElementById('geo-found');
const modalGeo = document.getElementById('modal-geo');
const resultadoGeo = document.getElementById('resultado-geo');
const cerrarModalGeo = document.getElementById('cerrar-modal-geo');
const geoTimeEl = document.getElementById('geo-time');
const geoAttemptsEl = document.getElementById('geo-attempts');
const geoRestartBtn = document.getElementById('geo-restart');
const geoStartBtn = document.getElementById('geo-start');

let remainingPairs = [...geoPairs]; // 24 pairs
let activeBatch = []; // pares activos en pantalla (hasta 6)
let selected = { side: null, index: null, id: null };
let foundCount = 0;
let countriesOrder = [];
let capitalsOrder = [];
let matchesSinceLastReplenish = 0;
let hiddenQueue = []; // queued hidden slots to refill: {id, leftIndex, rightIndex}
let replenishScheduled = false;
let attempts = 0;
let geoTime = 90; // seconds
let geoTimer = null;
const SLOT_COUNT = 6; // fixed number of slot positions per column

function mezclar(array){ return array.sort(()=> Math.random()-0.5); }

function nextBatch(){
  // take up to  pairs from remainingPairs
  if(remainingPairs.length === 0) return;
  const take = Math.min(6, remainingPairs.length);
  const batch = remainingPairs.splice(0, take);
  activeBatch = batch.map((p, i) => ({ id: Date.now()+i, country: p.country, capital: p.capital }));
  renderBatch();
}

function renderBatch(){
  // Ensure fixed number of slot elements exist (SLOT_COUNT) so layout doesn't shift
  if(geoCountriesEl.children.length === 0){
    for(let i=0;i<SLOT_COUNT;i++){
      const el = document.createElement('div');
      el.className = 'geo-item hidden';
      el.dataset.slotIndex = i;
      el.dataset.side = 'country';
      el.textContent = '';
      geoCountriesEl.appendChild(el);
    }
  }
  if(geoCapitalsEl.children.length === 0){
    for(let i=0;i<SLOT_COUNT;i++){
      const el = document.createElement('div');
      el.className = 'geo-item hidden';
      el.dataset.slotIndex = i;
      el.dataset.side = 'capital';
      el.textContent = '';
      geoCapitalsEl.appendChild(el);
    }
  }

  // Prepare shuffled lists of the active items
  const countries = mezclar(activeBatch.map(x=> ({ id: x.id, text: x.country })));
  const capitals = mezclar(activeBatch.map(x=> ({ id: x.id, text: x.capital })));
  countriesOrder = countries.slice();
  capitalsOrder = capitals.slice();

  // Assign shuffled items into available slot indices (we'll take the first N slots)
  const leftSlots = Array.from(geoCountriesEl.querySelectorAll('.geo-item'));
  const rightSlots = Array.from(geoCapitalsEl.querySelectorAll('.geo-item'));

  // Create an array of slot indices and use the first countries.length indices to place countries
  const slotIndices = Array.from({length: SLOT_COUNT}, (_,i) => i);
  // assign countries
  const countryPlacementIndices = mezclar(slotIndices).slice(0, countries.length);
  // first, clear all slots
  leftSlots.forEach((slot, idx)=>{
    slot.dataset.id = '';
    slot.textContent = '';
    slot.classList.remove('error','correct','selected','enter');
    slot.classList.add('hidden');
  });
  rightSlots.forEach((slot, idx)=>{
    slot.dataset.id = '';
    slot.textContent = '';
    slot.classList.remove('error','correct','selected','enter');
    slot.classList.add('hidden');
  });

  countries.forEach((c, i)=>{
    const slotIndex = countryPlacementIndices[i];
    const slot = leftSlots[slotIndex];
    if(slot){
      slot.dataset.id = c.id;
      slot.textContent = c.text;
      slot.classList.remove('hidden');
      slot.classList.add('enter');
      setTimeout(()=> slot.classList.remove('enter'), 300);
    }
  });

  // assign capitals to random available slots (they don't need to mirror the country slot)
  const capitalPlacementIndices = mezclar(slotIndices).slice(0, capitals.length);
  capitals.forEach((c, i)=>{
    const slotIndex = capitalPlacementIndices[i];
    const slot = rightSlots[slotIndex];
    if(slot){
      slot.dataset.id = c.id;
      slot.textContent = c.text;
      slot.classList.remove('hidden');
      slot.classList.add('enter');
      setTimeout(()=> slot.classList.remove('enter'), 300);
    }
  });
}

function clearSelectionVisuals(){
  document.querySelectorAll('.geo-item.selected').forEach(el=> el.classList.remove('selected'));
}

function doReplenish(){
  // For each queued hidden slot, attempt to take one pair from remainingPairs and place it in that slot
  while(hiddenQueue.length > 0 && remainingPairs.length > 0){
    const slot = hiddenQueue.shift();
    const np = remainingPairs.shift();
    const newObj = { id: Date.now() + Math.random(), country: np.country, capital: np.capital };
    activeBatch.push(newObj);
    // apply to DOM if indexes still valid
    const leftNodes = Array.from(geoCountriesEl.querySelectorAll('.geo-item'));
    const rightNodes = Array.from(geoCapitalsEl.querySelectorAll('.geo-item'));
    if(slot.leftIndex !== -1 && leftNodes[slot.leftIndex]){
      const node = leftNodes[slot.leftIndex];
      node.dataset.id = newObj.id;
      node.textContent = newObj.country;
      // clear stale feedback classes and show
      node.classList.remove('hidden','error','correct','selected');
      node.classList.add('enter');
      // remove enter after animation
      setTimeout(()=> node.classList.remove('enter'), 400);
    }
    if(slot.rightIndex !== -1 && rightNodes[slot.rightIndex]){
      const nodeR = rightNodes[slot.rightIndex];
      nodeR.dataset.id = newObj.id;
      nodeR.textContent = newObj.capital;
      nodeR.classList.remove('hidden','error','correct','selected');
      nodeR.classList.add('enter');
      setTimeout(()=> nodeR.classList.remove('enter'), 400);
    }
  }
  // reset counters and scheduling flag
  matchesSinceLastReplenish = 0;
  replenishScheduled = false;
  // If there are still queued slots but no remainingPairs, leave them hidden
}

function handleClickGeo(e){
  const item = e.target.closest('.geo-item');
  if(!item) return;
  const side = item.dataset.side;
  const id = item.dataset.id;
  // if clicking same item, ignore
  if(selected.side === side && selected.id === id) return;
  // if nothing selected, mark
  if(!selected.side){
    selected = { side, id };
    item.classList.add('selected');
    return;
  }
  // if selected side is same as current side, switch selection
  if(selected.side === side){
    clearSelectionVisuals();
    selected = { side, id };
    item.classList.add('selected');
    return;
  }
  // we have country then capital (or viceversa) — check match
  const prevId = selected.id;
  const prevSide = selected.side;
  const currentEl = item;
  const prevEl = document.querySelector(`.geo-item.selected`);
  // match if ids equal
  if(prevId === id){
    // matched: show visual selection, then hide shortly and replenish after a delay
    currentEl.classList.add('selected');
      // mark as correct (green) so text and border show green briefly
      document.querySelectorAll(`.geo-item[data-id="${id}"]`).forEach(el=> el.classList.add('correct'));
    geoCountriesEl.parentElement.classList.add('matched');

    // hide matched items shortly (so user sees the selection briefly)
    const hideDelay = 500; // ms
    setTimeout(()=>{
      // hide visually (clear feedback classes so reused nodes start clean)
      document.querySelectorAll(`.geo-item[data-id="${id}"]`).forEach(el=> { el.classList.remove('error','correct','selected'); el.classList.add('hidden'); });
  // find slotIndex attributes at hide time to remember exactly which slots to refill
  const leftEl = geoCountriesEl.querySelector(`.geo-item[data-id="${id}"]`);
  const rightEl = geoCapitalsEl.querySelector(`.geo-item[data-id="${id}"]`);
  const leftIndex = leftEl && leftEl.dataset && typeof leftEl.dataset.slotIndex !== 'undefined' ? parseInt(leftEl.dataset.slotIndex, 10) : -1;
  const rightIndex = rightEl && rightEl.dataset && typeof rightEl.dataset.slotIndex !== 'undefined' ? parseInt(rightEl.dataset.slotIndex, 10) : -1;
  // queue the hidden slot using explicit slot indices (robust even if DOM order changes)
  hiddenQueue.push({ id, leftIndex, rightIndex });
  // count this as an attempt (both correct and incorrect count)
  attempts++;
  geoAttemptsEl.textContent = attempts;
  // remove from activeBatch and update counters
  activeBatch = activeBatch.filter(p => String(p.id) !== String(id));
  foundCount++;
      matchesSinceLastReplenish++;
      geoFoundSpan.textContent = foundCount;
      // check victory
      if(foundCount === geoPairs.length){
        // all pairs found
        setTimeout(()=> mostrarResultadoGeo(true), 200);
      }
      clearSelectionVisuals();
      geoCountriesEl.parentElement.classList.remove('matched');

      // decide whether to schedule a replenish: when matchesSinceLastReplenish >=2 OR we're nearing the end (<=6 remaining)
      const replenishDelay = 2500; // ms (new items appear ~2s after hide)
      const shouldSchedule = (!replenishScheduled) && (matchesSinceLastReplenish >= 2 || remainingPairs.length <= 4 || hiddenQueue.length >= 6);
      if(shouldSchedule){
        replenishScheduled = true;
        setTimeout(()=>{
          doReplenish();
        }, replenishDelay);
      }
    }, hideDelay);
  } else {
    // not matched: shake animation on both selected items
  attempts++;
  geoAttemptsEl.textContent = attempts;
  currentEl.classList.add('shake', 'error');
  if(prevEl) prevEl.classList.add('shake', 'error');
  // remove shake earlier, keep error visible briefly then clear
  setTimeout(()=>{ currentEl.classList.remove('shake'); if(prevEl) prevEl.classList.remove('shake'); }, 380);
  setTimeout(()=>{ currentEl.classList.remove('error'); if(prevEl) prevEl.classList.remove('error'); }, 900);
  clearSelectionVisuals();
  }
  // reset selection
  selected = { side: null, id: null };
}

function startGeoTimer(){
  if(geoTimer) clearInterval(geoTimer);
  geoTime = 90;
  geoTimeEl.textContent = geoTime;
  geoTimer = setInterval(()=>{
    geoTime--;
    geoTimeEl.textContent = geoTime;
    if(geoTime <= 0){
      clearInterval(geoTimer);
      mostrarResultadoGeo(false);
    }
  }, 1000);
}

function stopGeoTimer(){ if(geoTimer){ clearInterval(geoTimer); geoTimer = null; } }

function mostrarResultadoGeo(ganaste){
  if(ganaste){
    resultadoGeo.textContent = `¡Felicidades! Completaste la geografía en ${90-geoTime}s con ${attempts} intentos.`;
  } else {
    resultadoGeo.textContent = `Tiempo agotado. Lograste ${foundCount} pares en ${attempts} intentos.`;
  }
  modalGeo.classList.remove('hidden');
  stopGeoTimer();
}

// Reset function to reuse for restart and modal-close
// Reset to initial page state (do NOT start the game). Used when modal is closed.
function resetToInitialState(){
  modalGeo && modalGeo.classList.add('hidden');
  stopGeoTimer();
  remainingPairs = [...geoPairs];
  activeBatch = [];
  hiddenQueue = [];
  matchesSinceLastReplenish = 0;
  replenishScheduled = false;
  foundCount = 0;
  attempts = 0;
  // reset displayed time to initial value
  geoTime = 90;
  geoTimeEl.textContent = geoTime;
  geoFoundSpan.textContent = foundCount;
  geoAttemptsEl.textContent = attempts;
  // hide or clear existing slots so page looks like initial load
  Array.from(geoCountriesEl.querySelectorAll('.geo-item')).forEach(slot => {
    slot.dataset.id = '';
    slot.textContent = '';
    slot.classList.remove('error','correct','selected','enter');
    slot.classList.add('hidden');
  });
  Array.from(geoCapitalsEl.querySelectorAll('.geo-item')).forEach(slot => {
    slot.dataset.id = '';
    slot.textContent = '';
    slot.classList.remove('error','correct','selected','enter');
    slot.classList.add('hidden');
  });
  // show START, hide RESTART
  geoStartBtn && geoStartBtn.classList.remove('hidden');
  geoRestartBtn && geoRestartBtn.classList.add('hidden');
}

// Reset and start immediately (used by REINICIAR during gameplay)
function resetAndStart(){
  // clear state
  stopGeoTimer();
  remainingPairs = [...geoPairs];
  activeBatch = [];
  hiddenQueue = [];
  matchesSinceLastReplenish = 0;
  replenishScheduled = false;
  foundCount = 0;
  attempts = 0;
  // reset displayed time before starting
  geoTime = 90;
  geoTimeEl.textContent = geoTime;
  geoFoundSpan.textContent = foundCount;
  geoAttemptsEl.textContent = attempts;
  // populate initial batch and start timer
  nextBatch();
  startGeoTimer();
  // swap buttons: hide start, show restart
  geoStartBtn && geoStartBtn.classList.add('hidden');
  geoRestartBtn && geoRestartBtn.classList.remove('hidden');
}

// When modal closed, return to initial page state (do not auto-start)
cerrarModalGeo && cerrarModalGeo.addEventListener('click', ()=>{ resetToInitialState(); });

// Restart button restarts the game immediately (visible only after starting)
geoRestartBtn && geoRestartBtn.addEventListener('click', ()=>{ resetAndStart(); });

// init
geoCountriesEl.addEventListener('click', handleClickGeo);
geoCapitalsEl.addEventListener('click', handleClickGeo);

// start / restart wiring: start button populates board and starts timer
geoStartBtn && geoStartBtn.addEventListener('click', ()=>{
  // populate initial batch and start timer
  nextBatch();
  startGeoTimer();
  // swap buttons: hide start, show restart
  geoStartBtn.classList.add('hidden');
  geoRestartBtn.classList.remove('hidden');
});

// Note: game will not auto-start on page load; user must press INICIAR
