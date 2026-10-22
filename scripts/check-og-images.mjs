import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import zlib from 'node:zlib';

const dist = new URL('../dist/assets/og/', import.meta.url);
const names = ['home', 'capabilities', 'research', 'labs', 'trust', 'company', 'contact', 'legal'];
const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
const hashes = new Set();
const errors = [];

function crc32(buffer) {
  let crc = 0xffffffff;
  for (const byte of buffer) {
    crc ^= byte;
    for (let bit = 0; bit < 8; bit += 1) crc = (crc >>> 1) ^ (0xedb88320 & -(crc & 1));
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function validatePng(name, png) {
  if (png.length < 45 || !png.subarray(0, 8).equals(signature)) throw new Error('invalid PNG signature');

  let offset = 8;
  let sawIhdr = false;
  let sawIdat = false;
  let sawIend = false;
  let width = 0;
  let height = 0;
  const idat = [];

  while (offset < png.length) {
    if (offset + 12 > png.length) throw new Error('truncated PNG chunk header');
    const length = png.readUInt32BE(offset);
    const type = png.subarray(offset + 4, offset + 8).toString('ascii');
    const dataStart = offset + 8;
    const dataEnd = dataStart + length;
    const crcOffset = dataEnd;
    const next = crcOffset + 4;
    if (next > png.length) throw new Error(`truncated ${type || 'unknown'} chunk`);

    const data = png.subarray(dataStart, dataEnd);
    const expectedCrc = png.readUInt32BE(crcOffset);
    const actualCrc = crc32(Buffer.concat([Buffer.from(type, 'ascii'), data]));
    if (actualCrc !== expectedCrc) throw new Error(`${type} CRC mismatch`);

    if (type === 'IHDR') {
      if (sawIhdr || offset !== 8 || length !== 13) throw new Error('invalid IHDR placement or length');
      sawIhdr = true;
      width = data.readUInt32BE(0);
      height = data.readUInt32BE(4);
      if (width !== 1200 || height !== 630) throw new Error(`expected 1200x630, got ${width}x${height}`);
      if (data[8] !== 8 || data[9] !== 2 || data[10] !== 0 || data[11] !== 0 || data[12] !== 0) {
        throw new Error('unexpected PNG encoding; expected 8-bit RGB, non-interlaced');
      }
    } else if (type === 'IDAT') {
      if (!sawIhdr || sawIend) throw new Error('IDAT appears outside image data stream');
      sawIdat = true;
      idat.push(data);
    } else if (type === 'IEND') {
      if (!sawIhdr || !sawIdat || length !== 0) throw new Error('invalid IEND');
      sawIend = true;
      offset = next;
      if (offset !== png.length) throw new Error('data found after IEND');
      break;
    }

    offset = next;
  }

  if (!sawIhdr || !sawIdat || !sawIend) throw new Error('PNG is missing IHDR, IDAT, or IEND');

  let raw;
  try {
    raw = zlib.inflateSync(Buffer.concat(idat));
  } catch (error) {
    throw new Error(`IDAT decompression failed: ${error.message}`);
  }

  const expectedRawLength = (width * 3 + 1) * height;
  if (raw.length !== expectedRawLength) throw new Error(`unexpected decompressed size ${raw.length}, expected ${expectedRawLength}`);
  const stride = width * 3 + 1;
  for (let row = 0; row < height; row += 1) {
    const filterType = raw[row * stride];
    if (filterType > 4) throw new Error(`invalid PNG filter type ${filterType} on row ${row}`);
  }

  hashes.add(crypto.createHash('sha256').update(png).digest('hex'));
}

for (const name of names) {
  try {
    const png = await fs.readFile(new URL(`./${name}.png`, dist));
    validatePng(name, png);
  } catch (error) {
    errors.push(`${name}.png: ${error.message}`);
  }
}

if (hashes.size !== names.length) errors.push(`expected ${names.length} distinct social previews, found ${hashes.size}`);

if (errors.length) {
  console.error(errors.map(error => `ERROR: ${error}`).join('\n'));
  process.exit(1);
}

console.log(`Social preview validation passed: ${names.length} distinct, decodable 1200x630 PNGs with valid chunk CRCs.`);
