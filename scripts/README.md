# Verification scripts

- `check.mjs` validates generated routes, metadata, JSON-LD, internal links, sitemap coverage, security.txt, CSP, redirect/cache policy, research filter wiring, social previews, and GitHub Pages exclusions.
- `check-production.mjs` validates production-specific content, form, theme, asset, and deployment assumptions.
- `check-pages-safety.mjs` prevents GitHub Pages from publishing the repository as a duplicate corporate site.
- `check-release-source.mjs` checks source-level release invariants before deployment.
- `check-external.mjs` verifies published research references separately so transient network failures do not weaken deterministic build checks.
