/**
 * Standard Business Context Contract & Missing Information Protocol Engine
 * Provides a canonical shared context contract schema across Tax, HR, Legal, Finance, and Strategy skills.
 * Enforces Strict Production Mode vs DEMO Mode, detects missing parameters, and maintains an explicit Assumption Registry.
 */

const { resolveBusinessArchetype } = require('./kbli-context-router');

const STANDARD_CONTEXT_SCHEMA_VERSION = "2.0.0";

function createDefaultBusinessContext(overrides = {}, mode = 'DEMO_MODE') {
  const entity = overrides.entity || {};
  const scale = overrides.scale || {};

  const isStrict = mode === 'STRICT_PRODUCTION_MODE';

  const defaultKbli = isStrict ? null : '70209';
  const defaultEntityType = isStrict ? null : 'pt';

  const kbliCode = entity.kbli ? String(entity.kbli).trim() : defaultKbli;
  const entityType = entity.type ? String(entity.type).toLowerCase().trim() : defaultEntityType;

  const archetypeRes = kbliCode ? resolveBusinessArchetype({ kbliCode, activityName: entity.activityName || '' }) : { businessArchetype: 'UNKNOWN', archetypeCharacteristics: {} };

  return {
    schemaVersion: STANDARD_CONTEXT_SCHEMA_VERSION,
    executionMode: mode, // 'DEMO_MODE' | 'STRICT_PRODUCTION_MODE'
    asOfDate: overrides.asOfDate || new Date().toISOString().slice(0, 10),
    jurisdiction: overrides.jurisdiction || 'ID',
    entity: {
      type: entityType,
      kbli: kbliCode,
      activityName: entity.activityName || archetypeRes.activityName || 'Unspecified Activity',
      hasNib: entity.hasNib !== undefined ? Boolean(entity.hasNib) : true,
      hasNpwp: entity.hasNpwp !== undefined ? Boolean(entity.hasNpwp) : true
    },
    businessArchetype: archetypeRes.businessArchetype,
    archetypeCharacteristics: archetypeRes.archetypeCharacteristics,
    scale: {
      annualRevenue: scale.annualRevenue !== undefined ? Math.max(0, Number(scale.annualRevenue) || 0) : null,
      monthlyOpEx: scale.monthlyOpEx !== undefined ? Math.max(0, Number(scale.monthlyOpEx) || 0) : null,
      employeeCount: scale.employeeCount !== undefined ? Math.max(0, Number(scale.employeeCount) || 0) : null
    }
  };
}

function validateBusinessContext(rawContext = {}, mode = 'STRICT_PRODUCTION_MODE') {
  const missingParameters = [];
  const assumptionRegistry = [];
  const entity = rawContext.entity || {};
  const scale = rawContext.scale || {};

  if (!entity.type) {
    missingParameters.push('entity.type');
    if (mode === 'DEMO_MODE') {
      assumptionRegistry.push({
        field: 'entity.type',
        assumedValue: 'pt',
        reason: 'Entity type not specified; assumed PT corporate per Indonesian commercial standard (DEMO MODE).'
      });
    }
  }

  if (!entity.kbli) {
    missingParameters.push('entity.kbli');
    if (mode === 'DEMO_MODE') {
      assumptionRegistry.push({
        field: 'entity.kbli',
        assumedValue: '70209',
        reason: 'KBLI code not specified; assumed KBLI 70209 (Management Consulting) per default demo context.'
      });
    }
  }

  if (scale.annualRevenue === undefined || scale.annualRevenue === null) {
    missingParameters.push('scale.annualRevenue');
  }

  if (scale.employeeCount === undefined || scale.employeeCount === null) {
    missingParameters.push('scale.employeeCount');
  }

  const isComplete = missingParameters.length === 0;
  const canonicalContext = createDefaultBusinessContext(rawContext, mode);

  return {
    contextStatus: isComplete ? 'COMPLETE' : (mode === 'STRICT_PRODUCTION_MODE' ? 'INSUFFICIENT_CONTEXT' : 'DEMO_CONTEXT_WITH_ASSUMPTIONS'),
    isComplete,
    executionMode: mode,
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