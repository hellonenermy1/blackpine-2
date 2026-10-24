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
    title: 'Focused areas where Blackpine brings assessment, engineering and response together.',
    lead: 'Blackpine maintains a broader capability catalogue, but public positioning should make the core practice areas easy to understand rather than imply equal depth in every possible cybersecurity discipline.',
    meta: '<strong>Positioning rule</strong>Depth before an endless service list'
  }) + `<section class="section"><div class="shell"><div class="service-rows">${specialties.map((item, index) => `<a class="service-row" href="${esc(item[2])}"><span class="service-index">${String(index + 1).padStart(2, '0')}</span><span><strong>${esc(item[0])}</strong><small>${esc(item[1])}</small></span><span class="row-arrow">↗</span></a>`).join('')}</div><div class="notice"><strong>Broader capabilities still exist.</strong><p>This page identifies Blackpine's primary public specialties. It does not erase legitimate supporting capabilities such as testing, forensics, security operations, governance or engineering where those services are specifically scoped and staffed.</p></div><div class="actions"><a class="button" href="/methodology/">Review assessment methodology</a><a class="button secondary" href="/reports/sample-security-assessment/">See sample work</a></div></div></section>`;
  return { title: 'Core Cybersecurity Specialties | Blackpine', description: 'Blackpine core specialties across security assessments, identity and Microsoft 365, cloud and SaaS, web security, incident response, readiness and technical advisory.', breadcrumbItems: [{ label: 'Home', href: '/' }, { label: 'Capabilities', href: '/services/' }, { label: 'Core specialties', href: '/services/core-specialties/' }], body };
}
