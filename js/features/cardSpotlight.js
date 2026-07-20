// Cursor-following spotlight + gentle 3D tilt on feature cards — feeds
// --mx/--my (spotlight position) and --rx/--ry (tilt angles) to the CSS.
// Hover-only flourish: skipped for coarse pointers and reduced-motion.

import { qsa } from "../utils/dom.js";
import { prefersReducedMotion, finePointer } from "../utils/env.js";

const MAX_DEG = 3.5;

export function init() {
  if (!finePointer() || prefersReducedMotion()) return;

  qsa(".card").forEach((card) => {
    card.addEventListener("pointermove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty("--mx", `${x}px`);
      card.style.setProperty("--my", `${y}px`);
      card.style.setProperty("--rx", `${(-(y / rect.height - 0.5) * MAX_DEG).toFixed(2)}deg`);
      card.style.setProperty("--ry", `${((x / rect.width - 0.5) * MAX_DEG).toFixed(2)}deg`);
    });

    card.addEventListener("pointerleave", () => {
      card.style.setProperty("--rx", "0deg");
      card.style.setProperty("--ry", "0deg");
    });
  });
}
