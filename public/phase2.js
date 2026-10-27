(() => {
  const currentLocale = () => document.body?.dataset.locale || 'en-CA';
  const isFrench = () => currentLocale() === 'fr-CA';
  const isSpanish = () => currentLocale() === 'es';
  const t = (english, french, spanish) => isSpanish() ? spanish : isFrench() ? french : english;
  const localPath = path => {
    if (!path.startsWith('/')) return path;
    if (isSpanish() && !path.startsWith('/es/') && !path.startsWith('/fr/')) return path === '/' ? '/es/' : `/es${path}`;
    if (isFrench() && !path.startsWith('/fr/') && !path.startsWith('/es/')) return path === '/' ? '/fr/' : `/fr${path}`;
    return path;
  };

  const initContact = () => {
    const form = document.querySelector('[data-contact-form]');
    const intent = form?.querySelector('#intent');
    if (!form || !intent) return;

    const params = new URLSearchParams(window.location.search);
    const urgentFields = [...form.querySelectorAll('[data-contact-urgent]')];
    const capabilityField = form.querySelector('[data-capability-context]');
    const note = form.querySelector('[data-contact-intent-note]');
    const composeButton = form.querySelector('[data-contact-compose-button]');
    const composeNote = form.querySelector('[data-contact-compose-note]');
    const prepared = form.querySelector('[data-contact-prepared]');
    const preparedLabel = form.querySelector('[data-contact-prepared-label]');
    const preparedOutput = form.querySelector('[data-contact-prepared-output]');
    const copyButton = form.querySelector('[data-contact-copy]');
    const openEmail = form.querySelector('[data-contact-open-email]');
    const preparedStatus = form.querySelector('[data-contact-prepared-status]');
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
    const notesEn = {
      'emergency-response': 'If a normal mailbox or device may be compromised, use the safe-contact fields below.',
      investigate: 'Describe what looks unusual. Blackpine can determine whether it needs deeper investigation or incident response.',
      recover: 'Describe what access or control has been lost and what has already been changed or restored.',
      protect: 'Describe the system, security objective, upcoming change, or assurance requirement.',
      monitor: 'Describe the systems and recurring security problems you want Blackpine to help monitor or manage.',
      'security-desk': 'Ask the question in ordinary language. Blackpine can route it internally if it needs specialist review.',
      'defined-project': 'Name the service or project if you already know the scope.',
      other: 'Describe the situation in your own words.'
    };
    const notesFr = {
      'emergency-response': 'Si une boîte de courriel ou un appareil habituel peut être compromis, utilisez les coordonnées sûres ci-dessous.',
      investigate: 'Décrivez ce qui vous semble inhabituel. Blackpine peut déterminer si la situation exige une enquête plus approfondie ou une intervention en cas d’incident.',
      recover: 'Décrivez les accès ou le contrôle qui ont été perdus, ainsi que ce qui a déjà été modifié ou rétabli.',
      protect: 'Décrivez le système, l’objectif de sécurité, le changement à venir ou l’exigence d’assurance.',
      monitor: 'Décrivez les systèmes et les problèmes de sécurité récurrents que vous souhaitez faire surveiller ou gérer par Blackpine.',
      'security-desk': 'Posez la question en termes simples. Blackpine peut l’acheminer à l’interne si un examen spécialisé est nécessaire.',
      'defined-project': 'Indiquez le service ou le projet si la portée est déjà connue.',
      other: 'Décrivez la situation dans vos propres mots.'
    };
    const notesEs = {
      'emergency-response': 'Si un buzón o dispositivo habitual puede estar comprometido, utilice los datos de contacto seguros que aparecen a continuación.',
      investigate: 'Describa qué le parece inusual. Blackpine puede determinar si hace falta una investigación más profunda o una respuesta a incidentes.',
      recover: 'Describa qué acceso o control se ha perdido y qué se ha cambiado o restablecido hasta ahora.',
      protect: 'Describa el sistema, el objetivo de seguridad, el cambio previsto o el requisito de aseguramiento.',
      monitor: 'Describa los sistemas y los problemas de seguridad recurrentes que quiere que Blackpine ayude a supervisar o gestionar.',
      'security-desk': 'Plantee la pregunta con sus propias palabras. Blackpine puede derivarla internamente si requiere una revisión especializada.',
      'defined-project': 'Indique el servicio o proyecto si ya conoce el alcance.',
      other: 'Describa la situación con sus propias palabras.'
    };

    const requestedIntent = params.get('intent');
    const service = params.get('service');
    const capability = params.get('capability');
    const initial = knownIntents.has(requestedIntent) ? requestedIntent : serviceToIntent[service];
    if (initial && knownIntents.has(initial)) intent.value = initial;
    if (capabilityField && capability) capabilityField.value = capability.slice(0, 120);

    if (preparedLabel) preparedLabel.textContent = t('Prepared inquiry details', 'Détails de la demande préparée', 'Datos de la consulta preparados');
    if (copyButton) copyButton.textContent = t('Copy inquiry details', 'Copier les détails de la demande', 'Copiar datos de la consulta');
    if (openEmail) openEmail.textContent = t('Open email app', 'Ouvrir l’application de courriel', 'Abrir la aplicación de correo');
    if (composeNote) composeNote.textContent = t(
      'The details stay in this page until you choose what to do next. Blackpine receives nothing from these fields until you send an email.',
      'Les renseignements restent dans cette page jusqu’à ce que vous choisissiez la prochaine étape. Blackpine ne reçoit rien de ces champs tant que vous n’envoyez pas de courriel.',
      'Los datos permanecen en esta página hasta que elija el siguiente paso. Blackpine no recibe nada de estos campos hasta que usted envíe un correo electrónico.'
    );

    const update = () => {
      const urgent = urgentIntents.has(intent.value);
      urgentFields.forEach(field => { field.hidden = !urgent; });
      if (note) {
        const notes = isSpanish() ? notesEs : isFrench() ? notesFr : notesEn;
        note.textContent = notes[intent.value] || t(
          'Choose the closest situation. Blackpine can determine the specialist service internally.',
          'Choisissez la situation la plus proche. Blackpine déterminera à l’interne le service spécialisé approprié.',
          'Elija la situación que más se aproxime. Blackpine determinará internamente qué servicio especializado corresponde.'
        );
      }
    };

    const value = selector => String(form.querySelector(selector)?.value || '').trim();
    const buildInquiry = () => {
      const intentLabel = intent.selectedOptions[0]?.textContent?.trim() || intent.value;
      const missing = t('Not provided', 'Non fourni', 'No facilitado');
      const lines = isSpanish() ? [
        'Consulta enviada desde el sitio web de Blackpine',
        '',
        `Nombre: ${value('#name').slice(0, 120)}`,
        `Correo electrónico de contacto: ${value('#email').slice(0, 254)}`,
        `Organización: ${value('#organization').slice(0, 160) || missing}`,
        `Situación: ${intentLabel.slice(0, 240)}`
      ] : isFrench() ? [
        'Demande transmise depuis le site Web de Blackpine',
        '',
        `Nom : ${value('#name').slice(0, 120)}`,
        `Courriel de contact : ${value('#email').slice(0, 254)}`,
        `Organisation : ${value('#organization').slice(0, 160) || missing}`,
        `Situation : ${intentLabel.slice(0, 240)}`
      ] : [
        'Blackpine website inquiry',
        '',
        `Name: ${value('#name').slice(0, 120)}`,
        `Contact email: ${value('#email').slice(0, 254)}`,
        `Organization: ${value('#organization').slice(0, 160) || missing}`,
        `Situation: ${intentLabel.slice(0, 240)}`
      ];
      const requestedCapability = String(capabilityField?.value || '').trim().slice(0, 120);
      if (requestedCapability) lines.push(t(`Requested capability: ${requestedCapability}`, `Expertise demandée : ${requestedCapability}`, `Servicio solicitado: ${requestedCapability}`));
      if (urgentIntents.has(intent.value)) {
        lines.push(t(`Safe email: ${value('#safe-email').slice(0, 254) || missing}`, `Courriel sûr : ${value('#safe-email').slice(0, 254) || missing}`, `Correo electrónico seguro: ${value('#safe-email').slice(0, 254) || missing}`));
        lines.push(t(`Safe callback number: ${value('#safe-phone').slice(0, 64) || missing}`, `Numéro de rappel sûr : ${value('#safe-phone').slice(0, 64) || missing}`, `Número seguro para devolver la llamada: ${value('#safe-phone').slice(0, 64) || missing}`));
      }
      lines.push('', t('What do you need help with?', 'De quoi avez-vous besoin?', '¿En qué necesita ayuda?'), value('#message').slice(0, 2000));
      const subject = isSpanish() ? `Consulta a Blackpine — ${intentLabel.slice(0, 100)}` : isFrench() ? `Demande Blackpine — ${intentLabel.slice(0, 100)}` : `Blackpine inquiry — ${intentLabel.slice(0, 100)}`;
      return { subject, body: lines.join('\n') };
    };

    const prepare = () => {
      if (!form.reportValidity()) return;
      const inquiry = buildInquiry();
      if (preparedOutput) preparedOutput.value = inquiry.body;
      if (openEmail) openEmail.href = `mailto:contact@blackpinecybersecurity.com?subject=${encodeURIComponent(inquiry.subject)}`;
      if (prepared) prepared.hidden = false;
      if (preparedStatus) preparedStatus.textContent = t(
        'Copy the prepared details, then open your email app and paste them into the message. The website does not send this information.',
        'Copiez les détails préparés, puis ouvrez votre application de courriel et collez-les dans le message. Le site Web n’envoie pas ces renseignements.',
        'Copie los datos preparados, abra su aplicación de correo y péguelos en el mensaje. El sitio web no envía esta información.'
      );
      preparedOutput?.focus();
    };

    const copyPrepared = async () => {
      const text = String(preparedOutput?.value || '');
      if (!text) return;
      try {
        if (!navigator.clipboard?.writeText) throw new Error('clipboard unavailable');
        await navigator.clipboard.writeText(text);
        if (preparedStatus) preparedStatus.textContent = t(
          'Inquiry details copied. Open your email app and paste them into the message.',
          'Les détails de la demande ont été copiés. Ouvrez votre application de courriel et collez-les dans le message.',
          'Se copiaron los datos de la consulta. Abra su aplicación de correo y péguelos en el mensaje.'
        );
      } catch {
        preparedOutput?.focus();
        preparedOutput?.select();
        if (preparedStatus) preparedStatus.textContent = t(
          'Automatic copying is unavailable. The inquiry details are selected; copy them manually, then open your email app.',
          'La copie automatique n’est pas disponible. Les détails de la demande sont sélectionnés; copiez-les manuellement, puis ouvrez votre application de courriel.',
          'La copia automática no está disponible. Los datos de la consulta están seleccionados; cópielos manualmente y abra su aplicación de correo.'
        );
      }
    };

    form.addEventListener('submit', event => {
      event.preventDefault();
      prepare();
    });
    composeButton?.addEventListener('click', event => {
      if (event.currentTarget.type !== 'submit') {
        event.preventDefault();
        prepare();
      }
    });
    copyButton?.addEventListener('click', copyPrepared);
    intent.addEventListener('change', update);
    update();
  };

  const addSuggestion = (container, title, detail, href) => {
    const link = document.createElement('a');
    link.className = 'search-result';
    link.href = localPath(href);
    const family = document.createElement('span');
    family.className = 'search-result-family';
    family.textContent = t('Suggested route', 'Parcours suggéré', 'Ruta sugerida');
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
    const path = safePathname().normalize('NFKD').replace(/[\u0300-\u036f]/g, '');
    const suggestions = [];
    const add = (englishTitle, frenchTitle, spanishTitle, englishDetail, frenchDetail, spanishDetail, href) => {
      const localizedHref = localPath(href);
      if (!suggestions.some(item => item.href === localizedHref)) {
        suggestions.push({
          title: t(englishTitle, frenchTitle, spanishTitle),
          detail: t(englishDetail, frenchDetail, spanishDetail),
          href
        });
      }
    };

    if (/ransom|rancon|breach|breche|brecha|hack|incident|incidente|malware|maliciel|compromis|compromet/.test(path)) add(
      'Blackpine Emergency Response', 'Intervention d’urgence Blackpine', 'Respuesta de emergencia de Blackpine',
      'For suspected compromise, ransomware, malicious access, or an active incident.',
      'Pour une compromission soupçonnée, un rançongiciel, un accès malveillant ou un incident en cours.',
      'Para una posible intrusión, ransomware, acceso malicioso o un incidente en curso.',
      '/services/emergency-response/'
    );
    if (/suspicious|suspect|sospech|login|connexion|inicio-sesion|alert|alerte|alerta|forensic|criminalist|forense|enquet|investigat/.test(path)) add(
      'Blackpine Investigate', 'Enquêter avec Blackpine', 'Investigar con Blackpine',
      'For strange activity when the cause or impact is not yet clear.',
      'Pour une activité inhabituelle lorsque la cause ou l’impact n’est pas encore clair.',
      'Para actividad inusual cuando la causa o el impacto todavía no están claros.',
      '/services/investigate/'
    );
    if (/recover|recuper|retabl|restore|restaur|restable|locked|verrou|bloque|account|compte|cuenta|takeover|prise-controle|control/.test(path)) add(
      'Blackpine Recover', 'Rétablir avec Blackpine', 'Recuperar con Blackpine',
      'For regaining control and hardening after compromise or loss of access.',
      'Pour reprendre le contrôle et renforcer l’environnement après une compromission ou une perte d’accès.',
      'Para recuperar el control y reforzar el entorno tras una intrusión o pérdida de acceso.',
      '/services/recover/'
    );
    if (/dmarc|spf|dkim|email|courriel|correo|m365|microsoft|google|cloud|nuage|infonuag|nube|pentest|security|securite|seguridad|assessment|evaluation|evaluacion|test|app/.test(path)) add(
      'Blackpine Protect', 'Protéger avec Blackpine', 'Proteger con Blackpine',
      'For assessments, hardening, testing, identity, email, cloud, application, and readiness work.',
      'Pour les évaluations, le renforcement, les tests, les identités, le courriel, l’infonuagique, les applications et la préparation.',
      'Para evaluaciones, refuerzo de seguridad, pruebas, identidades, correo electrónico, nube, aplicaciones y preparación.',
      '/services/protect/'
    );
    if (/monitor|surveill|supervis|vulnerab|endpoint|terminal|dispositivo|edr|surface|superficie|exposition|exposicion|credential|identifiant|credencial/.test(path)) add(
      'Blackpine Monitor', 'Surveiller avec Blackpine', 'Supervisar con Blackpine',
      'For recurring monitoring, endpoint, vulnerability, exposure, and security-review needs.',
      'Pour les besoins récurrents de surveillance, de vulnérabilités, d’exposition, de postes de travail et d’examen de sécurité.',
      'Para necesidades recurrentes de supervisión, endpoints, vulnerabilidades, exposición y revisión de seguridad.',
      '/services/monitor/'
    );
    if (/phish|hameconn|mfa|desk|question|pregunta|help|aide|ayuda/.test(path)) add(
      'Blackpine Security Desk', 'Service de sécurité Blackpine', 'Servicio de seguridad de Blackpine',
      'For suspicious emails, unexpected prompts, alerts, and everyday security questions.',
      'Pour les courriels suspects, les demandes inattendues, les alertes et les questions de sécurité courantes.',
      'Para correos sospechosos, solicitudes inesperadas, alertas y preguntas habituales de seguridad.',
      '/services/security-desk/'
    );

    if (!suggestions.length) return;
    while (container.firstChild) container.removeChild(container.firstChild);
    const heading = document.createElement('h2');
    heading.className = 'minor-heading';
    heading.textContent = t('You may be looking for', 'Vous cherchez peut-être', 'Quizá esté buscando');
    container.append(heading);
    const list = document.createElement('div');
    list.className = 'search-page-results';
    suggestions.slice(0, 3).forEach(item => addSuggestion(list, item.title, item.detail, item.href));
    container.append(list);
    const actions = document.createElement('div');
    actions.className = 'actions';
    const home = document.createElement('a');
    home.className = 'button secondary';
    home.href = localPath('/');
    home.textContent = t('Home', 'Accueil', 'Inicio');
    const capabilities = document.createElement('a');
    capabilities.className = 'button secondary';
    capabilities.href = localPath('/services/');
    capabilities.textContent = t('All capabilities', 'Toutes les expertises', 'Todos los servicios');
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