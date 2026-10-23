# Saif-TheWebDev.github.io

Personal portfolio for **Saif Al Jahan** — full-stack developer & web designer
(Mymensingh, Bangladesh), built as a static GitHub Pages site.

Content is adapted from [webdev-saif.com](https://webdev-saif.com).

## What's inside

- One hand-written page: hero, stats, services, selected work, process, about,
  FAQ and contact.
- No build step, no framework, no CDN. Plain HTML, CSS and vanilla JS.
- Self-hosted fonts (Instrument Serif, Inter, JetBrains Mono) — zero third-party
  requests, so it loads instantly and respects visitors' privacy.
- Light and dark themes, following the system preference and remembered in
  `localStorage`.
- Fully responsive down to 320px, keyboard accessible, and honours
  `prefers-reduced-motion`.
- SEO basics: metadata, Open Graph/Twitter card, `Person` and `FAQPage` JSON-LD.

## Project covers

The three project covers (SAIF FLIX, Arif Mia, Renata PLC) are drawn in pure
CSS inside the page rather than loaded as images. Nothing to break, and they
retint themselves in dark mode.

To use real screenshots instead, drop them in `assets/img/` and replace the
`.cover` div inside each `.project-media` with an `<img>`.

## Structure

```
index.html
assets/
  css/style.css
  js/main.js
  fonts/*.woff2
  img/favicon.svg, og-image.jpg
```

## Local preview

Any static server works:

```bash
python3 -m http.server 4173
# then open http://localhost:4173
```

## Deploying

The repo is a GitHub Pages user site, so pushing to `main` publishes it at
<https://saif-thewebdev.github.io/>. No build or config needed.

## Editing content

All copy lives directly in `index.html` and is grouped by section comments
(`<!-- ============ WORK ============ -->` etc.). Palette, type scale and
spacing are CSS custom properties at the top of `assets/css/style.css`.
