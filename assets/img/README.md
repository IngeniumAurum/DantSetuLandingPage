# Hero image

The hero section (`index.html` → `.hero__photo`) loads a photo from:

```
assets/img/hero-dentist.jpg
```

Drop the dental-clinic photo here with that exact filename.

A generated clinical placeholder ships at this path so the hero looks complete
out of the box — replace it with your real photo (same filename).

## About the blur

The photo is rendered with a **CSS blur** (`filter: blur(9px)` plus a slight
scale and a translucent navy overlay — see `.hero__photo` / `.hero__overlay` in
`css/styles.css`). At this radius the clinic scene stays clearly readable while
faces are no longer identifiable. To sharpen it, lower the value (`~5px`); to
obscure faces even more, raise it (`~12–14px`).

If no file is present, the hero falls back to a navy → blue gradient, so the
page always looks complete.
