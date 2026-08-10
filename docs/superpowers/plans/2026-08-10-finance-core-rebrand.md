# Finance Core + Rebrand (v2.0.0) — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Tambah plugin finance-id (12 skill) + 8 engine deterministik finance + golden corpus + tests + benchmark, rename repo ke `indonesian-business-agent-skills`, rebrand README/PROVENANCE/CHANGELOG/ROADMAP, release v2.0.0.

**Architecture:** Engine finance = fungsi murni Node (tanpa ruleset; formula matematika baku); plugin finance-id mengikuti pola plugin eksisting; signature konsisten `camelCase`. Golden values dihitung tangan; test toleransi: float ±0.01, Rupiah ±1 (atau per case).

**Tech Stack:** Node.js (tanpa dependensi), node:test? — tidak; memakai assert + runner manual sesuai repo (`npm test` + chain).

## Global Constraints

- No dependensi npm baru; semua engine polos CommonJS `module.exports`.
- Pembulatan Rupiah: `Math.round` ke integer; rasio: 4 desimal (atau persen string di boundary milik skill).
- Nama fungsi & field mengikuti tabel di bawah — konsisten antar task.
- Semua file baru menggunakan LF, UTF-8 tanpa BOM, tanpa komentar berlebihan (no AI slop).
- `npm test` HARUS hijau di akhir setiap task (chain 8 file).
- No-fiction: angka benchmark hanya dari run aktual.
- Frontmatter skill: `name`, `description`, `argument-hint`, `risk_level`, `rule_type` (schema validator mensyaratkan name+description).

## Tabel Signature Engine (dipakai semua task)

| File | Signature |
|---|---|
| `engines/break-even.js` | `breakEvenUnits(fixedCosts, pricePerUnit, variableCostPerUnit)`, `breakEvenRevenue(fixedCosts, pricePerUnit, variableCostPerUnit)`, `contributionMargin(pricePerUnit, variableCostPerUnit)`, `contributionMarginRatio(pricePerUnit, variableCostPerUnit)`, `marginOfSafety(actualRevenue, breakEvenRevenue)` |
| `engines/depreciation.js` | `straightLine(cost, salvage, lifeYears)`, `doubleDeclining(cost, salvage, lifeYears)`, `sumOfYearsDigits(cost, salvage, lifeYears)` → `{ annual: number[], totalDepreciation, netBookValue }` |
| `engines/npv.js` | `npv(rate, cashflows)` (cashflows[0] di t=0), `npvWithTerminalValue(rate, cashflows, terminalValue, terminalYearIndex)` |
| `engines/irr.js` | `irr(cashflows, {maxIterations=200, tolerance=1e-6} = {})`, `irrFromNpv(npvFn, cashflows, opts)` — bisection di [-0.99, 10]; throws bila tidak ada akar |
| `engines/loan-amortization.js` | `monthlyPayment(principal, annualRate, months)`, `amortizationSchedule(principal, annualRate, months)` → `{ payment, schedule: [{month, payment, interest, principal, balance}] , totalInterest}` |
| `engines/financial-ratios.js` | `currentRatio(currentAssets, currentLiabilities)`, `quickRatio(currentAssets, inventory, currentLiabilities)`, `cashRatio(cash, currentLiabilities)`, `debtToEquity(totalLiabilities, totalEquity)`, `grossMargin(revenue, cogs)`, `netMargin(netIncome, revenue)`, `roa(netIncome, totalAssets)`, `roe(netIncome, totalEquity)`, `inventoryTurnover(cogs, avgInventory)`, `receivablesTurnover(revenue, avgReceivables)`, `daysSalesOutstanding(revenue, avgReceivables)`, `daysPayablesOutstanding(cogs, avgPayables)`, `daysInventoryOutstanding(cogs, avgInventory)`, `cashConversionCycle(dio, dso, dpo)` |
| `engines/working-capital.js` | `netWorkingCapital(currentAssets, currentLiabilities)`, `workingCapitalRatio(currentAssets, currentLiabilities)`, `cashConversionCycle(daysInventory, daysSalesOutstanding, daysPayables)`, `workingCapitalRequirement(cashCycleDays, costOfGoodsSoldPerDay)` |
| `engines/eoq.js` | `eoq(annualDemand, orderCost, holdingCostPerUnit)`, `reorderPoint(annualDemand, leadTimeDays, safetyStock=0)`, `annualHoldingCost(orderQuantity, holdingCostPerUnit)`, `annualOrderCost(annualDemand, orderQuantity, orderCost)` |

---

### Task 1: `engines/break-even.js` + golden case + unit test

**Files:**
- Create: `engines/break-even.js`, `tests/units/finance-engines.test.js` (module `break-even`)
- Modify: `tests/golden/finance.json` (add `BREAKEVEN-*` cases)

**Consumes:** — | **Produces:** fungsi sesuai tabel di atas.

- [ ] **Step 1: Tulis golden case** di `tests/golden/finance.json`:
```json
  { "caseId": "BE-001", "engine": "break-even", "description": "Break-even unit & revenue, price 25.000, vc 15.000, fixed 20.000.000",
    "input": { "fixedCosts": 20000000, "pricePerUnit": 25000, "variableCostPerUnit": 15000, "actualRevenue": 60000000 },
    "expected": { "contributionMargin": 10000, "contributionMarginRatio": 0.4, "breakEvenUnits": 2000, "breakEvenRevenue": 50000000, "marginOfSafety": 10000000 } }
```
- [ ] **Step 2: Tulis unit test** (module `break-even`) — hitung eksak + determinisme 3x + edge (price=vc → throw/∞ dihindari):
```js
const { breakEvenUnits, breakEvenRevenue, contributionMargin, contributionMarginRatio, marginOfSafety } = require('../../engines/break-even');
// BE-001: assert deepEqual terhadap expected di atas (tolerance ±0.01 float, ±1 money)
// edge: pricePerUnit === variableCostPerUnit → throw new Error('Contribution margin cannot be zero')
```
- [ ] **Step 3: Implementasi minimal** — formula baku, guard `price > vc`, Rupiah di-rounded, ratio dibulatkan 4 desimal.
- [ ] **Step 4: Run `node tests/units/finance-engines.test.js`** → PASS + `node tests/schema/validator.test.js` tetap hijau.
- [ ] **Step 5: Commit** `feat(finance): break-even engine + golden corpus`

### Task 2: `engines/depreciation.js` + golden + unit test

**Files:** Create `engines/depreciation.js`; Modify `tests/golden/finance.json`, `tests/units/finance-engines.test.js` (module `depreciation`)

- [ ] **Step 1: Golden cases:**
```json
  { "caseId": "DEP-SL-001", "engine": "depreciation", "method": "straightLine", "input": { "cost": 120000000, "salvage": 0, "lifeYears": 5 },
    "expected": { "annual": [24000000, 24000000, 24000000, 24000000, 24000000], "totalDepreciation": 120000000, "netBookValue": 0 } },
  { "caseId": "DEP-DDB-001", "engine": "depreciation", "method": "doubleDeclining", "input": { "cost": 120000000, "salvage": 0, "lifeYears": 5 },
    "expected": { "annual": [48000000, 28800000, 17280000, 10368000, 6220800], "totalDepreciation": 110668800, "netBookValue": 9331200 } },
  { "caseId": "DEP-SYD-001", "engine": "depreciation", "method": "sumOfYearsDigits", "input": { "cost": 120000000, "salvage": 0, "lifeYears": 5 },
    "expected": { "annual": [40000000, 32000000, 24000000, 16000000, 8000000], "totalDepreciation": 120000000, "netBookValue": 0 } }
```
- [ ] **Step 2: Unit test** — SL penuh; DDB: `dep = min(rate*bookValue, bookValue - salvage)` per tahun, stop bila `bookValue <= salvage || year > life`; SYD: `(cost-salvage)*(lifeYear - i)/(n(n+1)/2)`; determinisme; validasi `cost >= salvage >= 0`, `lifeYears >= 1` else throw.
- [ ] **Step 3: Implement** — ketiga method + `netBookValue = cost - totalDepreciation`.
- [ ] **Step 4: Run test module** → PASS. **Step 5: Commit** `feat(finance): depreciation engine`

### Task 3: `engines/npv.js` + golden + unit test

**Files:** Create `engines/npv.js`; modify golden + finance-engines.test.js (module `npv`)

- [ ] **Step 1: Golden:**
```json
  { "caseId": "NPV-001", "engine": "npv", "input": { "rate": 0.10, "cashflows": [-100000, 30000, 40000, 50000] },
    "expected": { "npv": -2103.68 } }, // tolerance ±0.02
  { "caseId": "NPV-TV-001", "engine": "npvWithTerminalValue", "input": { "rate": 0.10, "cashflows": [-100000, 30000, 40000], "terminalValue": 50000, "terminalYearIndex": 2 },
    "expected": { "npv": -2103.68 } } // 50.000 di t=2 -> sama dengan NPV-001
```
  Catatan: NPV-001 dihitung: 30000/1.1=27272.7273, 40000/1.21=33057.8512, 50000/1.331=37565.7400 → total PV 97896.3186 − 100000 = **−2103.6814**.
- [ ] **Step 2: Unit test** — formula Σ cf[t]/(1+r)^t; rate=0 OK (jumlah langsung); array kosong → 0; throw bila rate < -1.
- [ ] **Step 3: Implement.** **Step 4: Run PASS.** **Step 5: Commit** `feat(finance): npv engine`

### Task 4: `engines/irr.js` + golden + unit test

**Files:** Create `engines/irr.js`; modify golden + finance-engines.test.js (module `irr`); reuse `npv.js`

**Consumes:** `npv(rate, cashflows)` dari Task 3.

- [ ] **Step 1: Golden (self-consistency):**
```json
  { "caseId": "IRR-001", "engine": "irr", "input": { "cashflows": [-100000, 30000, 40000, 50000] },
    "expected": { "irrMin": 0.088, "irrMax": 0.090 } }
```
  Validasi: `npv(irr, cashflows)` harus ≈ 0 (±0.02); akar NPV di [-0.99, 10] untuk kasus ini ≈ 0.0885–0.0895.
- [ ] **Step 2: Unit test** — bisection: `a=-0.99, b=10`; iterasi; jika `npv(a)*npv(b) > 0` → throw `No IRR found in range`; hasil dalam [irrMin, irrMax]; self-consistency `|npv(r)| < 0.02`; determinisme.
- [ ] **Step 3: Implement** — gunakan `npv.js`; midpoint hingga `|b-a| < tolerance`.
- [ ] **Step 4: Run PASS.** **Step 5: Commit** `feat(finance): irr engine`

### Task 5: `engines/loan-amortization.js` + golden + unit test

**Files:** Create `engines/loan-amortization.js`; modify golden + tests (module `loan`)

- [ ] **Step 1: Golden:**
```json
  { "caseId": "LOAN-001", "engine": "loan-amortization", "input": { "principal": 100000000, "annualRate": 0.12, "months": 24 },
    "expected": { "monthlyPayment": 4707346, "totalInterest": 12976306, "finalBalance": 0 } } // pmt ±1; totalInterest = pmt*24 - 100.000.000 ±24
```
  Perhitungan: r=0.01; (1.01)^24=1.26973465; pmt=1.000.000/(1−1/1.26973465)=4.707.346,09.
- [ ] **Step 2: Unit test** — jadwal: `balance_months = balance_prev*(1+r) - payment`; bulan terakhir: payment disesuaikan agar balance → 0 (±1); determinisme; throw bila months ≤ 0 atau annualRate < 0.
- [ ] **Step 3: Implement.** **Step 4: Run PASS.** **Step 5: Commit** `feat(finance): loan amortization engine`

### Task 6: `engines/financial-ratios.js` + golden + unit test

**Files:** Create `engines/financial-ratios.js`; modify golden + tests (module `ratios`)

- [ ] **Step 1: Golden (satu set input konsisten):**
```json
  { "caseId": "RAT-001", "engine": "financial-ratios", "input": { "currentAssets": 500000000, "currentLiabilities": 250000000, "inventory": 150000000, "cash": 80000000, "totalLiabilities": 600000000, "totalEquity": 400000000, "revenue": 1200000000, "cogs": 800000000, "netIncome": 120000000, "totalAssets": 1000000000, "avgInventory": 200000000, "avgReceivables": 150000000, "avgPayables": 100000000 },
    "expected": { "currentRatio": 2.0, "quickRatio": 1.4, "cashRatio": 0.32, "debtToEquity": 1.5, "grossMargin": 0.3333, "netMargin": 0.1, "roa": 0.12, "roe": 0.3, "inventoryTurnover": 4.0, "receivablesTurnover": 8.0, "daysSalesOutstanding": 45.625, "daysPayablesOutstanding": 45.625, "daysInventoryOutstanding": 91.25, "cashConversionCycle": 91.25 } }
```
- [ ] **Step 2: Unit test** — persen vs desimal: rasio = desimal 4 angka (grossMargin 0.3333); days: 365/x (x>0); pembagi nol → throw `Denominator cannot be zero`.
- [ ] **Step 3: Implement.** **Step 4: Run PASS.** **Step 5: Commit** `feat(finance): financial ratios engine`

### Task 7: `engines/working-capital.js` + golden + unit test

**Files:** Create `engines/working-capital.js`; modify golden + tests (module `workingCapital`)

- [ ] **Step 1: Golden:**
```json
  { "caseId": "WC-001", "engine": "working-capital", "input": { "currentAssets": 500000000, "currentLiabilities": 250000000, "daysInventory": 60, "daysSalesOutstanding": 45, "daysPayables": 30, "cashCycleDays": 75, "cogsPerDay": 2000000 },
    "expected": { "netWorkingCapital": 250000000, "workingCapitalRatio": 2.0, "cashConversionCycle": 75, "workingCapitalRequirement": 150000000 } }
```
- [ ] **Step 2: Unit test** — CCC = dio+dso−dpo; WCR = cycleDays × cogsPerDay; throw bila currentLiabilities ≤ 0.
- [ ] **Step 3: Implement.** **Step 4: Run PASS.** **Step 5: Commit** `feat(finance): working capital engine`

### Task 8: `engines/eoq.js` + golden + unit test

**Files:** Create `engines/eoq.js`; modify golden + tests (module `eoq`)

- [ ] **Step 1: Golden:**
```json
  { "caseId": "EOQ-001", "engine": "eoq", "input": { "annualDemand": 12000, "orderCost": 100000, "holdingCostPerUnit": 6000, "leadTimeDays": 7, "safetyStock": 0 },
    "expected": { "eoq": 633, "reorderPoint": 230, "annualHoldingCost": 1899000, "annualOrderCost": 1897322 } }
```
  Perhitungan: EOQ=√(2·12000·100000/6000)=√400000=632,46→633 (round). Reorder = 12000/365·7=230,14→230. Holding=(633/2)·6000=1.899.000. Order cost=(12000/633)·100000=1.895.734,6 → 1.895.735? (12000/633=18,95734; ×100000=1.895.734) — **verifikasi saat eksekusi dengan node; sesuaikan expected ±1**.
- [ ] **Step 2: Unit test** — guard D>0, H>0, S>0; round EOQ; determinisme.
- [ ] **Step 3: Implement.** **Step 4: Run PASS.** **Step 5: Commit** `feat(finance): eoq engine`

### Task 9: Benchmark harness — domain `finance`

**Files:** Modify `scripts/benchmark.js` (tambahkan domain finance)

- [ ] **Step 1:** Tambah runner `runFinance(c)`: switch `c.engine` → panggil engine terkait (field `method` untuk depreciation), map expected key → hasil; daftar domain bertambah `{ name: 'finance', label: 'Finance (8 deterministic engines)', golden: 'finance', run: runFinance }`.
- [ ] **Step 2:** Tambah parser golden `loadGolden('finance')` (sudah generik) — daftar `DOMAINS` juga memuat finance.
- [ ] **Step 3:** Jalankan `node scripts/benchmark.js --json-report /tmp/bench-v2.json` → 100% akurasi semua domain; catat rows ke `docs/BENCHMARK.md` (tabel baru hasil run v2.0.0, Node version).
- [ ] **Step 4:** Commit `feat(finance): extend benchmark harness to finance engines`

### Task 10: Plugin `finance-id` — 12 skill

**Files:** Create `finance-id/.claude-plugin/plugin.json` (pola plugin lain: name `finance-id`, description panjang, author `adamriofc`, version `1.0.0`) dan 12 `finance-id/skills/<name>/SKILL.md`.

**Konten frontmatter & esensi tiap skill (aktual):**
- accounting-basics: risk LOW, rule_type internal-policy. Isi: aturan debit=kiri/kredit=kanan; jurnal berpasangan; accrual vs cash; contoh jurnal pembelian kredit; Scope & Safety (bukan pengganti akuntan; SAK EMKM untuk UMKM); Worked Example pembelian perlengkapan Rp 5 jt kredit.
- financial-statements: risk MEDIUM, rule_type professional-standard. Isi: 3 statement (Laba Rugi/Neraca/Arus Kas) + pos & linkage; PSAK 1 poin disclosure utama; accrual; contoh struktur LK sederhana + skema ekuitas; hubungan ke `laporan-keuangan-psak` (bedanya: ini analisis/penyajian umum, itu SAK EMKM untuk kredit bank).
- cash-flow-analysis: risk MEDIUM. Isi: metode langsung vs tidak langsung; FCF = OCF − Capex; cash runway = kas / burn bulanan; contoh: OCF 150 jt, Capex 40 jt → FCF 110 jt; runway 300 jt kas / 25 jt burn = 12 bulan.
- budgeting-forecasting: risk MEDIUM. Isi: top-down vs bottom-up; variance = actual − budget; rolling forecast; contoh variance 5% threshold; fleksibilitas budget saat volume naik.
- financial-ratio-analysis: risk MEDIUM. Isi: panggil `engines/financial-ratios.js`; 4 kelompok rasio (likuiditas, solvabilitas, profitabilitas, efisiensi); benchmark umum (current ≥1.5, D/E <2 untuk SME konservatif — beri catatan industri-beda); contoh pakai input RAT-001.
- working-capital: risk MEDIUM. Isi: engine `working-capital.js`; CCC; ketentuan perputaran kas untuk UMKM; contoh WC-001.
- cost-accounting: risk MEDIUM. Isi: COGS (awal persediaan + pembelian − akhir); absorption vs variable costing; product costing sederhana; contoh COGS UMKM.
- break-even-analysis: risk LOW. Isi: engine `break-even.js`; margin kontribusi; multi-product weighted average; contoh BE-001; batasan (asumsi harga konstan).
- unit-economics: risk LOW. Isi: LTV (avg revenue per customer × retention horizon), CAC, contribution margin per unit; rasio LTV:CAC ≥3 heuristik (dengan catatan "heuristik industri, bukan aturan baku"); contoh SaaS lokal.
- business-feasibility: risk MEDIUM. Isi: kerangka 5 aspek (pasar, teknis, finansial, legal, risiko); data yang dibutuhkan; contoh feasibility mini UMKM kedai kopi (investasi 250 jt, payback ~3,5 th — angka contoh konsisten dengan engine).
- financial-modeling: risk MEDIUM. Isi: 3-statement linkage (penjualan → Laba Rugi → Neraca → Arus Kas); sensitivity table (template 3 skenario: pesimis/base/optimis); konsistensi akuntansi; contoh skenario 10% penurunan penjualan.
- capital-budgeting: risk MEDIUM. Isi: NPV>0 terima, IRR>WACC, payback; WACC sederhana (ke = biaya ekuitas, kd = bunga × (1−tax)); ligasi engine npv/irr; contoh beli mesin 2 M (flows 5 th), IRR vs WACC 12%.

Setiap skill: body minimal section Purpose/Hybrid Execution (bila ada engine), Scope & Safety (≥4 bullet, termasuk legal/honesty), Worked Example (input → output konkret), ≥1.200 byte.

- [ ] **Step 1:** Buat `finance-id/.claude-plugin/plugin.json`.
- [ ] **Step 2-13:** Tulis 12 SKILL.md (konten aktual sesuai tabel di atas, pilih format MARKDOWN baku sama dengan skill lain).
- [ ] **Step 14:** `node tests/schema/validator.test.js` → "Discovered 6 plugin(s) & 54 skills" hijau.
- [ ] **Step 15:** Commit `feat(finance): finance-id plugin with 12 business finance skills`

### Task 11: PROVENANCE.md — Finance & Accounting Standard Register

**Files:** Modify `PROVENANCE.md`

- [ ] **Step 1:** Tambah Access Path `STANDARD_REFERENCE` ke legend (bagian 1.1).
- [ ] **Step 2:** Section baru `## 6. Finance & Accounting Standard Register (Non-Statutory)` — tabel per rule `FIN-BASIS-01` (PSAK 1 penyajian LK), `FIN-DEP-01` (PSAK 16 depresiasi), `FIN-REV-01` (PSAK 23 pendapatan), `FIN-SAK-EMKM-01` (SAK EMKM) — kolom Rule ID / Standard / Issuer | Access Path | Status | Verified At | Verification Link (IAI: https://web.iaiglobal.or.id/SAK-IAI — verifikasi HTTP saat eksekusi; bila non-200, tandai `OFFICIAL_PAGE` + catatan "verified manually").
- [ ] **Step 3:** Non-Claims tambah: "Standar akuntansi bukan hukum positif; formula finance adalah matematika baku; amendemen PSAK ditrack lewat note pipeline, bukan ruleset runtime".
- [ ] **Step 4:** Commit `docs: finance & accounting standard register`

### Task 12: README rebrand + package.json + CHANGELOG + ROADMAP + BENCHMARK

**Files:** Modify `README.md`, `package.json`, `CHANGELOG.md`, `ROADMAP.md`, `docs/BENCHMARK.md`

- [ ] **Step 1:** `package.json` name → `indonesian-business-agent-skills`, version `2.0.0`.
- [ ] **Step 2:** README: judul + tagline *"Give AI agents a business brain for Indonesia."*; subheadline "Legal, tax, finance, HR, e-commerce, and content — grounded in Indonesian rules, workflows, and deterministic engines."; arsitektur CORE (Legal/Tax/Finance/HR) / BUSINESS (Commerce) / CREATIVE (Content) diagram; angka "6 business domains · 54 agent skills · 16 deterministic engines"; ganti semua URL repo lama → `indonesian-business-agent-skills`; perbaiki path absolut `/tmp/opencode/indonesian-agent-skills` di section Cursor → `$PWD`; tambah blok Finance di plugin inventory.
- [ ] **Step 3:** CHANGELOG v2.0.0 (baru, di atas) — finance core, 12 skills, 8 engines, rename, rebrand, benchmark finance.
- [ ] **Step 4:** ROADMAP — "Shipped (v2.0.0)": Finance Core ✓, rename ✓; In Progress: Finance×Tax×HR integration, Operations (Phase 3), LLM baseline; Planned: SDK, Ecosystem.
- [ ] **Step 5:** BENCHMARK.md — tambah tabel finance (angka dari Task 9 run aktual), perbarui header tanggal/Node.
- [ ] **Step 6:** Commit `docs: v2.0.0 rebrand + finance documentation`

### Task 13: Rename GitHub repo + remote

**Files:** none repo-side; operasi gh/git

- [ ] **Step 1:** `gh repo rename indonesian-business-agent-skills --repo adamriofc/indonesian-agent-skills --yes` (redirect otomatis).
- [ ] **Step 2:** `git remote set-url origin https://github.com/adamriofc/indonesian-business-agent-skills.git`; `git remote -v` ulang verifikasi.
- [ ] **Step 3:** `curl -I https://github.com/adamriofc/indonesian-business-agent-skills` → 200; `curl -sI https://github.com/adamriofc/indonesian-agent-skills` → 301 (redirect).

### Task 14: Full verify + commit + push

- [ ] **Step 1:** `npm test` full → semua hijau (6 plugin 54 skill, 425+225 matrix lama, 8 finance modules, security).
- [ ] **Step 2:** `./scripts/sha256sums.sh verify` → OK.
- [ ] **Step 3:** `node scripts/benchmark.js --json-report /tmp/bench-v2.json` → semua domain 100%.
- [ ] **Step 4:** `git add -A && git commit` (pesan v2.0.0) `&& git push origin master`.

### Task 15: Release v2.0.0 + verifikasi CI

- [ ] **Step 1:** `gh release create v2.0.0` (title "Indonesian Business Agent Skills — Finance Core & Repositioning") + upload SHA256SUMS.
- [ ] **Step 2:** Verifikasi asset download cocok dengan manifest; `gh run list` setelah push → success.
- [ ] **Step 3:** Checklist audit internal (dimensi ≥9/10): engineering (tests hijau), breadth (6 domain), depth (semua skill ≥1.2KB pola sama), regulatory trust (register jujur), documentation (README/BENCHMARK ter-update), commercialization (positioning), viral (branding + demo nyata).

## Self-Review Notes (dijalankan setelah plan ditulis)

- Spec coverage: semua section spec (komponen, provenance, rebrand, release, non-goals) tercakup di task 1–15.
- Placeholder scan: nilai golden BE/DEP/NPV/LOAN/RAT/WC sudah aktual; EOQ dan IRR ditandai "verify saat eksekusi" dengan aturan penyesuaian eksplisit (±1; range) — bukan placeholder.
- Type consistency: signature di tabel Global Constraints dipakai semua task; `annual` array vs objek konsisten; IRR self-consistency pakai fungsi npv dari Task 3.