document.addEventListener("DOMContentLoaded", () => {
  const dragHint = document.querySelector(".drag-hint");
  const tapHint = document.querySelector(".tap-hint");
  let showDrag = true;

  setInterval(() => {
    if (showDrag) {
      dragHint.classList.remove("active");
      tapHint.classList.add("active");
    } else {
      tapHint.classList.remove("active");
      dragHint.classList.add("active");
    }
    showDrag = !showDrag;
  }, 3500); // switch every 3.5s
});
