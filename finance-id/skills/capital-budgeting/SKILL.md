---
name: capital-budgeting
description: Evaluate Indonesian SME investment projects with NPV, IRR, and payback using the deterministic npv and irr engines against a simple WACC.
argument-hint: "<investasi> <cashflow_tahunan> <wacc>"
risk_level: MEDIUM
rule_type: professional-standard
---

# Capital Budgeting

Decides whether a capital expenditure creates value: **terima jika NPV > 0 dan IRR > WACC**.

## Decision Rules
* **NPV > 0** → nilai tercipta; NPV < 0 → nilai hancur (pakai `engines/npv.js`).
* **IRR > WACC** → proyek menutup biaya modal (pakai `engines/irr.js`); bandingkan, jangan dipakai tunggal bila arus kas tidak konvensional.
* **Payback period** = investasi ÷ arus kas tahunan rata-rata — alat bantu likuiditas, bukan pengganti NPV.
* **WACC sederhana** = (E÷V × ke) + (D÷V × kd × (1 − tarif pajak)) — untuk SME: ke = ekspektasi return pemilik, kd = bunga pinjaman efektif.

## Hybrid Execution Model
Pass `cashflows: [−investasi, cf1..cfn]` ke `engines/npv.js` (`npv(rate, cashflows)`) dan `engines/irr.js` (`irr(cashflows, {tolerance: 1e-9})`). Trust Envelope: risk MEDIUM, standard basis (bukan statutory), `requires_human_review: true` untuk komitmen dana.

## Scope & Safety
* **Use for**: beli mesin, ekspansi cabang, investasi proyek — arus kas inkremental setelah pajak.
* **Do not use for**: keputusan portofolio/saham (bukan finance core), proyek dengan arus kas multi-tanda tanpa analisis lanjutan.
* IRR engine throw "No IRR found in range" bila arus kas tidak konvensional — gunakan NPV sebagai keputusan utama.
* Pastikan tarif pajak & bunga aktual (cek tax-payroll-id) — jangan asumsi.

## Worked Example
Input: mesin 2 M; arus kas bersih 600 jt/tahun × 5 tahun; WACC 12% (ke 15% × 60% + kd 10% × 40% × (1 − 22%)).
Output: NPV @12% = 600 jt × annuity 3,6048 − 2 M = **+162,9 jt** (> 0 → terima); IRR ≈ **15,2%** (> 12% ✓); payback = 2.000 ÷ 600 ≈ **3,3 tahun**. Rekomendasi: layak dengan asumsi arus kas inkremental tercapai.