document.addEventListener('DOMContentLoaded', function () {
  const scrollContainer = document.getElementById('industryCards');
  const scrollLeftBtn = document.getElementById('scrollLeft');
  const scrollRightBtn = document.getElementById('scrollRight');
  const scrollBar = document.getElementById('scrollBar');

  if (!scrollContainer || !scrollLeftBtn || !scrollRightBtn || !scrollBar) {
    console.warn("One or more scroll elements not found.");
    return;
  }

  const scrollByCard = () => {
    const card = scrollContainer.querySelector('.industry-card');
    return card ? card.offsetWidth + 40 : 300; // account for gap
  };

  scrollLeftBtn.addEventListener('click', () => {
    scrollContainer.scrollBy({ left: -scrollByCard(), behavior: 'smooth' });
  });

  scrollRightBtn.addEventListener('click', () => {
    scrollContainer.scrollBy({ left: scrollByCard(), behavior: 'smooth' });
  });

  scrollContainer.addEventListener('scroll', () => {
    const maxScroll = scrollContainer.scrollWidth - scrollContainer.clientWidth;
    const currentScroll = scrollContainer.scrollLeft;
    const scrollPercent = (currentScroll / maxScroll) * 100;
    scrollBar.style.width = `${scrollPercent}%`;
  });
});
