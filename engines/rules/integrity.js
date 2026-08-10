/**
 * Cryptographic Ruleset Runtime Integrity Verifier
 * Computes and asserts SHA-256 checksums of regulatory rulesets to prevent tampering.
 */

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

// Expected SHA-256 Hashes for Version 1.1.0 Rulesets (audit-hardening release)
const RULESET_CHECKSUMS = {
  'bpjs.json': '96637d44ecdded7998a7b417ee931ed526d65ad26f04471874a4d96b235bedc2',
  'pph21.json': 'faec8d0b221ab8f730b0d79d75ae66e76e21bbc781040d81662948c90a9562b0',
  'marketplace.json': 'ae5167b48cc70b2148d6a860ab8ed515d61f77824799bb35c3f49939ec0e2615',
  'umkm.json': 'abbaa87ec0e8f6715be6119abcb432cc984d371b6aad38fc1a1195b502283587'
};

function verifyRulesetIntegrity(filename, filePathOverride) {
  const expectedHash = RULESET_CHECKSUMS[filename];
  if (!expectedHash) {
    throw new Error(`[Cryptographic Integrity Violation] No registered hash manifest for: ${filename}`);
  }

  const targetPath = filePathOverride || path.join(__dirname, filename);
  if (!fs.existsSync(targetPath)) {
    throw new Error(`[Cryptographic Integrity Violation] Ruleset file not found: ${targetPath}`);
  }

  const fileContent = fs.readFileSync(targetPath, 'utf8');
  const computedHash = crypto.createHash('sha256').update(fileContent, 'utf8').digest('hex');

  if (computedHash !== expectedHash) {
    throw new Error(`[Cryptographic Integrity Violation] Ruleset ${filename} has been tampered with! Computed SHA-256: ${computedHash}, Expected: ${expectedHash}`);
  }

  return {
    filename,
    status: 'VERIFIED',
    hash: computedHash
  };
}

module.exports = {
  verifyRulesetIntegrity,
  RULESET_CHECKSUMS
};
