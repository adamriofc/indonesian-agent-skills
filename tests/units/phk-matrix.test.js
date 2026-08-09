const assert = require('assert');
const { calculatePhk, REASON_MULTIPLIERS } = require('../../engines/phk-calculator');

function runPhkMatrixTests() {
  console.log("⚡ Running PHK Severance Comprehensive Matrix Tests (225+ Cases)...");

  const reasons = Object.keys(REASON_MULTIPLIERS);
  let testCount = 0;

  // Test tenure years from 1 to 25 years across all 9 statutory termination reasons
  for (let tenure = 1; tenure <= 25; tenure++) {
    reasons.forEach(reasonKey => {
      const baseWage = 10000000;
      const leaveDays = 12;

      const res = calculatePhk(baseWage, tenure, reasonKey, leaveDays);

      // Verify structural components
      assert.ok(res.breakdown.uangPesangon.amount >= 0);
      assert.ok(res.breakdown.uangPenghargaanMasaKerja.amount >= 0);
      assert.ok(res.breakdown.uangPenggantianHak.totalUphAmount >= 0);

      // Verify invariants
      const expectedTotal = res.breakdown.uangPesangon.amount + 
                            res.breakdown.uangPenghargaanMasaKerja.amount + 
                            res.breakdown.uangPenggantianHak.totalUphAmount;
      
      assert.strictEqual(res.totalPayout, expectedTotal, `Total payout invariant failed for tenure ${tenure} year(s), reason ${reasonKey}`);

      // Tenure cap assertions per PP 35/2021
      if (tenure >= 8) {
        assert.ok(res.breakdown.uangPesangon.baseMonths <= 9, "UP base months exceeded max cap of 9");
      }
      if (tenure >= 24) {
        assert.ok(res.breakdown.uangPenghargaanMasaKerja.baseMonths <= 10, "UPMK base months exceeded max cap of 10");
      }

      testCount++;
    });
  }

  console.log(`✅ PHK Severance Matrix Verification Successful: Verified ${testCount} statutory termination test cases.`);
}

runPhkMatrixTests();
