# Regulatory Versioning & Amendment Changelog (`REGULATORY_CHANGELOG.md`)

This log tracks statutory changes, gazette updates, and their impact on calculation engines and agent skills.

---

## 2026-08-10 — Version 1.0.0 Release

### PPh 21 Taxation (`tax-payroll-id`)
* **Active Statutes**: PP No. 58/2023, PMK No. 168/2023, UU No. 7/2021 (HPP).
* **Rule IDs**: `PPH21-TER-A-01`, `PPH21-ART17-01`.
* **Engine Implementation**: `engines/pph21-calculator.js`
* **Features**:
  * TER Monthly withholding tables (Kategori A, B, C).
  * December Annual Tax Reconciliation (Art. 17 progressive tariffs: 5%, 15%, 25%, 30%, 35%).
  * Biaya Jabatan deductions (5% max Rp 500.000/month or Rp 6.000.000/year).
  * 20% Non-NPWP penalty multiplier.

### BPJS Social Security (`tax-payroll-id` & `hr-id`)
* **Active Statutes**: Perpres 64/2020 (Health), PP 44/2015 (JHT/JKK/JKM), PP 45/2015 (JP).
* **Rule IDs**: `BPJS-KES-01`, `BPJS-JP-01`.
* **Engine Implementation**: `engines/bpjs-calculator.js`
* **Temporal Wage Caps**:
  * **2024-03-01 to 2025-02-28**: BPJS Kes Cap Rp 12.000.000; BPJS JP Cap Rp 10.042.300 (BPJS TK SE 2024).
  * **2025-03-01 to 2026-02-28**: BPJS Kes Cap Rp 12.000.000; BPJS JP Cap Rp 10.547.400 (BPJS TK SE B/726/022025).
  * **2026-03-01 to Present**: BPJS Kes Cap Rp 12.000.000; BPJS JP Cap Rp 11.086.300 (BPJS TK SE B/3307/022026).

### Labor Severance (`hr-id`)
* **Active Statutes**: PP No. 35 Tahun 2021 (Pasal 40-52).
* **Rule IDs**: `PHK-UP-01`, `PHK-UPMK-01`.
* **Engine Implementation**: `engines/phk-calculator.js`
* **Multipliers**: Pesangon (UP max 9 mo), UPMK (max 10 mo), UPH (unused leave days).

### Personal Data Protection (`legal-id`)
* **Active Statutes**: UU No. 27 Tahun 2022.
* **Rule IDs**: `PDP-BASES-01`.
* **Skill Implementation**: `legal-id/skills/pdp-compliance`
* **Framework**: Audit across 6 Lawful Bases (Consent, Contract, Legal Obligation, Vital Interest, Public Task, Legitimate Interest) and 72-hour breach notification.
