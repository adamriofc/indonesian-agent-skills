/**
 * Standard Business Context Contract & Missing Information Protocol Engine
 * Provides a canonical shared context contract schema across Tax, HR, Legal, Finance, and Strategy skills.
 * Enforces Strict Production Mode vs DEMO Mode, detects missing parameters, and maintains an explicit Assumption Registry.
 */

const { resolveBusinessArchetype } = require('./kbli-context-router');
const { createDefaultProductContext } = require('./product-context');

const STANDARD_CONTEXT_SCHEMA_VERSION = "2.2.0";

function normalizeNonNegativeNumber(value, fieldName, issues) {
  if (value === undefined || value === null) return null;
  const numericValue = Number(value);
  if (!Number.isFinite(numericValue)) {
    issues.push({ field: fieldName, issue: 'INVALID_NUMERIC_VALUE', received: value });
    return null;
  }
  if (numericValue < 0) {
    issues.push({ field: fieldName, issue: 'NEGATIVE_VALUE_OUT_OF_RANGE', received: value });
    return null;
  }
  return numericValue;
}

function normalizeFact(fact) {
  if (typeof fact === 'string') {
    return { subject: fact, value: true, unit: 'boolean', source: 'user_input', confidence: 'UNVERIFIED' };
  }
  const source = fact.source || 'user_input';
  const defaultConfidence = (source === 'statutory_ruleset' || source === 'verified_engine') ? 'VERIFIED' : 'UNVERIFIED';

  return {
    subject: fact.subject || 'unspecified_fact',
    value: fact.value !== undefined ? fact.value : null,
    unit: fact.unit || 'dimensionless',
    asOf: fact.asOf || new Date().toISOString().slice(0, 10),
    source,
    confidence: fact.confidence || defaultConfidence
  };
}

function normalizeRelation(rel) {
  return {
    subject: rel.subject || 'unspecified_subject',
    predicate: rel.predicate || 'affects',
    object: rel.object || 'unspecified_object',
    confidence: rel.confidence || 'MEDIUM',
    evidence: rel.evidence || []
  };
}

function normalizeConstraint(c = {}) {
  return {
    financial: c.financial || null,
    regulatory: c.regulatory || null,
    capacity: c.capacity || null,
    time: c.time || null,
    risk: c.risk || null
  };
}

function normalizeObjective(o = {}, mode = 'DEMO_MODE') {
  if (!o.primary && mode === 'STRICT_PRODUCTION_MODE') {
    return {
      status: 'UNSPECIFIED',
      requiresInput: true,
      primary: null,
      secondary: null,
      timeHorizon: null
    };
  }

  const primary = typeof o.primary === 'string' ? { type: o.primary, weight: 0.6, priority: 1 } : (o.primary || { type: 'GROWTH', weight: 0.6, priority: 1 });
  const secondary = typeof o.secondary === 'string' ? { type: o.secondary, weight: 0.4 } : (o.secondary || { type: 'COMPLIANCE', weight: 0.4 });
  return {
    status: o.primary ? 'SPECIFIED' : 'DEMO_DEFAULT_ASSUMPTION',
    requiresInput: false,
    primary,
    secondary,
    timeHorizon: o.timeHorizon || '12_MONTHS'
  };
}

function normalizeOption(opt, issues = []) {
  let costValue = null;
  if (opt.cost !== undefined && opt.cost !== null) {
    const numCost = Number(opt.cost);
    if (Number.isFinite(numCost) && numCost >= 0) {
      costValue = numCost;
    } else {
      issues.push({ field: `option.${opt.id || 'OPT'}.cost`, issue: 'INVALID_NUMERIC_VALUE', received: opt.cost });
      costValue = null; // Do not coerce invalid non-numeric string to 0
    }
  }

  return {
    id: opt.id || 'OPT-1',
    name: opt.name || 'Default Option',
    cost: costValue,
    risk: opt.risk || 'MEDIUM',
    benefit: opt.benefit || 'MEDIUM',
    feasible: opt.feasible !== undefined ? Boolean(opt.feasible) : null // Requires evidence, not default true
  };
}

function createDefaultBusinessContext(overrides = {}, mode = 'DEMO_MODE') {
  const entity = overrides.entity || {};
  const scale = overrides.scale || {};
  const scaleInputIssues = [];

  const isStrict = mode === 'STRICT_PRODUCTION_MODE';

  const defaultKbli = isStrict ? null : '70209';
  const defaultEntityType = isStrict ? null : 'pt';

  const kbliCode = entity.kbli ? String(entity.kbli).trim() : defaultKbli;
  const entityType = entity.type ? String(entity.type).toLowerCase().trim() : defaultEntityType;

  const archetypeRes = kbliCode ? resolveBusinessArchetype({ kbliCode, activityName: entity.activityName || '' }) : { businessArchetype: 'UNKNOWN', archetypeCharacteristics: {} };

  const defaultHasNib = isStrict ? null : true;
  const defaultHasNpwp = isStrict ? null : true;

  const facts = (overrides.facts || []).map(normalizeFact);
  const relations = (overrides.relations || []).map(normalizeRelation);
  const constraints = normalizeConstraint(overrides.constraints);
  const objectives = normalizeObjective(overrides.objectives, mode);
  const options = (overrides.options || []).map(opt => normalizeOption(opt, scaleInputIssues));

  return {
    schemaVersion: STANDARD_CONTEXT_SCHEMA_VERSION,
    executionMode: mode, // 'DEMO_MODE' | 'STRICT_PRODUCTION_MODE'
    asOfDate: overrides.asOfDate || new Date().toISOString().slice(0, 10),
    jurisdiction: overrides.jurisdiction || 'ID',
    entity: {
      type: entityType,
      kbli: kbliCode,
      activityName: entity.activityName || archetypeRes.activityName || 'Unspecified Activity',
      hasNib: entity.hasNib !== undefined ? Boolean(entity.hasNib) : defaultHasNib,
      hasNpwp: entity.hasNpwp !== undefined ? Boolean(entity.hasNpwp) : defaultHasNpwp
    },
    businessArchetype: archetypeRes.businessArchetype,
    archetypeCharacteristics: archetypeRes.archetypeCharacteristics,
    scale: {
      annualRevenue: scale.annualRevenue !== undefined ? normalizeNonNegativeNumber(scale.annualRevenue, 'scale.annualRevenue', scaleInputIssues) : null,
      monthlyOpEx: scale.monthlyOpEx !== undefined ? normalizeNonNegativeNumber(scale.monthlyOpEx, 'scale.monthlyOpEx', scaleInputIssues) : null,
      employeeCount: scale.employeeCount !== undefined ? normalizeNonNegativeNumber(scale.employeeCount, 'scale.employeeCount', scaleInputIssues) : null
    },
    productContext: createDefaultProductContext(overrides.productContext || {}),
    facts,
    relations,
    constraints,
    objectives,
    options,
    inputIssues: scaleInputIssues
  };
}

function detectContextConflicts(context = {}) {
  const conflicts = [];
  const warnings = [];
  const entity = context.entity || {};
  const activityName = (entity.activityName || '').toLowerCase();
  const archetypeRes = resolveBusinessArchetype({ kbliCode: entity.kbli, activityName: entity.activityName });

  if (archetypeRes.hasNameConflict) {
    warnings.push({
      warningType: 'KBLI_ARCHETYPE_MISMATCH',
      issue: `KBLI code '${entity.kbli}' (${archetypeRes.businessArchetype}) conflicts with activity description '${entity.activityName}'.`,
      recommendedClarification: 'Verify whether entity operates physical manufacturing facilities or professional consulting services.'
    });
  }

  // Conflict: Individual taxpayer claiming Corporate PT entity structure
  if (entity.type === 'individual' && activityName.includes('perseroan terbatas')) {
    conflicts.push({
      conflictType: 'ENTITY_STRUCTURE_MISMATCH',
      issue: "Individual taxpayer type specified alongside 'Perseroan Terbatas' (PT) corporate title.",
      recommendedClarification: 'Specify whether taxpayer is an Individual (Orang Pribadi) or a Corporate PT entity.'
    });
  }

  return {
    hasConflicts: conflicts.length > 0,
    conflicts,
    hasWarnings: warnings.length > 0,
    warnings
  };
}

function validateBusinessContext(rawContext = {}, mode = 'STRICT_PRODUCTION_MODE') {
  const missingParameters = [];
  const assumptionRegistry = [];
  const entity = rawContext.entity || {};
  const scale = rawContext.scale || {};

  const inputIssues = [];
  ['annualRevenue', 'monthlyOpEx', 'employeeCount'].forEach((field) => {
    const fieldValue = scale[field];
    if (fieldValue === undefined || fieldValue === null) return;
    const numericValue = Number(fieldValue);
    if (!Number.isFinite(numericValue)) {
      inputIssues.push({ field: `scale.${field}`, issue: 'INVALID_NUMERIC_VALUE', received: fieldValue });
    } else if (numericValue < 0) {
      inputIssues.push({ field: `scale.${field}`, issue: 'NEGATIVE_VALUE_OUT_OF_RANGE', received: fieldValue });
    }
  });

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
  const conflictCheck = detectContextConflicts(canonicalContext);

  let contextStatus;
  if (inputIssues.length > 0) {
    contextStatus = 'INVALID_INPUT';
  } else if (conflictCheck.hasConflicts) {
    contextStatus = 'CONTEXT_CONFLICT';
  } else if (isComplete && conflictCheck.hasWarnings) {
    contextStatus = 'CONTEXT_WARNING';
  } else if (isComplete) {
    contextStatus = 'COMPLETE';
  } else {
    contextStatus = mode === 'STRICT_PRODUCTION_MODE' ? 'INSUFFICIENT_CONTEXT' : 'DEMO_CONTEXT_WITH_ASSUMPTIONS';
  }

  return {
    contextStatus, // INVALID_INPUT | COMPLETE | CONTEXT_WARNING | CONTEXT_CONFLICT | INSUFFICIENT_CONTEXT | DEMO_CONTEXT_WITH_ASSUMPTIONS
    isComplete: isComplete && !conflictCheck.hasConflicts && inputIssues.length === 0,
    executionMode: mode,
    missingParameters,
    assumptionRegistry,
    inputIssues,
    hasConflicts: conflictCheck.hasConflicts,
    conflicts: conflictCheck.conflicts,
    hasWarnings: conflictCheck.hasWarnings,
    warnings: conflictCheck.warnings,
    canonicalContext
  };
}

module.exports = {
  STANDARD_CONTEXT_SCHEMA_VERSION,
  createDefaultBusinessContext,
  validateBusinessContext,
  detectContextConflicts
};