const track = document.getElementById("image-track");
const gallery = document.querySelector(".gallery");
const images = track.querySelectorAll("img");
const startingParallax = 65;

let isDown = false;
let startX = 0;
let prevTranslate = 0;
let currentTranslate = 0;
let displayedTranslate = 0;
let animationFrameId = null;
let dragged = false;
let downTarget = null;

const clamp = (v, min, max) => Math.min(Math.max(v, min), max);

function getClampBounds() {
  const galleryWidth = gallery.offsetWidth;
  const trackWidth = track.scrollWidth;
  const maxTranslate = 0;
  const minTranslate = -(trackWidth - galleryWidth);
  return { minTranslate, maxTranslate };
}

function updateParallax() {
  const galleryWidth = gallery.offsetWidth;
  const percent = (displayedTranslate / galleryWidth) * 100;

  for (const image of images) {
    image.style.objectPosition = `${startingParallax + percent / 4}% center`;
  }
}

function animate() {
  const ease = 0.02;
  displayedTranslate += (currentTranslate - displayedTranslate) * ease;

  track.style.transform = `translateX(${displayedTranslate}px)`;
  updateParallax();

  if (Math.abs(currentTranslate - displayedTranslate) > 0.5) {
    animationFrameId = requestAnimationFrame(animate);
  } else {
    animationFrameId = null;
  }
}

function scheduleAnimation() {
  if (!animationFrameId) {
    animationFrameId = requestAnimationFrame(animate);
  }
}

updateParallax();

track.addEventListener("pointerdown", (e) => {
  isDown = true;
  startX = e.clientX;
  dragged = false;
  downTarget = e.target;
  scheduleAnimation();
});

window.addEventListener("pointermove", (e) => {
  if (!isDown) return;
  const delta = e.clientX - startX;

  if (Math.abs(delta) > 5) dragged = true;

  const { minTranslate, maxTranslate } = getClampBounds();
  currentTranslate = clamp(prevTranslate + delta, minTranslate, maxTranslate);
  scheduleAnimation();
});

window.addEventListener("pointerup", (e) => {
  if (!isDown) return;
  isDown = false;
  prevTranslate = currentTranslate;

  if (!dragged && downTarget && downTarget.tagName === "IMG" && e.target === downTarget) {
    openFullscreen(downTarget);
  }

  downTarget = null;
});

window.addEventListener("resize", () => {
  const { minTranslate, maxTranslate } = getClampBounds();
  currentTranslate = clamp(currentTranslate, minTranslate, maxTranslate);
  prevTranslate = currentTranslate;
  scheduleAnimation();
});

// --- FULLSCREEN ---
const fullscreenOverlay = document.getElementById("fullscreen-overlay");
const fullscreenImage = document.getElementById("fullscreen-image");
const closeFullscreen = document.getElementById("close-fullscreen");

function openFullscreen(img) {
  fullscreenImage.src = img.src;
  fullscreenOverlay.classList.remove("hidden");
}

fullscreenOverlay.addEventListener("click", (e) => {
  if (e.target === fullscreenOverlay || e.target.id === "close-fullscreen") {
    fullscreenOverlay.classList.add("hidden");
  }
});

window.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    fullscreenOverlay.classList.add("hidden");
  }
});
