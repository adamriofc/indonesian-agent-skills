# Indonesian Business Agent Skills

*Give AI agents a business brain for Indonesia.*

**Open-source Indonesian business intelligence for AI agents — combining regulatory-grounded skills, temporal rulesets, deterministic engines, and auditable provenance.**

<p align="center">
  <img src="docs/indonesian-business-agent-skills-hero.svg" alt="Indonesian Business Agent Skills Banner" width="100%">
</p>

<p align="center">
  <a href="LICENSE"><img src="https://img.shields.io/badge/License-MIT-blue.svg" alt="License: MIT"></a>
  <a href="https://github.com/adamriofc/indonesian-business-agent-skills/actions/workflows/ci.yml"><img src="https://github.com/adamriofc/indonesian-business-agent-skills/actions/workflows/ci.yml/badge.svg" alt="CI Pipeline"></a>
  <a href="https://app.openworklabs.com/"><img src="https://img.shields.io/badge/OpenCode-Compatible-brightgreen.svg" alt="OpenCode Compatibility"></a>
  <a href="engines/"><img src="https://img.shields.io/badge/Hybrid%20Engine-LLM--Safe-orange.svg" alt="LLM-Safe Hybrid Engine"></a>
  <a href="tests/"><img src="https://img.shields.io/badge/Test%20Suite-900%2B%20Assertions-success.svg" alt="900+ Test Assertions"></a>
</p>

---

## 📌 Overview & Value Proposition (Apa Ini & Untuk Siapa?)

**Indonesian Business Agent Skills** adalah infrastruktur *domain intelligence* sumber terbuka (*open-source*) yang memberikan "otak bisnis dan regulasi Indonesia" kepada agen AI. Dirancang untuk **OpenWork Desktop**, **OpenCode CLI**, **Claude Code (CLI)**, **Cursor IDE**, **Codex**, dan *framework* agen kustom, repositori ini mengintegrasikan **67 Agent Skills** dengan **23 Mesin Kalkulasi Deterministik & Regulatory Diff Engine** (`engines/`) serta *ruleset* JSON berbasis waktu (*temporal SSOT* di `engines/rules/`).

### 💡 Mengapa AI Biasa (Tanpa Engine) Sering Salah Hitung?
Model AI generik (seperti ChatGPT atau Claude tanpa *tooling*) memprediksi kata berdasarkan probabilitas (*token prediction*). Ketika diminta menghitung pajak PPh 21 TER, kompensasi PHK, atau bunga pinjaman, AI biasa mengalami 3 kegagalan utama:
1. **Halusinasi Aritmatika**: AI menebak angka alih-alih menghitung rumus secara presisi.
2. **Ambigu Temporal**: AI tidak tahu perubahan batas tarif/upah BPJS antara tahun 2024, 2025, dan 2026.
3. **Tanpa Dasar Hukum Terlacak**: Hasil AI biasa tidak melampirkan rujukan resmi lembaran negara (*gazette*) yang dapat diaudit.

### 🛡️ Solusi Hibrida Repositori Ini
Repositori ini memisahkan **penalaran (*reasoning*)** AI dari **perhitungan (*calculation*)**:
- **AI (Agent Skill)**: Memahami bahasa alami manusia, mengekstrak parameter, dan menyusun penjelasan.
- **Engine (Node.js)**: Menghitung matematika murni secara presisi (0% halusinasi) sesuai *ruleset* resmi pemerintah.

---

## ⚡ 30-Second Quickstart Demo

```bash
# 1. Clone repositori (5 detik)
git clone https://github.com/adamriofc/indonesian-business-agent-skills.git && cd indonesian-business-agent-skills

# 2. Install (10 detik, 0 dependensi eksternal)
npm ci

# 3. Jalankan kalkulasi PPh 21 TER presisi (2 detik)
node -e "
const { calculatePPh21Monthly } = require('./engines/pph21-calculator');
console.log(calculatePPh21Monthly(10000000, 'TK/0', true, '2026-03-01'));
"

# 4. Verifikasi integritas kriptografi SHA-256 (2 detik)
./scripts/sha256sums.sh verify

# 5. Jalankan full test suite: 900+ asersi (30 detik)
npm test
```

> 🌐 **Coba Tanpa Koding**: Buka `docs/playground.html` langsung di browser Anda untuk menguji kalkulator PPh 21, UMKM PP 20/2026, Break-Even, dan Amortisasi Pinjaman secara interaktif!

---

## 🏗️ System Architecture

```text
                                 [ User / Agent Query ]
                                           │
                                           ▼
                       ┌──────────────────────────────────────┐
                       │    Skill Instruction Layer (MD)      │
                       │ Extracts parameters & structured JSON│
                       └──────────────────┬───────────────────┘
                                          │
                                          ▼
              ┌──────────────────────────────────────────────────────┐
              │      17 Deterministic Node.js Math & Diff Engines    │
              │ 9 statutory (engines/*.js + SSOT temporal rulesets)  │
              │ 8 finance (engines/*.js — pure standard math)        │
              └──────────────────┬───────────────────┬───────────────┘
                                 │                   │
                                 ▼                   ▼
      ┌──────────────────────────────┐   ┌──────────────────────────────────────┐
      │ Single Source of Truth Rules │   │ Cryptographic SHA-256 Checksums     │
      │ (engines/rules/*.json)       │   │ (engines/rules/integrity.js +        │
      │ — statutory & policy only    │   │  SHA256SUMS.txt)                     │
      └──────────────┬───────────────┘   └──────────────────┬───────────────────┘
                     │                                      │
                     └──────────────────────────┬───────────┘
                                                │
                                                ▼
                         ┌──────────────────────────────────────┐
                         │  Validated Statutory Output + Math   │
                         └──────────────────┬───────────────────┘
                                            │
                                            ▼
                         ┌──────────────────────────────────────┐
                         │ LLM Narrative Synthesis & Formatting │
                         └──────────────────────────────────────┘
```

---

## 🛠️ Installation & Integration Guide (Panduan Instalasi)

### 1. Universal Agent Skills CLI (Paling Mudah / Direkomendasikan)
Install skill secara langsung ke berbagai agen (Claude Code, OpenCode, Codex, Cursor, Antigravity) menggunakan `npx`:
```bash
# Install seluruh skill ke agen Anda
npx skills add adamriofc/indonesian-business-agent-skills

# Selektif berdasarkan platform atau domain skill tertentu
npx skills add adamriofc/indonesian-business-agent-skills --agent claude-code
npx skills add adamriofc/indonesian-business-agent-skills --skill pph21-calculator
```

### 2. Claude Code Marketplace (Integrasi Plugin Resmi)
Daftarkan repositori sebagai *marketplace source* resmi dan install plugin per domain:
```bash
# Tambahkan repositori sebagai sumber marketplace plugin
claude plugin marketplace add adamriofc/indonesian-business-agent-skills

# Install plugin domain sesuai kebutuhan
claude plugin install legal-id@indonesian-business-agent-skills
claude plugin install tax-payroll-id@indonesian-business-agent-skills
claude plugin install finance-id@indonesian-business-agent-skills
```

### 3. Portabilitas Agent Skills Standard (.agents / .opencode / .cursor)
Untuk *discovery* skill secara native tanpa plugin, salin skill ke folder `.agents/skills/`:
```bash
# Direktori standar lintaskan agen
mkdir -p .agents/skills
cp -r legal-id/skills/* .agents/skills/
cp -r tax-payroll-id/skills/* .agents/skills/
cp -r finance-id/skills/* .agents/skills/

# Path native OpenCode & Cursor
mkdir -p .opencode/skills .cursor/skills
cp -r .agents/skills/* .opencode/skills/
cp -r .agents/skills/* .cursor/skills/
```

### 4. OpenWork Desktop & Cloud
1. Buka **Settings > Plugins**.
2. Klik **Add Plugin from Repository**.
3. Masukkan URL GitHub: `https://github.com/adamriofc/indonesian-business-agent-skills`.
4. Ke-6 plugin dan 60 skill akan aktif secara otomatis.

---

## 📦 Plugin Inventory & Skill Catalog (67 Skills Across 6 Plugins)

Mesin dan skill repositori dipetakan ke dalam **Registri Terstruktur (`registry/index.json`)** dengan *Quality Tiers* (`source-verified`, `tested`, `expert-reviewed`):

### 1. `legal-id`: Commercial Law & Compliance (8 Skills)
* `contract-reviewer`: Audits agreements and outputs a **Contract Risk Score (0-100)** with redlines.
* `spk-generator`: Drafts bilateral service contracts compliant with KUHPerdata Arts. 1320 & 1338.
* `nda-indonesia`: Non-disclosure agreements with DJKI & UU Trade Secret protections.
* `pdp-compliance`: Corporate personal data protection audit under UU No. 27/2022.
* `legal-memo-id`: Indonesian court-spec legal opinions and conflict analysis.
* `haki-trademark-check`: Trademark availability check under UU 20/2016 (Classes 1-45).
* `oss-kbli-navigator`: Maps activities to 5-digit KBLI 2020 and OSS-RBA risk levels.
* `somasi-draft-id`: Drafts formal advocate-standard legal warning letters (Somasi 1, 2, 3).

### 2. `tax-payroll-id`: Tax Engineering & Payroll (14 Skills)
* `pph21-calculator`: TER monthly calculation engine (PP 58/2023) & Dec Annual Reconciliation.
* `pph23-26-calculator`: Calculates PPh 23 (2% service) and PPh 26 (20% offshore / Tax Treaty DGT).
* `pph-final-umkm`: Calculates 0.5% UMKM final tax with Rp 500M OP threshold exemption (PP 55/2022 & PP 20/2026).
* `tax-planning`: Evaluates entity tax regime efficiency (PP 20/2026 vs General PPh, Gross vs Gross-Up, Dividend vs Salary).
* `tax-optimization`: Deductible expense optimization (Pasal 6 vs Pasal 9 UU PPh), PPh 21 Dec reconciliation, and PPh 23/26 invoice splits.
* `tax-risk-analysis`: Detects DJP equalisation discrepancies, transfer pricing indicators (PMK 172/2023), and SP2DK audit triggers.
* `tax-audit-preparation`: Assembles SP2DK audit response packages, tax equalisation reconciliation statements, and document indexes.
* `tax-cross-border`: Evaluates offshore withholding (PPh 26 20% vs Tax Treaty DGT form rate optimization) and Permanent Establishment (BUT) risk.
* `laporan-keuangan-psak`: Formats trial balances into SAK EMKM / SAK EP compliant financial statements.
* `efaktur-helper`: Validates e-Faktur & DJP Coretax tax invoices for statutory PPN 12% & 11/12 DPP Nilai Lain (effective 11% burden).
* `regulatory-diff`: Compares versioned SSOT ruleset transitions across effective date windows (e.g. PP 55/2022 ➔ PP 20/2026).
* `thr-calculator`: Payout engine for religious holiday allowances.
* `bpjs-calculator`: Calculations for health and social security contribution splits.
* `spt-tahunan-guide`: Filing workflow for individual tax returns via DJP Online.

### 3. `hr-id`: Labor & Employment Compliance (8 Skills)
* `surat-peringatan`: Drafts SP1, SP2, and SP3 warning letters following 6-month statutory windows.
* `sop-perusahaan`: Generates SOPs enforcing overtime limits (Perpu 2/2022 max 4h/day, 18h/week).
* `interview-id`: Candidate scorecards evaluating technical skills and local cultural fit.
* `bpjs-tenagakerja-admin`: SIPP BPJS portal administration workflow guide.
* `phk-calculator`: Statutory severance payout engine under PP 35/2021.
* `pkwt-pkwtt-checker`: Audits contract worker duration (max 5 yrs) and computes statutory PKWT compensation.
* `pkwtt-checker`: Audits permanent employment (PKWTT) contracts, probation rules (max 3 months), and automatic conversion triggers.
* `struktur-skala-upah`: Builds statutory Wage Structure and Scale frameworks per Permenaker 1/2017.

### 4. `ecommerce-id`: Marketplace Operations & SEO (10 Skills)
* `deskripsi-produk-seo`: Structural product copy optimized for Shopee & Tokopedia search.
* `cs-komplain-handler`: Customer service protocols for negative reviews and damaged packages.
* `analisis-kompetitor-marketplace`: Extracts feedback gaps from competitor listings.
* `shopee-live-script`: Retention and flash-sale hosting scripts for live streaming.
* `tokopedia-seo-optimizer`: Algorithmic title formula generator (`[Product] + [Brand] + [Spec] + [Keywords]`).
* `buyer-negotiator`: Grosir wholesale B2B trade terms negotiation guidelines.
* `margin-pricing-calculator`: Computes net seller payouts after Shopee/Tokopedia/TikTok Shop admin fees.
* `klaim-logistik-retur`: Courier insurance claim SOPs and damage report templates.
* `tiktok-shop-affiliate`: Affiliate campaign commission structures and creator outreach briefs.
* `shopee-video-creator`: Short promotional video scripts and yellow-basket product tagging.

### 5. `content-lokal-id`: Local Copywriting (9 Skills)
* `whatsapp-broadcast`: High-conversion anti-spam WhatsApp Business copy.
* `linkedin-x-thread-id`: B2B executive narrative storytelling formats.
* `script-reels-tiktok`: Short-video scripts with visual directions and audio overlays.
* `lokalisasi-slang-indonesia`: Adapts formal copy into natural Indonesian business casual or colloquial tone.
* `press-release-id`: Indonesian 5W+1H journalistic press release template.
* `instagram-reels-carousel`: Visual hooks for IG Reels and multi-slide Carousel post scripts.
* `youtube-shorts-script`: Retention scripts for 0-60s Shorts and long-form video outlines.
* `kol-brief-contract`: KOL/Influencer campaign briefs, SOWs, and content usage rights contracts.
* `gmb-local-seo`: Google Business Profile (GMB) map optimization and local search copy.

### 6. `finance-id`: Business Finance & Accounting (12 Skills)
* `accounting-basics`: Double-entry bookkeeping, journals, and accrual vs cash basis.
* `financial-statements`: 3-statement structure and PSAK 1 presentation principles.
* `cash-flow-analysis`: OCF/ICF/FCF analysis and cash runway.
* `budgeting-forecasting`: Top-down/bottom-up budgets, variance and rolling forecast.
* `financial-ratio-analysis`: 14 ratios via `engines/financial-ratios.js`.
* `working-capital`: NWC, CCC, and funding requirement via `engines/working-capital.js`.
* `cost-accounting`: COGS, absorption vs variable costing, product costing.
* `break-even-analysis`: BEP units/revenue and margin of safety via `engines/break-even.js`.
* `unit-economics`: LTV, CAC, contribution margin, LTV:CAC heuristic.
* `business-feasibility`: 5-aspect feasibility framework with consistent financial figures.
* `financial-modeling`: 3-statement linkage and deterministic sensitivity tables.
* `capital-budgeting`: NPV/IRR/payback via `engines/npv.js` & `engines/irr.js` vs simple WACC.

---

## 📊 Real-World Execution Examples

All outputs below are **actual engine outputs** (run on 2026-08-10, Node.js 20+, `npm test` green).

### 1. PPh 21 TER Monthly — Actual Engine Output

```javascript
const { calculatePPh21Monthly } = require('./engines/pph21-calculator');
const result = calculatePPh21Monthly(10000000, 'TK/0', true, '2026-03-01');
console.log(result);
```

```json
{
  "grossSalary": 10000000,
  "ptkpStatus": "TK/0",
  "terCategory": "A",
  "effectiveRate": 0.02,
  "effectiveRatePercent": "2.00%",
  "hasNpwp": true,
  "identityStatus": "validated_nik_npwp",
  "penaltyApplied": false,
  "monthlyTaxWithheld": 200000,
  "calculationDate": "2026-03-01",
  "rulesetId": "PPH21-2024",
  "rulesetVersion": "1.0.0",
  "statutoryReference": "PP No. 58/2023 & PMK No. 168/2023"
}
```

### 2. UMKM Tax PP 20/2026 Transition & Regulatory Diff — Actual Engine Output

```javascript
const { compareRulesets } = require('./engines/regulatory-diff');
const diff = compareRulesets('umkm', 'UMKM-2022', 'UMKM-2026');
console.log(diff);
```

```json
{
  "domain": "umkm",
  "comparison": "UMKM-2022 ➔ UMKM-2026",
  "effectiveTransitionDate": "2026-04-22",
  "oldRuleset": { "id": "UMKM-2022", "version": "1.0.0", "status": "ARCHIVED" },
  "newRuleset": { "id": "UMKM-2026", "version": "1.0.0", "status": "RELEASED" },
  "totalChanges": 2,
  "changes": [
    {
      "field": "eligible_taxpayers",
      "removedEntities": ["corporate", "pt", "cv", "firma"],
      "addedEntities": [],
      "isChanged": true
    }
  ]
}
```

---

## ❓ Frequently Asked Questions (FAQ)

### Q1: Saya pemilik bisnis / orang awam (non-programmer), bagaimana cara menggunakan repositori ini?
> **Jawab**: Anda tidak perlu menjadi programmer! Ada 2 cara paling mudah:
> 1. **Tanpa Koding**: Buka file `docs/playground.html` langsung di browser Anda untuk menggunakan kalkulator pajak PPh 21, UMKM, dan Keuangan secara interaktif.
> 2. **Via Agen AI**: Jika Anda menggunakan aplikasi AI seperti Claude Code, OpenWork, atau Cursor, cukup jalankan perintah `npx skills add adamriofc/indonesian-business-agent-skills`. Setelah itu, Anda bisa bertanya langsung dalam bahasa Indonesia sehari-hari kepada AI Anda (misal: *"Berapa pajak PPh 21 untuk gaji Rp 10 juta?"*).

### Q2: Mengapa saya tidak boleh mempercayai perhitungan pajak atau pesangon langsung dari ChatGPT / AI biasa?
> **Jawab**: AI biasa menghitung dengan menebak kata berdasarkan pola teks (*probabilistic token prediction*), bukan dengan mesin matematika. AI biasa sering mengalami:
> - **Salah Hitung**: Menghasilkan angka yang tampak meyakinkan padahal rumus matematikanya salah.
> - **Ketinggalan Aturan**: Tidak tahu bahwa tarif BPJS atau aturan PPh UMKM telah berubah di tahun 2025/2026.
> Repositori ini memaksa AI untuk menggunakan **Node.js Engine** (kalkulator matematika murni) yang terhubung ke aturan pemerintah (*ruleset JSON*), sehingga hasilnya **100% presisi dan 0% halusinasi**.

### Q3: Apakah aturan PPh Final UMKM di repo ini sudah mendukung PP No. 20 Tahun 2026 terbaru?
> **Jawab**: **Ya, 100% didukung!** Repositori ini memiliki dua *ruleset*:
> - `UMKM-2022` (PP 55/2022): Berlaku hingga 21 April 2026 (PT/CV dan Orang Pribadi berhak atas tarif 0,5%).
> - `UMKM-2026` (PP 20/2026): Berlaku mulai 22 April 2026. Dalam aturan terbaru ini:
>   - **Orang Pribadi (OP)**: Tetap berhak 0,5% dengan fasilitas omzet bebas pajak Rp 500 Juta/tahun.
>   - **PT Perorangan & Koperasi**: Berhak 0,5% tanpa fasilitas omzet bebas Rp 500M.
>   - **PT / CV / Firma Biasa**: **Tidak lagi berhak** atas tarif final 0,5% (wajib PPh Umum Badan).
>   - **Batas Omzet**: Batas maksimal omzet kumulatif adalah Rp 4,8 Miliar/tahun.

### Q4: Bagaimana repositori ini menangani aturan PPN 12% dan Coretax DJP?
> **Jawab**: Skill `efaktur-helper` telah diperbarui sesuai **UU HPP No. 7/2021**, **PMK No. 131/2024**, dan **PER-01/PJ/2025**:
> - Tarif statutory PPN adalah **12%**.
> - Untuk barang/jasa non-mewah (Kode Transaksi 04), digunakan mekanisme **DPP Nilai Lain (11/12 × DPP)** sehingga beban PPN efektif tetap **11%** ($\text{PPN} = 12\% \times \frac{11}{12} \times \text{DPP}$).
> - Mendukung integrasi skema Faktur Pajak Coretax DJP & e-Faktur Desktop.

### Q5: Apa bedanya 'Skill', 'Engine', dan 'Ruleset' di dalam repositori ini?
> **Jawab**:
> - **Skill (`SKILL.md`)**: Petunjuk dan panduan cara berpikir AI (otak/manual).
> - **Engine (`engines/*.js`)**: Kode program matematika murni yang melakukan perhitungan (kalkulator).
> - **Ruleset (`engines/rules/*.json`)**: Database angka dan tarif resmi pemerintah berdasarkan tanggal efektif (buku aturan resmi).

### Q6: Apakah data keuangan atau bisnis saya aman dan tidak terkirim ke server luar?
> **Jawab**: **Sangat Aman.** Seluruh mesin kalkulasi (`engines/`) berjalan **100% secara lokal** di komputer Anda tanpa dependensi npm pihak ketiga dan tanpa melakukan koneksi jaringan (*zero network calls*).

### Q7: Apakah hasil perhitungan dari repo ini bisa dijadikan bukti sah legal atau perpajakan?
> **Jawab**: Hasil repositori ini berfungsi sebagai *decision-support intelligence* (alat bantu analisis keputusan). Meskipun perhitungannya 100% presisi sesuai lembaran negara, keputusan hukum atau pelaporan pajak resmi berisiko tinggi (*high-risk*) tetap direkomendasikan untuk diverifikasi oleh Konsultan Pajak (BKP) atau Advokat terlisensi.

### Q8: Bagaimana cara mengintegrasikan repo ini dengan ERP, sistem HRIS, atau API perusahaan kami?
> **Jawab**: Repositori ini memiliki panduan arsitektur integrasi di `integrations/README.md`. Karena mesin kalkulasi bersifat modular (fungsi JavaScript murni), Anda dapat langsung memanggil fungsi engine (`calculatePPh21Monthly`, `calculateBpjs`, `calculatePhk`) dari aplikasi backend Node.js, REST API, atau sistem ERP Anda.

---

## 🧪 Comprehensive Test & Verification Suite

Our test harness executes over **900+ individual test assertions** across 9 automated test modules:

```bash
# Run full test pipeline
npm test
```

---

## 🛡️ Security & Disclaimers

See [`SECURITY.md`](SECURITY.md) for prompt injection defense guidelines, [`PROVENANCE.md`](PROVENANCE.md) for the granular statutory gazette register & Section 7 Expert Review Register, [`REGULATORY_PIPELINE.md`](REGULATORY_PIPELINE.md) for the official update procedure, and [`REGULATORY_CHANGELOG.md`](REGULATORY_CHANGELOG.md) for regulatory amendments.

**Release Trust Anchor**: `SHA256SUMS.txt` holds SHA-256 checksums for every ruleset; verified via `./scripts/sha256sums.sh verify` and in CI.

## 📄 License

MIT License. See [LICENSE](LICENSE) for details.
