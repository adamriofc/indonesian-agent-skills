---
name: thr-calculator
description: Calculate statutory Indonesian religious holiday allowance (Tunjangan Hari Raya - THR) per Permenaker No. 6/2016.
argument-hint: "<gaji_pokok> <tunjangan_tetap> <masa_kerja_bulan>"
---

# Statutory THR Payout Calculator

Calculates religious holiday allowance payouts according to Permenaker No. 6/2016.

## Statutory Rules
* **Statute**: Peraturan Menteri Ketenagakerjaan No. 6 Tahun 2016.
* **Deadline**: Mandatory payout at least 7 days prior to Hari Raya Keagamaan. Cash payment only.
* **Formula**:
  * Masa Kerja >= 12 Bulan: `1 x (Gaji Pokok + Tunjangan Tetap)`.
  * Masa Kerja 1 - 11 Bulan: `(Masa Kerja / 12) x (Gaji Pokok + Tunjangan Tetap)`.
  * Masa Kerja < 1 Bulan: Not eligible (Rp 0).
