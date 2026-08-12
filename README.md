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

## 📌 Overview & Value Proposition

<!-- GENERATED:STATS -->
| Metric | Single Source of Truth Value | Measurement Scope |
|---|---|---|
| **Repository Version** | `v6.5.0` | SemVer release boundary |
| **Canonical Plugins** | `6` | Active plugin packages (`legal-id`, `tax-id`, `hr-id`, `finance-id`, `marketing-id`, `strategic-id`) |
| **Agent Skills** | `87` | Machine-readable `SKILL.md` capability packs |
| **Deterministic Engines** | `38` | Pure Node.js calculation & regulatory diff engines (`engines/`) |
| **Golden Cases** | `94` | Static corpus cases across 27 benchmark domains |
| **Benchmark Assertions** | `424` | Deterministic assertions in `tests/benchmarks/` |
| **Total Test Assertions** | `438+` | Deepened matrix assertions across full `npm test` suite |
| **Node.js Compatibility** | `20 / 22 / 24` | `20` (Minimum), `22` (LTS Recommended), `24` (Current Tested) |
<!-- /GENERATED:STATS -->

**Indonesian Business Agent Skills** is an open-source domain-intelligence infrastructure designed to give AI agents an authentic Indonesian business and regulatory intelligence layer. Built for **OpenWork Desktop**, **OpenCode CLI**, **Claude Code (CLI)**, **Cursor IDE**, **Codex**, and custom agent frameworks, this repository integrates **87 Agent Skills** with **38 Deterministic Computational & Regulatory Diff Engines** (`engines/`) and single-source-of-truth temporal JSON rulesets (`engines/rules/`).

### 💡 Why Standard LLMs Fail at Indonesian Business & Compliance Calculations
Generic AI models (such as unassisted ChatGPT or Claude) predict words probabilistically (*token prediction*). When tasked with calculating TER PPh 21 income tax, PHK severance payouts, or corporate loan interest, standard LLMs encounter 3 critical failure modes:
1. **Arithmetic Hallucination**: AI models guess numbers rather than computing equations, leading to incorrect tax bracket assignments and faulty severance math.
2. **Temporal Ambiguity**: AI models fail to track statutory wage caps and rate adjustments across transition windows (such as BPJS JP wage cap adjustments in March 2025 vs March 2026).
3. **Unverifiable Lineage**: Standard AI responses lack traceable references to official gazettes (*lembaran negara*), rendering them unsuited for corporate audits.

### 🛡️ The Hybrid Architecture Solution
This repository decouples AI **reasoning** from **calculation**:
- **AI (Agent Skill)**: Understands natural language, extracts parameters, and synthesizes explanations.
- **Engine (Node.js)**: Computes exact invariant mathematics (deterministic computation removes LLM arithmetic hallucination within the engine) per official government rulesets.

---

## ⚡ 30-Second Killer Cross-Domain Demo

```text
User: "Perusahaan saya PT Management Consulting (KBLI 70209) dengan omzet Rp 5 Miliar dan 15 karyawan.
       Kami ingin membuka cabang baru dan menambah 10 karyawan. Apakah ekspansi ini aman dari sisi Pajak, HR, Legal, dan Strategi?"

Agent (Skill-Assisted Execution):
1. [KBLI Router]: KBLI 70209 ➔ PROFESSIONAL_SERVICE Archetype (Capacity Unit: Service Practice Lines).
2. [Tax Engine]: PP 20/2026 Ineligibility Flagged (PT Corporate must use General PPh 31E at 11%/22%, not 0.5% UMKM).
3. [HR Engine]: 25 Total Employees ➔ Mandatory Wage Structure & Scale (Permenaker 1/2017) + BPJS JP Cap update.
4. [Legal Engine]: Audit Article 1266 KUHPerdata waiver & PDP Data Processing Addendum (UU 27/2022).
5. [Decision Engine]: MCDA Weighted Score = 8.2/10 (RECOMMENDED WITH TAX REGIME SWITCH).
```

## ⚙️ Compatibility & Testing Matrix

| Agent Runtime / Environment | Integration Level | Status | Verification Mechanism |
|---|---|---|---|
| **Node.js (v20, v22, v24)** | Native Engine Execution (`engines/`) | ✅ **Verified** | CI Matrix (`npm test` 750+ assertions & 92 golden cases) |
| **OpenCode CLI** | Native Skill Integration (`.opencode/skills/`) | ✅ **Verified** | Automated Schema & Skill Protocol Tests |
| **OpenWork Desktop & Cloud** | Native Plugin Manifest (`.claude-plugin/`) | ✅ **Verified** | Marketplace Schema Store & SHA-256 Ruleset Integrity |
| **Claude Code (CLI)** | Native Plugin Installer (`npx skills`) | ✅ **Verified** | Universal Skill Protocol (`SKILL_PROTOCOL.md`) |
| **Cursor IDE** | Skill Shorthand (`.cursor/skills/`) | 🟡 **Compatible** | Agent Skill Standard Structure (`SKILL.md`) |
| **Codex** | Skill Shorthand (`.agents/skills/`) | 🟡 **Compatible** | Agent Skill Standard Structure (`SKILL.md`) |
| **Custom SDK / REST Adapters** | Protocol-Level Adapter | ⚪ **Planned** | Pure Math Engines & Decoupled JSON Rulesets |

---

## 🏗️ System Architecture

```text
                                  [ User / Agent Query ]
                                            │
                                            ▼
                        ┌──────────────────────────────────────┐
                        │      KBLI CONTEXT ROUTER ENGINE      │
                        │ Maps KBLI 2020 ➔ Business Archetype  │
                        └──────────────────┬───────────────────┘
                                           │
                                           ▼
                        ┌──────────────────────────────────────┐
                        │   STRATEGIC APPLICATION PROTOCOL     │
                        │ 12-Step Context & Evidence Discipline│
                        └──────────────────┬───────────────────┘
                                           │
                                           ▼
               ┌──────────────────────────────────────────────────────┐
               │      38 Deterministic Node.js Math & Diff Engines    │
               │ 28 statutory (engines/*.js + SSOT temporal rulesets) │
               │ 8 finance (engines/*.js — pure standard math)        │
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

## 🛠️ Installation & Integration Guide

### 1. Universal Agent Skills CLI (Recommended / Universal)
Install skills directly across any supported agent framework (Claude Code, OpenCode, Codex, Cursor, Antigravity) using `npx`:
```bash
# Install all skills across the repository
npx skills add adamriofc/indonesian-business-agent-skills

# Selective installation by agent platform or skill domain
npx skills add adamriofc/indonesian-business-agent-skills --agent claude-code
npx skills add adamriofc/indonesian-business-agent-skills --skill pph21-calculator
```

### 2. Claude Code Marketplace (Official Plugin Integration)
Register the repository as a marketplace source and install individual plugins:
```bash
# Add the repository as a plugin marketplace source
claude plugin marketplace add adamriofc/indonesian-business-agent-skills

# Install individual plugins from the marketplace
claude plugin install legal-id@indonesian-business-agent-skills
claude plugin install tax-id@indonesian-business-agent-skills
claude plugin install finance-id@indonesian-business-agent-skills
```

### 3. Portable Agent Skills Standard (.agents / .opencode / .cursor)
For native skill discovery without plugins, copy skills to the `.agents/skills/` directory:
```bash
# Canonical cross-agent skills directory
mkdir -p .agents/skills
cp -r legal-id/skills/* .agents/skills/
cp -r tax-id/skills/* .agents/skills/
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
4. The 6 plugins and 87 skills activate automatically.

---

## 📦 Plugin Inventory & Skill Catalog (87 Skills Across 6 Plugins)

All skills and computational engines are mapped in the **Machine-Readable Registry (`registry/index.json`)** with defined *Quality Tiers* (`source-verified`, `tested`, `expert-reviewed`):

### 1. `legal-id`: Commercial Law & Compliance (9 Skills)
* `contract-reviewer`: Audits agreements and outputs a **Contract Risk Score (0-100)** with redlines.
* `compliance-risk`: Multi-Domain Compliance Health Audit (Tax, HR, Legal, PDP, Commerce) outputting a Compliance Score (0-100) & remediation roadmap.
* `spk-generator`: Drafts bilateral service contracts compliant with KUHPerdata Arts. 1320 & 1338.
* `nda-indonesia`: Non-disclosure agreements with DJKI & UU Trade Secret protections.
* `pdp-compliance`: Corporate personal data protection audit under UU No. 27/2022.
* `legal-memo-id`: Indonesian court-spec legal opinions and conflict analysis.
* `haki-trademark-check`: Trademark availability check under UU 20/2016 (Classes 1-45).
* `oss-kbli-navigator`: Maps activities to 5-digit KBLI 2020 and OSS-RBA risk levels.
* `somasi-draft-id`: Drafts formal advocate-standard legal warning letters (Somasi 1, 2, 3).

### 2. `tax-id`: Tax Intelligence, Engineering & Compliance (16 Skills)
* `pph21-calculator`: TER monthly calculation engine (PP 58/2023) & Dec Annual Reconciliation.
* `pph21-grossup`: Solves circular PPh 21 tax allowance equations (Gross-Up) and PMK 66/2023 Natura thresholds.
* `pph23-26-calculator`: Calculates PPh 23 (2% service) and PPh 26 (20% offshore / Tax Treaty DGT).
* `pph-final-umkm`: Calculates 0.5% UMKM final tax with Rp 500M OP threshold exemption (PP 55/2022 & PP 20/2026).
* `pph-badan-calculator`: Corporate Income Tax (22%) with Article 31E UU PPh sliding scale facility (&le; 4.8B, 4.8B–50B, > 50B).
* `transfer-pricing-audit`: Thin Capitalization (DER 4:1 max ceiling), interest barriers, & secondary dividend adjustments (PMK 172/2023).
* `ppn-ppnbm-advanced`: Statutory 12% PPN, PPnBM luxury tax tiers (10%-200%), import CIF bases, & DJP Coretax equalisation.
* `regulatory-impact`: Evaluates statutory transitions (PP 20/2026, BPJS caps) to compute business impact, checklists, and deadlines.
* `tax-planning`: Evaluates entity tax regime efficiency (PP 20/2026 vs General PPh, Gross vs Gross-Up, Dividend vs Salary).
* `tax-optimization`: Deductible expense optimization (Pasal 6 vs Pasal 9 UU PPh), PPh 21 Dec reconciliation, and PPh 23/26 invoice splits.
* `tax-risk-analysis`: Detects DJP equalisation discrepancies, transfer pricing indicators (PMK 172/2023), and SP2DK audit triggers.
* `tax-audit-preparation`: Assembles SP2DK audit response packages, tax equalisation reconciliation statements, and document indexes.
* `tax-cross-border`: Evaluates offshore withholding (PPh 26 20% vs Tax Treaty DGT form rate optimization) and Permanent Establishment (BUT) risk.
* `laporan-keuangan-psak`: Formats trial balances into SAK EMKM / SAK EP compliant financial statements.
* `efaktur-helper`: Validates e-Faktur & DJP Coretax tax invoices for statutory PPN 12% & 11/12 DPP Nilai Lain (effective 11% burden).
* `regulatory-diff`: Compares versioned SSOT ruleset transitions across effective date windows (e.g. PP 55/2022 ➔ PP 20/2026).

### 3. `hr-id`: Labor, Employment & Payroll Compliance (12 Skills)
* `surat-peringatan`: Drafts SP1, SP2, and SP3 warning letters following 6-month statutory windows.
* `sop-perusahaan`: Generates SOPs enforcing overtime limits (Perpu 2/2022 max 4h/day, 18h/week).
* `interview-id`: Candidate scorecards evaluating technical skills and local cultural fit.
* `bpjs-tenagakerja-admin`: SIPP BPJS portal administration workflow guide.
* `phk-calculator`: Statutory severance payout engine under PP 35/2021.
* `phk-advanced-matrix`: Complex termination scenarios (retirement crossover, efficiency due to loss vs prevention of loss, merger employee/employer refusal).
* `pkwt-pkwtt-checker`: Audits contract worker duration (max 5 yrs) and computes statutory PKWT compensation.
* `pkwtt-checker`: Audits permanent employment (PKWTT) contracts, probation rules (max 3 months), and automatic conversion triggers.
* `struktur-skala-upah`: Builds statutory Wage Structure and Scale frameworks per Permenaker 1/2017.
* `thr-calculator`: Payout engine for religious holiday allowances.
* `bpjs-calculator`: Calculations for health and social security contribution splits.
* `spt-tahunan-guide`: Filing workflow for individual tax returns via DJP Online.

### 4. `finance-id`: Business Finance & Accounting (15 Skills)
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
* `vc-term-sheet-waterfall`: Venture capital startup exit liquidation preference waterfall (Seniority, Pari Passu, Participating with Caps).
* `business-scenario`: Maps business profile across the 8 Stages of the Indonesian Business Lifecycle for an integrated compliance roadmap.
* `decision-engine`: Evaluates financial & operational metrics to generate deterministic, prioritized business decision recommendations.

### 5. `marketing-id`: Marketing, Growth & Commerce (25 Skills)
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
* `whatsapp-broadcast`: High-conversion anti-spam WhatsApp Business copy.
* `linkedin-x-thread-id`: B2B executive narrative storytelling formats.
* `script-reels-tiktok`: Short-video scripts with visual directions and audio overlays.
* `lokalisasi-slang-indonesia`: Adapts formal copy into natural Indonesian business casual or colloquial tone.
* `press-release-id`: Indonesian 5W+1H journalistic press release template.
* `instagram-reels-carousel`: Visual hooks for IG Reels and multi-slide Carousel post scripts.
* `youtube-shorts-script`: Retention scripts for 0-60s Shorts and long-form video outlines.
* `kol-brief-contract`: KOL/Influencer campaign briefs, SOWs, and content usage rights contracts.
* `gmb-local-seo`: Google Business Profile (GMB) map optimization and local search copy.
* `market-sizing`: Evaluates TAM/SAM/SOM market opportunity using top-down adoption models and deterministic calculations.
* `customer-segmentation`: Segments customer markets using firmographic, behavioral, and willingness-to-pay criteria.
* `jobs-to-be-done`: Evaluates customer functional, emotional, and social Jobs-To-Be-Done (JTBD) drivers.
* `voice-of-customer`: Synthesizes customer reviews, survey responses, and complaint logs to extract pain points.
* `positioning-analysis`: Establishes strategic brand positioning frameworks (Target, Frame of Reference, Point of Difference).
* `go-to-market`: Formulates structured Go-To-Market (GTM) launch roadmaps, channels, pricing, and acquisition KPIs.


### 6. `strategic-id`: Strategic Management & Corporate Strategy (10 Skills)
* `porter-three-tests`: Evaluates diversification and M&A strategies using Porter's 3 Tests (Attractiveness, Cost of Entry, Better-Off).
* `porter-five-forces`: Analyzes industry structural attractiveness across Supplier, Buyer, Substitutes, Entrants, and Rivalry.
* `bcg-matrix`: Portfolio matrix evaluation (Star, Cash Cow, Question Mark, Dog) with deterministic engine scoring.
* `ansoff-matrix`: Evaluates corporate growth vectors (Market Penetration/Development, Product Development, Diversification).
* `vrio-analysis`: Evaluates internal corporate resources (Valuable, Rare, Inimitable, Organized) for sustained competitive advantage.
* `value-chain-analysis`: Deconstructs Primary and Support activities to isolate cost drivers and differentiation sources.
* `strategic-planning`: Structured strategic planning linking Vision/Mission to Objectives, KPIs, Initiatives, and Roadmaps.
* `decision-making`: Executive decision-making framework powered by Multi-Criteria Decision Analysis (MCDA) weighted scoring.
* `scenario-planning`: Evaluates macro/micro What-If scenarios using deterministic sensitivity simulation math.
* `strategic-risk-analysis`: Computes corporate strategic risk scores (Likelihood x Impact x Velocity) to generate risk heatmaps.

---

## 📊 Real-World Execution Examples

All outputs below are **actual engine outputs** (run on Node.js 20+, `npm test` green).

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

### 2. UMKM Tax PP 20/2026 Transition & Regulatory Diff — Actual Engine Output

```javascript
const { compareRulesets } = require('./engines/regulatory-diff');
const diff = compareRulesets('umkm', 'UMKM-2022', 'UMKM-2026');
console.log(diff);
```

```json
{
  "domain": "umkm",
  "comparison": "UMKM-2022 ➔ UMKM-2026",
  "effectiveTransitionDate": "2026-04-22",
  "oldRuleset": { "id": "UMKM-2022", "version": "1.0.0", "status": "ARCHIVED" },
  "newRuleset": { "id": "UMKM-2026", "version": "1.0.0", "status": "RELEASED" },
  "totalChanges": 2,
  "changes": [
    {
      "field": "eligible_taxpayers",
      "removedEntities": ["corporate", "pt", "cv", "firma"],
      "addedEntities": [],
      "isChanged": true
    }
  ]
}
```

---

## ❓ Frequently Asked Questions (FAQ)

### Q1: I am a business owner / non-technical user. How do I use this repository?
> **Answer**: You do not need to be a developer! You can use this in 2 easy ways:
> 1. **No-Code Interactive**: Open `docs/playground.html` directly in your browser to run interactive calculators for PPh 21, UMKM PP 20/2026, Break-Even, and Loan Amortization.
> 2. **Via AI Agents**: If you use an AI app like Claude Code, OpenWork, or Cursor, simply run `npx skills add adamriofc/indonesian-business-agent-skills`. Afterward, you can ask questions naturally in plain language (e.g. *"What is the PPh 21 tax for a Rp 10M monthly salary?"*).

### Q2: Why should I not rely on unassisted ChatGPT / standard AI for Indonesian tax or severance calculations?
> **Answer**: Standard AI predicts words probabilistically (*token prediction*) rather than executing math. Unassisted AI encounters:
> - **Arithmetic Hallucination**: Producing plausible-looking numbers based on invalid formulas.
> - **Outdated Regulations**: Missing recent statutory changes such as BPJS wage cap adjustments or PP 20/2026 UMKM eligibility rules.
> This repository forces the AI to call a **Node.js Engine** (pure math calculator) connected to official government rulesets (`ruleset JSON`), ensuring a **100% pass rate on the curated golden benchmark corpus by isolating mathematical calculations inside deterministic Node.js engines**.

### Q3: Does this repository support the latest PP No. 20 Year 2026 UMKM tax regulations?
> **Answer**: **Yes, 100%!** The repository maintains versioned temporal rulesets:
> - `UMKM-2022` (PP 55/2022): Effective until April 21, 2026.
> - `UMKM-2026` (PP 20/2026): Effective April 22, 2026 onwards. Under the updated statute:
>   - **Individual Taxpayers (OP)**: Eligible for 0.5% final tax with a Rp 500M annual non-taxable threshold.
>   - **Single-Person PT (PT Perorangan) & Cooperatives**: Eligible for 0.5% final tax without the Rp 500M exemption.
>   - **General Corporate PT / CV / Firma**: **Not eligible** for 0.5% final tax (must calculate under general Corporate PPh).
>   - **Turnover Limit**: Maximum Rp 4.8 Billion gross annual turnover ceiling.

### Q4: How does this repository handle 12% PPN and DJP Coretax tax invoices?
> **Answer**: The `efaktur-helper` and `ppn-ppnbm-advanced` skills reflect **UU HPP No. 7/2021**, **PMK No. 131/2024**, and **PER-01/PJ/2025**:
> - Statutory PPN rate is **12%**.
> - Non-luxury goods (Transaction Code 04) utilize **Other Basis DPP ($11/12 \times \text{DPP}$)** for an effective tax burden of **11%** ($\text{PPN} = 12\% \times \frac{11}{12} \times \text{DPP}$).
> - Supports DJP Coretax and e-Faktur Desktop invoice auditing formats.

### Q5: What is the difference between a 'Skill', an 'Engine', and a 'Ruleset'?
> **Answer**:
> - **Skill (`SKILL.md`)**: The prompt instructions that guide the AI on how to interpret user queries.
> - **Engine (`engines/*.js`)**: Pure JavaScript math functions that perform calculations.
> - **Ruleset (`engines/rules/*.json`)**: Single-source-of-truth JSON database containing official government rates and effective date windows.

### Q6: Is my business and financial data secure?
> **Answer**: **100% Secure.** All computational engines (`engines/`) execute locally on your machine with zero third-party dependencies and zero external network calls.

### Q7: Can calculations from this repository be used as formal legal or tax opinions?
> **Answer**: Outputs serve as decision-support intelligence. While calculation math is 100% verified against statutory gazettes, high-risk decisions (such as formal PHK severance execution or tax audit filings) require review by a licensed Indonesian advocate or tax consultant.

### Q8: How do we integrate these engines into our corporate ERP, HRIS, or custom API?
> **Answer**: Refer to `integrations/README.md`. Since engines are pure modular JavaScript functions, you can import functions (`calculatePPh21Monthly`, `calculateCorporateTax`, `auditTransferPricingThinCap`, `calculatePhk`) directly into your backend Node.js, REST API, or ERP system.

---

## 🧪 Comprehensive Test & Verification Suite

Our test harness executes over **900+ individual test assertions** across 9 automated test modules:

```bash
# Run full test pipeline
npm test
```

---

## 🛡️ Security & Disclaimers

See [`SECURITY.md`](SECURITY.md) for prompt injection defense guidelines, [`PROVENANCE.md`](PROVENANCE.md) for the statutory gazette register & Section 7 Expert Review Register, [`REGULATORY_PIPELINE.md`](REGULATORY_PIPELINE.md) for the official update procedure, and [`REGULATORY_CHANGELOG.md`](REGULATORY_CHANGELOG.md) for regulatory amendments.

**Release Trust Anchor**: `SHA256SUMS.txt` holds SHA-256 checksums for every ruleset; verified via `./scripts/sha256sums.sh verify` and in CI.

## 📄 License

MIT License. See [LICENSE](LICENSE) for details.
