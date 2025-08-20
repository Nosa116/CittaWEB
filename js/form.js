<script>
(function () {
  const form = document.getElementById('demoForm');
  if (!form) return;

  const statusBar = document.getElementById('demoStatus');
  const submitBtn = form.querySelector('button[type="submit"]');

  const fields = {
    name:     document.getElementById('name'),
    email:    document.getElementById('email'),
    company:  document.getElementById('company'),
    jobRole:  document.getElementById('jobRole'),
    industry: document.getElementById('industry'),
    phone:    document.getElementById('phone'),
    message:  document.getElementById('message')
  };

  function setStatus(type, html) {
    statusBar.className = 'form-status ' + (type || '');
    statusBar.innerHTML = html || '';
  }

  function setFieldError(input, msg) {
    const errEl = document.getElementById('error-' + input.id);
    if (msg) {
      input.classList.add('input-error');
      input.setAttribute('aria-invalid', 'true');
      if (errEl) errEl.textContent = msg;
    } else {
      input.classList.remove('input-error');
      input.removeAttribute('aria-invalid');
      if (errEl) errEl.textContent = '';
    }
  }

  function validateField(input) {
    if (input.required && !input.value.trim()) return 'This field is required.';
    if (input.type === 'email' && input.value.trim() !== '') {
      const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim());
      if (!ok) return 'Please enter a valid email address.';
    }
    return '';
  }

  function validateAll() {
    const errors = [];
    for (const key in fields) {
      const input = fields[key];
      const msg = validateField(input);
      setFieldError(input, msg);
      if (msg) errors.push({ field: key, message: msg, input });
    }
    return errors;
  }

  Object.values(fields).forEach((el) => {
    el.addEventListener('input', () => setFieldError(el, validateField(el)));
    el.addEventListener('blur',   () => setFieldError(el, validateField(el)));
  });

  function startLoading() {
    submitBtn.classList.add('is-loading');
    submitBtn.disabled = true;
    setStatus('', '');
  }
  function stopLoading() {
    submitBtn.classList.remove('is-loading');
    submitBtn.disabled = false;
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const errs = validateAll();
    if (errs.length) {
      errs[0].input.focus();
      setStatus('error', `❗ Please fix the highlighted fields.`);
      return;
    }

    startLoading();
    setStatus('', 'Sending…');

    try {
      const resp = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { 'X-Requested-With': 'XMLHttpRequest' }
      });

      let data = null;
      try { data = await resp.json(); } catch (_) {}

      if (resp.ok && data && data.ok) {
        setStatus('success', data.message || 'Thanks! We will get in touch shortly.');
        form.reset();
        Object.values(fields).forEach((el) => setFieldError(el, ''));
      } else {
        let anyFieldError = false;
        if (data && data.errors && typeof data.errors === 'object') {
          Object.entries(data.errors).forEach(([key, msg]) => {
            const el = fields[key];
            if (el) { setFieldError(el, String(msg)); anyFieldError = true; }
          });
        }
        const fallbackMsg = (data && data.message) || 'Sorry, something went wrong. Please try again.';
        setStatus('error', anyFieldError ? '❗ Please fix the highlighted fields.' : `❗ ${fallbackMsg}`);
        const firstError = document.querySelector('.input-error');
        if (firstError) firstError.focus();
      }
    } catch (err) {
      setStatus('error', '❗ Network error. Please check your connection and try again.');
    } finally {
      stopLoading();
    }
  });
})();
</script>
