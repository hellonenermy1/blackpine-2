(() => {
  const root = document.documentElement;
  const storageKey = 'blackpine.preferences.v1';
  const legacyThemeKey = 'blackpine-theme';
  const schemaVersion = 1;
  const validLocales = new Set(['en-CA', 'fr-CA', 'es']);
  const validThemes = new Set(['auto', 'dark', 'light']);

  const parsePreferences = value => {
    if (!value) return {};
    try {
      const parsed = JSON.parse(value);
      if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return {};
      return {
        ...(validLocales.has(parsed.locale) ? { locale: parsed.locale } : {}),
        ...(validThemes.has(parsed.theme) ? { theme: parsed.theme } : {})
      };
    } catch {
      return {};
    }
  };

  const readPreferences = () => {
    try {
      return parsePreferences(window.localStorage.getItem(storageKey));
    } catch {
      return {};
    }
  };

  const writePreferences = next => {
    const clean = {
      version: schemaVersion,
      ...(validLocales.has(next.locale) ? { locale: next.locale } : {}),
      ...(validThemes.has(next.theme) ? { theme: next.theme } : {})
    };
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(clean));
      return true;
    } catch {
      return false;
    }
  };

  const syncLegacyTheme = theme => {
    try {
      if (theme === 'auto') window.localStorage.removeItem(legacyThemeKey);
      else window.localStorage.setItem(legacyThemeKey, theme);
    } catch {
      // Browser storage is optional; the visible theme still changes for this page.
    }
  };

  const applyTheme = theme => {
    const next = validThemes.has(theme) ? theme : 'auto';
    root.dataset.theme = next;
    syncLegacyTheme(next);
    const button = document.querySelector('[data-theme-toggle]');
    if (button) {
      const label = `${next[0].toUpperCase()}${next.slice(1)}`;
      button.textContent = `Theme: ${label}`;
      button.setAttribute('aria-label', `Colour theme is ${label}. Activate to change theme.`);
    }
  };

  const currentLocale = () => document.body?.dataset.locale || 'en-CA';

  const preferredBrowserLocale = () => {
    const languages = Array.isArray(navigator.languages) && navigator.languages.length ? navigator.languages : [navigator.language];
    for (const value of languages) {
      const language = String(value || '').toLowerCase();
      if (language.startsWith('fr')) return 'fr-CA';
      if (language.startsWith('es')) return 'es';
      if (language.startsWith('en')) return 'en-CA';
    }
    return 'en-CA';
  };

  const firstVisitPromptAllowed = () => {
    const localPreview = window.location.hostname === '127.0.0.1' || window.location.hostname === 'localhost';
    if (!localPreview) return true;
    return new URLSearchParams(window.location.search).get('preferences-test') === '1';
  };

  const dialog = document.querySelector('[data-preferences-dialog]');
  const form = dialog?.querySelector('[data-preferences-form]');
  const status = dialog?.querySelector('[data-preferences-status]');
  const openButtons = [...document.querySelectorAll('[data-preferences-open]')];
  const closeButtons = [...document.querySelectorAll('[data-preferences-close]')];
  const clearButton = dialog?.querySelector('[data-preferences-clear]');
  const languageInputs = [...(dialog?.querySelectorAll('input[name="preferred-language"]') || [])];
  const themeInputs = [...(dialog?.querySelectorAll('input[name="preferred-theme"]') || [])];
  let returnFocus = null;

  const setStatus = message => {
    if (status) status.textContent = message || '';
  };

  const selectValue = (inputs, value) => {
    const chosen = inputs.find(input => input.value === value) || inputs[0];
    if (chosen) chosen.checked = true;
  };

  const openDialog = ({ firstVisit = false } = {}) => {
    if (!dialog) return;
    returnFocus = firstVisit ? null : document.activeElement;
    const saved = readPreferences();
    const suggestedLocale = saved.locale || (currentLocale() !== 'en-CA' ? currentLocale() : preferredBrowserLocale());
    selectValue(languageInputs, suggestedLocale);
    selectValue(themeInputs, saved.theme || (validThemes.has(root.dataset.theme) ? root.dataset.theme : 'auto'));
    setStatus('');
    dialog.dataset.firstVisit = firstVisit ? 'true' : 'false';
    if (typeof dialog.showModal === 'function') dialog.showModal();
    else dialog.setAttribute('open', '');
  };

  const closeDialog = () => {
    if (!dialog) return;
    if (typeof dialog.close === 'function' && dialog.open) dialog.close();
    else dialog.removeAttribute('open');
    returnFocus?.focus?.();
    returnFocus = null;
  };

  const targetForLocale = locale => {
    const input = languageInputs.find(candidate => candidate.value === locale);
    return input?.dataset.target || '';
  };

  openButtons.forEach(button => button.addEventListener('click', () => openDialog()));
  closeButtons.forEach(button => button.addEventListener('click', closeDialog));

  form?.addEventListener('submit', event => {
    event.preventDefault();
    const locale = languageInputs.find(input => input.checked)?.value || currentLocale();
    const theme = themeInputs.find(input => input.checked)?.value || 'auto';
    const saved = writePreferences({ locale, theme });
    applyTheme(theme);
    const target = targetForLocale(locale);
    if (target && target !== window.location.pathname) {
      window.location.assign(target);
      return;
    }
    if (!saved) {
      setStatus('Your browser blocked preference storage. Your choices apply to this page only.');
      return;
    }
    if (locale !== currentLocale() && !target) {
      setStatus('Preference saved. This page is not yet published in that language, so the current page remains unchanged.');
      return;
    }
    closeDialog();
  });

  clearButton?.addEventListener('click', () => {
    try {
      window.localStorage.removeItem(storageKey);
      window.localStorage.removeItem(legacyThemeKey);
    } catch {
      // Clearing is best-effort when browser storage is unavailable.
    }
    root.dataset.theme = 'auto';
    selectValue(languageInputs, currentLocale());
    selectValue(themeInputs, 'auto');
    setStatus('Saved Blackpine preferences were cleared from this browser.');
  });

  document.addEventListener('click', event => {
    const languageChoice = event.target.closest('[data-language-choice]');
    if (languageChoice) {
      const locale = languageChoice.dataset.locale;
      if (validLocales.has(locale)) {
        const current = readPreferences();
        writePreferences({ ...current, locale, theme: current.theme || (validThemes.has(root.dataset.theme) ? root.dataset.theme : 'auto') });
      }
    }
    if (event.target.closest('[data-theme-toggle]')) {
      queueMicrotask(() => {
        const current = readPreferences();
        const theme = validThemes.has(root.dataset.theme) ? root.dataset.theme : 'auto';
        writePreferences({ ...current, theme });
      });
    }
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      for (const menu of document.querySelectorAll('[data-language-menu][open]')) menu.removeAttribute('open');
    }
  });

  const saved = readPreferences();
  if (!saved.locale && firstVisitPromptAllowed()) requestAnimationFrame(() => openDialog({ firstVisit: true }));
})();
