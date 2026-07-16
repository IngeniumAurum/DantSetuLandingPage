# DantSetu Landing Page

Marketing landing page for **DantSetu** — the multi-clinic operating system for
modern dental practices (the product behind the `smile_smartly` Flutter app).

It's a static site (no build step): plain HTML, CSS and vanilla JavaScript.

## Structure

```
index.html              # page markup (nav, hero, features, roles, steps, testimonials, CTA, footer)
css/styles.css          # styles — brand colors mirror the app theme
js/main.js              # entry point — wires up the feature modules
js/features/            # one file per interaction (single responsibility)
  pageLoader.js         #   tooth loader hide/fade
  footerYear.js         #   footer copyright year
  themeToggle.js        #   light/dark theme toggle (remembers choice)
  headerScroll.js       #   header elevation on scroll
  mobileNav.js          #   mobile navigation menu
  navHighlight.js       #   active-section nav highlighting
  scrollReveal.js       #   reveal-on-scroll + stagger
  statCounters.js       #   animated stat counters
  cardSpotlight.js      #   cursor spotlight on feature cards
  heroTilt.js           #   3D tilt + glare on the hero screenshot
  testimonialSlider.js  #   testimonial carousel (arrows, dots, drag)
  demoForm.js           #   demo-form validation
  pricing.js            #   country-based pricing (renders cards from JSON)
  contact.js            #   country-based email / phone in the footer & form
js/utils/               # shared, reusable helpers
  dom.js                #   query helpers
  env.js                #   reduced-motion / pointer preference checks
  observer.js           #   IntersectionObserver abstraction (reveal, counters, nav reuse it)
  geo.js                #   best-effort visitor country detection
  config.js             #   memoised loader for js/data/pricing.json
js/data/
  pricing.json          #   prices + contact details per currency/region
assets/img/             # hero photo goes here (see assets/img/README.md)
```

The JavaScript is organised as native **ES modules**: `main.js` imports each
feature and calls its `init()`. Adding a new interaction means dropping a
module in `js/features/` and listing it in `main.js` — nothing else changes.

## Country-based pricing & contact

Pricing cards and the "Get in touch" email/phone adapt to the visitor's
country, driven entirely by `js/data/pricing.json` — no build step, no backend.

- **Data** — `pricing.json` holds a `countryToCurrency` map, per-currency
  `currencies` formatting, each plan's `prices` per currency, and a `contact`
  block (email / phone / phone-placeholder per currency, plus a `default`).
- **Detection** — `js/utils/geo.js` resolves the country in priority order:
  `?country=XX` URL override → cached choice → geo-IP lookup → browser locale →
  the `defaultCountry` in the JSON (`IN`). It never throws.
- **Progressive enhancement** — the page ships with static INR pricing and
  contact details in `index.html`. The JS only *upgrades* them; if the JSON is
  unreachable or JS is off, the static fallback stays intact.

Add a market by dropping a currency into `currencies`, mapping its countries in
`countryToCurrency`, and filling in each plan's `prices` plus the `contact`
entry. Test any market locally with e.g. `?country=US`, `?country=GB`,
`?country=AE`.

## Run it

No build step required, but because the scripts are ES modules the page must
be **served over HTTP** (browsers block module loading from `file://`):

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Hero photo & the blur

The hero displays a dental-clinic photo (`assets/img/hero-dentist.jpg`) rendered
with a **heavy CSS blur** so that no patient or staff faces are ever
identifiable — see `assets/img/README.md`. If the file is missing, the hero
falls back to a navy → blue brand gradient, so the page always looks complete.

## Brand colors

Taken from the app theme (`lib/core/theme/app_colors.dart` in `smile_smartly`):

| Token   | Hex       | Use                 |
| ------- | --------- | ------------------- |
| Navy    | `#1E3A5F` | headers, dark bg    |
| Blue    | `#3B82F6` | primary actions     |
| Amber   | `#F59E0B` | accents             |
