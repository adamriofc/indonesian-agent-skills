---
name: pph23-26-calculator
description: Calculate Indonesian withholding tax on domestic services/rent (PPh 23) and foreign offshore payments (PPh 26 / Tax Treaty DGT Form).
argument-hint: "<gross_amount> <transaction_type> <has_npwp> [has_dgt_form]"
---

# PPh 23 & PPh 26 Tax Calculator (Hybrid Engine)

Calculates local service withholdings (PPh 23) and foreign offshore cross-border payments (PPh 26).

## Statutory Provenance
* **Statute**: UU No. 36/2008 & UU No. 7/2021 (HPP).

## Hybrid Execution Model
Pass input parameters to `engines/pph23-26-calculator.js`:
* **PPh 23 Domestic**: 2% rate on services, maintenance, and equipment rental. Applies **100% penalty (4% rate)** if `hasNpwp` is `false`. 15% rate on dividends, royalties, and interest.
* **PPh 26 Foreign**: Default statutory rate is **20%**. If a valid **DGT Form (Formulir DGT / SKD)** is provided under a Tax Treaty (P3B), apply the lower treaty rate.
