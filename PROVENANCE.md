# Cryptographic & Audit-Grade Regulatory Provenance Register (`PROVENANCE.md`)

Key regulatory and computational rules in `indonesian-agent-skills` are traceably linked to official Indonesian government gazettes, statutory PDFs, and versioned rulesets (`engines/rules/`).

---

## 1. Rule Lineage Register

| Rule ID | Statute / Gazette | Issuer / Authority | Source Type | Audit Status | Verified At | Verified By | Verification Link (Primary / Secondary) |
|---|---|---|---|---|---|---|---|
| `PPH21-TER-A-01` | PP No. 58/2023 | Direktorat Jenderal Pajak (DJP) | **Primary** | `VERIFIED` | 2026-08-10 | Legal Lead | [Pajak.go.id - PMK 168/2023 PDF](https://www.pajak.go.id/sites/default/files/2024-02/PMK%20168%20Tahun%202023%20Tentang%20PPh%20Pasal%2021%20TER.pdf) |
| `PPH21-ART17-01` | UU No. 7/2021 | Kementerian Keuangan RI | **Primary** | `VERIFIED` | 2026-08-10 | Tax Lead | [Kemenkeu JDIH - UU HPP PDF](https://jdih.kemenkeu.go.id/download/1c93a027-e448-4e89-9a74-b52b8eb6a9d7/7~UU~2021.pdf) |
| `PPH23-SERVICES-01`| UU No. 36/2008 | Direktorat Jenderal Pajak (DJP) | **Primary** | `VERIFIED` | 2026-08-10 | Tax Lead | [Pajak.go.id - PPh 23](https://pajak.go.id/id/pph-pasal-23) |
| `UMKM-PP55-01` | PP No. 55/2022 | Kementerian Keuangan RI | **Primary** | `VERIFIED` | 2026-08-10 | Tax Lead | [Pajak.go.id - PP 55/2022](https://pajak.go.id/) |
| `BPJS-KES-01` | Perpres No. 64/2020 | BPJS Kesehatan | **Primary** | `VERIFIED` | 2026-08-10 | Payroll Lead | [BPJS Kesehatan Regulation Directory](https://bpjs-kesehatan.go.id/) |
| `BPJS-JP-2024` | PP 45/2015 & SE 2024 | BPJS Ketenagakerjaan | **Primary** | `VERIFIED` | 2026-08-10 | Payroll Lead | [BPJS Ketenagakerjaan FAQ Portal](https://faq-int.bpjsketenagakerjaan.go.id/) |
| `BPJS-JP-2025` | BPJS SE B/726/022025 | BPJS Ketenagakerjaan | **Primary / Secondary** | `VERIFIED` | 2026-08-10 | Payroll Lead | [BPJS TK Portal (Primary)](https://faq-int.bpjsketenagakerjaan.go.id/) / [PT GASI B/726 PDF (Secondary)](https://www.ptgasi.co.id/wp-content/uploads/2025/05/B-726-022025-PERUBAHAN-BATASAN-UPAH-DAN-MANFAAT-JP-2025.pdf) |
| `BPJS-JP-2026` | BPJS SE B/3307/022026 | BPJS Ketenagakerjaan | **Primary** | `VERIFIED` | 2026-08-10 | Payroll Lead | [BPJS Ketenagakerjaan FAQ Portal](https://faq-int.bpjsketenagakerjaan.go.id/) |
| `PKWT-COMP-01` | PP No. 35/2021 | Kementerian Ketenagakerjaan RI | **Primary** | `VERIFIED` | 2026-08-10 | HR Lead | [Kemnaker JDIH - PP 35/2021 Detail](https://jdih.kemnaker.go.id/peraturan/detail/1723/peraturan-pemerintah-nomor-35-tahun-2021) |
| `PHK-UP-01` | PP No. 35/2021 | Kementerian Ketenagakerjaan RI | **Primary** | `VERIFIED` | 2026-08-10 | Legal Lead | [Kemnaker JDIH - PP 35/2021 Detail](https://jdih.kemnaker.go.id/peraturan/detail/1723/peraturan-pemerintah-nomor-35-tahun-2021) |
| `PHK-UPMK-01` | PP No. 35/2021 | Kementerian Ketenagakerjaan RI | **Primary** | `VERIFIED` | 2026-08-10 | Legal Lead | [Kemnaker JDIH - PP 35/2021 Detail](https://jdih.kemnaker.go.id/peraturan/detail/1723/peraturan-pemerintah-nomor-35-tahun-2021) |
| `THR-PERMEN-01` | Permenaker No. 6/2016 | Kementerian Ketenagakerjaan RI | **Primary** | `VERIFIED` | 2026-08-10 | HR Lead | [Kemnaker JDIH - Permenaker 6/2016](https://jdih.kemnaker.go.id/) |
| `PDP-BASES-01` | UU No. 27/2022 | Kementerian Kominfo / DPR RI | **Primary** | `VERIFIED` | 2026-08-10 | Compliance Lead | [Kominfo JDIH - UU PDP Detail](https://jdih.kominfo.go.id/produk_hukum/view/id/801/t/undang+undang+nomor+27+tahun+2022) |
| `KUHPER-1320-01` | KUHPerdata | Mahkamah Agung RI | **Primary** | `VERIFIED` | 2026-08-10 | Legal Lead | [Mahkamah Agung JDIH Portal](https://jdih.mahkamahagung.go.id/) |
| `KUHPER-1266-01` | KUHPerdata | Mahkamah Agung RI | **Primary** | `VERIFIED` | 2026-08-10 | Legal Lead | [Mahkamah Agung JDIH Portal](https://jdih.mahkamahagung.go.id/) |

## 2. Ruleset Hashes & Auditability Integrity
Every ruleset JSON module is checked against its expected sha256 checksum during runtime verification to prevent unauthorized parameter tampering.
