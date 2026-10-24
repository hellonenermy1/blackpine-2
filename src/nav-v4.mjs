export const navGroups = [
  {
    label: 'Capabilities', href: '/services/', columns: [
      ['Start with the situation', [
        ['Emergency Response', '/services/emergency-response/'],
        ['Investigate', '/services/investigate/'],
        ['Recover', '/services/recover/'],
        ['Protect', '/services/protect/'],
        ['Monitor', '/services/monitor/'],
        ['Security Desk', '/services/security-desk/']
      ]],
      ['Specialist services', [
        ['Security Assessments', '/services/security-assessments/'],
        ['Identity & Email Security', '/services/identity-email-security/'],
        ['Cloud & SaaS Security', '/services/cloud-saas-security/'],
        ['Penetration Testing', '/services/penetration-testing/'],
        ['Digital Forensics', '/services/digital-forensics/'],
        ['All specialist capabilities', '/services/']
      ]]
    ]
  },
  { label: 'Work', href: '/work/' },
  {
    label: 'Research', href: '/research/', columns: [
      ['Publications', [['Research Library', '/research/'], ['Advisories', '/advisories/'], ['Reports', '/reports/']]],
      ['Practical material', [['Resources', '/resources/'], ['Guides', '/resources/guides/'], ['Security Baseline', '/security-baseline/'], ['Glossary', '/glossary/']]]
    ]
  },
  {
    label: 'Labs', href: '/labs/', columns: [
      ['Engineering', [['Blackpine Labs', '/labs/'], ['Cipher', '/labs/cipher/'], ['Cipher Security Model', '/labs/cipher/security-model/']]],
      ['Public tools', [['Tools', '/tools/'], ['Security Headers', '/tools/security-headers/'], ['Email Security', '/tools/email-security/'], ['Domain & DNS', '/tools/domain-dns/']]]
    ]
  },
  {
    label: 'Trust', href: '/trust/', columns: [
      ['Security & data', [['Security Practices', '/trust/security-practices/'], ['Privacy', '/trust/privacy/'], ['Data Handling', '/trust/data-handling/'], ['Data Retention', '/trust/data-retention/'], ['Website Security', '/trust/website-security/']]],
      ['Assurance & resilience', [['Compliance & Assurance', '/trust/compliance/'], ['Subprocessors', '/trust/subprocessors/'], ['Business Continuity', '/trust/business-continuity/'], ['Incident Response Governance', '/trust/incident-response-governance/'], ['Assurance Requests', '/trust/assurance-requests/']]],
      ['Contact & disclosure', [['Responsible Disclosure', '/trust/responsible-disclosure/'], ['Security Contacts', '/trust/security-contacts/'], ['Security FAQ', '/trust/security-faq/'], ['Methodology', '/methodology/'], ['Engagement Models', '/engagements/']]]
    ]
  },
  {
    label: 'Company', href: '/company/about/', columns: [
      ['Blackpine', [['About', '/company/about/'], ['Team', '/company/team/'], ['Who We Work With', '/company/who-we-work-with/'], ['Careers', '/company/careers/']]],
      ['Start here', [['Security Self-Assessment', '/assessment/'], ['Contact', '/contact/']]]
    ]
  }
];
