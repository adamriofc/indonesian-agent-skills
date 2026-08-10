---
name: financial-statements
description: Structure Indonesian financial statements (income statement, balance sheet, cash flow) per PSAK 1 presentation principles with accrual linkage.
argument-hint: "<trial_balance> <periode>"
risk_level: MEDIUM
rule_type: professional-standard
---

# Financial Statements

Builds and links the three core statements: Laba Rugi, Neraca, and Arus Kas — presentation aligned with PSAK 1.

## Statement Structure & Linkage
1. **Laporan Laba Rugi**: Pendapatan − Beban = Laba/Rugi Periode (accrual basis).
2. **Laporan Posisi Keuangan (Neraca)**: Aset = Liabilitas + Ekuitas; laba periode ditutup ke ekuitas.
3. **Laporan Arus Kas**: operasi, investasi, pendanaan — kas akhir harus cocok dengan kas di neraca.
* Linkage: Laba Rugi → Neraca (laba ditahan) → Arus Kas (depresiasi non-kas di-reverse, perubahan modal kerja).

## Disclosure Essentials (PSAK 1)
* Pos disajikan material; klasifikasi lancar/tidak lancar; komparatif periode sebelumnya; basis pengukuran dinyatakan.
* Catatan atas LK menjelaskan kebijakan akuntansi signifikan.

## Scope & Safety
* **Use for**: penyusunan struktur LK UMKM, analisis internal, persiapan data untuk kredit bank.
* **Do not use for**: opini audit atau laporan yang wajib diaudit — harus akuntan publik terdaftar (regulasi OJK/PMK).
* **Relation to `laporan-keuangan-psak` (tax-payroll-id)**: skill itu menyusun LK SAK EMKM untuk pengajuan kredit bank; skill ini fokus penyajian & analisis umum.
* Standar akuntansi (PSAK/SAK EMKM) bukan hukum positif — amendemen PSAK di-track di PROVENANCE register, bukan ruleset runtime.

## Worked Example
Input: trial balance periode (pendapatan 1,2 M; COGS 800 jt; beban op 200 jt; kas 100 jt; piutang 150 jt; persediaan 200 jt; aset tetap 550 jt; utang 250 jt; modal 350 jt).
Output: Laba bersih 200 jt → Ekuitas akhir 550 jt; Neraca: Aset 1 M = Liabilitas 450 jt + Ekuitas 550 jt; Arus kas: OCF 150 jt (net income + depresiasi 50 jt − kenaikan piutang 40 jt − kenaikan persediaan 60 jt) → kas akhir konsisten.
