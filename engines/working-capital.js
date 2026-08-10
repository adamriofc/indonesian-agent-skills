/**
 * Deterministic Working Capital Engine — net working capital, cash conversion
 * cycle, and working capital requirement. Pure math; money rounded to whole
 * Rupiah, ratios to 4 decimals.
 */

function round4(x) {
  return Math.round(x * 10000) / 10000;
}

function netWorkingCapital(currentAssets, currentLiabilities) {
  return Math.round(Number(currentAssets) - Number(currentLiabilities));
}

function workingCapitalRatio(currentAssets, currentLiabilities) {
  const cl = Number(currentLiabilities);
  if (!(cl > 0)) {
    throw new Error('Current liabilities must be greater than zero');
  }
  return round4(Number(currentAssets) / cl);
}

function cashConversionCycle(daysInventory, daysSalesOutstanding, daysPayables) {
  return round4(Number(daysInventory) + Number(daysSalesOutstanding) - Number(daysPayables));
}

function workingCapitalRequirement(cashCycleDays, costOfGoodsSoldPerDay) {
  return Math.round(Number(cashCycleDays) * Number(costOfGoodsSoldPerDay));
}

module.exports = {
  netWorkingCapital,
  workingCapitalRatio,
  cashConversionCycle,
  workingCapitalRequirement
};