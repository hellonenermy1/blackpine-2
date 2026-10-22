# Blackpine V2 production release

This file records the final release boundary for the corporate site.

A release candidate must pass `npm run verify` and the GitHub Actions workflow on the exact commit being merged. The gate covers generated routes, canonical metadata, sitemap coverage, JSON-LD, security.txt, CSP, internal links, research references, contact-form markers, theme fallback, GitHub Pages safety, canonical redirects, cache policy, social-preview integrity, and production content constraints.

Production assets are self-hosted. Social-preview images are generated deterministically by the build and checked for valid PNG structure, 1200×630 dimensions, and page-family uniqueness.

The corporate site remains operationally separate from Cipher, Verify, and Support. The corporate site does not load advertising, marketing analytics, tag managers, remote fonts, or unrelated third-party JavaScript.

Changes to factual claims, legal text, public contact paths, security headers, disclosure policy, or cross-domain boundaries require review before release.
