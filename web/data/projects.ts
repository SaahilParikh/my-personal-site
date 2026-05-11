export type ProjectMedia = {
  src: string;
  alt: string;
};

export type Project = {
  slug: string;
  name: string;
  oneliner: string;
  href: string;
  tags: string[];
  year: number;
  writeup: string;
  media?: ProjectMedia;
};

const LIPSUM_WRITEUP = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. We started with a simple question — what if this thing existed? — and within a weekend we had something we could show our friends. The first version was held together with optimism and a generous interpretation of "production-ready".

Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. The interesting problems showed up almost immediately. Latency, state, the curious shape of real user behaviour that nobody warns you about in the docs. We rewrote the core loop twice; the second time felt like the right one.

Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. The technical bits we are most proud of: a clean separation between the model layer and the surface, a small but expressive type system, and a build pipeline that gets out of the way.

Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. What's next: more of the things that worked, fewer of the things that didn't.`;

export const projects: readonly Project[] = [
  {
    slug: 'phrasaurus',
    name: 'Phrasaurus',
    oneliner:
      'A tool for finding the right phrase, faster than a thesaurus and smarter than autocomplete.',
    href: 'https://phrasaurus.com',
    tags: ['typescript', 'nlp', 'web'],
    year: 2026,
    writeup: LIPSUM_WRITEUP,
  },
  {
    slug: 'project-two',
    name: 'Project Two',
    oneliner:
      'Another placeholder. Aim for one line — say what it does and what is interesting about it.',
    href: 'https://github.com/SaahilParikh',
    tags: ['python', 'ml'],
    year: 2025,
    writeup: LIPSUM_WRITEUP,
  },
  {
    slug: 'project-three',
    name: 'Project Three',
    oneliner:
      'Third placeholder. The grid balances at three or four entries on desktop.',
    href: 'https://github.com/SaahilParikh',
    tags: ['rust', 'systems'],
    year: 2024,
    writeup: LIPSUM_WRITEUP,
  },
  {
    slug: 'project-four',
    name: 'Project Four',
    oneliner:
      'Fourth placeholder. Keep descriptions short — the page reads as a quick scan.',
    href: 'https://github.com/SaahilParikh',
    tags: ['infra', 'aws'],
    year: 2024,
    writeup: LIPSUM_WRITEUP,
  },
];

export function findProjectBySlug(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}
