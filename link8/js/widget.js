/**
 * ============================================================================
 * WIDGET.JS — Proximity Circular Contact Widget & Mobile Radial Arc Speed-Dial
 * ============================================================================
 */

(function () {
  const widget = document.getElementById('socialWidget');
  const veil = document.getElementById('focusVeil');
  const mobileTrigger = document.getElementById('mobileSocialTrigger');
  const mobileRadial = document.getElementById('mobileRadialMenu');
  const triggerIcon = document.getElementById('mobileTriggerIcon');
  const hubPill = document.getElementById('mobileHubPill');
  const DEFAULT_HUB_TEXT = 'Quick Connect';

  // --------------------------------------------------------------------------
  // 01. DESKTOP PROXIMITY EXPANSION (min-width: 1024px)
  // --------------------------------------------------------------------------
  if (widget) {
    const PROXIMITY_RADIUS = 190; // Distance in px to trigger circular expansion

    function getDistance(x, y, rect) {
      const dx = Math.max(rect.left - x, 0, x - rect.right);
      const dy = Math.max(rect.top - y, 0, y - rect.bottom);
      return Math.sqrt(dx * dx + dy * dy);
    }

    function handlePointer(x, y) {
      if (window.innerWidth < 1024) return;
      const rect = widget.getBoundingClientRect();
      const dist = getDistance(x, y, rect);
      const isNear = dist < PROXIMITY_RADIUS;

      widget.classList.toggle('near', isNear);
      if (!mobileRadial?.classList.contains('open')) {
        veil?.classList.toggle('active', isNear);
      }
    }

    window.addEventListener('mousemove', (e) => {
      handlePointer(e.clientX, e.clientY);
    }, { passive: true });

    window.addEventListener('mouseleave', () => {
      if (window.innerWidth >= 1024) {
        widget.classList.remove('near');
        if (!mobileRadial?.classList.contains('open')) {
          veil?.classList.remove('active');
        }
      }
    });
  }

  // --------------------------------------------------------------------------
  // 02. MOBILE RADIAL ARC SPEED-DIAL CONTROLS (< 1024px)
  // --------------------------------------------------------------------------
  function resetHubPill() {
    if (hubPill) hubPill.textContent = DEFAULT_HUB_TEXT;
  }

  function openMobileRadial() {
    if (!mobileRadial) return;
    mobileRadial.classList.add('open');
    veil?.classList.add('active');
    resetHubPill();
    if (triggerIcon) {
      triggerIcon.className = 'fa-solid fa-xmark text-base text-headline';
    }
  }

  function closeMobileRadial() {
    if (!mobileRadial) return;
    mobileRadial.classList.remove('open');
    if (widget) widget.classList.remove('near');
    veil?.classList.remove('active');
    resetHubPill();
    if (triggerIcon) {
      triggerIcon.className = 'fa-solid fa-comments text-base text-blue-600 dark:text-blue-400';
    }
  }

  let lastTriggerTime = 0;
  function handleTrigger(e) {
    const now = Date.now();
    if (now - lastTriggerTime < 250) return;
    lastTriggerTime = now;
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (mobileRadial?.classList.contains('open')) {
      closeMobileRadial();
    } else {
      openMobileRadial();
    }
  }

  mobileTrigger?.addEventListener('click', handleTrigger);

  // Dynamic Channel Title on Central Hub Pill
  if (mobileRadial && hubPill) {
    const nodes = mobileRadial.querySelectorAll('.mobile-radial-node');
    nodes.forEach(node => {
      const name = node.getAttribute('data-name');
      const setLabel = () => { if (name) hubPill.textContent = name; };

      node.addEventListener('mouseenter', setLabel);
      node.addEventListener('mouseleave', resetHubPill);
      node.addEventListener('touchstart', setLabel, { passive: true });
    });
  }

  // Tap on focus veil closes either desktop widget or mobile radial
  veil?.addEventListener('click', () => {
    if (widget) widget.classList.remove('near');
    closeMobileRadial();
  });

  // Auto-close radial menu when any link inside it is tapped
  if (mobileRadial) {
    mobileRadial.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        setTimeout(closeMobileRadial, 250);
      });
    });
  }

  // Handle Esc key to close any open overlay
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (widget) widget.classList.remove('near');
      closeMobileRadial();
    }
  });

})();
