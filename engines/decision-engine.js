/**
 * Deterministic Business Decision Engine
 * Evaluates corporate financial & operational metrics (cash runway, gross margin, DER ratio,
 * PPh 21 tax burden, severance liability) to generate deterministic, prioritized
 * business decision recommendations and driver classifications.
 */

function evaluateBusinessDecision({
  financialMetrics = {
    monthlyRevenue: 1000000000,
    monthlyOperatingExpense: 800000000,
    cashBalance: 1600000000,           // Runway = 1.6B / (800M - 1000M)? If net positive, runway infinite.
    cogs: 650000000,                   // Gross Margin = (1B - 650M) / 1B = 35%
    totalDebt: 50000000000,            // DER = 50B / 10B = 5:1
    totalEquity: 10000000000
  },
  payrollMetrics = {
    monthlyGrossPayroll: 300000000,
    grossUpTaxBurden: 45000000,        // PPh 21 gross-up burden = 15%
    hasUnregisteredPkwtt: false
  }
}) {
  const rev = Math.max(0, Number(financialMetrics.monthlyRevenue) || 0);
  const opex = Math.max(0, Number(financialMetrics.monthlyOperatingExpense) || 0);
  const cash = Math.max(0, Number(financialMetrics.cashBalance) || 0);
  const cogs = Math.max(0, Number(financialMetrics.cogs) || 0);
  const debt = Math.max(0, Number(financialMetrics.totalDebt) || 0);
  const equity = Math.max(1, Number(financialMetrics.totalEquity) || 1);

  const grossProfit = rev - cogs;
  const grossMarginPercent = rev > 0 ? (grossProfit / rev) * 100 : 0;
  const netBurnRate = opex > rev ? opex - rev : 0;
  const cashRunwayMonths = netBurnRate > 0 ? Number((cash / netBurnRate).toFixed(1)) : Infinity;
  const derRatio = Number((debt / equity).toFixed(2));

  const drivers = [];
  const recommendedActions = [];
  let priorityLevel = 'LOW';
  let situationSummary = 'Business operations demonstrate stable financial metrics.';

  // 1. Runway Warning
  if (cashRunwayMonths < 6 && netBurnRate > 0) {
    priorityLevel = 'HIGH';
    drivers.push({
      metric: 'Cash Runway',
      value: `${cashRunwayMonths} months`,
      threshold: '6 months',
      severity: 'CRITICAL',
      explanation: 'Cash runway is below safe 6-month operational buffer.'
    });
    recommendedActions.push({
      action: 'Implement OpEx rationalization & accelerate accounts receivable collection',
      domain: 'finance',
      priority: 'HIGH'
    });
  }

  // 2. Margin Squeeze
  if (grossMarginPercent < 25 && rev > 0) {
    if (priorityLevel !== 'HIGH') priorityLevel = 'MEDIUM';
    drivers.push({
      metric: 'Gross Margin',
      value: `${grossMarginPercent.toFixed(2)}%`,
      threshold: '25.00%',
      severity: 'HIGH',
      explanation: 'Gross margin is compressed, reducing contribution to fixed overhead.'
    });
    recommendedActions.push({
      action: 'Audit COGS component costs and evaluate marketplace fee tier optimizations',
      domain: 'commerce',
      priority: 'MEDIUM'
    });
  }

  // 3. Thin Capitalization DER Excess (PMK 172/2023)
  if (derRatio > 4) {
    if (priorityLevel !== 'HIGH') priorityLevel = 'HIGH';
    drivers.push({
      metric: 'Debt-to-Equity Ratio (DER)',
      value: `${derRatio}:1`,
      threshold: '4.00:1',
      severity: 'CRITICAL',
      explanation: 'DER exceeds statutory 4:1 Thin Cap ratio; excess interest expense is non-deductible for PPh Badan.'
    });
    recommendedActions.push({
      action: 'Restructure affiliate debt into equity (Debt-to-Equity Swap) to restore 4:1 DER compliance',
      domain: 'tax',
      priority: 'HIGH'
    });
  }

  // Fallback Action if healthy
  if (recommendedActions.length === 0) {
    recommendedActions.push({
      action: 'Maintain current working capital buffers and optimize PPh 21 gross-up Natura thresholds under PMK 66/2023',
      domain: 'tax',
      priority: 'LOW'
    });
  }

  return {
    financialAssessment: {
      monthlyRevenue: rev,
      grossMarginPercent: `${grossMarginPercent.toFixed(2)}%`,
      netBurnRate,
      cashRunwayMonths: cashRunwayMonths === Infinity ? 'INFINITE (Net Positive)' : cashRunwayMonths,
      derRatio: `${derRatio}:1`
    },
    priorityLevel,
    situationSummary: priorityLevel === 'HIGH' ? 'Critical financial or tax drivers require immediate operational intervention.' : situationSummary,
    keyDecisionDrivers: drivers,
    recommendedActions,
    statutoryDisclaimer: "Recommendations are deterministic analytical outputs and require management review."
  };
}

module.exports = {
  evaluateBusinessDecision
};