# External Validation Protocol

Status: **PENDING**

This repository distinguishes automated self-validation from independent external validation. A green test suite proves that the repository behaves according to its own executable specifications; it does **not** prove that every statutory interpretation, recommendation, or business assumption is correct in the real world.

## Objective

Obtain independent evidence that the reasoning layer is useful and materially correct beyond the maintainer's own test corpus.

## Recommended Review Panel

At least 2 independent reviewers are preferred for the first external validation cycle:

1. Indonesian tax practitioner / tax consultant for Tax and import-tax cases.
2. Indonesian employment-law practitioner / HR compliance specialist for HR and labor cases.
3. Optional: accountant / finance professional and strategy/business practitioner for Finance and Strategic domains.

Reviewer identities should only be published with explicit permission.

## Review Method

Reviewers should provide or approve **held-out cases** that were not authored from the repository's existing golden corpus. Each case should include:

- business context;
- jurisdiction and as-of date;
- applicable business activity / KBLI where relevant;
- product / BTKI context where relevant;
- expected material facts;
- applicable legal/regulatory basis where the reviewer is willing to provide it;
- expected calculation or decision boundary;
- known ambiguity or limitations.

The test should compare:

```text
Same model
Same case
Same evaluator

Vanilla LLM
vs
LLM + Business Agent Skills
```

For cross-domain cases, the preferred conditions are:

```text
A — Vanilla
B — Context
C — Skills
D — Skills + Engines
E — Full Stack
```

## Scoring

External reviewers should score outputs independently across:

- Context Specificity
- Evidence Grounding
- Recommendation Specificity
- Actionability
- Financial / Regulatory Feasibility
- Constraint Awareness
- Cross-Domain Consistency
- Hallucination / Unsupported-Claim Absence

The repo should publish `n`, mean, median, standard deviation, delta, and 95% confidence interval where sample size permits meaningful interpretation.

## Publication Standard

An external-validation result may be promoted to a public benchmark claim only when:

- reviewer independence is disclosed;
- the evaluation set is versioned;
- the scoring rubric is frozen before evaluation;
- held-out cases are identified as such;
- source/evidence provenance is preserved;
- limitations and disagreements are reported;
- raw private business data are not exposed.

## Current Evidence Boundary

**No independent external validation is claimed yet.** The current repository's deterministic benchmarks, security suite, provenance checks, and L3 production-readiness controls remain maintainer-owned validation artifacts until an external review is completed.
