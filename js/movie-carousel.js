// Powers the small "favorite movies" carousel on the Projects page
// (under the Homelab writeup). Reads a JSON list of titles from the
// container's data-movies attribute, fetches poster art + year from the
// OMDb API, and rotates through them automatically.
//
// SETUP: get a free key at https://www.omdbapi.com/apikey.aspx (instant,
// just an email) and paste it in below. Until you do, or if a lookup
// fails, each movie still shows as a styled title card — nothing breaks.

const OMDB_API_KEY = 'b2f8d116';

async function fetchMovieMeta(title) {
  if (!OMDB_API_KEY || OMDB_API_KEY === 'b2f8d116') return null;
  try {
    const res = await fetch('https://www.omdbapi.com/?apikey=' + encodeURIComponent(OMDB_API_KEY) + '&t=' + encodeURIComponent(title));
    const data = await res.json();
    if (data.Response === 'False') return null;
    return {
      title: data.Title || title,
      year: data.Year || '',
      poster: data.Poster && data.Poster !== 'N/A' ? data.Poster : null,
      genre: data.Genre ? data.Genre.split(',')[0].trim() : ''
    };
  } catch (err) {
    console.warn('OMDb lookup failed for', title, err);
    return null;
  }
}

function buildSlide(meta, fallbackTitle, index) {
  const slide = document.createElement('div');
  slide.className = 'movie-slide' + (index === 0 ? ' is-active' : '');

  const posterWrap = document.createElement('div');
  if (meta && meta.poster) {
    const img = document.createElement('img');
    img.className = 'movie-poster';
    img.src = meta.poster;
    img.alt = (meta.title || fallbackTitle) + ' poster';
    img.loading = 'lazy';
    posterWrap.appendChild(img);
  } else {
    const fallback = document.createElement('div');
    fallback.className = 'movie-poster-fallback';
    fallback.textContent = '\u{1F3AC}';
    posterWrap.appendChild(fallback);
  }
  slide.appendChild(posterWrap.firstChild);

  const info = document.createElement('div');
  info.className = 'movie-info';

  const titleEl = document.createElement('p');
  titleEl.className = 'movie-title';
  titleEl.textContent = (meta && meta.title) || fallbackTitle;
  info.appendChild(titleEl);

  const yearEl = document.createElement('p');
  yearEl.className = 'movie-year';
  yearEl.textContent = (meta && meta.year) || 'favorite';
  info.appendChild(yearEl);

  if (meta && meta.genre) {
    const tag = document.createElement('span');
    tag.className = 'movie-tag';
    tag.textContent = meta.genre;
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
  let titles = [];
  try {
    titles = JSON.parse(root.dataset.movies || '[]');
  } catch (err) {
    console.warn('Could not parse movie list', err);
    return;
  }
  if (!titles.length) return;

  const metas = await Promise.all(titles.map(fetchMovieMeta));

  titles.forEach((title, i) => {
    viewport.appendChild(buildSlide(metas[i], title, i));
    const dot = document.createElement('button');
    dot.className = 'movie-dot' + (i === 0 ? ' is-active' : '');
    dot.setAttribute('aria-label', 'Show ' + title);
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
