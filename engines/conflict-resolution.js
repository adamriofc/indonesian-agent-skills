/**
 * Multi-Factor Indonesian Statutory Conflict Resolution Engine
 * Implements the legal hierarchy under Pasal 7 & Pasal 8 UU No. 12/2011 jo. UU No. 13/2022.
 * Evaluates 5 Statutory Legal Principles with Scope, Temporal Applicability, & Explicit Repeal Evidence:
 *  1. Temporal Applicability (effectiveFromDate <= asOfDate check)
 *  2. Statutory Hierarchy (Pasal 7: UUD > TAP MPR > UU/Perpu > PP > Perpres > Perda)
 *  3. Delegated Authority & Ministerial Scope (Pasal 8: Permen / SE bound by statutory mandate)
 *  4. Lex Specialis Derogat Legi Generali (Specific subject-matter rule overrides general rule)
 *  5. Lex Posterior Derogat Legi Priori (Newer rule overrides older rule of equal rank and identical scope)
 *
 * Status Output: RESOLVED | CONDITIONAL | NOT_YET_EFFECTIVE | UNRESOLVED_REQUIRES_LEGAL_COUNSEL
 */

const PASAL_7_FORMAL_HIERARCHY = {
  UUD1945: 7,
  TAP_MPR: 6,
  UU: 5,
  PERPU: 5,
  PP: 4,
  PERPRES: 3,
  PERDA_PROVINSI: 2,
  PERDA_KABUPATEN: 1
};

const PASAL_8_DELEGATED_REGULATIONS = ['PERMEN', 'PERATURAN_LEMBAGA', 'SURAT_EDARAN'];

function resolveStatutoryConflict({
  ruleA = { id: 'PP35-2021', statuteType: 'PP', year: 2021, title: 'PP 35/2021 tentang PKWT & PHK', isSpecialRule: false, subjectMatterScope: 'EMPLOYMENT_TERMINATION', explicitRepeal: true, effectiveFromDate: '2021-02-02' },
  ruleB = { id: 'PERMEN-06-2016', statuteType: 'PERMEN', year: 2016, title: 'Permenaker 6/2016 tentang THR', isSpecialRule: true, subjectMatterScope: 'THR_HOLIDAY_ALLOWANCE', explicitRepeal: false, effectiveFromDate: '2016-03-08' },
  asOfDate = '2026-08-12'
}) {
  const evalDate = String(asOfDate || new Date().toISOString().slice(0, 10)).trim();

  // Check temporal applicability for ruleA and ruleB
  const effectiveA = ruleA.effectiveFromDate || `${ruleA.year || 2021}-01-01`;
  const effectiveB = ruleB.effectiveFromDate || `${ruleB.year || 2016}-01-01`;

  if (effectiveA > evalDate) {
    return {
      status: 'NOT_YET_EFFECTIVE',
      conflictDetected: false,
      resolutionPrinciple: 'TEMPORAL_INAPPLICABILITY',
      principlesApplied: ['TEMPORAL_INAPPLICABILITY'],
      prevailingRule: ruleB,
      supersededRule: ruleA,
      reasoning: `Statute '${ruleA.title}' is not yet effective as of ${evalDate} (Effective Date: ${effectiveA}). '${ruleB.title}' remains applicable.`,
      statutoryFramework: "Pasal 7 & Pasal 8 UU No. 12 Tahun 2011 jo. UU No. 13 Tahun 2022"
    };
  }

  if (effectiveB > evalDate) {
    return {
      status: 'NOT_YET_EFFECTIVE',
      conflictDetected: false,
      resolutionPrinciple: 'TEMPORAL_INAPPLICABILITY',
      principlesApplied: ['TEMPORAL_INAPPLICABILITY'],
      prevailingRule: ruleA,
      supersededRule: ruleB,
      reasoning: `Statute '${ruleB.title}' is not yet effective as of ${evalDate} (Effective Date: ${effectiveB}). '${ruleA.title}' remains applicable.`,
      statutoryFramework: "Pasal 7 & Pasal 8 UU No. 12 Tahun 2011 jo. UU No. 13 Tahun 2022"
    };
  }

  const typeA = (ruleA.statuteType || '').toUpperCase().trim();
  const typeB = (ruleB.statuteType || '').toUpperCase().trim();

  const rankA = PASAL_7_FORMAL_HIERARCHY[typeA] || (PASAL_8_DELEGATED_REGULATIONS.includes(typeA) ? 1.5 : 1);
  const rankB = PASAL_7_FORMAL_HIERARCHY[typeB] || (PASAL_8_DELEGATED_REGULATIONS.includes(typeB) ? 1.5 : 1);

  const isSpecialA = Boolean(ruleA.isSpecialRule);
  const isSpecialB = Boolean(ruleB.isSpecialRule);

  const scopeA = (ruleA.subjectMatterScope || 'GENERAL').toUpperCase().trim();
  const scopeB = (ruleB.subjectMatterScope || 'GENERAL').toUpperCase().trim();
  const sameScope = scopeA === scopeB;

  let status = 'RESOLVED';
  let prevailingRule = ruleA;
  let supersededRule = ruleB;
  let resolutionPrinciple = 'LEX_SUPERIOR_DEROGAT_LEGI_INFERIORI';
  let reasoning = '';
  const principlesApplied = [];

  // 1. Explicit Statutory Repeal Check
  if (ruleA.explicitRepeal && ruleA.repealedRuleId === ruleB.id) {
    status = 'RESOLVED';
    prevailingRule = ruleA;
    supersededRule = ruleB;
    resolutionPrinciple = 'EXPLICIT_STATUTORY_REPEAL';
    principlesApplied.push('EXPLICIT_STATUTORY_REPEAL');
    reasoning = `Statute '${ruleA.title}' explicitly repeals '${ruleB.title}'.`;
  } else if (ruleB.explicitRepeal && ruleB.repealedRuleId === ruleA.id) {
    status = 'RESOLVED';
    prevailingRule = ruleB;
    supersededRule = ruleA;
    resolutionPrinciple = 'EXPLICIT_STATUTORY_REPEAL';
    principlesApplied.push('EXPLICIT_STATUTORY_REPEAL');
    reasoning = `Statute '${ruleB.title}' explicitly repeals '${ruleA.title}'.`;
  }
  // 2. Lex Specialis check
  else if (isSpecialA && !isSpecialB && rankA >= rankB) {
    status = 'RESOLVED';
    prevailingRule = ruleA;
    supersededRule = ruleB;
    resolutionPrinciple = 'LEX_SPECIALIS_DEROGAT_LEGI_GENERALI';
    principlesApplied.push('LEX_SPECIALIS_DEROGAT_LEGI_GENERALI');
    reasoning = `Rule '${ruleA.title}' is a specific subject-matter regulation (Lex Specialis) for scope '${scopeA}' and prevails over general rule '${ruleB.title}'.`;
  } else if (isSpecialB && !isSpecialA && rankB >= rankA) {
    status = 'RESOLVED';
    prevailingRule = ruleB;
    supersededRule = ruleA;
    resolutionPrinciple = 'LEX_SPECIALIS_DEROGAT_LEGI_GENERALI';
    principlesApplied.push('LEX_SPECIALIS_DEROGAT_LEGI_GENERALI');
    reasoning = `Rule '${ruleB.title}' is a specific subject-matter regulation (Lex Specialis) for scope '${scopeB}' and prevails over general rule '${ruleA.title}'.`;
  }
  // 3. Formal Hierarchy (Pasal 7 UU 12/2011)
  else if (rankA !== rankB) {
    principlesApplied.push('LEX_SUPERIOR_DEROGAT_LEGI_INFERIORI');
    if (rankA > rankB) {
      status = 'RESOLVED';
      prevailingRule = ruleA;
      supersededRule = ruleB;
      reasoning = `Statute '${ruleA.title}' (${ruleA.statuteType}) outranks '${ruleB.title}' (${ruleB.statuteType}) under Pasal 7 UU No. 12/2011 hierarchy.`;
    } else {
      status = 'RESOLVED';
      prevailingRule = ruleB;
      supersededRule = ruleA;
      reasoning = `Statute '${ruleB.title}' (${ruleB.statuteType}) outranks '${ruleA.title}' (${ruleA.statuteType}) under Pasal 7 UU No. 12/2011 hierarchy.`;
    }
  }
  // 4. Lex Posterior (Same rank and identical subject matter scope)
  else if (sameScope) {
    resolutionPrinciple = 'LEX_POSTERIORI_DEROGAT_LEGI_PRIORI';
    principlesApplied.push('LEX_POSTERIORI_DEROGAT_LEGI_PRIORI');

    if (effectiveA !== effectiveB) {
      status = 'RESOLVED';
      if (effectiveA > effectiveB) {
        prevailingRule = ruleA;
        supersededRule = ruleB;
        reasoning = `Newer statute '${ruleA.title}' (Effective: ${effectiveA}) supersedes older rule '${ruleB.title}' (Effective: ${effectiveB}) at equal rank and scope ('${scopeA}') under Lex Posterior.`;
      } else {
        prevailingRule = ruleB;
        supersededRule = ruleA;
        reasoning = `Newer statute '${ruleB.title}' (Effective: ${effectiveB}) supersedes older rule '${ruleA.title}' (Effective: ${effectiveA}) at equal rank and scope ('${scopeB}') under Lex Posterior.`;
      }
    } else {
      status = 'CONDITIONAL';
      resolutionPrinciple = 'UNRESOLVED_REQUIRES_LEGAL_COUNSEL';
      reasoning = `Conflicting rules '${ruleA.title}' and '${ruleB.title}' share identical rank (${ruleA.statuteType}), scope ('${scopeA}'), and effective date (${effectiveA}). Resolution requires formal legal opinion by qualified advocate.`;
    }
  } else {
    // Different scopes at equal rank without explicit repeal: CONDITIONAL
    status = 'CONDITIONAL';
    resolutionPrinciple = 'DIFFERENT_SUBJECT_MATTER_SCOPES';
    reasoning = `Rules '${ruleA.title}' (Scope: '${scopeA}') and '${ruleB.title}' (Scope: '${scopeB}') share equal rank but differ in subject-matter scope. Both remain applicable in their respective domains.`;
  }

  return {
    status, // RESOLVED | CONDITIONAL | NOT_YET_EFFECTIVE | UNRESOLVED_REQUIRES_LEGAL_COUNSEL
    conflictDetected: status !== 'NOT_YET_EFFECTIVE',
    resolutionPrinciple,
    principlesApplied,
    prevailingRule,
    supersededRule,
    reasoning,
    statutoryFramework: "Pasal 7 & Pasal 8 UU No. 12 Tahun 2011 jo. UU No. 13 Tahun 2022 (Pembentukan Peraturan Perundang-Undangan)"
  };
}

module.exports = {
  PASAL_7_FORMAL_HIERARCHY,
  PASAL_8_DELEGATED_REGULATIONS,
  resolveStatutoryConflict
};