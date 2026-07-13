// ===== DantSetu landing page interactions =====
(function () {
  "use strict";

  // Current year in footer
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Theme toggle — respects OS preference, remembers the user's choice
  var root = document.documentElement;
  var themeBtn = document.getElementById("themeToggle");
  try {
    var saved = localStorage.getItem("dantsetu-theme");
    if (saved === "dark" || saved === "light") root.setAttribute("data-theme", saved);
  } catch (e) {}
  function currentTheme() {
    var attr = root.getAttribute("data-theme");
    if (attr) return attr;
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  if (themeBtn) {
    themeBtn.addEventListener("click", function () {
      var next = currentTheme() === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      try { localStorage.setItem("dantsetu-theme", next); } catch (e) {}
    });
  }

  // Mobile nav toggle
  var toggle = document.getElementById("navToggle");
  var links = document.getElementById("navLinks");
  if (toggle && links) {
    toggle.addEventListener("click", function () {
      var open = links.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
    });
    // Close the menu after tapping a link
    links.addEventListener("click", function (e) {
      if (e.target.tagName === "A") {
        links.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  // Reveal-on-scroll: mark sections, then animate in
  var revealTargets = document.querySelectorAll(
    ".section__head, .card, .step, .quote, .roles__copy, .roles__list li, .cta__copy, .cta__form, .stat"
  );
  revealTargets.forEach(function (el) { el.classList.add("reveal"); });

  // Directional entrances for the side-by-side roles block
  var rolesCopy = document.querySelector(".roles__copy");
  if (rolesCopy) rolesCopy.classList.add("reveal--left");

  // Stagger children within a group so a row cascades instead of popping at once
  function stagger(selector) {
    document.querySelectorAll(selector).forEach(function (group) {
      Array.prototype.forEach.call(group.children, function (child, i) {
        if (child.classList.contains("reveal")) child.style.setProperty("--i", i);
      });
    });
  }
  stagger(".cards");             // feature + testimonial cards
  stagger(".steps");             // how-it-works
  stagger(".roles__list");       // role rows
  stagger(".stats__grid");       // stat tiles
  stagger(".showcase__grid");    // device mockups
  stagger(".statement .container"); // big statement lines

  if ("IntersectionObserver" in window) {
    // Toggle both ways so elements animate out when scrolled past and
    // animate back in when scrolled to again (forward *and* backward).
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
        } else {
          entry.target.classList.remove("is-visible");
        }
      });
    }, { threshold: 0.15, rootMargin: "0px 0px -8% 0px" });
    revealTargets.forEach(function (el) { io.observe(el); });
  } else {
    revealTargets.forEach(function (el) { el.classList.add("is-visible"); });
  }

  // Animated stat counters
  var counters = document.querySelectorAll(".stat__num[data-count]");
  function runCounter(el) {
    var target = parseInt(el.getAttribute("data-count"), 10) || 0;
    var suffix = el.getAttribute("data-suffix") || "";
    var start = null;
    var duration = 1200;
    function tick(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }
  if ("IntersectionObserver" in window && counters.length) {
    var co = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          runCounter(entry.target);
          co.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(function (el) { co.observe(el); });
  } else {
    counters.forEach(function (el) {
      el.textContent = el.getAttribute("data-count") + (el.getAttribute("data-suffix") || "");
    });
  }

  // Demo form: client-side validation + friendly confirmation
  var form = document.getElementById("demoForm");
  var note = document.getElementById("formNote");
  if (form && note) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var name = form.name.value.trim();
      var email = form.email.value.trim();
      var emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

      if (!name || !emailOk) {
        note.textContent = "Please add your name and a valid work email.";
        note.className = "form__note err";
        return;
      }
      note.textContent = "Thanks, " + name.split(" ")[0] + "! We'll reach out to book your demo.";
      note.className = "form__note ok";
      form.reset();
    });
  }
})();
