document.addEventListener('DOMContentLoaded', () => {
  // only on mobile
  if (!window.matchMedia('(max-width: 768px)').matches) return;

  const cards = document.querySelectorAll('.services-grid .service-item');
  if (!cards.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      entry.target.classList.toggle('in-view', entry.isIntersecting);
    });
  }, {
    root: null,
    threshold: 0.8  // when 50% of the card is visible
  });

  cards.forEach(card => observer.observe(card));
});
