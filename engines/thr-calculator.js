/**
 * Deterministic THR Payout Engine (Permenaker No. 6/2016)
 * Calculates statutory religious holiday allowance.
 */

function calculateThr(monthlyBaseSalary, fixedAllowance = 0, tenureMonths = 12) {
  const salary = Math.max(0, Number(monthlyBaseSalary) || 0);
  const allowance = Math.max(0, Number(fixedAllowance) || 0);
  const tenure = Math.max(0, Number(tenureMonths) || 0);

  const totalMonthlyWage = salary + allowance;

  if (tenure < 1) {
    return {
      isEligible: false,
      tenureMonths: tenure,
      reason: "Continuous service period is less than 1 month (Permenaker 6/2016 Art. 2)",
      thrPayout: 0
    };
  }

  let finalPayout = 0;
  let calculationFormula = "";

  if (tenure >= 12) {
    finalPayout = totalMonthlyWage;
    calculationFormula = "1 x (Gaji Pokok + Tunjangan Tetap)";
  } else {
    finalPayout = Math.round((tenure / 12) * totalMonthlyWage);
    calculationFormula = `(${tenure} / 12) x (Gaji Pokok + Tunjangan Tetap)`;
  }

  return {
    isEligible: true,
    tenureMonths: tenure,
    monthlyBaseSalary: salary,
    fixedAllowance: allowance,
    totalMonthlyWage,
    calculationFormula,
    statutoryThrPayout: finalPayout,
    statutoryReference: "Permenaker No. 6 Tahun 2016"
  };
}

module.exports = {
  calculateThr
};
