// Page loader — hide once everything is ready. Keeps a short minimum
// on-screen beat so the tooth animation reads as intentional, with a hard
// cap so it can never get stuck. The <head> also removes `is-loading` on a
// timeout as an independent failsafe if this module never runs.

import { prefersReducedMotion } from "../utils/env.js";

const MIN_SHOW_MS = 700;
const HARD_CAP_MS = 2500;
const FADE_MS = 600;

export function init() {
  const root = document.documentElement;
  const shownAt = Date.now();
  const minShow = prefersReducedMotion() ? 0 : MIN_SHOW_MS;
  let done = false;

  const hide = () => {
    if (done) return;
    done = true;
    const wait = Math.max(0, minShow - (Date.now() - shownAt));
    setTimeout(() => {
      root.classList.remove("is-loading");
      const loader = document.getElementById("loader");
      if (loader) setTimeout(() => loader.remove(), FADE_MS);
    }, wait);
  };

  if (document.readyState === "complete") hide();
  else window.addEventListener("load", hide);
  setTimeout(hide, HARD_CAP_MS);
}
