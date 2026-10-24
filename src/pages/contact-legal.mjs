import { site, capabilityFamilies } from '../data.mjs';
import { publicCompany } from '../public-company.mjs';
import { pageHero } from '../components.mjs';
import { esc } from '../lib/html.mjs';

const intentOptions = capabilityFamilies.map(family => `<option value="${esc(family.id)}">${esc(family.intent)} — ${esc(family.name.replace('Blackpine ', ''))}</option>`).join('');

export function contactPage() {
  const body = pageHero({
    eyebrow: 'Contact',
    title: 'Tell Blackpine what is happening.',
    lead: 'You do not need to select a technical discipline. Describe the situation, the affected system, or the outcome you need. Blackpine can route the request internally after the facts are clear.'
  }) + `<section class="section editorial-split-section contact-editorial" aria-label="Contact Blackpine"><div class="shell editorial-split editorial-split-reverse"><div class="editorial-split-copy"><span class="eyebrow">${esc(publicCompany.city)}, ${esc(publicCompany.province)}</span><h2>Start with the situation.</h2><p>Blackpine is based in ${esc(publicCompany.publicLocation)}. Tell us what changed, what is affected, and what outcome you need. We will route the request to the right team.</p></div><figure class="editorial-split-media"><img src="/assets/editorial/contact-canada-landscape.jpg" srcset="/assets/editorial/contact-canada-landscape-640.jpg 640w, /assets/editorial/contact-canada-landscape-960.jpg 960w, /assets/editorial/contact-canada-landscape-1280.jpg 1280w, /assets/editorial/contact-canada-landscape.jpg 1600w" sizes="(max-width: 820px) 100vw, 58vw" alt="" width="1600" height="1067" loading="lazy" decoding="async" fetchpriority="low"></figure></div></section><section class="section"><div class="shell content-grid"><aside class="on-page"><span>Contact</span><a href="#inquiry">Inquiry</a><a href="#office">Business contact</a><a href="#active-incident">Active incident</a><a href="#sensitive-data">Sensitive material</a></aside><div class="prose"><h2 id="inquiry">Start with the situation</h2><div class="notice"><strong>Direct contact</strong><p>Email <a href="mailto:${site.email}">${site.email}</a> or call <a href="tel:${esc(publicCompany.phoneHref)}">${esc(publicCompany.phoneDisplay)}</a>. Keep passwords, private keys, regulated records, full log exports, confidential client files, malware samples, and sensitive incident evidence out of ordinary email until an exchange method is agreed.</p></div><form method="post" action="/contact/" data-contact-form data-contact-compose><input type="hidden" name="source" value="blackpine-corporate"><input type="hidden" name="requested-capability" value="" data-capability-context><div class="form-grid"><div class="form-field"><label for="name">Name</label><input id="name" name="name" autocomplete="name" maxlength="120" required></div><div class="form-field"><label for="email">Contact email</label><input id="email" name="email" type="email" autocomplete="email" inputmode="email" maxlength="254" required></div><div class="form-field"><label for="organization">Organization</label><input id="organization" name="organization" autocomplete="organization" maxlength="160"></div><div class="form-field"><label for="intent">What is happening?</label><select id="intent" name="intent" required><option value="">Select the closest situation</option>${intentOptions}<option value="defined-project">We already know the service or project we need</option><option value="other">Other / not sure</option></select></div><div class="form-field full"><p class="form-note" data-contact-intent-note aria-live="polite">Choose the closest situation. Blackpine can determine the specialist service internally.</p></div><div class="form-field" data-contact-urgent><label for="safe-email">Safe email to use <span class="form-optional">(if different)</span></label><input id="safe-email" name="safe-email" type="email" autocomplete="email" inputmode="email" maxlength="254" aria-describedby="safe-contact-guidance"></div><div class="form-field" data-contact-urgent><label for="safe-phone">Safe callback number <span class="form-optional">(optional)</span></label><input id="safe-phone" name="safe-phone" type="tel" autocomplete="tel" inputmode="tel" maxlength="64" aria-describedby="safe-contact-guidance"></div><div class="form-field full" data-contact-urgent><span class="form-note" id="safe-contact-guidance">If the normal mailbox, account, or device may be compromised, give Blackpine a communication channel you believe is safe to use.</span></div><div class="form-field full"><label for="message">What do you need help with?</label><textarea id="message" name="message" maxlength="2000" aria-describedby="message-guidance" required></textarea><span class="form-note" id="message-guidance">Describe the observable problem and business impact. Do not include passwords, private keys, regulated records, full log exports, confidential client files, malware samples, or sensitive incident evidence.</span></div><div class="form-field full"><button class="button" type="submit" data-contact-compose-button>Compose inquiry email</button><p class="form-note" data-contact-compose-note>This prepares an email in your email application using the details above. Blackpine receives nothing from these fields until you send that email.</p><noscript><p class="form-note">JavaScript is unavailable, so the inquiry composer cannot prepare the message. Email <a href="mailto:${site.email}">${site.email}</a> directly instead.</p></noscript></div></div></form><h2 id="office">Business contact</h2><address><strong>${esc(publicCompany.legalName)}</strong><br>${esc(publicCompany.businessAddress)}<br><a href="tel:${esc(publicCompany.phoneHref)}">${esc(publicCompany.phoneDisplay)}</a><br><a href="mailto:${esc(site.email)}">${esc(site.email)}</a></address><p><a href="${esc(publicCompany.googleBusinessUrl)}" rel="noopener">View Blackpine on Google ↗</a></p><h2 id="active-incident">Active incident</h2><p>The public website does not confirm immediate response. Where safe, preserve relevant evidence, avoid unnecessary destructive changes, and use an alternate communication channel if the normal account may be compromised.</p><div class="actions"><a class="button secondary" href="/services/emergency-response/">Emergency Response</a><a class="button secondary" href="/incident/">First-action guidance</a></div><h2 id="sensitive-data">Sensitive material</h2><p>The inquiry composer is intentionally local. An appropriate evidence-exchange method can be agreed after the scope, authorized participants, and sensitivity of the material are understood. Incident descriptions entered here are not deliberately persisted in browser storage or submitted to the website by Blackpine site code.</p></div></div></section>`;

  return {
    title: `Contact Blackpine Cybersecurity | ${publicCompany.city}, ${publicCompany.province}`,
    description: `Contact Blackpine Cybersecurity at ${publicCompany.businessAddress} about suspected incidents, recovery, security improvement, monitoring, Security Desk questions, or defined cybersecurity projects.`,
    breadcrumbItems: [{ label: 'Home', href: '/' }, { label: 'Contact', href: '/contact/' }],
    body,
    searchTerms: `Montreal Montréal Quebec ${publicCompany.postalCode} cybersecurity contact phone incident response safe email callback`
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

export function notFoundPage() {
  const body = pageHero({ eyebrow: '404', title: 'This route does not exist.', lead: 'The address may have changed or the link may be incorrect. Blackpine can still route common security terms to a useful public starting point.' }) + `<section class="section compact"><div class="shell"><div data-404-suggestions><div class="actions"><a class="button" href="/">Home</a><a class="button secondary" href="/services/">Capabilities</a><a class="button secondary" href="/research/">Research</a></div></div></div></section>`;
  return {
    title: '404 | Blackpine Cybersecurity',
    description: 'The requested page could not be found.',
    body
  };
}
