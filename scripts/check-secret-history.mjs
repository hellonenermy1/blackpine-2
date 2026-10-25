import { spawnSync } from 'node:child_process';

const checks = [
  ['private key material', '-----BEGIN [A-Z0-9 ]*PRIVATE KEY-----'],
  ['AWS access key identifier', 'AKIA[0-9A-Z]{16}'],
  ['GitHub token', 'gh[pousr]_[A-Za-z0-9_]{20,}'],
  ['Slack token', 'xox[baprs]-[A-Za-z0-9-]{10,}'],
  ['live payment secret', 'sk_live_[A-Za-z0-9]{16,}'],
  ['Google API key', 'AIza[0-9A-Za-z_-]{30,}']
];

const shallow = spawnSync('git', ['rev-parse', '--is-shallow-repository'], { encoding: 'utf8' });
if (shallow.status !== 0) {
  console.error(`ERROR: unable to determine Git history depth: ${shallow.stderr || shallow.stdout}`);
  process.exit(1);
}
if (shallow.stdout.trim() !== 'false') {
  console.error('ERROR: secret-history audit requires a complete Git checkout; configure actions/checkout with fetch-depth: 0.');
  process.exit(1);
}

const failures = [];
for (const [label, pattern] of checks) {
  const result = spawnSync('git', [
    'log', '--all', '--perl-regexp', `-G${pattern}`, '--format=%H', '--name-only', '--no-renames', '--', '.'
  ], { encoding: 'utf8', maxBuffer: 32 * 1024 * 1024 });

  if (result.status !== 0) {
    failures.push(`${label}: git history scan failed: ${(result.stderr || result.stdout || '').trim()}`);
    continue;
  }

  const output = result.stdout.trim();
  if (output) failures.push(`${label}: matching historical diff(s) found:\n${output}`);
}

if (failures.length) {
  console.error(failures.map(message => `ERROR: ${message}`).join('\n'));
  process.exit(1);
}

console.log(`Full Git-history secret audit passed across ${checks.length} high-confidence credential/key patterns.`);
