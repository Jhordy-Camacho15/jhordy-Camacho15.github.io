const profile = {
    name: "Jhordy Camacho",
    image: "img/perfil.jpg",
    contact: [
        { icon: "img/logo_gmail.png", link: "mailto:jhordyjhon0@gmail.com", alt: "Gmail" },
        { icon: "img/logo_instagram.png", link: "https://www.instagram.com/jhordy_designdev/?hl=es", alt: "Instagram" },
        { icon: "img/logo_whatsapp.png", link: "https://wa.me/593991194932", alt: "WhatsApp" }
    ],
    studies: [
        { logo: "img/logo_espoch.png", institution: "ESPOCH", description: "Diseñador Gráfico" },
        { logo: "img/logo_unir.png", institution: "UNIR", description: "EN PROGRESO: Maestría en Diseño y Desarrollo de Interfaz de Usuario Web" }
    ],
    skills: [
        { logo: "img/logo_wordpress.png", name: "Wordpress", progress: 80 },
        { logo: "img/logo_figma.png", name: "Figma", progress: 80 },
        { logo: "img/logo_html.png", name: "HTML", progress: 80 },
        { logo: "img/logo_css.png", name: "CSS", progress: 75 },
        { logo: "img/logo_js.png", name: "JavaScript", progress: 50 }
    ],
    courses: [
        { logo: "img/logo_crehana.png" },
        { logo: "img/logo_domestika.png" },
        { logo: "img/logo_udemy.png" },
        { logo: "img/logo_netzun.png" },
        { logo: "img/logo_coursera.png" }
    ],
    herramientas: [
        { logo: "img/logo_godot.png" },
        { logo: "img/logo_spatial.png" },
        { logo: "img/logo_visual.png" },
        { logo: "img/logo_unreal.png" },
        { logo: "img/logo_blender.png" },
        { logo: "img/logo_elementor.png" }

    ]
};

document.addEventListener("DOMContentLoaded", () => {
    const infoContainer = document.querySelector(".info-container");

    // Perfil
    const profilePic = document.createElement("div");
    profilePic.classList.add("profile-pic");
    profilePic.innerHTML = `
    <img src="${profile.image}" alt="Tu Foto">
    <h3>${profile.name}</h3>
    <button class="hamburger" onclick="toggleSidebar()">☰</button>
`;
    infoContainer.appendChild(profilePic);


    // Secciones
    const secciones = document.createElement("div");
    secciones.classList.add("secciones");

    // Contacto
    const contactoSection = createSection("Contacto", `
        <div class="contacto-icons">
            ${profile.contact.map(item => `
                <a href="${item.link}" target="_blank">
                    <img src="${item.icon}" alt="${item.alt}">
                </a>
            `).join('')}
        </div>
    `);
    secciones.appendChild(contactoSection);

    // Estudios
    const estudiosSection = createSection("Estudios", profile.studies.map(item => `
        <li>
            <div class="logo-container">
                <img src="${item.logo}" alt="${item.institution} Logo">
            </div>
            <div class="institu">
                <strong>${item.institution}</strong>
                <p>${item.description}</p>
            </div>
        </li>
    `).join(''));
    estudiosSection.querySelector("ul").classList.add("estudios-list");
    secciones.appendChild(estudiosSection);

    // Habilidades
    const habilidadesSection = createSection("Habilidades", profile.skills.map(item => `
        <li>
            <div class="logo-container">
                <img src="${item.logo}" alt="${item.name} Logo">
            </div>
           
        </li>
    `).join(''));
    habilidadesSection.querySelector("ul").classList.add("cursos-list");
    secciones.appendChild(habilidadesSection);

    // Cursos
    const cursosSection = createSection("Cursos", profile.courses.map(item => `
        <li>
            <div class="logo-container">
                <img src="${item.logo}" alt="Curso Logo">
            </div>
        </li>
    `).join(''));
    cursosSection.querySelector("ul").classList.add("cursos-list");
    secciones.appendChild(cursosSection);

    // herramientas
    const herramientasSection = createSection("herramientas", profile.herramientas.map(item => `
        <li>
            <div class="logo-container">
                <img src="${item.logo}" alt="herramientas Logo">
            </div>
        </li>
    `).join(''));
    herramientasSection.querySelector("ul").classList.add("cursos-list");
    secciones.appendChild(herramientasSection);

    infoContainer.appendChild(secciones);
});

// Función para crear secciones
function createSection(title, content) {
    const section = document.createElement("div");
    section.classList.add("section");
    section.innerHTML = `
        <h4>${title}</h4>
        <ul>${content}</ul>
    `;
    return section;
}



















function openTab(evt, tabName) {
    const tablinks = document.querySelectorAll(".tablink");
    const tabcontents = document.querySelectorAll(".tabcontent");

    tablinks.forEach(tab => tab.classList.remove("active"));
    tabcontents.forEach(tab => tab.classList.remove("active"));

    evt.currentTarget.classList.add("active");
    document.getElementById(tabName).classList.add("active");
}






















// Array de cartas
const cartas = [
    {
        titulo: "Club de Diseño y Desarrollo",
        descripcion: "",
        imagen: "/paginas/proyectos/club.png",
        tag: "paginasWeb", // Etiqueta para filtrar
        enlace: "https://clubdisenodesarrollo.github.io", // Enlace a la página del proyecto
    },
    {
        titulo: "Filtro Web",
        descripcion: "",
        imagen: "/paginas/proyectos/filtroWeb.png",
        tag: "paginasWeb", // Etiqueta para filtrar
        enlace: "https://clubdisenodesarrollo.github.io/Proyectos/filtroWeb/index.html", // Enlace a la página del proyecto
    },
    {
        titulo: "PRÓXIMAMENTE Página Web- Tv O - Programa de TV",
        descripcion: "",
        imagen: "/paginas/proyectos/tvo/fondo.png",
        tag: "paginasWeb", // Etiqueta para filtrar
        enlace: "https://clubdisenodesarrollo.github.io/Proyectos/filtroWeb/index.html", // Enlace a la página del proyecto
    },
    {
        titulo: "Identidad Club de Diseño y Desarrollo",
        descripcion: "",
        imagen: "/paginas/proyectos/CDD_logo_completo_3.jpeg",
        tag: "logos", // Etiqueta para filtrar
        enlace: "", // Enlace a la página del proyecto
    },
    {
        titulo: "Identidad Orfi's",
        descripcion: "",
        imagen: "/paginas/proyectos/logo_orfis.png",
        tag: "logos", // Etiqueta para filtrar
        enlace: "", // Enlace a la página del proyecto
    },
    {
        titulo: "Póster Jugador",
        descripcion: "",
        imagen: "/paginas/proyectos/Post_jugadorJhordy_CUADRADO.png",
        tag: "disenos", // Etiqueta para filtrar
        enlace: "", // Enlace a la página del proyecto
    },
    // Agrega más cartas según sea necesario
];

// Función para renderizar cartas
function renderCartas(filterTag = "todos") {
    const contenedorCartas = document.getElementById("cartas");
    contenedorCartas.innerHTML = ""; // Limpiar el contenedor

    // Filtrar cartas según la etiqueta
    const cartasFiltradas = filterTag === "todos"
        ? cartas // Mostrar todas las cartas
        : cartas.filter((carta) => carta.tag === filterTag); // Filtrar por etiqueta

    // Generar el HTML de las cartas filtradas
    cartasFiltradas.forEach((carta) => {
        const cartaHTML = `
        <a href="${carta.enlace}" class="carta">
          <div class="contenedor-imagen">
            <img src="${carta.imagen}" alt="${carta.titulo}">
          </div>
          <div class="contenido">
            <h2>${carta.titulo}</h2>
            <p>${carta.descripcion}</p>
          </div>
        </a>
      `;
        contenedorCartas.innerHTML += cartaHTML;
    });
}
// Eventos para los botones de filtro
document.querySelectorAll(".boton-filtro").forEach((boton) => {
    boton.addEventListener("click", () => {
        const tag = boton.getAttribute("data-tag"); // Obtener la etiqueta del botón
        renderCartas(tag); // Renderizar cartas con la etiqueta seleccionada
    });
});

// Renderizar todas las cartas al cargar la página
document.addEventListener("DOMContentLoaded", () => renderCartas());


















document.addEventListener("DOMContentLoaded", () => {
    const hamburgerButton = document.querySelector(".hamburger");
    const infoContainer = document.querySelector(".info-container");
    const contentContainer = document.querySelector(".content-container");

    // Agregar animación de atención al cargar la página
    hamburgerButton.classList.add("attention");

    // Alternar clases al hacer clic en el botón de hamburguesa
    hamburgerButton.addEventListener("click", () => {
        infoContainer.classList.toggle("expanded"); // Expandir o contraer .info-container
        contentContainer.classList.toggle("shifted"); // Desplazar o restaurar .content-container

        // Quitar la animación de atención después del primer clic
        hamburgerButton.classList.remove("attention");
    });

});

