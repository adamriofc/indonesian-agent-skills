# Regulatory Versioning & Amendment Changelog (`REGULATORY_CHANGELOG.md`)

This log tracks statutory changes, gazette updates, and their impact on calculation engines and agent skills.

---

## 2026-08-10 — Version 1.0.0 Release (Expansion to 42 Skills & 8 Engines)

### PPh 23 / 26 Withholding & PPh Final UMKM (`tax-payroll-id`)
* **Active Statutes**: UU No. 36/2008, UU No. 7/2021 (HPP), PP No. 55/2022.
* **Engine Implementations**: `engines/pph23-26-calculator.js`, `engines/umkm-tax-calculator.js`.
* **Features**:
  * PPh 23 2% service rate & 100% non-NPWP penalty (4%).
  * PPh 26 20% offshore rate & Tax Treaty (P3B) DGT Form rate reductions.
  * PPh Final UMKM 0.5% calculation with Rp 500M annual non-taxable threshold exemption for Individual Wajib Pajak (OP).

### PKWT Compensation & Labor Compliance (`hr-id`)
* **Active Statutes**: PP No. 35/2021 (Pasal 15-17).
* **Engine Implementation**: `engines/pkwt-compensation-calculator.js`.
* **Features**:
  * Prorated PKWT Compensation payout at contract expiration (`(Masa Kerja / 12) x Monthly Wage`).

### Marketplace Fee & Margin Calculator (`ecommerce-id`)
* **Engine Implementation**: `engines/marketplace-fee-calculator.js`.
* **Features**:
  * Fee rates for Shopee (Star, Star+, Mall), Tokopedia (Power Merchant, Pro, Official Store), and TikTok Shop.
  * Free Shipping Extra fee calculations capped at Rp 10.000 per item.

### PPh 21 Taxation (`tax-payroll-id`)
* **Active Statutes**: PP No. 58/2023, PMK No. 168/2023, UU No. 7/2021 (HPP).
* **Rule IDs**: `PPH21-TER-A-01`, `PPH21-ART17-01`.
* **Engine Implementation**: `engines/pph21-calculator.js`
* **Features**: TER Monthly withholding tables & December Annual Tax Reconciliation.

### BPJS Social Security (`tax-payroll-id` & `hr-id`)
* **Active Statutes**: Perpres 64/2020 (Health), PP 44/2015 (JHT/JKK/JKM), PP 45/2015 (JP).
* **Rule IDs**: `BPJS-KES-01`, `BPJS-JP-01`.
* **Engine Implementation**: `engines/bpjs-calculator.js`
* **Temporal Wage Caps**: March transitions for 2024, 2025, and 2026.
