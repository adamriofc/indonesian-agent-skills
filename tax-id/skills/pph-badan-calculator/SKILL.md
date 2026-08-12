---
name: pph-badan-calculator
description: Calculate Corporate Income Tax (PPh Badan) 22% with statutory Pasal 31E UU PPh sliding scale facility and positive/negative fiscal reconciliations.
argument-hint: "<gross_turnover> <commercial_net_profit> <positive_fiscal_adjustments> <negative_fiscal_adjustments>"
metadata:
  risk_level: HIGH
  rule_type: statutory
  quality_tier: expert-reviewed
---

# Corporate Income Tax (PPh Badan) & Pasal 31E Calculator

Calculates statutory 22% Corporate Income Tax (*PPh Badan*) under UU No. 7/2021 (HPP) with Pasal 31E sliding scale facility allocations and fiscal reconciliation adjustments.

## Article 31E Sliding Scale Facility Matrix
1. **Gross Turnover $\le$ Rp 4.8 Billion**:
   - 100% of Taxable Income receives a 50% statutory tax discount (effective 11% corporate tax rate).
2. **Gross Turnover Rp 4.8 Billion to Rp 50 Billion**:
   - Taxable income is split proportionally:
     $$\text{Facility Portion} = \left(\frac{\text{Rp 4.8 Billion}}{\text{Gross Turnover}}\right) \times \text{Total Taxable Income}$$
   - Facility Portion is taxed at **11%**, while the Non-Facility Portion is taxed at **22%**.
3. **Gross Turnover $\ge$ Rp 50 Billion**:
   - 0% facility applies (100% taxed at the full statutory 22% corporate rate).

## Fiscal Reconciliation & Loss Compensation
* **Positive Adjustments**: Non-deductible expenses per UU PPh Pasal 9 (non-PMK 66 Natura, tax penalties, shareholder personal expenses, non-registered donations).
* **Negative Adjustments**: Final tax income (e.g. interest income) and non-taxable income (e.g. qualifying domestic dividends per PMK 18/2021).
* **Fiscal Loss Carry-Forward**: Deducts prior years' certified fiscal losses (up to 5 consecutive years per UU PPh Pasal 6).

## Hybrid Execution Model
Pass parameters to `engines/pph-badan-calculator.js`:
* `calculateCorporateTax({ grossTurnover, commercialNetProfit, positiveFiscalAdjustments, negativeFiscalAdjustments, priorYearFiscalLossCarryForward, taxYear })`

## Worked Example
Input: Gross Turnover Rp 12.000.000.000 (Rp 12B), Commercial Net Profit Rp 2.000.000.000, Positive Adjustments Rp 400.000.000.
- Fiscal Net Income = `Rp 2.000.000.000 + Rp 400.000.000` = **Rp 2.400.000.000**.
- Facility Taxable Portion = `(4.8B / 12B) x 2.4B` = **Rp 960.000.000** (Tax at 11% = Rp 105.600.000).
- Non-Facility Portion = `2.4B - 960M` = **Rp 1.440.000.000** (Tax at 22% = Rp 316.800.000).
- Total Corporate Tax Due = `Rp 105.600.000 + Rp 316.800.000` = **Rp 422.400.000** (Effective rate 17.60%).
