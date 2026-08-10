/**
 * Deterministic Corporate Income Tax (PPh Badan) Calculator Engine
 * Calculates statutory 22% Corporate Income Tax with Article 31E UU PPh sliding scale facility.
 * Handles fiscal reconciliations (positive and negative fiscal adjustments) and fiscal loss carry-forwards.
 */

const STATUTORY_CORP_TAX_RATE = 0.22; // 22% Statutory Rate per UU No. 7/2021 (HPP)
const PASAL_31E_DISCOUNT_RATE = 0.50; // 50% discount on statutory rate (effective 11%)
const PASAL_31E_LOWER_THRESHOLD = 4800000000; // Rp 4.8 Billion
const PASAL_31E_UPPER_THRESHOLD = 50000000000; // Rp 50 Billion

function calculateCorporateTax({
  grossTurnover = 0,
  commercialNetProfit = 0,
  positiveFiscalAdjustments = 0,
  negativeFiscalAdjustments = 0,
  priorYearFiscalLossCarryForward = 0,
  taxYear = 2026
}) {
  const turnover = Math.max(0, Number(grossTurnover) || 0);
  const commercialProfit = Number(commercialNetProfit) || 0;
  const posAdj = Math.max(0, Number(positiveFiscalAdjustments) || 0);
  const negAdj = Math.max(0, Number(negativeFiscalAdjustments) || 0);
  const lossCarryForward = Math.max(0, Number(priorYearFiscalLossCarryForward) || 0);

  // 1. Fiscal Reconciliation (Penghasilan Netto Fiskal)
  const fiscalNetIncomeBeforeLoss = commercialProfit + posAdj - negAdj;

  // 2. Fiscal Loss Compensation (Kompensasi Kerugian Fiskal)
  let taxableIncome = 0;
  let remainingFiscalLoss = 0;

  if (fiscalNetIncomeBeforeLoss > 0) {
    if (fiscalNetIncomeBeforeLoss >= lossCarryForward) {
      taxableIncome = fiscalNetIncomeBeforeLoss - lossCarryForward;
      remainingFiscalLoss = 0;
    } else {
      taxableIncome = 0;
      remainingFiscalLoss = lossCarryForward - fiscalNetIncomeBeforeLoss;
    }
  } else {
    taxableIncome = 0;
    remainingFiscalLoss = lossCarryForward + Math.abs(fiscalNetIncomeBeforeLoss);
  }

  // 3. Article 31E Sliding Scale Facility Calculation
  let facilityTaxableIncome = 0;
  let nonFacilityTaxableIncome = 0;
  let facilityTaxDue = 0;
  let nonFacilityTaxDue = 0;
  let appliedFacilityType = 'NONE';

  if (taxableIncome > 0) {
    if (turnover <= PASAL_31E_LOWER_THRESHOLD) {
      // Entire taxable income gets 50% tax discount (11% effective rate)
      appliedFacilityType = 'FULL_50_PERCENT_DISCOUNT';
      facilityTaxableIncome = taxableIncome;
      nonFacilityTaxableIncome = 0;
      facilityTaxDue = Math.round(facilityTaxableIncome * STATUTORY_CORP_TAX_RATE * (1 - PASAL_31E_DISCOUNT_RATE));
      nonFacilityTaxDue = 0;
    } else if (turnover < PASAL_31E_UPPER_THRESHOLD) {
      // Proportional facility split: (4.8B / Turnover) * Taxable Income
      appliedFacilityType = 'PROPORTIONAL_PASAL_31E';
      facilityTaxableIncome = Math.round((PASAL_31E_LOWER_THRESHOLD / turnover) * taxableIncome);
      nonFacilityTaxableIncome = taxableIncome - facilityTaxableIncome;

      facilityTaxDue = Math.round(facilityTaxableIncome * STATUTORY_CORP_TAX_RATE * (1 - PASAL_31E_DISCOUNT_RATE));
      nonFacilityTaxDue = Math.round(nonFacilityTaxableIncome * STATUTORY_CORP_TAX_RATE);
    } else {
      // Turnover >= 50 Billion: No facility applies (full 22% rate)
      appliedFacilityType = 'NO_FACILITY_FULL_RATE';
      facilityTaxableIncome = 0;
      nonFacilityTaxableIncome = taxableIncome;
      facilityTaxDue = 0;
      nonFacilityTaxDue = Math.round(nonFacilityTaxableIncome * STATUTORY_CORP_TAX_RATE);
    }
  }

  const totalCorporateTaxDue = facilityTaxDue + nonFacilityTaxDue;
  const effectiveTaxRatePercent = taxableIncome > 0 
    ? ((totalCorporateTaxDue / taxableIncome) * 100).toFixed(2) + '%' 
    : '0.00%';

  return {
    taxYear,
    grossTurnover: turnover,
    commercialNetProfit: commercialProfit,
    positiveFiscalAdjustments: posAdj,
    negativeFiscalAdjustments: negAdj,
    fiscalNetIncomeBeforeLoss,
    priorYearFiscalLossCarryForward: lossCarryForward,
    remainingFiscalLoss,
    taxableIncome,
    appliedFacilityType,
    facilityTaxableIncome,
    nonFacilityTaxableIncome,
    facilityTaxDue,
    nonFacilityTaxDue,
    totalCorporateTaxDue,
    effectiveTaxRatePercent,
    statutoryRatePercent: "22.00%",
    statutoryReference: "UU No. 7/2021 (HPP) & UU PPh Pasal 31E"
  };
}

module.exports = {
  calculateCorporateTax,
  STATUTORY_CORP_TAX_RATE,
  PASAL_31E_LOWER_THRESHOLD,
  PASAL_31E_UPPER_THRESHOLD
};
