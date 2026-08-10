---
name: financial-ratio-analysis
description: Compute and interpret 14 liquidity, solvency, profitability, and efficiency ratios for Indonesian SMEs using the deterministic financial-ratios engine.
argument-hint: "<neraca> <laba_rugi>"
risk_level: MEDIUM
rule_type: professional-standard
---

# Financial Ratio Analysis

Computes 14 standard ratios via the deterministic engine and interprets them with industry-aware benchmarks — not blind rules.

## Ratio Groups
1. **Likuiditas**: `currentRatio`, `quickRatio`, `cashRatio` — kemampuan bayar kewajiban jangka pendek.
2. **Solvabilitas**: `debtToEquity`.
3. **Profitabilitas**: `grossMargin`, `netMargin`, `roa`, `roe`.
4. **Efisiensi**: `inventoryTurnover`, `receivablesTurnover`, `daysSalesOutstanding` (DSO), `daysPayablesOutstanding` (DPO), `daysInventoryOutstanding` (DIO), `cashConversionCycle` (CCC).

## Conservative SME Benchmarks (industry-dependent, not statutory)
* Current ratio ≥ 1.5; quick ratio ≥ 1.0; cash ratio ≥ 0.2.
* Debt/Equity < 2.0 untuk SME non-capital-intensive.
* Gross margin sangat bervariasi per industri — bandingkan dengan tren sendiri dan kompetitor, bukan angka mutlak tunggal.
* CCC positif berarti modal kerja terikat — bandingkan dengan siklus pembayaran industri.

## Hybrid Execution Model
Pass neraca & laba-rugi ke `engines/financial-ratios.js` (14 fungsi). Wrap output dalam Trust Envelope berisi standard basis (PSAK 1), `risk_level: MEDIUM`, `requires_human_review: true` untuk dukungan kredit, `as_of` tanggal laporan.

## Scope & Safety
* **Use for**: health check keuangan, kelayakan kredit UMKM, monitoring kinerja antarfase.
* **Do not use for**: pengganti laporan keuangan audited, penilaian valuasi saham, keputusan investasi besar tanpa analisis kualitatif.
* Rasio bersifat historis (bukan prediksi) — selalu kombinasikan dengan asumsi forward-looking.
* Pembagi nol akan di-throw engine — pastikan data lengkap sebelum eksekusi.

## Worked Example
Input: CA 500 jt, CL 250 jt, inventory 150 jt, cash 80 jt, TL 600 jt, TE 400 jt; revenue 1,2 M, COGS 800 jt, NI 120 jt; TA 1 M; avg inventory 200 jt, avg receivables 150 jt, avg payables 100 jt.
Output: currentRatio 2.0, quickRatio 1.4, cashRatio 0.32, D/E 1.5, grossMargin 0.3333, netMargin 0.1, ROA 0.12, ROE 0.3, turnover 4.0×/8.0×, DSO 45.6 hari, DPO 45.6 hari, DIO 91.3 hari, CCC 91.3 hari.
Interpretasi: likuiditas aman, solvabilitas moderat, perputaran sehat; hari ini modal kerja terikat ~3 bulan — serasi dengan skill working-capital.