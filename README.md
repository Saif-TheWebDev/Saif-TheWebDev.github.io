# Saif-TheWebDev.github.io

Personal portfolio for **Saif Al Jahan** — full-stack developer & web designer
(Mymensingh, Bangladesh), built as a static GitHub Pages site.

Content is adapted from [webdev-saif.com](https://webdev-saif.com).

## Design system

**Swiss editorial × independent studio**, built on the owner's eight-swatch
palette. A centred "Dynamic Island" header, an asymmetric editorial hero
(*Websites with intention. Built to perform.*), the work moved directly under
the hero in three different compositions, an accordion of four services, a
four-step process, a typographic About band, one real client quote, a native
FAQ, and a contact section with a real form beside the email address.

| Layer | Source | Contribution |
|---|---|---|
| Composition | Swiss editorial / studio sites | Strict margins, hairline rules instead of cards, one display face at poster scale, asymmetric grids |
| Colour | **owner's eight swatches** | Warm ivory `#f7f5f0`, ink `#191817`, burnt terracotta `#b64024`; accent only for actions and one clause per headline |
| Type | **Inter 4.x variable** (OFL, self-hosted) | Display 600 / body 400 / label 500 / data 450 — rank from weight and scale |
| Header | A floating capsule | Content-width, translucent, hairline border, tightens on scroll, active-section dot, one solid CTA |
| Motion | GSAP + Lenis | Masked line reveals, `power3.out`, transform/opacity only; content paints before it animates |
| Work | Three plates | Full-width lead, image/content flip, full-bleed concept — each with real facts and a live link |

Full rationale, tokens, component rules and provenance: **`DESIGN.md`**.
What was tested and what still needs the owner: **`AUDIT.md`** §10.

## What's inside

- One hand-written page — hero, selected work, services, process, about, quote,
  FAQ, contact — plus three case-study pages under `work/`.
- No build step, no framework, no CDN. Plain HTML, CSS and vanilla JS.
- Project plates, glow fields and every icon drawn in CSS/SVG, so they retint
  with the theme and there is nothing to break or 404.
- A real inquiry form that either posts to a configured endpoint or composes a
  mail draft — never a fake success.
- Ivory and dark themes behind one toggle, remembered in `localStorage` and
  resolved before first paint so there is no flash.
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

- **Critical CSS is inlined** in `<head>` — tokens, type, loader shell, header,
  hero and icon sizing — so a failed stylesheet request (stale cache, flaky
  network, CDN hiccup) still gives a composed ivory page, not unstyled soup.
- **Reveal animations are progressive enhancement.** Content is visible by
  default; `main.js` adds the `.motion` class only after its
  `IntersectionObserver` is confirmed working. A blocked or crashed script can
  never leave the page blank, and blocks are never hidden before they are
  revealed — so the page cannot flash content out on load.
- **The preloader counts 0 → 100 in 2.5 s** on a fixed clock — no network
  gating, no `sessionStorage` split — then lifts 160 ms later. It cannot strand
  anyone: the inline failsafe lifts the curtain at 1.2 s only if the number is
  still untouched (which means `main.js` never ran), the stylesheet carries a
  later escape, and reduced motion skips it before first paint.
- **Assets are cache-busted** (`?v=...`) so a bad response can't survive a
  deploy. Bump the query string whenever you edit `style.css` or `main.js`
  (currently `20261024s`).
- **GSAP is optional.** It is a `defer` script with no preload and no inline
  dependency; with `assets/vendor/gsap/*` blocked by request interception the
  hero renders in its final state and the process rail falls back to the rAF
  scroll handler.
- **`.nojekyll`** is present so Pages serves files verbatim, skipping Jekyll.

If a deploy ever looks unstyled, hard-refresh (`Ctrl/Cmd + Shift + R`) — you are
almost certainly seeing a cached response from mid-deploy.

## Contact form

The form in `#contact` works with **no configuration**: it validates, then
opens a `mailto:` draft with the brief filled in. To collect submissions
server-side instead, set one attribute on the form in `index.html`:

```html
<form class="inq" id="inquiry" data-endpoint="https://formspree.io/f/XXXXXXX" …>
```

Any endpoint that accepts a JSON `POST` works (Formspree, Getform, Basin, a
Cloudflare Worker). No key is embedded in the page and nothing is sent until
someone submits. Without JavaScript, the email link is the path.

## Case studies

`/work/arif-mia.html`, `/work/saif-flix.html` and `/work/renata-plc.html` are
static pages on the same design system, generated from one shell so they cannot
drift apart:

```bash
python3 tools/build-case-studies.py   # rewrites the three files in place
```

Edit the data at the bottom of that script, not the generated HTML.

## Structure

```
index.html
work/              arif-mia.html, saif-flix.html, renata-plc.html
tools/             build-case-studies.py (generates work/*.html)
sitemap.xml, robots.txt
AUDIT.md           review record + test results
DESIGN.md          design context, tokens, asset provenance
assets/
  css/style.css, case.css
  js/main.js
  fonts/inter-*.woff2, LICENSE-Inter.txt
  img/favicon.svg, og-image.jpg
  vendor/gsap/gsap.min.js, ScrollTrigger.min.js, NOTICE.md
  vendor/lenis/lenis.min.js, LICENSE.txt, NOTICE.md
```

## Screenshots

No screenshots of the three client/demo sites are included. The build
environment cannot reach `arifmia.com`, `saif-flix.webdev-saif.com` or
`plc.webdev-saif.com`, and drawing a fake interface was not an option. Each
project uses a typographic plate built from verifiable facts; when real
captures exist, they drop into `.plate` without a layout change.

## Testing

The browser checks live outside the repo (Puppeteer + `@sparticuz/chromium`,
axe-core) and run against a local `python3 -m http.server`. The premium-redesign
pass covered 12 widths from 320 to 2560 px, axe in light/dark/mobile/tablet
(0 violations), the three case pages at 390/768/1440, anchor offsets, theme
persistence, form validation, `prefers-reduced-motion`, reduced loader timing,
and LCP/CLS with and without 4G throttling. Results are in
[`AUDIT.md`](AUDIT.md) §10.

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
