---
name: pph21-calculator
description: Calculate Indonesian monthly income tax (PPh Pasal 21) based on the TER (Tarif Efektif Rata-Rata) per PP 58/2023 and PMK 168/2023 using hybrid execution.
argument-hint: "<gross_salary> <ptkp_status> <has_npwp>"
---

# PPh 21 TER Hybrid Tax Calculator

A hybrid precision engine for withholding employee PPh 21 monthly taxes.

## Statutory Provenance
* **Primary Regulation**: Peraturan Pemerintah (PP) No. 58 Tahun 2023 & Peraturan Menteri Keuangan (PMK) No. 168 Tahun 2023.
* **Effective Date**: January 1, 2024.
* **Authority**: Direktorat Jenderal Pajak (DJP), Kementerian Keuangan RI.

## Execution Model (Hybrid Engine)
Do not guess tax amounts using probabilistic LLM math. Follow this hybrid pattern:
1. Extract structured JSON payload from user prompt:
   ```json
   {
     "monthlyGrossSalary": 12500000,
     "ptkpStatus": "K/1",
     "hasNpwp": true
   }
   ```
2. Execute lookup against the deterministic table engine (`engines/pph21-calculator.js`):
   * **Kategori A**: TK/0 (Rp 54M), TK/1 (Rp 58.5M), K/0 (Rp 58.5M).
   * **Kategori B**: TK/2 (Rp 63M), TK/3 (Rp 67.5M), K/1 (Rp 63M), K/2 (Rp 67.5M).
   * **Kategori C**: K/3 (Rp 72M).
3. Apply NPWP penalty: If `hasNpwp` is `false`, apply a **20% penalty multiplier** on top of the calculated withholding.

## Example Output Format
```markdown
### PPh 21 Monthly Tax Breakdown (PP 58/2023)
* **Monthly Gross Salary**: Rp 12.500.000
* **PTKP Status**: K/1 (Kategori TER B)
* **Effective TER Rate**: 4.00%
* **NPWP Status**: Valid (No 20% penalty applied)
* **Monthly Tax Withheld**: Rp 500.000
```
