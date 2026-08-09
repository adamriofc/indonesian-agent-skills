/**
 * Deterministic UMKM Final Tax Calculator Engine (PP No. 55/2022)
 * Computes 0.5% final PPh for MSMEs including the Rp 500M annual non-taxable threshold for Individual Taxpayers.
 */

const UMKM_FREE_THRESHOLD_OP = 500000000; // Rp 500.000.000 for Wajib Pajak Orang Pribadi

function calculateUmkmFinalTax(grossRevenueYtd, currentMonthRevenue, taxpayerType = 'individual') {
  const ytdBefore = Math.max(0, Number(grossRevenueYtd) || 0);
  const currentRevenue = Math.max(0, Number(currentMonthRevenue) || 0);
  const isIndividual = taxpayerType.toLowerCase() === 'individual' || taxpayerType.toLowerCase() === 'orang_pribadi';

  let taxableRevenue = 0;
  let taxExemptRevenue = 0;

  if (isIndividual) {
    const ytdAfter = ytdBefore + currentRevenue;

    if (ytdAfter <= UMKM_FREE_THRESHOLD_OP) {
      // Entirely within free threshold
      taxExemptRevenue = currentRevenue;
      taxableRevenue = 0;
    } else if (ytdBefore < UMKM_FREE_THRESHOLD_OP) {
      // Partial threshold crossover
      taxExemptRevenue = UMKM_FREE_THRESHOLD_OP - ytdBefore;
      taxableRevenue = currentRevenue - taxExemptRevenue;
    } else {
      // Threshold already fully utilized in prior months
      taxExemptRevenue = 0;
      taxableRevenue = currentRevenue;
    }
  } else {
    // Corporate Taxpayers (PT/CV) have no 500M threshold exemption
    taxableRevenue = currentRevenue;
    taxExemptRevenue = 0;
  }

  const taxDue = Math.round(taxableRevenue * 0.005); // 0.5% Final Tax Rate

  return {
    taxpayerType: isIndividual ? 'Orang Pribadi (Individual)' : 'Badan (Corporate PT/CV)',
    grossRevenueYtdBefore: ytdBefore,
    currentMonthRevenue: currentRevenue,
    taxExemptRevenue,
    taxableRevenue,
    finalTaxRatePercent: "0.50%",
    finalTaxDue: taxDue,
    statutoryReference: "PP No. 55 Tahun 2022 Pasal 56-57"
  };
}

module.exports = {
  calculateUmkmFinalTax,
  UMKM_FREE_THRESHOLD_OP
};
