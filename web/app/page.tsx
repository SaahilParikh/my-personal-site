import { Hero } from '@/components/Hero';
import { ProjectsSection } from '@/components/ProjectsSection';
import { SiteFooter } from '@/components/SiteFooter';
import { projects } from '@/data/projects';
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
  return (
    <main className={styles.main}>
      <Hero {...HERO_COPY} />
      <ProjectsSection id="work" title="Selected work" projects={projects} />
      <SiteFooter {...FOOTER_COPY} />
    </main>
  );
}
