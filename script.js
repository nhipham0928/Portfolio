const soundToggle = document.getElementById("sound-toggle");
const backgroundMusic = document.getElementById("background-music");

soundToggle.addEventListener("click", () => {
    if (backgroundMusic.muted) {
        backgroundMusic.muted = false;
        soundToggle.textContent = "🔊";
    } else {
        backgroundMusic.muted = true;
        soundToggle.textContent = "🔇";
    }
});

const slides = document.querySelectorAll(".home-slide");
const slider = document.querySelector(".home-slider");

let currentSlide = 0;

setInterval(() => {
    currentSlide++;

    if (currentSlide >= slides.length) {
        currentSlide = 0;
    }

    slider.scrollTo({
        left: slider.clientWidth * currentSlide,
        behavior: "smooth"
    });

}, 3000);