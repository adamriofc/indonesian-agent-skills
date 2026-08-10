/**
 * Deterministic VC Startup Exit Liquidation Preference Waterfall Calculator Engine
 * Simulates Indonesian venture capital & startup exit distribution across share classes.
 * Supports Seniority Waterfall, Pari Passu, Participating Preference with Caps, and Non-Participating Conversion.
 */

function calculateExitWaterfall({
  exitValuation = 0,
  investorTiers = [], // [{ tierName: 'Series B', investmentAmount: 5000000000, preferenceMultiple: 1.0, isParticipating: false, capMultiple: null, ownershipPercent: 0.15, seniorityOrder: 1 }]
  commonOwnershipPercent = 0.50
}) {
  const valuation = Math.max(0, Number(exitValuation) || 0);
  let remainingDistributable = valuation;

  // Sort tiers by seniority order (1 = highest seniority)
  const sortedTiers = [...investorTiers].sort((a, b) => (a.seniorityOrder || 99) - (b.seniorityOrder || 99));

  const tierResults = sortedTiers.map(tier => {
    const inv = Math.max(0, Number(tier.investmentAmount) || 0);
    const mult = Math.max(0, Number(tier.preferenceMultiple) || 1.0);
    const prefTarget = Math.round(inv * mult);
    const ownership = Math.max(0, Number(tier.ownershipPercent) || 0);

    return {
      tierName: tier.tierName || 'Preferred Shareholder',
      investmentAmount: inv,
      preferenceMultiple: mult,
      preferenceTarget: prefTarget,
      isParticipating: Boolean(tier.isParticipating),
      capMultiple: tier.capMultiple ? Number(tier.capMultiple) : null,
      ownershipPercent: ownership,
      preferencePayout: 0,
      commonProRataPayout: 0,
      totalPayout: 0,
      effectiveMultiple: 0,
      convertedToCommon: false
    };
  });

  // Step 1: Evaluate Non-Participating Conversion Choice (Greater of Preference vs Common Pro-Rata)
  tierResults.forEach(tier => {
    if (!tier.isParticipating) {
      const pureCommonPayout = Math.round(valuation * tier.ownershipPercent);
      if (pureCommonPayout > tier.preferenceTarget) {
        tier.convertedToCommon = true;
      }
    }
  });

  // Step 2: Preference Liquidation Waterfall Distribution
  tierResults.forEach(tier => {
    if (!tier.convertedToCommon && remainingDistributable > 0) {
      const payout = Math.min(remainingDistributable, tier.preferenceTarget);
      tier.preferencePayout = payout;
      remainingDistributable -= payout;
    }
  });

  // Step 3: Participating Remaining Pro-Rata Distribution
  if (remainingDistributable > 0) {
    let totalParticipatingOwnership = 0;
    tierResults.forEach(tier => {
      if (tier.convertedToCommon || tier.isParticipating) {
        totalParticipatingOwnership += tier.ownershipPercent;
      }
    });
    totalParticipatingOwnership += Math.max(0, Number(commonOwnershipPercent) || 0);

    tierResults.forEach(tier => {
      if (tier.convertedToCommon) {
        // Converted shares participate fully in total exit valuation pro-rata
        const fullProRata = Math.round(valuation * tier.ownershipPercent);
        tier.totalPayout = fullProRata;
        tier.preferencePayout = 0;
        tier.commonProRataPayout = fullProRata;
      } else if (tier.isParticipating) {
        // Participating preference gets preference payout + pro-rata of remaining pool
        let proRata = Math.round(remainingDistributable * (tier.ownershipPercent / totalParticipatingOwnership));

        // Apply Cap if specified (e.g. 2x Cap limit)
        if (tier.capMultiple) {
          const maxTotalCap = Math.round(tier.investmentAmount * tier.capMultiple);
          const currentTotal = tier.preferencePayout + proRata;
          if (currentTotal > maxTotalCap) {
            proRata = Math.max(0, maxTotalCap - tier.preferencePayout);
          }
        }

        tier.commonProRataPayout = proRata;
        tier.totalPayout = tier.preferencePayout + proRata;
      } else {
        // Non-participating and did not convert -> only gets preference payout
        tier.totalPayout = tier.preferencePayout;
      }

      tier.effectiveMultiple = tier.investmentAmount > 0 
        ? Number((tier.totalPayout / tier.investmentAmount).toFixed(2)) 
        : 0;
    });
  } else {
    // If exit valuation is insufficient to cover all preferences
    tierResults.forEach(tier => {
      if (!tier.convertedToCommon) {
        tier.totalPayout = tier.preferencePayout;
        tier.effectiveMultiple = tier.investmentAmount > 0 
          ? Number((tier.totalPayout / tier.investmentAmount).toFixed(2)) 
          : 0;
      }
    });
  }

  // Step 4: Common Shareholders Distribution (Founders / Employees)
  let totalInvestorPayout = 0;
  tierResults.forEach(t => { totalInvestorPayout += t.totalPayout; });

  const commonPayout = Math.max(0, valuation - totalInvestorPayout);

  return {
    exitValuation: valuation,
    totalInvestorPayout,
    commonShareholdersPayout: commonPayout,
    remainingUnallocated: Math.max(0, valuation - totalInvestorPayout - commonPayout),
    tierResults,
    statutoryFramework: "Indonesian Law No. 40/2007 (PT Law) & Venture Capital Share Preference Waterfall"
  };
}

module.exports = {
  calculateExitWaterfall
};
