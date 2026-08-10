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
const llmSample = llmSampleArg ? parseInt(llmSampleArg.split('=')[1], 10) : 10;
const jsonReportArg = args.find((a) => a.startsWith('--json-report'));
const jsonReportPath = jsonReportArg ? jsonReportArg.split('=')[1] : null;

const { calculatePPh21Monthly } = require(path.join(ROOT, 'engines/pph21-calculator'));
const { calculateBpjs } = require(path.join(ROOT, 'engines/bpjs-calculator'));
const { calculatePhk } = require(path.join(ROOT, 'engines/phk-calculator'));

function loadGolden(name) {
  const raw = fs.readFileSync(path.join(ROOT, 'tests/golden', `${name}.json`), 'utf8');
  return JSON.parse(raw);
}

function fmt(v) {
  return typeof v === 'number' ? v.toLocaleString('id-ID') : String(v);
}

function assertNumericMatch(expected, actual) {
  if (typeof expected !== 'number') return null; // non-numeric field: skip
  return expected === actual;
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

const DOMAINS = [
  { name: 'pph21', label: 'PPh 21 (TER PP 58/2023)', golden: 'pph21', run: runPph21 },
  { name: 'bpjs', label: 'BPJS (Perpres 64/2020 + PP 45/2015)', golden: 'bpjs', run: runBpjs },
  { name: 'phk', label: 'PHK (PP 35/2021)', golden: 'phk', run: runPhk },
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
        return typeof exp === 'number' ? numericTolerance(exp, checks[k]) : exp === checks[k];
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
          typeof expected[k] === 'number' ? numericTolerance(expected[k], engineChecks[k]) : expected[k] === engineChecks[k]
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