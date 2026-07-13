// Animated stat counters that count up once, the first time they scroll
// into view.

import { qsa } from "../utils/dom.js";
import { observeVisibility } from "../utils/observer.js";

const DURATION_MS = 1200;

function finalText(el) {
  const target = parseInt(el.getAttribute("data-count"), 10) || 0;
  return target + (el.getAttribute("data-suffix") || "");
}

function animate(el) {
  // Without requestAnimationFrame, jump straight to the final value.
  if (!window.requestAnimationFrame) {
    el.textContent = finalText(el);
    return;
  }

  const target = parseInt(el.getAttribute("data-count"), 10) || 0;
  const suffix = el.getAttribute("data-suffix") || "";
  let start = null;

  const tick = (ts) => {
    if (start === null) start = ts;
    const progress = Math.min((ts - start) / DURATION_MS, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
    el.textContent = Math.round(target * eased) + suffix;
    if (progress < 1) requestAnimationFrame(tick);
  };

  requestAnimationFrame(tick);
}

export function init() {
  const counters = qsa(".stat__num[data-count]");
  if (!counters.length) return;

  observeVisibility(counters, (el, isVisible) => isVisible && animate(el), {
    once: true,
    observer: { threshold: 0.5 },
  });
}
