// Single source of truth for the environment/user-preference queries that
// several features gate their motion on. Reading them here (rather than
// re-writing matchMedia in every module) keeps the checks consistent and
// makes intent obvious at the call site.

/** True when the user has asked the OS to minimise motion. */
export const prefersReducedMotion = () =>
  window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;

/** True for a precise pointer (mouse/trackpad) — gates hover-only flourishes. */
export const finePointer = () =>
  window.matchMedia?.("(pointer: fine)").matches ?? false;
