const assert = require('assert');
const { calculatePPh21Monthly } = require('../../engines/pph21-calculator');
const { calculateBpjs, BPJS_KES_MAX_WAGE, BPJS_JP_MAX_WAGE } = require('../../engines/bpjs-calculator');
const { calculateThr } = require('../../engines/thr-calculator');
const { calculatePhk } = require('../../engines/phk-calculator');

function runUnitTests() {
  console.log("⚡ Running Deterministic Engine Math Unit Tests...\n");

  // 1. Test PPh 21 TER Engine
  console.log("  [1/4] Testing PPh 21 TER Engine (PP 58/2023)...");
  const pph1 = calculatePPh21Monthly(10000000, 'TK/0', true); // TER A: 2.0%
  assert.strictEqual(pph1.terCategory, 'A');
  assert.strictEqual(pph1.effectiveRatePercent, '2.00%');
  assert.strictEqual(pph1.monthlyTaxWithheld, 200000);

  const pphPenalty = calculatePPh21Monthly(10000000, 'TK/0', false); // 200,000 * 1.2 = 240,000
  assert.strictEqual(pphPenalty.penaltyApplied, true);
  assert.strictEqual(pphPenalty.monthlyTaxWithheld, 240000);

  // 2. Test BPJS Engine & Wage Caps
  console.log("  [2/4] Testing BPJS Split & Wage Ceiling Engine...");
  const bpjsHighSalary = calculateBpjs(20000000, 'low');
  assert.strictEqual(bpjsHighSalary.bpjsKesehatan.cappedWage, BPJS_KES_MAX_WAGE); // Capped at 12M
  assert.strictEqual(bpjsHighSalary.bpjsKesehatan.employer, 480000); // 4% of 12M
  assert.strictEqual(bpjsHighSalary.bpjsKesehatan.employee, 120000); // 1% of 12M
  assert.strictEqual(bpjsHighSalary.bpjsKetenagakerjaan.jp.cappedWage, BPJS_JP_MAX_WAGE); // Capped at 10.042.300

  // 3. Test THR Engine
  console.log("  [3/4] Testing THR Payout Engine (Permenaker 6/2016)...");
  const thrIneligible = calculateThr(10000000, 0, 0.5);
  assert.strictEqual(thrIneligible.isEligible, false);

  const thrProrated = calculateThr(12000000, 0, 6); // 6/12 * 12M = 6M
  assert.strictEqual(thrProrated.isEligible, true);
  assert.strictEqual(thrProrated.statutoryThrPayout, 6000000);

  const thrFull = calculateThr(10000000, 2000000, 24); // 1x (10M + 2M) = 12M
  assert.strictEqual(thrFull.statutoryThrPayout, 12000000);

  // 4. Test PHK Severance Engine
  console.log("  [4/4] Testing PHK Severance Engine (PP 35/2021)...");
  const phkEfficiency = calculatePhk(10000000, 5, 'efficiency_loss', 12);
  // UP base 6 mo * 0.5 = 3 mo = 30M
  // UPMK base 2 mo * 1.0 = 2 mo = 20M
  // Leave 12 days = (12/25) * 10M = 4.8M
  // Total = 54.8M
  assert.strictEqual(phkEfficiency.breakdown.uangPesangon.amount, 30000000);
  assert.strictEqual(phkEfficiency.breakdown.uangPenghargaanMasaKerja.amount, 20000000);
  assert.strictEqual(phkEfficiency.breakdown.uangPenggantianHak.leavePayoutAmount, 4800000);
  assert.strictEqual(phkEfficiency.totalPayout, 54800000);

  console.log("\n✅ All 4 Deterministic Calculation Engines Passed 100% of Unit Assertions!");
}

runUnitTests();
