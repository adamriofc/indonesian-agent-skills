---
name: laporan-keuangan-psak
description: Structure trial balances into financial statements conforming to Indonesian SAK EMKM / SAK EP accounting standards for bank credit applications and tax audits.
argument-hint: "<trial_balance_data> <accounting_standard>"
---

# Financial Statement Generator (SAK EMKM / SAK EP)

Formats raw transaction data into standardized financial statements for Indonesian businesses.

## Framework & Standards
* **SAK EMKM**: Micro, Small, and Medium Enterprises Accounting Standard (Neraca, Laporan Laba Rugi, Catatan atas Laporan Keuangan - CALK).
* **SAK EP**: Entities without Public Accountability.

## Output Structure
1. **Laporan Laba Rugi (Income Statement)**: Revenue, HPP (COGS), Gross Profit, Operational Expenses, Net Operating Income, Tax Expense, Net Profit.
2. **Laporan Posisi Keuangan / Neraca (Balance Sheet)**: Aset Lancar, Aset Tidak Lancar, Kewajiban Jangka Pendek, Kewajiban Jangka Panjang, Ekuitas.
3. **Catatan atas Laporan Keuangan (CALK)**: Significant accounting policies and asset depreciation schedules.
