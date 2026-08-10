# Design — Finance Core + Rebrand sebagai Indonesian Business Agent Skills (v2.0.0)

- **Tanggal**: 2026-08-10
- **Status**: Disetujui oleh pemilik repo (keputusan: full v2.0.0 sekaligus)
- **Repo**: `indonesian-agent-skills` → (rename) `indonesian-business-agent-skills`
- **Referensi**: Audit 9,38/10 + rekomendasi strategis (Finance Core, rename, branding)

## 1. Ringkasan Keputusan

| Keputusan | Pilihan |
|---|---|
| Release | **v2.0.0** (finance + rename + rebrand sekaligus) |
| Struktur plugin fisik | **Tidak ada rename plugin** — hierarki CORE/BUSINESS/CREATIVE didokumentasikan di README |
| Skala Finance v1 | **12 skills + 8 engines** + golden corpus, unit tests, benchmark |

## 2. Komponen Baru

### 2.1 Plugin `finance-id/` (12 skill)

Semua skill mengikuti pola eksisting: frontmatter `name/description/argument-hint/risk_level/rule_type` + body dengan section Scope & Safety dan Worked Example (≥1,2KB):

1. `accounting-basics` — jurnal, debit/kredit, accrual vs cash (LOW, internal-policy)
2. `financial-statements` — struktur LK, PSAK 1 disclosure, accrual vs cash (MEDIUM, professional-standard)
3. `cash-flow-analysis` — metode langsung/tidak langsung, FCF, cash runway (MEDIUM)
4. `budgeting-forecasting` — top-down/bottom-up, variance analysis (MEDIUM)
5. `financial-ratio-analysis` — ligasi ke engine `financial-ratios.js` (MEDIUM)
6. `working-capital` — ligasi ke engine `working-capital.js`, CCC (MEDIUM)
7. `cost-accounting` — COGS, product costing, absorption vs variable (MEDIUM)
8. `break-even-analysis` — ligasi ke engine `break-even.js` (LOW)
9. `unit-economics` — CAC/LTV, contribution margin per unit (LOW)
10. `business-feasibility` — feasibility framework UMKM (MEDIUM)
11. `financial-modeling` — 3-statement linkage + sensitivity table (deterministik) (MEDIUM)
12. `capital-budgeting` — NPV/IRR/payback/WACC decision framework → engine (MEDIUM)

### 2.2 8 engine deterministik `engines/*.js`

| File | Ekspor inti |
|---|---|
| `break-even.js` | breakEvenUnits, breakEvenRevenue, contributionMargin, marginOfSafety |
| `depreciation.js` | straightLine, doubleDeclining, sumOfYearsDigits (nilai residu ≥ 0) |
| `npv.js` | npv(cashflows, rate), dengan opsi terminalValue |
| `irr.js` | irr(cashflows) via bisection (toleransi 1e-6), bergantung `npv.js` |
| `loan-amortization.js` | monthlyPayment (annuitas), amortizationSchedule, totalInterest |
| `financial-ratios.js` | current/quick/cash ratio, D/E, gross/net margin, ROA/ROE, inventory/receivable turnover, DSO/DPO/CCC |
| `working-capital.js` | netWorkingCapital, workingCapitalRequirement, cashConversionCycle |
| `eoq.js` | eoq, reorderPoint, annualHoldingCost, annualOrderCost |

Karakter: formula matematika murni (bukan regulasi) → **tidak masuk `engines/rules/`**, tidak mengubah manifest integrity. Pembulatan Rupiah terdekat; penanganan pembagian-nol; input negatif dinormalisasi.

### 2.3 Pengujian

- `tests/golden/finance.json` — corpus per engine, nilai dihitung tangan (formula baku).
- `tests/units/finance-engines.test.js` — matrix: batas (n=0, 1, besar), negatif, pembulatan, determinisme 3×.
- `scripts/benchmark.js` — domain `finance` ditambahkan (baca golden finance.json, runner per-engine via field `case.engine`).
- `npm test` otomatis mendeteksi plugin ke-6 (validator discovery) → "6 plugins & 54 skills".

## 3. Provenance Finance (jujur, non-statutory)

- Section baru di `PROVENANCE.md`: **Finance & Accounting Standard Register** — referensi PSAK 1 (penyajian LK), PSAK 16 (depresiasi), PSAK 23 (pendapatan), SAK EMKM; Access Path `STANDARD_REFERENCE`; sumber: IAI (`iaiglobal.or.id`) + referensi sekunder.
- Non-Claims ditambah: standar akuntansi ≠ undang-undang; formula finance adalah matematika baku; amendemen PSAK ditrack via catatan REGULATORY_PIPELINE (bukan ruleset).
- Skema `risk_level` finance: LOW/MEDIUM (tidak ada HIGH — tidak ada keputusan legal/statutory).

## 4. Rebranding & Rename

- **GitHub**: `gh repo rename indonesian-business-agent-skills` (redirect otomatis) + `git remote set-url`.
- **README**: judul "Indonesian Business Agent Skills", tagline *"Give AI agents a business brain for Indonesia."*, subheadline domain; arsitektur CORE (legal/tax/finance/hr) / BUSINESS (ecommerce) / CREATIVE (content) divisualkan; angka marketing: **6 business domains · 54 agent skills · 16 deterministic engines**; perbaikan path absolut `/tmp/opencode/...` di quickstart; badge CI URL baru.
- `package.json` name: `indonesian-business-agent-skills`.
- **CHANGELOG** v2.0.0; **ROADMAP** restrukturisasi fase: 1 Finance ✓, 2 Finance×Tax×HR integration, 3 Operations, 4 Benchmark eksternal, 5 SDK, 6 Ecosystem.
- `docs/BENCHMARK.md`: tambah baris hasil run nyata 8 engine finance.

## 5. Non-Goals (tidak dilakukan sekarang)

- Rename plugin fisik / folder kosong `operations-id` / `business-analysis-id`.
- npm publish, SDK, crypto/trading/investment, kejar 60+ skill.
- Ruleset regulasi finance (tidak ada dasar hukum untuk formula — dikelola sebagai standard register).

## 6. Urutan Eksekusi & Verifikasi

1. Tulis 8 engine → hitung golden values tangan → tests → `npm test` hijau.
2. Benchmark finance run → catat angka nyata ke `docs/BENCHMARK.md`.
3. 12 skill finance-id → validator schema → hijau.
4. PROVENANCE register + README rebrand + CHANGELOG/ROADMAP + package.json rename.
5. Rename GitHub repo + remote URL.
6. `npm test` penuh + `sha256sums.sh verify` + benchmark → hijau.
7. Commit + push + `gh release v2.0.0` + upload SHA256SUMS + verifikasi CI/asset.
8. Checklist audit internal: semua dimensi ≥9/10 (termasuk viral/positioning via konten terverifikasi, bukan klaim).

## 7. Kriteria Sukses

- `npm test` 100% hijau (6 plugin, 54 skill, 16 engine; 425+225 kasus lama tetap).
- Golden finance 100% akurasi + determinisme OK (hasil run aktual di BENCHMARK.md).
- Rename tervalidasi: release v2.0.0, asset SHA256SUMS cocok, CI success di commit baru.
- Semua referensi internal nama repo konsisten; redirect GitHub berfungsi.