const assert = require('assert');

function assertNear(actual, expected, tolerance, label) {
  assert.ok(
    typeof actual === 'number',
    `${label}: expected number, got ${typeof actual}`
  );
  assert.ok(
    Math.abs(actual - expected) <= tolerance,
    `${label}: expected ${expected} ± ${tolerance}, got ${actual}`
  );
}

function assertDeterministic(fn, label) {
  const first = fn();
  assert.deepStrictEqual(fn(), first, `${label}: run 2 differs`);
  assert.deepStrictEqual(fn(), first, `${label}: run 3 differs`);
}

function testBreakEven() {
  const {
    breakEvenUnits,
    breakEvenRevenue,
    contributionMargin,
    contributionMarginRatio,
    marginOfSafety
  } = require('../../engines/break-even');

  const cm = contributionMargin(25000, 15000);
  const ratio = contributionMarginRatio(25000, 15000);
  const units = breakEvenUnits(20000000, 25000, 15000);
  const revenue = breakEvenRevenue(20000000, 25000, 15000);

  assert.strictEqual(cm, 10000);
  assert.strictEqual(ratio, 0.4);
  assert.strictEqual(units, 2000);
  assert.strictEqual(revenue, 50000000);
  assert.strictEqual(marginOfSafety(60000000, revenue), 10000000);

  assert.throws(() => contributionMargin(25000, 25000), /cannot be zero/);
  assert.throws(() => breakEvenUnits(10000000, 25000, 25000), /cannot be zero/);
  assert.throws(() => contributionMargin(15000, 25000), /cannot be zero/);

  assertDeterministic(() => breakEvenRevenue(20000000, 25000, 15000), 'break-even determinism');
  console.log('  [1/8] break-even engine: BE-001 + edge cases passed');
}

function runAll() {
  testBreakEven();
}

runAll();
console.log('\n✅ Finance engines passed all unit assertions.');