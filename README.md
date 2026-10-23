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
| Display type | **owner's cut** | One supplied 600-weight grotesque, oversized and tight-tracked |
| Structure | **Vercel** | Hairline rules, mono micro-labels, stark grid |
| Depth | **Linear** | Near-black `#16150f` panels, one accent used sparingly |

Type: **one supplied typeface**, self-hosted as `assets/fonts/orlean.woff2` and
used for every role — display, body, labels and numerals. It is a single 600
weight with no italic, so hierarchy comes from size, tracking and colour, and
emphasis inside a sentence is carried by ink colour. `DESIGN.md` §8 records what
the file actually is and the licence position; the system sans is the fallback.

## What's inside

- One hand-written page: hero, capability index, selected work, process, about,
  quote, FAQ and contact.
- No build step, no framework, no CDN. Plain HTML, CSS and vanilla JS.
- Project covers (SAIF FLIX, Arif Mia, Renata PLC) drawn entirely in CSS, so they
  retint in dark mode and there is nothing to break.
- Light and dark themes, following the system preference and remembered in
  `localStorage`.
- Responsive to 320px, keyboard accessible, honours `prefers-reduced-motion` and
  forced-colors, and every target is at least 24 × 24 px.
- SEO: metadata, Open Graph/Twitter card, `Person` and `FAQPage` JSON-LD.
- Verified with axe-core (WCAG 2.0/2.1/2.2 A + AA, plus best-practice):
  **0 violations in both themes**.

## Audit

The page was reviewed against the 500 checks in `fix500.pdf` and the result is
recorded in [`AUDIT.md`](AUDIT.md) — 16 defects fixed, 9 behaviours verified,
and every non-applicable category listed with its reason. The design context and
asset provenance live in [`DESIGN.md`](DESIGN.md).

Highlights of that pass: a real pause control for the ticker (WCAG 2.2.2), a type
scale with an 11 px floor (it previously reached 7.4 px), 24 × 24 minimum touch
targets, `aria-current` on the navigation, tabular numerals, and removal of the
arrow "buttons" that made non-clickable capability rows look clickable.

## Resilience

Pages on this site degrade gracefully rather than breaking:

- **Critical CSS is inlined** in `<head>`, so the page is always styled even if
  the stylesheet request fails (stale cache, flaky network, CDN hiccup).
- **Reveal animations are progressive enhancement.** Content is visible by
  default; `main.js` adds the `.motion` class only after its
  `IntersectionObserver` is confirmed working. A blocked or crashed script can
  never leave the page blank, and blocks are never hidden before they are
  revealed — so the page cannot flash content out on load.
- **Assets are cache-busted** (`?v=...`) so a bad response can't survive a
  deploy. Bump the query string whenever you edit `style.css` or `main.js`.
- **`.nojekyll`** is present so Pages serves files verbatim, skipping Jekyll.

If a deploy ever looks unstyled, hard-refresh (`Ctrl/Cmd + Shift + R`) — you are
almost certainly seeing a cached response from mid-deploy.

## Structure

```
index.html
AUDIT.md      review record against the 500 checks
DESIGN.md     design context, tokens, asset provenance
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
