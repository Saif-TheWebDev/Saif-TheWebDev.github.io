# Saif-TheWebDev.github.io

Personal portfolio for **Saif Al Jahan** — full-stack developer & web designer
(Mymensingh, Bangladesh), built as a static GitHub Pages site.

Content is adapted from [webdev-saif.com](https://webdev-saif.com).

## Design system

The visual language is a synthesis of four references from *The Design Reference
Collection* (`design.pdf`), each contributing one layer:

| Layer | Reference | Contribution |
|---|---|---|
| Canvas & accent | **Claude** | Warm cream `#faf8f2`, coral accent, ink `#14130f` |
| Display type | **Resend** | Oversized serif headlines at tight leading |
| Structure | **Vercel** | Hairline rules, mono micro-labels, stark grid |
| Depth | **Linear** | Near-black `#16150f` panels, one accent used sparingly |

Type: **Instrument Serif** for display, **Newsreader** for editorial body copy,
**Inter** for UI, **JetBrains Mono** for labels and metadata — all self-hosted.

## What's inside

- One hand-written page: hero, capability index, selected work, process, about,
  quote, FAQ and contact.
- No build step, no framework, no CDN. Plain HTML, CSS and vanilla JS.
- Project covers (SAIF FLIX, Arif Mia, Renata PLC) drawn entirely in CSS, so they
  retint in dark mode and there is nothing to break.
- Light and dark themes, following the system preference and remembered in
  `localStorage`.
- Responsive to 320px, keyboard accessible, honours `prefers-reduced-motion`.
- SEO: metadata, Open Graph/Twitter card, `Person` and `FAQPage` JSON-LD.
- Verified with axe-core: **0 WCAG 2.1 AA violations** in both themes.

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

```bash
python3 -m http.server 4173
# open http://localhost:4173
```

## Deploying

This is a GitHub Pages user site, so merging to `main` publishes it at
<https://saif-thewebdev.github.io/>. No build or config needed.

## Editing

Copy lives in `index.html`, grouped by section comments
(`<!-- ═══════════ WORK ═══════════ -->` etc.). Colour, type and spacing tokens
sit at the top of `assets/css/style.css`.

To swap the CSS covers for real screenshots, drop images into `assets/img/` and
replace the `.work-art` span inside each `.work-row` with an `<img>`.
