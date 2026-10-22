(() => {
  const root = document.documentElement;
  const key = 'blackpine-theme';
  const valid = new Set(['dark', 'light']);
  try {
    const saved = window.localStorage.getItem(key);
    if (valid.has(saved)) root.dataset.theme = saved;
  } catch {
    // Storage may be blocked. Leaving data-theme="auto" preserves the system preference.
  }
})();
