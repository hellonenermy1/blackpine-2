(() => {
  const root = document.documentElement;
  const storageKey = 'blackpine-theme';
  const validThemes = new Set(['auto', 'dark', 'light']);
  const locale = document.body?.dataset.locale || 'en-CA';
  const french = locale === 'fr-CA';
  const t = (english, frenchText) => french ? frenchText : english;

  const persistTheme = theme => {
    try {
      if (theme === 'auto') window.localStorage.removeItem(storageKey);
      else window.localStorage.setItem(storageKey, theme);
    } catch {
      // Storage is optional. Theme controls must continue to work without it.
    }
  };

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
      auto: t('Auto', 'Auto'),
      dark: t('Dark', 'Sombre'),
      light: t('Light', 'Clair')
    }[value] || value);
    const updateLabel = () => {
      const current = validThemes.has(root.dataset.theme) ? root.dataset.theme : 'auto';
      const label = themeName(current);
      button.textContent = t(`Theme: ${label}`, `Thème : ${label}`);
      button.setAttribute('aria-label', t(
        `Colour theme is ${label}. Activate to change theme.`,
        `Le thème de couleurs est ${label}. Activez ce bouton pour changer de thème.`
      ));
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
      status.textContent = french
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
      const indexPath = french ? '/fr/search-index.json' : '/search-index.json';
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

  const aliases = new Map(french ? [
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
    }).filter(result => result.score > 0).sort((a, b) => b.score - a.score || a.entry.title.localeCompare(b.entry.title, french ? 'fr-CA' : 'en-CA'));
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
    return (french ? fr : english)[family] || 'Blackpine';
  };

  const renderSearchResults = (container, results, limit = 12) => {
    clear(container);
    if (!results.length) {
      container.append(paragraph(t(
        'No matching public pages. Try a broader term or a service name.',
        'Aucune page publique ne correspond. Essayez un terme plus général ou le nom d’un service.'
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
          'La recherche est temporairement indisponible. La navigation et le plan du site restent accessibles; une nouvelle tentative relancera l’index local.'
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

  const renderChecks = (container, checks) => {
    clear(container);
    const list = document.createElement('ul');
    list.className = 'tool-checks';
    for (const [label, ok, detail] of checks) {
      const item = document.createElement('li');
      const status = document.createElement('strong');
      status.textContent = ok ? t('Present', 'Présent') : t('Review', 'À examiner');
      status.className = ok ? 'check-ok' : 'check-review';
      const name = document.createElement('span');
      name.textContent = label;
      const note = document.createElement('small');
      note.textContent = detail;
      item.append(status, name, note);
      list.append(item);
    }
    container.append(list);
  };

  const initHeaderTool = () => {
    const input = document.querySelector('[data-headers-input]');
    const run = document.querySelector('[data-headers-run]');
    const output = document.querySelector('[data-headers-output]');
    if (!input || !run || !output) return;
    run.addEventListener('click', () => {
      const lines = input.value.slice(0, 40000).split(/\r?\n/);
      const headers = new Map();
      for (const line of lines) {
        const index = line.indexOf(':');
        if (index <= 0) continue;
        headers.set(line.slice(0, index).trim().toLowerCase(), line.slice(index + 1).trim());
      }
      const csp = headers.get('content-security-policy') || '';
      renderChecks(output, [
        ['Content-Security-Policy', Boolean(csp), csp ? t('A CSP header is present. Its directives still need to match the application.', 'Un en-tête CSP est présent. Ses directives doivent néanmoins correspondre à l’application.') : t('No CSP header was found in the pasted text.', 'Aucun en-tête CSP n’a été trouvé dans le texte collé.')],
        ['HSTS', headers.has('strict-transport-security'), headers.has('strict-transport-security') ? t('Strict-Transport-Security is present.', 'Strict-Transport-Security est présent.') : t('No Strict-Transport-Security header was found.', 'Aucun en-tête Strict-Transport-Security n’a été trouvé.')],
        [t('MIME sniffing', 'Détection MIME'), /nosniff/i.test(headers.get('x-content-type-options') || ''), /nosniff/i.test(headers.get('x-content-type-options') || '') ? t('X-Content-Type-Options includes nosniff.', 'X-Content-Type-Options contient nosniff.') : t('X-Content-Type-Options: nosniff was not found.', 'X-Content-Type-Options: nosniff n’a pas été trouvé.')],
        [t('Framing control', 'Contrôle de l’intégration dans un cadre'), /frame-ancestors/i.test(csp) || headers.has('x-frame-options'), t('Prefer CSP frame-ancestors for modern framing control; X-Frame-Options may provide legacy coverage.', 'Privilégiez la directive CSP frame-ancestors pour le contrôle moderne de l’intégration dans un cadre; X-Frame-Options peut offrir une couverture pour les anciens navigateurs.')],
        [t('Referrer policy', 'Politique de référent'), headers.has('referrer-policy'), headers.has('referrer-policy') ? t('A Referrer-Policy header is present.', 'Un en-tête Referrer-Policy est présent.') : t('No Referrer-Policy header was found.', 'Aucun en-tête Referrer-Policy n’a été trouvé.')],
        [t('Permissions policy', 'Politique des autorisations'), headers.has('permissions-policy'), headers.has('permissions-policy') ? t('A Permissions-Policy header is present.', 'Un en-tête Permissions-Policy est présent.') : t('No Permissions-Policy header was found.', 'Aucun en-tête Permissions-Policy n’a été trouvé.')]
      ]);
    });
  };

  const initEmailTool = () => {
    const input = document.querySelector('[data-email-records-input]');
    const run = document.querySelector('[data-email-records-run]');
    const output = document.querySelector('[data-email-records-output]');
    if (!input || !run || !output) return;
    run.addEventListener('click', () => {
      const value = input.value.slice(0, 40000).toLowerCase();
      const hasSpf = value.includes('v=spf1');
      const hasDkim = value.includes('v=dkim1') || /[a-z0-9._-]+\._domainkey/.test(value);
      const hasDmarc = value.includes('v=dmarc1');
      const dmarcPolicy = value.match(/\bp\s*=\s*(none|quarantine|reject)\b/)?.[1] || '';
      renderChecks(output, [
        ['SPF', hasSpf, hasSpf ? t('An SPF version marker is present. Confirm that the record resolves to the intended senders and stays within DNS lookup limits.', 'Un marqueur de version SPF est présent. Confirmez que l’enregistrement correspond aux expéditeurs prévus et respecte les limites de recherches DNS.') : t('No v=spf1 record marker was found.', 'Aucun marqueur d’enregistrement v=spf1 n’a été trouvé.')],
        ['DKIM', hasDkim, hasDkim ? t('DKIM-related text is present. A pasted record cannot prove that production messages are actually being signed with this selector.', 'Du contenu lié à DKIM est présent. Un enregistrement collé ne permet pas de prouver que les messages de production sont réellement signés avec ce sélecteur.') : t('No DKIM marker or _domainkey selector was recognized.', 'Aucun marqueur DKIM ni sélecteur _domainkey n’a été reconnu.')],
        ['DMARC', hasDmarc, hasDmarc ? (french ? `Un enregistrement DMARC est présent${dmarcPolicy ? ` avec p=${dmarcPolicy}` : ''}.` : `A DMARC record is present${dmarcPolicy ? ` with p=${dmarcPolicy}` : ''}.`) : t('No v=DMARC1 marker was found.', 'Aucun marqueur v=DMARC1 n’a été trouvé.')],
        [t('DMARC enforcement', 'Application de DMARC'), dmarcPolicy === 'quarantine' || dmarcPolicy === 'reject', dmarcPolicy === 'none' ? t('p=none is monitoring-oriented and does not request enforcement.', 'p=none sert principalement à l’observation et ne demande aucune mesure d’application.') : dmarcPolicy ? (french ? `p=${dmarcPolicy} demande au destinataire d’appliquer une mesure aux messages qui échouent aux contrôles.` : `p=${dmarcPolicy} requests receiver action for failing mail.`) : t('No enforceable DMARC policy was recognized.', 'Aucune politique DMARC applicable n’a été reconnue.')]
      ]);
    });
  };

  const initDnsTool = () => {
    const input = document.querySelector('[data-dns-records-input]');
    const run = document.querySelector('[data-dns-records-run]');
    const output = document.querySelector('[data-dns-records-output]');
    if (!input || !run || !output) return;
    run.addEventListener('click', () => {
      const value = input.value.slice(0, 50000).toLowerCase();
      renderChecks(output, [
        [t('Authoritative nameservers', 'Serveurs de noms faisant autorité'), /\sns\s/.test(value), t('NS records identify the authoritative DNS service but do not prove registrar or provider account security.', 'Les enregistrements NS indiquent le service DNS faisant autorité, mais ne prouvent pas la sécurité du compte chez le registraire ou le fournisseur.')],
        [t('Mail routing', 'Routage du courriel'), /\smx\s/.test(value), t('MX records identify mail routing and should be reviewed together with SPF, DKIM, and DMARC.', 'Les enregistrements MX indiquent le routage du courriel et devraient être examinés avec SPF, DKIM et DMARC.')],
        [t('SPF signal', 'Indice SPF'), value.includes('v=spf1'), t('SPF can help receivers evaluate which systems are authorized to send for a domain.', 'SPF peut aider les destinataires à déterminer quels systèmes sont autorisés à envoyer des messages pour un domaine.')],
        [t('DMARC signal', 'Indice DMARC'), value.includes('v=dmarc1') || value.includes('_dmarc'), t('DMARC adds policy and reporting around SPF/DKIM alignment.', 'DMARC ajoute une politique et des rapports concernant l’alignement SPF/DKIM.')],
        ['CAA', /\scaa\s/.test(value), t('CAA can restrict which certificate authorities are permitted to issue certificates for the domain.', 'CAA peut limiter les autorités de certification autorisées à délivrer des certificats pour le domaine.')],
        [t('DNSSEC evidence', 'Indices DNSSEC'), /\s(ds|rrsig|dnskey)\s/.test(value), t('DS, DNSKEY, or RRSIG records are DNSSEC-related signals. A pasted set cannot prove the full validation chain.', 'Les enregistrements DS, DNSKEY ou RRSIG constituent des indices liés à DNSSEC. Un ensemble collé ne peut pas prouver l’intégralité de la chaîne de validation.')]
      ]);
    });
  };

  const initAssessment = () => {
    const assessment = document.querySelector('[data-assessment]');
    const run = document.querySelector('[data-assessment-run]');
    const reset = document.querySelector('[data-assessment-reset]');
    const output = document.querySelector('[data-assessment-output]');
    if (!assessment || !run || !output) return;
    const scoreMap = { yes: 2, partial: 1, no: 0 };
    const categoryFr = {
      identity: 'Identités', email: 'Courriel', cloud: 'Infonuagique', recovery: 'Reprise',
      website: 'Site Web', monitoring: 'Surveillance', incident: 'Incident', governance: 'Gouvernance'
    };
    run.addEventListener('click', () => {
      const fields = [...assessment.querySelectorAll('fieldset[data-category]')];
      const unanswered = fields.filter(field => !field.querySelector('input:checked'));
      clear(output);
      if (unanswered.length) {
        output.append(paragraph(french
          ? `Répondez aux ${fields.length} questions avant d’examiner le résultat. Il reste ${unanswered.length} question${unanswered.length === 1 ? '' : 's'} sans réponse.`
          : `Answer all ${fields.length} questions before reviewing the result. ${unanswered.length} remain unanswered.`));
        unanswered[0].querySelector('input')?.focus();
        return;
      }
      const categories = new Map();
      for (const field of fields) {
        const value = field.querySelector('input:checked')?.value;
        const category = field.dataset.category;
        if (!categories.has(category)) categories.set(category, []);
        categories.get(category).push(scoreMap[value] ?? 0);
      }
      const list = document.createElement('div');
      list.className = 'assessment-results';
      for (const [category, scores] of categories) {
        const average = scores.reduce((sum, score) => sum + score, 0) / scores.length;
        const status = average >= 1.5 ? t('Stronger baseline', 'Référence plus solide') : average >= 0.75 ? t('Needs review', 'À examiner') : t('Material gap', 'Écart important');
        const row = document.createElement('div');
        const name = document.createElement('strong');
        name.textContent = french ? (categoryFr[category] || category) : category.replace(/\b\w/g, char => char.toUpperCase());
        const state = document.createElement('span');
        state.textContent = status;
        row.append(name, state);
        list.append(row);
      }
      output.append(paragraph(t(
        'These observations come only from the eight answers above. They are not a risk rating or security assessment.',
        'Ces observations reposent uniquement sur les huit réponses ci-dessus. Elles ne constituent ni une cote de risque ni une évaluation de la sécurité.'
      )), list);
    });
    reset?.addEventListener('click', () => {
      assessment.querySelectorAll('input[type="radio"]').forEach(input => { input.checked = false; });
      clear(output);
      output.append(paragraph(t(
        'Answer the questions to produce category-level observations.',
        'Répondez aux questions pour obtenir des observations par catégorie.'
      )));
    });
  };

  const init = () => {
    initTheme();
    initNavigation();
    initResearchFilters();
    initSearch();
    initHeaderTool();
    initEmailTool();
    initDnsTool();
    initAssessment();
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();
