# Regulatory Versioning & Amendment Changelog (`REGULATORY_CHANGELOG.md`)

This log tracks statutory changes, gazette updates, and their impact on calculation engines and agent skills.

---

## 2026-08-10 — Initial Release Snapshot

### PPh 21 Taxation (`tax-payroll-id`)
* **Active Statutes**: PP No. 58/2023, PMK No. 168/2023, UU No. 7/2021 (HPP).
* **Engine Implementation**: `engines/pph21-calculator.js`
* **Features**:
  * TER Monthly withholding tables (Kategori A, B, C).
  * December Annual Tax Reconciliation (Art. 17 progressive tariffs: 5%, 15%, 25%, 30%, 35%).
  * Biaya Jabatan deductions (5% max Rp 500.000/month or Rp 6.000.000/year).
  * 20% Non-NPWP penalty multiplier.
* **Verification Status**: Verified against DJP e-SPT/PMK 168 sample tables.

### BPJS Social Security (`tax-payroll-id` & `hr-id`)
* **Active Statutes**: Perpres 64/2020 (Health), PP 44/2015 (JHT/JKK/JKM), PP 45/2015 (JP).
* **Engine Implementation**: `engines/bpjs-calculator.js`
* **Caps**: BPJS Kes Cap Rp 12.000.000; BPJS JP Cap Rp 10.042.300.

### Labor Severance (`hr-id`)
* **Active Statutes**: PP No. 35 Tahun 2021 (Pasal 40-52).
* **Engine Implementation**: `engines/phk-calculator.js`
* **Multipliers**: Pesangon (UP max 9 mo), UPMK (max 10 mo), UPH (unused leave days).

### Personal Data Protection (`legal-id`)
* **Active Statutes**: UU No. 27 Tahun 2022.
* **Skill Implementation**: `legal-id/skills/pdp-compliance`
* **Framework**: Audit across 6 Lawful Bases (Consent, Contract, Legal Obligation, Vital Interest, Public Task, Legitimate Interest) and 72-hour breach notification.
