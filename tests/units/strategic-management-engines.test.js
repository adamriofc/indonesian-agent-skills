const assert = require('assert');
const { evaluateBcgMatrix, evaluateGeMckinseyMatrix } = require('../../engines/strategic-framework-engine');
const { evaluateStrategicDecisionAlternatives } = require('../../engines/decision-analysis-engine');
const { simulateScenarioImpact } = require('../../engines/scenario-analysis-engine');
const { evaluateStrategicRisks } = require('../../engines/strategic-risk-engine');
const { resolveBusinessArchetype } = require('../../engines/kbli-context-router');

function runStrategicManagementEnginesTests() {
  console.log("⚡ Running Math Unit & Logic Tests for 5 Strategic Management & KBLI Engines...\n");

  // 1. BCG & GE-McKinsey Framework Engine (with configurable thresholds & 3x3 bands)
  console.log("  [1/5] Strategic Framework Engine (BCG & GE-McKinsey)...");
  const bcgStar = evaluateBcgMatrix({ unitName: 'Fintech Unit', marketGrowthRatePercent: 15, relativeMarketShare: 1.5 });
  assert.strictEqual(bcgStar.category, 'STAR');
  assert.strictEqual(bcgStar.appliedThresholds.highGrowthThresholdPercent, 10);

  const bcgCustomThresh = evaluateBcgMatrix({ unitName: 'Niche Tech', marketGrowthRatePercent: 8, relativeMarketShare: 1.2, highGrowthThresholdPercent: 7 });
  assert.strictEqual(bcgCustomThresh.category, 'STAR');

  const geRes = evaluateGeMckinseyMatrix({ unitName: 'Unit B', industryAttractivenessScore: 8, businessUnitStrengthScore: 8 });
  assert.strictEqual(geRes.matrixCell, 'PROTECT_BUILD_LEADERSHIP');
  assert.strictEqual(geRes.bands.cellCoordinate, 'HIGH_HIGH');

  // 2. Decision Analysis Engine (MCDA with Cost vs Benefit Normalization)
  console.log("  [2/5] Decision Analysis Engine (MCDA with Cost Normalization)...");
  const mcdaRes = evaluateStrategicDecisionAlternatives({
    decisionTitle: 'Acquisition Target Evaluation',
    criteriaConfig: {
      strategicFit: { weight: 0.5, direction: 'benefit' },
      financialCost: { weight: 0.5, direction: 'cost' } // lower cost (2/10) -> effective score 8/10
    },
    alternatives: [
      { optionName: 'Target A (Cheap)', scores: { strategicFit: 8, financialCost: 2 } },     // (8*0.5)+((10-2)*0.5) = 4 + 4 = 8.0
      { optionName: 'Target B (Expensive)', scores: { strategicFit: 8, financialCost: 8 } } // (8*0.5)+((10-8)*0.5) = 4 + 1 = 5.0
    ]
  });
  assert.strictEqual(mcdaRes.topRecommendedOption, 'Target A (Cheap)');
  assert.strictEqual(mcdaRes.rankedOptions[0].compositeWeightedScore, 8.0);
  assert.strictEqual(mcdaRes.rankedOptions[1].compositeWeightedScore, 5.0);

  // 3. Scenario Analysis Engine
  console.log("  [3/5] Scenario Analysis Engine (Simulate Scenario)...");
  const scenarioRes = simulateScenarioImpact({
    baseCase: { monthlyRevenue: 1000000000, cogs: 600000000, operatingExpenses: 200000000 },
    scenarioDeltas: { revenueChangePercent: -20, cogsChangePercent: 10, opexChangePercent: 0 }
  });
  assert.strictEqual(scenarioRes.baseCaseMetrics.netProfit, 200000000);
  assert.strictEqual(scenarioRes.simulatedScenarioMetrics.netProfit, -60000000);

  // 4. Strategic Risk Engine
  console.log("  [4/5] Strategic Risk Engine (evaluateStrategicRisks)...");
  const riskRes = evaluateStrategicRisks({
    risks: [
      { riskTitle: 'Critical Supply Spike', likelihoodScore: 5, impactScore: 5, velocityScore: 5 },
      { riskTitle: 'Minor Tech Delay', likelihoodScore: 2, impactScore: 2, velocityScore: 2 }
    ]
  });
  assert.strictEqual(riskRes.overallRiskTier, 'CRITICAL');

  // 5. KBLI Context Router & Strategic Protocol Engine
  console.log("  [5/5] KBLI Context Router & Strategic Protocol Engine...");
  const { applyStrategicProtocol } = require('../../engines/strategic-protocol');
  const protoRes = applyStrategicProtocol({ frameworkName: 'bcg-matrix', kbliCode: '70209', activityName: 'Konsultasi Manajemen' });
  assert.strictEqual(protoRes.businessContext.businessArchetype, 'PROFESSIONAL_SERVICE');
  assert.strictEqual(protoRes.applicability.status, 'ADAPTABLE');
  assert.strictEqual(protoRes.applicability.isApplicable, true);

  const profService = resolveBusinessArchetype({ kbliCode: '70209', activityName: 'Konsultasi Manajemen' });
  assert.strictEqual(profService.businessArchetype, 'PROFESSIONAL_SERVICE');
  assert.strictEqual(profService.archetypeCharacteristics.hasPhysicalInventory, false);

  const mfg = resolveBusinessArchetype({ kbliCode: '10710', activityName: 'Industri Makanan' });
  assert.strictEqual(mfg.businessArchetype, 'PRODUCT_MANUFACTURING');
  assert.strictEqual(mfg.archetypeCharacteristics.hasPhysicalInventory, true);

  console.log("\n✅ All 5 Strategic Management & KBLI Engines Passed 100% of Assertions!");
}

runStrategicManagementEnginesTests();