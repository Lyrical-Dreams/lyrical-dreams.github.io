// Simple click-to-enlarge lightbox for the photography gallery.
// Works on any <img> inside a .photo-item — no markup changes needed per photo.

function initLightbox() {
  const overlay = document.createElement('div');
  overlay.className = 'lightbox-overlay';
  overlay.innerHTML = '<button class="lightbox-close" aria-label="Close">&times;</button><img class="lightbox-img" alt="">';
  document.body.appendChild(overlay);

  const img = overlay.querySelector('.lightbox-img');
  const closeBtn = overlay.querySelector('.lightbox-close');

  function open(src, alt) {
    img.src = src;
    img.alt = alt || '';
    overlay.classList.add('lightbox-open');
    document.body.style.overflow = 'hidden';
  }

  function close() {
    overlay.classList.remove('lightbox-open');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('.photo-item img').forEach((photo) => {
    photo.style.cursor = 'zoom-in';
    photo.addEventListener('click', () => open(photo.src, photo.alt));
  });

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay || e.target === closeBtn) close();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') close();
  });
}

document.addEventListener('DOMContentLoaded', initLightbox);
