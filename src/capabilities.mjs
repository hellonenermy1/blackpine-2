export const capabilityFamilies = [
  {
    id: 'emergency-response',
    name: 'Blackpine Emergency Response',
    path: '/services/emergency-response/',
    intent: "We think we've been hacked.",
    summary: 'Urgent triage, containment, investigation, and response coordination for active or suspected cyber incidents.'
  },
  {
    id: 'investigate',
    name: 'Blackpine Investigate',
    path: '/services/investigate/',
    intent: 'Something suspicious is happening.',
    summary: 'Investigation of suspicious activity when the cause, scope, or impact is not yet clear.'
  },
  {
    id: 'recover',
    name: 'Blackpine Recover',
    path: '/services/recover/',
    intent: 'Help us regain control and clean everything up.',
    summary: 'Restore authorized control, remove known persistence where possible, and harden the affected environment after compromise.'
  },
  {
    id: 'protect',
    name: 'Blackpine Protect',
    path: '/services/protect/',
    intent: 'We need better security.',
    summary: 'Assess, harden, test, and improve identities, endpoints, applications, cloud services, websites, email, recovery, and governance.'
  },
  {
    id: 'monitor',
    name: 'Blackpine Monitor',
    path: '/services/monitor/',
    intent: 'Watch our environment and surface security problems.',
    summary: 'Recurring monitoring, endpoint protection, vulnerability management, attack-surface review, account-security review, and reporting.'
  },
  {
    id: 'security-desk',
    name: 'Blackpine Security Desk',
    path: '/services/security-desk/',
    intent: "We don't know whether this is dangerous.",
    summary: 'A simple route for everyday cybersecurity questions, suspicious-email checks, unusual prompts, and alert triage.'
  }
];

export const engagementModels = [
  {
    id: 'on-demand',
    name: 'Blackpine On-Demand',
    summary: 'Pay-as-needed work for organizations that do not have a recurring Blackpine subscription.',
    claimState: 'USER_DECLARED'
  },
  {
    id: 'response-retainer',
    name: 'Blackpine Response Retainer',
    summary: 'Pre-established incident-response relationship intended to reduce contracting and environment-discovery friction during an incident.',
    claimState: 'USER_DECLARED',
    restrictedClaims: ['specific response SLA', '24/7 availability', 'guaranteed response time']
  },
  {
    id: 'managed-security',
    name: 'Blackpine Managed Security',
    summary: 'Recurring security relationship covering agreed monitoring, endpoint protection, vulnerability management, account review, Security Desk support, and reporting.',
    claimState: 'USER_DECLARED',
    restrictedClaims: ['24/7 monitoring', 'continuous monitoring', 'guaranteed containment', 'real-time dark-web monitoring']
  }
];

const live = 'LIVE';
const contractDependent = 'CONTRACT_DEPENDENT';
const planned = 'PLANNED';
const existing = 'EXISTING_ROUTE';
const phase2 = 'PHASE_2';
const notPublic = 'NOT_PUBLIC';

export const capabilityRegistry = [
  ['cyber-incident-response', 'Cyber Incident Response', 'emergency-response', 'Essential', live, existing, ['on-demand', 'response-retainer'], '/services/incident-response/', ['hack', 'breach', 'active intrusion', 'compromised system']],
  ['cybersecurity-emergency-hotline', 'Cybersecurity Emergency Hotline', 'emergency-response', 'Essential', contractDependent, notPublic, ['on-demand', 'response-retainer'], null, ['urgent suspicious activity', 'active attack', 'emergency cyber help']],
  ['suspicious-activity-investigation', 'Suspicious Activity Investigation', 'investigate', 'Essential', live, phase2, ['on-demand', 'response-retainer', 'managed-security'], null, ['strange login', 'unusual network activity', 'suspicious device', 'security alert']],
  ['account-compromise-recovery', 'Account Compromise Recovery', 'recover', 'Essential', live, phase2, ['on-demand', 'response-retainer'], '/services/identity-email-security/', ['account takeover', 'locked out', 'CEO account hacked', 'admin account compromised']],
  ['ransomware-response', 'Ransomware Response', 'emergency-response', 'Essential', live, phase2, ['on-demand', 'response-retainer'], '/services/incident-response/', ['ransom note', 'encrypted files', 'ransomware']],
  ['business-email-compromise-response', 'Business Email Compromise Response', 'emergency-response', 'Essential', live, phase2, ['on-demand', 'response-retainer'], '/services/incident-response/', ['BEC', 'mailbox hacked', 'payment fraud', 'forwarding rule']],
  ['malware-investigation-remediation', 'Malware Investigation & Remediation', 'emergency-response', 'Essential', live, phase2, ['on-demand', 'response-retainer'], '/services/incident-response/', ['malware', 'suspicious file', 'infected device']],
  ['digital-forensics', 'Digital Forensics', 'investigate', 'High', live, existing, ['on-demand', 'response-retainer'], '/services/digital-forensics/', ['forensics', 'timeline', 'evidence', 'logs']],
  ['post-incident-recovery', 'Post-Incident Recovery', 'recover', 'Essential', live, phase2, ['on-demand', 'response-retainer'], '/services/incident-readiness-recovery/', ['restore systems', 'rotate credentials', 'hardening after breach']],
  ['security-assessment', 'Security Assessment', 'protect', 'Essential', live, existing, ['on-demand', 'managed-security'], '/services/security-assessments/', ['security posture', 'security review', 'security gaps']],
  ['microsoft-365-google-workspace-security', 'Microsoft 365 / Google Workspace Security', 'protect', 'Essential', live, phase2, ['on-demand', 'managed-security'], '/services/identity-email-security/', ['Microsoft 365 security', 'M365 security', 'Google Workspace security', 'conditional access', 'admin roles']],
  ['endpoint-security', 'Endpoint Security', 'protect', 'High', live, phase2, ['on-demand', 'managed-security'], null, ['Defender', 'CrowdStrike', 'SentinelOne', 'EDR', 'endpoint protection']],
  ['managed-detection-response', 'Managed Detection & Response', 'monitor', 'High', live, phase2, ['managed-security'], '/services/security-monitoring/', ['MDR', 'security monitoring', 'alert investigation']],
  ['vulnerability-management', 'Vulnerability Management', 'monitor', 'High', live, phase2, ['on-demand', 'managed-security'], '/services/security-monitoring/', ['vulnerability scanning', 'regular scanning', 'exposed services']],
  ['penetration-testing', 'Penetration Testing', 'protect', 'High', live, existing, ['on-demand'], '/services/penetration-testing/', ['pentest', 'web pentest', 'API testing', 'network pentest', 'cloud pentest']],
  ['website-web-application-security', 'Website & Web Application Security', 'protect', 'High', live, existing, ['on-demand', 'managed-security'], '/services/website-administrative-security/', ['WAF', 'Cloudflare', 'DDoS', 'origin protection', 'web hardening', 'application security']],
  ['cloud-security', 'Cloud Security', 'protect', 'High', live, existing, ['on-demand', 'managed-security'], '/services/cloud-saas-security/', ['AWS security', 'Azure security', 'Google Cloud security', 'SaaS security']],
  ['email-security-phishing-protection', 'Email Security & Phishing Protection', 'protect', 'High', live, existing, ['on-demand', 'managed-security'], '/services/identity-email-security/', ['DMARC', 'SPF', 'DKIM', 'phishing protection', 'mail security']],
  ['phishing-investigation', 'Phishing Investigation', 'security-desk', 'Essential', live, phase2, ['on-demand', 'response-retainer', 'managed-security'], null, ['is this email real', 'phishing email', 'suspicious email']],
  ['credential-dark-web-monitoring', 'Credential / Dark-Web Monitoring', 'monitor', 'Medium', live, phase2, ['managed-security'], null, ['leaked credentials', 'dark web', 'credential exposure']],
  ['external-attack-surface-monitoring', 'External Attack-Surface Monitoring', 'monitor', 'High', live, phase2, ['managed-security'], null, ['attack surface', 'subdomain monitoring', 'exposed ports', 'certificate monitoring']],
  ['security-awareness-training', 'Security Awareness Training', 'protect', 'Medium', live, phase2, ['on-demand', 'managed-security'], null, ['security training', 'phishing awareness', 'social engineering training']],
  ['phishing-simulations', 'Phishing Simulations', 'protect', 'Medium', live, phase2, ['on-demand', 'managed-security'], null, ['phishing simulation', 'phishing campaign', 'employee test']],
  ['backup-ransomware-readiness', 'Backup & Ransomware Readiness', 'protect', 'Essential', live, existing, ['on-demand', 'response-retainer', 'managed-security'], '/services/incident-readiness-recovery/', ['backup testing', 'immutability', 'restore test', 'ransomware readiness']],
  ['incident-response-retainer', 'Incident Response Retainer', 'emergency-response', 'Essential', live, phase2, ['response-retainer'], '/engagements/', ['IR retainer', 'priority incident response', 'annual incident exercise']],
  ['vciso-security-advisory', 'vCISO / Security Advisory', 'protect', 'High', live, existing, ['on-demand', 'managed-security'], '/services/security-advisory/', ['vCISO', 'security advisor', 'security leadership']],
  ['security-policies-procedures', 'Security Policies & Procedures', 'protect', 'Medium', live, phase2, ['on-demand', 'managed-security'], '/services/security-advisory/', ['incident plan', 'access policy', 'MFA policy', 'acceptable use']],
  ['compliance-readiness', 'Compliance Readiness', 'protect', 'Medium', live, existing, ['on-demand'], '/services/compliance-readiness/', ['ISO 27001 readiness', 'SOC 2 readiness', 'PCI DSS readiness', 'NIST readiness']],
  ['vendor-third-party-risk-reviews', 'Vendor / Third-Party Risk Reviews', 'protect', 'Medium', live, phase2, ['on-demand', 'managed-security'], '/services/security-advisory/', ['vendor security review', 'supplier risk', 'third-party risk']],
  ['tabletop-exercises', 'Tabletop Exercises', 'protect', 'Medium', live, phase2, ['on-demand', 'response-retainer'], '/services/incident-readiness-recovery/', ['ransomware tabletop', 'breach exercise', 'incident exercise']],
  ['security-help-desk', 'Security Help Desk', 'security-desk', 'Essential', live, phase2, ['managed-security', 'response-retainer'], null, ['is this email real', 'unexpected MFA prompt', 'is this alert dangerous', 'security question']]
].map(([id, name, primaryFamily, priority, operationalStatus, publicationStatus, engagements, currentRoute, searchAliases]) => ({
  id,
  name,
  primaryFamily,
  priority,
  operationalStatus,
  verification: 'USER_DECLARED_OFFERING',
  publicationStatus,
  engagements,
  currentRoute,
  searchAliases
}));

export const researchCandidates = [
  {
    id: 'compromise-assessment',
    name: 'Compromise Assessment',
    primaryFamily: 'investigate',
    operationalStatus: planned,
    publicationStatus: notPublic,
    verification: 'RESEARCH_CANDIDATE'
  },
  {
    id: 'threat-hunting',
    name: 'Threat Hunting',
    primaryFamily: 'investigate',
    operationalStatus: planned,
    publicationStatus: notPublic,
    verification: 'RESEARCH_CANDIDATE'
  },
  {
    id: 'detection-engineering',
    name: 'Detection Engineering',
    primaryFamily: 'monitor',
    operationalStatus: planned,
    publicationStatus: notPublic,
    verification: 'RESEARCH_CANDIDATE'
  },
  {
    id: 'incident-coordination',
    name: 'Incident Coordination',
    primaryFamily: 'emergency-response',
    operationalStatus: planned,
    publicationStatus: notPublic,
    verification: 'RESEARCH_CANDIDATE'
  },
  {
    id: 'cybersecure-canada-readiness',
    name: 'CyberSecure Canada Readiness',
    primaryFamily: 'protect',
    operationalStatus: planned,
    publicationStatus: notPublic,
    verification: 'RESEARCH_CANDIDATE'
  }
];

export const publicServiceBindings = {
  'security-assessments': ['security-assessment'],
  'identity-email-security': ['microsoft-365-google-workspace-security', 'email-security-phishing-protection', 'account-compromise-recovery'],
  'cloud-saas-security': ['cloud-security'],
  'website-administrative-security': ['website-web-application-security'],
  'incident-response': ['cyber-incident-response', 'ransomware-response', 'business-email-compromise-response', 'malware-investigation-remediation'],
  'incident-readiness-recovery': ['backup-ransomware-readiness', 'post-incident-recovery', 'tabletop-exercises'],
  'security-advisory': ['vciso-security-advisory', 'security-policies-procedures', 'vendor-third-party-risk-reviews'],
  'penetration-testing': ['penetration-testing'],
  'application-security': ['website-web-application-security'],
  'digital-forensics': ['digital-forensics'],
  'security-monitoring': ['managed-detection-response', 'vulnerability-management', 'external-attack-surface-monitoring', 'credential-dark-web-monitoring', 'endpoint-security'],
  'compliance-readiness': ['compliance-readiness']
};

export const restrictedOperationalClaims = [
  {
    id: 'twenty-four-seven',
    patterns: [/\b24\s*\/\s*7\b/i, /\b24 hours? a day\b/i],
    approved: false,
    reason: 'Publication requires confirmed staffing/coverage and contractual wording.'
  },
  {
    id: 'guaranteed-response',
    patterns: [/\bguaranteed (?:priority )?response\b/i, /\bguaranteed response time\b/i],
    approved: false,
    reason: 'Publication requires a defined and enforceable response commitment.'
  },
  {
    id: 'guaranteed-recovery',
    patterns: [/\bguaranteed recovery\b/i, /\bguarantee(?:d|s)? (?:full )?recovery\b/i],
    approved: false,
    reason: 'Incident recovery cannot be represented as certain without evidence and scope.'
  },
  {
    id: 'response-sla',
    patterns: [/\b\d+\s*(?:minute|hour)s? response\b/i, /\bresponse within \d+\s*(?:minute|hour)s?\b/i],
    approved: false,
    reason: 'Publication requires an approved SLA and activation model.'
  },
  {
    id: 'continuous-monitoring',
    patterns: [/\bcontinuous(?:ly)? monitor(?:ing|ed)?\b/i, /\balways monitored\b/i],
    approved: false,
    reason: 'Publication requires confirmed telemetry, staffing, coverage, escalation, and response authority.'
  },
  {
    id: 'real-time-dark-web',
    patterns: [/\breal[- ]time dark[- ]web monitoring\b/i],
    approved: false,
    reason: 'Publication requires a real data source/provider and defined monitoring process.'
  }
];

export const capabilityById = new Map(capabilityRegistry.map(capability => [capability.id, capability]));
export const familyById = new Map(capabilityFamilies.map(family => [family.id, family]));
export const engagementById = new Map(engagementModels.map(model => [model.id, model]));

export const metadataForPublicService = slug => {
  const capabilityIds = publicServiceBindings[slug] || [];
  const capabilities = capabilityIds.map(id => capabilityById.get(id)).filter(Boolean);
  return {
    capabilityIds,
    capabilityFamilies: [...new Set(capabilities.map(item => item.primaryFamily))],
    engagementModels: [...new Set(capabilities.flatMap(item => item.engagements || []))]
  };
};
