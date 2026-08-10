---
name: business-feasibility
description: Structure Indonesian SME feasibility assessments across market, technical, financial, legal, and risk aspects with consistent financial figures.
argument-hint: "<ide_bisnis> <investasi> <proyeksi>"
risk_level: MEDIUM
rule_type: internal-policy
---

# Business Feasibility Study

Framework 5 aspek untuk menilai layak-tidaknya usaha/bisnis baru sebelum dana dikunci.

## Five Aspects
1. **Pasar**: ukuran, segmen, kompetitor, willingness-to-pay — validasi primer (survey/pilot), bukan opini.
2. **Teknis**: kapasitas produksi, supply chain, tenaga kerja, teknologi — apakah bisa dieksekusi.
3. **Finansial**: investasi awal, proyeksi arus kas, payback, NPV/IRR (lihat capital-budgeting) — angka konsisten antar skenario.
4. **Legal**: izin usaha (OSS), KBLI, sertifikasi, perpajakan (NIB, NPWP, PPh final UMKM) — cek plugin legal-id & tax-payroll-id.
5. **Risiko**: top 5 risiko + mitigasi; test sensitivitas ±10% harga & volume.

## Rules
* Semua angka finansial berasal dari satu model yang sama (no angka mengambang).
* Payback & NPV dihitung dengan asumsi eksplisit (diskon rate = WACC sederhana).
* Izin & kepatuhan bukan "belakangan" — masuk biaya & timeline awal.

## Scope & Safety
* **Use for**: keputusan mulai/berhenti, presentasi ke investor/bank, prioritas antar ide bisnis.
* **Do not use for**: jaminan hasil — feasibility adalah estimasi, bukan kontrak; sertakan disclaimer.
* Data pasar wajib bersumber (survei, BPS, asosiasi); jangan mengarang angka.
* Kelayakan legal membutuhkan pengecekan terkini ke OSS — verifikasi saat eksekusi nyata.

## Worked Example
Input: kedai kopi — investasi 250 jt (renovasi 120 jt, alat 80 jt, modal kerja 50 jt); proyeksi laba bersih tahunan ~72 jt.
Output: Payback = 250 ÷ 72 ≈ **3,5 tahun**; dengan diskon 12% cek NPV (capital-budgeting); aspek pasar: catchment ±5.000 pekerja, kompetitor 3 — validasi 100 responden; legal: NIB + KBLI 56301; risiko #1 lokasi — mitigasi: sewa 3+2 tahun. Kesimpulan: layak dengan syarat volume rata-rata tercapai.