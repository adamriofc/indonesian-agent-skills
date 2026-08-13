---
name: struktur-skala-upah
description: "Build statutory Wage Structure and Scale (Struktur dan Skala Upah) compliant with Permenaker No. 1/2017."
argument-hint: <job_positions_list> <ump_umr_minimum>
risk_level: MEDIUM
rule_type: statutory
quality_tier: source-verified
allowed-tools: bash
capability:
  requires: [<job_positions_list> <ump_umr_minimum>]
  produces: [payoutAmount, statutoryEntitlements, complianceStatus]
  deterministic: true
  cross_domain_relevance:
    tax: high
    finance: high
    legal: high
---

# Wage Structure & Scale Builder (Permenaker 1/2017)

Constructs mandatory corporate Wage Structure and Scale frameworks based on job evaluation metrics.

## Statutory Provenance & Rules
* **Statute**: Permenaker No. 1 Year 2017 & PP No. 36/2021 regarding Remuneration (Pengupahan).
* **Mandatory Filing**: Every company must compile and inform employees of their wage structure and attach it during manpower reporting.
* **Minimum Wage Boundary**: The lowest grade in the scale cannot be lower than the active regional minimum wage (UMR / UMP).

## Construction Methodology
1. **Job Evaluation**: Rank positions by responsibility, education, and hazard level.
2. **Point / Grade Alignment**: Group positions into job grades (Grade 1 to 5).
3. **Midpoint & Spread**: Establish lowest, midpoint, and highest salary per grade with a 15-30% spread.
