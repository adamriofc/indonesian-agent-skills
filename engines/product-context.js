/**
 * Product Context & Commodity Classification Engine (`engines/product-context.js`)
 *
 * Provides a canonical Product Context Layer for commodity classification,
 * HS Code / BTKI 2022 mapping, tariff calculation (Import Duty, PPN 12%, PPh 22),
 * and Lartas regulatory requirement analysis.
 *
 * Enforces cryptographic ruleset runtime integrity and fail-closed validation.
 */

const { verifyRulesetIntegrity } = require('./rules/integrity');
const btkiRules = require('./rules/btki.json');
const { requireRupiah, buildResultEnvelope, RESULT_STATUSES, SAFE_TO_USE_STATES } = require('./production-contract');

// Cryptographic SHA-256 integrity verification on module load
verifyRulesetIntegrity('btki.json');

const STANDARD_PRODUCT_CONTEXT_SCHEMA_VERSION = "1.0.0";

const PRODUCT_CLASSIFICATION_STATUSES = {
  UNRESOLVED: 'UNRESOLVED',
  CANDIDATE: 'CANDIDATE',
  CLASSIFIED: 'CLASSIFIED',
  AMBIGUOUS: 'AMBIGUOUS',
  REVIEW_REQUIRED: 'REVIEW_REQUIRED',
  SUPERSEDED: 'SUPERSEDED'
};

/**
 * Creates a default canonical Product Context object.
 */
function createDefaultProductContext(overrides = {}) {
  const prod = overrides.product || {};
  const cls = overrides.classification || {};
  const comm = overrides.commercial || {};

  return {
    schemaVersion: STANDARD_PRODUCT_CONTEXT_SCHEMA_VERSION,
    product: {
      id: prod.id || null,
      name: prod.name || 'Unspecified Product',
      description: prod.description || '',
      category: prod.category || 'general_goods',
      brand: prod.brand || null,
      model: prod.model || null,
      specifications: prod.specifications || {
        material: null,
        composition: null,
        form: null,
        size: null,
        grade: null
      }
    },
    classification: {
      scheme: 'BTKI',
      hs6: cls.hs6 || null,
      ahtn8: cls.ahtn8 || null,
      btkiCode: cls.btkiCode || null,
      version: cls.version || 'BTKI-2022'
    },
    commercial: {
      unit: comm.unit || 'unit',
      unitPriceIdr: comm.unitPriceIdr !== undefined && comm.unitPriceIdr !== null ? Math.max(0, Number(comm.unitPriceIdr) || 0) : 0,
      unitCostIdr: comm.unitCostIdr !== undefined && comm.unitCostIdr !== null ? Math.max(0, Number(comm.unitCostIdr) || 0) : 0,
      marginPercent: comm.marginPercent !== undefined ? Number(comm.marginPercent) || 0 : 0
    },
    status: overrides.status || PRODUCT_CLASSIFICATION_STATUSES.UNRESOLVED,
    confidence: overrides.confidence || 'LOW',
    effectiveFrom: overrides.effectiveFrom || '2022-04-01',
    effectiveTo: overrides.effectiveTo || 'Infinity',
    evidence: overrides.evidence || []
  };
}

/**
 * Resolves product classification & tariff duties against BTKI 2022.
 */
function resolveProductClassification({
  productName = '',
  description = '',
  attributes = {},
  targetHsCode = null,
  cifValueIdr = 0,
  hasNpwp = true,
  dateStr = null
}) {
  const activeDateStr = dateStr || new Date().toISOString().slice(0, 10);
  const activeRuleset = btkiRules.rulesets[0];
  const entries = activeRuleset.tariff_entries;

  const validCifValue = requireRupiah(cifValueIdr, 'cifValueIdr');

  let candidate = null;
  let matches = [];

  const queryText = (productName + " " + description + " " + (attributes.material || '') + " " + (attributes.category || '')).toLowerCase();

  if (targetHsCode) {
    const cleanHs = String(targetHsCode).replace(/[\.\s]/g, '');
    candidate = entries.find(e => e.btkiCode.replace(/[\.\s]/g, '') === cleanHs || e.hs6 === cleanHs.slice(0, 6));
  }

  if (!candidate && queryText.trim()) {
    matches = entries.filter(e => {
      const desc = e.description.toLowerCase();
      const cat = e.category.toLowerCase();
      return desc.split(' ').some(w => w.length > 3 && queryText.includes(w)) || queryText.includes(cat);
    });

    if (matches.length === 1) {
      candidate = matches[0];
    } else if (matches.length > 1) {
      candidate = matches[0]; // Primary candidate
    }
  }

  // Fallback to general goods if unclassified
  const isAmbiguous = !targetHsCode && matches.length > 1;
  const isUnresolved = !candidate;

  const resolvedHs = candidate || {
    hs6: '000000',
    btkiCode: '0000.00.00',
    description: 'Unclassified General Goods',
    category: 'general_goods',
    importDutyPercent: 10,
    ppnPercent: 12,
    pph22ImportPercent: hasNpwp ? 2.5 : 7.5,
    requiresLartasPermit: false,
    lartasAuthority: 'None'
  };

  // Tariff duty calculations
  const importDutyPercent = resolvedHs.importDutyPercent;
  const ppnPercent = resolvedHs.ppnPercent;
  const pph22RatePercent = hasNpwp ? resolvedHs.pph22ImportPercent : resolvedHs.pph22ImportPercent * 3; // 2.5% vs 7.5%

  const importDutyAmount = Math.round(validCifValue * (importDutyPercent / 100));
  const nilaiImpor = validCifValue + importDutyAmount;
  const ppnAmount = Math.round(nilaiImpor * (ppnPercent / 100));
  const pph22Amount = Math.round(nilaiImpor * (pph22RatePercent / 100));
  const totalLandedTaxes = importDutyAmount + ppnAmount + pph22Amount;
  const totalLandedCost = validCifValue + totalLandedTaxes;

  const classificationStatus = isUnresolved
    ? PRODUCT_CLASSIFICATION_STATUSES.UNRESOLVED
    : (isAmbiguous ? PRODUCT_CLASSIFICATION_STATUSES.AMBIGUOUS : PRODUCT_CLASSIFICATION_STATUSES.CLASSIFIED);

  const safeToUse = isUnresolved || isAmbiguous || resolvedHs.requiresLartasPermit
    ? SAFE_TO_USE_STATES.REQUIRES_REVIEW
    : SAFE_TO_USE_STATES.SAFE_TO_USE_FOR_ESTIMATE;

  const canonicalContext = createDefaultProductContext({
    product: {
      name: productName || resolvedHs.description,
      description,
      category: resolvedHs.category,
      specifications: attributes
    },
    classification: {
      scheme: 'BTKI',
      hs6: resolvedHs.hs6,
      btkiCode: resolvedHs.btkiCode,
      version: activeRuleset.rulesetId
    },
    commercial: {
      unitPriceIdr: validCifValue,
      unitCostIdr: totalLandedCost
    },
    status: classificationStatus,
    confidence: classificationStatus === PRODUCT_CLASSIFICATION_STATUSES.CLASSIFIED ? 'HIGH' : 'MEDIUM',
    evidence: [
      `BTKI 2022 Code: ${resolvedHs.btkiCode}`,
      `Statute: ${activeRuleset.statute}`,
      `Lartas Status: ${resolvedHs.requiresLartasPermit ? 'Requires Permit (' + resolvedHs.lartasAuthority + ')' : 'No Lartas Permit Required'}`
    ]
  });

  const baseResult = {
    productName: canonicalContext.product.name,
    classificationStatus,
    btkiCode: resolvedHs.btkiCode,
    hs6Code: resolvedHs.hs6,
    hsDescription: resolvedHs.description,
    cifValueIdr: validCifValue,
    importDutyPercent,
    importDutyAmount,
    nilaiImpor,
    ppnPercent,
    ppnAmount,
    pph22RatePercent,
    pph22Amount,
    totalLandedTaxes,
    totalLandedCost,
    requiresLartasPermit: resolvedHs.requiresLartasPermit,
    lartasAuthority: resolvedHs.lartasAuthority,
    canonicalProductContext: canonicalContext
  };

  return buildResultEnvelope({
    result: baseResult,
    status: classificationStatus === PRODUCT_CLASSIFICATION_STATUSES.CLASSIFIED ? RESULT_STATUSES.COMPLETE : RESULT_STATUSES.REQUIRES_REVIEW,
    safeToUse,
    confidence: canonicalContext.confidence,
    evidence: canonicalContext.evidence,
    provenance: {
      rulesetId: activeRuleset.rulesetId,
      statute: activeRuleset.statute,
      effectiveFrom: activeRuleset.effective_from,
      calculatedAt: activeDateStr
    }
  });
}

module.exports = {
  STANDARD_PRODUCT_CONTEXT_SCHEMA_VERSION,
  PRODUCT_CLASSIFICATION_STATUSES,
  createDefaultProductContext,
  resolveProductClassification
};
