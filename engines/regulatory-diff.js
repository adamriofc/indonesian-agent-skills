/**
 * Deterministic Regulatory Diff Engine
 * Compares versioned SSOT rulesets across temporal transition windows to generate auditable diffs.
 */

const fs = require('fs');
const path = require('path');

const DOMAIN_RULESET_MAP = {
  umkm: './rules/umkm.json',
  bpjs: './rules/bpjs.json',
  pph21: './rules/pph21.json',
  marketplace: './rules/marketplace.json'
};

function compareRulesets(domain, oldRulesetId, newRulesetId) {
  const domainKey = (domain || '').toLowerCase().trim();
  const rulesetPath = DOMAIN_RULESET_MAP[domainKey];

  if (!rulesetPath) {
    throw new Error(`[Regulatory Diff Error] Unsupported ruleset domain: "${domain}". Supported: ${Object.keys(DOMAIN_RULESET_MAP).join(', ')}`);
  }

  const fullPath = path.join(__dirname, rulesetPath);
  if (!fs.existsSync(fullPath)) {
    throw new Error(`[Regulatory Diff Error] Ruleset file not found: ${fullPath}`);
  }

  const rulesetData = JSON.parse(fs.readFileSync(fullPath, 'utf8'));
  const rulesets = rulesetData.rulesets || [];

  const rulesetA = rulesets.find(r => r.rulesetId === oldRulesetId);
  const rulesetB = rulesets.find(r => r.rulesetId === newRulesetId);

  if (!rulesetA) {
    throw new Error(`[Regulatory Diff Error] Old ruleset ID "${oldRulesetId}" not found in domain "${domain}".`);
  }
  if (!rulesetB) {
    throw new Error(`[Regulatory Diff Error] New ruleset ID "${newRulesetId}" not found in domain "${domain}".`);
  }

  const changes = [];

  // Compare Effective Dates
  changes.push({
    field: 'effective_window',
    oldValue: `${rulesetA.effective_from} to ${rulesetA.effective_to}`,
    newValue: `${rulesetB.effective_from} to ${rulesetB.effective_to}`,
    isChanged: rulesetA.effective_from !== rulesetB.effective_from || rulesetA.effective_to !== rulesetB.effective_to
  });

  // Compare Statute & Source
  const sourceA = rulesetA.source ? rulesetA.source.regulation : rulesetA.statute;
  const sourceB = rulesetB.source ? rulesetB.source.regulation : rulesetB.statute;
  changes.push({
    field: 'statute',
    oldValue: sourceA || 'N/A',
    newValue: sourceB || 'N/A',
    isChanged: sourceA !== sourceB
  });

  // Compare Eligibility (if available)
  if (rulesetA.eligible_taxpayers || rulesetB.eligible_taxpayers) {
    const oldEligible = rulesetA.eligible_taxpayers || [];
    const newEligible = rulesetB.eligible_taxpayers || [];
    const removed = oldEligible.filter(x => !newEligible.includes(x));
    const added = newEligible.filter(x => !oldEligible.includes(x));

    changes.push({
      field: 'eligible_taxpayers',
      oldValue: oldEligible,
      newValue: newEligible,
      removedEntities: removed,
      addedEntities: added,
      isChanged: removed.length > 0 || added.length > 0
    });
  }

  // Compare Caps & Thresholds
  const keysToCompare = ['individual_threshold', 'max_turnover_limit', 'kesCap', 'jpCap', 'non_npwp_penalty_rate'];
  keysToCompare.forEach(key => {
    if (rulesetA[key] !== undefined || rulesetB[key] !== undefined) {
      changes.push({
        field: key,
        oldValue: rulesetA[key] !== undefined ? rulesetA[key] : 'N/A',
        newValue: rulesetB[key] !== undefined ? rulesetB[key] : 'N/A',
        isChanged: rulesetA[key] !== rulesetB[key]
      });
    }
  });

  // Compare Lifecycle Status
  const statusA = rulesetA.lifecycle ? rulesetA.lifecycle.status : 'N/A';
  const statusB = rulesetB.lifecycle ? rulesetB.lifecycle.status : 'N/A';
  changes.push({
    field: 'lifecycle_status',
    oldValue: statusA,
    newValue: statusB,
    isChanged: statusA !== statusB
  });

  return {
    domain: domainKey,
    comparison: `${oldRulesetId} ➔ ${newRulesetId}`,
    effectiveTransitionDate: rulesetB.effective_from,
    oldRuleset: { id: rulesetA.rulesetId, version: rulesetA.rulesetVersion, status: statusA },
    newRuleset: { id: rulesetB.rulesetId, version: rulesetB.rulesetVersion, status: statusB },
    totalChanges: changes.filter(c => c.isChanged).length,
    changes
  };
}

module.exports = {
  compareRulesets,
  DOMAIN_RULESET_MAP
};
