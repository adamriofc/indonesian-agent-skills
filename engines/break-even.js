/**
 * Deterministic Break-Even Analysis Engine
 * Standard contribution-margin formulas from management accounting.
 */

function contributionMargin(pricePerUnit, variableCostPerUnit) {
  const price = Number(pricePerUnit);
  const vc = Number(variableCostPerUnit);
  if (!(price > vc)) {
    throw new Error('Contribution margin cannot be zero');
  }
  return price - vc;
}

function contributionMarginRatio(pricePerUnit, variableCostPerUnit) {
  const cm = contributionMargin(pricePerUnit, variableCostPerUnit);
  return Math.round((cm / Number(pricePerUnit)) * 10000) / 10000;
}

function breakEvenUnits(fixedCosts, pricePerUnit, variableCostPerUnit) {
  const cm = contributionMargin(pricePerUnit, variableCostPerUnit);
  return Math.ceil(Number(fixedCosts) / cm);
}

function breakEvenRevenue(fixedCosts, pricePerUnit, variableCostPerUnit) {
  const units = breakEvenUnits(fixedCosts, pricePerUnit, variableCostPerUnit);
  return Math.round(units * Number(pricePerUnit));
}

function marginOfSafety(actualRevenue, breakEvenRevenueAmount) {
  return Math.round(Number(actualRevenue) - Number(breakEvenRevenueAmount));
}

module.exports = {
  breakEvenUnits,
  breakEvenRevenue,
  contributionMargin,
  contributionMarginRatio,
  marginOfSafety
};