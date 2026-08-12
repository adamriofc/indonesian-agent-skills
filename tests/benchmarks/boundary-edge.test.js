const assert = require('assert');
const { calculatePPh21Monthly } = require('../../engines/pph21-calculator');
const { calculateUmkmFinalTax } = require('../../engines/umkm-tax-calculator');
const { calculateBpjs } = require('../../engines/bpjs-calculator');
const { auditTransferPricingThinCap } = require('../../engines/transfer-pricing-engine');
const { calculateThr } = require('../../engines/thr-calculator');

function runBoundaryEdgeBenchmark() {
  console.log("📐 Running Tier A — Deterministic Engine Boundary, Invalid & Invariant Tests...\n");

  let assertionsPassed = 0;

  // ---------------------------------------------------------------
  // 1. Threshold Boundary Cases (threshold - 1, threshold, threshold + 1)
  // ---------------------------------------------------------------
  console.log("  [1/3] Testing Threshold Boundary Cases (threshold-1, threshold, threshold+1)...");

  // PPh 21 Category A TER Bracket 1 Boundary (Rp 5.400.000 limit)
  const pphBelow = calculatePPh21Monthly(5399999, 'TK/0', true, '2026-03-01');
  assert.strictEqual(pphBelow.effectiveRate, 0); // Below 5.400.000 = 0%
  assertionsPassed++;

  const pphAt = calculatePPh21Monthly(5400000, 'TK/0', true, '2026-03-01');
  assert.strictEqual(pphAt.effectiveRate, 0); // At 5.400.000 = 0%
  assertionsPassed++;

  const pphAbove = calculatePPh21Monthly(5400001, 'TK/0', true, '2026-03-01');
  assert.strictEqual(pphAbove.effectiveRate, 0.0025); // At 5.400.001 = 0.25%
  assertionsPassed++;

  // UMKM Final Tax Rp 4.8B Gross Turnover Boundary (PP 20/2026)
  const umkmBelow = calculateUmkmFinalTax(4600000000, 100000000, 'individual', '2026-05-01');
  assert.strictEqual(umkmBelow.isEligible, true);
  assertionsPassed++;

  const umkmAt = calculateUmkmFinalTax(4700000000, 100000000, 'individual', '2026-05-01');
  assert.strictEqual(umkmAt.isEligible, true);
  assertionsPassed++;

  const umkmAbove = calculateUmkmFinalTax(4700000000, 100000001, 'individual', '2026-05-01');
  assert.strictEqual(umkmAbove.isEligible, false); // Over Rp 4.8B = ineligible
  assertionsPassed++;

  // Thin Cap DER 4:1 Boundary (PMK 172/2023)
  const derAtLimit = auditTransferPricingThinCap({ totalInterestBearingDebt: 40000000000, totalEquity: 10000000000, annualInterestExpense: 4000000000 });
  assert.strictEqual(derAtLimit.isDerExceeded, false); // DER exactly 4.0 = not exceeded
  assertionsPassed++;

  const derAboveLimit = auditTransferPricingThinCap({ totalInterestBearingDebt: 41000000000, totalEquity: 10000000000, annualInterestExpense: 4000000000 });
  assert.strictEqual(derAboveLimit.isDerExceeded, true); // DER > 4.0 = exceeded
  assertionsPassed++;

  // ---------------------------------------------------------------
  // 2. Invalid Input Guard Cases (null, NaN, negative, malformed string)
  // ---------------------------------------------------------------
  console.log("  [2/3] Testing Invalid Input Fail-Closed Boundaries (null, NaN, negative, malformed string)...");

  assert.throws(() => calculatePPh21Monthly(null, 'TK/0', true, '2026-03-01'), /INVALID_INPUT/);
  assertionsPassed++;

  assert.throws(() => calculatePPh21Monthly(NaN, 'TK/0', true, '2026-03-01'), /INVALID_INPUT/);
  assertionsPassed++;

  assert.throws(() => calculatePPh21Monthly(-1000000, 'TK/0', true, '2026-03-01'), /INVALID_INPUT/);
  assertionsPassed++;

  assert.throws(() => calculateBpjs("10000000; DROP TABLE rules;", 'low', '2026-03-01'), /INVALID_INPUT/);
  assertionsPassed++;

  assert.throws(() => calculateUmkmFinalTax(-500, -100, 'individual', '2026-05-01'), /INVALID_INPUT/);
  assertionsPassed++;

  // ---------------------------------------------------------------
  // 3. Mathematical Invariants (tax >= 0, percentage bounded <= 100%)
  // ---------------------------------------------------------------
  console.log("  [3/3] Testing Invariant Post-Conditions (tax >= 0, rates bounded [0, 100%])...");

  const sampleSalaries = [0, 1000000, 5000000, 10000000, 50000000, 200000000];
  sampleSalaries.forEach((sal) => {
    const res = calculatePPh21Monthly(sal, 'TK/0', true, '2026-03-01');
    assert.ok(res.monthlyTaxWithheld >= 0, `Tax withheld must be non-negative for salary ${sal}`);
    assert.ok(res.effectiveRate >= 0 && res.effectiveRate <= 0.35, `Effective rate must be bounded [0, 35%] for salary ${sal}`);
    assertionsPassed += 2;
  });

  const thrRes = calculateThr(10000000, 0, 12);
  assert.ok(thrRes.statutoryThrPayout >= 0);
  assert.strictEqual(thrRes.statutoryThrPayout, 10000000);
  assertionsPassed += 2;

  console.log(`\n✅ Boundary & Invariant Suite Passed 100%! (${assertionsPassed} assertion statements verified)`);
}

runBoundaryEdgeBenchmark();
