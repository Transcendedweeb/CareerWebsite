const maskedImage = document.querySelector(".color-image");
const bwImage = document.querySelector(".bw-image");

const imageSets = [
  {
    bw: "src/front-page/boat_start.png",
    color: "src/front-page/boat_final.png",
  },
  {
    bw: "src/front-page/copter_start.png",
    color: "src/front-page/copter_final.png",
  },
  {
    bw: "src/front-page/artorius_start.png",
    color: "src/front-page/artorius_final.png",
  },
  {
    bw: "src/front-page/board_start.png",
    color: "src/front-page/board_final.png",
  },
  {
    bw: "src/front-page/scoop_start.png",
    color: "src/front-page/scoop_final.png",
  },
];

const waitTime4 = 1000;
const waitTimeColorFrame = 10000;
const waitTimeNextAnimation = 500;
let currentIndex = 0;

// Helpers
function updateBWImage(index) {
  bwImage.src = imageSets[index].bw;
  bwImage.style.opacity = "1";
}

function updateColorImage(index) {
  maskedImage.style.backgroundImage = `url(${imageSets[index].color})`;
}

function startAnimation(forward = true, onComplete = null) {
  maskedImage.classList.remove("mask-animation");
  void maskedImage.offsetWidth;

  maskedImage.style.animationDirection = forward ? "normal" : "reverse";
  maskedImage.classList.add("mask-animation");

  const handler = () => {
    maskedImage.removeEventListener("animationend", handler);
    if (forward) bwImage.style.opacity = "0";
    if (typeof onComplete === "function") onComplete();
  };

  maskedImage.addEventListener("animationend", handler);
}

function runAnimationCycle() {
  currentIndex = (currentIndex + 1) % imageSets.length;
  updateBWImage(currentIndex);
  bwImage.style.opacity = "1";

  startAnimation(false, () => {
    setTimeout(() => {
      updateColorImage(currentIndex);

      startAnimation(true, () => {
        setTimeout(() => {
          runAnimationCycle();
        }, waitTimeColorFrame);
      });
    }, waitTime4);
  });
}

window.addEventListener("load", () => {
  updateBWImage(currentIndex);
  updateColorImage(currentIndex);

  setTimeout(() => {
    startAnimation(true, () => {
      setTimeout(() => {
        runAnimationCycle();
      }, waitTimeColorFrame);
    });
  }, waitTimeNextAnimation);
});
