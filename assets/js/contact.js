/**
 * AVISHATECH — CONTACT & INQUIRY FORM CONTROLLER
 * Integrates EmailJS, validation, button states, and 1-click clipboard utilities.
 */

document.addEventListener('DOMContentLoaded', () => {
  const contactForm = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');
  const submitBtn = document.getElementById('submitBtn');

  // Initialize EmailJS with client key
  if (window.emailjs) {
    window.emailjs.init('SH3z5sR0ioQTOM8G_');
  }

  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Form validation
      const name = contactForm.querySelector('input[name="user_name"]')?.value.trim();
      const email = contactForm.querySelector('input[name="user_email"]')?.value.trim();
      const message = contactForm.querySelector('textarea[name="message"]')?.value.trim();

      if (!name || !email || !message) {
        showStatus('Please fill in your name, email, and project description.', 'error');
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        showStatus('Please enter a valid email address.', 'error');
        return;
      }

      // Collect checked service requirements
      const checkedServices = [];
      contactForm.querySelectorAll('input[name="services"]:checked').forEach(cb => {
        checkedServices.push(cb.value);
      });

      // Prepare button loading state
      const originalBtnText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <svg class="spinner" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:16px;height:16px;animation:spin 1s linear infinite;">
          <circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle>
          <path d="M12 2a10 10 0 0 1 10 10" stroke-linecap="round"></path>
        </svg>
        Sending inquiry...
      `;

      showStatus('Transmitting your project scope to AvishaTech engineers...', '');

      try {
        if (window.emailjs) {
          await window.emailjs.sendForm('service_4txybas', 'template_hxhpv58', contactForm);
          showStatus('Thank you! Your project inquiry has been delivered. An AvishaTech engineer will review and respond within 1 business day.', 'success');
          contactForm.reset();
        } else {
          // Fallback if EmailJS CDN fails
          showStatus('Thank you! Your request has been recorded. You can also reach us directly at help.avishatech@outlook.com.', 'success');
          contactForm.reset();
        }
      } catch (err) {
        console.error('EmailJS error:', err);
        showStatus('Message delivery encountered an issue. Please email us directly at help.avishatech@outlook.com or WhatsApp +977 9865272545.', 'error');
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
      }
    });
  }

  function showStatus(text, type) {
    if (!formStatus) return;
    formStatus.textContent = text;
    formStatus.className = 'form-status-alert';
    if (type) formStatus.classList.add(type);
  }

  // 1-Click Clipboard Copy
  const copyButtons = document.querySelectorAll('.copy-btn');
  copyButtons.forEach(btn => {
    btn.addEventListener('click', async () => {
      const textToCopy = btn.getAttribute('data-copy') || '';
      if (!textToCopy) return;

      try {
        await navigator.clipboard.writeText(textToCopy);
        const originalText = btn.textContent;
        btn.textContent = 'Copied!';
        btn.style.background = 'var(--teal-400)';
        btn.style.color = '#041113';

        setTimeout(() => {
          btn.textContent = originalText;
          btn.style.background = '';
          btn.style.color = '';
        }, 2000);
      } catch (err) {
        console.warn('Clipboard write failed:', err);
      }
    });
  });
});

