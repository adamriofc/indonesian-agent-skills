---
name: sop-perusahaan
description: "Generate operational Standard Operating Procedures (SOPs) for local Indonesian workplace operations, shift plans, and leaves."
argument-hint: <department> <process_scope>
risk_level: MEDIUM
rule_type: internal-policy
quality_tier: source-verified
allowed-tools: bash
capability:
  purpose: [labor_compliance, severance_calculation]
  not_for: [unmediated_employee_termination, autonomous_legal_notice]
  requires: [<department> <process_scope>]
  produces: [payoutAmount, statutoryEntitlements, complianceStatus]
  consumes: [context.employeeCount, context.scale]
  deterministic: true
  cross_domain_relevance:
    tax: high
    finance: high
    legal: high
---

# Statutory Company SOP Generator

Generates operational workplace SOPs enforcing statutory labor limits.

## Statutory Operational Constraints
* **Work Hours (Pasal 77 UU 13/2003)**:
  * 7 hours/day for 6 working days (40 hours/week), OR
  * 8 hours/day for 5 working days (40 hours/week).
* **Overtime Limits (Perpu 2/2022 & PP 35/2021)**: Maximum **4 hours/day** and **18 hours/week**. Overtime pay rates: 1.5x first hour, 2x subsequent hours.
* **Leaves**: 12 days annual leave after 1 year service. Paid special leaves (Marriage 3 days, child marriage 2 days, death of family 2 days, maternity 3 months).
