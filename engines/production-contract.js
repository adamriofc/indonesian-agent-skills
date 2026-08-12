/**
 * Production Contract Engine — Standardized Error Model, Result Envelope & Safe-To-Use State
 *
 * Standardizes the error model (INVALID_INPUT / MISSING_PARAMETER / ...) and the result
 * envelope (status, evidence, assumptions, warnings, provenance, confidence, safeToUse)
 * across high-risk domains (Tax, Legal, Payroll, Compliance).
 *
 * Principles:
 *  - Invalid numeric input NEVER silently coerces to a fabricated number (e.g. 0).
 *    It raises INVALID_INPUT so callers can surface an explicit error boundary.
 *  - "Engine error => no fabricated answer": engines fail loudly, never guess.
 *  - Safe-To-Use states expose the human-review boundary required by the
 *    high-risk human-review matrix (see PRODUCTION_READINESS.md).
 */

const SAFE_TO_USE_STATES = {
  SAFE_TO_USE_FOR_ESTIMATE: 'SAFE_TO_USE_FOR_ESTIMATE',
  REVIEW_RECOMMENDED: 'REVIEW_RECOMMENDED',
  REQUIRES_REVIEW: 'REQUIRES_REVIEW',
  INSUFFICIENT_CONTEXT: 'INSUFFICIENT_CONTEXT',
  CONFLICT_UNRESOLVED: 'CONFLICT_UNRESOLVED'
};

const RESULT_STATUSES = {
  COMPLETE: 'COMPLETE',
  COMPLETE_WITH_WARNINGS: 'COMPLETE_WITH_WARNINGS',
  INVALID_INPUT: 'INVALID_INPUT',
  INSUFFICIENT_CONTEXT: 'INSUFFICIENT_CONTEXT',
  CONFLICT_UNRESOLVED: 'CONFLICT_UNRESOLVED',
  REQUIRES_REVIEW: 'REQUIRES_REVIEW'
};

/**
 * Enforce a non-negative finite Rupiah input.
 * Throws TypeError (INVALID_INPUT) instead of silently coercing to 0.
 */
function requireRupiah(value, fieldName) {
  const numericValue = Number(value);
  if (value === undefined || value === null || value === '' || !Number.isFinite(numericValue)) {
    throw new TypeError(
      `INVALID_INPUT: '${fieldName}' must be a finite number (received: ${JSON.stringify(value)}).`
    );
  }
  if (numericValue < 0) {
    throw new TypeError(
      `INVALID_INPUT: '${fieldName}' must be non-negative (received: ${numericValue}).`
    );
  }
  return numericValue;
}

/**
 * Build a standardized result envelope for high-risk engine outputs.
 * Additive-only: never mutates an existing output object.
 */
function buildResultEnvelope({
  result = {},
  status = RESULT_STATUSES.COMPLETE,
  evidence = [],
  assumptions = [],
  warnings = [],
  provenance = {},
  confidence = 'HIGH',
  safeToUse = SAFE_TO_USE_STATES.SAFE_TO_USE_FOR_ESTIMATE
}) {
  return Object.assign({}, result, {
    _production: {
      envelopeVersion: '1.0.0',
      status,
      confidence,
      safeToUse,
      evidence,
      assumptions,
      warnings,
      provenance
    }
  });
}

/**
 * Derive a Safe-To-Use state from the Compliance Risk assessment enum.
 */
function deriveAssessmentSafeToUse(assessment) {
  switch (assessment) {
    case 'HEALTHY': return SAFE_TO_USE_STATES.SAFE_TO_USE_FOR_ESTIMATE;
    case 'MODERATE_RISK': return SAFE_TO_USE_STATES.REVIEW_RECOMMENDED;
    case 'HIGH_RISK': return SAFE_TO_USE_STATES.REQUIRES_REVIEW;
    default: return SAFE_TO_USE_STATES.INSUFFICIENT_CONTEXT;
  }
}

module.exports = {
  SAFE_TO_USE_STATES,
  RESULT_STATUSES,
  requireRupiah,
  buildResultEnvelope,
  deriveAssessmentSafeToUse
};