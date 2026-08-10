---
name: budgeting-forecasting
description: Build top-down or bottom-up budgets, variance analysis, and rolling forecasts for Indonesian SME planning cycles.
argument-hint: "<target> <history> <asumsi>"
risk_level: MEDIUM
rule_type: internal-policy
---

# Budgeting & Forecasting

Turns targets into executable budgets with honest variance tracking and rolling recalibration.

## Methods
* **Top-down**: target manajemen diturunkan ke unit — cepat, tapi bisa tidak realistis di lapangan.
* **Bottom-up**: estimasi dari unit/pelanggan dinaikkan — lebih akurat, lebih lambat; pilih sesuai skala.
* **Rolling forecast**: revisit kuartalan, bukan setahun sekali — cocok untuk UMKM yang berubah cepat.

## Variance Rules
* **Variance = Actual − Budget**: label favorable (+) / unfavorable (−).
* Threshold review: variance ≥ 5% per pos signifikan → wajib analisis sebab (volume? harga? timing?) sebelum revisi.
* Jangan revisi budget di tengah periode hanya karena underperform — revisi forecast terpisah.

## Scope & Safety
* **Use for**: perencanaan tahunan, kontrol biaya, komunikasi target dengan investor/bank.
* **Do not use for**: dasar pengakuan laba (budget ≠ hasil aktual), atau klaim pendapatan kepada pihak ketiga.
* Asumsi (harga, volume, inflasi) harus ditulis eksplisit dan diuji sensitivitasnya.
* Angka historis vs proyeksi harus diberi label berbeda di semua dokumen.

## Worked Example
Input: budget penjualan 500 jt/bulan, actual 460 jt → variance −40 jt (−8%, unfavorable).
Analisis: volume turun 60 jt tetapi harga naik 3% (+20 jt) → penyebab utama volume; cek kompetisi & musiman sebelum revisi forecast kuartal baru: 470 jt/bulan.