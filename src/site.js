(() => {
  const root = document.documentElement;
  const storageKey = 'blackpine-theme';
  const validThemes = new Set(['auto', 'dark', 'light']);

  const persistTheme = theme => {
    try {
      if (theme === 'auto') window.localStorage.removeItem(storageKey);
      else window.localStorage.setItem(storageKey, theme);
    } catch {
      // A blocked storage API must not interfere with navigation or page content.
    }
  };

  const slugify = value => String(value || '')
    .trim()
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

  const initTheme = () => {
    const button = document.querySelector('[data-theme-toggle]');
    if (!button) return;
    const order = ['auto', 'dark', 'light'];

    const updateLabel = () => {
      const current = validThemes.has(root.dataset.theme) ? root.dataset.theme : 'auto';
      const label = `${current[0].toUpperCase()}${current.slice(1)}`;
      button.textContent = `Theme: ${label}`;
      button.setAttribute('aria-label', `Colour theme is ${label}. Activate to change theme.`);
    };

    updateLabel();
    button.addEventListener('click', () => {
      const current = validThemes.has(root.dataset.theme) ? root.dataset.theme : 'auto';
      const next = order[(order.indexOf(current) + 1) % order.length];
      root.dataset.theme = next;
      persistTheme(next);
      updateLabel();
    });
  };

  const initNavigation = () => {
    const toggle = document.querySelector('[data-nav-toggle]');
    const nav = document.querySelector('[data-nav]');
    if (!toggle || !nav) return;

    const close = (returnFocus = false) => {
      nav.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
      if (returnFocus) toggle.focus();
    };

    toggle.addEventListener('click', () => {
      const open = toggle.getAttribute('aria-expanded') === 'true';
      nav.classList.toggle('is-open', !open);
      toggle.setAttribute('aria-expanded', String(!open));
    });
    nav.addEventListener('click', event => {
      if (event.target.closest('a')) close();
    });
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && nav.classList.contains('is-open')) close(true);
    });
    window.addEventListener('resize', () => {
      if (window.matchMedia('(min-width: 981px)').matches) close();
    }, { passive: true });
  };

  const initResearchFilters = () => {
    const typeFilter = document.querySelector('[data-filter-type]');
    const topicFilter = document.querySelector('[data-filter-topic]');
    const rows = [...document.querySelectorAll('[data-research-card]')];
    if (!rows.length || (!typeFilter && !topicFilter)) return;

    const params = new URLSearchParams(window.location.search);
    const selectFromParam = (select, param) => {
      if (!select || !param) return;
      const requested = slugify(param);
      const match = [...select.options].find(option => slugify(option.value || option.textContent) === requested);
      if (match) select.value = match.value;
    };

    selectFromParam(typeFilter, params.get('type'));
    selectFromParam(topicFilter, params.get('topic'));

    const status = document.createElement('p');
    status.className = 'filter-status';
    status.setAttribute('role', 'status');
    status.setAttribute('aria-live', 'polite');
    document.querySelector('.filter-bar')?.insertAdjacentElement('afterend', status);

    const apply = ({ updateUrl = false } = {}) => {
      const type = typeFilter?.value || 'all';
      const topic = topicFilter?.value || 'all';
      let visibleCount = 0;

      for (const row of rows) {
        const visible = (type === 'all' || slugify(row.dataset.type) === slugify(type)) &&
          (topic === 'all' || slugify(row.dataset.topic) === slugify(topic));
        row.hidden = !visible;
        if (visible) visibleCount += 1;
      }

      const featuredSection = document.querySelector('[data-research-featured-section]');
      if (featuredSection) {
        const featuredCards = [...featuredSection.querySelectorAll('[data-research-card]')];
        featuredSection.hidden = featuredCards.length > 0 && featuredCards.every(card => card.hidden);
      }

      status.textContent = `${visibleCount} publication${visibleCount === 1 ? '' : 's'} shown.`;

      if (updateUrl && window.history?.replaceState) {
        const next = new URL(window.location.href);
        if (type === 'all') next.searchParams.delete('type');
        else next.searchParams.set('type', slugify(type));
        if (topic === 'all') next.searchParams.delete('topic');
        else next.searchParams.set('topic', slugify(topic));
        window.history.replaceState({}, '', `${next.pathname}${next.search}${next.hash}`);
      }
    };

    typeFilter?.addEventListener('change', () => apply({ updateUrl: true }));
    topicFilter?.addEventListener('change', () => apply({ updateUrl: true }));
    apply();
  };

  const initContactContext = () => {
    const intent = document.querySelector('#intent');
    if (!intent) return;
    const service = new URLSearchParams(window.location.search).get('service');
    const serviceToIntent = {
      'security-assessments': 'Security assessment',
      'identity-email-security': 'Identity / email security',
      'cloud-saas-security': 'Cloud / SaaS security',
      'website-administrative-security': 'Website / administrative security',
      'incident-response': 'Incident response',
      'incident-readiness-recovery': 'Incident readiness',
      'security-advisory': 'Security advisory'
    };
    const desired = serviceToIntent[service];
    if (desired && [...intent.options].some(option => option.value === desired)) intent.value = desired;
  };

  const init = () => {
    initTheme();
    initNavigation();
    initResearchFilters();
    initContactContext();
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();
