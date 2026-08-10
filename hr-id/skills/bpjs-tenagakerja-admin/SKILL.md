---
name: bpjs-tenagakerja-admin
description: Guide for HR administrators managing the BPJS Ketenagakerjaan corporate portal (SIPP).
argument-hint: "<task_description_e_g_register_new_hire>"
risk_level: MEDIUM
rule_type: statutory
---

# SIPP BPJS Portal Administration Guide

Step-by-step operational manual for HR teams managing BPJS Ketenagakerjaan employee mutations on the SIPP Online portal.

## Core Operational Workflows
1. **New Hire Onboarding**: Mutasi Data > Tambah Tenaga Kerja. Input NIK, Name, Date of Birth, Salary.
2. **Employee Offboarding (Nonaktif)**: Mutasi Data > Tenaga Kerja Keluar. Must submit prior to the 25th of the month to prevent billing in the next cycle.

## Compliance Checklist
* **JHT/JKK/JKM/JP enrollment**: wajib sejak hari pertama kerja (UU 24/2011 jo. PP 45/2015) — jangan menunggu masa percobaan selesai.
* **Upah pelaporan**: laporkan gaji penuh (bukan gaji pokok saja) — dasar iuran & klaim; kesalahan = selisih iuran + sanksi.
* **Deadlines**: perubahan gaji/batas upah JP (lihat `engines/rules/bpjs.json`) → update SIPP tiap periode SE baru; offboarding ≤ tanggal 25.
* **Verifikasi**: setelah submit, cek status "Approved" & simpan bukti; doc iuran disimpan untuk audit (min. 5 tahun).

## Scope & Safety
* **Use for**: mutasi kepesertaan, pelaporan berkala, pengecekan status iuran.
* **Do not use for**: perhitungan iuran — pakai engine `bpjs-calculator`; keputusan klaim/manfaat di tangan BPJS (bukan perusahaan).
* **Risiko**: kelalaian pelaporan (telat/underreport) = tunggakan + denda administratif; laporkan ke pihak berwenang bila ada selisih data karyawan.

## Worked Example
Input: `task: "register new hire"` — Data: NIK 3174..., nama, TTL, upah Rp 8.000.000, JKK low.
Alur: Login SIPP → Mutasi Data → Tambah Tenaga Kerja → isi NIK+data pribadi → upah 8 jt → JKK low risk → submit → cek status Acknowledged/Approved → catat nomor referensi. Iuran (jalankan engine): JHT 4%+2%, JP 2%+1%(cap 8 jt), JKK 0,54%, JKM 0,3%.