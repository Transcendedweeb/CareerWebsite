const slider = document.querySelector(".slider");
const banner = document.querySelector(".scroll-banner");

// === CONFIG (adjust these for tuning) ===
const config = {
  desktop: {
    ease: 0.01,       // lower = slower
    sensitivity: 0.07 // lower = less sensitive
  },
  mobile: {
    ease: 0.03,
    sensitivity: 0.25
  }
};

// === detect if mobile ===
const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
const { ease, sensitivity } = isMobile ? config.mobile : config.desktop;

// === state ===
let isDown = false;
let startX = 0;
let prevRotation = 0;
let currentRotation = 0;
let displayedRotation = 0;
let animationFrameId = null;

function updateRotation() {
  slider.style.transform = `perspective(1000px) rotateX(-5deg) rotateY(${displayedRotation}deg)`;
}

function animate() {
  displayedRotation += (currentRotation - displayedRotation) * ease;

  updateRotation();

  if (Math.abs(currentRotation - displayedRotation) > 0.2) {
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

window.addEventListener("pointermove", (e) => {
  if (!isDown) return;
  e.preventDefault(); // 🔑 stop browser scroll/zoom
  const delta = e.clientX - startX;
  currentRotation = prevRotation + delta * sensitivity;
  scheduleAnimation();
}, { passive: false }); // 🔑 allow preventDefault()

banner.addEventListener("pointerdown", (e) => {
  isDown = true;
  startX = e.clientX;
  banner.style.cursor = "grabbing";
  e.preventDefault(); // 🔑 stop browser gestures
  scheduleAnimation();
}, { passive: false });

window.addEventListener("pointerup", () => {
  if (!isDown) return;
  isDown = false;
  prevRotation = currentRotation;
  banner.style.cursor = "grab";
});

// initial styles
banner.style.cursor = "grab";
banner.style.userSelect = "none";


