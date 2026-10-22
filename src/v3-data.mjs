export const companyFacts = {
  owner: 'Michael Calloway',
  ownerTitle: 'CEO & Owner',
  teamSize: 26,
  country: 'Canada',
  disciplines: [
    'Practice Leadership & Advisory',
    'Technical Assessments & Defensive Engineering',
    'Incident Response & Triage',
    'Security Operations Center (SOC)',
    'Governance, Risk, & Compliance (GRC)'
  ]
};

export const team = [
  ['Michael Calloway', 'CEO & Owner', 'Executive Leadership'],
  ['Anthony Adinolfi', 'Principal Security Consultant & Founder', 'Practice Leadership & Advisory'],
  ['Michael Vance', 'Director of Advisory Services', 'Practice Leadership & Advisory'],
  ['Elena Rostova', 'Principal Risk Architect', 'Practice Leadership & Advisory'],
  ['David Cho', 'Lead Security Advisor', 'Practice Leadership & Advisory'],
  ['Sarah Lin', 'Senior Cloud Security Engineer', 'Technical Assessments & Defensive Engineering'],
  ['Jonas Kasun', 'Lead Penetration Tester', 'Technical Assessments & Defensive Engineering'],
  ['Aarav Mehta', 'Infrastructure Hardening Specialist', 'Technical Assessments & Defensive Engineering'],
  ['Chloe Jenkins', 'Identity & Access Management (IAM) Engineer', 'Technical Assessments & Defensive Engineering'],
  ['Liam Fletcher', 'Network Security Engineer', 'Technical Assessments & Defensive Engineering'],
  ['Ryan Miller', 'Junior Vulnerability Assessor', 'Technical Assessments & Defensive Engineering'],
  ['Thomas McCarthy', 'Director of Incident Response', 'Incident Response & Triage'],
  ['Priya Nair', 'Senior Incident Triage Lead', 'Incident Response & Triage'],
  ['Samuel Adebayo', 'Digital Forensics Analyst', 'Incident Response & Triage'],
  ['Arthur Pendelton', 'Email Compromise Mitigation Specialist', 'Incident Response & Triage'],
  ['Jessica Taylor', 'Incident Support Coordinator', 'Incident Response & Triage'],
  ['Marcus Thorne', 'SOC Operations Manager', 'Security Operations Center (SOC)'],
  ['Daniel Kim', 'Senior Threat Analyst', 'Security Operations Center (SOC)'],
  ['Amara Okafor', 'SOC Analyst (Tier II)', 'Security Operations Center (SOC)'],
  ['Carlos Mendez', 'SOC Analyst (Tier II)', 'Security Operations Center (SOC)'],
  ['Rachel Green', 'SOC Analyst (Tier I)', 'Security Operations Center (SOC)'],
  ['Harmoni Shaw', 'Threat Intelligence Specialist', 'Security Operations Center (SOC)'],
  ['Elliot Wilkerson', 'Lead Compliance Architect (CMMC / NIST)', 'Governance, Risk, & Compliance (GRC)'],
  ['Janiyah Conner', 'Senior Framework Auditor', 'Governance, Risk, & Compliance (GRC)'],
  ['Phillip Lara', 'GRC Analyst', 'Governance, Risk, & Compliance (GRC)'],
  ['Heidi Hoffman', 'Documentation & Policy Specialist', 'Governance, Risk, & Compliance (GRC)']
].map(([name, title, department]) => ({ name, title, department }));

export const plannedRoles = [
  ['Head of Sales / Business Development', 'Growth', 'Build qualified enterprise opportunities, partnerships, proposals, and a sales process that does not depend on technical staff doing all commercial work.'],
  ['Client Success / Account Manager', 'Client Operations', 'Own engagement communication, follow-up, scope changes, renewals, and the handoff from a technical result to the next client decision.'],
  ['Senior Penetration Tester / Red Team Lead', 'Offensive Security', 'Lead authorized web, internal, cloud, and adversary-simulation work with careful scoping, evidence handling, and remediation debriefs.'],
  ['Application Security Engineer', 'Engineering', 'Review applications, APIs, authentication, dependencies, software delivery controls, and security architecture.'],
  ['Cloud Security Architect', 'Cloud', 'Design and review identity, administrative access, tenant architecture, logging, and recovery across major cloud platforms.'],
  ['DFIR / Malware Analysis Specialist', 'Incident Response', 'Support forensic collection, endpoint and identity artefact analysis, incident timelines, persistence analysis, and malware-focused investigations.'],
  ['Security Automation / Platform Engineer', 'Engineering / Labs', 'Build internal assessment tooling, reporting pipelines, detection integrations, and reusable Blackpine Labs components.']
].map(([title, group, summary]) => ({ title, group, summary, status: 'Planned role' }));

export const specialistServices = [
  {
    slug: 'penetration-testing',
    title: 'Penetration Testing',
    short: 'Authorized testing of web, external, internal, and cloud attack paths with evidence and remediation context.',
    intro: 'Penetration testing is used when an organization needs to know whether a defined weakness or attack path can be demonstrated safely. Blackpine fixes the scope, authorization, test window, handling rules, and stop conditions before active testing begins.',
    when: ['A system is approaching launch or material change.', 'An earlier assessment identified exposure that needs controlled validation.', 'A customer or internal assurance process requires authorized technical testing.', 'An organization needs a focused view of exploitable paths rather than configuration review alone.'],
    review: ['Public and authenticated application surfaces in scope', 'External services and administrative exposure', 'Internal trust paths where explicitly authorized', 'Cloud control paths and identity relationships in the agreed environment', 'Evidence needed to reproduce and remediate material findings'],
    method: ['Confirm written authorization, targets, exclusions, timing, and stop conditions.', 'Establish a low-risk discovery baseline before active testing.', 'Validate material attack paths with the minimum action needed to establish impact.', 'Record evidence, clean up test artefacts where required, and debrief remediation owners.'],
    deliverables: ['Executive summary', 'Reproducible technical findings', 'Evidence and affected assets', 'Risk and remediation sequence', 'Technical debrief and retest options where agreed'],
    boundary: 'Penetration testing is performed only against systems explicitly authorized in writing. Blackpine does not treat a general assessment or public website visit as permission for active exploitation.',
    sample: { area: 'Web application access control', finding: 'A lower-privileged test account can reach an administrative action outside its intended role.', consequence: 'A compromised ordinary account could perform a privileged operation.', action: 'Enforce server-side authorization for the affected action, review equivalent endpoints, and retest the role boundary.' }
  },
  {
    slug: 'application-security',
    title: 'Application Security',
    short: 'Review application architecture, APIs, authentication, authorization, dependencies, and software delivery controls.',
    intro: 'Application security work connects code and architecture to the identities, data flows, deployment paths, and operational decisions around them. Reviews can focus on a specific application, API, release, or design question.',
    when: ['A new application or API is approaching production.', 'Authentication or authorization is changing.', 'A product team needs security input during design rather than after release.', 'A customer-facing application has accumulated dependencies or privileged functions that need review.'],
    review: ['Authentication and account recovery', 'Authorization and role boundaries', 'API exposure and data handling', 'Dependencies and secret handling', 'CI/CD, deployment, and administrative access where in scope'],
    method: ['Map trust boundaries, identities, sensitive actions, and data flows.', 'Review the agreed architecture, configuration, and implementation evidence.', 'Validate higher-risk assumptions using authorized non-destructive or active techniques as scoped.', 'Translate findings into changes that product and engineering teams can verify.'],
    deliverables: ['Architecture and application findings', 'Authentication and authorization observations', 'API and dependency risks', 'Remediation notes for engineering teams', 'Follow-up verification where agreed'],
    boundary: 'Application security scope does not automatically include every dependency, production environment, source repository, or external service. Those boundaries are agreed before review work starts.',
    sample: { area: 'Account recovery', finding: 'A privileged role can be recovered through a weaker path than its normal sign-in control.', consequence: 'The recovery process can become the practical authentication boundary for the account.', action: 'Bring privileged recovery under equivalent identity verification, logging, and approval controls.' }
  },
  {
    slug: 'digital-forensics',
    title: 'Digital Forensics',
    short: 'Preserve and analyze available digital evidence to establish timelines, actions, and affected systems.',
    intro: 'Forensic work starts by protecting context. Blackpine helps identify which evidence can answer the incident question, how it should be preserved, and what conclusions the available artefacts actually support.',
    when: ['An incident requires a defensible sequence of events.', 'Endpoint, identity, email, or cloud artefacts need specialist review.', 'Responders need to distinguish confirmed actions from assumptions.', 'Evidence may be lost because of retention limits, device changes, or recovery work.'],
    review: ['Relevant endpoint artefacts where collection is authorized', 'Identity and sign-in records', 'Email and cloud audit evidence', 'Timestamps, administrative changes, and persistence indicators', 'Chain-of-custody or handling requirements defined for the engagement'],
    method: ['Define the incident question and evidence authority.', 'Preserve available artefacts before avoidable changes occur.', 'Analyze evidence against a documented timeline and hypotheses.', 'Separate confirmed facts, likely interpretations, and unresolved gaps.'],
    deliverables: ['Evidence inventory', 'Incident timeline', 'Technical observations and supporting artefacts', 'Known limitations and unanswered questions', 'Response and hardening recommendations where in scope'],
    boundary: 'Forensic conclusions depend on the evidence available and its integrity. Blackpine does not claim certainty where retention, collection, or scope leaves material gaps.',
    sample: { area: 'Identity timeline', finding: 'Administrative role changes occur shortly after an unfamiliar sign-in and before the account is recovered.', consequence: 'The incident may extend beyond the original credential event.', action: 'Preserve the relevant audit records, enumerate changed roles and sessions, and verify downstream administrative actions.' }
  },
  {
    slug: 'security-monitoring',
    title: 'Security Monitoring',
    short: 'Review logging, detection coverage, triage, escalation, and the operational path from signal to response.',
    intro: 'Monitoring is useful only when important events are visible and somebody knows what to do with them. Blackpine reviews the path from telemetry to detection, triage, escalation, and evidence preservation.',
    when: ['Alert volume is high but confidence or ownership is unclear.', 'Important cloud and identity systems have uneven logging coverage.', 'SOC or IT teams need a clearer escalation model.', 'A recent incident exposed gaps between detection and response.'],
    review: ['Log sources and retention relevant to agreed risks', 'Identity, cloud, endpoint, email, and public-system detection coverage', 'Alert triage and escalation ownership', 'High-value detection logic and false-positive pressure', 'Evidence preservation and handoff to incident response'],
    method: ['Identify the events that matter for the organization and systems in scope.', 'Map where those events are logged and who receives the resulting signal.', 'Review detection quality, triage steps, and escalation thresholds.', 'Prioritize visibility gaps that materially delay containment or investigation.'],
    deliverables: ['Monitoring coverage map', 'Detection and escalation findings', 'Logging and retention recommendations', 'Triage workflow improvements', 'Prioritized monitoring roadmap'],
    boundary: 'A monitoring review does not imply that Blackpine is providing continuous 24/7 managed detection unless that service is explicitly contracted and staffed for the engagement.',
    sample: { area: 'Privileged identity monitoring', finding: 'High-impact role changes are logged but are not routed to an owned alert workflow.', consequence: 'A material administrative change can be recorded without producing a timely response.', action: 'Create an owned detection and escalation path for privileged role changes and test it with known events.' }
  },
  {
    slug: 'compliance-readiness',
    title: 'Compliance Readiness',
    short: 'Technical gap and evidence readiness work for security frameworks without overstating certification or attestation.',
    intro: 'Framework work is most useful when it reveals what is implemented, what can be evidenced, and what still requires an owner. Blackpine can map agreed controls to the actual environment and help prepare remediation and evidence before a formal assessment.',
    when: ['A customer or contract introduces security control requirements.', 'A team is preparing for a framework assessment and needs a technical gap review.', 'Control owners need to know what evidence exists and what remains informal.', 'Security work needs to be sequenced against a defined control set.'],
    review: ['Control implementation and ownership', 'Technical evidence available for agreed controls', 'Policies and procedures that affect technical operation', 'Known exceptions and compensating controls', 'Remediation dependencies and evidence gaps'],
    method: ['Confirm the framework, version, scope, and assessment objective.', 'Map controls to systems, owners, and available evidence.', 'Separate implemented, partially implemented, unsupported, and not-applicable items.', 'Build a remediation and evidence plan for the gaps that matter.'],
    deliverables: ['Gap assessment', 'Evidence readiness map', 'Control ownership observations', 'Prioritized remediation plan', 'Preparation notes for the relevant formal assessment process'],
    boundary: 'Readiness work is not a certification, legal opinion, regulatory determination, or third-party attestation unless a separate qualified service explicitly provides that outcome.',
    sample: { area: 'Access control evidence', finding: 'The intended privileged-access process exists, but review evidence is inconsistent across systems.', consequence: 'A control may be difficult to demonstrate even where parts of it operate in practice.', action: 'Assign evidence ownership, standardize the review record, and close system-specific exceptions before assessment.' }
  }
];

export const navGroups = [
  {
    label: 'Capabilities', href: '/services/', columns: [
      ['Core', [['Security Assessments', '/services/security-assessments/'], ['Identity & Email Security', '/services/identity-email-security/'], ['Cloud & SaaS Security', '/services/cloud-saas-security/'], ['Incident Response', '/services/incident-response/'], ['Incident Readiness & Recovery', '/services/incident-readiness-recovery/'], ['Security Advisory', '/services/security-advisory/']]],
      ['Specialist', [['Penetration Testing', '/services/penetration-testing/'], ['Application Security', '/services/application-security/'], ['Digital Forensics', '/services/digital-forensics/'], ['Security Monitoring', '/services/security-monitoring/'], ['Compliance Readiness', '/services/compliance-readiness/'], ['Website & Administrative Security', '/services/website-administrative-security/']]]
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
