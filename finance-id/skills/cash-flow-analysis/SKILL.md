---
name: cash-flow-analysis
description: Analyze operating, investing, and financing cash flows, free cash flow, and cash runway for Indonesian businesses.
argument-hint: "<laporan_arus_kas> <capex> <burn_bulanan>"
risk_level: MEDIUM
rule_type: professional-standard
---

# Cash Flow Analysis

Determines whether a business generates enough cash to sustain operations, growth, and obligations.

## Methods & Core Metrics
* **Metode langsung**: kas dari pelanggan − kas keluar operasi.
* **Metode tidak langsung**: laba bersih + non-kas (depresiasi) ± perubahan modal kerja.
* **Free Cash Flow (FCF)** = OCF − Capex — uang yang benar-benar bebas untuk dividen/utang/investasi.
* **Cash Runway** = Kas saat ini ÷ Burn rate bulanan — bulan sebelum kas habis (tanpa tambahan dana).

## Scope & Safety
* **Use for**: menilai kelayakan membayar utang, merencanakan pendanaan, mendeteksi "laba tapi tak ada kas" (earning without cash).
* **Do not use for**: penilaian profitabilitas saja (arus kas bukan laba) — gabungkan dengan Laba Rugi.
* FCF positif sekali periode bukan jaminan; gunakan tren multi-periode (min. 3 bulan) + musiman.
* Angka proyeksi harus diberi label asumsi, bukan fakta.

## Worked Example
Input: OCF 150 jt/bulan, Capex 40 jt/bulan, kas 300 jt, burn 25 jt/bulan (jika pendapatan berhenti).
Output: FCF = 150 − 40 = **110 jt/bulan**; Runway = 300 ÷ 25 = **12 bulan**.
Interpretasi: bisnis menghasilkan kas positif; tetap butuh buffer 3–6 bulan runway untuk kondisi darurat.
