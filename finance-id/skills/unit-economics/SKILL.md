---
name: unit-economics
description: Model customer-level economics — LTV, CAC, contribution margin per unit, and the LTV:CAC heuristic — for Indonesian digital and D2C businesses.
argument-hint: "<arppu> <churn> <cac>"
risk_level: LOW
rule_type: internal-policy
---

# Unit Economics

Evaluates whether each customer (or each unit sold) is profitable after acquisition and delivery costs.

## Core Metrics
* **LTV** = ARPPU (revenue rata-rata per pelanggan per periode) × Retention Horizon (1 ÷ churn rate bulanan).
* **CAC** = Total biaya akuisisi (iklan, sales, diskon onboarding) ÷ jumlah pelanggan baru.
* **Contribution margin per unit** = Harga − biaya variabel (lihat break-even-analysis).
* **LTV : CAC** — heuristik industri, bukan aturan baku: ≥ 3 dianggap sehat; < 1 = rugi per pelanggan.

## Rules
* Payback period CAC: kasir bulanan pelanggan menutup CAC dalam berapa bulan — target < 12 bulan untuk bootstrap.
* Pisahkan akuisisi organik vs berbayar: hanya biaya berbayar masuk CAC akuisisi; organik dihitung terpisah.
* Churn bulanan dihitung dari cohort, bukan rata-rata total.

## Scope & Safety
* **Use for**: evaluasi kanal iklan, keputusan harga & diskon, prioritas produk.
* **Do not use for**: laporan keuangan eksternal — ini metrik manajemen, bukan PSAK.
* LTV:CAC ≥ 3 adalah heuristik industri; validasi dengan data aktual kanal sendiri.
* Proyeksi LTV sensitif terhadap asumsi churn — uji skenario ±2 poin churn.

## Worked Example
Input (SaaS lokal): ARPPU 150.000/bln, churn 5%/bln, CAC 800.000, margin kontribusi 80% dari revenue.
Output: horizon = 1 ÷ 0.05 = 20 bulan; LTV = 150.000 × 20 = **3.000.000**; LTV:CAC = 3.000.000 ÷ 800.000 = **3.75** (sehat, di atas heuristik 3); payback = 800.000 ÷ (150.000 × 0.8) = **6,7 bulan**.