// Best-effort visitor country detection, resolved in priority order so the
// most reliable signal always wins and every step degrades gracefully:
//
//   1. `?country=XX` URL override      — manual/testing, also remembered
//   2. cached result in localStorage   — avoids a network hop on repeat visits
//   3. geo-IP lookup (network)         — most accurate, but may be blocked/slow
//   4. browser locale region           — offline fallback (e.g. en-GB → GB)
//   5. caller-supplied default         — last resort, never fails
//
// Always resolves to a 2-letter ISO country code (uppercase). Never throws.

const STORAGE_KEY = "dantsetu:country";
const GEO_TIMEOUT_MS = 2500;

const clean = (code) =>
  typeof code === "string" && /^[A-Za-z]{2}$/.test(code.trim())
    ? code.trim().toUpperCase()
    : null;

const fromQuery = () => {
  try {
    return clean(new URLSearchParams(location.search).get("country"));
  } catch {
    return null;
  }
};

const fromStorage = () => {
  try {
    return clean(localStorage.getItem(STORAGE_KEY));
  } catch {
    return null;
  }
};

const remember = (code) => {
  try {
    localStorage.setItem(STORAGE_KEY, code);
  } catch {
    /* private mode / storage disabled — fine, detection still works */
  }
};

// Region subtag of the browser locale: "en-GB" → "GB", "en-IN" → "IN".
const fromLocale = () => {
  const locales = [
    ...(navigator.languages || []),
    navigator.language,
    Intl.DateTimeFormat().resolvedOptions().locale,
  ].filter(Boolean);
  for (const tag of locales) {
    const region = clean(tag.split("-")[1]);
    if (region) return region;
  }
  return null;
};

const fromNetwork = async () => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), GEO_TIMEOUT_MS);
  try {
    const res = await fetch("https://ipapi.co/country/", {
      signal: controller.signal,
    });
    if (!res.ok) return null;
    return clean((await res.text()).trim());
  } catch {
    return null; // offline, blocked, timed out — fall through to locale
  } finally {
    clearTimeout(timer);
  }
};

async function resolve(fallback) {
  const override = fromQuery();
  if (override) {
    remember(override);
    return override;
  }

  const cached = fromStorage();
  if (cached) return cached;

  const network = await fromNetwork();
  if (network) {
    remember(network);
    return network;
  }

  return fromLocale() || clean(fallback) || "IN";
}

// Memoise the in-flight lookup so multiple features (pricing, contact, …)
// calling detectCountry on the same page load share a single geo-IP request.
let pending = null;

/**
 * Resolve the visitor's country code. `fallback` is returned only when every
 * signal fails, so the caller always gets a usable value.
 */
export function detectCountry(fallback = "IN") {
  if (!pending) pending = resolve(fallback);
  return pending;
}
