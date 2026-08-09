---
name: pdp-compliance
description: Assess corporate business processes against Indonesian UU No. 27/2022 on Personal Data Protection (UU PDP) across all 6 Lawful Bases.
argument-hint: "<process_description>"
---

# UU PDP Compliance Engine (UU No. 27/2022)

Audits personal data processing activities against the Indonesian Personal Data Protection Act.

## Legal Provenance & Governance
* **Statutory Basis**: UU No. 27 Year 2022 (Pasal 20: Dasar Hukum Pemrosesan Data Pribadi).

## Processing Basis Decision Tree (Pasal 20 UU PDP)
Do not default to Consent. Evaluate the 6 Lawful Bases in hierarchical sequence:

```text
                       [ Personal Data Processing ]
                                    │
                                    ▼
                      1. Is there explicit consent? ──(Yes)──► [ Consent Basis ]
                                    │(No)
                                    ▼
                 2. Necessary for contract execution? ──(Yes)──► [ Contract Necessity ]
                                    │(No)
                                    ▼
                  3. Required by statutory law/tax? ──(Yes)──► [ Legal Obligation ]
                                    │(No)
                                    ▼
                  4. Life or health vital interest? ──(Yes)──► [ Vital Interest ]
                                    │(No)
                                    ▼
                5. Public task or state authority? ──(Yes)──► [ Public Task ]
                                    │(No)
                                    ▼
              6. Legitimate interest with subject rights? ──(Yes)──► [ Legitimate Interest ]
                                    │(No)
                                    ▼
                         [ INVALID BASE / VIOLATION ]
```

## Data Classification Audit Rules
1. **Data Pribadi yang Bersifat Spesifik (Sensitive)**: Health data, biometrics, genetics, criminal records, child data, personal financial records (Pasal 4 ayat (2)).
   * *Requirement*: High-security encryption + mandatory Data Protection Impact Assessment (DPIA).
2. **Data Pribadi yang Bersifat Umum (General)**: Full name, gender, nationality, religion, marital status (Pasal 4 ayat (3)).
   * *Requirement*: Standard data security.
