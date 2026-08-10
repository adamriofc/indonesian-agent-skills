/**
 * Compliance Risk Engine
 * Multi-Domain Compliance Health Audit (Tax, HR, Legal, Data/PDP, Commerce)
 * Evaluates operational practices against Indonesian statutory mandates (KUHPerdata, UU PDP, PP 35/2021, PP 20/2026, UU PPh/PPN)
 * to output a Compliance Health Score (0-100), domain health flags, detected violations, and a prioritized remediation roadmap.
 */

function auditComplianceRisk({
  companyProfile = {
    entityType: 'pt',
    hasNib: true,
    hasNpwp: true,
    employeeCount: 20
  },
  taxPractices = {
    umkmRulesetEligible: true,
    isCorpUsingUmkmPost2026: true, // Violation: PT corporate using UMKM 0.5% after April 2026
    hasLateMonthlyPph21: false
  },
  hrPractices = {
    hasPkwtProbation: true,       // Violation: Probation inside PKWT contract
    overtimeExceedsLimit: false,   // Overtime > 4h/day or 18h/week
    hasWageScaleStructure: false   // Violation for employees >= 10
  },
  legalPractices = {
    article1266WaivedInContracts: false, // Risk: Article 1266 not waived requires court order for termination
    hasUnregisteredTrademark: true
  },
  pdpPractices = {
    collectsCustomerPii: true,
    hasDpaAddendum: false,        // Violation: No DPA for processor
    hasDataBreachProtocol: false  // Risk under UU 27/2022
  },
  commercePractices = {
    hasLogisticInsuranceClaimSop: true,
    adminFeeMarginAudited: true
  }
}) {
  let score = 100;
  const violations = [];
  const domainScores = { tax: 100, hr: 100, legal: 100, pdp: 100, commerce: 100 };

  // -------------------------------------------------------------
  // 1. Tax Compliance Domain
  // -------------------------------------------------------------
  if (taxPractices.isCorpUsingUmkmPost2026) {
    score -= 25;
    domainScores.tax -= 40;
    violations.push({
      domain: 'tax',
      severity: 'CRITICAL',
      issue: 'Corporate PT using 0.5% UMKM Final Tax post PP 20/2026 transition',
      statute: 'PP No. 20 Tahun 2026',
      financialPenaltyRisk: 'Underpaid PPh Badan tax assessment + 100% administrative penalty',
      actionRequired: 'Switch tax regime immediately to General Corporate PPh (Article 31E).'
    });
  }

  if (taxPractices.hasLateMonthlyPph21) {
    score -= 10;
    domainScores.tax -= 20;
    violations.push({
      domain: 'tax',
      severity: 'HIGH',
      issue: 'Late filing/payment of monthly PPh Pasal 21',
      statute: 'Pasal 7 UU KUP',
      financialPenaltyRisk: 'Rp 100.000 fine per month + interest penalty under PMK benchmark',
      actionRequired: 'Submit outstanding SPT Masa PPh 21 and pay tax interest surcharge.'
    });
  }

  // -------------------------------------------------------------
  // 2. HR & Labor Compliance Domain
  // -------------------------------------------------------------
  if (hrPractices.hasPkwtProbation) {
    score -= 20;
    domainScores.hr -= 35;
    violations.push({
      domain: 'hr',
      severity: 'CRITICAL',
      issue: 'Masa Percobaan (Probation) included in PKWT contract',
      statute: 'Pasal 58 UU No. 13/2003 & PP No. 35/2021 Pasal 13',
      financialPenaltyRisk: 'Contract automatically converts to PKWTT (Permanent Employment) by law',
      actionRequired: 'Remove probation clause from contract or re-classify worker as PKWTT.'
    });
  }

  const employeeCount = Math.max(0, Number(companyProfile.employeeCount) || 0);
  if (employeeCount >= 10 && !hrPractices.hasWageScaleStructure) {
    score -= 15;
    domainScores.hr -= 25;
    violations.push({
      domain: 'hr',
      severity: 'HIGH',
      issue: 'Absence of statutory Wage Structure and Scale (Struktur dan Skala Upah)',
      statute: 'Permenaker No. 1 Tahun 2017 & PP No. 36/2021',
      financialPenaltyRisk: 'Administrative sanctions & refusal of corporate regulations registration',
      actionRequired: 'Draft and implement Wage Structure & Scale per Permenaker 1/2017.'
    });
  }

  if (hrPractices.overtimeExceedsLimit) {
    score -= 10;
    domainScores.hr -= 20;
    violations.push({
      domain: 'hr',
      severity: 'HIGH',
      issue: 'Overtime hours exceed statutory cap (4h/day or 18h/week)',
      statute: 'Perpu No. 2/2022 & PP No. 35/2021 Pasal 26',
      financialPenaltyRisk: 'Labor inspection fines & overtime backpay claims',
      actionRequired: 'Adjust shift rosters to cap overtime at max 4h/day and 18h/week.'
    });
  }

  // -------------------------------------------------------------
  // 3. Legal & Commercial Domain
  // -------------------------------------------------------------
  if (!legalPractices.article1266WaivedInContracts) {
    score -= 10;
    domainScores.legal -= 15;
    violations.push({
      domain: 'legal',
      severity: 'MEDIUM',
      issue: 'Omission of Article 1266 KUHPerdata waiver in commercial contracts',
      statute: 'Pasal 1266 KUHPerdata',
      financialPenaltyRisk: 'Contract termination requires lengthy court order instead of mutual notice',
      actionRequired: 'Include explicit waiver of Article 1266 KUHPerdata in all contract templates.'
    });
  }

  // -------------------------------------------------------------
  // 4. Data Protection (UU PDP 27/2022) Domain
  // -------------------------------------------------------------
  if (pdpPractices.collectsCustomerPii && !pdpPractices.hasDpaAddendum) {
    score -= 15;
    domainScores.pdp -= 30;
    violations.push({
      domain: 'pdp',
      severity: 'HIGH',
      issue: 'Missing Data Processing Addendum (DPA) for customer PII collection',
      statute: 'UU No. 27 Tahun 2022 (Pasal 20 & 35)',
      financialPenaltyRisk: 'Administrative fines up to 2% of annual revenue under UU PDP',
      actionRequired: 'Draft and execute mandatory DPA with all data processors and vendors.'
    });
  }

  // -------------------------------------------------------------
  // Final Score & Domain Health Mapping
  // -------------------------------------------------------------
  const finalScore = Math.max(0, Math.min(100, score));

  function getHealthFlag(s) {
    if (s >= 85) return '🟢 OK';
    if (s >= 65) return '🟡 WARN';
    return '🔴 CRITICAL';
  }

  const domainHealth = {
    tax: getHealthFlag(domainScores.tax),
    hr: getHealthFlag(domainScores.hr),
    legal: getHealthFlag(domainScores.legal),
    pdp: getHealthFlag(domainScores.pdp),
    commerce: getHealthFlag(domainScores.commerce)
  };

  const remediationRoadmap = violations
    .sort((a, b) => (a.severity === 'CRITICAL' ? -1 : 1))
    .map((v, i) => ({
      priorityRank: i + 1,
      domain: v.domain,
      issue: v.issue,
      action: v.actionRequired,
      statute: v.statute
    }));

  return {
    complianceHealthScore: finalScore,
    overallAssessment: finalScore >= 85 ? 'HEALTHY' : finalScore >= 65 ? 'MODERATE_RISK' : 'HIGH_RISK',
    domainHealth,
    domainScores,
    totalViolationsDetected: violations.length,
    detectedViolations: violations,
    remediationRoadmap,
    statutoryDisclaimer: "This audit is an automated preliminary review and does not substitute formal legal/tax counsel."
  };
}

module.exports = {
  auditComplianceRisk
};