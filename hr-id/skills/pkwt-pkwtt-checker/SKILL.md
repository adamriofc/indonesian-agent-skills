---
name: pkwt-pkwtt-checker
description: Audit contract employment limits (PKWT max 5 years) and calculate mandatory PKWT Compensation Payout under PP No. 35/2021.
argument-hint: "<monthly_wage> <tenure_months>"
---

# PKWT Contract & Compensation Auditor (PP 35/2021)

Audits contract employment terms (PKWT) and computes statutory compensation payouts upon contract expiration.

## Statutory Rules & Limits
* **Statute**: PP No. 35 Tahun 2021 (Pasal 15 - 17).
* **Maximum Duration**: PKWT contracts (including extensions) cannot exceed **5 years** total. Contracts exceeding 5 years automatically convert by law into permanent employment (PKWTT).
* **Mandatory Compensation Payout**: Employers must pay compensation money at the end of every PKWT contract period.

## Hybrid Execution Model
Pass parameters to `engines/pkwt-compensation-calculator.js`:
* Tenure < 1 month: Not eligible (Rp 0).
* Tenure 12 months: `1 x Monthly Wage`.
* Tenure 1 - 11 months or > 12 months: `(Masa Kerja / 12) x Monthly Wage`.
