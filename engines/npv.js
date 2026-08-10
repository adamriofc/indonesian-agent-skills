/**
 * Deterministic Net Present Value Engine — standard discounted cash flow formula.
 * cashflows[0] is treated as t=0 (undiscounted).
 */

function npv(rate, cashflows) {
  const r = Number(rate);
  if (r < -1) {
    throw new Error('Rate cannot be less than -1');
  }
  const flows = Array.isArray(cashflows) ? cashflows.map((f) => Number(f)) : [];
  if (flows.length === 0) {
    return 0;
  }
  let pv = 0;
  for (let t = 0; t < flows.length; t++) {
    pv += flows[t] / Math.pow(1 + r, t);
  }
  return pv;
}

function npvWithTerminalValue(rate, cashflows, terminalValue, terminalYearIndex) {
  const r = Number(rate);
  if (r < -1) {
    throw new Error('Rate cannot be less than -1');
  }
  const idx = Number(terminalYearIndex);
  if (!Number.isInteger(idx) || idx < 0) {
    throw new Error('terminalYearIndex must be a non-negative integer');
  }
  return npv(rate, cashflows) + Number(terminalValue) / Math.pow(1 + r, idx);
}

module.exports = {
  npv,
  npvWithTerminalValue
};