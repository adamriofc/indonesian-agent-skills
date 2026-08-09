const assert = require('assert');
const { calculatePPh21Monthly, calculateArticle17AnnualTax, calculatePPh21DecemberReconciliation } = require('../../engines/pph21-calculator');
const pphRules = require('../../engines/rules/pph21.json');

function runPPh21MatrixTests() {
  console.log("⚡ Running PPh 21 Comprehensive Matrix Tests (300+ Cases)...");

  const rules = pphRules.rulesets[0];
  let testCount = 0;

  // 1. Test EVERY single bracket in TER Category A, B, and C
  const categories = ['A', 'B', 'C'];
  categories.forEach(cat => {
    const table = rules.ter_tables[cat];
    let prevMax = 0;

    table.forEach((bracket, index) => {
      const maxLimit = bracket.max === 'Infinity' ? 2000000000 : Number(bracket.max);
      
      // Test case 1: Midpoint of the bracket
      const midSalary = Math.round((prevMax + maxLimit) / 2);
      const resMid = calculatePPh21Monthly(midSalary, cat === 'A' ? 'TK/0' : (cat === 'B' ? 'K/1' : 'K/3'), true, '2026-03-01');
      assert.strictEqual(resMid.effectiveRate, bracket.rate, `Failed TER Category ${cat} index ${index} at midSalary ${midSalary}`);
      testCount++;

      // Test case 2: Upper boundary check
      const resMax = calculatePPh21Monthly(maxLimit, cat === 'A' ? 'TK/0' : (cat === 'B' ? 'K/1' : 'K/3'), true, '2026-03-01');
      assert.strictEqual(resMax.effectiveRate, bracket.rate, `Failed TER Category ${cat} index ${index} at upper boundary ${maxLimit}`);
      testCount++;

      // Test case 3: Penalty validation for midSalary with intermediate rounding
      const resPenalty = calculatePPh21Monthly(midSalary, cat === 'A' ? 'TK/0' : (cat === 'B' ? 'K/1' : 'K/3'), false, '2026-03-01');
      const baseTax = Math.round(midSalary * bracket.rate);
      const expectedPenaltyTax = Math.round(baseTax * 1.20);
      assert.strictEqual(resPenalty.monthlyTaxWithheld, expectedPenaltyTax, `Failed non-NPWP penalty at salary ${midSalary}`);
      testCount++;

      prevMax = maxLimit;
    });
  });

  // 2. Test December Reconciliation combinations (PTKP TK/0 to K/3)
  const ptkpStatuses = Object.keys(rules.ptkp_thresholds);
  const salaryScales = [60000000, 100000000, 250000000, 500000000, 1000000000]; // Annual Gross incomes

  ptkpStatuses.forEach(ptkp => {
    salaryScales.forEach(annualGross => {
      // Test with NPWP
      const resValid = calculatePPh21DecemberReconciliation(annualGross, ptkp, 0, 200000, true, '2026-03-01');
      assert.ok(resValid.decemberTaxWithheld >= 0);
      testCount++;

      // Test without NPWP (20% penalty)
      const resInvalid = calculatePPh21DecemberReconciliation(annualGross, ptkp, 0, 200000, false, '2026-03-01');
      assert.ok(resInvalid.decemberTaxWithheld >= resValid.decemberTaxWithheld);
      testCount++;
    });
  });

  console.log(`✅ PPh 21 Matrix Verification Successful: Verified ${testCount} tax calculation test cases.`);
}

runPPh21MatrixTests();
