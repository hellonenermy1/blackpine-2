(() => {
  const initContact = () => {
    const form = document.querySelector('[data-contact-form]');
    const intent = form?.querySelector('#intent');
    if (!form || !intent) return;

    const params = new URLSearchParams(window.location.search);
    const urgentFields = [...form.querySelectorAll('[data-contact-urgent]')];
    const capabilityField = form.querySelector('[data-capability-context]');
    const note = form.querySelector('[data-contact-intent-note]');
    const composeButton = form.querySelector('[data-contact-compose-button]');
    const urgentIntents = new Set(['emergency-response', 'investigate', 'recover']);
    const knownIntents = new Set([...intent.options].map(option => option.value).filter(Boolean));
    const serviceToIntent = {
      'security-assessments': 'protect',
      'identity-email-security': 'protect',
      'cloud-saas-security': 'protect',
      'website-administrative-security': 'protect',
      'incident-response': 'emergency-response',
      'incident-readiness-recovery': 'recover',
      'security-advisory': 'protect',
      'penetration-testing': 'protect',
      'application-security': 'protect',
      'digital-forensics': 'investigate',
      'security-monitoring': 'monitor',
      'compliance-readiness': 'protect'
    };
    const notes = {
      'emergency-response': 'If a normal mailbox or device may be compromised, use the safe-contact fields below.',
      investigate: 'Describe what looks unusual. Blackpine can determine whether it needs deeper investigation or incident response.',
      recover: 'Describe what access or control has been lost and what has already been changed or restored.',
      protect: 'Describe the system, security objective, upcoming change, or assurance requirement.',
      monitor: 'Describe the systems and recurring security problems you want Blackpine to help monitor or manage.',
      'security-desk': 'Ask the question in ordinary language. Blackpine can route it internally if it needs specialist review.',
      'defined-project': 'Name the service or project if you already know the scope.',
      other: 'Describe the situation in your own words.'
    };

    const requestedIntent = params.get('intent');
    const service = params.get('service');
    const capability = params.get('capability');
    const initial = knownIntents.has(requestedIntent) ? requestedIntent : serviceToIntent[service];
    if (initial && knownIntents.has(initial)) intent.value = initial;
    if (capabilityField && capability) capabilityField.value = capability.slice(0, 120);

    const update = () => {
      const urgent = urgentIntents.has(intent.value);
      urgentFields.forEach(field => { field.hidden = !urgent; });
      if (note) note.textContent = notes[intent.value] || 'Choose the closest situation. Blackpine can determine the specialist service internally.';
    };

    const value = selector => String(form.querySelector(selector)?.value || '').trim();
    const compose = () => {
      if (!form.reportValidity()) return;
      const intentLabel = intent.selectedOptions[0]?.textContent?.trim() || intent.value;
      const lines = [
        'Blackpine website inquiry',
        '',
        `Name: ${value('#name').slice(0, 120)}`,
        `Contact email: ${value('#email').slice(0, 254)}`,
        `Organization: ${value('#organization').slice(0, 160) || 'Not provided'}`,
        `Situation: ${intentLabel.slice(0, 240)}`
      ];
      const requestedCapability = String(capabilityField?.value || '').trim().slice(0, 120);
      if (requestedCapability) lines.push(`Requested capability: ${requestedCapability}`);
      if (urgentIntents.has(intent.value)) {
        lines.push(`Safe email: ${value('#safe-email').slice(0, 254) || 'Not provided'}`);
        lines.push(`Safe callback number: ${value('#safe-phone').slice(0, 64) || 'Not provided'}`);
      }
      lines.push('', 'What do you need help with?', value('#message').slice(0, 2000));
      const subject = `Blackpine inquiry — ${intentLabel.slice(0, 100)}`;
      window.location.assign(`mailto:contact@blackpinecybersecurity.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join('\n'))}`);
    };

    form.addEventListener('submit', event => {
      event.preventDefault();
      compose();
    });
    composeButton?.addEventListener('click', event => {
      if (event.currentTarget.type !== 'submit') {
        event.preventDefault();
        compose();
      }
    });
    intent.addEventListener('change', update);
    update();
  };

  const addSuggestion = (container, title, detail, href) => {
    const link = document.createElement('a');
    link.className = 'search-result';
    link.href = href;
    const family = document.createElement('span');
    family.className = 'search-result-family';
    family.textContent = 'Suggested route';
    const strong = document.createElement('strong');
    strong.textContent = title;
    const description = document.createElement('span');
    description.className = 'search-result-description';
    description.textContent = detail;
    link.append(family, strong, description);
    container.append(link);
  };

  const safePathname = () => {
    try {
      return decodeURIComponent(window.location.pathname).toLowerCase();
    } catch {
      return String(window.location.pathname || '').toLowerCase();
    }
  };

  const initSmart404 = () => {
    const container = document.querySelector('[data-404-suggestions]');
    if (!container) return;
    const path = safePathname();
    const suggestions = [];
    const add = (title, detail, href) => {
      if (!suggestions.some(item => item.href === href)) suggestions.push({ title, detail, href });
    };

    if (/ransom|breach|hack|incident|malware|compromis/.test(path)) add('Blackpine Emergency Response', 'For suspected compromise, ransomware, malicious access, or an active incident.', '/services/emergency-response/');
    if (/suspicious|login|alert|forensic|investigat/.test(path)) add('Blackpine Investigate', 'For strange activity when the cause or impact is not yet clear.', '/services/investigate/');
    if (/recover|restore|locked|account|takeover/.test(path)) add('Blackpine Recover', 'For regaining control and hardening after compromise or loss of access.', '/services/recover/');
    if (/dmarc|spf|dkim|email|m365|microsoft|google|cloud|pentest|security|assessment|app/.test(path)) add('Blackpine Protect', 'For assessments, hardening, testing, identity, email, cloud, application, and readiness work.', '/services/protect/');
    if (/monitor|vulnerab|endpoint|edr|surface|credential/.test(path)) add('Blackpine Monitor', 'For recurring monitoring, endpoint, vulnerability, exposure, and security-review needs.', '/services/monitor/');
    if (/phish|mfa|desk|question|help/.test(path)) add('Blackpine Security Desk', 'For suspicious emails, unexpected prompts, alerts, and everyday security questions.', '/services/security-desk/');

    if (!suggestions.length) return;
    while (container.firstChild) container.removeChild(container.firstChild);
    const heading = document.createElement('h2');
    heading.className = 'minor-heading';
    heading.textContent = 'You may be looking for';
    container.append(heading);
    const list = document.createElement('div');
    list.className = 'search-page-results';
    suggestions.slice(0, 3).forEach(item => addSuggestion(list, item.title, item.detail, item.href));
    container.append(list);
    const actions = document.createElement('div');
    actions.className = 'actions';
    const home = document.createElement('a');
    home.className = 'button secondary';
    home.href = '/';
    home.textContent = 'Home';
    const capabilities = document.createElement('a');
    capabilities.className = 'button secondary';
    capabilities.href = '/services/';
    capabilities.textContent = 'All capabilities';
    actions.append(home, capabilities);
    container.append(actions);
  };

  const init = () => {
    initContact();
    initSmart404();
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();
