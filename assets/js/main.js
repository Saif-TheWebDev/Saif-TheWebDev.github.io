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
    setScrollLock(open);
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
  var band = doc.querySelector('.about-band');
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
        if (band) {
          var r = band.getBoundingClientRect();
          bar.classList.toggle('is-inverse', r.top <= 76 && r.bottom >= 76);
        }
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
      var stats = gsap.utils.toArray('.hero-base .stat');

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
      if (sub) gsap.set(sub, { y: 16, autoAlpha: 0 });
      if (ctas.length) gsap.set(ctas, { y: 14, autoAlpha: 0 });
      if (stats.length) gsap.set(stats, { y: 12, autoAlpha: 0 });

      var tl = gsap.timeline({ paused: true, defaults: { ease: 'power3.out' } });
      if (heroTag) tl.to(heroTag, { y: 0, autoAlpha: 1, duration: 0.55 });
      if (lines.length) tl.to(lines, { y: 0, yPercent: 0, duration: 1.05, stagger: 0.085 }, '-=0.28');
      if (em) tl.to(em, { y: 0, yPercent: 0, autoAlpha: 1, rotate: 0, duration: 0.8 }, '-=0.5');
      if (sub) tl.to(sub, { y: 0, autoAlpha: 1, duration: 0.7 }, '-=0.55');
      if (ctas.length) tl.to(ctas, { y: 0, autoAlpha: 1, duration: 0.6, stagger: 0.075 }, '-=0.45');
      if (stats.length) tl.to(stats, { y: 0, autoAlpha: 1, duration: 0.55, stagger: 0.065 }, '-=0.42');

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
      tag.src = 'assets/vendor/gsap/ScrollTrigger.min.js';
      tag.async = true;
      tag.onload = wireRail;
      doc.head.appendChild(tag);
    }

    if (root.classList.contains('loaded')) window.setTimeout(loadRail, 0);
    else window.addEventListener('saif:ready', loadRail, { once: true });
  })();

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
      var barH = bar ? bar.offsetHeight : 0;
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
    tag.src = 'assets/vendor/lenis/lenis.min.js';
    tag.async = true;
    tag.onload = initSmooth;
    doc.head.appendChild(tag);
  }

  if (root.classList.contains('loaded')) window.setTimeout(loadSmooth, 0);
  else window.addEventListener('saif:ready', loadSmooth, { once: true });

  /* ── pointer spotlight on project art ────────────────────────────────── */
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
