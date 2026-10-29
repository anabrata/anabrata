/**
 * ============================================================================
 * THEME.JS — Explicit Light / Dark System with Data-Theme Synchronization
 * ============================================================================
 */

(function () {
  const themeToggle = document.getElementById('themeToggle');
  const themeIcon = document.getElementById('themeIcon');
  const html = document.documentElement;

  // Apply a theme explicitly to data-theme attribute, classList, and icon
  function applyTheme(theme) {
    if (theme === 'dark') {
      html.setAttribute('data-theme', 'dark');
      html.classList.add('dark');
      if (themeIcon) themeIcon.className = 'fa-regular fa-sun text-sm text-amber-400';
    } else {
      html.setAttribute('data-theme', 'light');
      html.classList.remove('dark');
      if (themeIcon) themeIcon.className = 'fa-regular fa-moon text-sm';
    }
  }

  // Default to 'light' (Pure White High-Contrast Theme)
  const savedTheme = localStorage.getItem('ab_theme') || 'light';
  applyTheme(savedTheme);

  themeToggle?.addEventListener('click', () => {
    const currentTheme = html.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    applyTheme(newTheme);
    localStorage.setItem('ab_theme', newTheme);
  });
})();
