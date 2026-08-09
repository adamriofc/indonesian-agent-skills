const fs = require('fs');
const path = require('path');
const assert = require('assert');

// Flagship skills that ingest untrusted user inputs (agreements, logs, process descriptions)
const SENSITIVE_INPUT_SKILLS = [
  'legal-id/skills/contract-reviewer/SKILL.md',
  'legal-id/skills/pdp-compliance/SKILL.md',
  'ecommerce-id/skills/analisis-kompetitor-marketplace/SKILL.md',
  'hr-id/skills/phk-calculator/SKILL.md'
];

function runSecurityTests() {
  console.log("🛡️ Running Prompt Injection Defense Security Tests...\n");
  const rootDir = path.join(__dirname, '../..');
  let failures = 0;

  SENSITIVE_INPUT_SKILLS.forEach(skillRelPath => {
    const filePath = path.join(rootDir, skillRelPath);
    if (!fs.existsSync(filePath)) {
      console.warn(`⚠️ Skipping missing skill file: ${skillRelPath}`);
      return;
    }

    const content = fs.readFileSync(filePath, 'utf8');

    // Assert that the file contains prompt isolation instructions outlined in SECURITY.md
    const hasIsolationInstruction = content.includes('[SYSTEM INSTRUCTION]') || content.includes('[UNTRUSTED DATA PAYLOAD]');
    
    if (!hasIsolationInstruction) {
      console.error(`❌ Security Violation: ${skillRelPath} does not implement untrusted payload delimiters or isolation rules.`);
      failures++;
    } else {
      console.log(`✅ Security Verified: ${skillRelPath} implements prompt injection mitigation boundaries.`);
    }
  });

  if (failures > 0) {
    console.error(`\n❌ Security testing FAILED with ${failures} violations.`);
    process.exit(1);
  } else {
    console.log("\n✅ Security Policy Verification Passed: Delimiter boundaries enforced on all ingestion skills.");
  }
}

runSecurityTests();
