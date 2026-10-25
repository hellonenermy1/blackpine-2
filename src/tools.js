(() => {
  const locale = document.body?.dataset.locale || 'en-CA';
  const french = locale === 'fr-CA';
  const spanish = locale === 'es';
  const t = (english, frenchText, spanishText) => spanish ? spanishText : french ? frenchText : english;

  const clear = element => {
    while (element?.firstChild) element.removeChild(element.firstChild);
  };

  const paragraph = text => {
    const node = document.createElement('p');
    node.textContent = text;
    return node;
  };

  const renderChecks = (container, checks) => {
    clear(container);
    const list = document.createElement('ul');
    list.className = 'tool-checks';
    for (const [label, ok, detail] of checks) {
      const item = document.createElement('li');
      const status = document.createElement('strong');
      status.textContent = ok ? t('Present', 'Présent', 'Presente') : t('Review', 'À examiner', 'Revisar');
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
        ['Content-Security-Policy', Boolean(csp), csp ? t('A CSP header is present. Its directives still need to match the application.', 'Un en-tête CSP est présent. Ses directives doivent néanmoins correspondre à l’application.', 'Hay una cabecera CSP. Aun así, sus directivas deben corresponderse con la aplicación.') : t('No CSP header was found in the pasted text.', 'Aucun en-tête CSP n’a été trouvé dans le texte collé.', 'No se encontró ninguna cabecera CSP en el texto pegado.')],
        ['HSTS', headers.has('strict-transport-security'), headers.has('strict-transport-security') ? t('Strict-Transport-Security is present.', 'Strict-Transport-Security est présent.', 'Strict-Transport-Security está presente.') : t('No Strict-Transport-Security header was found.', 'Aucun en-tête Strict-Transport-Security n’a été trouvé.', 'No se encontró ninguna cabecera Strict-Transport-Security.')],
        [t('MIME sniffing', 'Détection MIME', 'Detección de tipos MIME'), /nosniff/i.test(headers.get('x-content-type-options') || ''), /nosniff/i.test(headers.get('x-content-type-options') || '') ? t('X-Content-Type-Options includes nosniff.', 'X-Content-Type-Options contient nosniff.', 'X-Content-Type-Options incluye nosniff.') : t('X-Content-Type-Options: nosniff was not found.', 'X-Content-Type-Options: nosniff n’a pas été trouvé.', 'No se encontró X-Content-Type-Options: nosniff.')],
        [t('Framing control', 'Contrôle de l’intégration dans un cadre', 'Control de carga en marcos'), /frame-ancestors/i.test(csp) || headers.has('x-frame-options'), t('Prefer CSP frame-ancestors for modern framing control; X-Frame-Options may provide legacy coverage.', 'Privilégiez la directive CSP frame-ancestors pour le contrôle moderne de l’intégration dans un cadre; X-Frame-Options peut offrir une couverture pour les anciens navigateurs.', 'Para el control moderno de carga en marcos, prefiera la directiva CSP frame-ancestors; X-Frame-Options puede aportar compatibilidad con navegadores antiguos.')],
        [t('Referrer policy', 'Politique de référent', 'Política de referencia'), headers.has('referrer-policy'), headers.has('referrer-policy') ? t('A Referrer-Policy header is present.', 'Un en-tête Referrer-Policy est présent.', 'Hay una cabecera Referrer-Policy.') : t('No Referrer-Policy header was found.', 'Aucun en-tête Referrer-Policy n’a été trouvé.', 'No se encontró ninguna cabecera Referrer-Policy.')],
        [t('Permissions policy', 'Politique des autorisations', 'Política de permisos'), headers.has('permissions-policy'), headers.has('permissions-policy') ? t('A Permissions-Policy header is present.', 'Un en-tête Permissions-Policy est présent.', 'Hay una cabecera Permissions-Policy.') : t('No Permissions-Policy header was found.', 'Aucun en-tête Permissions-Policy n’a été trouvé.', 'No se encontró ninguna cabecera Permissions-Policy.')]
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
        ['SPF', hasSpf, hasSpf ? t('An SPF version marker is present. Confirm that the record resolves to the intended senders and stays within DNS lookup limits.', 'Un marqueur de version SPF est présent. Confirmez que l’enregistrement correspond aux expéditeurs prévus et respecte les limites de recherches DNS.', 'Hay un marcador de versión SPF. Confirme que el registro corresponde a los remitentes previstos y que se mantiene dentro de los límites de consultas DNS.') : t('No v=spf1 record marker was found.', 'Aucun marqueur d’enregistrement v=spf1 n’a été trouvé.', 'No se encontró ningún marcador de registro v=spf1.')],
        ['DKIM', hasDkim, hasDkim ? t('DKIM-related text is present. A pasted record cannot prove that production messages are actually being signed with this selector.', 'Du contenu lié à DKIM est présent. Un enregistrement collé ne permet pas de prouver que les messages de production sont réellement signés avec ce sélecteur.', 'Hay contenido relacionado con DKIM. Un registro pegado no demuestra que los mensajes de producción se estén firmando realmente con ese selector.') : t('No DKIM marker or _domainkey selector was recognized.', 'Aucun marqueur DKIM ni sélecteur _domainkey n’a été reconnu.', 'No se reconoció ningún marcador DKIM ni selector _domainkey.')],
        ['DMARC', hasDmarc, hasDmarc ? (spanish ? `Hay un registro DMARC${dmarcPolicy ? ` con p=${dmarcPolicy}` : ''}.` : french ? `Un enregistrement DMARC est présent${dmarcPolicy ? ` avec p=${dmarcPolicy}` : ''}.` : `A DMARC record is present${dmarcPolicy ? ` with p=${dmarcPolicy}` : ''}.`) : t('No v=DMARC1 marker was found.', 'Aucun marqueur v=DMARC1 n’a été trouvé.', 'No se encontró ningún marcador v=DMARC1.')],
        [t('DMARC enforcement', 'Application de DMARC', 'Aplicación de DMARC'), dmarcPolicy === 'quarantine' || dmarcPolicy === 'reject', dmarcPolicy === 'none' ? t('p=none is monitoring-oriented and does not request enforcement.', 'p=none sert principalement à l’observation et ne demande aucune mesure d’application.', 'p=none está orientado a la observación y no solicita medidas de aplicación.') : dmarcPolicy ? (spanish ? `p=${dmarcPolicy} solicita al receptor que actúe sobre los mensajes que no superan las comprobaciones.` : french ? `p=${dmarcPolicy} demande au destinataire d’appliquer une mesure aux messages qui échouent aux contrôles.` : `p=${dmarcPolicy} requests receiver action for failing mail.`) : t('No enforceable DMARC policy was recognized.', 'Aucune politique DMARC applicable n’a été reconnue.', 'No se reconoció ninguna política DMARC aplicable.')]
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
        [t('Authoritative nameservers', 'Serveurs de noms faisant autorité', 'Servidores de nombres autoritativos'), /\sns\s/.test(value), t('NS records identify the authoritative DNS service but do not prove registrar or provider account security.', 'Les enregistrements NS indiquent le service DNS faisant autorité, mais ne prouvent pas la sécurité du compte chez le registraire ou le fournisseur.', 'Los registros NS identifican el servicio DNS autoritativo, pero no demuestran la seguridad de la cuenta del registrador o del proveedor.')],
        [t('Mail routing', 'Routage du courriel', 'Enrutamiento del correo'), /\smx\s/.test(value), t('MX records identify mail routing and should be reviewed together with SPF, DKIM, and DMARC.', 'Les enregistrements MX indiquent le routage du courriel et devraient être examinés avec SPF, DKIM et DMARC.', 'Los registros MX identifican el enrutamiento del correo y deben revisarse junto con SPF, DKIM y DMARC.')],
        [t('SPF signal', 'Indice SPF', 'Señal SPF'), value.includes('v=spf1'), t('SPF can help receivers evaluate which systems are authorized to send for a domain.', 'SPF peut aider les destinataires à déterminer quels systèmes sont autorisés à envoyer des messages pour un domaine.', 'SPF puede ayudar a los receptores a evaluar qué sistemas están autorizados para enviar correo en nombre de un dominio.')],
        [t('DMARC signal', 'Indice DMARC', 'Señal DMARC'), value.includes('v=dmarc1') || value.includes('_dmarc'), t('DMARC adds policy and reporting around SPF/DKIM alignment.', 'DMARC ajoute une politique et des rapports concernant l’alignement SPF/DKIM.', 'DMARC añade políticas e informes sobre la alineación de SPF y DKIM.')],
        ['CAA', /\scaa\s/.test(value), t('CAA can restrict which certificate authorities are permitted to issue certificates for the domain.', 'CAA peut limiter les autorités de certification autorisées à délivrer des certificats pour le domaine.', 'CAA puede limitar qué autoridades de certificación están autorizadas para emitir certificados para el dominio.')],
        [t('DNSSEC evidence', 'Indices DNSSEC', 'Indicadores de DNSSEC'), /\s(ds|rrsig|dnskey)\s/.test(value), t('DS, DNSKEY, or RRSIG records are DNSSEC-related signals. A pasted set cannot prove the full validation chain.', 'Les enregistrements DS, DNSKEY ou RRSIG constituent des indices liés à DNSSEC. Un ensemble collé ne peut pas prouver l’intégralité de la chaîne de validation.', 'Los registros DS, DNSKEY o RRSIG son indicadores relacionados con DNSSEC. Un conjunto pegado no demuestra por sí solo toda la cadena de validación.')]
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
    const categoryEs = {
      identity: 'Identidades', email: 'Correo electrónico', cloud: 'Nube', recovery: 'Recuperación',
      website: 'Sitio web', monitoring: 'Supervisión', incident: 'Incidentes', governance: 'Gobernanza'
    };
    run.addEventListener('click', () => {
      const fields = [...assessment.querySelectorAll('fieldset[data-category]')];
      const unanswered = fields.filter(field => !field.querySelector('input:checked'));
      clear(output);
      if (unanswered.length) {
        output.append(paragraph(spanish
          ? `Responda las ${fields.length} preguntas antes de revisar el resultado. Quedan ${unanswered.length} pregunta${unanswered.length === 1 ? '' : 's'} sin responder.`
          : french
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
        const status = average >= 1.5 ? t('Stronger baseline', 'Référence plus solide', 'Base más sólida') : average >= 0.75 ? t('Needs review', 'À examiner', 'Requiere revisión') : t('Material gap', 'Écart important', 'Brecha importante');
        const row = document.createElement('div');
        const name = document.createElement('strong');
        name.textContent = spanish ? (categoryEs[category] || category) : french ? (categoryFr[category] || category) : category.replace(/\b\w/g, char => char.toUpperCase());
        const state = document.createElement('span');
        state.textContent = status;
        row.append(name, state);
        list.append(row);
      }
      output.append(paragraph(t(
        'These observations come only from the eight answers above. They are not a risk rating or security assessment.',
        'Ces observations reposent uniquement sur les huit réponses ci-dessus. Elles ne constituent ni une cote de risque ni une évaluation de la sécurité.',
        'Estas observaciones se basan únicamente en las ocho respuestas anteriores. No constituyen una calificación de riesgo ni una evaluación de seguridad.'
      )), list);
    });
    reset?.addEventListener('click', () => {
      assessment.querySelectorAll('input[type="radio"]').forEach(input => { input.checked = false; });
      clear(output);
      output.append(paragraph(t(
        'Answer the questions to produce category-level observations.',
        'Répondez aux questions pour obtenir des observations par catégorie.',
        'Responda las preguntas para obtener observaciones por categoría.'
      )));
    });
  };

  const init = () => {
    initHeaderTool();
    initEmailTool();
    initDnsTool();
    initAssessment();
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();
