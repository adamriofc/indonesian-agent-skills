const assert = require('assert');
const { createDefaultBusinessContext, validateBusinessContext } = require('../../engines/context-contract');
const { checkFrameworkApplicability } = require('../../engines/framework-applicability');
const { resolveStatutoryConflict } = require('../../engines/conflict-resolution');
const { classifyFailure } = require('../../engines/failure-taxonomy');
const { getArchetypeContract } = require('../../engines/business-archetype-contract');

function runContextContractTests() {
  console.log("⚡ Running Standard Context Contract, Conflict Resolution & Failure Taxonomy Unit Tests...\n");

  // 1. Standard Business Context Creation
  console.log("  [1/6] Testing Business Context Creation & Default Defaults...");
  const ctx = createDefaultBusinessContext({
    entity: { type: 'PT', kbli: '70209' },
    scale: { annualRevenue: 5000000000, employeeCount: 15 }
  });
  assert.strictEqual(ctx.schemaVersion, '2.0.0');
  assert.strictEqual(ctx.businessArchetype, 'PROFESSIONAL_SERVICE');
  assert.strictEqual(ctx.scale.annualRevenue, 5000000000);

  // 2. Missing Parameter Detection & Strict Mode Enforcement
  console.log("  [2/6] Testing Missing Information Protocol & Strict Mode Enforcement...");
  const strictRes = validateBusinessContext({ scale: { annualRevenue: 1000000000 } }, 'STRICT_PRODUCTION_MODE');
  assert.strictEqual(strictRes.isComplete, false);
  assert.strictEqual(strictRes.contextStatus, 'INSUFFICIENT_CONTEXT');
  assert.ok(strictRes.missingParameters.includes('entity.type'));

  const demoRes = validateBusinessContext({ scale: { annualRevenue: 1000000000 } }, 'DEMO_MODE');
  assert.strictEqual(demoRes.contextStatus, 'DEMO_CONTEXT_WITH_ASSUMPTIONS');

  // 3. Framework Applicability & Recommendation Level Matrix
  console.log("  [3/6] Testing Framework Applicability & Recommendation Level Matrix...");
  const bcgProf = checkFrameworkApplicability({ frameworkName: 'bcg-matrix', kbliCode: '70209' });
  assert.strictEqual(bcgProf.applicabilityStatus, 'ADAPTABLE');
  assert.strictEqual(bcgProf.recommendationLevel, 'ADAPTABLE');
  assert.strictEqual(bcgProf.unitOfAnalysis, 'PRACTICE_AREA_OR_SERVICE_LINE');

  const bcgMfg = checkFrameworkApplicability({ frameworkName: 'bcg-matrix', kbliCode: '10710' });
  assert.strictEqual(bcgMfg.applicabilityStatus, 'NATIVE');
  assert.strictEqual(bcgMfg.recommendationLevel, 'RECOMMENDED');
  assert.strictEqual(bcgMfg.unitOfAnalysis, 'PHYSICAL_SKU_OR_PRODUCT_LINE');

  // 4. Multi-Factor Statutory Conflict Resolution Engine (Pasal 7 & Lex Superior)
  console.log("  [4/6] Testing Multi-Factor Statutory Conflict Resolution (Pasal 7 & Lex Superior)...");
  const conflictRes = resolveStatutoryConflict({
    ruleA: { id: 'PP35-2021', statuteType: 'PP', year: 2021, title: 'PP 35/2021', isSpecialRule: false },
    ruleB: { id: 'PERMEN-06-2016', statuteType: 'PERMEN', year: 2016, title: 'Permenaker 6/2016', isSpecialRule: true }
  });
  assert.strictEqual(conflictRes.status, 'RESOLVED');
  assert.strictEqual(conflictRes.resolutionPrinciple, 'LEX_SUPERIOR_DEROGAT_LEGI_INFERIORI');
  assert.strictEqual(conflictRes.prevailingRule.id, 'PP35-2021');

  // 5. Standard Failure Taxonomy Engine
  console.log("  [5/6] Testing Standard Failure Taxonomy Classification...");
  const failureRes = classifyFailure('CONTEXT_CONFLICT', 'KBLI mismatch');
  assert.strictEqual(failureRes.errorCategory, 'CONTEXT_CONFLICT');

  // 6. Shared Business Archetype Contract & Generic Operational Attributes
  console.log("  [6/6] Testing Shared Business Archetype Contract & Capacity Models...");
  const contract = getArchetypeContract('PROFESSIONAL_SERVICE');
  assert.strictEqual(contract.unitOfAnalysis, 'SERVICE_LINE_PRACTICE_AREA');
  assert.strictEqual(contract.capacityModel, 'HUMAN_CAPACITY');
  assert.strictEqual(contract.revenueModel, 'PROJECT_BASED');

  console.log("\n✅ All Context Contract, Conflict Resolution & Archetype Tests Passed 100%!");
}

runContextContractTests();