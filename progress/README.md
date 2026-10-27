# Blackpine progress archive

This directory contains historical implementation notes, validation records, and production snapshots for the Blackpine corporate website. These files are useful for understanding why earlier decisions were made, but they are not the current source of truth for repository or deployment state.

## Source-of-truth order

1. Current GitHub `main` and the exact files at the commit being discussed.
2. Current GitHub Actions/check status for that commit.
3. Current Cloudflare Pages deployment/check for that exact commit.
4. Current governance and release-evidence records.
5. `progress/CURRENT-STATE.md` and dated closeout files as historical snapshots.
6. Older phase folders for implementation history only.

If a historical progress file disagrees with the current repository or deployment evidence, use the current evidence and update the relevant active documentation rather than silently treating the older snapshot as current.

## Before future website work

- Fetch the current `main` SHA and inspect changes made after the most recent dated snapshot.
- Re-read `README.md`, `DEPLOYMENT.md`, `CLAIMS.md`, `SECURITY.md`, and the relevant files under `governance/` before changing deployment, public claims, forms, privacy, or trust boundaries.
- Verify production behavior separately from source state. A green source build is not proof that the same behavior is live.
- Distinguish repository facts, deployment facts, and unverified operational claims.
- Start new work from current `main` unless a specific historical branch is intentionally being repaired.

## Historical phase records

The V4 phase folders and earlier credibility/localization records document how the present site evolved. They should not be reopened or treated as active release plans merely because they remain in the archive.

Historical records may contain commit SHAs, wording, measurements, or operational states that were accurate when written and later changed. Their value is provenance, not current-state authority.
