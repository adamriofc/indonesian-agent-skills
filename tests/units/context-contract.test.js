const assert = require('assert');
const { createDefaultBusinessContext, validateBusinessContext } = require('../../engines/context-contract');
const { checkFrameworkApplicability } = require('../../engines/framework-applicability');

function runContextContractTests() {
  console.log("⚡ Running Standard Context Contract & Framework Applicability Unit Tests...\n");

  // 1. Standard Business Context Creation
  console.log("  [1/3] Testing Business Context Creation & Default Defaults...");
  const ctx = createDefaultBusinessContext({
    entity: { type: 'PT', kbli: '70209' },
    scale: { annualRevenue: 5000000000, employeeCount: 15 }
  });
  assert.strictEqual(ctx.schemaVersion, '2.0.0');
  assert.strictEqual(ctx.businessArchetype, 'PROFESSIONAL_SERVICE');
  assert.strictEqual(ctx.scale.annualRevenue, 5000000000);

  // 2. Missing Parameter Detection & Assumption Registry
  console.log("  [2/3] Testing Missing Information Protocol & Assumption Registry (Strict vs Demo)...");
  const strictRes = validateBusinessContext({ scale: { annualRevenue: 1000000000 } }, 'STRICT_PRODUCTION_MODE');
  assert.strictEqual(strictRes.isComplete, false);
  assert.strictEqual(strictRes.contextStatus, 'INSUFFICIENT_CONTEXT');
  assert.ok(strictRes.missingParameters.includes('entity.type'));

  const demoRes = validateBusinessContext({ scale: { annualRevenue: 1000000000 } }, 'DEMO_MODE');
  assert.strictEqual(demoRes.contextStatus, 'DEMO_CONTEXT_WITH_ASSUMPTIONS');
  assert.ok(demoRes.assumptionRegistry.length > 0);

  // 3. Framework Applicability & Unit of Analysis Matrix
  console.log("  [3/3] Testing Framework Applicability & Unit of Analysis Matrix...");
  const bcgProf = checkFrameworkApplicability({ frameworkName: 'bcg-matrix', kbliCode: '70209' });
  assert.strictEqual(bcgProf.applicabilityStatus, 'ADAPTABLE');
  assert.strictEqual(bcgProf.unitOfAnalysis, 'PRACTICE_AREA_OR_SERVICE_LINE');

  const bcgMfg = checkFrameworkApplicability({ frameworkName: 'bcg-matrix', kbliCode: '10710' });
  assert.strictEqual(bcgMfg.applicabilityStatus, 'NATIVE');
  assert.strictEqual(bcgMfg.unitOfAnalysis, 'PHYSICAL_SKU_OR_PRODUCT_LINE');

  console.log("\n✅ Context Contract & Framework Applicability Unit Tests Passed 100%!");
}

runContextContractTests();