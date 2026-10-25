(() => {
  const root = document.documentElement;
  const storageKey = 'blackpine.preferences.v1';
  const legacyThemeKey = 'blackpine-theme';
  const schemaVersion = 1;
  const validLocales = new Set(['en-CA', 'fr-CA', 'es']);
  const validThemes = new Set(['auto', 'dark', 'light']);
  const currentLocale = () => document.body?.dataset.locale || 'en-CA';

  const dialog = document.querySelector('[data-preferences-dialog]');
  if (!dialog) return;
  const form = dialog.querySelector('[data-preferences-form]');
  const status = dialog.querySelector('[data-preferences-status]');
  const openButtons = [...document.querySelectorAll('[data-preferences-open]')];
  const closeButtons = [...dialog.querySelectorAll('[data-preferences-close]')];
  const clearButton = dialog.querySelector('[data-preferences-clear]');
  const languageControls = [...dialog.querySelectorAll('[name="preferred-language"]')];
  const themeControls = [...dialog.querySelectorAll('[name="preferred-theme"]')];
  if (!form || !status || !clearButton || !languageControls.length || !themeControls.length) return;

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
      try {
        window.localStorage.removeItem(legacyThemeKey);
      } catch {}
      return true;
    } catch {
      return false;
    }
  };

  const isSelectSet = controls => controls.length === 1 && controls[0] instanceof HTMLSelectElement;

  const selectedValue = controls => isSelectSet(controls)
    ? controls[0].value
    : controls.find(control => control.checked)?.value;

  const selectValue = (controls, value) => {
    if (isSelectSet(controls)) {
      const select = controls[0];
      if ([...select.options].some(option => option.value === value)) select.value = value;
      else if (select.options.length) select.selectedIndex = 0;
      return;
    }
    const chosen = controls.find(control => control.value === value) || controls[0];
    if (chosen) chosen.checked = true;
  };

  const themeName = theme => {
    if (isSelectSet(themeControls)) {
      const option = [...themeControls[0].options].find(candidate => candidate.value === theme);
      return option?.textContent?.trim() || theme;
    }
    return themeControls
      .find(control => control.value === theme)
      ?.closest('.preference-choice')
      ?.querySelector('strong')
      ?.textContent?.trim() || theme;
  };

  const fallbackCopy = () => {
    if (currentLocale() === 'fr-CA') return {
      blocked: 'Le stockage est indisponible; les choix ne s’appliquent qu’à cette page.',
      unavailable: 'Préférence enregistrée; cette page n’est pas disponible dans cette langue.',
      cleared: 'Préférences enregistrées effacées.',
      button: 'Thème : {label}',
      aria: 'Le thème est {label}. Activez pour le changer.'
    };
    if (currentLocale() === 'es') return {
      blocked: 'El almacenamiento no está disponible; las opciones se aplican solo a esta página.',
      unavailable: 'Preferencia guardada; esta página no está disponible en ese idioma.',
      cleared: 'Preferencias guardadas borradas.',
      button: 'Tema: {label}',
      aria: 'El tema es {label}. Actívelo para cambiarlo.'
    };
    return {
      blocked: 'Storage is unavailable; choices apply only to this page.',
      unavailable: 'Preference saved; this page is not available in that language.',
      cleared: 'Saved preferences cleared.',
      button: 'Theme: {label}',
      aria: 'Theme is {label}. Activate to change it.'
    };
  };

  const format = (template, label) => String(template || '').replaceAll('{label}', label);

  const applyTheme = theme => {
    const next = validThemes.has(theme) ? theme : 'auto';
    root.dataset.theme = next;
    const button = document.querySelector('[data-theme-toggle]');
    if (!button) return;
    const label = themeName(next);
    const fallback = fallbackCopy();
    const buttonText = format(dialog.dataset.themeButtonTemplate || fallback.button, label);
    const ariaText = format(dialog.dataset.themeAriaTemplate || fallback.aria, label);
    if (buttonText) button.textContent = buttonText;
    if (ariaText) button.setAttribute('aria-label', ariaText);
  };

  const setStatus = message => { status.textContent = message || ''; };

  let returnFocus = null;

  const openDialog = () => {
    returnFocus = document.activeElement;
    const saved = readPreferences();
    const suggestedLocale = saved.locale || currentLocale();
    selectValue(languageControls, suggestedLocale);
    selectValue(themeControls, saved.theme || (validThemes.has(root.dataset.theme) ? root.dataset.theme : 'auto'));
    setStatus('');
    if (typeof dialog.showModal === 'function') dialog.showModal();
    else dialog.setAttribute('open', '');
  };

  const closeDialog = () => {
    if (typeof dialog.close === 'function' && dialog.open) dialog.close();
    else dialog.removeAttribute('open');
    returnFocus?.focus?.();
    returnFocus = null;
  };

  const targetForLocale = locale => {
    if (isSelectSet(languageControls)) {
      return [...languageControls[0].options].find(option => option.value === locale)?.dataset.target || '';
    }
    return languageControls.find(candidate => candidate.value === locale)?.dataset.target || '';
  };

  openButtons.forEach(button => button.addEventListener('click', () => openDialog()));
  closeButtons.forEach(button => button.addEventListener('click', closeDialog));

  dialog.addEventListener('keydown', event => {
    if (event.key !== 'Tab') return;
    const items = [...dialog.querySelectorAll('button:not([disabled]),input:not([disabled]),select:not([disabled]),a[href],[tabindex]:not([tabindex="-1"])')]
      .filter(item => !item.hidden && item.getClientRects().length);
    if (!items.length) return;
    const first = items[0];
    const last = items[items.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });

  form.addEventListener('submit', event => {
    event.preventDefault();
    const locale = selectedValue(languageControls) || currentLocale();
    const theme = selectedValue(themeControls) || 'auto';
    const saved = writePreferences({ locale, theme });
    applyTheme(theme);
    const target = targetForLocale(locale);
    if (target && target !== window.location.pathname) {
      window.location.assign(target);
      return;
    }
    const fallback = fallbackCopy();
    if (!saved) {
      setStatus(dialog.dataset.statusStorageBlocked || fallback.blocked);
      return;
    }
    if (locale !== currentLocale() && !target) {
      setStatus(dialog.dataset.statusLanguageUnavailable || fallback.unavailable);
      return;
    }
    closeDialog();
  });

  clearButton.addEventListener('click', () => {
    try {
      window.localStorage.removeItem(storageKey);
      window.localStorage.removeItem(legacyThemeKey);
    } catch {}
    root.dataset.theme = 'auto';
    selectValue(languageControls, currentLocale());
    selectValue(themeControls, 'auto');
    applyTheme('auto');
    const fallback = fallbackCopy();
    setStatus(dialog.dataset.statusCleared || fallback.cleared);
  });

  document.addEventListener('click', event => {
    const languageChoice = event.target.closest('[data-language-choice]');
    if (!languageChoice) return;
    const locale = languageChoice.dataset.locale;
    if (!validLocales.has(locale)) return;
    const current = readPreferences();
    writePreferences({ ...current, locale, theme: current.theme || (validThemes.has(root.dataset.theme) ? root.dataset.theme : 'auto') });
  });

  document.addEventListener('blackpine:themechange', event => {
    const theme = event.detail?.theme;
    if (!validThemes.has(theme)) return;
    const current = readPreferences();
    writePreferences({ ...current, theme });
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      for (const menu of document.querySelectorAll('[data-language-menu][open]')) menu.removeAttribute('open');
    }
  });
})();