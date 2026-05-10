export type Project = {
  name: string;
  description: string;
  href: string;
  tags: string[];
  year: number;
};

export const projects: Project[] = [
  {
    name: 'Project One',
    description:
      'A short, clear sentence about what this is and why it exists. Replace me.',
    href: 'https://github.com/SaahilParikh',
    tags: ['typescript', 'react'],
    year: 2025,
  },
  {
    name: 'Project Two',
    description:
      'Another placeholder. Aim for one line — say what it does and what is interesting about it.',
    href: 'https://github.com/SaahilParikh',
    tags: ['python', 'ml'],
    year: 2025,
  },
  {
    name: 'Project Three',
    description:
      'Third placeholder. The grid balances at three or four entries on desktop.',
    href: 'https://github.com/SaahilParikh',
    tags: ['rust', 'systems'],
    year: 2024,
  },
  {
    name: 'Project Four',
    description:
      'Fourth placeholder. Keep descriptions short — the page reads as a quick scan.',
    href: 'https://github.com/SaahilParikh',
    tags: ['infra', 'aws'],
    year: 2024,
  },
];
