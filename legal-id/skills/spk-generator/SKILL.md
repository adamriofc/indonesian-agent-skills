---
name: spk-generator
description: Generate legally binding Indonesian Service Agreements (SPK) or partnership contracts compliant with Article 1320 and 1338 of KUHPerdata.
argument-hint: "<contractor_role> <project_name> <price_termijn>"
---

# SPK Generator (Surat Perjanjian Kerja / Kemitraan)

A professional engine for drafting bilateral business contracts in Indonesia under the Civil Code (KUHPerdata).

## Legal Provenance & Governance
* **Statutory Basis**: KUHPerdata Art. 1320 (Syarat Sah Perjanjian: Kesepakatan, Kecakapan, Hal Tertentu, Sebab yang Halal) & Art. 1338 (Asas Pacta Sunt Servanda).
* **Disclaimer**: Drafts produced must be reviewed by corporate legal teams prior to signing and stamping (Materai Rp 10.000).

## Required Information Input Model
1. **Identitas Para Pihak**: Pihak Pertama (Pemberi Kerja) & Pihak Kedua (Pelaksana Kerja). Include Name, NIK, Address, Position, and PT Name.
2. **Ruang Lingkup Pekerjaan (SOW)**: Deliverables, acceptance criteria, and project timeline.
3. **Nilai Kontrak & Metode Pembayaran**: Total value, inclusion/exclusion of PPN 11% & PPh 23, and milestone schedule (Termijn).
4. **Berita Acara Serah Terima (BAST)**: Required mechanism before final payment release.
5. **Yurisdiksi Sengketa**: BANI (Arbitrase) vs Pengadilan Negeri.

## Mandated Statutory Clauses

### Pasal 1: Ruang Lingkup Pekerjaan & BAST
"Pihak Pertama menunjuk Pihak Kedua untuk melaksanakan pekerjaan [Proyek] sesuai spesifikasi Lampiran I. Pekerjaan dinyatakan selesai secara sah setelah Pihak Pertama menandatangani Berita Acara Serah Terima (BAST)."

### Pasal 2: Hak dan Kewajiban Pembayaran
"Pembayaran dilakukan bertahap via transfer bank ke rekening Pihak Kedua:
a. Uang Muka (DP): [Persentase]% setelah SPK ditandatangani.
b. Termijn I: [Persentase]% setelah Milestone 1 selesai dan BAST I ditandatangani.
c. Pelunasan: [Persentase]% setelah BAST Final ditandatangani."

### Pasal 3: Wanprestasi & Pengesampingan Pasal 1266 KUHPerdata
"Apabila salah satu pihak lalai melaksanakan kewajibannya (Wanprestasi), pihak yang dirugikan berhak mengakhiri perjanjian setelah memberikan Surat Peringatan tertulis berturut-turut sebanyak 2 (dua) kali dengan tenggat perbaikan masing-masing 7 (tujuh) hari kerja. Kedua Pihak sepakat mengesampingkan ketentuan Pasal 1266 KUHPerdata sepanjang dibutuhkannya putusan pengadilan untuk pengakhiran ini."

### Pasal 4: Penyelesaian Sengketa
"Setiap perselisihan diselesaikan secara musyawarah untuk mufakat dalam waktu 30 (tiga puluh) hari kalender. Apabila tidak tercapai mufakat, Kedua Pihak sepakat memilih domisili hukum di Pengadilan Negeri [Lokasi] / Badan Arbitrase Nasional Indonesia (BANI)."
