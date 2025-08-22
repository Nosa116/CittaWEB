document.addEventListener("DOMContentLoaded", () => {
  const slider = document.querySelector(".industry-cards");
  const cards = document.querySelectorAll(".industry-card");

  if (!slider || cards.length === 0) return;

  let index = 0;
  let interval;

  const startAutoScroll = () => {
    interval = setInterval(() => {
      index = (index + 1) % cards.length;
      const cardWidth = cards[0].offsetWidth + 40; // 40 = gap between cards
      slider.scrollTo({
        left: index * cardWidth,
        behavior: "smooth",
      });
    }, 1200);
  };

  const stopAutoScroll = () => {
    clearInterval(interval);
  };

  // Start on load
  startAutoScroll();

  // Pause/resume on hover (desktop)
  slider.addEventListener("mouseenter", stopAutoScroll);
  slider.addEventListener("mouseleave", startAutoScroll);
});
