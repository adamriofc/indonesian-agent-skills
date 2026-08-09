# Regulatory Update Pipeline (`REGULATORY_PIPELINE.md`)

This document defines the exact, operational procedure for detecting, validating, encoding, and releasing regulatory changes into `indonesian-agent-skills`.

A rule is only promoted to `RELEASED` after it passes every stage below.

---

## 1. Detection (Cadence: Weekly, plus event triggers)

Official watch sources:

| Domain | Official Source | Symmetric Check |
|---|---|---|
| Income tax (PPh 21/23/26) | [pajak.go.id](https://www.pajak.go.id) / [jdih.kemenkeu.go.id](https://jdih.kemenkeu.go.id) | djpk.kemenkeu.go.id |
| BPJS Ketenagakerjaan | [bpjsketenagakerjaan.go.id](https://www.bpjsketenagakerjaan.go.id) / [faq-int.bpjsketenagakerjaan.go.id](https://faq-int.bpjsketenagakerjaan.go.id) | BPJS TK FAQ primary |
| BPJS Kesehatan | [bpjs-kesehatan.go.id](https://www.bpjs-kesehatan.go.id) | JDIH BPJS Kesehatan |
| Employment law (THR, PHK, PKWT) | [jdih.kemnaker.go.id](https://jdih.kemnaker.go.id) | Kemnaker official site |
| Personal data | [jdih.kominfo.go.id](https://jdih.kominfo.go.id) | DPR RI |
| Marketplace policies | Platform seller centers (Shopee, Tokopedia, TikTok Shop) | Seller app notifications |

**Event triggers** (in addition to the weekly sweep):
- New PP / PMK / Permenaker / Perpres published in any JDIH above
- Official SE (surat edaran) from BPJS TK updating wage caps
- Marketplace platform announcement email or seller-center banner
- Issue raised in this repository with label `regulatory-change`

---

## 2. Validation (Rule of Two Sources)

Every rule change **must** pass:

1. **Primary source** — exact gazette / official PDF (JDIH link or official portal URL), cited with `regulation`, `article`, and direct `url` in `engines/rules/*.json`.
2. **Symmetric source** — at least one independently maintained authoritative reference (official FAQ, DJP slide, Kemnaker circular), OR a second chain of custody document (e.g., `B/726/022025` PDF hosted by a third-party but traceable to the BPJS TK SE number).

A candidate that fails the Rule of Two Sources is held in `SUPERSEDED`-check status and **flagged `DRAFT`** — it is never `RELEASED`.

---

## 3. Encoding

1. Add a new ruleset entry (or amend an existing ruleset) in `engines/rules/<domain>.json` following the existing schema:

```json
{
  "rulesetId": "BPJS-2027",
  "rulesetVersion": "1.0.0",
  "effective_from": "2027-03-01",
  "effective_to": "Infinity",
  "lifecycle": { "status": "DRAFT", "verified_at": null, "verified_by": null, "review_interval_months": 12 }
}
```

2. Never mutate a released ruleset in place for an existing effective window — **append a new ruleset entry** with a distinct `rulesetId` and `effective_from` date.
3. Update `engines/rules/integrity.js` `RULESET_CHECKSUMS` **in the same commit** with the new SHA-256 of the changed JSON:
   ```bash
   sha256sum engines/rules/bpjs.json
   ```
4. Add golden corpus fixtures for the new effective window to `tests/golden/*.json`.
5. Recompute `npm test` over the full suite (all engines, all matrices, all security tests).

---

## 4. Release

```bash
git add -A
git commit -m "rules: (PPh21|BPJS|THR|PHK|PKWT|Marketplace) extend ruleset for <regulation>, update integrity hashes, extend golden corpus"
git push origin master
gh release delete v1.0.0 --yes
gh release create v1.0.0 --title "v1.0.0 — ..." --notes "..."
```

The tag is re-pointed only via `gh release create` after `gh release delete`; every release covers the full reproducible test suite.

---

## 5. Post-Release Verification (Checklist)

- [ ] `npm test` passes on Node 18, 20, 22 (GitHub Actions matrix confirmed green)
- [ ] `sha256sum` of each JSON equals `RULESET_CHECKSUMS` entry in `integrity.js`
- [ ] `PROVENANCE.md` Rule Lineage Register updated with new Rule ID row
- [ ] `REGULATORY_CHANGELOG.md` updated with new entry (date, regulation, scope, status)
- [ ] Release notes mention exact gazette numbers and effective dates
- [ ] OpenWork Cloud skills re-synced if skill body content changed

---

## 6. Versioning Discipline

- `rulesetVersion` increments monotonically for each published ruleset
- `lifecycle.status` transitions: `DRAFT → VERIFIED → RELEASED → SUPERSEDED → ARCHIVED`
- A ruleset is `SUPERSEDED` the moment a later `effective_from` ruleset exists; `ARCHIVED` when it has passed its `effective_to` with no pending obligations

---

## 7. Escalation

Any change that conflicts with the Rule of Two Sources, or whose effective date is unclear, is escalated to a maintainer review and the ruleset stays `DRAFT`. Speed is never a reason to ship an unverified rule.