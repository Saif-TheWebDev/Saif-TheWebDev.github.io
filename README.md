# Saif-TheWebDev.github.io

Personal portfolio for **Saif Al Jahan** — full-stack developer & web designer
(Mymensingh, Bangladesh), built as a static GitHub Pages site.

Content is adapted from [webdev-saif.com](https://webdev-saif.com).

## Design system

Rebuilt after **[mdx.so](https://mdx.so)** — its composition, not its assets:
a count-up preloader, a centred poster hero on soft glow fields, a statement, an
index of services, three project cards, one oversized quote, and a full-bleed
closing call to action. No WebGL, no video, no external files; the structure is
borrowed and everything on screen is ours.

Colour is the **owner's eight-swatch palette**: warm ivory canvas `#f7f5f0`,
soft near-black ink `#191817`, burnt terracotta accent `#b64024`, with card,
stone, secondary-text and border swatches behind them. The full mapping is in
`DESIGN.md` §3.

| Layer | Reference | Contribution |
|---|---|---|
| Composition | **MDX** | Preloader → poster hero → statement → services → work → process → about → quote → FAQ → contact |
| Canvas | **owner's palette** | Warm ivory `#f7f5f0`, ink `#191817`, burnt terracotta `#b64024`, glow fields and a masked 25% grid |
| Display type | **owner's cut** | One supplied 600-weight grotesque at poster scale — 9.2 rem, 0.9 leading, tight tracking |
| Detail | **Vercel** | Hairline rules, tracked micro-labels, strict grid |
| Motion | **Linear / Vercel** | GSAP hero entrance with masked lines; ScrollTrigger line draw; CSS reveal for everything else |

Type: **one supplied typeface**, self-hosted as `assets/fonts/orlean.woff2` and
used for every role — display, body, labels and numerals. It is a single 600
weight with no italic, so hierarchy comes from size, tracking and colour, and
emphasis inside a sentence is carried by ink colour. `DESIGN.md` §9 records what
the file actually is and the licence position; the system sans is the fallback.

The ivory palette is the default. A dark alternate is derived by inverting the
same eight swatches and sits behind the existing toggle; the choice is
remembered in `localStorage` and resolved before first paint.

### Motion

Two engines, one language. CSS (`cubic-bezier(.22,1,.36,1)`, 0.85 s, 22 px)
handles scroll reveals. GSAP 3.15 — self-hosted in `assets/vendor/gsap/`, loaded
with `defer`, never from a CDN — handles the hero entrance (label → masked
headline lines → *purpose* → subtitle → CTAs → stats, 2.49 s total) and the
process line via ScrollTrigger. If GSAP is missing, blocked, or the visitor
prefers reduced motion, `initMotion()` never runs and the page is complete and
static. Nothing on the page depends on an animation to become visible.

### The preloader

A real progress counter, not a fake one: elapsed time against a 1.25 s floor,
held under 100% until the document and the font have both loaded, then
completion and a 0.55 s fade. It is `aria-hidden`, holds no focusable content, is removed
from the DOM afterwards, and never appears with JS off or
`prefers-reduced-motion: reduce`. Three independent failsafes lift the curtain if
anything stalls, so it can never strand the page. Details in `DESIGN.md` §4.

## What's inside

- One hand-written page: preloader, poster hero, statement, services, selected
  work, process, about, quote, FAQ and contact.
- No build step, no framework, no CDN. Plain HTML, CSS and vanilla JS.
- Project covers (SAIF FLIX, Arif Mia, Renata PLC) and every glow field drawn
  entirely in CSS, so they retint with the theme and there is nothing to break.
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
- **The preloader cannot strand anyone.** It is hidden unless `html.js`, and
  three independent escapes resolve it: a 4 s inline timeout, a 5 s watchdog in
  `main.js`, and a 6 s CSS animation. With reduced motion it is never shown.
- **Assets are cache-busted** (`?v=...`) so a bad response can't survive a
  deploy. Bump the query string whenever you edit `style.css` or `main.js`
  (currently `20261024i`).
- **GSAP is optional.** It is a `defer` script with no preload and no inline
  dependency; with `assets/vendor/gsap/*` blocked by request interception the
  hero renders in its final state and the process rail falls back to the rAF
  scroll handler.
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
  vendor/gsap/gsap.min.js, ScrollTrigger.min.js, NOTICE.md
```

## Testing

The browser checks live outside the repo (Puppeteer + `@sparticuz/chromium`,
axe-core) and are re-run against a local `python3 -m http.server`. This pass
covered 13 widths from 320 to 2560 px, axe in light/dark/mobile (0 violations),
a computed-style contrast sweep in both themes, keyboard tabbing through every
focusable, `prefers-reduced-motion`, blocked `main.js`, blocked GSAP, and
element screenshots of the featured work card. Results are in
[`AUDIT.md`](AUDIT.md) §9.

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
