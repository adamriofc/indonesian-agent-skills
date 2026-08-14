#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const plugins = ['finance-id', 'hr-id', 'legal-id', 'marketing-id', 'strategic-id', 'tax-id'];

// Default typed capability mappings per domain/skill type
const TYPED_DOMAIN_CAPABILITY_MAP = {
  'tax-id': {
    purpose: ['tax_calculation', 'statutory_compliance'],
    not_for: ['tax_legal_opinion', 'autonomous_filing'],
    requires: [
      { name: 'grossAmount', type: 'money_idr', required: true },
      { name: 'ptkpStatus', type: 'enum', required: true, values: ['TK/0', 'TK/1', 'TK/2', 'TK/3', 'K/0', 'K/1', 'K/2', 'K/3'] },
      { name: 'hasNpwp', type: 'boolean', required: false },
      { name: 'dateStr', type: 'date_iso', required: false }
    ],
    produces: [
      { name: 'taxAmount', type: 'money_idr' },
      { name: 'effectiveRatePercent', type: 'percentage' },
      { name: 'statutoryReference', type: 'string' },
      { name: 'safeToUse', type: 'enum' }
    ],
    consumes: ['hr.payroll_cost', 'context.asOfDate'],
    deterministic: true,
    risk: { level: 'high', human_review_required: false },
    cross_domain_relevance: { hr: 'high', finance: 'high', legal: 'medium' }
  },
  'hr-id': {
    purpose: ['labor_compliance', 'severance_calculation'],
    not_for: ['unmediated_employee_termination', 'autonomous_legal_notice'],
    requires: [
      { name: 'employeeCount', type: 'integer', required: true },
      { name: 'monthlyWage', type: 'money_idr', required: true },
      { name: 'tenureMonths', type: 'integer', required: true },
      { name: 'contractType', type: 'enum', required: true, values: ['pkwt', 'pkwtt'] }
    ],
    produces: [
      { name: 'payoutAmount', type: 'money_idr' },
      { name: 'statutoryEntitlements', type: 'array' },
      { name: 'complianceStatus', type: 'enum' }
    ],
    consumes: ['context.employeeCount', 'context.scale'],
    deterministic: true,
    risk: { level: 'high', human_review_required: false },
    cross_domain_relevance: { tax: 'high', finance: 'high', legal: 'high' }
  },
  'legal-id': {
    purpose: ['contract_audit', 'regulatory_compliance'],
    not_for: ['court_representation', 'formal_advocate_opinion'],
    requires: [
      { name: 'contractText', type: 'string', required: true },
      { name: 'entityType', type: 'enum', required: true, values: ['pt', 'cv', 'individual'] },
      { name: 'kbliCode', type: 'string', required: true }
    ],
    produces: [
      { name: 'riskScore', type: 'integer' },
      { name: 'detectedViolations', type: 'array' },
      { name: 'redlines', type: 'array' },
      { name: 'safeToUse', type: 'enum' }
    ],
    consumes: ['context.entity', 'context.kbli'],
    deterministic: true,
    risk: { level: 'high', human_review_required: false },
    cross_domain_relevance: { tax: 'medium', hr: 'high', finance: 'medium' }
  },
  'finance-id': {
    purpose: ['financial_analysis', 'unit_economics_modelling'],
    not_for: ['certified_audit_opinion', 'public_offering_prospectus'],
    requires: [
      { name: 'financialMetrics', type: 'object', required: true },
      { name: 'monthlyRevenue', type: 'money_idr', required: true },
      { name: 'operatingExpenses', type: 'money_idr', required: true },
      { name: 'cashBalance', type: 'money_idr', required: true }
    ],
    produces: [
      { name: 'bep_units', type: 'integer' },
      { name: 'bep_revenue', type: 'money_idr' },
      { name: 'contribution_margin', type: 'percentage' },
      { name: 'margin_of_safety', type: 'percentage' }
    ],
    consumes: ['context.scale', 'marketing.cac'],
    deterministic: true,
    risk: { level: 'medium', human_review_required: false },
    cross_domain_relevance: { strategy: 'high', marketing: 'medium', tax: 'medium' }
  },
  'marketing-id': {
    purpose: ['market_sizing', 'commodity_classification'],
    not_for: ['guaranteed_revenue_forecasting', 'customs_auto_clearance'],
    requires: [
      { name: 'productName', type: 'string', required: true },
      { name: 'category', type: 'string', required: true },
      { name: 'cifValueIdr', type: 'money_idr', required: false }
    ],
    produces: [
      { name: 'cac', type: 'money_idr' },
      { name: 'ltv', type: 'money_idr' },
      { name: 'btkiCode', type: 'string' },
      { name: 'classificationStatus', type: 'enum' },
      { name: 'landedCost', type: 'money_idr' }
    ],
    consumes: ['context.productContext', 'finance.unitCostIdr'],
    deterministic: true,
    risk: { level: 'medium', human_review_required: false },
    cross_domain_relevance: { finance: 'high', strategy: 'high', tax: 'medium' }
  },
  'strategic-id': {
    purpose: ['framework_evaluation', 'scenario_planning'],
    not_for: ['board_of_directors_guarantee', 'hostile_takeover_advisory'],
    requires: [
      { name: 'kbliCode', type: 'string', required: true },
      { name: 'companyProfile', type: 'object', required: true },
      { name: 'scenarioDeltas', type: 'object', required: false }
    ],
    produces: [
      { name: 'businessArchetype', type: 'enum' },
      { name: 'compositeScore', type: 'number' },
      { name: 'resilienceAssessment', type: 'enum' },
      { name: 'topOption', type: 'string' }
    ],
    consumes: ['context.businessArchetype', 'finance.netProfit'],
    deterministic: true,
    risk: { level: 'medium', human_review_required: false },
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

      const domainDefaults = TYPED_DOMAIN_CAPABILITY_MAP[p] || TYPED_DOMAIN_CAPABILITY_MAP['tax-id'];

      // Extract argument hints if available
      const argHintStr = fm['argument-hint'] || '';
      const explicitParamNames = argHintStr ? argHintStr.split(',').map(s => s.trim()).filter(Boolean) : domainDefaults.requires.map(r => r.name);

      const typedRequires = explicitParamNames.map(paramName => {
        const found = domainDefaults.requires.find(r => r.name === paramName);
        return found || { name: paramName, type: 'string', required: true };
      });

      const capabilityObj = {
        purpose: domainDefaults.purpose,
        not_for: domainDefaults.not_for,
        requires: typedRequires,
        produces: domainDefaults.produces,
        consumes: domainDefaults.consumes,
        deterministic: ruleType === 'statutory' || p === 'finance-id' || p === 'tax-id' || p === 'hr-id',
        risk: { level: riskLevel, human_review_required: riskLevel === 'high' || riskLevel === 'critical' },
        cross_domain_relevance: domainDefaults.cross_domain_relevance
      };

      // Construct clean frontmatter block
      const newFmLines = [
        `name: ${fm.name || skillFolder}`,
        `description: "${(fm.description || '').replace(/"/g, '\\"')}"`,
        `argument-hint: ${fm['argument-hint'] || explicitParamNames.join(', ')}`,
        `risk_level: ${riskLevel}`,
        `rule_type: ${ruleType}`,
        `quality_tier: ${qualityTier}`,
        `allowed-tools: ${fm['allowed-tools'] || 'bash'}`,
        `capability:`,
        `  purpose: [${capabilityObj.purpose.join(', ')}]`,
        `  not_for: [${capabilityObj.not_for.join(', ')}]`,
        `  requires: [${capabilityObj.requires.map(r => r.name).join(', ')}]`,
        `  produces: [${capabilityObj.produces.map(r => r.name).join(', ')}]`,
        `  consumes: [${capabilityObj.consumes.join(', ')}]`,
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
