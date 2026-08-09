# Granular Statutory Provenance Register (`PROVENANCE.md`)

Every computational rule and legal prompt instruction in `indonesian-agent-skills` is traceably linked to official Indonesian government gazettes and versioned rulesets (`engines/rules/`).

---

## 1. Rule Lineage Register

| Rule ID | Statute / Gazette | Issuer / Authority | Source Type | Audit Status | Verified At | Verification Link |
|---|---|---|---|---|---|---|
| `PPH21-TER-A-01` | PP No. 58/2023 | Direktorat Jenderal Pajak (DJP) | Primary | `VERIFIED` | 2026-08-10 | [PMK 168/2023 PDF](https://www.pajak.go.id/sites/default/files/2024-02/PMK%20168%20Tahun%202023%20Tentang%20PPh%20Pasal%2021%20TER.pdf) |
| `PPH21-ART17-01` | UU No. 7/2021 — Pasal 17 ayat (1) huruf a | Kementerian Keuangan RI | Primary | `VERIFIED` | 2026-08-10 | [UU HPP PDF](https://jdih.kemenkeu.go.id/download/1c93a027-e448-4e89-9a74-b52b8eb6a9d7/7~UU~2021.pdf) |
| `PPH23-SERVICE-01` | UU No. 36/2008 — Pasal 23 ayat (1) huruf c | Direktorat Jenderal Pajak | Primary | `VERIFIED` | 2026-08-10 | [Pajak.go.id — PPh 23](https://pajak.go.id/id/pph-pasal-23) |
| `PPH26-OFFSHORE-01` | UU No. 36/2008 — Pasal 26 | Direktorat Jenderal Pajak | Primary | `VERIFIED` | 2026-08-10 | [Pajak.go.id — PPh 26](https://pajak.go.id/id/pph-pasal-2126) |
| `UMKM-PP55-01` | PP No. 55/2022 — Pasal 56 & 57 | Kementerian Keuangan RI | Primary | `VERIFIED` | 2026-08-10 | [PP 55/2022 JDIH Kemenkeu](https://jdih.kemenkeu.go.id/Download/92786/PP%20Nomor%2055%20Tahun%202022.pdf) |
| `BPJS-KES-01` | Perpres No. 64/2020 — Pasal 28 | BPJS Kesehatan | Primary | `VERIFIED` | 2026-08-10 | [Perpres 64/2020 BPJS](https://www.bpjs-kesehatan.go.id/bpjs/arsip/categories/MTcz) |
| `BPJS-JP-2015` | PP No. 45/2015 — Pasal 29 | BPJS Ketenagakerjaan | Primary | `VERIFIED` | 2026-08-10 | [BPJS TK FAQ](https://faq-int.bpjsketenagakerjaan.go.id/) |
| `BPJS-JP-2024` | PP No. 45/2015 & BPJS SE 2024 — Pasal 29 | BPJS Ketenagakerjaan | Primary | `VERIFIED` | 2026-08-10 | [BPJS TK FAQ](https://faq-int.bpjsketenagakerjaan.go.id/) |
| `BPJS-JP-2025` | BPJS SE B/726/022025 — Surat Edaran | BPJS Ketenagakerjaan | Primary / Secondary | `VERIFIED` | 2026-08-10 | [BPJS TK FAQ (Primary)](https://faq-int.bpjsketenagakerjaan.go.id/) / [SE B/726 PDF (Secondary)](https://www.ptgasi.co.id/wp-content/uploads/2025/05/B-726-022025-PERUBAHAN-BATASAN-UPAH-DAN-MANFAAT-JP-2025.pdf) |
| `BPJS-JP-2026` | BPJS SE B/3307/022026 — Surat Edaran | BPJS Ketenagakerjaan | Primary | `VERIFIED` | 2026-08-10 | [BPJS TK FAQ](https://faq-int.bpjsketenagakerjaan.go.id/) |
| `PKWT-COMP-01` | PP No. 35/2021 — Pasal 15 s/d 17 | Kementerian Ketenagakerjaan RI | Primary | `VERIFIED` | 2026-08-10 | [Kemnaker JDIH — PP 35/2021](https://jdih.kemnaker.go.id/peraturan/detail/1723/peraturan-pemerintah-nomor-35-tahun-2021) |
| `PHK-UP-01` | PP No. 35/2021 — Pasal 40 ayat (2) | Kementerian Ketenagakerjaan RI | Primary | `VERIFIED` | 2026-08-10 | [Kemnaker JDIH — PP 35/2021](https://jdih.kemnaker.go.id/peraturan/detail/1723/peraturan-pemerintah-nomor-35-tahun-2021) |
| `PHK-UPMK-01` | PP No. 35/2021 — Pasal 40 ayat (3) | Kementerian Ketenagakerjaan RI | Primary | `VERIFIED` | 2026-08-10 | [Kemnaker JDIH — PP 35/2021](https://jdih.kemnaker.go.id/peraturan/detail/1723/peraturan-pemerintah-nomor-35-tahun-2021) |
| `THR-PERMEN-01` | Permenaker No. 6/2016 — Pasal 2 & Pasal 3 | Kementerian Ketenagakerjaan RI | Primary | `VERIFIED` | 2026-08-10 | [Kemnaker JDIH — Permenaker 6/2016](https://jdih.kemnaker.go.id/peraturan/detail/741) |
| `PDP-BASES-01` | UU No. 27/2022 — Pasal 20 | Kementerian Kominfo / DPR RI | Primary | `VERIFIED` | 2026-08-10 | [Kominfo JDIH — UU PDP](https://jdih.kominfo.go.id/produk_hukum/view/id/801/t/undang+undang+nomor+27+tahun+2022) |
| `KUHPER-1320-01` | KUHPerdata — Pasal 1320 | Mahkamah Agung RI | Primary | `VERIFIED` | 2026-08-10 | [MA JDIH](https://jdih.mahkamahagung.go.id/) |
| `KUHPER-1266-01` | KUHPerdata — Pasal 1266 | Mahkamah Agung RI | Primary | `VERIFIED` | 2026-08-10 | [MA JDIH](https://jdih.mahkamahagung.go.id/) |
| `HAKI-UU20-01` | UU No. 20/2016 — Pasal 20 & 21 | DJKI Kemenkumham | Primary | `VERIFIED` | 2026-08-10 | [DJKI KEMENKUMHAM](https://www.dgip.go.id/peraturan/uu-no-20-tahun-2016) |
| `OSS-PP5-01` | PP No. 5/2021 — Pasal 10 s/d 14 | BKPM / OSS | Primary | `VERIFIED` | 2026-08-10 | [OSS.go.id](https://oss.go.id/) |

---

## 2. Ruleset Lifecycle Status

```text
DRAFT       → Under preparation or unverified data
VERIFIED    → Checked against official government source
RELEASED    → Published in a versioned release
SUPERSEDED  → Replaced by a newer effective ruleset
ARCHIVED    → No longer applicable
```

All rules listed above carry status `VERIFIED` as of 2026-08-10.

---

## 3. Marketplace Policy Rules (Non-Statutory — Platform Policy)

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
