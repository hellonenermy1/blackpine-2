# Blackpine future-work checklist

Use this checklist whenever resuming the corporate website after a gap.

## Re-anchor first

- [ ] Fetch current `main` SHA.
- [ ] Read `progress/README.md`.
- [ ] Read `progress/CURRENT-STATE.md`.
- [ ] Compare current `main` with the release lineage recorded there.
- [ ] Inspect merged commits/PRs after the snapshot before using old assumptions.
- [ ] Read current `README.md`, `DEPLOYMENT.md`, `CLAIMS.md`, and `SECURITY.md`.

## Before changing code

- [ ] Confirm production host/runtime rather than assuming it.
- [ ] Confirm whether the change touches corporate, Cipher, Verify, or Support boundaries.
- [ ] Confirm any public service/availability/SLA claim against real operating evidence.
- [ ] Keep customer-problem routing separate from specialist service terminology.
- [ ] Do not publish internal/non-public capability records automatically.
- [ ] Do not add third-party runtime code, analytics, fonts, forms, storage, or trackers without explicit justification and privacy/security review.
- [ ] Do not rewrite to a framework merely for fashion.
- [ ] Do not hide overflow/layout bugs with global clipping.

## Required release evidence

- [ ] `npm run verify` / GitHub `verify` passes.
- [ ] rendered `browser-audit` passes.
- [ ] `external-links` passes.
- [ ] no runtime dependency install is required unless the architecture was intentionally changed and reviewed.
- [ ] build-size budgets remain within current thresholds or an intentional change is documented.
- [ ] Cloudflare Pages reports successful deployment for the exact intended commit.
- [ ] Any new data-submission backend has an actual production delivery test.
- [ ] Any new operational claim has actual business/contract/process evidence.
- [ ] Update `progress/CURRENT-STATE.md` after meaningful production changes.

## Never claim without fresh evidence

- [ ] current `main` SHA
- [ ] current Cloudflare deployment ID
- [ ] current `security.txt` days remaining
- [ ] current Core Web Vitals
- [ ] branch protection status
- [ ] 24/7 availability
- [ ] response SLA / guaranteed response
- [ ] guaranteed recovery or containment
- [ ] hotline availability
- [ ] active MDR coverage hours
- [ ] certifications/compliance outcomes
- [ ] customers, case studies, reviews, sectors served historically, or performance statistics

When evidence is unavailable, say `not verified` rather than filling the gap from memory.
