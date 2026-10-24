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
     The percentage is honest: it tracks elapsed time and the real readiness
     signals (window load + fonts), holds short of 100 until both are in, and
     then finishes. It is decorative, so it stays aria-hidden throughout and
     never takes focus.
     ────────────────────────────────────────────────────────────────────── */
  var loader = doc.getElementById('loader');
  var loaderNum = doc.getElementById('loader-num');
  var loaderFill = doc.getElementById('loader-fill');
  var loaderPhrase = doc.getElementById('loader-phrase');

  function endLoader() {
    root.classList.add('loaded');
    root.classList.remove('loading');
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
    }, 820);

    var ready = doc.readyState === 'complete';
    var fontsReady = !doc.fonts;
    window.addEventListener('load', function () { ready = true; });
    if (doc.fonts && doc.fonts.ready) {
      doc.fonts.ready.then(function () { fontsReady = true; });
    }

    var start = (window.performance && window.performance.now) ? window.performance.now() : Date.now();
    var MIN_MS = 1250;
    var shown = 0;
    var done = false;

    function finish() {
      done = true;
      window.clearInterval(phraseTimer);
      if (loaderNum) loaderNum.textContent = '100';
      if (loaderFill) loaderFill.style.width = '100%';
      window.setTimeout(endLoader, 160);
    }

    function tick(now) {
      if (done) return;
      var elapsed = now - start;
      var target = Math.min(1, elapsed / MIN_MS);

      /* Hold at 90% until the document and the font are both in; once they are,
         stop easing toward the finish and take it — the asymptotic tail was
         costing half a second of staring at "97%". */
      if (ready && fontsReady && elapsed >= MIN_MS) { finish(); return; }
      if (!ready || !fontsReady) target = Math.min(target, 0.9);

      shown += (target - shown) * 0.18;

      if (loaderNum) loaderNum.textContent = String(Math.min(99, Math.round(shown * 100)));
      if (loaderFill) loaderFill.style.width = Math.min(99, shown * 100).toFixed(1) + '%';

      window.requestAnimationFrame(tick);
    }

    if (window.requestAnimationFrame) window.requestAnimationFrame(tick);
    else finish();

    /* rAF stops in background tabs, and a stalled frame must never keep the
       curtain up: this mirrors the stylesheet's own six-second escape. */
    window.setTimeout(function () {
      if (!done) finish();
    }, 5000);
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
  var nav = doc.getElementById('nav');
  var navLinks = nav ? Array.prototype.slice.call(nav.querySelectorAll('a')) : [];

  function setNav(open) {
    doc.body.classList.toggle('nav-open', open);
    if (menuBtn) {
      menuBtn.setAttribute('aria-expanded', String(open));
      menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    }
    if (open && navLinks.length) {
      window.setTimeout(function () { navLinks[0].focus(); }, 280);
    }
  }

  if (menuBtn && nav) {
    menuBtn.addEventListener('click', function () {
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
  }

  /* ── header state + reading progress ─────────────────────────────────── */
  var bar = doc.getElementById('bar');
  var progress = doc.getElementById('progress');
  var pending = false;

  function onScroll() {
    if (pending) return;
    pending = true;
    window.requestAnimationFrame(function () {
      pending = false;
      var y = window.scrollY || window.pageYOffset;
      if (bar) bar.classList.toggle('is-stuck', y > 18);
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

  /* ── counters ────────────────────────────────────────────────────────── */
  var counters = Array.prototype.slice.call(doc.querySelectorAll('[data-count]'));
  var counted = false;

  function runCounters() {
    if (counted) return;
    counted = true;

    counters.forEach(function (el) {
      var target = parseInt(el.getAttribute('data-count'), 10) || 0;
      if (reduce || !window.requestAnimationFrame) { el.textContent = target; return; }

      var begin = null;
      function tick(now) {
        if (begin === null) begin = now;
        var p = Math.min((now - begin) / 1300, 1);
        el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
        if (p < 1) window.requestAnimationFrame(tick);
      }
      window.requestAnimationFrame(tick);
    });
  }

  var stats = doc.querySelector('.stats');
  if (stats && 'IntersectionObserver' in window) {
    var statObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { runCounters(); statObs.disconnect(); }
      });
    }, { threshold: 0.4 });
    statObs.observe(stats);
  } else {
    runCounters();
  }

  /* ── marquee fill ──────────────────────────────────────────────────────
     Two sets are in the HTML so the strip is complete without scripting. On
     wide viewports one set can be narrower than the window, which would show
     a gap at the loop point — so clone until the track covers two screens and
     hand the stylesheet the real set width to travel.
     ────────────────────────────────────────────────────────────────────── */
  var marqueeTrack = doc.getElementById('marquee');
  if (marqueeTrack) {
    var firstSet = marqueeTrack.querySelector('.marquee-set');
    var originals = Array.prototype.slice.call(marqueeTrack.children);

    var fillMarquee = function () {
      if (!firstSet) return;
      while (marqueeTrack.children.length > originals.length) {
        marqueeTrack.removeChild(marqueeTrack.lastElementChild);
      }
      var setW = firstSet.getBoundingClientRect().width;
      if (!setW) return;

      /* Count what is needed up front rather than looping until a measured
         width looks big enough — a single stale measurement used to run the
         loop to its guard on very wide viewports. One set of travel must stay
         covered at every moment, so the track has to be viewport + one set. */
      var needed = Math.max(2, Math.ceil((window.innerWidth + setW) / setW) + 1);
      while (marqueeTrack.children.length < needed) {
        var clone = firstSet.cloneNode(true);
        clone.setAttribute('aria-hidden', 'true');
        marqueeTrack.appendChild(clone);
      }
      marqueeTrack.style.setProperty('--dist', setW + 'px');
      /* constant reading speed (≈38px/s) whatever width the strip has to fill */
      marqueeTrack.style.animationDuration = (setW / 38).toFixed(1) + 's';
    };

    fillMarquee();
    window.addEventListener('resize', function () {
      window.clearTimeout(fillMarquee.timer);
      fillMarquee.timer = window.setTimeout(fillMarquee, 200);
    });
  }

  /* ── marquee pause control (WCAG 2.2.2) ─────────────────────────────────
     The strip moves on its own for more than five seconds, so it has to offer
     a real, keyboard-operable way to stop — hover alone is not enough.
     ────────────────────────────────────────────────────────────────────── */
  var marqueeBtn = doc.querySelector('.marquee-btn');
  if (marqueeBtn) {
    var marqueeBox = marqueeBtn.closest('.marquee');
    marqueeBtn.addEventListener('click', function () {
      var paused = marqueeBox.classList.toggle('is-paused');
      marqueeBtn.setAttribute('aria-pressed', String(paused));
      marqueeBtn.setAttribute('aria-label', paused ? 'Resume the technology ticker' : 'Pause the technology ticker');
      var use = marqueeBtn.querySelector('use');
      if (use) use.setAttribute('href', paused ? '#i-play' : '#i-pause');
    });
  }

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

  /* ── faq accordion ───────────────────────────────────────────────────── */
  var items = Array.prototype.slice.call(doc.querySelectorAll('.q'));
  items.forEach(function (item) {
    item.addEventListener('toggle', function () {
      if (!item.open) return;
      items.forEach(function (other) { if (other !== item && other.open) other.open = false; });
    });
  });

  /* ── pointer spotlight on cards ──────────────────────────────────────── */
  if (!reduce && window.matchMedia('(hover: hover)').matches) {
    Array.prototype.forEach.call(doc.querySelectorAll('.card-art'), function (art) {
      art.addEventListener('pointermove', function (e) {
        var r = art.getBoundingClientRect();
        art.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 100).toFixed(1) + '%');
        art.style.setProperty('--my', ((e.clientY - r.top) / r.height * 100).toFixed(1) + '%');
      });
    });
  }
})();
