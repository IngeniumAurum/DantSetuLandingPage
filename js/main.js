// ===== DantSetu landing page interactions =====
(function () {
  "use strict";

  var prefersReducedMotion =
    window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Page loader — hide once everything is ready (short beat so the tooth
  // animation reads as intentional, hard cap so it can never get stuck)
  (function () {
    var shownAt = Date.now();
    var minShow = prefersReducedMotion ? 0 : 700;
    var done = false;
    function hideLoader() {
      if (done) return;
      done = true;
      var wait = Math.max(0, minShow - (Date.now() - shownAt));
      setTimeout(function () {
        document.documentElement.classList.remove("is-loading");
        var loader = document.getElementById("loader");
        if (loader) setTimeout(function () { loader.remove(); }, 600);
      }, wait);
    }
    if (document.readyState === "complete") hideLoader();
    else window.addEventListener("load", hideLoader);
    setTimeout(hideLoader, 2500);
  })();

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

  // Header: elevate with a border + shadow once the page scrolls
  var header = document.getElementById("siteHeader");
  function onScrollHeader() {
    if (header) header.classList.toggle("is-scrolled", window.scrollY > 8);
  }
  onScrollHeader();
  window.addEventListener("scroll", onScrollHeader, { passive: true });

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
      if (e.target.closest("a")) {
        links.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  // Highlight the nav link of the section currently in view
  var navAnchors = Array.prototype.filter.call(
    document.querySelectorAll('.nav__links a[href^="#"]'),
    function (a) { return !a.classList.contains("btn"); }
  );
  var sections = navAnchors
    .map(function (a) { return document.querySelector(a.getAttribute("href")); })
    .filter(Boolean);
  if ("IntersectionObserver" in window && sections.length) {
    var activeObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        navAnchors.forEach(function (a) {
          a.classList.toggle("is-active", a.getAttribute("href") === "#" + entry.target.id);
        });
      });
    }, { rootMargin: "-30% 0px -60% 0px" });
    sections.forEach(function (s) { activeObserver.observe(s); });
  }

  // Stagger children within a group so a row cascades instead of popping at once
  function stagger(selector) {
    document.querySelectorAll(selector).forEach(function (group) {
      var i = 0;
      Array.prototype.forEach.call(group.children, function (child) {
        if (child.classList.contains("reveal")) child.style.setProperty("--i", i++);
      });
    });
  }
  stagger(".cards");
  stagger(".steps");
  stagger(".pricing");
  stagger(".roles__list");
  stagger(".stats__grid");
  stagger(".showcase__points");
  stagger(".statement .container");

  // Directional entrance for the side-by-side roles block
  var rolesCopy = document.querySelector(".roles__copy");
  if (rolesCopy) rolesCopy.classList.add("reveal--left");

  // Reveal-on-scroll (once per element — steadier than toggling back and forth)
  var revealTargets = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !prefersReducedMotion) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
    revealTargets.forEach(function (el) { io.observe(el); });
  } else {
    revealTargets.forEach(function (el) { el.classList.add("is-visible"); });
  }

  // Animated stat counters
  var counters = document.querySelectorAll(".stat__num[data-count]");
  function finalText(el) {
    return el.getAttribute("data-count") + (el.getAttribute("data-suffix") || "");
  }
  function runCounter(el) {
    var target = parseInt(el.getAttribute("data-count"), 10) || 0;
    var suffix = el.getAttribute("data-suffix") || "";
    var start = null;
    var duration = 1400;
    function tick(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }
  if ("IntersectionObserver" in window && !prefersReducedMotion && counters.length) {
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
    counters.forEach(function (el) { el.textContent = finalText(el); });
  }

  // Cursor-following spotlight on feature cards (feeds --mx/--my to CSS)
  var finePointer = window.matchMedia && window.matchMedia("(pointer: fine)").matches;
  if (finePointer && !prefersReducedMotion) {
    document.querySelectorAll(".card").forEach(function (card) {
      card.addEventListener("pointermove", function (e) {
        var rect = card.getBoundingClientRect();
        card.style.setProperty("--mx", (e.clientX - rect.left) + "px");
        card.style.setProperty("--my", (e.clientY - rect.top) + "px");
      });
    });
  }

  // 3D tilt on the hero screenshot with a glare highlight tracking the pointer
  var heroDevice = document.getElementById("heroDevice");
  if (heroDevice && finePointer && !prefersReducedMotion) {
    var raf = null;
    heroDevice.addEventListener("pointermove", function (e) {
      if (raf) return;
      raf = requestAnimationFrame(function () {
        var rect = heroDevice.getBoundingClientRect();
        var px = (e.clientX - rect.left) / rect.width - 0.5;
        var py = (e.clientY - rect.top) / rect.height - 0.5;
        heroDevice.classList.add("is-tilting");
        heroDevice.style.transform =
          "perspective(1100px) rotateX(" + (-py * 7).toFixed(2) + "deg) rotateY(" + (px * 7).toFixed(2) + "deg) scale(1.012)";
        heroDevice.style.setProperty("--gx", ((px + 0.5) * 100).toFixed(1) + "%");
        heroDevice.style.setProperty("--gy", ((py + 0.5) * 100).toFixed(1) + "%");
        raf = null;
      });
    });
    heroDevice.addEventListener("pointerleave", function () {
      heroDevice.classList.remove("is-tilting");
      heroDevice.style.transition = "transform .6s cubic-bezier(.16,1,.3,1)";
      heroDevice.style.transform = "perspective(1100px) rotateX(0deg) rotateY(0deg) scale(1)";
      setTimeout(function () { heroDevice.style.transition = ""; }, 600);
    });
  }

  // Testimonial slider: snap scrolling with arrows, paged dots and drag
  (function () {
    var track = document.getElementById("quoteTrack");
    var prev = document.getElementById("quotePrev");
    var next = document.getElementById("quoteNext");
    var dotsWrap = document.getElementById("quoteDots");
    if (!track || !prev || !next || !dotsWrap) return;

    function pageWidth() { return track.clientWidth; }
    function pageCount() {
      return Math.max(1, Math.ceil((track.scrollWidth - track.clientWidth) / pageWidth()) + 1);
    }
    function currentPage() {
      return Math.round(track.scrollLeft / pageWidth());
    }

    var dots = [];
    function buildDots() {
      dotsWrap.innerHTML = "";
      dots = [];
      var n = pageCount();
      for (var i = 0; i < n; i++) {
        var b = document.createElement("button");
        b.type = "button";
        b.setAttribute("role", "tab");
        b.setAttribute("aria-label", "Go to testimonials page " + (i + 1));
        (function (idx) {
          b.addEventListener("click", function () {
            track.scrollTo({ left: idx * pageWidth(), behavior: prefersReducedMotion ? "auto" : "smooth" });
          });
        })(i);
        dotsWrap.appendChild(b);
        dots.push(b);
      }
      update();
    }
    function update() {
      var page = currentPage();
      dots.forEach(function (d, i) { d.classList.toggle("is-active", i === page); });
      var max = track.scrollWidth - track.clientWidth;
      prev.disabled = track.scrollLeft <= 2;
      next.disabled = track.scrollLeft >= max - 2;
    }
    function go(dir) {
      track.scrollBy({ left: dir * pageWidth(), behavior: prefersReducedMotion ? "auto" : "smooth" });
    }
    prev.addEventListener("click", function () { go(-1); });
    next.addEventListener("click", function () { go(1); });
    track.addEventListener("scroll", function () { requestAnimationFrame(update); }, { passive: true });
    window.addEventListener("resize", buildDots);

    // Drag-to-scroll with the mouse (touch scrolls natively)
    var dragging = false, startX = 0, startScroll = 0, moved = false;
    track.addEventListener("pointerdown", function (e) {
      if (e.pointerType !== "mouse") return;
      dragging = true; moved = false;
      startX = e.clientX; startScroll = track.scrollLeft;
    });
    window.addEventListener("pointermove", function (e) {
      if (!dragging) return;
      var dx = e.clientX - startX;
      if (Math.abs(dx) > 4) {
        moved = true;
        track.classList.add("is-dragging");
      }
      if (moved) track.scrollLeft = startScroll - dx;
    });
    window.addEventListener("pointerup", function () {
      if (!dragging) return;
      dragging = false;
      if (moved) {
        // settle onto the nearest page
        var page = Math.round(track.scrollLeft / pageWidth());
        track.classList.remove("is-dragging");
        track.scrollTo({ left: page * pageWidth(), behavior: prefersReducedMotion ? "auto" : "smooth" });
      }
    });

    buildDots();
  })();

  // Demo form: client-side validation + friendly confirmation
  var form = document.getElementById("demoForm");
  var note = document.getElementById("formNote");
  if (form && note) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var name = form.name.value.trim();
      var email = form.email.value.trim();
      var phone = form.phone.value.trim();
      var emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      var phoneOk = /^\+?[0-9][0-9\s\-()]{8,14}$/.test(phone);

      if (!name || !emailOk) {
        note.textContent = "Please add your name and a valid work email.";
        note.className = "form__note err";
        return;
      }
      if (!phoneOk) {
        note.textContent = "Please add a valid mobile number so we can reach you.";
        note.className = "form__note err";
        return;
      }
      note.textContent = "Thanks, " + name.split(" ")[0] + "! We'll reach out to book your demo.";
      note.className = "form__note ok";
      form.reset();
    });
  }
})();
