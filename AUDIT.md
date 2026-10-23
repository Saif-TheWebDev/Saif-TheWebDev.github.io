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
