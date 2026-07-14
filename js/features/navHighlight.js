// Highlight the nav link whose section is currently in view.

import { qsa } from "../utils/dom.js";
import { observeVisibility } from "../utils/observer.js";

export function init() {
  const anchors = qsa('.nav__links a[href^="#"]').filter(
    (a) => !a.classList.contains("btn")
  );
  const sections = anchors
    .map((a) => document.querySelector(a.getAttribute("href")))
    .filter(Boolean);
  if (!sections.length) return;

  observeVisibility(
    sections,
    (section, isVisible) => {
      if (!isVisible) return;
      anchors.forEach((a) =>
        a.classList.toggle("is-active", a.getAttribute("href") === `#${section.id}`)
      );
    },
    // "reveal everything" is meaningless for highlighting, so skip the
    // no-IntersectionObserver fallback and simply leave links unstyled.
    { fallback: false, observer: { rootMargin: "-30% 0px -60% 0px" } }
  );
}
