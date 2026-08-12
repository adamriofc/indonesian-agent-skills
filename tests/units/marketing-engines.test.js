const assert = require('assert');
const { calculateMarketSizing } = require('../../engines/market-sizing-engine');
const { calculateMarketingUnitEconomics } = require('../../engines/marketing-unit-economics');

function runMarketingEnginesTests() {
  console.log("⚡ Running Math Unit & Logic Tests for 2 Marketing Intelligence Engines...\n");

  // 1. Market Sizing Engine (TAM / SAM / SOM)
  console.log("  [1/2] Market Sizing Engine (calculateMarketSizing)...");
  const sizingRes = calculateMarketSizing({
    totalPopulationOrEntities: 270000000,
    targetCategoryAdoptionPercent: 10, // 27M addressable customers
    averageAnnualSpendingPerCustomer: 1000000,
    serviceableGeographicFraction: 0.50, // 13.5M SAM customers
    targetObtainableSharePercent: 10 // 1.35M SOM customers
  });
  assert.strictEqual(sizingRes.results.totalAddressableCustomers, 27000000);
  assert.strictEqual(sizingRes.results.tamAmount, 27000000000000);
  assert.strictEqual(sizingRes.results.samAmount, 13500000000000);
  assert.strictEqual(sizingRes.results.somAmount, 1350000000000);

  // 2. Marketing Unit Economics Engine (LTV / CAC / ROAS)
  console.log("  [2/2] Marketing Unit Economics Engine (calculateMarketingUnitEconomics)...");
  const unitEcon = calculateMarketingUnitEconomics({
    totalMarketingAndSalesCost: 50000000,
    newCustomersAcquired: 250, // CAC = 200.000
    averageOrderValue: 500000,
    annualPurchaseFrequency: 4,
    grossMarginPercent: 40,
    customerLifespanYears: 3, // LTV = 500k * 4 * 0.4 * 3 = 2.400.000
    adSpendBudget: 30000000,
    campaignRevenueGenerated: 120000000 // ROAS = 4.0x
  });
  assert.strictEqual(unitEcon.cac, 200000);
  assert.strictEqual(unitEcon.ltv, 2400000);
  assert.strictEqual(unitEcon.ltvCacRatio, '12x');
  assert.strictEqual(unitEcon.roas, '4x');
  assert.strictEqual(unitEcon.healthStatus, 'HEALTHY');

  console.log("\n✅ All 2 Marketing Intelligence Engines Passed 100% of Assertions!");
}

runMarketingEnginesTests();