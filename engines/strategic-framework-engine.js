/**
 * Strategic Framework Evaluation Engine
 * Evaluates corporate portfolio matrices (BCG Growth-Share Matrix, GE-McKinsey Matrix)
 * and strategic positioning heuristics deterministically.
 */

function evaluateBcgMatrix({
  unitName = 'Business Unit A',
  marketGrowthRatePercent = 15, // High growth >= 10%
  relativeMarketShare = 1.5      // High share >= 1.0
}) {
  const growth = Number(marketGrowthRatePercent) || 0;
  const share = Math.max(0, Number(relativeMarketShare) || 0);

  let category = 'QUESTION_MARK';
  let strategicImplication = 'Invest selectively or divest based on competitive advantage potential.';
  let capitalAllocationPriority = 'HIGH_RISK_INVESTMENT';

  if (growth >= 10 && share >= 1.0) {
    category = 'STAR';
    strategicImplication = 'Invest aggressively for growth to maintain leadership position.';
    capitalAllocationPriority = 'HIGH_INVESTMENT';
  } else if (growth < 10 && share >= 1.0) {
    category = 'CASH_COW';
    strategicImplication = 'Harvest cash flows to fund Stars and Question Marks; defend market share efficiently.';
    capitalAllocationPriority = 'MODERATE_MAINTENANCE';
  } else if (growth >= 10 && share < 1.0) {
    category = 'QUESTION_MARK';
    strategicImplication = 'Evaluate whether to invest heavily to convert into Star or divest to prevent cash drain.';
    capitalAllocationPriority = 'SELECTIVE_INVESTMENT';
  } else {
    category = 'DOG';
    strategicImplication = 'Divest, harvest remaining cash, or reposition; minimize capital commitment.';
    capitalAllocationPriority = 'DIVESTMENT_HARVEST';
  }

  return {
    unitName,
    metrics: {
      marketGrowthRatePercent: growth,
      relativeMarketShare: share
    },
    category,
    strategicImplication,
    capitalAllocationPriority,
    methodologyNote: "BCG Matrix is a portfolio planning heuristic and requires qualitative industry analysis."
  };
}

function evaluateGeMckinseyMatrix({
  unitName = 'Business Unit A',
  industryAttractivenessScore = 8, // 1 to 10 scale
  businessUnitStrengthScore = 7     // 1 to 10 scale
}) {
  const attractiveness = Math.max(1, Math.min(10, Number(industryAttractivenessScore) || 5));
  const strength = Math.max(1, Math.min(10, Number(businessUnitStrengthScore) || 5));

  let matrixCell = 'INVEST_GROW';
  let strategicAction = 'Invest for growth; expand market position aggressively.';

  if (attractiveness >= 7 && strength >= 7) {
    matrixCell = 'PROTECT_BUILD_LEADERSHIP';
    strategicAction = 'Invest to build and protect market leadership.';
  } else if (attractiveness >= 7 && strength >= 4) {
    matrixCell = 'SELECTIVE_BUILD';
    strategicAction = 'Invest selectively in high-return segments.';
  } else if (attractiveness < 4 && strength < 4) {
    matrixCell = 'HARVEST_DIVEST';
    strategicAction = 'Harvest cash flows or divest business unit.';
  } else if (strength >= 7 && attractiveness < 4) {
    matrixCell = 'EARN_PROTECT_CASH';
    strategicAction = 'Protect core cash generation without major expansion capital.';
  } else {
    matrixCell = 'SELECTIVE_PROTECT';
    strategicAction = 'Maintain position; invest selectively only where competitive advantage is clear.';
  }

  return {
    unitName,
    scores: {
      industryAttractivenessScore: attractiveness,
      businessUnitStrengthScore: strength
    },
    matrixCell,
    strategicAction,
    methodologyNote: "GE-McKinsey 9-box matrix evaluates composite industry attractiveness and competitive strength."
  };
}

module.exports = {
  evaluateBcgMatrix,
  evaluateGeMckinseyMatrix
};