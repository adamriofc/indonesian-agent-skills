/**
 * Deterministic Economic Order Quantity Engine — classic EOQ, reorder point,
 * and annual inventory cost components. Pure math.
 */

function validatePositive(value, name) {
  const v = Number(value);
  if (!(v > 0)) {
    throw new Error(`${name} must be greater than zero`);
  }
  return v;
}

function eoq(annualDemand, orderCost, holdingCostPerUnit) {
  const d = validatePositive(annualDemand, 'Annual demand');
  const s = validatePositive(orderCost, 'Order cost');
  const h = validatePositive(holdingCostPerUnit, 'Holding cost per unit');
  return Math.ceil(Math.sqrt((2 * d * s) / h));
}

function reorderPoint(annualDemand, leadTimeDays, safetyStock = 0) {
  const d = validatePositive(annualDemand, 'Annual demand');
  const lead = Number(leadTimeDays);
  if (!(lead >= 0)) {
    throw new Error('Lead time days must be >= 0');
  }
  const safety = Math.max(0, Number(safetyStock) || 0);
  return Math.round((d / 365) * lead) + safety;
}

function annualHoldingCost(orderQuantity, holdingCostPerUnit) {
  const q = validatePositive(orderQuantity, 'Order quantity');
  const h = validatePositive(holdingCostPerUnit, 'Holding cost per unit');
  return Math.round((q / 2) * h);
}

function annualOrderCost(annualDemand, orderQuantity, orderCost) {
  const d = validatePositive(annualDemand, 'Annual demand');
  const q = validatePositive(orderQuantity, 'Order quantity');
  const s = validatePositive(orderCost, 'Order cost');
  return Math.round((d / q) * s);
}

module.exports = {
  eoq,
  reorderPoint,
  annualHoldingCost,
  annualOrderCost
};