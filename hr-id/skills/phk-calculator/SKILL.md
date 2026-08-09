---
name: phk-calculator
description: Calculate statutory employee severance packages (Pesangon) under Government Regulation PP No. 35/2021 using hybrid execution.
argument-hint: "<gaji_pokok_tunjangan_tetap> <masa_kerja_tahun> <alasan_phk> [sisa_cuti]"
---

# PHK Severance Hybrid Payout Engine

Calculates statutory severance payments (Pesangon) per PP No. 35 Year 2021 (Articles 40-52) using the deterministic engine.

## Hybrid Execution Model
1. Pass input parameters to the calculation engine (`engines/phk-calculator.js`):
   * `monthlyWage`: Base Salary + Fixed Allowances.
   * `tenureYears`: Continuous service length in years.
   * `reasonKey`: Termination reason (`efficiency_loss`, `merger_employee_reject`, `bankruptcy`, `retirement`, `resignation`, etc.).
   * `remainingLeaveDays`: Unused annual leave balances (UPH calculations).
2. The engine computes:
   * **Uang Pesangon (UP)**: Base UP multiplied by reason rate (0.5x, 1x, 1.75x, etc.).
   * **Uang Penghargaan Masa Kerja (UPMK)**: Base UPMK multiplied by reason rate.
   * **Uang Penggantian Hak (UPH)**: Unused leave days (daily wage = wage / 25).
3. Present output with detailed statutory multiplier breakdown.
