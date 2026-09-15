// Submits the contact form to Formspree via fetch instead of a normal
// browser POST, so the visitor never leaves the site. Formspree's default
// behavior on a plain <form> submit is to redirect to formspree.io/thanks,
// which is what was happening before this.

function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;
  const status = document.getElementById('formStatus');
  const submitBtn = form.querySelector('button[type="submit"]');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    status.textContent = '';
    status.className = 'form-status';
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';

    try {
      const res = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' }
      });

      if (res.ok) {
        form.reset();
        status.textContent = "Thanks, your message is on its way. I'll get back to you soon.";
        status.classList.add('form-status-success');
      } else {
        const data = await res.json().catch(() => null);
        const message = data && data.errors
          ? data.errors.map((err) => err.message).join(', ')
          : 'Something went wrong sending that. Try again, or email me directly.';
        status.textContent = message;
        status.classList.add('form-status-error');
      }
    } catch (err) {
      status.textContent = 'Something went wrong sending that. Try again, or email me directly.';
      status.classList.add('form-status-error');
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Send';
    }
  });
}

document.addEventListener('DOMContentLoaded', initContactForm);
