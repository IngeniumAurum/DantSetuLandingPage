# Hero image

The hero section (`index.html` → `.hero__photo`) loads a photo from:

```
assets/img/hero-dentist.jpg
```

Drop the dental-clinic photo here with that exact filename.

A generated clinical placeholder ships at this path so the hero looks complete
out of the box — replace it with your real photo (same filename).

## About the blur

The photo is rendered with a **light CSS blur** (`filter: blur(5px)` plus a
slight scale and a translucent navy overlay — see `.hero__photo` /
`.hero__overlay` in `css/styles.css`). At this radius the image stays clearly
visible while faces are still softened. To hide faces completely again, raise
the `blur(5px)` value (≈`12–14px`); to sharpen it, lower it.

If no file is present, the hero falls back to a navy → blue gradient, so the
page always looks complete.
