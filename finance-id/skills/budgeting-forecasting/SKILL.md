---
name: budgeting-forecasting
description: "Build top-down or bottom-up budgets, variance analysis, and rolling forecasts for Indonesian SME planning cycles."
argument-hint: <target> <history> <assumptions>
risk_level: MEDIUM
rule_type: professional-standard
quality_tier: expert-reviewed
allowed-tools: bash
capability:
  purpose: [financial_analysis, unit_economics_modelling]
  not_for: [certified_audit_opinion, public_offering_prospectus]
  requires: [<target> <history> <assumptions>]
  produces: [bep_units, bep_revenue, contribution_margin, margin_of_safety]
  consumes: [context.scale, marketing.cac]
  deterministic: true
  cross_domain_relevance:
    strategy: high
    marketing: medium
    tax: medium
---

# Budgeting & Forecasting

Turns targets into executable budgets with honest variance tracking and rolling recalibration.

## Methods
* **Top-down**: management targets are cascaded down to units — fast, but may be unrealistic on the ground.
* **Bottom-up**: estimates from units/customers are rolled up — more accurate, slower; choose based on scale.
* **Rolling forecast**: quarterly revisit instead of once a year — suited to fast-changing SMEs.

## Variance Rules
* **Variance = Actual − Budget**: label favorable (+) / unfavorable (−).
* Review threshold: variance ≥ 5% on any significant line item → require root-cause analysis (volume? price? timing?) before revising.
* Do not revise the budget mid-period just because of underperformance — revise the forecast separately.

## Scope & Safety
* **Use for**: annual planning, cost control, communicating targets to investors/banks.
* **Do not use for**: a basis for profit recognition (budget ≠ actual results), or revenue claims to third parties.
* Assumptions (price, volume, inflation) must be stated explicitly and sensitivity-tested.
* Historical vs projected figures must be labeled differently in all documents.

## Worked Example
Input: sales budget 500 million/month, actual 460 million → variance −40 million (−8%, unfavorable).
Analysis: volume dropped by 60 million but price rose 3% (+20 million) → volume is the main driver; check competition & seasonality before revising the new quarterly forecast: 470 million/month.