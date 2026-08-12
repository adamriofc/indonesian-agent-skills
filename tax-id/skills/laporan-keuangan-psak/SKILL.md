---
name: laporan-keuangan-psak
description: Structure trial balances into financial statements conforming to Indonesian SAK EMKM / SAK EP accounting standards for bank credit applications and tax audits.
argument-hint: "<trial_balance_data> <accounting_standard>"
risk_level: MEDIUM
rule_type: professional-standard
---

# Financial Statement Generator (SAK EMKM / SAK EP)

Formats raw transaction data into standardized financial statements for Indonesian businesses.

## Framework & Standards
* **SAK EMKM**: Micro, Small, and Medium Enterprises Accounting Standard (Balance Sheet (Neraca), Income Statement (Laporan Laba Rugi), Notes to the Financial Statements (CALK)).
* **SAK EP**: Entities without Public Accountability.

## Output Structure
1. **Income Statement (Laporan Laba Rugi)**: Revenue, HPP (COGS), Gross Profit, Operational Expenses, Net Operating Income, Tax Expense, Net Profit.
2. **Statement of Financial Position / Balance Sheet**: Current Assets, Non-Current Assets, Current Liabilities, Non-Current Liabilities, Equity.
3. **Notes to the Financial Statements (CALK)**: Significant accounting policies and asset depreciation schedules.