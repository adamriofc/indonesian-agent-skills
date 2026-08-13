# Code Navigation

A lightweight map for reviewers and contributors. This is intentionally a navigation aid, not a second architecture specification.

## Core Reasoning Path

```text
User / Agent Query
→ engines/context-contract.js
→ engines/kbli-context-router.js
→ engines/product-context.js (goods / BTKI when applicable)
→ domain skill (`*/skills/*/SKILL.md`)
→ deterministic engine (`engines/*.js`)
→ ruleset (`engines/rules/*.json`)
→ result envelope / provenance
→ LLM synthesis
```

## Highest-Risk Code Areas

| Area | Canonical location | Why it matters |
|---|---|---|
| Business context | `engines/context-contract.js` | Context completeness, conflicts, assumptions, semantic facts/relations/objectives/options |
| Product / BTKI | `engines/product-context.js` | Commodity classification, tariff/tax treatment, Lartas, temporal ruleset handling |
| Tax engines | `engines/*tax*.js`, `engines/pph*.js`, `engines/ppn*.js` | Monetary calculations and statutory logic |
| HR / labor | `engines/bpjs*.js`, `engines/phk*.js`, `engines/pkwt*.js`, `engines/thr*.js` | Employment calculations and statutory boundaries |
| Regulatory diff | `engines/regulatory-diff.js`, `engines/regulatory-impact-engine.js` | Temporal regulation interpretation |
| Rule integrity | `engines/rules/integrity.js` | SHA-256 ruleset integrity enforcement |
| Release governance | `scripts/validate-release.js`, `release-manifest.json` | Version, benchmark, checksum and release-boundary verification |
| Documentation governance | `scripts/validate-docs.js`, `canonical-metadata.json` | SSOT alignment and stale-claim detection |

## Test Entry Points

```bash
npm test
npm run test:units
npm run test:integration
npm run test:security
npm run test:benchmarks
npm run test:smoke
npm run test:perf
npm run validate:docs
npm run validate:release
```

Reviewers should start with the context contract, the relevant domain engine, its ruleset, the corresponding unit tests, and the provenance entry before evaluating a high-risk domain behavior.
