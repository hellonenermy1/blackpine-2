# Blackpine Localization Standard

Status: Phase 1 foundation

This standard governs public-site localization for Blackpine Cybersecurity. It exists to prevent translation quality, security claims, legal meaning, accessibility, and routing from drifting as additional languages are published.

## 1. Supported locale registry

The localization architecture recognizes:

- `en-CA` — English (Canada), default and current source language for ordinary public-site content.
- `fr-CA` — Canadian French. In Phase 1, only the already approved French Terms and Privacy routes are published.
- `es` — professional international Spanish. Registered for future rollout; no Spanish content route is published in Phase 1.

A locale being registered does not mean content in that locale is approved or public.

## 2. Publication principle

Do not manufacture a localized route by placing untranslated English content under a locale prefix.

A localized route may be public only when its content has completed the review level appropriate to that content. If an equivalent page is not published, the language selector must say so rather than linking to a fake or partial translation.

The explicit URL a visitor opens takes precedence over a saved preference. Blackpine must not silently force visitors away from an intentionally opened language URL.

## 3. Translation quality

Translations must read as writing produced for a professional cybersecurity audience in the target language. Word-for-word substitution is not an acceptable quality bar.

The translator/reviewer may restructure a sentence to make it idiomatic, clear, and natural, but must preserve:

- factual meaning;
- degree of certainty;
- scope limitations;
- authorization requirements;
- contractual qualifiers;
- security limitations;
- evidence state;
- dates, numbers, identifiers, and technical references.

Avoid awkward English syntax carried into French or Spanish. Avoid generic machine-translation phrasing, inflated marketing language, and unnecessary anglicisms where an established target-language security term exists.

## 4. Claim-preservation rule

Translation must never strengthen a Blackpine claim.

Terms such as `can`, `may`, `where agreed`, `where in scope`, `when contracted`, `readiness`, `sample`, `illustrative`, `not independently verified`, `OPEN`, and similar qualifiers are material controls. A translation must preserve their practical effect.

A translation must not turn:

- assistance into a guarantee;
- readiness into certification;
- a sample into client history;
- a capability into 24/7 availability;
- a possible outcome into a promised outcome;
- internal evidence into independent assurance;
- a scoped activity into unrestricted authorization.

If natural wording would materially alter a claim boundary, stop publication and escalate for review.

## 5. Protected names and technical tokens

Do not translate or silently modify established identifiers unless an authoritative localized form exists and is specifically approved.

Protected examples include:

- Blackpine Cybersecurity Inc.;
- Blackpine and Blackpine Cipher;
- personal names;
- hostnames, URLs, and email addresses;
- hashes and cryptographic identifiers;
- CVE identifiers;
- protocol/acronym tokens such as DNS, MFA, SPF, DKIM, DMARC, TLS and API;
- formal standard/framework identifiers such as ISO/IEC, NIST, CMMC and SOC 2.

Brand names may remain in English while the surrounding explanation is localized.

## 6. Terminology control

Before broad French or Spanish publication, maintain an approved terminology set for recurring security concepts. Use one reviewed rendering consistently unless context genuinely requires another term.

Priority terminology includes incident response, digital forensics, penetration testing, threat intelligence, containment, recovery, privileged access, identity and access management, evidence preservation, finding, remediation, assurance, readiness, business email compromise, security operations, and governance/risk/compliance concepts.

Terminology consistency must not override natural grammar or context.

## 7. Content risk classes

Use the following minimum review levels.

### Ordinary editorial / marketing content

Translation plus native-quality editorial review.

### Technical content

Translation plus cybersecurity terminology/technical review.

### Service, Trust, assurance, availability, and security claims

Translation plus technical and claims-boundary review.

### Testimonials and attributed statements

Preserve attribution and meaning. If the original quotation was supplied in another language, identify the public version as a translation where needed rather than implying the speaker used the translated wording.

### Legal text

Do not machine-translate and publish as approved legal wording. Lawyer-controlled or translator/lawyer-approved source text must remain source-fidelity protected and must pass the same integrity controls as the current English/French legal documents.

## 8. Research and source handling

Translating a Blackpine research article does not translate the underlying external source.

Preserve source URLs, publication facts, dates, and evidence boundaries. Do not imply an English external reference is a French or Spanish publication. A translation may have its own translation-review date, but must not falsify the original research publication date.

## 9. UI and accessibility

Localization includes visible and non-visible user interface text:

- navigation and mega menus;
- mobile navigation;
- buttons and CTAs;
- search labels and empty/error states;
- form labels and validation text;
- breadcrumbs;
- footer text;
- preference controls;
- 404 states;
- skip links;
- screen-reader labels and `aria-label` text;
- dialog labels and status messages;
- metadata, titles, descriptions, and structured-data text where appropriate.

A page is not considered fully localized if its visible body is translated while its interactive/accessibility chrome silently falls back to English.

## 10. Routing and SEO

English remains on the existing root paths. French uses `/fr/` and Spanish uses `/es/`.

Locale prefixes are the routing distinction; do not translate URL slugs in the initial rollout.

Localized equivalents must have:

- a self-canonical URL;
- reciprocal `hreflang` links for published equivalents;
- `x-default` pointing to the English equivalent when English exists;
- a correct document language;
- a normal crawlable language-selector link where a counterpart is published.

Do not canonicalize an approved French or Spanish page back to English.

## 11. Preferences and privacy

Language and theme preferences are first-party display preferences.

The Phase 1 preference record must not contain a name, email address, random identifier, timestamp, location, fingerprint, or analytics identifier. The preference runtime must not transmit the saved preference to Blackpine or a third party.

Do not add advertising, analytics, profiling, or third-party consent technology under the guise of localization.

If future optional tracking is introduced, it requires a separate privacy/security/legal review and must not be silently enabled through the necessary language-preference mechanism.

## 12. Fallbacks

Never silently mix an unreviewed English body into a French or Spanish page and present the page as translated.

If a counterpart is unavailable:

- keep the current page in its current language;
- allow the user's preferred language to be remembered;
- explain that the current page is not yet published in that language;
- provide an existing reviewed counterpart only when one actually exists.

## 13. Translation lifecycle

Later phases should enforce a lifecycle equivalent to:

`DRAFT -> TRANSLATED -> TECHNICAL_REVIEWED -> LEGAL_REVIEWED (where applicable) -> APPROVED -> PUBLISHED -> STALE`

A source-content revision must be able to mark a translation stale. High-risk stale translations must block publication rather than silently diverging from the English source.

## 14. Release review

Before publishing a locale expansion, verify at minimum:

- no missing or placeholder strings;
- no fabricated localized routes;
- no accidental English fallback in content claimed as complete;
- claims remain no stronger than source;
- protected identifiers are intact;
- internal links stay within the selected locale where a counterpart exists;
- language selector maps equivalent pages correctly;
- canonical/hreflang are reciprocal and correct;
- localized search does not mix languages unintentionally;
- 320 px, tablet, desktop, keyboard and screen-reader interaction remain usable;
- existing CSP, privacy, performance and trust-boundary controls remain intact;
- lawyer-controlled text remains source-fidelity protected.

Passing technical tests is necessary but not sufficient to call an unreviewed translation approved.
