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
- Static golden corpus (`tests/golden/`): **85 cases across all 27 engine modules** (20 benchmark domains) — fast batch, deterministic, key-free.
- Deepened matrix in CI: 425 PPh 21 cases, 225 PHK cases, 20 integration assertions, 27 engine modules, security suite (see `npm test`).

Run: `node scripts/benchmark.js [--llm] [--json-report path]`

---

## 2. Latest Results — Deterministic Run

**Date: 2026-08-10 — Node.js v26.5.1 — `scripts/benchmark.js` v2.3.0 (27-engine coverage: added regulatory-impact, compliance-risk, business-scenario, decision-engine domains)**

| Engine | Cases | Accuracy | Determinism (3×) | Throughput |
|---|---|---|---|---|
| PPh 21 (TER PP 58/2023) | 6 | **100.00%** | OK, identical | 19,803 ops/second |
| BPJS (Perpres 64/2020 + PP 45/2015) | 3 | **100.00%** | OK, identical | 13,876 ops/second |
| PHK (PP 35/2021) | 3 | **100.00%** | OK, identical | 28,671 ops/second |
| UMKM Final Tax (PP 55/2022 & PP 20/2026) | 5 | **100.00%** | OK, identical | 35,386 ops/second |
| THR (Permenaker 6/2016) | 6 | **100.00%** | OK, identical | 98,807 ops/second |
| PPh 23/26 (withholding & treaty) | 8 | **100.00%** | OK, identical | 88,951 ops/second |
| PKWT Compensation (PP 35/2021) | 8 | **100.00%** | OK, identical | 111,562 ops/second |
| PKWTT Audit & Conversion (PP 35/2021) | 5 | **100.00%** | OK, identical | 41,164 ops/second |
| Regulatory Diff Engine | 2 | **100.00%** | OK, identical | 8,262 ops/second |
| PPh 21 Gross-Up (PMK 66/2023) | 2 | **100.00%** | OK, identical | 5,456 ops/second |
| PPh Badan 22% & Pasal 31E | 4 | **100.00%** | OK, identical | 34,996 ops/second |
| Thin Cap & TP Adjustment (PMK 172/2023) | 1 | **100.00%** | OK, identical | 14,659 ops/second |
| PPN 12% & PPnBM (UU HPP & PMK 131/2024) | 5 | **100.00%** | OK, identical | 58,678 ops/second |
| Marketplace Fee & Margin | 7 | **100.00%** | OK, identical | 62,827 ops/second |
| VC Term-Sheet Waterfall | 2 | **100.00%** | OK, identical | 14,326 ops/second |
| Regulatory Impact Intelligence | 2 | **100.00%** | OK, identical | 10,917 ops/second |
| Compliance Risk Engine | 2 | **100.00%** | OK, identical | 20,830 ops/second |
| Business Scenario & Lifecycle Engine | 2 | **100.00%** | OK, identical | 27,450 ops/second |
| Business Decision Engine | 1 | **100.00%** | OK, identical | 15,727 ops/second |
| Finance (8 engines: BE, DEP, NPV, IRR, LOAN, RAT, WC, EOQ) | 11 | **100.00%** | OK, identical | 10,413 ops/second |

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
- The golden-corpus run uses 78 cases; the 100% claim refers to the corpus + the deepened CI matrix (±680 cases) run on every push.
- Throughput depends on hardware; only compare runs on the same machine.
- LLM mode is not run by default (requires a key) — figures appearing in README/PROVENANCE originate only from the tables above.