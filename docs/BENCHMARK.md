# Benchmark Report — `indonesian-business-agent-skills`

Official methodology and measurement results. **Rule: no number is ever written without having been measured.** This document contains figures from actual, reproducible runs; any new execution updates the benchmark artifact stored at [`docs/benchmark-results/latest.json`](./benchmark-results/latest.json).

---

## 1. Measurement Scope & 3-Tier Evaluation Taxonomy

To ensure scientific rigor, clear nomenclature, and eliminate unsubstantiated claims, repository performance is evaluated across a **3-Tier Evaluation Taxonomy**:

| Tier | Evaluation Focus | Question Answered | Test Tool / Suite | Status / Pass Rate |
|---|---|---|---|---|
| **Tier 1: Deterministic Engine Math** | Calculation & invariant precision | Does the Node.js engine compute equations with 0% arithmetic error per official rulesets? | `scripts/benchmark.js` | **100.00% Pass Rate** (92 Golden Cases) |
| **Tier 2: Rule-Based Parameter Extraction** | Pattern & slot extraction fixture | Does the extraction parser parse numeric values, PTKP statuses, and dates from natural language text? | `tests/benchmarks/nlp-extraction-benchmark.test.js` | **100.00% Pass Rate** (50 Fixture Cases) |
| **Tier 3: Cross-Domain Integration & Decision** | Multi-domain workflow integration | Do payroll, BPJS, THR, PHK, THP, and tax regime decisions integrate accurately across enterprise lifecycles? | `tests/benchmarks/agent-decision-benchmark.test.js` | **100.00% Pass Rate** (25 Decision Cases) |

### Golden Corpus & Benchmark Artifact Scope:
- **Static Golden Corpus (`tests/golden/`)**: **92 golden cases across all 32 engine modules** (25 benchmark domains) — fast batch, deterministic, zero-dependency.
- **Deepened Matrix in CI**: 425 PPh 21 cases, 225 PHK cases, 50 enterprise integration scenario assertions, 32 engine modules, security suite (see `npm test`).
- **Benchmark Artifact**: Automatically generated at `docs/benchmark-results/latest.json`.

Run command: `node scripts/benchmark.js [--llm] [--json-report docs/benchmark-results/latest.json]`

---

## 2. Latest Deterministic Execution Results (Tier 1)

**Date: 2026-08-12 — Node.js v26.5.1 — `scripts/benchmark.js` v6.0.0 (38-engine coverage)**

| Benchmark Domain | Cases | Golden Accuracy Pass Rate | Determinism (3×) | Throughput |
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
| Strategic Framework Engine (BCG & GE) | 2 | **100.00%** | OK, identical | 36,651 ops/second |
| Decision Analysis Engine (MCDA) | 1 | **100.00%** | OK, identical | 6,885 ops/second |
| Scenario & Sensitivity Analysis Engine | 1 | **100.00%** | OK, identical | 12,922 ops/second |
| Strategic Risk Scoring & Heatmap Engine | 1 | **100.00%** | OK, identical | 9,685 ops/second |
| KBLI Context Router & Archetype Classifier | 2 | **100.00%** | OK, identical | 25,725 ops/second |
| Finance (8 deterministic engines) | 11 | **100.00%** | OK, identical | 10,413 ops/second |

---

## 3. Empirical LLM Baseline vs Skill-Assisted Agent Comparison

The benchmark harness compares deterministic engine executions against a general LLM baseline on identical cases with numeric tolerance (1% or Rp 1).

**Execution Metadata**:
- **Date**: 2026-08-10
- **Model Tested**: `gpt-4o-mini` (temperature: 0)
- **Sample Size**: 25 golden cases across 5 core domains

| Evaluation Domain | Engine Golden Pass Rate | LLM Baseline Pass Rate | Primary LLM Failure Mode |
|---|---|---|---|
| PPh 21 TER (PP 58/2023) | **100.00%** | 66.67% | Miscalculated Category A TER rate & December reconciliation rounding |
| BPJS (Perpres 64/2020) | **100.00%** | 66.67% | Failed historical vs current JP wage cap boundary (March 2025 transition) |
| PHK Severance (PP 35/2021) | **100.00%** | 66.67% | Hallucinated 15% UPH housing allowance calculation removed in Cipta Kerja |
| UMKM Final Tax (PP 20/2026) | **100.00%** | 80.00% | Applied Rp 500M non-taxable threshold exemption to Corporate PT entity post-2026 |
| Finance & Ratios (8 engines) | **100.00%** | 72.73% | Accumulated arithmetic rounding drift in IRR iteration & loan schedule |
| **EMPIRICAL AVERAGE** | **100.00%** | **70.54%** | **Engine isolation eliminates LLM arithmetic hallucination & temporal drift** |

---

## 4. Limits & Non-Claims

- **Pass Rate Scope**: The 100.00% pass rate refers specifically to execution on the published 92 golden cases + CI test matrix (±680 assertions).
- **Human Review Boundary**: Outputs serve as decision-support intelligence and do not replace licensed advocate or CPA consultation for high-stakes filings.
