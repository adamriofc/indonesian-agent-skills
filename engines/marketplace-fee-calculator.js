/**
 * Deterministic Marketplace Fee & Profit Margin Calculator Engine
 * Calculates net margins for sellers on Tokopedia, Shopee, and TikTok Shop across seller tiers.
 * Rates are read from the versioned policy ruleset (engines/rules/marketplace.json) as SSOT.
 */

const ruleset = require('./rules/marketplace.json');

function resolveRuleset(effectiveDateStr) {
  const candidates = ruleset.rulesets
    .filter(r => {
      if (!effectiveDateStr) return true;
      const effectiveFrom = new Date(r.effective_from + 'T00:00:00Z');
      const target = new Date(effectiveDateStr + 'T00:00:00Z');
      if (isNaN(target.getTime())) return true;
      return effectiveFrom <= target;
    })
    .sort((a, b) => new Date(b.effective_from) - new Date(a.effective_from));
  return candidates[0] || ruleset.rulesets[0];
}

function calculateMarketplaceFee(sellingPrice, platform = 'shopee', sellerTier = 'star', freeShippingExtra = true, adSpendBudget = 0, effectiveDateStr = null) {
  const price = Math.max(0, Number(sellingPrice) || 0);
  const plat = (platform || 'shopee').toLowerCase();
  const tier = (sellerTier || 'star').toLowerCase();
  const extraAd = Math.max(0, Number(adSpendBudget) || 0);

  const active = resolveRuleset(effectiveDateStr);
  const platformRates = active.fee_rates[plat] || active.fee_rates.shopee;
  const adminRate = platformRates[tier] !== undefined ? platformRates[tier] : 0.05;

  const freeShipRate = active.free_shipping_extra.rate;
  const freeShipCap = active.free_shipping_extra.cap_per_item;

  const adminFee = Math.round(price * adminRate);

  // Free Shipping Extra Fee (Gratis Ongkir Extra), capped per item per active ruleset
  let freeShippingFee = 0;
  if (freeShippingExtra) {
    freeShippingFee = Math.min(Math.round(price * freeShipRate), freeShipCap);
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
    netMarginPercent,
    rulesetId: active.rulesetId,
    rulesetVersion: active.rulesetVersion,
    effectiveWindow: `${active.effective_from} – ${active.effective_to}`
  };
}

// Derived table from the active (latest) ruleset for API compatibility
const latest = ruleset.rulesets.sort((a, b) => new Date(b.effective_from) - new Date(a.effective_from))[0];
const MARKETPLACE_FEE_RATES = latest.fee_rates;
const FREE_SHIPPING_POLICY = latest.free_shipping_extra;

module.exports = {
  calculateMarketplaceFee,
  MARKETPLACE_FEE_RATES,
  FREE_SHIPPING_POLICY,
  resolveRuleset
};