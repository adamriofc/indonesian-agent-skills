#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const plugins = ['finance-id', 'hr-id', 'legal-id', 'marketing-id', 'strategic-id', 'tax-id'];

// Default capability mappings per domain/skill type
const DOMAIN_CAPABILITY_MAP = {
  'tax-id': {
    requires: ['taxpayerProfile', 'grossAmount', 'dateStr', 'hasNpwp'],
    produces: ['taxAmount', 'effectiveRatePercent', 'statutoryReference', 'safeToUse'],
    deterministic: true,
    cross_domain_relevance: { hr: 'high', finance: 'high', legal: 'medium' }
  },
  'hr-id': {
    requires: ['employeeCount', 'monthlyWage', 'tenureMonths', 'contractType'],
    produces: ['payoutAmount', 'statutoryEntitlements', 'complianceStatus'],
    deterministic: true,
    cross_domain_relevance: { tax: 'high', finance: 'high', legal: 'high' }
  },
  'legal-id': {
    requires: ['contractText', 'entityType', 'kbliCode', 'pdpPractices'],
    produces: ['riskScore', 'detectedViolations', 'redlines', 'safeToUse'],
    deterministic: true,
    cross_domain_relevance: { tax: 'medium', hr: 'high', finance: 'medium' }
  },
  'finance-id': {
    requires: ['financialMetrics', 'monthlyRevenue', 'operatingExpenses', 'cashBalance'],
    produces: ['financialRatio', 'cashRunwayMonths', 'netProfit', 'feasible'],
    deterministic: true,
    cross_domain_relevance: { strategy: 'high', marketing: 'medium', tax: 'medium' }
  },
  'marketing-id': {
    requires: ['productName', 'category', 'cifValueIdr', 'targetAudience'],
    produces: ['cac', 'ltv', 'btkiCode', 'classificationStatus', 'landedCost'],
    deterministic: true,
    cross_domain_relevance: { finance: 'high', strategy: 'high', tax: 'medium' }
  },
  'strategic-id': {
    requires: ['kbliCode', 'companyProfile', 'scenarioDeltas', 'risks'],
    produces: ['businessArchetype', 'compositeScore', 'resilienceAssessment', 'topOption'],
    deterministic: true,
    cross_domain_relevance: { finance: 'high', marketing: 'high', hr: 'medium', tax: 'medium' }
  }
};

function parseYamlFrontmatter(yamlStr) {
  const lines = yamlStr.split('\n');
  const result = {};
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const colonIdx = trimmed.indexOf(':');
    if (colonIdx === -1) continue;
    const key = trimmed.slice(0, colonIdx).trim();
    const value = trimmed.slice(colonIdx + 1).trim().replace(/^['"]|['"]$/g, '');
    if (key) result[key] = value;
  }
  return result;
}

function processSkills() {
  console.log("⚙️ Enriching Agent Capability Contract Metadata across all 88 SKILL.md files...\n");

  let totalUpdated = 0;
  const registryPath = path.join(ROOT, 'registry/index.json');
  const registry = JSON.parse(fs.readFileSync(registryPath, 'utf8'));

  const updatedSkillsMap = {};

  plugins.forEach(p => {
    const skillsDir = path.join(ROOT, p, 'skills');
    if (!fs.existsSync(skillsDir)) return;

    const skillFolders = fs.readdirSync(skillsDir);
    skillFolders.forEach(skillFolder => {
      const skillFile = path.join(skillsDir, skillFolder, 'SKILL.md');
      if (!fs.existsSync(skillFile)) return;

      const content = fs.readFileSync(skillFile, 'utf8');
      const parts = content.split('---');
      if (parts.length < 3) return;

      const fm = parseYamlFrontmatter(parts[1]);
      const registryEntry = registry.skills.find(e => e.id === skillFolder);
      const qualityTier = (registryEntry && registryEntry.quality_tier) || fm.quality_tier || 'tested';
      const riskLevel = (registryEntry && registryEntry.risk_level) || fm.risk_level || 'medium';
      const ruleType = (registryEntry && registryEntry.rule_type) || fm.rule_type || 'statutory';

      const domainDefaults = DOMAIN_CAPABILITY_MAP[p] || DOMAIN_CAPABILITY_MAP['tax-id'];

      // Extract argument hints if available
      const argHintStr = fm['argument-hint'] || '';
      const explicitRequires = argHintStr ? argHintStr.split(',').map(s => s.trim()).filter(Boolean) : domainDefaults.requires;

      const capabilityObj = {
        requires: explicitRequires,
        produces: domainDefaults.produces,
        deterministic: ruleType === 'statutory' || p === 'finance-id' || p === 'tax-id' || p === 'hr-id',
        cross_domain_relevance: domainDefaults.cross_domain_relevance
      };

      // Construct clean frontmatter block
      const newFmLines = [
        `name: ${fm.name || skillFolder}`,
        `description: "${(fm.description || '').replace(/"/g, '\\"')}"`,
        `argument-hint: ${fm['argument-hint'] || explicitRequires.join(', ')}`,
        `risk_level: ${riskLevel}`,
        `rule_type: ${ruleType}`,
        `quality_tier: ${qualityTier}`,
        `allowed-tools: ${fm['allowed-tools'] || 'bash'}`,
        `capability:`,
        `  requires: [${capabilityObj.requires.join(', ')}]`,
        `  produces: [${capabilityObj.produces.join(', ')}]`,
        `  deterministic: ${capabilityObj.deterministic}`,
        `  cross_domain_relevance:`,
        ...Object.entries(capabilityObj.cross_domain_relevance).map(([k, v]) => `    ${k}: ${v}`)
      ];

      const newContent = `---\n${newFmLines.join('\n')}\n---` + parts.slice(2).join('---');
      fs.writeFileSync(skillFile, newContent);

      updatedSkillsMap[skillFolder] = capabilityObj;
      totalUpdated++;
    });
  });

  // Update registry/index.json
  registry.skills.forEach(entry => {
    if (updatedSkillsMap[entry.id]) {
      entry.capability = updatedSkillsMap[entry.id];
    }
  });

  fs.writeFileSync(registryPath, JSON.stringify(registry, null, 2) + '\n');
  console.log(`✅ Successfully enriched Agent Capability Contract across ${totalUpdated} SKILL.md files & updated registry/index.json!`);
}

processSkills();
