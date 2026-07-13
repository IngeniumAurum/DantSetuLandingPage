# DantSetu Landing Page

Marketing landing page for **DantSetu** — the multi-clinic operating system for
modern dental practices (the product behind the `smile_smartly` Flutter app).

It's a static site (no build step): plain HTML, CSS and vanilla JavaScript.

## Structure

```
index.html          # page markup (nav, hero, features, roles, steps, testimonials, CTA, footer)
css/styles.css      # styles — brand colors mirror the app theme
js/main.js          # mobile nav, scroll reveals, stat counters, demo-form validation
assets/img/         # hero photo goes here (see assets/img/README.md)
```

## Run it

No tooling required — open `index.html` in a browser, or serve the folder:

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
