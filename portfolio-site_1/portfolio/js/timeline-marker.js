// Positions a small year-pill marker on the Experience page's central
// timeline line, aligned to each card's actual vertical position (measured
// at runtime, so it stays correct regardless of the two columns having
// different numbers/heights of cards).

function initTimelineMarkers() {
  const timeline = document.querySelector('.timeline');
  if (!timeline) return;

  const cards = Array.from(timeline.querySelectorAll('.timeline-card[data-year]'));
  if (!cards.length) return;

  const markers = cards.map((card) => {
    const marker = document.createElement('div');
    marker.className = 'timeline-marker ' + (card.closest('.timeline-col-left') ? 'marker-left' : 'marker-right');
    marker.textContent = card.dataset.year;
    timeline.appendChild(marker);
    return { card, marker };
  });

  function position() {
    const timelineTop = timeline.getBoundingClientRect().top;
    markers.forEach(({ card, marker }, i) => {
      const cardTop = card.getBoundingClientRect().top;
      const stagger = i % 2 === 0 ? -6 : 6; // slight offset so markers don't look mechanically aligned
      marker.style.top = (cardTop - timelineTop + 22 + stagger) + 'px';
    });
  }

  position();
  window.addEventListener('resize', position);
  // fonts/logos loading can shift card heights slightly after first paint
  window.addEventListener('load', position);
}

document.addEventListener('DOMContentLoaded', initTimelineMarkers);
