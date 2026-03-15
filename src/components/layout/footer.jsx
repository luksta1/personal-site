import styles from './footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <p className={styles.colophon}>
        Built with React, Vite &amp; Rspack. Deployed on Netlify.
      </p>
    </footer>
  );
}
