  document.addEventListener("DOMContentLoaded", () => {
    const els = Array.from(document.querySelectorAll(".text-scroll-appear"));
    const HALF_WINDOW = 0.35;
    const entries = els.map(el => ({ el, card: el.closest(".card") }));

    let ticking = false;

    function applyState(el, state) {
      if (el.classList.contains(state)) return;
      el.classList.remove("in-view", "out-of-view");

      el.style.animation = "none";
      void el.offsetWidth;
      el.style.animation = "";

      el.classList.add(state);
    }

    function update() {
      const vh = window.innerHeight;
      const midY = vh * 0.5;
      const radius = vh * HALF_WINDOW;

      for (const { el, card } of entries) {
        if (!card) continue;
        const r = card.getBoundingClientRect();
        const cardCenter = r.top + r.height / 2;
        const distFromCenter = Math.abs(cardCenter - midY);

        const inView = distFromCenter <= radius && r.bottom > 0 && r.top < vh;

        applyState(el, inView ? "in-view" : "out-of-view");
      }
      ticking = false;
    }

    function onScroll() {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    update();
  });