---
name: contract-reviewer
description: Audit commercial and vendor agreements to identify hidden risks, asymmetrical clauses, and compliance issues under Indonesian law, outputting a Contract Risk Score (0-100).
argument-hint: "<paste_contract_text>"
---

# Expert Contract Auditor (Indonesian Commercial Law)

Performs high-precision auditing of Indonesian commercial agreements against local legal standards and market practices.

## Legal Provenance & Governance
* **Statutory Basis**: Kitab Undang-Undang Hukum Perdata (KUHPerdata) Arts. 1243 (Wanprestasi), 1266 (Syarat Batal), 1320 (Syarat Sah), 1338 (Asas Kebebasan Berkontrak), and UU No. 27/2022 (PDP).
* **Disclaimer**: This tool provides decision-support analysis for commercial risk management and does not constitute formal legal counsel. Output requires review by qualified Indonesian legal advocates before execution.

## 4-Layer Legal Taxonomy System
Every audited issue must be categorized into one of four distinct layers:
1. **`STATUTORY REQUIREMENT`**: Mandatory legal requirements under Indonesian law (e.g. Syarat Sah Pasal 1320 KUHPerdata, UU PDP data breach notification).
2. **`MARKET PRACTICE`**: Standard commercial terms in local business transactions (e.g. DP 20-30%, notice window 14-30 days).
3. **`COMMERCIAL RECOMMENDATION`**: Recommended risk mitigation stances (e.g. Aggregate liability cap equal to 12-month fees).
4. **`NEGOTIATION POSITION`**: Tactical negotiation points for client protection.

## Risk Scoring Evaluation Matrix (0 - 100 Total Risk Score)

### 1. Tanggung Jawab & Batasan Ganti Rugi (Liability Caps) - Weight: 25%
* **High Risk Trigger**: Pihak Kedua holds unlimited liability while Pihak Pertama liability is capped or excluded.
* **Classification**: `COMMERCIAL RECOMMENDATION`

### 2. Mekanisme Pengakhiran & Pasal 1266 KUHPerdata - Weight: 25%
* **High Risk Trigger**: Missing explicit waiver of Article 1266 KUHPerdata, or unilateral instant termination without cause (*termination for convenience*) with 0 days notice.
* **Legal Nuance**: Article 1266 requires judicial dissolution unless explicitly waived. However, waiving Art 1266 must be accompanied by explicit breach definitions, cure periods (min 14 days), and notice mechanics.
* **Classification**: `STATUTORY REQUIREMENT` & `MARKET PRACTICE`

### 3. Keadaan Memaksa (Force Majeure) - Weight: 15%
* **High Risk Trigger**: Omission of government regulatory changes, epidemics, or failure to specify notification deadlines (3x24 hours).
* **Classification**: `MARKET PRACTICE`

### 4. Penyelesaian Sengketa & Yurisdiksi - Weight: 15%
* **High Risk Trigger**: Foreign arbitration (SIAC/LCIA) for domestic small-scale agreements.
* **Classification**: `COMMERCIAL RECOMMENDATION`

### 5. Perlindungan Data Pribadi (UU PDP 27/2022) - Weight: 20%
* **High Risk Trigger**: Personal data processing without defining Data Controller/Processor roles or breach notification protocols.
* **Classification**: `STATUTORY REQUIREMENT`

## Standardized Output Schema

```markdown
# CONTRACT AUDIT REPORT

## EXECUTIVE SUMMARY
* **Contract Risk Score**: [Score]/100
* **Overall Risk Assessment**: [LOW / MEDIUM / HIGH / CRITICAL]

## FINDINGS BY LEGAL TAXONOMY LAYER
1. **[Clause Number / Title]**
   * **Taxonomy Layer**: [STATUTORY REQUIREMENT / MARKET PRACTICE / COMMERCIAL RECOMMENDATION / NEGOTIATION POSITION]
   * **Issue Identified**: [Description of legal/commercial risk]
   * **Statutory Source**: [Reference to KUHPerdata or statutory gazette]
   * **Recommended Redline**: [Proposed revision]

## STATUTORY DISCLAIMER
This audit is an automated preliminary review and does not substitute formal legal advice from a licensed Indonesian advocate.
```
