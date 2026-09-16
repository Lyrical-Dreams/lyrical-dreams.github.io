// Powers the small "favorite movies" carousel on the Projects page
// (under the Homelab writeup). Reads a list of {title, year} entries
// from a JSON <script> block in the page, so the title and year always
// show correctly even if the API lookup below never runs. It then tries
// OMDb purely for poster art, layering that on top when it succeeds.
//
// SETUP: get a free key at https://www.omdbapi.com/apikey.aspx. OMDb
// emails a confirmation link you have to click before the key goes
// live, so if posters aren't showing up, that's the first thing to
// check, not the key itself. Until it's active, or if a lookup fails,
// each movie still shows a styled title card, nothing breaks.

const OMDB_API_KEY = 'b2f8d116';

async function fetchPoster(title, year) {
  if (!OMDB_API_KEY || OMDB_API_KEY === 'YOUR_OMDB_API_KEY') return null;
  try {
    const res = await fetch('https://www.omdbapi.com/?apikey=' + encodeURIComponent(OMDB_API_KEY) + '&t=' + encodeURIComponent(title) + (year ? '&y=' + encodeURIComponent(year) : ''));
    const data = await res.json();
    if (data.Response === 'False') return null;
    return {
      poster: data.Poster && data.Poster !== 'N/A' ? data.Poster : null,
      genre: data.Genre ? data.Genre.split(',')[0].trim() : ''
    };
  } catch (err) {
    console.warn('OMDb poster lookup failed for', title, err);
    return null;
  }
}

function buildSlide(entry, posterMeta, index) {
  const slide = document.createElement('div');
  slide.className = 'movie-slide' + (index === 0 ? ' is-active' : '');

  if (posterMeta && posterMeta.poster) {
    const img = document.createElement('img');
    img.className = 'movie-poster';
    img.src = posterMeta.poster;
    img.alt = entry.title + ' poster';
    img.loading = 'lazy';
    slide.appendChild(img);
  } else {
    const fallback = document.createElement('div');
    fallback.className = 'movie-poster-fallback';
    fallback.textContent = '\u{1F3AC}';
    slide.appendChild(fallback);
  }

  const info = document.createElement('div');
  info.className = 'movie-info';

  const titleEl = document.createElement('p');
  titleEl.className = 'movie-title';
  titleEl.textContent = entry.year ? entry.title + ' (' + entry.year + ')' : entry.title;
  info.appendChild(titleEl);

  const yearEl = document.createElement('p');
  yearEl.className = 'movie-year';
  yearEl.textContent = 'favorite';
  info.appendChild(yearEl);

  if (posterMeta && posterMeta.genre) {
    const tag = document.createElement('span');
    tag.className = 'movie-tag';
    tag.textContent = posterMeta.genre;
    info.appendChild(tag);
  }

  slide.appendChild(info);
  return slide;
}

async function initMovieCarousel() {
  const root = document.querySelector('.movie-carousel');
  if (!root) return;

  const viewport = root.querySelector('.movie-carousel-viewport');
  const dotsWrap = root.querySelector('.movie-dots');
  const dataEl = root.querySelector('script[type="application/json"]');
  let entries = [];
  try {
    entries = JSON.parse((dataEl && dataEl.textContent) || '[]');
  } catch (err) {
    console.warn('Could not parse movie list', err);
    return;
  }
  if (!entries.length) return;

  const posterMetas = await Promise.all(entries.map((e) => fetchPoster(e.title, e.year)));

  entries.forEach((entry, i) => {
    viewport.appendChild(buildSlide(entry, posterMetas[i], i));
    const dot = document.createElement('button');
    dot.className = 'movie-dot' + (i === 0 ? ' is-active' : '');
    dot.setAttribute('aria-label', 'Show ' + entry.title);
    dot.addEventListener('click', () => goTo(i));
    dotsWrap.appendChild(dot);
  });

  const slides = Array.from(viewport.querySelectorAll('.movie-slide'));
  const dots = Array.from(dotsWrap.querySelectorAll('.movie-dot'));
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let index = 0;
  let timer = null;

  function render() {
    slides.forEach((s, i) => s.classList.toggle('is-active', i === index));
    dots.forEach((d, i) => d.classList.toggle('is-active', i === index));
  }

  function goTo(newIndex) {
    index = (newIndex + slides.length) % slides.length;
    render();
    restartAutoplay();
  }

  function startAutoplay() {
    if (prefersReducedMotion || slides.length <= 1) return;
    timer = setInterval(() => goTo(index + 1), 4200);
  }
  function stopAutoplay() { if (timer) clearInterval(timer); timer = null; }
  function restartAutoplay() { stopAutoplay(); startAutoplay(); }

  root.addEventListener('mouseenter', stopAutoplay);
  root.addEventListener('mouseleave', startAutoplay);

  render();
  startAutoplay();
}

document.addEventListener('DOMContentLoaded', initMovieCarousel);
