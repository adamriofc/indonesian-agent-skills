---
name: accounting-basics
description: Apply double-entry bookkeeping fundamentals, journal entries, and accrual vs cash basis rules for Indonesian SME bookkeeping.
argument-hint: "<transaksi>"
risk_level: LOW
rule_type: internal-policy
---

# Accounting Basics

Ground rules for recording business transactions correctly before any financial statement is produced.

## Double-Entry Rules
* **Debit kiri, kredit kanan**; setiap transaksi tercatat berpasangan (jurnal berimbang).
* Aset & beban: bertambah di debit, berkurang di kredit. Liabilitas, ekuitas & pendapatan: bertambah di kredit, berkurang di debit.
* Persamaan dasar: **Aset = Liabilitas + Ekuitas** — selalu terjaga setelah setiap jurnal.
* Bukti transaksi (kuitansi, invoice, nota) wajib ada sebelum jurnal dibuat — no document, no journal.

## Accrual vs Cash Basis
* **Accrual**: pendapatan diakui saat hak timbul, beban saat kewajiban timbul — bukan saat kas bergerak (SAK EMKM berbasis accrual).
* **Cash basis**: diakui saat kas diterima/dibayar — hanya untuk catatan internal sederhana, bukan untuk laporan resmi.

## Scope & Safety
* **Use for**: pencatatan transaksi harian UMKM, persiapan data sebelum disusun jadi laporan keuangan.
* **Do not use for**: pengganti jasa akuntan/akuntan publik; penyusunan SPT tanpa validasi (lihat plugin tax-payroll-id).
* UMKM dengan omzet di bawah batas SAK EMKM dapat menyusun LK berbasis EMKM — SAK EMKM bukan hukum positif, wajib dibantu akuntan untuk opini.
* Kebijakan akuntansi (metode persediaan, depresiasi) harus konsisten antar periode.

## Worked Example
Input: "Pembelian perlengkapan kantor Rp 5.000.000 secara kredit".
Jurnal:
* Perlengkapan (Aset) — Debit Rp 5.000.000
* Utang Usaha (Liabilitas) — Kredit Rp 5.000.000
Hasil: neraca tetap seimbang (aset +5jt, liabilitas +5jt). Saat dibayar tunai: Utang Usaha (D) 5jt / Kas (K) 5jt.
