(() => {
  const root = document.documentElement;
  const preferencesKey = 'blackpine.preferences.v1';
  const legacyThemeKey = 'blackpine-theme';
  const validThemes = new Set(['auto', 'dark', 'light']);
  const validLegacyThemes = new Set(['dark', 'light']);
  root.classList?.add('js');

  try {
    const rawPreferences = window.localStorage.getItem(preferencesKey);
    let preferences = {};
    if (rawPreferences) {
      try {
        const parsed = JSON.parse(rawPreferences);
        if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) preferences = parsed;
      } catch {
        // Corrupt primary preference data is ignored; a valid legacy theme can still be migrated.
      }
    }

    let savedTheme = validThemes.has(preferences.theme) ? preferences.theme : null;
    let primaryOwnsTheme = Boolean(savedTheme);
    const legacyTheme = window.localStorage.getItem(legacyThemeKey);

    if (!savedTheme && validLegacyThemes.has(legacyTheme)) {
      savedTheme = legacyTheme;
      try {
        window.localStorage.setItem(preferencesKey, JSON.stringify({ ...preferences, version: 1, theme: legacyTheme }));
        primaryOwnsTheme = true;
      } catch {
        // Keep the legacy key if migration cannot be persisted; the visible theme can still be restored for this page.
      }
    }

    if (savedTheme) root.dataset.theme = savedTheme;

    if (legacyTheme !== null && primaryOwnsTheme) {
      try {
        window.localStorage.removeItem(legacyThemeKey);
      } catch {
        // Cleanup is best-effort; the primary preference remains authoritative.
      }
    }
  } catch {
    // Storage may be blocked. Leaving data-theme="auto" preserves the system preference.
  }
})();
