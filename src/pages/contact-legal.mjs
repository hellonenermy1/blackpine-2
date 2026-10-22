import { site } from '../data.mjs';
import { pageHero } from '../components.mjs';

export function contactPage() {
  const body = pageHero({
    eyebrow: 'Contact',
    title: 'Bring the system, concern, and outcome.',
    lead: 'A useful first message names the affected system, what changed or needs review, and the decision you need to make. The first conversation establishes scope and authority before Blackpine asks for technical access or sensitive material; evidence comes later through an agreed channel.'
  }) + `<section class="section"><div class="shell content-grid"><aside class="on-page"><span>Contact</span><a href="#inquiry">Inquiry</a><a href="#active-incident">Active incident</a><a href="#sensitive-data">Sensitive material</a></aside><div class="prose"><h2 id="inquiry">Security inquiry</h2><div class="notice"><strong>Direct contact</strong><p>If the web form is unavailable, email <a href="mailto:${site.email}">${site.email}</a>. Keep passwords, private keys, regulated records, full log exports, confidential client files, and sensitive incident evidence out of ordinary email until an exchange method is agreed.</p></div><form name="contact" method="POST" data-netlify="true" netlify-honeypot="company-website" action="/contact/thanks/"><input type="hidden" name="form-name" value="contact"><input type="hidden" name="source" value="blackpine-corporate"><p class="hidden-field"><label>Do not fill this out: <input name="company-website" tabindex="-1" autocomplete="off"></label></p><div class="form-grid"><div class="form-field"><label for="name">Name</label><input id="name" name="name" autocomplete="name" required></div><div class="form-field"><label for="email">Work email</label><input id="email" name="email" type="email" autocomplete="email" required></div><div class="form-field"><label for="organization">Organization</label><input id="organization" name="organization" autocomplete="organization"></div><div class="form-field"><label for="intent">Reason for inquiry</label><select id="intent" name="intent" required><option value="">Select one</option><option>Security assessment</option><option>Identity / email security</option><option>Cloud / SaaS security</option><option>Website / administrative security</option><option>Incident response</option><option>Incident readiness</option><option>Security advisory</option><option>Other</option></select></div><div class="form-field full"><label for="message">What do you need help with?</label><textarea id="message" name="message" aria-describedby="message-guidance" required></textarea><span class="form-note" id="message-guidance">Do not include passwords, private keys, regulated records, full log exports, confidential client files, or sensitive incident evidence.</span></div><div class="form-field full"><button class="button" type="submit">Submit inquiry</button></div></div></form><h2 id="active-incident">Active incident</h2><p>This website is not a 24/7 emergency hotline and form submission does not confirm immediate response. Where safe, preserve relevant evidence, avoid unnecessary destructive changes, and identify the affected system and current business impact.</p><div class="actions"><a class="button secondary" href="/incident/">Review incident guidance first</a><a class="button secondary" href="/contact/?service=incident-response#inquiry">Start an incident-response inquiry</a></div><h2 id="sensitive-data">Sensitive material</h2><p>Public intake is intentionally minimal. An appropriate exchange method can be agreed after the scope, authorized participants, and sensitivity of the material are understood.</p></div></div></section>`;

  return {
    title: 'Contact Blackpine Cybersecurity | Canada',
    description: 'Contact Blackpine about security assessment, identity and cloud controls, incident response, readiness, or security advisory requirements.',
    breadcrumbItems: [{ label: 'Home', href: '/' }, { label: 'Contact', href: '/contact/' }],
    body
  };
}

export function thanksPage() {
  const body = pageHero({
    eyebrow: 'Contact',
    title: 'Inquiry received.',
    lead: 'Your message has been submitted for review. Scope, availability, response timing, and any professional engagement are confirmed separately.'
  }) + `<section class="section compact"><div class="shell callout"><div><h2>Keep sensitive evidence off ordinary email until an exchange method is agreed.</h2><p>If this concerns an active incident, preserve relevant evidence where safe and avoid unnecessary destructive changes while you await a response.</p></div><a class="button secondary" href="/">Return home</a></div></section>`;

  return {
    title: 'Inquiry Received | Blackpine Cybersecurity',
    description: 'Blackpine inquiry confirmation.',
    breadcrumbItems: [{ label: 'Home', href: '/' }, { label: 'Contact', href: '/contact/' }, { label: 'Thanks', href: '/contact/thanks/' }],
    body
  };
}

export function privacyPage() {
  const body = pageHero({
    eyebrow: 'Legal',
    title: 'Privacy',
    lead: 'Blackpine collects only the information needed to operate the corporate website, respond to inquiries, and arrange requested security work.'
  }) + `<section class="section"><div class="shell prose"><h2>Information you provide</h2><p>When you submit the contact form, Blackpine receives the information you enter, such as your name, work email, organization, reason for inquiry, and message. The public form is not intended for passwords, private keys, regulated records, full log exports, confidential client files, or sensitive incident evidence.</p><h2>How information is used</h2><p>Inquiry information is used to review the request, communicate with the sender, determine whether Blackpine can assist, and arrange next steps. Information collected through the public website is not used to build advertising profiles.</p><h2>Hosting and form processing</h2><p>The corporate site is statically generated and may be deployed through Blackpine's configured hosting provider. The active hosting and form-processing services may process request metadata and form submissions as part of delivering the site and inquiry workflow. Blackpine may also use its configured email and communications providers to respond to an inquiry. Provider practices are governed by their applicable terms and privacy notices.</p><h2>Analytics and third-party code</h2><p>The production V3 baseline does not include third-party analytics, advertising networks, tag managers, social widgets, remote web fonts, or a third-party search provider. Site search uses a static public index and runs in the visitor's browser. If collection practices change, this notice should be updated before the new collection begins.</p><h2>Retention and access</h2><p>Inquiry information is retained only for as long as reasonably required for the inquiry, business records, security, legal obligations, or an established client relationship. Access is limited to people and service providers who need it for those purposes.</p><h2>Your questions</h2><p>Privacy questions or requests concerning information submitted through the corporate site can be directed to <a href="mailto:${site.email}">${site.email}</a>.</p></div></section>`;

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
  const body = pageHero({ eyebrow: '404', title: 'This route does not exist.', lead: 'The address may have changed or the link may be incorrect.' }) + `<section class="section compact"><div class="shell"><div class="actions"><a class="button" href="/">Home</a><a class="button secondary" href="/services/">Capabilities</a><a class="button secondary" href="/research/">Research</a></div></div></section>`;
  return {
    title: '404 | Blackpine Cybersecurity',
    description: 'The requested page could not be found.',
    body
  };
}
