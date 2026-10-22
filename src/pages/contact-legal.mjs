import { site } from '../data.mjs';
import { pageHero } from '../components.mjs';

export function contactPage() {
  const body = pageHero({
    eyebrow: 'Contact',
    title: 'Bring the system, concern, and outcome.',
    lead: 'A useful first message names the affected system, what changed or needs review, and the decision you need to make. Sensitive evidence comes later through an agreed channel.'
  }) + `<section class="section"><div class="shell content-grid"><aside class="on-page"><span>Contact</span><a href="#inquiry">Inquiry</a><a href="#active-incident">Active incident</a><a href="#sensitive-data">Sensitive material</a></aside><div class="prose"><h2 id="inquiry">Security inquiry</h2><form name="contact" method="POST" data-netlify="true" netlify-honeypot="company-website" action="/contact/thanks/"><input type="hidden" name="form-name" value="contact"><p class="hidden-field"><label>Do not fill this out: <input name="company-website"></label></p><div class="form-grid"><div class="form-field"><label for="name">Name</label><input id="name" name="name" autocomplete="name" required></div><div class="form-field"><label for="email">Work email</label><input id="email" name="email" type="email" autocomplete="email" required></div><div class="form-field"><label for="organization">Organization</label><input id="organization" name="organization" autocomplete="organization"></div><div class="form-field"><label for="intent">Reason for inquiry</label><select id="intent" name="intent" required><option value="">Select one</option><option>Security assessment</option><option>Identity / email security</option><option>Cloud / SaaS security</option><option>Website / administrative security</option><option>Incident response</option><option>Incident readiness</option><option>Security advisory</option><option>Other</option></select></div><div class="form-field full"><label for="message">What do you need help with?</label><textarea id="message" name="message" required></textarea><span class="form-note">Do not include passwords, private keys, regulated records, full log exports, confidential client files, or sensitive incident evidence.</span></div><div class="form-field full"><label class="checkbox"><input type="checkbox" name="consent" required><span>I agree to be contacted by Blackpine about this inquiry.</span></label></div><div class="form-field full"><button class="button" type="submit">Submit inquiry</button></div></div></form><h2 id="active-incident">Active incident</h2><p>This website is not a 24/7 emergency hotline and form submission does not confirm immediate response. Where safe, preserve relevant evidence, avoid unnecessary destructive changes, and choose “Incident response” so the inquiry is identified correctly.</p><h2 id="sensitive-data">Sensitive material</h2><p>Public intake is intentionally minimal. An appropriate exchange method can be agreed after the scope, authorized participants, and sensitivity of the material are understood.</p></div></div></section>`;

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
    lead: 'The submission confirms receipt only. Scope, availability, response timing, and any engagement are confirmed separately.'
  }) + `<section class="section compact"><div class="shell callout"><div><h2>Keep sensitive evidence off ordinary email until an exchange method is agreed.</h2></div><a class="button secondary" href="/">Return home</a></div></section>`;

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
    lead: 'Blackpine aims to collect only the personal information necessary to respond to inquiries and operate the website. This page must remain aligned with the actual production services used.'
  }) + `<section class="section"><div class="shell prose"><h2>Website inquiries</h2><p>Information submitted through the contact form may be used to review the inquiry, communicate with the sender, and arrange next steps. The public form is not intended for sensitive incident evidence, passwords, private keys, regulated records, or confidential client documents.</p><h2>Service providers</h2><p>The deployed privacy notice must name or accurately describe the real hosting, form-processing, email, analytics, and other providers used by the production site. The V2 baseline intentionally avoids advertising networks, marketing trackers, tag managers, and remote web fonts.</p><h2>Analytics</h2><p>No third-party analytics are included in the V2 baseline. If analytics are added later, this notice must be updated before collection begins and the implementation must be reviewed for consent and legal requirements that apply to the deployment.</p><h2>Retention and access</h2><p>Retention periods and access procedures must reflect the actual operational process rather than a generic policy template. Blackpine will not publish an invented retention period for the appearance of completeness.</p><h2>Contact</h2><p>Privacy questions can be directed to <a href="mailto:${site.email}">${site.email}</a>.</p></div></section>`;

  return {
    title: 'Privacy | Blackpine Cybersecurity',
    description: 'Blackpine Cybersecurity website privacy information and public intake principles.',
    breadcrumbItems: [{ label: 'Home', href: '/' }, { label: 'Legal', href: '/legal/privacy/' }, { label: 'Privacy', href: '/legal/privacy/' }],
    body
  };
}

export function termsPage() {
  const body = pageHero({
    eyebrow: 'Legal',
    title: 'Website Terms',
    lead: 'General terms for the Blackpine corporate website. Professional security work requires a separate written engagement defining scope, authorization, responsibilities, limitations, fees, and communications.'
  }) + `<section class="section"><div class="shell prose"><h2>Website information</h2><p>Website material is general information and does not create a client relationship, professional engagement, or authorization to access systems. Security advice depends on specific facts and agreed scope.</p><h2>Professional services</h2><p>Any professional services should be governed by written terms that define the engagement, systems and actions authorized, responsibilities, communication channels, and applicable limitations.</p><h2>No guarantee of security</h2><p>No website content, assessment, recommendation, or technical control should be interpreted as a guarantee that compromise, loss, fraud, disruption, or future security incidents can be fully prevented.</p><h2>Research content</h2><p>Blackpine Research is general technical information unless a separate engagement states otherwise. Readers are responsible for evaluating applicability to their environment and authorization.</p><h2>Contact</h2><p>Questions can be directed to <a href="mailto:${site.email}">${site.email}</a>.</p></div></section>`;

  return {
    title: 'Website Terms | Blackpine Cybersecurity',
    description: 'General website terms for Blackpine Cybersecurity. Professional services require separate written engagement terms.',
    breadcrumbItems: [{ label: 'Home', href: '/' }, { label: 'Legal', href: '/legal/terms/' }, { label: 'Terms', href: '/legal/terms/' }],
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
