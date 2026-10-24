(() => {
  const overlay = document.querySelector('[data-search-overlay]');
  const focusableSelector = [
    'a[href]',
    'button:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])'
  ].join(',');

  const visibleFocusable = root => [...root.querySelectorAll(focusableSelector)].filter(element => {
    if (element.hidden) return false;
    const style = window.getComputedStyle(element);
    return style.visibility !== 'hidden' && style.display !== 'none';
  });

  document.addEventListener('keydown', event => {
    if (!(event.metaKey || event.ctrlKey) || event.key.toLowerCase() !== 'k' || !overlay || overlay.hidden) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    overlay.querySelector('[data-search-input]')?.focus();
  }, true);

  overlay?.addEventListener('keydown', event => {
    if (event.key !== 'Tab' || overlay.hidden) return;
    const focusable = visibleFocusable(overlay);
    if (!focusable.length) {
      event.preventDefault();
      return;
    }
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });

  document.addEventListener('keydown', event => {
    if (event.key !== 'Escape') return;
    const activeGroup = [...document.querySelectorAll('[data-nav-group].is-expanded')]
      .find(group => group.contains(document.activeElement));
    const groupToggle = activeGroup?.querySelector('[data-nav-group-toggle]');
    if (groupToggle) requestAnimationFrame(() => groupToggle.focus());
  }, true);
})();
