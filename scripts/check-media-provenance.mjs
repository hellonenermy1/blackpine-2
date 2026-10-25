import fs from 'node:fs/promises';
import path from 'node:path';

const root = new URL('../', import.meta.url);
const provenancePath = new URL('../media-library/blackpine-shortlist/PRODUCTION-PROVENANCE.tsv', import.meta.url);
const shortlistPath = new URL('../media-library/blackpine-shortlist/SOURCES.tsv', import.meta.url);
const sourceRoot = new URL('../media-library/blackpine-shortlist/', import.meta.url);
const productionRoot = new URL('../public/assets/editorial/', import.meta.url);
const errors = [];

function parseTsv(body) {
  const lines = body.trim().split(/\r?\n/);
  const headers = lines.shift().split('\t');
  return lines.filter(Boolean).map((line, index) => {
    const values = line.split('\t');
    if (values.length !== headers.length) {
      errors.push(`TSV row ${index + 2} has ${values.length} columns; expected ${headers.length}`);
    }
    return Object.fromEntries(headers.map((header, column) => [header, values[column] ?? '']));
  });
}

const provenanceRows = parseTsv(await fs.readFile(provenancePath, 'utf8'));
const shortlistRows = parseTsv(await fs.readFile(shortlistPath, 'utf8'));
const shortlistByFile = new Map(shortlistRows.map(row => [`${row.category}/${row.file}`, row]));
const productionEntries = await fs.readdir(productionRoot, { withFileTypes: true });
const productionJpegs = productionEntries.filter(entry => entry.isFile() && /\.jpe?g$/i.test(entry.name)).map(entry => entry.name).sort();
const responsiveSuffix = /-(?:640|960|1280)\.jpe?g$/i;
const productionOriginals = productionJpegs.filter(name => !responsiveSuffix.test(name));
const registeredOriginals = provenanceRows.map(row => row.production_asset).sort();

if (new Set(registeredOriginals).size !== registeredOriginals.length) errors.push('Production provenance register contains duplicate production_asset rows');
if (JSON.stringify(productionOriginals) !== JSON.stringify(registeredOriginals)) {
  errors.push(`Production provenance coverage mismatch. Files: ${productionOriginals.join(', ')}. Register: ${registeredOriginals.join(', ')}`);
}

let unverifiedCreators = 0;
for (const row of provenanceRows) {
  const shortlist = shortlistByFile.get(row.source_library_file);
  if (!shortlist) {
    errors.push(`${row.production_asset}: source library file is not present in SOURCES.tsv: ${row.source_library_file}`);
    continue;
  }
  if (shortlist.pexels_photo_id !== row.pexels_photo_id) errors.push(`${row.production_asset}: Pexels photo ID differs from SOURCES.tsv`);
  if (shortlist.source_page !== row.source_page) errors.push(`${row.production_asset}: source page differs from SOURCES.tsv`);
  if (row.source_page !== `https://www.pexels.com/photo/${row.pexels_photo_id}/`) errors.push(`${row.production_asset}: source page is not the canonical Pexels photo URL for its ID`);
  if (row.license_basis !== 'Pexels License') errors.push(`${row.production_asset}: unexpected license basis ${row.license_basis || '<missing>'}`);
  if (row.attribution_required !== 'no') errors.push(`${row.production_asset}: attribution_required must reflect the reviewed Pexels license basis`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(row.license_reviewed)) errors.push(`${row.production_asset}: invalid license_reviewed date`);
  if (!row.intended_use.trim()) errors.push(`${row.production_asset}: intended use is missing`);
  if (!row.rights_note.trim()) errors.push(`${row.production_asset}: third-party rights note is missing`);

  if (row.creator_verification === 'VERIFIED') {
    if (!row.creator.trim() || row.creator === 'UNVERIFIED') errors.push(`${row.production_asset}: creator marked VERIFIED without a creator name`);
  } else if (row.creator_verification === 'UNVERIFIED') {
    unverifiedCreators += 1;
    if (row.creator !== 'UNVERIFIED') errors.push(`${row.production_asset}: unverified creator must be recorded explicitly as UNVERIFIED`);
  } else {
    errors.push(`${row.production_asset}: creator_verification must be VERIFIED or UNVERIFIED`);
  }

  const sourceBytes = await fs.readFile(new URL(row.source_library_file, sourceRoot));
  const productionBytes = await fs.readFile(new URL(row.production_asset, productionRoot));
  if (!sourceBytes.equals(productionBytes)) errors.push(`${row.production_asset}: production original no longer matches the registered shortlist source bytes`);

  const stem = row.production_asset.replace(/\.jpe?g$/i, '');
  const actualDerivatives = productionJpegs.filter(name => new RegExp(`^${stem.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}-(?:640|960|1280)\\.jpe?g$`, 'i').test(name)).sort();
  const registeredDerivatives = row.derivative_assets ? row.derivative_assets.split(',').map(value => value.trim()).filter(Boolean).sort() : [];
  if (JSON.stringify(actualDerivatives) !== JSON.stringify(registeredDerivatives)) {
    errors.push(`${row.production_asset}: derivative list mismatch. Files: ${actualDerivatives.join(', ') || '<none>'}. Register: ${registeredDerivatives.join(', ') || '<none>'}`);
  }
}

if (errors.length) {
  console.error(errors.map(error => `MEDIA PROVENANCE: ${error}`).join('\n'));
  process.exit(1);
}

console.log(`Media provenance mapping passed: ${provenanceRows.length} production editorial originals map byte-for-byte to registered shortlist sources; ${productionJpegs.length - productionOriginals.length} responsive derivatives are accounted for; ${unverifiedCreators} creator field(s) remain explicitly unresolved rather than inferred.`);
