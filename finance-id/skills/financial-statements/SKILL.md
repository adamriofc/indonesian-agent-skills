---
name: financial-statements
description: "Structure Indonesian financial statements (income statement, balance sheet, cash flow) per PSAK 1 presentation principles with accrual linkage."
argument-hint: <trial_balance> <period>
risk_level: MEDIUM
rule_type: professional-standard
quality_tier: expert-reviewed
allowed-tools: bash
capability:
  requires: [<trial_balance> <period>]
  produces: [financialRatio, cashRunwayMonths, netProfit, feasible]
  deterministic: true
  cross_domain_relevance:
    strategy: high
    marketing: medium
    tax: medium
---

# Financial Statements

Builds and links the three core statements: Income Statement, Balance Sheet, and Cash Flow — presentation aligned with PSAK 1.

## Statement Structure & Linkage
1. **Income Statement**: Revenue − Expenses = Period Profit/Loss (accrual basis).
2. **Statement of Financial Position (Balance Sheet)**: Assets = Liabilities + Equity; period profit is closed to equity.
3. **Statement of Cash Flows**: operating, investing, financing — ending cash must match cash on the balance sheet.
* Linkage: Income Statement → Balance Sheet (retained earnings) → Cash Flow (non-cash depreciation reversed, working capital changes).

## Disclosure Essentials (PSAK 1)
* Items presented when material; current/non-current classification; comparative prior period; measurement basis stated.
* Notes to the financial statements explain significant accounting policies.

## Scope & Safety
* **Use for**: structuring SME financial statements, internal analysis, preparing data for bank credit.
* **Do not use for**: audit opinions or statements that must be audited — requires a registered public accountant (OJK/PMK regulations).
* **Relation to `laporan-keuangan-psak` (tax-payroll-id)**: that skill prepares SAK EMKM financial statements for bank credit applications; this skill focuses on general presentation & analysis.
* Accounting standards (PSAK/SAK EMKM) are not positive law — PSAK amendments are tracked in the PROVENANCE register, not the runtime ruleset.

## Worked Example
Input: trial balance for the period (revenue 1.2 billion; COGS 800 million; operating expenses 200 million; cash 100 million; receivables 150 million; inventory 200 million; fixed assets 550 million; payables 450 million; capital 350 million).
Output: net income 200 million → ending equity 550 million; Balance Sheet: Assets 1 billion = Liabilities 450 million + Equity 550 million; Cash flow: OCF 150 million (net income + depreciation 50 million − increase in receivables 40 million − increase in inventory 60 million) → ending cash is consistent.