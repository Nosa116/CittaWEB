// hamburger.js
document.addEventListener('DOMContentLoaded', () => {
  const hamburger = document.querySelector('.hamburger');
  const navLinks  = document.querySelector('.nav-links');

  hamburger.addEventListener('click', () => {

+   navLinks.classList.toggle('open');
+   hamburger.classList.toggle('open');
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      if (navLinks.classList.contains('open')) {
        navLinks.classList.remove('open');

+       hamburger.classList.remove('open');
      }
    });
  });

  // (optional) staggered fade-in — make sure you're selecting <a>, not <li>
  document.querySelectorAll('.nav-links a').forEach((item, i) => {
    item.style.animationDelay = `${i * 0.1 + 0.3}s`;
  });
});
