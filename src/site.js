(() => {
  const root = document.documentElement;
  const validThemes = new Set(['auto', 'dark', 'light']);
  const locale = document.body?.dataset.locale || 'en-CA';
  const french = locale === 'fr-CA';
  const spanish = locale === 'es';
  const t = (english, frenchText, spanishText) => spanish ? spanishText : french ? frenchText : english;

  const slugify = value => String(value || '')
    .trim()
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

  const normalize = value => String(value || '')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9+.#-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  const clear = element => {
    while (element?.firstChild) element.removeChild(element.firstChild);
  };

  const paragraph = text => {
    const node = document.createElement('p');
    node.textContent = text;
    return node;
  };

  const initTheme = () => {
    const button = document.querySelector('[data-theme-toggle]');
    if (!button) return;
    const order = ['auto', 'dark', 'light'];
    const themeName = value => ({
      auto: t('Auto', 'Auto', 'Automático'),
      dark: t('Dark', 'Sombre', 'Oscuro'),
      light: t('Light', 'Clair', 'Claro')
    }[value] || value);
    const updateLabel = () => {
      const current = validThemes.has(root.dataset.theme) ? root.dataset.theme : 'auto';
      const label = themeName(current);
      button.textContent = t(`Theme: ${label}`, `Thème : ${label}`, `Tema: ${label}`);
      button.setAttribute('aria-label', t(
        `Colour theme is ${label}. Activate to change theme.`,
        `Le thème de couleurs est ${label}. Activez ce bouton pour changer de thème.`,
        `El tema de color es ${label}. Active este botón para cambiarlo.`
      ));
    };
    updateLabel();
    button.addEventListener('click', () => {
      const current = validThemes.has(root.dataset.theme) ? root.dataset.theme : 'auto';
      const next = order[(order.indexOf(current) + 1) % order.length];
      root.dataset.theme = next;
      updateLabel();
      document.dispatchEvent(new CustomEvent('blackpine:themechange', { detail: { theme: next } }));
    });
  };

  const initNavigation = () => {
    const toggle = document.querySelector('[data-nav-toggle]');
    const nav = document.querySelector('[data-nav]');
    if (!toggle || !nav) return;

    const groups = [...nav.querySelectorAll('[data-nav-group]')];
    const closeGroups = except => {
      for (const group of groups) {
        if (group === except) continue;
        group.classList.remove('is-expanded');
        group.querySelector('[data-nav-group-toggle]')?.setAttribute('aria-expanded', 'false');
      }
    };
    const closeMain = (returnFocus = false) => {
      nav.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
      closeGroups();
      if (returnFocus) toggle.focus();
    };

    toggle.addEventListener('click', () => {
      const open = toggle.getAttribute('aria-expanded') === 'true';
      nav.classList.toggle('is-open', !open);
      toggle.setAttribute('aria-expanded', String(!open));
      if (open) closeGroups();
    });

    for (const group of groups) {
      const groupToggle = group.querySelector('[data-nav-group-toggle]');
      groupToggle?.addEventListener('click', event => {
        event.preventDefault();
        const expanded = groupToggle.getAttribute('aria-expanded') === 'true';
        closeGroups(group);
        group.classList.toggle('is-expanded', !expanded);
        groupToggle.setAttribute('aria-expanded', String(!expanded));
      });
    }

    nav.addEventListener('click', event => {
      if (event.target.closest('.mega-panel a, .nav-direct')) closeMain();
    });
    document.addEventListener('click', event => {
      if (!event.target.closest('[data-nav]') && !event.target.closest('[data-nav-toggle]')) closeGroups();
    });
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape') {
        if (nav.classList.contains('is-open')) closeMain(true);
        else closeGroups();
      }
    });
    window.addEventListener('resize', () => {
      if (window.matchMedia('(min-width: 981px)').matches) closeMain();
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
        const visible = (type === 'all' || slugify(row.dataset.type) === slugify(type)) && (topic === 'all' || slugify(row.dataset.topic) === slugify(topic));
        row.hidden = !visible;
        if (visible) visibleCount += 1;
      }
      const featuredSection = document.querySelector('[data-research-featured-section]');
      if (featuredSection) {
        const featuredCards = [...featuredSection.querySelectorAll('[data-research-card]')];
        featuredSection.hidden = featuredCards.length > 0 && featuredCards.every(card => card.hidden);
      }
      status.textContent = spanish
        ? `${visibleCount} publicación${visibleCount === 1 ? '' : 'es'} mostrada${visibleCount === 1 ? '' : 's'}.`
        : french
          ? `${visibleCount} publication${visibleCount === 1 ? '' : 's'} affichée${visibleCount === 1 ? '' : 's'}.`
          : `${visibleCount} publication${visibleCount === 1 ? '' : 's'} shown.`;
      if (updateUrl && window.history?.replaceState) {
        const next = new URL(window.location.href);
        if (type === 'all') next.searchParams.delete('type'); else next.searchParams.set('type', slugify(type));
        if (topic === 'all') next.searchParams.delete('topic'); else next.searchParams.set('topic', slugify(topic));
        window.history.replaceState({}, '', `${next.pathname}${next.search}${next.hash}`);
      }
    };
    typeFilter?.addEventListener('change', () => apply({ updateUrl: true }));
    topicFilter?.addEventListener('change', () => apply({ updateUrl: true }));
    apply();
  };

  let searchIndexPromise;
  const loadSearchIndex = () => {
    if (!searchIndexPromise) {
      const indexPath = spanish ? '/es/search-index.json' : french ? '/fr/search-index.json' : '/search-index.json';
      searchIndexPromise = fetch(indexPath, { credentials: 'same-origin' })
        .then(response => {
          if (!response.ok) throw new Error(`Search index request failed: ${response.status}`);
          return response.json();
        })
        .catch(error => {
          searchIndexPromise = undefined;
          throw error;
        });
    }
    return searchIndexPromise;
  };

  const aliases = new Map(spanish ? [
    ['m365', 'microsoft 365'], ['o365', 'microsoft 365'], ['bec', 'compromiso correo electronico empresarial'],
    ['iam', 'gestion identidades accesos'], ['ir', 'respuesta incidentes'], ['dfir', 'analisis forense digital respuesta incidentes'],
    ['pentest', 'pruebas penetracion'], ['pen test', 'pruebas penetracion'], ['dmarc', 'dmarc autenticacion correo electronico'],
    ['dkim', 'dkim autenticacion correo electronico'], ['spf', 'spf autenticacion correo electronico'], ['soc', 'centro operaciones seguridad soc']
  ] : french ? [
    ['m365', 'microsoft 365'], ['o365', 'microsoft 365'], ['bec', 'compromission courriel affaires'],
    ['iam', 'gestion identites acces'], ['ir', 'intervention incident'], ['dfir', 'criminalistique numerique intervention incident'],
    ['pentest', 'test penetration'], ['pen test', 'test penetration'], ['dmarc', 'dmarc authentification courriel'],
    ['dkim', 'dkim authentification courriel'], ['spf', 'spf authentification courriel'], ['soc', 'centre operations securite cos']
  ] : [
    ['m365', 'microsoft 365'], ['o365', 'microsoft 365'], ['bec', 'business email compromise'],
    ['iam', 'identity access management'], ['ir', 'incident response'], ['dfir', 'digital forensics incident response'],
    ['pentest', 'penetration testing'], ['pen test', 'penetration testing'], ['dmarc', 'dmarc email authentication'],
    ['dkim', 'dkim email authentication'], ['spf', 'spf email authentication'], ['soc', 'security operations center']
  ]);

  const levenshteinWithinOne = (a, b) => {
    if (a === b) return true;
    if (Math.abs(a.length - b.length) > 1) return false;
    let i = 0, j = 0, edits = 0;
    while (i < a.length && j < b.length) {
      if (a[i] === b[j]) { i += 1; j += 1; continue; }
      edits += 1;
      if (edits > 1) return false;
      if (a.length > b.length) i += 1;
      else if (b.length > a.length) j += 1;
      else { i += 1; j += 1; }
    }
    return edits + Number(i < a.length || j < b.length) <= 1;
  };

  const searchEntries = (entries, rawQuery) => {
    const raw = normalize(rawQuery).slice(0, 120);
    if (raw.length < 2) return [];
    const expanded = aliases.get(raw) ? `${raw} ${aliases.get(raw)}` : raw;
    const tokens = [...new Set(normalize(expanded).split(' ').filter(token => token.length >= 2))];
    return entries.map(entry => {
      const title = normalize(entry.title);
      const description = normalize(entry.description);
      const headings = normalize((entry.headings || []).join(' '));
      const terms = normalize(entry.terms);
      const text = normalize(entry.text);
      let score = 0;
      if (title === raw) score += 1200;
      if (title.startsWith(raw)) score += 500;
      if (title.includes(raw)) score += 280;
      if (headings.includes(raw)) score += 170;
      if (terms.includes(raw)) score += 150;
      if (description.includes(raw)) score += 110;
      const titleWords = title.split(' ');
      for (const token of tokens) {
        if (title.includes(token)) score += 120;
        if (headings.includes(token)) score += 80;
        if (terms.includes(token)) score += 70;
        if (description.includes(token)) score += 45;
        if (text.includes(token)) score += 12;
        if (token.length >= 5 && titleWords.some(word => word.length >= 4 && levenshteinWithinOne(token, word))) score += 34;
      }
      const matched = tokens.filter(token => `${title} ${headings} ${terms} ${description} ${text}`.includes(token)).length;
      if (tokens.length > 1 && matched === tokens.length) score += 90;
      return { entry, score };
    }).filter(result => result.score > 0).sort((a, b) => b.score - a.score || a.entry.title.localeCompare(b.entry.title, spanish ? 'es' : french ? 'fr-CA' : 'en-CA'));
  };

  const familyLabel = family => {
    const english = {
      services: 'Capabilities', work: 'Work', research: 'Research', advisories: 'Research', reports: 'Research', resources: 'Resources',
      'security-baseline': 'Resources', glossary: 'Resources', labs: 'Labs', tools: 'Tools', trust: 'Trust', methodology: 'Trust',
      incident: 'Incident', company: 'Company', contact: 'Contact', legal: 'Legal', home: 'Blackpine', assessment: 'Tools', engagements: 'Capabilities'
    };
    const fr = {
      services: 'Expertises', work: 'Réalisations', research: 'Recherche', advisories: 'Recherche', reports: 'Recherche', resources: 'Ressources',
      'security-baseline': 'Ressources', glossary: 'Ressources', labs: 'Labs', tools: 'Outils', trust: 'Confiance', methodology: 'Confiance',
      incident: 'Incident', company: 'Entreprise', contact: 'Nous joindre', legal: 'Juridique', home: 'Blackpine', assessment: 'Outils', engagements: 'Expertises'
    };
    const es = {
      services: 'Servicios', work: 'Experiencia', research: 'Investigación', advisories: 'Investigación', reports: 'Investigación', resources: 'Recursos',
      'security-baseline': 'Recursos', glossary: 'Recursos', labs: 'Labs', tools: 'Herramientas', trust: 'Confianza', methodology: 'Confianza',
      incident: 'Incidente', company: 'Empresa', contact: 'Contacto', legal: 'Legal', home: 'Blackpine', assessment: 'Herramientas', engagements: 'Servicios'
    };
    return (spanish ? es : french ? fr : english)[family] || 'Blackpine';
  };

  const renderSearchResults = (container, results, limit = 12) => {
    clear(container);
    if (!results.length) {
      container.append(paragraph(t(
        'No matching public pages. Try a broader term or a service name.',
        'Aucune page publique ne correspond. Essayez un terme plus général ou le nom d’un service.',
        'No hay páginas públicas que coincidan. Pruebe con un término más general o con el nombre de un servicio.'
      )));
      return [];
    }
    const links = [];
    for (const { entry } of results.slice(0, limit)) {
      const link = document.createElement('a');
      link.className = 'search-result';
      link.href = entry.path;
      const meta = document.createElement('span');
      meta.className = 'search-result-family';
      meta.textContent = familyLabel(entry.family);
      const title = document.createElement('strong');
      title.textContent = entry.title;
      const description = document.createElement('span');
      description.className = 'search-result-description';
      description.textContent = entry.description;
      link.append(meta, title, description);
      container.append(link);
      links.push(link);
    }
    return links;
  };

  const initSearch = () => {
    const overlay = document.querySelector('[data-search-overlay]');
    const openButtons = [...document.querySelectorAll('[data-search-open]')];
    const closeButton = document.querySelector('[data-search-close]');
    const input = document.querySelector('[data-search-input]');
    const resultsNode = document.querySelector('[data-search-results]');
    const pageInput = document.querySelector('[data-search-page-input]');
    const pageResults = document.querySelector('[data-search-page-results]');
    const inertRoots = [...document.querySelectorAll('[data-header], main#main, .site-footer')];
    let resultLinks = [];
    let selected = -1;
    let returnFocus = null;
    let overlayRequest = 0;
    let pageRequest = 0;

    const setBackgroundInert = enabled => {
      for (const node of inertRoots) node.inert = enabled;
    };

    const run = async (query, container, limit, isCurrent = () => true) => {
      try {
        const entries = await loadSearchIndex();
        if (!isCurrent()) return null;
        const results = searchEntries(entries, query);
        if (!isCurrent()) return null;
        return renderSearchResults(container, results, limit);
      } catch {
        if (!isCurrent()) return null;
        clear(container);
        container.append(paragraph(t(
          'Search is temporarily unavailable. Navigation and the sitemap remain available; trying again will retry the local index.',
          'La recherche est temporairement indisponible. La navigation et le plan du site restent accessibles; une nouvelle tentative relancera l’index local.',
          'La búsqueda no está disponible temporalmente. La navegación y el mapa del sitio siguen disponibles; al intentarlo de nuevo se volverá a cargar el índice local.'
        )));
        return [];
      }
    };

    const selectResult = next => {
      resultLinks.forEach(link => link.removeAttribute('aria-current'));
      if (!resultLinks.length) { selected = -1; return; }
      selected = (next + resultLinks.length) % resultLinks.length;
      resultLinks[selected].setAttribute('aria-current', 'true');
      resultLinks[selected].scrollIntoView({ block: 'nearest' });
    };

    const open = trigger => {
      if (!overlay || !input) return;
      returnFocus = trigger || document.activeElement;
      overlay.hidden = false;
      setBackgroundInert(true);
      document.body.classList.add('search-open');
      requestAnimationFrame(() => input.focus());
      loadSearchIndex().catch(() => {});
    };
    const close = () => {
      if (!overlay) return;
      overlayRequest += 1;
      overlay.hidden = true;
      setBackgroundInert(false);
      document.body.classList.remove('search-open');
      selected = -1;
      returnFocus?.focus?.();
    };

    openButtons.forEach(button => button.addEventListener('click', () => open(button)));
    closeButton?.addEventListener('click', close);
    overlay?.addEventListener('click', event => { if (event.target === overlay) close(); });
    input?.addEventListener('input', async () => {
      const request = ++overlayRequest;
      const links = await run(input.value, resultsNode, 12, () => request === overlayRequest);
      if (links === null || request !== overlayRequest) return;
      resultLinks = links;
      selected = -1;
    });
    input?.addEventListener('keydown', event => {
      if (event.key === 'ArrowDown') { event.preventDefault(); selectResult(selected + 1); }
      if (event.key === 'ArrowUp') { event.preventDefault(); selectResult(selected - 1); }
      if (event.key === 'Enter' && selected >= 0 && resultLinks[selected]) { event.preventDefault(); resultLinks[selected].click(); }
    });
    document.addEventListener('keydown', event => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') { event.preventDefault(); open(document.activeElement); }
      if (event.key === 'Escape' && overlay && !overlay.hidden) { event.preventDefault(); close(); }
    });

    if (pageInput && pageResults) {
      const params = new URLSearchParams(window.location.search);
      const initial = params.get('q') || '';
      pageInput.value = initial.slice(0, 120);
      const runPageSearch = async query => {
        const request = ++pageRequest;
        const links = await run(query, pageResults, 30, () => request === pageRequest);
        return { request, links };
      };
      if (pageInput.value) runPageSearch(pageInput.value);
      pageInput.addEventListener('input', async () => {
        const query = pageInput.value.slice(0, 120);
        const { request } = await runPageSearch(query);
        if (request !== pageRequest) return;
        if (window.history?.replaceState) {
          const next = new URL(window.location.href);
          if (query.trim()) next.searchParams.set('q', query.trim()); else next.searchParams.delete('q');
          window.history.replaceState({}, '', `${next.pathname}${next.search}`);
        }
      });
    }
  };

  const init = () => {
    initTheme();
    initNavigation();
    initResearchFilters();
    initSearch();
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();
