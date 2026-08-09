---
name: margin-pricing-calculator
description: Calculate net seller payout and profit margins after marketplace admin fees (Shopee Star/Mall, Tokopedia Power Merchant, TikTok Shop), extra shipping fees, and ad budgets.
argument-hint: "<selling_price> <platform> <seller_tier> [free_shipping_extra] [ad_budget]"
---

# Marketplace Fee & Net Margin Calculator

Computes exact net payouts after deducting platform admin fees and shipping extra charges.

## Hybrid Execution Model
Pass parameters to `engines/marketplace-fee-calculator.js`:
* **Tokopedia**: Regular (3.8%), Power Merchant (4.5%), Power Merchant Pro (5.5%), Official Store (6.5%).
* **Shopee**: Non-Star (4.0%), Star (6.0%), Star+ (6.5%), Mall (8.5%).
* **TikTok Shop**: Standard (4.5%), Mall (6.5%).
* **Gratis Ongkir Extra**: 4% capped at Rp 10.000 per item.
