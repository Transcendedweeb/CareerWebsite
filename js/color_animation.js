const maskedImage = document.querySelector(".color-image");
const bwImage = document.querySelector(".bw-image");

const imageSets = [
  {
    bw: "images/board_start.png",
    color: "images/board_final.png",
  },
  {
    bw: "images/scoop_start.png",
    color: "images/scoop_final.png",
  },
];

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
  void maskedImage.offsetWidth; // force reflow

  maskedImage.style.animationDirection = forward ? "normal" : "reverse";
  maskedImage.classList.add("mask-animation");

  const handler = () => {
    maskedImage.removeEventListener("animationend", handler);
    if (forward) bwImage.style.opacity = "0";
    if (typeof onComplete === "function") onComplete();
  };

  maskedImage.addEventListener("animationend", handler);
}

// One complete animation cycle
function runAnimationCycle() {
  // Step 1: Update BW image only
  currentIndex = (currentIndex + 1) % imageSets.length;
  updateBWImage(currentIndex);
  bwImage.style.opacity = "1";

  // Step 2: Reverse animation
  startAnimation(false, () => {
    // Step 3: Wait 4s
    setTimeout(() => {
      // Step 4: Update color image
      updateColorImage(currentIndex);

      // Step 5: Forward animation
      startAnimation(true, () => {
        // Step 6: Wait 5s, then repeat cycle
        setTimeout(() => {
          runAnimationCycle();
        }, 5000);
      });
    }, 4000); // wait after reverse
  });
}

// Initial setup + first animation only
window.addEventListener("load", () => {
  updateBWImage(currentIndex);
  updateColorImage(currentIndex);

  setTimeout(() => {
    // First forward animation
    startAnimation(true, () => {
      setTimeout(() => {
        runAnimationCycle(); // start the loop AFTER first forward is done
      }, 5000);
    });
  }, 2000);
});
