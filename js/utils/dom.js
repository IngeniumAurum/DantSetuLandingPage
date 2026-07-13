// Tiny DOM helpers shared across features — one place to change if the
// querying strategy ever needs to (e.g. scoping, polyfills).

/** Query the first matching element within a scope (defaults to document). */
export const qs = (selector, scope = document) => scope.querySelector(selector);

/** Query all matching elements as a real array (map/filter/forEach friendly). */
export const qsa = (selector, scope = document) =>
  Array.from(scope.querySelectorAll(selector));
