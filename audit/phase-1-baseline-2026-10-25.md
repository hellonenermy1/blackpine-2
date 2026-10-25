# Blackpine new production audit — Phase 1 baseline

Date: 2026-10-25
Audit branch: `audit/phase-1-baseline`
Baseline branch: `main`
Baseline commit: `f7522aef620b669eb04fe6696e32adfe67397422`
Baseline tree: `a65e13cb8fc1969cf3ee519cd246c653c7e4bdce`

## Phase result

**PASS WITH OPEN ISSUES**

Phase 1 is documentation-only. No production source, customer copy, route, style, runtime, deployment configuration, claim, or generated asset has been changed in this phase.

The purpose of this record is to freeze the exact starting point for the new six-phase audit so later changes can be compared against a known, currently deployed commit.

## Source of truth

The live GitHub repository is the source of truth for the new audit:

- repository: `hellonenermy1/blackpine-2`
- default branch: `main`
- baseline SHA: `f7522aef620b669eb04fe6696e32adfe67397422`
- commit signature: GitHub reports the baseline merge commit as verified
- canonical production host: Cloudflare Pages / `https://blackpinecybersecurity.com`

An older user-supplied ZIP exists for historical comparison, but it predates the current multilingual V4 tree and must not be treated as the current implementation.

## Exact-head deployment and CI state

For baseline SHA `f7522aef620b669eb04fe6696e32adfe67397422`:

- `Verify Blackpine` workflow: success
- `verify` job: success
- `browser-audit` job: success
- `external-links` job: success
- GitHub Pages safety deployment: success
- Cloudflare Pages check: success
- Cloudflare result: `Deployed successfully`
- Cloudflare reported latest commit: `f7522ae`
- Cloudflare preview deployment ID: `1b4e4576-f811-4141-b09c-65621863a612`

This exact-head Cloudflare check is the strongest current deployment evidence available in Phase 1. A public web crawler inspected during Phase 1 returned an older cached site and is not accepted as evidence of the current production body.

## Build environment

Current package/build facts:

- package: `blackpine-cybersecurity-site`
- version: `4.0.0`
- package type: ESM
- declared Node support: `>=20`
- exact CI Node at baseline: `v22.23.3`
- exact CI npm at baseline: `10.9.9`
- build command: `node build.mjs && node scripts/compact-lawyer-legal-preferences.mjs`
- no runtime npm/framework dependencies declared
- CI explicitly verifies that `node_modules` is not required for the production build
- core content is statically generated HTML
- JavaScript is progressive enhancement rather than the core rendering mechanism

### Correction to an older audit assumption

The current `build.mjs` does **not** contain the older custom regex JavaScript minifier that was previously identified as a risk in a stale snapshot. Current runtime scripts are read, content-hashed, and written as fingerprinted build assets. That older minifier concern is therefore **not a current defect** and must not be carried forward into later phases unless a new transform is introduced.

## Current generated-site inventory

Exact baseline build output reports:

- 253 indexable canonical routes
- 9 noindex/error routes
- 262 generated HTML files total
- 85 indexable English search records
- 85 indexable French search records
- 83 indexable Spanish search records
- 7 content-addressed runtime assets

Localization inventory reports:

- 87 English source routes
- 87 French published routes
- 85 Spanish published routes
- 172 published translation approvals
- 0 blocking stale translations
- 0 standard-risk stale translations
- 0 non-published records in the current approved release set
- 2,927 unique rendered English-source strings in the browser inventory

Spanish lawyer-controlled Privacy and Terms remain deliberately unpublished because no approved Spanish lawyer source exists.

### Runtime asset classes

The build currently fingerprints these seven runtime asset classes:

1. combined site CSS
2. pre-paint theme initialization
3. main site runtime
4. preferences runtime
5. accessibility runtime
6. Phase 2 progressive-enhancement runtime
7. Phase 3 progressive-enhancement runtime

## Source/code inventory baseline

The current exact-head deep audit reports:

- 168 code/config files reviewed by the existing line-review gate
- 18,222 code/config lines reviewed
- 0 unresolved warnings from that existing gate

That existing gate is useful evidence, but it is **not** being treated as a substitute for the new audit. Later phases will independently inspect code quality, comments, failure paths, human readability, and claims that the current gate was not designed to judge.

High-level source families include:

- root build/config/release files
- `.github/workflows/`
- `src/pages/`
- `src/styles/`
- `src/i18n/`
- shared layout/components/data/capability registries
- `public/` source assets and progressive-enhancement scripts
- `scripts/` release, browser, security, localization, claim and regression gates
- legal-source material
- media library / self-hosted production media
- audit/governance/progress documentation

## Routing architecture

Current `src/routes.mjs` is the explicit route registry and the build writes canonical directory routes (`.../index.html`). The current tree does not use the old manually maintained `page.html` + `page/index.html` pattern as parallel source files.

The current build therefore has a single generated clean-route form per published route, with explicit legacy redirects for older `.html`/renamed paths.

Current route families include:

- home
- six problem-first capability families
- specialist services
- engagements
- methodology
- work/client evidence
- research
- advisories
- reports
- resources/guides/baseline/glossary
- Labs/Cipher overview
- local tools
- assessment
- incident guidance
- trust/governance/assurance
- company/team/careers
- contact
- search
- legal
- localized EN/FR/ES equivalents where approved

Unknown routes are generated as real localized 404 pages. The stale catch-all-homepage-200 problem from the older snapshot is no longer present in the current configuration.

## Runtime behavior inventory

Customer-visible progressive behavior currently includes:

- desktop and mobile primary navigation
- expandable navigation groups
- theme selection (`auto`, `dark`, `light`)
- pre-paint theme initialization
- language switching across EN-CA / FR-CA / ES where published
- language/privacy preferences dialog
- first-visit preferences prompt when no saved locale is present
- local, same-origin search with locale-specific indexes
- research filters with URL-state replacement
- contact intent routing
- local contact-email composition
- smart localized 404 suggestions
- accessibility/focus enhancements
- conservative same-origin prefetch behavior

No service worker is present.

## Browser storage inventory

Known first-party storage keys at baseline:

- `blackpine.preferences.v1`
  - schema version
  - preferred locale when valid
  - preferred display theme when valid
- legacy `blackpine-theme`
  - retained for compatibility/migration

The current contact/incident text is not deliberately persisted by Blackpine site code.

No unique preference identifier or timestamp is part of the current preference record.

## Contact/intake architecture

The canonical Cloudflare Pages site does **not** have a server-side website form backend.

Current contact flow:

1. visitor enters ordinary inquiry context locally;
2. browser constraint validation and Blackpine client logic validate the fields;
3. the site prepares a `mailto:` draft to `contact@blackpinecybersecurity.com`;
4. Blackpine receives none of the entered field contents unless the visitor actually sends the email from their email application.

The public intake explicitly warns against sending passwords, private keys, regulated records, full logs, confidential client files, malware samples, and sensitive incident evidence through ordinary email.

## Third-party/runtime-origin inventory

Current production policy is strongly first-party:

- `script-src 'self'`
- `style-src 'self'`
- `font-src 'self'`
- `connect-src 'self'`
- `media-src 'self'`
- no frames
- no workers
- self-hosted imagery
- no remote fonts
- no third-party analytics
- no ad network
- no tag manager
- no unrelated third-party executable JavaScript

Ordinary outbound navigation links exist where appropriate (for example Blackpine Cipher, the approved business listing, and research/source references). Those navigational links are not runtime execution/data dependencies.

The corporate runtime remains separate from Cipher, Verify, and Support.

## Security/deployment policy baseline

Current production headers include:

- HSTS: `max-age=63072000; includeSubDomains`
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 0`
- `Referrer-Policy: strict-origin-when-cross-origin`
- restrictive `Permissions-Policy`
- restrictive same-origin CSP
- `Cross-Origin-Opener-Policy: same-origin`
- `Cross-Origin-Resource-Policy: same-origin`
- `X-Permitted-Cross-Domain-Policies: none`

Fingerprinted `/build/*` assets use one-year immutable caching. Mutable search/assets use shorter revalidation policies. Cloudflare preview surfaces are configured noindex.

Cloudflare `public/_headers` is the production source. `netlify.toml` is retained as a portability/reference policy and is checked for parity where applicable.

## Performance/capacity baseline

Current exact-head measured build budgets:

| Area | Current | Gate | Headroom |
|---|---:|---:|---:|
| CSS | 49.0 KiB | 64.0 KiB | 15.0 KiB |
| Runtime JS | 63.6 KiB | 64.0 KiB | ~0.4 KiB |
| Largest locale search index | 239.4 KiB | 256.0 KiB | 16.6 KiB |
| Largest ordinary HTML | 38.2 KiB | 48.0 KiB | 9.8 KiB |
| Largest lawyer legal HTML | 63.9 KiB | 64.0 KiB | ~0.1 KiB |

These are build/regression budgets, not Core Web Vitals claims.

The runtime JavaScript and lawyer-controlled legal HTML ceilings are effectively full and must be treated as hard constraints before adding Phase 4 UX features.

## Existing browser-test baseline

Current CI browser evidence covers, among other things:

- all indexed routes at desktop and 320px
- key noindex/404 routes
- representative tablet reflow
- skip-link order
- search shortcut and focus restoration
- modal background isolation
- mobile navigation and Escape/focus return
- smart 404 behavior
- EN/FR/ES localization flows
- corrupted/blocked preference storage
- deep links and Back/Forward equivalents
- no-JavaScript progressive access
- keyboard focus trapping/restoration
- reduced motion
- Firefox render smoke

Important limitation: current automated evidence is strongest in Chromium, with Firefox described as a smoke pass. The repository's own audit standard still calls for Safari/WebKit and real mobile-device coverage when equivalent automation is unavailable. That evidence is not established by the baseline workflow and remains a later-phase requirement.

## Visual/component baseline

Primary reusable UI patterns currently include:

- hero/hero visual
- section headers and section labels
- primary/secondary buttons
- problem/service rows
- authority strip
- editorial image splits
- method/process list
- testimonial grid/quotes
- evidence/work preview blocks
- photo band
- team preview
- callouts/notices
- on-page navigation
- form fields and contextual contact guidance
- mega navigation
- language switcher
- preferences dialog
- local search dialog/results
- breadcrumbs
- footer/legal chrome

Current structural telemetry from CI:

- 4 `border-radius` declarations
- 0 gradient declarations
- 0 generic `.card` selectors

This is a useful anti-template baseline, but it does not by itself establish that each page looks human-designed.

## Copy/language baseline

The site currently has EN-CA, FR-CA and ES publication systems with source-hash drift controls. Current automated editorial gates report no translation gaps or catalog conflicts in the approved publication set.

The new audit will nevertheless review all customer-facing strings for natural professional language. Existing automated localization parity does not prove that a phrase feels human, concise, or appropriate for customer UI.

Phase 1 already identified customer-facing copy that deserves later humanisation review, including examples such as:

- `Evidence before case-study theatre.`
- homepage explanation of why Blackpine does not add logos, quantified outcomes, or independent-review scores
- repeated customer-facing explanations of publication/evidence controls
- contact-page explanations that the inquiry composer is `intentionally local`
- the preferences dialog's long paragraph explaining advertising networks, third-party analytics, tag managers, social tracking widgets, and preference identifiers
- `Manage language & privacy preferences` as a relatively heavy UI label

These examples are not being rewritten in Phase 1. They are recorded as later Phase 4/5 targets.

Exact repository searches during Phase 1 found no current default-branch matches for:

- `TODO`
- `ChatGPT`
- exact phrase `NOT where we live`
- exact phrase `public repository`
- `world-class`
- `seamless`
- `enterprise-grade`

Absence of those exact strings is not treated as proof that all generated/defensive wording is gone.

## Current claims-control baseline

`CLAIMS.md` already operates as a publication-control file and correctly restricts unsupported claims such as:

- certifications/attestations not actually held
- unapproved insurance claims
- unapproved client names/logos/case studies/outcomes
- unsupported partner status
- unsupported office/global-presence claims
- unproven public emergency-hotline availability
- unsupported 24/7 coverage
- unsupported response SLAs
- guaranteed containment/recovery/priority
- unsupported always-on monitoring
- unsupported real-time dark-web monitoring
- unsupported team/qualification claims
- untraceable Cipher release claims
- `unbreakable`
- vague `military-grade`
- `world-class`

For this new audit, `CLAIMS.md` is only the starting point. Phase 5 will expand it into the evidence model agreed for this audit:

**claim -> exact definition -> implementation/operating evidence -> test/verification evidence -> wording decision**

### Claim families requiring explicit evidence tracking

1. **Company identity/location**
   - Canada-based / Montréal, Québec identity
   - public business address/contact details

2. **Team/leadership**
   - current 26-person team presentation
   - named CEO/owner assertions
   - qualifications/biographies where published

3. **Client proof**
   - testimonials
   - client-evidence summaries
   - withheld identities
   - any stated outcomes

4. **Capability/delivery claims**
   - 31 declared capabilities
   - six customer problem families
   - three engagement models
   - actual operational availability vs publication state

5. **Corporate-site technical/privacy claims**
   - no third-party analytics/ads/tag manager/remote fonts/external imagery
   - static/dependency-free architecture
   - local contact composer
   - local preference storage only
   - separated corporate/Cipher/Verify/Support surfaces

6. **Cipher claims**
   - must be proven from current Cipher implementation/release evidence, not inferred from the corporate website

Code/config consistency is not accepted as independent proof of real-world team size, client history, operating coverage, certification, or service delivery.

## Phase 1 issue register

### P1-001 — `main` has no branch protection / required status enforcement

Severity: **MEDIUM**
Status: **OPEN**

GitHub currently reports:

- `main` protected: false
- protection enabled: false
- required status-check enforcement: off

Current release discipline is good, but repository policy does not technically prevent a future direct push or merge that bypasses the green checks.

Planned phase: repository/process hardening alongside Phase 2/3.

### P1-002 — `AUDIT.md` contains stale Netlify-form requirements

Severity: **MEDIUM**
Status: **OPEN**

The current architecture and `DEPLOYMENT.md` correctly state that Cloudflare Pages is canonical and contact is a local email composer with no website form processor.

However, `AUDIT.md` still contains checklist requirements stating:

- `Netlify Form Detection is enabled on production.`
- a safe production form submission proves delivery/handling.

Those requirements conflict with the current architecture and could cause a future maintainer to reintroduce a false form-backend assumption.

Planned phase: Phase 2 documentation/security-boundary correction.

### P1-003 — Safari/WebKit and real mobile-device proof is not present in current automated baseline

Severity: **MEDIUM**
Status: **OPEN / COVERAGE GAP**

Current CI provides strong Chromium coverage and Firefox smoke coverage. The repository audit standard itself says Safari/WebKit and real mobile-device behavior need a pass where automation cannot provide equivalent evidence.

Planned phase: Phase 6 release verification, with earlier fixes if browser-specific problems are found.

### P1-004 — runtime JavaScript budget is effectively exhausted

Severity: **MEDIUM**
Status: **OPEN / CAPACITY RISK**

Current JS: 63.6 KiB / 64.0 KiB.

The new UX plan contains potential enhancements. They must not simply be appended to the current runtime. Phase 3/4 should first deduplicate or remove code, prefer CSS/native browser behavior, and keep optional enhancements small.

### P1-005 — lawyer-controlled legal HTML budget is effectively exhausted

Severity: **LOW**
Status: **OPEN / CAPACITY RISK**

Largest lawyer legal HTML: 63.9 KiB / 64.0 KiB.

Shared preference/navigation chrome changes can exceed the gate even when legal `<main>` content remains unchanged. The current post-build compaction step exists because of this constraint.

### P1-006 — documented ~2 px 320px overflow on English company-information page

Severity: **LOW**
Status: **OPEN / REPRODUCTION REQUIRED**

The latest localization closeout records approximately 2 px horizontal overflow on `/legal/company-information/` at 320 px and treats it as within the existing tolerance.

The new audit should reproduce it and decide whether the tolerance is justified rather than automatically preserving it.

### P1-007 — theme/preference state is split across three runtimes plus a legacy key

Severity: **LOW**
Status: **OPEN / MAINTAINABILITY**

Theme state is currently handled across:

- `src/theme-init.js`
- `src/site.js`
- `src/preferences.js`
- `blackpine-theme` legacy storage
- `blackpine.preferences.v1` current storage

This is currently tested and working, but the duplication increases drift risk and should be reviewed in Phase 3 before adding new preference behavior.

### P1-008 — first-visit preference dialog is automatically opened

Severity: **LOW**
Status: **OPEN / UX REVIEW**

When no saved locale exists, the preferences runtime schedules the dialog to open on first visit (except normal local-preview behavior).

This is not a correctness defect. It is a deliberate UX choice that should be reconsidered against the new requirement for a quieter, more human preferences experience.

### P1-009 — preference/customer UI includes over-explanatory privacy/implementation commentary

Severity: **LOW**
Status: **OPEN / HUMANISATION**

Examples include detailed UI explanation of ad networks, analytics, tag managers, social tracking, preference identifiers, and local composer implementation details.

The facts should remain documented where needed, but not every implementation fact needs to be foregrounded in normal customer UI.

### P1-010 — homepage includes defensive evidence/publication commentary

Severity: **LOW**
Status: **OPEN / HUMANISATION**

Examples include:

- `Evidence before case-study theatre.`
- explaining in normal homepage copy that Blackpine does not add company logos, quantified outcomes, or independent-review scores unless supported
- explaining distinctions among testimonials, outcome evidence and fictional sample material at substantial length

These controls are valuable internally. Phase 5 should decide which belong in customer UI and which belong in Trust/methodology documentation.

### P1-011 — current claims register is policy-oriented, not yet a full evidence register

Severity: **LOW**
Status: **OPEN**

`CLAIMS.md` is useful but does not yet provide the complete per-claim definition/evidence/test/decision matrix required by the new audit. It is also headed as a 23 October V4 release baseline while the exact audit baseline is 25 October.

Phase 5 will upgrade the register without weakening its existing restrictions.

### P1-012 — Spanish fallback copy in `preferences.js` is not symmetrical with EN/FR

Severity: **LOW**
Status: **REVIEW CANDIDATE, NOT CONFIRMED DEFECT**

Normal Spanish pages receive localized status/theme strings from dialog data attributes and current browser tests pass. The hard-coded JS fallback helper, however, has explicit French and English branches rather than an explicit Spanish branch.

This is not currently proven to be user-visible. Phase 3 should either prove the fallback cannot be reached in Spanish with missing data attributes or make the fallback structurally locale-complete.

### P1-013 — current public web crawler is stale

Severity: **INFORMATIONAL**
Status: **ACCEPTED / TOOLING LIMITATION**

The public web-fetch tool returned a corporate site snapshot crawled about three months earlier, with routes/copy that predate current V4. It must not be used as current production-body evidence.

Exact-head GitHub source, exact-head CI, and Cloudflare's exact-head deployment check are the current baseline evidence. A later production-only phase still needs a fresh-origin/live-response method where available.

## Previously suspected issues that are NOT current baseline defects

The following concerns came from the older uploaded snapshot and were rechecked against current `main`:

- **old duplicate `page.html` + `page/index.html` source pattern:** no longer current architecture
- **old catch-all homepage HTTP 200:** no longer current architecture
- **old custom JavaScript minifier concern:** not present in current `build.mjs`
- **remote Google Fonts dependency:** not present in current production baseline
- **Netlify form backend assumption:** current runtime no longer uses it, although stale wording remains in `AUDIT.md`

These must not be carried into later phases as if they were still confirmed production bugs.

## Existing strengths to preserve

The new audit should avoid regressing these verified baseline qualities:

- static, framework-free core rendering
- dependency-free runtime/build architecture
- restrictive CSP
- content-addressed immutable runtime assets
- real 404 behavior
- exact sitemap/canonical checks
- self-hosted production imagery/fonts
- no third-party analytics/ads/tag manager
- no sensitive contact-field persistence
- locale-pure local search
- translation publication/drift controls
- legal-source hash/structure controls
- separate corporate/Cipher/Verify/Support trust surfaces
- progressive no-JavaScript access
- keyboard/focus/reduced-motion checks
- no generic `.card` design dependency
- no gradients in current visual telemetry
- claim gates preventing unsupported hotline/SLA/certification/recovery promises

## Phase 2 handoff priorities

Phase 2 should begin from this exact baseline and address security/privacy/deployment integrity in this order:

1. re-check current `main` before changing anything;
2. reconcile/fix stale audit/deployment documentation, especially Netlify form language;
3. perform independent secret/information-leak scan rather than relying only on the existing line-review gate;
4. inventory all storage, URL/referrer, clipboard and network data paths;
5. verify actual production headers/routing/cache behavior where a fresh-origin tool is available;
6. re-evaluate repository branch/ruleset enforcement;
7. verify contact failure/duplicate/unsafe-data behavior without adding a backend implicitly;
8. preserve the corporate/Cipher/Verify/Support trust boundary;
9. add issues found by Phase 2 to the same severity/disposition model;
10. do not begin broad copy/UI rewrites until the Phase 2 security boundary is frozen.

## Phase 1 closeout

Phase 1 has established an exact current source/deployment baseline and corrected several assumptions that came from the stale uploaded snapshot. Existing CI is unusually comprehensive and currently green, but the new audit has already found real coverage/documentation/maintainability/humanisation work that the existing gates do not treat as failures.

No production code was changed in Phase 1.