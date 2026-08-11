/**
 * Standard Failure Taxonomy & Error Classification Engine
 * Classifies execution failures into standard audit categories:
 * INVALID_INPUT, MISSING_PARAMETER, AMBIGUOUS_CONTEXT, OUTDATED_RULESET, CONFLICTING_RULE, UNSUPPORTED_CASE, ENGINE_ERROR
 */

const FAILURE_TAXONOMY_CODES = {
  INVALID_INPUT: 'Input parameter format or numeric range is invalid.',
  MISSING_PARAMETER: 'Mandatory context parameter is missing in strict production mode.',
  AMBIGUOUS_CONTEXT: 'Context contains conflicting or ambiguous business identity fields.',
  OUTDATED_RULESET: 'Ruleset version has been superseded by a newer statutory regulation.',
  CONFLICTING_RULE: 'Conflicting statutory regulations detected across authority levels.',
  UNSUPPORTED_CASE: 'Scenario falls outside statutory scope or engine boundary constraints.',
  ENGINE_ERROR: 'Internal engine calculation or execution exception occurred.'
};

function classifyFailure(code, customMessage = '', details = {}) {
  const normalizedCode = (code || 'ENGINE_ERROR').toUpperCase();
  const description = FAILURE_TAXONOMY_CODES[normalizedCode] || FAILURE_TAXONOMY_CODES.ENGINE_ERROR;

  return {
    errorCategory: normalizedCode,
    isFailure: true,
    description,
    customMessage,
    details,
    timestamp: new Date().toISOString()
  };
}

module.exports = {
  FAILURE_TAXONOMY_CODES,
  classifyFailure
};