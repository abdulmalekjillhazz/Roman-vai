import CategoryClient from './CategoryClient.jsx';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://classicaldecorid.com';

async function fetchCategories() {
  try {
    const res = await fetch(`${SITE_URL}/api/categories`, { next: { revalidate: 300 } });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }) {
  const { categorySlug } = await params;
  const categories = await fetchCategories();
  const category = Array.isArray(categories) ? categories.find(c => c.slug === categorySlug) : null;
  if (!category) {
    return { title: 'Category Not Found | Classical Decor ID' };
  }
  const title = category.seoTitle || `${category.name} | Classical Decor ID`;
  const description = category.seoDescription || category.description || undefined;
  return {
    title,
    description,
    alternates: { canonical: `${SITE_URL}/category/${category.slug}` },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/category/${category.slug}`
    }
  };
}

export default async function CategoryRoute({ params }) {
  const { categorySlug } = await params;
  return <CategoryClient categorySlug={categorySlug} />;
}
