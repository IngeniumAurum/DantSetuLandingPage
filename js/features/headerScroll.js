// Header: elevate with a border + shadow once the page scrolls.

export function init() {
  const header = document.getElementById("siteHeader");
  if (!header) return;

  const update = () => header.classList.toggle("is-scrolled", window.scrollY > 8);
  update();
  window.addEventListener("scroll", update, { passive: true });
}
