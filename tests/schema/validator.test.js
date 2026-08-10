const fs = require('fs');
const path = require('path');

function discoverPlugins(rootDir) {
  const entries = fs.readdirSync(rootDir, { withFileTypes: true });
  const plugins = [];

  for (const entry of entries) {
    if (entry.isDirectory() && !['engines', 'scripts', 'tests', 'fixtures', 'docs', '.git', '.github', 'node_modules'].includes(entry.name)) {
      const manifestPath = path.join(rootDir, entry.name, '.claude-plugin', 'plugin.json');
      if (fs.existsSync(manifestPath)) {
        plugins.push(entry.name);
      }
    }
  }

  return plugins;
}

function parseYamlFrontmatter(yamlStr) {
  const lines = yamlStr.split('\n');
  const result = {};
  
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    
    const colonIdx = trimmed.indexOf(':');
    if (colonIdx === -1) {
      throw new Error(`Malformed YAML frontmatter line: "${line}"`);
    }
    
    const key = trimmed.slice(0, colonIdx).trim();
    const value = trimmed.slice(colonIdx + 1).trim();
    
    if (!key) {
      throw new Error(`Empty key in YAML frontmatter line: "${line}"`);
    }
    if (result.hasOwnProperty(key)) {
      throw new Error(`Duplicate YAML frontmatter key: "${key}"`);
    }
    
    // Strip surrounding quotes if present
    const cleanValue = value.replace(/^['"]|['"]$/g, '');
    result[key] = cleanValue;
  }
  
  return result;
}

function validate() {
  console.log("🔍 Running Dynamic Plugin & Skill Schema Validation...\n");
  let errors = 0;
  let totalSkills = 0;

  const rootDir = path.join(__dirname, '../..');
  const plugins = discoverPlugins(rootDir);

  if (plugins.length === 0) {
    console.error("❌ No plugin directories discovered!");
    process.exit(1);
  }

  console.log(`  Discovered ${plugins.length} plugin(s): ${plugins.join(', ')}`);

  plugins.forEach(plugin => {
    const pluginDir = path.join(rootDir, plugin);

    // Validate plugin.json Manifest Schema
    const manifestPath = path.join(pluginDir, '.claude-plugin', 'plugin.json');
    try {
      const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
      
      // Strict Manifest Keys Validation
      if (!manifest.name || typeof manifest.name !== 'string' || manifest.name.trim() === '') {
        console.error(`❌ Manifest Schema Violation in ${manifestPath}: 'name' is required and must be a non-empty string.`);
        errors++;
      }
      
      if (!manifest.version || !/^\d+\.\d+\.\d+$/.test(manifest.version)) {
        console.error(`❌ Manifest Schema Violation in ${manifestPath}: 'version' must follow strict SemVer formatting (e.g. 1.0.0). Got: "${manifest.version}"`);
        errors++;
      }
      
      if (!manifest.description || typeof manifest.description !== 'string' || manifest.description.length < 10) {
        console.error(`❌ Manifest Schema Violation in ${manifestPath}: 'description' is too short or missing.`);
        errors++;
      }

      if (!manifest.author || typeof manifest.author !== 'object' || !manifest.author.name) {
        console.error(`❌ Manifest Schema Violation in ${manifestPath}: 'author.name' is required.`);
        errors++;
      }
    } catch (e) {
      console.error(`❌ JSON syntax error in ${manifestPath}: ${e.message}`);
      errors++;
    }

    // Validate Skills Frontmatter Schemas
    const skillsDir = path.join(pluginDir, 'skills');
    if (fs.existsSync(skillsDir)) {
      const skills = fs.readdirSync(skillsDir);
      skills.forEach(skillDirName => {
        const skillFilePath = path.join(skillsDir, skillDirName, 'SKILL.md');
        if (!fs.existsSync(skillFilePath)) {
          console.error(`❌ Missing SKILL.md for skill: ${skillDirName} in ${plugin}`);
          errors++;
          return;
        }

        const content = fs.readFileSync(skillFilePath, 'utf8');
        if (!content.startsWith('---')) {
          console.error(`❌ Missing YAML frontmatter block in ${skillFilePath}`);
          errors++;
          return;
        }

        const parts = content.split('---');
        if (parts.length < 3) {
          console.error(`❌ Invalid YAML frontmatter delimiters in ${skillFilePath}`);
          errors++;
          return;
        }

        // Strict YAML Frontmatter & Agent Skills Standard Specification Parser
        try {
          const frontmatter = parseYamlFrontmatter(parts[1]);
          
          // 1. Name validation: required, <= 64 chars, lowercase kebab-case, must match directory name
          if (!frontmatter.name || frontmatter.name.trim() === '') {
            console.error(`❌ Skill Schema Violation in ${skillFilePath}: 'name' must be a non-empty string in frontmatter.`);
            errors++;
          } else {
            if (frontmatter.name.length > 64) {
              console.error(`❌ Skill Schema Violation in ${skillFilePath}: 'name' exceeds 64 characters (${frontmatter.name.length}).`);
              errors++;
            }
            if (!/^[a-z0-9-]+$/.test(frontmatter.name)) {
              console.error(`❌ Skill Schema Violation in ${skillFilePath}: 'name' must be lowercase kebab-case. Got: "${frontmatter.name}"`);
              errors++;
            }
            if (frontmatter.name !== skillDirName) {
              console.error(`❌ Skill Schema Violation in ${skillFilePath}: 'name' ("${frontmatter.name}") does not match directory name ("${skillDirName}").`);
              errors++;
            }
          }
          
          // 2. Description validation: required, 10 to 1024 chars
          if (!frontmatter.description || frontmatter.description.trim() === '') {
            console.error(`❌ Skill Schema Violation in ${skillFilePath}: 'description' must be a non-empty string in frontmatter.`);
            errors++;
          } else {
            if (frontmatter.description.length < 10 || frontmatter.description.length > 1024) {
              console.error(`❌ Skill Schema Violation in ${skillFilePath}: 'description' length must be between 10 and 1024 characters. Got ${frontmatter.description.length}.`);
              errors++;
            }
          }

          // 3. Frontmatter Keys & Metadata Validation
          const ALLOWED_KEYS = ['name', 'description', 'argument-hint', 'risk_level', 'rule_type', 'quality_tier', 'metadata', 'allowed-tools', 'license', 'compatibility'];
          Object.keys(frontmatter).forEach(key => {
            if (!ALLOWED_KEYS.includes(key)) {
              console.warn(`⚠️ Warning in ${skillFilePath}: non-standard frontmatter key '${key}'. Custom metadata should be placed inside 'metadata:'.`);
            }
          });
        } catch (err) {
          console.error(`❌ YAML Frontmatter parse error in ${skillFilePath}: ${err.message}`);
          errors++;
        }

        totalSkills++;
      });
    }
  });

  // Validate registry/index.json machine-readable index
  const registryPath = path.join(rootDir, 'registry', 'index.json');
  if (fs.existsSync(registryPath)) {
    try {
      const registry = JSON.parse(fs.readFileSync(registryPath, 'utf8'));
      if (!registry.skills || !Array.isArray(registry.skills)) {
        console.error(`❌ Machine-Readable Registry Violation in ${registryPath}: 'skills' array is required.`);
        errors++;
      } else if (registry.skills.length !== totalSkills) {
        console.error(`❌ Machine-Readable Registry Mismatch: registry index has ${registry.skills.length} skills, but discovered ${totalSkills} skill files.`);
        errors++;
      } else {
        console.log(`  Machine-readable skill registry verified (${registry.skills.length} registered skills).`);
      }
    } catch (e) {
      console.error(`❌ Machine-Readable Registry JSON error in ${registryPath}: ${e.message}`);
      errors++;
    }
  }

  if (errors > 0) {
    console.error(`\n❌ Schema Validation failed with ${errors} error(s).`);
    process.exit(1);
  } else {
    console.log(`✅ Schema Validation Passed: Discovered ${plugins.length} plugins & ${totalSkills} skills verified against strict schemas.`);
  }
}

validate();
