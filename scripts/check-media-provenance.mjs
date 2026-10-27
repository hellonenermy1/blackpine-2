import fs from 'node:fs/promises';
import { createHash } from 'node:crypto';

const root = new URL('../', import.meta.url);
const provenancePath = new URL('../media-library/blackpine-shortlist/PRODUCTION-PROVENANCE.tsv', import.meta.url);
const shortlistPath = new URL('../media-library/blackpine-shortlist/SOURCES.tsv', import.meta.url);
const sourceRoot = new URL('../media-library/blackpine-shortlist/', import.meta.url);
const productionRoot = new URL('../public/assets/editorial/', import.meta.url);
const phase3ImageNotes = new URL('../docs/IMAGE_PHASE3_PRODUCTION.md', import.meta.url);
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

function gitBlobSha(bytes) {
  const header = Buffer.from(`blob ${bytes.length}\0`);
  return createHash('sha1').update(header).update(bytes).digest('hex');
}

function jpegDimensions(bytes) {
  if (bytes.length < 4 || bytes[0] !== 0xff || bytes[1] !== 0xd8) return null;
  let offset = 2;
  while (offset + 8 < bytes.length) {
    if (bytes[offset] !== 0xff) {
      offset += 1;
      continue;
    }
    while (bytes[offset] === 0xff) offset += 1;
    const marker = bytes[offset++];
    if (marker === 0xd8 || marker === 0xd9 || marker === 0x01 || (marker >= 0xd0 && marker <= 0xd7)) continue;
    if (offset + 2 > bytes.length) break;
    const length = bytes.readUInt16BE(offset);
    if (length < 2 || offset + length > bytes.length) break;
    const isSof = [0xc0, 0xc1, 0xc2, 0xc3, 0xc5, 0xc6, 0xc7, 0xc9, 0xca, 0xcb, 0xcd, 0xce, 0xcf].includes(marker);
    if (isSof && length >= 7) {
      return {
        height: bytes.readUInt16BE(offset + 3),
        width: bytes.readUInt16BE(offset + 5)
      };
    }
    offset += length;
  }
  return null;
}

const provenanceRows = parseTsv(await fs.readFile(provenancePath, 'utf8'));
const shortlistRows = parseTsv(await fs.readFile(shortlistPath, 'utf8'));
const shortlistByFile = new Map(shortlistRows.map(row => [`${row.category}/${row.file}`, row]));
const productionEntries = await fs.readdir(productionRoot, { withFileTypes: true });
const productionJpegs = productionEntries.filter(entry => entry.isFile() && /\.jpe?g$/i.test(entry.name)).map(entry => entry.name).sort();
const responsiveSuffix = /-(?:640|960|1280)\.jpe?g$/i;
const productionOriginals = productionJpegs.filter(name => !responsiveSuffix.test(name));
const registeredOriginals = provenanceRows.map(row => row.production_asset).sort();
const allowedProcessing = new Set(['identity', 'metadata-stripped-recompressed']);
const imageNotes = await fs.readFile(phase3ImageNotes, 'utf8');

if (!imageNotes.includes('stripped of unnecessary metadata and recompressed conservatively')) {
  errors.push('Image production notes no longer document the approved metadata-stripping/recompression step');
}

if (new Set(registeredOriginals).size !== registeredOriginals.length) errors.push('Production provenance register contains duplicate production_asset rows');
if (JSON.stringify(productionOriginals) !== JSON.stringify(registeredOriginals)) {
  errors.push(`Production provenance coverage mismatch. Files: ${productionOriginals.join(', ')}. Register: ${registeredOriginals.join(', ')}`);
}

let unverifiedCreators = 0;
let transformedOriginals = 0;
for (const row of provenanceRows) {
  const shortlist = shortlistByFile.get(row.source_library_file);
  if (!shortlist) {
    errors.push(`${row.production_asset}: source library file is not present in SOURCES.tsv: ${row.source_library_file}`);
    continue;
  }
  if (!/^[0-9a-f]{40}$/.test(row.source_blob_sha || '')) errors.push(`${row.production_asset}: source_blob_sha must be a 40-character Git blob ID`);
  if (!/^[0-9a-f]{40}$/.test(row.production_blob_sha || '')) errors.push(`${row.production_asset}: production_blob_sha must be a 40-character Git blob ID`);
  if (!allowedProcessing.has(row.production_processing)) errors.push(`${row.production_asset}: unsupported production_processing ${row.production_processing || '<missing>'}`);
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
  const actualSourceBlob = gitBlobSha(sourceBytes);
  const actualProductionBlob = gitBlobSha(productionBytes);
  if (actualSourceBlob !== row.source_blob_sha) errors.push(`${row.production_asset}: source file fingerprint changed; expected ${row.source_blob_sha}, received ${actualSourceBlob}`);
  if (actualProductionBlob !== row.production_blob_sha) errors.push(`${row.production_asset}: production file fingerprint changed; expected ${row.production_blob_sha}, received ${actualProductionBlob}`);

  if (row.production_processing === 'identity') {
    if (row.source_blob_sha !== row.production_blob_sha || !sourceBytes.equals(productionBytes)) {
      errors.push(`${row.production_asset}: identity processing requires the production original to match the registered source bytes`);
    }
  } else if (row.production_processing === 'metadata-stripped-recompressed') {
    transformedOriginals += 1;
    if (row.source_blob_sha === row.production_blob_sha || sourceBytes.equals(productionBytes)) {
      errors.push(`${row.production_asset}: recompressed processing is registered but source and production bytes are identical`);
    }
  }

  const sourceDimensions = jpegDimensions(sourceBytes);
  const productionDimensions = jpegDimensions(productionBytes);
  if (!sourceDimensions) errors.push(`${row.production_asset}: source file is not a readable JPEG`);
  if (!productionDimensions) errors.push(`${row.production_asset}: production original is not a readable JPEG`);

  const stem = row.production_asset.replace(/\.jpe?g$/i, '');
  const escapedStem = stem.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const actualDerivatives = productionJpegs.filter(name => new RegExp(`^${escapedStem}-(?:640|960|1280)\\.jpe?g$`, 'i').test(name)).sort();
  const registeredDerivatives = row.derivative_assets ? row.derivative_assets.split(',').map(value => value.trim()).filter(Boolean).sort() : [];
  if (JSON.stringify(actualDerivatives) !== JSON.stringify(registeredDerivatives)) {
    errors.push(`${row.production_asset}: derivative list mismatch. Files: ${actualDerivatives.join(', ') || '<none>'}. Register: ${registeredDerivatives.join(', ') || '<none>'}`);
  }
  for (const derivative of actualDerivatives) {
    const expectedWidth = Number(derivative.match(/-(640|960|1280)\.jpe?g$/i)?.[1]);
    const derivativeBytes = await fs.readFile(new URL(derivative, productionRoot));
    const dimensions = jpegDimensions(derivativeBytes);
    if (!dimensions) {
      errors.push(`${row.production_asset}: derivative ${derivative} is not a readable JPEG`);
    } else if (dimensions.width !== expectedWidth) {
      errors.push(`${row.production_asset}: derivative ${derivative} is ${dimensions.width}x${dimensions.height}; filename requires width ${expectedWidth}`);
    }
  }
}

if (errors.length) {
  console.error(errors.map(error => `MEDIA PROVENANCE: ${error}`).join('\n'));
  process.exit(1);
}

console.log(`Media provenance mapping passed: ${provenanceRows.length} production editorial originals have pinned source/production fingerprints and approved processing lineage; ${transformedOriginals} originals record metadata-stripping/recompression; ${productionJpegs.length - productionOriginals.length} responsive derivatives are mapped and dimension-checked; ${unverifiedCreators} creator field(s) remain explicitly unresolved rather than inferred.`);
