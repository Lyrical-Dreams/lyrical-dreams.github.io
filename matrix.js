// Lightweight "digital rain" background effect for dark hero panels.
// Attaches to any <canvas class="matrix-canvas"> inside a .matrix-hero container.
// Skips animation entirely if the user prefers reduced motion.

function initMatrixRain(canvas) {
  const ctx = canvas.getContext('2d');
  // Mixed character set: binary, English letters, and Malayalam script —
  // a nod to both languages instead of the usual katakana rain.
  const chars = (
    '01' +
    'ABCDEFGHIJKLMNOPQRSTUVWXYZ' +
    'അആഇഈഉഊഋഎഏഐഒഓഔകഖഗഘങചഛജഝഞടഠഡഢണതഥദധനപഫബഭമയരലവശഷസഹളഴറ'
  ).split('');
  let columns, drops, fontSize = 15;

  function resize() {
    const parent = canvas.parentElement;
    canvas.width = parent.offsetWidth;
    canvas.height = parent.offsetHeight;
    columns = Math.floor(canvas.width / fontSize);
    drops = new Array(columns).fill(1);
  }

  function draw() {
    ctx.fillStyle = 'rgba(10, 21, 18, 0.18)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#35E28E';
    ctx.font = fontSize + "px 'Noto Sans Malayalam', monospace";

    for (let i = 0; i < drops.length; i++) {
      const text = chars[Math.floor(Math.random() * chars.length)];
      ctx.fillText(text, i * fontSize, drops[i] * fontSize);
      if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
        drops[i] = 0;
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
