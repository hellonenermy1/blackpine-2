import fs from 'node:fs/promises';
import zlib from 'node:zlib';

const WIDTH = 1200;
const HEIGHT = 630;
const BG = [7, 16, 15];
const PANEL = [14, 28, 25];
const LINE = [49, 81, 72];
const TEXT = [237, 244, 241];
const MUTED = [163, 181, 175];
const ACCENT = [98, 201, 178];
const ACCENT_LIGHT = [155, 231, 215];

const glyphs = {
  A: ['01110','10001','10001','11111','10001','10001','10001'],
  B: ['11110','10001','10001','11110','10001','10001','11110'],
  C: ['01111','10000','10000','10000','10000','10000','01111'],
  E: ['11111','10000','10000','11110','10000','10000','11111'],
  G: ['01111','10000','10000','10111','10001','10001','01111'],
  H: ['10001','10001','10001','11111','10001','10001','10001'],
  I: ['11111','00100','00100','00100','00100','00100','11111'],
  K: ['10001','10010','10100','11000','10100','10010','10001'],
  L: ['10000','10000','10000','10000','10000','10000','11111'],
  M: ['10001','11011','10101','10101','10001','10001','10001'],
  N: ['10001','11001','10101','10011','10001','10001','10001'],
  O: ['01110','10001','10001','10001','10001','10001','01110'],
  P: ['11110','10001','10001','11110','10000','10000','10000'],
  R: ['11110','10001','10001','11110','10100','10010','10001'],
  S: ['01111','10000','10000','01110','00001','00001','11110'],
  T: ['11111','00100','00100','00100','00100','00100','00100'],
  U: ['10001','10001','10001','10001','10001','10001','01110'],
  Y: ['10001','10001','01010','00100','00100','00100','00100']
};

const families = [
  ['home', 'BLACKPINE', 0],
  ['capabilities', 'CAPABILITIES', 1],
  ['research', 'RESEARCH', 2],
  ['labs', 'LABS', 3],
  ['trust', 'TRUST', 4],
  ['company', 'COMPANY', 5],
  ['contact', 'CONTACT', 6],
  ['legal', 'LEGAL', 7]
];

function crc32(buffer) {
  let crc = 0xffffffff;
  for (const byte of buffer) {
    crc ^= byte;
    for (let bit = 0; bit < 8; bit += 1) crc = (crc >>> 1) ^ (0xedb88320 & -(crc & 1));
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function chunk(type, data = Buffer.alloc(0)) {
  const typeBuffer = Buffer.from(type, 'ascii');
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length);
  const checksum = Buffer.alloc(4);
  checksum.writeUInt32BE(crc32(Buffer.concat([typeBuffer, data])));
  return Buffer.concat([length, typeBuffer, data, checksum]);
}

function makeCanvas() {
  const pixels = Buffer.alloc(WIDTH * HEIGHT * 3);
  for (let i = 0; i < pixels.length; i += 3) {
    pixels[i] = BG[0];
    pixels[i + 1] = BG[1];
    pixels[i + 2] = BG[2];
  }
  return pixels;
}

function setPixel(pixels, x, y, colour) {
  if (x < 0 || y < 0 || x >= WIDTH || y >= HEIGHT) return;
  const index = (y * WIDTH + x) * 3;
  pixels[index] = colour[0];
  pixels[index + 1] = colour[1];
  pixels[index + 2] = colour[2];
}

function rect(pixels, x, y, width, height, colour) {
  for (let row = y; row < y + height; row += 1) {
    for (let col = x; col < x + width; col += 1) setPixel(pixels, col, row, colour);
  }
}

function line(pixels, x0, y0, x1, y1, colour, thickness = 2) {
  const dx = Math.abs(x1 - x0);
  const sx = x0 < x1 ? 1 : -1;
  const dy = -Math.abs(y1 - y0);
  const sy = y0 < y1 ? 1 : -1;
  let error = dx + dy;
  let x = x0;
  let y = y0;
  while (true) {
    rect(pixels, x - Math.floor(thickness / 2), y - Math.floor(thickness / 2), thickness, thickness, colour);
    if (x === x1 && y === y1) break;
    const twice = 2 * error;
    if (twice >= dy) { error += dy; x += sx; }
    if (twice <= dx) { error += dx; y += sy; }
  }
}

function circle(pixels, cx, cy, radius, colour) {
  const r2 = radius * radius;
  for (let y = -radius; y <= radius; y += 1) {
    for (let x = -radius; x <= radius; x += 1) if ((x * x) + (y * y) <= r2) setPixel(pixels, cx + x, cy + y, colour);
  }
}

function drawText(pixels, value, x, y, scale, colour) {
  let cursor = x;
  for (const char of value.toUpperCase()) {
    if (char === ' ') { cursor += scale * 4; continue; }
    const glyph = glyphs[char];
    if (!glyph) continue;
    for (let row = 0; row < glyph.length; row += 1) {
      for (let col = 0; col < glyph[row].length; col += 1) {
        if (glyph[row][col] === '1') rect(pixels, cursor + col * scale, y + row * scale, scale, scale, colour);
      }
    }
    cursor += scale * 6;
  }
}

function encodePng(pixels) {
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(WIDTH, 0);
  ihdr.writeUInt32BE(HEIGHT, 4);
  ihdr[8] = 8;
  ihdr[9] = 2;
  const stride = WIDTH * 3;
  const raw = Buffer.alloc((stride + 1) * HEIGHT);
  for (let y = 0; y < HEIGHT; y += 1) pixels.copy(raw, y * (stride + 1) + 1, y * stride, (y + 1) * stride);
  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk('IHDR', ihdr),
    chunk('IDAT', zlib.deflateSync(raw, { level: 9 })),
    chunk('IEND')
  ]);
}

function renderFamily(label, variant) {
  const pixels = makeCanvas();
  rect(pixels, 60, 60, 1080, 2, LINE);
  rect(pixels, 60, 568, 1080, 2, LINE);
  rect(pixels, 60, 60, 2, 510, LINE);
  rect(pixels, 1138, 60, 2, 510, LINE);
  rect(pixels, 60, 60, 150 + variant * 28, 6, ACCENT);
  rect(pixels, 94, 120, 520, 300, PANEL);
  drawText(pixels, 'BLACKPINE', 104, 108, 5, ACCENT_LIGHT);
  drawText(pixels, label, 104, 210, label.length > 9 ? 8 : 10, TEXT);
  drawText(pixels, 'CANADA', 104, 486, 4, MUTED);

  const baseX = 760 + variant * 12;
  const baseY = 150 + (variant % 3) * 28;
  const points = [
    [baseX, baseY],
    [920 - variant * 7, 220 + variant * 11],
    [820 + variant * 16, 360 - variant * 9],
    [1040 - variant * 8, 430 - variant * 10]
  ];
  line(pixels, ...points[0], ...points[1], LINE, 3);
  line(pixels, ...points[1], ...points[2], LINE, 3);
  line(pixels, ...points[2], ...points[3], LINE, 3);
  line(pixels, ...points[0], ...points[2], LINE, 2);
  points.forEach((point, index) => circle(pixels, point[0], point[1], index === 0 ? 9 : 7, index % 2 ? ACCENT_LIGHT : ACCENT));
  return encodePng(pixels);
}

export async function writeOgImages(out) {
  const target = new URL('./assets/og/', out);
  await fs.rm(target, { recursive: true, force: true });
  await fs.mkdir(target, { recursive: true });
  await Promise.all(families.map(([name, label, variant]) => fs.writeFile(new URL(`./${name}.png`, target), renderFamily(label, variant))));
}
