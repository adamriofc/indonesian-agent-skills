/**
 * Standard Business Context Contract & Missing Information Protocol Engine
 * Provides a canonical shared context contract schema across Tax, HR, Legal, Finance, and Strategy skills.
 * Enforces parameter completeness checks, detects missing parameters, and maintains an explicit Assumption Registry.
 */

const { resolveBusinessArchetype } = require('./kbli-context-router');

const STANDARD_CONTEXT_SCHEMA_VERSION = "1.0.0";

function createDefaultBusinessContext(overrides = {}) {
  const entity = overrides.entity || {};
  const scale = overrides.scale || {};

  const kbliCode = String(entity.kbli || '70209').trim();
  const archetypeRes = resolveBusinessArchetype({ kbliCode, activityName: entity.activityName || '' });

  return {
    schemaVersion: STANDARD_CONTEXT_SCHEMA_VERSION,
    asOfDate: overrides.asOfDate || new Date().toISOString().slice(0, 10),
    jurisdiction: overrides.jurisdiction || 'ID',
    entity: {
      type: (entity.type || 'pt').toLowerCase().trim(), // 'individual', 'perseroan_perorangan', 'pt', 'cv'
      kbli: kbliCode,
      activityName: entity.activityName || archetypeRes.activityName,
      hasNib: entity.hasNib !== undefined ? Boolean(entity.hasNib) : true,
      hasNpwp: entity.hasNpwp !== undefined ? Boolean(entity.hasNpwp) : true
    },
    businessArchetype: archetypeRes.businessArchetype,
    archetypeCharacteristics: archetypeRes.archetypeCharacteristics,
    scale: {
      annualRevenue: Math.max(0, Number(scale.annualRevenue) || 0),
      monthlyOpEx: Math.max(0, Number(scale.monthlyOpEx) || 0),
      employeeCount: Math.max(0, Number(scale.employeeCount) || 0)
    }
  };
}

function validateBusinessContext(rawContext = {}) {
  const missingParameters = [];
  const assumptionRegistry = [];

  if (!rawContext.entity || !rawContext.entity.type) {
    missingParameters.push('entity.type');
    assumptionRegistry.push({
      field: 'entity.type',
      assumedValue: 'pt',
      reason: 'Entity type not specified; defaulted to PT corporate per Indonesian commercial standard.'
    });
  }

  if (!rawContext.scale || rawContext.scale.annualRevenue === undefined) {
    missingParameters.push('scale.annualRevenue');
  }

  if (!rawContext.scale || rawContext.scale.employeeCount === undefined) {
    missingParameters.push('scale.employeeCount');
  }

  const isComplete = missingParameters.length === 0;
  const canonicalContext = createDefaultBusinessContext(rawContext);

  return {
    contextStatus: isComplete ? 'COMPLETE' : 'INSUFFICIENT_CONTEXT',
    isComplete,
    missingParameters,
    assumptionRegistry,
    canonicalContext
  };
}

module.exports = {
  STANDARD_CONTEXT_SCHEMA_VERSION,
  createDefaultBusinessContext,
  validateBusinessContext
};