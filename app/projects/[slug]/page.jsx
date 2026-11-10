import ProjectClient from './ProjectClient.jsx';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://classicaldecorid.com';

async function fetchProject(slug) {
  try {
    const res = await fetch(`${SITE_URL}/api/projects/${encodeURIComponent(slug)}`, { next: { revalidate: 300 } });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const project = await fetchProject(slug);
  if (!project) {
    return { title: 'Project Not Found | Classical Decor ID' };
  }
  const title = project.seoTitle || `${project.title} | Classical Decor ID`;
  const description = project.seoDescription || project.description?.slice(0, 160) || undefined;
  return {
    title,
    description,
    alternates: { canonical: `${SITE_URL}/projects/${project.slug}` },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/projects/${project.slug}`,
      images: project.coverImage ? [project.coverImage] : project.gallery?.slice(0, 1)
    }
  };
}

export default async function ProjectRoute({ params }) {
  const { slug } = await params;
  const project = await fetchProject(slug);

  const galleryImages = [
    project?.coverImage,
    ...(Array.isArray(project?.gallery) ? project.gallery : [])
  ].filter(Boolean);

  const gallerySchema = project && galleryImages.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'ImageGallery',
    name: project.title,
    description: project.description,
    url: `${SITE_URL}/projects/${project.slug}`,
    image: galleryImages
  } : null;

  return (
    <>
      {gallerySchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(gallerySchema) }}
        />
      )}
      <ProjectClient project={project} />
    </>
  );
}
