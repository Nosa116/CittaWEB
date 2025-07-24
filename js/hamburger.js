// hamburger.js

document.addEventListener('DOMContentLoaded', () => {
  const hamburger = document.querySelector('.hamburger');
  const navLinks  = document.querySelector('.nav-links');
  const navItems  = document.querySelectorAll('.nav-links li');

  // 1️⃣ Toggle menu open/closed
  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    hamburger.classList.toggle('active');  // for any burger-icon animation
  });

  // 2️⃣ Optional: close menu when a link is clicked
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      if (navLinks.classList.contains('open')) {
        navLinks.classList.remove('open');
        hamburger.classList.remove('active');
      }
    });
  });

  // 3️⃣ (Optional) Staggered fade-in for each link
  navItems.forEach((item, i) => {
    item.style.animationDelay = `${i * 0.1 + 0.3}s`;
  });
});
