#!/usr/bin/env node
/**
 * Indonesian Agent Skills — Benchmark Harness
 *
 * Tiga lapis pengukuran:
 *  1. Deterministic Accuracy : engine vs golden corpus (harus 100%)
 *  2. Determinism             : output identik pada 3× eksekusi yang sama
 *  3. Performance             : operasi/detik per engine
 *  4. (Opsional) LLM Baseline : bandingkan engine deterministik vs model LLM umum
 *     (OpenAI-compatible /v1/chat/completions)
 *
 * Usage:
 *   node scripts/benchmark.js                        # deterministik saja
 *   node scripts/benchmark.js --llm                  # + perbandingan LLM (butuh key)
 *   node scripts/benchmark.js --llm --llm-sample 15  # batasi kasus per domain
 *   node scripts/benchmark.js --json-report /tmp/bench.json
 *
 * Env untuk mode LLM:
 *   LLM_BENCH_KEY    (wajib)   API key
 *   LLM_BENCH_BASE   (opsional, default https://api.openai.com/v1)
 *   LLM_BENCH_MODEL  (opsional, default gpt-4o-mini)
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const args = process.argv.slice(2);
const withLLM = args.includes('--llm');
const llmSampleArg = args.find((a) => a.startsWith('--llm-sample'));
const llmSample = llmSampleArg ? parseInt(llmSampleArg.split('=')[1] ?? args[args.indexOf(llmSampleArg) + 1], 10) : 10;
const jsonReportArg = args.find((a) => a.startsWith('--json-report'));
const jsonReportPath = jsonReportArg ? (jsonReportArg.split('=')[1] ?? args[args.indexOf(jsonReportArg) + 1] ?? null) : null;

const { calculatePPh21Monthly } = require(path.join(ROOT, 'engines/pph21-calculator'));
const { calculateBpjs } = require(path.join(ROOT, 'engines/bpjs-calculator'));
const { calculatePhk } = require(path.join(ROOT, 'engines/phk-calculator'));
const { calculateThr } = require(path.join(ROOT, 'engines/thr-calculator'));
const { calculatePPh23And26 } = require(path.join(ROOT, 'engines/pph23-26-calculator'));
const { calculateUmkmFinalTax } = require(path.join(ROOT, 'engines/umkm-tax-calculator'));
const { calculatePkwtCompensation } = require(path.join(ROOT, 'engines/pkwt-compensation-calculator'));
const { auditPkwttStatus } = require(path.join(ROOT, 'engines/pkwtt-calculator'));
const { compareRulesets } = require(path.join(ROOT, 'engines/regulatory-diff'));
const { calculatePPh21GrossUp } = require(path.join(ROOT, 'engines/pph21-grossup-calculator'));
const { calculateCorporateTax } = require(path.join(ROOT, 'engines/pph-badan-calculator'));
const { auditTransferPricingThinCap } = require(path.join(ROOT, 'engines/transfer-pricing-engine'));
const { calculatePpnAndPpnbm } = require(path.join(ROOT, 'engines/ppn-ppnbm-calculator'));
const { calculateMarketplaceFee } = require(path.join(ROOT, 'engines/marketplace-fee-calculator'));
const { calculateExitWaterfall } = require(path.join(ROOT, 'engines/term-sheet-waterfall'));
const { analyzeRegulatoryImpact } = require(path.join(ROOT, 'engines/regulatory-impact-engine'));
const { auditComplianceRisk } = require(path.join(ROOT, 'engines/compliance-risk-engine'));
const { evaluateBusinessScenario } = require(path.join(ROOT, 'engines/business-scenario-engine'));
const { evaluateBusinessDecision } = require(path.join(ROOT, 'engines/decision-engine'));
const { evaluateBcgMatrix } = require(path.join(ROOT, 'engines/strategic-framework-engine'));
const { evaluateStrategicDecisionAlternatives } = require(path.join(ROOT, 'engines/decision-analysis-engine'));
const { simulateScenarioImpact } = require(path.join(ROOT, 'engines/scenario-analysis-engine'));
const { evaluateStrategicRisks } = require(path.join(ROOT, 'engines/strategic-risk-engine'));
const { resolveBusinessArchetype } = require(path.join(ROOT, 'engines/kbli-context-router'));
const { calculateMarketSizing } = require(path.join(ROOT, 'engines/market-sizing-engine'));
const { calculateMarketingUnitEconomics } = require(path.join(ROOT, 'engines/marketing-unit-economics'));

function loadGolden(name) {
  const raw = fs.readFileSync(path.join(ROOT, 'tests/golden', `${name}.json`), 'utf8');
  const data = JSON.parse(raw);
  return Array.isArray(data) ? data : data.goldenCases;
}

function fmt(v) {
  return typeof v === 'number' ? v.toLocaleString('id-ID') : String(v);
}

function assertNumericMatch(expected, actual) {
  if (typeof expected !== 'number') return null; // non-numeric field: skip
  return expected === actual;
}

function matches(exp, actual) {
  if (typeof exp === 'number') return numericTolerance(exp, actual);
  if (Array.isArray(exp)) return JSON.stringify(exp) === JSON.stringify(actual);
  return exp === actual;
}

function runPph21(c) {
  const { calculatePPh21DecemberReconciliation } = require(path.join(ROOT, 'engines/pph21-calculator'));
  const r =
    typeof c.input.annualGrossIncome === 'number'
      ? calculatePPh21DecemberReconciliation(
          c.input.annualGrossIncome,
          c.input.ptkpStatus,
          c.input.janToNovTaxWithheld,
          c.input.monthlyJhtEmployeeDeduction,
          c.input.hasNpwp,
          c.input.dateStr
        )
      : calculatePPh21Monthly(c.input.grossSalary, c.input.ptkpStatus, c.input.hasNpwp, c.input.dateStr);
  const checks = {};
  for (const key of Object.keys(c.expected)) checks[key] = r[key];
  return checks;
}

function runBpjs(c) {
  const r = calculateBpjs(c.input.baseWage, c.input.jkkHazardLevel, c.input.dateStr);
  const map = {
    kesCappedWage: r.bpjsKesehatan.cappedWage,
    jpCappedWage: r.bpjsKetenagakerjaan.jp.cappedWage,
    jpEmployer: r.bpjsKetenagakerjaan.jp.employer,
    jpEmployee: r.bpjsKetenagakerjaan.jp.employee,
  };
  const checks = {};
  for (const key of Object.keys(c.expected)) checks[key] = map[key];
  return checks;
}

function runPhk(c) {
  const r = calculatePhk(c.input.monthlyWage, c.input.tenureYears, c.input.reasonKey, c.input.remainingLeaveDays);
  const map = {
    uangPesangon: r.breakdown.uangPesangon.amount,
    uangPenghargaanMasaKerja: r.breakdown.uangPenghargaanMasaKerja.amount,
    uangPenggantianHak: r.breakdown.uangPenggantianHak.totalUphAmount ?? r.breakdown.uangPenggantianHak.amount ?? 0,
    totalPayout: r.totalPayout,
  };
  const checks = {};
  for (const key of Object.keys(c.expected)) checks[key] = map[key];
  return checks;
}

function runFinance(c) {
  const i = c.input;
  let checks = {};
  switch (c.engine) {
    case 'break-even': {
      const be = require(path.join(ROOT, 'engines/break-even'));
      const revenue = be.breakEvenRevenue(i.fixedCosts, i.pricePerUnit, i.variableCostPerUnit);
      checks = {
        contributionMargin: be.contributionMargin(i.pricePerUnit, i.variableCostPerUnit),
        contributionMarginRatio: be.contributionMarginRatio(i.pricePerUnit, i.variableCostPerUnit),
        breakEvenUnits: be.breakEvenUnits(i.fixedCosts, i.pricePerUnit, i.variableCostPerUnit),
        breakEvenRevenue: revenue,
        marginOfSafety: be.marginOfSafety(i.actualRevenue, revenue),
      };
      break;
    }
    case 'depreciation': {
      const dep = require(path.join(ROOT, 'engines/depreciation'));
      const r = dep[c.method](i.cost, i.salvage, i.lifeYears);
      checks = {
        annual: r.annual,
        totalDepreciation: r.totalDepreciation,
        netBookValue: r.netBookValue,
      };
      break;
    }
    case 'npv': {
      const npvEng = require(path.join(ROOT, 'engines/npv'));
      checks = { npv: npvEng.npv(i.rate, i.cashflows) };
      break;
    }
    case 'npvWithTerminalValue': {
      const npvEng = require(path.join(ROOT, 'engines/npv'));
      checks = { npv: npvEng.npvWithTerminalValue(i.rate, i.cashflows, i.terminalValue, i.terminalYearIndex) };
      break;
    }
    case 'irr': {
      const irrEng = require(path.join(ROOT, 'engines/irr'));
      const npvEng = require(path.join(ROOT, 'engines/npv'));
      const r = irrEng.irr(i.cashflows, { tolerance: 1e-9 });
      const pass =
        r.irr >= c.expected.irrMin &&
        r.irr <= c.expected.irrMax &&
        Math.abs(npvEng.npv(r.irr, i.cashflows)) < 0.02;
      checks = { irrMin: pass ? c.expected.irrMin : NaN, irrMax: pass ? c.expected.irrMax : NaN };
      break;
    }
    case 'loan-amortization': {
      const la = require(path.join(ROOT, 'engines/loan-amortization'));
      const sched = la.amortizationSchedule(i.principal, i.annualRate, i.months);
      checks = {
        monthlyPayment: la.monthlyPayment(i.principal, i.annualRate, i.months),
        totalInterest: sched.totalInterest,
        finalBalance: sched.schedule[sched.schedule.length - 1].balance,
      };
      break;
    }
    case 'financial-ratios': {
      const fr = require(path.join(ROOT, 'engines/financial-ratios'));
      checks = {
        currentRatio: fr.currentRatio(i.currentAssets, i.currentLiabilities),
        quickRatio: fr.quickRatio(i.currentAssets, i.inventory, i.currentLiabilities),
        cashRatio: fr.cashRatio(i.cash, i.currentLiabilities),
        debtToEquity: fr.debtToEquity(i.totalLiabilities, i.totalEquity),
        grossMargin: fr.grossMargin(i.revenue, i.cogs),
        netMargin: fr.netMargin(i.netIncome, i.revenue),
        roa: fr.roa(i.netIncome, i.totalAssets),
        roe: fr.roe(i.netIncome, i.totalEquity),
        inventoryTurnover: fr.inventoryTurnover(i.cogs, i.avgInventory),
        receivablesTurnover: fr.receivablesTurnover(i.revenue, i.avgReceivables),
        daysSalesOutstanding: fr.daysSalesOutstanding(i.revenue, i.avgReceivables),
        daysPayablesOutstanding: fr.daysPayablesOutstanding(i.cogs, i.avgPayables),
        daysInventoryOutstanding: fr.daysInventoryOutstanding(i.cogs, i.avgInventory),
        cashConversionCycle: fr.cashConversionCycle(
          fr.daysInventoryOutstanding(i.cogs, i.avgInventory),
          fr.daysSalesOutstanding(i.revenue, i.avgReceivables),
          fr.daysPayablesOutstanding(i.cogs, i.avgPayables)
        ),
      };
      break;
    }
    case 'working-capital': {
      const wc = require(path.join(ROOT, 'engines/working-capital'));
      checks = {
        netWorkingCapital: wc.netWorkingCapital(i.currentAssets, i.currentLiabilities),
        workingCapitalRatio: wc.workingCapitalRatio(i.currentAssets, i.currentLiabilities),
        cashConversionCycle: wc.cashConversionCycle(i.daysInventory, i.daysSalesOutstanding, i.daysPayables),
        workingCapitalRequirement: wc.workingCapitalRequirement(i.cashCycleDays, i.cogsPerDay),
      };
      break;
    }
    case 'eoq': {
      const eoqEng = require(path.join(ROOT, 'engines/eoq'));
      const q = eoqEng.eoq(i.annualDemand, i.orderCost, i.holdingCostPerUnit);
      checks = {
        eoq: q,
        reorderPoint: eoqEng.reorderPoint(i.annualDemand, i.leadTimeDays, i.safetyStock),
        annualHoldingCost: eoqEng.annualHoldingCost(q, i.holdingCostPerUnit),
        annualOrderCost: eoqEng.annualOrderCost(i.annualDemand, q, i.orderCost),
      };
      break;
    }
    default:
      throw new Error(`Unknown finance engine: ${c.engine}`);
  }
  return checks;
}


function runThr(c) {
  const r = calculateThr(c.input.monthlyBaseSalary, c.input.fixedAllowance, c.input.tenureMonths);
  return { isEligible: r.isEligible, statutoryThrPayout: r.statutoryThrPayout, monthlyBaseSalary: r.monthlyBaseSalary };
}

function runPph23And26(c) {
  const r = calculatePPh23And26(c.input.grossAmount, c.input.type, c.input.hasNpwp, c.input.isTreaty, c.input.treatyRatePercent);
  return {
    taxType: r.taxType, taxWithheld: r.taxWithheld, netAmountReceived: r.netAmountReceived,
    penaltyApplied: r.penaltyApplied, effectiveRatePercent: r.effectiveRatePercent, grossAmount: r.grossAmount
  };
}

function runUmkm(c) {
  const r = calculateUmkmFinalTax(c.input.grossRevenueYtd, c.input.currentMonthRevenue, c.input.taxpayerType, c.input.dateStr);
  return { isEligible: r.isEligible, taxableRevenue: r.taxableRevenue, finalTaxDue: r.finalTaxDue, rulesetId: r.rulesetId };
}

function runPkwt(c) {
  const r = calculatePkwtCompensation(c.input.monthlyWage, c.input.tenureMonths);
  return {
    isEligible: r.isEligible,
    compensationPayout: r.statutoryCompensationPayout ?? r.compensationPayout ?? 0,
    statutoryCompensationPayout: r.statutoryCompensationPayout,
    formulaApplied: r.formulaApplied
  };
}

function runPkwtt(c) {
  const r = auditPkwttStatus(c.input);
  return {
    isConvertedToPkwttByLaw: r.isConvertedToPkwttByLaw,
    effectiveContractStatus: r.effectiveContractStatus,
    conversionTriggers: r.conversionTriggers,
    probationAuditIsCompliant: r.probationAudit.isCompliant,
    probationValidMonths: r.probationAudit.validProbationMonths,
    hasViolations: r.violationsCount > 0
  };
}

function runRegulatoryDiff(c) {
  const r = compareRulesets(c.input.domain, c.input.from, c.input.to);
  const eligibleChange = r.changes.find(ch => ch.field === 'eligible_taxpayers');
  return {
    domain: r.domain,
    comparison: r.comparison,
    effectiveTransitionDate: r.effectiveTransitionDate,
    totalChanges: r.totalChanges,
    totalChangesGreaterThanZero: r.totalChanges > 0,
    removedEntities: eligibleChange ? eligibleChange.removedEntities : []
  };
}

function runPph21GrossUp(c) {
  const r = calculatePPh21GrossUp(c.input);
  return {
    grossUpTaxAllowance: r.grossUpTaxAllowance, taxableNatura: r.taxableNatura, exemptNatura: r.exemptNatura,
    grossTakeHomePay: r.grossTakeHomePay, netTaxWithheld: r.netTaxWithheld, terCategory: r.terCategory
  };
}

function runPphBadan(c) {
  const r = calculateCorporateTax(c.input);
  return {
    appliedFacilityType: r.appliedFacilityType, totalCorporateTaxDue: r.totalCorporateTaxDue,
    taxableIncome: r.taxableIncome, facilityTaxableIncome: r.facilityTaxableIncome, nonFacilityTaxableIncome: r.nonFacilityTaxableIncome
  };
}

function runTransferPricing(c) {
  const r = auditTransferPricingThinCap(c.input);
  return {
    actualDerRatio: r.actualDerRatio, isDerExceeded: r.isDerExceeded, maxAllowableDebt: r.maxAllowableDebt,
    nonDeductibleInterestExpense: r.nonDeductibleInterestExpense, secondaryAdjustmentTaxAmount: r.secondaryAdjustmentTaxAmount
  };
}

function runPpnPpnbm(c) {
  const r = calculatePpnAndPpnbm(c.input);
  return {
    dppBase: r.dppBase, ppnAmount: r.ppnAmount, ppnbmAmount: r.ppnbmAmount, totalTaxes: r.totalTaxes,
    effectivePpnBurdenPercent: r.effectivePpnBurdenPercent, ppnRatePercent: r.ppnRatePercent
  };
}

function runMarketplaceFee(c) {
  const r = calculateMarketplaceFee(c.input.sellingPrice, c.input.platform, c.input.tier, c.input.usesFreeShipping, c.input.adSpend);
  return {
    adminFeeAmount: r.adminFeeAmount, freeShippingExtraFee: r.freeShippingExtraFee, netSellerPayout: r.netSellerPayout,
    netMarginPercent: r.netMarginPercent, adSpendBudget: r.adSpendBudget, totalPlatformDeductions: r.totalPlatformDeductions,
    sellingPrice: r.sellingPrice
  };
}

function runTermSheet(c) {
  const r = calculateExitWaterfall(c.input);
  return { totalInvestorPayout: r.totalInvestorPayout, commonShareholdersPayout: r.commonShareholdersPayout, remainingUnallocated: r.remainingUnallocated };
}


function runRegulatoryImpact(c) {
  const r = analyzeRegulatoryImpact(c.input);
  return { impactLevel: r.impactLevel, totalChecklistItems: r.actionChecklist.length };
}

function runComplianceRisk(c) {
  const r = auditComplianceRisk(c.input);
  return { complianceHealthScore: r.complianceHealthScore, overallAssessment: r.overallAssessment, totalViolationsDetected: r.totalViolationsDetected };
}

function runBusinessScenario(c) {
  const r = evaluateBusinessScenario(c.input);
  return { totalLifecycleStages: r.totalLifecycleStages, recommendedRegime: r.recommendedRegime };
}

function runDecisionEngine(c) {
  const r = evaluateBusinessDecision(c.input);
  return { priorityLevel: r.priorityLevel, totalDriversCount: r.keyDecisionDrivers.length, cashRunwayMonths: r.financialAssessment.cashRunwayMonths, derRatio: r.financialAssessment.derRatio };
}


function runStrategicFramework(c) {
  const r = evaluateBcgMatrix(c.input);
  return { category: r.category, capitalAllocationPriority: r.capitalAllocationPriority };
}

function runDecisionAnalysis(c) {
  const r = evaluateStrategicDecisionAlternatives(c.input);
  return { topRecommendedOption: r.topRecommendedOption, topScore: r.rankedOptions[0].compositeWeightedScore };
}

function runScenarioAnalysis(c) {
  const r = simulateScenarioImpact(c.input);
  return { baseNetProfit: r.baseCaseMetrics.netProfit, simulatedNetProfit: r.simulatedScenarioMetrics.netProfit, resilienceAssessment: r.resilienceAssessment };
}

function runStrategicRisk(c) {
  const r = evaluateStrategicRisks(c.input);
  return { overallRiskTier: r.overallRiskTier, criticalRisksCount: r.criticalRisksCount, topRiskTitle: r.evaluatedRisks[0].riskTitle };
}


function runKbliContext(c) {
  const r = resolveBusinessArchetype(c.input);
  return { businessArchetype: r.businessArchetype, hasPhysicalInventory: r.archetypeCharacteristics.hasPhysicalInventory };
}


function runMarketSizing(c) {
  const r = calculateMarketSizing(c.input);
  return { totalAddressableCustomers: r.results.totalAddressableCustomers, tamAmount: r.results.tamAmount, samAmount: r.results.samAmount, somAmount: r.results.somAmount };
}

function runMarketingUnitEconomics(c) {
  const r = calculateMarketingUnitEconomics(c.input);
  return { cac: r.cac, ltv: r.ltv, ltvCacRatio: r.ltvCacRatio, roas: r.roas, healthStatus: r.healthStatus };
}

const DOMAINS = [
  { name: 'pph21', label: 'PPh 21 (TER PP 58/2023)', golden: 'pph21', run: runPph21 },
  { name: 'bpjs', label: 'BPJS (Perpres 64/2020 + PP 45/2015)', golden: 'bpjs', run: runBpjs },
  { name: 'phk', label: 'PHK (PP 35/2021)', golden: 'phk', run: runPhk },
  { name: 'umkm', label: 'UMKM Final Tax (PP 55/2022 & PP 20/2026)', golden: 'umkm', run: runUmkm },
  { name: 'thr', label: 'THR (Permenaker 6/2016)', golden: 'thr', run: runThr },
  { name: 'pph23-26', label: 'PPh 23/26 (withholding & treaty)', golden: 'pph23-26', run: runPph23And26 },
  { name: 'pkwt', label: 'PKWT Compensation (PP 35/2021)', golden: 'pkwt', run: runPkwt },
  { name: 'pkwtt', label: 'PKWTT Audit & Conversion (PP 35/2021)', golden: 'pkwtt', run: runPkwtt },
  { name: 'regulatory-diff', label: 'Regulatory Diff Engine', golden: 'regulatory-diff', run: runRegulatoryDiff },
  { name: 'pph21-grossup', label: 'PPh 21 Gross-Up (PMK 66/2023)', golden: 'pph21-grossup', run: runPph21GrossUp },
  { name: 'pph-badan', label: 'PPh Badan 22% & Pasal 31E', golden: 'pph-badan', run: runPphBadan },
  { name: 'transfer-pricing', label: 'Thin Cap & TP Adjustment (PMK 172/2023)', golden: 'transfer-pricing', run: runTransferPricing },
  { name: 'ppn-ppnbm', label: 'PPN 12% & PPnBM (UU HPP & PMK 131/2024)', golden: 'ppn-ppnbm', run: runPpnPpnbm },
  { name: 'marketplace-fee', label: 'Marketplace Fee & Margin', golden: 'marketplace-fee', run: runMarketplaceFee },
  { name: 'term-sheet', label: 'VC Term-Sheet Waterfall', golden: 'term-sheet', run: runTermSheet },
  { name: 'regulatory-impact', label: 'Regulatory Impact Intelligence', golden: 'regulatory-impact', run: runRegulatoryImpact },
  { name: 'compliance-risk', label: 'Compliance Risk Engine', golden: 'compliance-risk', run: runComplianceRisk },
  { name: 'business-scenario', label: 'Business Scenario & Lifecycle Engine', golden: 'business-scenario', run: runBusinessScenario },
  { name: 'decision-engine', label: 'Business Decision Engine', golden: 'decision-engine', run: runDecisionEngine },
  { name: 'strategic-framework', label: 'Strategic Framework Engine (BCG & GE)', golden: 'strategic-framework', run: runStrategicFramework },
  { name: 'decision-analysis', label: 'Decision Analysis Engine (MCDA)', golden: 'decision-analysis', run: runDecisionAnalysis },
  { name: 'scenario-analysis', label: 'Scenario & Sensitivity Analysis Engine', golden: 'scenario-analysis', run: runScenarioAnalysis },
  { name: 'strategic-risk', label: 'Strategic Risk Scoring & Heatmap Engine', golden: 'strategic-risk', run: runStrategicRisk },
  { name: 'kbli-context', label: 'KBLI Context Router & Business Archetype Classifier Engine', golden: 'kbli-context', run: runKbliContext },
  { name: 'market-sizing', label: 'Market Sizing Engine (TAM/SAM/SOM)', golden: 'market-sizing', run: runMarketSizing },
  { name: 'marketing-unit-economics', label: 'Marketing Unit Economics & LTV:CAC Engine', golden: 'marketing-unit-economics', run: runMarketingUnitEconomics },
  { name: 'finance', label: 'Finance (8 deterministic engines)', golden: 'finance', run: runFinance },
];

function buildLLMPrompt(c, checks) {
  const keys = Object.keys(checks)
    .map((k) => `- ${k}: ${typeof checks[k] === 'number' ? 'angka (IDR)' : 'string'} `)
    .join('\n');
  return [
    'Anda adalah kalkulator kepatuhan Indonesia yang presisi. Hitung hasil yang diminta. ',
    'JANGAN menulis penjelasan. Balas HANYA satu baris JSON berisi field berikut:',
    keys,
    `Kasus: ${c.description}`,
    `Input: ${JSON.stringify(c.input)}`,
  ].join('\n');
}

function parseLLMJson(text) {
  let t = text.trim();
  t = t.replace(/^```(json)?/i, '').replace(/```$/, '').trim();
  const start = t.indexOf('{');
  const end = t.lastIndexOf('}');
  if (start === -1 || end === -1) return null;
  try {
    return JSON.parse(t.slice(start, end + 1));
  } catch {
    return null;
  }
}

function numericTolerance(a, b) {
  if (typeof a !== 'number' || typeof b !== 'number') return false;
  return Math.abs(a - b) <= Math.max(1, Math.abs(a) * 0.01); // toleransi 1%
}

async function llmAsk(systemPrompt, userPrompt) {
  const res = await fetch(`${process.env.LLM_BENCH_BASE || 'https://api.openai.com/v1'}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.LLM_BENCH_KEY}`,
    },
    body: JSON.stringify({
      model: process.env.LLM_BENCH_MODEL || 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0,
    }),
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`LLM API ${res.status}: ${body.slice(0, 300)}`);
  }
  const data = await res.json();
  return data.choices[0].message.content;
}

(async () => {
  console.log('📊 Indonesian Agent Skills — Benchmark Harness\n');
  const report = { date: new Date().toISOString().slice(0, 10), node: process.version, domains: {} };

  for (const domain of DOMAINS) {
    const cases = loadGolden(domain.golden);
    let passed = 0;
    let mismatches = [];
    let determinismViolations = 0;
    const runStart = process.hrtime.bigint();
    let runs = 0;

    for (const c of cases) {
      const expected = c.expected;
      let checks;
      try {
        checks = domain.run(c);
      } catch (e) {
        mismatches.push({ caseId: c.caseId, error: e.message });
        continue;
      }
      const ok = Object.keys(expected).every((k) => {
        const exp = expected[k];
        return matches(exp, checks[k]);
      });
      if (ok) passed++;
      else mismatches.push({ caseId: c.caseId, expected, actual: checks });

      // Determinism: 2× ulang, harus identik
      for (let i = 0; i < 2; i++) {
        const re = domain.run(c);
        if (JSON.stringify(re) !== JSON.stringify(checks)) determinismViolations++;
      }
      runs += 3;
    }

    const elapsedMs = Number(process.hrtime.bigint() - runStart) / 1e6;
    const opsPerSec = Math.round((runs * 1000) / elapsedMs);
    const accuracy = cases.length ? (passed / cases.length) * 100 : 0;

    report.domains[domain.name] = {
      cases: cases.length,
      accuracy: `${accuracy.toFixed(2)}%`,
      determinismViolations,
      opsPerSec,
      mismatches: mismatches.slice(0, 5),
    };

    console.log(`[${domain.label}]`);
    console.log(`  Kasus: ${cases.length} | Akurasi: ${accuracy.toFixed(2)}% | Determinisme: ${determinismViolations === 0 ? 'OK (3× identik)' : determinismViolations + ' pelanggaran'} | ${opsPerSec.toLocaleString('id-ID')} ops/detik`);
    if (mismatches.length) {
      console.log(`  ⚠️  Mismatch (${mismatches.length}):`);
      for (const m of mismatches.slice(0, 5)) console.log(`    - ${m.caseId}: ${JSON.stringify(m.actual || m.error)}`);
    }
    console.log('');
  }

  if (withLLM) {
    if (!process.env.LLM_BENCH_KEY) {
      console.error('❌ Mode LLM butuh LLM_BENCH_KEY di environment.');
      process.exit(1);
    }
    const model = process.env.LLM_BENCH_MODEL || 'gpt-4o-mini';
    console.log(`🤖 LLM Baseline Comparison (model: ${model}, sampel ${llmSample} kasus/domain)\n`);
    const SYSTEM = 'Anda adalah kalkulator kepatuhan hukum & pajak Indonesia yang presisi. Hanya balas JSON valid, tanpa penjelasan, tanpa markdown.';

    for (const domain of DOMAINS) {
      const cases = loadGolden(domain.golden).slice(0, llmSample);
      let llmPassed = 0;
      let llmParseFailed = 0;
      let enginePassed = 0;

      for (const c of cases) {
        const expected = c.expected;
        const engineChecks = domain.run(c);
        if (Object.keys(expected).every((k) =>
          matches(expected[k], engineChecks[k])
        )) enginePassed++;

        try {
          const answer = await llmAsk(SYSTEM, buildLLMPrompt(c, engineChecks));
          const parsed = parseLLMJson(answer);
          if (!parsed) {
            llmParseFailed++;
            continue;
          }
          const llmOk = Object.keys(expected).every((k) => {
            if (typeof expected[k] !== 'number') return parsed[k] === expected[k];
            return numericTolerance(expected[k], Number(parsed[k]));
          });
          if (llmOk) llmPassed++;
        } catch (e) {
          console.error(`  ⚠️  ${c.caseId}: ${e.message}`);
          break;
        }
      }

      report.domains[domain.name].llm = {
        model,
        sample: cases.length,
        llmPassRate: `${((llmPassed / cases.length) * 100).toFixed(1)}%`,
        llmParseFailed,
        enginePassRate: `${((enginePassed / cases.length) * 100).toFixed(1)}%`,
      };
      console.log(`[${domain.label}] Engine: ${report.domains[domain.name].llm.enginePassRate} vs LLM(${model}): ${report.domains[domain.name].llm.llmPassRate} (parse gagal: ${llmParseFailed}/${cases.length})`);
    }
  }

  if (jsonReportPath) {
    fs.writeFileSync(jsonReportPath, JSON.stringify(report, null, 2));
    console.log(`📄 Laporan JSON: ${jsonReportPath}`);
  }

  const allAccurate = Object.values(report.domains).every((d) => d.accuracy === '100.00%');
  console.log(allAccurate ? '\n✅ Benchmark deterministik: 100% akurasi corpus, determinisme stabil.' : '\n⚠️ Ada mismatch — periksa ruleset/engine.');
  process.exit(allAccurate ? 0 : 1);
})();