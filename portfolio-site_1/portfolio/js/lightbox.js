// Click-to-enlarge lightbox for the photography gallery, with prev/next
// navigation between every photo in the same category (arrow buttons or
// left/right arrow keys). Works on any <img> inside a .photo-item — new
// photos are picked up automatically, no markup changes needed.

function initLightbox() {
  const overlay = document.createElement('div');
  overlay.className = 'lightbox-overlay';
  overlay.innerHTML =
    '<button class="lightbox-close" aria-label="Close">&times;</button>' +
    '<button class="lightbox-nav lightbox-prev" aria-label="Previous photo">&#8249;</button>' +
    '<div class="lightbox-body">' +
      '<img class="lightbox-img" alt="">' +
      '<figcaption class="lightbox-caption"></figcaption>' +
    '</div>' +
    '<button class="lightbox-nav lightbox-next" aria-label="Next photo">&#8250;</button>';
  document.body.appendChild(overlay);

  const img = overlay.querySelector('.lightbox-img');
  const caption = overlay.querySelector('.lightbox-caption');
  const closeBtn = overlay.querySelector('.lightbox-close');
  const prevBtn = overlay.querySelector('.lightbox-prev');
  const nextBtn = overlay.querySelector('.lightbox-next');

  let group = [];   // all <img> elements in the current photo's category
  let groupIndex = 0;

  function render() {
    const photo = group[groupIndex];
    img.src = photo.src;
    img.alt = photo.alt || '';
    const fig = photo.closest('.photo-item');
    const figcap = fig ? fig.querySelector('figcaption') : null;
    caption.textContent = figcap ? figcap.textContent : '';
    const showNav = group.length > 1;
    prevBtn.style.display = showNav ? '' : 'none';
    nextBtn.style.display = showNav ? '' : 'none';
  }

  function open(clickedImg) {
    const category = clickedImg.closest('.photo-category');
    group = category
      ? Array.from(category.querySelectorAll('.photo-item img'))
      : [clickedImg];
    groupIndex = group.indexOf(clickedImg);
    render();
    overlay.classList.add('lightbox-open');
    document.body.style.overflow = 'hidden';
  }

  function close() {
    overlay.classList.remove('lightbox-open');
    document.body.style.overflow = '';
  }

  function step(delta) {
    if (!group.length) return;
    groupIndex = (groupIndex + delta + group.length) % group.length;
    render();
  }

  function wireUpPhotos() {
    document.querySelectorAll('.photo-item img').forEach((photo) => {
      if (photo.dataset.lightboxWired) return;
      photo.dataset.lightboxWired = 'true';
      photo.style.cursor = 'zoom-in';
      photo.addEventListener('click', () => open(photo));
    });
  }

  wireUpPhotos();

  prevBtn.addEventListener('click', (e) => { e.stopPropagation(); step(-1); });
  nextBtn.addEventListener('click', (e) => { e.stopPropagation(); step(1); });

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay || e.target === closeBtn) close();
  });
  document.addEventListener('keydown', (e) => {
    if (!overlay.classList.contains('lightbox-open')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') step(-1);
    if (e.key === 'ArrowRight') step(1);
  });
}

document.addEventListener('DOMContentLoaded', initLightbox);
