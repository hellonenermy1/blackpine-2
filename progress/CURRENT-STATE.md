# Blackpine Cybersecurity — current production handoff

Snapshot date: 2026-10-23 (Asia/Singapore)

This file is the current production handoff for the Blackpine corporate website. It is intentionally explicit so a future chat can re-anchor itself without relying on memory.

**Important:** commit/deployment identifiers below are a snapshot. Before future work, always fetch the current `main` branch and compare it with this record. Progress-only documentation commits may move `main` without changing the runtime site.

## Repository and production identity

- Repository: `hellonenermy1/blackpine-2`
- Canonical corporate site: `https://blackpinecybersecurity.com`
- Production host: **Cloudflare Pages**
- Corporate site is separate from:
  - `https://cipher.blackpinecybersecurity.com`
  - `https://verify.blackpinecybersecurity.com`
  - `https://support.blackpinecybersecurity.com`
- The corporate site must not silently merge runtime dependencies or trust boundaries with Cipher, Verify, or Support.

## V4 release lineage

Cumulative V4 release:
- PR #12: `Blackpine Cybersecurity V4 — production release`
- merged: yes
- merge commit: `87726b414db8d270633bc6941ac890a3068f603f`

Production contact hotfix:
- PR #13: `V4 production hotfix — Cloudflare contact intake`
- merged: yes
- final release/hotfix commit on `main` at this snapshot: `2838fe1248314dfc4cdd394c58d2b49734cc2aa9`
- commit is GitHub-verified/signed

Cloudflare deployment evidence for the hotfix commit:
- exact deployed commit: `2838fe1248314dfc4cdd394c58d2b49734cc2aa9`
- Cloudflare Pages deployment/check ID: `9538fd64-a8f5-429d-a17d-298c0b119305`
- Cloudflare reported: `Deployed successfully`
- preview URL reported by Cloudflare: `https://9538fd64.blackpine-cybersecurity.pages.dev`

GitHub Pages also built/deployed successfully, but it is a secondary repository surface, **not** the canonical Blackpine production host.

## Final verified CI state for the production hotfix

PR hotfix validation:
- workflow run `39933276928`
- `verify`: PASS
- `browser-audit`: PASS
- `external-links`: PASS

Post-merge `main` validation:
- workflow run `39954680419`
- `verify`: PASS
- `browser-audit`: PASS
- `external-links`: PASS
- no-runtime-dependency assertion: PASS

Cloudflare Pages deployment for the exact post-merge commit: PASS.

## Current site architecture

- Static Node-generated multi-page site.
- No React/Next/Vue/SPA rewrite.
- Zero runtime npm/framework dependencies.
- Core content renders as HTML; JavaScript is progressive enhancement.
- Runtime CSS/JS is content-addressed under `/build/` with SHA-256-derived filenames.
- Fingerprinted `/build/*` assets use long immutable caching.
- Mutable assets such as `search-index.json` remain short-lived/revalidated.
- No service worker.
- No unrelated third-party executable JavaScript.
- No remote fonts.
- No third-party analytics/tag manager/ad network on the corporate site.
- No externally hosted production imagery.
- Strict CSP/security headers are maintained through the static-host configuration.

At the final audited V4 release:
- 59 indexable routes.
- 62 generated/audited HTML routes total including noindex/error routes.

## Customer-facing service architecture

The primary customer paths are problem-first:

1. Blackpine Emergency Response
2. Blackpine Investigate
3. Blackpine Recover
4. Blackpine Protect
5. Blackpine Monitor
6. Blackpine Security Desk

Customers are not expected to diagnose whether they need IAM, DFIR, MDR, BEC response, etc. Blackpine routes the problem internally.

Commercial engagement models are separate:
- Blackpine On-Demand
- Blackpine Response Retainer
- Blackpine Managed Security

The capability registry records 31 user-declared offerings.

## Critical publication / claims boundary

`Cybersecurity Emergency Hotline` is recorded as a user-declared capability but is intentionally:
- `CONTRACT_DEPENDENT`
- `NOT_PUBLIC`

Do **not** publish it as a live hotline until Blackpine has evidence of:
- a monitored emergency contact channel;
- coverage hours/model;
- activation process;
- any actual response commitments.

Do not invent or imply:
- 24/7 coverage;
- guaranteed response;
- a response-time SLA;
- guaranteed recovery;
- guaranteed containment;
- guaranteed priority;
- real-time dark-web monitoring unless the operating source/process is actually confirmed;
- certifications/compliance outcomes that Blackpine does not actually provide;
- customer/client histories, statistics, reviews, case studies, or sector experience that are not evidenced.

## Contact intake — production behavior

This is important because the original V4 release exposed a real production-host mismatch.

Production is Cloudflare Pages. A plain Netlify form is **not** the production form backend.

The final hotfix therefore:
- removes Netlify form markers and fake server-form assumptions;
- keeps the problem-first inquiry form UI;
- validates fields locally using browser constraints;
- keeps inquiry text local in the visitor's browser;
- on submit, opens a prefilled email draft to `contact@blackpinecybersecurity.com`;
- Blackpine receives nothing until the visitor actually sends that email;
- introduces no Cloudflare Function, KV, D1, email-service binding, third-party form processor, analytics, or new data store;
- limits the free-text inquiry field to 2,000 characters so the generated `mailto:` URL remains bounded.

Do not later say “the website submits the form to Blackpine's server” unless a real backend is subsequently implemented and verified.

If a real website form backend is added later, explicitly document and test:
- production host/runtime;
- data destination;
- spam controls;
- retention;
- validation/size limits;
- customer privacy wording;
- safe test delivery;
- failure behavior;
- CSP/network changes;
- whether it is appropriate for incident data.

## Sensitive incident handling

The public corporate site is initial intake, not a secure evidence-transfer system.

Do not encourage users to submit through the public intake:
- passwords;
- private keys;
- regulated records;
- full log exports;
- confidential customer/client files;
- malware samples;
- sensitive incident evidence.

For potentially compromised communications, V4 supports alternate safe email/callback context in the inquiry flow.

Sensitive incident/contact text is not deliberately persisted to localStorage/sessionStorage by Blackpine's website code.

## Browser / layout audit evidence

Final release rendered-browser audit covered every indexed route plus key noindex/error routes.

Audited release results:
- 59 indexed routes.
- 62 total routes.
- 131 rendered reflow checks.
- maximum horizontal overflow: 0 px.
- missing visible H1s: 0.
- missing main landmarks: 0.
- browser warnings: 0.
- browser errors: 0.
- Chrome/Chromium interaction/focus/navigation checks: PASS.
- Firefox render smoke: PASS.
- skip-link behavior: PASS.
- Ctrl/Cmd+K search open/close + focus restoration: PASS.
- Search-button focus restoration: PASS.
- mobile menu/Escape focus restoration: PASS.
- problem-intent/contact routing: PASS.
- smart 404 behavior: PASS.

A hidden 52 px overflow on Research pages at 320 px was found during the audit after old overflow clipping was removed. The real cause was fixed by scoping the 290 px secondary Research hero column to desktop. Do not reintroduce generic `overflow-x: clip` on `main` to hide future layout defects.

The narrow-screen theme control was restored and confirmed to fit at 320 px.

## Performance guardrails

CI build-size budgets:
- CSS <= 64 KiB
- total runtime JS <= 64 KiB
- search index <= 256 KiB
- largest generated HTML <= 48 KiB

Representative final measurements were approximately:
- CSS: 37.9–38.0 KiB
- total runtime JS: about 34 KiB
- search index: about 154.5 KiB
- largest HTML: about 24.1 KiB

These are build-size/regression budgets, **not** claims about live Core Web Vitals.

Do not claim LCP/INP/CLS field performance without current field/lab evidence using a documented measurement method.

## Search and client-runtime details worth preserving

- Local search is same-origin and generated from public/indexable content.
- Search does not send queries to an external AI/search service.
- If loading `search-index.json` fails transiently, the cached rejected promise is cleared so a later attempt can retry.
- V4 contact routing has one controller; obsolete V3 contact-preselection logic was removed.
- Smart 404 suggestions are local and guard malformed percent-encoded URLs.
- The local preview server returns a clean 400 for malformed encoded paths instead of treating them as a 500 internal error.

## Content / credibility decisions worth preserving

- Public customer copy is version-neutral; do not reintroduce visible `Blackpine V3`, `V4 public tools`, or similar release labels into normal marketing copy.
- The About page must not claim an invented historical origin for the Blackpine name.
- Brand/design interpretation may be discussed as interpretation, not company-history fact.
- `Who We Work With` describes environments Blackpine can support; it is not a public client list and must not imply unverified sector-specific client history.
- Do not create fake case studies, fake customers, fake reviews, fake metrics, fake SLAs, fake certifications, or mass-generated SEO/location pages.
- Avoid generic AI/corporate phrases such as “world-class,” “industry-leading,” “cutting-edge,” “our team of experts,” “peace of mind,” “seamless,” “future-proof,” and similar filler.

## Accessibility decisions worth preserving

- Skip link and `main` landmark required.
- Avoid positive tabindex.
- Visible form controls require explicit labels.
- Sticky-header anchor/focus offset must remain.
- Focus restoration for dialogs/mobile navigation must remain correct.
- Do not hide the theme control merely because the screen is narrow.
- Do not hide layout bugs using global horizontal clipping.
- Forced-colors/reduced-motion support should remain intact.

## SEO / metadata decisions worth preserving

- Canonical URLs use the apex domain.
- Legal Privacy/Terms remain indexable.
- Sitemap covers only intended indexable routes.
- Do not invent sitemap `lastmod` freshness from build time.
- Organization structured data is intentionally narrow rather than duplicated everywhere.
- Research Article schema remains self-hosted/source-backed.
- Do not mass-produce low-value SEO pages.

## Security / trust boundaries worth preserving

Corporate:
- `https://blackpinecybersecurity.com`

Cipher:
- `https://cipher.blackpinecybersecurity.com`

Verify:
- `https://verify.blackpinecybersecurity.com`

Support:
- `https://support.blackpinecybersecurity.com`

Corporate runtime JavaScript should not silently execute against/call the Cipher, Verify, or Support origins.

Cipher-specific cryptographic claims must come from the current Cipher implementation/release evidence, not be invented by the corporate site.

## security.txt

The site publishes `/.well-known/security.txt` and CI checks its expiry lifecycle.

At final V4 validation it had approximately 180 days remaining. Re-check the actual `Expires` value before making a current statement; do not reuse “180 days” later without recalculating it.

## Hosting and deployment facts

Production deployment is through Cloudflare Pages' GitHub integration.

For a production release:
1. build from the exact intended `main` commit;
2. require GitHub `verify`, `browser-audit`, and `external-links` to pass;
3. verify the Cloudflare Pages check run reports successful deployment for that exact commit;
4. distinguish source/CI evidence from production evidence;
5. do not rely on a stale search-engine/web-crawler snapshot as proof of current production content.

At the time of V4 release, the general web-fetch/search crawler available during the audit was still returning an older cached snapshot of `blackpinecybersecurity.com`. Therefore the release was not falsely described as independently fetched from the fresh canonical origin through that crawler. Cloudflare's exact-commit deployment result was used as deployment evidence.

## Repository-process limitation

At this snapshot, GitHub reports `main` as **unprotected** and required status-check enforcement is off.

This does not invalidate the current release, but it is a future repository-security improvement. Do not claim branch protection is enabled unless GitHub is checked again and confirms it.

## Historical phase PR status

- PR #9: Phase 1 — closed as superseded; content incorporated into cumulative V4 release.
- PR #10: Phase 2 — closed as superseded; content incorporated into cumulative V4 release.
- PR #11: Phase 3 — closed as superseded; content incorporated into cumulative V4 release.
- PR #12: cumulative V4 production release — merged.
- PR #13: Cloudflare contact hotfix — merged.

Do not interpret the closed, unmerged stacked phase PRs as missing work. Their cumulative changes were merged through PR #12, followed by PR #13.

## How to resume this project in a future chat

Before answering questions like “remember the Blackpine website?”, “continue V4”, “fix the site”, or “what is deployed?” do this:

1. Fetch the current repository default branch and current `main` SHA.
2. Read this file and `progress/README.md`.
3. If `main` differs from the snapshot release lineage, inspect every merged change after the recorded snapshot.
4. Inspect the current `README.md`, `DEPLOYMENT.md`, `CLAIMS.md`, and relevant source/config before making architecture/deployment claims.
5. Check current GitHub workflow/check status for the commit being discussed.
6. For deployment claims, verify the current Cloudflare Pages check/deployment for the exact commit.
7. If external crawler content disagrees with GitHub/Cloudflare evidence, say it may be stale rather than silently choosing one.
8. Never use old phase branch state as if it were current production state.
9. Never infer a service capability, SLA, customer history, certification, monitoring coverage, or hotline from marketing wording alone.
10. After meaningful future production work, update this handoff with the newly verified facts.

## Short current-state summary

Blackpine V4 is a static, dependency-light, problem-first Canadian cybersecurity corporate site deployed through Cloudflare Pages. The release includes six customer problem routes, 31 recorded capabilities with publication controls, strict claim safeguards, local search, all-route browser/reflow auditing, hashed immutable assets, strong security headers, and separated Cipher/Verify/Support trust boundaries. The public inquiry UI currently composes a local email rather than pretending Cloudflare provides a Netlify form backend. The Emergency Hotline capability remains internal/non-public until its operating model is evidenced. Future work must begin by checking current `main`, not by trusting this snapshot or model memory blindly.
