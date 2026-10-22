import fs from 'node:fs/promises';
import zlib from 'node:zlib';

const WIDTH = 1200;
const HEIGHT = 630;
const BG = [7, 16, 15];
const PANEL = [14, 28, 25];
const LINE = [49, 81, 72];
const ACCENT = [98, 201, 178];
const ACCENT_LIGHT = [155, 231, 215];
const FAMILIES = ['home', 'capabilities', 'research', 'labs', 'trust', 'company', 'contact', 'legal'];

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
  const radiusSquared = radius * radius;
  for (let y = -radius; y <= radius; y += 1) {
    for (let x = -radius; x <= radius; x += 1) {
      if ((x * x) + (y * y) <= radiusSquared) setPixel(pixels, cx + x, cy + y, colour);
    }
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
  for (let y = 0; y < HEIGHT; y += 1) {
    pixels.copy(raw, y * (stride + 1) + 1, y * stride, (y + 1) * stride);
  }

  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk('IHDR', ihdr),
    chunk('IDAT', zlib.deflateSync(raw, { level: 9 })),
    chunk('IEND')
  ]);
}

function renderFamily(variant) {
  const pixels = makeCanvas();
  rect(pixels, 60, 60, 1080, 2, LINE);
  rect(pixels, 60, 568, 1080, 2, LINE);
  rect(pixels, 60, 60, 2, 510, LINE);
  rect(pixels, 1138, 60, 2, 510, LINE);
  rect(pixels, 60, 60, 180 + variant * 55, 7, ACCENT);
  rect(pixels, 95, 120, 500, 320, PANEL);

  for (let i = 0; i < 5; i += 1) {
    rect(pixels, 110, 150 + i * 48, 320 - i * 25 + variant * 6, 7, i % 2 ? ACCENT_LIGHT : ACCENT);
  }

  const points = [
    [740 + variant * 12, 150 + variant * 7],
    [900 - variant * 6, 230 + variant * 9],
    [820 + variant * 15, 370 - variant * 8],
    [1040 - variant * 10, 445 - variant * 6]
  ];

  line(pixels, ...points[0], ...points[1], LINE, 3);
  line(pixels, ...points[1], ...points[2], LINE, 3);
  line(pixels, ...points[2], ...points[3], LINE, 3);
  line(pixels, ...points[0], ...points[2], LINE, 2);
  points.forEach((point, index) => circle(pixels, point[0], point[1], index === 0 ? 10 : 7, index % 2 ? ACCENT_LIGHT : ACCENT));

  return encodePng(pixels);
}

export async function writeOgImages(out) {
  const target = new URL('./assets/og/', out);
  await fs.rm(target, { recursive: true, force: true });
  await fs.mkdir(target, { recursive: true });
  await Promise.all(FAMILIES.map((name, index) => fs.writeFile(new URL(`./${name}.png`, target), renderFamily(index))));
}
