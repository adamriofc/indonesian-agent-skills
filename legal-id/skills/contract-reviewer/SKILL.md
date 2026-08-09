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

## Risk Scoring Evaluation Matrix (0 - 100 Total Risk Score)
Evaluate the document across these 5 core weighted dimensions:

### 1. Tanggung Jawab & Batasan Ganti Rugi (Liability Caps) - Weight: 25%
* **High Risk Trigger**: Pihak Kedua holds unlimited liability while Pihak Pertama liability is capped or excluded.
* **Standard Market Position**: Total aggregate liability of either party shall not exceed the actual total contract value paid in the preceding 12 months, except for gross negligence (*kelalaian berat*) or willful misconduct (*kesengajaan*).

### 2. Mekanisme Pengakhiran & Pasal 1266 KUHPerdata - Weight: 25%
* **High Risk Trigger**: Missing explicit waiver of Article 1266 KUHPerdata, requiring court intervention to terminate. Or unilateral instant termination without cause (*termination for convenience*) with 0 days notice.
* **Standard Market Position**: Explicit waiver of court order requirement under Art. 1266 KUHPerdata, accompanied by a mandatory written notice window (minimum 14 or 30 days) and cure period (*waktu perbaikan*).

### 3. Keadaan Memaksa (Force Majeure) - Weight: 15%
* **High Risk Trigger**: Omission of government regulatory changes, epidemics, or failure to specify notification deadlines.
* **Standard Market Position**: Force majeure triggers require written notice within 3x24 hours (72 hours) of occurrence, followed by mutual assessment.

### 4. Penyelesaian Sengketa & Yurisdiksi - Weight: 15%
* **High Risk Trigger**: Specifying foreign court/arbitration (e.g., SIAC Singapore) for small-scale local domestic service contracts.
* **Standard Market Position**: Distinguish between Pengadilan Negeri (Local District Court) and BANI (Badan Arbitrase Nasional Indonesia).

### 5. Perlindungan Data Pribadi (UU PDP 27/2022) - Weight: 20%
* **High Risk Trigger**: Contract involves personal data processing without defining Data Controller vs Data Processor roles or security standards.
* **Standard Market Position**: Dedicated Data Processing Addendum (DPA) specifying data breach notification within 72 hours.

## Execution Workflow
1. Parse the submitted contract clause by clause.
2. Calculate the **Contract Risk Score (0-100)**:
   * 0 - 30: **LOW RISK** (Standard commercial terms).
   * 31 - 60: **MEDIUM RISK** (Requires minor redline negotiations).
   * 61 - 85: **HIGH RISK** (Contains asymmetrical liability or ambiguous termination terms).
   * 86 - 100: **CRITICAL RISK** (Severe exposure; do not sign without legal intervention).
3. Output the findings in the **Standardized Audit Report Format**.

## Standardized Output Schema

```markdown
# CONTRACT AUDIT REPORT

## EXECUTIVE SUMMARY
* **Contract Risk Score**: [Score]/100
* **Overall Risk Assessment**: [LOW / MEDIUM / HIGH / CRITICAL]

## CRITICAL RISK FINDINGS
1. **[Clause Number / Title]**
   * **Issue Identified**: [Description of legal/commercial risk]
   * **Statutory / Market Risk**: [Reference to KUHPerdata or market standard]
   * **Recommended Action**: [Negotiation stance]

## PROPOSED REDLINE REVISIONS
```diff
- Original: [Exact original clause text]
+ Proposed Redline: [Revised clause text maintaining client protection]
```

## STATUTORY & COMPLIANCE DISCLAIMER
This audit is an automated preliminary review and does not substitute formal legal advice from a licensed Indonesian advocate.
```
