---
name: klaim-logistik-retur
description: SOP guidelines and claim submission templates for lost or damaged courier packages (J&T, JNE, SiCepat, Shopee Xpress).
argument-hint: "<waybill_number> <courier_name> <damage_or_lost_details>"
risk_level: MEDIUM
rule_type: platform-policy
---

# Logistics Claim & Return SOP Generator

Drafts formal insurance claim reports to couriers and marketplace resolution centers.

## Required Claim Package
1. **Bukti Resi (Airwaybill)** & Order ID.
2. **Video Unboxing Tanpa Jeda**: Unbroken unboxing video demonstrating outer package label + damage.
3. **Foto Kerusakan / Barang Hilang**: Photos of damaged item + packaging box.
4. **Surat Pertanggungjawaban**: Formal claim letter requesting 100% item value reimbursement under courier insurance policy.

## Claim Timeline (umum)
* **Paket hilang**: klaim diajukan 7-30 hari sejak status resi berhenti; masing-masing kurir beda SOP (J&T ≤ 30 hari, JNE ≤ 30 hari, SiCepat ≤ 21 hari, Shopee Xpress via pusat resolusi 7-14 hari).
* **Paket rusak**: foto+video wajib dikirim ≤ 24-48 jam setelah diterima — lewat dari itu umumnya ditolak.
* **Proses**: ajukan via marketplace (CS/komplain pesanan) terlebih dahulu bila transaksi marketplace — kurir biasanya memproses setelah marketplace approve.

## Scope & Safety
* **Use for**: klaim asuransi kiriman standar (nilai barang ≤ limit pertanggungan default).
* **Do not use for**: barang tanpa asuransi (nilai > limit tanpa extra cover), kiriman ilegal, atau klaim rugi immaterial — tidak dipertanggungkan.
* **Anti-scam**: jangan pernah "mempercantik" bukti (foto diedit) — bisa berujung penolakan permanen & blacklist.

## Worked Example
Input: `waybill: "JT123456789" / courier: "J&T" / "paket hilang setelah 20 hari"`
Draft: Surat klaim → lampirkan resi JT123456789, bukti pembayaran, chat konfirmasi pengiriman, screenshot status resi berhenti di tanggal X → ajukan via CS J&T (hotline/portal) → follow up hari ke-7 → bila buntu, eskalasi via marketplace resolution center + laporan ke WhatsApp Business resmi J&T. Nilai klaim = harga produk (≥ limit default? cek skema asuransi).