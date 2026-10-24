# Phase 1 — Trust Foundation Audit

Date: 2026-10-24

Scope: legal identity, public trust basics, leadership publication controls, legal pages, responsible disclosure, security contact, security.txt, and corporate/Cipher surface separation.

## Implemented in this phase

- Added a public Legal & Company Information page.
- Added a public Acceptable Use Policy.
- Strengthened the Responsible Disclosure Policy with explicit scope, allowed testing, prohibited testing, good-faith research expectations, disclosure process, and researcher-recognition boundaries.
- Preserved the existing confirmed About and Team routes and their project-verified company facts.
- Preserved the existing security contact at security@blackpinecybersecurity.com.
- Preserved the existing RFC 9116-style /.well-known/security.txt record and its canonical Policy link.
- Added sitewide footer links for company information, Privacy, Terms, Acceptable Use, and security.txt.
- Added the legal name Blackpine Cybersecurity Inc. to Organization structured data.
- Preserved the existing separation between the corporate site and Cipher, Verify, and Support surfaces.
- Added an automated Phase 1 trust-foundation check to the normal verification pipeline.

## Existing controls and confirmed facts retained

The repository's existing verification suite treats the following as confirmed project facts and requires them to remain public:

- Blackpine is a 26-person Canadian cybersecurity practice.
- Michael Calloway is CEO & Owner.
- Anthony Adinolfi is Principal Security Consultant & Founder.
- The existing named Team directory is part of the confirmed public company data.
- Privacy page exists.
- Website Terms page exists.
- Responsible Disclosure page existed before this phase and has been strengthened.
- /.well-known/security.txt exists with contact, canonical URL, policy URL, and expiry.
- Corporate contact and security-contact addresses are centralized.
- The corporate site documents that Cipher, Verify, and Support use separate surfaces.
- The corporate-site baseline excludes advertising and marketing trackers from the sensitive Blackpine surfaces described in the site documentation.

## Items intentionally NOT invented

The following are not considered complete until Blackpine supplies authoritative evidence and approves publication:

- Province/jurisdiction of incorporation.
- Corporate registration number.
- Registered-office address.
- Richer leadership evidence beyond the currently confirmed name/title directory: biographies, previous employers, years of experience, photographs, LinkedIn profiles, and certifications.
- PGP security-reporting key and fingerprint.
- Technology partnerships.
- Insurance claims or certificates.
- ISO/SOC certifications or audit claims.

## Phase 1 acceptance matrix

| Requirement | Status | Evidence / note |
|---|---|---|
| Correct legal name | PASS | Blackpine Cybersecurity Inc. is used on the Phase 1 company/legal surfaces and Organization structured data. |
| Canada-based status | PASS | Existing confirmed fact retained without inventing a province. |
| Official website/contact | PASS | blackpinecybersecurity.com and centralized contact addresses. |
| Leadership/team identity | PASS | Existing verified 26-person directory and confirmed leadership titles retained. |
| Rich leadership profiles | PARTIAL | Photos, bios, professional-history links, LinkedIn profiles, and certifications still require verified source material and approval. |
| Privacy Policy | PASS (technical) | Existing page retained; qualified legal review remains outside this code audit. |
| Website Terms | PASS (technical) | Existing page retained; qualified legal review remains outside this code audit. |
| Acceptable Use Policy | PASS (technical) | Added in this phase. |
| Responsible Disclosure Policy | PASS (technical) | Expanded in this phase with explicit research boundaries. |
| Cookie Policy | NOT REQUIRED CURRENTLY | Current public-site baseline states no ad network, marketing analytics, tag manager, or comparable tracking stack. Reassess if that changes. |
| security.txt | PASS | Existing canonical RFC 9116-style record retained. |
| Security contact | PASS | security@blackpinecybersecurity.com. |
| PGP security contact | OPEN / OPTIONAL | No approved public key was supplied; none was generated or invented. |
| Company registration details | OPEN | Awaiting authoritative corporate record. |
| Corporate/legal footer | PASS | Company information, Privacy, Terms, AUP, and security.txt are exposed sitewide. |
| Cipher separation | PASS | Existing separate Cipher/Verify/Support architecture preserved. |
| No fabricated credentials/certifications | PASS | No new credential, partnership, insurance, ISO, SOC, or audit claim was introduced. |

## Audit conclusion

Phase 1 is code-complete for the trust-foundation controls that can be implemented truthfully from the information currently available. It is not evidence-complete.

The material evidence gaps are authoritative corporate-registration details and richer leadership proof such as biographies, professional profiles, photographs, and certifications. A PGP reporting key is optional and remains open because no approved key material was supplied.

Legal-policy pages are implementation-ready public drafts, not a substitute for review by qualified Canadian legal counsel. No certification, audit, customer-logo, partnership, insurance, or regulatory claim has been added.
