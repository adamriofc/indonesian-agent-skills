const fs = require('fs');
const path = require('path');

const PLUGINS = ['legal-id', 'tax-payroll-id', 'hr-id', 'ecommerce-id', 'content-lokal-id'];

function runSchemaTests() {
  console.log("🔍 Running Schema & Manifest Validation Tests...\n");
  let errors = 0;
  let totalSkills = 0;

  PLUGINS.forEach(plugin => {
    const pluginDir = path.join(__dirname, '../..', plugin);
    
    if (!fs.existsSync(pluginDir)) {
      console.error(`❌ Plugin directory missing: ${plugin}`);
      errors++;
      return;
    }

    // Validate plugin.json
    const manifestPath = path.join(pluginDir, '.claude-plugin', 'plugin.json');
    if (!fs.existsSync(manifestPath)) {
      console.error(`❌ Missing plugin.json in ${plugin}`);
      errors++;
    } else {
      try {
        const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
        if (!manifest.name || !manifest.version || !manifest.description) {
          console.error(`❌ Invalid fields in ${manifestPath}`);
          errors++;
        }
      } catch (e) {
        console.error(`❌ JSON syntax error in ${manifestPath}: ${e.message}`);
        errors++;
      }
    }

    // Validate Skills
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
          console.error(`❌ Missing frontmatter block in ${skillFilePath}`);
          errors++;
          return;
        }

        const parts = content.split('---');
        if (parts.length < 3) {
          console.error(`❌ Invalid frontmatter delimiters in ${skillFilePath}`);
          errors++;
          return;
        }

        const frontmatter = parts[1];
        if (!frontmatter.includes('name:') || !frontmatter.includes('description:')) {
          console.error(`❌ Frontmatter missing required 'name' or 'description' in ${skillFilePath}`);
          errors++;
        }

        totalSkills++;
      });
    }
  });

  if (errors > 0) {
    console.error(`\n❌ Schema Validation failed with ${errors} error(s).`);
    process.exit(1);
  } else {
    console.log(`✅ Schema Validation Passed: 5 plugins & ${totalSkills} skills verified cleanly.`);
  }
}

runSchemaTests();
