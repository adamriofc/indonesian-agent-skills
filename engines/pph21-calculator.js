/**
 * Deterministic PPh 21 Calculator Engine (PP 58/2023 & PMK 168/2023)
 * Supports both Monthly TER withholding (Jan-Nov) and December Annual Tax Reconciliation (Art. 17 UU PPh).
 */

// PTKP Values (Tahun Pajak 2024-2026)
const PTKP_VALUES = {
  'TK/0': 54000000,
  'TK/1': 58500000,
  'TK/2': 63000000,
  'TK/3': 67500000,
  'K/0': 58500000,
  'K/1': 63000000,
  'K/2': 67500000,
  'K/3': 72000000
};

// TER Kategori A Table (TK/0, TK/1, K/0)
const TER_A = [
  { max: 5400000, rate: 0.00 },
  { max: 5650000, rate: 0.0025 },
  { max: 5950000, rate: 0.0050 },
  { max: 6300000, rate: 0.0075 },
  { max: 6750000, rate: 0.0100 },
  { max: 7500000, rate: 0.0125 },
  { max: 8550000, rate: 0.0150 },
  { max: 9650000, rate: 0.0175 },
  { max: 10050000, rate: 0.0200 },
  { max: 10350000, rate: 0.0225 },
  { max: 10700000, rate: 0.0250 },
  { max: 11050000, rate: 0.0300 },
  { max: 11600000, rate: 0.0350 },
  { max: 12500000, rate: 0.0400 },
  { max: 13750000, rate: 0.0500 },
  { max: 15100000, rate: 0.0600 },
  { max: 16950000, rate: 0.0700 },
  { max: 19750000, rate: 0.0800 },
  { max: 24150000, rate: 0.0900 },
  { max: 26450000, rate: 0.1000 },
  { max: 28000000, rate: 0.1100 },
  { max: 30050000, rate: 0.1200 },
  { max: 32400000, rate: 0.1300 },
  { max: 35400000, rate: 0.1400 },
  { max: 39100000, rate: 0.1500 },
  { max: 43850000, rate: 0.1600 },
  { max: 47800000, rate: 0.1700 },
  { max: 51400000, rate: 0.1800 },
  { max: 56300000, rate: 0.1900 },
  { max: 62200000, rate: 0.2000 },
  { max: 68600000, rate: 0.2100 },
  { max: 77500000, rate: 0.2200 },
  { max: 89000000, rate: 0.2300 },
  { max: 103000000, rate: 0.2400 },
  { max: 125000000, rate: 0.2500 },
  { max: 157000000, rate: 0.2600 },
  { max: 206000000, rate: 0.2700 },
  { max: 337000000, rate: 0.2800 },
  { max: 454000000, rate: 0.2900 },
  { max: 550000000, rate: 0.3000 },
  { max: 695000000, rate: 0.3100 },
  { max: 910000000, rate: 0.3200 },
  { max: 1400000000, rate: 0.3300 },
  { max: Infinity, rate: 0.3400 }
];

// TER Kategori B Table (TK/2, TK/3, K/1, K/2)
const TER_B = [
  { max: 6200000, rate: 0.00 },
  { max: 6500000, rate: 0.0025 },
  { max: 6850000, rate: 0.0050 },
  { max: 7300000, rate: 0.0075 },
  { max: 9200000, rate: 0.0100 },
  { max: 10750000, rate: 0.0150 },
  { max: 12550000, rate: 0.0200 },
  { max: 14150000, rate: 0.0300 },
  { max: 16150000, rate: 0.0400 },
  { max: 18450000, rate: 0.0500 },
  { max: 20900000, rate: 0.0600 },
  { max: 24700000, rate: 0.0700 },
  { max: 28300000, rate: 0.0800 },
  { max: 31750000, rate: 0.0900 },
  { max: 35150000, rate: 0.1000 },
  { max: 38900000, rate: 0.1100 },
  { max: 43750000, rate: 0.1200 },
  { max: 48450000, rate: 0.1300 },
  { max: 53850000, rate: 0.1400 },
  { max: 59700000, rate: 0.1500 },
  { max: 66100000, rate: 0.1600 },
  { max: 75000000, rate: 0.1700 },
  { max: 86200000, rate: 0.1800 },
  { max: 99800000, rate: 0.1900 },
  { max: 120500000, rate: 0.2000 },
  { max: 150000000, rate: 0.2100 },
  { max: 195000000, rate: 0.2200 },
  { max: 315000000, rate: 0.2300 },
  { max: 433000000, rate: 0.2400 },
  { max: 524000000, rate: 0.2500 },
  { max: 663000000, rate: 0.2600 },
  { max: 868000000, rate: 0.2700 },
  { max: 1338000000, rate: 0.2800 },
  { max: Infinity, rate: 0.2900 }
];

// TER Kategori C Table (K/3)
const TER_C = [
  { max: 6600000, rate: 0.00 },
  { max: 6950000, rate: 0.0025 },
  { max: 7350000, rate: 0.0050 },
  { max: 7800000, rate: 0.0075 },
  { max: 8850000, rate: 0.0100 },
  { max: 9800000, rate: 0.0125 },
  { max: 10950000, rate: 0.0150 },
  { max: 12400000, rate: 0.0175 },
  { max: 13150000, rate: 0.0200 },
  { max: 14050000, rate: 0.0250 },
  { max: 15300000, rate: 0.0300 },
  { max: 16650000, rate: 0.0400 },
  { max: 18750000, rate: 0.0500 },
  { max: 21300000, rate: 0.0600 },
  { max: 24100000, rate: 0.0700 },
  { max: 27500000, rate: 0.0800 },
  { max: 31050000, rate: 0.0900 },
  { max: 34500000, rate: 0.1000 },
  { max: 38200000, rate: 0.1100 },
  { max: 42900000, rate: 0.1200 },
  { max: 47600000, rate: 0.1300 },
  { max: 53050000, rate: 0.1400 },
  { max: 58800000, rate: 0.1500 },
  { max: 65150000, rate: 0.1600 },
  { max: 73850000, rate: 0.1700 },
  { max: 84900000, rate: 0.1800 },
  { max: 98300000, rate: 0.1900 },
  { max: 118700000, rate: 0.2000 },
  { max: 147800000, rate: 0.2100 },
  { max: 192200000, rate: 0.2200 },
  { max: 310400000, rate: 0.2300 },
  { max: 426800000, rate: 0.2400 },
  { max: 516700000, rate: 0.2500 },
  { max: 654000000, rate: 0.2600 },
  { max: 855900000, rate: 0.2700 },
  { max: 1319000000, rate: 0.2800 },
  { max: Infinity, rate: 0.2900 }
];

function getTerCategory(ptkp) {
  const ptkpUpper = (ptkp || 'TK/0').toUpperCase().trim();
  if (['TK/0', 'TK/1', 'K/0'].includes(ptkpUpper)) return { category: 'A', table: TER_A };
  if (['TK/2', 'TK/3', 'K/1', 'K/2'].includes(ptkpUpper)) return { category: 'B', table: TER_B };
  if (['K/3'].includes(ptkpUpper)) return { category: 'C', table: TER_C };
  return { category: 'A', table: TER_A };
}

// Monthly TER Calculation (Jan-Nov)
function calculatePPh21Monthly(grossSalary, ptkpStatus = 'TK/0', hasNpwp = true) {
  const salary = Math.max(0, Number(grossSalary) || 0);
  const { category, table } = getTerCategory(ptkpStatus);

  let appliedRate = 0;
  for (const entry of table) {
    if (salary <= entry.max) {
      appliedRate = entry.rate;
      break;
    }
  }

  let baseWithholding = Math.round(salary * appliedRate);
  let penaltyApplied = false;

  if (!hasNpwp) {
    baseWithholding = Math.round(baseWithholding * 1.20);
    penaltyApplied = true;
  }

  return {
    grossSalary: salary,
    ptkpStatus: ptkpStatus.toUpperCase(),
    terCategory: category,
    effectiveRate: appliedRate,
    effectiveRatePercent: `${(appliedRate * 100).toFixed(2)}%`,
    hasNpwp,
    penaltyApplied,
    monthlyTaxWithheld: baseWithholding,
    statutoryReference: "PP No. 58/2023 & PMK No. 168/2023 (Masa Selain Masa Pajak Terakhir)"
  };
}

// Article 17 UU HPP Progressive Rates for Annual Tax
function calculateArticle17AnnualTax(netTaxableIncome) {
  let pkp = Math.max(0, Math.floor(Number(netTaxableIncome) / 1000) * 1000); // Rounded down to thousands
  if (pkp <= 0) return 0;

  let totalTax = 0;
  const brackets = [
    { limit: 60000000, rate: 0.05 },
    { limit: 250000000, rate: 0.15 },
    { limit: 500000000, rate: 0.25 },
    { limit: 5000000000, rate: 0.30 },
    { limit: Infinity, rate: 0.35 }
  ];

  let prevLimit = 0;
  for (const b of brackets) {
    if (pkp > prevLimit) {
      const taxableInBracket = Math.min(pkp - prevLimit, b.limit - prevLimit);
      totalTax += taxableInBracket * b.rate;
      prevLimit = b.limit;
    } else {
      break;
    }
  }

  return Math.round(totalTax);
}

// December Annual Reconciliation
function calculatePPh21DecemberReconciliation(annualGrossIncome, ptkpStatus = 'TK/0', janToNovTaxWithheld = 0, monthlyJhtEmployeeDeduction = 0, hasNpwp = true) {
  const annualGross = Math.max(0, Number(annualGrossIncome) || 0);
  const ptkpAmount = PTKP_VALUES[ptkpStatus.toUpperCase()] || PTKP_VALUES['TK/0'];

  // Biaya Jabatan: 5% of Gross, Max Rp 500.000/month or Rp 6.000.000/year
  const maxBiayaJabatanAnnual = 6000000;
  const calculatedBiayaJabatan = Math.min(annualGross * 0.05, maxBiayaJabatanAnnual);
  
  // Total Annual Deductions (Biaya Jabatan + JHT Employee)
  const annualJhtDeduction = Math.max(0, Number(monthlyJhtEmployeeDeduction) || 0) * 12;
  const totalDeductions = calculatedBiayaJabatan + annualJhtDeduction;

  const netAnnualIncome = Math.max(0, annualGross - totalDeductions);
  const pkp = Math.max(0, netAnnualIncome - ptkpAmount);

  let totalAnnualTax = calculateArticle17AnnualTax(pkp);
  if (!hasNpwp) {
    totalAnnualTax = Math.round(totalAnnualTax * 1.20);
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
    hasNpwp,
    statutoryReference: "PMK No. 168/2023 (Masa Pajak Terakhir / Rekonsiliasi Desember)"
  };
}

module.exports = {
  calculatePPh21Monthly,
  calculateArticle17AnnualTax,
  calculatePPh21DecemberReconciliation,
  getTerCategory,
  PTKP_VALUES
};
