// Reveal-on-scroll animations. Reveal targets are authored with the
// `reveal` class in the markup; this staggers grouped children, then
// reveals each element once as it enters the viewport.

import { qs, qsa } from "../utils/dom.js";
import { observeVisibility } from "../utils/observer.js";
import { prefersReducedMotion } from "../utils/env.js";

// Groups whose children should cascade in one after another instead of
// popping in all at once. Add a selector here to stagger a new group (OCP).
const STAGGER_GROUPS = [
  ".cards",
  ".steps",
  ".pricing",
  ".roles__list",
  ".stats__grid",
  ".showcase__points",
  ".statement .container",
];

function markStagger(selector) {
  qsa(selector).forEach((group) => {
    let i = 0;
    Array.from(group.children).forEach((child) => {
      if (child.classList.contains("reveal")) child.style.setProperty("--i", i++);
    });
  });
}

export function init() {
  const targets = qsa(".reveal");
  if (!targets.length) return;

  STAGGER_GROUPS.forEach(markStagger);

  // Directional entrance for the side-by-side roles block.
  qs(".roles__copy")?.classList.add("reveal--left");

  // Honour reduced-motion: show everything immediately, no animation.
  if (prefersReducedMotion()) {
    targets.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  // Reveal once per element — steadier than toggling back and forth.
  observeVisibility(
    targets,
    (el, isVisible) => {
      if (isVisible) el.classList.add("is-visible");
    },
    { once: true, observer: { threshold: 0.12, rootMargin: "0px 0px -6% 0px" } }
  );
}
