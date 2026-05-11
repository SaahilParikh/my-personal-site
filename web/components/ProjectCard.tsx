import Link from 'next/link';
import type { Project } from '@/data/projects';
import styles from './ProjectCard.module.css';

type ProjectCardProps = {
  project: Project;
};

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Link href={`/projects/${project.slug}/`} className={styles.card}>
      <div className={styles.cardHead}>
        <h3 className={styles.cardTitle}>
          {project.name}{' '}
          <span className={styles.arrow} aria-hidden>
            →
          </span>
        </h3>
        <span className={styles.cardYear}>{project.year}</span>
      </div>
      <p className={styles.cardBody}>{project.oneliner}</p>
      <ul className={styles.tagList}>
        {project.tags.map((tag) => (
          <li key={tag} className={styles.tag}>
            {tag}
          </li>
        ))}
      </ul>
    </Link>
  );
}
