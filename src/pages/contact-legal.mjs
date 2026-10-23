import { site, capabilityFamilies } from '../data.mjs';
import { pageHero } from '../components.mjs';
import { esc } from '../lib/html.mjs';

const intentOptions = capabilityFamilies.map(family => `<option value="${esc(family.id)}">${esc(family.intent)} — ${esc(family.name.replace('Blackpine ', ''))}</option>`).join('');

export function contactPage() {
  const body = pageHero({
    eyebrow: 'Contact',
    title: 'Tell Blackpine what is happening.',
    lead: 'You do not need to select a technical discipline. Describe the situation, the affected system, or the outcome you need. Blackpine can route the request internally after the facts are clear.'
  }) + `<section class="section"><div class="shell content-grid"><aside class="on-page"><span>Contact</span><a href="#inquiry">Inquiry</a><a href="#active-incident">Active incident</a><a href="#sensitive-data">Sensitive material</a></aside><div class="prose"><h2 id="inquiry">Start with the situation</h2><div class="notice"><strong>Direct contact</strong><p>Email <a href="mailto:${site.email}">${site.email}</a>. Keep passwords, private keys, regulated records, full log exports, confidential client files, malware samples, and sensitive incident evidence out of ordinary email until an exchange method is agreed.</p></div><form method="post" action="/contact/" data-contact-form data-contact-compose><input type="hidden" name="source" value="blackpine-corporate"><input type="hidden" name="requested-capability" value="" data-capability-context><div class="form-grid"><div class="form-field"><label for="name">Name</label><input id="name" name="name" autocomplete="name" maxlength="120" required></div><div class="form-field"><label for="email">Contact email</label><input id="email" name="email" type="email" autocomplete="email" inputmode="email" maxlength="254" required></div><div class="form-field"><label for="organization">Organization</label><input id="organization" name="organization" autocomplete="organization" maxlength="160"></div><div class="form-field"><label for="intent">What is happening?</label><select id="intent" name="intent" required><option value="">Select the closest situation</option>${intentOptions}<option value="defined-project">We already know the service or project we need</option><option value="other">Other / not sure</option></select></div><div class="form-field full"><p class="form-note" data-contact-intent-note aria-live="polite">Choose the closest situation. Blackpine can determine the specialist service internally.</p></div><div class="form-field" data-contact-urgent><label for="safe-email">Safe email to use <span class="form-optional">(if different)</span></label><input id="safe-email" name="safe-email" type="email" autocomplete="email" inputmode="email" maxlength="254" aria-describedby="safe-contact-guidance"></div><div class="form-field" data-contact-urgent><label for="safe-phone">Safe callback number <span class="form-optional">(optional)</span></label><input id="safe-phone" name="safe-phone" type="tel" autocomplete="tel" inputmode="tel" maxlength="64" aria-describedby="safe-contact-guidance"></div><div class="form-field full" data-contact-urgent><span class="form-note" id="safe-contact-guidance">If the normal mailbox, account, or device may be compromised, give Blackpine a communication channel you believe is safe to use.</span></div><div class="form-field full"><label for="message">What do you need help with?</label><textarea id="message" name="message" maxlength="2000" aria-describedby="message-guidance" required></textarea><span class="form-note" id="message-guidance">Describe the observable problem and business impact. Do not include passwords, private keys, regulated records, full log exports, confidential client files, malware samples, or sensitive incident evidence.</span></div><div class="form-field full"><button class="button" type="submit" data-contact-compose-button>Compose inquiry email</button><p class="form-note" data-contact-compose-note>This prepares an email in your email application using the details above. Blackpine receives nothing from these fields until you send that email.</p><noscript><p class="form-note">JavaScript is unavailable, so the inquiry composer cannot prepare the message. Email <a href="mailto:${site.email}">${site.email}</a> directly instead.</p></noscript></div></div></form><h2 id="active-incident">Active incident</h2><p>The public website does not confirm immediate response. Where safe, preserve relevant evidence, avoid unnecessary destructive changes, and use an alternate communication channel if the normal account may be compromised.</p><div class="actions"><a class="button secondary" href="/services/emergency-response/">Emergency Response</a><a class="button secondary" href="/incident/">First-action guidance</a></div><h2 id="sensitive-data">Sensitive material</h2><p>The inquiry composer is intentionally local. An appropriate evidence-exchange method can be agreed after the scope, authorized participants, and sensitivity of the material are understood. Incident descriptions entered here are not deliberately persisted in browser storage or submitted to the website by Blackpine site code.</p></div></div></section>`;

  return {
    title: 'Contact Blackpine Cybersecurity | Canada',
    description: 'Contact Blackpine about a suspected incident, suspicious activity, recovery, security improvement, monitoring, Security Desk question, or a defined cybersecurity project.',
    breadcrumbItems: [{ label: 'Home', href: '/' }, { label: 'Contact', href: '/contact/' }],
    body,
    searchTerms: 'hacked suspicious activity recover managed security security desk cybersecurity contact incident response safe email callback'
  };
}

export function thanksPage() {
  const body = pageHero({
    eyebrow: 'Contact',
    title: 'Contact Blackpine.',
    lead: `Blackpine's current public inquiry path uses your email application rather than a website form processor. If you have not sent an email, Blackpine has not received an inquiry from this page.`
  }) + `<section class="section compact"><div class="shell callout"><div><h2>Send only what is appropriate for ordinary email.</h2><p>Keep passwords, private keys, regulated records, full log exports, confidential client files, malware samples, and sensitive incident evidence out of ordinary email until an exchange method is agreed.</p></div><a class="button" href="/contact/#inquiry">Open contact</a></div></section>`;

  return {
    title: 'Contact Blackpine | Blackpine Cybersecurity',
    description: 'Blackpine contact guidance.',
    breadcrumbItems: [{ label: 'Home', href: '/' }, { label: 'Contact', href: '/contact/' }, { label: 'Contact guidance', href: '/contact/thanks/' }],
    body
  };
}

export function privacyPage() {
  const body = pageHero({
    eyebrow: 'Legal',
    title: 'Privacy',
    lead: 'Blackpine collects only the information needed to operate the corporate website, respond to inquiries, and arrange requested security work.'
  }) + `<section class="section"><div class="shell prose"><h2>Inquiry composer</h2><p>The contact page prepares an email locally in your browser. The details you enter are not submitted to Blackpine's website or a website form processor. Blackpine receives those details only if you choose to send the prepared email through your email application or email Blackpine directly.</p><p>The public inquiry path is not intended for passwords, private keys, regulated records, full log exports, confidential client files, malware samples, or sensitive incident evidence.</p><h2>How information is used</h2><p>Inquiry information that Blackpine receives by email is used to review the request, communicate with the sender, determine whether Blackpine can assist, and arrange next steps. It is not used to build advertising profiles.</p><h2>Hosting and request metadata</h2><p>The corporate site is statically generated and deployed through Cloudflare Pages. Cloudflare may process ordinary request metadata as part of delivering the site. Blackpine's configured email and communications providers may process messages that you actually send. Provider practices are governed by their applicable terms and privacy notices.</p><h2>Analytics and third-party code</h2><p>The production corporate-site baseline does not include third-party analytics, advertising networks, tag managers, social widgets, remote web fonts, a third-party search provider, or a third-party website form processor. Site search uses a static public index and runs in the visitor's browser.</p><h2>Browser storage</h2><p>The site may use local browser storage for the visitor's optional theme preference. Blackpine site code does not deliberately store contact-form or incident-description fields in local storage.</p><h2>Retention and access</h2><p>Inquiry information actually received by Blackpine is retained only for as long as reasonably required for the inquiry, business records, security, legal obligations, or an established client relationship. Access is limited to people and service providers who need it for those purposes.</p><h2>Your questions</h2><p>Privacy questions can be directed to <a href="mailto:${site.email}">${site.email}</a>.</p></div></section>`;

  return {
    title: 'Privacy | Blackpine Cybersecurity',
    description: 'How Blackpine Cybersecurity handles information submitted through the corporate website and public inquiry process.',
    breadcrumbItems: [{ label: 'Home', href: '/' }, { label: 'Privacy', href: '/legal/privacy/' }],
    body
  };
}

export function termsPage() {
  const body = pageHero({
    eyebrow: 'Legal',
    title: 'Website Terms',
    lead: 'These terms apply to the Blackpine corporate website. Professional security work is governed by separate written engagement terms.'
  }) + `<section class="section"><div class="shell prose"><h2>Website information</h2><p>Website material is general information. It does not create a client relationship, professional engagement, or authorization to access any system. Security decisions depend on the facts, environment, authority, and scope of the work.</p><h2>Professional services</h2><p>Professional services are governed by separate written terms that define the engagement, authorized systems and actions, responsibilities, communications, fees, and applicable limitations.</p><h2>No guarantee of security</h2><p>No website content, assessment, recommendation, or technical control can guarantee that compromise, loss, fraud, disruption, or future security incidents will be fully prevented.</p><h2>Research content</h2><p>Blackpine Research is general technical information unless a separate engagement states otherwise. Readers are responsible for evaluating applicability, authority, and operational context before acting on technical guidance.</p><h2>External services</h2><p>The website may link to separate Blackpine services and third-party sources. Those destinations operate under their own technical, privacy, and legal conditions.</p><h2>Contact</h2><p>Questions about the corporate website can be directed to <a href="mailto:${site.email}">${site.email}</a>.</p></div></section>`;

  return {
    title: 'Website Terms | Blackpine Cybersecurity',
    description: 'Website terms for Blackpine Cybersecurity. Professional security services are governed by separate written engagement terms.',
    breadcrumbItems: [{ label: 'Home', href: '/' }, { label: 'Terms', href: '/legal/terms/' }],
    body
  };
}

export function notFoundPage() {
  const body = pageHero({ eyebrow: '404', title: 'This route does not exist.', lead: 'The address may have changed or the link may be incorrect. Blackpine can still route common security terms to a useful public starting point.' }) + `<section class="section compact"><div class="shell"><div data-404-suggestions><div class="actions"><a class="button" href="/">Home</a><a class="button secondary" href="/services/">Capabilities</a><a class="button secondary" href="/research/">Research</a></div></div></div></section>`;
  return {
    title: '404 | Blackpine Cybersecurity',
    description: 'The requested page could not be found.',
    body
  };
}
