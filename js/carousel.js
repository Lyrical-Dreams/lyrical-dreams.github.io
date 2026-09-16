// Powers the per-category photo carousels on the Photography page.
// Each .photo-category holds a .photo-carousel with a .photo-track of
// .photo-item figures. The active photo is shown full-size and sharp;
// neighboring photos peek at the edges, faded and blurred, until rotated
// into view. Auto-advances every 5s (pauses on hover/interaction), and
// respects prefers-reduced-motion by skipping autoplay.

function initCarousels() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  document.querySelectorAll('.photo-category').forEach((category) => {
    const track = category.querySelector('.photo-track');
    const viewport = category.querySelector('.photo-carousel-viewport');
    const items = Array.from(category.querySelectorAll('.photo-item'));
    if (!track || !items.length) return;

    const prevBtn = category.querySelector('.carousel-prev');
    const nextBtn = category.querySelector('.carousel-next');
    const counter = category.querySelector('.carousel-counter');
    const captionEl = category.querySelector('.carousel-caption');
    let index = 0;
    let timer = null;

    // offsetWidth (not getBoundingClientRect) on purpose: the active slide
    // is scale(1) and the peeking slides are scale(0.94), and
    // getBoundingClientRect reports that scaled-down size. Since every
    // .photo-item has the same flex-basis, offsetWidth (the layout box,
    // unaffected by the transform) is the true, consistent slide width
    // regardless of which one happens to be active right now. Using the
    // scaled rect here was why the frame visibly jumped sideways when
    // slide 1 (unscaled, correct width) wasn't the active one.
    function slideWidth() {
      return items[0].offsetWidth;
    }

    function gapPx() {
      const style = window.getComputedStyle(track);
      return parseFloat(style.columnGap || style.gap || '0');
    }

    function position() {
      const w = slideWidth();
      const gap = gapPx();
      const offset = index * (w + gap) - (viewport.offsetWidth - w) / 2;
      track.style.transform = 'translateX(' + (-offset) + 'px)';
    }

    function render() {
      items.forEach((item, i) => {
        item.classList.toggle('is-active', i === index);
      });
      const fig = items[index].querySelector('figcaption');
      if (captionEl) captionEl.textContent = fig ? fig.textContent : '';
      if (counter) counter.textContent = (index + 1) + ' / ' + items.length;
      position();
    }

    function goTo(newIndex) {
      index = (newIndex + items.length) % items.length;
      render();
    }

    function go(delta) { goTo(index + delta); }

    function startAutoplay() {
      if (prefersReducedMotion || items.length <= 1) return;
      stopAutoplay();
      timer = setInterval(() => go(1), 5000);
    }
    function stopAutoplay() {
      if (timer) clearInterval(timer);
      timer = null;
    }

    if (prevBtn) prevBtn.addEventListener('click', () => { go(-1); startAutoplay(); });
    if (nextBtn) nextBtn.addEventListener('click', () => { go(1); startAutoplay(); });

    // clicking a peeking (non-active) photo brings it to the center instead
    // of opening the lightbox; clicking the active photo still opens it
    items.forEach((item, i) => {
      const img = item.querySelector('img');
      img.addEventListener('click', (e) => {
        if (i !== index) {
          e.stopImmediatePropagation();
          goTo(i);
          startAutoplay();
        }
      });
    });

    category.addEventListener('mouseenter', stopAutoplay);
    category.addEventListener('mouseleave', startAutoplay);

    if (items.length <= 1) {
      if (prevBtn) prevBtn.style.display = 'none';
      if (nextBtn) nextBtn.style.display = 'none';
      if (counter) counter.style.display = 'none';
    }

    window.addEventListener('resize', position);

    render();
    startAutoplay();
  });
}

document.addEventListener('DOMContentLoaded', initCarousels);
