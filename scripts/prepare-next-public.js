import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const source = path.join(projectRoot, 'client', 'public');
const destination = path.join(projectRoot, 'public');

if (!fs.existsSync(source)) {
  throw new Error(`Missing frontend assets directory: ${source}`);
}

fs.mkdirSync(destination, { recursive: true });
fs.cpSync(source, destination, { recursive: true, force: true });
