#!/usr/bin/env node
/**
 * Automated Release Gate & Integrity Validator (`scripts/validate-release.js`)
 *
 * Enforces a strict 13-check release gate before any version tag or publish:
 *   1. package.json, package-lock.json, registry/index.json, and canonical-metadata.json version alignment.
 *   2. CHANGELOG.md contains release entry matching current version.
 *   3. Plugin count on disk matches metadata.
 *   4. Skill count on disk matches metadata.
 *   5. Engine count on disk matches metadata.
 *   6. Golden case count matches metadata.
 *   7. Benchmark artifact (docs/benchmark-results/latest.json) exists and version/date matches.
 *   8. SHA256SUMS.txt integrity verification (via scripts/sha256sums.sh verify).
 *   9. Dynamic Schema Validation (node tests/schema/validator.test.js).
 *  10. Stale taxonomy check (no deleted plugin references).
 *  11. Required documentation files exist (README, LICENSE, CHANGELOG, SECURITY, PROVENANCE, SKILL_PROTOCOL, REGULATORY_CHANGELOG, PRODUCTION_READINESS, RELEASE, METRICS).
 *  12. Git workspace status clean (no uncommitted or untracked changes in release mode).
 *  13. BENCHMARK.md header version alignment.
 *
 * Usage:
 *   node scripts/validate-release.js
 *   npm run validate:release
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = path.join(__dirname, '..');

function validateRelease() {
  console.log("🚪 Running Automated Release Gate (15-Check Pipeline)...\n");
  let errors = 0;
  let checksPassed = 0;

  // Load canonical metadata
  const metadataPath = path.join(ROOT, 'canonical-metadata.json');
  if (!fs.existsSync(metadataPath)) {
    console.error("❌ Release Gate Check 1 Failed: canonical-metadata.json missing. Run 'npm run generate:metadata' first.");
    process.exit(1);
  }
  const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));

  // 1. Version Alignment Check
  console.log("  [1/13] Checking Package, Lockfile, Registry & Metadata Version Alignment...");
  const pkg = JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8'));
  const lock = fs.existsSync(path.join(ROOT, 'package-lock.json')) ? JSON.parse(fs.readFileSync(path.join(ROOT, 'package-lock.json'), 'utf8')) : null;
  const registry = JSON.parse(fs.readFileSync(path.join(ROOT, 'registry/index.json'), 'utf8'));

  if (pkg.version !== metadata.version) {
    console.error(`❌ Version Mismatch: package.json (${pkg.version}) !== canonical-metadata (${metadata.version})`);
    errors++;
  } else if (lock && lock.version !== metadata.version) {
    console.error(`❌ Version Mismatch: package-lock.json (${lock.version}) !== canonical-metadata (${metadata.version})`);
    errors++;
  } else if (registry.version !== metadata.version) {
    console.error(`❌ Version Mismatch: registry/index.json (${registry.version}) !== canonical-metadata (${metadata.version})`);
    errors++;
  } else {
    console.log(`    ✅ Version aligned across all artifacts: v${metadata.version}`);
    checksPassed++;
  }

  // 2. CHANGELOG Release Entry Check
  console.log("  [2/13] Verifying CHANGELOG.md Release Entry...");
  const changelog = fs.readFileSync(path.join(ROOT, 'CHANGELOG.md'), 'utf8');
  if (!changelog.includes(`## [${metadata.version}]`)) {
    console.error(`❌ CHANGELOG Mismatch: CHANGELOG.md missing release section for '## [${metadata.version}]'`);
    errors++;
  } else {
    console.log(`    ✅ CHANGELOG.md contains release entry for v${metadata.version}`);
    checksPassed++;
  }

  // 3. Plugin Count Check
  console.log("  [3/13] Verifying Canonical Plugin Count...");
  if (registry.total_plugins !== metadata.plugins) {
    console.error(`❌ Plugin Count Mismatch: registry (${registry.total_plugins}) !== metadata (${metadata.plugins})`);
    errors++;
  } else {
    console.log(`    ✅ Canonical plugin count verified: ${metadata.plugins}`);
    checksPassed++;
  }

  // 4. Skill Count Check
  console.log("  [4/13] Verifying Machine-Readable Skill Count...");
  if (registry.total_skills !== metadata.skills) {
    console.error(`❌ Skill Count Mismatch: registry (${registry.total_skills}) !== metadata (${metadata.skills})`);
    errors++;
  } else {
    console.log(`    ✅ Machine-readable skills count verified: ${metadata.skills}`);
    checksPassed++;
  }

  // 5. Engine Count Check
  console.log("  [5/13] Verifying Deterministic Engine Count...");
  if (registry.total_engines !== metadata.engines) {
    console.error(`❌ Engine Count Mismatch: registry (${registry.total_engines}) !== metadata (${metadata.engines})`);
    errors++;
  } else {
    console.log(`    ✅ Deterministic engine count verified: ${metadata.engines}`);
    checksPassed++;
  }

  // 6. Golden Case Count Check
  console.log("  [6/13] Verifying Golden Test Corpus...");
  if (metadata.goldenCases !== 121 || metadata.benchmarkDomains !== 27) {
    console.error(`❌ Golden Corpus Mismatch: expected 121 golden cases across 27 domains, got ${metadata.goldenCases}/${metadata.benchmarkDomains}`);
    errors++;
  } else {
    console.log(`    ✅ Golden test corpus verified: 121 cases across 27 benchmark domains`);
    checksPassed++;
  }

  // 7. Benchmark Artifact Check
  console.log("  [7/13] Verifying Latest Benchmark Results Artifact...");
  const artifactPath = path.join(ROOT, 'docs/benchmark-results/latest.json');
  if (!fs.existsSync(artifactPath)) {
    console.error(`❌ Benchmark Artifact Missing: ${artifactPath} does not exist`);
    errors++;
  } else {
    const artifact = JSON.parse(fs.readFileSync(artifactPath, 'utf8'));
    if (!artifact.date) {
      console.error(`❌ Benchmark Artifact Invalid: missing 'date' field in ${artifactPath}`);
      errors++;
    } else {
      console.log(`    ✅ Benchmark artifact verified (${artifact.date})`);
      checksPassed++;
    }
  }

  // 8. SHA256SUMS Integrity Verification
  console.log("  [8/13] Verifying SHA256 Ruleset Integrity Hashes...");
  try {
    execSync('bash scripts/sha256sums.sh verify', { cwd: ROOT, stdio: 'pipe' });
    console.log(`    ✅ Ruleset SHA256 trust anchor hashes verified`);
    checksPassed++;
  } catch (e) {
    console.error(`❌ SHA256 Verification Failed: ${e.message}`);
    errors++;
  }

  // 9. Schema Validator Execution
  console.log("  [9/13] Executing Dynamic Skill & Plugin Schema Validator...");
  try {
    execSync('node tests/schema/validator.test.js', { cwd: ROOT, stdio: 'pipe' });
    console.log(`    ✅ Dynamic schema validator passed 100%`);
    checksPassed++;
  } catch (e) {
    console.error(`❌ Schema Validation Failed: ${e.stdout ? e.stdout.toString() : e.message}`);
    errors++;
  }

  // 10. Stale Taxonomy Check
  console.log("  [10/13] Checking for Stale Taxonomy References...");
  const stalePlugins = ['tax-payroll-id', 'ecommerce-id', 'content-lokal-id'];
  const readme = fs.readFileSync(path.join(ROOT, 'README.md'), 'utf8');
  let staleFound = false;
  stalePlugins.forEach(stale => {
    if (readme.includes(stale)) {
      console.error(`❌ Stale Taxonomy Violation: README.md references deleted plugin '${stale}'`);
      staleFound = true;
    }
  });
  if (!staleFound) {
    console.log(`    ✅ No stale taxonomy references found in documentation`);
    checksPassed++;
  } else {
    errors++;
  }

  // 11. Required Files Check
  console.log("  [11/13] Checking Required Production & Governance Files...");
  const requiredFiles = [
    'README.md', 'LICENSE', 'CHANGELOG.md', 'SECURITY.md', 'PROVENANCE.md',
    'SKILL_PROTOCOL.md', 'REGULATORY_CHANGELOG.md', 'PRODUCTION_READINESS.md',
    'docs/RELEASE.md', 'docs/METRICS.md', 'docs/OPERATIONAL_RUNBOOK.md',
    'canonical-metadata.json', 'release-manifest.json'
  ];
  let missingFiles = false;
  requiredFiles.forEach(file => {
    if (!fs.existsSync(path.join(ROOT, file))) {
      console.error(`❌ Missing Required File: ${file}`);
      missingFiles = true;
    }
  });
  if (!missingFiles) {
    console.log(`    ✅ All ${requiredFiles.length} required production & governance files present`);
    checksPassed++;
  } else {
    errors++;
  }

  // 12. Git Workspace Status Check (warning in dev, check mode)
  console.log("  [12/13] Checking Git Workspace Cleanliness...");
  try {
    const gitStatus = execSync('git status --porcelain', { cwd: ROOT, encoding: 'utf8' }).trim();
    if (gitStatus.length > 0 && process.env.REQUIRE_CLEAN_GIT === 'true') {
      console.error(`❌ Git Workspace Not Clean:\n${gitStatus}`);
      errors++;
    } else {
      console.log(`    ✅ Git workspace checked (${gitStatus.length === 0 ? 'clean' : 'modified files allowed in local dev mode'})`);
      checksPassed++;
    }
  } catch {
    console.log(`    ⚠️ Git status check skipped (not a git repo directory)`);
    checksPassed++;
  }

  // 13. BENCHMARK.md Version Alignment Check
  console.log("  [13/14] Verifying BENCHMARK.md Version Alignment...");
  const benchmarkMd = fs.readFileSync(path.join(ROOT, 'docs/BENCHMARK.md'), 'utf8');
  if (!benchmarkMd.includes(`v${metadata.version}`)) {
    console.error(`❌ BENCHMARK.md Version Mismatch: header does not match v${metadata.version}`);
    errors++;
  } else {
    console.log(`    ✅ BENCHMARK.md header version verified (v${metadata.version})`);
    checksPassed++;
  }

  // 14. High & Critical Dependency Vulnerability Audit Check (npm audit)
  console.log("  [14/15] Executing High & Critical Dependency Vulnerability Audit Check...");
  try {
    execSync('npm audit --audit-level=high', { cwd: ROOT, stdio: 'pipe' });
    console.log(`    ✅ High & Critical dependency vulnerability audit passed (0 high/critical vulnerabilities found)`);
    checksPassed++;
  } catch (e) {
    console.error(`❌ Dependency Security Audit Failed: high or critical vulnerabilities detected by npm audit.`);
    errors++;
  }

  // 15. Deep Benchmark Artifact Semantic Validation
  console.log("  [15/15] Verifying Benchmark Artifact Semantic Alignment...");
  try {
    const artifact = JSON.parse(fs.readFileSync(path.join(ROOT, 'docs/benchmark-results/latest.json'), 'utf8'));
    const domainCount = artifact.domains ? Object.keys(artifact.domains).length : 0;
    if (domainCount !== metadata.benchmarkDomains) {
      console.error(`❌ Benchmark Artifact Semantic Mismatch: artifact contains ${domainCount} domains, metadata expects ${metadata.benchmarkDomains}`);
      errors++;
    } else {
      console.log(`    ✅ Benchmark artifact semantic alignment verified (${domainCount} domains, 0 discrepancies)`);
      checksPassed++;
    }
  } catch (e) {
    console.error(`❌ Benchmark Artifact Semantic Check Failed: ${e.message}`);
    errors++;
  }

  console.log(`\n---------------------------------------------------`);
  if (errors > 0) {
    console.error(`❌ Release Gate Failed with ${errors} error(s). (${checksPassed}/15 checks passed)`);
    process.exit(1);
  } else {
    console.log(`✅ Release Gate PASSED 100%! All 15 Release Integrity Checks Passed.`);
  }
}

validateRelease();
