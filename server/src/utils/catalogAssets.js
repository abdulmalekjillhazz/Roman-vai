// Never infer ownership from an arbitrary remote URL or a client-supplied public ID.
export function cloudinaryAssetFromUrl(url, cloudName = process.env.CLOUDINARY_CLOUD_NAME) {
  if (!url || !cloudName) return null;
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== 'https:' || parsed.hostname !== 'res.cloudinary.com') return null;
    const prefix = `/${cloudName}/image/upload/`;
    if (!parsed.pathname.startsWith(prefix)) return null;
    const segments = parsed.pathname.slice(prefix.length).split('/');
    const versionIndex = segments.findIndex(segment => /^v\d+$/.test(segment));
    const assetSegments = versionIndex >= 0 ? segments.slice(versionIndex + 1) : segments;
    while (assetSegments[0] && /^(?:[a-z]+_|\$)/.test(assetSegments[0]) && !assetSegments[0].startsWith('dst_deco')) {
      assetSegments.shift();
    }
    const publicId = decodeURIComponent(assetSegments.join('/')).replace(/\.[^/.]+$/, '');
    if (!publicId.startsWith('dst_deco/')) return null;
    return { public_id: publicId, secure_url: url };
  } catch {
    return null;
  }
}

export function productAssets(product, cloudName) {
  const stored = product.cloudinaryImages || [];
  return (product.images || []).flatMap(url => {
    const parsed = cloudinaryAssetFromUrl(url, cloudName);
    if (!parsed) return [];
    const metadata = stored.find(asset => asset.secure_url === url && asset.public_id === parsed.public_id);
    return [{ ...parsed, ...(metadata?.format ? { format: metadata.format } : {}) }];
  });
}

export async function cleanUnusedAssets(assets, { configured, findReferences, destroy, cloudName }) {
  const candidates = [...new Map(assets.filter(asset => {
    const parsed = cloudinaryAssetFromUrl(asset?.secure_url, cloudName);
    return parsed && parsed.public_id === asset.public_id;
  }).map(asset => [asset.public_id, asset])).values()];
  if (!candidates.length) return [];
  if (!configured) return candidates.map(asset => asset.public_id);
  let references;
  try {
    references = await findReferences();
  } catch {
    // If references cannot be checked, keep every asset intact.
    return candidates.map(asset => asset.public_id);
  }
  const sharedIds = new Set(references.flatMap(product => productAssets(product, cloudName).map(asset => asset.public_id)));
  const failures = [];
  for (const asset of candidates) {
    if (sharedIds.has(asset.public_id)) continue;
    try {
      const result = await destroy(asset.public_id, { resource_type: 'image', invalidate: true });
      if (!['ok', 'not found'].includes(result?.result)) failures.push(asset.public_id);
    } catch {
      failures.push(asset.public_id);
    }
  }
  return failures;
}

export function parseImageUrls(value) {
  if (typeof value === 'string' && value.trim().startsWith('[')) {
    try { value = JSON.parse(value); } catch { throw Object.assign(new Error('Image URLs must be a valid JSON list.'), { status: 400 }); }
  }
  // Cloudinary transformations contain commas: only newlines separate URLs.
  const items = Array.isArray(value) ? value : typeof value === 'string' ? value.split(/\r?\n/) : [];
  return [...new Set(items.map(item => String(item).trim()).filter(Boolean))].map(url => {
    if (!/^https:\/\//i.test(url) && !/^\/assets\/[a-z0-9_./-]+$/i.test(url)) {
      throw Object.assign(new Error('Use an HTTPS image URL or an existing /assets/ image path.'), { status: 400 });
    }
    return url;
  });
}

export function parseBoolean(value, fallback) {
  if (value === undefined) return fallback;
  if (value === true || value === 'true') return true;
  if (value === false || value === 'false') return false;
  throw Object.assign(new Error('Stock and featured status must be true or false.'), { status: 400 });
}
