# Authority Evidence Register

## Purpose

Track credibility evidence separately from marketing language. An entry may be public only to the level supported by its evidence.

## Status values

- PUBLISHED — the referenced Blackpine-owned evidence exists publicly and can be inspected.
- VERIFIED EXTERNAL — an external authoritative record exists and has been checked.
- OPEN — desired credibility evidence does not yet meet the publication threshold.
- STALE — previously acceptable evidence needs re-checking.
- RETIRED — the claim must no longer be published.

## Current public evidence

| ID | Evidence | Status | Public basis |
|---|---|---|---|
| AUTH-METHODOLOGY | Assessment methodology | PUBLISHED | Public methodology describing authorization, evidence, analysis, risk reasoning, remediation and verification. |
| AUTH-SAMPLE-REPORT | Fictional sample assessment | PUBLISHED | Public synthetic report demonstrating structure and limitations; not client work. |
| AUTH-RESEARCH-LIBRARY | Research/technical guidance library | PUBLISHED | Public guides and engineering notes with article-level sources. |
| AUTH-ENGINEERING-EVIDENCE | Engineering evidence | PUBLISHED | Public engineering/build evidence for Blackpine-owned systems. |
| AUTH-PUBLIC-TOOLS | Public browser-based tools | PUBLISHED | Inspectable Blackpine-owned security utilities with stated limitations. |
| AUTH-CLIENT-EVIDENCE | Client testimonials and evidence snapshots | PUBLISHED | Client-derived material constrained by the Client Evidence Publication Standard. |

## Recognition ledger

| ID | Recognition type | Status | Publication threshold |
|---|---|---|---|
| REC-ORIGINAL-RESEARCH | Original measurement/dataset research portfolio | OPEN | At least one qualifying Blackpine study with documented method, dataset/experiment, dates, exclusions, limitations and reproducible analysis. |
| REC-CVE | CVE attribution | OPEN | Assigned CVE plus authoritative external record supporting attribution. |
| REC-VENDOR-ACK | Vendor acknowledgement / hall of fame | OPEN | Verifiable vendor-controlled acknowledgement naming Blackpine or the relevant researcher. |
| REC-MEDIA | Conference / podcast / media appearance | OPEN | Verifiable organizer or publisher record. |
| REC-BYLINE | External technical byline | OPEN | Verifiable external publisher page and author attribution. |
| REC-CASE-STUDY | Full client case study | OPEN | Client-approved evidence packet that passes the case-study release gate. |

## Rules

1. A planned activity is not evidence.
2. A submitted vulnerability report is not a CVE.
3. Vendor product usage is not a vendor acknowledgement or partnership.
4. A conference application is not an appearance.
5. A draft article is not an external byline.
6. A testimonial is not a full case study.
7. Blackpine-owned evidence can demonstrate inspectable work, but it does not independently verify itself.
8. External recognition must identify the relevant Blackpine entity or researcher and be re-checked before prominent publication.
9. Do not convert OPEN to PUBLISHED or VERIFIED EXTERNAL because the status would make marketing stronger.
