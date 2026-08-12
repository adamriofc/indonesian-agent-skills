/**
 * Shared Business Archetype Contract Engine
 * Defines canonical Units of Analysis, Primary Value Drivers, Operational Attributes,
 * and Framework Adaptation rules across Product, Professional Service, Capacity Service, Platform, and Hybrid archetypes.
 */

const BUSINESS_ARCHETYPE_CONTRACTS = {
  PRODUCT_MANUFACTURING: {
    archetype: 'PRODUCT_MANUFACTURING',
    unitOfAnalysis: 'PHYSICAL_SKU_OR_PRODUCT_LINE',
    primaryValueDrivers: ['manufacturing_efficiency', 'inventory_turnover', 'raw_material_cost', 'distribution_reach'],
    inventoryCharacteristic: 'STORABLE_PHYSICAL_GOODS',
    capacityModel: 'MACHINE_CAPACITY',
    revenueModel: 'PHYSICAL_SALES',
    deliveryModel: 'BATCH_LOGISTICS',
    customerParticipation: 'LOW',
    scalabilityConstraint: 'PRODUCTION_CAPACITY',
    bcgShareMetric: 'Physical Volume or Revenue Share',
    valueChainFocus: ['Inbound Logistics', 'Manufacturing Operations', 'Outbound Logistics']
  },
  PROFESSIONAL_SERVICE: {
    archetype: 'PROFESSIONAL_SERVICE',
    unitOfAnalysis: 'SERVICE_LINE_PRACTICE_AREA',
    primaryValueDrivers: ['consultant_utilization', 'billable_rate_realization', 'talent_retention', 'client_concentration'],
    inventoryCharacteristic: 'NON_STORABLE_HUMAN_CAPACITY',
    capacityModel: 'HUMAN_CAPACITY',
    revenueModel: 'PROJECT_BASED',
    deliveryModel: 'KNOWLEDGE_DELIVERY',
    customerParticipation: 'HIGH',
    scalabilityConstraint: 'TALENT_BANDWIDTH',
    bcgShareMetric: 'Practice Revenue Contribution Share',
    valueChainFocus: ['Lead Generation', 'Knowledge Acquisition', 'Client Interaction', 'Deliverable Execution']
  },
  CAPACITY_SERVICE: {
    archetype: 'CAPACITY_SERVICE',
    unitOfAnalysis: 'CAPACITY_SLOT_OR_PROPERTY',
    primaryValueDrivers: ['capacity_utilization', 'occupancy_rate', 'revenue_per_available_unit', 'fixed_overhead_coverage'],
    inventoryCharacteristic: 'TIME_PERISHABLE_CAPACITY_SLOTS',
    capacityModel: 'ROOM_OR_SLOT_CAPACITY',
    revenueModel: 'USAGE_OR_SLOT_FEE',
    deliveryModel: 'REAL_TIME_SLOT',
    customerParticipation: 'HIGH',
    scalabilityConstraint: 'PROPERTY_SLOTS',
    bcgShareMetric: 'Occupancy or Slot Utilization Share',
    valueChainFocus: ['Capacity Slot Setup', 'Customer Co-Production', 'Service Delivery']
  },
  MARKETPLACE_PLATFORM: {
    archetype: 'MARKETPLACE_PLATFORM',
    unitOfAnalysis: 'GMV_TAKE_RATE_CHANNEL',
    primaryValueDrivers: ['gross_merchandise_value', 'effective_take_rate', 'buyer_seller_liquidity', 'network_effects'],
    inventoryCharacteristic: 'ZERO_PHYSICAL_INVENTORY',
    capacityModel: 'GMV_CAPACITY',
    revenueModel: 'TAKE_RATE',
    deliveryModel: 'DIGITAL_PLATFORM',
    customerParticipation: 'HIGH',
    scalabilityConstraint: 'PLATFORM_NETWORK',
    bcgShareMetric: 'GMV or Seller Market Share',
    valueChainFocus: ['Seller Acquisition', 'Buyer Acquisition', 'Platform Infrastructure', 'Payment Logistics']
  },
  HYBRID: {
    archetype: 'HYBRID',
    unitOfAnalysis: 'STRATEGIC_BUSINESS_UNIT',
    primaryValueDrivers: ['combined_revenue_growth', 'cross_selling_synergy', 'contribution_margin'],
    inventoryCharacteristic: 'MIXED_PRODUCTS_AND_SERVICES',
    capacityModel: 'FLEX_CAPACITY',
    revenueModel: 'HYBRID_REVENUE',
    deliveryModel: 'HYBRID_DELIVERY',
    customerParticipation: 'MEDIUM',
    scalabilityConstraint: 'RESOURCE_ALLOCATION',
    bcgShareMetric: 'Revenue Market Share',
    valueChainFocus: ['Primary Operations', 'Marketing & Sales', 'Service Delivery']
  }
};

function getArchetypeContract(archetype = 'HYBRID') {
  const norm = (archetype || 'HYBRID').toUpperCase().trim();
  return BUSINESS_ARCHETYPE_CONTRACTS[norm] || BUSINESS_ARCHETYPE_CONTRACTS.HYBRID;
}

module.exports = {
  BUSINESS_ARCHETYPE_CONTRACTS,
  getArchetypeContract
};