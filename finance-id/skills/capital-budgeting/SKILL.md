---
name: capital-budgeting
description: "Evaluate Indonesian SME investment projects with NPV, IRR, and payback using the deterministic npv and irr engines against a simple WACC."
argument-hint: <investment> <annual_cashflow> <wacc>
risk_level: MEDIUM
rule_type: professional-standard
quality_tier: tested
allowed-tools: bash
capability:
  requires: [<investment> <annual_cashflow> <wacc>]
  produces: [financialRatio, cashRunwayMonths, netProfit, feasible]
  deterministic: true
  cross_domain_relevance:
    strategy: high
    marketing: medium
    tax: medium
---

# Capital Budgeting

Decides whether a capital expenditure creates value: **accept if NPV > 0 and IRR > WACC**.

## Decision Rules
* **NPV > 0** → value is created; NPV < 0 → value is destroyed (use `engines/npv.js`).
* **IRR > WACC** → the project covers its cost of capital (use `engines/irr.js`); compare them — do not use IRR alone when cash flows are unconventional.
* **Payback period** = investment ÷ average annual cash flow — a liquidity aid, not a substitute for NPV.
* **Simple WACC** = (E÷V × ke) + (D÷V × kd × (1 − tax rate)) — for SMEs: ke = owner's expected return, kd = effective loan interest rate.

## Hybrid Execution Model
Pass `cashflows: [−investment, cf1..cfn]` to `engines/npv.js` (`npv(rate, cashflows)`) and `engines/irr.js` (`irr(cashflows, {tolerance: 1e-9})`). Trust Envelope: risk MEDIUM, standard basis (not statutory), `requires_human_review: true` for fund commitments.

## Scope & Safety
* **Use for**: machine purchases, branch expansion, project investments — incremental after-tax cash flows.
* **Do not use for**: portfolio/stock decisions (not finance core), projects with multi-sign cash flows without further analysis.
* The IRR engine throws "No IRR found in range" when cash flows are unconventional — use NPV as the primary decision.
* Make sure tax rates & interest are actual (check tax-payroll-id) — do not assume.

## Worked Example
Input: machine 2 billion; net cash flow 600 million/year × 5 years; WACC 12% (ke 15% × 60% + kd 10% × 40% × (1 − 22%)).
Output: NPV @12% = 600 million × annuity factor 3.6048 − 2 billion = **+162.9 million** (> 0 → accept); IRR ≈ **15.2%** (> 12% ✓); payback = 2 billion ÷ 600 million ≈ **3.3 years**. Recommendation: feasible provided the incremental cash flows materialize.