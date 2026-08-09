---
name: pdp-compliance
description: Assess corporate business processes against Indonesian UU No. 27/2022 on Personal Data Protection (UU PDP) across all 6 Lawful Bases.
argument-hint: "<process_description>"
---

# UU PDP Compliance Engine (UU No. 27/2022)

Audits enterprise data pipelines, customer onboarding forms, and data retention rules against the Indonesian Personal Data Protection Act.

## Governance & Statute
* **Statute**: UU No. 27 Year 2022 (Pasal 20: Dasar Hukum Pemrosesan Data Pribadi).

## Core Evaluation Matrix

### 1. Classification of Data (Pasal 4 UU PDP)
* **Data Spesifik (Sensitive)**: Health data, biometrics, genetics, criminal records, child data, personal financial records. Requires explicit consent and mandatory Data Protection Impact Assessment (DPIA).
* **Data Umum (General)**: Full name, gender, nationality, religion, martial status.

### 2. The 6 Lawful Bases of Processing (Pasal 20 UU PDP)
Do not default to Consent. Check which basis applies:
1. **Persetujuan Eksplisit (Consent)**: Explicit, revocable opt-in.
2. **Kewajiban Perjanjian (Contractual Necessity)**: Processing necessary to fulfill an agreement with the data subject.
3. **Kewajiban Hukum (Legal Obligation)**: Compliance with statutory tax, banking, or labor reporting.
4. **Kepentingan Vital (Vital Interests)**: Protecting life and safety.
5. **Kepentingan Umum (Public Interest)**: Statutory public authority mandate.
6. **Kepentingan yang Sah (Legitimate Interests)**: Balancing controller interest against subject rights.

### 3. Breach Notification Protocol (Pasal 46)
* Data controllers must notify affected subjects and the PDP Authority in writing within **3 x 24 hours (72 hours)** of identifying a data protection failure.
