// js/scroll-top.js
(() => {
  const btn = document.getElementById('scrollToTop');
  if (!btn) return;

  const docEl = document.documentElement;
  const root = document.documentElement;

  let ticking = false;
  const SHOW_AFTER_PX = 200;  // show after 200px scrolled

  function getScrollableHeight() {
    return Math.max(
      docEl.scrollHeight,
      document.body.scrollHeight
    ) - window.innerHeight;
  }

  function update() {
    const y = window.scrollY || window.pageYOffset || 0;
    const max = Math.max(getScrollableHeight(), 1); // avoid /0
    const pct = Math.min(100, Math.max(0, (y / max) * 100));

    // Update CSS var for the conic-gradient
    btn.style.setProperty('--p', pct.toFixed(2) + '%');

    // Toggle visibility
    if (y > SHOW_AFTER_PX && max > 0) {
      btn.classList.add('is-visible');
    } else {
      btn.classList.remove('is-visible');
    }

    ticking = false;
  }

  function requestUpdate() {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(update);
    }
  }

  // click to top
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    // Respect reduced motion
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: prefersReduced ? 'auto' : 'smooth' });
  });

  // Keyboard accessibility (Enter/Space)
  btn.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      btn.click();
    }
  });

  // Listen for scroll & resize
  window.addEventListener('scroll', requestUpdate, { passive: true });
  window.addEventListener('resize', requestUpdate);

  // Initial paint
  requestUpdate();
})();
