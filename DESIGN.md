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

**Swiss editorial × independent studio.** The page is set like a printed
portfolio: a wide margin, a strict baseline, hairline rules doing the work that
cards used to do, one display face at poster scale, and a single accent spent
only where an action or one clause of a headline needs it. Nothing is decorated
to look expensive; the hierarchy is.

The redesign (2026-10-24) replaced the earlier MDX-shaped composition — centred
poster hero, count-up loader, three similar project cards, a made-up stat row
and a scrolling technology marquee — with a page that reads as an argument:

| Layer | Now | Why |
|---|---|---|
| Header | A centred, content-width "Dynamic Island" capsule: wordmark, five links with an active dot, availability, theme switch, one solid CTA. It tightens on scroll. | Navigation as an instrument, not a browser toolbar. Content-width means it never looks like a strip of chrome. |
| Hero | Left-aligned editorial grid: eyebrow, three-line display headline *Websites with intention. Built to perform.*, support copy, two CTAs, and a side column with location, time and reply window. | Asymmetry creates an entry point. The side column answers the boring questions before they are asked. |
| Work | Moved directly under the hero. Three projects, three compositions: full-width lead plate, image/content flip, full-bleed concept. | The work is the argument; everything else is supporting evidence. |
| Motion | GSAP only, `power3.out`, masked line reveals, 12–16 px offsets, no parallax theatre. Content paints first; motion only nudges it. | Motion is punctuation. If it delays reading, it is a bug. |
| Proof | One real client quote, kept as an editorial pull-quote. The old stat wall and marquee are gone. | Numbers that cannot be verified, and a ticker of logos-style keywords, both read as noise. |
| Footer | A giant solid `SAIF AL JAHAN` wordmark, cropped by the page edge. | A closing signature, not another nav. |

Deliberately **not** used: gradient blobs as decoration, glassmorphism panels,
marquees, icon cards, invented metrics, stock photography, or any WebGL/3D.

### 2.1 What each project is

| # | Project | Type | Honesty rule |
|---|---|---|---|
| 01 | Arif Mia — arifmia.com | Client, WordPress | Only structural facts that can be checked on the live site |
| 02 | SAIF FLIX — saif-flix.webdev-saif.com | Personal product | Demo links only; no traffic or retention claims |
| 03 | Renata PLC — plc.webdev-saif.com | Independent concept | Labelled as not commissioned, no endorsement implied, on every page |

Project 03 carries the disclaimer three times: on the home plate, in its case
study lede, and again in the Outcome section.

### 2.2 Plates instead of screenshots

The build environment cannot reach the three live sites, so no real captures
exist. Rather than draw a fake browser window (which the earlier build did),
each project gets a **typographic plate** built from its own verifiable facts —
name, kind, stack, and one line of positioning. Plate and screenshot share the
same box, radius and hover, so swapping in real captures later is a one-line
change per project. The case studies say plainly that captures are pending.

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

**Type — Inter 4.x variable, self-hosted, latin subset**

The face is **Inter** (`assets/fonts/inter-latin-wght-{normal,italic}.woff2`,
OFL 1.1, `assets/fonts/LICENSE-Inter.txt`). It replaced the previous
`orlean.woff2`, which was a renamed **SF Pro Display Semibold** — Apple's
font may not be redistributed, so it was removed from the repository. Bytes
are neutral: 100.1 KB before, 100.2 KB after.

| Role | Token | Weight | Size |
|---|---|---|---|
| Display | `--display` → `--face` | `--w-display` 600 | `clamp(2.9rem → 6rem)`, leading 0.92, tracking −0.052 em |
| Section titles | `--display` | 600 | `clamp(2rem → 3.9rem)`, leading 0.98, tracking −0.042 em |
| Body and UI | `--sans` | `--w-body` 400 | 16 px base, leading 1.6, tracking −0.006 em |
| Labels and metadata | `--mono` (resolves to the same face) | `--w-label` 500 | 0.66–0.84 rem, uppercase, 0.1–0.16 em tracking |
| Data and numerals | `--display` | `--w-data` 450 | tabular numerals on every figure column |

**Four weights from one file.** The variable axis lets rank come from weight
*and* scale instead of colour alone; italic is a real italic cut, not a
synthetic oblique. `font-optical-sizing: auto` is on, so the same face holds up
at 11 px and at 12 rem.

**Rule: no information-bearing text below 11 px.** The smallest token is
0.66 rem (~10.5 px) and only for uppercase label chrome; body copy is 16 px.

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

**Scroll feel.** The page is damped, not hijacked. Lenis supplies the easing:
it writes `window.scrollTo` every frame toward a target set by the wheel, so
the real scroll position, scrollbar, keyboard, find-in-page, focus and history
all keep working — and only the *arrival* is slowed, never the distance. (Scaling
wheel travel is what makes slick pages feel broken; weight comes from damping.)

The tuning constant is `SLOW_EASE` in `main.js` (0.075, default Lenis is 0.1,
lower is slower). A 600 px wheel notch settles in roughly 0.9 s. The library is
5.3 KB gzipped, fetched after the curtain, skipped on touch-only devices and
under reduced motion, and abandons the page to native scrolling if it never
arrives. In-page links are routed through `lenis.scrollTo` with the bar height
as an offset, so they land 12 px clear of the fixed header instead of under it;
the skip link is excluded so it still jumps instantly and moves focus.

**Motion:** one language, two engines that share it. CSS keeps the scroll
reveal — 0.85 s, 22 px, `cubic-bezier(.22,1,.36,1)`, staggered per block via
`--i`. GSAP (`power3.out`, 0.55–1.05 s) runs only the two places where order is
the point:

1. **Hero entrance**, built paused and released by `saif:ready` when the
   preloader lifts. Label (0.55 s) → three headline lines rising out of their
   masks (`yPercent 128 → 0`, 1.05 s, 85 ms stagger) → the italic *purpose* on
   its own beat (0.8 s, 42 % lift, 1.5° unwind) → subtitle (0.7 s) → CTAs
   (0.6 s, 75 ms stagger) → stats (0.55 s, 65 ms stagger). Total 2.49 s, and
   the loader runs for 2.66 s, so the first ~17% of it plays under the curtain
   and the headline is already into its second line as it lifts.
2. **Process rail**, driven by a ScrollTrigger scrub (0.5) between `top 74%`
   and `bottom 36%` of the list. It writes the same `--tp` custom property and
   `is-on` class the rAF fallback writes, so the drawing is identical whichever
   engine runs it.

ScrollTrigger is **not** in the document's script tags. It is 45 KB serving one
scrub on a section three viewports down, so `main.js` appends it after
`saif:ready` (the moment the curtain lifts) and only then registers the plugin.
Until it lands — and permanently, if it never does — the rAF rail from the
plain-JS path draws the line. Measured effect: desktop long tasks dropped from
57 ms to none, and the throttled-mobile total blocking time fell by about 100 ms.

GSAP is loaded from `assets/vendor/gsap/` with `defer`, never from a CDN, and is
optional: if it fails to load, is blocked, or the visitor prefers reduced
motion, `initMotion()` returns before touching anything and the CSS system
stands. Start states are set explicitly with `gsap.set()` and tweened to stated
end values — `from()` inside a paused timeline re-reads its own start state and
parks the masked lines a line-height low (found and fixed in this pass).

## 4. The preloader

It is a fixed clock, not a guess and not a toll gate.

- **The count:** 0 → 100 in exactly 2.5 s, driven by `performance.now()` and a
  smoothstep curve, so the digits move at a readable rate the whole way rather
  than racing to 60% and appearing to stall. It is identical on a fast
  connection and a slow one. At 2.5 s it reads 100, the bar is full, and the
  curtain lifts 160 ms later — the whole beat is ≈2.66 s.
- **It is not gated on the network.** No `window.load`, no `fonts.ready`, no
  `sessionStorage`, no first-visit/repeat-visit split, and no 1.5 s ceiling: the
  last rAF frame before the deadline stops the number at 99 so 100 always means
  "finished", and a 2.56 s `setTimeout` finishes the count even if the frame
  loop is starved.
- **Failure:** the inline script lifts the curtain at 1.2 s if `main.js` never
  runs — it tests the number itself, which ships as `100` and is rewound to `0`
  by `main.js`, so a working script is never pre-empted. The stylesheet carries
  a later escape if even that does not run; reduced motion skips the loader
  before the first paint.
- The loader is `aria-hidden`, never focusable, and is removed from the DOM
  700 ms after it finishes.

## 4.1 Contact form

A real `<form>` with three states, no fake success:

1. **No endpoint configured (default).** Submitting validates the fields, then
   opens a `mailto:` draft with the brief filled in and says exactly that. It
   works on any static host with no account.
2. **`data-endpoint` set.** The form POSTs JSON to that URL and reports the
   real HTTP result — success only when the request succeeded.
3. **No JavaScript.** The email link above the form is the path; nothing is
   hidden behind the script.

Validation is hand-written so the message can be specific (name, email,
project type, description), with `aria-invalid`, `aria-describedby` and a
polite live region. A hidden honeypot field absorbs bots.

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
- **Magnetic CTA.** On fine pointers with hover, the featured card's "View the
  build" control drifts up to 7 px × 5 px toward the cursor and eases back on
  leave. Transform only, `pointerleave`-released, and skipped entirely for
  touch, reduced motion or keyboard-only visits.
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
- **The preloader cannot strand the page.** Three independent escapes (the
  1.2 s inline failsafe, which only fires when the number was never rewound;
  the stylesheet animation; and reduced motion) each resolve it.
- **Cache-bust** `style.css` / `case.css` / `main.js` with `?v=` on every change
  (currently `20261024s`). GSAP and Lenis are resolved by `main.js` against its
  own script URL, so the same file serves `/index.html` and `/work/*.html`.
- **Vendor paths are relative to the script**, not the document, or the case
  pages would request `/work/assets/vendor/…`.
- `.nojekyll` keeps Pages from touching the files.

## 9. Asset provenance

| Asset | Origin | Licence |
|---|---|---|
| `assets/fonts/inter-latin-wght-normal.woff2`, `…-italic.woff2` (48.3 KB + 51.8 KB) | npm `@fontsource-variable/inter` 5.3.0, latin subset, copied verbatim | **SIL Open Font License 1.1** — full text in `assets/fonts/LICENSE-Inter.txt`. Redistribution is permitted. |
| `assets/fonts/orlean.woff2` | **Removed 2026-10-24.** Its name table identified it as SF Pro Display Semibold (Apple, `fsType 4`), which may not be redistributed. | Deleted from the repository and the git tree. |
| `assets/img/og-image.jpg` | Rendered from this page's own type and palette (1200 × 630) | Original |
| `assets/img/favicon.svg` | Hand-written SVG | Original |
| SVG icon sprite | Hand-drawn paths | Original |
| Project plates | CSS fields, type and one inline dot pattern — no image files, no screenshots | Original |
| Glow fields, grid, grain | CSS radial gradients + an inline SVG noise data-URI | Original |
| `assets/vendor/gsap/*` (v3.15.0) | npm `gsap` 3.15.0, copied verbatim | GreenSock standard licence — free for this use; banner kept, provenance in `NOTICE.md` |
| `assets/vendor/lenis/lenis.min.js` (v1.3.27) | npm `lenis` 1.3.27, copied verbatim | MIT (darkroom.engineering); full text in `LICENSE.txt` |
| Photography, video, audio | None used | — |

No generated people, no stock photos, no third-party embeds, no tracking.
**No screenshots of client sites are included** — the build environment cannot
reach those hosts, so none were fabricated.

## 10. Verification

`AUDIT.md` holds the review record: what was measured, with what, and what is
still unverified. The redesign pass is recorded in §9 of that file — axe-core 0
violations in light, dark and mobile; no horizontal overflow from 320 to
2560 px; all targets ≥ 24 px; a measured contrast sweep with no failures in
either theme; and the no-JS, blocked-GSAP and reduced-motion states checked by
running them, not assumed.
