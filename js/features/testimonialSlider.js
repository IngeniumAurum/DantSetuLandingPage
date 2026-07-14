// Testimonial slider: snap scrolling with arrows, paged dots and mouse drag
// (touch scrolls natively).

import { prefersReducedMotion } from "../utils/env.js";

export function init() {
  const track = document.getElementById("quoteTrack");
  const prev = document.getElementById("quotePrev");
  const next = document.getElementById("quoteNext");
  const dotsWrap = document.getElementById("quoteDots");
  if (!track || !prev || !next || !dotsWrap) return;

  const behavior = () => (prefersReducedMotion() ? "auto" : "smooth");
  const pageWidth = () => track.clientWidth;
  const pageCount = () =>
    Math.max(1, Math.ceil((track.scrollWidth - track.clientWidth) / pageWidth()) + 1);
  const currentPage = () => Math.round(track.scrollLeft / pageWidth());

  let dots = [];

  const update = () => {
    const page = currentPage();
    dots.forEach((d, i) => d.classList.toggle("is-active", i === page));
    const max = track.scrollWidth - track.clientWidth;
    prev.disabled = track.scrollLeft <= 2;
    next.disabled = track.scrollLeft >= max - 2;
  };

  const buildDots = () => {
    dotsWrap.innerHTML = "";
    dots = [];
    const n = pageCount();
    for (let i = 0; i < n; i++) {
      const b = document.createElement("button");
      b.type = "button";
      b.setAttribute("role", "tab");
      b.setAttribute("aria-label", `Go to testimonials page ${i + 1}`);
      b.addEventListener("click", () =>
        track.scrollTo({ left: i * pageWidth(), behavior: behavior() })
      );
      dotsWrap.appendChild(b);
      dots.push(b);
    }
    update();
  };

  const go = (dir) => track.scrollBy({ left: dir * pageWidth(), behavior: behavior() });

  prev.addEventListener("click", () => go(-1));
  next.addEventListener("click", () => go(1));
  track.addEventListener("scroll", () => requestAnimationFrame(update), { passive: true });
  window.addEventListener("resize", buildDots);

  // Drag-to-scroll with the mouse (touch scrolls natively).
  let dragging = false;
  let startX = 0;
  let startScroll = 0;
  let moved = false;

  track.addEventListener("pointerdown", (e) => {
    if (e.pointerType !== "mouse") return;
    dragging = true;
    moved = false;
    startX = e.clientX;
    startScroll = track.scrollLeft;
  });
  window.addEventListener("pointermove", (e) => {
    if (!dragging) return;
    const dx = e.clientX - startX;
    if (Math.abs(dx) > 4) {
      moved = true;
      track.classList.add("is-dragging");
    }
    if (moved) track.scrollLeft = startScroll - dx;
  });
  window.addEventListener("pointerup", () => {
    if (!dragging) return;
    dragging = false;
    if (moved) {
      // settle onto the nearest page
      const page = Math.round(track.scrollLeft / pageWidth());
      track.classList.remove("is-dragging");
      track.scrollTo({ left: page * pageWidth(), behavior: behavior() });
    }
  });

  buildDots();
}
