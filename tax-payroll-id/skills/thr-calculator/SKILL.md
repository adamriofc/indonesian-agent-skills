---
name: thr-calculator
description: Calculate statutory Indonesian religious holiday allowance (Tunjangan Hari Raya - THR) per Permenaker No. 6/2016.
argument-hint: "<gaji_pokok> <tunjangan_tetap> <masa_kerja_bulan>"
risk_level: HIGH
rule_type: statutory
---

# Statutory THR Payout Calculator

Calculates religious holiday allowance payouts according to Permenaker No. 6/2016.

## Statutory Rules
* **Statute**: Peraturan Menteri Ketenagakerjaan No. 6 Tahun 2016.
* **Deadline**: Mandatory payout at least 7 days prior to Hari Raya Keagamaan. Cash payment only.
* **Formula**:
  * Masa Kerja >= 12 Bulan: `1 x (Gaji Pokok + Tunjangan Tetap)`.
  * Masa Kerja 1 - 11 Bulan: `(Masa Kerja / 12) x (Gaji Pokok + Tunjangan Tetap)`.
  * Masa Kerja < 1 Bulan: Not eligible (Rp 0).

## Trust Envelope (Confidence Contract)
Every engine output must be wrapped in a structured envelope declaring production trust attributes:
* **`regulatory_framework`**: Applying regulation with article references (e.g. `PP No. 58/2023 jo. PMK 168/2023 - TER`).
* **`ruleset_version`**: Versioned Id of the `engines/rules/*.json` ruleset consulted (e.g. `PPH21-2024 v1.0.0`).
* **`effective_window`**: `[effective_from] – [effective_to]` of the applied ruleset.
* **`integrity_status`**: `VERIFIED` after SHA-256 ruleset check, or `UNVERIFIED` — never present silent calculations when UNVERIFIED.
* **`risk_level`**: Contextual `LOW / MEDIUM / HIGH` per skill risk metadata.
* **`requires_human_review`**: `true` for HIGH risk outputs — mandatory professional sign-off before filing, payment, or execution.
* **`currency`**: IDR, rounded to the nearest whole Rupiah unless another precision is stated.
* **`as_of`**: The simulation/effective date used to select the ruleset.
