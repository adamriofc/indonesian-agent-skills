/**
 * Deterministic PKWTT (Permanent Employment Contract) Compliance & Conversion Calculator Engine
 * Audits PKWTT/PKWT employment contracts against statutory labor rules under PP No. 35/2021 & UU No. 6/2023 (Cipta Kerja).
 * Evaluates probation limits (max 3 months), auto-conversion triggers, minimum wage compliance, and permanent entitlements.
 */

function auditPkwttStatus({
  monthlyWage = 0,
  probationMonths = 0,
  minimumWage = 0,
  jobType = 'permanent',
  contractType = 'pkwtt',
  totalTenureMonths = 0,
  isRegisteredKemnaker = true
}) {
  const wage = Math.max(0, Number(monthlyWage) || 0);
  const minWage = Math.max(0, Number(minimumWage) || 0);
  const probation = Math.max(0, Number(probationMonths) || 0);
  const tenure = Math.max(0, Number(totalTenureMonths) || 0);
  const contract = (contractType || 'pkwtt').toLowerCase().trim();
  const job = (jobType || 'permanent').toLowerCase().trim();

  const violations = [];
  const conversionTriggers = [];
  let isConvertedToPkwttByLaw = false;
  let statusReason = "Compliant contract status.";

  // 1. Probation Period Audit (PP 35/2021 Pasal 13 & UU 6/2023)
  let validProbationMonths = 0;
  if (contract === 'pkwt') {
    if (probation > 0) {
      violations.push("Probation clause is strictly prohibited in PKWT contract (PP 35/2021 Pasal 13).");
      conversionTriggers.push("PROBATION_IN_PKWT");
      isConvertedToPkwttByLaw = true;
    }
  } else {
    // PKWTT contract
    if (probation > 3) {
      violations.push(`Probation period of ${probation} months exceeds statutory 3-month limit (PP 35/2021 Pasal 13).`);
      validProbationMonths = 3;
    } else {
      validProbationMonths = probation;
    }
  }

  // 2. Job Nature Audit (PP 35/2021 Pasal 4: Core/Permanent vs Temporary)
  const isPermanentJob = job === 'permanent' || job === 'core_production' || job === 'tetap' || job === 'inti';
  if (contract === 'pkwt' && isPermanentJob) {
    violations.push("PKWT contract cannot be executed for work of a permanent or core production nature (PP 35/2021 Pasal 4).");
    conversionTriggers.push("PERMANENT_JOB_IN_PKWT");
    isConvertedToPkwttByLaw = true;
  }

  // 3. Maximum Tenure Boundary Audit (PP 35/2021 Pasal 8: Max 5 years / 60 months cumulative)
  if (contract === 'pkwt' && tenure > 60) {
    violations.push(`Cumulative PKWT tenure of ${tenure} months exceeds statutory 5-year limit (60 months) per PP 35/2021 Pasal 8.`);
    conversionTriggers.push("TENURE_EXCEEDED_5_YEARS");
    isConvertedToPkwttByLaw = true;
  }

  // 4. Registration Audit
  if (contract === 'pkwt' && !isRegisteredKemnaker) {
    violations.push("PKWT contract is not registered with Ministry of Manpower (Kemnaker) portal.");
    conversionTriggers.push("UNREGISTERED_PKWT");
    isConvertedToPkwttByLaw = true;
  }

  // 5. Minimum Wage Compliance Audit
  const meetsMinimumWage = minWage > 0 ? wage >= minWage : true;
  if (!meetsMinimumWage) {
    violations.push(`Monthly wage (Rp ${wage.toLocaleString('id-ID')}) is below statutory minimum wage UMP/UMK (Rp ${minWage.toLocaleString('id-ID')}).`);
  }

  // Effective Status & Rights Determination
  const finalStatus = (contract === 'pkwtt' || isConvertedToPkwttByLaw) ? 'PKWTT (Permanent Employment)' : 'PKWT (Contract Employment)';

  if (isConvertedToPkwttByLaw) {
    statusReason = `Contract automatically converts to PKWTT (Permanent) by operation of law due to statutory violations: ${conversionTriggers.join(', ')}.`;
  } else if (contract === 'pkwtt') {
    statusReason = "Valid PKWTT (Permanent Employment Contract).";
  }

  return {
    originalContractType: contract.toUpperCase(),
    effectiveContractStatus: finalStatus,
    isConvertedToPkwttByLaw,
    conversionTriggers,
    jobType: job,
    totalTenureMonths: tenure,
    monthlyWage: wage,
    meetsMinimumWage,
    probationAudit: {
      probationMonths: probation,
      validProbationMonths,
      isCompliant: contract === 'pkwtt' ? probation <= 3 : probation === 0
    },
    statutoryEntitlements: {
      severanceEligibleOnPHK: true, // PKWTT is entitled to UP, UPMK, UPH upon termination
      pensionEligible: true,
      bpjsKetenagakerjaan: ["JHT", "JP", "JKK", "JKM"],
      bpjsKesehatan: true,
      annualPaidLeaveDays: 12,
      thrKeagamaanEligible: true
    },
    violationsCount: violations.length,
    violations,
    statusReason,
    statutoryReference: "PP No. 35/2021 (Pasal 4, 8, 13) & UU No. 6/2023"
  };
}

module.exports = {
  auditPkwttStatus
};
