const assert = require('assert');
const { calculatePPh21Monthly } = require('../../engines/pph21-calculator');
const { calculateBpjs } = require('../../engines/bpjs-calculator');
const { calculateThr } = require('../../engines/thr-calculator');
const { calculatePhk } = require('../../engines/phk-calculator');

function runIntegrationWorkflowTests() {
  console.log("🔗 Running End-to-End Enterprise Employee Lifecycle Integration Tests...\n");

  const employeeProfiles = [
    { name: "Andi Wijaya", salary: 7500000, ptkp: "TK/0", tenureYears: 2, leaveDays: 5, date: "2026-03-01" },
    { name: "Budi Pratama", salary: 15000000, ptkp: "K/1", tenureYears: 5, leaveDays: 10, date: "2026-03-01" },
    { name: "Citra Dewi", salary: 25000000, ptkp: "K/2", tenureYears: 10, leaveDays: 15, date: "2026-03-01" },
    { name: "Deni Saputra", salary: 11000000, ptkp: "TK/1", tenureYears: 1, leaveDays: 0, date: "2025-05-01" }
  ];

  let testCount = 0;

  employeeProfiles.forEach(emp => {
    // 1. Monthly Payroll Tax Calculation
    const taxRes = calculatePPh21Monthly(emp.salary, emp.ptkp, true, emp.date);
    assert.ok(taxRes.monthlyTaxWithheld >= 0);
    testCount++;

    // 2. BPJS Social Security Deduction Split
    const bpjsRes = calculateBpjs(emp.salary, 'medium', emp.date);
    assert.ok(bpjsRes.summary.grandTotalContribution > 0);
    testCount++;

    // 3. Religious Holiday Allowance (THR) Calculation
    const thrRes = calculateThr(emp.salary, 0, emp.tenureYears * 12);
    assert.strictEqual(thrRes.isEligible, true);
    testCount++;

    // 4. Offboarding Severance Calculation
    const phkRes = calculatePhk(emp.salary, emp.tenureYears, 'efficiency_loss', emp.leaveDays);
    assert.ok(phkRes.totalPayout >= 0, `Total payout for ${emp.name} should be non-negative`);
    testCount++;

    // Integrated Net Salary Take-Home-Pay (THP) Assertion
    const netSalaryTHP = emp.salary - taxRes.monthlyTaxWithheld - bpjsRes.summary.totalEmployeeDeduction;
    assert.ok(netSalaryTHP > 0, `Take Home Pay for ${emp.name} should be positive`);
    testCount++;
  });

  console.log(`✅ Integration Workflow Suite Passed: Executed ${testCount} end-to-end lifecycle assertions across all engine domains.`);
}

runIntegrationWorkflowTests();
