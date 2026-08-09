/**
 * Deterministic BPJS Contribution Calculator Engine
 * Supports temporal rulesets with effective dates (e.g. March 1st transitions)
 * and extracts all rates dynamically from engines/rules/bpjs.json (Single Source of Truth).
 */

const bpjsRules = require('./rules/bpjs.json');

function getRulesForDate(dateStr) {
  if (!dateStr) {
    throw new Error("effectiveDate (dateStr) is a required parameter.");
  }
  
  const checkDate = new Date(dateStr);
  if (isNaN(checkDate.getTime())) {
    throw new Error(`Invalid date format provided: ${dateStr}`);
  }

  for (const r of bpjsRules.rulesets) {
    const fromDate = new Date(r.effective_from);
    const toDate = r.effective_to === 'Infinity' ? new Date('9999-12-31') : new Date(r.effective_to);
    
    if (checkDate >= fromDate && checkDate <= toDate) {
      return r;
    }
  }

  throw new Error(`No regulatory BPJS ruleset available for date: ${dateStr}`);
}

function calculateBpjs(baseWage, jkkHazardLevel = 'low', dateStr) {
  const activeDateStr = dateStr || new Date().toISOString().split('T')[0];
  const wage = Math.max(0, Number(baseWage) || 0);
  const rules = getRulesForDate(activeDateStr);
  const rates = rules.rates || {
    kesEmployer: 0.04,
    kesEmployee: 0.01,
    jhtEmployer: 0.037,
    jhtEmployee: 0.02,
    jpEmployer: 0.02,
    jpEmployee: 0.01,
    jkmEmployer: 0.003
  };

  // 1. BPJS Kesehatan (5% total: 4% Employer, 1% Employee)
  const kesBaseWage = Math.min(wage, rules.kesCap);
  const kesEmployer = Math.round(kesBaseWage * rates.kesEmployer);
  const kesEmployee = Math.round(kesBaseWage * rates.kesEmployee);
  const kesTotal = kesEmployer + kesEmployee;

  // 2. BPJS TK - JHT (5.7% total: 3.7% Employer, 2% Employee)
  const jhtEmployer = Math.round(wage * rates.jhtEmployer);
  const jhtEmployee = Math.round(wage * rates.jhtEmployee);
  const jhtTotal = jhtEmployer + jhtEmployee;

  // 3. BPJS TK - JP (3% total: 2% Employer, 1% Employee, Capped)
  const jpBaseWage = Math.min(wage, rules.jpCap);
  const jpEmployer = Math.round(jpBaseWage * rates.jpEmployer);
  const jpEmployee = Math.round(jpBaseWage * rates.jpEmployee);
  const jpTotal = jpEmployer + jpEmployee;

  // 4. BPJS TK - JKK (Employer Only)
  const jkkRates = rules.jkkRates || {
    very_low: 0.0024,
    low: 0.0054,
    medium: 0.0089,
    high: 0.0127,
    very_high: 0.0174
  };
  const jkkRate = jkkRates[jkkHazardLevel] || jkkRates.low;
  const jkkEmployer = Math.round(wage * jkkRate);

  // 5. BPJS TK - JKM (Employer Only 0.3%)
  const jkmEmployer = Math.round(wage * rates.jkmEmployer);

  const totalEmployer = kesEmployer + jhtEmployer + jpEmployer + jkkEmployer + jkmEmployer;
  const totalEmployee = kesEmployee + jhtEmployee + jpEmployee;

  return {
    baseWage: wage,
    calculationDate: activeDateStr,
    rulesetId: rules.rulesetId,
    rulesetVersion: rules.rulesetVersion,
    ruleset: {
      id: rules.rulesetId,
      version: rules.rulesetVersion,
      effectiveFrom: rules.effective_from,
      effectiveTo: rules.effective_to,
      source: rules.source
    },
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
