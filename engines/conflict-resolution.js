/**
 * Multi-Factor Indonesian Statutory Conflict Resolution Engine
 * Implements the legal hierarchy under Pasal 7 & Pasal 8 UU No. 12/2011 jo. UU No. 13/2022.
 * Evaluates 4 Statutory Legal Principles with Scope & Explicit Repeal Evidence:
 *  1. Statutory Hierarchy (Pasal 7: UUD > TAP MPR > UU/Perpu > PP > Perpres > Perda)
 *  2. Delegated Authority & Ministerial Scope (Pasal 8: Permen / SE bound by statutory mandate)
 *  3. Lex Specialis Derogat Legi Generali (Specific subject-matter rule overrides general rule)
 *  4. Lex Posterior Derogat Legi Priori (Newer rule overrides older rule of equal rank and identical scope)
 *
 * Status Output: RESOLVED | CONDITIONAL | UNRESOLVED_REQUIRES_LEGAL_COUNSEL
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
  ruleA = { id: 'PP35-2021', statuteType: 'PP', year: 2021, title: 'PP 35/2021 tentang PKWT & PHK', isSpecialRule: false, subjectMatterScope: 'EMPLOYMENT_TERMINATION', explicitRepeal: true },
  ruleB = { id: 'PERMEN-06-2016', statuteType: 'PERMEN', year: 2016, title: 'Permenaker 6/2016 tentang THR', isSpecialRule: true, subjectMatterScope: 'THR_HOLIDAY_ALLOWANCE', explicitRepeal: false }
}) {
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
  // 2. Lex Specialis check (Specific subject matter overrides general matter if rank is comparable or delegated)
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
    const yearA = Number(ruleA.year) || 0;
    const yearB = Number(ruleB.year) || 0;
    resolutionPrinciple = 'LEX_POSTERIORI_DEROGAT_LEGI_PRIORI';
    principlesApplied.push('LEX_POSTERIORI_DEROGAT_LEGI_PRIORI');

    if (yearA !== yearB) {
      status = 'RESOLVED';
      if (yearA > yearB) {
        prevailingRule = ruleA;
        supersededRule = ruleB;
        reasoning = `Newer statute '${ruleA.title}' (${ruleA.year}) supersedes older rule '${ruleB.title}' (${ruleB.year}) at equal rank and scope ('${scopeA}') under Lex Posterior.`;
      } else {
        prevailingRule = ruleB;
        supersededRule = ruleA;
        reasoning = `Newer statute '${ruleB.title}' (${ruleB.year}) supersedes older rule '${ruleA.title}' (${ruleA.year}) at equal rank and scope ('${scopeB}') under Lex Posterior.`;
      }
    } else {
      status = 'CONDITIONAL';
      resolutionPrinciple = 'UNRESOLVED_REQUIRES_LEGAL_COUNSEL';
      reasoning = `Conflicting rules '${ruleA.title}' and '${ruleB.title}' share identical rank (${ruleA.statuteType}), scope ('${scopeA}'), and publication year (${ruleA.year}). Resolution requires formal legal opinion by qualified advocate.`;
    }
  } else {
    // Different scopes at equal rank without explicit repeal: CONDITIONAL
    status = 'CONDITIONAL';
    resolutionPrinciple = 'DIFFERENT_SUBJECT_MATTER_SCOPES';
    reasoning = `Rules '${ruleA.title}' (Scope: '${scopeA}') and '${ruleB.title}' (Scope: '${scopeB}') share equal rank but differ in subject-matter scope. Both remain applicable in their respective domains.`;
  }

  return {
    status, // RESOLVED | CONDITIONAL | UNRESOLVED_REQUIRES_LEGAL_COUNSEL
    conflictDetected: true,
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