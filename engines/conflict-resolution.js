/**
 * Indonesian Legal Hierarchy & Statutory Conflict Resolution Engine
 * Implements the official statutory hierarchy under UU No. 12/2011 jo. UU No. 13/2022:
 * UUD 1945 > UU / Perpu > PP > Perpres > Perda > Permen / Surat Edaran (SE)
 * Applies the Lex Superior Derogat Legi Inferiori & Lex Posteriori Derogat Legi Priori principles.
 */

const LEGAL_HIERARCHY_RANK = {
  UUD1945: 7,
  UU: 6,
  PERPU: 6,
  PP: 5,
  PERPRES: 4,
  PERDA: 3,
  PERMEN: 2,
  SURAT_EDARAN: 1
};

function resolveStatutoryConflict({
  ruleA = { id: 'PP35-2021', statuteType: 'PP', hierarchyRank: 5, year: 2021, title: 'PP 35/2021 tentang PKWT & PHK' },
  ruleB = { id: 'PERMEN-06-2016', statuteType: 'PERMEN', hierarchyRank: 2, year: 2016, title: 'Permenaker 6/2016 tentang THR' }
}) {
  const rankA = LEGAL_HIERARCHY_RANK[(ruleA.statuteType || '').toUpperCase()] || ruleA.hierarchyRank || 1;
  const rankB = LEGAL_HIERARCHY_RANK[(ruleB.statuteType || '').toUpperCase()] || ruleB.hierarchyRank || 1;

  let prevailingRule = ruleA;
  let supersededRule = ruleB;
  let resolutionPrinciple = 'LEX_SUPERIOR_DEROGAT_LEGI_INFERIORI';
  let reasoning = '';

  if (rankA > rankB) {
    prevailingRule = ruleA;
    supersededRule = ruleB;
    reasoning = `Statute '${ruleA.title}' (${ruleA.statuteType}) outranks '${ruleB.title}' (${ruleB.statuteType}) under UU No. 12/2011 statutory hierarchy.`;
  } else if (rankB > rankA) {
    prevailingRule = ruleB;
    supersededRule = ruleA;
    reasoning = `Statute '${ruleB.title}' (${ruleB.statuteType}) outranks '${ruleA.title}' (${ruleA.statuteType}) under UU No. 12/2011 statutory hierarchy.`;
  } else {
    // Equal rank: apply Lex Posteriori (newer year prevails)
    const yearA = Number(ruleA.year) || 0;
    const yearB = Number(ruleB.year) || 0;
    resolutionPrinciple = 'LEX_POSTERIORI_DEROGAT_LEGI_PRIORI';

    if (yearA >= yearB) {
      prevailingRule = ruleA;
      supersededRule = ruleB;
      reasoning = `Statute '${ruleA.title}' (${ruleA.year}) supersedes older regulation '${ruleB.title}' (${ruleB.year}) at equal rank.`;
    } else {
      prevailingRule = ruleB;
      supersededRule = ruleA;
      reasoning = `Statute '${ruleB.title}' (${ruleB.year}) supersedes older regulation '${ruleA.title}' (${ruleA.year}) at equal rank.`;
    }
  }

  return {
    conflictDetected: true,
    resolutionPrinciple,
    prevailingRule,
    supersededRule,
    reasoning,
    statutoryFramework: "UU No. 12 Tahun 2011 jo. UU No. 13 Tahun 2022 (Pembentukan Peraturan Perundang-Undangan)"
  };
}

module.exports = {
  LEGAL_HIERARCHY_RANK,
  resolveStatutoryConflict
};