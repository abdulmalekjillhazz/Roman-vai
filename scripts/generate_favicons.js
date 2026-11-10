import fs from 'fs';
import path from 'path';
import zlib from 'zlib';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// 1. Classical Decor ID Official "CD" SVG Icon
const svgContent = `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="cdGold" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FDE8A5"/>
      <stop offset="25%" stop-color="#E5A924"/>
      <stop offset="70%" stop-color="#C58D17"/>
      <stop offset="100%" stop-color="#F2BE42"/>
    </linearGradient>
  </defs>

  <!-- Luxury Charcoal Tile Background matching Navbar -->
  <rect width="100" height="100" rx="22" fill="#141414"/>

  <!-- Precision Gold Border -->
  <rect x="2.5" y="2.5" width="95" height="95" rx="19.5" fill="none" stroke="url(#cdGold)" stroke-width="2.2" stroke-opacity="0.75"/>

  <!-- Authentic Classical Decor "CD" Serif Monogram -->
  <text
    x="50"
    y="66"
    text-anchor="middle"
    font-family="'Cormorant Garamond', 'Georgia', 'Times New Roman', serif"
    font-size="46"
    font-weight="700"
    letter-spacing="-1"
    fill="url(#cdGold)"
  >CD</text>
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

// Function to generate RGBA PNG buffer of size x size with the "CD" monogram
function generateRasterPng(size) {
  const rowLen = 1 + size * 4;
  const rawData = Buffer.alloc(size * rowLen, 0);

  const scale = size / 100;
  const cornerRadius = 22 * scale;

  function isInsideRoundedRect(x, y, w, h, r) {
    if (x < 0 || x >= w || y < 0 || y >= h) return false;
    if (x < r && y < r) return Math.hypot(x - r, y - r) <= r;
    if (x > w - r && y < r) return Math.hypot(x - (w - r), y - r) <= r;
    if (x < r && y > h - r) return Math.hypot(x - r, y - (h - r)) <= r;
    if (x > w - r && y > h - r) return Math.hypot(x - (w - r), y - (h - r)) <= r;
    return true;
  }

  // Distance from point (px,py) to line segment (x1,y1)-(x2,y2)
  function distToSegment(px, py, x1, y1, x2, y2) {
    const l2 = (x2 - x1) ** 2 + (y2 - y1) ** 2;
    if (l2 === 0) return Math.hypot(px - x1, py - y1);
    let t = ((px - x1) * (x2 - x1) + (py - y1) * (y2 - y1)) / l2;
    t = Math.max(0, Math.min(1, t));
    return Math.hypot(px - (x1 + t * (x2 - x1)), py - (y1 + t * (y2 - y1)));
  }

  // Define geometric "C" and "D" in 100x100 space
  // 'C' center (33, 50), rx=14, ry=21
  // 'D' vertical bar at x=53 from y=29 to y=71; right arc from (53,29) to (53,71) with rx=18, ry=21
  for (let y = 0; y < size; y++) {
    const rowOffset = y * rowLen;
    rawData[rowOffset] = 0;

    const ny = y / scale; // coordinate in 100x100

    for (let x = 0; x < size; x++) {
      const pixelOffset = rowOffset + 1 + x * 4;
      const nx = x / scale;

      if (!isInsideRoundedRect(x, y, size, size, cornerRadius)) {
        rawData[pixelOffset] = 0;
        rawData[pixelOffset + 1] = 0;
        rawData[pixelOffset + 2] = 0;
        rawData[pixelOffset + 3] = 0;
        continue;
      }

      // Default background: Charcoal #141414
      let r = 20, g = 20, b = 20, a = 255;

      // Gold border
      const distToEdge = Math.min(x, y, size - 1 - x, size - 1 - y);
      if (distToEdge <= 2.2 * scale) {
        r = 229; g = 169; b = 36; a = 200;
      }

      let isGoldGlyph = false;

      // --- LETTER C ---
      // Ellipse test for C
      const cx = 33, cy = 50;
      const dxC = (nx - cx) / 14;
      const dyC = (ny - cy) / 21;
      const distC = Math.hypot(dxC, dyC);

      // C is an open arc: opening on the right side between angle -40 deg and +40 deg
      const angleC = Math.atan2(ny - cy, nx - cx); // -PI to +PI
      const isRightOpening = (angleC > -0.65 && angleC < 0.65);

      if (distC >= 0.72 && distC <= 1.25 && !isRightOpening) {
        isGoldGlyph = true;
      }
      // Top and bottom serifs for C
      if (nx >= 38 && nx <= 45 && ((ny >= 30 && ny <= 34) || (ny >= 66 && ny <= 70))) {
        isGoldGlyph = true;
      }

      // --- LETTER D ---
      // Vertical stem of D
      const distDStem = distToSegment(nx, ny, 53, 29, 53, 71);
      if (distDStem <= 3.2) {
        isGoldGlyph = true;
      }
      // Top & bottom horizontal bars + serifs of D
      if (nx >= 48 && nx <= 60 && (Math.abs(ny - 29) <= 2.2 || Math.abs(ny - 71) <= 2.2)) {
        isGoldGlyph = true;
      }
      // Curved bowl of D (right side of x=53)
      if (nx >= 53) {
        const dxD = (nx - 53) / 18;
        const dyD = (ny - 50) / 21;
        const distDBowl = Math.hypot(dxD, dyD);
        if (distDBowl >= 0.74 && distDBowl <= 1.26) {
          isGoldGlyph = true;
        }
      }

      if (isGoldGlyph) {
        const t = (x + y) / (2 * size);
        r = Math.round(250 - t * 45); // Luxury gold gradient
        g = Math.round(225 - t * 75);
        b = Math.round(150 - t * 125);
        a = 255;
      }

      rawData[pixelOffset] = r;
      rawData[pixelOffset + 1] = g;
      rawData[pixelOffset + 2] = b;
      rawData[pixelOffset + 3] = a;
    }
  }

  // PNG Compression
  const signature = Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;

  const ihdrChunk = createChunk('IHDR', ihdr);
  const compressedData = zlib.deflateSync(rawData, { level: 9 });
  const idatChunk = createChunk('IDAT', compressedData);
  const iendChunk = createChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

// Function to generate multi-res ICO from PNGs (16, 32, 48)
function createIco(pngBuffersWithSize) {
  const count = pngBuffersWithSize.length;
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(count, 4);

  const dirEntries = [];
  let currentOffset = 6 + 16 * count;

  for (const { size, buffer } of pngBuffersWithSize) {
    const entry = Buffer.alloc(16);
    entry[0] = size >= 256 ? 0 : size;
    entry[1] = size >= 256 ? 0 : size;
    entry[2] = 0;
    entry[3] = 0;
    entry.writeUInt16LE(1, 4);
    entry.writeUInt16LE(32, 6);
    entry.writeUInt32LE(buffer.length, 8);
    entry.writeUInt32LE(currentOffset, 12);
    dirEntries.push(entry);
    currentOffset += buffer.length;
  }

  const allBuffers = [header, ...dirEntries, ...pngBuffersWithSize.map(p => p.buffer)];
  return Buffer.concat(allBuffers);
}

// Execute Generation
console.log('Generating Classical Decor ID (CD) brand favicons...');

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

console.log('Classical Decor ID "CD" favicons generated successfully across client/public, public, and app!');
