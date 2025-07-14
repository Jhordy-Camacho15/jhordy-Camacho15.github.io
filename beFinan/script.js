// Lógica principal de beFinan SPA

document.addEventListener('DOMContentLoaded', () => {
    // Cargar datos de localStorage o usar valores por defecto
    let data = loadData() || {
        user: "Jhordy",
        fixedIncome: 3000,
        fixedExpense: 0,
        expenses: [
            { value: 200, type: "gasto", category: "supermercado" },
            { value: 100, type: "gasto", category: "arriendo" }
        ],
        categories: {
            gasto: ["comida", "arriendo", "supermercado", "lavandería"],
            ingreso: ["empleo", "bonos"]
        }
    };

    function saveData() {
        localStorage.setItem('befinan-data', JSON.stringify(data));
    }

    function loadData() {
        const d = localStorage.getItem('befinan-data');
        return d ? JSON.parse(d) : null;
    }

    // Referencias DOM
    const userName = document.getElementById('user-name');
    const screenContainer = document.getElementById('screen-container');
    const historyBtn = document.getElementById('history-btn');
    const addBtn = document.getElementById('add-btn');
    const settingsBtn = document.getElementById('settings-btn');
    const homeBtn = document.getElementById('home-btn');

    // Renderiza la pantalla principal (HOME)
    function renderHome() {
        userName.textContent = data.user;
        screenContainer.innerHTML = `
            <section class="progress-section">
                <div class="progress-bar">
                    <div class="progress-fill"></div>
                </div>
                <div class="progress-info"></div>
                <div class="period-buttons">
                    <button class="period-btn" data-period="dia">Día</button>
                    <button class="period-btn" data-period="semana">Semana</button>
                    <button class="period-btn" data-period="mes">Mes</button>
                    <button class="period-btn" data-period="año">Año</button>
                </div>
            </section>
            <section class="pie-section">
                <canvas id="pie-canvas" width="200" height="200"></canvas>
                <button id="pie-details-btn" aria-label="Detalles">▼</button>
                <div id="pie-details" class="hidden"></div>
            </section>
        `;
        renderProgressBar();
        renderPieChart();
        document.getElementById('pie-details-btn').onclick = togglePieDetails;
        // Aquí puedes agregar lógica para los botones de periodo si lo deseas
    }

    // Barra de progreso
    function renderProgressBar() {
        const totalGastos = data.expenses
            .filter(e => e.type === "gasto")
            .reduce((sum, e) => sum + e.value, 0);

        // Suma de ingresos extra (todos los ingresos menos el fijo)
        const ingresosExtra = data.expenses
            .filter(e => e.type === "ingreso")
            .reduce((sum, e) => sum + e.value, 0);

        const totalIngresos = data.fixedIncome + ingresosExtra;
        const percent = Math.round((totalGastos / totalIngresos) * 100);

        const fill = screenContainer.querySelector('.progress-fill');
        const info = screenContainer.querySelector('.progress-info');

        // Visual: barra con dos colores
        fill.style.background = `linear-gradient(to right, 
            #4CAF50 0%, 
            #4CAF50 ${data.fixedIncome / totalIngresos * 100}%, 
            #2196F3 ${data.fixedIncome / totalIngresos * 100}%, 
            #2196F3 100%)`;
        fill.style.width = Math.min(percent, 100) + "%";

        info.textContent = `${data.fixedIncome} + ${ingresosExtra} / ${totalIngresos} USD | ${percent}%`;
        if (percent > 100) fill.style.background = "#e53935";
    }

    // Diagrama circular (pastel)
    function renderPieChart() {
        const canvas = document.getElementById('pie-canvas');
        const ctx = canvas.getContext('2d');
        const gastosPorCat = {};
        data.expenses
            .filter(e => e.type === "gasto")
            .forEach(e => gastosPorCat[e.category] = (gastosPorCat[e.category] || 0) + e.value);
        const total = Object.values(gastosPorCat).reduce((a, b) => a + b, 0);
        const colors = ["#4CAF50", "#FFC107", "#2196F3", "#FF5722", "#9C27B0", "#00BCD4"];
        let start = 0, i = 0;
        ctx.clearRect(0, 0, 200, 200);
        Object.entries(gastosPorCat).forEach(([cat, val]) => {
            const angle = (val / total) * 2 * Math.PI;
            ctx.beginPath();
            ctx.moveTo(100, 100);
            ctx.arc(100, 100, 90, start, start + angle);
            ctx.closePath();
            ctx.fillStyle = colors[i++ % colors.length];
            ctx.fill();
            start += angle;
        });
        // Detalles
        const details = Object.entries(gastosPorCat).map(([cat, val], idx) =>
            `<div><span style="color:${colors[idx % colors.length]}">●</span> ${cat}: ${val} USD | ${Math.round((val/total)*100)}%</div>`
        ).join('');
        document.getElementById('pie-details').innerHTML = details;
    }

    function togglePieDetails() {
        const details = document.getElementById('pie-details');
        details.classList.toggle('hidden');
    }

    // Pantalla para añadir registro
    function renderAdd(editIdx = null) {
        // Si editIdx no es null, es edición
        let valor = "", tipo = "gasto", categoria = "", fecha = "";
        if (editIdx !== null) {
            const reg = data.expenses[editIdx];
            valor = reg.value;
            tipo = reg.type;
            categoria = reg.category;
            fecha = reg.date || "";
        } else {
            // Por defecto, hoy
            const today = new Date().toISOString().slice(0,10);
            fecha = today;
        }
        screenContainer.innerHTML = `
            <button id="close-add" class="close-btn" aria-label="Cerrar">✖</button>
            <form id="add-form" autocomplete="off">
                <label>Valor: <input type="number" min="0.01" step="0.01" name="valor" required value="${valor}"></label>
                <label>Tipo:
                    <select name="tipo">
                        <option value="gasto" ${tipo==="gasto"?"selected":""}>Gasto</option>
                        <option value="ingreso" ${tipo==="ingreso"?"selected":""}>Ingreso</option>
                    </select>
                </label>
                <label>Categoría:
                    <select name="categoria"></select>
                    <button type="button" id="add-cat-btn">+</button>
                </label>
                <label>Fecha:
                    <input type="date" name="fecha" value="${fecha}">
                </label>
                <button type="submit">${editIdx !== null ? "Guardar" : "Agregar"}</button>
            </form>
        `;
        document.getElementById('close-add').onclick = renderHome;
        updateCategoryOptions(tipo);
        const tipoSel = screenContainer.querySelector('select[name="tipo"]');
        tipoSel.onchange = () => updateCategoryOptions(tipoSel.value);
        screenContainer.querySelector('#add-cat-btn').onclick = addCategoryPrompt;
        screenContainer.querySelector('#add-form').onsubmit = e => handleAddForm(e, editIdx);
    }

    function updateCategoryOptions(tipo) {
        const catSel = screenContainer.querySelector('select[name="categoria"]');
        catSel.innerHTML = data.categories[tipo].map(cat =>
            `<option value="${cat}">${cat}</option>`
        ).join('');
    }

    function addCategoryPrompt() {
        const tipo = screenContainer.querySelector('select[name="tipo"]').value;
        const nueva = prompt("Nueva categoría:");
        if (nueva && !data.categories[tipo].includes(nueva)) {
            data.categories[tipo].push(nueva);
            updateCategoryOptions(tipo);
        }
    }

    function handleAddForm(e, editIdx = null) {
        e.preventDefault();
        const f = e.target;
        const valor = parseFloat(f.valor.value);
        const tipo = f.tipo.value;
        const categoria = f.categoria.value;
        const fecha = f.fecha.value;
        if (valor > 0 && categoria) {
            const registro = { value: valor, type: tipo, category: categoria, date: fecha };
            if (editIdx !== null) {
                data.expenses[editIdx] = registro;
            } else {
                data.expenses.push(registro);
            }
            saveData();
            renderHome();
        }
    }

    // Pantalla de configuración (drag & drop de categorías)
    function renderSettings() {
        screenContainer.innerHTML = `
            <div class="fixed-section">
                <h2>Ingresos y Gastos Fijos</h2>
                <form id="fixed-form">
                    <label>Ingreso fijo: <input type="number" min="0" step="1" id="fixed-income-input" value="${data.fixedIncome}" required></label>
                    <label>Gasto fijo total: <input type="number" min="0" step="1" id="fixed-expense-input" value="${data.fixedExpense || 0}"></label>
                    <button type="submit">Guardar</button>
                </form>
            </div>
            <h2>Categorías</h2>
            <button id="lock-cats">${catLocked ? "🔓" : "🔒"}</button>
            <div id="cat-config"></div>
            <button id="add-main-cat">Añadir categoría principal</button>
        `;
        document.getElementById('fixed-form').onsubmit = e => {
            e.preventDefault();
            data.fixedIncome = parseFloat(document.getElementById('fixed-income-input').value) || 0;
            data.fixedExpense = parseFloat(document.getElementById('fixed-expense-input').value) || 0;
            saveData();
            renderSettings();
        };
        renderCategoryConfig();
        document.getElementById('add-main-cat').onclick = () => {
            const nueva = prompt("Nueva categoría principal:");
            if (nueva && !data.categories.gasto.includes(nueva)) {
                data.categories.gasto.push(nueva);
                renderCategoryConfig();
            }
        };
        document.getElementById('lock-cats').onclick = () => {
            catLocked = !catLocked;
            renderSettings();
        };
    }

    let catLocked = false;
    function renderCategoryConfig() {
        const cont = document.getElementById('cat-config');
        cont.innerHTML = data.categories.gasto.map((cat, idx) =>
            `<div class="cat-item" draggable="${!catLocked}" data-cat="${cat}">
                ${cat}
                <button class="edit-cat" data-idx="${idx}">✏️</button>
                <button class="del-cat" data-cat="${cat}" ${catLocked ? "disabled" : ""}>🗑</button>
            </div>`
        ).join('');
        cont.querySelectorAll('.del-cat').forEach(btn => {
            btn.onclick = e => {
                const cat = e.target.dataset.cat;
                data.categories.gasto = data.categories.gasto.filter(c => c !== cat);
                saveData();
                renderCategoryConfig();
            };
        });
        // Drag & drop básico
        let dragSrc = null;
        cont.querySelectorAll('.cat-item').forEach(item => {
            item.ondragstart = e => dragSrc = item;
            item.ondragover = e => { e.preventDefault(); item.classList.add('drag-over'); };
            item.ondragleave = e => item.classList.remove('drag-over');
            item.ondrop = e => {
                e.preventDefault();
                item.classList.remove('drag-over');
                if (dragSrc && dragSrc !== item) {
                    const idx1 = Array.from(cont.children).indexOf(dragSrc);
                    const idx2 = Array.from(cont.children).indexOf(item);
                    const arr = data.categories.gasto;
                    arr.splice(idx2, 0, arr.splice(idx1, 1)[0]);
                    saveData();
                    renderCategoryConfig();
                }
            };
        });
        document.getElementById('lock-cats').onclick = () => {
            catLocked = !catLocked;
            renderCategoryConfig();
        };
    }

    // Pantalla de historial (simple)
    function renderHistory() {
        screenContainer.innerHTML = `
            <h2>Historial</h2>
            <ul>
                ${data.expenses.map((e, i) =>
                    `<li>
                        ${e.type === "gasto" ? "🛒" : "💰"} ${e.category}: ${e.value} USD
                        <button class="edit-exp" data-idx="${i}">✏️</button>
                        <button class="del-exp" data-idx="${i}">🗑</button>
                    </li>`
                ).join('')}
            </ul>
        `;
        screenContainer.querySelectorAll('.del-exp').forEach(btn => {
            btn.onclick = e => {
                const idx = +e.target.dataset.idx;
                data.expenses.splice(idx, 1);
                saveData();
                renderHistory();
            };
        });
        screenContainer.querySelectorAll('.edit-exp').forEach(btn => {
            btn.onclick = e => {
                const idx = +e.target.dataset.idx;
                renderAdd(idx);
            };
        });
    }

  // Navegación
    historyBtn.onclick = renderHistory;
    addBtn.onclick = () => renderAdd();
    settingsBtn.onclick = renderSettings;
    homeBtn.onclick = renderHome;

    // Render inicial
    renderHome();
});