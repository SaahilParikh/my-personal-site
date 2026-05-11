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
    slug: 'choose-your-own-adventure',
    name: 'Choose Your Own Adventure',
    oneliner:
      'An AI-powered text adventure — narrative, scene art, and voice narration generated turn by turn, with dice rolls, world agents, and meta-forces competing over the objective.',
    href: 'https://choose-your-own-adventure.com',
    tags: ['typescript', 'ai', 'langgraph', 'bedrock'],
    year: 2026,
    category: 'projects',
    writeup: LIPSUM_WRITEUP,
  },
  {
    slug: 'distributed-protocol-visualizer',
    name: 'Distributed Protocol Visualizer',
    oneliner:
      'An interactive Raft visualizer — seeded deterministic simulation in the browser, with playback, scrubbing, and a tunable drop rate.',
    href: 'https://saahilparikh.github.io/distributed-protocol-visualizer/',
    tags: ['typescript', 'distributed-systems', 'raft', 'visualization'],
    year: 2026,
    category: 'projects',
    writeup: LIPSUM_WRITEUP,
  },
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
  {
    slug: 'dynamic-dec-los-rrt',
    name: 'Dynamic Dec-LOS-RRT',
    oneliner:
      'Decentralized motion planning for dynamic agents communicating only when they have line of sight.',
    href: 'https://github.com/SaahilParikh/DYNAMIC-DEC-LOS-RRT/blob/main/Research%20Paper.pdf',
    tags: ['robotics', 'motion-planning', 'multi-agent'],
    year: 2022,
    category: 'research',
    writeup: LIPSUM_WRITEUP,
  },
  {
    slug: 'ble-quadcopter',
    name: 'BLE Quadcopter',
    oneliner:
      'An EECS149 quadcopter controlled over Bluetooth Low Energy — embedded firmware, sensor fusion, and a tethered ground station.',
    href: 'https://github.com/SaahilParikh/Quadcopter',
    tags: ['embedded', 'ble', 'control-systems'],
    year: 2021,
    category: 'research',
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
