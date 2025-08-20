// js/newsletter.js
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("newsletterForm");
  const submitBtn = document.getElementById("newsletterSubmit");
  const statusEl = document.getElementById("newsletterStatus");

  if (!form || !submitBtn || !statusEl) return;

  // 🔧 Replace with your Apps Script Web App URL
  const ENDPOINT = "https://script.google.com/macros/s/AKfycbxFLpS52_9w4yA6R9pcYOtc2-4KwnB6Wil7iPyeEDYRq4Dt97BoNw1_RLseYZNvtng4/exec";

  function setStatus(message, type = "info") {
    statusEl.textContent = message;
    statusEl.className = "";            // reset classes
    statusEl.classList.add(type);       // add variant
  }

  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = form.email?.value?.trim() || "";
    if (!validateEmail(email)) {
      setStatus("⚠️ Please enter a valid email address.", "error");
      form.email?.focus();
      return;
    }

    submitBtn.disabled = true;
    submitBtn.style.opacity = "0.7";
    setStatus("⏳ Subscribing...", "info");

    try {
      await fetch(ENDPOINT, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });

      setStatus("Thank you for subscribing! You’ll hear from us soon.", "success");
      form.reset();
    } catch (err) {
      console.error(err);
      setStatus("Something went wrong. Please try again later.", "error");
    } finally {
      submitBtn.disabled = false;
      submitBtn.style.opacity = "1";
    }
  });
});
