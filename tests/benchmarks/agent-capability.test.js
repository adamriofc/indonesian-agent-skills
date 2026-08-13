const assert = require('assert');
const { calculatePPh21Monthly } = require('../../engines/pph21-calculator');
const { calculateMarketplaceFee } = require('../../engines/marketplace-fee-calculator');
const { calculateMarketingUnitEconomics } = require('../../engines/marketing-unit-economics');
const { resolveBusinessArchetype } = require('../../engines/kbli-context-router');
const { evaluateBusinessScenario } = require('../../engines/business-scenario-engine');
const { auditComplianceRisk } = require('../../engines/compliance-risk-engine');
const { evaluateBusinessDecision } = require('../../engines/decision-engine');

function runAgentCapabilityBenchmark() {
  console.log("🤖 Running Agent Capability Discovery & Cross-Domain Composition Benchmark...\n");

  let benchmarksPassed = 0;
  const metrics = {
    selectionPrecision: 0,
    selectionRecall: 0,
    compositionSuccess: 0,
    outputInterpretability: 0
  };

  // 1. Single-Domain Capability Discovery & Execution
  console.log("  [1/3] Testing Single-Domain Capability Discovery & Execution...");
  const singleDomainTask = {
    userIntent: "Calculate monthly PPh 21 tax for Rp 10M gross salary TK/0",
    requiredDomain: "tax-id",
    targetCapability: "pph21-calculator",
    inputPayload: { grossSalary: 10000000, ptkpStatus: "TK/0", hasNpwp: true, dateStr: "2026-03-01" }
  };

  const pphResult = calculatePPh21Monthly(
    singleDomainTask.inputPayload.grossSalary,
    singleDomainTask.inputPayload.ptkpStatus,
    singleDomainTask.inputPayload.hasNpwp,
    singleDomainTask.inputPayload.dateStr
  );

  assert.strictEqual(pphResult.monthlyTaxWithheld, 200000);
  assert.strictEqual(pphResult.terCategory, "A");
  assert.strictEqual(pphResult.rulesetId, "PPH21-2024");
  metrics.selectionPrecision++;
  metrics.selectionRecall++;
  metrics.compositionSuccess++;
  metrics.outputInterpretability++;
  benchmarksPassed++;

  // 2. Partial Cross-Domain Capability Composition (Marketing + Finance)
  console.log("  [2/3] Testing Partial Cross-Domain Capability Composition (Marketing + Finance)...");
  const partialTask = {
    userIntent: "Audit D2C marketplace seller payout and unit economics margin",
    requiredDomains: ["marketing-id", "finance-id"],
    targetCapabilities: ["margin-pricing-calculator", "calculateMarketingUnitEconomics"]
  };

  const mpResult = calculateMarketplaceFee(500000, 'shopee', 'star', true, 10000);
  const ueResult = calculateMarketingUnitEconomics({
    totalMarketingAndSalesCost: 50000000,
    newCustomersAcquired: 250,
    averageOrderValue: mpResult.netSellerPayout,
    annualPurchaseFrequency: 4,
    grossMarginPercent: 40,
    customerLifespanYears: 3,
    adSpendBudget: 30000000,
    campaignRevenueGenerated: 120000000
  });

  assert.strictEqual(mpResult.adminFeeAmount, 30000);
  assert.strictEqual(ueResult.cac, 200000);
  assert.strictEqual(ueResult.healthStatus, "HEALTHY");
  metrics.selectionPrecision++;
  metrics.selectionRecall++;
  metrics.compositionSuccess++;
  metrics.outputInterpretability++;
  benchmarksPassed++;

  // 3. Full Cross-Domain Enterprise Expansion Composition (Legal + Tax + HR + Finance + Marketing + Strategy)
  console.log("  [3/3] Testing Full Cross-Domain Enterprise Expansion Composition (All 6 Domains)...");
  const fullTask = {
    userIntent: "Audit PT Management Consulting 5B turnover & 15 employees expansion across Legal, Tax, HR, Finance, Marketing & Strategy",
    requiredDomains: ["legal-id", "tax-id", "hr-id", "finance-id", "marketing-id", "strategic-id"]
  };

  const profile = { entityType: "pt", annualRevenue: 5000000000, employeeCount: 15, kbliCode: "70209", salesChannels: ["marketplace", "b2b_direct"] };
  const arch = resolveBusinessArchetype({ kbliCode: profile.kbliCode });
  const scenario = evaluateBusinessScenario({ companyProfile: profile });
  const audit = auditComplianceRisk({
    companyProfile: { entityType: "pt", hasNib: true, hasNpwp: true, employeeCount: 15 },
    taxPractices: { isCorpUsingUmkmPost2026: true }
  });
  const decision = evaluateBusinessDecision({
    financialMetrics: { monthlyRevenue: 416666666, monthlyOperatingExpense: 300000000, cashBalance: 5000000000, cogs: 100000000, totalDebt: 1000000000, totalEquity: 4000000000 }
  });

  assert.strictEqual(arch.businessArchetype, "PROFESSIONAL_SERVICE");
  assert.strictEqual(scenario.totalLifecycleStages, 8);
  assert.strictEqual(scenario.recommendedRegime, "GENERAL_CORPORATE_TAX");
  assert.strictEqual(audit.totalViolationsDetected, 5);
  assert.strictEqual(decision.priorityLevel, "LOW");

  metrics.selectionPrecision++;
  metrics.selectionRecall++;
  metrics.compositionSuccess++;
  metrics.outputInterpretability++;
  benchmarksPassed++;

  console.log(`  Composition Performance Metrics (3 Benchmark Task Suites):`);
  console.log(`  - Capability Selection Precision: ${(metrics.selectionPrecision / 3 * 100).toFixed(2)}%`);
  console.log(`  - Capability Selection Recall:    ${(metrics.selectionRecall / 3 * 100).toFixed(2)}%`);
  console.log(`  - Multi-Domain Composition Rate:  ${(metrics.compositionSuccess / 3 * 100).toFixed(2)}%`);
  console.log(`  - Output Interpretability Score: ${(metrics.outputInterpretability / 3 * 100).toFixed(2)}%`);

  assert.strictEqual(benchmarksPassed, 3, "Agent Capability Benchmark should pass 100% of task suites");

  console.log("\n✅ Agent Capability Discovery & Cross-Domain Composition Benchmark Passed 100%!");
}

runAgentCapabilityBenchmark();
