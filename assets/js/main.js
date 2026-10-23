/* =========================================================================
   Saif Al Jahan — portfolio interactions
   Vanilla JS, no dependencies.
   ========================================================================= */
(function () {
  'use strict';

  var doc = document;
  var root = doc.documentElement;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── year ──────────────────────────────────────────────────────────── */
  var yearEl = doc.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ── theme ─────────────────────────────────────────────────────────── */
  var themeBtn = doc.querySelector('.theme-btn');
  var themeMeta = doc.querySelector('meta[name="theme-color"]');

  function applyTheme(theme, persist) {
    root.setAttribute('data-theme', theme);
    if (persist) { try { localStorage.setItem('theme', theme); } catch (e) {} }
    if (themeMeta) themeMeta.setAttribute('content', theme === 'dark' ? '#0f0e0b' : '#faf8f2');
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

  var scheme = window.matchMedia('(prefers-color-scheme: dark)');
  function onScheme(event) {
    var stored = null;
    try { stored = localStorage.getItem('theme'); } catch (e) {}
    if (!stored) applyTheme(event.matches ? 'dark' : 'light', false);
  }
  if (scheme.addEventListener) scheme.addEventListener('change', onScheme);
  else if (scheme.addListener) scheme.addListener(onScheme);

  /* ── mobile nav ────────────────────────────────────────────────────── */
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
      window.setTimeout(function () { navLinks[0].focus(); }, 260);
    }
  }

  if (menuBtn && nav) {
    menuBtn.addEventListener('click', function () {
      setNav(!doc.body.classList.contains('nav-open'));
    });
    navLinks.forEach(function (link) {
      link.addEventListener('click', function () {
        if (doc.body.classList.contains('nav-open')) { setNav(false); menuBtn.focus(); }
      });
    });
    doc.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && doc.body.classList.contains('nav-open')) { setNav(false); menuBtn.focus(); }
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth > 960 && doc.body.classList.contains('nav-open')) setNav(false);
    });
  }

  /* ── header, progress, active section ──────────────────────────────── */
  var bar = doc.getElementById('bar');
  var progress = doc.getElementById('progress');
  var sections = Array.prototype.slice.call(doc.querySelectorAll('main section[id]'));
  var navMap = {};
  navLinks.forEach(function (link) {
    var href = link.getAttribute('href') || '';
    if (href.charAt(0) === '#' && href.length > 1) navMap[href.slice(1)] = link;
  });

  var ticking = false;

  function frame() {
    var y = window.scrollY || window.pageYOffset;

    if (bar) bar.classList.toggle('is-scrolled', y > 6);

    if (progress) {
      var max = doc.documentElement.scrollHeight - window.innerHeight;
      progress.style.width = (max > 0 ? Math.min(y / max, 1) * 100 : 0).toFixed(2) + '%';
    }

    var current = '';
    sections.forEach(function (section) {
      if (y >= section.offsetTop - Math.round(window.innerHeight * 0.3)) current = section.id;
    });
    if (!current && sections.length) current = sections[0].id;
    Object.keys(navMap).forEach(function (id) {
      navMap[id].classList.toggle('is-active', id === current);
    });

    ticking = false;
  }

  function requestFrame() {
    if (!ticking) { ticking = true; window.requestAnimationFrame(frame); }
  }

  window.addEventListener('scroll', requestFrame, { passive: true });
  window.addEventListener('resize', requestFrame);
  frame();

  /* ── reveal ────────────────────────────────────────────────────────── */
  var reveals = Array.prototype.slice.call(doc.querySelectorAll('.reveal'));

  if (!('IntersectionObserver' in window) || reduce) {
    reveals.forEach(function (el) { el.classList.add('in'); });
  } else {
    var revealObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          revealObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -5% 0px' });
    reveals.forEach(function (el) { revealObs.observe(el); });
  }

  /* ── counters ──────────────────────────────────────────────────────── */
  var counters = Array.prototype.slice.call(doc.querySelectorAll('[data-count]'));
  var counted = false;

  function runCounters() {
    if (counted) return;
    counted = true;

    counters.forEach(function (el) {
      var target = parseInt(el.getAttribute('data-count'), 10) || 0;
      if (reduce || !window.requestAnimationFrame) { el.textContent = target; return; }

      var start = null;
      function tick(now) {
        if (start === null) start = now;
        var p = Math.min((now - start) / 1300, 1);
        el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
        if (p < 1) window.requestAnimationFrame(tick);
      }
      window.requestAnimationFrame(tick);
    });
  }

  var spec = doc.querySelector('.spec');
  if (spec && 'IntersectionObserver' in window) {
    var specObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { runCounters(); specObs.disconnect(); }
      });
    }, { threshold: 0.4 });
    specObs.observe(spec);
  } else {
    runCounters();
  }

  /* ── ticker duplication ────────────────────────────────────────────── */
  var ticker = doc.getElementById('ticker');
  if (ticker) {
    var set = ticker.querySelector('.ticker-set');
    if (set) {
      while (ticker.children.length < 4) {
        var clone = set.cloneNode(true);
        clone.setAttribute('aria-hidden', 'true');
        ticker.appendChild(clone);
      }
    }
  }

  /* ── live Dhaka time ───────────────────────────────────────────────── */
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
    clocks.forEach(function (el) { el.textContent = t + ' (GMT+6)'; });
  }
  if (clocks.length) { updateClock(); window.setInterval(updateClock, 30000); }

  /* ── copy email ────────────────────────────────────────────────────── */
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

  /* ── faq accordion ─────────────────────────────────────────────────── */
  var items = Array.prototype.slice.call(doc.querySelectorAll('.q'));
  items.forEach(function (item) {
    item.addEventListener('toggle', function () {
      if (!item.open) return;
      items.forEach(function (other) { if (other !== item && other.open) other.open = false; });
    });
  });

})();
