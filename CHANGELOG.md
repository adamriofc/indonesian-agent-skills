# Changelog

All notable changes to this project are documented here in reverse chronological order. Regulatory/statutory changes are additionally tracked per-rule in [REGULATORY_CHANGELOG.md](./REGULATORY_CHANGELOG.md); provenance of every rule in [PROVENANCE.md](./PROVENANCE.md); release cadence in [REGULATORY_PIPELINE.md](./REGULATORY_PIPELINE.md).

## [1.0.0] - 2026-08-10

### Added
- 42 enterprise skills across 5 domain plugins, all carrying `risk_level` and `rule_type` frontmatter metadata.
- 8 deterministic calculation engines (PPh21, BPJS, THR, PHK, PPh23/26, UMKM final tax, marketplace fee, PKWT compensation).
- SSOT temporal rulesets with lifecycle status (`engines/rules/pph21.json`, `bpjs.json`); SHA-256 integrity checksums regenerated for lifecycle-enriched rulesets.
- Trust Envelope (confidence contract) appended to 8 flagship engine-driven skills.
- `REGULATORY_PIPELINE.md` operational procedure, granular provenance register with direct source URLs & article citations, community governance docs (`CONTRIBUTING.md`, `ROADMAP.md`).
- Deepened unit test coverage: boundary, negative, rounding, fallback and determinism assertions across the 4 newer engines.

### Changed
- Ruleset lifecycle fields (`status`, `verified_at`, `verified_by`, `review_interval_months`, `superseded_by`) added to every ruleset entry; `source.article` populated for gazette-level tracing.
- `tests/units/new-engines.test.js` replaced with an expanded 4-module boundary/matrix suite.

### Security
- Runtime integrity verifier unchanged; checksums updated to match lifecycle-enriched rulesets (any ruleset mutation outside the pipeline is detected at load time).