export const site = {
  name: 'Blackpine Cybersecurity',
  url: 'https://blackpinecybersecurity.com',
  email: 'contact@blackpinecybersecurity.com',
  securityEmail: 'security@blackpinecybersecurity.com',
  careersEmail: 'careers@blackpinecybersecurity.com',
  description: 'Canada-based cybersecurity services focused on security assessment, identity and cloud security, incident response, incident readiness, and practical security engineering.',
  ogImage: 'https://blackpinecybersecurity.com/assets/og/home.png',
  infrastructureImage: '/assets/visuals/infrastructure.svg'
};

export const nav = [
  { label: 'Services', href: '/services/' },
  { label: 'Research', href: '/research/' },
  { label: 'Labs', href: '/labs/' },
  { label: 'Trust', href: '/trust/' },
  { label: 'Company', href: '/company/about/' },
  { label: 'Contact', href: '/contact/' }
];

export const services = [
  {
    slug: 'security-assessments',
    title: 'Security Assessments',
    short: 'A structured review of exposure, access, configuration, and operational security controls.',
    intro: 'Blackpine security assessments are designed to turn a broad question — “where are we exposed?” — into a defined set of findings, evidence, priorities, and next actions. Scope is agreed before review work begins.',
    when: [
      'You need an independent view of current security posture before making larger investments.',
      'Leadership or an IT team wants a prioritized list of security gaps rather than another generic checklist.',
      'A customer, insurer, board, investor, or internal project has raised security questions that need a structured response.',
      'You are preparing for a major cloud, identity, website, vendor, or operational change.'
    ],
    review: [
      'Business email, identity, MFA, privileged accounts, and recovery paths',
      'Cloud and SaaS administrative access, external sharing, and high-risk permissions',
      'Websites, administrative interfaces, public exposure, TLS, and configuration hygiene',
      'Staff and vendor access lifecycle, offboarding, ownership, and escalation paths',
      'Incident readiness, evidence availability, backup ownership, and recovery dependencies'
    ],
    method: [
      'Confirm scope, authorization, systems, priorities, and evidence sources.',
      'Review agreed controls and configurations using non-destructive techniques unless a different method is explicitly authorized.',
      'Separate observations from assumptions and rank findings by practical consequence, not visual drama.',
      'Discuss material findings and produce a remediation sequence that owners and technical teams can act on.'
    ],
    deliverables: [
      'Executive summary for decision-makers',
      'Risk-ranked findings with evidence and affected areas',
      'Remediation priorities with suggested ownership and sequencing',
      'Technical notes suitable for internal IT or external technology partners',
      'Follow-up discussion to clarify findings and next steps'
    ],
    boundary: 'An assessment is not a guarantee that every weakness or future attack path will be identified. Scope, depth, evidence access, and testing methods are agreed in writing before work begins.',
    sample: {
      area: 'Identity security',
      finding: 'Privileged accounts rely on authentication controls that are not consistently enforced.',
      consequence: 'A compromised administrator identity could provide broad access to business systems.',
      action: 'Enforce the agreed MFA standard for privileged users, review recovery methods, and verify administrative role assignments.'
    }
  },
  {
    slug: 'identity-email-security',
    title: 'Identity & Email Security',
    short: 'Reduce account takeover, impersonation, and business email compromise exposure.',
    intro: 'Identity and email are frequently the control plane for the rest of a business. Blackpine reviews the settings and operating practices that determine who can sign in, recover accounts, delegate mailboxes, forward messages, and exercise privileged access.',
    when: [
      'Microsoft 365 or Google Workspace is business-critical and administrative access has grown over time.',
      'The organization has experienced suspicious logins, phishing, payment-change fraud, or mailbox-rule abuse.',
      'MFA exists but coverage, exceptions, recovery methods, and privileged identities have not been reviewed together.',
      'Shared mailboxes, delegates, vendors, former staff, or legacy accounts make ownership unclear.'
    ],
    review: [
      'MFA coverage, authentication policy, recovery methods, and privileged identities',
      'Mailbox forwarding, inbox rules, delegation, shared mailbox access, and administrative controls',
      'Email authentication posture including SPF, DKIM, and DMARC where in scope',
      'External applications, connected services, guest access, and high-risk consent paths',
      'Joiner, mover, leaver, and account-recovery processes'
    ],
    method: [
      'Map privileged and high-value identities before looking at lower-risk accounts.',
      'Review configuration and recent security-relevant account behavior available within the agreed scope.',
      'Separate preventive controls from detection and recovery controls.',
      'Prioritize changes that reduce blast radius without creating unnecessary operational friction.'
    ],
    deliverables: [
      'Identity and mailbox security findings',
      'Privileged-access and MFA observations',
      'Forwarding, delegation, and recovery-path review',
      'Prioritized hardening actions',
      'Operational recommendations for reporting and verification workflows'
    ],
    boundary: 'Blackpine does not request passwords through the website or general email. Access requirements are agreed after scope and authorization are confirmed.',
    sample: {
      area: 'Mailbox controls',
      finding: 'External forwarding remains available to accounts that do not require it operationally.',
      consequence: 'A compromised mailbox could silently disclose messages outside the organization.',
      action: 'Restrict automatic external forwarding by policy, document approved exceptions, and monitor changes to forwarding and inbox rules.'
    }
  },
  {
    slug: 'cloud-saas-security',
    title: 'Cloud & SaaS Security',
    short: 'Review administrative access, sharing, recovery, and security ownership across cloud services.',
    intro: 'Cloud security problems are often less about one dramatic vulnerability and more about accumulated access: old administrators, broad sharing, unmanaged integrations, weak recovery ownership, and inconsistent configuration. Blackpine reviews the controls that keep those decisions visible.',
    when: [
      'Cloud services have expanded faster than access governance or documentation.',
      'Multiple SaaS platforms contain business-critical or client data.',
      'External guests, contractors, vendors, or integrations have persistent access.',
      'A cloud migration or major platform change is planned.'
    ],
    review: [
      'Administrative roles and privileged access',
      'External sharing, guest access, and publicly exposed resources',
      'SaaS integrations, connected applications, and vendor access',
      'Logging, alerting, recovery ownership, and security-relevant retention settings',
      'Offboarding, stale access, and control ownership'
    ],
    method: [
      'Identify systems that matter most to operations and data sensitivity.',
      'Map administrators, owners, external access, and major integrations.',
      'Review security controls against the agreed environment and business context.',
      'Prioritize identity, sharing, recovery, and visibility gaps before lower-impact configuration issues.'
    ],
    deliverables: [
      'Cloud and SaaS exposure summary',
      'Administrative-access findings',
      'Sharing and external-access observations',
      'Recovery and ownership recommendations',
      'Prioritized remediation plan'
    ],
    boundary: 'Cloud services vary significantly. The exact platforms, tenancy, administrative access, and evidence available are confirmed during scoping.',
    sample: {
      area: 'SaaS access',
      finding: 'External guest access persists after the original project and no owner is assigned to review it.',
      consequence: 'Data access can outlive the business reason that originally justified it.',
      action: 'Assign an access owner, establish review intervals, and remove or re-authorize stale guest access.'
    }
  },
  {
    slug: 'website-administrative-security',
    title: 'Website & Administrative Security',
    short: 'Reduce avoidable exposure around websites, CMS administration, DNS, hosting, and recovery.',
    intro: 'Public websites often depend on more than the website itself: registrar accounts, DNS, hosting, content management systems, plugins, forms, administrator accounts, and third-party services. Blackpine reviews that administrative chain as a system.',
    when: [
      'A business website is operationally important but ownership is split across agencies, contractors, and internal staff.',
      'CMS administrators, plugins, hosting, DNS, or recovery arrangements have not been reviewed recently.',
      'The website has experienced suspicious changes, warnings, account issues, or unexpected administrator activity.',
      'A redesign or hosting migration creates an opportunity to harden the administrative surface.'
    ],
    review: [
      'CMS and hosting administrator access',
      'Registrar, DNS, deployment, and recovery ownership',
      'TLS and security-relevant web configuration',
      'Plugins, dependencies, updates, and exposed administrative interfaces',
      'Forms, third-party scripts, backups, and high-level recovery paths'
    ],
    method: [
      'Map ownership from domain registration through hosting and application administration.',
      'Review exposed and privileged surfaces within the authorized scope.',
      'Distinguish application risk from operational ownership and recovery risk.',
      'Prioritize controls that prevent account takeover and reduce recovery uncertainty.'
    ],
    deliverables: [
      'Administrative exposure findings',
      'Ownership and recovery observations',
      'Configuration and dependency risks in scope',
      'Hardening priorities',
      'Clear remediation notes for internal teams or vendors'
    ],
    boundary: 'This service is not automatically a full penetration test or source-code audit. Active testing requires explicit written authorization and a separately defined scope.',
    sample: {
      area: 'Administrative access',
      finding: 'The domain registrar and CMS use separate recovery paths that depend on the same unmanaged mailbox.',
      consequence: 'Compromise or loss of that mailbox could affect both domain and website recovery.',
      action: 'Move recovery to controlled identities, enforce strong MFA, document ownership, and test the recovery process.'
    }
  },
  {
    slug: 'incident-response',
    title: 'Incident Response',
    short: 'Structured support when accounts, email, websites, or cloud services show signs of compromise.',
    intro: 'Incident response starts with disciplined decisions: what is affected, what must be contained, what evidence needs to be preserved, and who needs to be involved. Blackpine helps organizations move from uncertainty to an authorized response plan without treating the website as a live emergency hotline.',
    when: [
      'A privileged or business-critical account shows suspicious sign-in or configuration activity.',
      'Business email compromise, malicious forwarding, payment-change fraud, or mailbox abuse is suspected.',
      'A website, cloud platform, or administrative account may have been altered without authorization.',
      'The organization needs help structuring containment, evidence preservation, recovery, and follow-up.'
    ],
    review: [
      'Available account, mailbox, identity, cloud, or website evidence within scope',
      'Known timeline, suspicious changes, alerts, sign-ins, forwarding, delegation, and privileged activity',
      'Containment decisions and dependencies that could destroy evidence or interrupt business operations',
      'Recovery paths, account control, third-party involvement, and follow-up monitoring needs',
      'Post-incident control gaps that contributed to impact or delayed response'
    ],
    method: [
      'Establish an initial factual timeline and confirm response authority.',
      'Prioritize safety, containment, business continuity, and evidence preservation.',
      'Coordinate actions with internal IT, external providers, legal, insurance, or other specialists where the engagement requires them.',
      'Document material actions, recovery steps, and lessons that should feed back into security controls.'
    ],
    deliverables: [
      'Initial triage and response priorities',
      'Containment and evidence-preservation guidance',
      'Recovery and hardening recommendations',
      'Incident timeline or response notes where in scope',
      'Post-incident recommendations'
    ],
    boundary: 'The website form is not a 24/7 emergency service. Availability, scope, response time, and specialist requirements are confirmed during intake. Do not submit passwords, keys, regulated records, or sensitive evidence through the public form.',
    sample: {
      area: 'Compromised mailbox',
      finding: 'Suspicious external forwarding and unfamiliar sign-in activity appear after a credential event.',
      consequence: 'Messages may have been exposed and the account could be used for further impersonation.',
      action: 'Preserve relevant evidence, regain account control, review sessions and recovery methods, investigate forwarding/delegation, and assess downstream impact before closing the incident.'
    }
  },
  {
    slug: 'incident-readiness-recovery',
    title: 'Incident Readiness & Recovery',
    short: 'Prepare roles, communications, evidence, backup ownership, and recovery decisions before an incident.',
    intro: 'A response plan is useful only if people know who can make decisions, how responders communicate, where evidence comes from, and how critical systems are restored. Blackpine reviews those practical dependencies before pressure exposes them.',
    when: [
      'The organization has a written incident plan that has not been exercised recently.',
      'Backup systems exist but restoration ownership and testing are unclear.',
      'Leadership, IT, vendors, legal, and communications responsibilities have not been mapped together.',
      'A recent security event exposed uncertainty about escalation or recovery.'
    ],
    review: [
      'Incident roles, authority, escalation, and contact paths',
      'Out-of-band communication options and third-party dependencies',
      'Backup ownership, restoration expectations, and recovery priorities',
      'Evidence sources, logging, retention, and basic preservation procedures',
      'Tabletop scenarios and decision points relevant to the organization'
    ],
    method: [
      'Identify critical services and likely incident scenarios.',
      'Map who decides, who responds, and who must be informed.',
      'Walk through containment, communications, evidence, and recovery decisions.',
      'Record gaps as operational actions with named owners rather than leaving them as abstract recommendations.'
    ],
    deliverables: [
      'Readiness findings',
      'Response-role and escalation recommendations',
      'Recovery and backup observations',
      'Tabletop or workflow notes where in scope',
      'Prioritized readiness action plan'
    ],
    boundary: 'Readiness work cannot guarantee a future incident will be contained quickly or recovered without loss. It is designed to reduce uncertainty and expose dependencies before an incident.',
    sample: {
      area: 'Recovery readiness',
      finding: 'Backups are reported as available, but no named owner can confirm the last successful restoration test for a critical system.',
      consequence: 'Backup existence may be mistaken for demonstrated recoverability.',
      action: 'Assign recovery ownership, define restoration objectives, and schedule documented restoration tests for critical services.'
    }
  },
  {
    slug: 'security-advisory',
    title: 'Security Advisory',
    short: 'Independent security guidance for priorities, vendors, policies, and operating decisions.',
    intro: 'Security decisions compete with cost, usability, delivery schedules, vendor constraints, and business priorities. Blackpine advisory engagements help leadership and technology teams make those trade-offs deliberately instead of collecting controls without a clear sequence.',
    when: [
      'Leadership needs an independent view of the next security priorities.',
      'A project or vendor decision creates security questions that do not fit a one-off technical assessment.',
      'Policies, access models, or security responsibilities need to be clarified.',
      'A previous assessment produced findings that now need sequencing and governance support.'
    ],
    review: [
      'Security roadmap and priority decisions',
      'Vendor and SaaS risk questions',
      'Policy and operating procedure gaps',
      'Identity, access, incident-readiness, and recovery decisions',
      'Remediation progress and risk acceptance decisions where in scope'
    ],
    method: [
      'Start with business decisions and constraints rather than a preselected control catalogue.',
      'Use evidence from existing systems, assessments, incidents, and stakeholder input.',
      'Separate urgent risk reduction from longer-term maturity work.',
      'Document decisions, owners, assumptions, and unresolved dependencies.'
    ],
    deliverables: [
      'Security roadmap or decision brief',
      'Priority recommendations',
      'Policy or process guidance where agreed',
      'Vendor/security decision support',
      'Follow-up notes and tracked actions where part of the engagement'
    ],
    boundary: 'Advisory scope is defined per engagement. Blackpine does not present advisory work as a substitute for legal, regulatory, insurance, or specialist engineering advice outside the agreed scope.',
    sample: {
      area: 'Security roadmap',
      finding: 'Multiple remediation projects are active, but ownership and dependency order are unclear.',
      consequence: 'Teams can spend effort on lower-impact work while high-value identity or recovery gaps remain unresolved.',
      action: 'Sequence remediation around critical identities, recoverability, external exposure, and clear accountable owners before lower-impact improvements.'
    }
  }
];

export const research = [
  {
    slug: 'preserve-evidence-after-suspicious-admin-login',
    title: 'Preserving Evidence After a Suspicious Administrator Login',
    type: 'Technical Guide',
    topic: 'Incident Response',
    date: '2026-10-22',
    updated: '2026-10-22',
    readTime: '8 min',
    dek: 'Containment matters, but so does preserving enough context to understand what the administrator identity did before access was reset.',
    sections: [
      { heading: 'Record the alert and current state first', paragraphs: ['Capture the time, affected account, source of the alert, relevant identifiers, and what responders can currently observe. Where safe and authorized, preserve security alerts, sign-in events, administrative changes, and other logs before retention limits or response actions remove context.'] },
      { heading: 'Look for actions, not just authentication', paragraphs: ['An administrator login is important because of what the identity can change. Review high-value actions that fall within scope: role changes, new accounts, recovery methods, mailbox rules, app consent, sharing changes, security-policy changes, API credentials, and deletion or disabling of security controls.'] },
      { heading: 'Coordinate containment', paragraphs: ['Response actions should balance account control, business continuity, and evidence preservation. For high-impact incidents, determine who needs to participate before making irreversible changes: internal IT, leadership, external providers, legal counsel, cyber insurance, or specialist responders.'] },
      { heading: 'Treat recovery as part of the incident', paragraphs: ['Changing a password is not the same as proving control has been restored. Review sessions, authentication methods, recovery paths, privileged roles, delegated access, tokens or keys in scope, and systems the identity could have changed. Continue monitoring after recovery.'] }
    ],
    sources: [
      ['NIST SP 800-61 Rev. 3 — Incident Response Recommendations', 'https://csrc.nist.gov/pubs/sp/800/61/r3/final'],
      ['Canadian Centre for Cyber Security — Developing your incident response plan', 'https://www.cyber.gc.ca/en/guidance/developing-your-incident-response-plan-itsap40003']
    ]
  },
  {
    slug: 'backup-availability-is-not-recovery-readiness',
    title: 'Backup Availability Is Not Recovery Readiness',
    type: 'Engineering Note',
    topic: 'Incident Readiness',
    date: '2026-10-22',
    updated: '2026-10-22',
    readTime: '6 min',
    dek: 'A backup can exist and still fail to answer the questions that matter during recovery: what is protected, who can restore it, and whether restoration has been tested.',
    sections: [
      { heading: 'Separate backup existence from demonstrated recovery', paragraphs: ['“We have backups” describes a control. It does not prove that the organization can restore a critical service within an acceptable time. Recovery readiness needs ownership, documented dependencies, restoration access, tested procedures, and evidence that restored systems are usable.'] },
      { heading: 'Ask operational questions', bullets: ['Which systems and data are covered?', 'Who owns restoration decisions?', 'Who has access to backup administration?', 'Can attackers or ordinary administrators alter the backup set?', 'When was a representative restoration last tested?', 'What dependencies must return before the restored service is useful?'], paragraphs: ['These questions reveal whether the backup process can survive the same incident that damaged production systems.'] },
      { heading: 'Build recovery testing into incident readiness', paragraphs: ['The Canadian Cyber Centre recommends a reliable backup process as part of incident preparation and recommends testing, verification, monitoring, and validation during recovery. Recovery exercises should produce actions and ownership rather than simply a pass/fail result.'] }
    ],
    sources: [
      ['Canadian Centre for Cyber Security — Developing your incident response plan', 'https://www.cyber.gc.ca/en/guidance/developing-your-incident-response-plan-itsap40003'],
      ['NIST — Ransomware Protection and Response publications', 'https://csrc.nist.gov/Projects/ransomware-protection-and-response/publications']
    ]
  },
  {
    slug: 'designing-account-recovery-for-privileged-accounts',
    title: 'Designing Account Recovery for Privileged Business Accounts',
    type: 'Technical Guide',
    topic: 'Identity & Email',
    date: '2026-10-22',
    updated: '2026-10-22',
    readTime: '7 min',
    dek: 'Strong MFA is valuable, but privileged identity design also depends on how an administrator account is recovered when ordinary access fails.',
    sections: [
      { heading: 'Recovery is part of authentication', paragraphs: ['An administrator protected by strong sign-in controls can still be exposed if password reset, help-desk verification, recovery email, phone, or break-glass procedures are weak. Treat every recovery path as another way to obtain privileged control.'] },
      { heading: 'Avoid circular dependencies', paragraphs: ['A recovery design fails if all recovery methods depend on the same account or platform that is unavailable. Critical identities need documented recovery paths that responders can access during an outage or compromise without weakening routine controls.'] },
      { heading: 'Make ownership explicit', paragraphs: ['Document who can authorize privileged recovery, how that identity is verified, where emergency credentials or procedures are controlled, and how use is logged and reviewed. Test the process before an incident forces the first real attempt.'] }
    ],
    sources: [
      ['NIST Digital Identity Guidelines', 'https://pages.nist.gov/800-63-4/'],
      ['CISA — Implementing Phishing-Resistant MFA', 'https://www.cisa.gov/resources-tools/resources/implementing-phishing-resistant-mfa']
    ]
  },
  {
    slug: 'business-email-compromise-first-actions',
    title: 'Business Email Compromise: First Actions for an Organization',
    type: 'Technical Guide',
    topic: 'Incident Response',
    date: '2026-10-22',
    updated: '2026-10-22',
    readTime: '8 min',
    dek: 'The first response should regain control, preserve evidence, check for persistence, and protect downstream business processes that trust email.',
    sections: [
      { heading: 'Treat the mailbox as part of a business workflow', paragraphs: ['Business email compromise can affect more than messages. Payment approvals, password resets, customer communications, document sharing, and internal trust may all depend on the affected identity. Identify the business processes that could have been influenced while access was uncertain.'] },
      { heading: 'Preserve and contain', paragraphs: ['Preserve relevant alerts, sign-in records, suspicious messages, forwarding rules, delegates, and known timestamps. Then regain account control using the organization’s authorized recovery process and review sessions, MFA methods, recovery details, inbox rules, external forwarding, and privileged access.'] },
      { heading: 'Verify high-risk transactions out of band', paragraphs: ['If the mailbox participates in payment, banking, payroll, vendor, legal, or sensitive client workflows, use a trusted communication channel that does not depend on the compromised mailbox to verify high-risk instructions and notify the appropriate internal or external parties.'] },
      { heading: 'Close persistence and process gaps', paragraphs: ['After containment, review why the event was possible and whether email alone was allowed to authorize high-impact changes. Technical hardening and operational verification controls often need to improve together.'] }
    ],
    sources: [
      ['Microsoft — Respond to a compromised email account in Microsoft 365', 'https://learn.microsoft.com/en-us/defender-office-365/responding-to-a-compromised-email-account'],
      ['Canadian Centre for Cyber Security — Developing your incident response plan', 'https://www.cyber.gc.ca/en/guidance/developing-your-incident-response-plan-itsap40003']
    ]
  },
  {
    slug: 'vendor-access-and-offboarding',
    title: 'Vendor Access and Offboarding: Where Access Persists',
    type: 'Engineering Note',
    topic: 'Cloud Security',
    date: '2026-10-22',
    updated: '2026-10-22',
    readTime: '6 min',
    dek: 'Vendor access tends to accumulate across identities, SaaS invitations, API integrations, shared documents, support accounts, and recovery paths.',
    sections: [
      { heading: 'Inventory relationships, not only accounts', paragraphs: ['A vendor may retain access through a named account, shared administrator identity, guest invitation, integration token, mailbox delegation, shared folder, support portal, or recovery contact. Offboarding needs to look across the relationship rather than disable one visible account.'] },
      { heading: 'Assign an internal owner', paragraphs: ['Every material external access relationship should have an internal business or technical owner who can explain why it exists, what data or systems it reaches, and when it should be reviewed. Access without an owner tends to persist by inertia.'] },
      { heading: 'Review after the commercial relationship changes', paragraphs: ['Contract completion, staff turnover at the vendor, project changes, and replacement of a service provider are all triggers to review access. Security offboarding should be part of the commercial closeout process, not an optional technical cleanup.'] }
    ],
    sources: [
      ['NIST Cybersecurity Framework 2.0 — Govern and supply-chain risk', 'https://www.nist.gov/cyberframework']
    ]
  }
];

export const trustPages = [
  {
    slug: 'security-practices',
    title: 'Security Practices',
    intro: 'Blackpine treats the corporate website, client intake, public documentation, and security products as different trust boundaries. This page describes public-facing principles without implying controls or certifications that have not been independently verified.',
    sections: [
      ['Website security', ['The public website is designed to minimize client-side dependencies and unnecessary third-party code.', 'Security headers, a restrictive Content Security Policy, HTTPS enforcement, and controlled deployment configuration are part of the production baseline.', 'Public forms are not intended for passwords, private keys, regulated records, or sensitive incident evidence.']],
      ['Scope and authorization', ['Security work is scoped and authorized before assessment or response activity begins.', 'Blackpine does not present unauthorized offensive activity as a service and does not treat a general website inquiry as permission to access systems.']],
      ['Claims and limitations', ['Blackpine avoids “unbreakable”, “military-grade”, or absolute-security claims.', 'No assessment or security control can guarantee prevention of every future incident. Deliverables and limitations are defined by the agreed engagement scope.']],
      ['Separation of systems', ['The corporate marketing site is separated from Blackpine Cipher, Verify, and Support surfaces.', 'Cipher and verification surfaces should not inherit advertising, marketing analytics, or unrelated third-party scripts from the corporate site.']]
    ]
  },
  {
    slug: 'data-handling',
    title: 'Client Data Handling',
    intro: 'Security work can involve sensitive operational information. Blackpine uses a minimum-necessary approach to public intake and establishes an appropriate exchange method before requesting sensitive engagement material.',
    sections: [
      ['Public intake', ['The public contact form should contain only the information needed to understand the inquiry and arrange next steps.', 'Do not submit passwords, MFA secrets, private keys, full log exports, regulated records, confidential client files, or sensitive incident evidence through the public form.']],
      ['Engagement-specific exchange', ['The appropriate transfer method depends on the sensitivity, size, retention needs, and scope of the engagement.', 'The method and authorized recipients should be agreed before sensitive material is exchanged.']],
      ['Access and minimization', ['Access should be limited to what the agreed work requires.', 'Evidence and account access should not be collected simply because it may be convenient later.']],
      ['Retention', ['Specific retention commitments must match the actual engagement agreement and operational process. Blackpine does not publish invented retention periods as marketing copy.']]
    ]
  },
  {
    slug: 'responsible-disclosure',
    title: 'Responsible Disclosure',
    intro: 'If you believe you have found a security issue in a Blackpine-owned public system, report it privately so the issue can be reviewed and addressed.',
    sections: [
      ['How to report', [`Email ${site.securityEmail} with the affected hostname or URL, a concise description of the issue, reproduction information that does not expose unrelated data, and a safe way to contact you.`]],
      ['Please avoid', ['Do not access or alter data that does not belong to you.', 'Do not intentionally degrade availability, perform denial-of-service testing, or use social engineering against staff or customers.', 'Do not publish sensitive details before Blackpine has had a reasonable opportunity to investigate and address the issue.']],
      ['Scope and authorization', ['A vulnerability report does not create authorization to expand testing into unrelated systems, accounts, customer data, third-party services, or physical/social attack paths.', 'If there is uncertainty about whether an action is safe, stop and ask before proceeding.']],
      ['Security.txt', ['Blackpine publishes a machine-readable security contact at /.well-known/security.txt.']]
    ]
  },
  {
    slug: 'website-security',
    title: 'Website Security',
    intro: 'The corporate website is intentionally kept simple: static HTML, minimal JavaScript, restrictive browser policy, and no advertising or marketing trackers.',
    sections: [
      ['Production baseline', ['Static HTML is generated at build time so critical content does not depend on browser-side rendering.', 'The deployment configuration enforces HTTPS and adds browser security headers.', 'A restrictive Content Security Policy allows only the resources the website actually needs.']],
      ['Dependencies', ['The production build pipeline intentionally has no runtime JavaScript framework and no third-party package dependencies.', 'Any future dependency must justify the security, privacy, maintenance, and performance cost it adds.']],
      ['Third parties', ['The production corporate site does not load third-party analytics, ad networks, tag managers, remote fonts, social widgets, or externally hosted imagery.', 'Brand artwork and social-preview assets are served from the Blackpine domain. External links are ordinary navigational links and do not load third-party code into the page.']],
      ['Reporting', [`Security issues can be reported to ${site.securityEmail}. See the Responsible Disclosure page for scope and reporting guidance.`]]
    ]
  }
];
