import fs from 'fs';
import path from 'path';
import axios from 'axios';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const productsDataPath = path.join(__dirname, '../data/products_data.json');
const products = JSON.parse(fs.readFileSync(productsDataPath, 'utf8'));
const outputDir = path.join(__dirname, '../downloaded_images');

const CONCURRENCY_LIMIT = 5;

/**
 * Maps Content-Type header to proper file extension
 */
function getExtensionFromMime(contentType = '') {
  const mime = contentType.toLowerCase();
  if (mime.includes('png')) return '.png';
  if (mime.includes('webp')) return '.webp';
  if (mime.includes('gif')) return '.gif';
  if (mime.includes('svg')) return '.svg';
  return '.jpg';
}

/**
 * Checks if file already exists with any common image extension
 */
function findExistingFile(folder, baseName) {
  const exts = ['.jpg', '.png', '.webp', '.gif'];
  for (const ext of exts) {
    const fullPath = path.join(folder, `${baseName}${ext}`);
    if (fs.existsSync(fullPath) && fs.statSync(fullPath).size > 0) {
      return fullPath;
    }
  }
  return null;
}

async function downloadSingleTask(task) {
  const { category, baseName, imgUrl } = task;
  const categoryFolder = path.join(outputDir, category);
  if (!fs.existsSync(categoryFolder)) {
    fs.mkdirSync(categoryFolder, { recursive: true });
  }

  // Skip if already downloaded
  const existingPath = findExistingFile(categoryFolder, baseName);
  if (existingPath) {
    console.log(`⏭️  Skipped (Already exists): ${path.basename(existingPath)}`);
    return { status: 'skipped', localPath: existingPath };
  }

  try {
    const response = await axios({
      url: imgUrl,
      method: 'GET',
      responseType: 'stream',
      timeout: 20000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
      }
    });

    const ext = getExtensionFromMime(response.headers['content-type']);
    const fileName = `${baseName}${ext}`;
    const filePath = path.join(categoryFolder, fileName);

    const writer = fs.createWriteStream(filePath);
    response.data.pipe(writer);

    await new Promise((resolve, reject) => {
      writer.on('finish', resolve);
      writer.on('error', reject);
    });

    console.log(`✅ Saved [${ext}]: [${category}] -> ${fileName}`);
    return { status: 'downloaded', localPath: filePath };
  } catch (err) {
    console.error(`❌ Failed: ${baseName} - ${err.message}`);
    return { status: 'failed', error: err.message };
  }
}

/**
 * Runs tasks with bounded concurrency (like p-limit)
 */
async function runWithConcurrency(tasks, limit) {
  const results = [];
  const executing = new Set();

  for (const task of tasks) {
    const p = Promise.resolve().then(() => downloadSingleTask(task));
    results.push(p);
    executing.add(p);

    const clean = () => executing.delete(p);
    p.then(clean).catch(clean);

    if (executing.size >= limit) {
      await Promise.race(executing);
    }
  }
  return Promise.all(results);
}

async function downloadAll() {
  console.log(`🚀 Starting Parallel Image Downloader (Concurrency: ${CONCURRENCY_LIMIT})...`);
  const tasks = [];

  for (const product of products) {
    product.images.forEach((imgUrl, index) => {
      const baseName = `${product.id}_${product.slug}_${index + 1}`;
      tasks.push({
        productId: product.id,
        category: product.category,
        baseName,
        imgUrl
      });
    });
  }

  await runWithConcurrency(tasks, CONCURRENCY_LIMIT);
  console.log('\n🎉 Image download batch completed! Check /downloaded_images.');
}

downloadAll();
