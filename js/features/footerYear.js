// Keeps the footer copyright year current.

export function init() {
  const el = document.getElementById("year");
  if (el) el.textContent = String(new Date().getFullYear());
}
