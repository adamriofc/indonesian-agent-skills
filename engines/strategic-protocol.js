/**
 * Strategic Application Protocol (Strategic Operating System)
 * Connects KBLI Context Router, Business Archetype Adaptation, Framework Applicability,
 * and Evidence Sufficiency Verification into a unified protocol for all strategic skills.
 */

const { resolveBusinessArchetype } = require('./kbli-context-router');

/**
 * Executes the 12-Step Strategic Protocol to adapt any strategic framework to local Indonesian business reality.
 */
function applyStrategicProtocol({
  frameworkName = 'porter-five-forces',
  kbliCode = '70209',
  activityName = 'Konsultasi Manajemen',
  availableEvidence = {
    revenueData: true,
    competitorData: false,
    customerData: true
  },
  customAssumptions = []
}) {
  // 1. Resolve KBLI & Business Archetype
  const archetypeRes = resolveBusinessArchetype({ kbliCode, activityName });
  const archetype = archetypeRes.businessArchetype;
  const characteristics = archetypeRes.archetypeCharacteristics;

  // 2. Framework Applicability Check
  let isApplicable = true;
  let applicabilityNote = 'Framework is applicable to this business archetype.';

  if (frameworkName === 'bcg-matrix' && archetype === 'PROFESSIONAL_SERVICE') {
    applicabilityNote = 'BCG Matrix adapted to Professional Service Lines / Practice Areas (using Practice Revenue Share as proxy).';
  } else if (frameworkName === 'value-chain-analysis' && (archetype === 'PROFESSIONAL_SERVICE' || archetype === 'CAPACITY_SERVICE')) {
    applicabilityNote = 'Value Chain adapted from manufacturing logistics to Service Co-Production and Capacity Slot Delivery.';
  }

  // 3. Evidence Sufficiency Verification
  const evidenceKeys = Object.keys(availableEvidence || {});
  const presentEvidence = evidenceKeys.filter((k) => availableEvidence[k] === true);
  let evidenceSufficiency = 'SUFFICIENT';
  const missingEvidence = [];

  if (presentEvidence.length === 0) {
    evidenceSufficiency = 'INSUFFICIENT';
    missingEvidence.push('No market/financial evidence provided.');
  } else if (!availableEvidence.competitorData) {
    evidenceSufficiency = 'PARTIAL';
    missingEvidence.push('Competitor market share & relative margin data unavailable; using internal proxies.');
  }

  // 4. Required Assumptions
  const mandatoryAssumptions = [...customAssumptions];
  if (evidenceSufficiency === 'PARTIAL') {
    mandatoryAssumptions.push('Relative market share estimated via practice revenue contribution due to missing external competitor data.');
  }

  return {
    protocolVersion: '1.0.0',
    frameworkName,
    businessContext: {
      kbliCode: archetypeRes.kbliCode,
      activityName: archetypeRes.activityName,
      businessArchetype: archetype,
      unitOfAnalysis: characteristics.unitOfAnalysis,
      valueChainFocus: characteristics.valueChainFocus
    },
    applicability: {
      isApplicable,
      applicabilityNote
    },
    evidenceVerification: {
      sufficiency: evidenceSufficiency,
      presentEvidence,
      missingEvidence
    },
    mandatoryAssumptions,
    protocolSteps: [
      '1. Identify Business Activity',
      '2. Resolve KBLI 2020 Context',
      '3. Determine Business Archetype',
      '4. Determine Unit of Analysis',
      '5. Framework Applicability Check',
      '6. Verify Evidence Sufficiency',
      '7. Identify Missing Evidence',
      '8. State Explicit Assumptions',
      '9. Apply Framework Logic',
      '10. Execute Deterministic Engine Scoring',
      '11. State Analytical Confidence',
      '12. Define Strategic Recommendations'
    ]
  };
}

module.exports = {
  applyStrategicProtocol
};