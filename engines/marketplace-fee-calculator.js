/**
 * Deterministic Marketplace Fee & Profit Margin Calculator Engine
 * Calculates net margins for sellers on Tokopedia, Shopee, and TikTok Shop across seller tiers.
 */

const MARKETPLACE_FEE_RATES = {
  tokopedia: {
    regular: 0.038,
    power_merchant: 0.045,
    power_merchant_pro: 0.055,
    official_store: 0.065
  },
  shopee: {
    non_star: 0.040,
    star: 0.060,
    star_plus: 0.065,
    mall: 0.085
  },
  tiktok_shop: {
    standard: 0.045,
    mall: 0.065
  }
};

function calculateMarketplaceFee(sellingPrice, platform = 'shopee', sellerTier = 'star', freeShippingExtra = true, adSpendBudget = 0) {
  const price = Math.max(0, Number(sellingPrice) || 0);
  const plat = (platform || 'shopee').toLowerCase();
  const tier = (sellerTier || 'star').toLowerCase();
  const extraAd = Math.max(0, Number(adSpendBudget) || 0);

  const platformRates = MARKETPLACE_FEE_RATES[plat] || MARKETPLACE_FEE_RATES.shopee;
  const adminRate = platformRates[tier] !== undefined ? platformRates[tier] : 0.05;

  const adminFee = Math.round(price * adminRate);
  
  // Free Shipping Extra Fee (Gratis Ongkir Extra ~ 4.0% capped at Rp 10.000 per item)
  let freeShippingFee = 0;
  if (freeShippingExtra) {
    freeShippingFee = Math.min(Math.round(price * 0.04), 10000);
  }

  const totalDeductions = adminFee + freeShippingFee + extraAd;
  const netSellerPayout = price - totalDeductions;
  const netMarginPercent = price > 0 ? ((netSellerPayout / price) * 100).toFixed(2) + '%' : '0.00%';

  return {
    sellingPrice: price,
    platform: plat,
    sellerTier: tier,
    adminFeeRatePercent: `${(adminRate * 100).toFixed(2)}%`,
    adminFeeAmount: adminFee,
    freeShippingExtraFee: freeShippingFee,
    adSpendBudget: extraAd,
    totalPlatformDeductions: totalDeductions,
    netSellerPayout,
    netMarginPercent
  };
}

module.exports = {
  calculateMarketplaceFee,
  MARKETPLACE_FEE_RATES
};
