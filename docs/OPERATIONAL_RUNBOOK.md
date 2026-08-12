# Operational Runbook (\`docs/OPERATIONAL_RUNBOOK.md\`)

Standard operating procedures for agent maintainers and enterprise operators handling incident scenarios, statutory updates, benchmark regressions, and runtime failures.

---

## 1. Incident Response Matrix

| Incident Scenario | Severity | Trigger / Detection | Standard Operating Procedure (SOP) |
|---|---|---|---|
| **Statutory Ruleset Amendment** | HIGH | Government gazette issue (Lembaran Negara / PMK) | 1. Create new ruleset entry in `engines/rules/` with effective date.<br>2. Update `engines/` calculation logic if tax formula changes.<br>3. Run `bash scripts/sha256sums.sh generate` to update cryptographic trust anchor.<br>4. Add entry to `REGULATORY_CHANGELOG.md` with provenance metadata.<br>5. Execute `npm test` & release gate. |
| **Ruleset SHA256 Mismatch** | CRITICAL | Module load exception in `engines/rules/integrity.js` | 1. Stop production agent execution immediately.<br>2. Run `bash scripts/sha256sums.sh verify` to isolate tampered JSON file.<br>3. Revert file from git release tag boundary.<br>4. Re-verify SHA256 hashes before resuming. |
| **Benchmark Regression (>30% Drop)** | MEDIUM | `npm run test:perf` warning in CI | 1. Check recent engine commit diffs for unnecessary loops or heavy regex.<br>2. Profile throughput via `node scripts/benchmark.js`.<br>3. Re-baseline if engine complexity increased for new statutory requirements. |
| **Context Conflict Detected** | LOW / MEDIUM | `contextStatus: 'CONTEXT_CONFLICT'` in output | 1. Direct host agent to request explicit entity structure clarification from user.<br>2. Do not proceed to automatic tax filing without resolved entity status. |
| **Engine Input Exception (`INVALID_INPUT`)** | MEDIUM | `TypeError: INVALID_INPUT` thrown by `requireRupiah` | 1. Host agent catches exception.<br>2. Agent returns structured failure envelope with `status: 'INVALID_INPUT'`.<br>3. Prompt user for valid finite non-negative number. |
| **Downstream LLM Unavailable / Timeout** | HIGH | Network timeout / API 5xx | 1. Host agent falls back to pure Node.js deterministic engines (`engines/`).<br>2. Return calculation results directly with `confidence: 'HIGH'`. |
| **LLM Model Hallucination Detected** | HIGH | Output mismatch against golden expectation | 1. Enforce engine isolation mask (`engines/`).<br>2. Override LLM numeric token prediction with pure engine output. |

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
- **Rule 2: Engine Primacy**. Pure Node.js calculations override LLM probabilistic token predictions for all statutory tax and severance figures.
- **Rule 3: Cryptographic Ruleset Anchor**. If `SHA256SUMS.txt` fails verification, engines fail closed on load.
