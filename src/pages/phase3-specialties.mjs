import { pageHero } from '../components.mjs';
import { esc } from '../lib/html.mjs';

const specialties = [
  ['Security Assessments', 'Evidence-led reviews that identify material weaknesses, explain their consequence, and produce a prioritized remediation sequence.', '/services/security-assessments/'],
  ['Identity & Microsoft 365 Security', 'Privileged access, MFA, recovery, mail controls, connected applications, delegation and administrative paths.', '/services/identity-email-security/'],
  ['Cloud & SaaS Security', 'Administrative roles, external sharing, integrations, guest access, configuration and recovery across cloud services.', '/services/cloud-saas-security/'],
  ['Web & Administrative Security', 'Application-facing risk plus the domain, DNS, hosting, deployment and administrative controls surrounding public systems.', '/services/website-administrative-security/'],
  ['Incident Response & Digital Forensics', 'Evidence preservation, containment, investigation, recovery and structured response to identity, cloud and endpoint incidents.', '/services/incident-response/'],
  ['Incident Readiness & Recovery', 'Decision authority, communications, backup ownership, restoration testing, evidence availability and exercises before an incident occurs.', '/services/incident-readiness-recovery/'],
  ['Security Advisory', 'Independent technical guidance for remediation priorities, security architecture, vendor decisions and practical risk treatment.', '/services/security-advisory/']
];

export function coreSpecialtiesPage() {
  const body = pageHero({
    eyebrow: 'Capabilities / Core specialties',
    title: 'The security work we focus on.',
    lead: 'Our core specialties include security assessments, identity and cloud security, website security, incident response, recovery, and technical advice. Other specialist work is available where the required expertise and scope are confirmed.',
    meta: '<strong>Core specialties</strong>Seven areas of focused security work'
  }) + `<section class="section"><div class="shell"><div class="service-rows">${specialties.map((item, index) => `<a class="service-row" href="${esc(item[2])}"><span class="service-index">${String(index + 1).padStart(2, '0')}</span><span><strong>${esc(item[0])}</strong><small>${esc(item[1])}</small></span><span class="row-arrow">↗</span></a>`).join('')}</div><div class="notice"><strong>Need a different type of security help?</strong><p>Blackpine also offers specialist work in areas such as testing, forensics, security operations, governance, and engineering, subject to an agreed scope and available expertise.</p></div><div class="actions"><a class="button" href="/methodology/">Review assessment methodology</a><a class="button secondary" href="/reports/sample-security-assessment/">See sample work</a></div></div></section>`;
  return { title: 'Core Cybersecurity Specialties | Blackpine', description: 'Explore Blackpine core cybersecurity specialties: assessments, Microsoft 365, cloud, website security, incident response, recovery and advisory.', breadcrumbItems: [{ label: 'Home', href: '/' }, { label: 'Capabilities', href: '/services/' }, { label: 'Core specialties', href: '/services/core-specialties/' }], body };
}
