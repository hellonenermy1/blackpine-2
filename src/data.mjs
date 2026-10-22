import {
  site as sourceSite,
  nav as sourceNav,
  services as sourceServices,
  research as coreResearch,
  trustPages as sourceTrustPages
} from './content.mjs';
import { extraResearch } from './research-extra.mjs';
import { specialistServices } from './v3-data.mjs';

const movedReferenceUrls = new Map([
  [
    'https://www.cyber.gc.ca/en/guidance/baseline-cyber-security-controls-small-medium-organizations',
    'https://www.cyber.gc.ca/en/guidance/baseline-cyber-security-controls-small-and-medium-organizations'
  ],
  [
    'https://www.cisa.gov/resources-tools/resources/implementing-phishing-resistant-mfa',
    'https://www.cisa.gov/sites/default/files/publications/fact-sheet-implementing-phishing-resistant-mfa-508c.pdf'
  ]
]);

const serviceEditorial = {
  'security-assessments': {
    short: 'Evidence-led review of exposure, privileged access, configuration, and recovery controls.',
    intro: 'A Blackpine assessment maps the systems and control points that matter, reviews the agreed evidence, and turns what we find into a ranked remediation sequence. Scope, authority, and depth are fixed before review work starts.'
  },
  'identity-email-security': {
    short: 'Review the identities, mail controls, and recovery paths attackers use to retain access.',
    intro: 'Email and identity are often the control plane for the rest of the environment. Blackpine examines privileged roles, MFA, recovery, forwarding, delegation, and connected applications as one access system rather than a set of unrelated settings.'
  },
  'cloud-saas-security': {
    short: 'Examine privileged access, external sharing, integrations, and recovery across cloud and SaaS.',
    intro: 'Cloud exposure accumulates quietly through old administrators, guest access, integrations, broad sharing, and unclear recovery ownership. The review makes those control paths visible and prioritizes the ones with the largest operational consequence.'
  },
  'website-administrative-security': {
    short: 'Trace control of domains, DNS, hosting, CMS administration, dependencies, and recovery.',
    intro: 'A public website is a chain of control stretching from registrar and DNS to hosting, deployment, CMS access, plugins, and forms. Blackpine reviews that administrative path end to end so ownership and recovery weaknesses are not hidden between vendors.'
  },
  'incident-response': {
    short: 'Structured response for compromised identities, email, cloud services, and public systems.',
    intro: 'Incident response begins by establishing facts: what changed, which identities or systems are affected, what evidence still exists, and which containment actions are safe. Blackpine helps organize that work into an authorized response and recovery sequence.'
  },
  'incident-readiness-recovery': {
    short: 'Test roles, communications, evidence, backup ownership, and recovery decisions before pressure arrives.',
    intro: 'Plans fail at handoffs. Blackpine reviews who can decide, how responders communicate, where evidence comes from, how critical systems are restored, and which dependencies could block recovery.'
  },
  'security-advisory': {
    short: 'Independent technical guidance for security priorities, remediation, vendors, and operating decisions.',
    intro: 'Security work competes with budget, usability, delivery, and vendor constraints. Advisory engagements turn those constraints into an ordered set of decisions, owners, and accepted risks instead of another unprioritized control list.'
  }
};

const trustEditorial = {
  'security-practices': 'Public-facing security practices for the corporate site, client intake, engagement boundaries, and separation of Blackpine systems.',
  'data-handling': 'How Blackpine minimizes public intake and establishes a controlled exchange method before sensitive engagement material is requested.',
  'responsible-disclosure': 'How to report a suspected security issue in a Blackpine-owned public system without expanding testing beyond what is safe and authorized.',
  'website-security': 'How the Blackpine corporate site is built and constrained: static generation, limited JavaScript, restrictive browser policy, and no advertising or marketing trackers.'
};

const publishedResearchSlugs = new Set([
  'what-a-useful-security-assessment-report-contains',
  'designing-account-recovery-for-privileged-accounts',
  'common-cloud-administrative-access-mistakes',
  'website-administrator-accounts-overlooked-attack-path',
  'preserve-evidence-after-suspicious-admin-login',
  'backup-availability-is-not-recovery-readiness',
  'vendor-access-and-offboarding',
  'business-email-compromise-first-actions'
]);

const normalizeResearch = item => ({
  ...item,
  sources: item.sources.map(([label, url]) => [label, movedReferenceUrls.get(url) || url])
});

const allResearch = [...coreResearch, ...extraResearch].map(normalizeResearch);

const updateTrustSections = page => {
  if (page.slug !== 'website-security') return page.sections;
  return page.sections.map(([heading, paragraphs]) => {
    if (heading !== 'Third parties') return [heading, paragraphs];
    return [
      heading,
      [
        'The production corporate site does not load third-party analytics, ad networks, tag managers, remote fonts, or externally hosted imagery.',
        'Brand artwork and social-preview assets are served from the Blackpine domain. External links are ordinary navigational links and do not load third-party code into the page.'
      ]
    ];
  });
};

export const site = {
  ...sourceSite,
  description: 'Blackpine Cybersecurity is a Canadian security firm bringing advisory, defensive engineering, incident response, security operations, risk, and technical research together around systems that matter.',
  ogImage: `${sourceSite.url}/assets/og/home.png`,
  infrastructureImage: '/assets/visuals/infrastructure.svg',
  ogImages: {
    home: `${sourceSite.url}/assets/og/home.png`,
    services: `${sourceSite.url}/assets/og/capabilities.png`,
    engagements: `${sourceSite.url}/assets/og/capabilities.png`,
    methodology: `${sourceSite.url}/assets/og/capabilities.png`,
    work: `${sourceSite.url}/assets/og/company.png`,
    research: `${sourceSite.url}/assets/og/research.png`,
    advisories: `${sourceSite.url}/assets/og/research.png`,
    reports: `${sourceSite.url}/assets/og/research.png`,
    resources: `${sourceSite.url}/assets/og/research.png`,
    glossary: `${sourceSite.url}/assets/og/research.png`,
    'security-baseline': `${sourceSite.url}/assets/og/trust.png`,
    tools: `${sourceSite.url}/assets/og/labs.png`,
    assessment: `${sourceSite.url}/assets/og/trust.png`,
    incident: `${sourceSite.url}/assets/og/trust.png`,
    search: `${sourceSite.url}/assets/og/home.png`,
    labs: `${sourceSite.url}/assets/og/labs.png`,
    trust: `${sourceSite.url}/assets/og/trust.png`,
    company: `${sourceSite.url}/assets/og/company.png`,
    contact: `${sourceSite.url}/assets/og/contact.png`,
    legal: `${sourceSite.url}/assets/og/legal.png`
  }
};

export const nav = sourceNav.map(item => item.href === '/services/' ? { ...item, label: 'Capabilities' } : item);
export const services = [
  ...sourceServices.map(service => ({ ...service, ...(serviceEditorial[service.slug] || {}) })),
  ...specialistServices
];
export const trustPages = sourceTrustPages.map(page => ({
  ...page,
  intro: trustEditorial[page.slug] || page.intro,
  sections: updateTrustSections(page)
}));
export const research = allResearch.filter(item => publishedResearchSlugs.has(item.slug));
