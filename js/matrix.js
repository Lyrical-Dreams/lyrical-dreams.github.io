// Lightweight "digital rain" background effect for dark hero panels.
// Attaches to any <canvas class="matrix-canvas"> inside a .matrix-hero container.
// Skips animation entirely if the user prefers reduced motion.

function initMatrixRain(canvas) {
  const ctx = canvas.getContext('2d');
  // Mixed character set: binary, English letters, and Malayalam script —
  // a nod to both languages instead of the usual katakana rain.
  const chars = (
    '0123456789' +
    'ABCDEFGHIJKLMNOPQRSTUVWXYZ' +
    'അആഇഈഉഊഋഎഏഐഒഓഔകഖഗഘങചഛജഝഞടഠഡഢണതഥദധനപഫബഭമയരലവശഷസഹളഴറ'
  ).split('');

  // Occasionally a column spells one of these out top-to-bottom in a
  // highlighted color instead of falling random characters — small hidden
  // messages in the rain.
  const messages = ['BELIEVE', 'PERSIST', 'GROWTH', 'FOCUS', 'BUILD', 'COURAGE', 'LEARN', 'ADAPT', 'RISE', 'CREATE'];
  const HIGHLIGHT_COLOR = '#F0A83B';
  const RAIN_COLOR = '#35E28E';

  let columns, drops, active, fontSize = 15;

  function resize() {
    const parent = canvas.parentElement;
    canvas.width = parent.offsetWidth;
    canvas.height = parent.offsetHeight;
    columns = Math.floor(canvas.width / fontSize);
    drops = new Array(columns).fill(1);
    active = new Array(columns).fill(null); // holds {chars, idx} when spelling a message
  }

  function draw() {
    ctx.fillStyle = 'rgba(10, 21, 18, 0.18)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.font = fontSize + "px 'Noto Sans Malayalam', monospace";

    for (let i = 0; i < drops.length; i++) {
      if (active[i]) {
        ctx.fillStyle = HIGHLIGHT_COLOR;
        ctx.fillText(active[i].chars[active[i].idx], i * fontSize, drops[i] * fontSize);
        active[i].idx++;
        if (active[i].idx >= active[i].chars.length) active[i] = null;
      } else {
        ctx.fillStyle = RAIN_COLOR;
        const text = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
      }

      if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
        drops[i] = 0;
        // small chance to start a hidden message on this column's next pass
        if (!active[i] && Math.random() > 0.9) {
          const word = messages[Math.floor(Math.random() * messages.length)];
          active[i] = { chars: word.split(''), idx: 0 };
        }
      }
      drops[i]++;
    }
  }

  resize();
  window.addEventListener('resize', resize);
  setInterval(draw, 45);
}

function initAllMatrixRain() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;
  document.querySelectorAll('canvas.matrix-canvas').forEach(initMatrixRain);
}

document.addEventListener('DOMContentLoaded', initAllMatrixRain);
