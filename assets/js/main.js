/* =========================================================
   Saif Al Jahan — portfolio interactions
   Vanilla JS, no dependencies.
   ========================================================= */
(function () {
  'use strict';

  var doc = document;
  var root = doc.documentElement;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- current year ---------- */
  var yearEl = doc.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- theme ---------- */
  var themeToggle = doc.querySelector('.theme-toggle');
  var metaTheme = doc.querySelector('meta[name="theme-color"]');

  function applyTheme(theme, persist) {
    root.setAttribute('data-theme', theme);
    if (persist) {
      try { localStorage.setItem('theme', theme); } catch (e) {}
    }
    if (metaTheme) metaTheme.setAttribute('content', theme === 'dark' ? '#0c0b0e' : '#f3f0e9');
    if (themeToggle) {
      var isDark = theme === 'dark';
      themeToggle.setAttribute('aria-pressed', String(isDark));
      themeToggle.setAttribute('aria-label', isDark ? 'Switch to light theme' : 'Switch to dark theme');
    }
  }

  applyTheme(root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light', false);

  if (themeToggle) {
    themeToggle.addEventListener('click', function () {
      var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      applyTheme(next, true);
    });
  }

  /* dark-mode changes while the tab is open and the visitor hasn't chosen */
  var media = window.matchMedia('(prefers-color-scheme: dark)');
  var onSchemeChange = function (event) {
    var stored = null;
    try { stored = localStorage.getItem('theme'); } catch (e) {}
    if (!stored) applyTheme(event.matches ? 'dark' : 'light', false);
  };
  if (media.addEventListener) media.addEventListener('change', onSchemeChange);
  else if (media.addListener) media.addListener(onSchemeChange);

  /* ---------- mobile navigation ---------- */
  var menuToggle = doc.querySelector('.menu-toggle');
  var nav = doc.getElementById('primary-nav');
  var navLinks = nav ? nav.querySelectorAll('a') : [];

  function setNav(open) {
    doc.body.classList.toggle('nav-open', open);
    if (menuToggle) {
      menuToggle.setAttribute('aria-expanded', String(open));
      menuToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    }
    if (open && navLinks.length) {
      window.setTimeout(function () { navLinks[0].focus(); }, 260);
    }
  }

  if (menuToggle && nav) {
    menuToggle.addEventListener('click', function () {
      setNav(!doc.body.classList.contains('nav-open'));
    });

    navLinks.forEach(function (link) {
      link.addEventListener('click', function () {
        if (doc.body.classList.contains('nav-open')) {
          setNav(false);
          if (menuToggle) menuToggle.focus();
        }
      });
    });

    doc.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && doc.body.classList.contains('nav-open')) {
        setNav(false);
        if (menuToggle) menuToggle.focus();
      }
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth > 960 && doc.body.classList.contains('nav-open')) setNav(false);
    });
  }

  /* ---------- header, progress, active section ---------- */
  var header = doc.getElementById('site-header');
  var progress = doc.getElementById('scroll-progress');
  var sections = Array.prototype.slice.call(doc.querySelectorAll('main section[id]'));
  var navMap = {};
  navLinks.forEach(function (link) {
    var href = link.getAttribute('href') || '';
    if (href.charAt(0) === '#' && href.length > 1) navMap[href.slice(1)] = link;
  });

  var ticking = false;

  function onScrollFrame() {
    var y = window.scrollY || window.pageYOffset;

    if (header) header.classList.toggle('is-scrolled', y > 6);

    if (progress) {
      var max = doc.documentElement.scrollHeight - window.innerHeight;
      var ratio = max > 0 ? Math.min(y / max, 1) : 0;
      progress.style.width = (ratio * 100).toFixed(2) + '%';
    }

    var current = '';
    sections.forEach(function (section) {
      if (y >= section.offsetTop - Math.round(window.innerHeight * 0.32)) current = section.id;
    });
    if (!current && sections.length) current = sections[0].id;

    Object.keys(navMap).forEach(function (id) {
      navMap[id].classList.toggle('is-active', id === current);
    });

    ticking = false;
  }

  function requestScrollFrame() {
    if (!ticking) {
      ticking = true;
      window.requestAnimationFrame(onScrollFrame);
    }
  }

  window.addEventListener('scroll', requestScrollFrame, { passive: true });
  window.addEventListener('resize', requestScrollFrame);
  onScrollFrame();

  /* ---------- reveal on scroll ---------- */
  var revealItems = Array.prototype.slice.call(doc.querySelectorAll('.reveal'));

  if (!('IntersectionObserver' in window) || reduceMotion) {
    revealItems.forEach(function (el) { el.classList.add('in'); });
  } else {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });

    revealItems.forEach(function (el) { revealObserver.observe(el); });
  }

  /* ---------- animated counters ---------- */
  var counters = Array.prototype.slice.call(doc.querySelectorAll('[data-count]'));
  var countersDone = false;

  function runCounters() {
    if (countersDone) return;
    countersDone = true;

    counters.forEach(function (el) {
      var target = parseInt(el.getAttribute('data-count'), 10) || 0;
      var suffix = el.getAttribute('data-suffix') || '';

      if (reduceMotion || !window.requestAnimationFrame) {
        el.textContent = target + suffix;
        return;
      }

      var duration = 1400;
      var start = null;

      function frame(now) {
        if (start === null) start = now;
        var p = Math.min((now - start) / duration, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(target * eased) + suffix;
        if (p < 1) window.requestAnimationFrame(frame);
      }

      window.requestAnimationFrame(frame);
    });
  }

  var statsEl = doc.querySelector('.stats-grid');
  if (statsEl && 'IntersectionObserver' in window) {
    var statsObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          runCounters();
          statsObserver.disconnect();
        }
      });
    }, { threshold: 0.35 });
    statsObserver.observe(statsEl);
  } else {
    runCounters();
  }

  /* ---------- marquee / ticker duplication ---------- */
  function fillTrack(trackSelector, itemSelector, total) {
    var track = doc.querySelector(trackSelector);
    if (!track) return;
    var items = track.querySelectorAll(itemSelector);
    if (!items.length) return;

    var base = items[0];
    var current = items.length;
    while (current < total) {
      var clone = base.cloneNode(true);
      clone.setAttribute('aria-hidden', 'true');
      track.appendChild(clone);
      current += 1;
    }
  }

  fillTrack('.ticker-track', '.ticker-group', 4);
  fillTrack('.marquee-track', '.marquee-group', 6);

  /* ---------- live local time (Asia/Dhaka, GMT+6) ---------- */
  var clocks = doc.querySelectorAll('[data-clock]');
  var timeFormatter;

  try {
    timeFormatter = new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Asia/Dhaka',
      hour: '2-digit',
      minute: '2-digit',
      hourCycle: 'h23'
    });
  } catch (e) {
    timeFormatter = null;
  }

  function updateClock() {
    if (!timeFormatter) return;
    var time = timeFormatter.format(new Date());
    clocks.forEach(function (el) {
      el.textContent = time + ' local (GMT+6)';
    });
  }

  if (clocks.length) {
    updateClock();
    window.setInterval(updateClock, 30000);
  }

  /* ---------- copy email ---------- */
  var toast = doc.getElementById('toast');
  var toastTimer;

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('is-visible');
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(function () {
      toast.classList.remove('is-visible');
    }, 2600);
  }

  doc.querySelectorAll('[data-copy]').forEach(function (button) {
    button.addEventListener('click', function () {
      var value = button.getAttribute('data-copy') || '';
      var label = button.querySelector('[data-copy-label]');
      var icon = button.querySelector('use');

      function done() {
        showToast('Email copied — talk soon.');
        if (label) {
          var original = label.textContent;
          label.textContent = 'Copied';
          window.setTimeout(function () { label.textContent = original; }, 2200);
        }
        if (icon) {
          var prev = icon.getAttribute('href');
          icon.setAttribute('href', '#i-check');
          window.setTimeout(function () { icon.setAttribute('href', prev); }, 2200);
        }
      }

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(value).then(done).catch(fallbackCopy);
      } else {
        fallbackCopy();
      }

      function fallbackCopy() {
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
    });
  });

  /* ---------- faq: one answer at a time ---------- */
  var faqItems = Array.prototype.slice.call(doc.querySelectorAll('.faq-item'));
  faqItems.forEach(function (item) {
    item.addEventListener('toggle', function () {
      if (!item.open) return;
      faqItems.forEach(function (other) {
        if (other !== item && other.open) other.open = false;
      });
    });
  });

  /* ---------- gentle pointer parallax on project art ---------- */
  if (!reduceMotion && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    doc.querySelectorAll('.project').forEach(function (project) {
      var art = project.querySelector('.cover');
      if (!art) return;

      project.addEventListener('pointermove', function (event) {
        var rect = project.getBoundingClientRect();
        var x = (event.clientX - rect.left) / rect.width - 0.5;
        var y = (event.clientY - rect.top) / rect.height - 0.5;
        art.style.transform = 'scale(1.015) translate(' + (x * -6).toFixed(2) + 'px, ' + (y * -6).toFixed(2) + 'px)';
      });

      project.addEventListener('pointerleave', function () {
        art.style.transform = '';
      });
    });
  }
})();
