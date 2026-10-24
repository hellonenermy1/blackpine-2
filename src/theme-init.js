(() => {
  const root = document.documentElement;
  const preferencesKey = 'blackpine.preferences.v1';
  const legacyThemeKey = 'blackpine-theme';
  const valid = new Set(['dark', 'light']);
  root.classList?.add('js');
  try {
    let savedTheme = null;
    const rawPreferences = window.localStorage.getItem(preferencesKey);
    if (rawPreferences) {
      try {
        const preferences = JSON.parse(rawPreferences);
        if (preferences && typeof preferences === 'object' && valid.has(preferences.theme)) savedTheme = preferences.theme;
      } catch {
        // Corrupt preference data is ignored; the legacy key remains a safe fallback.
      }
    }
    const legacyTheme = window.localStorage.getItem(legacyThemeKey);
    if (!savedTheme && valid.has(legacyTheme)) {
      savedTheme = legacyTheme;
      const existing = rawPreferences ? (() => { try { return JSON.parse(rawPreferences); } catch { return {}; } })() : {};
      window.localStorage.setItem(preferencesKey, JSON.stringify({ ...existing, version: 1, theme: legacyTheme }));
    }
    if (savedTheme) root.dataset.theme = savedTheme;
  } catch {
    // Storage may be blocked. Leaving data-theme="auto" preserves the system preference.
  }
})();
