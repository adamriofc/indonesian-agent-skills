/**
 * Regulatory Change Intelligence Engine
 * Evaluates regulatory transitions (e.g., PP 55/2022 -> PP 20/2026, BPJS wage cap updates)
 * against a specific company profile to compute business impact, affected domains,
 * required action checklists, and compliance deadlines.
 */

const { compareRulesets } = require('./regulatory-diff');

function analyzeRegulatoryImpact({
  domain = 'umkm',
  fromRuleset = 'UMKM-2022',
  toRuleset = 'UMKM-2026',
  companyProfile = {
    entityType: 'corporate', // 'individual', 'corporate', 'perseroan_perorangan', 'cv', 'koperasi'
    annualRevenue: 5000000000,
    employeeCount: 15,
    hasMarketplacePresence: true
  }
}) {
  const diff = compareRulesets(domain, fromRuleset, toRuleset);
  const entityType = (companyProfile.entityType || 'corporate').toLowerCase().trim();
  const revenue = Math.max(0, Number(companyProfile.annualRevenue) || 0);

  const affectedDomains = [];
  const actionChecklist = [];
  let impactLevel = 'LOW';
  let overallReason = 'No critical statutory impact detected for current company profile.';

  if (domain === 'umkm') {
    affectedDomains.push('tax', 'finance');
    
    // Check PP 20/2026 Ineligibility Triggers
    const isCorpIneligible = ['corporate', 'pt', 'cv', 'firma'].includes(entityType);
    const isRevenueOverLimit = revenue > 4800000000;

    if (isCorpIneligible || isRevenueOverLimit) {
      impactLevel = 'HIGH';
      if (isCorpIneligible && isRevenueOverLimit) {
        overallReason = `Company entity '${entityType}' is excluded from 0.5% UMKM final tax under PP 20/2026, and annual revenue (Rp ${revenue.toLocaleString('id-ID')}) exceeds the Rp 4.8B UMKM ceiling. Mandatory transition to General PPh (Pasal 31E corporate tax at 11%/22%) is required.`;
      } else if (isCorpIneligible) {
        overallReason = `Corporate entity '${entityType}' is no longer eligible for 0.5% UMKM final tax under PP 20/2026 (effective April 22, 2026). Must switch to General Corporate PPh (Article 31E).`;
      } else {
        overallReason = `Annual revenue (Rp ${revenue.toLocaleString('id-ID')}) exceeds the statutory Rp 4.8B UMKM threshold under PP 20/2026. Must transition to General PPh regime.`;
      }

      actionChecklist.push(
        {
          step: 1,
          domain: 'tax',
          action: 'Revoke UMKM Tax Status & Register for General PPh Regime',
          deadline: diff.effectiveTransitionDate,
          priority: 'HIGH',
          reference: 'PP No. 20 Tahun 2026 & Pasal 31E UU PPh'
        },
        {
          step: 2,
          domain: 'finance',
          action: 'Switch bookkeeping from Simple Cash Basis to Full Accrual SAK EMKM / SAK EP Financial Statements',
          deadline: diff.effectiveTransitionDate,
          priority: 'HIGH',
          reference: 'Pasal 28 UU KUP'
        },
        {
          step: 3,
          domain: 'tax',
          action: 'Calculate PPh Pasal 25 Monthly Corporate Tax Installments',
          deadline: diff.effectiveTransitionDate,
          priority: 'MEDIUM',
          reference: 'Pasal 25 UU PPh'
        }
      );
    } else {
      impactLevel = 'MEDIUM';
      overallReason = `Individual / PT Perorangan entity '${entityType}' remains eligible under PP 20/2026, but must audit non-taxable Rp 500M annual threshold utilization.`;
      
      actionChecklist.push(
        {
          step: 1,
          domain: 'tax',
          action: 'Audit YTD gross turnover against Rp 500M non-taxable threshold exemption',
          deadline: diff.effectiveTransitionDate,
          priority: 'MEDIUM',
          reference: 'PP No. 55/2022 & PP No. 20/2026'
        }
      );
    }
  } else if (domain === 'bpjs') {
    affectedDomains.push('hr', 'tax', 'payroll');
    impactLevel = 'MEDIUM';
    overallReason = `BPJS JP wage cap transition effective ${diff.effectiveTransitionDate}. Monthly payroll withholding thresholds must be updated.`;

    actionChecklist.push(
      {
        step: 1,
        domain: 'payroll',
        action: 'Update payroll system BPJS JP wage cap ceiling to new statutory limit',
        deadline: diff.effectiveTransitionDate,
        priority: 'HIGH',
        reference: 'Perpres 64/2020 & SE BPJS Ketenagakerjaan'
      },
      {
        step: 2,
        domain: 'hr',
        action: 'Reconcile employer vs employee BPJS deduction splits in monthly SIPP filing',
        deadline: diff.effectiveTransitionDate,
        priority: 'MEDIUM',
        reference: 'PP 45/2015'
      }
    );
  } else {
    affectedDomains.push(domain);
    overallReason = `Transition between ${fromRuleset} and ${toRuleset} evaluated.`;
  }

  return {
    domain,
    fromRuleset,
    toRuleset,
    effectiveTransitionDate: diff.effectiveTransitionDate,
    companyProfile: {
      entityType,
      annualRevenue: revenue,
      employeeCount: Math.max(0, Number(companyProfile.employeeCount) || 0)
    },
    impactLevel,
    affectedDomains,
    totalChangesIdentified: diff.totalChanges,
    overallReason,
    actionChecklist,
    statutoryFramework: diff.newRuleset ? diff.newRuleset.statute : "Indonesian Statutory Regulations"
  };
}

module.exports = {
  analyzeRegulatoryImpact
};