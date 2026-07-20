// Scroll-driven 3D perspective on the hero screenshot: the device rests
// tilted back and straightens as it scrolls toward the middle of the
// viewport. Feeds --tilt (1 = fully tilted, 0 = flat) to the CSS.

import { prefersReducedMotion } from "../utils/env.js";

export function init() {
  const stage = document.getElementById("heroStage");
  if (!stage || prefersReducedMotion()) return;

  let raf = null;

  const update = () => {
    raf = null;
    const rect = stage.getBoundingClientRect();
    const vh = window.innerHeight;
    // 1 while the stage sits low in the viewport, easing to 0 once its top
    // reaches ~22% from the top of the screen.
    const progress = (rect.top - vh * 0.22) / (vh * 0.55);
    const tilt = Math.min(1, Math.max(0, progress));
    stage.style.setProperty("--tilt", tilt.toFixed(4));
  };

  const request = () => {
    if (!raf) raf = requestAnimationFrame(update);
  };

  update();
  window.addEventListener("scroll", request, { passive: true });
  window.addEventListener("resize", request, { passive: true });
}
