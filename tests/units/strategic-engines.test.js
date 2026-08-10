const assert = require('assert');
const { analyzeRegulatoryImpact } = require('../../engines/regulatory-impact-engine');
const { auditComplianceRisk } = require('../../engines/compliance-risk-engine');
const { evaluateBusinessScenario } = require('../../engines/business-scenario-engine');
const { evaluateBusinessDecision } = require('../../engines/decision-engine');

function runStrategicEnginesTests() {
  console.log("⚡ Running Math Unit & Logic Tests for 4 Cross-Domain Strategic Intelligence Engines...\n");

  // ------------------------------------------------------
  // 1. Regulatory Change Intelligence Engine
  // ------------------------------------------------------
  console.log("  [1/4] Regulatory Change Intelligence Engine (analyzeRegulatoryImpact)...");
  const regImpCorp = analyzeRegulatoryImpact({
    domain: 'umkm',
    fromRuleset: 'UMKM-2022',
    toRuleset: 'UMKM-2026',
    companyProfile: { entityType: 'corporate', annualRevenue: 5000000000, employeeCount: 15 }
  });
  assert.strictEqual(regImpCorp.impactLevel, 'HIGH');
  assert.strictEqual(regImpCorp.actionChecklist.length, 3);
  assert.ok(regImpCorp.affectedDomains.includes('tax'));

  const regImpOp = analyzeRegulatoryImpact({
    domain: 'umkm',
    fromRuleset: 'UMKM-2022',
    toRuleset: 'UMKM-2026',
    companyProfile: { entityType: 'individual', annualRevenue: 200000000, employeeCount: 2 }
  });
  assert.strictEqual(regImpOp.impactLevel, 'MEDIUM');

  // ------------------------------------------------------
  // 2. Compliance Risk Engine
  // ------------------------------------------------------
  console.log("  [2/4] Compliance Risk Engine (auditComplianceRisk)...");
  const compRisk = auditComplianceRisk({
    companyProfile: { entityType: 'pt', hasNib: true, hasNpwp: true, employeeCount: 20 },
    taxPractices: { isCorpUsingUmkmPost2026: true, hasLateMonthlyPph21: false },
    hrPractices: { hasPkwtProbation: true, overtimeExceedsLimit: false, hasWageScaleStructure: false },
    legalPractices: { article1266WaivedInContracts: false },
    pdpPractices: { collectsCustomerPii: true, hasDpaAddendum: false }
  });
  assert.strictEqual(compRisk.complianceHealthScore, 15); // 100 - 25 - 20 - 15 - 10 - 15 = 15
  assert.strictEqual(compRisk.overallAssessment, 'HIGH_RISK');
  assert.strictEqual(compRisk.domainHealth.tax, '🔴 CRITICAL');
  assert.strictEqual(compRisk.detectedViolations.length, 5);

  // Clean compliant company
  const cleanComp = auditComplianceRisk({
    companyProfile: { entityType: 'pt', hasNib: true, hasNpwp: true, employeeCount: 5 },
    taxPractices: { isCorpUsingUmkmPost2026: false },
    hrPractices: { hasPkwtProbation: false, overtimeExceedsLimit: false, hasWageScaleStructure: true },
    legalPractices: { article1266WaivedInContracts: true },
    pdpPractices: { collectsCustomerPii: false }
  });
  assert.strictEqual(cleanComp.complianceHealthScore, 100);
  assert.strictEqual(cleanComp.overallAssessment, 'HEALTHY');

  // ------------------------------------------------------
  // 3. Business Scenario Engine
  // ------------------------------------------------------
  console.log("  [3/4] Business Scenario Engine (evaluateBusinessScenario)...");
  const scenarioRes = evaluateBusinessScenario({
    companyProfile: {
      entityType: 'pt',
      annualRevenue: 5000000000,
      employeeCount: 15,
      salesChannels: ['marketplace', 'b2b_direct']
    }
  });
  assert.strictEqual(scenarioRes.totalLifecycleStages, 8);
  assert.strictEqual(scenarioRes.recommendedRegime, 'GENERAL_CORPORATE_TAX');
  assert.strictEqual(scenarioRes.lifecycleStages[0].stageName, 'Incorporation & OSS-RBA Licensing');

  // ------------------------------------------------------
  // 4. Decision Engine
  // ------------------------------------------------------
  console.log("  [4/4] Decision Engine (evaluateBusinessDecision)...");
  const decisionRes = evaluateBusinessDecision({
    financialMetrics: {
      monthlyRevenue: 500000000,
      monthlyOperatingExpense: 800000000,
      cashBalance: 1200000000, // Runway = 1.2B / 300M = 4 months (< 6 months)
      cogs: 400000000,          // Margin = (500M - 400M)/500M = 20% (< 25%)
      totalDebt: 50000000000,   // DER = 5:1 (> 4:1)
      totalEquity: 10000000000
    }
  });
  assert.strictEqual(decisionRes.priorityLevel, 'HIGH');
  assert.strictEqual(decisionRes.keyDecisionDrivers.length, 3);
  assert.strictEqual(decisionRes.financialAssessment.cashRunwayMonths, 4);
  assert.strictEqual(decisionRes.financialAssessment.derRatio, '5:1');

  console.log("\n✅ All 4 Cross-Domain Strategic Intelligence Engines Passed 100% of Assertions!");
}

runStrategicEnginesTests();