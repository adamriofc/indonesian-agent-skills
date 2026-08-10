---
name: spt-tahunan-guide
description: Step-by-step guidance for filing individual annual tax returns (SPT Tahunan Wajib Pajak Orang Pribadi) on DJP Online.
argument-hint: "<spt_form_type> <has_1721_a1>"
risk_level: MEDIUM
rule_type: statutory
---

# Individual SPT Tahunan Filing Engine

Guides individual taxpayers in completing Form 1770, 1770S, or 1770SS via DJP Online.

## Selection Matrix
* **Form 1770SS**: Gross income <= Rp 60M/year from a single employer.
* **Form 1770S**: Gross income > Rp 60M/year or multiple employers.
* **Form 1770**: Independent business owners, freelancers, or professionals.

## Filing Steps (DJP Online)
1. Login djponline.pajak.go.id → menu **Lapor** → buat SPT.
2. Pilih form sesuai matrix → input data 1721-A1 / pembukuan.
3. Periksa PTKP status (TK/0, K/0, K/1, K/2, K/3) sesuai Perdirjen PER-2/2025 (tarif efektif & PTKP check).
4. Submit → terima BPE (Bukti Penerimaan Elektronik) — simpan minimal 5 tahun (UU KUP periode simpan).
5. Deadline: 31 Maret tahun berikutnya (individu), 30 April (WP usaha wajib lapor elektronik).

## Scope & Safety
* **Use for**: panduan pengisian & alur pelaporan; penghitungan silakan pakai engine `pph21-calculator`.
* **Do not use as**: substitute konsultan pajak untuk kasus non-resident, penghasilan LN tanpa kredit pajak PPh 24, atau tunggakan/restrukturisasi.
* **Penalty awareness**: telat lapor = sanksi Rp 100.000 (1770SS) / Rp 100.000–500.000 tergantung form; salah isi berpotensi pemeriksaan — verifikasi data dari 1721-A1/A2.

## Worked Example
Input: `spt_form_type: "1770S" / has_1721_a1: true, gaji bruto 150 jt, PTKP TK/0, PPh 21 sudah dipotong 3,6 jt`
Alur: Login → Lapor → 1770S → isi data 1721-A1 → cek kolom PPh terutang (pakai engine PPh21: TER + Art 17) → hasil: PPh terutang 150 jt × progesif → bandingkan dengan kredit potong 3,6 jt → lebih bayar/kurang bayar → submit → simpan BPE.