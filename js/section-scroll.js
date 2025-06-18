document.addEventListener("DOMContentLoaded", () => {
  const hamburger = document.getElementById("hamburger");
  const navLinks = document.getElementById("nav-links");

  hamburger.addEventListener("click", () => {
    navLinks.classList.toggle("show");
  });

  const sections = document.querySelectorAll("section[id], main[id]");
  const navItems = document.querySelectorAll(".nav-links a");
  const navbar = document.querySelector(".navbar");
  const heroSection = document.getElementById("home");

  window.addEventListener("scroll", () => {
    const scrollY = window.scrollY;
    const offset = navbar.offsetHeight + 20;
    let currentId = null;

    // Apply sticky shadow only after hero
    const threshold = heroSection.offsetHeight - navbar.offsetHeight;
    navbar.classList.toggle("scrolled", scrollY > threshold);

    // Find the currently active section
    sections.forEach(section => {
      const top = section.offsetTop - offset;
      const bottom = top + section.offsetHeight;
      if (scrollY >= top && scrollY < bottom) {
        currentId = section.getAttribute("id");
      }
    });

    // Update nav link styles
    navItems.forEach(link => {
      link.classList.remove("active");
      if (link.getAttribute("href") === `#${currentId}`) {
        link.classList.add("active");
      }
    });

    // Fallback to Home when near top
    if (scrollY < 200) {
      navItems.forEach(link => {
        link.classList.remove("active");
        if (link.getAttribute("href") === "#home") {
          link.classList.add("active");
        }
      });
    }
  });
});
