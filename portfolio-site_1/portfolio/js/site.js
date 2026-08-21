// Loads the shared header/footer into every page and wires up nav behavior.
// To edit the nav links, edit partials/header.html — every page updates automatically.

async function includePartial(selector, url) {
  const target = document.querySelector(selector);
  if (!target) return;
  try {
    const res = await fetch(url);
    target.innerHTML = await res.text();
  } catch (err) {
    console.error('Could not load ' + url, err);
  }
}

async function initSite() {
  await Promise.all([
    includePartial('#site-header', 'partials/header.html'),
    includePartial('#site-footer', 'partials/footer.html'),
  ]);

  // Highlight the current page in the nav
  const current = document.body.dataset.page;
  document.querySelectorAll('.nav a[data-page]').forEach((link) => {
    if (link.dataset.page === current) link.classList.add('nav-active');
  });

  // Mobile nav toggle
  const toggle = document.getElementById('navToggle');
  const nav = document.getElementById('siteNav');
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const open = nav.classList.toggle('nav-open');
      toggle.setAttribute('aria-expanded', open);
    });
  }

  // Footer year
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Fade in the "explore" timeline stops as they scroll into view (Home page)
  const revealEls = document.querySelectorAll('.explore-reveal');
  if (revealEls.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('explore-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.25 });
    revealEls.forEach((el) => observer.observe(el));
  }
}

document.addEventListener('DOMContentLoaded', initSite);
