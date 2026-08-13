# Indonesian Business Agent Skills

*Give AI agents a business brain for Indonesia.*

**Open-source Indonesian business intelligence for AI agents — combining domain-specific skills, semantic business context, deterministic engines, temporal rulesets, and auditable provenance across Legal, Tax, HR, Finance, Marketing, and Strategy.**

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

**Indonesian Business Agent Skills** is an open-source domain-intelligence infrastructure designed to give AI agents an authentic Indonesian business reasoning layer. It is intentionally **not tax-only or legal-only**: the six canonical domains are independently useful and can compose through a shared Semantic Business Context. The repository supports **OpenWork Desktop**, **OpenCode CLI**, **Claude Code (CLI)**, **Cursor IDE**, **Codex**, and custom agent frameworks.

### 🧠 One Business Context, Six Specialized Lenses

```text
                         SEMANTIC BUSINESS CONTEXT
                                      │
       ┌──────────────┬──────────────┼──────────────┬──────────────┬──────────────┐
       ▼              ▼              ▼              ▼              ▼              ▼
     LEGAL           TAX             HR           FINANCE       MARKETING      STRATEGY
       │              │              │               │              │              │
       └──────────────┴──────────────┴──────┬────────┴──────────────┴──────────────┘
                                             ▼
                                    CROSS-DOMAIN DECISION
```

Each domain should remain useful on its own. Cross-domain composition is activated only when the user's problem actually requires it; the agent should not invoke every plugin by default.

See [`docs/DOMAIN_CAPABILITY_MATRIX.md`](docs/DOMAIN_CAPABILITY_MATRIX.md) for the intended domain boundaries and validation matrix.

> **Validation boundary:** The repository currently targets **L3 Production Decision-Support**. Automated tests, deterministic benchmarks, provenance checks, and release gates are maintainer-owned engineering evidence. **Independent external domain validation and enterprise production proof are still pending and are not claimed.** See [`PRODUCTION_READINESS.md`](PRODUCTION_READINESS.md), [`docs/EXTERNAL_VALIDATION.md`](docs/EXTERNAL_VALIDATION.md), and [`docs/AUDIT_CLOSURE.md`](docs/AUDIT_CLOSURE.md).

### 💡 Why Standard LLMs Fail at Indonesian Business Reasoning

Generic AI models often provide broad or generic advice when the user needs a domain-specific business decision grounded in Indonesian context. Typical failure modes include:
1. **Arithmetic Hallucination**: probabilistic models can produce incorrect calculations for tax, finance, payroll, unit economics, and other numeric decisions.
2. **Temporal Ambiguity**: models can miss effective-date changes across Indonesian regulatory and policy windows.
3. **Weak Business Grounding**: models can produce formally plausible but generic recommendations when they lack structured business context, domain procedures, constraints, objectives, or local classifications.
4. **Unverifiable Lineage**: business-critical outputs may lack traceable rule or evidence lineage.

### 🛡️ The Hybrid Architecture Solution
This repository separates specialized AI reasoning from deterministic computation and shared business context:
- **Agent Skills**: domain-specific procedures for Legal, Tax, HR, Finance, Marketing, and Strategy.
- **Semantic Business Context**: shared KBLI/activity, Product Context/BTKI where relevant, facts, relations, constraints, objectives, and decision options.
- **Deterministic Engines**: exact invariant mathematics and temporal rule execution where computation should not be delegated to probabilistic generation.
- **LLM**: synthesizes the validated domain outputs into a user-facing decision or recommendation.

---

## ⚡ 30-Second Killer Cross-Domain Demo

```text
User: "My company is a PT Management Consulting firm (KBLI 70209) with IDR 5 Billion turnover and 15 employees.
       We want to open a second branch and add 10 employees. Is this expansion feasible, and what should we change?"

Agent (Skill-Assisted Execution):
1. [KBLI Router]   → PROFESSIONAL_SERVICE business archetype and operating context.
2. [Tax]           → evaluates the applicable tax regime and transition implications.
3. [HR]            → models headcount, payroll, BPJS, and workforce compliance impacts.
4. [Legal]         → checks contract/data/compliance implications relevant to expansion.
5. [Finance]       → evaluates incremental payroll/capacity economics and financial feasibility.
6. [Strategy]      → compares expansion options and trade-offs using the shared objectives/constraints.
7. [Decision Layer]→ returns a prioritized recommendation with domain dependencies and review boundaries.
```

### 🔎 Domain Coverage Is Independently Useful

The repository is designed to answer very different user needs without forcing unrelated domains into the workflow:

| User need | Primary lens | Typical secondary lenses |
|---|---|---|
| Contract / legal risk | Legal | HR, Tax, Strategy |
| Tax calculation / planning | Tax | Finance, Legal, Product |
| Hiring / payroll / termination | HR | Tax, Finance, Legal |
| Valuation / financing / unit economics | Finance | Strategy, Marketing, Tax |
| Market / pricing / marketplace problem | Marketing | Finance, Product, Strategy |
| Strategic planning / decision-making | Strategy | Finance, Marketing, HR, Legal |

### ⚙️ Compatibility & Testing Matrix

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
                        │ Entity, KBLI, Product, Facts,       │
                        │ Relations, Constraints, Objectives  │
                        └──────────────────┬───────────────────┘
                                           │
                  ┌────────────────────────┼─────────────────────────┐
                  ▼                        ▼                         ▼
         ┌─────────────────┐     ┌────────────────────┐     ┌────────────────────┐
         │ DOMAIN SKILLS   │     │ PRODUCT / KBLI     │     │ DECISION CONTEXT   │
         │ Legal / Tax /   │     │ Business Activity  │     │ Options / Tradeoffs│
         │ HR / Finance /  │     │ + Product/BTKI     │     │ + Objectives       │
         │ Marketing /     │     │ where relevant     │     │ + Constraints      │
         │ Strategy        │     └────────────────────┘     └────────────────────┘
         └────────┬────────┘
                  │
                  └─────────────────────┬───────────────────────────
                                        ▼
                ┌──────────────────────────────────────────────────────┐
                │      39 Deterministic Node.js Math & Diff Engines    │
                │ 28 statutory + 8 finance + strategic/product engines │
                └──────────────────┬───────────────────────────────────┘
                                   │
                                   ▼
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
                           │ Validated Domain Outputs + Evidence  │
                           └──────────────────┬───────────────────┘
                                              │
                                              ▼
                                   Cross-Domain Decision Layer
                                              │
                                              ▼
                                         LLM Synthesis
                                              │
                                              ▼
                                    Specific User Response
```

---
