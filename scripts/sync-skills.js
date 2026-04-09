/**
 * sync-skills.js
 *
 * Copies zeroclaw/skills/<name>/SKILL.md → public/skills/<name>.md
 * and regenerates public/skills/index.json.
 *
 * Run automatically via the "prebuild" npm script so that every
 * `npm run build` (including `npm run deploy`) always serves the
 * canonical zeroclaw/skills/ definitions to the React dashboard.
 */

const fs   = require('fs');
const path = require('path');

const AGENT_ORDER = [
  'researcher',
  'coder',
  'code-reviewer',
  'security-scanner',
  'devops',
  'data-analyst',
  'content-writer',
  'hermes',
];

const ROOT        = path.resolve(__dirname, '..');
const SKILLS_SRC  = path.join(ROOT, 'zeroclaw', 'skills');
const SKILLS_DEST = path.join(ROOT, 'public', 'skills');

// Ensure destination directory exists
fs.mkdirSync(SKILLS_DEST, { recursive: true });

const synced = [];

for (const name of AGENT_ORDER) {
  const src  = path.join(SKILLS_SRC, name, 'SKILL.md');
  const dest = path.join(SKILLS_DEST, `${name}.md`);

  if (!fs.existsSync(src)) {
    console.warn(`[sync-skills] WARNING: zeroclaw/skills/${name}/SKILL.md not found — skipping ${name}`);
    continue;
  }

  fs.copyFileSync(src, dest);
  synced.push(name);
  console.log(`[sync-skills] ${name}.md  ← zeroclaw/skills/${name}/SKILL.md`);
}

// Write index.json with the ordered list of synced agent names
const indexPath = path.join(SKILLS_DEST, 'index.json');
fs.writeFileSync(indexPath, JSON.stringify(synced, null, 2) + '\n');
console.log(`[sync-skills] index.json updated (${synced.length} agents)`);
