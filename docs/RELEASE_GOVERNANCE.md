# Release Governance

This policy defines how the repository moves from a development state to a public release. It exists to prevent rapid version churn from being mistaken for production maturity.

## 1. Stabilization Checkpoint, Not Permanent Feature Freeze

The v6.7 announcement is treated as a **stabilization checkpoint**: do not add redundant plugins, duplicate skills, or unrelated product surfaces merely to grow the repository.

A later change is allowed when it closes one of these documented gaps:

- high-severity correctness or regulatory issue;
- security vulnerability;
- documented semantic/context gap;
- release-integrity defect;
- evidence/validation infrastructure required to substantiate an existing product claim.

This is why Product Context / BTKI was admitted after the v6.7 checkpoint: it closed a verified missing business-context dimension rather than changing the product direction.

## 2. Release Classes

### Normal Release

Used for planned hardening, documentation, benchmark, or compatibility work.

Required gates:

```text
npm test
npm run validate:docs
npm run validate:release
npm run test:smoke
npm run test:perf
```

### Security / Statutory Emergency Release

Emergency security or statutory corrections permit an accelerated release when delaying the correction would materially increase security or regulatory risk. The release notes must state the trigger and why the normal cadence was bypassed.

### Unreleased Development State

Changes on the default branch after the latest tag are considered **unreleased** until a new SemVer tag is created. The package version represents the latest released boundary, not every commit on the branch.

## 3. Release Cadence

There is no artificial monthly/weekly schedule. However, maintainers should avoid repeated same-day version tagging when a change can be batched into a single verified release. Exceptions are limited to the emergency class above.

The repository's historical rapid version progression is retained as history and is **not** presented as evidence of production maturity. Future release decisions should optimize for verified change sets, reproducibility, and external evidence rather than version-count growth.

## 4. Release Manifest Semantics

`release-manifest.json` is a committed trace artifact. A committed manifest cannot cryptographically contain its own final commit hash without circular self-reference. Therefore:

- `sourceCommitHash` identifies the source commit from which the manifest was generated;
- the release tag remains the authoritative release-boundary reference;
- release CI must verify that the tagged release, source commit, package version, canonical metadata, benchmark artifact, and checksums are internally consistent.

The field name must not imply that a committed manifest is its own commit hash.

## 5. Release Evidence Boundary

The repository may claim:

- deterministic correctness demonstrated by its executable test/benchmark corpus;
- documented provenance and cryptographic ruleset integrity;
- L3 Production Decision-Support readiness according to `PRODUCTION_READINESS.md`.

The repository must **not** claim independent expert validation, enterprise production proof, or market adoption until those are demonstrated externally and recorded in `docs/EXTERNAL_VALIDATION.md` and/or public case studies.

## 6. Release Checklist

Before a normal release:

1. Update code/rules/tests.
2. Generate canonical metadata.
3. Regenerate benchmark artifacts.
4. Verify SHA-256 ruleset integrity.
5. Run full test suite.
6. Run documentation validator.
7. Run release gate.
8. Run package smoke test.
9. Run performance gate.
10. Review `docs/AUDIT_CLOSURE.md` for open high-severity findings.
11. Publish release notes with limitations and validation status.
12. Create the SemVer tag only after all required checks pass.
