const assert = require('assert');
const {
  createDefaultProductContext,
  resolveProductClassification,
  PRODUCT_CLASSIFICATION_STATUSES,
  PPN_TREATMENTS,
  STANDARD_PRODUCT_CONTEXT_SCHEMA_VERSION
} = require('../../engines/product-context');

function runProductContextEngineTests() {
  console.log("📦 Running Product Context & BTKI Commodity Classification Unit Tests...\n");

  // 1. Default Product Context Schema Creation
  console.log("  [1/7] Testing Default Product Context Schema Creation...");
  const defaultCtx = createDefaultProductContext({
    product: { name: 'Sample Arabica Coffee', category: 'agricultural_commodities' }
  });
  assert.strictEqual(defaultCtx.schemaVersion, STANDARD_PRODUCT_CONTEXT_SCHEMA_VERSION);
  assert.strictEqual(defaultCtx.product.name, 'Sample Arabica Coffee');
  assert.strictEqual(defaultCtx.classification.scheme, 'BTKI');
  assert.strictEqual(defaultCtx.status, PRODUCT_CLASSIFICATION_STATUSES.UNRESOLVED);

  // 2. BTKI 0901.21.10 Roasted Coffee Beans Duty & Tariff Audit (API Importer)
  console.log("  [2/7] Testing BTKI 0901.21.10 Duty & Tariff Audit (20% BM, 12% PPN, 2.5% PPh 22 API)...");
  const coffeeRes = resolveProductClassification({
    productName: "Kopi sangrai arabika gayo",
    description: "Roasted coffee beans in 1kg retail valve bags",
    targetHsCode: "0901.21.10",
    cifValueIdr: 100000000,
    usesApi: true,
    hasNpwp: true,
    dateStr: "2026-05-01"
  });

  assert.strictEqual(coffeeRes.btkiCode, "0901.21.10");
  assert.strictEqual(coffeeRes.importDutyPercent, 20);
  assert.strictEqual(coffeeRes.importDutyAmount, 20000000);
  assert.strictEqual(coffeeRes.nilaiImpor, 120000000);
  assert.strictEqual(coffeeRes.ppnPercent, 12);
  assert.strictEqual(coffeeRes.ppnAmount, 14400000);
  assert.strictEqual(coffeeRes.pph22RatePercent, 2.5);
  assert.strictEqual(coffeeRes.pph22Amount, 3000000);
  assert.strictEqual(coffeeRes.totalLandedTaxes, 37400000);
  assert.strictEqual(coffeeRes.totalLandedCost, 137400000);
  assert.strictEqual(coffeeRes.requiresLartasPermit, true);
  assert.strictEqual(coffeeRes._production.safeToUse, "REQUIRES_REVIEW");

  // 3. Importer API vs Non-API vs No-NPWP PPh 22 Rate Determination (2.5% vs 7.5% vs 15.0%)
  console.log("  [3/7] Testing PPh 22 Import Rate Determination (API 2.5% vs Non-API 7.5% vs No-NPWP 15.0%)...");
  const nonApiRes = resolveProductClassification({
    productName: "Kopi sangrai arabika gayo",
    targetHsCode: "0901.21.10",
    cifValueIdr: 100000000,
    usesApi: false,
    hasNpwp: true,
    dateStr: "2026-05-01"
  });
  assert.strictEqual(nonApiRes.pph22RatePercent, 7.5);
  assert.strictEqual(nonApiRes.pph22Amount, 9000000);

  const noNpwpRes = resolveProductClassification({
    productName: "Kopi sangrai arabika gayo",
    targetHsCode: "0901.21.10",
    cifValueIdr: 100000000,
    hasNpwp: false,
    dateStr: "2026-05-01"
  });
  assert.strictEqual(noNpwpRes.pph22RatePercent, 15.0);
  assert.strictEqual(noNpwpRes.pph22Amount, 18000000);

  // 4. Fail-Closed UNRESOLVED & AMBIGUOUS Classification Safeguards
  console.log("  [4/7] Testing Fail-Closed UNRESOLVED & AMBIGUOUS Classification Safeguards (No Fabricated Landed Math)...");
  const unresolvedRes = resolveProductClassification({
    productName: "Unregistered Alien Mineral Specimen XYZ",
    cifValueIdr: 50000000
  });
  assert.strictEqual(unresolvedRes.classificationStatus, PRODUCT_CLASSIFICATION_STATUSES.UNRESOLVED);
  assert.strictEqual(unresolvedRes.importDutyAmount, null);
  assert.strictEqual(unresolvedRes.nilaiImpor, null);
  assert.strictEqual(unresolvedRes.ppnAmount, null);
  assert.strictEqual(unresolvedRes.totalLandedTaxes, null);
  assert.strictEqual(unresolvedRes.totalLandedCost, null);
  assert.strictEqual(unresolvedRes._production.safeToUse, "REQUIRES_REVIEW");

  const ambiguousRes = resolveProductClassification({
    description: "produk impor",
    cifValueIdr: 50000000
  });
  assert.strictEqual(ambiguousRes.classificationStatus, PRODUCT_CLASSIFICATION_STATUSES.AMBIGUOUS);
  assert.strictEqual(ambiguousRes.importDutyAmount, null);
  assert.strictEqual(ambiguousRes.totalLandedCost, null);
  assert.ok(Array.isArray(ambiguousRes.candidates) && ambiguousRes.candidates.length > 1);

  // 5. PPN Treatment Modes (NON_LUXURY_DPP_11_12, EXEMPT, INCENTIVE_DTP)
  console.log("  [5/7] Testing PPN Treatment Schemes (11% Effective DPP Nilai Lain, Exempt, DTP Incentive)...");
  const furnitureRes = resolveProductClassification({
    productName: "Mebel Meja Kayu Jati",
    targetHsCode: "9403.60.90",
    cifValueIdr: 100000000
  });
  assert.strictEqual(furnitureRes.ppnTreatment, PPN_TREATMENTS.NON_LUXURY_DPP_11_12);
  assert.strictEqual(furnitureRes.ppnPercent, 11);
  assert.strictEqual(furnitureRes.ppnAmount, Math.round(115000000 * (11 / 12) * 0.12));

  const riceRes = resolveProductClassification({
    productName: "Beras Premium",
    targetHsCode: "1006.30.99",
    cifValueIdr: 100000000
  });
  assert.strictEqual(riceRes.ppnTreatment, PPN_TREATMENTS.EXEMPT);
  assert.strictEqual(riceRes.ppnAmount, 0);

  const evRes = resolveProductClassification({
    productName: "Hyundai Ioniq 5 EV CBU",
    targetHsCode: "8703.80.19",
    cifValueIdr: 500000000
  });
  assert.strictEqual(evRes.ppnTreatment, PPN_TREATMENTS.INCENTIVE_DTP);
  assert.strictEqual(evRes.importDutyPercent, 0);
  assert.strictEqual(evRes.ppnAmount, 0);

  // 6. Fail-Closed Invalid Input Error Boundaries (requireRupiah)
  console.log("  [6/7] Testing Fail-Closed Invalid Input Error Boundaries...");
  assert.throws(
    () => resolveProductClassification({ productName: "Test", cifValueIdr: -500000 }),
    /INVALID_INPUT/,
    "Negative CIF value must throw explicit INVALID_INPUT"
  );
  assert.throws(
    () => resolveProductClassification({ productName: "Test", cifValueIdr: "abc" }),
    /INVALID_INPUT/,
    "Non-numeric CIF value must throw explicit INVALID_INPUT"
  );

  // 7. Temporal Ruleset Resolution by Date
  console.log("  [7/7] Testing Temporal Ruleset Date Window Resolution...");
  const tempRes = resolveProductClassification({
    productName: "Kopi sangrai arabika gayo",
    targetHsCode: "0901.21.10",
    cifValueIdr: 100000000,
    dateStr: "2026-05-01"
  });
  assert.strictEqual(tempRes._production.provenance.rulesetId, "BTKI-2022");
  assert.strictEqual(tempRes._production.provenance.calculatedAt, "2026-05-01");

  console.log("\n✅ All Product Context & BTKI Commodity Engine Tests Passed 100%!");
}

runProductContextEngineTests();
