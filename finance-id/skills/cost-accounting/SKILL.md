---
name: cost-accounting
description: Compute cost of goods sold, absorption vs variable costing, and simple product costing for Indonesian SME operations.
argument-hint: "<persediaan_awal> <pembelian> <persediaan_akhir>"
risk_level: MEDIUM
rule_type: professional-standard
---

# Cost Accounting

Tracks product and service costs so pricing and margin decisions are grounded in real numbers.

## Core Methods
* **COGS** (HPP) = Persediaan Awal + Pembelian − Persediaan Akhir; stok akhir dihitung via metode konsisten (FIFO/rata-rata).
* **Absorption costing**: semua biaya produksi (variabel + tetap) masuk HPP — sesuai SAK EMKM untuk LK.
* **Variable costing**: hanya biaya variabel masuk HPP; tetap dibebankan saat terjadi — alat analisis internal untuk keputusan harga jangka pendek.
* **Unit cost** = Total biaya produksi ÷ unit diproduksi; jangan samakan dengan harga jual.

## Scope & Safety
* **Use for**: penetapan harga jual minimal, evaluasi margin produk per SKU, keputusan make-vs-buy.
* **Do not use for**: pengakuan nilai persediaan di LK dengan metode yang berbeda dari kebijakan yang dipilih (harus konsisten antar periode).
* Alokasi biaya overhead (listrik, sewa gudang) bersifat estimasi — dokumentasikan basis alokasinya.
* Data stok harus dipertanggungjawabkan fisik (stock opname) setidaknya tahunan.

## Worked Example
Input: persediaan awal 50 jt; pembelian 300 jt; persediaan akhir 40 jt; unit terjual 2.000.
Output: COGS = 50 + 300 − 40 = **310 jt**; HPP per unit = 310 jt ÷ 2.000 = **155.000**. Jika harga jual 200.000 → margin kotor per unit 45.000 (22,5%) sebelum biaya operasional.