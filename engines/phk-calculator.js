/**
 * Deterministic PHK Severance Payout Engine (PP No. 35/2021)
 * Calculates statutory Uang Pesangon (UP), Uang Penghargaan Masa Kerja (UPMK), and UPH.
 */

function getPesangonBaseMultiplier(tenureYears) {
  if (tenureYears < 1) return 1;
  if (tenureYears < 2) return 2;
  if (tenureYears < 3) return 3;
  if (tenureYears < 4) return 4;
  if (tenureYears < 5) return 5;
  if (tenureYears < 6) return 6;
  if (tenureYears < 7) return 7;
  if (tenureYears < 8) return 8;
  return 9; // Max 9 months wage for 8+ years
}

function getUpmkMultiplier(tenureYears) {
  if (tenureYears < 3) return 0;
  if (tenureYears < 6) return 2;
  if (tenureYears < 9) return 3;
  if (tenureYears < 12) return 4;
  if (tenureYears < 15) return 5;
  if (tenureYears < 18) return 6;
  if (tenureYears < 21) return 7;
  if (tenureYears < 24) return 8;
  return 10; // Max 10 months wage for 24+ years
}

const REASON_MULTIPLIERS = {
  efficiency_loss: { up: 0.5, upmk: 1.0, description: "Efisiensi karena mengalami kerugian (Art. 43)" },
  efficiency_prevent_loss: { up: 1.0, upmk: 1.0, description: "Efisiensi untuk mencegah kerugian (Art. 43)" },
  merger_employee_reject: { up: 0.5, upmk: 1.0, description: "Penggabungan/Peleburan (Pekerja menolak) (Art. 41)" },
  merger_employer_reject: { up: 1.0, upmk: 1.0, description: "Penggabungan/Peleburan (Pengusaha menolak) (Art. 41)" },
  bankruptcy: { up: 0.5, upmk: 1.0, description: "Kepailitan Perusahaan (Art. 44)" },
  force_majeure: { up: 0.5, upmk: 1.0, description: "Keadaan Memaksa / Force Majeure (Art. 45)" },
  retirement: { up: 1.75, upmk: 1.0, description: "Memasuki Usia Pensiun (Art. 56)" },
  major_violation: { up: 0.0, upmk: 0.0, description: "Pelanggaran Berat / SP3 Tidak Diindahkan (Art. 52)" },
  resignation: { up: 0.0, upmk: 0.0, description: "Pengunduran Diri Atas Kemauan Sendiri (Art. 50)" }
};

function calculatePhk(monthlyWage, tenureYears, reasonKey = 'efficiency_loss', remainingLeaveDays = 0) {
  const wage = Math.max(0, Number(monthlyWage) || 0);
  const tenure = Math.max(0, Number(tenureYears) || 0);
  const leaveDays = Math.max(0, Number(remainingLeaveDays) || 0);

  const reason = REASON_MULTIPLIERS[reasonKey] || REASON_MULTIPLIERS.efficiency_loss;

  const baseUpMonths = getPesangonBaseMultiplier(tenure);
  const baseUpmkMonths = getUpmkMultiplier(tenure);

  const finalUpMultiplier = baseUpMonths * reason.up;
  const finalUpmkMultiplier = baseUpmkMonths * reason.upmk;

  const pesangonAmount = Math.round(finalUpMultiplier * wage);
  const upmkAmount = Math.round(finalUpmkMultiplier * wage);

  // UPH: Unused Leave Days Calculation (Daily wage = wage / 25 working days)
  const leavePayout = Math.round((leaveDays / 25) * wage);
  const uphTotal = leavePayout;

  const totalSeverance = pesangonAmount + upmkAmount + uphTotal;

  return {
    monthlyWage: wage,
    tenureYears: tenure,
    reasonKey,
    reasonDescription: reason.description,
    breakdown: {
      uangPesangon: {
        baseMonths: baseUpMonths,
        reasonMultiplier: reason.up,
        finalMultiplier: finalUpMultiplier,
        amount: pesangonAmount
      },
      uangPenghargaanMasaKerja: {
        baseMonths: baseUpmkMonths,
        reasonMultiplier: reason.upmk,
        finalMultiplier: finalUpmkMultiplier,
        amount: upmkAmount
      },
      uangPenggantianHak: {
        unusedLeaveDays: leaveDays,
        leavePayoutAmount: leavePayout,
        totalUphAmount: uphTotal
      }
    },
    totalPayout: totalSeverance,
    statutoryReference: "PP No. 35 Tahun 2021 Pasal 40-52"
  };
}

module.exports = {
  calculatePhk,
  REASON_MULTIPLIERS
};
