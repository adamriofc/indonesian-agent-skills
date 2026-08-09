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

`indonesian-agent-skills` is a production-oriented compliance, tax, labor, legal, and operational domain-intelligence infrastructure for AI agents operating within the Indonesian corporate and commercial environment. 

Designed natively for **OpenWork Desktop**, **OpenCode CLI**, **Claude Code (CLI)**, **Cursor IDE**, and custom agent frameworks, this suite decouples probabilistic language reasoning from deterministic regulatory mathematics.

---

## ⚡ Why `indonesian-agent-skills`? (Problem vs. Solution)

| General AI Prompting (Probabilistic) | `indonesian-agent-skills` (Hybrid Engine) |
|---|---|
| **Hallucinated Math**: LLMs attempt arithmetic directly in token prediction, causing tax and severance errors. | **Deterministic Computation**: Sensitive calculations execute in pure Node.js modules before narrative output. |
| **Outdated Regulatory Data**: Assumes static tax rates or old pre-Cipta Kerja severance rules. | **Versioned Temporal Rulesets**: Decoupled JSON rulesets with effective dates (e.g. March 1st BPJS JP caps). |
| **Generic Advice**: Treats local contracts with generic global legal templates. | **Statutory Precision**: Enforces exact Indonesian laws (KUHPerdata, PP 58/2023, PP 35/2021, UU PDP 27/2022). |
| **Vulnerable to Injection**: External contract text can overwrite system role instructions. | **Isolated Payloads**: Enforces strict `[UNTRUSTED DATA PAYLOAD]` prompt isolation boundaries. |

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

## 🔑 Key Architectural Pillars

### 1. Hybrid Execution Engines (`engines/`)
Financial and statutory calculations are executed deterministically in vanilla Node.js code files (`pph21-calculator.js`, `bpjs-calculator.js`, `thr-calculator.js`, `phk-calculator.js`). The LLM acts solely as a parameter extractor and narrative explainer.

### 2. Temporal Rulesets (`engines/rules/`)
Tax rates and statutory wage caps change periodically. Regulations are stored in versioned JSON rulesets containing `effective_from` and `effective_to` fields, preventing historical calculation drift.

### 3. Cryptographic Checksum Integrity (`engines/rules/integrity.js`)
On runtime initialization, the engine computes SHA-256 checksums of ruleset JSON files to detect tampering. If an unregistered or modified file is loaded, the engine fails closed immediately.

### 4. 4-Layer Legal Taxonomy & Risk Scoring
Legal skills classify findings into four explicit layers:
* `STATUTORY REQUIREMENT`: Mandatory legal obligations under Indonesian statutes.
* `MARKET PRACTICE`: Standard local commercial drafting positions.
* `COMMERCIAL RECOMMENDATION`: Risk mitigation recommendations.
* `NEGOTIATION POSITION`: Tactical points for client protection.

---

## 🔌 Platform Compatibility Matrix

| Environment | Integration Mode | Native / Adapter | Tested Status |
|---|---|---|---|
| **OpenWork Desktop** | Native Plugin Manifest | `plugin.json` | 🟢 Supported / Manually Verified |
| **OpenCode CLI** | Native Plugin Import | `opencode plugins add` | 🟢 Supported / Manually Verified |
| **Claude Code / Cowork** | Knowledge Plugin | Native `.claude-plugin` | 🟢 Supported / Manually Verified |
| **Cursor IDE** | Rule Context Adapter | `.cursorrules` / `.mdc` | 🟡 Community Adapter |
| **VS Code Agent** | System Prompt Context | Markdown Reference | 🟡 Compatible |
| **ChatGPT / Custom GPTs** | Knowledge Attachment | Static Reference | 🟡 Manual Import |

---

## 📦 Installed Plugins & Skill Catalog

### 1. `legal-id` — Commercial Law & Contract Administration
| Skill Name | Description | Statute / Basis |
|---|---|---|
| `contract-reviewer` | Audits commercial contracts and outputs a Contract Risk Score (0-100) with redlines. | KUHPerdata Arts. 1243, 1266, 1320, 1338 |
| `spk-generator` | Drafts bilateral service agreements (Surat Perjanjian Kerja) with BAST workflows. | KUHPerdata Arts. 1320 & 1338 |
| `nda-indonesia` | Drafts NDAs with liquidated damages under Indonesian jurisdiction. | KUHPerdata & UU No. 30/2000 |
| `pdp-compliance` | Audits data pipelines against all 6 Lawful Bases of UU PDP No. 27/2022. | UU No. 27/2022 Pasal 20 |
| `legal-memo-id` | Formats disputes into legal opinions (*Posita*, *Legal Basis*, *Analysis*). | Local Advocate Standards |

### 2. `tax-payroll-id` — Indonesian Tax Engine
| Skill Name | Description | Statute / Basis |
|---|---|---|
| `pph21-calculator` | Calculates TER monthly taxes & December Annual Reconciliation. | PP 58/2023 & PMK 168/2023 |
| `efaktur-helper` | Validates e-Faktur 4.0 transaction codes (010-090) and PPN 11% matching. | PER-03/PJ/2022 & UU HPP |
| `thr-calculator` | Calculates statutory prorated holiday allowances. | Permenaker No. 6/2016 |
| `bpjs-calculator` | Computes BPJS Kesehatan & BPJS Ketenagakerjaan contribution splits and caps. | Perpres 64/2020 & PP 45/2015 |
| `spt-tahunan-guide` | Workflow guide for filing individual tax forms (1770 / 1770S / 1770SS). | DJP Online Guidelines |

### 3. `hr-id` — Labor & Employment Compliance
| Skill Name | Description | Statute / Basis |
|---|---|---|
| `surat-peringatan` | Drafts SP1, SP2, and SP3 warning letters following 6-month statutory windows. | PP 35/2021 & UU 13/2003 |
| `sop-perusahaan` | Generates SOPs enforcing overtime limits (Perpu 2/2022 max 4h/day, 18h/week). | Perpu 2/2022 & PP 35/2021 |
| `interview-id` | Scorecards evaluating technical competence and local cultural fit. | Indonesian HR Rubrics |
| `bpjs-tenagakerja-admin` | Operational manual for HR teams managing the SIPP BPJS portal. | BPJS TK SIPP Manual |
| `phk-calculator` | Calculates severance, UPMK, and UPH payouts per PP No. 35/2021 across 10+ reasons. | PP 35/2021 Articles 40-52 |

### 4. `ecommerce-id` — Marketplace Operations & SEO
| Skill Name | Description | Target Platform |
|---|---|---|
| `deskripsi-produk-seo` | Structural product copy with mandatory unboxing video disclaimers. | Shopee / Tokopedia / TikTok Shop |
| `cs-komplain-handler` | Resolution protocols for 1-star reviews, damaged items, and shipping delays. | Marketplace Resolution Center |
| `analisis-kompetitor-marketplace` | Extracts quality flaws and pricing gaps from competitor reviews. | Marketplace Analytics |
| `shopee-live-script` | 3-minute retention loops and flash-sale hosting scripts. | Shopee Live / TikTok Live |
| `tokopedia-seo-optimizer` | Algorithmic title formula generator (`[Product] + [Brand] + [Spec] + [Keywords]`). | Tokopedia / Shopee |
| `buyer-negotiator` | Wholesale (grosir) B2B trade terms negotiation guidelines. | B2B Grosir Transactions |

### 5. `content-lokal-id` — Local Copywriting
| Skill Name | Description | Style / Format |
|---|---|---|
| `whatsapp-broadcast` | High-conversion anti-spam WhatsApp Business direct copy. | WA Business API |
| `linkedin-x-thread-id` | Storytelling formats for local professional networks. | LinkedIn Posts / X Threads |
| `script-reels-tiktok` | Short video scripts with visual directions and audio overlay cues. | TikTok / Instagram Reels |
| `lokalisasi-slang-indonesia` | Adapts formal copy into natural Indonesian business casual or colloquial tone. | Local Colloquial |
| `press-release-id` | Standard 5W+1H press releases for local media outlets. | Media Release Format |

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

Read [`SECURITY.md`](SECURITY.md) for prompt injection defense guidelines and [`PROVENANCE.md`](PROVENANCE.md) for statutory gazette registers.

**Statutory Disclaimer**: *This project provides decision-support tools and deterministic calculation models. Outputs do not constitute formal legal, tax, or accounting advice. High-risk decisions (such as PHK severance execution or contract execution) require review by a licensed advocate or tax consultant.*

## 📄 License

MIT License. See [LICENSE](LICENSE) for details.
