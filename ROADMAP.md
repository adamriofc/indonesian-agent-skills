# Roadmap

Status legend: `[x]` shipped · `[→]` in progress · `[ ]` planned.

## Shipped (`v2.0.0`)

- [x] **Finance Core (`finance-id`)** — 12 business finance & accounting skills + 8 deterministic engines (break-even, depreciation SL/DDB/SYD, NPV, IRR, loan amortization, 14 financial ratios, working capital, EOQ) + golden corpus (11 kasus) + benchmark domain 100%
- [x] **Rebrand & repositioning** — nama repo `indonesian-business-agent-skills`, tagline *"Give AI agents a business brain for Indonesia."*, arsitektur CORE/BUSINESS/CREATIVE, scope 6 domains · 54 skills · 16 engines
- [x] **Finance & Accounting Standard Register** — PROVENANCE.md section 6 (`STANDARD_REFERENCE` access path; PSAK 1/16/23, SAK EMKM dari IAI)
- [x] **Benchmark harness** — domain finance + deep-array match + parser `--json-report` space-tolerant

## Shipped (`v1.1.0`)

- [x] **Release Trust Anchor** — `SHA256SUMS.txt` + `scripts/sha256sums.sh`, diverifikasi di CI
- [x] **Benchmark harness** — `scripts/benchmark.js` + `docs/BENCHMARK.md` (akurasi corpus 100%, determinisme, throughput; LLM baseline siap pakai, menunggu run eksternal)
- [x] **Provenance precision** — Access Path per rule, Audit Scope & Non-Claims, perbaikan 2 link mati + 5 link presisi
- [x] **15 skill pendek diperkaya** (Scope & Safety + Worked Example) — konsistensi kedalaman konten
- [x] **Community readiness** — CODE_OF_CONDUCT, issue template regulasi, GitHub topics
- [x] **Compatibility matrix ber-metadata** — kolom Verification Method + Last Verified per platform (jujur: OpenWork 🟢 schema-validated; lainnya 🟡 Adapter / 🔵 Manual)

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
- [→] **LLM baseline benchmark run** — `scripts/benchmark.js --llm` dengan model produksi + publikasi hasil di `docs/BENCHMARK.md` (no-fiction: tabel baru terisi setelah run nyata)

## Planned

- [ ] **Compatibility verification levels** — E2E register untuk OpenCode CLI & Claude Code (mengubah 🟡 → 🟢 dengan bukti run)
- [ ] **Regional derivatives** — Malaysia, Singapore, Philippines statutory modules reusing the same ruleset architecture (preview: architecture is domain-agnostic)
- [ ] **Ruleset UI/diff tooling** — human-readable diff between effective windows and changelog automation from `REGULATORY_CHANGELOG.md`
- [ ] **Plugin registry sync automation** — one-command publish of skill updates to OpenWork Cloud
- [ ] **Indonesian tax year 2027 ruleset** — pre-release `DRAFT` rulesets published 90 days before gazette effective dates

## Non-Goals

- Replacing licensed tax/legal/accounting software. This is decision-support intelligence, not filing software.
- Non-Indonesian regulatory domains before the regional-derivatives milestone.
- Fabricated historical rates: rulesets only exist for windows we can prove.
- Trading & investment products (stock/crypto analysis) — out of the business-finance core scope.