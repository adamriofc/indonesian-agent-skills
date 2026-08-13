#!/usr/bin/env node
/**
 * Documentation Integrity & SSOT Validator (`scripts/validate-docs.js`)
 *
 * Verifies current-state documentation consistency against canonical metadata.
 * The validator intentionally checks fenced code blocks as normal documentation,
 * because stale CLI examples and counts are part of the public contract.
 * Historical changelog text is excluded from current-state count checks.
 *
 * Usage:
 *   node scripts/validate-docs.js
 *   npm run validate:docs
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

function read(relPath) {
  return fs.readFileSync(path.join(ROOT, relPath), 'utf8');
}

function containsAll(content, needles, label) {
  let errors = 0;
  needles.forEach(needle => {
    if (!content.includes(needle)) {
      console.error(`❌ ${label}: missing '${needle}'`);
      errors++;
    }
  });
  return errors;
}

function validateDocs() {
  console.log("📚 Running Documentation Integrity & SSOT Validator...\n");
  let errors = 0;

  const metadataPath = path.join(ROOT, 'canonical-metadata.json');
  if (!fs.existsSync(metadataPath)) {
    console.error("❌ Missing canonical-metadata.json. Run 'npm run generate:metadata' first.");
    process.exit(1);
  }
  const metadata = JSON.parse(read('canonical-metadata.json'));

  // 1. BENCHMARK.md checks
  console.log("  [1/8] Verifying BENCHMARK.md metrics...");
  const benchmarkMd = read('docs/BENCHMARK.md');
  errors += containsAll(benchmarkMd, [
    `v${metadata.version}`,
    `${metadata.goldenCases} Golden Cases`,
    `${metadata.benchmarkDomains} benchmark domains`
  ], 'BENCHMARK.md alignment');

  // 2. README.md checks — includes fenced code blocks by design.
  console.log("  [2/8] Verifying README.md current-state narrative & stats block...");
  const readme = read('README.md');
  errors += containsAll(readme, [
    '<!-- GENERATED:STATS -->',
    `\`v${metadata.version}\``,
    `**${metadata.skills}`,
    `**${metadata.plugins}`,
    `**${metadata.engines}`
  ], 'README.md alignment');

  // 3. METRICS.md checks
  console.log("  [3/8] Verifying docs/METRICS.md numbers...");
  const metricsMd = read('docs/METRICS.md');
  errors += containsAll(metricsMd, [
    `\`v${metadata.version}\``,
    `\`${metadata.goldenCases}\``,
    `\`${metadata.benchmarkDomains}\``
  ], 'docs/METRICS.md alignment');

  // 4. CHANGELOG release entry check
  console.log("  [4/8] Verifying CHANGELOG.md release entry...");
  const changelog = read('CHANGELOG.md');
  if (!changelog.includes(`## [${metadata.version}]`)) {
    console.error(`❌ CHANGELOG.md missing entry for '## [${metadata.version}]'.`);
    errors++;
  }

  // 5. Current Skill Protocol and Roadmap checks.
  console.log("  [5/8] Verifying current Skill Protocol & Roadmap contracts...");
  const skillProtocol = read('SKILL_PROTOCOL.md');
  const roadmap = read('ROADMAP.md');
  errors += containsAll(skillProtocol, [
    'Install all 88 skills across 6 canonical plugins',
    'Semantic Business Context Routing',
    'Product Context / BTKI layer'
  ], 'SKILL_PROTOCOL.md current-state contract');
  errors += containsAll(roadmap, [
    '## Current State — v6.11.2',
    '**6 canonical plugins / 88 Agent Skills**',
    '**39 deterministic engines**',
    '## Active Hardening & Validation',
    '## Explicit Non-Goals / Feature Boundary'
  ], 'ROADMAP.md current-state contract');

  // 6. Stale taxonomy and stale numeric claims in current docs.
  console.log("  [6/8] Checking stale taxonomy / stale numeric claims in current documentation...");
  const currentDocFiles = [
    'README.md', 'SKILL_PROTOCOL.md', 'ROADMAP.md', 'PROVENANCE.md',
    'REGULATORY_CHANGELOG.md', 'PRODUCTION_READINESS.md', 'docs/RELEASE.md',
    'docs/METRICS.md', 'docs/BENCHMARK.md', 'docs/OPERATIONAL_RUNBOOK.md',
    'docs/RELEASE_GOVERNANCE.md', 'docs/EXTERNAL_VALIDATION.md', 'docs/AUDIT_CLOSURE.md'
  ];
  const staleTerms = ['tax-payroll-id', 'ecommerce-id', 'content-lokal-id'];
  const staleCountClaims = [
    'Install all 81 skills across 7 plugins',
    '42 enterprise skills across 5 domain plugins',
    'scope 6 domains · 54 skills · 16 engines'
  ];
  currentDocFiles.forEach(docFile => {
    const filePath = path.join(ROOT, docFile);
    if (!fs.existsSync(filePath)) return;
    const content = read(docFile);
    staleTerms.forEach(term => {
      if (content.includes(term)) {
        console.error(`❌ Stale Taxonomy in ${docFile}: contains deleted plugin '${term}'`);
        errors++;
      }
    });
    // Do not flag intentional history in CHANGELOG; these files represent current-state docs.
    staleCountClaims.forEach(claim => {
      if (content.includes(claim)) {
        console.error(`❌ Stale Numeric Claim in ${docFile}: '${claim}'`);
        errors++;
      }
    });
  });

  // 7. Node.js support + governance status checks
  console.log("  [7/8] Verifying Node.js support, release governance & external-validation status...");
  errors += containsAll(readme, [
    'Node.js Compatibility',
    '20 / 22 / 24'
  ], 'README.md Node support');
  const production = read('PRODUCTION_READINESS.md');
  const releaseGovernance = fs.existsSync(path.join(ROOT, 'docs/RELEASE_GOVERNANCE.md')) ? read('docs/RELEASE_GOVERNANCE.md') : '';
  const externalValidation = fs.existsSync(path.join(ROOT, 'docs/EXTERNAL_VALIDATION.md')) ? read('docs/EXTERNAL_VALIDATION.md') : '';
  errors += containsAll(production, [
    'Level L3 — Production Decision-Support Infrastructure',
    'Independent external validation status: **PENDING**'
  ], 'PRODUCTION_READINESS.md governance');
  errors += containsAll(releaseGovernance, [
    'stabilization checkpoint',
    'Emergency security or statutory corrections'
  ], 'RELEASE_GOVERNANCE.md');
  errors += containsAll(externalValidation, [
    'Status: **PENDING**',
    'independent reviewer',
    'held-out cases'
  ], 'EXTERNAL_VALIDATION.md');

  // 8. Audit-closure checklist presence
  console.log("  [8/8] Verifying audit-closure checklist...");
  const auditClosurePath = path.join(ROOT, 'docs/AUDIT_CLOSURE.md');
  if (!fs.existsSync(auditClosurePath)) {
    console.error('❌ Missing docs/AUDIT_CLOSURE.md audit checklist.');
    errors++;
  } else {
    const auditClosure = read('docs/AUDIT_CLOSURE.md');
    errors += containsAll(auditClosure, [
      'Documentation Drift',
      'External Validation',
      'Bus Factor',
      'Release Cadence',
      'Feature Freeze',
      'Expert Domain Review'
    ], 'AUDIT_CLOSURE.md checklist');
  }

  if (errors > 0) {
    console.error(`\n❌ Documentation Validation Failed with ${errors} error(s).`);
    process.exit(1);
  } else {
    console.log("\n✅ Documentation Validation Passed. All validated current-state fields are in SSOT alignment.");
  }
}

validateDocs();
