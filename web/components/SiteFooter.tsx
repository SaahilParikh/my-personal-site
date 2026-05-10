import styles from './SiteFooter.module.css';

type SiteFooterProps = {
  ownerName: string;
  tagline: string;
};

export function SiteFooter({ ownerName, tagline }: SiteFooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={`${styles.footer} container`}>
      <span>
        © {currentYear} {ownerName}
      </span>
      <span>{tagline}</span>
    </footer>
  );
}
