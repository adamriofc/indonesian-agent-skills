/**
 * Deterministic PPh 21 Calculator Engine (PP 58/2023 & PMK 168/2023)
 * Supports Monthly TER withholding (Jan-Nov) and December Annual Tax Reconciliation (Art. 17 UU PPh).
 * Dynamically evaluates rulesets loaded from engines/rules/pph21.json (Single Source of Truth).
 */

const pphRules = require('./rules/pph21.json');

function parseMaxLimit(val) {
  return val === 'Infinity' ? Infinity : Number(val);
}

function getTerCategory(ptkp) {
  const ptkpUpper = (ptkp || 'TK/0').toUpperCase().trim();
  if (pphRules.ter_categories.A.includes(ptkpUpper)) return { category: 'A', table: pphRules.ter_tables.A };
  if (pphRules.ter_categories.B.includes(ptkpUpper)) return { category: 'B', table: pphRules.ter_tables.B };
  if (pphRules.ter_categories.C.includes(ptkpUpper)) return { category: 'C', table: pphRules.ter_tables.C };
  return { category: 'A', table: pphRules.ter_tables.A };
}

// Monthly TER Calculation (Jan-Nov)
function calculatePPh21Monthly(grossSalary, ptkpStatus = 'TK/0', taxpayerIdentity = true) {
  const salary = Math.max(0, Number(grossSalary) || 0);
  const { category, table } = getTerCategory(ptkpStatus);

  // Normalize identity parameter (boolean or string enum)
  let isNPWPValid = true;
  let identityStatusStr = 'validated_nik_npwp';

  if (typeof taxpayerIdentity === 'boolean') {
    isNPWPValid = taxpayerIdentity;
    identityStatusStr = isNPWPValid ? 'validated_nik_npwp' : 'unvalidated';
  } else if (typeof taxpayerIdentity === 'string') {
    identityStatusStr = taxpayerIdentity.toLowerCase().trim();
    isNPWPValid = ['validated_nik_npwp', 'npwp', 'validated'].includes(identityStatusStr);
  }

  let appliedRate = 0;
  for (const entry of table) {
    const limit = parseMaxLimit(entry.max);
    if (salary <= limit) {
      appliedRate = entry.rate;
      break;
    }
  }

  let baseWithholding = Math.round(salary * appliedRate);
  let penaltyApplied = false;

  if (!isNPWPValid) {
    baseWithholding = Math.round(baseWithholding * pphRules.non_npwp_penalty_rate);
    penaltyApplied = true;
  }

  return {
    grossSalary: salary,
    ptkpStatus: ptkpStatus.toUpperCase(),
    terCategory: category,
    effectiveRate: appliedRate,
    effectiveRatePercent: `${(appliedRate * 100).toFixed(2)}%`,
    hasNpwp: isNPWPValid,
    identityStatus: identityStatusStr,
    penaltyApplied,
    monthlyTaxWithheld: baseWithholding,
    statutoryReference: pphRules.statute
  };
}

// Article 17 UU HPP Progressive Rates for Annual Tax
function calculateArticle17AnnualTax(netTaxableIncome) {
  let pkp = Math.max(0, Math.floor(Number(netTaxableIncome) / 1000) * 1000);
  if (pkp <= 0) return 0;

  let totalTax = 0;
  let prevLimit = 0;

  for (const b of pphRules.article_17_brackets) {
    const limit = parseMaxLimit(b.limit);
    if (pkp > prevLimit) {
      const taxableInBracket = Math.min(pkp - prevLimit, limit - prevLimit);
      totalTax += taxableInBracket * b.rate;
      prevLimit = limit;
    } else {
      break;
    }
  }

  return Math.round(totalTax);
}

// December Annual Reconciliation
function calculatePPh21DecemberReconciliation(annualGrossIncome, ptkpStatus = 'TK/0', janToNovTaxWithheld = 0, monthlyJhtEmployeeDeduction = 0, taxpayerIdentity = true) {
  const annualGross = Math.max(0, Number(annualGrossIncome) || 0);
  const ptkpAmount = pphRules.ptkp_thresholds[ptkpStatus.toUpperCase()] || pphRules.ptkp_thresholds['TK/0'];

  // Biaya Jabatan: 5% of Gross, Max Rp 500.000/month or Rp 6.000.000/year
  const calculatedBiayaJabatan = Math.min(annualGross * pphRules.biaya_jabatan.rate, pphRules.biaya_jabatan.annual_max);
  
  // Total Annual Deductions (Biaya Jabatan + JHT Employee)
  const annualJhtDeduction = Math.max(0, Number(monthlyJhtEmployeeDeduction) || 0) * 12;
  const totalDeductions = calculatedBiayaJabatan + annualJhtDeduction;

  const netAnnualIncome = Math.max(0, annualGross - totalDeductions);
  const pkp = Math.max(0, netAnnualIncome - ptkpAmount);

  let isNPWPValid = true;
  if (typeof taxpayerIdentity === 'boolean') {
    isNPWPValid = taxpayerIdentity;
  } else if (typeof taxpayerIdentity === 'string') {
    isNPWPValid = ['validated_nik_npwp', 'npwp', 'validated'].includes(taxpayerIdentity.toLowerCase().trim());
  }

  let totalAnnualTax = calculateArticle17AnnualTax(pkp);
  if (!isNPWPValid) {
    totalAnnualTax = Math.round(totalAnnualTax * pphRules.non_npwp_penalty_rate);
  }

  const decTaxToWithhold = Math.max(0, totalAnnualTax - Number(janToNovTaxWithheld));

  return {
    annualGrossIncome: annualGross,
    ptkpStatus: ptkpStatus.toUpperCase(),
    ptkpAmount,
    biayaJabatan: calculatedBiayaJabatan,
    annualJhtDeduction,
    netAnnualIncome,
    pkp,
    totalAnnualTaxArt17: totalAnnualTax,
    janToNovTaxWithheld: Number(janToNovTaxWithheld),
    decemberTaxWithheld: decTaxToWithhold,
    hasNpwp: isNPWPValid,
    statutoryReference: "PMK No. 168/2023 (Masa Pajak Terakhir / Rekonsiliasi Desember)"
  };
}

module.exports = {
  calculatePPh21Monthly,
  calculateArticle17AnnualTax,
  calculatePPh21DecemberReconciliation,
  getTerCategory,
  PTKP_VALUES: pphRules.ptkp_thresholds
};
