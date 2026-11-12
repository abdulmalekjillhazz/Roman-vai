import ProjectsClient from './ProjectsClient.jsx';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://classicaldecorid.com';

export const metadata = {
  title: 'Portfolio & Projects | Classical Decor ID',
  description: 'Verified interior surface installations, villa claddings, and commercial architectural case studies across Dubai and UAE.',
  alternates: { canonical: `${SITE_URL}/projects` },
  openGraph: {
    title: 'Portfolio & Projects | Classical Decor ID',
    description: 'Verified interior surface installations, villa claddings, and commercial architectural case studies across Dubai and UAE.',
    url: `${SITE_URL}/projects`
  }
};

async function fetchProjects() {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 2000);
  try {
    const res = await fetch(`${SITE_URL}/api/projects?published=true`, {
      next: { revalidate: 300 },
      signal: controller.signal
    });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  } finally {
    clearTimeout(timeout);
  }
}

export default async function ProjectsPage() {
  const projects = await fetchProjects();
  return <ProjectsClient projects={Array.isArray(projects) ? projects : []} />;
}
