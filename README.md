# Indonesian Business Agent Skills

*Give AI agents a business brain for Indonesia.*

**Open-source Indonesian business intelligence for AI agents — combining regulatory-grounded skills, temporal rulesets, deterministic engines, and auditable provenance.**

<p align="center">
  <img src="docs/indonesian-business-agent-skills-hero.svg?v=6.11.2" alt="Indonesian Business Agent Skills Banner" width="100%">
</p>

<p align="center">
  <a href="LICENSE"><img src="https://img.shields.io/badge/License-MIT-blue.svg" alt="License: MIT"></a>
  <a href="https://github.com/adamriofc/indonesian-business-agent-skills/actions/workflows/ci.yml"><img src="https://github.com/adamriofc/indonesian-business-agent-skills/actions/workflows/ci.yml/badge.svg" alt="CI Pipeline"></a>
  <a href="https://app.openworklabs.com/"><img src="https://img.shields.io/badge/OpenCode-Compatible-brightgreen.svg" alt="OpenCode Compatibility"></a>
  <a href="engines/"><img src="https://img.shields.io/badge/Hybrid%20Engine-LLM--Safe-orange.svg" alt="LLM-Safe Hybrid Engine"></a>
  <a href="tests/"><img src="https://img.shields.io/badge/Test%20Suite-500%2B%20Assertions-success.svg" alt="500+ Test Assertions"></a>
</p>

---

## 📌 Overview & Value Proposition

<!-- GENERATED:STATS -->
| Metric | Single Source of Truth Value | Measurement Scope |
|---|---|---|
| **Repository Version** | `v6.11.2` | SemVer release boundary |
| **Canonical Plugins** | `6` | Active plugin packages (`legal-id`, `tax-id`, `hr-id`, `finance-id`, `marketing-id`, `strategic-id`) |
| **Agent Skills** | `88` | Machine-readable `SKILL.md` capability packs |
| **Deterministic Engines** | `39` | Pure Node.js calculation & regulatory diff engines (`engines/`) |
| **Golden Cases** | `121` | Static corpus cases across 27 benchmark domains |
| **Benchmark Assertions** | `424` | Deterministic assertions in `tests/benchmarks/` |
| **Total Test Assertions** | `508+` | Deepened matrix assertions across full `npm test` suite |
| **Node.js Compatibility** | `20 / 22 / 24` | `20` (Minimum), `22` (LTS Recommended), `24` (Current Tested) |
<!-- /GENERATED:STATS -->

**Indonesian Business Agent Skills** is an open-source domain-intelligence infrastructure designed to give AI agents an authentic Indonesian business and regulatory intelligence layer. Built for **OpenWork Desktop**, **OpenCode CLI**, **Claude Code (CLI)**, **Cursor IDE**, **Codex**, and custom agent frameworks, this repository integrates **88 Agent Skills** with **39 Deterministic Computational & Regulatory Diff Engines** (`engines/`) and single-source-of-truth temporal JSON rulesets (`engines/rules/`).

> **Validation boundary:** The repository currently targets **L3 Production Decision-Support**. Automated tests, deterministic benchmarks, provenance checks, and release gates are maintainer-owned engineering evidence. **Independent external domain validation and enterprise production proof are still pending and are not claimed.** See [`PRODUCTION_READINESS.md`](PRODUCTION_READINESS.md), [`docs/EXTERNAL_VALIDATION.md`](docs/EXTERNAL_VALIDATION.md), and [`docs/AUDIT_CLOSURE.md`](docs/AUDIT_CLOSURE.md).

### 💡 Why Standard LLMs Fail at Indonesian Business & Compliance Calculations
Generic AI models (such as unassisted ChatGPT or Claude) predict words probabilistically (*token prediction*). When tasked with calculating TER PPh 21 income tax, PHK severance payouts, or corporate loan interest, standard LLMs encounter 3 critical failure modes:
1. **Arithmetic Hallucination**: AI models guess numbers rather than computing equations, leading to incorrect tax bracket assignments and faulty severance math.
2. **Temporal Ambiguity**: AI models fail to track statutory wage caps and rate adjustments across transition windows (such as BPJS JP wage cap adjustments in March 2025 vs March 2026).
3. **Unverifiable Lineage**: Standard AI responses lack traceable references to official gazettes (*lembaran negara*), rendering them unsuited for corporate audits.

### 🛡️ The Hybrid Architecture Solution
This repository decouples AI **reasoning** from **calculation**:
- **AI (Agent Skill)**: Understands natural language, extracts parameters, and synthesizes explanations.
- **Engine (Node.js)**: Computes exact invariant mathematics (deterministic computation removes LLM arithmetic hallucination within the engine) per official government rulesets.

---

## ⚡ 30-Second Killer Cross-Domain Demo

```text
User: "My company is a PT Management Consulting firm (KBLI 70209) with IDR 5 Billion turnover and 15 employees.
       We want to open a second branch and add 10 employees. Is this expansion compliant across Tax, HR, Legal, and Strategy?"

Agent (Skill-Assisted Execution):
1. [KBLI Router]: KBLI 70209 ➔ PROFESSIONAL_SERVICE Archetype (Capacity Unit: Service Practice Lines).
2. [Tax Engine]: PP 20/2026 Ineligibility Flagged (PT Corporate must use General PPh 31E at 11%/22%, not 0.5% UMKM).
3. [HR Engine]: 25 Total Employees ➔ Mandatory Wage Structure & Scale (Permenaker 1/2017) + BPJS JP Cap update.
4. [Legal Engine]: Audit Article 1266 KUHPerdata waiver & PDP Data Processing Addendum (UU 27/2022).
5. [Decision Engine]: MCDA Weighted Score = 8.2/10 (RECOMMENDED WITH TAX REGIME SWITCH).
```

## ⚙️ Compatibility & Testing Matrix

| Agent Runtime / Environment | Integration Level | Status | Verification Mechanism |
|---|---|---|---|
| **Node.js (v20, v22, v24)** | Native Engine Execution (`engines/`) | ✅ **Verified** | CI Matrix (`npm test` 508+ test assertions & 121 golden cases) |
| **OpenCode CLI** | Native Skill Integration (`.opencode/skills/`) | ✅ **Verified** | Automated Schema & Skill Protocol Tests |
| **OpenWork Desktop & Cloud** | Native Plugin Manifest (`.claude-plugin/`) | ✅ **Verified** | Marketplace Schema Store & SHA-256 Ruleset Integrity |
| **Claude Code (CLI)** | Native Plugin Installer (`npx skills`) | ✅ **Verified** | Universal Skill Protocol (`SKILL_PROTOCOL.md`) |
| **Cursor IDE** | Skill Shorthand (`.cursor/skills/`) | 🟡 **Compatible** | Agent Skill Standard Structure (`SKILL.md`) |
| **Codex** | Skill Shorthand (`.agents/skills/`) | 🟡 **Compatible** | Agent Skill Standard Structure (`SKILL.md`) |
| **Custom SDK / REST Adapters** | Protocol-Level Adapter | ⚪ **Planned** | Pure Math Engines & Decoupled JSON Rulesets |

---

## 🏗️ System Architecture

```text
                                  [ User / Agent Query ]
                                            │
                                            ▼
                        ┌──────────────────────────────────────┐
                        │      SEMANTIC BUSINESS CONTEXT       │
                        │ Entity, KBLI, Product, Facts, Scale  │
                        └──────────────────┬───────────────────┘
                                           │
                        ┌──────────────────┴───────────────────┐
                        ▼                                      ▼
            ┌──────────────────────┐               ┌──────────────────────┐
            │   KBLI 2020 ROUTER   │               │   PRODUCT CONTEXT    │
            │  Business Activity   │               │ BTKI 2022 / HS-6 /   │
            │  ➔ Business Archetype│               │ Lartas / Landed Cost │
            └───────────┬──────────┘               └──────────┬───────────┘
                        │                                     │
                        └──────────────────┬──────────────────┘
                                           ▼
                ┌──────────────────────────────────────────────────────┐
                │      39 Deterministic Node.js Math & Diff Engines    │
                │ 28 statutory (engines/*.js + SSOT temporal rulesets) │
                │ 8 finance (engines/*.js — pure standard math)        │
                │ 3 strategic & product classification engines         │
                └──────────────────┬───────────────────┬───────────────┘
                                   │                   │
                                   ▼                   ▼
        ┌──────────────────────────────┐   ┌──────────────────────────────────────┐
        │ Single Source of Truth Rules │   │ Cryptographic SHA-256 Checksums     │
        │ (engines/rules/*.json)       │   │ (engines/rules/integrity.js +        │
        │ — statutory & policy only    │   │  SHA256SUMS.txt)                     │
        └──────────────┬───────────────┘   └──────────────────┬───────────────────┘
                       │                                      │
                       └──────────────────────────┬───────────┘
                                                  │
                                                  ▼
                           ┌──────────────────────────────────────┐
                           │  Validated Statutory Output + Math   │
                           └──────────────────┬───────────────────┘
                                              │
