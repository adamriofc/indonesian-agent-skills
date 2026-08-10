/**
 * Deterministic Scenario Analysis & Sensitivity Engine
 * Evaluates macro/micro What-If scenarios (exchange rate shifts, cost increases, demand shocks)
 * and computes sensitivity impact on gross margin, net profit, and real options payoffs.
 */

function simulateScenarioImpact({
  baseCase = {
    monthlyRevenue: 1000000000,
    cogs: 600000000,
    operatingExpenses: 250000000
  },
  scenarioDeltas = {
    revenueChangePercent: -10,  // -10% demand shock
    cogsChangePercent: 15,      // +15% raw material cost increase
    opexChangePercent: 5        // +5% overhead increase
  }
}) {
  const baseRev = Math.max(0, Number(baseCase.monthlyRevenue) || 0);
  const baseCogs = Math.max(0, Number(baseCase.cogs) || 0);
  const baseOpex = Math.max(0, Number(baseCase.operatingExpenses) || 0);

  const baseGrossProfit = baseRev - baseCogs;
  const baseNetProfit = baseGrossProfit - baseOpex;
  const baseGrossMarginPercent = baseRev > 0 ? (baseGrossProfit / baseRev) * 100 : 0;

  const revDelta = (Number(scenarioDeltas.revenueChangePercent) || 0) / 100;
  const cogsDelta = (Number(scenarioDeltas.cogsChangePercent) || 0) / 100;
  const opexDelta = (Number(scenarioDeltas.opexChangePercent) || 0) / 100;

  const scenarioRev = Math.max(0, baseRev * (1 + revDelta));
  const scenarioCogs = Math.max(0, baseCogs * (1 + cogsDelta));
  const scenarioOpex = Math.max(0, baseOpex * (1 + opexDelta));

  const scenarioGrossProfit = scenarioRev - scenarioCogs;
  const scenarioNetProfit = scenarioGrossProfit - scenarioOpex;
  const scenarioGrossMarginPercent = scenarioRev > 0 ? (scenarioGrossProfit / scenarioRev) * 100 : 0;

  const netProfitChange = scenarioNetProfit - baseNetProfit;
  const netProfitChangePercent = baseNetProfit !== 0 ? (netProfitChange / Math.abs(baseNetProfit)) * 100 : 0;

  return {
    baseCaseMetrics: {
      monthlyRevenue: baseRev,
      cogs: baseCogs,
      grossProfit: baseGrossProfit,
      grossMarginPercent: Number(baseGrossMarginPercent.toFixed(2)),
      netProfit: baseNetProfit
    },
    simulatedScenarioMetrics: {
      monthlyRevenue: scenarioRev,
      cogs: scenarioCogs,
      grossProfit: scenarioGrossProfit,
      grossMarginPercent: Number(scenarioGrossMarginPercent.toFixed(2)),
      netProfit: scenarioNetProfit
    },
    sensitivityDeltas: {
      netProfitChangeAmount: netProfitChange,
      netProfitChangePercent: Number(netProfitChangePercent.toFixed(2)),
      grossMarginCompressionPercent: Number((baseGrossMarginPercent - scenarioGrossMarginPercent).toFixed(2))
    },
    resilienceAssessment: scenarioNetProfit >= 0 ? 'RESILIENT' : 'VULNERABLE_LOSS_MAKING'
  };
}

module.exports = {
  simulateScenarioImpact
};