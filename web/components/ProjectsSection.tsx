import type { Project } from '@/data/projects';
import { ProjectCard } from './ProjectCard';
import styles from './ProjectsSection.module.css';

const DEFAULT_EMPTY_MESSAGE = 'Forthcoming.';

type ProjectsSectionProps = {
  id: string;
  title: string;
  projects: readonly Project[];
  itemNoun?: string;
  emptyMessage?: string;
};

export function ProjectsSection({
  id,
  title,
  projects,
  itemNoun = 'projects',
  emptyMessage = DEFAULT_EMPTY_MESSAGE,
}: ProjectsSectionProps) {
  const hasProjects = projects.length > 0;

  return (
    <section className={`${styles.section} container`} id={id}>
      <header className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>{title}</h2>
        <span className={styles.sectionMeta}>
          {hasProjects ? `${projects.length} ${itemNoun}` : '—'}
        </span>
      </header>

      {hasProjects ? (
        <ul className={styles.grid}>
          {projects.map((project) => (
            <li key={project.slug}>
              <ProjectCard project={project} />
            </li>
          ))}
        </ul>
      ) : (
        <p className={styles.emptyMessage}>{emptyMessage}</p>
      )}
    </section>
  );
}
