// Mobile navigation menu — toggle open/closed and close after a link tap.

export function init() {
  const toggle = document.getElementById("navToggle");
  const links = document.getElementById("navLinks");
  if (!toggle || !links) return;

  const close = () => {
    links.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
  };

  toggle.addEventListener("click", () => {
    const open = links.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(open));
  });

  // closest("a") so taps on markup inside a link still close the menu.
  links.addEventListener("click", (e) => {
    if (e.target.closest("a")) close();
  });
}
