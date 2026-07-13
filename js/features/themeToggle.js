// Light/dark theme toggle — respects the OS preference and remembers the
// user's explicit choice across visits.

const STORAGE_KEY = "dantsetu-theme";
const root = document.documentElement;

function readStoredTheme() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved === "dark" || saved === "light" ? saved : null;
  } catch {
    return null; // storage can throw (private mode, disabled cookies)
  }
}

function storeTheme(theme) {
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    /* non-fatal: the toggle still works for this session */
  }
}

function currentTheme() {
  const explicit = root.getAttribute("data-theme");
  if (explicit) return explicit;
  return window.matchMedia?.("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export function init() {
  const stored = readStoredTheme();
  if (stored) root.setAttribute("data-theme", stored);

  const btn = document.getElementById("themeToggle");
  if (!btn) return;

  btn.addEventListener("click", () => {
    const next = currentTheme() === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    storeTheme(next);
  });
}
