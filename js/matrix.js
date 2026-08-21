// Lightweight "digital rain" background effect for dark hero panels.
// Attaches to any <canvas class="matrix-canvas"> inside a .matrix-hero container.
// Skips animation entirely if the user prefers reduced motion.

function initMatrixRain(canvas) {
  const ctx = canvas.getContext('2d');
  // Mixed character set spanning several languages/scripts instead of the
  // usual katakana-only rain: English, Japanese, Malayalam, French/Spanish
  // accents, Russian, and Arabic.
  const chars = (
    '0123456789' +
    'ABCDEFGHIJKLMNOPQRSTUVWXYZ' +
    'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン' +
    'അആഇഈഉഊഋഎഏഐഒഓഔകഖഗഘങചഛജഝഞടഠഡഢണതഥദധനപഫബഭമയരലവശഷസഹളഴറ' +
    'ÀÂÄÉÈÊËÎÏÔÙÛÜÇÑáéíóúñ¿¡' +
    'АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ' +
    'ابتثجحخدذرزسشصضطظعغفقكلمنهوي'
  ).split('');

  // Most hidden messages spell out gold; a rare, deliberately soft one
  // spells out in red instead.
  const messages = ['BELIEVE', 'PERSIST', 'GROWTH', 'FOCUS', 'BUILD', 'COURAGE', 'LEARN', 'ADAPT', 'RISE', 'CREATE', 'GRIND', 'DREAM', 'HUSTLE', 'THRIVE'];
  const secretMessage = 'I LOVE YOU';
  const HIGHLIGHT_COLOR = '#F0A83B';
  const SECRET_COLOR = '#E8503A';
  const RAIN_COLOR = '#35E28E';

  let columns, drops, active, fontSize = 15;

  function resize() {
    const parent = canvas.parentElement;
    canvas.width = parent.offsetWidth;
    canvas.height = parent.offsetHeight;
    columns = Math.floor(canvas.width / fontSize);
    drops = new Array(columns).fill(1);
    active = new Array(columns).fill(null); // holds {chars, idx, color} when spelling a message
  }

  function draw() {
    ctx.fillStyle = 'rgba(10, 21, 18, 0.18)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.font = fontSize + "px 'Noto Sans Malayalam', 'Noto Sans JP', 'Noto Sans Arabic', monospace";

    for (let i = 0; i < drops.length; i++) {
      if (active[i]) {
        ctx.fillStyle = active[i].color;
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
        // decent chance to start a gold hidden word, rare chance for the red one
        if (!active[i]) {
          const roll = Math.random();
          if (roll > 0.995) {
            active[i] = { chars: secretMessage.split(''), idx: 0, color: SECRET_COLOR };
          } else if (roll > 0.78) {
            const word = messages[Math.floor(Math.random() * messages.length)];
            active[i] = { chars: word.split(''), idx: 0, color: HIGHLIGHT_COLOR };
          }
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
