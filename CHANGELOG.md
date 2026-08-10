# Changelog

All notable changes to this project are documented here in reverse chronological order. Regulatory/statutory changes are additionally tracked per-rule in [REGULATORY_CHANGELOG.md](./REGULATORY_CHANGELOG.md); provenance of every rule in [PROVENANCE.md](./PROVENANCE.md); release cadence in [REGULATORY_PIPELINE.md](./REGULATORY_PIPELINE.md).

## [2.3.0] - 2026-08-10

### Added
- **4 Strategic Cross-Domain Intelligence Engines**:
  - `engines/regulatory-impact-engine.js`: Evaluates versioned statutory transitions (PP 20/2026, BPJS caps) against company operational profiles to compute business impact level, affected domains, action checklists, and statutory deadlines.
  - `engines/compliance-risk-engine.js`: Multi-Domain Compliance Health Audit (Tax, HR, Legal, Data/PDP, Commerce) computing a Compliance Health Score (0-100), domain health flags, detected violations, and a prioritized remediation roadmap.
  - `engines/business-scenario-engine.js`: Maps business profiles across the 8 Stages of the Indonesian Business Lifecycle (Incorporation ➔ HR Onboarding ➔ Payroll/THR ➔ Contracts ➔ Tax ➔ E-Commerce ➔ Financial Reporting ➔ Exit/Restructuring).
  - `engines/decision-engine.js`: Evaluates corporate financial & operational metrics (cash runway, gross margin, Thin Cap DER 4:1 ratio under PMK 172/2023, PPh 21 gross-up tax burden) to generate deterministic, prioritized business decision recommendations and driver classifications.
- **4 Flagship Cross-Domain Agent Skills**: `regulatory-impact` (under `tax-payroll-id`), `compliance-risk` (under `legal-id`), `business-scenario` (under `finance-id`), `decision-engine` (under `finance-id`), bringing total catalog to **71 Skills across 6 Plugins** & **27 Deterministic Engines**.
- **20-Domain Golden Benchmark**: Expanded static golden corpus (`tests/golden/`) to **85 golden cases across 27 engines** (20 benchmark domains) at **100.00% accuracy** and stable determinism.

## [2.2.1] - 2026-08-10

### Fixed & Hardened
- **Metadata & Catalog Sync**: Updated `tax-payroll-id/.claude-plugin/plugin.json` to rate-agnostic PPN/PPnBM description; corrected tax-payroll-id inventory count (18 skills) in `README.md`.
- **Registry Cross-Validation**: Upgraded `tests/schema/validator.test.js` to cross-validate registry IDs, plugins, skill paths, frontmatter metadata (`risk_level`, `rule_type`, `quality_tier`), engine paths, and README inventory section counts (0 schema or cross-field errors across all 67 skills).
- **Closed Security Boundaries**: Replaced dangling injection isolation blocks across ingestion skills (`contract-reviewer`, `pdp-compliance`, `phk-calculator`, `analisis-kompetitor-marketplace`, `somasi-draft-id`, `oss-kbli-navigator`, `haki-trademark-check`) with complete, closed `[SYSTEM INSTRUCTION] ... [UNTRUSTED DATA PAYLOAD] ... [END PAYLOAD]` runtime templates; added delimiter-break protection and adversarial fixtures (`fixtures/adversarial/`).
- **23-Engine Golden Benchmark**: Expanded deterministic benchmark harness (`scripts/benchmark.js`) and static golden corpus (`tests/golden/`) to **78 cases across all 23 engine modules** (16 domains) at 100% accuracy and stable determinism.
- **Engine Coercion Safety**: Hardened `engines/pph21-calculator.js` to clamp `NaN`/`Infinity`/hostile values to zero Rupiah balance without crashing or leaking numeric anomalies.
- **CI Dependency Upgrades**: Merged Dependabot PRs for GitHub Actions workflows (`actions/checkout` v7, `actions/setup-node` v7; Node 20/22/24 matrix green).

### Added
- **5 Ultra-Advanced Corporate & Enterprise Engines**:
  - `engines/pph21-grossup-calculator.js`: Circular PPh 21 tax allowance bisection loop & PMK 66/2023 Natura exemption thresholds.
  - `engines/pph-badan-calculator.js`: Corporate Income Tax (22%) with Pasal 31E UU PPh sliding scale facility (&le; 4.8B, 4.8B–50B, > 50B).
  - `engines/transfer-pricing-engine.js`: Thin Capitalization (DER 4:1 max ceiling), interest deduction barriers, & secondary dividend adjustments (PMK 172/2023).
  - `engines/ppn-ppnbm-calculator.js`: Statutory 12% PPN, PPnBM Luxury Goods Tax (10% to 200%), Other Basis DPP (11/12), & CIF import bases.
  - `engines/term-sheet-waterfall.js`: Indonesian startup VC liquidation preference exit waterfall (Seniority, Pari Passu, Participating with Caps).
- **6 Flagship Enterprise Agent Skills**: `pph21-grossup`, `pph-badan-calculator`, `transfer-pricing-audit`, `ppn-ppnbm-advanced`, `vc-term-sheet-waterfall`, `phk-advanced-matrix` (expanding total skills to **67 Skills across 6 Plugins** & **23 Deterministic Engines**).
- **Registry Update**: `registry/index.json` updated with 67 registered skills and quality tiers.

## [2.1.0] - 2026-08-10

### Added
- **Tax Engineering & Strategic Planning Skills**: 5 new flagship tax engineering, planning, and cross-border skills (`tax-planning`, `tax-optimization`, `tax-risk-analysis`, `tax-audit-preparation`, `tax-cross-border`) under `tax-payroll-id` (bringing total skill count to 60).
- **Machine-Readable Skill Registry**: `registry/index.json` machine-readable index mapping all 60 skills across 6 plugins with `quality_tier` classification (`source-verified`, `tested`, `expert-reviewed`).
- **Optional Integrations Architecture**: `integrations/README.md` defining static knowledge ➔ skill, calculation ➔ engine, live state ➔ API/tool principles.

## [2.0.1] - 2026-08-10

### Fixed
- **Claude Code Marketplace Schema**: `.claude-plugin/marketplace.json` updated with `$schema`, object `owner`, and `source` plugin declarations.
- **e-Faktur & Coretax PPN 12% Update**: `tax-payroll-id/skills/efaktur-helper/SKILL.md` updated for statutory 12% PPN rate and 11/12 DPP Nilai Lain (effective 11% burden).
- **UMKM Skill Synchronization**: `tax-payroll-id/skills/pph-final-umkm/SKILL.md` updated to reflect PP 20/2026 ruleset and Rp 4.8B turnover cap.
- **README Skill Inventory**: fixed stale descriptions for `pph-final-umkm` and `efaktur-helper` in the catalog.
- **CI Node Matrix**: updated to Node 20, 22, and 24 LTS runtimes.
- **Dependabot**: added `.github/dependabot.yml` for automated npm & GitHub Actions dependency tracking.

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