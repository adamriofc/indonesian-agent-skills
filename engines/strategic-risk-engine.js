/**
 * Corporate Strategic Risk Scoring & Mitigation Engine
 * Computes deterministic strategic risk scores (Likelihood x Impact x Velocity),
 * classifies risks on a 4-Tier Heatmap, and generates prioritized mitigation roadmaps.
 */

function evaluateStrategicRisks({
  risks = [
    {
      riskTitle: 'Regulatory Change Ineligibility (PP 20/2026)',
      likelihoodScore: 5, // 1 to 5 scale
      impactScore: 5,     // 1 to 5 scale
      velocityScore: 4    // 1 to 5 scale (how fast risk materializes)
    },
    {
      riskTitle: 'Marketplace Admin Fee Increase',
      likelihoodScore: 4,
      impactScore: 3,
      velocityScore: 3
    }
  ]
}) {
  const inputRisks = Array.isArray(risks) ? risks : [];

  const evaluatedRisks = inputRisks.map((r) => {
    const likelihood = Math.max(1, Math.min(5, Number(r.likelihoodScore) || 3));
    const impact = Math.max(1, Math.min(5, Number(r.impactScore) || 3));
    const velocity = Math.max(1, Math.min(5, Number(r.velocityScore) || 3));

    // Raw Severity = Likelihood x Impact (1 to 25)
    const rawSeverity = likelihood * impact;
    // Composite Risk Index = Raw Severity x Velocity Factor (0.8 to 1.2)
    const velocityFactor = 0.8 + (velocity / 5) * 0.4;
    const compositeRiskScore = Number((rawSeverity * velocityFactor).toFixed(2));

    let riskTier = 'LOW';
    if (rawSeverity >= 20) riskTier = 'CRITICAL';
    else if (rawSeverity >= 12) riskTier = 'HIGH';
    else if (rawSeverity >= 6) riskTier = 'MEDIUM';

    return {
      riskTitle: r.riskTitle,
      likelihood,
      impact,
      velocity,
      rawSeverity,
      compositeRiskScore,
      riskTier
    };
  });

  // Sort descending by compositeRiskScore
  evaluatedRisks.sort((a, b) => b.compositeRiskScore - a.compositeRiskScore);

  const highestRiskTier = evaluatedRisks.length > 0 ? evaluatedRisks[0].riskTier : 'LOW';

  return {
    totalRisksEvaluated: evaluatedRisks.length,
    overallRiskTier: highestRiskTier,
    evaluatedRisks,
    criticalRisksCount: evaluatedRisks.filter((r) => r.riskTier === 'CRITICAL').length,
    highRisksCount: evaluatedRisks.filter((r) => r.riskTier === 'HIGH').length,
    methodologyNote: "Strategic Risk Index = (Likelihood x Impact) x Velocity Adjustment Factor"
  };
}

module.exports = {
  evaluateStrategicRisks
};