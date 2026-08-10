/**
 * Deterministic PPh 21 Gross-Up Iterative Convergence Calculator Engine
 * Solves circular tax allowance equations (Gross-Up) down to Rp 1 precision using iterative bisection.
 * Integrates PMK 66/2023 Benefit-in-Kind (Natura/Kenikmatan) taxability thresholds and PP 58/2023 TER rulesets.
 */

const { calculatePPh21Monthly } = require('./pph21-calculator');

function calculatePPh21GrossUp({
  baseSalary = 0,
  regularAllowances = 0,
  ptkpStatus = 'TK/0',
  taxpayerIdentity = true,
  dateStr = null,
  naturaAmount = 0,
  naturaExemptThreshold = 2000000, // Rp 2,000,000 monthly exemption for food/housing per PMK 66/2023
  maxIterations = 100,
  tolerance = 1
}) {
  const base = Math.max(0, Number(baseSalary) || 0);
  const allowances = Math.max(0, Number(regularAllowances) || 0);
  const totalNatura = Math.max(0, Number(naturaAmount) || 0);
  const exemptThreshold = Math.max(0, Number(naturaExemptThreshold) || 0);

  // PMK 66/2023 Natura Taxability Evaluation
  const taxableNatura = Math.max(0, totalNatura - exemptThreshold);
  const exemptNatura = totalNatura - taxableNatura;

  const baseTaxableCash = base + allowances + taxableNatura;

  // 1. Initial Non-Gross-Up Baseline Calculation
  const baselineTaxRes = calculatePPh21Monthly(baseTaxableCash, ptkpStatus, taxpayerIdentity, dateStr);
  const initialTax = baselineTaxRes.monthlyTaxWithheld;

  if (initialTax === 0) {
    return {
      baseSalary: base,
      regularAllowances: allowances,
      totalNatura,
      exemptNatura,
      taxableNatura,
      grossUpTaxAllowance: 0,
      monthlyGrossSalaryTotal: baseTaxableCash,
      netTaxWithheld: 0,
      grossTakeHomePay: base + allowances,
      iterationsCount: 0,
      terCategory: baselineTaxRes.terCategory,
      effectiveRatePercent: baselineTaxRes.effectiveRatePercent,
      rulesetId: baselineTaxRes.rulesetId,
      statutoryReference: "PP No. 58/2023 & PMK No. 66/2023 (Gross-Up Engine)"
    };
  }

  // 2. Iterative Bisection Loop to solve Gross-Up Convergence
  // We seek taxAllowance T such that calculatePPh21Monthly(baseTaxableCash + T) === T
  let low = 0;
  let high = initialTax * 3; // Initial upper bound estimate
  let taxAllowance = initialTax;
  let iterations = 0;
  let finalTaxRes = baselineTaxRes;

  while (iterations < maxIterations) {
    iterations++;

    // Test midpoint
    const testGross = baseTaxableCash + taxAllowance;
    finalTaxRes = calculatePPh21Monthly(testGross, ptkpStatus, taxpayerIdentity, dateStr);
    const calculatedTax = finalTaxRes.monthlyTaxWithheld;

    const diff = Math.abs(calculatedTax - taxAllowance);

    if (diff < tolerance) {
      break; // Convergence reached down to Rp 1 precision
    }

    if (calculatedTax > taxAllowance) {
      low = taxAllowance;
      taxAllowance = Math.round((taxAllowance + high) / 2);
    } else {
      high = taxAllowance;
      taxAllowance = Math.round((low + taxAllowance) / 2);
    }

    // Safety guard against infinite loops in edge boundary steps
    if (high - low <= 1) {
      taxAllowance = Math.round(calculatedTax);
      break;
    }
  }

  const monthlyGrossSalaryTotal = baseTaxableCash + taxAllowance;
  // In a Gross-Up model, employer pays tax allowance equal to tax withheld, so employee Take-Home-Pay = base + allowances
  const grossTakeHomePay = base + allowances;

  return {
    baseSalary: base,
    regularAllowances: allowances,
    totalNatura,
    exemptNatura,
    taxableNatura,
    grossUpTaxAllowance: taxAllowance,
    monthlyGrossSalaryTotal,
    netTaxWithheld: finalTaxRes.monthlyTaxWithheld,
    grossTakeHomePay,
    iterationsCount: iterations,
    terCategory: finalTaxRes.terCategory,
    effectiveRatePercent: finalTaxRes.effectiveRatePercent,
    rulesetId: finalTaxRes.rulesetId,
    statutoryReference: "PP No. 58/2023, PMK No. 168/2023 & PMK No. 66/2023 (Gross-Up & Natura)"
  };
}

module.exports = {
  calculatePPh21GrossUp
};
