---
name: efaktur-helper
description: Validate and audit e-Faktur taxation invoices (Faktur Pajak) for PPN 11% filings.
argument-hint: "<paste_invoice_details_or_qr_url>"
risk_level: MEDIUM
rule_type: statutory
---

# e-Faktur Invoice Auditor & Helper

Validates transaction codes, DPP values, and PPN 11% tax invoices for e-Faktur DJP 4.0.

## Statutory Basis & Code Classification
* **Statute**: UU No. 7/2021 (HPP) & PER-03/PJ/2022 (Faktur Pajak).
* **Kode Transaksi NSFP**:
  * **01**: Penyerahan BKP/JKP kepada selain Pemungut PPN.
  * **02**: Penyerahan kepada Bendahara Pemerintah.
  * **03**: Penyerahan kepada Pemungut PPN Lain (BUMN/Kontraktor Migas).
  * **04**: Penyerahan menggunakan DPP Nilai Lain.
  * **07**: Penyerahan PPN Tidak Dipungut (Kawasan Bebas / Bonded Zone).
  * **08**: Penyerahan PPN Dibebaskan.

## Auditing Workflow
1. Verify 16-digit NSFP format.
2. Confirm PPN equals `DPP x 11%`.
3. Check late generation threshold (Faktur created after the end of the following month is void).
