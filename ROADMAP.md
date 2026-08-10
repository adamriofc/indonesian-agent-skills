# Roadmap

Status legend: `[x]` shipped · `[→]` in progress · `[ ]` planned.

## Shipped (`v2.0.1`)

- [x] **Regulatory Diff Engine (`regulatory-diff`)** — deterministic comparison across temporal ruleset windows (`UMKM-2022` ➔ `UMKM-2026`, `BPJS-2025` ➔ `BPJS-2026`)
- [x] **PP 20/2026 & PPN 12% Coretax updates** — `UMKM-2026` ruleset, e-Faktur 12% statutory rate & 11/12 DPP Nilai Lain effective 11% burden
- [x] **Claude Code Marketplace Manifest & Portability** — official `$schema`, `owner` object, `source` declarations, and `npx skills add` support
- [x] **Web Playground Generator (`scripts/build-playground.js`)** — client-side static calculator interface (`docs/playground.html`)
- [x] **LLM vs Deterministic Benchmark Methodology** — evaluation framework (`docs/LLM_BENCHMARK_METHODOLOGY.md`)
- [x] **Named Expert Register** — Section 7 in `PROVENANCE.md` (CPAs, employment law consultants, e-commerce specialists)

## Shipped (`v2.0.0`)

- [x] **Finance Core (`finance-id`)** — 12 business finance & accounting skills + 8 deterministic engines (break-even, depreciation SL/DDB/SYD, NPV, IRR, loan amortization, 14 financial ratios, working capital, EOQ) + golden corpus (11 cases) + 100% domain benchmark
- [x] **Rebrand & repositioning** — repo name `indonesian-business-agent-skills`, tagline *"Give AI agents a business brain for Indonesia."*, CORE/BUSINESS/CREATIVE architecture, scope 6 domains · 54 skills · 16 engines
- [x] **Finance & Accounting Standard Register** — PROVENANCE.md section 6 (`STANDARD_REFERENCE` access path; PSAK 1/16/23, SAK EMKM from IAI)
- [x] **Benchmark harness** — finance domain + deep-array match + space-tolerant `--json-report` parser

## Shipped (`v1.1.0`)

- [x] **Release Trust Anchor** — `SHA256SUMS.txt` + `scripts/sha256sums.sh`, verified in CI
- [x] **Benchmark harness** — `scripts/benchmark.js` + `docs/BENCHMARK.md` (100% corpus accuracy, determinism, throughput; LLM baseline ready, awaiting external run)
- [x] **Provenance precision** — per-rule Access Path, Audit Scope & Non-Claims, 2 dead-link fixes + 5 precision fixes
- [x] **15 short skills enriched** (Scope & Safety + Worked Example) — content depth consistency
- [x] **Community readiness** — CODE_OF_CONDUCT, regulatory issue template, GitHub topics
- [x] **Metadata-backed compatibility matrix** — Verification Method + Last Verified columns per platform (honest: OpenWork 🟢 schema-validated; others 🟡 Adapter / 🔵 Manual)

## Shipping (`v1.0.0`)

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

- [→] **Finance × Tax × HR integration** — cross-plugin workflows (finance output → tax entries via efaktur-helper → payroll via pph21/bpjs)
- [→] **Operations domain (Phase 3)** — `operations-id` plugin (procurement, inventory, logistics SOP)
- [→] Ruleset lifecycle promotion tooling (scripted `DRAFT → VERIFIED → RELEASED`)
- [→] Signed manifest anchoring (Git tag signing / attestation for integrity chain-of-custody)
- [→] **LLM baseline benchmark run** — `scripts/benchmark.js --llm` with a production model + publishing results in `docs/BENCHMARK.md` (no-fiction: the table is only populated after a real run)

## Planned

- [ ] **Compatibility verification levels** — E2E register for OpenCode CLI & Claude Code (moving 🟡 → 🟢 with run evidence)
- [ ] **Regional derivatives** — Malaysia, Singapore, Philippines statutory modules reusing the same ruleset architecture (preview: architecture is domain-agnostic)
- [ ] **Ruleset UI/diff tooling** — human-readable diff between effective windows and changelog automation from `REGULATORY_CHANGELOG.md`
- [ ] **Plugin registry sync automation** — one-command publish of skill updates to OpenWork Cloud
- [ ] **Indonesian tax year 2027 ruleset** — pre-release `DRAFT` rulesets published 90 days before gazette effective dates

## Non-Goals

- Replacing licensed tax/legal/accounting software. This is decision-support intelligence, not filing software.
- Non-Indonesian regulatory domains before the regional-derivatives milestone.
- Fabricated historical rates: rulesets only exist for windows we can prove.
- Trading & investment products (stock/crypto analysis) — out of the business-finance core scope.