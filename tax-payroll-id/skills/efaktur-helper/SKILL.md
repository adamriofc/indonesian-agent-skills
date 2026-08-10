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
* **NSFP Transaction Codes**:
  * **01**: Supply of taxable goods/services (BKP/JKP) to parties other than PPN Collectors.
  * **02**: Supply to Government Budget Treasurers (Bendahara Pemerintah).
  * **03**: Supply to other PPN Collectors (SOEs / Oil & Gas Contractors).
  * **04**: Supply using the Other Basis DPP (DPP Nilai Lain).
  * **07**: Supply where PPN is not collected (Free Zone / Bonded Zone).
  * **08**: Supply exempted from PPN.

## Auditing Workflow
1. Verify 16-digit NSFP format.
2. Confirm PPN equals `DPP x 11%`.
3. Check late generation threshold (Faktur created after the end of the following month is void).
