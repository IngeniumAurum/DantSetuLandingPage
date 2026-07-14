// Cursor-following spotlight on feature cards — feeds --mx/--my to the CSS.
// Hover-only flourish: skipped for coarse pointers and reduced-motion.

import { qsa } from "../utils/dom.js";
import { prefersReducedMotion, finePointer } from "../utils/env.js";

export function init() {
  if (!finePointer() || prefersReducedMotion()) return;

  qsa(".card").forEach((card) => {
    card.addEventListener("pointermove", (e) => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty("--mx", `${e.clientX - rect.left}px`);
      card.style.setProperty("--my", `${e.clientY - rect.top}px`);
    });
  });
}
