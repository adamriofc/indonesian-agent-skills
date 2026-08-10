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

function testLoan() {
  const { monthlyPayment, amortizationSchedule } = require('../../engines/loan-amortization');

  const pmt = monthlyPayment(100000000, 0.12, 24);
  assert.strictEqual(pmt, 4707347);

  const sched = amortizationSchedule(100000000, 0.12, 24);
  assert.strictEqual(sched.payment, 4707347);
  assert.strictEqual(sched.schedule.length, 24);
  assert.strictEqual(sched.schedule[23].balance, 0);
  assert.strictEqual(sched.totalInterest, 12976331);
  assert.strictEqual(sched.schedule[0].month, 1);
  assert.strictEqual(sched.schedule[0].interest, 1000000);
  assert.strictEqual(sched.schedule[0].principal, 3707347);
  assert.strictEqual(sched.schedule[0].balance, 96292653);

  const zeroRate = amortizationSchedule(12000000, 0, 12);
  assert.strictEqual(zeroRate.payment, 1000000);
  assert.strictEqual(zeroRate.schedule[11].balance, 0);

  assert.throws(() => monthlyPayment(10000000, 0.12, 0), /Invalid loan/);
  assert.throws(() => monthlyPayment(10000000, -0.05, 12), /Invalid loan/);
  assert.throws(() => monthlyPayment(0, 0.12, 12), /Invalid loan/);
  assert.throws(() => amortizationSchedule(10000000, 0.12, 2.5), /Invalid loan/);

  assertDeterministic(() => amortizationSchedule(100000000, 0.12, 24), 'loan determinism');
  console.log('  [5/8] loan-amortization engine: LOAN-001 schedule + edge cases passed');
}

function testRatios() {
  const fr = require('../../engines/financial-ratios');

  const input = {
    currentAssets: 500000000,
    currentLiabilities: 250000000,
    inventory: 150000000,
    cash: 80000000,
    totalLiabilities: 600000000,
    totalEquity: 400000000,
    revenue: 1200000000,
    cogs: 800000000,
    netIncome: 120000000,
    totalAssets: 1000000000,
    avgInventory: 200000000,
    avgReceivables: 150000000,
    avgPayables: 100000000
  };

  assert.strictEqual(fr.currentRatio(input.currentAssets, input.currentLiabilities), 2);
  assert.strictEqual(fr.quickRatio(input.currentAssets, input.inventory, input.currentLiabilities), 1.4);
  assert.strictEqual(fr.cashRatio(input.cash, input.currentLiabilities), 0.32);
  assert.strictEqual(fr.debtToEquity(input.totalLiabilities, input.totalEquity), 1.5);
  assert.strictEqual(fr.grossMargin(input.revenue, input.cogs), 0.3333);
  assert.strictEqual(fr.netMargin(input.netIncome, input.revenue), 0.1);
  assert.strictEqual(fr.roa(input.netIncome, input.totalAssets), 0.12);
  assert.strictEqual(fr.roe(input.netIncome, input.totalEquity), 0.3);
  assert.strictEqual(fr.inventoryTurnover(input.cogs, input.avgInventory), 4);
  assert.strictEqual(fr.receivablesTurnover(input.revenue, input.avgReceivables), 8);
  assert.strictEqual(fr.daysSalesOutstanding(input.revenue, input.avgReceivables), 45.625);
  assert.strictEqual(fr.daysPayablesOutstanding(input.cogs, input.avgPayables), 45.625);
  assert.strictEqual(fr.daysInventoryOutstanding(input.cogs, input.avgInventory), 91.25);
  assert.strictEqual(fr.cashConversionCycle(91.25, 45.625, 45.625), 91.25);

  assert.throws(() => fr.currentRatio(500000000, 0), /Denominator cannot be zero/);
  assert.throws(() => fr.quickRatio(500000000, 150000000, 0), /Denominator cannot be zero/);
  assert.throws(() => fr.roe(120000000, 0), /Denominator cannot be zero/);
  assert.throws(() => fr.daysSalesOutstanding(0, 150000000), /Denominator cannot be zero/);

  assertDeterministic(() => fr.cashConversionCycle(91.25, 45.625, 45.625), 'ratios determinism');
  console.log('  [6/8] financial-ratios engine: RAT-001 14 ratios passed');
}

function runAll() {
  testBreakEven();
  testDepreciation();
  testNpv();
  testIrr();
  testLoan();
  testRatios();
}

runAll();
console.log('\n✅ Finance engines passed all unit assertions.');