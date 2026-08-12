#!/usr/bin/env node
/**
 * Documentation Integrity & SSOT Validator (`scripts/validate-docs.js`)
 *
 * Verifies documentation consistency across README, BENCHMARK.md, METRICS.md,
 * CHANGELOG.md, and registry metadata to guarantee 0 drift.
 *
 * Usage:
 *   node scripts/validate-docs.js
 *   npm run validate:docs
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

function validateDocs() {
  console.log("📚 Running Documentation Integrity & SSOT Validator...\n");
  let errors = 0;

  const metadataPath = path.join(ROOT, 'canonical-metadata.json');
  if (!fs.existsSync(metadataPath)) {
    console.error("❌ Missing canonical-metadata.json. Run 'npm run generate:metadata' first.");
    process.exit(1);
  }
  const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));

  // 1. BENCHMARK.md checks
  console.log("  [1/6] Verifying BENCHMARK.md metrics...");
  const benchmarkMd = fs.readFileSync(path.join(ROOT, 'docs/BENCHMARK.md'), 'utf8');
  if (!benchmarkMd.includes(`v${metadata.version}`)) {
    console.error(`❌ BENCHMARK.md Version Mismatch: expected 'v${metadata.version}' in header.`);
    errors++;
  }
  if (!benchmarkMd.includes(`${metadata.goldenCases} Golden Cases`)) {
    console.error(`❌ BENCHMARK.md Corpus Mismatch: expected '${metadata.goldenCases} Golden Cases'.`);
    errors++;
  }
  if (!benchmarkMd.includes(`${metadata.benchmarkDomains} benchmark domains`)) {
    console.error(`❌ BENCHMARK.md Domains Mismatch: expected '${metadata.benchmarkDomains} benchmark domains'.`);
    errors++;
  }

  // 2. README.md checks
  console.log("  [2/6] Verifying README.md overview narrative & stats block...");
  const readme = fs.readFileSync(path.join(ROOT, 'README.md'), 'utf8');
  if (!readme.includes(`<!-- GENERATED:STATS -->`)) {
    console.error("❌ README.md Missing '<!-- GENERATED:STATS -->' block.");
    errors++;
  }
  if (!readme.includes(`\`v${metadata.version}\``)) {
    console.error(`❌ README.md Version Mismatch: expected '\`v${metadata.version}\`'.`);
    errors++;
  }

  // 3. METRICS.md checks
  console.log("  [3/6] Verifying docs/METRICS.md numbers...");
  const metricsMd = fs.readFileSync(path.join(ROOT, 'docs/METRICS.md'), 'utf8');
  if (!metricsMd.includes(`\`v${metadata.version}\``)) {
    console.error(`❌ METRICS.md Version Mismatch: expected '\`v${metadata.version}\`'.`);
    errors++;
  }

  // 4. CHANGELOG.md checks
  console.log("  [4/6] Verifying CHANGELOG.md release entry...");
  const changelog = fs.readFileSync(path.join(ROOT, 'CHANGELOG.md'), 'utf8');
  if (!changelog.includes(`## [${metadata.version}]`)) {
    console.error(`❌ CHANGELOG.md missing entry for '## [${metadata.version}]'.`);
    errors++;
  }

  // 5. Stale Taxonomy checks
  console.log("  [5/6] Checking for Stale Taxonomy Terms in docs...");
  const staleTerms = ['tax-payroll-id', 'ecommerce-id', 'content-lokal-id'];
  const docFiles = ['README.md', 'SKILL_PROTOCOL.md', 'PROVENANCE.md', 'REGULATORY_CHANGELOG.md'];
  docFiles.forEach(docFile => {
    const filePath = path.join(ROOT, docFile);
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf8');
      staleTerms.forEach(term => {
        if (content.includes(term)) {
          console.error(`❌ Stale Taxonomy in ${docFile}: contains deleted plugin '${term}'`);
          errors++;
        }
      });
    }
  });

  // 6. Node versions documentation
  console.log("  [6/6] Verifying Node.js Support Matrix documentation...");
  if (!readme.includes("Node.js Compatibility") || !readme.includes("20 / 22 / 24")) {
    console.error("❌ README.md missing Node.js Compatibility matrix ('20 / 22 / 24').");
    errors++;
  }

  if (errors > 0) {
    console.error(`\n❌ Documentation Validation Failed with ${errors} error(s).`);
    process.exit(1);
  } else {
    console.log("\n✅ Documentation Validation Passed 100%! All docs are in 0-drift SSOT alignment.");
  }
}

validateDocs();
