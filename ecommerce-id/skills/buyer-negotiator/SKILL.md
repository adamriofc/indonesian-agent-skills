---
name: buyer-negotiator
description: Strategy and communication templates for negotiating wholesale (grosir) and distribution terms with local Indonesian B2B buyers.
argument-hint: "<buyer_type_distributor_retailer> <order_volume> <target_margin>"
risk_level: LOW
rule_type: commercial
---

# B2B Grosir Trade Negotiator

Formulates trade terms for bulk buyers, distributors, and reseller networks.

## Core Negotiation Terms
1. **MOQ (Minimum Order Quantity)**: Tiered price breaks based on quantity.
2. **Payment Terms**: CBD (Cash Before Delivery) vs TOP (Term of Payment - Net 14/30).
3. **Territory Protection**: Regional distribution exclusivity limits.

## Negotiation Playbook
* **Anchor first**: open with list price + volume incentive (undersell rarely helps).
* **Concession ladder**: discount 2-3% per 25% volume increase; never reveal floor margin.
* **Payment escalation**: new buyers = CBD; TOP 14 only after 2 clean orders; TOP 30 = distributor tier.
* **Territory clause**: verbal commitments without written map = dispute source — always formalize in SPK (lihat skill `spk-generator`).

## Scope & Safety
* **Use for**: B2B wholesale, distributor & reseller talks, event/PSPO deals.
* **Do not use for**: retail/consumer pricing, tender pemerintah tanpa regulasi pengadaan, atau kesepakatan lisan sebagai pengganti kontrak tertulis.
* **Legal note**: perjanjian distribusi eksklusif bisa berimplikasi kompetisi (UU 5/1999) bila menutup pasar — konsultasikan bila pasarnya dominan.

## Worked Example
Input: `buyer: "distributor Jawa Timur" / volume: "500 pcs/bulan" / target_margin: "30%"`
Term sheet: MOQ 300 pcs ↔ harga tier A; 500 pcs ↔ tier B (diskon 4%); TOP 14 dengan jaminan PO tertulis & DP 30%; wilayah: Jawa Timur + Bali eksklusif; kenaikan harga maks 1x/tahun dengan pemberitahuan 30 hari.