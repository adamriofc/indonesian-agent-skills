const assert = require('assert');
const { calculatePPh23And26 } = require('../../engines/pph23-26-calculator');
const { calculateUmkmFinalTax, UMKM_FREE_THRESHOLD_OP } = require('../../engines/umkm-tax-calculator');
const { calculateMarketplaceFee, MARKETPLACE_FEE_RATES, FREE_SHIPPING_POLICY, resolveRuleset } = require('../../engines/marketplace-fee-calculator');
const { calculatePkwtCompensation } = require('../../engines/pkwt-compensation-calculator');

function runNewEnginesTests() {
  console.log("⚡ Running Deepened Math Unit Tests for 4 New Deterministic Engines...\n");

  // ------------------------------------------------------
  // 1. PPh 23 & 26 Engine: statutory rates, penalty, treaty
  // ------------------------------------------------------
  console.log("  [1/4] PPh 23 (Service 2% / Royalty 15%) & PPh 26 (Offshore 20% / Treaty) Engine...");
  // Service 2% with NPWP
  const pph23Valid = calculatePPh23And26(10000000, 'service', true);
  assert.strictEqual(pph23Valid.taxWithheld, 200000);
  assert.strictEqual(pph23Valid.netAmountReceived, 9800000);
  assert.strictEqual(pph23Valid.taxType, 'PPh 23');
  assert.strictEqual(pph23Valid.penaltyApplied, false);

  // Service non-NPWP: 100% penalty doubles the 2% rate to 4%
  const pph23NoNpwp = calculatePPh23And26(10000000, 'service', false);
  assert.strictEqual(pph23NoNpwp.taxWithheld, 400000);
  assert.strictEqual(pph23NoNpwp.penaltyApplied, true);
  assert.strictEqual(pph23NoNpwp.effectiveRatePercent, '4.00%');

  // Dividend / royalty / interest statutory 15%
  const pph23Royalty = calculatePPh23And26(10000000, 'royalty', true);
  assert.strictEqual(pph23Royalty.taxWithheld, 1500000);
  assert.strictEqual(pph23Royalty.effectiveRatePercent, '15.00%');
  const pph23Dividend = calculatePPh23And26(20000000, 'dividend', true);
  assert.strictEqual(pph23Dividend.taxWithheld, 3000000);
  const pph23Interest = calculatePPh23And26(5000000, 'interest', true);
  assert.strictEqual(pph23Interest.taxWithheld, 750000);

  // Dividend 15% also doubles under non-NPWP penalty (30%)
  const pph23RoyaltyNoNpwp = calculatePPh23And26(10000000, 'royalty', false);
  assert.strictEqual(pph23RoyaltyNoNpwp.taxWithheld, 3000000);
  assert.strictEqual(pph23RoyaltyNoNpwp.penaltyApplied, true);

  // Offshore PPh 26: default 20%, no NPWP penalty applies offshore
  const pph26Default = calculatePPh23And26(50000000, 'offshore_service', false, false, null);
  assert.strictEqual(pph26Default.taxType, 'PPh 26');
  assert.strictEqual(pph26Default.taxWithheld, 10000000);
  assert.strictEqual(pph26Default.penaltyApplied, false);

  // Treaty (DGT Form) low rate 10%
  const pph26Treaty = calculatePPh23And26(50000000, 'offshore_service', false, true, 10);
  assert.strictEqual(pph26Treaty.taxWithheld, 5000000);
  assert.strictEqual(pph26Treaty.effectiveRatePercent, '10.00%');

  // Treaty flag without rate falls back to statutory 20% (fail-safe, not silent wrong math)
  const pph26DgtNoRate = calculatePPh23And26(10000000, 'offshore_service', true, true, null);
  assert.strictEqual(pph26DgtNoRate.taxWithheld, 2000000);

  // "foreign" keyword detection
  const pph26Foreign = calculatePPh23And26(10000000, 'foreign_interest', true);
  assert.strictEqual(pph26Foreign.taxType, 'PPh 26');

  // Zero and negative gross amounts clamp to zero (no negative tax)
  const zeroResult = calculatePPh23And26(0, 'service', true);
  assert.strictEqual(zeroResult.taxWithheld, 0);
  assert.strictEqual(zeroResult.netAmountReceived, 0);
  const negativeResult = calculatePPh23And26(-5000000, 'service', true);
  assert.strictEqual(negativeResult.grossAmount, 0);
  assert.strictEqual(negativeResult.taxWithheld, 0);

  // Unknown transaction type defaults to service 2% (documented fallback)
  const unknownType = calculatePPh23And26(10000000, 'consulting_advice', true);
  assert.strictEqual(unknownType.taxWithheld, 200000);

  // Fractional Rupiah always rounds to whole Rupiah at the withholding level
  const roundingCase = calculatePPh23And26(33333333, 'service', true);
  assert.strictEqual(roundingCase.taxWithheld, 666667);

  // ------------------------------------------------------
  // 2. UMKM Final Tax 0.5% (PP 55/2022) — Rp 500M threshold
  // ------------------------------------------------------
  console.log("  [2/4] UMKM Final Tax 0.5% (PP 55/2022) — Rp 500M threshold boundary engine...");
  assert.strictEqual(UMKM_FREE_THRESHOLD_OP, 500000000);

  // Entirely under threshold
  const umkmIndivExempt = calculateUmkmFinalTax(200000000, 50000000, 'individual');
  assert.strictEqual(umkmIndivExempt.taxableRevenue, 0);
  assert.strictEqual(umkmIndivExempt.finalTaxDue, 0);
  assert.strictEqual(umkmIndivExempt.taxExemptRevenue, 50000000);

  // Exact threshold boundary: ytdAfter == 500M -> fully exempt
  const umkmExactBoundary = calculateUmkmFinalTax(499999999, 1, 'individual');
  assert.strictEqual(umkmExactBoundary.taxExemptRevenue, 1);
  assert.strictEqual(umkmExactBoundary.taxableRevenue, 0);
  assert.strictEqual(umkmExactBoundary.finalTaxDue, 0);

  // One Rupiah over threshold -> only the excess is taxable
  const umkmOverByOne = calculateUmkmFinalTax(499999999, 2, 'individual');
  assert.strictEqual(umkmOverByOne.taxExemptRevenue, 1);
  assert.strictEqual(umkmOverByOne.taxableRevenue, 1);
  assert.strictEqual(umkmOverByOne.finalTaxDue, 0);

  // Partial threshold crossover mid-month
  const umkmCrossover = calculateUmkmFinalTax(480000000, 50000000, 'individual');
  assert.strictEqual(umkmCrossover.taxExemptRevenue, 20000000);
  assert.strictEqual(umkmCrossover.taxableRevenue, 30000000);
  assert.strictEqual(umkmCrossover.finalTaxDue, 150000);

  // Threshold already fully utilized
  const umkmAlreadyOver = calculateUmkmFinalTax(600000000, 50000000, 'individual');
  assert.strictEqual(umkmAlreadyOver.taxExemptRevenue, 0);
  assert.strictEqual(umkmAlreadyOver.taxableRevenue, 50000000);
  assert.strictEqual(umkmAlreadyOver.finalTaxDue, 250000);

  // Corporate: no exemption regardless of revenue level
  const umkmCorp = calculateUmkmFinalTax(100000000, 50000000, 'corporate');
  assert.strictEqual(umkmCorp.taxableRevenue, 50000000);
  assert.strictEqual(umkmCorp.finalTaxDue, 250000);
  const umkmCorpOver = calculateUmkmFinalTax(800000000, 50000000, 'corporate');
  assert.strictEqual(umkmCorpOver.finalTaxDue, 250000);

  // Alternative taxpayer label "orang_pribadi" maps to individual
  const umkmAlias = calculateUmkmFinalTax(100000000, 50000000, 'orang_pribadi');
  assert.strictEqual(umkmAlias.taxableRevenue, 0);

  // Large revenue: 0.5% of Rp 7.5B = Rp 37,500,000
  const umkmLarge = calculateUmkmFinalTax(7500000000, 100000000, 'corporate');
  assert.strictEqual(umkmLarge.finalTaxDue, 500000);

  // Zero / negative revenue clamp
  const umkmZero = calculateUmkmFinalTax(0, 0, 'individual');
  assert.strictEqual(umkmZero.finalTaxDue, 0);
  const umkmNegative = calculateUmkmFinalTax(-100, -50, 'individual');
  assert.strictEqual(umkmNegative.grossRevenueYtdBefore, 0);
  assert.strictEqual(umkmNegative.finalTaxDue, 0);

  // ------------------------------------------------------
  // 3. Marketplace Admin Fee Engine — full platform/tier matrix
  // ------------------------------------------------------
  console.log("  [3/4] Marketplace Admin Fee & Net Margin Engine — platform/tier matrix...");
  const shopeeStar = calculateMarketplaceFee(100000, 'shopee', 'star', true, 0);
  assert.strictEqual(shopeeStar.adminFeeAmount, 6000);
  assert.strictEqual(shopeeStar.freeShippingExtraFee, 4000);
  assert.strictEqual(shopeeStar.netSellerPayout, 90000);

  // Shopee all tiers
  assert.strictEqual(calculateMarketplaceFee(1000000, 'shopee', 'non_star', false, 0).adminFeeAmount, 40000);
  assert.strictEqual(calculateMarketplaceFee(1000000, 'shopee', 'star_plus', false, 0).adminFeeAmount, 65000);
  assert.strictEqual(calculateMarketplaceFee(1000000, 'shopee', 'mall', false, 0).adminFeeAmount, 85000);

  // Tokopedia all tiers
  assert.strictEqual(calculateMarketplaceFee(1000000, 'tokopedia', 'regular', false, 0).adminFeeAmount, 38000);
  assert.strictEqual(calculateMarketplaceFee(1000000, 'tokopedia', 'power_merchant', false, 0).adminFeeAmount, 45000);
  assert.strictEqual(calculateMarketplaceFee(1000000, 'tokopedia', 'power_merchant_pro', false, 0).adminFeeAmount, 55000);
  assert.strictEqual(calculateMarketplaceFee(1000000, 'tokopedia', 'official_store', false, 0).adminFeeAmount, 65000);

  // TikTok Shop tiers
  assert.strictEqual(calculateMarketplaceFee(1000000, 'tiktok_shop', 'standard', false, 0).adminFeeAmount, 45000);
  assert.strictEqual(calculateMarketplaceFee(1000000, 'tiktok_shop', 'mall', false, 0).adminFeeAmount, 65000);

  // Free shipping extra: 4% capped at Rp 10.000
  const capCase = calculateMarketplaceFee(10000000, 'shopee', 'star', true, 0);
  assert.strictEqual(capCase.freeShippingExtraFee, 10000);
  const underCap = calculateMarketplaceFee(100000, 'shopee', 'star', true, 0);
  assert.strictEqual(underCap.freeShippingExtraFee, 4000);

  // ad spend deducted from net payout
  const adCase = calculateMarketplaceFee(100000, 'shopee', 'star', false, 25000);
  assert.strictEqual(adCase.adSpendBudget, 25000);
  assert.strictEqual(adCase.totalPlatformDeductions, 31000);
  assert.strictEqual(adCase.netSellerPayout, 69000);

  // Zero / negative selling price clamp
  const zeroMarket = calculateMarketplaceFee(0, 'shopee', 'star', true, 0);
  assert.strictEqual(zeroMarket.netSellerPayout, 0);
  assert.strictEqual(zeroMarket.netMarginPercent, '0.00%');
  const negMarket = calculateMarketplaceFee(-100000, 'shopee', 'star', false, 0);
  assert.strictEqual(negMarket.sellingPrice, 0);

  // Unregistered platform falls back to Shopee tier rates (documented)
  const fallbackPlatform = calculateMarketplaceFee(1000000, 'lazada', 'star', false, 0);
  assert.strictEqual(fallbackPlatform.adminFeeAmount, 60000);
  assert.strictEqual(fallbackPlatform.platform, 'lazada');

  // Unregistered tier falls back to flat 5% (documented safe default)
  const fallbackTier = calculateMarketplaceFee(1000000, 'shopee', 'super_elite', false, 0);
  assert.strictEqual(fallbackTier.adminFeeAmount, 50000);

  // Marketplace fee rates table exposes deterministic constants
  assert.strictEqual(MARKETPLACE_FEE_RATES.shopee.mall, 0.085);
  assert.strictEqual(MARKETPLACE_FEE_RATES.tokopedia.official_store, 0.065);
  assert.strictEqual(MARKETPLACE_FEE_RATES.tiktok_shop.standard, 0.045);

  // Free shipping policy comes from the active ruleset (4% capped at Rp 10.000)
  assert.strictEqual(FREE_SHIPPING_POLICY.rate, 0.04);
  assert.strictEqual(FREE_SHIPPING_POLICY.cap_per_item, 10000);

  // Temporal ruleset resolution (SSOT versioned policy): dates inside the effective window resolve to MKPL-FEE-2024
  const activeWindow = resolveRuleset('2025-06-01');
  assert.strictEqual(activeWindow.rulesetId, 'MKPL-FEE-2024');
  assert.strictEqual(activeWindow.effective_from, '2024-07-01');

  // Dates before the first effective_from still resolve deterministically to the earliest ruleset
  const preEffective = resolveRuleset('2023-01-01');
  assert.strictEqual(preEffective.rulesetId, 'MKPL-FEE-2024');

  // Invalid date strings fall back deterministically (no crash, no silent wrong math)
  const invalidDate = resolveRuleset('not-a-date');
  assert.strictEqual(invalidDate.rulesetId, 'MKPL-FEE-2024');

  // Engine output carries the applied ruleset identity (Trust Envelope field)
  const ruledResult = calculateMarketplaceFee(1000000, 'tokopedia', 'official_store', false, 0, '2025-01-01');
  assert.strictEqual(ruledResult.rulesetId, 'MKPL-FEE-2024');
  assert.strictEqual(ruledResult.rulesetVersion, '1.0.0');

  // Determinism: identical inputs produce identical outputs
  const detA = calculateMarketplaceFee(750000, 'tokopedia', 'power_merchant', true, 10000);
  const detB = calculateMarketplaceFee(750000, 'tokopedia', 'power_merchant', true, 10000);
  assert.deepStrictEqual(detA, detB);

  // ------------------------------------------------------
  // 4. PKWT Compensation Engine — tenure boundary matrix
  // ------------------------------------------------------
  console.log("  [4/4] PKWT Compensation Engine (PP 35/2021) — tenure boundary matrix...");
  // Ineligible below 1 month (including 0 and fractional 0.99)
  const pkwtZero = calculatePkwtCompensation(10000000, 0);
  assert.strictEqual(pkwtZero.isEligible, false);
  assert.strictEqual(pkwtZero.compensationPayout, 0);
  const pkwtUnderMonth = calculatePkwtCompensation(10000000, 0.5);
  assert.strictEqual(pkwtUnderMonth.isEligible, false);
  const pkwtAlmostOne = calculatePkwtCompensation(10000000, 0.99);
  assert.strictEqual(pkwtAlmostOne.isEligible, false);

  // Exactly 1 month: (1/12) x wage
  const pkwtOne = calculatePkwtCompensation(12000000, 1);
  assert.strictEqual(pkwtOne.statutoryCompensationPayout, 1000000);

  // 6 months: (6/12) x wage
  const pkwtSixMonths = calculatePkwtCompensation(12000000, 6);
  assert.strictEqual(pkwtSixMonths.isEligible, true);
  assert.strictEqual(pkwtSixMonths.statutoryCompensationPayout, 6000000);

  // Exactly 12 months: exactly 1 full monthly wage
  const pkwtTwelve = calculatePkwtCompensation(12000000, 12);
  assert.strictEqual(pkwtTwelve.statutoryCompensationPayout, 12000000);
  assert.strictEqual(pkwtTwelve.formulaApplied, '1 x Monthly Wage');

  // Above 12 months stays proportional: 13 months -> 13/12 x wage
  const pkwtThirteen = calculatePkwtCompensation(12000000, 13);
  assert.strictEqual(pkwtThirteen.statutoryCompensationPayout, 13000000);

  // 24 months -> 2x wage; 60 months -> 5x wage
  const pkwtTwoYears = calculatePkwtCompensation(12000000, 24);
  assert.strictEqual(pkwtTwoYears.statutoryCompensationPayout, 24000000);
  const pkwtFiveYears = calculatePkwtCompensation(12000000, 60);
  assert.strictEqual(pkwtFiveYears.statutoryCompensationPayout, 60000000);

  // Over statutory 5-year limit still computes (contract would convert to PKWTT; output flagged by caller)
  const pkwtOverLimit = calculatePkwtCompensation(12000000, 61);
  assert.strictEqual(pkwtOverLimit.statutoryCompensationPayout, 61000000);

  // Non-divisible wage rounds to nearest whole Rupiah
  const pkwtRounding = calculatePkwtCompensation(9970000, 5);
  assert.strictEqual(pkwtRounding.statutoryCompensationPayout, 4154167);

  // Determinism under repeated invocation
  assert.deepStrictEqual(calculatePkwtCompensation(12000000, 6), calculatePkwtCompensation(12000000, 6));

  console.log("\n✅ All 4 New Deterministic Calculation Engines Passed 100% of Deepened Unit Assertions!");
}

runNewEnginesTests();