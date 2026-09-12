/* ============================================================
   MAIRIE DES AGUÉGUÉS — JavaScript Principal
   ============================================================ */

(function () {
  'use strict';

  /* ===== TOPBAR HEIGHT ADJUSTMENT ===== */
  function updateHeaderTop() {
    const topbar = document.querySelector('.topbar');
    const header = document.querySelector('.header');
    if (!header) return;
    const topbarH = topbar && getComputedStyle(topbar).display !== 'none' ? topbar.offsetHeight : 0;
    header.style.top = topbarH + 'px';
  }
  updateHeaderTop();

  /* ===== STICKY HEADER ===== */
  const header = document.getElementById('header');
  const backToTop = document.getElementById('backToTop');

  window.addEventListener('scroll', function () {
    const scrollY = window.scrollY;

    if (header) {
      header.classList.toggle('scrolled', scrollY > 80);
    }

    if (backToTop) {
      backToTop.classList.toggle('visible', scrollY > 400);
    }

    updateActiveNavLink();
  }, { passive: true });

  /* ===== BACK TO TOP ===== */
  if (backToTop) {
    backToTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ===== HAMBURGER / MOBILE NAV ===== */
  const hamburger = document.getElementById('hamburger');
  const nav = document.getElementById('nav');

  if (hamburger && nav) {
    hamburger.addEventListener('click', function () {
      const isOpen = nav.classList.toggle('mobile-open');
      hamburger.classList.toggle('active', isOpen);
      hamburger.setAttribute('aria-expanded', isOpen.toString());
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close nav on link click
    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        nav.classList.remove('mobile-open');
        hamburger.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }

  /* ===== MOBILE DROPDOWNS ===== */
  document.querySelectorAll('.nav-dropdown > .nav-link').forEach(function (link) {
    link.addEventListener('click', function (e) {
      if (nav && nav.classList.contains('mobile-open')) {
        e.preventDefault();
        const parent = link.parentElement;
        parent.classList.toggle('open');
      }
    });
  });

  /* ===== SMOOTH SCROLL ===== */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const headerH = header ? header.offsetHeight : 0;
      const topbarH = document.querySelector('.topbar') ? document.querySelector('.topbar').offsetHeight : 0;
      const offset = headerH + topbarH + 16;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  /* ===== ACTIVE NAV LINK ===== */
  function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollY = window.scrollY + (header ? header.offsetHeight : 0) + 80;

    sections.forEach(function (section) {
      const top = section.offsetTop;
      const bottom = top + section.offsetHeight;
      const id = section.getAttribute('id');
      const link = document.querySelector(`.nav-link[href="#${id}"]`);
      if (link) {
        link.classList.toggle('active', scrollY >= top && scrollY < bottom);
      }
    });
  }

  /* ===== COUNTER ANIMATION ===== */
  function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-target'), 10);
    const duration = 2000;
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = Math.round(eased * target);
      el.textContent = value.toLocaleString('fr-FR');
      if (progress < 1) requestAnimationFrame(update);
    }

    requestAnimationFrame(update);
  }

  /* ===== SCROLL REVEAL ===== */
  const revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');

        // Trigger counters inside revealed elements
        entry.target.querySelectorAll('[data-target]').forEach(animateCounter);

        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

  // Counter observer for hero stats
  const counterObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('[data-target]').forEach(animateCounter);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  const heroStats = document.querySelector('.hero-stats');
  if (heroStats) counterObserver.observe(heroStats);

  // Add reveal classes dynamically
  function initReveal() {
    const sections = [
      { selector: '.quicklink-card',   cls: 'reveal', delay: 80 },
      { selector: '.news-featured',    cls: 'reveal-left' },
      { selector: '.news-side',        cls: 'reveal-right' },
      { selector: '.service-card',     cls: 'reveal', delay: 80 },
      { selector: '.tourisme-card',    cls: 'reveal', delay: 80 },
      { selector: '.conseiller-card',  cls: 'reveal', delay: 60 },
      { selector: '.galerie-item',     cls: 'reveal', delay: 80 },
      { selector: '.info-panel',       cls: 'reveal', delay: 100 },
      { selector: '.contact-info',     cls: 'reveal-left' },
      { selector: '.contact-form-wrap',cls: 'reveal-right' },
      { selector: '.section-header',   cls: 'reveal' },
      { selector: '.two-col .col-text',cls: 'reveal-left' },
      { selector: '.two-col .col-media',cls: 'reveal-right' },
      { selector: '.admin .col-text',  cls: 'reveal-right' },
      { selector: '.admin .col-media', cls: 'reveal-left' },
    ];

    sections.forEach(function (cfg) {
      document.querySelectorAll(cfg.selector).forEach(function (el, i) {
        el.classList.add(cfg.cls);
        if (cfg.delay) {
          el.style.transitionDelay = (i * cfg.delay) + 'ms';
        }
        revealObserver.observe(el);
      });
    });
  }

  initReveal();

  /* ===== CONTACT FORM ===== */
  const form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      const btn = document.getElementById('submit-btn');
      if (!btn) return;

      // Validate
      let valid = true;
      form.querySelectorAll('[required]').forEach(function (field) {
        if (!field.value.trim()) {
          valid = false;
          field.style.borderColor = '#ef4444';
        } else {
          field.style.borderColor = '';
        }
      });

      if (!valid) {
        showToast('Veuillez remplir tous les champs obligatoires.', 'error');
        return;
      }

      // Simulate sending
      btn.disabled = true;
      btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Envoi en cours…';

      setTimeout(function () {
        btn.disabled = false;
        btn.innerHTML = '<i class="fas fa-paper-plane"></i> Envoyer le Message';
        form.reset();
        showToast('✓ Votre message a été envoyé avec succès ! Nous vous répondrons sous 48h.', 'success');
      }, 2000);
    });

    // Live validation
    form.querySelectorAll('input, select, textarea').forEach(function (field) {
      field.addEventListener('input', function () {
        if (this.hasAttribute('required') && this.value.trim()) {
          this.style.borderColor = '';
        }
      });
    });
  }

  /* ===== TOAST NOTIFICATION ===== */
  function showToast(message, type) {
    const existing = document.querySelector('.toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'toast toast-' + (type || 'success');
    toast.innerHTML = message;

    const style = toast.style;
    style.position = 'fixed';
    style.bottom = '32px';
    style.left = '50%';
    style.transform = 'translateX(-50%) translateY(80px)';
    style.background = type === 'error' ? '#ef4444' : 'var(--color-primary)';
    style.color = '#fff';
    style.padding = '16px 28px';
    style.borderRadius = '9999px';
    style.fontFamily = 'Inter, sans-serif';
    style.fontSize = '0.9rem';
    style.fontWeight = '600';
    style.boxShadow = '0 8px 32px rgba(0,0,0,0.2)';
    style.zIndex = '9999';
    style.transition = 'transform 0.4s cubic-bezier(0.4,0,0.2,1), opacity 0.4s ease';
    style.opacity = '0';
    style.maxWidth = '90vw';
    style.textAlign = 'center';

    document.body.appendChild(toast);

    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        style.transform = 'translateX(-50%) translateY(0)';
        style.opacity = '1';
      });
    });

    setTimeout(function () {
      style.transform = 'translateX(-50%) translateY(80px)';
      style.opacity = '0';
      setTimeout(function () { toast.remove(); }, 400);
    }, 4000);
  }

  /* ===== GALLERY LIGHTBOX ===== */
  const galerieItems = document.querySelectorAll('.galerie-item');

  galerieItems.forEach(function (item) {
    item.addEventListener('click', function () {
      const img = item.querySelector('img');
      const caption = item.querySelector('.galerie-caption');
      if (!img) return;
      openLightbox(img.src, img.alt, caption ? caption.textContent : '');
    });
  });

  function openLightbox(src, alt, caption) {
    const lb = document.createElement('div');
    lb.className = 'lightbox';

    const lbStyle = lb.style;
    lbStyle.position = 'fixed';
    lbStyle.inset = '0';
    lbStyle.background = 'rgba(0,0,0,0.95)';
    lbStyle.display = 'flex';
    lbStyle.flexDirection = 'column';
    lbStyle.alignItems = 'center';
    lbStyle.justifyContent = 'center';
    lbStyle.zIndex = '10000';
    lbStyle.padding = '24px';
    lbStyle.opacity = '0';
    lbStyle.transition = 'opacity 0.3s ease';
    lbStyle.cursor = 'zoom-out';

    lb.innerHTML = `
      <button style="position:absolute;top:24px;right:24px;background:rgba(255,255,255,0.1);border:none;color:#fff;width:48px;height:48px;border-radius:50%;font-size:1.4rem;cursor:pointer;display:flex;align-items:center;justify-content:center;backdrop-filter:blur(8px);" aria-label="Fermer">✕</button>
      <img src="${src}" alt="${alt}" style="max-width:90vw;max-height:80vh;object-fit:contain;border-radius:8px;box-shadow:0 0 80px rgba(0,0,0,0.5);" />
      ${caption ? `<p style="color:rgba(255,255,255,0.75);margin-top:16px;font-size:0.9rem;font-family:Inter,sans-serif;">${caption}</p>` : ''}
    `;

    document.body.appendChild(lb);
    document.body.style.overflow = 'hidden';

    requestAnimationFrame(function () {
      requestAnimationFrame(function () { lb.style.opacity = '1'; });
    });

    function close() {
      lb.style.opacity = '0';
      setTimeout(function () {
        lb.remove();
        document.body.style.overflow = '';
      }, 300);
    }

    lb.addEventListener('click', close);
    lb.querySelector('button').addEventListener('click', function (e) {
      e.stopPropagation();
      close();
    });

    document.addEventListener('keydown', function handler(e) {
      if (e.key === 'Escape') { close(); document.removeEventListener('keydown', handler); }
    });
  }

  /* ===== HEADER LINK INDICATOR ===== */
  // Make header links link to their correct sections
  document.querySelectorAll('a[href="#histoire"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      e.preventDefault();
      const pres = document.getElementById('presentation');
      if (pres) { pres.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
    });
  });

  /* ===== WINDOW RESIZE ===== */
  let resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      updateHeaderTop();
      // Close mobile nav on resize to desktop
      if (window.innerWidth > 1024 && nav) {
        nav.classList.remove('mobile-open');
        if (hamburger) {
          hamburger.classList.remove('active');
          hamburger.setAttribute('aria-expanded', 'false');
        }
        document.body.style.overflow = '';
      }
    }, 150);
  });

  /* ===== PRELOADER ===== */
  window.addEventListener('load', function () {
    document.body.classList.add('loaded');
  });

  console.log('%c🌊 Mairie des Aguégués — Site officiel chargé', 'color:#2a9a56;font-size:14px;font-weight:bold;');

})();
