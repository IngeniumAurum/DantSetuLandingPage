// Reading-progress bar along the bottom edge of the sticky header.
// Feeds --progress (0..1) to the CSS scaleX.

export function init() {
  const bar = document.getElementById("scrollProgress");
  if (!bar) return;

  let raf = null;

  const update = () => {
    raf = null;
    const doc = document.documentElement;
    const max = doc.scrollHeight - window.innerHeight;
    const progress = max > 0 ? Math.min(1, window.scrollY / max) : 0;
    bar.style.setProperty("--progress", progress.toFixed(4));
  };

  const request = () => {
    if (!raf) raf = requestAnimationFrame(update);
  };

  update();
  window.addEventListener("scroll", request, { passive: true });
  window.addEventListener("resize", request, { passive: true });
}
