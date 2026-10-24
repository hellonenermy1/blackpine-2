import { frCaCatalog } from '../src/i18n/fr-ca-catalog.mjs';

const errors = [];
const expected = new Map([
  ['Assurance Requests', 'Demandes d’assurance de la sécurité'],
  ['Enterprise Assurance', 'Assurance de la sécurité pour les entreprises'],
  ['Security Contacts', 'Coordonnées de sécurité'],
  ['Try: CEO account hacked, weird MFA, ransomware, DMARC', 'Essayez : compte de direction compromis, demande MFA inattendue, rançongiciel, DMARC']
]);

for (const [english, french] of expected) {
  if (frCaCatalog.get(english) !== french) errors.push(`${english}: expected reviewed wording “${french}”.`);
}

const forbidden = [
  /dépendances marketing/i,
  /profondeur en criminalistique/i,
  /chemin de contrôle traverse/i,
  /outil d’analytique tiers/i,
  /spécialistes en ingénierie, en intervention, au COS ou en GRC/i,
  /MFA inhabituel/i
];

for (const [english, french] of frCaCatalog) {
  for (const pattern of forbidden) {
    if (pattern.test(french)) errors.push(`${english}: final Canadian-French editorial regression matched ${pattern}.`);
  }
}

if (errors.length) {
  console.error(`Final Phase 2 French editorial gate failed with ${errors.length} issue(s):`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log('Final Phase 2 French editorial gate passed: reviewed security-assurance wording and final anti-calque regressions are preserved.');
