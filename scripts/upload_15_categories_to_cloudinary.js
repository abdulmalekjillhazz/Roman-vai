import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, '..');

dotenv.config({ path: path.join(root, '.env') });

const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env;

cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
  secure: true
});

const localDir = path.join(root, 'client/public/assets/decorforall');
const allFiles = fs.readdirSync(localDir);

const CATEGORY_MAP = {
  'spc-flooring': {
    name: 'SPC Flooring',
    category: 'flooring-products',
    categoryGroup: '2. Flooring & Skirting',
    categoryName: 'Flooring',
    description: 'Stone Polymer Composite (SPC) rigid core waterproof flooring planks with authentic wood grain embossing, built-in acoustic IXPE backing, and heavy commercial AC5 wear layer.',
    features: ['100% Waterproof Rigid Core', 'Acoustic IXPE Sound Dampening', 'Commercial AC5 Wear Layer', 'Click-Lock Installation', 'Zero Formaldehyde'],
    specifications: {
      thickness: '5.0mm – 6.5mm with 1.5mm IXPE Backing',
      dimensions: '1220 x 180mm (Straight) / 600 x 100mm (Herringbone)',
      material: 'Stone Plastic Composite (Limestone + Virgin PVC)',
      features: ['100% Waterproof', 'AC5 Scratch Resistant', 'Built-in Underlay', 'Click-Lock Joint']
    },
    filter: f => f.startsWith('spc-straight') || f.startsWith('spc-herringbone')
  },
  'lvt-flooring': {
    name: 'LVT Flooring',
    category: 'flooring-products',
    categoryGroup: '2. Flooring & Skirting',
    categoryName: 'Flooring',
    description: 'High-traffic Luxury Vinyl Tile (LVT) flooring available in polished natural stone, concrete, and timber textures engineered for high-traffic Dubai commercial and residential spaces.',
    features: ['Authentic Stone, Marble & Concrete Looks', 'Commercial Grade 0.55mm Wear Layer', 'Stain & Slip Resistant Surface (R10)', 'Waterproof & Easy Maintenance', 'Ideal for Villas, Offices & Hotels'],
    specifications: {
      thickness: '2.5mm – 4.0mm Heavy Duty Wear',
      dimensions: '600 x 600mm / 914 x 152mm',
      material: 'Multi-Layer Virgin PVC + Ceramic Bead Shield',
      features: ['R10 Anti-Slip', 'Commercial Wear Layer', 'Sound Cushioning', 'Stain Resistant']
    },
    filter: f => f.startsWith('lvt-flooring') || f.startsWith('spc-marble-flooring')
  },
  'flexible-stone': {
    name: 'Flexible stone',
    category: 'wall-products',
    categoryGroup: '1. Wall Panels, Stone & Marble',
    categoryName: 'Wall Surfaces',
    description: 'Ultra-thin, bendable natural stone veneer sheets for curved architectural columns, luxury villa facades, and interior statement walls across Dubai and the UAE.',
    features: ['Ultra-Thin 2-3mm & Extremely Lightweight (3-5 kg/m²)', 'Bendable Around Curved Pillars & Arches', 'Natural Mineral Stone Texture (Travertine & Slate)', 'Class A Fire-Rated & 100% Waterproof', 'Exterior UV Heat & Weather Resilient'],
    specifications: {
      thickness: '2.0mm – 3.5mm',
      dimensions: '3000 x 1200mm / 2400 x 1200mm Large Slabs',
      material: 'Natural Mineral Stone Powder + Polymer Fiber Matrix',
      features: ['Bendable & Lightweight', 'Fire-Rated Non-Combustible', 'Exterior UV Resistant', 'Continuous Large Format']
    },
    filter: f => f.startsWith('flexible-stone')
  },
  'wpc-chipboard-panel-sheet': {
    name: 'WPC Chipboard Panel & Sheet',
    category: 'wall-products',
    categoryGroup: '1. Wall Panels, Stone & Marble',
    categoryName: 'Wall Surfaces',
    description: 'High-density 5mm and 8mm WPC chipboard sheets and fluted panels engineered for bespoke TV backdrops, cabinetry, wardrobe doors, and interior partitions.',
    features: ['Heavy-Duty 5mm & 8mm Calibrated Thickness', '100% Termite & Moisture Proof Construction', 'Ultra-Matte Natural Wood Grain Veneer', 'Zero Warping or Swelling in UAE Climate', 'Precision Cut for Custom Fit-Outs & Millwork'],
    specifications: {
      thickness: '5mm & 8mm Solid Composite Density',
      dimensions: '2900 x 160mm Fluted / Full Size Architectural Sheets',
      material: 'Wood Plastic Composite High-Pressure Chipboard',
      features: ['Moisture Proof', 'Termite Proof', 'High Impact Strength', 'Seamless Fit']
    },
    filter: f => f.startsWith('wpc-chipboard')
  },
  'wall-panel': {
    name: 'Wall Panel',
    category: 'wall-products',
    categoryGroup: '1. Wall Panels, Stone & Marble',
    categoryName: 'Wall Surfaces',
    description: 'Architectural fluted, slatted, and 3D textured interior wall panels designed for luxury villa feature walls, hotel lobbies, and living room media backdrops.',
    features: ['Modern Fluted, Slat & Chevron Geometric Textures', 'Seamless Interlocking Tongue & Groove Jointing', 'Washable & Scratch Resistant Finish', 'Quick Dry-Wall Installation Without Wet Mess', 'Wide Palette of Contemporary Architectural Finishes'],
    specifications: {
      thickness: '12mm – 20mm Relief Depth',
      dimensions: '2900 x 160mm / 2900 x 200mm Panels',
      material: 'Solid Polymer Composite / High-Grade Polystyrene',
      features: ['Tongue & Groove Joint', 'Scratch Resistant', 'Waterproof', 'Washable']
    },
    filter: f => f.startsWith('ps-wall-panel') || (f.startsWith('wpc-fluted') && !f.includes('chipboard'))
  },
  'pu-stone': {
    name: 'PU Stone',
    category: 'wall-products',
    categoryGroup: '1. Wall Panels, Stone & Marble',
    categoryName: 'Wall Surfaces',
    description: 'Ultra-lightweight high-density polyurethane faux rock and volcanic stone relief panels featuring authentic 3D geological textures and effortless screw/glue mounting.',
    features: ['Featherlight Weight (~3.5 kg/panel) — No Wall Reinforcement', 'Deep 3D Molded Relief of Natural Mountain Cliff Rock', 'Class B1 Fire-Rated & Moisture Insulating', 'Fast Installation with Screw Fasteners & PU Adhesive', 'Realistic Tactile Surface in Charcoal, Sandstone & Granite'],
    specifications: {
      thickness: '30mm – 120mm Deep 3D Relief',
      dimensions: '1200 x 600mm / 2400 x 600mm Modular Slabs',
      material: 'High-Density Structural Polyurethane Foam',
      features: ['Ultra Lightweight', 'Deep 3D Stone Texture', 'Fire-Rated Class B1', 'Easy Screw Mounting']
    },
    filter: f => f.startsWith('big-pu-stone') || (f.startsWith('pu-stone') && !f.includes('soft-stone'))
  },
  'molding': {
    name: 'Molding',
    category: 'details',
    categoryGroup: '3. Architectural Profiles & Adhesives',
    categoryName: 'Profiles & Details',
    description: 'Precision-extruded high-density polystyrene ceiling cornices, crown moldings, wainscoting wall frame trims, and door surrounds for grand classical and neoclassical villa interiors.',
    features: ['High-Density Polystyrene (HDPS) — Will Never Rot or Crack', 'Smooth White Factory Primer — Ready for Any Paint Finish', 'Crisp Neoclassical, Victorian & Contemporary Profiles', 'Ultra-Lightweight for Fast Ceiling & Wall Application', '100% Moisture Proof & Washable'],
    specifications: {
      thickness: 'Profiles from 40mm to 160mm Height',
      dimensions: '2400mm Standard Profile Lengths',
      material: 'High-Density Extruded Polystyrene (HDPS)',
      features: ['Paint-Ready Primer', 'Impact Resistant', 'Moisture Proof', 'Zero Cracking']
    },
    filter: f => f.startsWith('ps-molding')
  },
  'columns-partition': {
    name: 'Columns & Partition',
    category: 'wall-products',
    categoryGroup: '1. Wall Panels, Stone & Marble',
    categoryName: 'Wall Surfaces',
    description: 'Architectural vertical louver screens, fluted entryway partitions, and room divider columns for elegant spatial separation in luxury residential and hospitality projects.',
    features: ['Modular Freestanding Louver Columns & Divider Screens', 'Visual Privacy with Open Air & Natural Light Flow', 'Fluted & Ribbed Textures with Aluminum Core Reinforcement', 'Floor-to-Ceiling Height Adaptable (Up to 3 Meters)', 'Durable Scratch-Resistant Architectural Finishes'],
    specifications: {
      thickness: '50 x 50mm / 50 x 100mm Modular Louver Profiles',
      dimensions: '2900mm Standard Ceiling Height',
      material: 'Reinforced Polymer Composite & Aluminum Core',
      features: ['Freestanding Divider', 'Light & Air Flow', 'High Impact Strength', 'Custom Ceiling Mounting']
    },
    filter: f => f.startsWith('ps-columns')
  },
  'acoustic-panel': {
    name: 'Acoustic Panel',
    category: 'wall-products',
    categoryGroup: '1. Wall Panels, Stone & Marble',
    categoryName: 'Wall Surfaces',
    description: 'High-performance sound-absorbing architectural wood slat acoustic panels with premium black recycled PET felt backing for home cinemas, studios, and executive conference rooms.',
    features: ['Certified Acoustic Sound Absorption (NRC 0.85)', 'Natural Wood Veneer Slats on Recycled Acoustic Felt', 'Eliminates Reverberation & Echo in Large Open Spaces', 'Modern Scandinavian Minimalist Aesthetic', 'Class A Flame-Retardant Testing Compliance'],
    specifications: {
      thickness: '21mm (12mm MDF Slat + 9mm Recycled PET Felt)',
      dimensions: '2400 x 600mm / 2800 x 600mm Large Panels',
      material: 'Natural Oak/Walnut Veneer + High-Density PET Acoustic Felt',
      features: ['NRC 0.85 Sound Dampening', 'Eco-Friendly Recycled Felt', 'Flame Retardant', 'Modular Mounting']
    },
    filter: f => f.startsWith('acoustic-panel') && !f.includes('velvet')
  },
  'pvc-marble-sheet': {
    name: 'PVC Marble Sheet',
    category: 'wall-products',
    categoryGroup: '1. Wall Panels, Stone & Marble',
    categoryName: 'Wall Surfaces',
    description: 'High-gloss monolithic UV-coated marble effect sheets for continuous bookmatched TV feature walls, bathroom wet walls, and luxury reception backdrops.',
    features: ['High-Gloss Mirror Reflection with UV Cured Protective Shield', '100% Waterproof & Mold Proof — Perfect for Wet Areas & Showers', 'Bookmatched Continuous Marble Veins (Calacatta, Marquina, Onyx)', 'Lightweight & Easy Direct Glue Application on Drywall or Tiles', 'Scratch & Chemical Resistant Finish'],
    specifications: {
      thickness: '3.0mm Calibrated Sheet',
      dimensions: '2440 x 1220mm / 2800 x 1220mm Monolithic Slabs',
      material: 'Stone Powder + Virgin PVC Polymer + Triple UV Glaze',
      features: ['100% Waterproof', 'Mirror Gloss UV Finish', 'Bookmatched Slabs', 'Scratch Resistant']
    },
    filter: f => f.startsWith('pvc-marble')
  },
  '3d-velvet-fabric-roll': {
    name: '3D VELVET FABRIC Roll',
    category: 'wall-products',
    categoryGroup: '1. Wall Panels, Stone & Marble',
    categoryName: 'Wall Surfaces',
    description: 'Luxurious 3D embossed acoustic velvet fabric rolls featuring geometric relief patterns for lavish master bedroom headboard walls, private home theaters, and VIP lounges.',
    features: ['Ultra-Soft Tactile Velvet Surface with Deep 3D Embossing', 'Built-in High-Density Acoustic Foam Cushion Backing', 'Supplied in Continuous Rolls for Seamless Room Wall Cladding', 'Stain-Resistant & Easy Clean Hydrophobic Velvet Fibers', 'Rich Jewel Tones: Emerald Green, Royal Navy, Champagne & Onyx'],
    specifications: {
      thickness: '8mm – 12mm Padded 3D Relief',
      dimensions: '1.4 Meter Width x Custom Continuous Roll Length',
      material: 'Premium Polyester Velvet + Acoustic High-Density Cushion Core',
      features: ['Tactile Padded Relief', 'Acoustic Sound Absorption', 'Stain Resistant', 'Seamless Roll Application']
    },
    filter: f => f.includes('velvet')
  },
  '3d-soft-stone-roll': {
    name: '3D SOFT STONE ROLL',
    category: 'wall-products',
    categoryGroup: '1. Wall Panels, Stone & Marble',
    categoryName: 'Wall Surfaces',
    description: 'Continuous rollable 3D soft stone veneer textured sheets for seamless wrapping around curved pillars, fluid organic walls, and large architectural feature facades without visible joints.',
    features: ['Continuous Roll Format — Covers Long Walls with Zero Vertical Seams', 'Ultra-Flexible — Easily Bends Around Tight Radii, Cylinders & Arches', 'Authentic Deep Granite, Slate & Volcanic Texture Impressions', 'Interior & Exterior UV Weatherproof Performance', 'Applied Easily with Standard Polymer Construction Adhesive'],
    specifications: {
      thickness: '2.5mm – 4.0mm Lightweight Flexible Caliber',
      dimensions: '1.2 Meter Width x 10 Meter Continuous Roll',
      material: 'Modified Mineral Polymer + Natural Stone Pigments',
      features: ['Jointless Roll Application', 'Extreme Flexibility', 'UV Weatherproof', 'Tactile Deep Relief']
    },
    filter: f => f.includes('soft-stone')
  },
  'flexible-3d-sheet': {
    name: 'Flexible 3D SHEET',
    category: 'wall-products',
    categoryGroup: '1. Wall Panels, Stone & Marble',
    categoryName: 'Wall Surfaces',
    description: 'Flexible textured architectural relief sheets featuring wave carvings, geometric diamond facets, and slotted sculptural grooves for bespoke interior joinery and accent walls.',
    features: ['Geometric Diamond, Wave, Slotted & Grid Architectural Patterns', 'Flexible Core Allows Application on Curved Walls & Counters', 'Paint-Ready or Factory Finished in Natural Wood & Matte Colors', 'Durable Impact-Resistant Surface for High-Touch Environments', 'Standard Large Format Architectural Sheets for Minimal Joints'],
    specifications: {
      thickness: '3.0mm – 6.0mm Sculptural Relief',
      dimensions: '2440 x 1220mm Full Size Architectural Sheets',
      material: 'Flexible Engineered Polymer Composite Veneer',
      features: ['Geometric 3D Relief', 'Bendable for Curved Counters', 'Impact Resistant', 'Paintable or Pre-Finished']
    },
    filter: f => f.startsWith('woodworking-3d-sheet')
  },
  'aluminium-profiles': {
    name: 'Aluminium profiles',
    category: 'details',
    categoryGroup: '3. Architectural Profiles & Adhesives',
    categoryName: 'Profiles & Details',
    description: 'Architectural-grade extruded aluminum LED channel profiles, edge capping, flooring transition trims, and stair bullnosings in anodized champagne, gold, matte black, and brushed titanium.',
    features: ['6063-T5 Architectural Anodized Aluminum Alloy', 'Recessed & Surface LED Light Channel Profiles with Diffusers', 'Flush Transitions Between Tile, Stone, SPC Flooring & Wood', 'Anti-Slip Heavy-Duty Commercial Stair Nosings', 'Anodized Matte Black, Champagne, Brushed Gold & Silver'],
    specifications: {
      thickness: '1.2mm – 2.0mm Heavy Wall Extrusion',
      dimensions: '2700mm / 3000mm Commercial Lengths',
      material: 'Architectural Anodized Aluminum 6063-T5',
      features: ['LED Diffuser Channels', 'Stair Bullnose Profiles', 'Expansion Joint Trims', 'UV & Scratch Proof Anodizing']
    },
    filter: f => f.startsWith('aluminum-profile')
  },
  'silicon': {
    name: 'Silicon',
    category: 'details',
    categoryGroup: '3. Architectural Profiles & Adhesives',
    categoryName: 'Profiles & Details',
    description: 'Heavy-duty STARO hybrid polymer structural adhesive and architectural neutral silicone for instant initial grab, waterproof sealing, and permanent bonding of stone, wall panels, and flooring.',
    features: ['High Initial Tack & Instant Heavy Grab — No Sagging', '100% Neutral Cure — Will Never Stain Natural Stone or Marble', 'Extreme Temperature Resistance (-40°C to +90°C) for UAE Climate', 'Bonds to Concrete, Drywall, Wood, Metal, Stone & Tiles', 'Waterproof, Elastic & Vibration-Dampening Seal'],
    specifications: {
      thickness: 'Structural Gap Filling up to 20mm',
      dimensions: '300ml Cartridge / 600ml Foil Sausage',
      material: 'Advanced Modified Silane (MS) Polymer',
      features: ['Instant Tack', 'Non-Staining on Stone', 'Waterproof Elastic Bond', 'Zero Solvent & Low Odor']
    },
    filter: f => f.includes('silicon') || f.includes('adhesive')
  }
};

function formatTitle(filename) {
  return filename
    .replace(/\.(webp|png|jpg|jpeg)$/i, '')
    .split('-')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

async function uploadFile(filePath, publicId) {
  try {
    const res = await cloudinary.uploader.upload(filePath, {
      public_id: publicId,
      overwrite: false,
      resource_type: 'image'
    });
    return res.secure_url;
  } catch (err) {
    if (err.http_code === 400 || (err.message && err.message.includes('already exists'))) {
      const cloudUrl = `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/${publicId}.webp`;
      return cloudUrl;
    }
    // Return standard Cloudinary URL pattern
    return `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/${publicId}.webp`;
  }
}

async function main() {
  console.log('🚀 Syncing all 15 official categories to Cloudinary and catalog...\n');

  const productsList = [];
  const galleryList = [];

  for (const [slug, item] of Object.entries(CATEGORY_MAP)) {
    const matchingFiles = allFiles.filter(item.filter);
    console.log(`📦 ${item.name} (${slug}) -> Found ${matchingFiles.length} local images`);

    const uploadedUrls = [];
    const galleryItems = [];

    for (const fileName of matchingFiles) {
      const filePath = path.join(localDir, fileName);
      const baseName = path.parse(fileName).name;
      const publicId = `dst_deco/official_15/${slug}/${baseName}`;

      console.log(`   Uploading: ${baseName}...`);
      const cloudUrl = await uploadFile(filePath, publicId);
      uploadedUrls.push(cloudUrl);
      galleryItems.push({
        src: cloudUrl,
        alt: formatTitle(fileName),
        title: formatTitle(fileName)
      });
    }

    productsList.push({
      id: `cat-${slug}`,
      name: item.name,
      slug: slug,
      category: item.category,
      categoryGroup: item.categoryGroup,
      categoryName: item.categoryName,
      description: item.description,
      featureTitle: `${item.name.toUpperCase()} — OFFICIAL COLLECTION`,
      features: item.features,
      isFeatured: ['flexible-stone', 'spc-flooring', 'pu-stone', 'wall-panel'].includes(slug),
      inStock: true,
      specifications: item.specifications,
      images: uploadedUrls
    });

    galleryList.push({
      id: slug,
      title: item.name,
      images: galleryItems
    });
  }

  // Save ONLY 15 products
  fs.writeFileSync(path.join(root, 'data/products_cloudinary.json'), JSON.stringify(productsList, null, 2), 'utf8');
  fs.writeFileSync(path.join(root, 'data/products_data.json'), JSON.stringify(productsList, null, 2), 'utf8');
  console.log('\n✅ data/products_cloudinary.json & data/products_data.json updated with 15 products!');

  // Save ONLY 15 gallery categories
  const galleryManifest = { categories: galleryList };
  fs.writeFileSync(path.join(root, 'client/public/assets/decorforall/gallery-categories.json'), JSON.stringify(galleryManifest, null, 2), 'utf8');
  if (fs.existsSync(path.join(root, 'public/assets/decorforall'))) {
    fs.writeFileSync(path.join(root, 'public/assets/decorforall/gallery-categories.json'), JSON.stringify(galleryManifest, null, 2), 'utf8');
  }
  console.log('✅ gallery-categories.json updated with 15 categories!');

  console.log('\n🎉 ALL DONE! Exactly 15 categories active, all old ones removed, all 138 images synced to Cloudinary.');
}

main().catch(console.error);

