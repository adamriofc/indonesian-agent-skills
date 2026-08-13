const assert = require('assert');
const {
  createDefaultProductContext,
  resolveProductClassification,
  PRODUCT_CLASSIFICATION_STATUSES,
  STANDARD_PRODUCT_CONTEXT_SCHEMA_VERSION
} = require('../../engines/product-context');

function runProductContextEngineTests() {
  console.log("📦 Running Product Context & BTKI Commodity Classification Unit Tests...\n");

  // 1. Default Product Context Schema Creation
  console.log("  [1/5] Testing Default Product Context Schema Creation...");
  const defaultCtx = createDefaultProductContext({
    product: { name: 'Sample Arabica Coffee', category: 'agricultural_commodities' }
  });
  assert.strictEqual(defaultCtx.schemaVersion, STANDARD_PRODUCT_CONTEXT_SCHEMA_VERSION);
  assert.strictEqual(defaultCtx.product.name, 'Sample Arabica Coffee');
  assert.strictEqual(defaultCtx.classification.scheme, 'BTKI');
  assert.strictEqual(defaultCtx.status, PRODUCT_CLASSIFICATION_STATUSES.UNRESOLVED);

  // 2. BTKI 0901.21.10 Roasted Coffee Beans Duty & Tariff Audit (With NPWP)
  console.log("  [2/5] Testing BTKI 0901.21.10 Duty & Tariff Audit (20% BM, 12% PPN, 2.5% PPh 22)...");
  const coffeeRes = resolveProductClassification({
    productName: "Kopi sangrai arabika gayo",
    description: "Roasted coffee beans in 1kg retail valve bags",
    targetHsCode: "0901.21.10",
    cifValueIdr: 100000000,
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
  assert.strictEqual(coffeeRes._production.safeToUse, "REQUIRES_REVIEW"); // Lartas requires human review

  // 3. Non-NPWP Penalty Rate Audit (7.5% PPh 22 Impor)
  console.log("  [3/5] Testing Non-NPWP PPh 22 Import Penalty Rate (7.5%)...");
  const noNpwpRes = resolveProductClassification({
    productName: "Kopi sangrai arabika gayo",
    targetHsCode: "0901.21.10",
    cifValueIdr: 100000000,
    hasNpwp: false,
    dateStr: "2026-05-01"
  });
  assert.strictEqual(noNpwpRes.pph22RatePercent, 7.5);
  assert.strictEqual(noNpwpRes.pph22Amount, 9000000);

  // 4. EV CBU Tariff Incentive & Duty Exemption Audit (8703.80.19)
  console.log("  [4/5] Testing Electric Vehicle CBU Import Duty Exemption (8703.80.19)...");
  const evRes = resolveProductClassification({
    productName: "Hyundai Ioniq 5 EV CBU",
    targetHsCode: "8703.80.19",
    cifValueIdr: 500000000,
    hasNpwp: true,
    dateStr: "2026-05-01"
  });
  assert.strictEqual(evRes.importDutyPercent, 0);
  assert.strictEqual(evRes.importDutyAmount, 0);
  assert.strictEqual(evRes.nilaiImpor, 500000000);

  // 5. Fail-Closed Error Boundary Testing (requireRupiah)
  console.log("  [5/5] Testing Fail-Closed Invalid Input Error Boundaries...");
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

  console.log("\n✅ All Product Context & BTKI Commodity Engine Tests Passed 100%!");
}

runProductContextEngineTests();
