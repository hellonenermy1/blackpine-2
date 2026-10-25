# Blackpine new production audit — Phase 2 security, privacy and deployment hardening

Date: 2026-10-25
Branch: `audit/phase-2-security-hardening`
Parent audit commit: `89926f466f3f6c5a7bc567ade13dc497b97b5161`
Frozen production baseline: `f7522aef620b669eb04fe6696e32adfe67397422`

## Status

**SUPERSEDED BY FINAL CLOSEOUT.**

This file records the implementation-candidate stage of Phase 2. Final validation evidence and the authoritative phase result are recorded in:

`audit/phase-2-final-closeout-2026-10-25.md`

The implementation-candidate commit was `d7591043494b1524ff3a97816683c91fcfd3aca6` and passed exact-head GitHub `verify`, `external-links`, `browser-audit`, and Cloudflare Pages preview checks before the closeout record was added.

## Scope completed by the candidate

Phase 2 covered the agreed security/privacy/deployment scope without introducing a redesign, analytics system, ad network, tag manager, remote font, third-party form processor, runtime framework, or cross-surface dependency.

The candidate implemented and tested:

- secret/local-environment file guards;
- independent source/build secret-pattern scanning;
- explicit browser-storage allowlisting;
- explicit browser-network API boundaries;
- contact-composer no-persistence/no-website-transport checks;
- fixed recipient and percent-encoded mailto content checks;
- generated-output source-map/internal-file leakage checks;
- third-party subresource detection;
- GitHub Pages exclusion of `audit/` and other internal/generated directories;
- explicit EN/FR/ES search-index cache parity;
- no catch-all 200 soft-404 enforcement;
- correction of stale Netlify form requirements in `AUDIT.md`;
- source/build evidence boundaries added to `CLAIMS.md`.

## Candidate findings and disposition

### P2-001 — MEDIUM — internal audit records were not excluded from the GitHub Pages safety surface

Disposition: **FIXED.**

`audit/` and additional generated/internal directories were added to `_config.yml`, and `check-pages-safety.mjs` was updated to enforce the exclusions.

### P2-002 — LOW/MEDIUM — localized search indexes lacked explicit cache-policy parity

Disposition: **FIXED.**

`/search-index.json`, `/fr/search-index.json`, and `/es/search-index.json` now carry explicit `public, max-age=3600, must-revalidate` policy in both Cloudflare and Netlify/reference configuration, with regression checks.

### P2-003 — MEDIUM preventive control — secret-file ignore policy was incomplete

Disposition: **FIXED.**

`.env`, `.env.*`, `.dev.vars`, `.dev.vars.*`, `.wrangler/`, and generated Phase 4 artifacts are guarded while `.env.example` and `.dev.vars.example` remain allowed. The release gate also rejects common key-store/private-key filenames and known token signatures.

No known committed secret/private key was identified in the reviewed tree.

### P2-004 — MEDIUM documentation integrity — `AUDIT.md` still described a Netlify production form

Disposition: **FIXED.**

The audit standard now matches the actual Cloudflare/local-mail-composer architecture and tests the real implementation boundaries rather than a nonexistent Netlify form backend.

## Preserved security/privacy boundaries

- no third-party analytics;
- no ad network;
- no tag manager;
- no remote fonts;
- no third-party website form processor;
- no new runtime framework/package dependency;
- same-origin runtime/subresource policy;
- browser persistence limited to `blackpine.preferences.v1` and legacy `blackpine-theme`;
- no deliberate persistence of inquiry/contact fields;
- no website network transport for inquiry/contact field values;
- fixed Blackpine contact mailbox for the mail composer;
- real 404 architecture with no homepage-200 catch-all;
- corporate/Cipher/Verify/Support separation preserved.

## Deferred items

Phase 2 did not falsely close unrelated Phase 1/later-phase items:

- unprotected `main` / required-status enforcement off;
- Safari/WebKit and real-device evidence gap;
- runtime-JS and lawyer-HTML capacity constraints;
- existing 2 px 320 px company-information overflow;
- split theme/preferences maintainability work;
- first-visit preference-dialog UX and verbose privacy/customer copy;
- full per-claim definition/evidence/test/wording register.

See `audit/phase-2-final-closeout-2026-10-25.md` for exact CI, Cloudflare and browser-artifact evidence and the final Phase 2 result.
