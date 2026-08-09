/**
 * Deterministic BPJS Contribution Calculator Engine
 * Supports temporal rulesets (2024, 2025, 2026) for wage cap adjustments.
 */

// Temporal Rule Snapshots
const BPJS_RULES = {
  2024: { kesCap: 12000000, jpCap: 10042300 },
  2025: { kesCap: 12000000, jpCap: 10042300 },
  2026: { kesCap: 12000000, jpCap: 10042300 }
};

function calculateBpjs(baseWage, jkkHazardLevel = 'low', year = 2026) {
  const wage = Math.max(0, Number(baseWage) || 0);
  const rules = BPJS_RULES[year] || BPJS_RULES[2026];

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
    applicableYear: year,
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
    statutoryReference: "Perpres 64/2020 (Kes) & PP 44/2015, PP 45/2015 (TK)"
  };
}

module.exports = {
  calculateBpjs,
  BPJS_RULES
};
