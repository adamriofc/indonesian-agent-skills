const assert = require('assert');
const { calculatePPh23And26 } = require('../../engines/pph23-26-calculator');
const { calculateUmkmFinalTax, UMKM_FREE_THRESHOLD_OP } = require('../../engines/umkm-tax-calculator');
const { calculateMarketplaceFee } = require('../../engines/marketplace-fee-calculator');
const { calculatePkwtCompensation } = require('../../engines/pkwt-compensation-calculator');

function runNewEnginesTests() {
  console.log("⚡ Running Math Unit Tests for 4 New Deterministic Engines...\n");

  // 1. PPh 23 & 26 Engine Tests
  console.log("  [1/4] Testing PPh 23 (Service 2%) & PPh 26 (Offshore 20% / Treaty) Engine...");
  const pph23Valid = calculatePPh23And26(10000000, 'service', true);
  assert.strictEqual(pph23Valid.taxWithheld, 200000); // 2% of 10M
  assert.strictEqual(pph23Valid.netAmountReceived, 9800000);

  const pph23NoNpwp = calculatePPh23And26(10000000, 'service', false);
  assert.strictEqual(pph23NoNpwp.taxWithheld, 400000); // 4% penalty rate

  const pph26Treaty = calculatePPh23And26(50000000, 'offshore_service', false, true, 10);
  assert.strictEqual(pph26Treaty.taxWithheld, 5000000); // 10% tax treaty rate

  // 2. UMKM Final Tax 0.5% Engine Tests
  console.log("  [2/4] Testing UMKM Final Tax 0.5% (PP 55/2022) Engine...");
  // Test Individual Taxpayer below 500M threshold
  const umkmIndivExempt = calculateUmkmFinalTax(200000000, 50000000, 'individual');
  assert.strictEqual(umkmIndivExempt.taxableRevenue, 0);
  assert.strictEqual(umkmIndivExempt.finalTaxDue, 0);

  // Test Individual Taxpayer partial threshold crossover
  const umkmCrossover = calculateUmkmFinalTax(480000000, 50000000, 'individual');
  assert.strictEqual(umkmCrossover.taxExemptRevenue, 20000000); // 500M - 480M = 20M exempt
  assert.strictEqual(umkmCrossover.taxableRevenue, 30000000);   // 50M - 20M = 30M taxable
  assert.strictEqual(umkmCrossover.finalTaxDue, 150000);        // 0.5% of 30M = 150K

  // Test Corporate Taxpayer (No 500M exemption)
  const umkmCorp = calculateUmkmFinalTax(100000000, 50000000, 'corporate');
  assert.strictEqual(umkmCorp.taxableRevenue, 50000000);
  assert.strictEqual(umkmCorp.finalTaxDue, 250000); // 0.5% of 50M = 250K

  // 3. Marketplace Admin Fee & Margin Calculator Tests
  console.log("  [3/4] Testing Marketplace Admin Fee & Net Margin Engine...");
  const shopeeStar = calculateMarketplaceFee(100000, 'shopee', 'star', true, 0);
  // Admin fee: 6.0% = 6,000. Gratis Ongkir Extra: 4% = 4,000. Total = 10,000. Net = 90,000.
  assert.strictEqual(shopeeStar.adminFeeAmount, 6000);
  assert.strictEqual(shopeeStar.freeShippingExtraFee, 4000);
  assert.strictEqual(shopeeStar.netSellerPayout, 90000);

  // 4. PKWT Compensation Calculator Tests
  console.log("  [4/4] Testing PKWT Compensation Engine (PP 35/2021)...");
  const pkwtUnderMonth = calculatePkwtCompensation(10000000, 0.5);
  assert.strictEqual(pkwtUnderMonth.isEligible, false);

  const pkwtSixMonths = calculatePkwtCompensation(12000000, 6); // 6/12 * 12M = 6M
  assert.strictEqual(pkwtSixMonths.isEligible, true);
  assert.strictEqual(pkwtSixMonths.statutoryCompensationPayout, 6000000);

  console.log("\n✅ All 4 New Deterministic Calculation Engines Passed 100% of Unit Assertions!");
}

runNewEnginesTests();
