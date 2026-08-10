const assert = require('assert');
const { evaluateBcgMatrix, evaluateGeMckinseyMatrix } = require('../../engines/strategic-framework-engine');
const { evaluateStrategicDecisionAlternatives } = require('../../engines/decision-analysis-engine');
const { simulateScenarioImpact } = require('../../engines/scenario-analysis-engine');
const { evaluateStrategicRisks } = require('../../engines/strategic-risk-engine');

function runStrategicManagementEnginesTests() {
  console.log("⚡ Running Math Unit & Logic Tests for 4 Strategic Management Engines...\n");

  // 1. BCG & GE-McKinsey Framework Engine
  console.log("  [1/4] Strategic Framework Engine (BCG & GE-McKinsey)...");
  const bcgStar = evaluateBcgMatrix({ unitName: 'Fintech Unit', marketGrowthRatePercent: 15, relativeMarketShare: 1.5 });
  assert.strictEqual(bcgStar.category, 'STAR');
  assert.strictEqual(bcgStar.capitalAllocationPriority, 'HIGH_INVESTMENT');

  const bcgCow = evaluateBcgMatrix({ unitName: 'Legacy Unit', marketGrowthRatePercent: 5, relativeMarketShare: 1.2 });
  assert.strictEqual(bcgCow.category, 'CASH_COW');

  const geRes = evaluateGeMckinseyMatrix({ unitName: 'Unit B', industryAttractivenessScore: 8, businessUnitStrengthScore: 8 });
  assert.strictEqual(geRes.matrixCell, 'PROTECT_BUILD_LEADERSHIP');

  // 2. Decision Analysis Engine (MCDA)
  console.log("  [2/4] Decision Analysis Engine (MCDA)...");
  const mcdaRes = evaluateStrategicDecisionAlternatives({
    decisionTitle: 'Acquisition Target Evaluation',
    criteriaWeights: { fit: 0.5, roi: 0.5 },
    alternatives: [
      { optionName: 'Target A', scores: { fit: 8, roi: 6 } }, // (8*0.5)+(6*0.5) = 7.0
      { optionName: 'Target B', scores: { fit: 9, roi: 9 } }  // (9*0.5)+(9*0.5) = 9.0
    ]
  });
  assert.strictEqual(mcdaRes.topRecommendedOption, 'Target B');
  assert.strictEqual(mcdaRes.rankedOptions[0].compositeWeightedScore, 9.0);

  // 3. Scenario Analysis Engine
  console.log("  [3/4] Scenario Analysis Engine (Simulate Scenario)...");
  const scenarioRes = simulateScenarioImpact({
    baseCase: { monthlyRevenue: 1000000000, cogs: 600000000, operatingExpenses: 200000000 },
    scenarioDeltas: { revenueChangePercent: -20, cogsChangePercent: 10, opexChangePercent: 0 }
  });
  assert.strictEqual(scenarioRes.baseCaseMetrics.netProfit, 200000000);
  assert.strictEqual(scenarioRes.simulatedScenarioMetrics.monthlyRevenue, 800000000);
  assert.strictEqual(scenarioRes.simulatedScenarioMetrics.cogs, 660000000);
  assert.strictEqual(scenarioRes.simulatedScenarioMetrics.netProfit, -60000000); // 800M - 660M - 200M = -60M
  assert.strictEqual(scenarioRes.resilienceAssessment, 'VULNERABLE_LOSS_MAKING');

  // 4. Strategic Risk Engine
  console.log("  [4/4] Strategic Risk Engine (evaluateStrategicRisks)...");
  const riskRes = evaluateStrategicRisks({
    risks: [
      { riskTitle: 'Critical Supply Spike', likelihoodScore: 5, impactScore: 5, velocityScore: 5 },
      { riskTitle: 'Minor Tech Delay', likelihoodScore: 2, impactScore: 2, velocityScore: 2 }
    ]
  });
  assert.strictEqual(riskRes.overallRiskTier, 'CRITICAL');
  assert.strictEqual(riskRes.criticalRisksCount, 1);
  assert.strictEqual(riskRes.evaluatedRisks[0].riskTitle, 'Critical Supply Spike');

  console.log("\n✅ All 4 Strategic Management Engines Passed 100% of Assertions!");
}

runStrategicManagementEnginesTests();