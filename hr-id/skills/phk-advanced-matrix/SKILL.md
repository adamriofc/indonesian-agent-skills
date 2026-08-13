---
name: phk-advanced-matrix
description: "Evaluate complex Indonesian employment termination (PHK) multi-condition scenarios (retirement crossover, efficiency due to loss vs prevention of loss, merger employee/employer refusal)."
argument-hint: <monthly_wage> <tenure_years> <phk_reason_code> <unused_leave_days>
risk_level: HIGH
rule_type: statutory
quality_tier: tested
allowed-tools: bash
capability:
  requires: [<monthly_wage> <tenure_years> <phk_reason_code> <unused_leave_days>]
  produces: [payoutAmount, statutoryEntitlements, complianceStatus]
  deterministic: true
  cross_domain_relevance:
    tax: high
    finance: high
    legal: high
---

# Advanced Complex PHK Multi-Condition Severance Matrix

Evaluates complex statutory termination (*Pemutusan Hubungan Kerja - PHK*) scenarios under Government Regulation PP No. 35/2021 & Perpu No. 2/2022.

## Statutory Multiplier Matrix (PP 35/2021)
1. **Efficiency Reasons (Pasal 43)**:
   - **Due to Losses**: Severance (UP 1.0x) + Service Pay (UPMK 1.0x) + Rights (UPH 1.0x).
   - **Prevention of Losses**: Severance (UP 1.0x) + Service Pay (UPMK 1.0x) + Rights (UPH 1.0x).
2. **Merger / Consolidation / Acquisition (Pasal 41 & 42)**:
   - **Worker Refuses to Continue**: UP 1.0x + UPMK 1.0x + UPH 1.0x.
   - **Employer Refuses to Continue Worker**: UP 2.0x + UPMK 1.0x + UPH 1.0x.
3. **Retirement Age Crossover (Pasal 56)**:
   - Severance (UP 1.75x) + UPMK 1.0x + UPH 1.0x. Offset by pension insurance benefits under BPJS JP / DPK.
4. **Disciplinary Violations (Pasal 52)**:
   - After SP1, SP2, SP3 warning letters: UP 0.5x + UPMK 1.0x + UPH 1.0x.

## Hybrid Execution Model
Pass parameters to `engines/phk-calculator.js`:
* `calculatePhk(monthlyWage, tenureYears, phkReasonCode, unusedLeaveDays)`
