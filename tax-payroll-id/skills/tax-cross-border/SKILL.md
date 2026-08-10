---
name: tax-cross-border
description: Evaluate Indonesian offshore withholding taxes (PPh 26 20% vs Tax Treaty / P3B DGT Form rate reductions) and Permanent Establishment (BUT) risk.
argument-hint: "<offshore_vendor_country> <payment_type_service_royalty_software> <amount_idr>"
metadata:
  risk_level: HIGH
  rule_type: statutory
  quality_tier: expert-reviewed
---

# Cross-Border Tax & Treaty (P3B) Optimization

Analyzes offshore withholding taxes (PPh 26), Tax Treaty (P3B) benefits, DGT Form (SKD) compliance, and Permanent Establishment (*Bentuk Usaha Tetap - BUT*) risk.

## Key Cross-Border Tax Rules
1. **Statutory Withholding (PPh 26)**:
   - 20% flat tax on gross payments to non-resident entities (services, royalties, interest, dividends) under UU PPh Pasal 26.
2. **Tax Treaty (P3B) Rate Optimization**:
   - Applies reduced treaty rates (e.g. 0% for business profits/services without BUT, 10% or 8% for royalties/interest) when the offshore vendor submits a valid electronic DGT Form (Formulir DGT / SKD WPLN) registered on DJP Online.
3. **Software & Digital Services Tax**:
   - Distinguishes between software purchase/license (business profit = 0% under treaty) vs right to exploit copyright (royalty = 10% or statutory 20%).
4. **Permanent Establishment (BUT) Risk**:
   - Assesses whether offshore personnel presence in Indonesia exceeds the treaty time test (e.g. 90 or 183 days), creating a local taxable BUT entity.

## Worked Example
Input: Indonesian company pays Rp 100.000.000 to a Singapore software company for technical consulting services.
- **Without DGT Form**: PPh 26 = `20% x Rp 100M` = **Rp 20.000.000**.
- **With Valid Singapore DGT Form (Indonesia-Singapore Tax Treaty Art. 7)**: Services without BUT are classified as Business Profits = **0% withholding tax** (taxable only in Singapore). Net tax savings = **Rp 20.000.000**.
