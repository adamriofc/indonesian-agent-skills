const assert = require('assert');
const { createDefaultBusinessContext, validateBusinessContext } = require('../../engines/context-contract');
const { checkFrameworkApplicability } = require('../../engines/framework-applicability');
const { resolveStatutoryConflict } = require('../../engines/conflict-resolution');
const { classifyFailure } = require('../../engines/failure-taxonomy');

function runContextContractTests() {
  console.log("⚡ Running Standard Context Contract, Conflict Resolution & Failure Taxonomy Unit Tests...\n");

  // 1. Standard Business Context Creation
  console.log("  [1/5] Testing Business Context Creation & Default Defaults...");
  const ctx = createDefaultBusinessContext({
    entity: { type: 'PT', kbli: '70209' },
    scale: { annualRevenue: 5000000000, employeeCount: 15 }
  });
  assert.strictEqual(ctx.schemaVersion, '2.0.0');
  assert.strictEqual(ctx.businessArchetype, 'PROFESSIONAL_SERVICE');
  assert.strictEqual(ctx.scale.annualRevenue, 5000000000);

  // 2. Missing Parameter Detection & Assumption Registry
  console.log("  [2/5] Testing Missing Information Protocol & Assumption Registry (Strict vs Demo)...");
  const strictRes = validateBusinessContext({ scale: { annualRevenue: 1000000000 } }, 'STRICT_PRODUCTION_MODE');
  assert.strictEqual(strictRes.isComplete, false);
  assert.strictEqual(strictRes.contextStatus, 'INSUFFICIENT_CONTEXT');
  assert.ok(strictRes.missingParameters.includes('entity.type'));

  const demoRes = validateBusinessContext({ scale: { annualRevenue: 1000000000 } }, 'DEMO_MODE');
  assert.strictEqual(demoRes.contextStatus, 'DEMO_CONTEXT_WITH_ASSUMPTIONS');
  assert.ok(demoRes.assumptionRegistry.length > 0);

  // 3. Framework Applicability & Unit of Analysis Matrix
  console.log("  [3/5] Testing Framework Applicability & Unit of Analysis Matrix...");
  const bcgProf = checkFrameworkApplicability({ frameworkName: 'bcg-matrix', kbliCode: '70209' });
  assert.strictEqual(bcgProf.applicabilityStatus, 'ADAPTABLE');
  assert.strictEqual(bcgProf.unitOfAnalysis, 'PRACTICE_AREA_OR_SERVICE_LINE');

  const bcgMfg = checkFrameworkApplicability({ frameworkName: 'bcg-matrix', kbliCode: '10710' });
  assert.strictEqual(bcgMfg.applicabilityStatus, 'NATIVE');
  assert.strictEqual(bcgMfg.unitOfAnalysis, 'PHYSICAL_SKU_OR_PRODUCT_LINE');

  // 4. Statutory Conflict Resolution Engine
  console.log("  [4/5] Testing Statutory Conflict Resolution (Lex Superior)...");
  const conflictRes = resolveStatutoryConflict({
    ruleA: { id: 'PP35-2021', statuteType: 'PP', year: 2021, title: 'PP 35/2021' },
    ruleB: { id: 'PERMEN-06-2016', statuteType: 'PERMEN', year: 2016, title: 'Permenaker 6/2016' }
  });
  assert.strictEqual(conflictRes.conflictDetected, true);
  assert.strictEqual(conflictRes.prevailingRule.statuteType, 'PP');
  assert.strictEqual(conflictRes.resolutionPrinciple, 'LEX_SUPERIOR_DEROGAT_LEGI_INFERIORI');

  // 5. Standard Failure Taxonomy Engine
  console.log("  [5/5] Testing Standard Failure Taxonomy Classification...");
  const failureRes = classifyFailure('INSUFFICIENT_CONTEXT', 'Entity type missing');
  assert.strictEqual(failureRes.errorCategory, 'INSUFFICIENT_CONTEXT');
  assert.strictEqual(failureRes.isFailure, true);

  console.log("\n✅ Context Contract, Conflict Resolution & Failure Taxonomy Unit Tests Passed 100%!");
}

runContextContractTests();