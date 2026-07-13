// ===== DantSetu landing page — entry point =====
//
// Each interaction lives in its own focused module (single responsibility).
// This file only wires them up: to add a feature, create a module that
// exports `init()` and add it to the list below — no existing feature needs
// to change (open/closed). Each `init()` is isolated so one feature failing
// can't take the rest of the page down with it.
//
// Loaded as `type="module"`, so it's deferred automatically — the DOM is
// ready by the time these run.

import * as footerYear from "./features/footerYear.js";
import * as themeToggle from "./features/themeToggle.js";
import * as mobileNav from "./features/mobileNav.js";
import * as scrollReveal from "./features/scrollReveal.js";
import * as statCounters from "./features/statCounters.js";
import * as demoForm from "./features/demoForm.js";

const features = [
  footerYear,
  themeToggle,
  mobileNav,
  scrollReveal,
  statCounters,
  demoForm,
];

for (const feature of features) {
  try {
    feature.init();
  } catch (err) {
    console.error("DantSetu: a feature failed to initialize", err);
  }
}
