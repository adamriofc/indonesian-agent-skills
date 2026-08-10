---
name: break-even-analysis
description: Compute break-even units, break-even revenue, contribution margin, and margin of safety with the deterministic break-even engine.
argument-hint: "<fixed_costs> <harga_jual> <biaya_variabel> <revenue_aktual>"
risk_level: LOW
rule_type: professional-standard
---

# Break-Even Analysis

Determines the sales level where revenue exactly covers fixed plus variable costs — the baseline for pricing and target setting.

## Formulas (engines/break-even.js)
* **Contribution Margin** = Price − Variable Cost per unit.
* **Contribution Margin Ratio** = CM ÷ Price.
* **Break-Even Units** = Fixed Costs ÷ CM.
* **Break-Even Revenue** = Units × Price.
* **Margin of Safety** = Actual Revenue − Break-Even Revenue.

## Multi-Product Note
Untuk multi-produk, gunakan weighted-average contribution margin (bobot = komposisi bauran penjualan); hasil adalah aproksimasi — valid hanya jika bauran tetap.

## Scope & Safety
* **Use for**: harga jual minimal, target penjualan, evaluasi biaya tetap (sewa, gaji admin).
* **Do not use for**: analisis laba multi-periode (asumsi harga & biaya konstan), atau keputusan produksi dengan kapasitas terbatas tanpa batasan.
* Asumsi utama: harga konstan, biaya variabel linier, semua unit terjual — nyatakan asumsi saat presentasi.
* Engine akan throw bila price ≤ variable cost (margin kontribusi non-positif) — itu tanda model tidak feasible, bukan error.

## Hybrid Execution Model
Pass `fixedCosts, pricePerUnit, variableCostPerUnit, actualRevenue` ke `engines/break-even.js`; tampilkan 5 output + interpretasi. Trust Envelope: risk LOW, `as_of` tanggal asumsi.

## Worked Example
Input: fixed 20 jt/bulan, harga 25.000, biaya variabel 15.000, revenue aktual 60 jt.
Output: CM = **10.000**; Ratio = **0.40**; BEP = 20 jt ÷ 10.000 = **2.000 unit** = **50 jt**; Margin of Safety = 60 − 50 = **10 jt** (16,7% di atas BEP — aman tipis, hati-hati saat omzet turun).