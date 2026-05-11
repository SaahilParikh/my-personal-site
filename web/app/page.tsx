import { Hero } from '@/components/Hero';
import { ProjectsSection } from '@/components/ProjectsSection';
import { SiteFooter } from '@/components/SiteFooter';
import { getProjectsByCategory } from '@/data/projects';
import styles from './page.module.css';

const HERO_COPY = {
  eyebrow: 'Saahil Parikh',
  headline: 'Engineer building thoughtful, durable software.',
  lede: 'A small home on the internet for selected work, side projects, and things I’ve been thinking about.',
} as const;

const FOOTER_COPY = {
  ownerName: 'Saahil Parikh',
  tagline: 'Built with Next.js · hosted on AWS',
} as const;

export default function Home() {
  const sideProjects = getProjectsByCategory('projects');
  const researchProjects = getProjectsByCategory('research');

  return (
    <main className={styles.main}>
      <Hero {...HERO_COPY} />
      <ProjectsSection
        id="projects"
        title="Selected projects"
        projects={sideProjects}
      />
      <ProjectsSection
        id="research"
        title="Research"
        projects={researchProjects}
        emptyMessage="Forthcoming — research notes and longer-form work will live here."
      />
      <SiteFooter {...FOOTER_COPY} />
    </main>
  );
}
