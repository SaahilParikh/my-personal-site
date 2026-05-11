import { ExternalLink } from './ExternalLink';
import styles from './Hero.module.css';

const EXTERNAL_ARROW = '↗';
const DOWNLOAD_ARROW = '↓';

type ContactLinkKind = 'external' | 'mailto' | 'download';

type ContactLink = {
  label: string;
  href: string;
  kind: ContactLinkKind;
  arrow: string;
};

const CONTACT_LINKS: readonly ContactLink[] = [
  {
    label: 'GitHub',
    href: 'https://github.com/SaahilParikh',
    kind: 'external',
    arrow: EXTERNAL_ARROW,
  },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/saahilparikh',
    kind: 'external',
    arrow: EXTERNAL_ARROW,
  },
  {
    label: 'Email',
    href: 'mailto:hi@saahil.io',
    kind: 'mailto',
    arrow: EXTERNAL_ARROW,
  },
  {
    label: 'Resume',
    href: '/resume.pdf',
    kind: 'download',
    arrow: DOWNLOAD_ARROW,
  },
];

type HeroProps = {
  eyebrow: string;
  headline: string;
  lede: string;
};

export function Hero({ eyebrow, headline, lede }: HeroProps) {
  return (
    <section className={`${styles.hero} container`}>
      <p className={styles.eyebrow}>{eyebrow}</p>
      <h1 className={styles.title}>{headline}</h1>
      <p className={styles.lede}>{lede}</p>
      <nav className={styles.contactNav} aria-label="Contact links">
        {CONTACT_LINKS.map((link) => (
          <ContactLinkItem key={link.label} link={link} />
        ))}
      </nav>
    </section>
  );
}

function ContactLinkItem({ link }: { link: ContactLink }) {
  const content = (
    <>
      {link.label} {link.arrow}
    </>
  );

  if (link.kind === 'external') {
    return <ExternalLink href={link.href}>{content}</ExternalLink>;
  }

  if (link.kind === 'download') {
    return (
      <a href={link.href} target="_blank" rel="noopener noreferrer">
        {content}
      </a>
    );
  }

  return <a href={link.href}>{content}</a>;
}
