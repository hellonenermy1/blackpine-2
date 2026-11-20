# Blackpine credentials release — audit and closeout

**Date:** 20 November 2026  
**Scope:** Blackpine corporate website, private credential-verification rollout from PR #45, and follow-up content consistency review.  
**Baseline main commit:** `6443b6aecb634023ce964b492e9c3f6631d9882c` (merged PR #45)  
**Related changes:** PR #44 (client-work/registered-office disclosures), PR #43 (llms.txt V2).

## Release verification

- The complete PR #45 GitHub Actions "Verify Blackpine" workflow, run **44683792459** (run #722), finished with conclusion **success**.
- The **verify** job completed successfully, including static build, source and production structural checks, localization checks, privacy and claim-evidence controls.
- The **history-secret-audit**, **external-links** and **browser-audit** jobs finished successfully.
- The live-production-audit job was skipped on the PR run. It does **not** establish Cloudflare live delivery, URL response, DNS resolution, TLS status or real-time content.
- The merged `main` branch was independently inspected for source presence in `src/phase2-trust-data.mjs`, `src/pages/home.mjs`, `src/pages/phase5-enterprise.mjs`, `src/pages/company.mjs`, `src/pages/labs-trust.mjs`, `src/nav-v4.mjs`, `public/llms.txt`, and the public-claim evidence registers.

## Private credentials presentation

- The website names Blackpine's **company-declared** SOC 2 Type II, ISO/IEC 27001 and CREST holdings, and CISSP, OSCP, GCIH, GCFA, CISM and OSEP qualifications among team members.
- The exact fourth baseline program has **not** been identified in the supplied evidence. Cyber Essentials Plus and CyberSecure Canada are **not interchangeable**; neither should be displayed as an independently verified active credential without its source record.
- The public verification CTA uses `contact@blackpinecybersecurity.com` with subject **Confidential Credential Verification Request**.
- No certificate scans, auditor reports, issuer identifiers, named individual credential records, unreviewed audit periods or credentials' validity dates were added as public static website assets in this rollout.
- The source claim register records the owner's statements separately from independent issuer/auditor verification. `ASS-002` is company-declared; `ASS-001` remains evidence-open. Private distribution must follow confidentiality, authorization and applicable auditor/report restrictions.

## Source consistency corrections

- The Cipher product is no longer described in a way that could be read as a denial of the separately declared corporate credentials. Cipher does not prove corporate assurance and corporate assurance does not prove Cipher unbreakable.
- ISO/IEC 27001 and SOC 2 entries in the source assurance model now distinguish `COMPANY_DECLARED` from an independently reviewed evidence state of `OPEN`.
- No testing or publication gate was removed to accommodate the company declarations.

## Residual limitations and follow-ups

1. **Production verification remains outstanding.** Direct requests from the audit environment failed at DNS resolution. Web search results were cached historical versions, not current HTTP confirmation. A person with network access or Cloudflare Pages access must verify deployment of the final `main` commit and request `/trust/compliance/`, `/trust/enterprise-assurance/`, `/trust/assurance-requests/`, and `/llms.txt` to confirm HTTP 200 and final content.
2. **Credential evidence remains outstanding.** A website source audit is not a SOC 2 examination, ISO certificate validation, CREST accreditation lookup or verification of staff certification status. The company's supporting documents should be checked privately before representing validity, scope, opinion or dates as independently established.
3. **Fourth scheme unresolved.** Resolve whether Cyber Essentials Plus is held and current or whether the reference is to CyberSecure Canada or another program. Do not treat an expired program as active.
4. **No email delivery test was conducted.** The website contains a mailto route; whether the mailbox accepts and processes requests must be tested using an actual outbound message by an authorized operator.
5. **This closeout does not certify the wider site, Cipher application or operations as penetration-tested or breach-proof.** It documents tests that actually ran and their limits.

## Closure rule

The **source implementation and CI release** can be closed when the follow-up PR checks pass and it is merged. **Live production verification and source-document issuer checks remain explicit operational follow-ups**, not implied passes. Do not label them complete without direct evidence.
