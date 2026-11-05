import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { connectDB } from './config/db.js';
import { Product } from './models/Product.js';
import { User } from './models/User.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../../.env') });

async function seedDatabase() {
  const connected = await connectDB();
  if (!connected) {
    console.error('❌ Cannot seed without an active MONGO_URI.');
    process.exit(1);
  }

  const cloudinaryPath = path.join(__dirname, '../../data/products_cloudinary.json');
  const defaultPath = path.join(__dirname, '../../data/products_data.json');
  const sourcePath = fs.existsSync(cloudinaryPath) ? cloudinaryPath : defaultPath;

  console.log(`📦 Seeding products from: ${path.basename(sourcePath)}`);
  const products = JSON.parse(fs.readFileSync(sourcePath, 'utf8'));

  await Product.deleteMany({});
  await Product.insertMany(products);
  console.log(`✅ Inserted ${products.length} products into MongoDB.`);

  if (process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD) {
    await User.deleteMany({ email: process.env.ADMIN_EMAIL.toLowerCase() });
    await User.create({
      email: process.env.ADMIN_EMAIL,
      password: process.env.ADMIN_PASSWORD,
      role: 'admin'
    });
    console.log(`✅ Admin user created: ${process.env.ADMIN_EMAIL}`);
  }

  process.exit(0);
}

seedDatabase();
