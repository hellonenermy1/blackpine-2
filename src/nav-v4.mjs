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
      ['Public trust', [['Security Practices', '/trust/security-practices/'], ['Data Handling', '/trust/data-handling/'], ['Responsible Disclosure', '/trust/responsible-disclosure/'], ['Website Security', '/trust/website-security/']]],
      ['How work is controlled', [['Methodology', '/methodology/'], ['Engagement Models', '/engagements/'], ['Active Incident', '/incident/']]]
    ]
  },
  {
    label: 'Company', href: '/company/about/', columns: [
      ['Blackpine', [['About', '/company/about/'], ['Team', '/company/team/'], ['Who We Work With', '/company/who-we-work-with/'], ['Careers', '/company/careers/']]],
      ['Start here', [['Security Self-Assessment', '/assessment/'], ['Contact', '/contact/']]]
    ]
  }
];
