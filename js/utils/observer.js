// A single abstraction over IntersectionObserver so features depend on
// "tell me when this element becomes visible" rather than on the concrete
// API (DIP) — and the graceful no-support fallback lives in exactly one
// place instead of being copy-pasted per feature (DRY). Reused by
// scrollReveal, statCounters and navHighlight.

/**
 * Observe elements and invoke `onVisible(element, isVisible)` whenever their
 * visibility changes.
 *
 * @param {Iterable<Element>} elements  Elements to watch.
 * @param {(el: Element, isVisible: boolean) => void} onVisible  Visibility callback.
 * @param {object}  [options]
 * @param {boolean} [options.once]      Stop observing an element once it first becomes visible.
 * @param {boolean} [options.fallback]  When IntersectionObserver is missing, call
 *                                       onVisible(el, true) for every element (default true).
 *                                       Pass false for features where "reveal everything"
 *                                       is not a sensible degraded state (e.g. nav highlighting).
 * @param {IntersectionObserverInit} [options.observer]  Passed straight to IntersectionObserver.
 * @returns {IntersectionObserver|null}  The observer, or null when unsupported.
 */
export function observeVisibility(elements, onVisible, options = {}) {
  const { once = false, fallback = true, observer: observerInit = {} } = options;
  const els = Array.from(elements);

  if (!("IntersectionObserver" in window)) {
    if (fallback) els.forEach((el) => onVisible(el, true));
    return null;
  }

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      onVisible(entry.target, entry.isIntersecting);
      if (entry.isIntersecting && once) io.unobserve(entry.target);
    });
  }, observerInit);

  els.forEach((el) => io.observe(el));
  return io;
}
