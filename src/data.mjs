import {
  site as sourceSite,
  nav as sourceNav,
  services as sourceServices,
  research as coreResearch,
  trustPages as sourceTrustPages
} from './content-v4.mjs';
import { extraResearch } from './research-extra.mjs';
import { specialistServices } from './v3-data.mjs';
import {
  capabilityFamilies,
  engagementModels,
  capabilityRegistry,
  researchCandidates,
  publicServiceBindings,
  restrictedOperationalClaims,
  metadataForPublicService
} from './capabilities.mjs';

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
    intro: 'A security assessment should make it easier to decide what to fix. We review the systems and controls agreed with you, explain what the evidence shows, and rank the findings by their likely impact. We confirm the scope and permitted methods before starting.'
  },
  'identity-email-security': {
    short: 'Review the identities, mail controls, and recovery paths attackers use to retain access.',
    intro: 'Access to email and administrator accounts can affect much of a business. We review who has privileged access, how MFA and account recovery work, and whether forwarding rules, delegation, or connected apps create avoidable risk.'
  },
  'cloud-saas-security': {
    short: 'Examine privileged access, external sharing, integrations, and recovery across cloud and SaaS.',
    intro: 'Old administrator accounts, guest access, and connected apps can leave cloud systems exposed long after they are needed. We examine those access paths, sharing settings, and recovery arrangements, then explain which gaps deserve attention first.'
  },
  'website-administrative-security': {
    short: 'Trace control of domains, DNS, hosting, CMS administration, dependencies, and recovery.',
    intro: 'Website security goes beyond the page visitors see. We review who controls the domain, DNS, hosting, deployments, administrator accounts, plugins, and recovery options, including responsibilities shared with outside providers.'
  },
  'incident-response': {
    short: 'Structured response for compromised identities, email, cloud services, and public systems.',
    intro: 'When an incident is suspected, the first job is to understand what happened without losing important evidence. We help identify affected accounts or systems, plan safe containment, and coordinate authorized investigation and recovery work.'
  },
  'incident-readiness-recovery': {
    short: 'Test roles, communications, evidence, backup ownership, and recovery decisions before pressure arrives.',
    intro: 'Plans fail at handoffs. We check who makes decisions during an incident, how the team communicates, where evidence is kept, and whether critical systems can actually be restored.'
  },
  'security-advisory': {
    short: 'Independent technical guidance for security priorities, remediation, vendors, and operating decisions.',
    intro: 'Security decisions have to work within real budgets, systems, and business priorities. Our advisory work helps teams compare options, identify the risks they can address, and decide who should act next.'
  }
};

const trustEditorial = {
  'security-practices': 'How Blackpine approaches website security, client inquiries, and the separation of its public systems.',
  'data-handling': 'What information you can safely send through the website, and how we arrange a suitable way to exchange sensitive material.',
  'responsible-disclosure': 'How to report a suspected security issue in a Blackpine-owned public system without expanding testing beyond what is safe and authorized.',
  'website-security': 'How this site is built: static pages, limited JavaScript, restrictive browser settings, and no advertising or marketing trackers.'
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
  const sections = page.sections.map(([heading, paragraphs]) => {
    if (heading === 'Dependencies') {
      return [
        heading,
        [
          'The production build pipeline intentionally has no runtime JavaScript framework and no third-party package dependencies.',
          'Any future dependency must justify the security, privacy, maintenance, and performance cost it adds.'
        ]
      ];
    }
    if (heading === 'Third parties') {
      return [
        heading,
        [
          'The production corporate site does not load third-party analytics, ad networks, tag managers, remote fonts, social widgets, or externally hosted imagery.',
          'Brand artwork and social-preview assets are served from the Blackpine domain. External links are ordinary navigational links and do not load third-party code into the page.'
        ]
      ];
    }
    return [heading, paragraphs];
  });
  return [
    ...sections,
    [
      'First-party preferences',
      [
        'The corporate site can store a preferred language and display theme in local browser storage so those display choices can be remembered on that browser.',
        'The preference record does not contain a name, email address, random tracking identifier, or timestamp, and the preference runtime does not transmit the record to Blackpine.',
        'Visitors can reopen Privacy preferences from the site footer and clear the saved Blackpine preference record from the browser.'
      ]
    ]
  ];
};

const withCapabilityMetadata = service => ({
  ...service,
  ...metadataForPublicService(service.slug)
});

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
].map(withCapabilityMetadata);
export const trustPages = sourceTrustPages.map(page => ({
  ...page,
  intro: trustEditorial[page.slug] || page.intro,
  sections: updateTrustSections(page)
}));
export const research = allResearch.filter(item => publishedResearchSlugs.has(item.slug));

export {
  capabilityFamilies,
  engagementModels,
  capabilityRegistry,
  researchCandidates,
  publicServiceBindings,
  restrictedOperationalClaims
};
