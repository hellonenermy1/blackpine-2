# Blackpine progress — read this first

This directory is the durable handoff for the Blackpine corporate website.

## Before doing any future website work

1. Fetch the current `main` branch SHA from GitHub. Do not assume the SHA recorded in these files is still current.
2. Read `progress/CURRENT-STATE.md` completely.
3. If `main` has moved since the snapshot in `CURRENT-STATE.md`, inspect the commits/merged PRs after that snapshot before making claims or changing code.
4. Read the relevant phase folder (`v4-phase1` through `v4-phase4`) only for historical implementation detail. The root `CURRENT-STATE.md` takes precedence for the current production handoff.
5. Re-read `README.md`, `DEPLOYMENT.md`, `CLAIMS.md`, and `SECURITY.md` before changing deployment, public claims, forms, or trust boundaries.
6. Verify facts from the current repository and current deployment. Never substitute memory for repository state.

## Important status rule

The V4 phase PRs are historical implementation records now:

- PR #9 — Phase 1 — closed as superseded.
- PR #10 — Phase 2 — closed as superseded.
- PR #11 — Phase 3 — closed as superseded.
- PR #12 — cumulative V4 production release — merged.
- PR #13 — Cloudflare contact-intake production hotfix — merged.

Do not reopen old phase branches to continue normal development. New work should start from the current `main` branch unless there is a specific reason not to.

## Anti-hallucination rule

When discussing the website later, distinguish these three states explicitly:

- **Repository fact** — verified from the current GitHub tree/commit.
- **Deployment fact** — verified from the production deployment/check for the exact commit.
- **Unverified operational claim** — must not be presented as fact until evidence exists.

A green source build is not automatically proof of live production behavior.
