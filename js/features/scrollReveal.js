// Reveal-on-scroll animations: mark targets, stagger their children, then
// toggle visibility as they enter/leave the viewport.

import { qs, qsa } from "../utils/dom.js";
import { observeVisibility } from "../utils/observer.js";

const REVEAL_SELECTOR =
  ".section__head, .card, .step, .quote, .roles__copy, .roles__list li, .cta__copy, .cta__form, .stat";

// Groups whose children should cascade in one after another instead of
// popping in all at once. Add a selector here to stagger a new group (OCP).
const STAGGER_GROUPS = [
  ".cards", // feature + testimonial cards
  ".steps", // how-it-works
  ".roles__list", // role rows
  ".stats__grid", // stat tiles
  ".showcase__grid", // device mockups
  ".statement .container", // big statement lines
];

function markStagger(selector) {
  qsa(selector).forEach((group) => {
    Array.from(group.children).forEach((child, i) => {
      if (child.classList.contains("reveal")) child.style.setProperty("--i", i);
    });
  });
}

export function init() {
  const targets = qsa(REVEAL_SELECTOR);
  if (!targets.length) return;

  targets.forEach((el) => el.classList.add("reveal"));

  // Directional entrance for the side-by-side roles block.
  qs(".roles__copy")?.classList.add("reveal--left");

  STAGGER_GROUPS.forEach(markStagger);

  // Toggle both ways so elements animate out when scrolled past and back in
  // when scrolled to again (forward *and* backward).
  observeVisibility(
    targets,
    (el, isVisible) => el.classList.toggle("is-visible", isVisible),
    { observer: { threshold: 0.15, rootMargin: "0px 0px -8% 0px" } }
  );
}
