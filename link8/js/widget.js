/**
 * ============================================================================
 * WIDGET.JS — Proximity Circular Contact Widget & Mobile Action Sheet
 * ============================================================================
 */

(function () {
  const widget = document.getElementById('socialWidget');
  const veil = document.getElementById('focusVeil');
  const mobileTrigger = document.getElementById('mobileSocialTrigger');
  const mobileSheet = document.getElementById('mobileContactSheet');
  const closeSheetBtn = document.getElementById('closeMobileSheet');
  const triggerIcon = document.getElementById('mobileTriggerIcon');

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
      if (!mobileSheet?.classList.contains('open')) {
        veil?.classList.toggle('active', isNear);
      }
    }

    window.addEventListener('mousemove', (e) => {
      handlePointer(e.clientX, e.clientY);
    }, { passive: true });

    window.addEventListener('mouseleave', () => {
      if (window.innerWidth >= 1024) {
        widget.classList.remove('near');
        if (!mobileSheet?.classList.contains('open')) {
          veil?.classList.remove('active');
        }
      }
    });
  }

  // --------------------------------------------------------------------------
  // 02. MOBILE ACTION SHEET CONTROLS (< 1024px)
  // --------------------------------------------------------------------------
  function openMobileSheet() {
    if (!mobileSheet) return;
    mobileSheet.classList.add('open');
    mobileSheet.style.setProperty('transform', 'translateY(0%)', 'important');
    mobileSheet.style.setProperty('opacity', '1', 'important');
    mobileSheet.style.setProperty('visibility', 'visible', 'important');
    mobileSheet.style.setProperty('pointer-events', 'auto', 'important');
    veil?.classList.add('active');
    if (triggerIcon) {
      triggerIcon.className = 'fa-solid fa-xmark text-base text-headline';
    }
  }

  function closeMobileSheet() {
    if (!mobileSheet) return;
    mobileSheet.classList.remove('open');
    mobileSheet.style.setProperty('transform', 'translateY(110%)', 'important');
    mobileSheet.style.setProperty('opacity', '0', 'important');
    mobileSheet.style.setProperty('visibility', 'hidden', 'important');
    mobileSheet.style.setProperty('pointer-events', 'none', 'important');
    if (widget) widget.classList.remove('near');
    veil?.classList.remove('active');
    if (triggerIcon) {
      triggerIcon.className = 'fa-solid fa-comments text-base text-blue-600 dark:text-blue-400';
    }
  }

  let lastTriggerTime = 0;
  function handleTrigger(e) {
    const now = Date.now();
    if (now - lastTriggerTime < 350) return;
    lastTriggerTime = now;
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (mobileSheet?.classList.contains('open')) {
      closeMobileSheet();
    } else {
      openMobileSheet();
    }
  }

  mobileTrigger?.addEventListener('click', handleTrigger);
  mobileTrigger?.addEventListener('touchend', handleTrigger);

  closeSheetBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    closeMobileSheet();
  });

  // Tap on focus veil closes either desktop widget or mobile sheet
  veil?.addEventListener('click', () => {
    if (widget) widget.classList.remove('near');
    closeMobileSheet();
  });

  // Auto-close sheet when any link inside it is tapped
  if (mobileSheet) {
    mobileSheet.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        setTimeout(closeMobileSheet, 200);
      });
    });
  }

  // Handle Esc key to close any open overlay
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (widget) widget.classList.remove('near');
      closeMobileSheet();
    }
  });

})();
