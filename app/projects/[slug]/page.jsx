import ProjectClient from './ProjectClient.jsx';
import { notFound } from 'next/navigation';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://classicaldecorid.com';

async function fetchProject(slug) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 2500);
  try {
    const res = await fetch(`${SITE_URL}/api/projects/${encodeURIComponent(slug)}`, { next: { revalidate: 300 }, signal: controller.signal });
    if (res.status === 404) return { kind: 'not-found' };
    if (!res.ok) throw new Error(`Project request failed with status ${res.status}`);
    const data = await res.json();
    if (!data || typeof data !== 'object' || !data.title) throw new Error('Project response was invalid');
    return { kind: 'ok', project: data };
  } catch (error) {
    if (error?.name === 'AbortError') throw new Error('Project request timed out');
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  let result;
  try {
    result = await fetchProject(slug);
  } catch {
    return { title: 'Project Case Study | Classical Decor ID' };
  }
  if (result.kind !== 'ok') {
    return { title: 'Project Not Found | Classical Decor ID' };
  }
  const project = result.project;
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
  const result = await fetchProject(slug);
  if (result.kind === 'not-found') notFound();
  const project = result.project;

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
