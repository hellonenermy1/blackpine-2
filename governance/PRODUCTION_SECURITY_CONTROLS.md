# Production security controls and remaining account work

This record distinguishes implemented code from account settings. Nothing here establishes an unhackable site or an independent penetration-test pass.

## Implemented release boundaries

- Corporate content remains static, dependency-free at runtime and separate from Cipher/support.
- Contact remains a local email composer; tools remain local. No database, new public API, tracker or upload facility is added.
- Downloaded search indexes are bounded to 1 MiB and 500 records with a ten-second request deadline. A schema rejects noncanonical/external/script paths, wrong-locale records, oversized fields, malformed headings and duplicate paths before results are rendered.
- Final release processing adds SHA-384 Subresource Integrity to every generated script and stylesheet reference.
- Each page receives an additional hash-only script CSP in a meta element before all scripts. It restricts scripts to the exact bytes on that page, alongside the existing response CSP. The response header retains framing and other protections that meta policies cannot enforce.
- `release-manifest.json` records SHA-256 and byte length for every other final file, including host control files. It is generated after legal-page chrome processing, without changing legal main content.
- `npm run check:integrity` rejects modified, missing, extra and symbolic-link output. Use it on an unpacked retained artifact before recovery.
- Existing automated and browser checks remain required verification; browser attack fixtures separately test an approved script, a modified asset rejected by SRI and a new script rejected by CSP despite matching SRI.
- CI retains the exact verified `dist` artifact. It contains public release data only; review artifact permissions and retention before adding any private material to the build.

These controls do not stop an attacker with publishing privileges replacing HTML, CSP and the manifest together. SRI is a browser check, not a signature or an external source of trust. Retain approved artifacts and their source revision under independently protected access.

## Monitoring and restoration

The separate read-only monitoring workflow is scheduled every 15 minutes and can be run manually. GitHub scheduling can be delayed or disabled; this is not a detection-time SLA. It builds the default branch as its baseline and compares representative English, French and Spanish pages, search indexes and every built JS/CSS asset. It never accepts a remote manifest as its trust anchor. `node scripts/check-live-integrity.mjs --all` checks all manifest-listed public files except provider control files and localized 404 files, whose served behavior is covered by the existing live-production audit.

Configure GitHub Actions failure notifications and prove their delivery. A failed workflow is not evidence that someone received an alert. Deploy propagation or an intentionally older approved deployment can also produce a mismatch. Keep an approved external baseline if production intentionally differs from the default branch. A compromise of GitHub can affect both publishing and this monitor; independent monitoring remains an account/operations task.

Before restoring, revoke compromised sessions/tokens, correct unauthorized DNS and deployment settings and remove persistence. Download a known-good verified artifact, unpack into a clean directory, run `node scripts/verify-release.mjs /absolute/path/to/release`, publish that artifact through the authorized hosting recovery path, purge stale content where needed, and repeat live checks across languages, assets, redirects and 404 responses. No automatic rollback is wired to a public-content mismatch, to avoid an attacker or outage triggering destructive recovery.

## Verified repository state before this change

Read-only GitHub inspection on 20 November 2026 found `main` at `1dab532d8b8f601394507cb10b672010540cc972`. Active ruleset `Protect Main` (25943124) required a pull request and blocked force pushes, with no bypass actors, but its required-status-check list was empty. Required approvals were zero. Those account settings are not changed by committing a JSON file. `governance/main-ruleset.json` is the prepared update for the existing ruleset, using the observed GitHub Actions app ID 15368. After confirming the current state and authenticating with administration access, apply it with `gh api --method PUT repos/hellonenermy1/blackpine-2/rulesets/25943124 --input governance/main-ruleset.json` and read the ruleset back. This does not enroll MFA or enforce Cloudflare deployment gates.

The production Actions run for that revision passed its five-route exact-content comparison. Its subsequent live audit failed because a 404 response contained Cloudflare JavaScript Detection markers. Keep this check failing until the production response is corrected; do not weaken CSP or ignore the markers to obtain a pass.

## Account changes still requiring authenticated administration

1. In the existing GitHub ruleset, require the stable `verify`, `history-secret-audit` and `browser-audit` checks from the trusted GitHub Actions app; require the branch to be current and block deletion. Resolve conversations. Keep bypass permissions empty. Do not require post-merge live-production checks on a pull request where they do not run.
2. With a second trusted maintainer, require independent review and dismiss stale approvals. For a solo maintainer, record the absence of independent review rather than adding an impossible approval rule or a bypass.
3. Audit all publishing routes: Cloudflare Git integration, dashboard/manual deploys, tokens and deploy hooks. Restrict production to the intended branch and require its checks before publication using provider-supported controls. GitHub merge checks alone do not prove that a hosting integration waits for them; test the boundary.
4. Sign into Cloudflare and verify the 404 script-injection setting, static response headers and edge behavior. Existing public `_headers` rules do not prove headers survive every provider error/404 path. Make a narrow hostname-scoped correction; preserve any unrelated domain protection.
5. Verify MFA/passkeys/security keys, backup authenticators, recovery email/codes, active sessions and authorized apps on GitHub, Cloudflare, the registrar and recovery mailbox. The owner must enroll or change authentication credentials.
6. Verify registrar transfer protection, renewals, DNSSEC/DS continuity, DNS record ownership, certificate issuance alerts and absence of dangling subdomains. Do not blindly toggle DNSSEC or preload HSTS.
7. Verify account audit/alert delivery, external baseline retention and a clean hosting restoration drill. Record measured recovery/detection timing only after testing.

No account changes were performed through an unauthenticated browser. No Cloudflare API management tool was exposed in the current connection. Database, RLS, API abuse controls and uploads are not applicable to the current static corporate architecture; add and validate them only if those features are introduced.
