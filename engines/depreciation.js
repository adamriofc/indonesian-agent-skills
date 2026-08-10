/**
 * Deterministic Depreciation Engines — Straight Line, Double Declining Balance,
 * Sum of Years Digits. Pure math consistent with PSAK 16 (IAS 16) methods.
 */

function validate(cost, salvage, lifeYears) {
  const c = Number(cost);
  const s = Number(salvage);
  const n = Number(lifeYears);
  if (!(c >= s && s >= 0 && n >= 1 && Number.isInteger(n))) {
    throw new Error('Invalid depreciation inputs: cost >= salvage >= 0, lifeYears integer >= 1');
  }
  return { c, s, n };
}

function straightLine(cost, salvage, lifeYears) {
  const { c, s, n } = validate(cost, salvage, lifeYears);
  const base = Math.round((c - s) / n);
  const annual = Array.from({ length: n }, (_, i) => (i < n - 1 ? base : c - s - base * (n - 1)));
  const totalDepreciation = c - s;
  return {
    annual,
    totalDepreciation,
    netBookValue: c - totalDepreciation
  };
}

function doubleDeclining(cost, salvage, lifeYears) {
  const { c, s, n } = validate(cost, salvage, lifeYears);
  const rate = 2 / n;
  const annual = [];
  let bookValue = c;
  let year = 1;
  while (bookValue > s && year <= n) {
    const dep = Math.min(Math.round(bookValue * rate), bookValue - s);
    annual.push(dep);
    bookValue -= dep;
    year++;
  }
  const totalDepreciation = annual.reduce((sum, d) => sum + d, 0);
  return {
    annual,
    totalDepreciation,
    netBookValue: c - totalDepreciation
  };
}

function sumOfYearsDigits(cost, salvage, lifeYears) {
  const { c, s, n } = validate(cost, salvage, lifeYears);
  const denominator = (n * (n + 1)) / 2;
  const annual = Array.from({ length: n }, (_, i) =>
    Math.round(((c - s) * (n - i)) / denominator)
  );
  const totalDepreciation = annual.reduce((sum, d) => sum + d, 0);
  return {
    annual,
    totalDepreciation,
    netBookValue: c - totalDepreciation
  };
}

module.exports = {
  straightLine,
  doubleDeclining,
  sumOfYearsDigits
};