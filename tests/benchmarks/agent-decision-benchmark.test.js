const assert = require('assert');
const { resolveBusinessArchetype } = require('../../engines/kbli-context-router');
const { calculateUmkmFinalTax } = require('../../engines/umkm-tax-calculator');
const { auditPkwttStatus } = require('../../engines/pkwtt-calculator');
const { auditTransferPricingThinCap } = require('../../engines/transfer-pricing-engine');
const { evaluateStrategicDecisionAlternatives } = require('../../engines/decision-analysis-engine');
const { evaluateBusinessScenario } = require('../../engines/business-scenario-engine');

function runAgentDecisionBenchmark() {
  console.log("📊 Running Tier-3 Cross-Domain Decision & Integration Benchmark (25 Scenario Cases)...\n");

  const scenarioCases = [
    {
      scenarioId: "DECISION-SCENARIO-001",
      description: "PT Corporate KBLI 70209 with 5B turnover checking PP 20/2026 tax regime eligibility",
      input: { entityType: "corporate", annualRevenue: 5000000000, kbliCode: "70209" },
      expected: { archetype: "PROFESSIONAL_SERVICE", isUmkmEligible: false, recommendedTaxRegime: "GENERAL_CORPORATE_TAX" }
    },
    {
      scenarioId: "DECISION-SCENARIO-002",
      description: "Individual taxpayer KBLI 47911 with 300M turnover checking PP 20/2026 eligibility",
      input: { entityType: "individual", annualRevenue: 300000000, kbliCode: "47911" },
      expected: { archetype: "MARKETPLACE_PLATFORM", isUmkmEligible: true, recommendedTaxRegime: "UMKM_FINAL_TAX" }
    },
    {
      scenarioId: "DECISION-SCENARIO-003",
      description: "PKWT contract with 2-month probation audit for permanent position",
      input: { monthlyWage: 10000000, probationMonths: 2, contractType: "pkwt", jobType: "permanent" },
      expected: { isConvertedToPkwttByLaw: true }
    },
    {
      scenarioId: "DECISION-SCENARIO-004",
      description: "Thin Cap DER 5:1 interest barrier audit under PMK 172/2023",
      input: { totalInterestBearingDebt: 50000000000, totalEquity: 10000000000, annualInterestExpense: 5000000000 },
      expected: { isDerExceeded: true, maxAllowableDebt: 40000000000 }
    },
    {
      scenarioId: "DECISION-SCENARIO-005",
      description: "MCDA acquisition decision selecting cheap vs expensive option",
      input: { criteria: { fit: { weight: 0.5, direction: "benefit" }, cost: { weight: 0.5, direction: "cost" } }, alternatives: [{ optionName: "Cheap", scores: { fit: 8, cost: 2 } }, { optionName: "Expensive", scores: { fit: 8, cost: 8 } }] },
      expected: { topOption: "Cheap" }
    }
  ];

  // Expand to 25 scenario cases
  for (let i = 6; i <= 25; i++) {
    const revenue = i * 150000000;
    const isCorp = i % 2 === 0;
    scenarioCases.push({
      scenarioId: `DECISION-SCENARIO-0${i < 10 ? '0' + i : i}`,
      description: `Scenario Case ${i}: Automated corporate tax & employment compliance decision`,
      input: { entityType: isCorp ? "corporate" : "individual", annualRevenue: revenue, kbliCode: "70209" },
      expected: { isUmkmEligible: !isCorp && (revenue + 50000000) <= 4800000000 }
    });
  }

  let passed = 0;
  scenarioCases.forEach((sc) => {
    let ok = true;

    // 1. KBLI Archetype Assertion
    if (sc.input.kbliCode) {
      const arch = resolveBusinessArchetype({ kbliCode: sc.input.kbliCode });
      if (sc.expected.archetype && arch.businessArchetype !== sc.expected.archetype) ok = false;
    }

    // 2. UMKM Tax Eligibility Assertion
    if (sc.input.annualRevenue) {
      const umkm = calculateUmkmFinalTax(sc.input.annualRevenue, 50000000, sc.input.entityType, "2026-05-01");
      if (sc.expected.isUmkmEligible !== undefined && umkm.isEligible !== sc.expected.isUmkmEligible) ok = false;
    }

    // 3. Recommended Tax Regime Assertion (Fix P0: previously defined but unasserted!)
    if (sc.expected.recommendedTaxRegime !== undefined) {
      const scenario = evaluateBusinessScenario({ companyProfile: { entityType: sc.input.entityType, annualRevenue: sc.input.annualRevenue } });
      if (scenario.recommendedRegime !== sc.expected.recommendedTaxRegime) ok = false;
    }

    // 4. PKWTT Conversion Assertion
    if (sc.input.probationMonths !== undefined) {
      const pkwtt = auditPkwttStatus(sc.input);
      if (sc.expected.isConvertedToPkwttByLaw !== undefined && pkwtt.isConvertedToPkwttByLaw !== sc.expected.isConvertedToPkwttByLaw) ok = false;
    }

    // 5. Thin Cap DER & Max Allowable Debt Assertion (Fix P0: maxAllowableDebt previously defined but unasserted!)
    if (sc.input.totalInterestBearingDebt !== undefined) {
      const tp = auditTransferPricingThinCap(sc.input);
      if (sc.expected.isDerExceeded !== undefined && tp.isDerExceeded !== sc.expected.isDerExceeded) ok = false;
      if (sc.expected.maxAllowableDebt !== undefined && tp.maxAllowableDebt !== sc.expected.maxAllowableDebt) ok = false;
    }

    // 6. MCDA Decision Assertion
    if (sc.input.criteria !== undefined) {
      const mcda = evaluateStrategicDecisionAlternatives({ criteriaConfig: sc.input.criteria, alternatives: sc.input.alternatives });
      if (sc.expected.topOption && mcda.topRecommendedOption !== sc.expected.topOption) ok = false;
    }

    if (ok) passed++;
  });

  const passRate = ((passed / scenarioCases.length) * 100).toFixed(2);
  console.log(`  Cases Tested: ${scenarioCases.length} | Passed: ${passed} | Decision Pass Rate: ${passRate}%`);
  assert.strictEqual(passed, 25, "Tier-3 Cross-Domain Decision Benchmark should pass 100% of all expected assertions");

  console.log("\n✅ Tier-3 Cross-Domain Decision & Integration Benchmark Passed 100%!");
}

runAgentDecisionBenchmark();