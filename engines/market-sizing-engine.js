/**
 * Deterministic Market Sizing Engine (TAM / SAM / SOM)
 * Calculates Total Addressable Market (TAM), Serviceable Addressable Market (SAM),
 * and Serviceable Obtainable Market (SOM) using top-down or bottom-up estimation models.
 */

function calculateMarketSizing({
  totalPopulationOrEntities = 270000000, // e.g. Indonesian population
  targetCategoryAdoptionPercent = 15,    // 15% category penetration
  averageAnnualSpendingPerCustomer = 1200000, // Rp 1.2M/year
  serviceableGeographicFraction = 0.40,  // 40% (e.g. Java & major urban areas)
  targetObtainableSharePercent = 5       // 5% SOM market share target
}) {
  const pop = Math.max(0, Number(totalPopulationOrEntities) || 0);
  const adoptionRate = Math.max(0, Math.min(100, Number(targetCategoryAdoptionPercent) || 0)) / 100;
  const avgSpend = Math.max(0, Number(averageAnnualSpendingPerCustomer) || 0);
  const geoFraction = Math.max(0, Math.min(1.0, Number(serviceableGeographicFraction) || 1.0));
  const somShare = Math.max(0, Math.min(100, Number(targetObtainableSharePercent) || 0)) / 100;

  const totalAddressableCustomers = Math.round(pop * adoptionRate);
  const tamAmount = totalAddressableCustomers * avgSpend;

  const serviceableCustomers = Math.round(totalAddressableCustomers * geoFraction);
  const samAmount = serviceableCustomers * avgSpend;

  const obtainableCustomers = Math.round(serviceableCustomers * somShare);
  const somAmount = obtainableCustomers * avgSpend;

  return {
    inputs: {
      totalPopulationOrEntities: pop,
      targetCategoryAdoptionPercent,
      averageAnnualSpendingPerCustomer: avgSpend,
      serviceableGeographicFraction,
      targetObtainableSharePercent
    },
    results: {
      totalAddressableCustomers,
      tamAmount,
      serviceableCustomers,
      samAmount,
      obtainableCustomers,
      somAmount
    },
    formatted: {
      tamFormattedIdr: `Rp ${tamAmount.toLocaleString('id-ID')}`,
      samFormattedIdr: `Rp ${samAmount.toLocaleString('id-ID')}`,
      somFormattedIdr: `Rp ${somAmount.toLocaleString('id-ID')}`
    },
    methodologyNote: "TAM/SAM/SOM calculated using deterministic top-down category adoption models."
  };
}

module.exports = {
  calculateMarketSizing
};