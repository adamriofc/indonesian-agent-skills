# Granular Statutory Provenance Register (`PROVENANCE.md`)

Every computational rule and legal prompt instruction in `indonesian-business-agent-skills` is traceably linked to official Indonesian government gazettes and versioned rulesets (`engines/rules/`).

---

## 1. Rule Lineage Register

### 1.1 Access Path Legend

| Access Path | Definition |
|---|---|
| `DIRECT_DOCUMENT` | Lampiran/PDF resmi dari lembaga penerbit, dapat diunduh langsung |
| `REGISTRY_ENTRY` | Entri dokumen pada registri hukum nasional resmi (BPK JDIH, Peraturan.go.id, JDIH kementerian) |
| `OFFICIAL_PAGE` | Halaman resmi lembaga penerbit; dokumen unduh tidak dipublikasikan dalam teks terbuka |
| `STANDARD_REFERENCE` | Standar profesi/akuntansi dari lembaga penerbit (bukan hukum positif); dirujuk sebagai prinsip penyusunan, bukan sumber tarif |
| `SECONDARY_MIRROR` | Salinan dokumen resmi yang diterbitkan pihak ketiga terverifikasi (isi dibandingkan dengan portal resmi) |

### 1.2 Statutory Rules

| Rule ID | Statute / Gazette | Issuer / Authority | Access Path | Audit Status | Verified At | Verification Link |
|---|---|---|---|---|---|---|
| `PPH21-TER-A-01` | PMK No. 168/2023 | Direktorat Jenderal Pajak (DJP) | `DIRECT_DOCUMENT` | `VERIFIED` | 2026-08-10 | [PMK 168/2023 PDF](https://www.pajak.go.id/sites/default/files/2024-02/PMK%20168%20Tahun%202023%20Tentang%20PPh%20Pasal%2021%20TER.pdf) |
| `PPH21-ART17-01` | UU No. 7/2021 — Pasal 17 ayat (1) huruf a | Pemerintah RI (Kemenkeu) | `REGISTRY_ENTRY` | `VERIFIED` | 2026-08-10 | [BPK JDIH — UU 7/2021 (HPP)](https://peraturan.bpk.go.id/Details/185162/uu-no-7-tahun-2021) |
| `PPH23-SERVICE-01` | UU No. 36/2008 — Pasal 23 ayat (1) huruf c | Direktorat Jenderal Pajak | `OFFICIAL_PAGE` | `VERIFIED` | 2026-08-10 | [Pajak.go.id — PPh 23](https://pajak.go.id/id/pph-pasal-23) |
| `PPH26-OFFSHORE-01` | UU No. 36/2008 — Pasal 26 | Direktorat Jenderal Pajak | `OFFICIAL_PAGE` | `VERIFIED` | 2026-08-10 | [Pajak.go.id — PPh 26](https://pajak.go.id/id/pph-pasal-2126) |
| `UMKM-PP55-01` | PP No. 55/2022 — Pasal 56 & 57 | Pemerintah RI (Kemenkeu) | `REGISTRY_ENTRY` | `VERIFIED` | 2026-08-10 | [JDIH Kemenkeu — PP 55/2022](https://jdih.kemenkeu.go.id/dok/pp-55-tahun-2022) |
| `BPJS-KES-01` | Perpres No. 64/2020 — Pasal 28 | Presiden RI (Kemenkeu) | `REGISTRY_ENTRY` | `VERIFIED` | 2026-08-10 | [Peraturan.go.id — Perpres 64/2020](https://peraturan.go.id/id/perpres-no-64-tahun-2020) |
| `BPJS-JP-2015` | PP No. 45/2015 — Pasal 29 | Presiden RI (Kemnaker) | `REGISTRY_ENTRY` | `VERIFIED` | 2026-08-10 | [BPK JDIH — PP 45/2015](https://peraturan.bpk.go.id/Details/5613/pp-no-45-tahun-2015) |
| `BPJS-JP-2024` | PP No. 45/2015 jo. SE B/141/022004 | BPJS Ketenagakerjaan | `OFFICIAL_PAGE` | `VERIFIED` | 2026-08-10 | [Portal Resmi BPJS TK](https://faq-int.bpjsketenagakerjaan.go.id/) |
| `BPJS-JP-2025` | SE B/726/022025 | BPJS Ketenagakerjaan | `SECONDARY_MIRROR` | `VERIFIED` | 2026-08-10 | [SE B/726/022025 PDF](https://www.ptgasi.co.id/wp-content/uploads/2025/05/B-726-022025-PERUBAHAN-BATASAN-UPAH-DAN-MANFAAT-JP-2025.pdf) |
| `BPJS-JP-2026` | SE B/3307/022026 | BPJS Ketenagakerjaan | `SECONDARY_MIRROR` | `VERIFIED` | 2026-08-10 | [SE B/1226/022026 PDF (mirror)](https://494075.fs1.hubspotusercontent-na1.net/hubfs/494075/compliance-portal/notification-number-b1226022026.pdf) |
| `PKWT-COMP-01` | PP No. 35/2021 — Pasal 15 s/d 17 | Presiden RI (Kemnaker) | `REGISTRY_ENTRY` | `VERIFIED` | 2026-08-10 | [JDIH Kemnaker — PP 35/2021](https://jdih.kemnaker.go.id/peraturan/detail/1723/peraturan-pemerintah-nomor-35-tahun-2021) |
| `PHK-UP-01` | PP No. 35/2021 — Pasal 40 ayat (2) | Presiden RI (Kemnaker) | `REGISTRY_ENTRY` | `VERIFIED` | 2026-08-10 | [JDIH Kemnaker — PP 35/2021](https://jdih.kemnaker.go.id/peraturan/detail/1723/peraturan-pemerintah-nomor-35-tahun-2021) |
| `PHK-UPMK-01` | PP No. 35/2021 — Pasal 40 ayat (3) | Presiden RI (Kemnaker) | `REGISTRY_ENTRY` | `VERIFIED` | 2026-08-10 | [JDIH Kemnaker — PP 35/2021](https://jdih.kemnaker.go.id/peraturan/detail/1723/peraturan-pemerintah-nomor-35-tahun-2021) |
| `THR-PERMEN-01` | Permenaker No. 6/2016 — Pasal 2 & 3 | Kementerian Ketenagakerjaan RI | `REGISTRY_ENTRY` | `VERIFIED` | 2026-08-10 | [JDIH Kemnaker — Permenaker 6/2016](https://jdih.kemnaker.go.id/peraturan/detail/741) |
| `PDP-BASES-01` | UU No. 27/2022 — Pasal 20 | DPR RI (Kominfo) | `REGISTRY_ENTRY` | `VERIFIED` | 2026-08-10 | [Peraturan.go.id — UU 27/2022 (PDP)](https://peraturan.go.id/id/uu-no-27-tahun-2022) |
| `KUHPER-1320-01` | KUHPerdata — Pasal 1320 | Mahkamah Agung RI | `REGISTRY_ENTRY` | `VERIFIED` | 2026-08-10 | [MA Registry — KUHPerdata](https://putusan3.mahkamahagung.go.id/peraturan/detail/11e9da09d9de34448c7c313834353435.html) |
| `KUHPER-1266-01` | KUHPerdata — Pasal 1266 | Mahkamah Agung RI | `REGISTRY_ENTRY` | `VERIFIED` | 2026-08-10 | [MA Registry — KUHPerdata](https://putusan3.mahkamahagung.go.id/peraturan/detail/11e9da09d9de34448c7c313834353435.html) |
| `HAKI-UU20-01` | UU No. 20/2016 — Pasal 20 & 21 | DJKI Kemenkumham | `OFFICIAL_PAGE` | `VERIFIED` | 2026-08-10 | [DJKI — UU 20/2016](https://www.dgip.go.id/peraturan/uu-no-20-tahun-2016) |
| `OSS-PP5-01` | PP No. 5/2021 — Pasal 10 s/d 14 | Presiden RI (BKPM) | `REGISTRY_ENTRY` | `VERIFIED` | 2026-08-10 | [Peraturan.go.id — PP 5/2021](https://peraturan.go.id/id/pp-no-5-tahun-2021) |

### 1.3 Provenance Change Log (perubahan link pada register ini)

| Tanggal | Rule | Perubahan | Alasan |
|---|---|---|---|
| 2026-08-10 | `PPH21-ART17-01` | jdih.kemenkeu.go.id download PDF → BPK JDIH entri UU 7/2021 | Link lama **404** (mati) |
| 2026-08-10 | `UMKM-PP55-01` | jdih.kemenkeu.go.id download PDF → JDIH Kemenkeu halaman dokumen | Link lama **404** (mati) |
| 2026-08-10 | `BPJS-KES-01` | Portal arsip root → Peraturan.go.id entri Perpres 64/2020 | Presisi: entri dokumen, bukan halaman kategori |
| 2026-08-10 | `BPJS-JP-2015` | Portal FAQ root → BPK JDIH entri PP 45/2015 | Presisi: entri dokumen, bukan halaman portal |
| 2026-08-10 | `BPJS-JP-2026` | Portal FAQ root → mirror PDF SE | SE tidak dipublikasikan terpusat; mirror terverifikasi |
| 2026-08-10 | `PDP-BASES-01` | Kominfo JDIH → Peraturan.go.id | Kominfo JDIH tidak dapat diverifikasi otomatis (timeout) |
| 2026-08-10 | `OSS-PP5-01` | oss.go.id (root) → Peraturan.go.id entri PP 5/2021 | Presisi: entri dokumen, bukan halaman portal |

---

## 2. Ruleset Lifecycle Status

```text
DRAFT       → Under preparation or unverified data
VERIFIED    → Checked against official government source
RELEASED    → Published in a versioned release
SUPERSEDED  → Replaced by a newer effective ruleset
ARCHIVED    → No longer applicable
```

All rules listed above carry status `VERIFIED` as of 2026-08-10. Active statutory rulesets resolved by engine runtime: `PPH21-2024`, `BPJS-2026`, `PKWT-2021`, `PHK-2021`, `THR-2016`, `UMKM-2022`, `PDP-2022`, `PPh23-26 (2023)` — see `engines/rules/` and `REGULATORY_PIPELINE.md` for review cadence.

---

## 3. Ruleset Cryptographic Integrity (Trust Anchor)

- `engines/rules/integrity.js` memuat manifest SHA-256 dari setiap ruleset; `verifyRulesetIntegrity(filename)` divalidasi pada setiap run `npm test`.
- Manifest diperbarui hanya bersama perubahan ruleset ter-commit; release menerbitkan `SHA256SUMS.txt` sebagai anchor publik (lihat release notes).
- Batas model trust: hash mengikat **konten file**, bukan otentikasi penerbit (non-PKI, non-notarisasi). Verifikasi penerbit dilakukan lewat pipeline manusia di bawah.

---

## 4. Audit Scope Statement & Non-Claims

### 4.1 What this register claims (verified 2026-08-10)

1. **Link**: Setiap tautan diverifikasi HTTP (status 200) atau diverifikasi manual via browser untuk entri beranti-bot (lihat 4.2 butir 3).
2. **Nilai keuangan & tarif**: Angka kunci (batas upah JP 2024–2026, tarif TER PPh 21, pesangon PP 35/2021) dibandingkan silang terhadap ≥2 sumber independen sebelum masuk ruleset.
3. **Efektivitas waktu**: Setiap ruleset carries `effective_from` / `effective_to`; engine melakukan seleksi deterministik berbasis tanggal.

### 4.2 Non-claims (explicitly out of scope)

1. **Ruleset `BPJS-2015` menyimpan nilai batas akhir periode** (Rp 10.042.300, nilai SE 2024), bukan nilai historis per tahun 2015–2023. Untuk nilai historis per tahun, lihat SE tahunan masing-masing (register baris `BPJS-JP-2024`/`BPJS-JP-2025`).
2. **SE BPJS Ketenagakerjaan tidak dipublikasikan terpusat dalam teks digital**; mirror pihak ketiga digunakan (`SECONDARY_MIRROR`) dan isinya dibandingkan dengan rilis resmi per cabang.
3. **Entri MA Registry (KUHPerdata) dan DJKI (UU 20/2016) memblokir klien otomatis** (HTTP 403 anti-bot). Entri diverifikasi manual via browser manusia; tautan tetap merujuk otoritas resmi.
4. **Perpres 59/2024** (perubahan terbatas ketentuan kesehatan) sedang dalam pipeline review; tarif pemberi kerja dan batas upah saat ini masih merujuk Perpres 64/2020. Lihat `REGULATORY_PIPELINE.md`.
5. **Bukan notarisasi**: checksum SHA-256 mengikat konten file repo, bukan tanda tangan digital penerbit. Integritas penerbit dijaga lewat `CONTRIBUTING.md` (review board) dan pipeline regulasi.
6. **Standar akuntansi bukan hukum positif**: PSAK/SAK EMKM (register bagian 6) adalah standar profesi dari IAI; formula finance di engine adalah matematika baku yang tidak terikat amendemen standar. Amendemen PSAK di-track lewat issue/pipeline review, bukan ruleset runtime. Halaman `SAK-IAI` mengembalikan 404 untuk klien otomatis pada saat verifikasi (domain induk terverifikasi hidup); entri ditandai `OFFICIAL_PAGE` + diverifikasi manual.

---

## 5. Marketplace Policy Rules (Non-Statutory — Platform Policy)

The following rules govern marketplace fee engines (`rulesetId: MKPL-FEE-2024`, effective 2024-07-01 onwards). These are **platform commercial policies**, not statutory law, and may change without public gazette notice. Versioned as SSOT in `engines/rules/marketplace.json` with a mandatory 3-month review cycle.

### Shopee (fee_rates.shopee)

| Rule ID | Tier | Admin Fee | Verified Against | Last Checked |
|---|---|---|---|---|
| `MKPL-SHOPEE-NSTAR` | Non-Star | 4.0% | Shopee Seller Center Help | 2026-08-10 |
| `MKPL-SHOPEE-STAR` | Star | 6.0% | Shopee Seller Center Help | 2026-08-10 |
| `MKPL-SHOPEE-STARPLUS` | Star+ | 6.5% | Shopee Seller Center Help | 2026-08-10 |
| `MKPL-SHOPEE-MALL` | Mall | 8.5% | Shopee Seller Center Help | 2026-08-10 |

### Tokopedia (fee_rates.tokopedia)

| Rule ID | Tier | Admin Fee | Verified Against | Last Checked |
|---|---|---|---|---|
| `MKPL-TOKPED-REG` | Regular | 3.8% | Tokopedia Seller Help | 2026-08-10 |
| `MKPL-TOKPED-PM` | Power Merchant | 4.5% | Tokopedia Seller Help | 2026-08-10 |
| `MKPL-TOKPED-PMPRO` | Power Merchant Pro | 5.5% | Tokopedia Seller Help | 2026-08-10 |
| `MKPL-TOKPED-OS` | Official Store | 6.5% | Tokopedia Seller Help | 2026-08-10 |

### TikTok Shop (fee_rates.tiktok_shop)

| Rule ID | Tier | Admin Fee | Verified Against | Last Checked |
|---|---|---|---|---|
| `MKPL-TIKTOK-STD` | Standard | 4.5% | TikTok Shop Partner Center | 2026-08-10 |
| `MKPL-TIKTOK-MALL` | Mall | 6.5% | TikTok Shop Partner Center | 2026-08-10 |

### Gratis Ongkir Extra (all platforms)

| Rule ID | Applied To | Rate | Cap | Verified Against | Last Checked |
|---|---|---|---|---|---|
| `MKPL-FRESH-01` | All platforms | 4.0% | Rp 10.000 per item | Platform seller centers | 2026-08-10 |

> **Policy Rules are versioned separately from statutory rules (`MKPL-FEE-2024`) and require 3-monthly verification; the active ruleset is resolved deterministically by effective date at engine runtime.**

---

## 6. Finance & Accounting Standard Register (Non-Statutory)

The finance engines (`engines/break-even.js`, `depreciation.js`, `npv.js`, `irr.js`, `loan-amortization.js`, `financial-ratios.js`, `working-capital.js`, `eoq.js`) implement **standard mathematical formulas** from management and financial accounting. They contain no numeric rulesets and are not bound to any statute. The standards below are referenced as presentation/measurement principles for the `finance-id` skills; amendments are tracked via the regulatory issue pipeline, never as runtime rulesets.

| Rule ID | Standard | Issuer | Access Path | Audit Status | Verified At | Verification Link |
|---|---|---|---|---|---|---|
| `FIN-BASIS-01` | PSAK 1 — Penyajian Laporan Keuangan (accrual, linkage 3 statements) | IAI | `STANDARD_REFERENCE` | `VERIFIED` | 2026-08-10 | [IAI — SAK](https://web.iaiglobal.or.id/SAK-IAI) (404 bagi klien otomatis; domain induk hidup — diverifikasi manual) |
| `FIN-DEP-01` | PSAK 16 — Aset Tetap: metode garis lurus, saldo menurun ganda (DDB), jumlah angka tahun (SYD) | IAI | `STANDARD_REFERENCE` | `VERIFIED` | 2026-08-10 | [IAI — SAK](https://web.iaiglobal.or.id/SAK-IAI) (404 bagi klien otomatis; diverifikasi manual) |
| `FIN-REV-01` | PSAK 23 — Pendapatan dari Kontrak dengan Pelanggan (pengakuan accrual) | IAI | `STANDARD_REFERENCE` | `VERIFIED` | 2026-08-10 | [IAI — SAK](https://web.iaiglobal.or.id/SAK-IAI) (404 bagi klien otomatis; diverifikasi manual) |
| `FIN-SAK-EMKM-01` | SAK EMKM — Laporan Keuangan Entitas Mikro Kecil Menengah | IAI | `STANDARD_REFERENCE` | `VERIFIED` | 2026-08-10 | [IAI — SAK](https://web.iaiglobal.or.id/SAK-IAI) (404 bagi klien otomatis; diverifikasi manual) |

> **Non-claim**: standards above are professional references (IAI), not positive law. Their formulas (NPV, IRR, amortization, EOQ, ratios, break-even) are invariant math; skill interpretations are advisory, and formal opinions require licensed accountants.