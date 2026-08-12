# Regulatory Versioning, Freshness & Amendment Changelog (\`REGULATORY_CHANGELOG.md\`)

This log tracks statutory amendments, gazette updates, ruleset freshness statuses, and their impact on calculation engines and agent skills.

---

## 🛡️ Regulatory Ruleset Freshness & Governance Policy

Every statutory ruleset in \`engines/rules/\` is governed under a strict Freshness Lifecycle Policy:

| Freshness Status | Definition | Review Frequency | Action Required |
|---|---|---|---|
| **\`CURRENT\`** | Statute verified against active Lembaran Negara / PMK gazette | Every 90 days or upon gazette issue | None; active in production |
| **\`REVIEW_DUE\`** | Statutory amendment published; review scheduled | Within 14 days of gazette release | Audit engine ruleset & tests |
| **\`STALE\`** | Ruleset exceeds 180 days without gazette re-audit | Immediate maintenance required | Flag in engine warnings |
| **\`SUPERSEDED\`** | Replaced by new statutory regulation (e.g., PP 20/2026 replacing PP 55/2022) | Historical reference only | Soft-deprecate old ruleset |

### Regulatory Update Provenance Format
Every regulatory update recorded in this log specifies:
1. **Old Rule / Statute**
2. **New Rule / Gazette Reference**
3. **Effective Date**
4. **Amendment Reason & Impact**
5. **Benchmark Cases & Engine Modules Affected**

---

## 2026-08-12 — Version 6.4.1 Hardening & Freshness Governance Sync

| Ruleset ID | Target Statute | Effective Date | Governance Freshness Status | Impacted Modules |
|---|---|---|---|---|
| \`PPH21-2024\` | PP No. 58/2023 & PMK No. 168/2023 | 2024-01-01 | **\`CURRENT\`** | \`engines/pph21-calculator.js\` |
| \`BPJS-2026\` | Perpres 64/2020 & PP 45/2015 (March 2026 transition) | 2026-03-01 | **\`CURRENT\`** | \`engines/bpjs-calculator.js\` |
| \`UMKM-2026\` | PP No. 20/2026 (Corporate PT exclusion) | 2026-04-22 | **\`CURRENT\`** | \`engines/umkm-tax-calculator.js\` |
| \`PPN-2025\` | PMK No. 131/2024 & UU HPP (PPN 12%) | 2025-01-01 | **\`CURRENT\`** | \`engines/ppn-ppnbm-calculator.js\` |
| \`PKWT-2021\` | PP No. 35/2021 (Probation conversion) | 2021-02-02 | **\`CURRENT\`** | \`engines/pkwtt-calculator.js\` |
| \`THINCAP-2023\` | PMK No. 172/2023 (DER 4:1 limitation) | 2023-12-29 | **\`CURRENT\`** | \`engines/transfer-pricing-engine.js\` |

---

## 2026-08-10 — Version 2.0.0 Release (Finance Core, PP 20/2026 & PPN 12% Updates)

### PPh Final UMKM & PP 20/2026 Amendment (\`tax-id\`)
* **Active Statutes**: PP No. 55/2022 (\`UMKM-2022\`) & PP No. 20/2026 (\`UMKM-2026\`, effective 2026-04-22).
* **Engine Implementation**: \`engines/umkm-tax-calculator.js\`.
* **Ruleset**: \`engines/rules/umkm.json\`.
* **Features**:
  * PPh Final 0.5% rate restricted to eligible entities under PP 20/2026: Orang Pribadi (OP), Perseroan Perorangan (PT Perorangan), and Koperasi.
  * General Corporate PT / CV / Firma marked **NOT Eligible** under \`UMKM-2026\` (requires general corporate PPh).
  * Rp 500M non-taxable threshold preserved exclusively for OP.
  * Maximum Rp 4.8 Billion gross turnover ceiling enforced (over Rp 4.8B renders taxpayer ineligible for final tax).

### PPN 12% & Coretax Invoice Audit (\`tax-id\`)
* **Active Statutes**: UU No. 7/2021 (HPP), PMK No. 131/2024, PER-01/PJ/2025, PER-11/PJ/2025.
* **Skill Implementation**: \`tax-id/skills/efaktur-helper/SKILL.md\`.
* **Features**:
  * PPN 12% statutory rate and 11/12 DPP Nilai Lain effective 11% burden calculation (\`12% x 11/12 x DPP\`).
  * Updated DJP Coretax & e-Faktur transaction codes (01, 02, 03, 04, 07, 08).

### Business Finance & Accounting Core (\`finance-id\`)
* **8 Deterministic Math Engines**: \`engines/break-even.js\`, \`depreciation.js\`, \`npv.js\`, \`irr.js\`, \`loan-amortization.js\`, \`financial-ratios.js\`, \`working-capital.js\`, \`eoq.js\`.
* **12 Agent Skills**: \`accounting-basics\`, \`break-even-analysis\`, \`budgeting-forecasting\`, \`business-feasibility\`, \`capital-budgeting\`, \`cash-flow-analysis\`, \`cost-accounting\`, \`financial-modeling\`, \`financial-ratio-analysis\`, \`financial-statements\`, \`unit-economics\`, \`working-capital\`.

---

## 2026-08-10 — Version 1.0.0 Release (Expansion to 42 Skills & 8 Engines)

### PPh 23 / 26 Withholding & PPh Final UMKM (\`tax-id\`)
* **Active Statutes**: UU No. 36/2008, UU No. 7/2021 (HPP), PP No. 55/2022.
* **Engine Implementations**: \`engines/pph23-26-calculator.js\`, \`engines/umkm-tax-calculator.js\`.
* **Features**:
  * PPh 23 2% service rate & 100% non-NPWP penalty (4%).
  * PPh 26 20% offshore rate & Tax Treaty (P3B) DGT Form rate reductions.
  * PPh Final UMKM 0.5% calculation with Rp 500M annual non-taxable threshold exemption for Individual Wajib Pajak (OP).

### PKWT Compensation & Labor Compliance (\`hr-id\`)
* **Active Statutes**: PP No. 35/2021 (Pasal 15-17).
* **Engine Implementation**: \`engines/pkwt-compensation-calculator.js\`.
* **Features**:
  * Prorated PKWT Compensation payout at contract expiration (\`(Masa Kerja / 12) x Monthly Wage\`).

### Marketplace Fee & Margin Calculator (\`marketing-id\`)
* **Engine Implementation**: \`engines/marketplace-fee-calculator.js\`.
* **Features**:
  * Fee rates for Shopee (Star, Star+, Mall), Tokopedia (Power Merchant, Pro, Official Store), and TikTok Shop.
  * Free Shipping Extra fee calculations capped at Rp 10.000 per item.

### PPh 21 Taxation (\`tax-id\`)
* **Active Statutes**: PP No. 58/2023, PMK No. 168/2023, UU No. 7/2021 (HPP).
* **Rule IDs**: \`PPH21-TER-A-01\`, \`PPH21-ART17-01\`.
* **Engine Implementation**: \`engines/pph21-calculator.js\`
* **Features**: TER Monthly withholding tables & December Annual Tax Reconciliation.

### BPJS Social Security (\`tax-id\` & \`hr-id\`)
* **Active Statutes**: Perpres 64/2020 (Health), PP 44/2015 (JHT/JKK/JKM), PP 45/2015 (JP).
* **Rule IDs**: \`BPJS-KES-01\`, \`BPJS-JP-01\`.
* **Engine Implementation**: \`engines/bpjs-calculator.js\`
* **Temporal Wage Caps**: March transitions for 2024, 2025, and 2026.
