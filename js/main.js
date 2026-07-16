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

import * as pageLoader from "./features/pageLoader.js";
import * as footerYear from "./features/footerYear.js";
import * as themeToggle from "./features/themeToggle.js";
import * as headerScroll from "./features/headerScroll.js";
import * as mobileNav from "./features/mobileNav.js";
import * as navHighlight from "./features/navHighlight.js";
import * as scrollReveal from "./features/scrollReveal.js";
import * as statCounters from "./features/statCounters.js";
import * as cardSpotlight from "./features/cardSpotlight.js";
import * as heroTilt from "./features/heroTilt.js";
import * as testimonialSlider from "./features/testimonialSlider.js";
import * as demoForm from "./features/demoForm.js";
import * as pricing from "./features/pricing.js";
import * as contact from "./features/contact.js";

const features = [
  pageLoader,
  footerYear,
  themeToggle,
  headerScroll,
  mobileNav,
  navHighlight,
  scrollReveal,
  statCounters,
  cardSpotlight,
  heroTilt,
  testimonialSlider,
  demoForm,
  pricing,
  contact,
];

for (const feature of features) {
  try {
    feature.init();
  } catch (err) {
    console.error("DantSetu: a feature failed to initialize", err);
  }
}
