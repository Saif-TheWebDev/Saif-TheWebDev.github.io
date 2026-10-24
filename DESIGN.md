# DESIGN.md — Saif Al Jahan portfolio

The approved design context for this site. Later changes should extend this
file rather than contradict it.

## 1. Brief

- **Who it is for:** small businesses, professionals and founders in Bangladesh
  and abroad who need a website designed and built by one person.
- **Primary task:** judge whether this developer can design and build a site, then
  start a conversation. Every section either shows work, shows how working
  together goes, or removes a reason not to write.
- **Offer:** custom WordPress and hand-coded front ends, with SEO/AEO/GEO built
  into the build rather than sold separately.
- **Evidence available:** 20+ shipped projects, 3+ years, 95% repeat/referral
  work, three named projects with links, one client quote (Arif Mia, UAE).
- **Constraints:** static GitHub Pages, no build step, no framework, no CDN;
  one page; English only; must survive a blocked script or stylesheet.

## 2. Direction and why

Rebuilt after **mdx.so**, at the owner's request, taking the *structure* of that
site rather than its assets: one enormous display face used at almost poster
scale, soft warm glow fields behind the text, a count-up preloader, a centred
hero, an index of services, three project cards, one oversized client quote,
and a full-bleed closing call to action.

The **colour** is the owner's own eight-swatch palette, not MDX's black: a warm
ivory canvas, soft near-black ink and one burnt terracotta accent. The
composition stays MDX-shaped; the surface is paper.

| Layer | Reference | Reason |
|---|---|---|
| Composition | MDX (mdx.so) | Preloader → centred poster hero → statement → services index → work cards → process → about → quote → FAQ → full-bleed contact. Centre-aligned where the message is a slogan, left-aligned where it is evidence. |
| Colour | Owner's eight-swatch palette | Warm ivory paper rather than near-black. The accent is used on one clause per headline, never as a wash. |
| Display type | Owner-supplied single cut, poster scale | 9.2 rem at 1440 px, 0.9 leading, −0.045 em. The headline *is* the page. |
| Depth | Glow fields + 25% grid | Two blurred terracotta ellipses, tinted towards the canvas so they read as daylight, and a masked hairline grid give the flat paper depth without images. |

Deliberately **not** used: MDX's 3D/WebGL scenes, video, cursor-follow previews,
or any external asset. The site stays one static page with no dependencies —
the *composition* is borrowed, the pixels are ours.

A dark alternate is kept, derived by inverting the same eight swatches (the
palette's Primary Text becomes the canvas, its Canvas becomes the ink), because
the theme toggle was an existing promise.

## 3. Tokens

All tokens live at the top of `assets/css/style.css` (`:root` is the ivory
default, `[data-theme="dark"]` inverts it). The core tokens and the loader
shell are duplicated in the inlined critical CSS in `index.html`; keep the two
in step.

**Colour — the eight supplied swatches**

| Swatch | Hex | Token | Where it lands |
|---|---|---|---|
| Canvas / Background | `#f7f5f0` | `--bg` | page |
| Primary Text | `#191817` | `--ink` | headings, body, solid buttons |
| Signature Accent | `#b64024` | `--accent` | one clause per headline, actions, status dot, focus ring |
| Card Background | `#fffefb` | `--panel` | project cards, the ID card, the toast |
| Secondary Surface | `#e9e3d9` | `--band` | the About band |
| Secondary Text | `#716c65` | `--muted` | supporting copy, labels, metadata |
| Borders / Dividers | `#dfd9cf` | `--rule` (as 13% ink) | hairlines, rules, card outlines |
| Accent Hover | `#8f301b` | `--accent-2`, and the accent on stone | hover states, the About band |

Everything not on that list is derived from it and named as such: `--ink-2`
`#4a453e` (a step between ink and secondary), `--muted-2` `#8c867d`
(decoration only), and the rule weights (the supplied beige is too pale to
survive as a 1 px hairline over the gap-free canvas, so rules are drawn as 13%
ink, which lands on the same perceived weight).

**Dark alternate** — inverted from the same eight: canvas `#191817`, panel
`#221f1e`, band `#211f1d`, ink `#f7f5f0`, muted `#a7a199`, accent `#e0704e`.
The accent is lightened for that theme only, because `#b64024` measures 3.16:1
against `#191817` — fine as a fill, not as text.

**Contrast is measured, not eyeballed.** On the ivory canvas: ink 16.3:1,
secondary text 4.78:1, accent 5.14:1, ivory-on-accent 5.14:1. Two pairs needed
care and are documented at the token site: Secondary Text on the stone band
measures 4.08:1 and the accent on stone 4.39:1, so `.sec-band` steps both down
one notch (muted `#68625a`, accent → the palette's own Accent Hover `#8f301b`,
6.31:1). Elsewhere the swatches are used exactly as supplied.

The accent has exactly three jobs: primary action, one emphasis word per
headline, and the status dot. It is never used for body copy or decoration.

**Type**

| Role | Token | Size |
|---|---|---|
| Hero display | `--display` → `--face` | `clamp(2.85rem → 9.2rem)`, leading 0.9, tracking −0.045 em |
| Section titles, contact | `--display` → `--face` | `clamp(2rem → 4.1rem)`, leading 1, tracking −0.038 em |
| Statement, quote | `--display` → `--face` | `clamp(1.6rem → 4.6rem)`, leading 1.02–1.12 |
| Body and UI | `--sans` → `--face` | 16 px base, 0.88–1 rem paragraphs, leading 1.6–1.68 |
| Labels and metadata | `--mono` → `--face` | `--fs-label` 0.72 rem / `--fs-meta` 0.8 rem / `--fs-helper` 0.84 rem |

The role tokens survive on purpose: they all resolve to `--face`, so a future
typeface swap is one line, and each role keeps its own size and tracking.

**One weight, so rank comes from scale and colour.** The supplied file is a single
static 600 cut with no italic and no lighter companion. Everything is set at
`font-weight: 400`, which *is* that cut; headings are distinguished by size,
tracking and (for one phrase per section) the accent colour. `<strong>` is marked
by ink colour rather than a heavier stroke. Italic runs are the browser's oblique
of the same cut — an honest slant, not a second file pretending to be one.

**Rule: no text that carries information is set below 11 px.** The old scale
bottomed out at 6.7–9.9 px, which made the footer, metadata and tags decorative
rather than readable; that was the single largest defect found in the audit.
Uppercase labels take 0.10–0.14 em of tracking in this face (it was 0.11–0.18 em
for the mono), and every numeric column carries `font-variant-numeric: tabular-nums`.

Decorative exceptions: the "mini UI" inside the `aria-hidden` project covers
(`.flix-top`, `.arif-res`, `.renata-sub`) is a drawing, not text, and stays small
on purpose.

**Space and layout:** `--shell` 1320 px, `--gutter` `clamp(20px, 5vw, 64px)`,
section padding `clamp(76px, 9.4vw, 138px)`, bar height 76 px (68 px under 900),
`scroll-padding-top` bar + 24 px so anchors clear the fixed header.

**Motion:** one language, two engines that share it. CSS keeps the scroll
reveal — 0.85 s, 22 px, `cubic-bezier(.22,1,.36,1)`, staggered per block via
`--i`. GSAP (`power3.out`, 0.55–1.05 s) runs only the two places where order is
the point:

1. **Hero entrance**, built paused and released by `saif:ready` when the
   preloader lifts. Label (0.55 s) → three headline lines rising out of their
   masks (`yPercent 128 → 0`, 1.05 s, 85 ms stagger) → the italic *purpose* on
   its own beat (0.8 s, 42 % lift, 1.5° unwind) → subtitle (0.7 s) → CTAs
   (0.6 s, 75 ms stagger) → stats (0.55 s, 65 ms stagger). Total 2.49 s, and
   the loader covers the first frames so nothing is seen before it starts.
2. **Process rail**, driven by a ScrollTrigger scrub (0.5) between `top 74%`
   and `bottom 36%` of the list. It writes the same `--tp` custom property and
   `is-on` class the rAF fallback writes, so the drawing is identical whichever
   engine runs it.

GSAP is loaded from `assets/vendor/gsap/` with `defer`, never from a CDN, and is
optional: if it fails to load, is blocked, or the visitor prefers reduced
motion, `initMotion()` returns before touching anything and the CSS system
stands. Start states are set explicitly with `gsap.set()` and tweened to stated
end values — `from()` inside a paused timeline re-reads its own start state and
parks the masked lines a line-height low (found and fixed in this pass).

## 4. The preloader

Present in the markup, **shown only when scripting is available** (`.loader` is
`display: none` until `html.js`). It reports a real number: elapsed time against
a 1.25 s floor, held under 100% until `window.load` and `document.fonts.ready` have
both fired, then 100% and a 0.55 s fade. Three failure paths keep it honest:

1. `prefers-reduced-motion: reduce` → never shown.
2. `main.js` blocked at parse time → the inline failsafe in `<head>` adds
   `.loaded` after 2.2 s, and only if `main.js` never set its readiness flag.
3. `main.js` fails after parsing → `runLoader`'s watchdog calls `finish()` at
   5 s, and the stylesheet's own `loaderEscape` animation lifts the curtain at 6 s.

The markup ships in its finished state (100%, bar full) and the script rewinds it
on the first frame, so a blocked script shows a complete frame rather than a
frozen zero. It is `aria-hidden`, holds no focusable content, and is removed from
the DOM 0.7 s after it finishes. No percentage is invented and nothing is gated
behind it: the page beneath is fully rendered before the curtain lifts.

## 5. Component rules

- **Buttons** are pills (999 px); the primary is ink-filled, the secondary an
  outline. The icon states the destination: an out-arrow leaves the page, a
  down-arrow scrolls within it, a mail icon opens the client, a right-arrow moves
  to a later section.
- **Links in prose** use the `.link` style: uppercase, 0.13 em tracked, 1 px
  underline, 24 px minimum height.
- **Cards** exist only for the three projects, and every card is one `<a>`: art,
  title, description and tags are inside the link, so the whole block is one
  target and one tab stop. The hover scrim repeats information that is already
  visible underneath it — on touch, where there is no hover, it is removed.
- **Rows that are not links stay plain.** The services list is interactive (each
  row is a link to the contact block), the process list is not, and the two do
  not share a hover treatment. Nothing that is not interactive may look
  interactive.
- **Marquee** is the only self-animating element and ships with a real pause
  control (2.2.2). It clones its set until the track covers the viewport, and
  travels exactly one set width, so there is no gap at the loop point at any
  viewport from 320 to 2560 px.
- **Navigation:** one fixed header, two labelled navs (primary, footer). The
  current section carries `aria-current`, not just an underline.
- **Focus:** 2 px accent ring at 3 px offset on every focusable element; `<main>`
  is a skip-link target and suppresses the ring on programmatic focus only.
- **Work** is one featured case study and two equal secondary cards, not three
  equal tiles. The featured art is a drawn product mock (browser chrome, URL
  pill, nav, poster line, a shelf of five stills) so the largest block on the
  page is about the project rather than a gradient. Numbers are set in the
  metadata row, top-aligned with the CTA.
- **Services and FAQ** are native `<details>`: open, close and keyboard
  behaviour exist with no script. One panel animates at a time with the Web
  Animations API and all other panels snap closed; the plus/minus is a drawn SVG
  and rotates rather than swapping glyphs.
- **The header inverts** (`is-inverse`) while it overlaps `.about-band`, so the
  pale translucent bar never floats across the dark section. Each theme defines
  its own inverse token set; the band flips to paper in the dark theme, so the
  rule follows the band, not the theme.

## 6. Content rules

- Every claim, quote, number, service name and link comes from
  [webdev-saif.com](https://webdev-saif.com). Nothing is invented; when a fact is
  unknown it is left out rather than guessed.
- Demo work is labelled as demo ("Renata PLC … Demo") and never presented as
  client work.
- A figure carries its scope where the sentence allows it ("Repeat & referral
  work, to date"; "Lighthouse target 100/100" is labelled a target, not a score).
- Status text ("Available for new projects") is a statement of intent, not a
  dated promise, so it cannot go stale.

## 7. Themes and modes

**Ivory is the default** — the supplied palette's canvas — and the dark
alternate is the deliberate inverse, not an afterthought. (Earlier revisions of
this document said dark was the default; the palette round reversed that.) The inline head
script resolves the stored theme before first paint, so there is no flash, and
`color-scheme` follows it so form controls and scrollbars match. Forced-colors
mode has its own block: glow fields are removed, borders become `CanvasText`, the
outlined display word switches from text-stroke to a 20% canvas text so it stays
visible, and the loader and progress bars paint in `Highlight`.

## 8. Resilience rules

- **Critical CSS is inlined** in `<head>`: tokens, type, the loader shell, the
  header, hero and icon sizing. The external stylesheet is an enhancement, so a
  dead stylesheet still produces an ivory, composed, readable page rather than
  default-blue-link soup with full-bleed SVG icons.
- **Content is visible by default.** `.motion` is added by JS only after the
  IntersectionObserver is wired; the hero's line-rise only exists under `html.js`.
  Without JS the page is complete, the counters show their final numbers, and the
  preloader never appears.
- **The preloader cannot strand the page.** Three independent escapes (inline
  timeout, script watchdog, stylesheet animation) each resolve it.
- **Cache-bust** `style.css` / `main.js` with `?v=` on every change (currently
  `20261024i`). GSAP files are versioned by folder contents, not by query.
- `.nojekyll` keeps Pages from touching the files.

## 9. Asset provenance

| Asset | Origin | Licence |
|---|---|---|
| `assets/fonts/orlean.woff2` (1 file, 100 KB) | The owner's upload (`orlean.md`, 435 KB TrueType) converted to woff2 with fontTools. Its name table identifies it as **SF Pro Display Semibold**, v13.0d3e20, Apple — 2,324 glyphs, `usWeightClass 600`, `fsType 4`, no `fvar`, no italic. Published at the owner's explicit instruction after the mismatch was raised. | **Not openly licensed.** Apple's own name record points to the iOS Software License Agreement; `fsType 4` permits preview/print embedding only. Self-hosting it on a public site is outside those terms. |
| `assets/img/og-image.jpg` | Rendered from this page's own type and palette (1200 × 630) | Original |
| `assets/img/favicon.svg` | Hand-written SVG | Original |
| SVG icon sprite (`index.html`) | Hand-drawn paths | Original |
| Project covers | Pure CSS (gradients, one repeating hairline), no image files | Original |
| Glow fields, grid, grain | CSS radial gradients + an inline SVG noise data-URI | Original |
| `assets/vendor/gsap/gsap.min.js`, `ScrollTrigger.min.js` (v3.15.0, 73 + 45 KB) | npm `gsap` 3.15.0 tarball, copied verbatim | GreenSock standard licence — free for this use; banner kept in both files, provenance in `NOTICE.md` |
| Photography, video, audio | None used | — |

No generated people, no stock photos, no third-party embeds, no tracking.

## 10. Verification

`AUDIT.md` holds the review record: what was measured, with what, and what is
still unverified. The redesign pass is recorded in §9 of that file — axe-core 0
violations in light, dark and mobile; no horizontal overflow from 320 to
2560 px; all targets ≥ 24 px; a measured contrast sweep with no failures in
either theme; and the no-JS, blocked-GSAP and reduced-motion states checked by
running them, not assumed.
