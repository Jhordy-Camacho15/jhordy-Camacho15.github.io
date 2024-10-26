const navItems = document.querySelectorAll(".nav-item");

navItems.forEach((navItem, i) => {
  navItem.addEventListener("click", () => {
    navItems.forEach((item, j) => {
      item.className = "nav-item";
    });
    navItem.className = "nav-item active";
  });
});

const containers = document.querySelectorAll(".containers");

containers.forEach((container) => {
  let isDragging = false;
  let startX;
  let scrollLeft;

  container.addEventListener("mousedown", (e) => {
    isDragging = true;
    startX = e.pageX - container.offsetLeft;
    scrollLeft = container.scrollLeft;
  });

  container.addEventListener("mousemove", (e) => {
    if (!isDragging) return;
    e.preventDefault();

    const x = e.pageX - container.offsetLeft;
    const step = (x - startX) * 0.6;
    container.scrollLeft = scrollLeft - step;
  });

  container.addEventListener("mouseup", () => {
    isDragging = false;
  });

  container.addEventListener("mouseleave", () => {
    isDragging = false;
  });
});

const progress = document.getElementById("progress");
const song = document.getElementById("song");
const controlIcon = document.getElementById("controlIcon");
const playPauseButton = document.querySelector(".play-pause-btn");
const forwardButton = document.querySelector(".controls button.forward");
const backwardButton = document.querySelector(".controls button.backward");
const rotatingImage = document.getElementById("rotatingImage");
const songName = document.querySelector(".music-player h2");
const artistName = document.querySelector(".music-player p");

let rotating = false;
let currentRotation = 0;
let rotationInterval;

const songs = [
  
  {
    title: "Milnochez",
    name: "songs of the night",
    source:
      "canciones/cancion_j_soloVoz.mp3",
    cover:
      "img/portada/portada_J.jpg",
  },
  {
    title: "Milnochez",
    name: "songs of the night - extended",
    source:
      "canciones/cancion_j_completo.mp3",
    cover:
      "img/portada/portada_J.jpg",
  },
  {
    title: "The Edge of Memory",
    name: "Flawed Mangoes",
    source:
      "canciones/1_Flawed Mangoes - The Edge of Memory.mp3",
    cover:
      "img/portada/portada_1.jpg",
  },
  
  {
    title: "Mrs Magic",
    name: "Strawberry Guy",
    source:
      "canciones/2_Strawberry Guy - Mrs Magic.mp3",
    cover:
      "img/portada/portada_2.jpg",
  },
  {
    title: "Flaming Hot Cheetos",
    name: "Clairo",
    source:
      "canciones/3_Clairo - Flamin Hot Cheetos.mp3",
    cover:
      "img/portada/portada_3.png",
  },
  {
    title: "Congratulations",
    name: "Goated",
    source:
      "canciones/4_goated - congratulations.mp3",
    cover:
      "img/portada/portada_4.jpg",
  },
  {
    title: "Love drought - slowed + reverb",
    name: "Slö, twilight",
    source:
      "canciones/5_love drought - slowed + reverb.mp3",
    cover:
      "img/portada/portada_5.png",
  },
  {
    title: "Vida en el espejo",
    name: "Enjambre",
    source:
      "canciones/6_enjambre - vida en el espejo.mp3",
    cover:
      "img/portada/portada_6.png",
  },
  {
    title: "Vida en el espejo",
    name: "Enjambre",
    source:
      "canciones/6_enjambre - vida en el espejo.mp3",
    cover:
      "img/portada/portada_6.png",
  }

];


let currentSongIndex = 0;

function startRotation() {
  if (!rotating) {
    rotating = true;
    rotationInterval = setInterval(rotateImage, 50);
  }
}

function pauseRotation() {
  clearInterval(rotationInterval);
  rotating = false;
}

function rotateImage() {
  currentRotation += 1;
  rotatingImage.style.transform = `rotate(${currentRotation}deg)`;
}

function updateSongInfo() {
  songName.textContent = songs[currentSongIndex].title;
  artistName.textContent = songs[currentSongIndex].name;
  song.src = songs[currentSongIndex].source;
  rotatingImage.src = songs[currentSongIndex].cover;

  song.addEventListener("loadeddata", function () {});
}

song.addEventListener("loadedmetadata", function () {
  progress.max = song.duration;
  progress.value = song.currentTime;
});

song.addEventListener("ended", function () {
  currentSongIndex = (currentSongIndex + 1) % songs.length;
  updateSongInfo();
  playPause();
});

song.addEventListener("timeupdate", function () {
  if (!song.paused) {
    progress.value = song.currentTime;
  }
});

function playPause() {
  if (song.paused) {
    song.play();
    controlIcon.classList.add("fa-pause");
    controlIcon.classList.remove("fa-play");
    startRotation();
  } else {
    song.pause();
    controlIcon.classList.remove("fa-pause");
    controlIcon.classList.add("fa-play");
    pauseRotation();
  }
}

playPauseButton.addEventListener("click", playPause);

progress.addEventListener("input", function () {
  song.currentTime = progress.value;
});

progress.addEventListener("change", function () {
  song.play();
  controlIcon.classList.add("fa-pause");
  controlIcon.classList.remove("fa-play");
  startRotation();
});

forwardButton.addEventListener("click", function () {
  currentSongIndex = (currentSongIndex + 1) % songs.length;
  updateSongInfo();
  playPause();
});

backwardButton.addEventListener("click", function () {
  currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
  updateSongInfo();
  playPause();
});

updateSongInfo();

var swiper = new Swiper(".swiper", {
  effect: "coverflow",
  grabCursor: true,
  centeredSlides: true,
  loop: true,
  speed: 600,
  slidesPerView: "auto",
  coverflowEffect: {
    rotate: 10,
    stretch: 120,
    depth: 200,
    modifier: 1,
    slideShadows: false,
  },
   on: {
    click(event) {
      swiper.slideTo(this.clickedIndex);
    },
  },
  pagination: {
    el: ".swiper-pagination",
  },
});
