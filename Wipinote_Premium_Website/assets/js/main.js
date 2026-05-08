/* ================================================================
   WIPINOTE™ — main.js
   Premium 2026 interaction layer
   - Lenis smooth scroll
   - GSAP + ScrollTrigger entrance animations
   - Parallax hero cards (mouse + scroll)
   - Magnetic buttons
   - Animated counters
   - Premium testimonial slider
   - Mobile drawer + sticky header
   - Modals (cart, payment, email)
   - Cookie banner
   - Form validation
   ================================================================ */

(function () {
  'use strict';

  /* ---------- Helpers ---------- */
  var $  = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  var prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var storage = {
    get: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  };

  /* ---------- Lenis smooth scroll (loaded from CDN if available) ---------- */
  var lenis = null;
  if (window.Lenis && !prefersReduced) {
    try {
      lenis = new window.Lenis({
        duration: 1.15,
        easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); },
        smoothWheel: true,
        smoothTouch: false
      });
      function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
      requestAnimationFrame(raf);
      if (window.gsap && window.ScrollTrigger) {
        lenis.on('scroll', window.ScrollTrigger.update);
        window.gsap.ticker.add(function (time) { lenis.raf(time * 1000); });
        window.gsap.ticker.lagSmoothing(0);
      }
    } catch (e) { /* ignore */ }
  }

  /* ---------- Sticky header ---------- */
  var header = $('#siteHeader');
  if (header) {
    var onScroll = function () {
      if (window.scrollY > 8) header.classList.add('scrolled');
      else header.classList.remove('scrolled');
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---------- Mobile drawer ---------- */
  var toggle = $('#navToggle');
  var nav = $('#primaryNav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      document.body.style.overflow = open ? 'hidden' : '';
      if (lenis) { open ? lenis.stop() : lenis.start(); }
    });
    $$('a', nav).forEach(function (link) {
      link.addEventListener('click', function () {
        if (nav.classList.contains('open')) {
          nav.classList.remove('open');
          toggle.setAttribute('aria-expanded', 'false');
          document.body.style.overflow = '';
          if (lenis) lenis.start();
        }
      });
    });
  }

  /* ---------- Smooth scroll for hash links ---------- */
  $$('a[href^="#"]').forEach(function (a) {
    var href = a.getAttribute('href');
    if (!href || href === '#' || href.length < 2) return;
    a.addEventListener('click', function (e) {
      var target = $(href);
      if (!target) return;
      e.preventDefault();
      if (lenis) {
        lenis.scrollTo(target, { offset: -80, duration: 1.4 });
      } else {
        var top = target.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top: top, behavior: 'smooth' });
      }
    });
  });

  /* ---------- Reveal-on-scroll (IntersectionObserver fallback or with GSAP) ---------- */
  var revealEls = $$('.reveal, .reveal-stagger');
  if ('IntersectionObserver' in window && !prefersReduced) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-in'); });
  }

  /* Auto-tag common premium components for reveal */
  $$('.book-card, .why-card, .quote-card, .split-card, .stat, .badge-card, .printable-card, .post-card, .feature-row, .featured-post').forEach(function (el) {
    if (!el.classList.contains('reveal') && !el.closest('.reveal-stagger')) el.classList.add('reveal');
  });
  $$('.reveal').forEach(function (el) {
    if ('IntersectionObserver' in window && !prefersReduced) {
      var io2 = new IntersectionObserver(function (entries, obs) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { e.target.classList.add('is-in'); obs.unobserve(e.target); }
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
      io2.observe(el);
    } else {
      el.classList.add('is-in');
    }
  });

  /* ---------- GSAP entrance + scroll animations ---------- */
  if (window.gsap && !prefersReduced) {
    var gsap = window.gsap;
    if (window.ScrollTrigger) gsap.registerPlugin(window.ScrollTrigger);

    // Hero copy + visual entrance (no need with .hero-enter CSS, but layered for richness)
    gsap.from('.hero-copy .eyebrow', { y: 18, opacity: 0, duration: .9, ease: 'power3.out', delay: .1 });
    gsap.from('.hero-copy h1', { y: 30, opacity: 0, duration: 1.1, ease: 'power3.out', delay: .25 });
    gsap.from('.hero-copy .lede', { y: 24, opacity: 0, duration: .9, ease: 'power3.out', delay: .45 });
    gsap.from('.hero-ctas .btn', { y: 18, opacity: 0, duration: .8, ease: 'power3.out', delay: .6, stagger: .1 });
    gsap.from('.hero-trust li', { y: 12, opacity: 0, duration: .7, ease: 'power3.out', delay: .8, stagger: .08 });
    gsap.from('.float-card', { y: 30, opacity: 0, scale: .94, duration: 1.1, ease: 'power3.out', delay: .35, stagger: .15 });

    if (window.ScrollTrigger) {
      // Parallax on hero blobs
      $$('.hero-blob').forEach(function (b, i) {
        gsap.to(b, {
          y: (i % 2 === 0) ? -80 : 60,
          x: (i % 2 === 0) ? 30 : -40,
          ease: 'none',
          scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
        });
      });
      // Float-card scroll parallax
      $$('.float-card').forEach(function (c, i) {
        gsap.to(c, {
          y: (i + 1) * -30,
          ease: 'none',
          scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1.5 }
        });
      });
      // Section heads slide in
      $$('.section-head').forEach(function (h) {
        gsap.from(h, {
          y: 36, opacity: 0, duration: 1, ease: 'power3.out',
          scrollTrigger: { trigger: h, start: 'top 85%', toggleActions: 'play none none none' }
        });
      });
    }
  }

  /* ---------- Mouse-parallax on hero visual ---------- */
  var heroVisual = $('.hero-visual');
  if (heroVisual && !prefersReduced) {
    var cards = $$('.float-card', heroVisual);
    var rect = null;
    var update = function () { rect = heroVisual.getBoundingClientRect(); };
    update();
    window.addEventListener('resize', update);
    heroVisual.addEventListener('mousemove', function (e) {
      if (!rect) return;
      var x = (e.clientX - rect.left) / rect.width - .5;
      var y = (e.clientY - rect.top) / rect.height - .5;
      cards.forEach(function (c, i) {
        var depth = (i + 1) * 8;
        c.style.transform = 'translate(' + (x * depth) + 'px, ' + (y * depth) + 'px) ' + (c.dataset.rot || '');
      });
    });
    heroVisual.addEventListener('mouseleave', function () {
      cards.forEach(function (c) { c.style.transform = ''; });
    });
    cards.forEach(function (c) {
      var t = window.getComputedStyle(c).transform;
      // capture original rotate via class — we leave CSS animations intact
    });
  }

  /* ---------- Magnetic buttons ---------- */
  if (!prefersReduced) {
    $$('.btn, .icon-btn').forEach(function (btn) {
      var strength = btn.classList.contains('icon-btn') ? 8 : 14;
      btn.addEventListener('mousemove', function (e) {
        var r = btn.getBoundingClientRect();
        var x = e.clientX - r.left - r.width / 2;
        var y = e.clientY - r.top - r.height / 2;
        btn.style.transform = 'translate(' + (x / r.width * strength) + 'px, ' + (y / r.height * strength) + 'px)';
      });
      btn.addEventListener('mouseleave', function () { btn.style.transform = ''; });
    });
  }

  /* ---------- Animated counters ---------- */
  if ('IntersectionObserver' in window) {
    var stats = $$('.stat-num[data-count]');
    var statIo = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        var target = parseFloat(el.getAttribute('data-count') || '0');
        var suffix = el.getAttribute('data-suffix') || '';
        var prefix = el.getAttribute('data-prefix') || '';
        var dur = 1800;
        var start = performance.now();
        var step = function (now) {
          var p = Math.min(1, (now - start) / dur);
          var eased = 1 - Math.pow(1 - p, 3);
          var val = target * eased;
          var display = (target % 1 === 0) ? Math.round(val).toLocaleString() : val.toFixed(1);
          el.textContent = prefix + display + suffix;
          if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
        statIo.unobserve(el);
      });
    }, { threshold: 0.4 });
    stats.forEach(function (s) { statIo.observe(s); });
  }

  /* ---------- Premium testimonial carousel ---------- */
  $$('.tcarousel').forEach(function (carousel) {
    var track = carousel.querySelector('.tcarousel-track');
    var slides = $$('.tcarousel-slide', carousel);
    if (!track || slides.length === 0) return;
    var idx = 0;
    var dotsWrap = carousel.querySelector('.tcarousel-dots');
    if (dotsWrap) {
      dotsWrap.innerHTML = '';
      slides.forEach(function (_, i) {
        var d = document.createElement('button');
        d.className = 'tcarousel-dot' + (i === 0 ? ' active' : '');
        d.setAttribute('aria-label', 'Go to slide ' + (i + 1));
        d.addEventListener('click', function () { go(i); });
        dotsWrap.appendChild(d);
      });
    }
    var dots = $$('.tcarousel-dot', carousel);
    var go = function (n) {
      idx = (n + slides.length) % slides.length;
      track.style.transform = 'translateX(-' + (idx * 100) + '%)';
      dots.forEach(function (d, i) { d.classList.toggle('active', i === idx); });
    };
    var prev = carousel.querySelector('.tcarousel-prev');
    var next = carousel.querySelector('.tcarousel-next');
    if (prev) prev.addEventListener('click', function () { go(idx - 1); });
    if (next) next.addEventListener('click', function () { go(idx + 1); });
    var auto = setInterval(function () { go(idx + 1); }, 7000);
    carousel.addEventListener('mouseenter', function () { clearInterval(auto); });
    carousel.addEventListener('mouseleave', function () { auto = setInterval(function () { go(idx + 1); }, 7000); });
    // Touch swipe
    var startX = 0, endX = 0;
    track.addEventListener('touchstart', function (e) { startX = e.touches[0].clientX; }, { passive: true });
    track.addEventListener('touchmove', function (e) { endX = e.touches[0].clientX; }, { passive: true });
    track.addEventListener('touchend', function () {
      var diff = startX - endX;
      if (Math.abs(diff) > 50) { go(idx + (diff > 0 ? 1 : -1)); }
      startX = endX = 0;
    });
  });

  /* ---------- Modal system ---------- */
  var openModal = function (id) {
    var m = $('#' + id);
    if (!m) return;
    m.classList.add('open');
    m.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    if (lenis) lenis.stop();
    var focusable = m.querySelector('button, [href], input, textarea, select');
    if (focusable) setTimeout(function () { focusable.focus(); }, 80);
  };
  var closeModal = function (m) {
    if (!m) return;
    m.classList.remove('open');
    m.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (lenis) lenis.start();
  };
  $$('[data-open-modal]').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      openModal(btn.getAttribute('data-open-modal'));
    });
  });
  $$('.modal-overlay').forEach(function (m) {
    m.addEventListener('click', function (e) { if (e.target === m) closeModal(m); });
    $$('[data-close]', m).forEach(function (b) {
      b.addEventListener('click', function () { closeModal(m); });
    });
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      var open = $('.modal-overlay.open');
      if (open) closeModal(open);
    }
  });

  /* ---------- Newsletter form ---------- */
  $$('.js-newsletter').forEach(function (form) {
    var msg = form.querySelector('.form-msg');
    var input = form.querySelector('input[type="email"]');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var val = (input.value || '').trim();
      if (!emailRe.test(val)) {
        if (msg) { msg.textContent = 'Please enter a valid email address.'; msg.classList.add('error'); }
        input.focus();
        return;
      }
      if (msg) { msg.classList.remove('error'); msg.textContent = '✓ Thanks! Check your inbox for the starter pack.'; }
      form.reset();
      storage.set('wipinote_subscribed', '1');
    });
  });

  /* ---------- Contact form ---------- */
  var contactForm = $('#contactForm');
  if (contactForm) {
    var contactMsg = $('#contactMsg');
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var data = new FormData(contactForm);
      var name = (data.get('name') || '').toString().trim();
      var email = (data.get('email') || '').toString().trim();
      var message = (data.get('message') || '').toString().trim();
      if (!name || !email || !message) {
        contactMsg.textContent = 'Please fill in every field.';
        contactMsg.classList.add('error');
        return;
      }
      if (!emailRe.test(email)) {
        contactMsg.textContent = 'Please enter a valid email address.';
        contactMsg.classList.add('error');
        return;
      }
      contactMsg.classList.remove('error');
      contactMsg.textContent = '✓ Thanks! We\'ll reply within 1 business day.';
      contactForm.reset();
    });
  }

  /* ---------- Cart counter (demo state) ---------- */
  var cartBtn = $('#cartBtn');
  if (cartBtn) {
    var badge = cartBtn.querySelector('.badge');
    var current = parseInt(storage.get('wipinote_cart') || '0', 10);
    if (badge) badge.textContent = current;
    $$('[data-add-to-cart]').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        current += 1;
        storage.set('wipinote_cart', String(current));
        if (badge) {
          badge.textContent = current;
          badge.animate(
            [{ transform: 'scale(1)' }, { transform: 'scale(1.3)' }, { transform: 'scale(1)' }],
            { duration: 380, easing: 'cubic-bezier(.34,1.56,.64,1)' }
          );
        }
        var label = btn.textContent;
        btn.textContent = '✓ Added';
        btn.disabled = true;
        setTimeout(function () { btn.textContent = label; btn.disabled = false; }, 1500);
        openModal('cartModal');
      });
    });
  }

  /* ---------- Buy Now / Payment modal ---------- */
  $$('[data-buy-now]').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      var product = btn.getAttribute('data-buy-now') || 'Selected item';
      var label = $('#payProductName');
      if (label) label.textContent = product;
      openModal('payModal');
    });
  });

  /* ---------- Email signup auto-popup ---------- */
  var emailModal = $('#emailModal');
  if (emailModal && !storage.get('wipinote_email_seen') && !storage.get('wipinote_subscribed')) {
    setTimeout(function () {
      openModal('emailModal');
      storage.set('wipinote_email_seen', '1');
    }, 18000);
  }

  /* ---------- Cookie banner ---------- */
  var cookie = $('#cookieBanner');
  if (cookie && !storage.get('wipinote_cookies')) {
    setTimeout(function () { cookie.classList.add('show'); }, 1200);
    $$('[data-cookie-accept]', cookie).forEach(function (b) {
      b.addEventListener('click', function () { storage.set('wipinote_cookies', 'accepted'); cookie.classList.remove('show'); });
    });
    $$('[data-cookie-decline]', cookie).forEach(function (b) {
      b.addEventListener('click', function () { storage.set('wipinote_cookies', 'declined'); cookie.classList.remove('show'); });
    });
  }

  /* ---------- Keyboard focus styling ---------- */
  function handleFirstTab(e) {
    if (e.key === 'Tab') {
      document.body.classList.add('user-tabbing');
      window.removeEventListener('keydown', handleFirstTab);
    }
  }
  window.addEventListener('keydown', handleFirstTab);

  /* ---------- Year stamp ---------- */
  $$('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });

})();
