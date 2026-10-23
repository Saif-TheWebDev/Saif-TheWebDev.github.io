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

Four references, one layer each — chosen for what this site has to say, not
because they are fashionable:

| Layer | Reference | Reason |
|---|---|---|
| Canvas and accent | Claude — warm cream, terracotta | Reads as a studio, not a SaaS product. Warm surfaces suit portrait-less editorial pages. |
| Display type | Resend — oversized serif | The headline *is* the portfolio's main visual. A serif at 132 px carries personality that Inter cannot. |
| Structure | Vercel — hairlines, mono micro-labels, strict grid | Signals engineering discipline behind the design. |
| Depth | Linear — near-black panels | One dark contact panel gives the page a full stop and makes the email address the loudest element on the page. |

Deliberately **not** used: glassmorphism, gradient meshes, bento grids, stock
photography, generic SaaS blue.

## 3. Tokens

All tokens live at the top of `assets/css/style.css` (`:root` and
`[data-theme="dark"]`). The same core tokens are duplicated in the inlined
critical CSS in `index.html`; keep the two in step.

**Colour**

| Role | Light | Dark |
|---|---|---|
| canvas | `#faf8f2` | `#0f0e0b` |
| canvas band | `#f2eee3` | `#15140f` |
| ink / ink-2 / muted | `#14130f` / `#3a372f` / `#5f594d` | `#f6f3ea` / `#d9d4c6` / `#aaa392` |
| accent (action, emphasis) | `#a84621` | `#e08a63` |
| panel | `#16150f` | `#1b1912` |
| rule / rule-strong | `#e3dccd` / `#cabfaa` | 14% / 30% ink |

The accent has exactly three jobs: primary action, one emphasis word per
headline, and the status dot. It is never used for body copy or decoration.

**Type**

| Role | Family | Size |
|---|---|---|
| Display (h1, h2, quote) | Instrument Serif 400 + italic | `clamp(2.4rem → 8.3rem)` |
| Editorial copy (lede, about) | Newsreader 400/500 | `clamp(1.06 → 1.28rem)` |
| UI and body | Inter 400/500/600 | 16 px base, 0.9 rem paragraphs |
| Labels and metadata | JetBrains Mono 400/500 | `--fs-label` 0.72 rem / `--fs-meta` 0.8 rem / `--fs-helper` 0.82 rem |

**Rule: no text that carries information is set below 11 px.** The old scale
bottomed out at 6.7–9.9 px, which made the footer, metadata and tags decorative
rather than readable; that was the single largest defect found in the audit.
Uppercase mono labels need tracking (0.11–0.17 em) to stay legible at 11.5 px.

Decorative exceptions: the "mini UI" inside the `aria-hidden` project covers
(`.flix-top`, `.arif-res`, `.renata-sub`) is a drawing, not text, and stays small
on purpose.

**Space and layout:** `--shell` 1340 px, `--gutter` `clamp(20px, 4.4vw, 56px)`,
section padding `clamp(74px, 8.6vw, 128px)`, bar height 78 px, `scroll-padding-top`
104 px so anchors clear the fixed bar.

**Motion:** one easing curve (`cubic-bezier(.22,1,.36,1)`), reveals at 0.75 s and
14 px, hero rise at 0.75 s. Motion explains arrival; it never delays reading.

## 4. Component rules

- **Buttons** are pills (999 px) with a 1 px border; the primary is ink-filled,
  the secondary is an outline. They must have an icon only when the action has a
  destination outside the page (arrow-mail, arrow-out).
- **Links in prose** use the `.link` style: mono, uppercase, 1 px underline, 24 px
  minimum height.
- **Cards** — there are none. Rows are separated by hairlines, and **nothing that
  is not interactive may look interactive**: no arrows, no hover lift, no accent
  bar on a non-clickable row. (The capability list originally broke this rule and
  was corrected.)
- **Ticker** is the only self-animating element and ships with a pause control.
  Any future marquee must ship with one too.
- **Navigation:** one fixed header, two labelled navs (primary, footer). The
  current section carries `aria-current`, not just an underline.
- **Focus:** 2 px accent ring at 3 px offset on every focusable element; `<main>`
  is a skip-link target and suppresses the ring on programmatic focus only.

## 5. Content rules

- Every claim, quote, number, service name and link comes from
  [webdev-saif.com](https://webdev-saif.com). Nothing is invented; when a fact is
  unknown it is left out rather than guessed.
- Demo work is labelled as demo ("Renata PLC … Demo") and never presented as
  client work.
- A figure carries its scope where the sentence allows it ("Repeat & referral
  work, to date"; "Lighthouse target 100/100" is labelled a target, not a score).
- Status text ("Available for new projects") is a statement of intent, not a
  dated promise, so it cannot go stale.

## 6. Themes and modes

Light and dark are separate token sets, not an inversion. The inline head script
resolves the theme before first paint (localStorage → system preference), so
there is no flash. `color-scheme` follows the theme so form controls and
scrollbars match. Forced-colors mode has its own small block: bars become
`CanvasText`, the active nav item gains an underline, and the ticker button keeps
its divider.

## 7. Resilience rules

- **Critical CSS is inlined** in `<head>`; the external stylesheet is an
  enhancement. A dead stylesheet must still produce a styled, readable page.
- **Content is visible by default.** `.motion` is added by JS only after the
  IntersectionObserver is wired; without JS the page is complete.
- **Cache-bust** `style.css` / `main.js` with `?v=` on every change.
- `.nojekyll` keeps Pages from touching the files.

## 8. Asset provenance

| Asset | Origin | Licence |
|---|---|---|
| `assets/fonts/*.woff2` (9 files) | Instrument Serif, Newsreader, Inter, JetBrains Mono — subset woff2, self-hosted | SIL Open Font License 1.1 |
| `assets/img/og-image.jpg` | Rendered from this page's own type and palette (1200 × 630) | Original |
| `assets/img/favicon.svg` | Hand-written SVG | Original |
| SVG icon sprite (`index.html`) | Hand-drawn paths | Original |
| Project covers | Pure CSS, no image files | Original |
| Photography, video, audio | None used | — |

No generated people, no stock photos, no third-party embeds, no tracking.

## 9. Verification

`AUDIT.md` holds the review record: what was measured, with what, and what is
still unverified.
