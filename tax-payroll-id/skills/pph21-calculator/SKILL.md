---
name: pph21-calculator
description: Calculate Indonesian monthly income tax (PPh Pasal 21) based on the TER (Tarif Efektif Rata-Rata) per PP 58/2023 and PMK 168/2023, supporting December Annual Reconciliation.
argument-hint: "<gross_salary> <ptkp_status> <has_npwp> [is_december] [jan_nov_withheld]"
---

# PPh 21 TER Hybrid Tax Calculator

A hybrid precision engine for withholding employee PPh 21 monthly taxes (Jan-Nov) and December annual reconciliation.

## Statutory Provenance
* **Primary Regulation**: Peraturan Pemerintah (PP) No. 58 Tahun 2023 & Peraturan Menteri Keuangan (PMK) No. 168 Tahun 2023.
* **Effective Date**: January 1, 2024.
* **Authority**: Direktorat Jenderal Pajak (DJP), Kementerian Keuangan RI.

## Execution Model (Hybrid Engine)
Do not guess tax amounts using probabilistic LLM math. Follow this hybrid pattern:

### 1. Monthly Withholding (Jan-Nov)
Extract parameters and run lookup via `calculatePPh21Monthly` in `engines/pph21-calculator.js`:
* Match PTKP to TER Category: A (TK/0, TK/1, K/0), B (TK/2, TK/3, K/1, K/2), C (K/3).
* Multiply gross monthly salary by matched bracket rate.
* Apply 20% penalty if `hasNpwp` is `false`.

### 2. December Annual Reconciliation (Masa Pajak Terakhir)
If `is_december` is `true`, execute `calculatePPh21DecemberReconciliation`:
* Determine PTKP threshold deduction (TK/0 = 54M, K/0 = 58.5M, etc.).
* Deduct Biaya Jabatan (5% of gross, capped at Rp 500.000/month or Rp 6.000.000/year).
* Deduct employee BPJS JHT (2%) and JP (1%).
* Compute progressive Article 17 progressive tax on Net Taxable Income (PKP).
* Subtract tax already withheld during Jan-Nov (`jan_nov_withheld`) to yield December tax.
