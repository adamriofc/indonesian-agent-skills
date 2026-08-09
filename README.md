# Indonesian Agent Skills (`indonesian-agent-skills`) 🇮🇩

<p align="center">
  <img src="docs/indonesian-agent-skills-hero.svg" alt="Indonesian Agent Skills Banner" width="100%">
</p>

<p align="center">
  <a href="LICENSE"><img src="https://img.shields.io/badge/License-MIT-blue.svg" alt="License: MIT"></a>
  <a href="https://github.com/adamriofc/indonesian-agent-skills/actions/workflows/ci.yml"><img src="https://github.com/adamriofc/indonesian-agent-skills/actions/workflows/ci.yml/badge.svg" alt="CI Pipeline"></a>
  <a href="https://app.openworklabs.com/"><img src="https://img.shields.io/badge/OpenCode-Compatible-brightgreen.svg" alt="OpenCode Compatibility"></a>
  <a href="engines/"><img src="https://img.shields.io/badge/Hybrid%20Engine-LLM--Safe-orange.svg" alt="LLM-Safe Hybrid Engine"></a>
  <a href="tests/"><img src="https://img.shields.io/badge/Test%20Suite-900%2B%20Assertions-success.svg" alt="900+ Test Assertions"></a>
</p>

---

## Overview

A domain-intelligence infrastructure for AI agents operating within the Indonesian business ecosystem. Built for **OpenWork Desktop**, **OpenCode CLI**, **Claude Code (CLI)**, **Cursor IDE**, and custom agent frameworks, this repository pairs structured instruction packs with 8 deterministic calculation engines (`engines/`) and temporal JSON rulesets (`engines/rules/`).

---

## ⚡ Why You Need This

In Indonesia, compliance is governed by specific, frequently amended statutory frameworks such as PP 58/2023 for PPh 21 tax TER, PP 35/2021 for labor severance & PKWT compensation, PP 55/2022 for 0.5% UMKM tax, and UU 27/2022 for personal data protection.

Standard Large Language Models (LLMs) predict text probabilistically. When evaluating tax withholdings, contract risks, or statutory severance payouts, unassisted LLMs present three core failure modes:
1. **Arithmetic Hallucination**: LLMs predict tokens rather than computing equations, resulting in inaccurate tax category lookups and faulty severance math.
2. **Temporal Ambiguity**: LLMs cannot reliably distinguish between statutory wage caps in different effective date windows (such as BPJS JP wage cap adjustments in March 2025 vs March 2026).
3. **Unverifiable Lineage**: Output responses lack traceable links to official government gazettes, making them unsuited for corporate audits.

`indonesian-agent-skills` resolves these failure modes by executing mathematical operations inside pure Node.js calculation engines (`engines/`) backed by single-source-of-truth rulesets (`engines/rules/`). The agent extracts parameters from natural language inputs, passes them to the engine, and formats the verified calculation into a clear explanation.

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
                      ┌──────────────────────────────────────┐
                      │ 8 Deterministic Node.js Engines      │
                      │ (engines/*.js)                       │
                      └──────────────────┬───────────────────┘
                                         │
               ┌─────────────────────────┴────────────────────────┐
               ▼                                                  ▼
┌──────────────────────────────┐              ┌──────────────────────────────────────┐
│ Single Source of Truth Rules │              │ Cryptographic SHA-256 Checksums     │
│ (engines/rules/*.json)       │              │ (engines/rules/integrity.js)         │
└──────────────┬───────────────┘              └──────────────────┬───────────────────┘
               │                                                 │
               └─────────────────────────┬───────────────────────┘
                                         │
                                         ▼
                      ┌──────────────────────────────────────┐
                      │ Validated Statutory Output + Math    │
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

| Application / Platform | Integration Method | Compatibility Class |
|---|---|---|
| **OpenWork Desktop & Cloud** | Native manifest (`plugin.json`) registration; 5 plugins + 42 skills registered and synced via Cloud API | 🟢 **Verified** |
| **OpenCode CLI** | Import via `opencode plugins add` or local copy of the plugin folder | 🟡 **Adapter** (no E2E run in this repo) |
| **Claude Code (CLI) & Cowork** | Native `.claude-plugin` manifest format; `claude plugins add` | 🟡 **Adapter** (format-native, E2E pending) |
| **Cursor IDE** | Context loading via `.cursorrules` / `.mdc` copies | 🟡 **Adapter** |
| **VS Code Agent (Copilot / Cline / Roo Code)** | Workspace prompt rules under `.vscode/settings.json` / `systemPromptPath` | 🔵 **Manual** |
| **Gemini CLI & Codex** | Imported as external system prompts | 🔵 **Manual** |
| **ChatGPT / Custom GPTs** | Upload skill files in GPT Builder knowledge database | 🔵 **Manual** |

---

## 🛠️ Installation & Setup Guide

### 1. OpenWork Desktop & Cloud
OpenWork registers the plugins upon adding the repository:
1. Open **Settings > Plugins**.
2. Click **Add Plugin from Repository**.
3. Input the GitHub URL: `https://github.com/adamriofc/indonesian-agent-skills`.
4. The 5 plugins and 42 skills will activate automatically in your workspace.

### 2. OpenCode CLI
Install the plugins directly from your terminal:
```bash
opencode plugins add adamriofc/indonesian-agent-skills
```

### 3. Claude Code (CLI)
Link the skills directory to Claude Code config context:
```bash
claude plugins add adamriofc/indonesian-agent-skills
```

### 4. Cursor IDE
To instruct Cursor agent to use these rules, copy `.cursorrules` configurations to your project root:
```bash
mkdir -p .cursorrules.d
cp -r /tmp/opencode/indonesian-agent-skills/legal-id/skills/ .cursorrules.d/
```

### 5. VS Code Agent (Copilot / Cline / Roo Code)
Configure VS Code system instructions by adding the path to your settings:
```json
{
  "roo-code.systemPromptPath": "/absolute/path/to/indonesian-agent-skills/legal-id/skills/contract-reviewer/SKILL.md"
}
```

---

## 📦 Plugin Inventory & Skill Catalog (42 Skills Across 5 Plugins)

### 1. `legal-id`: Commercial Law & Compliance (8 Skills)
* `contract-reviewer`: Audits agreements and outputs a **Contract Risk Score (0-100)** with redlines.
* `spk-generator`: Drafts bilateral service contracts compliant with KUHPerdata Arts. 1320 & 1338.
* `nda-indonesia`: Drafts NDAs with liquidated damages under Indonesian jurisdiction.
* `pdp-compliance`: Audits processing workflows against all 6 Lawful Bases of UU PDP No. 27/2022.
* `legal-memo-id`: Formats disputes into structured Legal Memos (*Posita*, *Legal Basis*, *Analysis*).
* `haki-trademark-check`: Audits trademark eligibility and DJKI Nice Classifications (Kelas 1-45).
* `oss-kbli-navigator`: Maps business activities to KBLI 2020 codes and OSS-RBA risk levels.
* `somasi-draft-id`: Drafts formal advocate-standard legal warning letters (Somasi 1, 2, 3).

### 2. `tax-payroll-id`: Indonesian Tax Engine (8 Skills)
* `pph21-calculator`: TER monthly calculation engine (PP 58/2023) & Dec Annual Reconciliation.
* `pph23-26-calculator`: Calculates PPh 23 (2% service) and PPh 26 (20% offshore / Tax Treaty DGT).
* `pph-final-umkm`: Calculates 0.5% UMKM final tax with Rp 500M non-taxable threshold exemption (PP 55/2022).
* `laporan-keuangan-psak`: Formats trial balances into SAK EMKM / SAK EP compliant financial statements.
* `efaktur-helper`: Validates e-Faktur 4.0 transaction codes (010-090) and PPN 11% matching.
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

---

## 📊 Real-World Execution Examples

### 1. PPh 21 TER & December Reconciliation Example

```javascript
const { calculatePPh21DecemberReconciliation } = require('./engines/pph21-calculator');

// Calculate December Annual Reconciliation for Annual Gross Rp 120M (TK/0)
const result = calculatePPh21DecemberReconciliation(120000000, 'TK/0', 2000000, 200000, true, '2026-03-01');
console.log(result);
```

### 2. BPJS Temporal Wage Cap Transition Example

```javascript
const { calculateBpjs } = require('./engines/bpjs-calculator');

// Salary: Rp 20,000,000
// Date: March 1, 2025 (SE B/726/022025 transition -> JP Cap Rp 10,547,400)
const res2025 = calculateBpjs(20000000, 'low', '2025-03-01');
console.log(res2025.bpjsKetenagakerjaan.jp.cappedWage); // Outputs: 10547400

// Date: March 1, 2026 (SE B/3307/022026 transition -> JP Cap Rp 11,086,300)
const res2026 = calculateBpjs(20000000, 'low', '2026-03-01');
console.log(res2026.bpjsKetenagakerjaan.jp.cappedWage); // Outputs: 11086300
```

---

## 🧪 Comprehensive Test & Verification Suite

Our test harness executes over **900+ individual test assertions** across 8 automated test modules:

```bash
# Run full test pipeline
npm test
```

---

## 🛡️ Security & Disclaimers

See [`SECURITY.md`](SECURITY.md) for prompt injection defense guidelines, [`PROVENANCE.md`](PROVENANCE.md) for the granular statutory gazette register, [`REGULATORY_PIPELINE.md`](REGULATORY_PIPELINE.md) for the official update procedure, and [`REGULATORY_CHANGELOG.md`](REGULATORY_CHANGELOG.md) for regulatory amendments.

Governance and community files: [`CONTRIBUTING.md`](CONTRIBUTING.md), [`ROADMAP.md`](ROADMAP.md), [`CHANGELOG.md`](CHANGELOG.md).

**Statutory Disclaimer**: *This project provides decision-support tools and deterministic calculation models. Outputs do not constitute formal legal, tax, or accounting advice. High-risk decisions (such as PHK severance execution or contract execution) require review by a licensed advocate or tax consultant.*

## 📄 License

MIT License. See [LICENSE](LICENSE) for details.
