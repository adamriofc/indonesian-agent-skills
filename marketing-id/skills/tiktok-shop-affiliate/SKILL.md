---
name: tiktok-shop-affiliate
description: "Plan TikTok Shop Affiliate campaigns, target/open commission structures, and creator briefing templates."
argument-hint: <product_category> <target_sales_volume> <margin_allowance>
risk_level: LOW
rule_type: commercial-policy
quality_tier: source-verified
allowed-tools: bash
capability:
  requires: [<product_category> <target_sales_volume> <margin_allowance>]
  produces: [cac, ltv, btkiCode, classificationStatus, landedCost]
  deterministic: false
  cross_domain_relevance:
    finance: high
    strategy: high
    tax: medium
---

# TikTok Shop Affiliate Campaign Strategy

Designs affiliate commission plans and outreach templates for TikTok Shop creators.

## Commission Strategy
* **Target Commission**: Higher commission (15-25%) offered to select high-performing creators, with free-sample sending.
* **Open Commission**: Standard baseline commission (5-10%) open to all affiliate creators.
* **Sample Policy Rules**: Mandate video posting within 7-14 days of receiving samples, with cart link attached.

## Campaign Setup
1. **Budget split**: 60% target creators (volume) + 40% open pool (crawl for UGC).
2. **Creator tiers**: nano (<10k), micro (10-100k), macro (100k-1M), mega (>1M) — adjust commission & sample requirements accordingly.
3. **The brief must include**: product demo points, USPs, video requirements (duration, CTA, cart link), mandatory hashtags, and deadlines.
4. **Tracking**: monitor per-creator conversion (GPM); cut creators with no results in weeks 2-3.

## Scope & Safety
* **Use for**: campaign launches, seasonal flash sales, brand awareness via UGC.
* **Do not use for**: commission as payment for positive reviews only (astroturfing) — prohibited by TikTok Shop; product efficacy claims must follow advertising regulations (BPOM/KKB where relevant).
* **Taxation**: commissions paid to creators are subject to PPh (income tax) (check `pph23-26-calculator` — PPh 23/26 on affiliate services where the withholding requirements are met).

## Worked Example
Input: `category: "skincare serum" / target: "1.000 pcs/month" / margin_allowance: "25%"`
Plan: 20 target creators (nano-micro) at 20% commission + 50 pcs samples, posting within ≤ 10 days; open commission at 8%; brief: 3 demo points (texture, 2-week results, before-after photos per claim) + CTA "check the cart link"; weekly GPM monitoring; cut creators with GPM < 1.0 in week 2.