---
name: working-capital
description: Calculate net working capital, working capital ratio, cash conversion cycle, and funding requirements with the deterministic working-capital engine.
argument-hint: "<current_assets> <current_liabilities> <siklus_hari> <cogs_harian>"
risk_level: MEDIUM
rule_type: professional-standard
---

# Working Capital Management

Measures how much cash is trapped in the operating cycle and how much funding is required to run it.

## Metrics
* **Net Working Capital** = Current Assets − Current Liabilities.
* **Working Capital Ratio** = Current Assets ÷ Current Liabilities (≥ 1.5 konservatif untuk UMKM).
* **Cash Conversion Cycle (CCC)** = DIO + DSO − DPO — hari kas terikat dari beli stok sampai kas kembali.
* **Working Capital Requirement** = CCC (hari) × COGS per hari — kebutuhan dana operasional.

## Scope & Safety
* **Use for**: merencanakan kebutuhan pinjaman modal kerja, negosiasi syarat pembayaran pemasok, menilai likuiditas operasional.
* **Do not use for**: keputusan pinjaman investasi jangka panjang (pakai capital-budgeting), atau penilaian solvabilitas total.
* CCC panjang = kas tersedot ke piutang/persediaan — prioritas: percepat penagihan, perpanjang utang pemasok secara wajar, kurangi stok mati.
* Angka WCR adalah estimasi kebutuhan; tambahkan buffer 10–20% untuk musiman.

## Hybrid Execution Model
Pass input ke `engines/working-capital.js`: `netWorkingCapital`, `workingCapitalRatio`, `cashConversionCycle`, `workingCapitalRequirement`. Wrap dalam Trust Envelope (risk MEDIUM; as_of; review manusia untuk pengajuan kredit).

## Worked Example
Input: CA 500 jt, CL 250 jt; DIO 60 hari, DSO 45 hari, DPO 30 hari; COGS/hari 2 jt.
Output: NWC = **250 jt**; Ratio = **2.0**; CCC = 60 + 45 − 30 = **75 hari**; Kebutuhan = 75 × 2 jt = **150 jt**.
Interpretasi: usaha secara likuid, tetapi butuh ±150 jt dana untuk membiayai siklus modal kerja 75 hari.