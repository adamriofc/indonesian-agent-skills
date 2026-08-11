const assert = require('assert');

// Mock Agent Natural Language Parameter Extractor simulating Tier-2 Agent Capability
function mockAgentParameterExtractor(prompt) {
  const p = (prompt || '').toLowerCase();

  // Extract Salary
  let salary = 0;
  const salaryMatch = p.match(/(?:gaji|penghasilan|sebesar|rp\.?)\s*(?:sebesar|rp\.?)?\s*([\d\.\,]+)\s*(juta|jt|ribu|rb)?/i) ||
                      p.match(/([\d\.\,]+)\s*(juta|jt|ribu|rb)/i);
  if (salaryMatch) {
    let numStr = salaryMatch[1].replace(/\./g, '').replace(',', '.');
    let num = parseFloat(numStr);
    const unit = (salaryMatch[2] || '').toLowerCase();
    if (unit === 'juta' || unit === 'jt') num = Math.round(num * 1000000);
    else if (unit === 'ribu' || unit === 'rb') num = Math.round(num * 1000);
    salary = num;
  }

  // Extract PTKP Status
  let ptkp = 'TK/0';
  const ptkpMatch = p.match(/\b(tk\/[0-3]|k\/[0-3]|k\/i\/[0-3])\b/i);
  if (ptkpMatch) {
    ptkp = ptkpMatch[1].toUpperCase();
  }

  return {
    salary,
    ptkp
  };
}

function runNlpExtractionBenchmark() {
  console.log("📊 Running Tier-2 Regex & Rule-Based Parameter Extractor Fixture Test (50 NL Cases)...\n");

  const testCases = [];

  // Generate 50 precise natural language prompt cases
  const basePrompts = [
    { salary: 5000000, ptkp: "TK/0", unit: "juta" },
    { salary: 8000000, ptkp: "K/0", unit: "juta" },
    { salary: 12000000, ptkp: "K/1", unit: "jt" },
    { salary: 18000000, ptkp: "K/2", unit: "juta" },
    { salary: 30000000, ptkp: "K/3", unit: "jt" },
    { salary: 6000000, ptkp: "TK/1", unit: "juta" },
    { salary: 14000000, ptkp: "TK/2", unit: "jt" },
    { salary: 22000000, ptkp: "TK/3", unit: "juta" },
    { salary: 9000000, ptkp: "K/1", unit: "juta" },
    { salary: 16000000, ptkp: "K/2", unit: "jt" }
  ];

  basePrompts.forEach((b, idx) => {
    for (let i = 1; i <= 5; i++) {
      testCases.push({
        prompt: `Kasus Karyawan ${idx * 5 + i}: Gaji ${b.salary / 1000000} ${b.unit} per bulan status ${b.ptkp}`,
        expected: { salary: b.salary, ptkp: b.ptkp }
      });
    }
  });

  let passed = 0;
  testCases.forEach((tc) => {
    const extracted = mockAgentParameterExtractor(tc.prompt);
    let ok = true;
    if (tc.expected.salary !== undefined && extracted.salary !== tc.expected.salary) ok = false;
    if (tc.expected.ptkp !== undefined && extracted.ptkp !== tc.expected.ptkp) ok = false;

    if (ok) passed++;
  });

  const accuracyPercent = ((passed / testCases.length) * 100).toFixed(2);
  console.log(`  Cases Tested: ${testCases.length} | Passed: ${passed} | Extraction Accuracy: ${accuracyPercent}%`);
  assert.strictEqual(passed, 50, "Tier-2 Parameter Extraction Accuracy should be 100% on benchmark prompts");

  console.log("\n✅ Tier-2 Regex & Rule-Based Parameter Extractor Fixture Test Passed 100%!");
}

runNlpExtractionBenchmark();