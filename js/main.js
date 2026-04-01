/* =====================================================
   МИХАИЛ ПАК — main.js
   Интерактивность: навигация, лайтбокс, табы, анимации
   ===================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ----- STICKY HEADER ----- */
  const header = document.getElementById('site-header');
  function updateHeader() {
    if (window.scrollY > 60) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }
  window.addEventListener('scroll', updateHeader, { passive: true });
  updateHeader();

  /* ----- MOBILE MENU ----- */
  const navToggle = document.getElementById('nav-toggle');
  const navMenu   = document.getElementById('nav-menu');

  navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('open');
    const open = navMenu.classList.contains('open');
    navToggle.setAttribute('aria-expanded', String(open));
    navToggle.classList.toggle('active', open);
  });

  // Close menu on nav link click
  navMenu.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('open');
      navToggle.classList.remove('active');
    });
  });

  /* ----- ACTIVE NAV ON SCROLL ----- */
  const sections = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.nav-link');

  function activateNav() {
    let current = '';
    sections.forEach(sec => {
      const top = sec.offsetTop - 100;
      if (window.scrollY >= top) current = sec.id;
    });
    navLinks.forEach(link => {
      link.classList.toggle(
        'active-nav',
        link.getAttribute('href') === '#' + current
      );
    });
  }
  window.addEventListener('scroll', activateNav, { passive: true });

  /* ----- LIGHTBOX ----- */
  const lightbox    = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCap = document.getElementById('lightbox-caption');
  const lbClose     = document.getElementById('lightbox-close');
  const lbOverlay   = document.getElementById('lightbox-overlay');

  function openLightbox(src, title) {
    lightboxImg.src = src;
    lightboxImg.alt = title;
    lightboxCap.textContent = title;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
    setTimeout(() => { lightboxImg.src = ''; }, 300);
  }

  // Attach to gallery items (only non-video)
  document.querySelectorAll('.gallery-item:not(.gallery-item-more)').forEach(item => {
    const wrap = item.querySelector('.gallery-img-wrap');
    if (!wrap || wrap.classList.contains('gallery-img-video')) return;

    wrap.style.cursor = 'pointer';
    wrap.addEventListener('click', () => {
      const src   = item.dataset.src   || wrap.querySelector('img').src;
      const title = item.dataset.title || item.querySelector('.gallery-caption-title')?.textContent || '';
      openLightbox(src, title);
    });
  });

  lbClose.addEventListener('click', closeLightbox);
  lbOverlay.addEventListener('click', closeLightbox);
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeLightbox();
  });

  /* ----- BOOK TABS ----- */
  const tabBtns   = document.querySelectorAll('.tab-btn');
  const tabPanels = document.querySelectorAll('.tab-panel');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.tab;

      tabBtns.forEach(b => b.classList.remove('tab-btn--active'));
      tabPanels.forEach(p => p.classList.remove('tab-panel--active'));

      btn.classList.add('tab-btn--active');
      const panel = document.getElementById('tab-' + target);
      if (panel) panel.classList.add('tab-panel--active');
    });
  });

  /* ----- SCROLL REVEAL (lightweight) ----- */
  const revealEls = document.querySelectorAll(
    '.book-card, .gallery-item, .award-item, .vtornik-issue, .link-card, .buy-card, .art-fact, .story-item, .vt-stat'
  );

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  // Add initial style
  revealEls.forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = `opacity 0.55s ease ${(i % 6) * 0.07}s, transform 0.55s ease ${(i % 6) * 0.07}s`;
    observer.observe(el);
  });

  // Apply revealed state
  const style = document.createElement('style');
  style.textContent = '.revealed { opacity: 1 !important; transform: translateY(0) !important; }';
  document.head.appendChild(style);

  /* ----- SMOOTH SCROLL for anchor links ----- */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 72;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  /* ----- HAMBURGER ANIMATION ----- */
  const style2 = document.createElement('style');
  style2.textContent = `
    .nav-toggle.active span:nth-child(1) { transform: rotate(45deg) translate(5px, 5px); }
    .nav-toggle.active span:nth-child(2) { opacity: 0; transform: scaleX(0); }
    .nav-toggle.active span:nth-child(3) { transform: rotate(-45deg) translate(5px, -5px); }
    .nav-link.active-nav { color: var(--clr-warm) !important; }
  `;
  document.head.appendChild(style2);

});
