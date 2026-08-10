/**
 * Multi-Criteria Decision Analysis (MCDA) & Weighted Decision Engine
 * Evaluates strategic decision alternatives against weighted criteria with explicit
 * direction semantics ('benefit' where higher is better vs 'cost' where lower is better).
 * Computes deterministic composite weighted scores and rankings.
 */

function evaluateStrategicDecisionAlternatives({
  decisionTitle = 'Market Expansion Strategy Options',
  criteriaConfig = {
    strategicFit: { weight: 0.35, direction: 'benefit' },
    expectedRoi: { weight: 0.30, direction: 'benefit' },
    financialCost: { weight: 0.20, direction: 'cost' },
    operationalRisk: { weight: 0.15, direction: 'cost' }
  },
  alternatives = [
    {
      optionName: 'Option A: Direct Subsidiary Expansion',
      scores: { strategicFit: 9, expectedRoi: 8, financialCost: 8, operationalRisk: 7 } // High cost (8/10) -> normalized to (2/10)
    },
    {
      optionName: 'Option B: Joint Venture Partnership',
      scores: { strategicFit: 7, expectedRoi: 7, financialCost: 3, operationalRisk: 3 } // Low cost (3/10) -> normalized to (7/10)
    }
  ]
}) {
  const options = Array.isArray(alternatives) ? alternatives : [];
  const config = criteriaConfig || {};

  // Normalize criteria config & weights
  const normalizedCriteria = {};
  let totalWeight = 0;

  for (const k of Object.keys(config)) {
    const val = config[k];
    const weight = typeof val === 'object' ? Math.max(0, Number(val.weight) || 0) : Math.max(0, Number(val) || 0);
    const direction = (typeof val === 'object' && val.direction ? String(val.direction) : 'benefit').toLowerCase().trim();
    normalizedCriteria[k] = { weight, direction: direction === 'cost' ? 'cost' : 'benefit' };
    totalWeight += weight;
  }

  if (totalWeight === 0) totalWeight = 1.0;

  // Scale weights to sum to 1.0
  for (const k of Object.keys(normalizedCriteria)) {
    normalizedCriteria[k].weight = normalizedCriteria[k].weight / totalWeight;
  }

  const evaluatedOptions = options.map((opt) => {
    let weightedScore = 0;
    const scoreBreakdown = {};

    for (const key of Object.keys(normalizedCriteria)) {
      const { weight, direction } = normalizedCriteria[key];
      const rawScore = Math.max(0, Math.min(10, Number(opt.scores[key]) || 0));
      
      // Invert score if direction is 'cost' (lower cost/risk is better)
      const effectiveScore = direction === 'cost' ? 10 - rawScore : rawScore;
      const scoreContribution = effectiveScore * weight;
      weightedScore += scoreContribution;

      scoreBreakdown[key] = {
        rawScore,
        effectiveScore,
        direction,
        weight: Number(weight.toFixed(4)),
        weightedContribution: Number(scoreContribution.toFixed(2))
      };
    }

    return {
      optionName: opt.optionName,
      compositeWeightedScore: Number(weightedScore.toFixed(2)),
      scoreBreakdown
    };
  });

  // Sort descending by compositeWeightedScore
  evaluatedOptions.sort((a, b) => b.compositeWeightedScore - a.compositeWeightedScore);

  const rankedOptions = evaluatedOptions.map((opt, rank) => ({
    rank: rank + 1,
    ...opt
  }));

  const recommendedOption = rankedOptions.length > 0 ? rankedOptions[0].optionName : 'None';

  return {
    decisionTitle,
    normalizedCriteria,
    rankedOptions,
    topRecommendedOption: recommendedOption,
    scoreMarginToSecond: rankedOptions.length > 1 ? Number((rankedOptions[0].compositeWeightedScore - rankedOptions[1].compositeWeightedScore).toFixed(2)) : 0,
    methodologyNote: "Multi-Criteria Decision Analysis (MCDA) Weighted Scoring with Benefit vs Cost Direction Normalization"
  };
}

module.exports = {
  evaluateStrategicDecisionAlternatives
};