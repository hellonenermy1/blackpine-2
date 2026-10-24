# Blackpine Localization — Phase 1 Audit

Date: 2026-10-24

Status at creation of this record: **implementation complete; full pre-record candidate audit passed.**

This document records the multilingual/preferences foundation only. It does not claim that the corporate site is fully translated into French or Spanish.

## Scope delivered

Phase 1 adds the foundation required for the later language releases without fabricating untranslated localized pages.

Implemented:

- locale registry for `en-CA`, `fr-CA`, and `es`;
- locale-neutral translation keys for current routes;
- preservation of the already reviewed EN/FR legal pairings;
- no generated Spanish content routes;
- no generated French copies of English-only marketing/service/research pages;
- top-bar language selector;
- permanent footer `Privacy preferences` control;
- first-visit Language & Privacy Preferences dialog;
- browser-language suggestion for EN/FR/ES without IP geolocation;
- versioned first-party preference record `blackpine.preferences.v1`;
- language and theme preference persistence;
- compatibility/migration for the previous `blackpine-theme` setting;
- explicit current-URL precedence rather than silent forced language redirects;
- reviewed-equivalent navigation only when the corresponding route actually exists;
- unavailable-language state that can save a preference without pretending a translation exists;
- preference clearing;
- runtime-built dialog to avoid duplicating substantial preference markup into every HTML page;
- Website Security disclosure of the first-party preference behavior;
- repository localization/translation-quality standard;
- structural and rendered-browser localization regression gates.

## Privacy and runtime boundaries

The Phase 1 preference runtime:

- uses local browser storage only;
- stores only schema version, preferred locale, and display theme;
- creates no random preference identifier;
- stores no name or email address;
- stores no timestamp;
- performs no IP geolocation;
- performs no preference telemetry;
- uses no cookie API;
- uses no `fetch`, XMLHttpRequest, WebSocket, Beacon, IndexedDB, or third-party preference/consent service;
- does not add advertising, analytics, tag-manager, or social-tracking runtime code.

The existing lawyer-controlled EN/FR Terms and Privacy document source was not rewritten for Phase 1. Exact-source hash/fidelity checks continued to pass. Operational preference behavior is additionally disclosed on the public Website Security page.

## Language publication boundary

Phase 1 publishes no new translated content route.

Current non-English route state remains exactly:

- `/fr/legal/privacy/`
- `/fr/legal/terms/`

Spanish published content routes: **0**.

The locale being selectable as a preference is not represented as proof that the current page has been translated. On an English-only page, selecting French or Spanish saves the preference but leaves the current page unchanged and explains that a reviewed translation has not yet been published.

## Accessibility and progressive enhancement

- The top-bar language control uses text language labels rather than flags.
- Reviewed counterparts remain ordinary crawlable links and therefore work without JavaScript.
- Current language is a non-link current state.
- The preference UI uses a native dialog when supported and safe DOM construction rather than HTML-string injection.
- Existing keyboard/search/mobile-navigation/focus behaviour remains under the full browser audit.
- Browser storage failures are non-fatal.
- Corrupt preference JSON is ignored safely.
- Explicit language URLs remain usable regardless of saved preference.

## Security audit coverage

The preference runtime was added as a first-class fingerprinted production asset rather than exempted from existing controls.

Audit coverage now includes:

- seven content-addressed runtime build assets;
- six browser runtimes in the independent dangerous-sink scan, including `src/preferences.js`;
- six browser runtimes in the line-by-line browser-runtime review;
- preference-specific checks forbidding network/tracking primitives, random identifiers, timestamps, cookies, and dangerous HTML/eval sinks;
- exact EN/FR legal counterpart mapping;
- explicit assertion that no Spanish route is generated;
- exact assertion that Phase 1 French publication remains limited to the two already approved legal routes;
- generated language metadata and `hreflang` preservation;
- runtime interaction testing for first visit, persistence, clearing, unavailable locales, theme migration, corrupt storage, and EN<->FR legal navigation.

## Audit findings discovered and repaired during Phase 1

The implementation was not treated as complete after the first green-looking build.

### Finding 1 — runtime audit did not know about the new asset

The first candidate added a seventh fingerprinted runtime file but the existing Phase 3 runtime helper/allowlist still expected six. CI failed.

Resolution:

- `preferences.*.js` was added to the central runtime-asset loader;
- runtime file-count/name assertions were updated narrowly from six to seven;
- the existing total JavaScript budget remained unchanged;
- the preferences runtime now participates in the same security/runtime review as the existing browser code.

### Finding 2 — static dialog markup exceeded the French Privacy page budget

The initial implementation placed the full preference dialog markup in every generated page. This pushed the French Privacy page to approximately 64.9 KiB, above the existing dedicated 64 KiB legal-page ceiling.

Resolution:

- the budget was **not increased**;
- the full dialog is constructed safely by first-party JavaScript only when the page runtime initializes;
- lawyer legal HTML returned below its existing ceiling;
- dangerous dynamic-HTML sinks remain prohibited.

### Finding 3 — 320 px header overflow

The first rendered-browser pass found approximately 11–12 px horizontal overflow at 320 px across the site after adding the language control.

Resolution:

- no global clipping/overflow hiding was added;
- the Blackpine wordmark text is hidden only at <=360 px while the accessible branded home link and logo remain;
- Search, language, mobile navigation, and theme controls remain available;
- the all-route 320 px audit subsequently passed with no overflow failure.

### Finding 4 — audit completeness for the new browser runtime

The initial deep/line-review configurations still described five browser runtimes even after adding preferences.

Resolution:

- `src/preferences.js` is explicitly included in both independent browser-runtime security scans;
- browser runtime count is now six;
- local loopback URLs used by the new browser test are explicitly classified as reviewed test-harness traffic;
- the final structural candidate reported zero unresolved line-review warnings.

## Pre-record candidate evidence

Candidate branch head audited before adding this status record:

`8e7d0461a2bf6a60db83b0ec9dcafb0e47975568`

GitHub Actions run:

`40097566267`

Results:

- `verify` — PASS;
- `external-links` — PASS;
- `browser-audit` — PASS;
- existing all-route rendered Chrome audit — PASS;
- Firefox render smoke — PASS;
- new localization/preferences browser audit — PASS.

Browser audit explicitly reported:

- every indexed route plus key noindex/404 routes passed at desktop and 320 px;
- representative tablet reflow passed;
- existing search/navigation/contact/404/focus tests passed;
- first-visit preference prompt passed;
- preference persistence passed;
- unavailable-language handling passed;
- theme migration passed;
- clearing passed;
- reviewed EN<->FR legal navigation passed;
- language-selector current state passed;
- corrupt-storage recovery passed.

Structural measurements on the audited candidate:

- 87 indexable routes;
- 90 generated HTML pages including noindex/error output;
- 7 fingerprinted runtime assets;
- 6 browser runtimes independently sink-scanned;
- CSS: approximately 49.0 KiB / 64 KiB;
- total runtime JS: approximately 48.3 KiB / 64 KiB;
- search index: approximately 245.9 KiB / 256 KiB;
- largest ordinary HTML: approximately 31.4 KiB / 48 KiB;
- largest lawyer legal HTML: French Privacy at approximately 61.8 KiB / 64 KiB;
- line-review unresolved warnings: 0;
- no runtime dependency installation required.

The lawyer legal-document gate continued to verify exact EN/FR source hashes and all 150 ordered clauses in all four approved legal documents.

## Capacity / next-phase warning

The current single-language-oriented search index is approximately 245.9 KiB against a 256 KiB ceiling. Phase 2 must **not** simply append a full French corpus to the same index or raise the global ceiling as the default response.

The planned Phase 2 architecture should split search indexes by locale so English, French, and later Spanish search remain bounded and relevant.

## Intentional Phase 1 limitations

These are not hidden defects:

- the full corporate website is not yet French;
- the corporate website is not yet Spanish;
- French legal pages still retain English global site chrome until Phase 2 localizes shared UI;
- the preference dialog itself remains English in Phase 1;
- no Spanish legal document is claimed or generated;
- ordinary English-only pages do not redirect merely because a French/Spanish preference is saved;
- search remains the existing single public index until the Phase 2 locale split;
- Cipher, Verify, and Support are separate trust surfaces and are not made multilingual by this corporate-site work.

## Translation quality control carried forward

`governance/LOCALIZATION_STANDARD.md` is the binding implementation standard for the next phases. It requires natural target-language writing, technical terminology review, claim preservation, protected-token handling, legal approval gates, testimonial/source integrity, accessibility localization, and future stale-translation detection.

Passing a build does not make an unreviewed translation approved.

## Phase 1 verdict

The Phase 1 architecture and preference system has passed its pre-record structural, security, external-link, and rendered-browser audit with the identified defects repaired rather than waived.

Because this audit record itself changes the branch head, the final release head must be re-run through the same exact-head release suite before merge. A final green run after this document commit is the merge gate.
