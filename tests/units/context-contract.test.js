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
  assert.strictEqual(ctx.schemaVersion, '2.1.0');
  assert.strictEqual(ctx.businessArchetype, 'PROFESSIONAL_SERVICE');
  assert.strictEqual(ctx.scale.annualRevenue, 5000000000);

  // 2. Missing Parameter Detection & Strict Mode Enforcement
  console.log("  [2/6] Testing Missing Information Protocol & Context Conflict Detection...");
  const strictRes = validateBusinessContext({ scale: { annualRevenue: 1000000000 } }, 'STRICT_PRODUCTION_MODE');
  assert.strictEqual(strictRes.isComplete, false);
  assert.strictEqual(strictRes.contextStatus, 'INSUFFICIENT_CONTEXT');
  assert.ok(strictRes.missingParameters.includes('entity.type'));

  const demoRes = validateBusinessContext({ scale: { annualRevenue: 1000000000 } }, 'DEMO_MODE');
  assert.strictEqual(demoRes.contextStatus, 'DEMO_CONTEXT_WITH_ASSUMPTIONS');

  const conflictContextRes = validateBusinessContext({ entity: { type: 'pt', kbli: '70209', activityName: 'Pabrik Manufaktur Makanan' }, scale: { annualRevenue: 1000000000, employeeCount: 10 } });
  assert.strictEqual(conflictContextRes.contextStatus, 'CONTEXT_WARNING');
  assert.strictEqual(conflictContextRes.hasConflicts, false);
  assert.strictEqual(conflictContextRes.hasWarnings, true);
  assert.strictEqual(conflictContextRes.isComplete, true);
  assert.strictEqual(conflictContextRes.warnings[0].warningType, 'KBLI_ARCHETYPE_MISMATCH');

  const hardConflictRes = validateBusinessContext({ entity: { type: 'individual', kbli: '47911', activityName: 'Perseroan Terbatas Ritel Digital' }, scale: { annualRevenue: 300000000, employeeCount: 2 } });
  assert.strictEqual(hardConflictRes.contextStatus, 'CONTEXT_CONFLICT');
  assert.strictEqual(hardConflictRes.hasConflicts, true);
  assert.strictEqual(hardConflictRes.conflicts[0].conflictType, 'ENTITY_STRUCTURE_MISMATCH');

  // 2b. Invalid Numeric Input Protocol (never silently coerced to 0)
  console.log("  [2b/6] Testing Invalid Numeric Input → INVALID_INPUT (no silent zero-coercion)...");
  const invalidNumericRes = validateBusinessContext({ entity: { type: 'pt', kbli: '70209' }, scale: { annualRevenue: 'abc', employeeCount: 10 } });
  assert.strictEqual(invalidNumericRes.contextStatus, 'INVALID_INPUT');
  assert.strictEqual(invalidNumericRes.isComplete, false);
  assert.strictEqual(invalidNumericRes.inputIssues.length, 1);
  assert.strictEqual(invalidNumericRes.inputIssues[0].field, 'scale.annualRevenue');
  assert.strictEqual(invalidNumericRes.inputIssues[0].issue, 'INVALID_NUMERIC_VALUE');
  assert.strictEqual(invalidNumericRes.canonicalContext.scale.annualRevenue, null);

  const negativeNumericRes = validateBusinessContext({ entity: { type: 'pt', kbli: '70209' }, scale: { annualRevenue: -500000000, employeeCount: 10 } });
  assert.strictEqual(negativeNumericRes.contextStatus, 'INVALID_INPUT');
  assert.strictEqual(negativeNumericRes.inputIssues[0].issue, 'NEGATIVE_VALUE_OUT_OF_RANGE');

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