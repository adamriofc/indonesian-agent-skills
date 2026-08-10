/**
 * Strategic Framework Evaluation Engine
 * Evaluates corporate portfolio matrices (BCG Growth-Share Matrix, GE-McKinsey 9-Box Matrix)
 * and strategic positioning heuristics deterministically.
 */

function evaluateBcgMatrix({
  unitName = 'Business Unit A',
  marketGrowthRatePercent = 15,    // Raw input
  relativeMarketShare = 1.5,         // Raw input
  highGrowthThresholdPercent = 10,   // Configurable industry threshold
  highRelativeShareThreshold = 1.0    // Configurable industry threshold
}) {
  const growth = Number(marketGrowthRatePercent) || 0;
  const share = Math.max(0, Number(relativeMarketShare) || 0);
  const growthThresh = Number(highGrowthThresholdPercent) || 10;
  const shareThresh = Math.max(0, Number(highRelativeShareThreshold) || 1.0);

  const isHighGrowth = growth >= growthThresh;
  const isHighShare = share >= shareThresh;

  let category = 'QUESTION_MARK';
  let strategicImplication = 'Invest selectively or divest based on competitive advantage potential.';
  let capitalAllocationPriority = 'HIGH_RISK_INVESTMENT';

  if (isHighGrowth && isHighShare) {
    category = 'STAR';
    strategicImplication = 'Invest aggressively for growth to maintain leadership position.';
    capitalAllocationPriority = 'HIGH_INVESTMENT';
  } else if (!isHighGrowth && isHighShare) {
    category = 'CASH_COW';
    strategicImplication = 'Harvest cash flows to fund Stars and Question Marks; defend market share efficiently.';
    capitalAllocationPriority = 'MODERATE_MAINTENANCE';
  } else if (isHighGrowth && !isHighShare) {
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
    appliedThresholds: {
      highGrowthThresholdPercent: growthThresh,
      highRelativeShareThreshold: shareThresh
    },
    category,
    strategicImplication,
    capitalAllocationPriority,
    methodologyNote: "BCG Matrix is a portfolio planning heuristic. Thresholds are configurable to reflect industry context."
  };
}

function evaluateGeMckinseyMatrix({
  unitName = 'Business Unit A',
  industryAttractivenessScore = 8, // 1 to 10 scale
  businessUnitStrengthScore = 7     // 1 to 10 scale
}) {
  const attractiveness = Math.max(1, Math.min(10, Number(industryAttractivenessScore) || 5));
  const strength = Math.max(1, Math.min(10, Number(businessUnitStrengthScore) || 5));

  function getBand(score) {
    if (score >= 7) return 'HIGH';
    if (score >= 4) return 'MEDIUM';
    return 'LOW';
  }

  const attractivenessBand = getBand(attractiveness);
  const strengthBand = getBand(strength);
  const cellCoordinate = `${attractivenessBand}_${strengthBand}`; // e.g. HIGH_HIGH, HIGH_MEDIUM

  let matrixCell = 'INVEST_GROW';
  let strategicAction = 'Invest for growth; expand market position aggressively.';

  if (attractivenessBand === 'HIGH' && strengthBand === 'HIGH') {
    matrixCell = 'PROTECT_BUILD_LEADERSHIP';
    strategicAction = 'Invest to build and protect market leadership.';
  } else if (attractivenessBand === 'HIGH' && strengthBand === 'MEDIUM') {
    matrixCell = 'SELECTIVE_BUILD';
    strategicAction = 'Invest selectively in high-return segments.';
  } else if (attractivenessBand === 'LOW' && strengthBand === 'LOW') {
    matrixCell = 'HARVEST_DIVEST';
    strategicAction = 'Harvest cash flows or divest business unit.';
  } else if (strengthBand === 'HIGH' && attractivenessBand === 'LOW') {
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
    bands: {
      attractivenessBand,
      strengthBand,
      cellCoordinate
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