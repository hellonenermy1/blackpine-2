# Release Evidence Standard

## Purpose

This standard defines what Blackpine must prove before a website release is described as production-validated.

Repository checks, a successful deployment status, and a reachable website are different evidence classes. None substitutes for the others.

## Evidence classes

### SOURCE_BUILD

Evidence produced from the reviewed repository and deterministic build output.

Examples:

- syntax and structural checks;
- generated-route validation;
- claims and translation gates;
- dependency and secret scans;
- local rendered-browser checks;
- static security-header and redirect configuration.

This proves properties of the inspected source/build. It does not prove what the public origin currently serves.

### DEPLOYMENT_STATUS

Evidence from the hosting/deployment integration that a specific commit or build completed successfully.

A successful deployment status proves that the platform accepted and deployed a build. It does not by itself prove DNS, the canonical custom domain, redirects, headers, cache behavior, or that a visitor receives the intended release.

### LIVE_ORIGIN

Evidence collected by requesting the canonical public origin and related public hosts from outside the repository build process.

The live gate should verify, where applicable:

- TLS authorization and current certificate lifetime;
- HTTP/2 reachability;
- apex and `www` behavior;
- representative canonical routes;
- a real HTTP 404 for an unknown route;
- required legacy redirects;
- deployed CSP and security headers;
- `robots.txt`, sitemap and RFC 9116 `security.txt`;
- immutable fingerprinted asset caching;
- revalidating mutable-search-index caching;
- the published contact architecture;
- reachability/separation of Cipher, Verify and Support;
- exact generated HTML match to the release build after merge.

### BROWSER_ENGINE

Evidence from a real browser engine executing the rendered site.

Current automated coverage includes Chromium plus a Firefox render smoke. Browser automation is not equivalent to every browser/device combination.

### MANUAL_DEVICE

Evidence from a physical device or browser environment not represented by automated CI, especially Safari/WebKit and real mobile-device behavior where no equivalent runner is available.

This evidence must not be marked complete unless a real test was performed and recorded.

### GOVERNANCE

Repository controls that reduce accidental or unauthorized release risk, such as protected branches/rulesets, required checks, review requirements and controlled deployment permissions.

A documented recommendation is not an enabled repository control.

### HISTORICAL_PERFORMANCE

Comparable before/after performance evidence measured with the same tool, region, device/network profile and methodology.

Current lab measurements may be recorded without claiming a valid pre-V4 comparison when no same-method historical baseline exists.

## Release states

- `VERIFIED` — qualifying evidence was observed for the stated scope.
- `POST_MERGE_REQUIRED` — evidence can only be finalized against the merged production release.
- `DEFERRED_MANUAL` — a real manual/device action remains outstanding.
- `DEFERRED_GOVERNANCE` — a repository/hosting governance control remains outstanding.
- `UNAVAILABLE_HISTORICAL` — a historical comparison cannot be reconstructed honestly from current evidence.
- `OPEN` — evidence is missing and the item is not ready to pass.

## Rules

1. Source configuration is not live-origin evidence.
2. A green hosting badge is not canonical-domain proof.
3. A crawler/search-engine cache is not current-origin proof.
4. Chromium is not Safari/WebKit coverage.
5. Responsive emulation is not a physical-device pass.
6. Current lab performance is not a historical before/after comparison.
7. Branch protection is not enabled because a document recommends it.
8. Production validation must identify the exact release commit or immutable build evidence point.
9. Any live exact-build check must compare public output to the locally built release rather than relying only on page titles or marketing copy.
10. Deferred items remain visible in the final sign-off and are never silently converted to PASS.
