---
name: financial-modeling
description: Build 3-statement financial models with scenario and sensitivity tables for Indonesian SME planning, staying deterministic and auditable.
argument-hint: "<asumsi> <skenario>"
risk_level: MEDIUM
rule_type: professional-standard
---

# Financial Modeling

Connects penjualan → Laba Rugi → Neraca → Arus Kas in one consistent, auditable model.

## 3-Statement Linkage
* **Driver**: penjualan (volume × harga) → semua baris lain mengikuti.
* **Laba Rugi** → laba bersih → ekuitas.
* **Neraca**: aset (kas, piutang % penjualan, persediaan % COGS, aset tetap + capex − depresiasi) = liabilitas + ekuitas — selalu balancing.
* **Arus Kas**: laba bersih + non-kas ± perubahan modal kerja − capex − pembayaran utang.

## Modeling Rules
* Setiap input asumsi satu cell, dirujuk (tidak hard-coded di banyak tempat).
* Semua skenario memakai driver yang sama — hanya nilai asumsi yang berubah.
* Sensitivity table: 3 skenario (pesimis/base/optimis) × 2 driver (volume, harga) — deterministik, tanpa Monte Carlo.
* Model dicek: total aset = liabilitas + ekuitas di setiap periode (balance check wajib).

## Scope & Safety
* **Use for**: rencana bisnis, pengajuan kredit, uji dampak asumsi.
* **Do not use for**: pelaporan keuangan resmi, valuasi pengambilalihan, atau klaim akurasi prediksi — model = alat berpikir, bukan oracle.
* Semua proyeksi berlabel asumsi + tanggal; jangan campur angka aktual tanpa label.
* Standar akuntansi & perpajakan yang dipakai (PSAK EMKM, PPh) harus disebut dan diverifikasi.

## Worked Example
Input: penjualan 1 M/bulan, margin 30%, piutang 30 hari, persediaan 45 hari, capex 50 jt, depresiasi 10 jt/bln, skenario pesimis = penjualan −10%.
Output: pesimis → penjualan 900 jt, laba bersih turun ~30 jt, arus kas operasi turun; balance check Neraca tetap nol selisih; sensitivity: | penjualan −10% | base | +10% | → | arus kas operasi: X | Y | Z | — sajikan tabel untuk keputusan.