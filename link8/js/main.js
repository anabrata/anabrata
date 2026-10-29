/**
 * ============================================================================
 * MAIN.JS — App Orchestration, Clipboard Operations & Interactive Handlers
 * ============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {

  // --------------------------------------------------------------------------
  // 01. 1-CLICK CLIPBOARD EMAIL COPY
  // --------------------------------------------------------------------------
  const copyBtn = document.getElementById('copyEmailBtn');
  const toast = document.getElementById('toastNotification');
  const toastMsg = document.getElementById('toastMessage');

  function showToast(message) {
    if (!toast || !toastMsg) return;
    toastMsg.textContent = message;
    toast.classList.remove('opacity-0', 'pointer-events-none');
    toast.classList.add('opacity-100');

    setTimeout(() => {
      toast.classList.remove('opacity-100');
      toast.classList.add('opacity-0', 'pointer-events-none');
    }, 2400);
  }

  copyBtn?.addEventListener('click', () => {
    const email = 'anabratabis@gmail.com';
    navigator.clipboard.writeText(email).then(() => {
      showToast('Copied: anabratabis@gmail.com');
    }).catch(() => {
      showToast('anabratabis@gmail.com');
    });
  });


  // --------------------------------------------------------------------------
  // 02. MOBILE NAVIGATION MENU DRAWER
  // --------------------------------------------------------------------------
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  const menuIcon = document.getElementById('menuIcon');

  mobileMenuBtn?.addEventListener('click', () => {
    const isOpen = mobileMenu?.classList.toggle('hidden') === false;
    if (menuIcon) {
      menuIcon.className = isOpen ? 'fa-solid fa-xmark text-sm' : 'fa-solid fa-bars text-sm';
    }
  });

  document.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu?.classList.add('hidden');
      if (menuIcon) menuIcon.className = 'fa-solid fa-bars text-sm';
    });
  });


  // --------------------------------------------------------------------------
  // 03. STUDIO PORTRAIT SUBTLE HOVER TILT
  // --------------------------------------------------------------------------
  const heroImg = document.getElementById('heroImage');
  const canvas = heroImg?.closest('.inner-portrait-canvas');

  if (heroImg && canvas && window.innerWidth > 1024) {
    canvas.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      heroImg.style.transform = `scale(1.02) translate(${x * 8}px, ${y * 5}px)`;
    });

    canvas.addEventListener('mouseleave', () => {
      heroImg.style.transform = 'scale(1) translate(0px, 0px)';
    });
  }


  // --------------------------------------------------------------------------
  // 04. DYNAMIC CURRENT YEAR
  // --------------------------------------------------------------------------
  const currentYearSpan = document.getElementById('currentYear');
  if (currentYearSpan) {
    currentYearSpan.textContent = new Date().getFullYear();
  }

});
