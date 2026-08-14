---
name: kol-brief-contract
description: "Draft KOL/Influencer campaign briefs, Scope of Work (SOW), competitor exclusivity clauses, and content usage rights."
argument-hint: <kol_tier_nano_micro_macro> <deliverables_sow> <exclusivity_period>
risk_level: LOW
rule_type: commercial-policy
quality_tier: source-verified
allowed-tools: bash
capability:
  purpose: [market_sizing, commodity_classification]
  not_for: [guaranteed_revenue_forecasting, customs_auto_clearance]
  requires: [<kol_tier_nano_micro_macro> <deliverables_sow> <exclusivity_period>]
  produces: [cac, ltv, btkiCode, classificationStatus, landedCost]
  consumes: [context.productContext, finance.unitCostIdr]
  deterministic: false
  cross_domain_relevance:
    finance: high
    strategy: high
    tax: medium
---

# KOL & Influencer Briefing & Agreement Writer

Drafts SOW briefing documents and endorsement licensing agreements for KOL campaigns.

## Key Agreement Terms
1. **Scope of Work (SOW)**: Exact number of IG Reels, TikTok videos, or IG Stories required.
2. **Exclusivity Window**: Ban on promoting direct competitor brands for 30-90 days post-campaign.
3. **Content Usage Rights (Hak Guna Konten)**: Authorization for the brand to use creator video files in paid ads for 3-6 months.
4. **Draft Review & Revision Rules**: Max 2 revision rounds prior to public posting.
