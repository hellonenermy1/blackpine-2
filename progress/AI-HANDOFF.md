# AI / assistant handoff guardrails

Use this file when an assistant resumes Blackpine website work after context loss.

## Source of truth order

1. Current GitHub `main` and exact files at that commit.
2. Current GitHub Actions/check status for the commit being discussed.
3. Current Cloudflare Pages deployment/check for the exact commit.
4. `progress/CURRENT-STATE.md` as the latest durable handoff snapshot.
5. Historical phase records for implementation history only.
6. Model memory only as a pointer to what should be re-verified.

If these disagree, do not silently reconcile them. State the mismatch and verify the fresher source.

## Required behavior

- Do not say something is live merely because it exists in source.
- Do not say production is broken merely because a crawler/search index is stale.
- Do not infer Cloudflare settings that were not measured.
- Do not infer form delivery from HTML markup.
- Do not treat closed stacked phase PRs as missing work if their cumulative changes were merged later.
- Do not claim the Emergency Hotline is public/live while its registry state remains contract-dependent/non-public.
- Do not invent customer history, company history, authors, certifications, response times, SLAs, 24/7 coverage, or security guarantees.
- Do not claim field performance from source byte budgets.
- Do not claim a browser/device test that was not actually run.
- Before modifying code, inspect the current file rather than reconstructing it from memory.
- After production changes, update the current-state handoff with verified facts.

## Current project identity

This project is the corporate website for Blackpine Cybersecurity, a Canada-based cybersecurity firm. The corporate site is intentionally separate from Cipher, Verify, and Support. Preserve that separation unless the user explicitly approves an architectural change.
