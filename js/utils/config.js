// Loads the regional config (`js/data/pricing.json`) that drives both the
// country-based pricing and the country-based contact details. Memoised so the
// several features that need it share a single fetch per page load. Resolves to
// the parsed object, or `null` if the file is unreachable or invalid — callers
// treat null as "keep the static HTML fallback".

const CONFIG_URL = new URL("../data/pricing.json", import.meta.url);

let pending = null;

export function loadConfig() {
  if (!pending) {
    pending = fetch(CONFIG_URL)
      .then((res) => (res.ok ? res.json() : null))
      .catch(() => null);
  }
  return pending;
}
