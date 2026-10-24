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

  const make = (tag, className, text) => {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (text !== undefined) element.textContent = text;
    return element;
  };

  const languageOptions = () => {
    const seen = new Set();
    const options = [];
    for (const row of document.querySelectorAll('[data-language-menu] [data-locale]')) {
      const locale = row.dataset.locale;
      if (!validLocales.has(locale) || seen.has(locale)) continue;
      seen.add(locale);
      const labelNode = row.querySelector('strong');
      const current = row.getAttribute('aria-current') === 'page';
      const href = row instanceof HTMLAnchorElement ? row.getAttribute('href') || '' : current ? window.location.pathname : '';
      options.push({
        locale,
        label: labelNode?.textContent?.trim() || locale,
        language: labelNode?.getAttribute('lang') || locale.split('-')[0],
        target: href,
        available: Boolean(href)
      });
    }
    return options;
  };

  function ensureDialog() {
    const existing = document.querySelector('[data-preferences-dialog]');
    if (existing) return existing;

    const dialog = make('dialog', 'preferences-dialog');
    dialog.dataset.preferencesDialog = '';
    dialog.setAttribute('aria-labelledby', 'preferences-title');

    const form = make('form', 'preferences-form');
    form.dataset.preferencesForm = '';

    const head = make('div', 'preferences-head');
    const headCopy = make('div');
    headCopy.append(make('span', 'preferences-kicker', 'Blackpine preferences'));
    const title = make('h2', '', 'Language & privacy preferences');
    title.id = 'preferences-title';
    headCopy.append(title);
    const topClose = make('button', 'preferences-close', 'Close');
    topClose.type = 'button';
    topClose.dataset.preferencesClose = '';
    topClose.setAttribute('aria-label', 'Close preferences');
    head.append(headCopy, topClose);
    form.append(head);

    form.append(make('p', 'preferences-copy', 'Choose how Blackpine should present the public site on this browser. A language preference is remembered even when a reviewed translation of the current page has not been published yet.'));

    const languageFieldset = make('fieldset', 'preferences-fieldset');
    languageFieldset.append(make('legend', '', 'Preferred language'));
    for (const option of languageOptions()) {
      const label = make('label', 'preference-choice');
      const input = make('input');
      input.type = 'radio';
      input.name = 'preferred-language';
      input.value = option.locale;
      input.dataset.target = option.target;
      if (option.locale === currentLocale()) input.checked = true;
      const copy = make('span', 'preference-choice-copy');
      const strong = make('strong', '', option.label);
      strong.lang = option.language;
      const availability = option.available
        ? 'Available for this page.'
        : 'Your preference can be saved now; this page stays in its current language until a reviewed translation is published.';
      copy.append(strong, make('small', '', availability));
      label.append(input, copy);
      languageFieldset.append(label);
    }
    form.append(languageFieldset);

    const themeFieldset = make('fieldset', 'preferences-fieldset');
    themeFieldset.append(make('legend', '', 'Display theme'));
    for (const [value, titleText, note] of [
      ['auto', 'Auto', 'Follow your device setting.'],
      ['dark', 'Dark', "Use Blackpine's dark theme."],
      ['light', 'Light', "Use Blackpine's light theme."]
    ]) {
      const label = make('label', 'preference-choice');
      const input = make('input');
      input.type = 'radio';
      input.name = 'preferred-theme';
      input.value = value;
      if (value === 'auto') input.checked = true;
      const copy = make('span', 'preference-choice-copy');
      copy.append(make('strong', '', titleText), make('small', '', note));
      label.append(input, copy);
      themeFieldset.append(label);
    }
    form.append(themeFieldset);

    const privacy = make('div', 'preferences-privacy');
    privacy.append(make('strong', '', 'Privacy by default. '));
    privacy.append(document.createTextNode('Blackpine stores only these display preferences in local browser storage. Under the current published corporate-site baseline, the site does not include advertising networks, third-party analytics, a third-party tag manager, or social-media tracking widgets. No unique preference identifier is created or transmitted to Blackpine.'));
    form.append(privacy);

    const status = make('p', 'preferences-status');
    status.dataset.preferencesStatus = '';
    status.setAttribute('role', 'status');
    status.setAttribute('aria-live', 'polite');
    form.append(status);

    const actions = make('div', 'preferences-actions');
    const clear = make('button', 'preferences-clear', 'Clear saved preferences');
    clear.type = 'button';
    clear.dataset.preferencesClear = '';
    const dismiss = make('button', 'preferences-close', 'Not now');
    dismiss.type = 'button';
    dismiss.dataset.preferencesClose = '';
    const save = make('button', 'preferences-save', 'Save preferences');
    save.type = 'submit';
    actions.append(clear, dismiss, save);
    form.append(actions);

    dialog.append(form);
    document.body.append(dialog);
    return dialog;
  }

  const dialog = ensureDialog();
  const form = dialog.querySelector('[data-preferences-form]');
  const status = dialog.querySelector('[data-preferences-status]');
  const openButtons = [...document.querySelectorAll('[data-preferences-open]')];
  const closeButtons = [...dialog.querySelectorAll('[data-preferences-close]')];
  const clearButton = dialog.querySelector('[data-preferences-clear]');
  const languageInputs = [...dialog.querySelectorAll('input[name="preferred-language"]')];
  const themeInputs = [...dialog.querySelectorAll('input[name="preferred-theme"]')];
  let returnFocus = null;

  const setStatus = message => { status.textContent = message || ''; };

  const selectValue = (inputs, value) => {
    const chosen = inputs.find(input => input.value === value) || inputs[0];
    if (chosen) chosen.checked = true;
  };

  const openDialog = ({ firstVisit = false } = {}) => {
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
    if (typeof dialog.close === 'function' && dialog.open) dialog.close();
    else dialog.removeAttribute('open');
    returnFocus?.focus?.();
    returnFocus = null;
  };

  const targetForLocale = locale => languageInputs.find(candidate => candidate.value === locale)?.dataset.target || '';

  openButtons.forEach(button => button.addEventListener('click', () => openDialog()));
  closeButtons.forEach(button => button.addEventListener('click', closeDialog));

  form.addEventListener('submit', event => {
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

  clearButton.addEventListener('click', () => {
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
