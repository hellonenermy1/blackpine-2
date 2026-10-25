# Public Claim Evidence Standard

## Purpose

This standard governs material factual claims published by the Blackpine corporate website. It connects each claim to a defined evidence basis, an evidence status, an automated release gate where practical, and a public wording boundary.

The purpose is not to turn the website into an audit report. It is to stop repetition, source-code consistency, planned work, or internal documentation from being mistaken for stronger evidence than they actually provide.

## What belongs in the claim register

A claim belongs in `PUBLIC_CLAIM_REGISTER.json` when a reasonable customer, reviewer, regulator, partner, employee candidate, or security researcher could rely on it when deciding whether to trust, contact, buy from, assess, or make a security decision about Blackpine.

This includes material claims about:

- company identity, location, contact details, team size, and leadership;
- current hiring state;
- service availability, authorization, response, recovery, monitoring, and contractual commitments;
- website privacy, data handling, storage, network behavior, and third-party dependencies;
- separation of the corporate site, Cipher, Verify, and Support;
- testimonials, client evidence, outcomes, case studies, ratings, and reviews;
- certifications, attestations, audits, insurance, partnerships, CVEs, media, and other third-party recognition;
- research and framework references where the evidence basis affects how the work may be described.

Ordinary descriptive copy, navigation labels, design language, and non-material explanations do not need a separate claim record unless they imply one of the facts above.

## Evidence bases

The register uses the following evidence bases. More than one may apply to a claim.

### USER_DECLARED

A fact supplied and approved by Blackpine or its authorized owner. Examples include current team composition, leadership roles, operating intent, and hiring plans.

This is valid evidence for Blackpine to publish its own current facts, but it is **not independent verification**.

### SOURCE_BUILD_VERIFIED

A fact directly testable from the repository, generated site, build output, or browser behavior. Examples include loaded subresources, browser-storage keys, contact-form network behavior, published routes, and separation of site assets.

This supports claims about the inspected build. It does not by itself prove live DNS, CDN, TLS, server-side, organizational, or off-repository behavior.

### EXTERNAL_VERIFIED

A fact checked against a qualifying third-party source that clearly identifies Blackpine. The evidence record must include a verification date and, for time-sensitive facts, a review-by date.

A verified address or phone number does not automatically verify team size, ownership, certifications, insurance, partnerships, service quality, ratings, or other unrelated facts.

### CLIENT_SUPPLIED

Material supplied or approved for publication by a client or client contact, such as a testimonial. It may support only the wording and attribution actually approved. It does not independently prove inferred project details, quantified outcomes, or unrelated organization facts.

### BLACKPINE_PUBLIC_EVIDENCE

Inspectable Blackpine-owned evidence such as published methodology, sample material, research, tools, or engineering documentation. It can demonstrate that the published artifact exists and can be evaluated. It is not an independent endorsement of Blackpine.

### CONTRACT_DEPENDENT

A commitment that may be valid only when established in a signed agreement or specifically staffed operating model. Public wording must not silently broaden the contractual scope.

### OPEN_EVIDENCE

The evidence required for an affirmative public claim has not been supplied or independently verified. The affirmative claim must remain unpublished.

## Evidence statuses

- `CURRENT` — evidence is presently sufficient for the bounded claim.
- `CURRENT_WITH_REVIEW` — sufficient now, but time-sensitive and subject to a defined re-check.
- `INTERNAL_CURRENT` — currently approved Blackpine-supplied fact, not independently verified.
- `SOURCE_VERIFIED` — directly demonstrated by source/build/browser evidence.
- `CLIENT_APPROVED` — client-supplied/approved evidence supports the bounded publication.
- `OPEN` — required evidence is not yet sufficient for the affirmative claim.

## Publication statuses

- `APPROVED` — the registered wording is publishable within its stated boundary.
- `APPROVED_WITH_BOUNDARY` — publishable only with the qualifier/boundary in the record.
- `NOT_PUBLIC` — tracked specifically to prevent an unsupported affirmative public claim.
- `RETIRED` — no longer current and must not be presented as current.

## Claim-strength rules

1. **Consistency is not independent evidence.** Repeating a fact across source, generated pages, metadata, and JSON-LD proves consistency only.
2. **A plan is not an operating capability.** A planned role, portal, certification, audit, partnership, hotline, or control does not become current because a design exists.
3. **A policy is not operating evidence.** A documented control model is not proof that the control operated effectively over a period.
4. **A testimonial is not a case study.** Do not infer scope, findings, tools, remediation, timing, client size, project value, geography, or quantified results.
5. **Readiness is not assurance.** Framework mapping and internal readiness do not equal certification, attestation, audit opinion, or regulatory approval.
6. **A third-party profile verifies only what was checked.** A Google business listing can corroborate identity/address/phone without proving unrelated company claims.
7. **Build evidence has a deployment boundary.** Repository and browser tests may support client-side behavior; live infrastructure claims require live evidence where the distinction matters.
8. **Contractual commitments stay contractual.** Response windows, service hours, RTO/RPO, uptime, monitoring coverage, escalation, and similar commitments are public only when the public wording accurately reflects the actual operating/contractual model.
9. **Negative claims require care.** Prefer bounded wording such as “the inspected production build does not load…” over universal claims about every possible system or future configuration.
10. **Expiry matters.** Time-sensitive external evidence must be re-checked before it is represented as current after its review date.

## Register requirements

Each material claim record must include:

- stable claim ID;
- risk level;
- claim class;
- publication status;
- canonical approved wording;
- evidence basis;
- evidence status;
- source locations;
- evidence references;
- automated or manual verification gate;
- explicit wording boundary;
- review owner;
- verification/review dates where time-sensitive.

Public route locations are maintained in `PUBLIC_CLAIM_PUBLICATION_MAP.json`, keyed by the same stable claim ID. Every registered claim must have exactly one route-map entry, and every mapped route must be a published English route. A `not-public-boundary` entry means the route publishes the restriction or evidence status, not the unsupported affirmative claim.

Sensitive evidence, contracts, client records, insurance documents, personnel records, credentials, and internal control evidence must not be copied into the public repository merely to make a claim record look complete. The register should identify the evidence class and controlled source without exposing protected material.

## Change rule

A material claim must not be strengthened in public copy unless the same change updates its claim record and the relevant release gate. If evidence becomes stale, withdrawn, contradicted, or insufficient, the claim must be narrowed, marked open, or removed.

Translations must preserve the same claim strength and qualifiers as the approved English meaning. Translation must never strengthen a claim.
