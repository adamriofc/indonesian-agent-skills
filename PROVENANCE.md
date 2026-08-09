# Granular Statutory Provenance Register (`PROVENANCE.md`)

Key regulatory and computational rules in `indonesian-agent-skills` are traceably linked to official Indonesian government gazettes, statutory PDFs, and versioned rulesets (`engines/rules/`).

---

## 1. Rule Lineage Register

| Rule ID | Statute / Gazette | Article / Section | Engine / Ruleset File | Direct Official Verification Link |
|---|---|---|---|---|
| `PPH21-TER-A-01` | PP No. 58/2023 | Lampiran Kategori A | `engines/rules/pph21.json` | [Pajak.go.id - PMK 168/2023 PDF](https://www.pajak.go.id/sites/default/files/2024-02/PMK%20168%20Tahun%202023%20Tentang%20PPh%20Pasal%2021%20TER.pdf) |
| `PPH21-ART17-01` | UU No. 7/2021 | Pasal 17 ayat (1) huruf a | `engines/rules/pph21.json` | [Kemenkeu JDIH - UU HPP](https://jdih.kemenkeu.go.id/download/1c93a027-e448-4e89-9a74-b52b8eb6a9d7/7~UU~2021.pdf) |
| `BPJS-KES-01` | Perpres No. 64/2020 | Pasal 28 | `engines/rules/bpjs.json` | [BPJS Kesehatan Official](https://bpjs-kesehatan.go.id/) |
| `BPJS-JP-2024` | PP 45/2015 & SE 2024 | Pasal 29 | `engines/rules/bpjs.json` | [BPJS Ketenagakerjaan FAQ](https://faq-int.bpjsketenagakerjaan.go.id/) |
| `BPJS-JP-2025` | BPJS SE B/726/022025 | Surat Edaran B/726 | `engines/rules/bpjs.json` | [PT GASI BPJS SE B/726 PDF](https://www.ptgasi.co.id/wp-content/uploads/2025/05/B-726-022025-PERUBAHAN-BATASAN-UPAH-DAN-MANFAAT-JP-2025.pdf) |
| `BPJS-JP-2026` | BPJS SE B/3307/022026 | Surat Edaran B/3307 | `engines/rules/bpjs.json` | [BPJS Ketenagakerjaan FAQ](https://faq-int.bpjsketenagakerjaan.go.id/) |
| `PHK-UP-01` | PP No. 35/2021 | Pasal 40 ayat (2) | `engines/phk-calculator.js` | [Kemnaker JDIH - PP 35/2021 Detail](https://jdih.kemnaker.go.id/peraturan/detail/1723/peraturan-pemerintah-nomor-35-tahun-2021) |
| `PHK-UPMK-01` | PP No. 35/2021 | Pasal 40 ayat (3) | `engines/phk-calculator.js` | [Kemnaker JDIH - PP 35/2021 Detail](https://jdih.kemnaker.go.id/peraturan/detail/1723/peraturan-pemerintah-nomor-35-tahun-2021) |
| `THR-PERMEN-01` | Permenaker No. 6/2016 | Pasal 2 & Pasal 3 | `engines/thr-calculator.js` | [Kemnaker JDIH - Permenaker 6/2016](https://jdih.kemnaker.go.id/) |
| `PDP-BASES-01` | UU No. 27/2022 | Pasal 20 | `legal-id/skills/pdp-compliance` | [Kominfo JDIH - UU PDP Detail](https://jdih.kominfo.go.id/produk_hukum/view/id/801/t/undang+undang+nomor+27+tahun+2022) |
| `KUHPER-1320-01` | KUHPerdata | Pasal 1320 | `legal-id/skills/spk-generator` | [Mahkamah Agung JDIH](https://jdih.mahkamahagung.go.id/) |
| `KUHPER-1266-01` | KUHPerdata | Pasal 1266 | `legal-id/skills/contract-reviewer` | [Mahkamah Agung JDIH](https://jdih.mahkamahagung.go.id/) |
