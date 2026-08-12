/**
 * Marketing Unit Economics & LTV:CAC Engine
 * Calculates Customer Acquisition Cost (CAC), Customer Lifetime Value (LTV),
 * LTV:CAC Ratio, CAC Payback Period, and Return on Ad Spend (ROAS).
 */

function calculateMarketingUnitEconomics({
  totalMarketingAndSalesCost = 50000000,
  newCustomersAcquired = 250,
  averageOrderValue = 500000,
  annualPurchaseFrequency = 4,
  grossMarginPercent = 40,
  customerLifespanYears = 3,
  adSpendBudget = 30000000,
  campaignRevenueGenerated = 120000000
}) {
  const mktgCost = Math.max(0, Number(totalMarketingAndSalesCost) || 0);
  const customers = Math.max(1, Number(newCustomersAcquired) || 1);
  const aov = Math.max(0, Number(averageOrderValue) || 0);
  const freq = Math.max(0, Number(annualPurchaseFrequency) || 0);
  const margin = Math.max(0, Math.min(100, Number(grossMarginPercent) || 0)) / 100;
  const lifespan = Math.max(0, Number(customerLifespanYears) || 0);
  const adSpend = Math.max(0, Number(adSpendBudget) || 0);
  const campRev = Math.max(0, Number(campaignRevenueGenerated) || 0);

  // 1. CAC Calculation
  const cac = Math.round(mktgCost / customers);

  // 2. LTV Calculation
  const annualGrossProfitPerCustomer = aov * freq * margin;
  const ltv = Math.round(annualGrossProfitPerCustomer * lifespan);

  // 3. LTV:CAC Ratio
  const ltvCacRatio = cac > 0 ? Number((ltv / cac).toFixed(2)) : 0;

  // 4. CAC Payback Period (Months)
  const monthlyGrossProfitPerCustomer = annualGrossProfitPerCustomer / 12;
  const paybackMonths = monthlyGrossProfitPerCustomer > 0 ? Number((cac / monthlyGrossProfitPerCustomer).toFixed(1)) : Infinity;

  // 5. ROAS Calculation
  const roas = adSpend > 0 ? Number((campRev / adSpend).toFixed(2)) : 0;

  let healthStatus = 'HEALTHY';
  if (ltvCacRatio < 1.0) healthStatus = 'CRITICAL_UNECONOMIC';
  else if (ltvCacRatio < 3.0) healthStatus = 'MODERATE_SUBOPTIMAL';

  return {
    cac,
    ltv,
    ltvCacRatio: `${ltvCacRatio}x`,
    paybackMonths: paybackMonths === Infinity ? 'INFINITE' : `${paybackMonths} months`,
    roas: `${roas}x`,
    healthStatus,
    benchmarkNote: "Healthy SaaS/D2C unit economics target LTV:CAC >= 3.0x and Payback < 12 months."
  };
}

module.exports = {
  calculateMarketingUnitEconomics
};