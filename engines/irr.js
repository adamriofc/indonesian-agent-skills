/**
 * Deterministic Internal Rate of Return Engine
 * Bisection on NPV within [-0.99, 10]; throws when no root exists in range.
 */

const { npv } = require('./npv');

const LOWER_BOUND = -0.99;
const UPPER_BOUND = 10;

function bisect(npvFn, flows, maxIterations, tolerance) {
  const fLow = npvFn(LOWER_BOUND, flows);
  const fHigh = npvFn(UPPER_BOUND, flows);
  if (fLow * fHigh > 0) {
    throw new Error('No IRR found in range');
  }
  let a = LOWER_BOUND;
  let b = UPPER_BOUND;
  let fa = fLow;
  let iterations = 0;
  for (let i = 0; i < maxIterations && Math.abs(b - a) > tolerance; i++) {
    const mid = (a + b) / 2;
    const fm = npvFn(mid, flows);
    if (fm * fa <= 0) {
      b = mid;
    } else {
      a = mid;
      fa = fm;
    }
    iterations++;
  }
  return { irr: (a + b) / 2, iterations };
}

function irr(cashflows, opts = {}) {
  const { maxIterations = 200, tolerance = 1e-6 } = opts;
  const flows = Array.isArray(cashflows) ? cashflows.map((f) => Number(f)) : [];
  return bisect(npv, flows, maxIterations, tolerance);
}

function irrFromNpv(npvFn, cashflows, opts = {}) {
  const { maxIterations = 200, tolerance = 1e-6 } = opts;
  const flows = Array.isArray(cashflows) ? cashflows.map((f) => Number(f)) : [];
  return bisect(npvFn, flows, maxIterations, tolerance);
}

module.exports = {
  irr,
  irrFromNpv
};