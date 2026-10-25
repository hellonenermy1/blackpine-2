# Blackpine new production audit — Phase 2 security, privacy and deployment hardening

Date: 2026-10-25
Branch: `audit/phase-2-security-hardening`
Parent audit commit: `89926f466f3f6c5a7bc567ade13dc497b97b5161`
Frozen production baseline: `f7522aef620b669eb04fe6696e32adfe67397422`

## Status

**IMPLEMENTED CANDIDATE — exact-head CI / preview evidence pending at this record revision.**

Phase 2 follows the agreed scope: secret/leak audit; browser storage; third-party/runtime requests; headers/CSP and cache policy; contact/failure safety; source-map/build leakage; real 404/redirect/canonical behavior; and security-evidence updates to the claims register.

No visual redesign, framework, analytics system, ad network, tag manager, remote font, third-party form processor, runtime package dependency, or cross-surface integration was added.

## Findings register

### P2-001 — MEDIUM — internal audit records were not excluded from the GitHub Pages safety surface

The Phase 1 audit introduced an `audit/` directory. `_config.yml` excluded existing internal directories such as `docs`, `governance`, `progress`, `scripts`, and `src`, but did not exclude `audit`.

Cloudflare production is generated from `dist/` and did not publish this directory. The risk was the separate noncanonical GitHub Pages repository surface: if the audit directory were merged without another control, internal audit records could become part of that Pages artifact.

**Fix:** add `audit` to the Jekyll exclusions, add other generated/internal directories for defense in depth, and update `check-pages-safety.mjs` so the exclusion is permanent.

Status: **FIXED IN PHASE 2 CANDIDATE.**

### P2-002 — LOW/MEDIUM — localized search indexes lacked explicit cache-policy parity

The build generates:

- `/search-index.json`
- `/fr/search-index.json`
- `/es/search-index.json`

The hosting policy explicitly applied `public, max-age=3600, must-revalidate` only to the root English index. French and Spanish indexes therefore fell back to host defaults rather than the intended explicit mutable-index policy.

**Fix:** add explicit French and Spanish search-index cache rules to both Cloudflare `_headers` and the Netlify portability/reference config; update `check-hosting.mjs` to require all three.

Cloudflare Pages documentation reviewed on 25 October 2026 confirms that `_headers` supports path rules, splats and placeholders, and that Pages otherwise commonly serves cacheable assets with `max-age=0, must-revalidate`; explicit rules therefore keep the intended policy deterministic.

Status: **FIXED IN PHASE 2 CANDIDATE.**

### P2-003 — MEDIUM preventive control — secret-file ignore policy was incomplete

The repository did not contain an exposed `.env` file or known token/private-key pattern in the reviewed baseline, but `.gitignore` did not prevent common local secret files such as `.env`, `.dev.vars`, or `.wrangler/` state from being added later.

**Fix:** add explicit ignore rules while retaining `.env.example` and `.dev.vars.example` as allowable non-secret examples. The permanent Phase 2 gate also rejects secret-style working-tree filenames and scans text sources for known private-key/token signatures.

Status: **FIXED IN PHASE 2 CANDIDATE.**

### P2-004 — MEDIUM documentation integrity — `AUDIT.md` still described a Netlify production form

The audit standard required “Netlify Form Detection” and a production form-submission delivery proof even though the canonical production architecture is Cloudflare Pages with a local mail composer and no website form processor.

**Fix:** replace those obsolete requirements with checks for the actual architecture: no network-capable form action, no dormant Netlify markers, native validation, fixed recipient, percent-encoded mail content, no deliberate inquiry persistence, direct-email/no-JS fallback, and no claim that website submission delivery exists.

Status: **FIXED IN PHASE 2 CANDIDATE.**

## Secret-scan result

Baseline review and the new permanent gate cover:

- private-key PEM markers;
- AWS access-key identifiers;
- GitHub token prefixes;
- Slack token prefixes;
- live payment-secret prefixes;
- Google API-key signatures;
- `.env` / `.dev.vars` / key-store style filenames.

Phase 1's existing line-review gate already scanned application/config code for hard-coded credential-like assignments and reported zero unresolved warnings on the frozen baseline.

Current Phase 2 finding: **no known committed secret or private key identified.**

This is evidence about the reviewed repository/build, not a claim that credentials cannot exist in external systems or historical locations outside the reviewed tree.

## Third-party/runtime-origin register

### Executable/subresource/runtime request surface

Current audited corporate-site baseline:

- scripts: first-party, content-addressed `/build/*` only;
- styles: first-party, content-addressed `/build/*` only;
- fonts: first-party only; no remote font service;
- images/media: first-party/self-hosted; inline `data:` images remain permitted by CSP where needed;
- browser `fetch()`: one reviewed same-origin search-index request;
- prefetch: same-origin and allowlisted only;
- website form transport: none; contact uses a fixed `mailto:` route initiated by the visitor;
- analytics/tag managers/ad networks/social tracking widgets: none in the current runtime baseline.

The new Phase 2 gate scans generated HTML/CSS for third-party subresource loads and fails if one appears.

### External navigational destinations

External ordinary links exist for legitimate navigation/references, including Blackpine's separate Cipher/Verify/Support surfaces, Google Business, and cited research/reference sources. They are links, not executable/subresource/runtime dependencies of the corporate page.

Adding an external navigation link does not authorize adding that origin to CSP `script-src`, `connect-src`, `font-src`, `img-src`, or other runtime dependency surfaces.

## Browser-storage register

Approved corporate-site persistence keys:

| Key | Storage | Purpose | Data class | Network transmission by preference runtime |
| --- | --- | --- | --- | --- |
| `blackpine.preferences.v1` | localStorage | preferred language + display theme | display preference | none |
| `blackpine-theme` | localStorage | legacy theme compatibility/migration | display preference | none |

Phase 2 gate boundary:

- no `sessionStorage`;
- no IndexedDB;
- no cookie write path;
- no Cookie Store API;
- no local/session storage use in the contact composer;
- no new `blackpine*` persistence key without an explicit gate update/review.

Inquiry/contact fields remain outside deliberate browser persistence.

## Header and cache policy

Current shared security-header policy remains intentionally restrictive and unchanged in Phase 2:

- HSTS: two years, include subdomains, no preload commitment;
- `X-Content-Type-Options: nosniff`;
- frame denial;
- `X-XSS-Protection: 0`;
- strict-origin referrer policy;
- restrictive Permissions Policy;
- CSP limited primarily to self, with no frames/objects/workers and no inline script attributes;
- COOP same-origin;
- CORP same-origin;
- cross-domain policy disabled.

No CSP source was loosened to make Phase 2 pass.

Cache boundaries after the Phase 2 candidate:

- fingerprinted `/build/*`: one-year immutable browser caching;
- EN/FR/ES search indexes: one-hour + must-revalidate;
- mutable favicon/manifest/assets/security.txt: existing short-lived policies preserved.

Cloudflare `_headers` remains production source of truth; `netlify.toml` remains portability/reference policy and is checked for parity.

## Contact / failure-safety result

Reviewed behavior:

- generated form has no `action` or `method`;
- no Netlify form markers/honeypot/form-name are present;
- compose control is a non-submitting button;
- required fields use native validation;
- recipient is fixed to `contact@blackpinecybersecurity.com`;
- user-controlled subject/body values are encoded before insertion into the `mailto:` URL;
- user message is bounded to 2,000 characters;
- no `fetch`, XHR, WebSocket, EventSource, or beacon is used to send inquiry data;
- no contact field is deliberately stored in browser persistence;
- no-JavaScript users are given the direct email route;
- the public site does not claim that typing or clicking compose delivers data to Blackpine.

No additional form backend was added because that would widen the trust, privacy, abuse and retention surface without an evidenced operating need.

## Routing / canonical / failure result

Current build retains:

- explicit canonical directory routes;
- real generated 404 pages rather than a catch-all homepage rewrite;
- legacy one-hop 301 migrations;
- no `/* -> /index.html 200` soft-404 rule;
- sitemap membership limited to indexable canonical routes.

The Phase 2 gate additionally rejects duplicate legacy-style generated `.html` route files other than the intentional generated `index.html` and `404.html` files.

## Production leakage report

Cloudflare production is generated from `dist/`, not the repository root.

The Phase 2 gate now rejects production output containing:

- source maps;
- Markdown, module-source, TOML, YAML or environment files;
- `src`, `scripts`, `docs`, `governance`, `progress`, `audit`, `node_modules`, browser-artifact, or Phase 4 artifact directories;
- package/build/internal policy files such as `package.json`, `_config.yml`, `build.mjs`, `netlify.toml`, `README.md`, `AUDIT.md`, `CLAIMS.md`, or `SECURITY.md`;
- duplicate legacy `.html` routes.

The GitHub Pages safety config is separately hardened so the noncanonical repository surface also excludes the new `audit/` records.

## Claims-register update

`CLAIMS.md` now distinguishes source/build evidence from production/live evidence. It records the narrow, auditable technical boundaries for browser persistence, contact transport, runtime network surface, third-party subresources, and production-output leakage while explicitly stating that observed public headers/CDN/DNS/TLS behavior still requires deployment/live evidence for the exact commit.

## New permanent release gate

`scripts/check-phase2-security-hardening.mjs` is wired into `npm run check`.

It blocks release regressions involving:

- common secret/local-environment files;
- known secret signatures in text sources;
- unexpected browser-storage mechanisms or keys;
- new unreviewed browser network APIs;
- expansion beyond the one reviewed same-origin `fetch()` path;
- contact storage/network transmission;
- mutable contact recipient or unencoded mail content;
- third-party generated subresources;
- source maps/internal production artifacts;
- duplicate `.html` routes;
- catch-all 200 soft-404 rewrites.

## Open / deferred items

- `main` branch protection remains disabled; this is the Phase 1 repository-governance issue and is not falsely marked fixed here.
- Safari/WebKit and real-device manual coverage remains an explicit release-evidence gap from Phase 1.
- This Phase 2 branch is not the canonical production deployment. Source/preview checks can validate the candidate, but final live header/cache/custom-domain claims belong to the later exact-deployment release gate.
- No HSTS `preload` token is added; preload has broader operational consequences and remains intentionally prohibited by the existing regression gate unless separately decided.

## Phase 2 candidate file changes

- `.gitignore`
- `_config.yml`
- `public/_headers`
- `netlify.toml`
- `scripts/check-hosting.mjs`
- `scripts/check-pages-safety.mjs`
- `scripts/check-phase2-security-hardening.mjs` (new)
- `package.json`
- `AUDIT.md`
- `CLAIMS.md`
- this Phase 2 audit record

Final PASS/FAIL must be based on the exact committed candidate and its CI/browser/external/preview evidence, not on this implementation note alone.
