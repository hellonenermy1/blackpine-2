export const phase2TrustPages = [
  {
    slug: 'privacy',
    title: 'Privacy & Information Handling',
    intro: 'A public summary of how Blackpine approaches privacy, minimization, and information handling. The legal Privacy Policy remains the controlling public privacy notice for the corporate website.',
    sections: [
      ['Privacy boundary', ['Blackpine separates ordinary website enquiries from sensitive engagement material. The public website is not intended to collect passwords, private keys, regulated records, full log exports, malware samples, or confidential client evidence.']],
      ['Minimization', ['Information should be collected only when it is needed for a defined business, security, legal, or engagement purpose. Sensitive material should not be requested merely because it may be useful later.']],
      ['Legal notice', ['The current website Privacy Policy is published at /legal/privacy/. Engagement-specific privacy and confidentiality obligations are governed by the applicable written agreement.']],
      ['Verification boundary', ['This page does not claim ISO/IEC 27701 certification, a privacy audit, or any other third-party privacy assurance unless that assurance is separately listed and independently verifiable.']]
    ]
  },
  {
    slug: 'compliance',
    title: 'Compliance & Assurance Status',
    intro: 'Blackpine distinguishes internal readiness work from independent certification, audit, or attestation. Only completed and verifiable assurance is represented as achieved.',
    sections: [
      ['Current public status', ['Blackpine does not use this page to imply an ISO certification, SOC report, regulatory approval, or other independent assurance that has not been completed and approved for disclosure.']],
      ['Readiness versus certification', ['Policies, control mappings, evidence collection, and remediation work can support readiness. They are not equivalent to certification or attestation by an independent qualified body.']],
      ['Future assurance', ['When independent certifications or reports are obtained, Blackpine will publish the relevant scope, issuing or auditing organization, status, and verification path where disclosure is permitted.']],
      ['Customer due diligence', ['Customers with a legitimate assurance requirement can contact Blackpine to request the information that is appropriate to disclose for their review.']]
    ]
  },
  {
    slug: 'subprocessors',
    title: 'Subprocessors & Service Providers',
    intro: 'Blackpine publishes service-provider information only where the relationship and processing purpose have been confirmed. The list is not padded with assumed vendors.',
    sections: [
      ['Corporate website delivery', ['The public corporate website is deployed through Cloudflare Pages. Cloudflare may process ordinary request metadata as part of delivering the site, as also described in the website Privacy Policy.']],
      ['Engagement systems', ['Security engagements can require different communication, storage, or specialist services depending on scope. Engagement-specific providers that process customer information should be identified through the applicable agreement or due-diligence process before sensitive data is exchanged.']],
      ['Change control', ['A provider should be added to the public register only after its role, data exposure, and disclosure status are confirmed. Blackpine does not infer subprocessors from marketing relationships or software names.']],
      ['Questions', ['Organizations performing supplier review can request clarification through the Blackpine contact route.']]
    ]
  },
  {
    slug: 'business-continuity',
    title: 'Business Continuity',
    intro: 'Blackpine continuity planning focuses on decision authority, communications, critical dependencies, recovery access, and evidence that important services can be restored.',
    sections: [
      ['Continuity objectives', ['Critical services should have identified owners, dependencies, recovery responsibilities, and alternate communication paths. A continuity plan should describe how decisions are made when ordinary systems or personnel are unavailable.']],
      ['Recovery testing', ['Backup existence is not treated as proof of recoverability. Representative restoration and continuity exercises should produce evidence, unresolved issues, owners, and follow-up actions.']],
      ['Supplier dependencies', ['Material hosting, identity, communications, and other service-provider dependencies should be considered in continuity planning rather than assumed to remain available.']],
      ['Commitment boundary', ['Blackpine does not publish invented recovery-time or recovery-point commitments. Contractual service levels and recovery objectives apply only when they are explicitly agreed and operationally supported.']]
    ]
  },
  {
    slug: 'incident-response-governance',
    title: 'Incident Response Governance',
    intro: 'Blackpine uses a documented response lifecycle as the governance baseline for security incidents affecting Blackpine systems or information.',
    sections: [
      ['Lifecycle', ['The baseline lifecycle covers detection, escalation, containment, investigation, evidence preservation, recovery, notification assessment, credential or key rotation where required, and post-incident review.']],
      ['Authority and records', ['Response actions should have an accountable owner and a record of material decisions. Evidence preservation and legal or contractual notification requirements should be considered before destructive actions are taken.']],
      ['Exercises', ['Tabletop and recovery exercises are used to identify unclear responsibilities, missing contacts, evidence gaps, and recovery dependencies before an actual incident exposes them.']],
      ['Availability boundary', ['Publishing an incident-response process does not mean the public website provides guaranteed 24/7 response. Contracted availability and response commitments must be stated in the applicable customer agreement.']]
    ]
  },
  {
    slug: 'data-retention',
    title: 'Data Retention & Deletion',
    intro: 'Retention should follow the purpose, sensitivity, legal obligations, and written engagement terms rather than a made-up universal number.',
    sections: [
      ['Public enquiries', ['Information actually received through ordinary business email is retained only as reasonably required for the enquiry, business records, security, legal obligations, or an established client relationship.']],
      ['Engagement information', ['Retention and deletion requirements for client evidence, reports, credentials, exports, screenshots, and other sensitive material should be defined for the engagement or governing agreement.']],
      ['Early deletion', ['Where contractually and legally permitted, a customer request for early deletion should be evaluated against the applicable engagement terms, security requirements, backups, and record-keeping obligations.']],
      ['Evidence boundary', ['Blackpine does not publish a fixed retention period unless the operational process actually enforces it and the commitment has been approved for public use.']]
    ]
  },
  {
    slug: 'security-contacts',
    title: 'Security & Company Contacts',
    intro: 'Centralized contact routes reduce ambiguity about where business, security, and careers enquiries should go.',
    sections: [
      ['General enquiries', ['General business enquiries use contact@blackpinecybersecurity.com. Sensitive client evidence should not be sent through ordinary email until an appropriate exchange method is agreed.']],
      ['Security reports', ['Suspected vulnerabilities in Blackpine-owned public systems should be reported to security@blackpinecybersecurity.com and should follow the Responsible Disclosure Policy and security.txt record.']],
      ['Careers', ['Careers enquiries use careers@blackpinecybersecurity.com. Planned roles are not represented as open positions until an application process is actually published.']],
      ['Sensitive communications', ['A PGP security-reporting key is not represented as available until an approved public key and fingerprint have been generated, controlled, and published.']]
    ]
  },
  {
    slug: 'assurance-requests',
    title: 'Security Reviews & Assurance Requests',
    intro: 'Blackpine provides due-diligence information according to the sensitivity of the material and the requester’s legitimate need for it.',
    sections: [
      ['Public information first', ['The Trust Center is intended to answer common questions about website security, data handling, disclosure, continuity, retention, assurance status, and security contacts without requiring a private questionnaire.']],
      ['Controlled information', ['Some material, such as customer-specific terms, detailed internal evidence, insurance certificates, or future independent audit reports, may require an appropriate business relationship, confidentiality terms, or controlled distribution.']],
      ['No placeholder evidence', ['Blackpine does not provide fabricated certificates, sample audit opinions presented as real, invented insurance documents, or unverified partnership claims to complete a vendor questionnaire.']],
      ['Request path', ['A legitimate security or vendor-review request can be started through the general Blackpine contact route.']]
    ]
  },
  {
    slug: 'security-faq',
    title: 'Security FAQ',
    intro: 'Short answers to common due-diligence questions, with links to the public evidence that supports them.',
    sections: [
      ['Does the corporate website use advertising or marketing trackers?', ['The current production baseline does not load third-party advertising networks, marketing analytics, tag managers, remote web fonts, or social widgets. See Website Security and the Privacy Policy.']],
      ['Can sensitive evidence be uploaded through the public contact page?', ['No. The public inquiry path is intended to establish context and an appropriate exchange method, not to receive credentials, private keys, regulated records, full log exports, malware samples, or confidential client evidence.']],
      ['Is Blackpine ISO or SOC certified?', ['Blackpine only represents an ISO certification or SOC report as achieved after the relevant independent process has been completed and the claim can be verified. The Compliance & Assurance Status page is the current public source for that status.']],
      ['How should a vulnerability be reported?', ['Use security@blackpinecybersecurity.com and follow the Responsible Disclosure Policy. A machine-readable contact is available at /.well-known/security.txt.']],
      ['Does Blackpine guarantee that an assessment finds every weakness?', ['No. Scope, evidence access, testing depth, and time constrain any assessment. Blackpine avoids absolute-security or guaranteed-security claims.']]
    ]
  }
];
