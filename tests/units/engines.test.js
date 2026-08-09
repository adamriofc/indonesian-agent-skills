const assert = require('assert');
const { calculatePPh21Monthly, calculateArticle17AnnualTax, calculatePPh21DecemberReconciliation } = require('../../engines/pph21-calculator');
const { calculateBpjs, getRulesForDate } = require('../../engines/bpjs-calculator');
const { calculateThr } = require('../../engines/thr-calculator');
const { calculatePhk, REASON_MULTIPLIERS } = require('../../engines/phk-calculator');

function runUnitTests() {
  console.log("⚡ Running Deterministic Engine Math Unit Tests...\n");

  // ----------------------------------------------------
  // 1. Test PPh 21 TER Engine & December Reconciliation
  // ----------------------------------------------------
  console.log("  [1/4] Testing PPh 21 TER Monthly & December Reconciliation Engine...");
  
  // Boundary Testing: Gross monthly salary brackets (Kategori A)
  const pphBelowMin = calculatePPh21Monthly(5000000, 'TK/0', true); // Bracket rate 0%
  assert.strictEqual(pphBelowMin.monthlyTaxWithheld, 0);

  const pphBoundary1 = calculatePPh21Monthly(5400000, 'TK/0', true); // Bracket rate 0%
  assert.strictEqual(pphBoundary1.monthlyTaxWithheld, 0);

  const pphBoundary2 = calculatePPh21Monthly(5400001, 'TK/0', true); // Bracket rate 0.25%
  assert.strictEqual(pphBoundary2.effectiveRatePercent, '0.25%');
  assert.strictEqual(pphBoundary2.monthlyTaxWithheld, 13500);

  const pphBoundary3 = calculatePPh21Monthly(5650000, 'TK/0', true); // Bracket rate 0.25%
  assert.strictEqual(pphBoundary3.monthlyTaxWithheld, 14125);

  const pphBoundary4 = calculatePPh21Monthly(5650001, 'TK/0', true); // Bracket rate 0.5%
  assert.strictEqual(pphBoundary4.effectiveRatePercent, '0.50%');

  // Test Category B PTKP Statuses
  const pphCatB = calculatePPh21Monthly(10000000, 'K/1', true); // Category B, Rate 1.5%
  assert.strictEqual(pphCatB.terCategory, 'B');
  assert.strictEqual(pphCatB.effectiveRatePercent, '1.50%');
  assert.strictEqual(pphCatB.monthlyTaxWithheld, 150000);

  // Test Identity Status Parameter Enums (Anti-AI Slop)
  const pphNikValid = calculatePPh21Monthly(10000000, 'TK/0', 'validated_nik_npwp');
  assert.strictEqual(pphNikValid.hasNpwp, true);
  assert.strictEqual(pphNikValid.penaltyApplied, false);

  const pphUnvalidated = calculatePPh21Monthly(10000000, 'TK/0', 'unvalidated');
  assert.strictEqual(pphUnvalidated.hasNpwp, false);
  assert.strictEqual(pphUnvalidated.penaltyApplied, true);

  // Test Non-NPWP 20% Penalty
  const pphNoNpwp = calculatePPh21Monthly(10000000, 'TK/0', false); // 200,000 * 1.2 = 240,000
  assert.strictEqual(pphNoNpwp.penaltyApplied, true);
  assert.strictEqual(pphNoNpwp.monthlyTaxWithheld, 240000);

  // Test Article 17 Progressive Brackets
  // Taxable: 100M
  // 60M * 5% = 3M
  // 40M * 15% = 6M
  // Total = 9M
  const art17Tax = calculateArticle17AnnualTax(100000000);
  assert.strictEqual(art17Tax, 9000000);

  // Test December Annual Reconciliation (Masa Pajak Terakhir)
  // Annual Gross: 120M (10M / month)
  // Biaya Jabatan: 120M * 5% = 6M (Max limit cap)
  // JHT employee: 200k/month * 12 = 2.4M
  // Net Annual: 120M - 6M - 2.4M = 111.6M
  // PTKP (TK/0): 54M
  // PKP: 111.6M - 54M = 57.6M
  // Tax Art 17: 57.6M * 5% = 2.88M
  // Jan-Nov withheld: 2M (assuming 200k * 10)
  // Dec tax to withhold: 2.88M - 2M = 880K
  const decRecon = calculatePPh21DecemberReconciliation(120000000, 'TK/0', 2000000, 200000, true);
  assert.strictEqual(decRecon.biayaJabatan, 6000000);
  assert.strictEqual(decRecon.netAnnualIncome, 111600000);
  assert.strictEqual(decRecon.pkp, 57600000);
  assert.strictEqual(decRecon.totalAnnualTaxArt17, 2880000);
  assert.strictEqual(decRecon.decemberTaxWithheld, 880000);

  // Invariant check: December withholding + prior withholdings === total progressive tax
  assert.strictEqual(decRecon.decemberTaxWithheld + decRecon.janToNovTaxWithheld, decRecon.totalAnnualTaxArt17);

  // ----------------------------------------------------
  // 2. Test BPJS Engine & Temporal Wage Caps
  // ----------------------------------------------------
  console.log("  [2/4] Testing BPJS Split & Temporal Wage Ceiling Engine...");

  // Test ruleset lookups based on effective dates
  const rule2024_Feb = getRulesForDate('2024-02-15');
  assert.strictEqual(rule2024_Feb.jpCap, 10042300);

  const rule2025_Feb = getRulesForDate('2025-02-28');
  assert.strictEqual(rule2025_Feb.jpCap, 10042300);

  const rule2025_Mar = getRulesForDate('2025-03-01');
  assert.strictEqual(rule2025_Mar.jpCap, 10547400); // BPJS TK JP March 2025 increase!

  const rule2026_Feb = getRulesForDate('2026-02-28');
  assert.strictEqual(rule2026_Feb.jpCap, 10547400);

  const rule2026_Mar = getRulesForDate('2026-03-01');
  assert.strictEqual(rule2026_Mar.jpCap, 11086300); // BPJS TK JP March 2026 increase!

  // Test BPJS splits below ceiling (5M base)
  const bpjsLowSalary = calculateBpjs(5000000, 'low', '2026-03-01');
  assert.strictEqual(bpjsLowSalary.bpjsKesehatan.employer, 200000); // 4% of 5M
  assert.strictEqual(bpjsLowSalary.bpjsKesehatan.employee, 50000);  // 1% of 5M
  assert.strictEqual(bpjsLowSalary.bpjsKetenagakerjaan.jht.employer, 185000); // 3.7% of 5M
  assert.strictEqual(bpjsLowSalary.bpjsKetenagakerjaan.jht.employee, 100000); // 2% of 5M

  // Test BPJS splits above ceiling limits for 2026-03-01 (20M salary)
  const bpjsHighSalary2026 = calculateBpjs(20000000, 'low', '2026-03-15');
  assert.strictEqual(bpjsHighSalary2026.bpjsKesehatan.cappedWage, 12000000); // Cap 12M
  assert.strictEqual(bpjsHighSalary2026.bpjsKetenagakerjaan.jp.cappedWage, 11086300); // Capped at 11.086.300
  assert.strictEqual(bpjsHighSalary2026.bpjsKetenagakerjaan.jp.employer, Math.round(11086300 * 0.02));
  assert.strictEqual(bpjsHighSalary2026.bpjsKetenagakerjaan.jp.employee, Math.round(11086300 * 0.01));

  // Invariant checks: contributions should never be negative or exceed wage cap bounds
  assert.ok(bpjsLowSalary.summary.totalEmployerContribution >= 0);
  assert.ok(bpjsLowSalary.summary.totalEmployeeDeduction >= 0);
  assert.ok(bpjsHighSalary2026.bpjsKetenagakerjaan.jp.cappedWage <= 11086300);

  // ----------------------------------------------------
  // 3. Test THR Engine
  // ----------------------------------------------------
  console.log("  [3/4] Testing THR Payout Engine (Permenaker 6/2016)...");
  
  // Boundary Check: Tenure < 1 month
  const thrUnderOneMonth = calculateThr(10000000, 0, 0.8);
  assert.strictEqual(thrUnderOneMonth.isEligible, false);
  assert.strictEqual(thrUnderOneMonth.statutoryThrPayout, 0);

  // Boundary Check: Prorated 1 month tenure
  const thrOneMonth = calculateThr(12000000, 0, 1); // 1/12 * 12M = 1M
  assert.strictEqual(thrOneMonth.isEligible, true);
  assert.strictEqual(thrOneMonth.statutoryThrPayout, 1000000);

  // Boundary Check: Full 12 month tenure
  const thrFullTenure = calculateThr(10000000, 2000000, 12);
  assert.strictEqual(thrFullTenure.statutoryThrPayout, 12000000);

  // ----------------------------------------------------
  // 4. Test PHK Severance Engine
  // ----------------------------------------------------
  console.log("  [4/4] Testing PHK Severance Engine (PP 35/2021)...");
  
  // Test PHK for all statutory reasons
  const reasons = Object.keys(REASON_MULTIPLIERS);
  reasons.forEach(reason => {
    const calculation = calculatePhk(10000000, 8, reason, 10);
    assert.ok(calculation.totalPayout >= 0);
    assert.strictEqual(calculation.statutoryReference, "PP No. 35 Tahun 2021 Pasal 40-52");
  });

  // Specific check: Retirement (Pensiun - Multiplier UP 1.75x, UPMK 1x)
  // Tenure 8 years: UP base 9 mo * 1.75 = 15.75 mo = 157.5M
  // UPMK base 3 mo * 1 = 3 mo = 30M
  // Leave 0
  // Total = 187.5M
  const phkRetirement = calculatePhk(10000000, 8, 'retirement', 0);
  assert.strictEqual(phkRetirement.breakdown.uangPesangon.amount, 157500000);
  assert.strictEqual(phkRetirement.breakdown.uangPenghargaanMasaKerja.amount, 30000000);
  assert.strictEqual(phkRetirement.totalPayout, 187500000);

  console.log("\n✅ All 4 Deterministic Calculation Engines Passed 100% of Regulatory Invariant Unit Assertions!");
}

runUnitTests();
