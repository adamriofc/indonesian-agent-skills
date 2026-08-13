const assert = require('assert');
const { calculatePPh21Monthly } = require('../../engines/pph21-calculator');
const { calculateUmkmFinalTax } = require('../../engines/umkm-tax-calculator');
const { auditTransferPricingThinCap } = require('../../engines/transfer-pricing-engine');
const { calculateExitWaterfall } = require('../../engines/term-sheet-waterfall');
const { calculateMarketplaceFee } = require('../../engines/marketplace-fee-calculator');
const { resolveBusinessArchetype } = require('../../engines/kbli-context-router');
const { getArchetypeContract } = require('../../engines/business-archetype-contract');

function runCrossEngineInvariantTests() {
  console.log("🔗 Running Cross-Engine Mathematical & Statutory Invariants Suite...\n");
  let assertionsCount = 0;

  // 1. Tax Rate & Invariant Bounds
  console.log("  [1/5] Testing Tax Rate Invariants & Mathematical Upper Bounds...");
  const salaries = [5000000, 10000000, 25000000, 50000000, 100000000];
  salaries.forEach(sal => {
    const res = calculatePPh21Monthly(sal, 'TK/0', true, '2026-03-01');
    assert.ok(res.monthlyTaxWithheld >= 0, `Tax withheld must be non-negative for salary ${sal}`);
    assert.ok(res.effectiveRate >= 0 && res.effectiveRate <= 0.35, `Effective TER rate must not exceed 35% cap for salary ${sal}`);
    assertionsCount += 2;
  });

  const umkmRes = calculateUmkmFinalTax(600000000, 50000000, 'individual', '2026-05-01');
  assert.strictEqual(umkmRes.finalTaxRatePercent, '0.50%');
  assert.strictEqual(umkmRes.finalTaxDue, 250000);
  assertionsCount += 2;

  // 2. Thin Cap & Secondary Dividend Adjustment Invariant
  console.log("  [2/5] Testing Thin Cap DER 4:1 & Secondary Adjustment Invariants...");
  const tpDomestic = auditTransferPricingThinCap({ totalInterestBearingDebt: 60000000000, totalEquity: 10000000000, annualInterestExpense: 6000000000, isAffiliateLender: true, isDomesticAffiliate: true });
  assert.strictEqual(tpDomestic.isDerExceeded, true);
  assert.strictEqual(tpDomestic.maxAllowableDebt, 40000000000);
  assert.strictEqual(tpDomestic.nonDeductibleInterestExpense, 2000000000);
  assert.strictEqual(tpDomestic.secondaryAdjustmentTaxAmount, tpDomestic.nonDeductibleInterestExpense * 0.15); // 15% PPh 23
  assertionsCount += 4;

  const tpForeign = auditTransferPricingThinCap({ totalInterestBearingDebt: 50000000000, totalEquity: 10000000000, annualInterestExpense: 5000000000, isAffiliateLender: true, isDomesticAffiliate: false, hasValidDgtForm: true, treatyRatePercent: 10 });
  assert.strictEqual(tpForeign.secondaryAdjustmentTaxAmount, tpForeign.nonDeductibleInterestExpense * 0.10); // 10% Treaty P3B
  assertionsCount += 1;

  // 3. VC Term Sheet Waterfall Distribution Conservation Law
  console.log("  [3/5] Testing Exit Valuation Conservation Law (Total Payout = Exit Valuation)...");
  const waterfall = calculateExitWaterfall({
    exitValuation: 100000000000,
    commonOwnershipPercent: 0.65,
    investorTiers: [
      { tierName: 'Series B', investmentAmount: 20000000000, preferenceMultiple: 1.0, isParticipating: true, capMultiple: null, ownershipPercent: 0.15, seniorityOrder: 1 },
      { tierName: 'Series A', investmentAmount: 10000000000, preferenceMultiple: 1.0, isParticipating: false, capMultiple: null, ownershipPercent: 0.20, seniorityOrder: 2 }
    ]
  });
  const totalDistributed = waterfall.totalInvestorPayout + waterfall.commonShareholdersPayout + waterfall.remainingUnallocated;
  assert.strictEqual(totalDistributed, 100000000000, 'Sum of investor and common payouts must equal total exit valuation');
  assertionsCount += 1;

  // 4. Marketplace Seller Payout Accounting Conservation Law
  console.log("  [4/5] Testing Marketplace Net Payout Accounting Invariant...");
  const mpFee = calculateMarketplaceFee(100000, 'shopee', 'star', true, 5000);
  const totalDeductionsAndPayout = mpFee.totalPlatformDeductions + mpFee.netSellerPayout;
  assert.strictEqual(totalDeductionsAndPayout, 100000, 'Net seller payout plus platform deductions must equal gross selling price');
  assertionsCount += 1;

  // 5. KBLI Archetype Contract Invariants
  console.log("  [5/5] Testing KBLI Context Router & Archetype Contract Invariants...");
  const profArch = resolveBusinessArchetype({ kbliCode: '70209' });
  const profContract = getArchetypeContract(profArch.businessArchetype);
  assert.strictEqual(profArch.businessArchetype, 'PROFESSIONAL_SERVICE');
  assert.strictEqual(profContract.capacityModel, 'HUMAN_CAPACITY');

  const mfgArch = resolveBusinessArchetype({ kbliCode: '10710' });
  const mfgContract = getArchetypeContract(mfgArch.businessArchetype);
  assert.strictEqual(mfgArch.businessArchetype, 'PRODUCT_MANUFACTURING');
  assert.strictEqual(mfgContract.capacityModel, 'MACHINE_CAPACITY');
  assertionsCount += 4;

  console.log(`\n✅ Cross-Engine Invariants Suite Passed 100%! (${assertionsCount} invariant assertions verified)`);
}

runCrossEngineInvariantTests();
