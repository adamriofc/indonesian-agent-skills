# Universal Agent Skill & Interoperability Protocol (`SKILL_PROTOCOL.md`)

This document defines the architectural specification and interoperability standards for `indonesian-business-agent-skills`.

---

## 1. Architectural Principles

All skills and computational engines adhere to **3 Core Architectural Principles**:

1. **Decoupled Reasoning & Calculation**: LLMs handle natural language understanding and parameter extraction; Node.js engines (`engines/*.js`) handle invariant calculations.
2. **KBLI-Aware Context Routing**: Business activities are mapped via KBLI 2020 codes (`engines/kbli-context-router.js`) into Business Archetypes (`PRODUCT_MANUFACTURING`, `PROFESSIONAL_SERVICE`, `CAPACITY_SERVICE`, `MARKETPLACE_PLATFORM`, `HYBRID`).
3. **Closed Security Boundary**: Ingestion skills wrap untrusted user content inside explicit, closed runtime delimiters: `[SYSTEM INSTRUCTION] ... [UNTRUSTED DATA PAYLOAD] ... [END PAYLOAD]`.

---

## 2. Universal Agent Compatibility & Installation Shorthands

### Universal Agent Skills CLI (`npx skills`)
Supported across OpenWork Desktop, OpenCode CLI, Claude Code, Cursor IDE, Codex, and custom frameworks:

```bash
# Install all 81 skills across 7 plugins
npx skills add adamriofc/indonesian-business-agent-skills

# Install specific domain plugins
npx skills add adamriofc/indonesian-business-agent-skills --plugin tax-payroll-id
npx skills add adamriofc/indonesian-business-agent-skills --plugin strategic-id
```

### Claude Code Marketplace Manifest (`.claude-plugin/marketplace.json`)
Allows native one-click plugin discovery and installation within Claude Code:

```json
{
  "$schema": "https://json.schemastore.org/claude-plugin-marketplace.json",
  "owner": {
    "name": "adamriofc"
  },
  "plugins": [
    { "name": "tax-payroll-id", "source": "./tax-payroll-id" },
    { "name": "legal-id", "source": "./legal-id" },
    { "name": "hr-id", "source": "./hr-id" },
    { "name": "ecommerce-id", "source": "./ecommerce-id" },
    { "name": "content-lokal-id", "source": "./content-lokal-id" },
    { "name": "finance-id", "source": "./finance-id" },
    { "name": "strategic-id", "source": "./strategic-id" }
  ]
}
```

---

## 3. Node.js SDK / Engine Integration

Computational engines require **zero third-party dependencies** and execute deterministically on Node.js 20+:

```javascript
const { calculatePPh21Monthly } = require('indonesian-business-agent-skills/engines/pph21-calculator');
const { calculatePhk } = require('indonesian-business-agent-skills/engines/phk-calculator');
const { analyzeRegulatoryImpact } = require('indonesian-business-agent-skills/engines/regulatory-impact-engine');

// PPh 21 TER Tax Calculation
const taxResult = calculatePPh21Monthly(10000000, 'TK/0', true, '2026-03-01');

// Regulatory Impact Analysis (PP 20/2026 Transition)
const impactResult = analyzeRegulatoryImpact({
  domain: 'umkm',
  fromRuleset: 'UMKM-2022',
  toRuleset: 'UMKM-2026',
  companyProfile: { entityType: 'corporate', annualRevenue: 5000000000 }
});
```
