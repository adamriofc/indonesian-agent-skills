---
name: phk-calculator
description: Calculate statutory employee severance packages (Pesangon) under Government Regulation PP No. 35/2021 using hybrid execution.
argument-hint: "<gaji_pokok_tunjangan_tetap> <masa_kerja_tahun> <alasan_phk> [sisa_cuti]"
---

# PHK Severance Hybrid Payout Engine

Calculates statutory severance payments (Pesangon, UPMK, UPH) per PP No. 35 Year 2021 (Articles 40-52) using the deterministic engine.

## Statutory Provenance
* **Statute**: Peraturan Pemerintah No. 35 Tahun 2021 (implementing regulation of UU Cipta Kerja).
* **Authority**: Kementerian Ketenagakerjaan RI.

## Severance Payout Matrix (PP 35/2021 Article 40)

### 1. Uang Pesangon (UP) Base Tenure Multipliers
* < 1 year: 1 month wage
* 1 s/d < 2 years: 2 months wage
* 2 s/d < 3 years: 3 months wage
* 3 s/d < 4 years: 4 months wage
* 4 s/d < 5 years: 5 months wage
* 5 s/d < 6 years: 6 months wage
* 6 s/d < 7 years: 7 months wage
* 7 s/d < 8 years: 8 months wage
* >= 8 years: 9 months wage (Maximum UP cap)

### 2. Uang Penghargaan Masa Kerja (UPMK) Base Tenure Multipliers
* < 3 years: 0 months wage
* 3 s/d < 6 years: 2 months wage
* 6 s/d < 9 years: 3 months wage
* 9 s/d < 12 years: 4 months wage
* 12 s/d < 15 years: 5 months wage
* 15 s/d < 18 years: 6 months wage
* 18 s/d < 21 years: 7 months wage
* 21 s/d < 24 years: 8 months wage
* >= 24 years: 10 months wage (Maximum UPMK cap)

### 3. Reason Multipliers
* `efficiency_loss`: 0.5x UP, 1x UPMK, 1x UPH (Art. 43)
* `efficiency_prevent_loss`: 1.0x UP, 1x UPMK, 1x UPH (Art. 43)
* `merger_employee_reject`: 0.5x UP, 1x UPMK, 1x UPH (Art. 41)
* `merger_employer_reject`: 1.0x UP, 1x UPMK, 1x UPH (Art. 41)
* `bankruptcy`: 0.5x UP, 1x UPMK, 1x UPH (Art. 44)
* `force_majeure`: 0.5x UP, 1x UPMK, 1x UPH (Art. 45)
* `retirement`: 1.75x UP, 1x UPMK, 1x UPH (Art. 56)
* `resignation`: 0x UP, 0x UPMK, 1x UPH + Uang Pisah (Art. 50)
* `major_violation`: 0x UP, 0x UPMK, 1x UPH + Uang Pisah (Art. 52)

## Hybrid Execution Model
Pass input parameters directly to `engines/phk-calculator.js`. Present the structured calculation output with full statutory multipliers.
