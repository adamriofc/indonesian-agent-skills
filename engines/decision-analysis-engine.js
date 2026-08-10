/**
 * Multi-Criteria Decision Analysis (MCDA) & Weighted Decision Engine
 * Evaluates strategic decision alternatives against weighted criteria (ROI, Risk, Cost, Strategic Fit),
 * computes deterministic weighted scores, rankings, and sensitivity analysis.
 */

function evaluateStrategicDecisionAlternatives({
  decisionTitle = 'Market Expansion Strategy Options',
  criteriaWeights = {
    strategicFit: 0.35,
    expectedRoi: 0.30,
    financialCost: 0.20,
    operationalRisk: 0.15
  },
  alternatives = [
    {
      optionName: 'Option A: Direct Subsidiary Expansion',
      scores: { strategicFit: 9, expectedRoi: 8, financialCost: 4, operationalRisk: 5 } // 1-10 scores (lower financialCost/risk = worse or raw input)
    },
    {
      optionName: 'Option B: Joint Venture Partnership',
      scores: { strategicFit: 7, expectedRoi: 7, financialCost: 8, operationalRisk: 7 }
    }
  ]
}) {
  const options = Array.isArray(alternatives) ? alternatives : [];

  // Normalize criteria weights to sum to 1.0
  const rawWeights = criteriaWeights || {};
  const totalWeight = Object.values(rawWeights).reduce((a, b) => a + (Number(b) || 0), 0) || 1.0;
  const normalizedWeights = {};
  for (const k of Object.keys(rawWeights)) {
    normalizedWeights[k] = Number(rawWeights[k]) / totalWeight;
  }

  const evaluatedOptions = options.map((opt) => {
    let weightedScore = 0;
    const scoreBreakdown = {};

    for (const key of Object.keys(normalizedWeights)) {
      const weight = normalizedWeights[key];
      const rawScore = Math.max(0, Math.min(10, Number(opt.scores[key]) || 0));
      const scoreContribution = rawScore * weight;
      weightedScore += scoreContribution;
      scoreBreakdown[key] = {
        rawScore,
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
    normalizedWeights,
    rankedOptions,
    topRecommendedOption: recommendedOption,
    scoreMarginToSecond: rankedOptions.length > 1 ? Number((rankedOptions[0].compositeWeightedScore - rankedOptions[1].compositeWeightedScore).toFixed(2)) : 0,
    methodology: 'Multi-Criteria Decision Analysis (MCDA) Weighted Scoring'
  };
}

module.exports = {
  evaluateStrategicDecisionAlternatives
};