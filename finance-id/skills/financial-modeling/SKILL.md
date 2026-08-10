---
name: financial-modeling
description: Build 3-statement financial models with scenario and sensitivity tables for Indonesian SME planning, staying deterministic and auditable.
argument-hint: "<assumptions> <scenarios>"
risk_level: MEDIUM
rule_type: professional-standard
---

# Financial Modeling

Connects sales → Income Statement → Balance Sheet → Cash Flow in one consistent, auditable model.

## 3-Statement Linkage
* **Driver**: sales (volume × price) → all other line items follow.
* **Income Statement** → net income → equity.
* **Balance Sheet**: assets (cash, receivables % of sales, inventory % of COGS, fixed assets + capex − depreciation) = liabilities + equity — always balanced.
* **Cash Flow**: net income + non-cash items ± changes in working capital − capex − debt payments.

## Modeling Rules
* Each assumption input lives in a single cell and is referenced (not hard-coded in multiple places).
* All scenarios use the same drivers — only the assumption values change.
* Sensitivity table: 3 scenarios (pessimistic/base/optimistic) × 2 drivers (volume, price) — deterministic, no Monte Carlo.
* The model is checked: total assets = liabilities + equity in every period (balance check required).

## Scope & Safety
* **Use for**: business plans, credit applications, testing the impact of assumptions.
* **Do not use for**: official financial reporting, acquisition valuation, or claims of prediction accuracy — a model is a thinking tool, not an oracle.
* All projections are labeled with assumptions + date; do not mix actual figures without labels.
* The accounting & tax standards used (SAK EMKM, PPh) must be stated and verified.

## Worked Example
Input: sales 1 billion/month, margin 30%, receivables 30 days, inventory 45 days, capex 50 million, depreciation 10 million/month, pessimistic scenario = sales −10%.
Output: pessimistic → sales 900 million, net income down ~30 million, operating cash flow down; balance check still shows zero difference on the Balance Sheet; sensitivity: | sales −10% | base | +10% | → | operating cash flow: X | Y | Z | — present a table for decision-making.