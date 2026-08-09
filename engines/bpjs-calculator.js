/**
 * Deterministic BPJS Contribution Calculator Engine
 * Supports temporal rulesets with effective dates (e.g. March 1st transitions)
 * to ensure regulatory precision and prevent calculation drift.
 */

const bpjsRules = require('./rules/bpjs.json');

function getRulesForDate(dateStr) {
  // Parse date or fallback to default current date (2026-03-01)
  let checkDate = new Date('2026-03-01');
  if (dateStr) {
    const parsed = new Date(dateStr);
    if (!isNaN(parsed.getTime())) {
      checkDate = parsed;
    }
  }

  for (const r of bpjsRules.rulesets) {
    const fromDate = new Date(r.effective_from);
    const toDate = r.effective_to === 'Infinity' ? new Date('9999-12-31') : new Date(r.effective_to);
    
    if (checkDate >= fromDate && checkDate <= toDate) {
      return r;
    }
  }

  // Fallback to the latest ruleset
  return bpjsRules.rulesets[bpjsRules.rulesets.length - 1];
}

function calculateBpjs(baseWage, jkkHazardLevel = 'low', dateStr = '2026-03-01') {
  const wage = Math.max(0, Number(baseWage) || 0);
  const rules = getRulesForDate(dateStr);

  // 1. BPJS Kesehatan (5% total: 4% Employer, 1% Employee)
  const kesBaseWage = Math.min(wage, rules.kesCap);
  const kesEmployer = Math.round(kesBaseWage * 0.04);
  const kesEmployee = Math.round(kesBaseWage * 0.01);
  const kesTotal = kesEmployer + kesEmployee;

  // 2. BPJS TK - JHT (5.7% total: 3.7% Employer, 2% Employee)
  const jhtEmployer = Math.round(wage * 0.037);
  const jhtEmployee = Math.round(wage * 0.02);
  const jhtTotal = jhtEmployer + jhtEmployee;

  // 3. BPJS TK - JP (3% total: 2% Employer, 1% Employee, Capped)
  const jpBaseWage = Math.min(wage, rules.jpCap);
  const jpEmployer = Math.round(jpBaseWage * 0.02);
  const jpEmployee = Math.round(jpBaseWage * 0.01);
  const jpTotal = jpEmployer + jpEmployee;

  // 4. BPJS TK - JKK (Employer Only)
  const jkkRates = {
    very_low: 0.0024,
    low: 0.0054,
    medium: 0.0089,
    high: 0.0127,
    very_high: 0.0174
  };
  const jkkRate = jkkRates[jkkHazardLevel] || jkkRates.low;
  const jkkEmployer = Math.round(wage * jkkRate);

  // 5. BPJS TK - JKM (Employer Only 0.3%)
  const jkmEmployer = Math.round(wage * 0.003);

  const totalEmployer = kesEmployer + jhtEmployer + jpEmployer + jkkEmployer + jkmEmployer;
  const totalEmployee = kesEmployee + jhtEmployee + jpEmployee;

  return {
    baseWage: wage,
    effectiveDate: dateStr,
    bpjsKesehatan: {
      cappedWage: kesBaseWage,
      employer: kesEmployer,
      employee: kesEmployee,
      total: kesTotal
    },
    bpjsKetenagakerjaan: {
      jht: { employer: jhtEmployer, employee: jhtEmployee, total: jhtTotal },
      jp: { cappedWage: jpBaseWage, employer: jpEmployer, employee: jpEmployee, total: jpTotal },
      jkk: { hazardLevel: jkkHazardLevel, ratePercent: `${(jkkRate * 100).toFixed(2)}%`, employer: jkkEmployer },
      jkm: { employer: jkmEmployer }
    },
    summary: {
      totalEmployerContribution: totalEmployer,
      totalEmployeeDeduction: totalEmployee,
      grandTotalContribution: totalEmployer + totalEmployee
    },
    statutoryReference: `Perpres 64/2020 (Kes) & PP 45/2015 (TK) - Ruleset: ${rules.source.regulation}`
  };
}

module.exports = {
  calculateBpjs,
  getRulesForDate
};
