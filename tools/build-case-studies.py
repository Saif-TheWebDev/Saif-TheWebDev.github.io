#!/usr/bin/env python3
"""Generate the three case-study pages from one shell + per-project data.

Kept as a script so the three files cannot drift apart in head, header,
footer or markup conventions. Output is plain static HTML, committed as-is.
"""
import html
import pathlib

ROOT = pathlib.Path(__file__).resolve().parent.parent
BASE = "https://saif-thewebdev.github.io"

SHELL = """<!DOCTYPE html>
<html lang="en" data-theme="light">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="light dark">

<title>{title} — Saif Al Jahan</title>
<meta name="description" content="{desc}">
<meta name="author" content="Saif Al Jahan">
<meta id="theme-meta" name="theme-color" content="#f7f5f0">
<link rel="canonical" href="{base}/work/{slug}.html">

<meta property="og:type" content="article">
<meta property="og:site_name" content="Saif Al Jahan">
<meta property="og:title" content="{title} — Saif Al Jahan">
<meta property="og:description" content="{desc}">
<meta property="og:url" content="{base}/work/{slug}.html">
<meta property="og:image" content="{base}/assets/img/og-image.jpg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:image" content="{base}/assets/img/og-image.jpg">
<meta name="twitter:title" content="{title} — Saif Al Jahan">
<meta name="twitter:description" content="{desc}">

<link rel="icon" href="../assets/img/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="../assets/img/favicon.svg">
<link rel="preload" href="../assets/fonts/inter-latin-wght-normal.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="../assets/css/style.css?v=20261024s">
<link rel="stylesheet" href="../assets/css/case.css?v=20261024s">

<script>
  // theme before paint, same contract as the home page
  (function () {{
    var d = document.documentElement;
    d.className = 'js';
    try {{
      var t = localStorage.getItem('saif-theme');
      if (t !== 'light' && t !== 'dark') t = matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      d.setAttribute('data-theme', t);
    }} catch (e) {{}}
  }})();
</script>

<script type="application/ld+json">
{{
  "@context": "https://schema.org",
  "@type": "CreativeWork",
  "name": "{title}",
  "description": "{desc}",
  "url": "{base}/work/{slug}.html",
  "creator": {{
    "@type": "Person",
    "name": "Saif Al Jahan",
    "url": "{base}/"
  }},
  "about": "{kind}"
}}
</script>
</head>
<body class="case-page">

<svg class="sprite" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg">
  <symbol id="i-arrow" viewBox="0 0 24 24"><path d="M4 12h15M13 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></symbol>
  <symbol id="i-out" viewBox="0 0 24 24"><path d="M8 16 16 8M9.5 8H16v6.5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></symbol>
  <symbol id="i-mail" viewBox="0 0 24 24"><rect x="3" y="5.5" width="18" height="13" rx="2.4" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="m4.2 7.2 7.8 5.6 7.8-5.6" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></symbol>
  <symbol id="i-github" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.89 1.53 2.34 1.09 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.56-1.11-4.56-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02a9.6 9.6 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85v2.74c0 .27.18.58.69.48A10 10 0 0 0 12 2Z"/></symbol>
  <symbol id="i-moon" viewBox="0 0 24 24"><path d="M20.2 14.6A8.6 8.6 0 0 1 9.4 3.8a8.6 8.6 0 1 0 10.8 10.8Z" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></symbol>
  <symbol id="i-sun" viewBox="0 0 24 24"><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M12 2.6v2.2M12 19.2v2.2M2.6 12h2.2M19.2 12h2.2M5.3 5.3l1.6 1.6M17.1 17.1l1.6 1.6M18.7 5.3l-1.6 1.6M6.9 17.1l-1.6 1.6" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></symbol>
</svg>

<a class="skip" href="#main">Skip to content</a>

<header class="bar" id="bar">
  <div class="bar-in">
    <a class="mark" href="../index.html" aria-label="Saif Al Jahan — back to portfolio">Saif<span aria-hidden="true">.</span></a>

    <nav class="nav" id="nav" aria-label="Case study">
      <a href="../index.html#work">All work</a>
      <a href="../index.html#services">Services</a>
      <a href="../index.html#about">About</a>
      <a href="../index.html#contact">Contact</a>
    </nav>

    <div class="bar-r">
      <button class="icon-btn theme-btn" type="button" aria-label="Switch theme" aria-pressed="false">
        <svg class="ic ic-sun" aria-hidden="true"><use href="#i-sun"/></svg>
        <svg class="ic ic-moon" aria-hidden="true"><use href="#i-moon"/></svg>
      </button>
      <a class="bar-cta" href="../index.html#contact">
        Start a project
        <svg class="ic" aria-hidden="true"><use href="#i-arrow"/></svg>
      </a>
      <button class="icon-btn menu-btn" type="button" aria-expanded="false" aria-controls="mnav" aria-label="Open menu">
        <span class="bars" aria-hidden="true"><i></i><i></i></span>
      </button>
    </div>
  </div>
  <div class="bar-line" aria-hidden="true"><span id="progress"></span></div>

  <nav class="mnav" id="mnav" aria-label="Mobile">
    <a href="../index.html#work">All work</a>
    <a href="../index.html#services">Services</a>
    <a href="../index.html#about">About</a>
    <a href="../index.html#contact">Contact</a>
  </nav>
</header>

<main id="main" tabindex="-1">

<article>

<section class="case-hero">
  <div class="shell">
    <p class="crumb"><a href="../index.html">Saif Al Jahan</a><span aria-hidden="true">/</span><a href="../index.html#work">Work</a><span aria-hidden="true">/</span>{title}</p>

    <h1 class="case-title">{h1}</h1>
    <p class="case-lede">{lede}</p>

    {note}

    <div class="case-foot-hero">
      <span class="case-status">{status}</span>
      <div class="case-links">
        {hero_links}
      </div>
    </div>
  </div>
</section>

<section class="case-mid">
  <div class="shell">
    <dl class="facts">
      {facts}
    </dl>
  </div>
</section>

<section class="case-main">
  <div class="shell case-wrap">
    <nav class="toc" aria-label="On this page">
      <p>Contents</p>
      <ol>
        {toc}
      </ol>
    </nav>

    <div class="case-body">
      {sections}
    </div>
  </div>
</section>

<div class="shell">
  <div class="case-next">
    <a href="{next_href}">
      <span class="k">Next project</span>
      <span class="t">{next_title} <svg class="ic" aria-hidden="true" style="width:.6em;height:.6em"><use href="#i-arrow"/></svg></span>
    </a>
  </div>
</div>

</article>
</main>

<footer class="foot">
  <div class="shell foot-in">
    <a class="foot-mark" href="../index.html">Saif<span aria-hidden="true">.</span></a>
    <nav class="foot-nav" aria-label="Footer">
      <a href="../index.html#work">Work</a>
      <a href="../index.html#services">Services</a>
      <a href="../index.html#process">Process</a>
      <a href="../index.html#about">About</a>
      <a href="../index.html#contact">Contact</a>
    </nav>
    <div class="foot-social">
      <a class="icon-btn" href="https://github.com/Saif-TheWebDev" target="_blank" rel="noopener me" aria-label="GitHub profile (opens in a new tab)">
        <svg class="ic" aria-hidden="true"><use href="#i-github"/></svg>
      </a>
      <a class="icon-btn" href="mailto:me@webdev-saif.com" aria-label="Send an email">
        <svg class="ic" aria-hidden="true"><use href="#i-mail"/></svg>
      </a>
    </div>
  </div>

  <div class="shell foot-bot">
    <p>&copy; <span id="year">2026</span> Saif Al Jahan</p>
    <p class="foot-note">Designed &amp; built by hand</p>
    <a class="foot-top" href="#main">
      Back to top
      <svg class="ic" aria-hidden="true"><use href="#i-arrow"/></svg>
    </a>
  </div>

  <p class="foot-word" aria-hidden="true">SAIF AL JAHAN</p>
</footer>

<script src="../assets/js/main.js?v=20261024s" defer></script>
</body>
</html>
"""


def facts(items):
    return "\n      ".join(
        f'<div><dt>{k}</dt><dd>{v}</dd></div>' for k, v in items
    )


def sections(items):
    out = []
    for i, item in enumerate(items, 1):
        sid, title, body = item[0], item[1], item[2]
        extra = "\n        " + "\n        ".join(item[3:]) if len(item) > 3 else ""
        out.append(
            f'<section class="case-sec" id="{sid}">\n'
            f'        <h2><span class="n" aria-hidden="true">{i:02d}</span>{title}</h2>\n'
            f'        {body}{extra}\n'
            f'      </section>'
        )
    return "\n      ".join(out)


def toc(items):
    return "\n        ".join(f'<li><a href="#{sid}">{title}</a></li>' for sid, title in ((i[0], i[1]) for i in items))


def dec(rows):
    body = "\n      ".join(f"<div><dt>{k}</dt><dd>{v}</dd></div>" for k, v in rows)
    return f'<dl class="dec">\n      {body}\n    </dl>'


def gallery(note, cards):
    body = "\n        ".join(
        f'<div class="gal-card"><span class="k">{k}</span><span class="v">{v}</span><span class="m">{m}</span></div>'
        for k, v, m in cards
    )
    return (
        f'<div class="gallery">\n        <p class="gal-note">{note}</p>\n'
        f'        <div class="gal-grid">\n        {body}\n        </div>\n      </div>'
    )


# ─────────────────────────────────────────────────────────── Arif Mia ──
arif_sections = [
    (
        "overview",
        "Overview",
        "<p>A search-first marketing site for <strong>Arif Mia</strong>, an SEO and Google Maps "
        "consultant working with businesses across the UAE and Bangladesh. The site has one job: "
        "turn a search result or a referral into a booked consultation, and to demonstrate the "
        "discipline it sells.</p>"
        "<p>It runs on WordPress with Elementor for layout, WPForms for the inquiry and booking "
        "path, and Bit Flows for the automation that routes a new lead. I designed it, built the "
        "front end, and set up the content model so the owner can edit every claim himself.</p>",
    ),
    (
        "problem",
        "The problem",
        "<p>An SEO consultant's own site is the first audit a prospect runs. If it loads slowly, "
        "buries the offer, or asks visitors to hunt for a way to book, the pitch is already lost.</p>"
        "<ul>"
        "<li>Two competing calls to action — a free audit and a consultation — that split attention "
        "instead of forming one path.</li>"
        "<li>A wide service range (local SEO, Google Business Profile, AEO/GEO, technical SEO) that "
        "has to read as one offer rather than nine unrelated pages.</li>"
        "<li>Proof — search and analytics numbers — that the owner needs to update without a "
        "developer, and without breaking the layout.</li>"
        "</ul>",
    ),
    (
        "role",
        "My role",
        "<p>Everything from the sitemap to the deploy: information architecture, page design, "
        "WordPress build with Elementor, custom styling for the sections Elementor cannot express, "
        "form and booking wiring, the automation that follows a submission, and the on-page SEO "
        "structure the entire site is a demonstration of.</p>",
    ),
    (
        "approach",
        "Technical approach",
        dec(
            [
                ("CMS", "WordPress, with Elementor for page composition and a restricted widget set so "
                        "pages cannot drift away from the design system."),
                ("Booking", "A dedicated booking anchor on the contact page, reachable from every CTA, "
                            "so there is one destination and one form."),
                ("Forms", "WPForms for the inquiry, with a confirmation state that tells the visitor what "
                          "happens next rather than just clearing the fields."),
                ("Automation", "Bit Flows routes a new submission into the follow-up pipeline, so no lead "
                               "depends on someone checking an inbox."),
                ("Content", "Editable stat and service blocks — the achievement figures and the nine service "
                            "sections are content, not hard-coded markup."),
                ("Search", "One H1 per page, service pages with their own intent, structured internal links, "
                           "and metadata written for the query rather than the brand."),
            ]
        ),
    ),
    (
        "design",
        "Design decisions",
        "<p>The page leads with the offer and the action, then earns attention with proof and "
        "specificity. Sections are spaced generously and separated by hairlines instead of cards, "
        "because nine service blocks as nine boxes reads as a template — as a numbered list with "
        "real detail it reads as a person who knows the work.</p>"
        "<p>Type does the hierarchy work: one display face at two weights, one small caps label "
        "style for the structure, body copy at a comfortable measure. The accent colour is reserved "
        "for actions and the few places the eye needs a hand.</p>",
    ),
    (
        "challenges",
        "Challenges",
        dec(
            [
                ("Keeping it editable", "Elementor makes almost anything possible, which is exactly how a "
                                         "site loses its design. I limited the available widgets and pre-built the "
                                         "repeated blocks so the owner edits content, not layout."),
                ("Proof that ages well", "Search positions and traffic numbers move monthly. They live in "
                                         "editable fields with labels that state the source and the window, so a "
                                         "number is never an untethered boast."),
                ("One path, many services", "Nine capabilities had to funnel into one booking action. Each "
                                           "service block answers a different query, but they all end at the same "
                                           "place."),
            ]
        ),
    ),
    (
        "outcome",
        "Outcome",
        "<p>The site is live and maintained by its owner: <strong>arifmia.com</strong>. "
        "I am not publishing traffic, ranking or conversion figures for it here — I do not hold "
        "verified numbers for this site, and a portfolio that invents them is worth nothing.</p>"
        "<p>What can be checked directly: the site is indexed, the booking path works end to end, "
        "the pages are built on the stack described above, and the content model has survived "
        "updates since launch.</p>",
        '<div class="case-links">\n'
        '          <a class="btn-line btn-line--solid" href="https://arifmia.com/" target="_blank" rel="noopener">Visit arifmia.com <svg class="ic" aria-hidden="true"><use href="#i-out"/></svg></a>\n'
        "        </div>",
    ),
    (
        "gallery",
        "Evidence",
        gallery(
            "Screenshots of the live site are pending: this build environment cannot reach the "
            "client domain, and I will not draw a fake interface to fill the space. These are the "
            "structural facts the build turns on, all verifiable on the live site.",
            [
                ("Entry point", "“Get a Free SEO Audit”", "Hero CTA, above the fold, paired with a secondary booking link."),
                ("Booking", "/contact/#arif-booking", "One destination for every conversion action on the site."),
                ("Offer", "Nine service blocks", "Local SEO, Google Business Profile, audits, keywords, content, AEO/GEO, on-page, technical, authority."),
                ("Proof", "Search Console &amp; GA4 figures", "Labelled numbers the owner edits, not a hard-coded claim."),
            ],
        ),
    ),
]

arif = dict(
    slug="arif-mia",
    title="Arif Mia",
    h1="Arif <em>Mia</em>",
    desc="A search-first WordPress site for an SEO consultant working across the UAE and Bangladesh — information architecture, Elementor build, booking path and lead automation.",
    kind="WordPress website for an SEO consultant",
    lede="A WordPress site for an SEO consultant who has to be found by the same search he sells — "
         "one offer, one booking path, and proof the owner can keep current.",
    note="",
    status="Client work · live",
    hero_links='<a class="btn-line btn-line--solid" href="https://arifmia.com/" target="_blank" rel="noopener">Live site <svg class="ic" aria-hidden="true"><use href="#i-out"/></svg></a>',
    facts=[
        ("Type", "Client · marketing site"),
        ("Role", "Design, build, CMS, automation"),
        ("Stack", "WordPress, Elementor, WPForms, Bit Flows"),
        ("Year", "2026"),
    ],
    sections=arif_sections,
    next_href="saif-flix.html",
    next_title="SAIF FLIX",
)

# ─────────────────────────────────────────────────────────── SAIF FLIX ──
flix_sections = [
    (
        "overview",
        "Overview",
        "<p><strong>SAIF FLIX</strong> is a free streaming catalogue I designed and built end to "
        "end. It reads from the TMDB database, presents films and series as shelves, and plays "
        "them through a custom player with multiple fallback servers. No account, no payment, no "
        "personal data collected — the product is the browsing and the playback.</p>"
        "<p>It is my own product, not a client commission, which is exactly why it is in this "
        "portfolio: it is the project where nobody else set the constraints.</p>",
    ),
    (
        "problem",
        "The problem",
        "<p>Streaming front ends fail in three predictable ways: they are heavy, they break when a "
        "third-party source does, and they are designed for a laptop and then squashed onto a TV.</p>"
        "<ul>"
        "<li>Thousands of titles need to feel navigable, not dumped into an infinite grid.</li>"
        "<li>Playback depends on sources I do not control, so the interface has to keep working "
        "when one does not.</li>"
        "<li>Metadata arrives incomplete — missing artwork, missing runtimes, duplicate titles "
        "across regions.</li>"
        "<li>People watch on televisions, where a cursor and a hover state do not exist.</li>"
        "</ul>",
    ),
    (
        "role",
        "My role",
        "<p>Product decisions, interface design, front-end engineering, the player, the routing, "
        "the Android TV layout and the search metadata — one person, the whole product. I also "
        "wrote the copy, which is the part nobody warns you about.</p>",
    ),
    (
        "approach",
        "Technical approach",
        dec(
            [
                ("Data", "TMDB as the catalogue: trending, top-rated, per-genre collections and per-title "
                         "metadata, requested on demand rather than baked into the page."),
                ("Routing", "Query-string routes — /movie?id=, /tv?id= — so a title has a shareable URL and "
                            "the page renders from an identifier rather than a client-side router."),
                ("Player", "Multiple servers offered per title with an automatic fallback, so one dead "
                           "source degrades the experience instead of ending it."),
                ("Catalogue logic", "De-duplication by title and year across lists, so the same film does not "
                                    "appear three times in a row of shelves."),
                ("Television", "A dedicated leanback route at /android-tv with larger targets, no hover "
                               "dependence, and a D-pad-shaped focus order."),
                ("Performance", "No framework, no animation library, images sized per shelf slot, and "
                                "nothing fetched that the current shelf does not need."),
            ]
        ),
    ),
    (
        "design",
        "Design decisions",
        "<p>Dark, because the artwork is the interface: posters are the brightest thing on screen "
        "and every chrome element steps back so they can be. One accent colour marks the primary "
        "action and the active filter, and nothing else competes with it.</p>"
        "<p>Shelves are labelled in plain language — Continue Watching, Because You Watched, Top "
        "10 — because the user's question is never “what is in the database”, it is “what do I "
        "watch next”. Badges stay small and factual: rating, year, language, media type.</p>",
    ),
    (
        "challenges",
        "Challenges",
        dec(
            [
                ("Third-party failure", "Images 404 and ratings arrive as “NR”. Every slot has a fallback "
                                        "treatment so a missing poster leaves a composed card, not a broken hole."),
                ("Long lists, short attention", "Horizontal shelves with keyboard and touch support, capped "
                                                 "row lengths, and a Top 10 that is a real ranking rather than another "
                                                 "poster grid."),
                ("Playback reliability", "The fallback chain has to be invisible when it works and obvious when "
                                         "it does not. The player tells you which source it is trying and moves "
                                         "on."),
                ("Television input", "Leanback mode is a different interaction model, not a responsive "
                                     "breakpoint: focus rings become the primary state and the whole grid steps up "
                                     "in size."),
            ]
        ),
    ),
    (
        "outcome",
        "Outcome",
        "<p>Live at <strong>saif-flix.webdev-saif.com</strong>, with the Android TV mode at "
        "/android-tv. I am not quoting traffic or retention numbers here because I have no "
        "verified analytics for the demo.</p>"
        "<p>What is checkable: the catalogue loads, shelves filter by All / Movies / TV Shows, the "
        "watchlist persists locally, playback falls back between servers, and the leanback layout "
        "is usable with arrow keys alone.</p>",
        '<div class="case-links">\n'
        '          <a class="btn-line btn-line--solid" href="https://saif-flix.webdev-saif.com/" target="_blank" rel="noopener">Open the demo <svg class="ic" aria-hidden="true"><use href="#i-out"/></svg></a>\n'
        '          <a class="btn-line" href="https://saif-flix.webdev-saif.com/android-tv" target="_blank" rel="noopener">Android TV mode <svg class="ic" aria-hidden="true"><use href="#i-out"/></svg></a>\n'
        "        </div>",
    ),
    (
        "gallery",
        "Evidence",
        gallery(
            "Screenshots are pending for the same reason as the other projects — the demo host is "
            "outside this build environment's network. These are the product surfaces that exist "
            "and can be opened directly.",
            [
                ("Home", "Rotating billboard", "One featured title at a time, with Watch Now and My List as the only actions."),
                ("Catalogue", "Continue Watching · Because You Watched · Watchlist · Top 10", "Four shelves with different jobs, filtered by All / Movies / TV Shows."),
                ("Playback", "Multi-server fallback", "A failed source is skipped rather than surfaced as an error."),
                ("Television", "/android-tv", "Leanback layout for Android TV, Fire TV and Google TV remotes."),
            ],
        ),
    ),
]

flix = dict(
    slug="saif-flix",
    title="SAIF FLIX",
    h1="SAIF <em>/</em> FLIX",
    desc="SAIF FLIX — a TMDB-backed streaming catalogue with a custom player, multi-server fallback and a dedicated Android TV leanback mode. Personal product, built end to end.",
    kind="Streaming catalogue product",
    lede="A dark, cinematic streaming catalogue built from scratch on TMDB data — shelves, "
         "watchlist, a player that survives a dead source, and a layout that works from a sofa.",
    note="",
    status="Personal product · live demo",
    hero_links='<a class="btn-line btn-line--solid" href="https://saif-flix.webdev-saif.com/" target="_blank" rel="noopener">Live demo <svg class="ic" aria-hidden="true"><use href="#i-out"/></svg></a>',
    facts=[
        ("Type", "Personal product"),
        ("Role", "Product, design, front end"),
        ("Stack", "JavaScript, TMDB API, custom player"),
        ("Year", "2026"),
    ],
    sections=flix_sections,
    next_href="renata-plc.html",
    next_title="Renata PLC",
)

# ─────────────────────────────────────────────────────────── Renata PLC ──
renata_sections = [
    (
        "overview",
        "Overview",
        "<p><strong>Renata PLC</strong> is one of Bangladesh's established pharmaceutical "
        "manufacturers: decades of operation, facilities across the country, products exported "
        "to dozens of markets. This is an <strong>independent concept study</strong> of how a "
        "company like that could explain itself online — not a commissioned project.</p>"
        "<p>I chose it because the information architecture problem is unusually hard: one site "
        "has to serve investors, doctors, distributors, journalists, job seekers and patients, "
        "each with different questions and different tolerances for density.</p>",
    ),
    (
        "problem",
        "The problem",
        "<p>Corporate pharmaceutical sites tend to collapse under their own committees. The home "
        "page becomes a carousel of congratulations, the product catalogue becomes an unsearchable "
        "list, and investor information hides three levels down in a PDF.</p>"
        "<ul>"
        "<li>Audiences with conflicting needs sharing one navigation.</li>"
        "<li>A product range in the hundreds that has to be searchable by brand, generic name, "
        "therapeutic area and dosage form.</li>"
        "<li>Investor and governance content that is legally material and must stay current.</li>"
        "<li>Regulatory care: nothing on the page may imply a medical claim the company has not made.</li>"
        "</ul>",
    ),
    (
        "role",
        "My role",
        "<p>Everything in the concept: competitor and content audit, information architecture, "
        "the page templates, the design system, and the static build. No real company data was "
        "invented for it — where the concept needed a figure, the layout shows the shape of a "
        "figure rather than a fabricated one.</p>",
    ),
    (
        "approach",
        "Technical approach",
        dec(
            [
                ("Structure", "Static HTML pages with one shared stylesheet and a small script — nine "
                              "templates covering home, about, leadership, what we do, products, R&amp;D "
                              "pipeline, investors, CSR and newsroom."),
                ("Product search", "Filtering by brand, generic name, therapeutic area, dosage form and "
                                   "market, all client-side so the catalogue answers a question in one "
                                   "keystroke rather than a page load."),
                ("Investors", "A dated, ordered area for results and disclosures, because the audience for "
                              "it is looking for a specific document, not a story."),
                ("Navigation", "Audience-shaped top level, with the mega-menu reserved for products — the "
                               "one place where breadth is genuinely the point."),
                ("Disclosure", "A visible concept banner and a footer note stating the work is independent. "
                               "That is a build requirement, not a legal afterthought."),
            ]
        ),
    ),
    (
        "design",
        "Design decisions",
        "<p>Restraint over decoration. A corporate site at this scale earns trust through "
        "consistency and legibility: a single column of content at a comfortable measure, dense "
        "data presented in real tables, and a type scale that keeps a 20-page document readable "
        "on a phone.</p>"
        "<p>The palette is deliberately narrow — one ink, one paper, one accent — so that the "
        "product photography and the facility imagery carry the colour. Interactive states are "
        "unambiguous, because half the audience is on a hospital network with an old browser.</p>",
    ),
    (
        "challenges",
        "Challenges",
        dec(
            [
                ("Breadth without noise", "Every additional audience adds navigation. The resolution was "
                                           "to keep the top level short and let each section own its own "
                                           "sub-navigation instead of building a mega-menu for everything."),
                ("Product data at scale", "A real catalogue needs fields the design cannot invent. The "
                                           "concept defines the filter model and the result-card anatomy "
                                           "instead of pretending to hold the dataset."),
                ("Claims discipline", "Pharmaceutical content is regulated. The concept avoids efficacy "
                                       "language entirely; product entries describe form and market, not "
                                       "benefit."),
                ("Density on mobile", "Investor tables and product filters have to survive a 360px screen. "
                                      "Tables scroll in their own container and filters collapse into a "
                                      "single control."),
            ]
        ),
    ),
    (
        "outcome",
        "Outcome",
        "<p>Live as a working concept at <strong>plc.webdev-saif.com</strong>. It has no client, "
        "no analytics and no outcome to report — and the honest version of this section is to say "
        "so plainly.</p>"
        "<div class=\"concept-note\" style=\"margin-top:22px\">\n"
        '          <b>Not commissioned</b>\n'
        "          <p>Renata PLC has not commissioned, reviewed or endorsed this work. It is an "
        "independent design study using publicly available company information. All trademarks "
        "belong to their owners.</p>\n"
        "        </div>",
        '<div class="case-links">\n'
        '          <a class="btn-line btn-line--solid" href="https://plc.webdev-saif.com/" target="_blank" rel="noopener">Open the concept <svg class="ic" aria-hidden="true"><use href="#i-out"/></svg></a>\n'
        "        </div>",
    ),
    (
        "gallery",
        "Evidence",
        gallery(
            "No screenshots of the concept are included yet: the concept host is outside this "
            "build environment's network. The pages below exist and are open to inspection.",
            [
                ("Product search", "Brand · generic · area · form · market", "Client-side filtering across the full catalogue model."),
                ("Templates", "Nine pages", "Home, about, founder, what we do, products, R&amp;D, investors, CSR, team."),
                ("Investors", "Dated disclosure list", "Ordered by date, built for someone looking for one document."),
                ("Disclosure", "Independent concept", "Stated in the banner and the footer of every page."),
            ],
        ),
    ),
]

renata = dict(
    slug="renata-plc",
    title="Renata PLC",
    h1="Renata <em>PLC</em>",
    desc="An independent concept study of a corporate pharmaceutical website — information architecture, product search and investor content for a Bangladeshi manufacturer. Not commissioned.",
    kind="Corporate website concept (independent)",
    lede="An independent concept for a listed pharmaceutical manufacturer: nine templates, an "
         "audience-shaped structure and a product catalogue that can actually be searched.",
    note=(
        '<div class="concept-note">\n'
        "        <b>Independent concept · not commissioned</b>\n"
        "        <p>Renata PLC has not commissioned, reviewed or endorsed this work. It is a design "
        "study built on publicly available information, made to explore a hard information-architecture "
        "problem. No client relationship is implied anywhere on this page.</p>\n"
        "      </div>"
    ),
    status="Concept study · not a client project",
    hero_links='<a class="btn-line" href="https://plc.webdev-saif.com/" target="_blank" rel="noopener">Open the concept <svg class="ic" aria-hidden="true"><use href="#i-out"/></svg></a>',
    facts=[
        ("Type", "Independent concept"),
        ("Role", "Design &amp; build"),
        ("Stack", "Static HTML, CSS, JavaScript"),
        ("Year", "2026"),
    ],
    sections=renata_sections,
    next_href="arif-mia.html",
    next_title="Arif Mia",
)

PAGES = [arif, flix, renata]

for page in PAGES:
    html_out = SHELL.format(
        base=BASE,
        title=page["title"],
        slug=page["slug"],
        desc=page["desc"],
        h1=page["h1"],
        lede=page["lede"],
        note=page["note"],
        status=page["status"],
        hero_links=page["hero_links"],
        facts=facts(page["facts"]),
        toc=toc(page["sections"]),
        sections=sections(page["sections"]),
        next_href=page["next_href"],
        next_title=page["next_title"],
        kind=page["kind"],
    )
    (ROOT / "work" / f"{page['slug']}.html").write_text(html_out, encoding="utf-8")
    print("wrote", page["slug"], len(html_out), "bytes")
