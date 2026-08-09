/**
 * Deterministic PPh 23 & PPh 26 Tax Calculator Engine
 * Calculates withholdings on local services/rent (PPh 23) and foreign offshore payments (PPh 26).
 * Grounded in UU No. 36/2008 & UU No. 7/2021 (HPP).
 */

function calculatePPh23And26(grossAmount, transactionType = 'service', hasNpwp = true, hasDgtForm = false, taxTreatyRatePercent = null) {
  const amount = Math.max(0, Number(grossAmount) || 0);

  let taxType = 'PPh 23';
  let baseRate = 0.02; // 2% for services/maintenance, 15% for dividends/royalty/interest
  let isOffshore = false;
  let penaltyApplied = false;

  if (['dividend', 'royalty', 'interest'].includes(transactionType.toLowerCase())) {
    baseRate = 0.15;
  }

  // PPh 26 Offshore Payment Case
  if (transactionType.toLowerCase().startsWith('offshore') || transactionType.toLowerCase().includes('foreign')) {
    isOffshore = true;
    taxType = 'PPh 26';
    
    if (hasDgtForm && taxTreatyRatePercent !== null) {
      baseRate = Number(taxTreatyRatePercent) / 100;
    } else {
      baseRate = 0.20; // Default statutory PPh 26 rate is 20%
    }
  } else {
    // Local PPh 23 Non-NPWP 100% Penalty Check (Double rate = 100% penalty)
    if (!hasNpwp) {
      baseRate = baseRate * 2.0;
      penaltyApplied = true;
    }
  }

  const taxWithheld = Math.round(amount * baseRate);
  const netAmountReceived = amount - taxWithheld;

  return {
    grossAmount: amount,
    transactionType,
    taxType,
    hasNpwp,
    hasDgtForm,
    effectiveRatePercent: `${(baseRate * 100).toFixed(2)}%`,
    penaltyApplied,
    taxWithheld,
    netAmountReceived,
    statutoryReference: isOffshore ? "UU PPh Pasal 26 & Tax Treaty (P3B)" : "UU PPh Pasal 23 & UU No. 7/2021"
  };
}

module.exports = {
  calculatePPh23And26
};
