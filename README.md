# Indonesian Agent Skills (`indonesian-agent-skills`) 🇮🇩

<p align="center">
  <img src="docs/indonesian-agent-skills-hero.svg" alt="Indonesian Agent Skills Banner" width="100%">
</p>

<p align="center">
  <a href="LICENSE"><img src="https://img.shields.io/badge/License-MIT-blue.svg" alt="License: MIT"></a>
  <a href="https://github.com/adamriofc/indonesian-agent-skills/actions/workflows/ci.yml"><img src="https://github.com/adamriofc/indonesian-agent-skills/actions/workflows/ci.yml/badge.svg" alt="CI Pipeline"></a>
  <a href="https://app.openworklabs.com/"><img src="https://img.shields.io/badge/OpenCode-Compatible-brightgreen.svg" alt="OpenCode Compatibility"></a>
  <a href="engines/"><img src="https://img.shields.io/badge/Hybrid%20Engine-LLM--Safe-orange.svg" alt="LLM-Safe Hybrid Engine"></a>
  <a href="tests/"><img src="https://img.shields.io/badge/Test%20Suite-700%2B%20Assertions-success.svg" alt="700+ Test Assertions"></a>
</p>

---

## Overview

A domain-intelligence infrastructure for AI agents operating within the Indonesian business ecosystem. Built for **OpenWork Desktop**, **OpenCode CLI**, **Claude Code (CLI)**, **Cursor IDE**, and custom agent frameworks, this repository pairs structured instruction packs with deterministic calculation engines (`engines/`) and temporal JSON rulesets (`engines/rules/`).

---

## ⚡ Why You Need This

In Indonesia, compliance is governed by specific, frequently amended statutory frameworks such as PP 58/2023 for PPh 21 tax TER, PP 35/2021 for labor severance, and UU 27/2022 for personal data protection.

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
                      │ Deterministic Node.js Engines        │
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

| Application / Platform | Native Support | Integration Method | Verified Status |
|---|---|---|---|
| **OpenWork Desktop & Cloud** | Yes | Native manifest (`plugin.json`) load. | 🟢 Native |
| **OpenCode CLI** | Yes | Direct terminal import via `opencode plugins add`. | 🟢 Native |
| **Claude Code (CLI) & Cowork** | Yes | Loadable as custom tools or knowledge bases. | 🟢 Native |
| **Cursor IDE** | Yes | Context file loading via `.cursorrules` or `.mdc`. | 🟡 Adapter |
| **VS Code Agent** | Yes | Workspace prompt rules under `.vscode/settings.json`. | 🟡 Compatible |
| **Gemini CLI & Codex** | Yes | Imported as external system prompts. | 🟡 Compatible |
| **ChatGPT / Custom GPTs** | Yes | Upload files in the GPT Builder knowledge database. | 🟡 Manual |

---

## 🛠️ Installation & Setup Guide

### 1. OpenWork Desktop & Cloud
OpenWork registers the plugins upon adding the repository:
1. Open **Settings > Plugins**.
2. Click **Add Plugin from Repository**.
3. Input the GitHub URL: `https://github.com/adamriofc/indonesian-agent-skills`.
4. The 5 plugins and 26 skills will activate automatically in your workspace.

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

## 📦 Plugin Inventory & Skill Catalog

### 1. `legal-id`: Commercial Law & Compliance
* `contract-reviewer`: Audits agreements and outputs a **Contract Risk Score (0-100)** with redlines.
* `spk-generator`: Drafts bilateral service contracts compliant with KUHPerdata Arts. 1320 & 1338.
* `nda-indonesia`: Drafts NDAs with liquidated damages under Indonesian jurisdiction.
* `pdp-compliance`: Audits processing workflows against all 6 Lawful Bases of UU PDP No. 27/2022.
* `legal-memo-id`: Formats disputes into structured Legal Memos (*Posita*, *Legal Basis*, *Analysis*).

### 2. `tax-payroll-id`: Indonesian Tax Engine
* `pph21-calculator`: TER monthly calculation engine (PP 58/2023) & Dec Annual Reconciliation.
* `efaktur-helper`: Validates e-Faktur 4.0 transaction codes (010-090) and PPN 11% matching.
* `thr-calculator`: Payout engine for religious holiday allowances.
* `bpjs-calculator`: Calculations for health and social security contribution splits.
* `spt-tahunan-guide`: Filing workflow for individual tax returns via DJP Online.

### 3. `hr-id`: Labor & Employment Compliance
* `surat-peringatan`: Drafts SP1, SP2, and SP3 warning letters following 6-month statutory windows.
* `sop-perusahaan`: Generates SOPs enforcing overtime limits (Perpu 2/2022 max 4h/day, 18h/week).
* `interview-id`: Candidate scorecards evaluating technical skills and local cultural fit.
* `bpjs-tenagakerja-admin`: SIPP BPJS portal administration workflow guide.
* `phk-calculator`: Statutory severance payout engine under PP 35/2021.

### 4. `ecommerce-id`: Marketplace Operations & SEO
* `deskripsi-produk-seo`: Structural product copy optimized for Shopee & Tokopedia search.
* `cs-komplain-handler`: Customer service protocols for negative reviews and damaged packages.
* `analisis-kompetitor-marketplace`: Extracts feedback gaps from competitor listings.
* `shopee-live-script`: Retention and flash-sale hosting scripts for live streaming.
* `tokopedia-seo-optimizer`: Algorithmic title formula generator (`[Product] + [Brand] + [Spec] + [Keywords]`).
* `buyer-negotiator`: Wholesale (grosir) B2B trade terms negotiation guidelines.

### 5. `content-lokal-id`: Local Copywriting
* `whatsapp-broadcast`: High-conversion anti-spam WhatsApp Business copy.
* `linkedin-x-thread-id`: B2B executive narrative storytelling formats.
* `script-reels-tiktok`: Short-video scripts with visual directions and audio overlays.
* `lokalisasi-slang-indonesia`: Adapts formal copy into natural Indonesian business casual or colloquial tone.
* `press-release-id`: Indonesian 5W+1H journalistic press release template.

---

## 📊 Real-World Execution Examples

### 1. PPh 21 TER & December Reconciliation Example

```javascript
const { calculatePPh21DecemberReconciliation } = require('./engines/pph21-calculator');

// Calculate December Annual Reconciliation for Annual Gross Rp 120M (TK/0)
const result = calculatePPh21DecemberReconciliation(120000000, 'TK/0', 2000000, 200000, true, '2026-03-01');
console.log(result);
```
**Output**:
```json
{
  "annualGrossIncome": 120000000,
  "ptkpStatus": "TK/0",
  "ptkpAmount": 54000000,
  "biayaJabatan": 6000000,
  "annualJhtDeduction": 2400000,
  "netAnnualIncome": 111600000,
  "pkp": 57600000,
  "totalAnnualTaxArt17": 2880000,
  "janToNovTaxWithheld": 2000000,
  "decemberTaxWithheld": 880000,
  "hasNpwp": true,
  "calculationDate": "2026-03-01",
  "rulesetId": "PPH21-2024",
  "rulesetVersion": "1.0.0"
}
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

Our test harness executes over **700+ individual test assertions** across 7 automated test modules:

```bash
# Run full test pipeline
npm test
```

### Test Module Breakdown
1. **Dynamic Plugin & Skill Schema Validation (`tests/schema/validator.test.js`)**: Auto-discovers all subdirectories, parses YAML frontmatter using a strict parser, and validates SemVer manifests.
2. **Cryptographic SHA-256 Ruleset Integrity (`tests/units/engines.test.js`)**: Asserts that ruleset checksums match expected manifests and verifies that modified byte-level files fail closed.
3. **PPh 21 Comprehensive TER Matrix Test (`tests/units/pph21-matrix.test.js`)**: **425 test cases** verifying every bracket boundary across TER Category A, B, C, and December reconciliations.
4. **PHK Severance Statutory Matrix Test (`tests/units/phk-matrix.test.js`)**: **225 test cases** evaluating 25 tenure years across all 9 statutory termination reasons under PP 35/2021.
5. **End-to-End Integration Workflow (`tests/integration/workflow.test.js`)**: 20 assertions evaluating complete employee lifecycles (Onboarding -> Payroll -> BPJS -> THR -> Severance).
6. **Prompt Injection Defense Test (`tests/security/injection.test.js`)**: Asserts that skills handling external documents implement `[UNTRUSTED DATA PAYLOAD]` isolation boundaries.
7. **Adversarial Input Sanitization Test (`tests/security/adversarial.test.js`)**: Verifies that parameter hijacking, negative inputs, and exfiltration scripts are safely neutralized without code execution.

---

## 🛠️ Installation & Setup

Add the repository directly to your OpenCode or OpenWork environment:

```bash
opencode plugins add adamriofc/indonesian-agent-skills
```

---

## 🛡️ Security & Disclaimers

See [`SECURITY.md`](SECURITY.md) for prompt injection defense guidelines and [`PROVENANCE.md`](PROVENANCE.md) for statutory gazette registers.

**Statutory Disclaimer**: *This project provides decision-support tools and deterministic calculation models. Outputs do not constitute formal legal, tax, or accounting advice. High-risk decisions (such as PHK severance execution or contract execution) require review by a licensed advocate or tax consultant.*

## 📄 License

MIT License. See [LICENSE](LICENSE) for details.
