import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ExternalLink } from '@/components/ExternalLink';
import { SiteFooter } from '@/components/SiteFooter';
import { findProjectBySlug, projects, type Project } from '@/data/projects';
import styles from './page.module.css';

type ProjectPageParams = {
  slug: string;
};

type ProjectPageProps = {
  params: Promise<ProjectPageParams>;
};

export function generateStaticParams(): ProjectPageParams[] {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = findProjectBySlug(slug);
  if (!project) {
    return { title: 'Project not found' };
  }
  return {
    title: project.name,
    description: project.oneliner,
    openGraph: {
      title: `${project.name} — Saahil Parikh`,
      description: project.oneliner,
      type: 'article',
    },
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = findProjectBySlug(slug);
  if (!project) {
    notFound();
  }
  return <ProjectDetail project={project} />;
}

type ProjectDetailProps = {
  project: Project;
};

function ProjectDetail({ project }: ProjectDetailProps) {
  const writeupParagraphs = splitIntoParagraphs(project.writeup);

  return (
    <main className={styles.main}>
      <nav className={`${styles.backNav} container`}>
        <Link href="/" className={styles.backLink}>
          ← back to selected work
        </Link>
      </nav>

      <header className={`${styles.header} container`}>
        <p className={styles.eyebrow}>Project · {project.year}</p>
        <h1 className={styles.title}>{project.name}</h1>
        <p className={styles.oneliner}>{project.oneliner}</p>
        <div className={styles.metaRow}>
          <ExternalLink href={project.href} className={styles.visitButton}>
            Visit {stripScheme(project.href)}
            <span className={styles.visitArrow} aria-hidden>
              ↗
            </span>
          </ExternalLink>
          <ul className={styles.tagList}>
            {project.tags.map((tag) => (
              <li key={tag} className={styles.tag}>
                {tag}
              </li>
            ))}
          </ul>
        </div>
      </header>

      <figure className={`${styles.media} container`}>
        {project.media ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            className={styles.mediaImage}
            src={project.media.src}
            alt={project.media.alt}
            loading="lazy"
          />
        ) : (
          <div className={styles.mediaPlaceholder} aria-hidden>
            screenshot coming soon
          </div>
        )}
      </figure>

      <section className={`${styles.writeup} container`}>
        {writeupParagraphs.map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </section>

      <SiteFooter
        ownerName="Saahil Parikh"
        tagline="Built with Next.js · hosted on AWS"
      />
    </main>
  );
}

function splitIntoParagraphs(writeup: string): string[] {
  return writeup
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter((paragraph) => paragraph.length > 0);
}

function stripScheme(url: string): string {
  return url.replace(/^https?:\/\//, '').replace(/\/$/, '');
}
