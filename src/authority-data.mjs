export const authorityReferenceVerifiedDate = '2026-10-24';

export const authorityReferences = [
  {
    id: 'REF-NIST-CSF',
    name: 'NIST Cybersecurity Framework',
    version: '2.0',
    publisher: 'National Institute of Standards and Technology',
    url: 'https://csrc.nist.gov/pubs/cswp/29/the-nist-cybersecurity-framework-csf-20/final',
    use: 'Cybersecurity risk governance, outcomes, profiles and risk-management context.'
  },
  {
    id: 'REF-CIS-CONTROLS',
    name: 'CIS Critical Security Controls',
    version: 'v8.1',
    publisher: 'Center for Internet Security',
    url: 'https://www.cisecurity.org/controls',
    use: 'Prioritized safeguards and practical control implementation context.'
  },
  {
    id: 'REF-OWASP-TOP10',
    name: 'OWASP Top 10',
    version: '2025',
    publisher: 'OWASP Foundation',
    url: 'https://owasp.org/projects/top-ten',
    use: 'Web-application risk awareness and common risk categories.'
  },
  {
    id: 'REF-OWASP-ASVS',
    name: 'OWASP Application Security Verification Standard',
    version: '5.0.0',
    publisher: 'OWASP Foundation',
    url: 'https://asvs.owasp.org/',
    use: 'Web-application security verification requirements and testing structure.'
  },
  {
    id: 'REF-MITRE-ATTACK',
    name: 'MITRE ATT&CK',
    version: 'v20.0',
    publisher: 'MITRE',
    url: 'https://attack.mitre.org/resources/versions/',
    use: 'Adversary behaviour, technique context and detection-oriented analysis.'
  }
];

export const authorityEvidence = [
  {
    id: 'AUTH-METHODOLOGY',
    label: 'Public assessment methodology',
    status: 'PUBLISHED',
    href: '/methodology/',
    basis: 'Public methodology covering authorization, evidence, risk reasoning, remediation and verification.'
  },
  {
    id: 'AUTH-SAMPLE-REPORT',
    label: 'Fictional sample security assessment',
    status: 'PUBLISHED',
    href: '/reports/sample-security-assessment/',
    basis: 'Inspectable demonstration of report structure; explicitly not represented as client work.'
  },
  {
    id: 'AUTH-RESEARCH-LIBRARY',
    label: 'Research and technical guidance library',
    status: 'PUBLISHED',
    href: '/research/',
    basis: 'Published technical guides and engineering notes with article-level source lists.'
  },
  {
    id: 'AUTH-ENGINEERING-EVIDENCE',
    label: 'Engineering evidence',
    status: 'PUBLISHED',
    href: '/labs/engineering-evidence/',
    basis: 'Inspectable engineering and build evidence for Blackpine-owned public systems.'
  },
  {
    id: 'AUTH-PUBLIC-TOOLS',
    label: 'Public browser-based security tools',
    status: 'PUBLISHED',
    href: '/tools/',
    basis: 'Public utilities whose purpose and limitations can be inspected directly.'
  },
  {
    id: 'AUTH-CLIENT-EVIDENCE',
    label: 'Client testimonials and bounded outcome snapshots',
    status: 'PUBLISHED',
    href: '/work/client-evidence/',
    basis: 'Client-derived evidence published only to the level supported by supplied testimonial material.'
  }
];

export const authorityRecognition = [
  {
    id: 'REC-ORIGINAL-RESEARCH',
    label: 'Original measurement or dataset research portfolio',
    status: 'OPEN',
    rule: 'Publish only after a Blackpine study documents its dataset or experiment, collection method, scope, dates, exclusions, limitations and reproducible analysis.'
  },
  {
    id: 'REC-CVE',
    label: 'CVE attribution',
    status: 'OPEN',
    rule: 'Publish only after a CVE identifier is assigned and an external authoritative record supports the attribution.'
  },
  {
    id: 'REC-VENDOR-ACK',
    label: 'Vendor acknowledgement or hall-of-fame recognition',
    status: 'OPEN',
    rule: 'Publish only when the vendor or another authoritative external record names Blackpine or the relevant researcher.'
  },
  {
    id: 'REC-MEDIA',
    label: 'Conference, podcast or media appearance',
    status: 'OPEN',
    rule: 'Publish only when an organizer or publisher provides a verifiable external record.'
  },
  {
    id: 'REC-BYLINE',
    label: 'External technical publication or byline',
    status: 'OPEN',
    rule: 'Publish only when the external publisher page and author attribution can be verified.'
  },
  {
    id: 'REC-CASE-STUDY',
    label: 'Full client case study',
    status: 'OPEN',
    rule: 'Publish only after the minimum client-approved evidence packet passes the case-study release gate.'
  }
];
