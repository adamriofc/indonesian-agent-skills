---
name: unit-economics
description: Model customer-level economics — LTV, CAC, contribution margin per unit, and the LTV:CAC heuristic — for Indonesian digital and D2C businesses.
argument-hint: "<arppu> <churn> <cac>"
risk_level: LOW
rule_type: professional-standard
---

# Unit Economics

Evaluates whether each customer (or each unit sold) is profitable after acquisition and delivery costs.

## Core Metrics
* **LTV** = ARPPU (average revenue per customer per period) × Retention Horizon (1 ÷ monthly churn rate).
* **CAC** = Total acquisition cost (ads, sales, onboarding discounts) ÷ number of new customers.
* **Contribution margin per unit** = Price − variable cost (see break-even-analysis).
* **LTV : CAC** — an industry heuristic, not a hard rule: ≥ 3 is considered healthy; < 1 = loss per customer.

## Rules
* CAC payback period: how many months of the customer's monthly cash inflow it takes to recover CAC — target < 12 months for bootstrapped businesses.
* Separate organic vs paid acquisition: only paid costs enter acquisition CAC; organic is tracked separately.
* Monthly churn is computed from cohorts, not a total average.

## Scope & Safety
* **Use for**: evaluating ad channels, pricing & discount decisions, product prioritization.
* **Do not use for**: external financial reporting — these are management metrics, not PSAK.
* LTV:CAC ≥ 3 is an industry heuristic; validate with your own channel's actual data.
* LTV projections are sensitive to churn assumptions — test scenarios at ±2 churn points.

## Worked Example
Input (local SaaS): ARPPU 150,000/month, churn 5%/month, CAC 800,000, contribution margin 80% of revenue.
Output: horizon = 1 ÷ 0.05 = 20 months; LTV = 150,000 × 20 = **3,000,000**; LTV:CAC = 3,000,000 ÷ 800,000 = **3.75** (healthy, above the heuristic of 3); payback = 800,000 ÷ (150,000 × 0.8) = **6.7 months**.