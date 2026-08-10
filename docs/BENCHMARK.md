# Benchmark Report — `indonesian-business-agent-skills`

Official methodology and measurement results. **Rule: no number is ever written without having been measured.** This document only contains figures from actual runs; any new and different run must update the tables below.

---

## 1. Measurement Scope

| Layer | Question | Tool |
|---|---|---|
| 1. Deterministic Accuracy | Does the engine match the golden corpus? | `scripts/benchmark.js` |
| 2. Determinism | Is the output identical across repeated executions? | `scripts/benchmark.js` (3× executions) |
| 3. Performance | How many operations per second per engine? | `scripts/benchmark.js` |
| 4. LLM Baseline (optional) | How do general LLM models compare against the engine? | `scripts/benchmark.js --llm` |

Corpus used:
- Static golden corpus (`tests/golden/`): 6 PPh 21 cases, 3 BPJS cases, 3 PHK cases, 11 Finance cases (8 engines) — fast batch, deterministic, key-free.
- Deepened matrix in CI: 425 PPh 21 cases, 225 PHK cases, 20 integration assertions, 12 engine modules (4 statutory + 8 finance), security suite (see `npm test`).

Run: `node scripts/benchmark.js [--llm] [--json-report path]`

---

## 2. Latest Results — Deterministic Run

**Date: 2026-08-10 — Node.js v26.5.1 — `scripts/benchmark.js` v2.0.0 (harness update: finance domain + deep-array match + space-tolerant `--json-report` parser)**

| Engine | Cases | Accuracy | Determinism (3×) | Throughput |
|---|---|---|---|---|
| PPh 21 (TER PP 58/2023) | 6 | **100.00%** | OK, identical | 3.907 ops/second |
| BPJS (Perpres 64/2020 + PP 45/2015) | 3 | **100.00%** | OK, identical | 13.100 ops/second |
| PHK (PP 35/2021) | 3 | **100.00%** | OK, identical | 22.083 ops/second |
| Finance (8 engines: BE, DEP, NPV, IRR, LOAN, RAT, WC, EOQ) | 11 | **100.00%** | OK, identical | 6.391 ops/second |

Methodology notes:
- Numeric tolerance of 1% or Rp 1 (whichever is larger) — a looser standard than the repo's strict tolerance (0) in `npm test`.
- `ops/s` is noisy across runs on the same machine (3×–5× variation); only compare within the same run. Each run's JSON report stores the actual figures (`--json-report path`).
- Determinism is measured over 3 executions per case; 0 violations across all domains (including multiline arrays such as depreciation schedules, thanks to deep-array match).

---

## 3. LLM Baseline Comparison (how to run)

The harness compares deterministic engines against general LLM models on the same cases, with natural-language prompts and the same tolerance (1% / Rp 1).

```bash
# Any OpenAI-compatible endpoint (including routers/aggregators)
LLM_BENCH_KEY=sk-... \
LLM_BENCH_BASE=https://api.openai.com/v1 \
LLM_BENCH_MODEL=gpt-4o-mini \
node scripts/benchmark.js --llm --llm-sample 15
```

Prompt used (per case): case description + JSON input + the instruction "answer with only one JSON line containing the fields: ..." with `temperature: 0`. JSON parse failures count as model failures.

**Current status**: never run with an external key yet — the table below is only populated after a real run (no fiction policy).

| Date | Model | Domain | Engine pass | LLM pass | Note |
|---|---|---|---|---|---|
| _(no run yet)_ | — | — | — | — | Run with the command above |

---

## 4. Limits & Non-Claims

- This benchmark measures **deterministic calculation accuracy**, not contract drafting/analysis quality (outside the numeric engine scope).
- The fast golden-corpus run uses 23 cases; the 100% claim refers to the corpus + the deepened CI matrix (±680 cases) run on every push.
- Throughput depends on hardware; only compare runs on the same machine.
- LLM mode is not run by default (requires a key) — figures appearing in README/PROVENANCE originate only from the tables above.