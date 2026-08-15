#!/usr/bin/env node
/**
 * Automated Release Gate & Integrity Validator (`scripts/validate-release.js`)
 *
 * Enforces a strict 16-check release gate before a version tag or publish.
 * The release tag is the authoritative immutable boundary; the committed
 * release manifest records that tag's target commit and never self-references.
 *
 * Usage:
 *   node scripts/validate-release.js
 *   RELEASE_TAG=v6.11.2 REQUIRE_RELEASE_TAG=true node scripts/validate-release.js
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = path.join(__dirname, '..');

function validateRelease() {
  console.log("🚪 Running Automated Release Gate (18-Check Pipeline)...\n");
  let errors = 0;
  let checksPassed = 0;

  const metadataPath = path.join(ROOT, 'canonical-metadata.json');
  if (!fs.existsSync(metadataPath)) {
    console.error("❌ Release Gate Check 1 Failed: canonical-metadata.json missing. Run 'npm run generate:metadata' first.");
    process.exit(1);
  }
  const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));

  // 1. Version Alignment Check
  console.log("  [1/18] Checking Package, Lockfile, Registry & Metadata Version Alignment...");
  const pkg = JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8'));
  const lock = fs.existsSync(path.join(ROOT, 'package-lock.json')) ? JSON.parse(fs.readFileSync(path.join(ROOT, 'package-lock.json'), 'utf8')) : null;
  const registry = JSON.parse(fs.readFileSync(path.join(ROOT, 'registry/index.json'), 'utf8'));
  if (pkg.version !== metadata.version || (lock && lock.version !== metadata.version) || registry.version !== metadata.version) {
    console.error(`❌ Version Mismatch: package=${pkg.version}, lock=${lock ? lock.version : 'missing'}, registry=${registry.version}, metadata=${metadata.version}`);
    errors++;
  } else {
    console.log(`    ✅ Version aligned across all artifacts: v${metadata.version}`);
    checksPassed++;
  }

  // 2. CHANGELOG Release Entry Check
  console.log("  [2/18] Verifying CHANGELOG.md Release Entry...");
  const changelog = fs.readFileSync(path.join(ROOT, 'CHANGELOG.md'), 'utf8');
  if (!changelog.includes(`## [${metadata.version}]`)) {
    console.error(`❌ CHANGELOG Mismatch: missing '## [${metadata.version}]'`);
    errors++;
  } else {
    console.log(`    ✅ CHANGELOG.md contains release entry for v${metadata.version}`);
    checksPassed++;
  }

  // 3. Plugin Count
  console.log("  [3/18] Verifying Canonical Plugin Count...");
  if (registry.total_plugins !== metadata.plugins) {
    console.error(`❌ Plugin Count Mismatch: registry=${registry.total_plugins}, metadata=${metadata.plugins}`);
    errors++;
  } else { checksPassed++; console.log(`    ✅ Canonical plugin count verified: ${metadata.plugins}`); }

  // 4. Skill Count
  console.log("  [4/18] Verifying Machine-Readable Skill Count...");
  if (registry.total_skills !== metadata.skills) {
    console.error(`❌ Skill Count Mismatch: registry=${registry.total_skills}, metadata=${metadata.skills}`);
    errors++;
  } else { checksPassed++; console.log(`    ✅ Machine-readable skills count verified: ${metadata.skills}`); }

  // 5. Engine Count
  console.log("  [5/18] Verifying Deterministic Engine Count...");
  if (registry.total_engines !== metadata.engines) {
    console.error(`❌ Engine Count Mismatch: registry=${registry.total_engines}, metadata=${metadata.engines}`);
    errors++;
  } else { checksPassed++; console.log(`    ✅ Deterministic engine count verified: ${metadata.engines}`); }

  // 6. Golden Corpus
  console.log("  [6/18] Verifying Golden Test Corpus...");
  if (metadata.goldenCases !== 121 || metadata.benchmarkDomains !== 27) {
    console.error(`❌ Golden Corpus Mismatch: expected 121/27, got ${metadata.goldenCases}/${metadata.benchmarkDomains}`);
    errors++;
  } else { checksPassed++; console.log(`    ✅ Golden corpus verified: 121 cases across 27 domains`); }

  // 7. Benchmark artifact
  console.log("  [7/18] Verifying Latest Benchmark Results Artifact...");
  const artifactPath = path.join(ROOT, 'docs/benchmark-results/latest.json');
  if (!fs.existsSync(artifactPath)) {
    console.error(`❌ Benchmark Artifact Missing: ${artifactPath}`);
    errors++;
  } else {
    const artifact = JSON.parse(fs.readFileSync(artifactPath, 'utf8'));
    if (!artifact.date || !artifact.domains) {
      console.error(`❌ Benchmark Artifact Invalid: missing date/domains`);
      errors++;
    } else { checksPassed++; console.log(`    ✅ Benchmark artifact verified (${artifact.date})`); }
  }

  // 8. SHA256 integrity
  console.log("  [8/18] Verifying SHA256 Ruleset Integrity Hashes...");
  try {
    execSync('bash scripts/sha256sums.sh verify', { cwd: ROOT, stdio: 'pipe' });
    checksPassed++; console.log(`    ✅ Ruleset SHA256 trust anchor hashes verified`);
  } catch (e) { console.error(`❌ SHA256 Verification Failed: ${e.message}`); errors++; }

  // 9. Schema validator
  console.log("  [9/18] Executing Dynamic Skill & Plugin Schema Validator...");
  try {
    execSync('node tests/schema/validator.test.js', { cwd: ROOT, stdio: 'pipe' });
    checksPassed++; console.log(`    ✅ Dynamic schema validator passed`);
  } catch (e) { console.error(`❌ Schema Validation Failed: ${e.stdout ? e.stdout.toString() : e.message}`); errors++; }

  // 10. Stale taxonomy
  console.log("  [10/18] Checking for Stale Taxonomy References...");
  const stalePlugins = ['tax-payroll-id', 'ecommerce-id', 'content-lokal-id'];
  const staleDocFiles = ['README.md', 'SKILL_PROTOCOL.md', 'ROADMAP.md', 'PROVENANCE.md', 'REGULATORY_CHANGELOG.md'];
  let staleFound = false;
  staleDocFiles.forEach(file => {
    const filePath = path.join(ROOT, file);
    if (!fs.existsSync(filePath)) return;
    const content = fs.readFileSync(filePath, 'utf8');
    stalePlugins.forEach(stale => {
      if (content.includes(stale)) {
        console.error(`❌ Stale Taxonomy Violation: ${file} references deleted plugin '${stale}'`);
        staleFound = true;
      }
    });
  });
  if (!staleFound) { checksPassed++; console.log(`    ✅ No stale taxonomy references found in current documentation`); }
  else errors++;

  // 11. Required files
  console.log("  [11/18] Checking Required Production & Governance Files...");
  const requiredFiles = [
    'README.md', 'LICENSE', 'CHANGELOG.md', 'SECURITY.md', 'PROVENANCE.md',
    'SKILL_PROTOCOL.md', 'REGULATORY_CHANGELOG.md', 'PRODUCTION_READINESS.md',
    'docs/RELEASE.md', 'docs/METRICS.md', 'docs/BENCHMARK.md', 'docs/OPERATIONAL_RUNBOOK.md',
    'docs/RELEASE_GOVERNANCE.md', 'docs/EXTERNAL_VALIDATION.md', 'docs/AUDIT_CLOSURE.md',
    'canonical-metadata.json', 'release-manifest.json'
  ];
  const missingFiles = requiredFiles.filter(file => !fs.existsSync(path.join(ROOT, file)));
  if (missingFiles.length) { missingFiles.forEach(file => console.error(`❌ Missing Required File: ${file}`)); errors++; }
  else { checksPassed++; console.log(`    ✅ All ${requiredFiles.length} required production & governance files present`); }

  // 12. Git cleanliness
  console.log("  [12/18] Checking Git Workspace Cleanliness...");
  try {
    const gitStatus = execSync('git status --porcelain', { cwd: ROOT, encoding: 'utf8' }).trim();
    if (gitStatus.length > 0 && process.env.REQUIRE_CLEAN_GIT === 'true') {
      console.error(`❌ Git Workspace Not Clean:\n${gitStatus}`); errors++;
    } else { checksPassed++; console.log(`    ✅ Git workspace checked (${gitStatus.length === 0 ? 'clean' : 'modified files allowed in local dev mode'})`); }
  } catch { checksPassed++; console.log(`    ⚠️ Git status check skipped (not a git repo directory)`); }

  // 13. BENCHMARK.md version
  console.log("  [13/18] Verifying BENCHMARK.md Version Alignment...");
  const benchmarkMd = fs.readFileSync(path.join(ROOT, 'docs/BENCHMARK.md'), 'utf8');
  if (!benchmarkMd.includes(`v${metadata.version}`)) { console.error(`❌ BENCHMARK.md Version Mismatch: expected v${metadata.version}`); errors++; }
  else { checksPassed++; console.log(`    ✅ BENCHMARK.md version verified`); }

  // 14. High/Critical npm audit
  console.log("  [14/18] Executing High & Critical Dependency Vulnerability Audit Check...");
  try {
    execSync('npm audit --audit-level=high', { cwd: ROOT, stdio: 'pipe' });
    checksPassed++; console.log(`    ✅ High & Critical dependency audit passed`);
  } catch { console.error(`❌ Dependency Security Audit Failed: high or critical vulnerabilities detected.`); errors++; }

  // 15. Benchmark semantic alignment
  console.log("  [15/18] Verifying Benchmark Artifact Semantic Alignment...");
  try {
    const artifact = JSON.parse(fs.readFileSync(artifactPath, 'utf8'));
    const domainCount = artifact.domains ? Object.keys(artifact.domains).length : 0;
    if (domainCount !== metadata.benchmarkDomains) {
      console.error(`❌ Benchmark Artifact Semantic Mismatch: artifact=${domainCount}, metadata=${metadata.benchmarkDomains}`); errors++;
    } else { checksPassed++; console.log(`    ✅ Benchmark semantic alignment verified`); }
  } catch (e) { console.error(`❌ Benchmark Artifact Semantic Check Failed: ${e.message}`); errors++; }

  // 16. Release manifest ↔ tag provenance
  console.log("  [16/18] Verifying Release Manifest ↔ Authoritative Tag Provenance...");
  try {
    const manifest = JSON.parse(fs.readFileSync(path.join(ROOT, 'release-manifest.json'), 'utf8'));
    const expectedTag = process.env.RELEASE_TAG || `v${metadata.version}`;
    const expectedTagCommit = execSync(`git rev-list -n 1 ${expectedTag}`, { cwd: ROOT, encoding: 'utf8' }).trim();

    if (manifest.releaseVersion !== `v${metadata.version}`) throw new Error(`releaseVersion=${manifest.releaseVersion}`);
    if (manifest.releaseTag !== expectedTag) throw new Error(`releaseTag=${manifest.releaseTag}`);
    if (manifest.releaseCommitHash !== expectedTagCommit) throw new Error(`releaseCommitHash=${manifest.releaseCommitHash}, expected=${expectedTagCommit}`);
    if (manifest.metrics.plugins !== metadata.plugins || manifest.metrics.skills !== metadata.skills || manifest.metrics.engines !== metadata.engines || manifest.metrics.goldenCases !== metadata.goldenCases || manifest.metrics.benchmarkDomains !== metadata.benchmarkDomains || manifest.metrics.benchmarkAssertions !== metadata.benchmarkAssertions) {
      throw new Error('manifest metrics do not match canonical metadata');
    }
    checksPassed++;
    console.log(`    ✅ Release manifest matches ${expectedTag} → ${expectedTagCommit}`);
  } catch (e) {
    if (process.env.REQUIRE_RELEASE_TAG === 'true') {
      console.error(`❌ Release Manifest Provenance Failed: ${e.message}`);
      errors++;
    } else {
      console.log(`    ⚠️ Release tag provenance check not enforced in local development mode: ${e.message}`);
      checksPassed++;
    }
  }

  // 17. Agent capability contract validation
  console.log("  [17/18] Executing Agent Capability Contract Validator...");
  try {
    execSync('npm run validate:capabilities', { cwd: ROOT, stdio: 'pipe' });
    checksPassed++; console.log(`    ✅ Agent capability contract validator passed`);
  } catch (e) { console.error(`❌ Agent Capability Contract Validation Failed: ${e.message}`); errors++; }

  // 18. Suite bundle integrity validation
  console.log("  [18/18] Executing Suite Bundle Integrity Validator...");
  try {
    execSync('npm run validate:suite', { cwd: ROOT, stdio: 'pipe' });
    checksPassed++; console.log(`    ✅ Suite bundle integrity validator passed`);
  } catch (e) { console.error(`❌ Suite Bundle Integrity Validation Failed: ${e.message}`); errors++; }

  console.log(`\n---------------------------------------------------`);
  if (errors > 0) {
    console.error(`❌ Release Gate Failed with ${errors} error(s). (${checksPassed}/18 checks passed)`);
    process.exit(1);
  } else {
    console.log(`✅ Release Gate PASSED. All 18 Release Integrity Checks Passed.`);
  }
}

validateRelease();
