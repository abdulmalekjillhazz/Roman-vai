import fs from 'fs';
import path from 'path';
import zlib from 'zlib';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// 1. High-Precision Luxury SVG Icon
const svgContent = `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="dstGold" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FDE8A5"/>
      <stop offset="25%" stop-color="#E5A924"/>
      <stop offset="70%" stop-color="#C58D17"/>
      <stop offset="100%" stop-color="#F2BE42"/>
    </linearGradient>
    <filter id="subtleGlow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="1.5" stdDeviation="1" flood-color="#000000" flood-opacity="0.5"/>
    </filter>
  </defs>

  <!-- Luxury Charcoal Tile Background -->
  <rect width="100" height="100" rx="22" fill="#141414"/>

  <!-- Subtle Gold Border -->
  <rect x="2" y="2" width="96" height="96" rx="20" fill="none" stroke="url(#dstGold)" stroke-width="1.8" stroke-opacity="0.45"/>

  <!-- Brand House Monogram with Precision Symmetry -->
  <g filter="url(#subtleGlow)">
    <!-- Outer Architectural Gabled Roof & Walls -->
    <path
      d="M50 12L90 44V88H10V44L50 12Z"
      stroke="url(#dstGold)"
      stroke-width="7"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <!-- Inner Structural Core -->
    <path
      d="M50 27L76 48V79H24V48L50 27Z"
      stroke="url(#dstGold)"
      stroke-width="4.8"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <!-- Central Pillar -->
    <line
      x1="50"
      y1="36"
      x2="50"
      y2="79"
      stroke="url(#dstGold)"
      stroke-width="5"
      stroke-linecap="round"
    />
  </g>
</svg>
`;

// CRC32 table & helper
const crcTable = new Uint32Array(256);
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) {
    c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
  }
  crcTable[n] = c;
}

function crc32(buf) {
  let crc = 0xFFFFFFFF;
  for (let i = 0; i < buf.length; i++) {
    crc = crcTable[(crc ^ buf[i]) & 0xFF] ^ (crc >>> 8);
  }
  return (crc ^ 0xFFFFFFFF) >>> 0;
}

function createChunk(type, data) {
  const typeBuf = Buffer.from(type, 'ascii');
  const len = data.length;
  const chunk = Buffer.alloc(12 + len);
  chunk.writeUInt32BE(len, 0);
  typeBuf.copy(chunk, 4);
  data.copy(chunk, 8);
  const toCrc = Buffer.concat([typeBuf, data]);
  chunk.writeUInt32BE(crc32(toCrc), 8 + len);
  return chunk;
}

// Function to generate RGBA PNG buffer of size x size
function generateRasterPng(size) {
  // Allocate raw RGBA scanlines: height rows, each: filter byte (0) + width * 4 bytes
  const rowLen = 1 + size * 4;
  const rawData = Buffer.alloc(size * rowLen, 0);

  // Math coordinates scaled to size
  const scale = size / 100;
  const cornerRadius = 22 * scale;

  function isInsideRoundedRect(x, y, w, h, r) {
    if (x < 0 || x >= w || y < 0 || y >= h) return false;
    if (x < r && y < r) {
      return Math.hypot(x - r, y - r) <= r;
    }
    if (x > w - r && y < r) {
      return Math.hypot(x - (w - r), y - r) <= r;
    }
    if (x < r && y > h - r) {
      return Math.hypot(x - r, y - (h - r)) <= r;
    }
    if (x > w - r && y > h - r) {
      return Math.hypot(x - (w - r), y - (h - r)) <= r;
    }
    return true;
  }

  // Distance from point to line segment
  function distToSegment(px, py, x1, y1, x2, y2) {
    const l2 = (x2 - x1) ** 2 + (y2 - y1) ** 2;
    if (l2 === 0) return Math.hypot(px - x1, py - y1);
    let t = ((px - x1) * (x2 - x1) + (py - y1) * (y2 - y1)) / l2;
    t = Math.max(0, Math.min(1, t));
    return Math.hypot(px - (x1 + t * (x2 - x1)), py - (y1 + t * (y2 - y1)));
  }

  // Polygon segments for outer roof: (50,12) -> (90,44) -> (90,88) -> (10,88) -> (10,44) -> (50,12)
  const outerSegments = [
    [50, 12, 90, 44],
    [90, 44, 90, 88],
    [90, 88, 10, 88],
    [10, 88, 10, 44],
    [10, 44, 50, 12]
  ].map(s => s.map(v => v * scale));

  // Inner segments: (50,27) -> (76,48) -> (76,79) -> (24,79) -> (24,48) -> (50,27)
  const innerSegments = [
    [50, 27, 76, 48],
    [76, 48, 76, 79],
    [76, 79, 24, 79],
    [24, 79, 24, 48],
    [24, 48, 50, 27]
  ].map(s => s.map(v => v * scale));

  // Central pillar: (50,36) to (50,79)
  const pillar = [50 * scale, 36 * scale, 50 * scale, 79 * scale];

  const outerStroke = 7 * scale;
  const innerStroke = 4.8 * scale;
  const pillarStroke = 5 * scale;

  for (let y = 0; y < size; y++) {
    const rowOffset = y * rowLen;
    rawData[rowOffset] = 0; // Filter: None

    for (let x = 0; x < size; x++) {
      const pixelOffset = rowOffset + 1 + x * 4;

      if (!isInsideRoundedRect(x, y, size, size, cornerRadius)) {
        // Transparent
        rawData[pixelOffset] = 0;
        rawData[pixelOffset + 1] = 0;
        rawData[pixelOffset + 2] = 0;
        rawData[pixelOffset + 3] = 0;
        continue;
      }

      // Default background: Charcoal #141414
      let r = 20, g = 20, b = 20, a = 255;

      // Subtle gold border
      const distToEdge = Math.min(x, y, size - 1 - x, size - 1 - y);
      if (distToEdge <= 1.8 * scale) {
        r = 229; g = 169; b = 36; a = 120;
      }

      // Check distance to outer segments
      let dOuter = Infinity;
      for (const seg of outerSegments) {
        const d = distToSegment(x, y, seg[0], seg[1], seg[2], seg[3]);
        if (d < dOuter) dOuter = d;
      }

      // Check distance to inner segments
      let dInner = Infinity;
      for (const seg of innerSegments) {
        const d = distToSegment(x, y, seg[0], seg[1], seg[2], seg[3]);
        if (d < dInner) dInner = d;
      }

      // Check distance to pillar
      const dPillar = distToSegment(x, y, pillar[0], pillar[1], pillar[2], pillar[3]);

      let isMonogram = false;
      let alpha = 0;

      if (dOuter <= outerStroke / 2) {
        isMonogram = true;
        alpha = Math.max(alpha, 1 - Math.max(0, dOuter - (outerStroke / 2 - 1)));
      }
      if (dInner <= innerStroke / 2) {
        isMonogram = true;
        alpha = Math.max(alpha, 1 - Math.max(0, dInner - (innerStroke / 2 - 1)));
      }
      if (dPillar <= pillarStroke / 2) {
        isMonogram = true;
        alpha = Math.max(alpha, 1 - Math.max(0, dPillar - (pillarStroke / 2 - 1)));
      }

      if (isMonogram) {
        // Gold gradient simulation from top-left (#FCE5A4) to center (#E5A924) to bottom (#C58D17)
        const t = (x + y) / (2 * size);
        const goldR = Math.round(250 - t * 45); // 250 -> 205
        const goldG = Math.round(225 - t * 75); // 225 -> 150
        const goldB = Math.round(150 - t * 125); // 150 -> 25

        r = goldR;
        g = goldG;
        b = goldB;
        a = 255;
      }

      rawData[pixelOffset] = r;
      rawData[pixelOffset + 1] = g;
      rawData[pixelOffset + 2] = b;
      rawData[pixelOffset + 3] = a;
    }
  }

  // Build PNG chunks
  const signature = Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]);

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8; // 8-bit depth
  ihdr[9] = 6; // Color type: RGBA
  ihdr[10] = 0; // Deflate
  ihdr[11] = 0; // Filter
  ihdr[12] = 0; // Interlace
  const ihdrChunk = createChunk('IHDR', ihdr);

  const compressedData = zlib.deflateSync(rawData, { level: 9 });
  const idatChunk = createChunk('IDAT', compressedData);

  const iendChunk = createChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

// Function to generate multi-res ICO from PNGs (e.g. 16, 32, 48)
function createIco(pngBuffersWithSize) {
  const count = pngBuffersWithSize.length;
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // Reserved
  header.writeUInt16LE(1, 2); // 1 = ICO
  header.writeUInt16LE(count, 4);

  const dirEntries = [];
  let currentOffset = 6 + 16 * count;

  for (const { size, buffer } of pngBuffersWithSize) {
    const entry = Buffer.alloc(16);
    entry[0] = size >= 256 ? 0 : size; // Width
    entry[1] = size >= 256 ? 0 : size; // Height
    entry[2] = 0; // Color count
    entry[3] = 0; // Reserved
    entry.writeUInt16LE(1, 4); // Color planes
    entry.writeUInt16LE(32, 6); // Bits per pixel
    entry.writeUInt32LE(buffer.length, 8); // Image data size
    entry.writeUInt32LE(currentOffset, 12); // Offset
    dirEntries.push(entry);
    currentOffset += buffer.length;
  }

  const allBuffers = [header, ...dirEntries, ...pngBuffersWithSize.map(p => p.buffer)];
  return Buffer.concat(allBuffers);
}

// Execute Generation
console.log('Generating brand favicons...');

const png16 = generateRasterPng(16);
const png32 = generateRasterPng(32);
const png48 = generateRasterPng(48);
const png180 = generateRasterPng(180);
const png192 = generateRasterPng(192);
const png512 = generateRasterPng(512);

const icoBuffer = createIco([
  { size: 16, buffer: png16 },
  { size: 32, buffer: png32 },
  { size: 48, buffer: png48 }
]);

const targets = [
  { dir: path.join(rootDir, 'client', 'public'), hasIco: true },
  { dir: path.join(rootDir, 'public'), hasIco: true },
  { dir: path.join(rootDir, 'app'), hasIco: true }
];

for (const { dir, hasIco } of targets) {
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'icon.svg'), svgContent, 'utf8');
  fs.writeFileSync(path.join(dir, 'apple-touch-icon.png'), png180);
  fs.writeFileSync(path.join(dir, 'apple-icon.png'), png180);
  fs.writeFileSync(path.join(dir, 'icon-192.png'), png192);
  fs.writeFileSync(path.join(dir, 'icon-512.png'), png512);
  if (hasIco) {
    fs.writeFileSync(path.join(dir, 'favicon.ico'), icoBuffer);
  }
}

console.log('Favicons generated successfully across client/public, public, and app!');
