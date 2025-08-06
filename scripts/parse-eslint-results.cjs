// scripts/parse-eslint-results.js
// Usage: node scripts/parse-eslint-results.js eslint.json
// Groups ESLint violations by rule and file, outputs a summary.

const fs = require('fs');
const path = process.argv[2] || 'eslint.json';

if (!fs.existsSync(path)) {
  console.error(`File not found: ${path}`);
  process.exit(1);
}

const results = JSON.parse(fs.readFileSync(path, 'utf8'));
const grouped = {};

for (const fileResult of results) {
  const filePath = fileResult.filePath;
  for (const message of fileResult.messages) {
    const rule = message.ruleId || 'unknown';
    if (!grouped[rule]) grouped[rule] = {};
    if (!grouped[rule][filePath]) grouped[rule][filePath] = [];
    grouped[rule][filePath].push({
      line: message.line,
      column: message.column,
      endLine: message.endLine,
      endColumn: message.endColumn,
      message: message.message,
      severity: message.severity,
    });
  }
}

console.log('ESLint Violations Grouped by Rule and File:');
for (const rule of Object.keys(grouped)) {
  console.log(`\nRule: ${rule}`);
  for (const file of Object.keys(grouped[rule])) {
    console.log(`  File: ${file}`);
    for (const violation of grouped[rule][file]) {
      console.log(
        `    [${violation.line}:${violation.column}] ${violation.message} (severity: ${violation.severity})`
      );
    }
  }
} 