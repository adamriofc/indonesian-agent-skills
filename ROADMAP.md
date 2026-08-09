# Roadmap

Status legend: `[x]` shipped · `[→]` in progress · `[ ]` planned.

## Shipped (`v1.0.0`)

- [x] 42 enterprise skills across 5 domain plugins (legal-id, tax-payroll-id, hr-id, ecommerce-id, content-lokal-id)
- [x] 8 deterministic calculation engines with hybrid execution (LLM extraction + Node.js math)
- [x] SSOT rulesets with temporal versioning (`engines/rules/pph21.json`, `bpjs.json`)
- [x] Cryptographic SHA-256 ruleset integrity with byte-level tamper detection
- [x] Golden corpus, matrix tests (425 PPh21 + 225 PHK), injection & adversarial security tests
- [x] CI matrix Node 18/20/22, full `npm test` green
- [x] Skill metadata: `risk_level` + `rule_type` on all 42 skills
- [x] Trust Envelope (confidence contract) on flagship engine-driven skills
- [x] Regulatory Update Pipeline, Granular Provenance Register, Community governance docs

## In Progress

- [→] Ruleset lifecycle promotion tooling (scripted `DRAFT → VERIFIED → RELEASED`)
- [→] Signed manifest anchoring (Git tag signing / attestation for integrity chain-of-custody)

## Planned

- [ ] **Compatibility verification levels** — per-platform tested status (verified / adapter / manual) documented in a living compatibility matrix
- [ ] **Benchmark suite** — head-to-head accuracy benchmark: generic LLM vs `indonesian-agent-skills` on 1,000+ statutory scenarios
- [ ] **Regional derivatives** — Malaysia, Singapore, Philippines statutory modules reusing the same ruleset architecture (preview: architecture is domain-agnostic)
- [ ] **Ruleset UI/diff tooling** — human-readable diff between effective windows and changelog automation from `REGULATORY_CHANGELOG.md`
- [ ] **Plugin registry sync automation** — one-command publish of skill updates to OpenWork Cloud
- [ ] **Indonesian tax year 2027 ruleset** — pre-release `DRAFT` rulesets published 90 days before gazette effective dates

## Non-Goals

- Replacing licensed tax/legal software. This is decision-support intelligence, not filing software.
- Non-Indonesian regulatory domains before the regional-derivatives milestone.
- Fabricated historical rates: rulesets only exist for windows we can prove.