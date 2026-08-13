---
name: legal-memo-id
description: "Format disputes or commercial conflicts into structured legal opinions (Memorandum Hukum) following Indonesian court formats."
argument-hint: <dispute_facts> <questions_of_law>
risk_level: MEDIUM
rule_type: statutory
quality_tier: source-verified
allowed-tools: bash
capability:
  requires: [<dispute_facts> <questions_of_law>]
  produces: [riskScore, detectedViolations, redlines, safeToUse]
  deterministic: true
  cross_domain_relevance:
    tax: medium
    hr: high
    finance: medium
---

# Legal Opinion (Memorandum Hukum) Generator

Formulates complex legal analysis into standard Indonesian advocate memorandum formats.

## Document Structure
1. **Judul & Header**: MEMORANDUM HUKUM (LEGAL MEMO).
2. **Posita / Duduk Perkara (Fakta Hukum)**: Chronological facts supported by documentary evidence.
3. **Isu Hukum (Legal Issues)**: Specific questions of law to be answered.
4. **Dasar Hukum (Legal Basis)**: Specific articles in KUHPerdata, UU, PP, or Supreme Court Decisions (Yurisprudensi MA).
5. **Analisis Hukum (Legal Analysis)**: Objective breakdown of risk exposure and liability.
6. **Kesimpulan & Rekomendasi (Conclusion & Actionable Strategy)**: Pre-litigation warnings (Somasi), negotiation stance, or court dispute strategy.
