// Powers the per-category photo carousels on the Photography page.
// Each .photo-category holds a .photo-carousel with several .photo-item
// figures; only one is shown at a time, with prev/next buttons to flip
// through and a counter underneath. New figures are picked up automatically.

function initCarousels() {
  document.querySelectorAll('.photo-category').forEach((category) => {
    const items = Array.from(category.querySelectorAll('.photo-item'));
    if (!items.length) return;

    const prevBtn = category.querySelector('.carousel-prev');
    const nextBtn = category.querySelector('.carousel-next');
    const counter = category.querySelector('.carousel-counter');
    let index = 0;

    function render() {
      items.forEach((item, i) => item.classList.toggle('active', i === index));
      if (counter) counter.textContent = (index + 1) + ' / ' + items.length;
    }

    function go(delta) {
      index = (index + delta + items.length) % items.length;
      render();
    }

    if (prevBtn) prevBtn.addEventListener('click', () => go(-1));
    if (nextBtn) nextBtn.addEventListener('click', () => go(1));

    // hide arrows/counter entirely if there's only one photo in the category
    if (items.length <= 1) {
      if (prevBtn) prevBtn.style.display = 'none';
      if (nextBtn) nextBtn.style.display = 'none';
      if (counter) counter.style.display = 'none';
    }

    render();
  });
}

document.addEventListener('DOMContentLoaded', initCarousels);
