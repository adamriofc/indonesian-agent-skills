/**
 * Cryptographic Ruleset Runtime Integrity Verifier
 * Computes and asserts SHA-256 checksums of regulatory rulesets to prevent tampering.
 */

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

// Expected SHA-256 Hashes for Version 1.0.0 Rulesets
const RULESET_CHECKSUMS = {
  'bpjs.json': 'b7a7d5c8266a22a5f1c390f0894bfdad532dce744d72f6a179689cfd56ead723',
  'pph21.json': 'ebe2c10c9852c38cd14f2c91e22532da04f523cfcbd79a721ee49e0553045d9a'
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
