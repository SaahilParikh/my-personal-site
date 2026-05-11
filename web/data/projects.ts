export type ProjectMedia = {
  src: string;
  alt: string;
};

export type ProjectCategory = 'projects' | 'research';

export type Project = {
  slug: string;
  name: string;
  oneliner: string;
  href: string;
  tags: string[];
  year: number;
  category: ProjectCategory;
  writeup: string;
  media?: ProjectMedia;
};

const LIPSUM_WRITEUP = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. We started with a simple question — what if this thing existed? — and within a weekend we had something we could show our friends. The first version was held together with optimism and a generous interpretation of "production-ready".

Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. The interesting problems showed up almost immediately. Latency, state, the curious shape of real user behaviour that nobody warns you about in the docs. We rewrote the core loop twice; the second time felt like the right one.

Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. The technical bits we are most proud of: a clean separation between the model layer and the surface, a small but expressive type system, and a build pipeline that gets out of the way.

Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. What's next: more of the things that worked, fewer of the things that didn't.`;

export const projects: readonly Project[] = [
  {
    slug: 'graphosaurus',
    name: 'Graphosaurus',
    oneliner:
      'A short, declarative sentence about what Graphosaurus is. Replace me with the real one.',
    href: 'https://graphosaurus.com',
    tags: ['typescript', 'graphs', 'visualization'],
    year: 2026,
    category: 'projects',
    writeup: LIPSUM_WRITEUP,
  },
  {
    slug: 'phrasaurus',
    name: 'Phrasaurus',
    oneliner:
      'A tool for finding the right phrase, faster than a thesaurus and smarter than autocomplete.',
    href: 'https://phrasaurus.com',
    tags: ['typescript', 'nlp', 'web'],
    year: 2026,
    category: 'projects',
    writeup: LIPSUM_WRITEUP,
  },
];

export function findProjectBySlug(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}

export function getProjectsByCategory(
  category: ProjectCategory,
): readonly Project[] {
  return projects.filter((project) => project.category === category);
}
