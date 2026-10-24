/* =========================================================================
   Saif Al Jahan — portfolio interactions
   Vanilla JS, no dependencies.

   Order matters: the loader resolves first, because everything else is
   revealed against it. Nothing here is allowed to be the reason content is
   invisible — the HTML is fully readable with this file blocked.
   ========================================================================= */
(function () {
  'use strict';

  /* Set before anything else can throw: the inline failsafe in <head> watches
     for this flag and lifts the curtain itself if this file never ran. */
  window.__saifReady = true;

  var doc = document;
  var root = doc.documentElement;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── loader ────────────────────────────────────────────────────────────
     A fixed count: 0 → 100 in 2.5 s, then the curtain lifts. The number is a
     clock, not a guess — it is driven entirely by elapsed time, so it reads
     the same on a fast connection and a slow one, and it always finishes.
     It is decorative, so it stays aria-hidden throughout and never takes
     focus. Reduced motion skips it; a blocked script has its own escapes.
     ────────────────────────────────────────────────────────────────────── */
  var loader = doc.getElementById('loader');
  var loaderNum = doc.getElementById('loader-num');
  var loaderFill = doc.getElementById('loader-fill');
  var loaderPhrase = doc.getElementById('loader-phrase');

  function endLoader() {
    root.classList.add('loaded');
    root.classList.remove('loading');
    try { window.dispatchEvent(new CustomEvent('saif:ready')); } catch (e) {}
    window.setTimeout(function () {
      if (loader && loader.parentNode) loader.parentNode.removeChild(loader);
      loader = null;
    }, 700);
  }

  (function runLoader() {
    if (!loader || reduce) { endLoader(); return; }

    /* the markup ships complete; rewind it before the first painted frame */
    if (loaderNum) loaderNum.textContent = '0';
    if (loaderFill) loaderFill.style.width = '0%';

    var phrases = ['Setting the type', 'Aligning the grid', 'Warming the pixels'];
    var phraseIndex = 0;
    var phraseTimer = window.setInterval(function () {
      if (!loaderPhrase) return;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      loaderPhrase.classList.add('is-out');
      window.setTimeout(function () {
        loaderPhrase.textContent = phrases[phraseIndex];
        loaderPhrase.classList.remove('is-out');
      }, 200);
    }, 800);

    /* 2.5 s, end to end. Smoothstep rather than a hard ease-out: a count that
       is already at 63% after 600 ms reads as a bar that has stalled, not one
       that is working. This keeps the digits moving at a readable rate the
       whole way and still lands on exactly 100 at 2500 ms. */
    var COUNT_MS = 2500;
    var start = (window.performance && window.performance.now) ? window.performance.now() : Date.now();
    var done = false;

    function finish() {
      if (done) return;
      done = true;
      window.clearInterval(phraseTimer);
      if (loaderNum) loaderNum.textContent = '100';
      if (loaderFill) loaderFill.style.width = '100%';
      window.setTimeout(endLoader, 160);
    }

    function tick(now) {
      if (done) return;
      var p = (now - start) / COUNT_MS;
      if (!(p < 1)) { finish(); return; }

      var q = Math.max(0, p);
      var eased = q * q * (3 - 2 * q);
      var n = Math.min(99, Math.round(eased * 100));
      if (loaderNum) loaderNum.textContent = String(n);
      if (loaderFill) loaderFill.style.width = eased * 100 + '%';

      window.requestAnimationFrame(tick);
    }

    if (window.requestAnimationFrame) window.requestAnimationFrame(tick);
    else finish();

    /* rAF stops in background tabs, so a timer guarantees the curtain lifts
       even if no frame is ever painted again. */
    window.setTimeout(finish, COUNT_MS + 60);
  })();

  /* ── year ────────────────────────────────────────────────────────────── */
  var yearEl = doc.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ── theme ───────────────────────────────────────────────────────────── */
  var themeBtn = doc.querySelector('.theme-btn');
  var themeMeta = doc.getElementById('theme-meta');

  function applyTheme(theme, persist) {
    root.setAttribute('data-theme', theme);
    if (persist) { try { localStorage.setItem('theme', theme); } catch (e) {} }
    if (themeMeta) themeMeta.setAttribute('content', theme === 'dark' ? '#191817' : '#f7f5f0');
    if (themeBtn) {
      var dark = theme === 'dark';
      themeBtn.setAttribute('aria-pressed', String(dark));
      themeBtn.setAttribute('aria-label', dark ? 'Switch to light theme' : 'Switch to dark theme');
    }
  }

  applyTheme(root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light', false);
  if (themeBtn) {
    themeBtn.addEventListener('click', function () {
      applyTheme(root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark', true);
    });
  }

  /* ── mobile nav ──────────────────────────────────────────────────────── */
  var menuBtn = doc.querySelector('.menu-btn');
  var nav = doc.getElementById('mnav');
  var navLinks = nav ? Array.prototype.slice.call(nav.querySelectorAll('a')) : [];

  /* The panel is a dropdown, not a takeover, so the page behind it keeps its
     scroll position. Focus moves into the panel on open and returns to the
     button on Escape — the two things a sheet has to get right. */
  function setNav(open) {
    doc.body.classList.toggle('nav-open', open);
    if (menuBtn) {
      menuBtn.setAttribute('aria-expanded', String(open));
      menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    }
    if (open && navLinks.length) {
      window.setTimeout(function () { navLinks[0].focus(); }, 240);
    }
  }

  if (menuBtn && nav) {
    menuBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      setNav(!doc.body.classList.contains('nav-open'));
    });
    navLinks.forEach(function (a) {
      a.addEventListener('click', function () { setNav(false); });
    });
    doc.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && doc.body.classList.contains('nav-open')) {
        setNav(false);
        menuBtn.focus();
      }
    });
    /* a tap anywhere else closes it — a dropdown that traps you is worse than
       no dropdown */
    doc.addEventListener('click', function (e) {
      if (!doc.body.classList.contains('nav-open')) return;
      if (nav.contains(e.target)) return;
      setNav(false);
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth > 900 && doc.body.classList.contains('nav-open')) setNav(false);
    });
  }

  /* ── header state + reading progress ─────────────────────────────────── */
  var bar = doc.getElementById('bar');
  var bands = Array.prototype.slice.call(doc.querySelectorAll('[data-invert]'));
  var progress = doc.getElementById('progress');
  var pending = false;

  function onScroll() {
    if (pending) return;
    pending = true;
    window.requestAnimationFrame(function () {
      pending = false;
      var y = window.scrollY || window.pageYOffset;
      if (bar) {
        bar.classList.toggle('is-stuck', y > 18);
        /* the bar inverts over the one section that runs the palette backwards,
           so it never floats as a pale strip across the dark band */
        var probe = (doc.querySelector('.bar-in') || bar).getBoundingClientRect();
        var py = probe.top + probe.height / 2;
        var overBand = bands.some(function (b) {
          var r = b.getBoundingClientRect();
          return r.top <= py && r.bottom >= py;
        });
        bar.classList.toggle('is-inverse', overBand);
      }
      if (progress) {
        var max = doc.documentElement.scrollHeight - window.innerHeight;
        var pct = max > 0 ? Math.min(100, (y / max) * 100) : 0;
        progress.style.width = pct.toFixed(2) + '%';
      }
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  onScroll();

  /* ── scroll spy ──────────────────────────────────────────────────────── */
  var spyLinks = nav ? Array.prototype.slice.call(nav.querySelectorAll('a[href^="#"]')) : [];
  if (spyLinks.length && 'IntersectionObserver' in window) {
    var targets = spyLinks
      .map(function (a) { return doc.querySelector(a.getAttribute('href')); })
      .filter(Boolean);

    var setCurrent = function (id) {
      spyLinks.forEach(function (a) {
        var match = a.getAttribute('href') === '#' + id;
        if (match) a.setAttribute('aria-current', 'true');
        else a.removeAttribute('aria-current');
      });
    };

    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) setCurrent(entry.target.id);
      });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

    targets.forEach(function (t) { spy.observe(t); });
  }

  /* ── reveal (progressive enhancement) ───────────────────────────────────
     Visible by default; the hidden state is only switched on after the
     observer is confirmed wired, so a blocked script cannot blank the page.
     ────────────────────────────────────────────────────────────────────── */
  var reveals = Array.prototype.slice.call(doc.querySelectorAll('.reveal'));

  /* Reveals that share a parent arrive as one gesture, 65ms apart, so a row of
     cards reads as a sequence rather than five unrelated fades. */
  var groupCount = new Map();
  reveals.forEach(function (el) {
    var key = el.parentElement;
    var n = groupCount.get(key) || 0;
    el.style.setProperty('--i', String(Math.min(n, 5)));
    groupCount.set(key, n + 1);
  });

  function revealAll() {
    reveals.forEach(function (el) { el.classList.add('in'); });
  }

  function inViewport(el) {
    var r = el.getBoundingClientRect();
    return r.top < window.innerHeight && r.bottom > 0;
  }

  if (reduce || !('IntersectionObserver' in window)) {
    revealAll();
  } else {
    try {
      var revealObs = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('in');
            revealObs.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0.08,
        /* Anything at or above the viewport counts as seen: a fast scroll or
           an anchor jump must never strand a block in its hidden state. */
        rootMargin: '99999px 0px -6% 0px'
      });

      reveals.forEach(function (el) { revealObs.observe(el); });
      reveals.forEach(function (el) { if (inViewport(el)) el.classList.add('in'); });
      root.classList.add('motion');
    } catch (e) {
      revealAll();
    }
  }

  /* ── scroll feel, shared ────────────────────────────────────────────────
     Declared before the two blocks that use it: the motion block needs to
     hand scroll updates to ScrollTrigger, the menu needs to park the page,
     and the smooth scroller only exists after the curtain.
     ──────────────────────────────────────────────────────────────────────── */
  var smooth = null;

  /* Lenis moves the real scroll position, so ScrollTrigger only needs to be
     told to re-read it each frame it moves. Wired from whichever side
     finishes loading second — either file may arrive after the other. */
  function linkScrollToGSAP() {
    if (!smooth || !window.ScrollTrigger || !window.__saifGSAP || smooth.__linked) return;
    smooth.__linked = true;
    smooth.on('scroll', window.ScrollTrigger.update);
  }

  function setScrollLock(locked) {
    if (!smooth) return;
    if (locked) smooth.stop();
    else smooth.start();
  }

  /* ── motion (GSAP, optional) ─────────────────────────────────────────────
     Loaded from assets/vendor/gsap. Nothing depends on it: if the files are
     blocked, missing or the visitor prefers reduced motion this block is
     skipped and the page keeps its plain-CSS reveal. The hero entrance is the
     one place where the order of the choreography is the design.
     ──────────────────────────────────────────────────────────────────────── */
  (function initMotion() {
    var gsap = window.gsap;
    if (!gsap || reduce) return;

    gsap.defaults({ ease: 'power3.out', duration: 0.9 });
    /* transforms only: no filters, no layout properties, no filter drop-shadows */
    gsap.config({ nullTargetWarn: false });

    /* hero: label → masked headline lines → purpose on its own beat → subtitle
       → CTAs → stats. Built paused so the loader, not the timeline, decides
       when it starts. */
    var hero = doc.querySelector('.hero');
    if (hero) {
      var heroTag = hero.querySelector('.hero-tag');
      var lines = gsap.utils.toArray('.hero .display .line > span');
      var em = hero.querySelector('.display em');
      var sub = hero.querySelector('.hero-sub');
      var ctas = gsap.utils.toArray('.hero-cta > *');
      var side = hero.querySelector('.hero-side');
      var base = gsap.utils.toArray('.hero-base > ul > li, .hero-scroll');

      /* Start states are set once, up front, and the timeline only tweens to
         explicit end values. Two details matter here: the layout is flushed
         first (so the masked spans are measured as blocks, not inline), and
         every percentage tween also pins y to 0 — otherwise GSAP keeps the
         pixel translation it cached while converting the percentage and the
         line stays one line-height below its slot. */
      void hero.offsetHeight;
      if (heroTag) gsap.set(heroTag, { y: 12, autoAlpha: 0 });
      if (lines.length) gsap.set(lines, { y: 0, yPercent: 128 });
      if (em) gsap.set(em, { y: 0, yPercent: 42, autoAlpha: 0, rotate: 1.5 });
      /* content is never hidden to be animated: it paints at first paint and
         the timeline only nudges it, so a slow script cannot delay LCP */
      if (sub) gsap.set(sub, { y: 14 });
      if (ctas.length) gsap.set(ctas, { y: 12 });
      if (side) gsap.set(side, { y: 12 });
      if (base.length) gsap.set(base, { y: 8 });

      var tl = gsap.timeline({ paused: true, defaults: { ease: 'power3.out' } });
      if (heroTag) tl.to(heroTag, { y: 0, autoAlpha: 1, duration: 0.55 });
      if (lines.length) tl.to(lines, { y: 0, yPercent: 0, duration: 0.92, stagger: 0.07 }, '-=0.28');
      if (em) tl.to(em, { y: 0, yPercent: 0, autoAlpha: 1, rotate: 0, duration: 0.8 }, '-=0.5');
      if (sub) tl.to(sub, { y: 0, duration: 0.7 }, '-=0.55');
      if (ctas.length) tl.to(ctas, { y: 0, duration: 0.6, stagger: 0.06 }, '-=0.45');
      if (side) tl.to(side, { y: 0, duration: 0.7 }, '-=0.55');
      if (base.length) tl.to(base, { y: 0, duration: 0.5, stagger: 0.05 }, '-=0.5');

      var played = false;
      var play = function () {
        if (played) return;
        played = true;
        tl.play();
      };
      if (root.classList.contains('loaded')) play();
      else {
        window.addEventListener('saif:ready', play, { once: true });
        /* the loader has its own escape hatch; this is the matching one */
        window.setTimeout(play, 5200);
      }
    }

    /* ── process rail ─────────────────────────────────────────────────────
       ScrollTrigger is 45 KB that only this one scrub needs, and that section
       is three viewports below the fold — so it is fetched after the curtain
       lifts instead of competing with the hero's first frames. The rAF rail
       runs until it arrives, and keeps running if it never does: the two write
       the same custom property and the same class.
       ────────────────────────────────────────────────────────────────────── */
    var stepsEl = doc.getElementById('steps');

    function wireRail() {
      var ST = window.ScrollTrigger;
      if (!ST || !stepsEl || window.__saifGSAP) return;
      gsap.registerPlugin(ST);
      window.__saifGSAP = true;
      linkScrollToGSAP();

      var stepItems = Array.prototype.slice.call(stepsEl.querySelectorAll('.step'));
      var paint = function (p) {
        p = Math.max(0, Math.min(1, p));
        stepsEl.style.setProperty('--tp', p.toFixed(3));
        stepItems.forEach(function (el, i) {
          el.classList.toggle('is-on', p >= (i + 0.32) / stepItems.length);
        });
      };

      ST.create({
        trigger: stepsEl,
        start: 'top 74%',
        end: 'bottom 36%',
        scrub: 0.5,
        onUpdate: function (self) { paint(self.progress); },
        onRefresh: function (self) { paint(self.progress); }
      });

      /* fonts change the height of the list; one refresh after they land keeps
         the trigger honest without watching them at runtime. */
      if (doc.fonts && doc.fonts.ready) {
        doc.fonts.ready.then(function () { ST.refresh(); }).catch(function () {});
      }
    }

    function loadRail() {
      if (!stepsEl) return;
      if (window.ScrollTrigger) { wireRail(); return; }
      var tag = doc.createElement('script');
      tag.src = SELF + 'assets/vendor/gsap/ScrollTrigger.min.js';
      tag.async = true;
      tag.onload = wireRail;
      doc.head.appendChild(tag);
    }

    if (root.classList.contains('loaded')) window.setTimeout(loadRail, 0);
    else window.addEventListener('saif:ready', loadRail, { once: true });
  })();

  /* ── inquiry form ──────────────────────────────────────────────────────
     Progressive by design:
       · no endpoint configured  → compose a mail draft (works everywhere)
       · endpoint configured     → POST the fields as JSON and report the
                                   real result, never a guessed one
     Validation is ours so the message can be specific, and `novalidate` keeps
     the browser's own bubbles from fighting the inline errors. Without JS the
     form still posts to nothing and the email link above it is the path.
     ────────────────────────────────────────────────────────────────────── */
  (function inquiry() {
    var form = doc.getElementById('inquiry');
    if (!form) return;

    var status = doc.getElementById('inq-status');
    var submit = form.querySelector('.btn-submit');
    var fields = {
      name: form.querySelector('#inq-name'),
      email: form.querySelector('#inq-email'),
      project: form.querySelector('#inq-type'),
      message: form.querySelector('#inq-msg')
    };

    var rules = {
      name: function (v) { return v.trim().length >= 2 ? '' : 'Please tell me your name.'; },
      email: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? '' : 'Please use a valid email address.'; },
      project: function (v) { return v ? '' : 'Pick the closest option — it can change later.'; },
      message: function (v) { return v.trim().length >= 10 ? '' : 'A sentence or two is enough to start.'; }
    };

    function setError(key, msg) {
      var input = fields[key];
      if (!input) return;
      var field = input.closest('.field');
      var err = doc.getElementById('err-' + (key === 'project' ? 'type' : key === 'message' ? 'msg' : key));
      var bad = !!msg;
      if (field) field.toggleAttribute('data-invalid', bad);
      input.setAttribute('aria-invalid', bad ? 'true' : 'false');
      if (err) {
        err.hidden = !bad;
        if (msg) err.textContent = msg;
        input.setAttribute('aria-describedby', err.id);
      }
    }

    function validate(key) {
      var input = fields[key];
      var msg = rules[key](input.value);
      setError(key, msg);
      return !msg;
    }

    Object.keys(fields).forEach(function (key) {
      var input = fields[key];
      /* validate on blur, then live once the field has been flagged — an error
         that appears while you are still typing the first character is noise */
      input.addEventListener('blur', function () { if (input.value) validate(key); });
      input.addEventListener('input', function () {
        var field = input.closest('.field');
        if (field && field.hasAttribute('data-invalid')) validate(key);
      });
    });

    function summary() {
      var budget = form.querySelector('#inq-budget');
      var when = form.querySelector('#inq-when');
      var lines = [
        'Name: ' + fields.name.value.trim(),
        'Email: ' + fields.email.value.trim(),
        'Project: ' + fields.project.value,
        'Message:',
        fields.message.value.trim()
      ];
      if (budget && budget.value) lines.push('', 'Budget: ' + budget.value);
      if (when && when.value) lines.push('Timeline: ' + when.value);
      return lines.join('\n');
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var ok = Object.keys(fields).map(validate).every(Boolean);
      if (!ok) {
        var first = form.querySelector('[data-invalid] input, [data-invalid] select, [data-invalid] textarea');
        if (first) first.focus();
        if (status) {
          status.setAttribute('data-state', 'error');
          status.textContent = 'Check the highlighted fields and try again.';
        }
        return;
      }

      /* bots tick the hidden field; humans never see it */
      var trap = form.querySelector('#inq-company');
      if (trap && trap.value) return;

      var endpoint = (form.getAttribute('data-endpoint') || '').trim();
      if (!endpoint) {
        var to = form.getAttribute('data-email') || 'me@webdev-saif.com';
        var href = 'mailto:' + to +
          '?subject=' + encodeURIComponent('Project inquiry — ' + fields.project.value) +
          '&body=' + encodeURIComponent(summary());
        window.location.href = href;
        if (status) {
          status.removeAttribute('data-state');
          status.textContent = 'Opening your email app with the brief filled in. If nothing opens, write to ' + to + ' directly.';
        }
        return;
      }

      if (submit) { submit.disabled = true; }
      if (status) {
        status.removeAttribute('data-state');
        status.textContent = 'Sending…';
      }

      fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          name: fields.name.value.trim(),
          email: fields.email.value.trim(),
          project: fields.project.value,
          message: fields.message.value.trim(),
          budget: (form.querySelector('#inq-budget') || {}).value || '',
          timeline: (form.querySelector('#inq-when') || {}).value || ''
        })
      }).then(function (res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        form.reset();
        if (status) {
          status.removeAttribute('data-state');
          status.textContent = 'Sent. You will get a reply at the address you gave, usually within a day.';
        }
      }).catch(function () {
        if (status) {
          status.setAttribute('data-state', 'error');
          status.textContent = 'That did not send. Email me at ' + (form.getAttribute('data-email') || 'me@webdev-saif.com') + ' and I will pick it up there.';
        }
      }).then(function () {
        if (submit) { submit.disabled = false; }
      });
    });
  })();

  /* ── live Dhaka time ─────────────────────────────────────────────────── */
  var clocks = doc.querySelectorAll('[data-clock]');
  var clockFmt;
  try {
    clockFmt = new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Asia/Dhaka', hour: '2-digit', minute: '2-digit', hourCycle: 'h23'
    });
  } catch (e) { clockFmt = null; }

  function updateClock() {
    if (!clockFmt) return;
    var t = clockFmt.format(new Date());
    Array.prototype.forEach.call(clocks, function (el) {
      el.textContent = t + ' (GMT+6)';
    });
  }
  if (clocks.length) { updateClock(); window.setInterval(updateClock, 30000); }

  /* ── copy email ──────────────────────────────────────────────────────── */
  /* Vendor files are resolved against this script's own URL, so the same file
     serves the home page and /work/*.html without a build step or an absolute
     path that would break if the site ever moves under a subdirectory. */
  var SELF = (function () {
    var el = doc.currentScript || doc.querySelector('script[src*="assets/js/main.js"]');
    return el ? el.src.replace(/assets\/js\/main\.js.*$/, '') : '';
  })();

  var toast = doc.getElementById('toast');
  var toastTimer;

  function showToast(msg) {
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('is-on');
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(function () { toast.classList.remove('is-on'); }, 2500);
  }

  Array.prototype.forEach.call(doc.querySelectorAll('[data-copy]'), function (btn) {
    btn.addEventListener('click', function () {
      var value = btn.getAttribute('data-copy') || '';
      var label = btn.querySelector('[data-copy-label]');
      var icon = btn.querySelector('use');

      function done() {
        showToast('Email copied — talk soon.');
        if (label) {
          var original = label.textContent;
          label.textContent = 'Copied';
          window.setTimeout(function () { label.textContent = original; }, 2000);
        }
        if (icon) {
          var prev = icon.getAttribute('href');
          icon.setAttribute('href', '#i-check');
          window.setTimeout(function () { icon.setAttribute('href', prev); }, 2000);
        }
      }

      function legacy() {
        var field = doc.createElement('textarea');
        field.value = value;
        field.setAttribute('readonly', '');
        field.style.position = 'fixed';
        field.style.opacity = '0';
        doc.body.appendChild(field);
        field.select();
        try { doc.execCommand('copy'); done(); } catch (e) {}
        doc.body.removeChild(field);
      }

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(value).then(done).catch(legacy);
      } else {
        legacy();
      }
    });
  });

  /* ── services accordion ──────────────────────────────────────────────────
     The markup is <details>, so it opens with no script at all. When motion is
     allowed we take the click and animate the panel height instead, which is
     the one thing native details cannot do. Interruptions cancel cleanly.
     ────────────────────────────────────────────────────────────────────── */
  var svcBoxes = Array.prototype.slice.call(doc.querySelectorAll('.svc'));

  svcBoxes.forEach(function (box) {
    var sum = box.querySelector('.svc-sum');
    var panel = box.querySelector('.svc-panel');
    if (!sum || !panel) return;
    var running = null;

    /* one discipline at a time — the same rule the FAQ follows. Native
       <details> allows several open at once, which reads as an inventory
       rather than an argument, so opening one closes the rest. */
    box.addEventListener('toggle', function () {
      if (!box.open) return;
      svcBoxes.forEach(function (other) {
        if (other === box || !other.open) return;
        other.open = false;
        var otherPanel = other.querySelector('.svc-panel');
        if (otherPanel) otherPanel.style.height = '';
      });
    });

    sum.addEventListener('click', function (e) {
      if (reduce || typeof panel.animate !== 'function') return;
      e.preventDefault();
      if (running) { running.cancel(); running = null; }

      if (box.open) {
        var from = panel.offsetHeight;
        running = panel.animate(
          [{ height: from + 'px' }, { height: '0px' }],
          { duration: 300, easing: 'cubic-bezier(0.33, 1, 0.68, 1)' }
        );
        running.onfinish = function () {
          box.open = false;
          panel.style.height = '';
          running = null;
        };
        running.oncancel = function () { panel.style.height = ''; };
      } else {
        box.open = true;
        var to = panel.offsetHeight;
        panel.style.height = to + 'px';
        running = panel.animate(
          [{ height: '0px' }, { height: to + 'px' }],
          { duration: 430, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' }
        );
        running.onfinish = function () { panel.style.height = ''; running = null; };
        running.oncancel = function () { panel.style.height = ''; running = null; };
      }
    });
  });

  /* ── process rail ────────────────────────────────────────────────────────
     The connecting line fills with scroll and each step lights as the line
     reaches it. Pure transform + class toggles: no pinning, no scroll-jack,
     nothing that can hold the page still.
     ────────────────────────────────────────────────────────────────────── */
  var stepsEl = doc.getElementById('steps');
  if (stepsEl) {
    var stepItems = Array.prototype.slice.call(stepsEl.querySelectorAll('.step'));
    var stepQueued = false;

    var paintSteps = function () {
      stepQueued = false;
      /* ScrollTrigger takes the rail over when motion is running; the rAF
         path stays as the fallback for blocked or unsupported browsers. */
      if (window.__saifGSAP) return;
      var rect = stepsEl.getBoundingClientRect();
      var vh = window.innerHeight || 800;
      var travel = rect.height + vh * 0.36;
      var p = ((vh * 0.74) - rect.top) / travel;
      p = Math.max(0, Math.min(1, p));
      stepsEl.style.setProperty('--tp', p.toFixed(3));
      stepItems.forEach(function (el, i) {
        el.classList.toggle('is-on', p >= (i + 0.32) / stepItems.length);
      });
    };

    var queueSteps = function () {
      if (stepQueued) return;
      stepQueued = true;
      window.requestAnimationFrame(paintSteps);
    };

    if (reduce) {
      stepsEl.style.setProperty('--tp', '1');
      stepItems.forEach(function (el) { el.classList.add('is-on'); });
    } else {
      window.addEventListener('scroll', queueSteps, { passive: true });
      window.addEventListener('resize', queueSteps);
      window.addEventListener('load', queueSteps);
      paintSteps();
    }
  }

  /* ── faq accordion ───────────────────────────────────────────────────── */
  var items = Array.prototype.slice.call(doc.querySelectorAll('.q'));
  items.forEach(function (item) {
    item.addEventListener('toggle', function () {
      if (!item.open) return;
      items.forEach(function (other) { if (other !== item && other.open) other.open = false; });
    });
  });

  /* ── magnetic case-study CTA ─────────────────────────────────────────────
     Desktop pointers only, a few pixels of give, and only on the one control
     that means "go deeper". Transform-only, released on leave/blur, and not
     wired at all for touch, keyboard-first or reduced-motion visits.
     ────────────────────────────────────────────────────────────────────── */
  if (!reduce && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    var featureLink = doc.querySelector('.feature-link');
    var cta = featureLink && featureLink.querySelector('.work-cta');
    if (cta) {
      var mx = 0, my = 0, mraf = 0;
      var paintMagnet = function () {
        mraf = 0;
        cta.style.transform = 'translate3d(' + mx.toFixed(2) + 'px,' + my.toFixed(2) + 'px,0)';
      };
      featureLink.addEventListener('pointermove', function (e) {
        var r = featureLink.getBoundingClientRect();
        var dx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
        var dy = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
        mx = Math.max(-1, Math.min(1, dx)) * 7;
        my = Math.max(-1, Math.min(1, dy)) * 5;
        if (!mraf) mraf = window.requestAnimationFrame(paintMagnet);
      });
      var releaseMagnet = function () {
        if (mraf) { window.cancelAnimationFrame(mraf); mraf = 0; }
        cta.style.transform = '';
      };
      featureLink.addEventListener('pointerleave', releaseMagnet);
      featureLink.addEventListener('blur', releaseMagnet, true);
    }
  }

  /* ── slowed scrolling ─────────────────────────────────────────────────────
     The page still scrolls natively: Lenis eases the *arrival* by writing
     window.scrollTo every frame, so the scrollbar, keyboard, find-in-page,
     focus movement, the back button and every scroll listener keep working
     as they always did. What changes is the tail — a wheel notch is not
     snapped into place, it glides to rest over about a second.

     The distance is deliberately NOT scaled. Halving wheel travel is what
     makes hijacked pages feel broken: you push three times and arrive
     nowhere. Weight comes from damping, not from taking distance away.

     Loaded after the curtain (5 KB gzipped that nobody watching a loader can
     use), never on touch or reduced motion, and the page is complete if the
     file never arrives. Tune SLOW_EASE between 0 and 1 — lower is slower.
     ────────────────────────────────────────────────────────────────────── */
  var SLOW_EASE = 0.075;

  /* A phone or tablet with no pointer that can hover has no wheel to ease,
     and dragging is the OS's own momentum — so the 5 KB is not fetched and
     nothing can get between the finger and the page. A laptop with a
     touchscreen still reports a hovering pointer and keeps the easing. */
  function touchOnly() {
    return (navigator.maxTouchPoints || 0) > 0 &&
      window.matchMedia('(any-hover: none)').matches;
  }

  function initSmooth() {
    var Lenis = window.Lenis;
    if (!Lenis || reduce || smooth || touchOnly()) return;

    smooth = new Lenis({
      lerp: SLOW_EASE,
      wheelMultiplier: 1,
      smoothWheel: true,
      syncTouch: false,        /* touch keeps the OS's own momentum */
      anchors: false,          /* handled below, so the fixed bar is respected */
      autoRaf: true,
      respectReducedMotion: true
    });

    /* native <a href="#section"> jumps would land under the fixed bar and
       fight the easing, so in-page links go through the same scrollTo */
    doc.addEventListener('click', function (e) {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      var a = e.target && e.target.closest ? e.target.closest('a[href^="#"]') : null;
      if (!a || a.classList.contains('skip')) return;
      var id = a.getAttribute('href');
      if (!id || id === '#') return;
      var target = doc.querySelector(id);
      if (!target) return;

      e.preventDefault();
      /* release the page before asking it to move: the menu parks the
         scroller, and a stopped scroller cannot animate a scrollTo */
      if (doc.body.classList.contains('nav-open')) setNav(false);
      var barIn = doc.querySelector('.bar-in');
      var barH = barIn ? barIn.getBoundingClientRect().bottom + 10 : (bar ? bar.offsetHeight : 0);
      var y = Math.max(0, target.getBoundingClientRect().top + (window.scrollY || 0) - barH - 12);
      smooth.scrollTo(y, {
        duration: 1.15,
        easing: function (t) { return 1 - Math.pow(1 - t, 3); }
      });
      if (window.history && history.replaceState) history.replaceState(null, '', id);
    });

    linkScrollToGSAP();
  }

  function loadSmooth() {
    if (reduce || smooth || touchOnly()) return;
    if (window.Lenis) { initSmooth(); return; }
    var tag = doc.createElement('script');
    tag.src = SELF + 'assets/vendor/lenis/lenis.min.js';
    tag.async = true;
    tag.onload = initSmooth;
    doc.head.appendChild(tag);
  }

  if (root.classList.contains('loaded')) window.setTimeout(loadSmooth, 0);
  else window.addEventListener('saif:ready', loadSmooth, { once: true });

  /* ── pointer spotlight on project art ────────────────────────────────── */
  if (!reduce && window.matchMedia('(hover: hover)').matches) {
    Array.prototype.forEach.call(doc.querySelectorAll('.plate'), function (art) {
      art.addEventListener('pointermove', function (e) {
        var r = art.getBoundingClientRect();
        art.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 100).toFixed(1) + '%');
        art.style.setProperty('--my', ((e.clientY - r.top) / r.height * 100).toFixed(1) + '%');
      });
    });
  }
})();
