// js/demo-form.js
document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('demoForm');
  const btn  = document.getElementById('submitBtn');
  const msg  = document.getElementById('formMsg');

  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    msg.textContent = '';
    btn.disabled = true;
    btn.textContent = 'Sending...';

    const formData = new FormData(form);

    try {
      const res = await fetch('/send-demo-email.php', {
        method: 'POST',
        body: formData
      });

      const data = await res.json();
      if (res.ok && data.ok) {
        msg.textContent = data.message || 'Request sent!';
        form.reset();
      } else {
        msg.textContent = data.message || 'Something went wrong.';
      }
    } catch (err) {
      msg.textContent = 'Network error. Please try again.';
    } finally {
      btn.disabled = false;
      btn.textContent = 'Send Request';
    }
  });
});
