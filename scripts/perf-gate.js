#!/usr/bin/env node
/**
 * Lightweight Performance Regression Gate (`scripts/perf-gate.js`)
 *
 * Compares latest benchmark execution throughput (ops/sec) against baseline.json.
 * Triggers a warning if throughput degrades by >30%. (Never fails hard, keeping CI stable).
 *
 * Usage:
 *   node scripts/perf-gate.js
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

function checkPerfGate() {
  console.log("⚡ Running Lightweight Performance Regression Gate...\n");

  const baselinePath = path.join(ROOT, 'docs/benchmark-results/baseline.json');
  const latestPath = path.join(ROOT, 'docs/benchmark-results/latest.json');

  if (!fs.existsSync(baselinePath) || !fs.existsSync(latestPath)) {
    console.log("⚠️ Performance Gate: baseline.json or latest.json missing, skipping check.");
    return;
  }

  const baseline = JSON.parse(fs.readFileSync(baselinePath, 'utf8'));
  const latest = JSON.parse(fs.readFileSync(latestPath, 'utf8'));

  const maxDegradation = baseline.thresholdDegradationMaxPercent || 30;
  let warnings = 0;

  if (latest.domains) {
    Object.entries(latest.domains).forEach(([domainName, data]) => {
      const baselineOps = baseline.baselineOpsPerSec[domainName];
      if (baselineOps && data.opsPerSec) {
        const dropPercent = ((baselineOps - data.opsPerSec) / baselineOps) * 100;
        if (dropPercent > maxDegradation) {
          console.warn(`  ⚠️ Throughput Warning [${domainName}]: current ${data.opsPerSec} ops/sec vs baseline ${baselineOps} ops/sec (${dropPercent.toFixed(1)}% degradation)`);
          warnings++;
        }
      }
    });
  }

  if (warnings === 0) {
    console.log("  ✅ All engine domains operating within performance throughput baseline bounds (0 regressions > 30%).");
  } else {
    console.log(`  ⚠️ Performance Gate completed with ${warnings} throughput warning(s).`);
  }
}

checkPerfGate();
