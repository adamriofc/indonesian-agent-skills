---
name: cost-accounting
description: Compute cost of goods sold, absorption vs variable costing, and simple product costing for Indonesian SME operations.
argument-hint: "<beginning_inventory> <purchases> <ending_inventory>"
risk_level: MEDIUM
rule_type: professional-standard
---

# Cost Accounting

Tracks product and service costs so pricing and margin decisions are grounded in real numbers.

## Core Methods
* **COGS (Cost of Goods Sold)** = Beginning Inventory + Purchases − Ending Inventory; ending stock is computed via a consistent method (FIFO/average).
* **Absorption costing**: all production costs (variable + fixed) enter COGS — per SAK EMKM for financial statements.
* **Variable costing**: only variable costs enter COGS; fixed costs are expensed as incurred — an internal analysis tool for short-term pricing decisions.
* **Unit cost** = Total production cost ÷ units produced; do not confuse it with the selling price.

## Scope & Safety
* **Use for**: setting the minimum selling price, evaluating per-SKU product margins, make-vs-buy decisions.
* **Do not use for**: recognizing inventory value in financial statements with a method different from the chosen policy (must be consistent across periods).
* Overhead allocation (electricity, warehouse rent) is an estimate — document the allocation basis.
* Stock data must be physically accounted for (stock-taking) at least annually.

## Worked Example
Input: beginning inventory 50 million; purchases 300 million; ending inventory 40 million; 2,000 units sold.
Output: COGS = 50 + 300 − 40 = **310 million**; COGS per unit = 310 million ÷ 2,000 = **155.000**. If the selling price is 200.000 → gross margin per unit 45.000 (22.5%) before operating expenses.