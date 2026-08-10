# Indonesian Business Agent Skills

*Give AI agents a business brain for Indonesia.*

**Open-source Indonesian business intelligence for AI agents — combining regulatory-grounded skills, temporal rulesets, deterministic engines, and auditable provenance.**

<p align="center">
  <img src="docs/indonesian-business-agent-skills-hero.svg" alt="Indonesian Business Agent Skills Banner" width="100%">
</p>

<p align="center">
  <a href="LICENSE"><img src="https://img.shields.io/badge/License-MIT-blue.svg" alt="License: MIT"></a>
  <a href="https://github.com/adamriofc/indonesian-business-agent-skills/actions/workflows/ci.yml"><img src="https://github.com/adamriofc/indonesian-business-agent-skills/actions/workflows/ci.yml/badge.svg" alt="CI Pipeline"></a>
  <a href="https://app.openworklabs.com/"><img src="https://img.shields.io/badge/OpenCode-Compatible-brightgreen.svg" alt="OpenCode Compatibility"></a>
  <a href="engines/"><img src="https://img.shields.io/badge/Hybrid%20Engine-LLM--Safe-orange.svg" alt="LLM-Safe Hybrid Engine"></a>
  <a href="tests/"><img src="https://img.shields.io/badge/Test%20Suite-900%2B%20Assertions-success.svg" alt="900+ Test Assertions"></a>
</p>

---

## Overview

A domain-intelligence infrastructure for AI agents operating within the Indonesian business ecosystem. Built for **OpenWork Desktop**, **OpenCode CLI**, **Claude Code (CLI)**, **Cursor IDE**, and custom agent frameworks, this repository pairs structured instruction packs with **17 deterministic calculation & regulatory diff engines** (`engines/`) and temporal JSON rulesets (`engines/rules/`).

**Scope: 6 business domains · 55 agent skills · 17 deterministic engines** — core (legal, tax, finance, HR), business (e-commerce), and creative (local content).

---

## ⚡ Why You Need This

In Indonesia, compliance is governed by specific, frequently amended statutory frameworks such as PP 58/2023 for PPh 21 tax TER, PP 35/2021 for labor severance & PKWT compensation, PP 55/2022 for 0.5% UMKM tax, and UU 27/2022 for personal data protection.

Standard Large Language Models (LLMs) predict text probabilistically. When evaluating tax withholdings, contract risks, or statutory severance payouts, unassisted LLMs present three core failure modes:
1. **Arithmetic Hallucination**: LLMs predict tokens rather than computing equations, resulting in inaccurate tax category lookups and faulty severance math.
2. **Temporal Ambiguity**: LLMs cannot reliably distinguish between statutory wage caps in different effective date windows (such as BPJS JP wage cap adjustments in March 2025 vs March 2026).
3. **Unverifiable Lineage**: Output responses lack traceable links to official government gazettes, making them unsuited for corporate audits.

This skill collection resolves these failure modes by executing mathematical operations inside pure Node.js calculation engines (`engines/`) backed by single-source-of-truth rulesets (`engines/rules/`). The agent extracts parameters from natural language inputs, passes them to the engine, and formats the verified calculation into a clear explanation.

---

## 🚀 Quickstart (< 60 seconds)

```bash
# 1. Clone (5 seconds)
git clone https://github.com/adamriofc/indonesian-business-agent-skills.git && cd indonesian-business-agent-skills

# 2. Install (10 seconds, no third-party dependencies)
npm ci

# 3. Run an engine and see verified output (2 seconds)
node -e "
const { calculatePPh21Monthly } = require('./engines/pph21-calculator');
console.log(calculatePPh21Monthly(10000000, 'TK/0', true, '2026-03-01'));
"

# 4. Verify integrity (2 seconds)
./scripts/sha256sums.sh verify

# 5. Full test: 900+ assertions (30-60 seconds)
npm test
```

Afterward: copy the skill folders you need into your agent (see the Compatibility & Integration Directory table below).

---

## 🏗️ System Architecture

```text
                                 [ User / Agent Query ]
                                           │
                                           ▼
                       ┌──────────────────────────────────────┐
                       │    Skill Instruction Layer (MD)      │
                       │ Extracts parameters & structured JSON│
                       └──────────────────┬───────────────────┘
                                          │
                                          ▼
              ┌──────────────────────────────────────────────────────┐
              │          16 Deterministic Node.js Engines            │
              │ 8 statutory (engines/*.js + SSOT temporal rulesets)  │
              │  8 finance (engines/*.js — pure standard math)       │
              └──────────────────┬───────────────────┬───────────────┘
                                 │                   │
                                 ▼                   ▼
      ┌──────────────────────────────┐   ┌──────────────────────────────────────┐
      │ Single Source of Truth Rules │   │ Cryptographic SHA-256 Checksums     │
      │ (engines/rules/*.json)       │   │ (engines/rules/integrity.js +        │
      │ — statutory & policy only    │   │  SHA256SUMS.txt)                     │
      └──────────────┬───────────────┘   └──────────────────┬───────────────────┘
                     │                                      │
                     └──────────────────────────┬───────────┘
                                                │
                                                ▼
                         ┌──────────────────────────────────────┐
                         │  Validated Statutory Output + Math   │
                         └──────────────────┬───────────────────┘
                                            │
                                            ▼
                         ┌──────────────────────────────────────┐
                         │ LLM Narrative Synthesis & Formatting │
                         └──────────────────────────────────────┘
```

---

## ⚖️ Comparative Scenarios: Pure LLM vs. Hybrid Engine

### Scenario 1: PPh 21 Calculation for Gross Salary Rp 10.000.000 (TK/0 PTKP)
* **Pure LLM Output**: Guesses the tax rate as a flat 5% or applies an outdated PTKP deduction first, resulting in incorrect withholdings.
* **Hybrid Engine Output**: Extracts `{ grossSalary: 10000000, ptkpStatus: "TK/0" }` and evaluates it against `engines/pph21-calculator.js`. Matches **TER Category A (2.0%)** per PP 58/2023, returning exactly **Rp 200.000** with ruleset version tracking.

### Scenario 2: BPJS Wage Cap Transition on March 15, 2025
* **Pure LLM Output**: Uses outdated BPJS JP Cap of Rp 10.042.300 or Rp 12.000.000.
* **Hybrid Engine Output**: Evaluates the date (`2025-03-15`) against `engines/rules/bpjs.json` and pulls the updated cap of **Rp 10.547.400** per BPJS SE B/726/022025.

---

## 🔌 Compatibility & Integration Directory

Compatibility classes (audit-grade, no overclaim):

| Class | Meaning |
|---|---|
| 🟢 **Verified** | Exercised end-to-end against this repository (tests, registration, or live import) |
| 🟡 **Adapter** | Works through a bridge configuration (cursorrules, system prompts); requires setup, not independently tested in this repo |
| 🔵 **Manual** | Supported via manual file upload/copy; no automation contract, user executes the steps |

| Application / Platform | Integration Method | Compatibility Class | Verification Method | Last Verified |
|---|---|---|---|---|
| **OpenWork Desktop & Cloud** | Native `plugin.json` manifest; 6 plugins + 54 skills validated by the schema validator in CI | 🟢 **Verified** | CI schema validation (`tests/schema/`) + `npm test` | 2026-08-10 |
| **OpenCode CLI** | `opencode` supports third-party plugins; import instructions are documented; no E2E run in this repository | 🟡 **Adapter** | Documentation + format analysis (not E2E-tested in this repo's CI) | 2026-08-10 |
| **Claude Code (CLI) & Cowork** | Native `.claude-plugin` manifest format; `claude plugins add` | 🟡 **Adapter** | Format-native (manifest CI-validated); E2E registration pending | 2026-08-10 |
| **Cursor IDE** | Context loading via `.cursorrules` / `.mdc` copies | 🟡 **Adapter** | Documentation; not automated-tested in this repository | 2026-08-10 |
| **VS Code Agent (Copilot / Cline / Roo Code)** | Workspace prompt rules under `.vscode/settings.json` / `systemPromptPath` | 🔵 **Manual** | Manual user steps; no automation contract | 2026-08-10 |
| **Gemini CLI & Codex** | Imported as external system prompts | 🔵 **Manual** | Manual user steps | 2026-08-10 |
| **ChatGPT / Custom GPTs** | Upload skill files in GPT Builder knowledge database | 🔵 **Manual** | Manual user steps | 2026-08-10 |

---

## 🛠️ Installation & Setup Guide

### 1. Universal Agent Skills CLI (Frictionless / Recommended)
Install skills directly across any supported agent framework (Claude Code, OpenCode, Codex, Cursor, Antigravity) using `npx`:
```bash
# Install all skills across the repository
npx skills add adamriofc/indonesian-business-agent-skills

# Selective installation by agent platform or skill domain
npx skills add adamriofc/indonesian-business-agent-skills --agent claude-code
npx skills add adamriofc/indonesian-business-agent-skills --skill pph21-calculator
```

### 2. Claude Code Marketplace (Plugin Integration)
Register the repository as a marketplace source and install individual plugins:
```bash
# Add the repository as a plugin marketplace source
claude plugin marketplace add adamriofc/indonesian-business-agent-skills

# Install individual plugins from the marketplace
claude plugin install legal-id@indonesian-business-agent-skills
claude plugin install tax-payroll-id@indonesian-business-agent-skills
claude plugin install finance-id@indonesian-business-agent-skills
```

### 3. Portable Agent Skills Standard (.agents / .opencode / .cursor)
For native skill discovery without plugins, link or copy skills to the canonical `.agents/skills/` directory:
```bash
# Canonical cross-agent skills directory
mkdir -p .agents/skills
cp -r legal-id/skills/* .agents/skills/
cp -r tax-payroll-id/skills/* .agents/skills/
cp -r finance-id/skills/* .agents/skills/

# OpenCode & Cursor native paths
mkdir -p .opencode/skills .cursor/skills
cp -r .agents/skills/* .opencode/skills/
cp -r .agents/skills/* .cursor/skills/
```

### 4. OpenWork Desktop & Cloud
1. Open **Settings > Plugins**.
2. Click **Add Plugin from Repository**.
3. Input the GitHub URL: `https://github.com/adamriofc/indonesian-business-agent-skills`.
4. The 6 plugins and 54 skills activate automatically.

---

## 📦 Plugin Inventory & Skill Catalog (55 Skills Across 6 Plugins)

### 1. `legal-id`: Commercial Law & Compliance (8 Skills)
* `contract-reviewer`: Audits agreements and outputs a **Contract Risk Score (0-100)** with redlines.
* `spk-generator`: Drafts bilateral service contracts compliant with KUHPerdata Arts. 1320 & 1338.
* `nda-indonesia`: Drafts NDAs with liquidated damages under Indonesian jurisdiction.
* `pdp-compliance`: Audits processing workflows against all 6 Lawful Bases of UU PDP No. 27/2022.
* `legal-memo-id`: Formats disputes into structured Legal Memos (*Posita*, *Legal Basis*, *Analysis*).
* `haki-trademark-check`: Audits trademark eligibility and DJKI Nice Classifications (Kelas 1-45).
* `oss-kbli-navigator`: Maps business activities to KBLI 2020 codes and OSS-RBA risk levels.
* `somasi-draft-id`: Drafts formal advocate-standard legal warning letters (Somasi 1, 2, 3).

### 2. `tax-payroll-id`: Indonesian Tax Engine (9 Skills)
* `pph21-calculator`: TER monthly calculation engine (PP 58/2023) & Dec Annual Reconciliation.
* `pph23-26-calculator`: Calculates PPh 23 (2% service) and PPh 26 (20% offshore / Tax Treaty DGT).
* `pph-final-umkm`: Calculates 0.5% UMKM final tax with Rp 500M OP threshold exemption (PP 55/2022 & PP 20/2026).
* `laporan-keuangan-psak`: Formats trial balances into SAK EMKM / SAK EP compliant financial statements.
* `efaktur-helper`: Validates e-Faktur & DJP Coretax tax invoices for statutory PPN 12% & 11/12 DPP Nilai Lain (effective 11% burden).
* `regulatory-diff`: Compares versioned SSOT ruleset transitions across effective date windows (e.g. PP 55/2022 ➔ PP 20/2026).
* `thr-calculator`: Payout engine for religious holiday allowances.
* `bpjs-calculator`: Calculations for health and social security contribution splits.
* `spt-tahunan-guide`: Filing workflow for individual tax returns via DJP Online.

### 3. `hr-id`: Labor & Employment Compliance (7 Skills)
* `surat-peringatan`: Drafts SP1, SP2, and SP3 warning letters following 6-month statutory windows.
* `sop-perusahaan`: Generates SOPs enforcing overtime limits (Perpu 2/2022 max 4h/day, 18h/week).
* `interview-id`: Candidate scorecards evaluating technical skills and local cultural fit.
* `bpjs-tenagakerja-admin`: SIPP BPJS portal administration workflow guide.
* `phk-calculator`: Statutory severance payout engine under PP 35/2021.
* `pkwt-pkwtt-checker`: Audits contract worker duration (max 5 yrs) and computes statutory PKWT compensation.
* `struktur-skala-upah`: Builds statutory Wage Structure and Scale frameworks per Permenaker 1/2017.

### 4. `ecommerce-id`: Marketplace Operations & SEO (10 Skills)
* `deskripsi-produk-seo`: Structural product copy optimized for Shopee & Tokopedia search.
* `cs-komplain-handler`: Customer service protocols for negative reviews and damaged packages.
* `analisis-kompetitor-marketplace`: Extracts feedback gaps from competitor listings.
* `shopee-live-script`: Retention and flash-sale hosting scripts for live streaming.
* `tokopedia-seo-optimizer`: Algorithmic title formula generator (`[Product] + [Brand] + [Spec] + [Keywords]`).
* `buyer-negotiator`: Grosir wholesale B2B trade terms negotiation guidelines.
* `margin-pricing-calculator`: Computes net seller payouts after Shopee/Tokopedia/TikTok Shop admin fees.
* `klaim-logistik-retur`: Courier insurance claim SOPs and damage report templates.
* `tiktok-shop-affiliate`: Affiliate campaign commission structures and creator outreach briefs.
* `shopee-video-creator`: Short promotional video scripts and yellow-basket product tagging.

### 5. `content-lokal-id`: Local Copywriting (9 Skills)
* `whatsapp-broadcast`: High-conversion anti-spam WhatsApp Business copy.
* `linkedin-x-thread-id`: B2B executive narrative storytelling formats.
* `script-reels-tiktok`: Short-video scripts with visual directions and audio overlays.
* `lokalisasi-slang-indonesia`: Adapts formal copy into natural Indonesian business casual or colloquial tone.
* `press-release-id`: Indonesian 5W+1H journalistic press release template.
* `instagram-reels-carousel`: Visual hooks for IG Reels and multi-slide Carousel post scripts.
* `youtube-shorts-script`: Retention scripts for 0-60s Shorts and long-form video outlines.
* `kol-brief-contract`: KOL/Influencer campaign briefs, SOWs, and content usage rights contracts.
* `gmb-local-seo`: Google Business Profile (GMB) map optimization and local search copy.

### 6. `finance-id`: Business Finance & Accounting (12 Skills)
* `accounting-basics`: Double-entry bookkeeping, journals, and accrual vs cash basis.
* `financial-statements`: 3-statement structure and PSAK 1 presentation principles.
* `cash-flow-analysis`: OCF/ICF/FCF analysis and cash runway.
* `budgeting-forecasting`: Top-down/bottom-up budgets, variance and rolling forecast.
* `financial-ratio-analysis`: 14 ratios via `engines/financial-ratios.js`.
* `working-capital`: NWC, CCC, and funding requirement via `engines/working-capital.js`.
* `cost-accounting`: COGS, absorption vs variable costing, product costing.
* `break-even-analysis`: BEP units/revenue and margin of safety via `engines/break-even.js`.
* `unit-economics`: LTV, CAC, contribution margin, LTV:CAC heuristic.
* `business-feasibility`: 5-aspect feasibility framework with consistent financial figures.
* `financial-modeling`: 3-statement linkage and deterministic sensitivity tables.
* `capital-budgeting`: NPV/IRR/payback via `engines/npv.js` & `engines/irr.js` vs simple WACC.

---

## 📊 Real-World Execution Examples

All outputs below are **actual engine outputs** (run on 2026-08-10, Node.js 18+, `npm test` green).

### 1. PPh 21 TER Monthly — Actual Engine Output

```javascript
const { calculatePPh21Monthly } = require('./engines/pph21-calculator');
const result = calculatePPh21Monthly(10000000, 'TK/0', true, '2026-03-01');
console.log(result);
```

```json
{
  "grossSalary": 10000000,
  "ptkpStatus": "TK/0",
  "terCategory": "A",
  "effectiveRate": 0.02,
  "effectiveRatePercent": "2.00%",
  "hasNpwp": true,
  "identityStatus": "validated_nik_npwp",
  "penaltyApplied": false,
  "monthlyTaxWithheld": 200000,
  "calculationDate": "2026-03-01",
  "rulesetId": "PPH21-2024",
  "rulesetVersion": "1.0.0",
  "statutoryReference": "PP No. 58/2023 & PMK No. 168/2023"
}
```

### 2. BPJS Temporal Wage Cap Transition — Actual Engine Output

```javascript
const { calculateBpjs } = require('./engines/bpjs-calculator');
const res2026 = calculateBpjs(20000000, 'low', '2026-03-01');
console.log(res2026.rulesetId);                                    // BPJS-2026
console.log(res2026.bpjsKetenagakerjaan.jp.cappedWage);            // 11086300
console.log(res2026.bpjsKetenagakerjaan.jp.employer);              // 221726
```

```json
{
  "rulesetId": "BPJS-2026",
  "bpjsKetenagakerjaan": {
    "jht": { "employer": 740000, "employee": 400000, "total": 1140000 },
    "jp":  { "cappedWage": 11086300, "employer": 221726, "employee": 110863, "total": 332589 },
    "jkk": { "hazardLevel": "low", "ratePercent": "0.54%", "employer": 108000 },
    "jkm": { "employer": 60000 }
  }
}
```

Note that the engine selects rulesets **temporally**: given the date `2026-03-01`, the engine automatically switches from `BPJS-2025` (cap Rp 10.547.400) to `BPJS-2026` (cap Rp 11.086.300) — covered by 425 PPh 21 assertions and 225 PHK assertions in CI.

### 3. Break-Even Analysis — Actual Engine Output

```javascript
const { breakEvenUnits, breakEvenRevenue, contributionMargin, contributionMarginRatio, marginOfSafety } = require('./engines/break-even');
const revenue = breakEvenRevenue(20000000, 25000, 15000);
console.log({
  contributionMargin: contributionMargin(25000, 15000),
  contributionMarginRatio: contributionMarginRatio(25000, 15000),
  breakEvenUnits: breakEvenUnits(20000000, 25000, 15000),
  breakEvenRevenue: revenue,
  marginOfSafety: marginOfSafety(60000000, revenue)
});
```

```json
{
  "contributionMargin": 10000,
  "contributionMarginRatio": 0.4,
  "breakEvenUnits": 2000,
  "breakEvenRevenue": 50000000,
  "marginOfSafety": 10000000
}
```

### 4. Amortization & IRR — Actual Engine Output

```javascript
const { monthlyPayment, amortizationSchedule } = require('./engines/loan-amortization');
const { irr } = require('./engines/irr');
console.log({
  monthlyPayment: monthlyPayment(100000000, 0.12, 24),
  totalInterest: amortizationSchedule(100000000, 0.12, 24).totalInterest,
  irrOfProject: irr([-100000, 30000, 40000, 50000]).irr.toFixed(4)
});
```

```json
{
  "monthlyPayment": 4707347,
  "totalInterest": 12976331,
  "irrOfProject": "0.0890"
}
```

---

## 🧪 Comprehensive Test & Verification Suite

Our test harness executes over **900+ individual test assertions** across 9 automated test modules (schema validation, statutory engines, finance engines, PPh 21 & PHK matrices, integration, injection & adversarial security):

```bash
# Run full test pipeline
npm test
```

---

## 🛡️ Security & Disclaimers

See [`SECURITY.md`](SECURITY.md) for prompt injection defense guidelines, [`PROVENANCE.md`](PROVENANCE.md) for the granular statutory gazette register, [`REGULATORY_PIPELINE.md`](REGULATORY_PIPELINE.md) for the official update procedure, and [`REGULATORY_CHANGELOG.md`](REGULATORY_CHANGELOG.md) for regulatory amendments.

**Release Trust Anchor**: `SHA256SUMS.txt` (at the repo root) holds SHA-256 checksums for every ruleset; regeneration/verification via `./scripts/sha256sums.sh generate|verify` and runs automatically in CI on every push.

Governance and community files: [`CONTRIBUTING.md`](CONTRIBUTING.md), [`ROADMAP.md`](ROADMAP.md), [`CHANGELOG.md`](CHANGELOG.md).

**Statutory Disclaimer**: *This project provides decision-support tools and deterministic calculation models. Outputs do not constitute formal legal, tax, or accounting advice. High-risk decisions (such as PHK severance execution or contract execution) require review by a licensed advocate or tax consultant.*

## 📄 License

MIT License. See [LICENSE](LICENSE) for details.
