/**
 * KBLI Context Router & Business Archetype Classifier Engine
 * Maps 5-digit Indonesian KBLI 2020 codes or descriptive activity names
 * to canonical Business Archetypes (PRODUCT_MANUFACTURING, PROFESSIONAL_SERVICE,
 * CAPACITY_SERVICE, MARKETPLACE_PLATFORM, HYBRID) and operational characteristics.
 */

const KBLI_ARCHETYPE_MAP = {
  // Manufacturing & Physical Goods
  '10': 'PRODUCT_MANUFACTURING', // Makanan
  '11': 'PRODUCT_MANUFACTURING', // Minuman
  '13': 'PRODUCT_MANUFACTURING', // Tekstil
  '14': 'PRODUCT_MANUFACTURING', // Pakaian
  '15': 'PRODUCT_MANUFACTURING', // Kulit & Alas Kaki
  '20': 'PRODUCT_MANUFACTURING', // Bahan Kimia
  '26': 'PRODUCT_MANUFACTURING', // Elektronik

  // Professional Services (Human Capital Intensive)
  '62': 'PROFESSIONAL_SERVICE',  // Pemrograman & Konsultasi Komputer
  '63': 'PROFESSIONAL_SERVICE',  // Jasa Informasi
  '69': 'PROFESSIONAL_SERVICE',  // Jasa Hukum & Akuntansi
  '70': 'PROFESSIONAL_SERVICE',  // Konsultasi Manajemen
  '71': 'PROFESSIONAL_SERVICE',  // Arsitektur & Teknik
  '73': 'PROFESSIONAL_SERVICE',  // Periklanan & Riset Pasar

  // Capacity-Constrained Services (Time / Slot / Unit Intensive)
  '55': 'CAPACITY_SERVICE',      // Akomodasi / Hotel
  '56': 'CAPACITY_SERVICE',      // Restoran / Kafe
  '85': 'CAPACITY_SERVICE',      // Pendidikan
  '86': 'CAPACITY_SERVICE',      // Kesehatan / Klinik
  '96': 'CAPACITY_SERVICE',      // Jasa Perorangan / Laundry

  // Digital Platform & Marketplace
  '4791': 'MARKETPLACE_PLATFORM', // E-Commerce / Retail Online
  '6312': 'MARKETPLACE_PLATFORM'  // Portal Web / Platform Digital
};

function resolveBusinessArchetype({
  kbliCode = '70209', // Default: Konsultasi Manajemen
  activityName = ''
}) {
  const codeStr = String(kbliCode || '').trim();
  const twoDigit = codeStr.slice(0, 2);
  const fourDigit = codeStr.slice(0, 4);

  let archetype = KBLI_ARCHETYPE_MAP[fourDigit] || KBLI_ARCHETYPE_MAP[twoDigit] || 'HYBRID';
  
  // Name-based fallback heuristic
  const nameLower = (activityName || '').toLowerCase();
  if (nameLower.includes('laundry') || nameLower.includes('hotel') || nameLower.includes('klinik') || nameLower.includes('restoran')) {
    archetype = 'CAPACITY_SERVICE';
  } else if (nameLower.includes('konsultasi') || nameLower.includes('hukum') || nameLower.includes('akuntansi') || nameLower.includes('software')) {
    archetype = 'PROFESSIONAL_SERVICE';
  } else if (nameLower.includes('pabrik') || nameLower.includes('manufaktur') || nameLower.includes('produksi')) {
    archetype = 'PRODUCT_MANUFACTURING';
  } else if (nameLower.includes('marketplace') || nameLower.includes('ecommerce') || nameLower.includes('tokopedia') || nameLower.includes('shopee')) {
    archetype = 'MARKETPLACE_PLATFORM';
  }

  const characteristics = {
    PRODUCT_MANUFACTURING: {
      unitOfAnalysis: 'PHYSICAL_SKU',
      hasPhysicalInventory: true,
      valueChainFocus: ['Inbound Logistics', 'Operations', 'Outbound Logistics'],
      bcgShareMetric: 'Revenue Share or Volume Unit Share'
    },
    PROFESSIONAL_SERVICE: {
      unitOfAnalysis: 'SERVICE_LINE_PRACTICE',
      hasPhysicalInventory: false,
      valueChainFocus: ['Lead Generation', 'Knowledge Acquisition', 'Client Interaction', 'Deliverable Execution'],
      bcgShareMetric: 'Practice Revenue Share'
    },
    CAPACITY_SERVICE: {
      unitOfAnalysis: 'CAPACITY_SLOT_OR_ROOM',
      hasPhysicalInventory: false,
      valueChainFocus: ['Capacity Management', 'Customer Co-Production', 'Service Delivery'],
      bcgShareMetric: 'Occupancy or Slot Utilization Share'
    },
    MARKETPLACE_PLATFORM: {
      unitOfAnalysis: 'GMV_TAKE_RATE_CHANNEL',
      hasPhysicalInventory: false,
      valueChainFocus: ['Seller Acquisition', 'Buyer Acquisition', 'Platform Infrastructure', 'Payment Logistics'],
      bcgShareMetric: 'GMV or Seller Market Share'
    },
    HYBRID: {
      unitOfAnalysis: 'BUSINESS_UNIT',
      hasPhysicalInventory: false,
      valueChainFocus: ['Primary Operations', 'Marketing & Sales', 'Service Delivery'],
      bcgShareMetric: 'Revenue Market Share'
    }
  };

  return {
    kbliCode: codeStr,
    activityName,
    businessArchetype: archetype,
    archetypeCharacteristics: characteristics[archetype],
    statutoryFramework: "BPS Regulation No. 2 Year 2020 (KBLI 2020)"
  };
}

module.exports = {
  resolveBusinessArchetype
};