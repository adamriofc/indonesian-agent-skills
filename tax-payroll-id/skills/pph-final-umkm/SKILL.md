---
name: pph-final-umkm
description: Calculate statutory 0.5% MSME final income tax under PP No. 55/2022 including the Rp 500M annual threshold exemption for Individual Taxpayers.
argument-hint: "<ytd_revenue> <current_month_revenue> <taxpayer_type_individual_or_corporate>"
---

# UMKM Final Tax 0.5% Calculator (PP 55/2022)

Calculates 0.5% final PPh for MSMEs under Government Regulation PP No. 55/2022.

## Statutory Provenance
* **Statute**: PP No. 55 Tahun 2022 (Pasal 56 - 57).

## Hybrid Execution Model
Pass parameters to `engines/umkm-tax-calculator.js`:
* **Wajib Pajak Orang Pribadi (Individual)**: The first **Rp 500.000.000 (Rp 500M)** of gross annual revenue is **completely tax-exempt (0% tax)**. Tax at 0.5% is only levied on cumulative revenue exceeding Rp 500M.
* **Wajib Pajak Badan (Corporate PT/CV)**: No Rp 500M exemption applies. Tax at 0.5% is levied directly on all monthly gross revenue.
* **Validity Period**: 7 years for Individual, 4 years for PT Perorangan/CV, 3 years for PT.
