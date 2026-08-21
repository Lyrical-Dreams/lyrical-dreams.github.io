// Positions a small year-pill marker on the Experience page's central
// timeline line, aligned to each card's actual vertical position (measured
// at runtime, so it stays correct regardless of the two columns having
// different numbers/heights of cards) — plus a connector line drawn from
// each card's edge to its marker, sized exactly to the measured gap so it
// never overlaps or gets swallowed by the pill.

function initTimelineMarkers() {
  const timeline = document.querySelector('.timeline');
  if (!timeline) return;

  const cards = Array.from(timeline.querySelectorAll('.timeline-card[data-year]'));
  if (!cards.length) return;

  const items = cards.map((card) => {
    const isLeft = !!card.closest('.timeline-row-left');

    const marker = document.createElement('div');
    marker.className = 'timeline-marker ' + (isLeft ? 'marker-left' : 'marker-right');
    marker.textContent = card.dataset.year;
    timeline.appendChild(marker);

    const connector = document.createElement('div');
    connector.className = 'timeline-connector ' + (isLeft ? 'connector-left' : 'connector-right');
    timeline.appendChild(connector);

    return { card, marker, connector, isLeft };
  });

  function position() {
    const timelineRect = timeline.getBoundingClientRect();

    items.forEach(({ card, marker, connector, isLeft }) => {
      const cardRect = card.getBoundingClientRect();
      // vertical anchor for this row: level with the card's header
      const anchorY = cardRect.top - timelineRect.top + 26;

      marker.style.top = (anchorY - marker.offsetHeight / 2) + 'px';

      const markerRect = marker.getBoundingClientRect();
      const cardEdgeX = isLeft ? cardRect.right : cardRect.left;
      const markerEdgeX = isLeft ? markerRect.left : markerRect.right;
      const width = Math.max(0, isLeft ? (markerEdgeX - cardEdgeX) : (cardEdgeX - markerEdgeX));

      connector.style.top = anchorY + 'px';
      connector.style.width = width + 'px';
      connector.style.left = ((isLeft ? cardEdgeX : markerEdgeX) - timelineRect.left) + 'px';
    });
  }

  position();
  window.addEventListener('resize', position);
  // fonts/logos loading can shift card heights slightly after first paint
  window.addEventListener('load', position);
}

document.addEventListener('DOMContentLoaded', initTimelineMarkers);
