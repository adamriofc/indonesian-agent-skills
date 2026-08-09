# Indonesian Agent Skills (`indonesian-agent-skills`) 🇮🇩

<p align="center">
  <img src="docs/indonesian-agent-skills-hero.svg" alt="Indonesian Agent Skills Banner" width="100%">
</p>

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![CI Pipeline](https://github.com/adamriofc/indonesian-agent-skills/actions/workflows/ci.yml/badge.svg)](https://github.com/adamriofc/indonesian-agent-skills/actions/workflows/ci.yml)
[![OpenCode Compatibility](https://img.shields.io/badge/OpenCode-Compatible-brightgreen.svg)](https://app.openworklabs.com/)
[![LLM-Safe Engine](https://img.shields.io/badge/Hybrid%20Engine-LLM--Safe-orange.svg)](engines/)

Production-oriented compliance, tax, legal, and operational domain-intelligence infrastructure for AI agents operating in the Indonesian business ecosystem. Fully compatible with **OpenWork Desktop**, **OpenCode CLI**, **Claude Code (CLI)**, and other agentic environments.

Unlike probabilistic prompt shortcuts, `indonesian-agent-skills` pairs structured LLM instruction packs with **deterministic Node.js calculation engines** (`engines/`), temporal JSON rulesets (`engines/rules/`), granular statutory provenance metadata (`PROVENANCE.md`), and regulatory changelog tracking (`REGULATORY_CHANGELOG.md`).

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

*Note: Engine math calculation unit assertions, schema manifests, and adversarial injection tests are 100% CI-verified across Node.js versions 18, 20, and 22 on every push via GitHub Actions.*

---

## ⚡ Hybrid Deterministic Engines (`engines/`)

To eliminate LLM math hallucinations on financial and legal figures, sensitive calculations are computed deterministically by Node.js modules before narrative synthesis:

1. **`pph21-calculator.js`**: Complete TER A/B/C calculation engine for supported permanent-employee scenarios (PP 58/2023 & PMK 168/2023) and December Annual Tax Reconciliation using progressive Article 17 UU HPP tariffs with Biaya Jabatan deductions.
2. **`bpjs-calculator.js`**: Computes employer/employee contribution splits for BPJS Kesehatan (Cap Rp 12M) and BPJS TK with effective-date JP wage caps (Rp 10.042.300 through Feb 2025; Rp 10.547.400 from Mar 2025; Rp 11.086.300 from Mar 2026).
3. **`thr-calculator.js`**: Computes statutory prorated THR payouts under Permenaker No. 6/2016.
4. **`phk-calculator.js`**: Evaluates severance payouts (UP, UPMK, UPH) per PP No. 35/2021 across 10+ termination causes.

---

## 📋 Real Output Examples

### 1. `contract-reviewer` Output
```markdown
# CONTRACT AUDIT REPORT

## EXECUTIVE SUMMARY
* **Contract Risk Score**: 68/100
* **Overall Risk Assessment**: HIGH RISK

## FINDINGS BY LEGAL TAXONOMY LAYER
1. **Clause 12.2 (Limitation of Liability)**
   * **Taxonomy Layer**: COMMERCIAL RECOMMENDATION
   * **Issue Identified**: Pihak Kedua holds unlimited liability while Pihak Pertama liability is capped at Rp 0.
   * **Recommended Redline**:
```diff
- Pihak Kedua bertanggung jawab secara penuh tanpa batasan (unlimited liability).
+ Tanggung jawab masing-masing Pihak dibatasi maksimal sebesar nilai total Kontrak yang dibayarkan.
```
```

### 2. `pph21-calculator` Output
```markdown
### PPh 21 Tax Calculation Report

#### Parameter Summary
* **Monthly Gross Salary**: Rp 10.000.000
* **PTKP Status**: TK/0 (Kategori TER A)
* **Identity Validation**: validated_nik_npwp (No 20% penalty applied)

#### Calculation Details
* **Tax Period**: Jan-Nov Monthly Withholding
* **Effective TER Rate**: 2.00%
* **Monthly Tax Withheld**: Rp 200.000
* **Ruleset Version**: 1.0.0 (PPH21-2024)
* **Regulatory Authority**: DJP RI (PP 58/2023)
```

---

## 📦 Plugin Inventory & Skill Catalog

### 1. `legal-id` — Commercial Law & Compliance
* `contract-reviewer`: Audits agreements and outputs a **Contract Risk Score (0-100)** with redlines.
* `spk-generator`: Drafts bilateral service contracts compliant with KUHPerdata Arts. 1320 & 1338.
* `nda-indonesia`: Drafts NDAs with liquidated damages under Indonesian jurisdiction.
* `pdp-compliance`: Audits processing workflows against all 6 Lawful Bases of UU PDP No. 27/2022.
* `legal-memo-id`: Formats disputes into structured Legal Memos (*Posita*, *Legal Basis*, *Analysis*).

### 2. `tax-payroll-id` — Indonesian Tax Engine
* `pph21-calculator`: TER monthly calculation engine (PP 58/2023) & Dec Annual Reconciliation.
* `efaktur-helper`: Validates e-Faktur 4.0 transaction codes (010-090) and PPN 11% matching.
* `thr-calculator`: Payout engine for religious holiday allowances.
* `bpjs-calculator`: Calculations for health and social security contribution splits.
* `spt-tahunan-guide`: Filing workflow for individual tax returns via DJP Online.

### 3. `hr-id` — Labor & Employment Compliance
* `surat-peringatan`: Drafts SP1, SP2, and SP3 warning letters following 6-month statutory windows.
* `sop-perusahaan`: Generates SOPs enforcing overtime limits (Perpu 2/2022 max 4h/day, 18h/week).
* `interview-id`: Candidate scorecards evaluating technical skills and local cultural fit.
* `bpjs-tenagakerja-admin`: SIPP BPJS portal administration workflow guide.
* `phk-calculator`: Statutory severance payout engine under PP 35/2021.

### 4. `ecommerce-id` — Marketplace Operations & SEO
* `deskripsi-produk-seo`: Structural product copy optimized for Shopee & Tokopedia search.
* `cs-komplain-handler`: Customer service protocols for negative reviews and damaged packages.
* `analisis-kompetitor-marketplace`: Extracts feedback gaps from competitor listings.
* `shopee-live-script`: Retention and flash-sale hosting scripts for live streaming.
* `tokopedia-seo-optimizer`: Algorithmic title formula generator (`[Product] + [Brand] + [Spec] + [Keywords]`).
* `buyer-negotiator`: Wholesale (grosir) B2B trade terms negotiation guidelines.

### 5. `content-lokal-id` — Local Copywriting
* `whatsapp-broadcast`: High-conversion anti-spam WhatsApp Business copy.
* `linkedin-x-thread-id`: B2B executive narrative storytelling formats.
* `script-reels-tiktok`: Short-video scripts with visual directions and audio overlays.
* `lokalisasi-slang-indonesia`: Adapts formal copy into natural Indonesian business casual or colloquial tone.
* `press-release-id`: Indonesian 5W+1H journalistic press release template.

---

## 🛠️ Installation & Verification

Add the repository directly to your OpenCode or OpenWork environment:

```bash
opencode plugins add adamriofc/indonesian-agent-skills
```

Run the deterministic engine and golden corpus test suite locally:

```bash
npm install
npm test
```

---

## 🛡️ Security & Disclaimers

See [`SECURITY.md`](SECURITY.md) for prompt injection defense guidelines and [`PROVENANCE.md`](PROVENANCE.md) for statutory gazette registers.

**Statutory Disclaimer**: *This project provides decision-support tools and deterministic calculation models. Outputs do not constitute formal legal, tax, or accounting advice. High-risk decisions (such as PHK severance execution or contract execution) require review by a licensed advocate or tax consultant.*

## 📄 License

MIT License. See [LICENSE](LICENSE) for details.
