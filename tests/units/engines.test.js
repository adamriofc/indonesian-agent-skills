const assert = require('assert');
const path = require('path');
const { calculatePPh21Monthly, calculateArticle17AnnualTax, calculatePPh21DecemberReconciliation } = require('../../engines/pph21-calculator');
const { calculateBpjs, getRulesForDate } = require('../../engines/bpjs-calculator');
const { calculateThr } = require('../../engines/thr-calculator');
const { calculatePhk, REASON_MULTIPLIERS } = require('../../engines/phk-calculator');

// Load Golden Datasets
const goldenPph21 = require('../golden/pph21.json');
const goldenBpjs = require('../golden/bpjs.json');
const goldenPhk = require('../golden/phk.json');

function runUnitTests() {
  console.log("⚡ Running Deterministic Engine Math & Golden Corpus Tests...\n");

  // ----------------------------------------------------
  // 1. Test Golden Corpus PPh 21 Scenarios & Metadata
  // ----------------------------------------------------
  console.log("  [1/5] Testing PPh 21 Golden Corpus Datasets...");
  goldenPph21.forEach(tc => {
    if (tc.caseId.includes('DEC')) {
      const res = calculatePPh21DecemberReconciliation(
        tc.input.annualGrossIncome,
        tc.input.ptkpStatus,
        tc.input.janToNovTaxWithheld,
        tc.input.monthlyJhtEmployeeDeduction,
        tc.input.hasNpwp,
        tc.input.dateStr
      );
      assert.strictEqual(res.biayaJabatan, tc.expected.biayaJabatan, `Failed ${tc.caseId} biayaJabatan`);
      assert.strictEqual(res.netAnnualIncome, tc.expected.netAnnualIncome, `Failed ${tc.caseId} netAnnualIncome`);
      assert.strictEqual(res.pkp, tc.expected.pkp, `Failed ${tc.caseId} pkp`);
      assert.strictEqual(res.totalAnnualTaxArt17, tc.expected.totalAnnualTaxArt17, `Failed ${tc.caseId} totalAnnualTaxArt17`);
      assert.strictEqual(res.decemberTaxWithheld, tc.expected.decemberTaxWithheld, `Failed ${tc.caseId} decemberTaxWithheld`);
      assert.strictEqual(res.rulesetId, "PPH21-2024", `Failed ${tc.caseId} rulesetId`);
      assert.strictEqual(res.rulesetVersion, "1.0.0", `Failed ${tc.caseId} rulesetVersion`);
    } else {
      const res = calculatePPh21Monthly(tc.input.grossSalary, tc.input.ptkpStatus, tc.input.hasNpwp, tc.input.dateStr);
      assert.strictEqual(res.terCategory, tc.expected.terCategory, `Failed ${tc.caseId} terCategory`);
      assert.strictEqual(res.effectiveRatePercent, tc.expected.effectiveRatePercent, `Failed ${tc.caseId} rate`);
      assert.strictEqual(res.penaltyApplied, tc.expected.penaltyApplied, `Failed ${tc.caseId} penaltyApplied`);
      assert.strictEqual(res.monthlyTaxWithheld, tc.expected.monthlyTaxWithheld, `Failed ${tc.caseId} taxWithheld`);
      assert.strictEqual(res.rulesetId, "PPH21-2024", `Failed ${tc.caseId} rulesetId`);
      assert.strictEqual(res.rulesetVersion, "1.0.0", `Failed ${tc.caseId} rulesetVersion`);
    }
  });

  // ----------------------------------------------------
  // 2. Test Golden Corpus BPJS Scenarios & Error Fallback
  // ----------------------------------------------------
  console.log("  [2/5] Testing BPJS Golden Corpus Datasets & Temporal Transitions...");
  goldenBpjs.forEach(tc => {
    const res = calculateBpjs(tc.input.baseWage, tc.input.jkkHazardLevel, tc.input.dateStr);
    assert.strictEqual(res.calculationDate, tc.input.dateStr, `Failed ${tc.caseId} calculationDate`);
    assert.strictEqual(res.bpjsKesehatan.cappedWage, tc.expected.kesCappedWage, `Failed ${tc.caseId} kesCap`);
    assert.strictEqual(res.bpjsKetenagakerjaan.jp.cappedWage, tc.expected.jpCappedWage, `Failed ${tc.caseId} jpCap`);
    assert.strictEqual(res.bpjsKetenagakerjaan.jp.employer, tc.expected.jpEmployer, `Failed ${tc.caseId} jpEmployer`);
    assert.strictEqual(res.bpjsKetenagakerjaan.jp.employee, tc.expected.jpEmployee, `Failed ${tc.caseId} jpEmployee`);
    assert.ok(res.rulesetId.startsWith("BPJS-"), `Failed ${tc.caseId} rulesetId format`);
    assert.strictEqual(res.rulesetVersion, "1.0.0", `Failed ${tc.caseId} rulesetVersion`);
  });

  // Assert correct rulesetId mapping for BPJS transitions
  const bpjs2025Res = calculateBpjs(10000000, 'low', '2025-05-01');
  assert.strictEqual(bpjs2025Res.rulesetId, "BPJS-2025");
  assert.strictEqual(bpjs2025Res.ruleset.version, "1.0.0");

  const bpjs2026Res = calculateBpjs(10000000, 'low', '2026-05-01');
  assert.strictEqual(bpjs2026Res.rulesetId, "BPJS-2026");

  // Verify that BPJS engine throws on unsupported historical dates (Audit P0)
  assert.throws(() => {
    getRulesForDate('2010-01-01');
  }, /No regulatory BPJS ruleset available for date/, "Failed to throw on unsupported historical date");

  // ----------------------------------------------------
  // 3. Test Golden Corpus PHK Scenarios
  // ----------------------------------------------------
  console.log("  [3/5] Testing PHK Golden Corpus Datasets...");
  goldenPhk.forEach(tc => {
    const res = calculatePhk(tc.input.monthlyWage, tc.input.tenureYears, tc.input.reasonKey, tc.input.remainingLeaveDays);
    assert.strictEqual(res.breakdown.uangPesangon.amount, tc.expected.uangPesangon, `Failed ${tc.caseId} UP`);
    assert.strictEqual(res.breakdown.uangPenghargaanMasaKerja.amount, tc.expected.uangPenghargaanMasaKerja, `Failed ${tc.caseId} UPMK`);
    assert.strictEqual(res.breakdown.uangPenggantianHak.totalUphAmount, tc.expected.uangPenggantianHak, `Failed ${tc.caseId} UPH`);
    assert.strictEqual(res.totalPayout, tc.expected.totalPayout, `Failed ${tc.caseId} Total`);
  });

  // ----------------------------------------------------
  // 4. Test Invariant & Boundary Assertions
  // ----------------------------------------------------
  console.log("  [4/5] Testing Regulatory Invariant & Boundary Assertions...");
  
  // Boundary Testing: TER A boundary checks
  const pphBoundary1 = calculatePPh21Monthly(5400001, 'TK/0', true, '2026-03-01');
  assert.strictEqual(pphBoundary1.effectiveRatePercent, '0.25%');

  // Invariant check: December withholding + prior withholdings === total progressive tax
  const decRecon = calculatePPh21DecemberReconciliation(120000000, 'TK/0', 2000000, 200000, true, '2026-03-01');
  assert.strictEqual(decRecon.decemberTaxWithheld + decRecon.janToNovTaxWithheld, decRecon.totalAnnualTaxArt17);

  // Invariant check: BPJS contributions cannot be negative
  const bpjsLowSalary = calculateBpjs(5000000, 'low', '2026-03-01');
  assert.ok(bpjsLowSalary.summary.totalEmployerContribution >= 0);
  assert.ok(bpjsLowSalary.summary.totalEmployeeDeduction >= 0);

  // ----------------------------------------------------
  // 5. Test THR Engine
  // ----------------------------------------------------
  console.log("  [5/5] Testing THR Payout Engine (Permenaker 6/2016)...");
  const thrUnderOneMonth = calculateThr(10000000, 0, 0.8);
  assert.strictEqual(thrUnderOneMonth.isEligible, false);

  const thrOneMonth = calculateThr(12000000, 0, 1);
  assert.strictEqual(thrOneMonth.statutoryThrPayout, 1000000);

  console.log("\n✅ All 5 Test Modules & Golden Corpus Cases Passed 100% of Assertions!");
}

runUnitTests();
