document.addEventListener('DOMContentLoaded', function () {
    // Elementos del DOM
    const DOM = {
        // Navegación
        navbar: document.querySelector('.navbar'),
        sidebar: document.querySelector('.sidebar'),
        sidebarToggle: document.querySelector('.sidebar-toggle'),
        closeSidebar: document.querySelector('.close-sidebar'),
        sidebarOverlay: document.querySelector('.sidebar-overlay'),

        // Barra de ruta
        pathBar: document.querySelector('.path-bar'),
        btnHome: document.getElementById('btn-home'),
        btnProvince: document.getElementById('btn-province'),
        btnTerminal: document.getElementById('btn-terminal'),




        // Secciones
        sections: {
            home: document.getElementById('home-section'),
            featured: document.getElementById('featured-section'),
            terminal: document.getElementById('terminal-section'),
            cooperative: document.getElementById('cooperative-section')
        },

        // Contenedores
        provinceGrid: document.getElementById('province-grid'),
        terminalGrid: document.getElementById('terminal-grid'),
        cooperativeContainer: document.getElementById('cooperative-container'),
        featuredCooperative: document.getElementById('featured-cooperatives'),

        // Títulos dinámicos
        currentProvinceName: document.getElementById('current-province-name'),
        currentTerminalName: document.getElementById('current-terminal-name'),

        // Sidebar
        provinceListSide: document.getElementById('province-list-side'),

        // Tooltip
        tooltip: document.getElementById('tooltip')
    };

    // Datos de la aplicación
    const appData = {
        provincias: [],
        currentProvince: null,
        currentTerminal: null,
        ciudadesPrincipales: ['Quito', 'Guayaquil', 'Cuenca', 'Santo Domingo', 'Riobamba']
    };

    // Inicializar la aplicación
    init();

    async function init() {
        await loadData();
        setupEventListeners();
        renderProvinces();
        renderFeaturedCooperatives();
        renderAllAds(); // Renderizar anuncios
        showSection('home'); // Mostrar provincias al inicio
    }

    // Cargar datos del JSON
    async function loadData() {
        try {
            const response = await fetch('data.json');
            if (!response.ok) throw new Error('Error al cargar datos');
            const data = await response.json();

            // Asignar datos cargados a appData
            appData.provincias = data.provincias;
            appData.ciudadesPrincipales = data.ciudades_principales || [];
            appData.anuncios = data.anuncios || {}; // Asegúrate de que anuncios esté definido
        } catch (error) {
            console.error('Error:', error);
            showError('Error al cargar los datos. Por favor recarga la página.');
        }
    }

    /* ========== RENDERIZADO PRINCIPAL ========== */

    // 1. Renderizar provincias (PRIMERA PANTALLA)
    function renderProvinces() {
        DOM.provinceGrid.innerHTML = '';
        DOM.provinceListSide.innerHTML = '';

        appData.provincias.forEach(provincia => {
            // Card para el grid principal
            const card = document.createElement('div');
            card.className = 'card';
            card.innerHTML = `
                <div class="card-img-container">
                    <img src="img/provincias/${provincia.id}.png" alt="${provincia.nombre}" 
                         class="card-img">
                </div>
                <div class="card-body">
                    <h3 class="card-title">${provincia.nombre}</h3>
                    <p class="card-meta">${provincia.terminales.length} terminales</p>
                </div>
            `;
            card.addEventListener('click', () => selectProvince(provincia));
            DOM.provinceGrid.appendChild(card);

            // Item para el sidebar
            const li = document.createElement('li');
            li.textContent = provincia.nombre;
            li.addEventListener('click', () => {
                selectProvince(provincia);
                toggleSidebar();
            });
            DOM.provinceListSide.appendChild(li);
        });
    }

    // 2. Seleccionar provincia (MUESTRA TERMINALES)
    function selectProvince(provincia) {
        appData.currentProvince = provincia;
        DOM.currentProvinceName.textContent = provincia.nombre;
        DOM.btnProvince.textContent = provincia.nombre;
        DOM.btnProvince.disabled = false;
        DOM.btnTerminal.disabled = true;
        DOM.btnTerminal.textContent = 'Terminal';
        renderTerminals();
        showSection('terminal');
    }

    // 3. Renderizar terminales de una provincia
    function renderTerminals() {
        DOM.terminalGrid.innerHTML = '';

        appData.currentProvince.terminales.forEach(terminal => {
            const card = document.createElement('div');
            card.className = 'card';
            card.innerHTML = `
                <div class="card-img-container">
                    <img src="img/provincias/ciudades/${terminal.id}.png" alt="Terminal ${terminal.nombre}" 
                         class="card-img" >
                </div>
                <div class="card-body">
                    <h3 class="card-title">Terminal ${terminal.nombre}</h3>
                    <p class="card-meta">${terminal.cooperativas.length} cooperativas</p>
                </div>
            `;
            card.addEventListener('click', () => selectTerminal(terminal));
            DOM.terminalGrid.appendChild(card);
        });
    }

    // 4. Seleccionar terminal (MUESTRA COOPERATIVAS)
    function selectTerminal(terminal) {
        appData.currentTerminal = terminal;
        DOM.currentTerminalName.textContent = `Terminal ${terminal.nombre}`;
        DOM.btnTerminal.textContent = terminal.nombre;
        DOM.btnTerminal.disabled = false;
        renderCooperatives();
        showSection('cooperative');
    }

    // 5. Renderizar cooperativas de un terminal
    function renderCooperatives() {
        DOM.cooperativeContainer.innerHTML = '';

        appData.currentTerminal.cooperativas.forEach((coop, index) => {
            const card = document.createElement('div');
            card.className = 'cooperative-card';

            const rating = calculateAverageRating(coop.rating_global);

            card.innerHTML = `
                <div class="coop-header" data-index="${index}">
                    <img src="img/terminales/${coop.logo || 'default.png'}" 
                         alt="${coop.nombre}" class="coop-logo">
                    <div class="coop-info">
                        <h3>${coop.nombre}</h3>
                        <div class="coop-rating" data-rating='${JSON.stringify(coop.rating_global)}'>
                            ${generateStarRating(rating)}
                            <span>${rating.toFixed(1)}</span>
                        </div>
                    </div>
                    <button class="accordion-toggle" aria-expanded="${index === 0}">></button>
                </div>
                <div class="coop-body" style="display: ${index === 0 ? 'block' : 'none'};">
                    ${renderRoutes(coop.rutas)}
                </div>
            `;

            // Add event listener for the entire header
            const header = card.querySelector('.coop-header');
            header.addEventListener('click', () => {
                const body = card.querySelector('.coop-body');
                const toggleButton = header.querySelector('.accordion-toggle');

                // Obtener el estado actual usando getComputedStyle
                const isOpen = window.getComputedStyle(body).display === 'block';

                // Alternar el estado del acordeón actual
                body.style.display = isOpen ? 'none' : 'block';
                toggleButton.setAttribute('aria-expanded', !isOpen);
                header.setAttribute('aria-expanded', !isOpen); // Si usas CSS basado en header

                // Actualizar el estado del botón "toggle-all"
                updateToggleButtonState();
            });

            DOM.cooperativeContainer.appendChild(card);
        });
    }

    /* ========== COOPERATIVAS DESTACADAS ========== */
    function renderFeaturedCooperatives() {
        DOM.featuredCooperative.innerHTML = '';

        const allCooperatives = [];
        appData.provincias.forEach(provincia => {
            provincia.terminales.forEach(terminal => {
                terminal.cooperativas.forEach(coop => {
                    const mainRoutes = coop.rutas.filter(ruta =>
                        appData.ciudadesPrincipales.includes(ruta.destino) &&
                        appData.ciudadesPrincipales.some(c => terminal.nombre.includes(c))
                    );

                    if (mainRoutes.length > 0) {
                        allCooperatives.push({
                            ...coop,
                            terminal: terminal.nombre,
                            provincia: provincia.nombre,
                            mainRoutes,
                            rating: calculateAverageRating(coop.rating_global)
                        });
                    }
                });
            });
        });

        const topCooperatives = allCooperatives
            .sort((a, b) => b.rating - a.rating)
            .slice(0, 3);

        topCooperatives.forEach((coop, index) => {
            const card = document.createElement('div');
            card.className = 'featured-card';

            card.innerHTML = `
                <div class="featured-card-header">
                    ${index === 0 ? '<span class="featured-badge">TOP 1</span>' : ''}
                    <div class="featured-coop-info">
                        <img src="img/logos/${coop.logo || 'default.png'}" 
                             class="featured-coop-logo" 
                             onerror="this.src='img/logos/default.png'">
                        <div>
                            <h3>${coop.nombre}</h3>
                            <div class="coop-rating" data-rating='${JSON.stringify(coop.rating_global)}'>
                                ${generateStarRating(coop.rating)}
                                <span>${coop.rating.toFixed(1)}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="featured-routes">
                    ${coop.mainRoutes.slice(0, 2).map(route => `
                        <div class="featured-route">
                            <div class="route-direction">
                                <span class="route-city">${coop.terminal}</span>
                                <i class="fas fa-arrow-right route-arrow"></i>
                                <span class="route-city">${route.destino}</span>
                            </div>
                            <div class="route-meta">
                                <span>${route.horarios.slice(0, 2).join(' - ')}</span>
                                <span>$${route.costo}</span>
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;

            addTooltipEvents(card);
            DOM.featuredCooperative.appendChild(card);
        });
    }

    /* ========== FUNCIONES AUXILIARES ========== */
    function renderRoutes(rutas) {
        return rutas.map(ruta => `
            <div class="route">
                <div class="route-title">
                    <span class="origin">${appData.currentTerminal.nombre}</span>
                    <i class="fas fa-arrow-right"></i>
                    <span class="destination">${ruta.destino}</span>
                </div>
                <div class="route-schedule">
                    ${ruta.horarios.map(h => `<span class="time">${h}</span>`).join('')}
                </div>
                ${ruta.costo ? `<div class="route-price">$${ruta.costo}</div>` : ''}
            </div>
        `).join('');
    }

    function renderCoopModal(coop) {
        if (!coop.telefono && !coop.sitio_web && !coop.servicios) return '';

        return `
            <div class="modal-overlay" id="modal-${coop.id}">
                <div class="modal">
                    <div class="modal-header">
                        <h3>${coop.nombre}</h3>
                        <button class="close-modal">&times;</button>
                    </div>
                    <div class="modal-body">
                        ${coop.telefono ? `<p><strong>Teléfono:</strong> ${coop.telefono}</p>` : ''}
                        ${coop.sitio_web ? `<p><strong>Sitio web:</strong> <a href="${coop.sitio_web}" target="_blank">${coop.sitio_web}</a></p>` : ''}
                        ${coop.servicios ? `<p><strong>Servicios:</strong> ${coop.servicios.join(', ')}</p>` : ''}
                    </div>
                </div>
            </div>
        `;
    }

    function calculateAverageRating(ratingObj) {
        if (!ratingObj) return 0;
        const values = Object.values(ratingObj);
        return values.reduce((a, b) => a + b, 0) / values.length;
    }

    function generateStarRating(rating) {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        let stars = '';

        for (let i = 0; i < 5; i++) {
            if (i < fullStars) stars += '★';
            else if (i === fullStars && hasHalfStar) stars += '☆';
            else stars += '☆';
        }

        return stars;
    }

    /* ========== TOOLTIPS ========== */
    function addTooltipEvents(element) {
        // Tooltip para el rating
        const ratingElements = element.querySelectorAll('.coop-rating');
        ratingElements.forEach(el => {
            el.addEventListener('mouseenter', showRatingTooltip);
            el.addEventListener('mouseleave', hideTooltip);
        });

        // Tooltip para el icono de información
        const infoIcons = element.querySelectorAll('.info-icon');
        infoIcons.forEach(icon => {
            icon.addEventListener('mouseenter', showInfoTooltip);
            icon.addEventListener('mouseleave', hideTooltip);
        });
    }

    function showRatingTooltip(e) {
        const ratingData = JSON.parse(e.target.closest('.coop-rating').dataset.rating);
        if (!ratingData) return;

        let tooltipContent = '<div style="text-align: center; padding: 0.5rem;">';
        tooltipContent += '<strong>Puntuación (personal)</strong><br>';

        for (const [category, value] of Object.entries(ratingData)) {
            tooltipContent += `${capitalizeFirstLetter(category)}: ${value.toFixed(1)}<br>`;
        }

        tooltipContent += '</div>';

        showTooltip(e.target, tooltipContent, 'top');
    }



    function showInfoTooltip(e) {
        const coopData = JSON.parse(e.target.dataset.coop);
        if (!coopData) return;

        let tooltipContent = '<div style="text-align: center; padding: 0.5rem;">';
        tooltipContent += `<strong> ${coopData.nombre}</strong > <br>`;

        if (coopData.telefono) {
            tooltipContent += `📞 ${coopData.telefono}<br>`;
        }
        if (coopData.sitio_web) {
            tooltipContent += `🌐 ${coopData.sitio_web}<br>`;
        }
        if (coopData.servicios && coopData.servicios.length > 0) {
            tooltipContent += `⚙️ ${coopData.servicios.join(', ')}`;
        }

        tooltipContent += '</div>';

        showTooltip(e.target, tooltipContent, 'left');
    }

    function showTooltip(element, content, position = 'top') {
        if (!DOM.tooltip) return;

        DOM.tooltip.innerHTML = content;
        DOM.tooltip.className = `tooltip ${position}`;
        DOM.tooltip.style.opacity = '1';

        const rect = element.getBoundingClientRect();
        const tooltipHeight = DOM.tooltip.offsetHeight;
        const tooltipWidth = DOM.tooltip.offsetWidth;

        switch (position) {
            case 'top':
                DOM.tooltip.style.left = `${rect.left + rect.width / 2 - tooltipWidth / 2}px`;
                DOM.tooltip.style.top = `${rect.top + window.scrollY - tooltipHeight - 10}px`;
                break;
            case 'bottom':
                DOM.tooltip.style.left = `${rect.left + rect.width / 2 - tooltipWidth / 2}px`;
                DOM.tooltip.style.top = `${rect.bottom + window.scrollY + 10}px`;
                break;
            case 'left':
                DOM.tooltip.style.left = `${rect.left + window.scrollX - tooltipWidth - 10}px`;
                DOM.tooltip.style.top = `${rect.top + window.scrollY + rect.height / 2 - tooltipHeight / 2}px`;
                break;
            case 'right':
                DOM.tooltip.style.left = `${rect.right + window.scrollX + 10}px`;
                DOM.tooltip.style.top = `${rect.top + window.scrollY + rect.height / 2 - tooltipHeight / 2}px`;
                break;
        }
    }

    function hideTooltip() {
        if (DOM.tooltip) {
            DOM.tooltip.style.opacity = '0';
        }
    }

    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    /* ========== CONTROL DE SECCIONES ========== */
    function showSection(sectionName) {
        Object.values(DOM.sections).forEach(section => {
            section.classList.remove('active-section');
        });

        DOM.sections[sectionName].classList.add('active-section');
    }

    /* ========== EVENT LISTENERS ========== */
    function setupEventListeners() {
        // Sidebar
        DOM.sidebarToggle.addEventListener('click', toggleSidebar);
        DOM.closeSidebar.addEventListener('click', toggleSidebar);
        DOM.sidebarOverlay.addEventListener('click', toggleSidebar);

        // Navegación
        DOM.btnHome.addEventListener('click', () => {
            resetNavigation();
            navigateTo('home'); // Antes: showSection('home');
        });

        DOM.btnProvince.addEventListener('click', () => {
            navigateTo('terminal'); // Antes: showSection('terminal');
        });

        DOM.btnTerminal.addEventListener('click', () => {
            navigateTo('cooperative'); // Antes: showSection('cooperative');
        });
    }

    /* ========== FUNCIONES UTILITARIAS ========== */
    function toggleSidebar() {
        DOM.sidebar.classList.toggle('active');
        DOM.sidebarOverlay.classList.toggle('active');
    }

    function resetNavigation() {
        DOM.btnProvince.disabled = true;
        DOM.btnTerminal.disabled = true;
        DOM.btnProvince.textContent = 'Provincia';
        DOM.btnTerminal.textContent = 'Terminal';
        appData.currentProvince = null;
        appData.currentTerminal = null;
    }

    function showError(message) {
        DOM.provinceGrid.innerHTML = `
        <div class="error">
            <i class="fas fa-exclamation-triangle"></i>
            <p>${message}</p>
        </div>
    `;
    }

    function renderAds(section, adData) {
        const adsContainer = document.getElementById(`${section}-ads`);
        adsContainer.innerHTML = '';

        if (adData) {
            const adElement = document.createElement('a');
            adElement.href = adData.link;
            adElement.target = '_blank';
            adElement.innerHTML = `<img src="${adData.imagen}" alt="Anuncio">`;
            adsContainer.appendChild(adElement);
        }
    }

    // Llama a esta función después de cargar los datos
    function renderAllAds() {
        renderAds('province', appData.anuncios.provincias);
        renderAds('terminal', appData.anuncios.terminales);
        renderAds('cooperative', appData.anuncios.cooperativas);
    }
















    

    function navigateTo(section) {
        // Muestra la sección correspondiente
        showSection(section);
        // Guarda el estado en el historial
        history.pushState({ section }, "", `#${section}`);
    }

    // Maneja el botón "Atrás"
    window.addEventListener("popstate", (event) => {
        if (event.state && event.state.section) {
            showSection(event.state.section);
        } else {
            // Si no hay estado, vuelve al inicio
            showSection('home');
        }
    });

    // Inicialización
    window.addEventListener("load", () => {
        const hash = window.location.hash.substring(1);
        if (hash) {
            showSection(hash);
        } else {
            showSection('home');
        }
    });
});


































document.addEventListener('DOMContentLoaded', function () {
    const DOM = {
        cooperativeContainer: document.getElementById('cooperative-container'),
        toggleAllButton: document.getElementById('toggle-all')
    };

    // Verifica si todos los acordeones están abiertos
    function areAllAccordionsOpen() {
        return Array.from(DOM.cooperativeContainer.querySelectorAll('.coop-header')).every(header =>
            header.getAttribute('aria-expanded') === 'true'
        );
    }

    // Verifica si todos los acordeones están cerrados
    function areAllAccordionsClosed() {
        return Array.from(DOM.cooperativeContainer.querySelectorAll('.coop-header')).every(header =>
            header.getAttribute('aria-expanded') === 'false'
        );
    }

    // Alternar todos los acordeones
    function toggleAllAccordions(open) {
        const allHeaders = DOM.cooperativeContainer.querySelectorAll('.coop-header');
        const allBodies = DOM.cooperativeContainer.querySelectorAll('.coop-body');
        const allToggles = DOM.cooperativeContainer.querySelectorAll('.accordion-toggle');

        allHeaders.forEach(header => {
            header.setAttribute('aria-expanded', open);
        });

        allBodies.forEach(body => {
            body.style.display = open ? 'block' : 'none';
        });

        allToggles.forEach(toggle => {
            toggle.setAttribute('aria-expanded', open);
        });

        DOM.toggleAllButton.textContent = open ? 'OCULTAR' : 'MOSTRAR';
        updateToggleButtonState();
    }

    // Manejador del botón "toggle-all"
    DOM.toggleAllButton.addEventListener('click', () => {
        const allOpen = areAllAccordionsOpen();
        toggleAllAccordions(!allOpen);
    });

    // Actualizar estado del botón según el estado actual
    function updateToggleButtonState() {
        if (areAllAccordionsOpen()) {
            DOM.toggleAllButton.textContent = 'OCULTAR';
        } else if (areAllAccordionsClosed()) {
            DOM.toggleAllButton.textContent = 'MOSTRAR';
        } else {
            const someOpen = Array.from(DOM.cooperativeContainer.querySelectorAll('.coop-header')).some(header =>
                header.getAttribute('aria-expanded') === 'true'
            );
            DOM.toggleAllButton.textContent = someOpen ? 'OCULTAR' : 'MOSTRAR';
        }
    }

    // Manejar el clic en un acordeón individual
    function handleAccordionClick(header, body) {
        const isOpen = header.getAttribute('aria-expanded') === 'true';
        header.setAttribute('aria-expanded', !isOpen);
        body.style.display = isOpen ? 'none' : 'block';
        const toggleButton = header.querySelector('.accordion-toggle');
        toggleButton.setAttribute('aria-expanded', !isOpen);
        updateToggleButtonState();
    }

    // Agregar eventos a cada acordeón
    function setupAccordionEvents() {
        const allHeaders = DOM.cooperativeContainer.querySelectorAll('.coop-header');
        allHeaders.forEach(header => {
            const body = header.nextElementSibling;
            header.addEventListener('click', () => handleAccordionClick(header, body));
        });
    }

    // Inicialización
    setupAccordionEvents();
    updateToggleButtonState();
});







