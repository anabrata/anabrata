/**
 * ============================================================================
 * SCROLL.JS — Intersection Observer Scroll Animations & Re-Trigger Engine
 * Replays animations whenever scrolling up and down through the page
 * ============================================================================
 */

(function () {
  const revealElements = document.querySelectorAll('.scroll-reveal');

  if ('IntersectionObserver' in window) {
    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -40px 0px', // Triggers slightly before element enters view
      threshold: 0.10
    };

    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Add entrance animation class when scrolled into view
          entry.target.classList.add('is-revealed');
        } else {
          // Re-triggerable: When scrolled out of view, remove class so it replays upon return!
          entry.target.classList.remove('is-revealed');
        }
      });
    }, observerOptions);

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback for older browsers
    revealElements.forEach(el => el.classList.add('is-revealed'));
  }

  // Subtle Parallax Depth on Desktop
  const parallaxTargets = document.querySelectorAll('[data-scroll-parallax]');

  function updateParallax() {
    if (window.innerWidth < 1024) return;
    const scrollY = window.scrollY;

    parallaxTargets.forEach(target => {
      const speed = parseFloat(target.getAttribute('data-scroll-parallax')) || 0.04;
      const offset = scrollY * speed;
      target.style.transform = `translate3d(0px, ${offset}px, 0px)`;
    });
  }

  if (parallaxTargets.length > 0) {
    window.addEventListener('scroll', () => {
      requestAnimationFrame(updateParallax);
    }, { passive: true });
  }
})();
