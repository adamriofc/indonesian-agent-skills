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

function testDepreciation() {
  const { straightLine, doubleDeclining, sumOfYearsDigits } = require('../../engines/depreciation');

  const sl = straightLine(120000000, 0, 5);
  assert.deepStrictEqual(sl.annual, [24000000, 24000000, 24000000, 24000000, 24000000]);
  assert.strictEqual(sl.totalDepreciation, 120000000);
  assert.strictEqual(sl.netBookValue, 0);

  const ddb = doubleDeclining(120000000, 0, 5);
  assert.deepStrictEqual(ddb.annual, [48000000, 28800000, 17280000, 10368000, 6220800]);
  assert.strictEqual(ddb.totalDepreciation, 110668800);
  assert.strictEqual(ddb.netBookValue, 9331200);

  const syd = sumOfYearsDigits(120000000, 0, 5);
  assert.deepStrictEqual(syd.annual, [40000000, 32000000, 24000000, 16000000, 8000000]);
  assert.strictEqual(syd.totalDepreciation, 120000000);
  assert.strictEqual(syd.netBookValue, 0);

  const slResidual = straightLine(10000000, 1000000, 3);
  assert.strictEqual(slResidual.totalDepreciation, 9000000);
  assert.strictEqual(slResidual.netBookValue, 1000000);

  assert.throws(() => straightLine(1000000, 2000000, 5), /Invalid depreciation/);
  assert.throws(() => straightLine(10000000, 0, 1.5), /Invalid depreciation/);
  assert.throws(() => straightLine(10000000, 0, 0), /Invalid depreciation/);
  assert.throws(() => doubleDeclining(10000000, 0, -1), /Invalid depreciation/);

  assertDeterministic(() => doubleDeclining(120000000, 0, 5), 'depreciation determinism');
  console.log('  [2/8] depreciation engine: SL + DDB + SYD golden cases passed');
}

function testNpv() {
  const { npv, npvWithTerminalValue } = require('../../engines/npv');

  assertNear(npv(0.1, [-100000, 30000, 40000, 50000]), -2103.68, 0.02, 'NPV-001');
  assertNear(npvWithTerminalValue(0.1, [-100000, 30000, 40000], 50000, 3), -2103.68, 0.02, 'NPV-TV-001');

  assert.strictEqual(npv(0, [1000, 2000, 3000]), 6000);
  assert.strictEqual(npv(0.1, []), 0);
  assertNear(npv(0.1, [100000]), 100000, 0.0001, 't=0 undiscounted');

  assert.throws(() => npv(-1.5, [100, 200]), /less than -1/);
  assert.throws(() => npvWithTerminalValue(0.1, [100], 50, -1), /non-negative integer/);
  assert.throws(() => npvWithTerminalValue(0.1, [100], 50, 1.5), /non-negative integer/);

  assertDeterministic(() => npv(0.1, [-100000, 30000, 40000, 50000]), 'npv determinism');
  console.log('  [3/8] npv engine: NPV-001 + NPV-TV-001 golden cases passed');
}

function testIrr() {
  const { irr, irrFromNpv } = require('../../engines/irr');
  const { npv } = require('../../engines/npv');

  const r = irr([-100000, 30000, 40000, 50000]);
  assert.ok(r.irr >= 0.088 && r.irr <= 0.09, `IRR-001: ${r.irr} outside [0.088, 0.090]`);
  assert.ok(r.iterations >= 1 && r.iterations <= 200, 'IRR-001: iterations out of bounds');

  const tight = irr([-100000, 30000, 40000, 50000], { tolerance: 1e-9 });
  assertNear(npv(tight.irr, [-100000, 30000, 40000, 50000]), 0, 0.02, 'IRR self-consistency');

  const viaFn = irrFromNpv(npv, [-100000, 30000, 40000, 50000]);
  assertNear(viaFn.irr, r.irr, 1e-4, 'irrFromNpv equals irr');

  assert.throws(() => irr([100, 200, 300]), /No IRR found/);
  assert.throws(() => irr([-100, -200]), /No IRR found/);

  assertDeterministic(() => irr([-100000, 30000, 40000, 50000]), 'irr determinism');
  console.log('  [4/8] irr engine: IRR-001 range + self-consistency passed');
}

function runAll() {
  testBreakEven();
  testDepreciation();
  testNpv();
  testIrr();
}

runAll();
console.log('\n✅ Finance engines passed all unit assertions.');