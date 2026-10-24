# Review record — audited against *500 Website Design Failures*

The site was reviewed against the 500-check prevention guide in `fix500.pdf`
(20 categories, 500 numbered checks, research dated 24 October 2026). Every
check was read; the ones that can apply to a single static, hand-written page
were exercised in a real browser and fixed or verified.

**Scope:** `/` — `index.html`, `assets/css/style.css`, `assets/js/main.js`.
**Date:** 24 October 2026. **Result:** 16 defects fixed, 9 behaviours verified
as already correct, and the remaining checks recorded as not applicable below,
with a reason.

**Method** — Chromium 153 (headless, real layout engine), not screenshots alone:

| Test | How |
|---|---|
| Reflow / overflow | 320, 360, 390, 414, 600, 768, 900, 1024, 1180, 1440, 1920, 2560 px; `documentElement.scrollWidth` vs viewport, plus an unclipped-descendant scan |
| Accessibility | axe-core 4 (wcag2a, wcag2aa, wcag21a, wcag21aa, wcag22aa, best-practice) in **light and dark** → **0 violations** in both |
| Keyboard | tabbed through all 37 focusables; checked ring visibility, sticky-header occlusion, focus order and skip link |
| Text spacing (WCAG 1.4.12) | 1.4.12 override values injected together at 390 px and 320 px |
| Targets (WCAG 2.5.8) | every `a`/`button`/`summary` bounding box at 390 px |
| Themes | toggle, reload persistence, system preference, `color-scheme`, forced-colors emulation |
| Motion | `prefers-reduced-motion` emulation, print emulation, animation play state |
| Resilience | three runs with `main.js` blocked, `style.css` blocked, and both blocked |
| Semantics | CDP accessibility tree: names, roles, landmarks, heading outline |
| Behaviour | menu open/Escape/focus return, one-open FAQ, copy + toast, ticker pause/resume |

---

## 1. Defects found and fixed

Severity follows the guide's own labels: a blocker stops a task or hides
information; major means a frequent task is confusing or inconsistent; minor is
localised polish.

### Blocker / major

| Check | Observed | Fix |
|---|---|---|
| **385** — no pause for persistent moving content (WCAG 2.2.2 A) | The technology ticker scrolled for its full 42 s loop and only paused on `:hover`. Keyboard and touch users had no way to stop it. | Added a real pause/resume control in the strip: 54 × 44 px, `aria-pressed`, label and icon swap between *Pause* and *Resume*, pausing on hover **and** `:focus-within`. Hidden under reduced motion, where nothing moves. Verified: play state `running → paused → running`. |
| **128 / 136 / 146 / 370** — body and helper text set too small, metadata unreadable | 27 text styles rendered between **7.4 px and 9.9 px** — including "Reply time / Within one working day", the whole footer nav, capability tags, stat labels and the hero status line. | Introduced `--fs-label` (11.5 px), `--fs-meta` (12.8 px) and `--fs-helper` (13.1 px) tokens and raised 24 declarations. Nothing that carries information is now below **11.2 px**. Mini-UI inside the `aria-hidden` project illustrations stays small on purpose — it is a picture, not text. |
| **358** — crowded touch targets (WCAG 2.5.8 AA) | Footer nav links measured 15 px tall (FAQ only 20 px wide), "Back to top" 14 px, standalone text links 22 px. | Padding and `min-height: 24px` on nav, footer nav, footer links and `.link`. Verified: **38 of 38 targets ≥ 24 × 24** at 390 px. |
| **400 / 395** — no end state, entrance can hide content | A block skipped by a fast scroll or an anchor jump stayed at `opacity: 0` until it was scrolled back into view; the "All projects" link was still invisible after a full-page scroll. | The IntersectionObserver now uses `rootMargin: 99999px 0px -6% 0px`, so anything at or above the viewport counts as seen; the 2.5 s safety net reveals everything above the fold. Verified: after an instant jump to the end, 0 blocks remain hidden. |
| **216 / 084 / 326** — decoration that resembles a control | Each of the four capability rows carried a 38 px arrow-in-a-circle that looked like a link, with a hover state that lifted and recoloured it. The rows are not links. | Removed the arrows, the sliding accent bar and the heading shift; the rows are now plainly a list. |
| **417 / 407** — ARIA role missing but label present | `.ticker` carried `aria-label="Core technologies"` on a plain `div`, so the name was never exposed. | `role="group"`, confirmed in the accessibility tree as `group: "Core technologies"`. Cloned ticker sets stay `aria-hidden`. |

### Minor

| Check | Observed | Fix |
|---|---|---|
| **167**-class startup flash | Reveal blocks were painted at full opacity and then faded to 0 when `.motion` landed, so the page blinked on load. | The hidden state now has `transition: none` and blocks already on screen are revealed in the same frame the hidden state is switched on. Sampled 8 times after load: 0 visible blocks were ever below 0.9 opacity. |
| **437** — unused font variants | `inter-700.woff2` was shipped but never referenced; `newsreader-400-italic` had an `@font-face` that never loaded. | Deleted both (−48 KB) and added a preload for the Newsreader 400 now used above the fold. Font requests dropped to 9, one per face in use. |
| **438** — font swap movement | Body type swapped in after first paint. | Measured layout shift under 1.6 Mbps / 150 ms throttling: **CLS 0.00016** (one 0.00016 shift at 1.13 s). No fix needed beyond the preload. |
| **234** — external links unannounced | 7 links open a new tab with no indication. | Visually hidden "(opens in a new tab)" on the five content links; the two icon-only links say it in `aria-label`. |
| **226** — current location is visual only | The active nav item only had an underline. | `aria-current="true"` follows the scroll-spy and is removed from the others. |
| **139** — proportional numerals | Stat counters, years and step numbers changed width while animating. | `font-variant-numeric: tabular-nums` on stats, counters, step/cap/work numbers and metadata. |
| **175** — forced colours destroy a control | In Windows high-contrast emulation the menu button lost its bars (background fill is dropped) and the active nav item lost its only indicator. | `@media (forced-colors: active)` block: bars use `CanvasText`, active nav gains an underline, the ticker button keeps its divider. Re-checked visually. |
| **298** — figure without a denominator | "95% repeat & referral work". | Label now reads "Repeat & referral work, to date", and stat labels reserve two lines so a wrapping label cannot knock its number off the shared baseline. |
| **261 / 047** — CTA label and icon disagree | "Let's build something" opened an email client but showed an external-link glyph. | Mail icon. |
| **095** — decoration hidden behind chrome | The hero's crosshair marks were positioned at 26 px and sat under the 78 px fixed header, invisible. | Offset by `--bar-h` so they sit just below the bar, as in the other sections. |
| **122** — overflow hidden rather than fixed | `body { overflow-x: hidden }` masked any accidental bleed. | Removed; the marquee is clipped by its own `.ticker-vp`. Verified: no horizontal scrolling at any of the 12 widths, `docW === innerWidth` everywhere. |

---

## 2. Verified as already correct

- **232** — anchor links clear the fixed header: every target lands exactly **104 px** from the top against a **79 px** bar (`scroll-padding-top`).
- **405** — skip link: "Skip to content" is the first tab stop and moves focus to `<main tabindex="-1">`.
- **406 / 407** — outline and landmarks: one `h1`, no skipped levels, `header` / `nav[aria-label]` ×2 / `main` / `footer`, all 7 sections named.
- **421** — text-spacing override: at 1.5 line-height, 0.12 em letter-spacing, 0.16 em word-spacing, 2 em paragraph spacing, nothing clips and nothing overflows at 390 px or 320 px.
- **377** — reduced motion: hero rise, ticker, reveal and pulse all stop; 0 blocks hidden.
- **409 / 408** — accessible names match visible labels; the only repeated names are the header and footer links to the same in-page target.
- **419** — `lang="en"` present, single language.
- **165 / 166 / 167** — theme persists across reloads, follows the system preference, and is applied by an inline head script before first paint (no flash).
- **444 / 434** — with `main.js` blocked the page renders fully (0 hidden, counters show 20/3/95); with `style.css` blocked the inline critical CSS still gives a styled page; with both blocked, still readable.
- **096 / 203** — no shadow stack; the only elevation is the toast.

---

## 3. Not applicable, with reason

- **Forms and validation (301–325)** — the page has no form. Contact is `mailto:` plus a copy-to-clipboard button; there is nothing to validate. Clipboard success is announced through `role="status"` and the button label changes to "Copied".
- **Commerce and pricing (451–475)** — no products, cart, checkout, plans or payment. FAQ mentions how projects are quoted; no price is claimed.
- **Media (413, 414, 386, 387, 430, 449)** — no video or audio anywhere; no autoplay to pause.
- **Imagery (176–200, 428–429, 456)** — no photographs or raster media other than the social card. Project covers are CSS drawings with `aria-hidden`, so there is no stock imagery, no AI anatomy, no unlicensed asset and nothing to lazy-load.
- **Charts and data (170, 412)** — no charts. The four figures are labelled text.
- **Multi-route and stateful flows (067, 233, 236–250, 327–350, 443, 469–475)** — one route. Stateful behaviour is limited to the theme, the mobile menu, the FAQ, and the ticker, all tested.
- **Teams, branding and org identity (277, 286, 291, 292)** — one person; no logos, certificates, partner marks or staff portraits.
- **Search, pagination, archives (069, 070, 072, 238–241)** — none exist.
- **AI workflow (476–500)** — partly applicable and answered by this file plus `DESIGN.md`: decisions are recorded, assets have provenance, the build was inspected rather than accepted, and tests are reported with their limits below.

---

## 4. Limits of this review

Stated plainly, because a "verified" claim without them would be dishonest:

- Accessibility was checked with **axe-core plus a manual keyboard and accessibility-tree pass — not with a screen reader**. NVDA/JAWS/VoiceOver behaviour is inferred from the tree, not heard.
- No physical devices. Everything was measured in one real browser engine at twelve widths, with touch and mobile emulation for targets and viewport behaviour.
- Motion was verified through `prefers-reduced-motion` emulation and computed styles, not by watching a full scroll on a low-end phone.
- Performance numbers (CLS 0.00016, LCP ≈ 0.13 s) are **lab measurements on localhost with throttling** — they are not field data and should not be quoted as such.
- Colour contrast was measured by axe against computed styles; the grain overlay and the translucent header were not modelled by the checker.
- English only; no RTL or localisation review.

## 5. Re-running the checks

```bash
# serve the site
python3 -m http.server 4173

# then, from a folder with puppeteer-core, @sparticuz/chromium and axe-core:
#   - reflow + orphan scan     base.js
#   - keyboard, targets, 1.4.12, print, reduced motion   test2.js
#   - reveal/flash/resilience matrix                     test4.js
#   - axe (light + dark), interactions, copy, perf       test5.js
```

---

## 6. Addendum — single-typeface rebuild (2026-10-24)

At the owner's instruction the four families (Instrument Serif, Newsreader, Inter,
JetBrains Mono — nine files) were replaced with **one** supplied cut across every
role, and the type scale was retuned for it. What that changed, and what was
re-verified afterwards:

- **One font request** on load (was nine). `assets/fonts/orlean.woff2`, 100 KB,
  preloaded, `font-display: swap`.
- **Checks 126/127/146** — one family, four roles, no competing voice. Sizes were
  re-derived rather than scaled: h1 `clamp(2.55rem → 7.1rem)` at 0.94 leading and
  −0.038 em; section titles `clamp(1.95rem → 3.45rem)`; body 15–16 px at 1.62–1.64
  leading. Nothing informational dropped below 11 px, and every numeral column
  carries `tabular-nums`.
- **Defect found while retuning:** the contact panel's "Copy address" `<button>`
  had no background reset, so near-white panel ink sat on the UA's white button
  face — an invisible label that axe had classed as *incomplete*, not a violation.
  Fixed with `background: transparent` on `.btn-ghost`.
- **Defect found while retuning:** the hero's accent period (`.hero-title b`) was
  painted twice, as a black dot beside the coral one, because it was set to
  `1.06em` on a `line-height: 0` box. Normalised to `1em` / `inherit`.

Re-run after the change, same harness:

| Check | Result |
|---|---|
| axe-core, light · dark · mobile 390 | 0 violations |
| Reflow, 320 → 2560 px | `document.scrollWidth === clientWidth` at all 13 widths |
| Targets under 24 × 24 | 0 (was 0) |
| Text-spacing override (1.4.12) | no clipping, no horizontal scroll |
| Keyboard focus | 31/31 focusables show a 2 px ring |
| Reduced motion | ticker and hero animations `none` |
| Print | hero visible, bar hidden |
| 320 px menu | opens to 390 × 780, Escape closes and returns focus |
| CLS / LCP (localhost, unthrottled) | 0.0008 / 172 ms |

Still open, unchanged from §4: these are lab numbers, not field data, and the
typeface's licence position is recorded rather than resolved.

---

## 7. Addendum — MDX-style rebuild (2026-10-24)

The page was rebuilt to the composition of mdx.so: preloader, centred poster
hero on glow fields, statement, services index, three project cards, process,
about, oversized quote, FAQ, full-bleed contact. Real content and links were
carried over unchanged; nothing was invented to fill the new layout.

### The preloader

| Requirement | How it is met | Verified |
|---|---|---|
| Honest number | Elapsed time vs a 1.5 s floor, capped at 90% until `load` **and** `document.fonts.ready`, then 100% | Observed climbing 16 → 67 → 100 |
| Never blocks content | Page beneath is fully rendered; curtain only fades | No-JS and blocked-JS captures both show the full page |
| Cannot strand anyone | 4 s inline timeout · 5 s script watchdog · 6 s CSS escape | Script blocked at request level: `loaded` true, hero visible, loader opacity 0 |
| Not in the reading order | `aria-hidden="true"`, no focusable content, removed from DOM after 0.9 s | DOM check |
| Reduced motion | Never rendered | `prefers-reduced-motion` emulation: loader display `none`, phrases not run |

### Re-verified after the rebuild

| Check | Result |
|---|---|
| axe-core — dark · light · 390 px | **0 violations** (was 1: footer note at 3.85:1, fixed to `--muted`) |
| Reflow, 320 → 2560 px, 13 widths | `documentElement.scrollWidth === clientWidth` at every width |
| Contrast, measured off computed styles | body 10.6:1, labels 6.1:1, headings 16.9:1 — all ≥ 4.5:1 |
| Targets under 24 × 24 | 0 (footer nav links were 19 px tall, now 24) |
| Keyboard focus | 41/41 focusables show a ring |
| Text spacing (1.4.12) | no clipping, no horizontal scroll |
| Reduced motion | marquee, aura drift, hero rise and reveals all off; pause button hidden |
| Print | header and loader hidden, hero lines untransformed, URLs printed |
| Forced colours | glows removed, strokes become `CanvasText`, progress in `Highlight` |
| No JS | loader absent, 0 hidden reveals, counters read 20/3/95, width 1440 |
| No CSS | loader absent, 0 hidden reveals, page composed and readable |
| Marquee | fills the viewport at 320/390/768/1440/2560 with no gap at the loop; pauses on demand |
| Mobile 390 | menu opens 390 × 776, Escape closes and returns focus; 0 small targets |
| CLS / LCP (localhost) | 0.00064 / 232 ms |

### Defects found during this round

1. **Loader rendered with JS disabled** — the curtain existed in CSS regardless of
   whether the script that dismisses it could run. Now `.loader` is `display: none`
   until `html.js`.
2. **Footer note at 3.85:1** — `--muted-2` used for text that carries meaning.
3. **Footer nav links 19 px tall** — below the 24 px target minimum.
4. **Hover scrim stuck on for touch** — `(hover: none)` showed a gradient over the
   project art with nothing to reveal. Removed; the caption below already carries it.
5. **Marquee gap at 1440 px** — two sets were narrower than the window, so the loop
   point showed a hole. Now cloned to fit and travelling exactly one set width.
6. **Icons full-bleed without CSS** — the sprite had no sizing in the critical CSS.

## 8. Palette round — the eight supplied swatches

The owner supplied eight swatches (ivory canvas, near-black ink, burnt
terracotta accent, card white, warm stone, muted charcoal, beige border, deep
rust) and asked for them to be used. They define a *light* surface, so the ivory
now is the default and the dark theme became the derived alternate.

| Check | Result |
|---|---|
| axe-core — ivory · dark · 390 px | **0 violations** |
| Contrast, computed with alpha compositing, both themes | **0 failures** — ink 16.3:1, secondary 4.78:1, accent 5.14:1, ivory-on-accent 5.14:1 |
| Reflow, 320 → 2560 px, 13 widths | `scrollWidth === clientWidth` at every width |
| Targets under 24 × 24 | 0 |
| Keyboard focus | 41/41 visible focusables (the 42nd is the mobile menu button, `display: none` on desktop; it shows a 2 px ring at 390 px) |
| Text spacing (1.4.12) | no horizontal scroll; only the decorative footer wordmark overflows its own clipped box |
| Reduced motion · print · forced colours | unchanged, all pass |
| No JS · no CSS · blocked JS | loader absent/self-resolving, 0 hidden reveals, hero visible |
| Theme toggle | `data-theme` flips, `theme-color` meta follows (`#f7f5f0` ↔ `#191817`), label updates, choice persisted |
| CLS (localhost) | 0.00062 |

### Two pairs that needed care

1. **Secondary text on the stone band** — `#716C65` on `#E9E3D9` measures 4.08:1,
   under AA. The exact swatch is kept on canvas and card (4.78:1 / 5.16:1); only
   inside `.sec-band` is it stepped to `#68625A` (4.72:1).
2. **Accent on the stone band** — `#B64024` on `#E9E3D9` measures 4.39:1. Inside
   the band the accent becomes the palette's own Accent Hover `#8F301B` (6.31:1).

Both are scoped to the band, so the eight swatches are used exactly as supplied
on every other surface. `DESIGN.md` §3 records the mapping.

### Also changed

- The inlined critical CSS now carries both token sets, so a returning visitor
  with a stored dark theme gets the right colour on the very first paint.
- The preloader, its hairline, the theme button icons and the `theme-color` meta
  all read from tokens instead of the old dark literals.
- The footer wordmark outline moved to the heavier hairline — at 13% ink on ivory
  it was all but invisible.
- The OG card and favicon were re-rendered in the new palette.

## 9. Redesign pass — phases 2–11 (2026-10-24)

The site was modified in place against the thirteen-phase brief, not rebuilt.
Content, routes, metadata, JSON-LD, the fixed headline strings and the eight
palette swatches were treated as frozen.

### What changed, section by section

| Section | Change |
|---|---|
| Hero | Masked line containers, `clamp(2.85rem → 9.2rem)` display, *purpose* in accent italic, restrained radial field (aura opacity 0.34), clear primary/secondary CTA hierarchy, 2 × 2 stats on mobile |
| Featured work | Artwork rebuilt as a drawn product mock inside the existing `<a>` — browser chrome, URL pill, live dot, nav, poster line and a five-still shelf — on a `16 / 7.9` frame; metadata row regridded so number, copy and CTA line up |
| Services | Native `<details>` accordion, numbers, capability tags, drawn plus/minus, one panel open at a time, WAAPI height animation with a reduced-motion short circuit |
| Process | Horizontal timeline on desktop with a scroll-drawn connector and sequential `is-on` states, vertical rail under 900 px, no pinning |
| About | Dark band using the palette's own ink, asymmetric two-column desktop / single column mobile, identity card, no terminal or code decoration |
| Quote | Real Arif Mia quote kept; measure widened 22 → 26 ch |
| FAQ | Same native accordion language as services, divider spacing, keyboard-complete |
| Contact / footer | "Let's build something that lands." with the accent on *that lands.*, oversized outlined wordmark, three-column metadata, copy-address button with a live toast |
| Header | Inverts to the band's tokens while it overlaps `.about-band` |

### Defects found and fixed in this pass

| Defect | Evidence | Fix |
|---|---|---|
| Featured artwork read as an empty red-black gradient | Element screenshot of `.feature` at 1192 px | Rebuilt as the product mock above; verified by element screenshot, not by eye at page scale |
| Featured mock cramped at desktop width | Same shot: 690 × 430 art with the title pushed off-centre | `16 / 7.9`, metadata regridded, mock type re-clamped |
| Pale sticky header floated across the dark About band | `f-about.png` at 1440 px | `.bar.is-inverse` token sets for both themes, toggled from the band's `getBoundingClientRect()` |
| Hero rail label measured 3.31:1 | Computed-style sweep, light theme, 10 px uppercase | Colour moved from `--muted-2` to `--muted` → 4.78:1 |
| GSAP hero lines parked one line-height below the mask | Computed transform `matrix(1,0,0,1,0,131.871)` after the timeline reported progress 1 | Start states set with `gsap.set()` and every percentage tween pins `y: 0`; layout flushed before measuring. Documented in `DESIGN.md` §3 |
| Orphan `.feature-badge` rules after the badge was removed | `grep` on both files | Both the desktop rule and its mobile override deleted; brace count 477/477 |

### Re-verified by running it

| Check | Method | Result |
|---|---|---|
| axe-core 4.10 (wcag2a/aa, wcag21a/aa, best-practice) | Real Chromium, light / dark / 390 px | **0 violations** in all three |
| Reflow | 320, 360, 390, 414, 600, 768, 900, 1024, 1180, 1280, 1440, 1920, 2560 | `scrollWidth === clientWidth` at every width |
| Contrast | Computed foreground over composited background for every text node, both themes | 0 failures (hero rail was the only one) |
| Targets (2.5.8) | Every `a`, `button`, `summary` | 0 below 24 × 24 |
| Focus | Tabbed through all 43 focusables | Ring present on every one (the 3 "missing" in the programmatic probe are `.link` elements, which pass under real keyboard focus) |
| No JS | `main.js` blocked | Hero at final state, 0 hidden `.reveal`, 1 service panel open, no overflow |
| GSAP blocked | `vendor/gsap/*` aborted | Hero at final state (`transform: none`), rail falls back to rAF (`--tp: 0` at top) |
| Reduced motion | `prefers-reduced-motion: reduce` | No loader, no clip-path masks, no transform; process rail fully drawn (`--tp: 1`, 4/4 steps on) |
| Console | Full pass, both themes, mobile | 0 errors, 0 page errors |
| Motion | Frames at 300–4400 ms across the loader lift | Hero completes in order; `.about-band` inverts the bar |

### Limits

- No real project screenshots exist, so the covers stay CSS drawings; they are
  labelled as demos where relevant.
- Testing was Chromium-only. Firefox and Safari have not been run for this
  pass.
- No field data: LCP/INP/CLS are reasoned about (defer scripts, no layout
  thrash, reserved media boxes), not measured under throttling.
- The desktop magnetic hover exists only for fine pointers with hover
  capability; headless Chromium reports `hover: none`, so it was exercised by
  stubbing the media query and dispatching real pointer events (±5 px measured,
  clean release), not in a real cursor environment.
