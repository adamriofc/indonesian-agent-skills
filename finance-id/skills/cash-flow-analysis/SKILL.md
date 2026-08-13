---
name: cash-flow-analysis
description: "Analyze operating, investing, and financing cash flows, free cash flow, and cash runway for Indonesian businesses."
argument-hint: <cash_flow_statement> <capex> <monthly_burn>
risk_level: MEDIUM
rule_type: professional-standard
quality_tier: expert-reviewed
allowed-tools: bash
capability:
  requires: [<cash_flow_statement> <capex> <monthly_burn>]
  produces: [financialRatio, cashRunwayMonths, netProfit, feasible]
  deterministic: true
  cross_domain_relevance:
    strategy: high
    marketing: medium
    tax: medium
---

# Cash Flow Analysis

Determines whether a business generates enough cash to sustain operations, growth, and obligations.

## Methods & Core Metrics
* **Direct method**: cash from customers − cash paid for operations.
* **Indirect method**: net income + non-cash items (depreciation) ± changes in working capital.
* **Free Cash Flow (FCF)** = OCF − Capex — the cash truly free for dividends/debt/investment.
* **Cash Runway** = Current cash ÷ monthly burn rate — months before cash runs out (without additional funding).

## Scope & Safety
* **Use for**: assessing debt repayment capacity, planning financing, detecting "earning without cash" situations.
* **Do not use for**: profitability assessment alone (cash flow ≠ profit) — combine with the Profit & Loss statement.
* A single positive FCF period is not a guarantee; use multi-period trends (min. 3 months) plus seasonality.
* Projected figures must be labeled as assumptions, not facts.

## Worked Example
Input: OCF 150 million/month, Capex 40 million/month, cash 300 million, burn 25 million/month (if revenue stops).
Output: FCF = 150 − 40 = **110 million/month**; Runway = 300 ÷ 25 = **12 months**.
Interpretation: the business generates positive cash; still needs a 3–6 month runway buffer for emergencies.