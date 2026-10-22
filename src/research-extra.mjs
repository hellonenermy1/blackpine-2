export const extraResearch = [
  {
    slug: 'common-cloud-administrative-access-mistakes',
    title: 'Common Cloud Administrative Access Mistakes',
    type: 'Engineering Note',
    topic: 'Cloud Security',
    date: '2026-10-22',
    updated: '2026-10-22',
    readTime: '7 min',
    dek: 'Cloud exposure often grows through ordinary administrative decisions: standing privilege, stale guest access, unmanaged integrations, weak recovery ownership, and logs nobody is responsible for reviewing.',
    sections: [
      { heading: 'Standing privilege becomes invisible', paragraphs: ['Administrative access often starts as a temporary requirement and becomes permanent. Review which identities can change authentication, sharing, logging, billing, application consent, or security policy; then separate routine administration from high-impact privilege. A privileged role should have a current owner and a current reason to exist.'] },
      { heading: 'External access outlives the project', paragraphs: ['Guests, contractors, vendors, support identities, shared folders, delegated mailboxes, and connected applications can persist after the business reason for access ends. Offboarding therefore needs to review relationships and integrations, not only employee accounts.'] },
      { heading: 'Recovery paths are part of the control plane', paragraphs: ['An administrator account can have strong sign-in controls and still depend on weak recovery channels. Document who can recover critical accounts, what independent verification is required, and whether the recovery process still works when the primary identity platform is unavailable.'] },
      { heading: 'Logs need ownership as well as retention', paragraphs: ['Enabling audit data is useful only if the organization knows which events matter, how long evidence remains available, and who can retrieve it during an incident. Cloud-security reviews should connect logging decisions to realistic response questions rather than treating “logging enabled” as the end state.'] }
    ],
    sources: [
      ['NIST Cybersecurity Framework 2.0', 'https://www.nist.gov/cyberframework'],
      ['Canadian Centre for Cyber Security — Guidance on cloud security assessment and authorization', 'https://www.cyber.gc.ca/en/guidance/guidance-cloud-security-assessment-and-authorization-itsp50105'],
      ['Microsoft — Privileged access strategy', 'https://learn.microsoft.com/en-us/security/privileged-access-workstations/privileged-access-access-model']
    ]
  },
  {
    slug: 'what-a-useful-security-assessment-report-contains',
    title: 'What a Useful Security Assessment Report Should Contain',
    type: 'Technical Guide',
    topic: 'Security Assessment',
    date: '2026-10-22',
    updated: '2026-10-22',
    readTime: '8 min',
    dek: 'A report should make evidence, consequence, ownership, priority, and uncertainty easier to understand. A long list of findings without decision context is not the same thing as a useful assessment.',
    sections: [
      { heading: 'State the scope before the findings', paragraphs: ['Readers need to know which systems, identities, environments, evidence sources, dates, and testing methods were included. They also need to know what was outside scope. Without those boundaries, a clean report can be mistaken for evidence that an unreviewed area is secure.'] },
      { heading: 'Separate observation from consequence', paragraphs: ['A useful finding distinguishes what was observed from why it matters. The report should identify the affected area, supporting evidence, plausible consequence, important assumptions, and the conditions that influence severity instead of relying on a dramatic label alone.'] },
      { heading: 'Make remediation operational', paragraphs: ['Recommendations should identify the intended risk reduction and, where useful, sequencing or ownership. “Enable MFA” is often too vague; the real work may involve privileged identities, exceptions, recovery methods, legacy protocols, service accounts, or user enrollment.'] },
      { heading: 'Preserve uncertainty', paragraphs: ['If evidence was incomplete, access was unavailable, or a conclusion depends on an assumption, say so. Assessment writing becomes more credible when it distinguishes confirmed facts from inference instead of hiding uncertainty behind confident prose.'] },
      { heading: 'Create a path to verification', paragraphs: ['For material findings, define what evidence would demonstrate that remediation worked. A report becomes more useful when teams can close the loop rather than simply mark a recommendation complete.'] }
    ],
    sources: [
      ['NIST Cybersecurity Framework 2.0', 'https://www.nist.gov/cyberframework'],
      ['Canadian Centre for Cyber Security — Baseline Cyber Security Controls for Small and Medium Organizations', 'https://www.cyber.gc.ca/en/guidance/baseline-cyber-security-controls-small-medium-organizations']
    ]
  },
  {
    slug: 'website-administrator-accounts-overlooked-attack-path',
    title: 'Website Administrator Accounts: An Overlooked Attack Path',
    type: 'Engineering Note',
    topic: 'Web Security',
    date: '2026-10-22',
    updated: '2026-10-22',
    readTime: '7 min',
    dek: 'A business website may depend on a chain of privileged systems — registrar, DNS, hosting, deployment, CMS, plugins, forms, and recovery accounts — while ownership of that chain remains fragmented.',
    sections: [
      { heading: 'The website is larger than the CMS', paragraphs: ['Compromise of a registrar, DNS provider, hosting account, deployment service, or administrative mailbox can affect the website even when the application itself has no exploitable flaw. Map the administrative chain before deciding what “website security” means.'] },
      { heading: 'Shared administration hides accountability', paragraphs: ['Agencies, contractors, former staff, shared credentials, and emergency accounts can accumulate over time. Review who has privileged access, whether each identity is attributable to a person or controlled service, and which party owns removal when a relationship changes.'] },
      { heading: 'Recovery can become the weakest path', paragraphs: ['Registrar and hosting recovery may depend on the same mailbox or phone number. That creates correlated failure: compromise or loss of one recovery channel can affect multiple layers of control. Critical recovery paths should be documented and tested rather than assumed.'] },
      { heading: 'Application testing and administrative review are different', paragraphs: ['A penetration test can identify application vulnerabilities without resolving weak registrar ownership, stale administrators, insecure recovery, or third-party script governance. Conversely, an administrative-security review is not a substitute for source-code review or authorized penetration testing. Define which question the engagement is intended to answer.'] }
    ],
    sources: [
      ['OWASP Web Security Testing Guide', 'https://owasp.org/www-project-web-security-testing-guide/'],
      ['CISA — Secure by Design', 'https://www.cisa.gov/securebydesign']
    ]
  },
  {
    slug: 'mfa-enabled-does-not-mean-identity-secure',
    title: '“MFA Enabled” Does Not Mean the Identity Is Secure',
    type: 'Engineering Note',
    topic: 'Identity & Email',
    date: '2026-10-22',
    updated: '2026-10-22',
    readTime: '7 min',
    dek: 'MFA is an important control, but identity security also depends on method strength, enrollment, exceptions, recovery, session handling, privileged roles, and the business processes that trust the account.',
    sections: [
      { heading: 'Coverage matters', paragraphs: ['An organization can truthfully say MFA is enabled while important accounts remain outside enforcement because of legacy settings, exclusions, emergency access, service identities, or inconsistent policy. Review effective coverage rather than the existence of a feature toggle.'] },
      { heading: 'Methods are not equivalent', paragraphs: ['Different authentication methods resist different attack paths. CISA recommends phishing-resistant MFA for stronger protection against credential phishing. Where stronger methods are practical, high-impact identities should receive priority rather than assuming every MFA method provides the same assurance.'] },
      { heading: 'Recovery can bypass the sign-in design', paragraphs: ['Password reset, recovery email, phone support, break-glass credentials, or device-registration processes can become alternate paths to account control. Those paths need ownership, verification, monitoring, and periodic testing.'] },
      { heading: 'Privilege changes the consequence', paragraphs: ['The same authentication weakness has different consequences on an ordinary user account and a tenant-wide administrator. Map privilege, access, and recovery together so identity controls are prioritized around potential impact.'] },
      { heading: 'Identity is a system, not one control', paragraphs: ['Authentication, authorization, recovery, session management, application consent, logging, and offboarding should be reviewed as connected controls. MFA remains valuable; the mistake is treating it as the end of identity-security work.'] }
    ],
    sources: [
      ['CISA — Implementing Phishing-Resistant MFA', 'https://www.cisa.gov/resources-tools/resources/implementing-phishing-resistant-mfa'],
      ['NIST Digital Identity Guidelines', 'https://pages.nist.gov/800-63-4/'],
      ['Microsoft Entra — Conditional Access overview', 'https://learn.microsoft.com/en-us/entra/identity/conditional-access/overview']
    ]
  }
];
