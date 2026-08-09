---
name: phk-calculator
description: Calculate statutory employee severance packages (Pesangon) under Government Regulation PP No. 35/2021 using hybrid execution.
argument-hint: "<gaji_pokok_tunjangan_tetap> <masa_kerja_tahun> <alasan_phk>"
---

# PHK Severance Hybrid Payout Engine

Calculates statutory severance payments (Pesangon) per PP No. 35 Year 2021 (Articles 40-52).

## Hybrid Execution Model
1. Pass input parameters to the calculation engine (`engines/phk-calculator.js`):
   * `monthlyWage`: Base Salary + Fixed Allowances.
   * `tenureYears`: Continuous service length in years.
   * `reasonKey`: Termination reason (`efficiency_loss`, `merger_employee_reject`, `bankruptcy`, `retirement`, `resignation`, etc.).
2. The engine evaluates:
   * **Uang Pesangon (UP)**: Max 9 months wage.
   * **Uang Penghargaan Masa Kerja (UPMK)**: Max 10 months wage.
   * **Uang Penggantian Hak (UPH)**: Unused leave days payout + contractual compensation.
3. Present output with detailed statutory multiplier breakdown.
