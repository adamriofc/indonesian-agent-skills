/**
 * Deterministic Transfer Pricing, Thin Capitalization & Secondary Adjustment Engine
 * Evaluates Debt-to-Equity Ratios (DER 4:1 max statutory ceiling per PMK 169/PMK.010/2015 & PMK 172/2023).
 * Identifies non-deductible interest expense & recharacterizes excess intercompany interest into deemed dividends (Secondary Tax Adjustments).
 */

const MAX_STATUTORY_DER_RATIO = 4.0; // 4:1 Debt-to-Equity Ratio Limit

function auditTransferPricingThinCap({
  totalInterestBearingDebt = 0,
  totalEquity = 0,
  annualInterestExpense = 0,
  isAffiliateLender = true,
  isDomesticAffiliate = true,
  hasValidDgtForm = false,
  treatyRatePercent = null
}) {
  const { requireRupiah } = require('./production-contract');
  const debt = requireRupiah(totalInterestBearingDebt, 'totalInterestBearingDebt');
  const equity = requireRupiah(totalEquity, 'totalEquity');
  const totalInterest = requireRupiah(annualInterestExpense, 'annualInterestExpense');

  // 1. Calculate Actual Debt-to-Equity Ratio
  const actualDerRatio = equity > 0 ? Number((debt / equity).toFixed(4)) : (debt > 0 ? Infinity : 0);
  const isDerExceeded = actualDerRatio > MAX_STATUTORY_DER_RATIO;

  // 2. Allowable Debt Ceiling (Batas Maksimal Utang)
  const maxAllowableDebt = Math.round(equity * MAX_STATUTORY_DER_RATIO);

  // 3. Deductible vs Non-Deductible Interest Split
  let deductibleInterest = totalInterest;
  let nonDeductibleInterest = 0;

  if (isDerExceeded && debt > 0) {
    if (equity <= 0) {
      // If equity is negative or zero, 100% of interest is non-deductible
      deductibleInterest = 0;
      nonDeductibleInterest = totalInterest;
    } else {
      // Proportional deductible interest = (Max Allowable Debt / Actual Debt) * Total Interest
      const deductibleFraction = Math.min(1, maxAllowableDebt / debt);
      deductibleInterest = Math.round(totalInterest * deductibleFraction);
      nonDeductibleInterest = totalInterest - deductibleInterest;
    }
  }

  // 4. Secondary Adjustment & Withholding Tax Recharacterization (PMK 172/2023)
  let secondaryAdjustmentTaxType = 'NONE';
  let secondaryAdjustmentTaxRatePercent = '0.00%';
  let secondaryAdjustmentTaxAmount = 0;
  let isRecharacterizedAsDividend = false;

  if (isAffiliateLender && nonDeductibleInterest > 0) {
    isRecharacterizedAsDividend = true;

    if (isDomesticAffiliate) {
      // Domestic Affiliate: Recharacterized as Dividend -> PPh 23 (15%)
      secondaryAdjustmentTaxType = 'PPh 23 (Deemed Dividend)';
      secondaryAdjustmentTaxRatePercent = '15.00%';
      secondaryAdjustmentTaxAmount = Math.round(nonDeductibleInterest * 0.15);
    } else {
      // Offshore Affiliate: Recharacterized as Dividend -> PPh 26 (20% or Tax Treaty DGT rate)
      secondaryAdjustmentTaxType = 'PPh 26 (Offshore Deemed Dividend)';

      let rate = 0.20; // Default statutory PPh 26 rate
      if (hasValidDgtForm && treatyRatePercent !== null && !isNaN(Number(treatyRatePercent))) {
        rate = Number(treatyRatePercent) / 100;
      }

      secondaryAdjustmentTaxRatePercent = `${(rate * 100).toFixed(2)}%`;
      secondaryAdjustmentTaxAmount = Math.round(nonDeductibleInterest * rate);
    }
  }

  return {
    totalInterestBearingDebt: debt,
    totalEquity: equity,
    actualDerRatio: actualDerRatio === Infinity ? 'Infinity' : actualDerRatio,
    maxStatutoryDerLimit: MAX_STATUTORY_DER_RATIO,
    isDerExceeded,
    maxAllowableDebt,
    totalInterestExpense: totalInterest,
    deductibleInterestExpense: deductibleInterest,
    nonDeductibleInterestExpense: nonDeductibleInterest,
    isAffiliateLender,
    isRecharacterizedAsDividend,
    secondaryAdjustmentTaxType,
    secondaryAdjustmentTaxRatePercent,
    secondaryAdjustmentTaxAmount,
    statutoryReference: "PMK No. 169/PMK.010/2015 & PMK No. 172/2023 (Thin Cap & Transfer Pricing)"
  };
}

module.exports = {
  auditTransferPricingThinCap,
  MAX_STATUTORY_DER_RATIO
};
