# Operational Runbook (`docs/OPERATIONAL_RUNBOOK.md`)

Standard operating procedures for agent maintainers and enterprise operators handling incident scenarios, statutory updates, benchmark regressions, and runtime failures.

---

## 1. Incident Response Matrix

| Incident Scenario | Severity | Trigger / Detection | Standard Operating Procedure (SOP) |
|---|---|---|---|
| **Statutory Ruleset Amendment** | HIGH | Government gazette issue (Lembaran Negara / PMK) | 1. Create new ruleset entry in `engines/rules/` with effective date.<br>2. Update `engines/` calculation logic if tax formula changes.<br>3. Run `bash scripts/sha256sums.sh generate` to update cryptographic trust anchor.<br>4. Add entry to `REGULATORY_CHANGELOG.md` with provenance metadata.<br>5. Execute `npm test` & release gate. |
| **Ruleset SHA256 Mismatch** | CRITICAL | Module load exception in `engines/rules/integrity.js` | 1. Stop production agent execution immediately.<br>2. Run `bash scripts/sha256sums.sh verify` to isolate tampered JSON file.<br>3. Revert file from git release tag boundary.<br>4. Re-verify SHA256 hashes before resuming. |
| **Benchmark Regression (>30% Drop)** | MEDIUM | `npm run test:perf` warning in CI | 1. Check recent engine commit diffs for unnecessary loops or heavy regex.<br>2. Profile throughput via `node scripts/benchmark.js`.<br>3. Re-baseline only when a justified statutory or correctness change explains the performance impact. |
| **Context Conflict Detected** | LOW / MEDIUM | `contextStatus: 'CONTEXT_CONFLICT'` in output | 1. Direct host agent to request explicit entity structure clarification from user.<br>2. Do not proceed to automatic tax filing without resolved entity status. |
| **Engine Input Exception (`INVALID_INPUT`)** | MEDIUM | `TypeError: INVALID_INPUT` thrown by `requireRupiah` | 1. Host agent catches exception.<br>2. Agent returns structured failure envelope with `status: 'INVALID_INPUT'`.<br>3. Prompt user for valid finite non-negative number. |
| **Downstream LLM Unavailable / Timeout** | HIGH | Network timeout / API 5xx | 1. Host agent falls back to pure Node.js deterministic engines (`engines/`).<br>2. Do not invent explanatory values when context is incomplete.<br>3. Return deterministic results with their actual validation/review status. |
| **LLM Model Hallucination Detected** | HIGH | Output mismatch against golden expectation | 1. Enforce engine isolation mask (`engines/`).<br>2. Override LLM numeric token prediction with pure engine output.<br>3. Preserve provenance and uncertainty flags in the final response. |

---

## 2. Statutory Ruleset Update Procedure

When an Indonesian ministry publishes a new tax or labor regulation:

```text
Step 1: Inspect Gazette
        └─► Identify effective date (effective_from) & statutory reference.

Step 2: Update JSON Ruleset
        └─► Add ruleset object in engines/rules/<domain>.json with effective_from.

Step 3: Update SHA256 Trust Anchor
        └─► bash scripts/sha256sums.sh generate

Step 4: Execute Test Matrix
        └─► npm test

Step 5: Document Provenance
        └─► Add entry in REGULATORY_CHANGELOG.md (Old Rule, New Rule, Date, Impact).

Step 6: Run Release Gate
        └─► npm run validate:release
```

---

## 3. High-Risk Failure Isolation Protocols

- **Rule 1: No Fabricated Answers**. If an engine receives invalid parameters, it throws an explicit `INVALID_INPUT` error rather than guessing zero or returning rounded placeholders.
- **Rule 2: Engine Primacy**. Pure Node.js calculations override LLM probabilistic token predictions for statutory tax and severance figures.
- **Rule 3: Cryptographic Ruleset Anchor**. If `SHA256SUMS.txt` fails verification, engines fail closed on load.
- **Rule 4: Unknown Is Not Zero**. Missing, unverified, or ambiguous facts/options must remain unknown or require review; they must never be silently coerced to a numeric zero or an optimistic default.

---

## 4. Rollback Policy (Code Defect vs Statutory Correction)

When a production rollback is required, operators must distinguish between two rollback types:

1. **Code Defect Rollback (`INC-CRITICAL` / `INC-HIGH`)**:
   - Trigger: Engine calculation bug or logic exception.
   - Action: Revert commit or check out previous SemVer release tag.
   - Run `npm run validate:release` to confirm workspace cleanliness and release gate pass.

2. **Statutory Correction Rollback (`REG-AMENDMENT`)**:
   - Trigger: Government revokes or amends a newly issued regulation with retroactive effect.
   - Action: **Do not delete historical rulesets**. Set `effective_to` on the amended ruleset and append the corrected ruleset with the new `effective_from`. Re-generate SHA256 hashes (`bash scripts/sha256sums.sh generate`).

---

## 5. Change Impact Matrix & Audit Pipeline

```text
Statutory / Engine Change Trigger
               │
               ▼
┌──────────────────────────────┐
│  1. Ruleset & Engine Update  │ ➔ Update engines/rules/*.json & engines/*.js
└──────────────┬───────────────┘
               │
               ▼
┌──────────────────────────────┐
│  2. Trust Anchor Re-Hash     │ ➔ bash scripts/sha256sums.sh generate
└──────────────┬───────────────┘
               │
               ▼
┌──────────────────────────────┐
│  3. Golden Corpus & Test Matrix│ ➔ npm test (All unit, matrix, integration, security tests)
└──────────────┬───────────────┘
               │
               ▼
┌──────────────────────────────┐
│  4. Benchmark & Provenance   │ ➔ node scripts/benchmark.js --json-report
│     Changelog Sync           │ ➔ Update REGULATORY_CHANGELOG.md & PROVENANCE.md
└──────────────┬───────────────┘
               │
               ▼
┌──────────────────────────────┐
│  5. Release Gate & Release   │ ➔ npm run validate:release
└──────────────────────────────┘
```

---

## 6. Maintainer Continuity / Bus-Factor-One Protocol

The repository is currently maintained by a single primary maintainer. This is an explicit operational risk, not a hidden assumption.

### 6.1 Minimum hand-off package

A future maintainer must be able to recover the project using only:

- `docs/OPERATIONAL_RUNBOOK.md`;
- `docs/RELEASE_GOVERNANCE.md`;
- `docs/EXTERNAL_VALIDATION.md`;
- `PROVENANCE.md`;
- `REGULATORY_PIPELINE.md`;
- `canonical-metadata.json`;
- `release-manifest.json`;
- `SHA256SUMS.txt`;
- Git tags and release notes.

### 6.2 If the primary maintainer becomes unavailable

1. Freeze new feature work.
2. Continue only critical security or statutory corrections.
3. Do not change active rulesets without provenance and test evidence.
4. Use the latest verified SemVer release as the rollback boundary.
5. Verify SHA256 integrity before any operational use.
6. Publish a maintenance-status note before reopening normal development.

### 6.3 Co-maintainer policy

A co-maintainer is desirable for high-risk tax/legal rules, but is **not fabricated or claimed until an actual trusted person accepts the role**. Domain ownership should be explicit before any external production dependency is accepted.

---

## 7. External Validation Intake

External validation is a separate evidence stream from maintainer-owned tests.

1. Accept held-out cases from an independent practitioner.
2. Freeze the evaluation rubric before running the comparison.
3. Compare the same model under Vanilla vs Skills-assisted conditions.
4. Preserve source/evidence provenance.
5. Record reviewer scope and limitations.
6. Publish only aggregated/non-sensitive results with reviewer permission.

See `docs/EXTERNAL_VALIDATION.md` for the formal protocol.
