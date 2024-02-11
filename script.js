const noBtn = document.getElementById("no");
const yesBtn = document.getElementById("yes");
const yayText = document.getElementById("yay");
const yayText1 = document.getElementById("frente");

const fondo = document.getElementById("fondo");


const can1 = document.getElementById("can1");
const can = document.getElementById("can");

let padding = 20;

noBtn.addEventListener("click", () => {
    padding += 10;
    yesBtn.style.padding = `${padding}px`;
});

yesBtn.addEventListener("click", () => {
    yayText.style.display = "block";
    yayText1.style.display = "none";
    frente.style.display = "none";




    can.style.display = "none";
    can1.style.display = "block";
    can1.style.scale = "1"

    noBtn.style.display ="none";
    yesBtn.style.display ="none";
    fondo.style.display = "block";


});