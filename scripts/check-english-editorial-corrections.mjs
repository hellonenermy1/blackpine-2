// Editorial regression checks only. Security, operational-claim, locale and legal gates remain separate.
import fs from 'node:fs/promises';
import { englishRoutes } from '../src/routes.mjs';

const errors = [];
const htmlFor = async path => fs.readFile(path === '/' ? 'dist/index.html' : 'dist' + path + 'index.html', 'utf8');
const text = html => html
  .replace(/<script\b[\s\S]*?<\/script>/gi, ' ')
  .replace(/<style\b[\s\S]*?<\/style>/gi, ' ')
  .replace(/<[^>]+>/g, ' ')
  .replace(/&(?:amp|quot|apos|nbsp);/g, ' ')
  .replace(/\s+/g, ' ');
const contain = (t, phrase, location) => { if (!t.includes(phrase)) errors.push(location + ' missing: ' + phrase); };
const reject = (t, phrase, location) => { if (t.includes(phrase)) errors.push(location + ' retains outdated wording: ' + phrase); };
if (englishRoutes.length !== 87) errors.push('Expected 87 English routes, got ' + englishRoutes.length);

const home = text(await htmlFor('/'));
contain(home, "You don't need to know which service to ask for.", '/');
reject(home, 'You should not need to diagnose the service first.', '/');
reject(home, 'clean everything up.', '/');

for (const path of ['/', '/services/', '/services/recover/']) {
  reject(text(await htmlFor(path)), 'clean everything up.', path);
}
for (const path of ['/', '/services/', '/services/monitor/']) {
  reject(text(await htmlFor(path)), 'surface security problems.', path);
}
for (const path of ['/services/security-assessments/', '/services/identity-email-security/', '/services/cloud-saas-security/']) {
  reject(text(await htmlFor(path)), 'Technical Assessments & Defensive Engineering, with', path);
}

const emergency = text(await htmlFor('/services/emergency-response/'));
for (const phrase of [
  'Assess a suspected ransomware incident',
  'Investigate compromised mailboxes',
  'Investigate suspicious software'
]) contain(emergency, phrase, '/services/emergency-response/');

const protective = text(await htmlFor('/services/protect/'));
for (const phrase of [
  'Get ongoing security leadership',
  'Develop and review practical security policies',
  'Review supplier access'
]) contain(protective, phrase, '/services/protect/');

const evidence = text(await htmlFor('/research/evidence/'));
reject(evidence, 'Source-backed technical guidance or engineering analysis using', '/research/evidence/');

const sample = text(await htmlFor('/reports/sample-security-assessment/'));
for (const phrase of [
  'Review the tenant forwarding policy',
  'Review the results of a representative restoration test',
  'Compare security-log retention settings'
]) contain(sample, phrase, '/reports/sample-security-assessment/');
contain(sample, 'illustrative', '/reports/sample-security-assessment/');

const portal = text(await htmlFor('/trust/client-portal-security/'));
contain(portal, 'does not currently offer a production client portal', '/trust/client-portal-security/');

if (errors.length) {
  console.error(errors.map(error => 'English editorial regression: ' + error).join('\n'));
  process.exit(1);
}
console.log('English editorial regression checks passed across 87 routes: clear intent, differentiated capabilities, evidence disclosure, and current portal availability.');
