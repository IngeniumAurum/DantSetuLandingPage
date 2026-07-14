// 3D tilt on the hero screenshot with a glare highlight that tracks the
// pointer. Hover-only flourish: skipped for coarse pointers and reduced-motion.

import { prefersReducedMotion, finePointer } from "../utils/env.js";

const MAX_DEG = 7;

export function init() {
  const device = document.getElementById("heroDevice");
  if (!device || !finePointer() || prefersReducedMotion()) return;

  let raf = null;

  device.addEventListener("pointermove", (e) => {
    if (raf) return; // coalesce to one update per frame
    raf = requestAnimationFrame(() => {
      const rect = device.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      device.classList.add("is-tilting");
      device.style.transform =
        `perspective(1100px) rotateX(${(-py * MAX_DEG).toFixed(2)}deg) ` +
        `rotateY(${(px * MAX_DEG).toFixed(2)}deg) scale(1.012)`;
      device.style.setProperty("--gx", `${((px + 0.5) * 100).toFixed(1)}%`);
      device.style.setProperty("--gy", `${((py + 0.5) * 100).toFixed(1)}%`);
      raf = null;
    });
  });

  device.addEventListener("pointerleave", () => {
    device.classList.remove("is-tilting");
    device.style.transition = "transform .6s cubic-bezier(.16,1,.3,1)";
    device.style.transform = "perspective(1100px) rotateX(0deg) rotateY(0deg) scale(1)";
    setTimeout(() => {
      device.style.transition = "";
    }, 600);
  });
}
