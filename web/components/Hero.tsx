import { ExternalLink } from './ExternalLink';
import styles from './Hero.module.css';

type ContactLink = {
  label: string;
  href: string;
  isExternal: boolean;
};

const CONTACT_LINKS: readonly ContactLink[] = [
  { label: 'GitHub', href: 'https://github.com/SaahilParikh', isExternal: true },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/saahilparikh', isExternal: true },
  { label: 'Email', href: 'mailto:hi@saahil.io', isExternal: false },
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
        {CONTACT_LINKS.map((link) =>
          link.isExternal ? (
            <ExternalLink key={link.label} href={link.href}>
              {link.label} ↗
            </ExternalLink>
          ) : (
            <a key={link.label} href={link.href}>
              {link.label} ↗
            </a>
          ),
        )}
      </nav>
    </section>
  );
}
