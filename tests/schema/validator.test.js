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

    // Validate plugin.json
    const manifestPath = path.join(pluginDir, '.claude-plugin', 'plugin.json');
    try {
      const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
      if (!manifest.name || !manifest.version || !manifest.description) {
        console.error(`❌ Invalid required manifest fields in ${manifestPath}`);
        errors++;
      }
    } catch (e) {
      console.error(`❌ JSON syntax error in ${manifestPath}: ${e.message}`);
      errors++;
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
    console.log(`✅ Schema Validation Passed: Discovered ${plugins.length} plugins & ${totalSkills} skills cleanly with zero errors.`);
  }
}

validate();
