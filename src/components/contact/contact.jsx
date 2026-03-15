import { motion } from 'framer-motion';
import useScrollReveal from '../../hooks/use-scroll-reveal';
import styles from './contact.module.css';

const LINKS = [
  { label: 'Email', href: 'mailto:hello@lukepura.com' },
  { label: 'GitHub', href: 'https://github.com/lukepura' },
  { label: 'LinkedIn', href: 'https://linkedin.com/in/lukepura' },
];

export default function Contact() {
  const ref = useScrollReveal();

  return (
    <section className={styles.section} id="contact" aria-label="Contact">
      <div className={styles.container} ref={ref}>
        <h2 className={styles.heading}>Let's Talk</h2>
        <p className={styles.subtext}>
          I'm looking for teams that care about their users as much as their
          code. If you're building something ambitious, let's talk.
        </p>

        <nav className={styles.links} aria-label="Social links">
          {LINKS.map((link) => (
            <motion.a
              key={link.label}
              href={link.href}
              className={styles.link}
              target={link.href.startsWith('mailto') ? undefined : '_blank'}
              rel={link.href.startsWith('mailto') ? undefined : 'noopener noreferrer'}
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.97 }}
            >
              {link.label}
            </motion.a>
          ))}
        </nav>

        <motion.a
          href="/luke-pura-cv.pdf"
          className={styles.cvButton}
          download
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          aria-label="Download CV"
        >
          ↓ Download CV
        </motion.a>
      </div>
    </section>
  );
}
