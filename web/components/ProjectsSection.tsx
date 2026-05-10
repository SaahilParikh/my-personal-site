import type { Project } from '@/data/projects';
import { ProjectCard } from './ProjectCard';
import styles from './ProjectsSection.module.css';

type ProjectsSectionProps = {
  id: string;
  title: string;
  projects: readonly Project[];
};

export function ProjectsSection({ id, title, projects }: ProjectsSectionProps) {
  return (
    <section className={`${styles.section} container`} id={id}>
      <header className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>{title}</h2>
        <span className={styles.sectionMeta}>{projects.length} projects</span>
      </header>

      <ul className={styles.grid}>
        {projects.map((project) => (
          <li key={project.name}>
            <ProjectCard project={project} />
          </li>
        ))}
      </ul>
    </section>
  );
}
