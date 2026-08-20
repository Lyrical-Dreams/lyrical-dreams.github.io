// Password gate for the resume page.
//
// IMPORTANT: this is a UX deterrent, not real security. The password check
// happens in this file, which anyone can read via "view source" — and the
// PDF at assets/Nayan_Pillai_Resume.pdf is still directly reachable by its
// URL regardless of this gate. Don't rely on this to keep the resume
// genuinely private; use it only to keep it from casual browsing.

const RESUME_PASSWORD = 'UnlockRes';

function initResumeLock() {
  const overlay = document.getElementById('resumeLockOverlay');
  const gated = document.getElementById('resumeGated');
  const form = document.getElementById('resumeLockForm');
  const input = document.getElementById('resumeLockInput');
  const error = document.getElementById('resumeLockError');

  if (!form) return; // not on this page

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (input.value === RESUME_PASSWORD) {
      gated.classList.add('resume-unlocked');
      overlay.remove();
    } else {
      error.textContent = 'Incorrect password, try again.';
      input.value = '';
      input.focus();
    }
  });
}

document.addEventListener('DOMContentLoaded', initResumeLock);
