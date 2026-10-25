import fs from 'node:fs/promises';
import { esCatalog } from '../src/i18n/es-catalog.mjs';
import { esFinalEditorial } from '../src/i18n/es-final-editorial.mjs';

const dist = new URL('../dist/', import.meta.url);
const errors = [];
const assert = (condition, message) => { if (!condition) errors.push(message); };

for (const [english, spanish] of esFinalEditorial) {
  assert(esCatalog.get(english) === spanish, `Final Spanish editorial override is not authoritative for: ${english}`);
}

const effectiveSpanish = [...esCatalog.values()].join('\n');
const forbiddenEffectiveFragments = [
  ['cuenta de dirección', 'literal executive-account calque'],
  ['revisión de supervisión', 'stiff monitoring-review calque'],
  ['Dirección de práctica', 'missing article in practice-leadership name'],
  ['Respuesta y triaje de incidentes', 'regional triage wording'],
  ['responsable sénior de triaje', 'regional triage role wording'],
  ['ABIERTO significa que no se reivindica', 'unclear evidence-state wording'],
  ['ABIERTO significa que no se afirma', 'over-compressed evidence-state wording'],
  ['reportes de buena fe', 'regional vulnerability-report wording'],
  ['grado de corrección completado', 'mechanical remediation-completion wording'],
  ['Carreras en Blackpine', 'employment/careers calque'],
  ['portafolio de investigación original', 'regional portfolio wording']
];
for (const [fragment, label] of forbiddenEffectiveFragments) {
  const matches = [...esCatalog.entries()]
    .filter(([, spanish]) => spanish.toLowerCase().includes(fragment.toLowerCase()))
    .map(([english]) => english);
  assert(matches.length === 0, `Effective Spanish catalog still contains ${label}: ${fragment}${matches.length ? ` [source: ${matches.join(' | ')}]` : ''}`);
}

const criticalExpected = new Map([
  ['Open means not claimed.', 'ABIERTO significa que Blackpine no formula esa afirmación.'],
  ['Readiness work is not a certification, legal opinion, regulatory determination, or third-party attestation unless a separate qualified service explicitly provides that outcome.', 'El trabajo de preparación no constituye una certificación, opinión jurídica, determinación regulatoria ni atestación de terceros, salvo que un servicio cualificado y separado proporcione expresamente ese resultado.'],
  ['Recovery outcomes depend on the affected technology, available evidence, access authority, third-party dependencies, and the condition of backups or recovery paths. Blackpine does not represent recovery as guaranteed.', 'Los resultados de la recuperación dependen de la tecnología afectada, la evidencia disponible, la autoridad de acceso, las dependencias de terceros y el estado de las copias de seguridad o de los mecanismos de recuperación. Blackpine no presenta la recuperación como un resultado garantizado.'],
  ['This page does not promise around-the-clock coverage, a particular response time, or guaranteed containment. Those claims require an approved operating model and contract.', 'Esta página no promete cobertura permanente, un tiempo de respuesta concreto ni contención garantizada. Esas afirmaciones requieren un modelo operativo aprobado y un contrato.'],
  ['The corporate website is not the authoritative specification for Cipher cryptography. Implementation details, threat assumptions, test vectors, verification behavior, and release-specific claims must come from the current project repository and release documentation.', 'El sitio institucional no es la especificación autorizada de la criptografía de Cipher. Los detalles de implementación, los supuestos del modelo de amenazas, los vectores de prueba, el comportamiento de verificación y las afirmaciones específicas de cada versión deben proceder del repositorio actual del proyecto y de su documentación de versión.'],
  ['These testimonials were supplied to Blackpine as client feedback. The client company names are intentionally not published because the clients requested that their organizations remain confidential.', 'Estos testimonios fueron proporcionados a Blackpine como comentarios de clientes. Las citas en español son traducciones del texto en inglés proporcionado; no se presentan como palabras originalmente redactadas en español. Los nombres de las empresas clientes no se publican deliberadamente porque los clientes solicitaron que sus organizaciones permanecieran confidenciales.'],
  ["Blackpine does not infer client size, architecture, project value, location, incident status, findings, tools used, remediation completion, time saved or business outcome from a testimonial.", "Blackpine no deduce a partir de un testimonio el tamaño del cliente, su arquitectura, el valor del proyecto, su ubicación, el estado de un incidente, hallazgos, herramientas utilizadas, si se completaron las medidas correctivas, el tiempo ahorrado ni resultados de negocio."],
  ['No confirmed open roles are currently advertised. Seven future roles are planned.', 'Actualmente no se anuncian vacantes confirmadas. Hay siete puestos futuros planificados.']
]);
for (const [english, expected] of criticalExpected) {
  assert(esCatalog.get(english) === expected, `Critical Spanish claim boundary changed for: ${english}`);
}

const htmlFiles = [];
async function walk(dir, prefix = '') {
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    const relative = `${prefix}${entry.name}`;
    if (entry.isDirectory()) await walk(new URL(`./${entry.name}/`, dir), `${relative}/`);
    else if (entry.isFile() && entry.name.endsWith('.html')) htmlFiles.push(relative);
  }
}
const esDir = new URL('./es/', dist);
await walk(esDir);
assert(htmlFiles.length === 86, `Expected 85 Spanish routes plus Spanish 404 HTML, found ${htmlFiles.length} HTML files.`);

let renderedSpanish = '';
for (const file of htmlFiles) renderedSpanish += `\n${await fs.readFile(new URL(file, esDir), 'utf8')}`;
for (const [fragment, label] of forbiddenEffectiveFragments) {
  assert(!renderedSpanish.toLowerCase().includes(fragment.toLowerCase()), `Rendered Spanish still contains ${label}: ${fragment}`);
}

for (const required of [
  'ABIERTO significa que Blackpine no formula esa afirmación.',
  'notificaciones de buena fe sobre posibles problemas de seguridad',
  'si se completaron las medidas correctivas',
  'no constituye una certificación, opinión jurídica, determinación regulatoria ni atestación de terceros',
  'no presenta la recuperación como un resultado garantizado',
  'no promete cobertura permanente, un tiempo de respuesta concreto ni contención garantizada',
  'El sitio institucional no es la especificación autorizada de la criptografía de Cipher',
  'Las citas en español son traducciones del texto en inglés proporcionado',
  'Actualmente no se anuncian vacantes confirmadas'
]) assert(renderedSpanish.includes(required), `Rendered Spanish is missing final editorial/claim marker: ${required}`);

for (const forbidden of [
  '/es/legal/privacy/',
  '/es/legal/terms/'
]) assert(!renderedSpanish.includes(`href="${forbidden}"`), `Rendered Spanish advertises unpublished lawyer legal route ${forbidden}`);

if (errors.length) {
  console.error(`Final Spanish editorial gate failed with ${errors.length} issue(s):`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`Final Spanish editorial gate passed: ${esFinalEditorial.size} human-reviewed refinements are authoritative, known calques are absent from the effective catalog and rendered Spanish, critical service/recovery/Cipher/client-evidence/hiring boundaries are preserved, and unpublished Spanish lawyer legal routes remain unadvertised.`);
