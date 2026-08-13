# Release Engineering & Checklist Policy (\`docs/RELEASE.md\`)

Automated release pipeline, immutable boundaries, and release engineering checklist for \`indonesian-business-agent-skills\`.

---

## 1. Immutable Release Boundary Policy

Every official release (e.g. \`v6.5.0\`) represents an immutable release boundary locking:
- Source code state at tag creation.
- Machines-readable skill definitions (\`SKILL.md\` files across 6 canonical plugins).
- Pure Node.js calculation & regulatory diff engines (\`engines/*.js\`).
- Statutory ruleset JSON files & cryptographic SHA256 hashes (\`SHA256SUMS.txt\`).
- Automated benchmark artifacts (\`docs/benchmark-results/latest.json\`).
- Documentation & metadata SSOT (\`canonical-metadata.json\`).

Users and downstream AI agents consume explicit SemVer release tags (e.g. \`v6.5.0\`) rather than unpinned commit hashes.

---

## 2. Automated Release Verification Checklist

Maintainers must execute the following checklist prior to creating a release tag:

```text
[1] Generate Metadata SSOT
    └─► npm run generate:metadata
        (Updates canonical-metadata.json, README STATS block, & docs/METRICS.md)

[2] Full Test Suite & Benchmark Matrix
    └─► npm test
        (Executes 424+ assertions across unit, matrix, integration, security, & benchmark suites)

[3] Deterministic Benchmark Execution & Artifact Update
    └─► node scripts/benchmark.js --json-report docs/benchmark-results/latest.json
        (Verifies 121 golden cases across 27 domains with 100% determinism)

[4] Documentation Consistency Validation
    └─► npm run validate:docs
        (Verifies 0-drift across README, BENCHMARK, METRICS, CHANGELOG, & SKILL_PROTOCOL)

[5] Ruleset SHA256 Cryptographic Trust Anchor Verification
    └─► bash scripts/sha256sums.sh verify
        (Verifies SHA256 hashes for bpjs.json, pph21.json, marketplace.json, umkm.json)

[6] Package Smoke Installation Test
    └─► npm run test:smoke
        (Packs package tarball, installs in isolated temp environment, verifies module require)

[7] Performance Regression Gate
    └─► node scripts/perf-gate.js
        (Verifies execution throughput against baseline without >30% degradation)

[8] Automated Release Gate
    └─► npm run validate:release
        (Executes 14-check automated release gate pipeline including blocking npm audit & release manifest validation)

[9] Git Tagging & GitHub Release
    └─► git tag vX.Y.Z && git push origin vX.Y.Z
    └─► gh release create vX.Y.Z --title "vX.Y.Z — Release Title" --notes-file release-notes.md
```

---

## 3. Published Release Artifacts

Each GitHub Release must include the following verifiable release artifacts:
1. `benchmark-results.json`: Complete JSON artifact of Tier 1 deterministic execution benchmark.
2. `SHA256SUMS.txt`: Cryptographic hashes of all active statutory rulesets.
3. `CHANGELOG.md`: Detailed changelog entry listing statutory updates, engine changes, and fixes.
4. Auto-generated release notes summarizing version metadata (skills count, engine count, golden cases count, Node matrix status).
