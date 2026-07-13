# Hero image

The hero section (`index.html` → `.hero__photo`) loads a photo from:

```
assets/img/hero-dentist.jpg
```

Drop the dental-clinic photo here with that exact filename.

## About the blur

The photo is **rendered with a heavy CSS blur** (`filter: blur(14px)` plus a
scale and a dark navy overlay — see `.hero__photo` / `.hero__overlay` in
`css/styles.css`). This is deliberate: at this blur radius **no patient or staff
faces are ever identifiable**, which is exactly the privacy behaviour we want.
The image only reads as soft colour and shape behind the headline.

If no file is present, the hero falls back to a navy → blue gradient, so the
page always looks complete. To make faces more or less soft, change the
`blur(14px)` value in `css/styles.css`.
