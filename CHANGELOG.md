# Changelog

All notable changes to this project are documented here in reverse chronological order. Regulatory/statutory changes are additionally tracked per-rule in [REGULATORY_CHANGELOG.md](./REGULATORY_CHANGELOG.md); provenance of every rule in [PROVENANCE.md](./PROVENANCE.md); release cadence in [REGULATORY_PIPELINE.md](./REGULATORY_PIPELINE.md).

## [2.0.0] - 2026-08-10

### Added
- **Finance Core (`finance-id` plugin)**: 12 business finance & accounting skills — accounting-basics, financial-statements, cash-flow-analysis, budgeting-forecasting, financial-ratio-analysis, working-capital, cost-accounting, break-even-analysis, unit-economics, business-feasibility, financial-modeling, capital-budgeting.
- **8 deterministic finance engines** (pure standard math, no ruleset): `engines/break-even.js`, `depreciation.js` (SL/DDB/SYD), `npv.js` (+ terminal value), `irr.js` (bisection, self-consistency), `loan-amortization.js`, `financial-ratios.js` (14 ratios), `working-capital.js`, `eoq.js` — each with a golden corpus (`tests/golden/finance.json`, 11 cases) + unit module (`tests/units/finance-engines.test.js`).
- **Benchmark harness extended**: domain `finance` (8 engines, 11 golden cases) — all domains 100% deterministic.
- **PROVENANCE.md**: new `STANDARD_REFERENCE` Access Path + section 6 Finance & Accounting Standard Register (PSAK 1/16/23, SAK EMKM; IAI — 404 for automated clients, verified manually).

### Changed
- **Repo renamed**: `indonesian-agent-skills` → `indonesian-business-agent-skills` (automatic GitHub redirect).
- **Rebrand**: title "Indonesian Business Agent Skills", tagline *"Give AI agents a business brain for Indonesia."*; CORE (legal/tax/finance/HR) · BUSINESS (commerce) · CREATIVE (content) architecture; scope "6 business domains · 54 agent skills · 16 deterministic engines".
- `package.json`: name `indonesian-business-agent-skills`, version `2.0.0`; the `npm test` + `test:units` chain now includes `finance-engines.test.js` (9 modules).
- README: actual finance engine output examples (break-even, amortization, IRR) added; absolute `/tmp/...` paths replaced with `$PWD`.

### Fixed
- `scripts/benchmark.js`: the `--json-report`/`--llm-sample` argument parser now accepts both space (`--json-report path`) and `=` syntax; array case comparisons (e.g. `annual` depreciation) use deep-match instead of `===` reference equality.

### Benchmark (actual run 2026-08-10, Node v26.5.1, `scripts/benchmark.js`)
- PPh 21 100% (6 cases, 14.649 ops/s) · BPJS 100% (3, 14.329) · PHK 100% (3, 27.028) · Finance 100% (11, 4.099) — determinism 3× OK, 0 violations.

## [1.1.0] - 2026-08-10

### Added
- **Release Trust Anchor**: `SHA256SUMS.txt` + `scripts/sha256sums.sh generate|verify`, automatically verified in CI on every push.
- **Benchmark harness**: `scripts/benchmark.js` (deterministic accuracy vs golden corpus, 3× determinism, ops/second, LLM baseline option via OpenAI-compatible endpoint) + `docs/BENCHMARK.md` (no-fiction policy: only numbers from actual runs).
- **PROVENANCE.md expanded**: Access Path column (`DIRECT_DOCUMENT` / `REGISTRY_ENTRY` / `OFFICIAL_PAGE` / `SECONDARY_MIRROR`), Audit Scope Statement & Non-Claims section, and Provenance Change Log.
- **15 shortest skills enriched** with Scope & Safety + Worked Example (script-reels-tiktok, press-release-id, lokalisasi-slang-indonesia, tokopedia-seo-optimizer, linkedin-x-thread-id, spt-tahunan-guide, shopee-live-script, whatsapp-broadcast, buyer-negotiator, shopee-video-creator, bpjs-tenagakerja-admin, klaim-logistik-retur, tiktok-shop-affiliate, interview-id, gmb-local-seo).
- Community files: `CODE_OF_CONDUCT.md`, `.github/ISSUE_TEMPLATE/regulatory-update.md`; GitHub topics (regtech, taxtech, legaltech, etc.).

### Fixed
- **Broken source links (404)** replaced with verified official links: UU 7/2021 (JDIH Kemenkeu download → BPK JDIH `Details/185162`), PP 55/2022 (JDIH Kemenkeu download → `jdih.kemenkeu.go.id/dok/pp-55-tahun-2022`).
- **Provenance precision**: BPJS-KES (archive portal root → Peraturan.go.id Perpres 64/2020), BPJS-JP-2015 (FAQ root → BPK JDIH PP 45/2015), BPJS-JP-2026 (FAQ root → verified SE PDF mirror), OSS-PP5 (oss.go.id root → Peraturan.go.id PP 5/2021), PDP (Kominfo timeout → Peraturan.go.id UU 27/2022).
- **README**: quickstart <60 seconds, actual engine outputs (not guesses), compatibility table with Verification Method & Last Verified columns, "synced via Cloud API" claim removed (honest: schema-validated, not cloud E2E).

### Changed
- `engines/rules/bpjs.json`: exact source URL per ruleset (BPJS-2015, BPJS-2025, BPJS-2026); `integrity.js` checksums updated.
- CI: `sha256sums.sh verify` step before `npm test`.

### Benchmark (actual run 2026-08-10)
- Golden corpus accuracy: PPh 21 100%, BPJS 100%, PHK 100% — determinism 3× OK; throughput 17.373 / 1.921 / 16.450 ops/second (Node v26.5.1).

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