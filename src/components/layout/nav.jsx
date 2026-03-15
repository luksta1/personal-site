import { useState, useEffect } from 'react';
import styles from './nav.module.css';

const SECTIONS = [
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'work', label: 'Work' },
  { id: 'powder-map', label: 'Map' },
  { id: 'contact', label: 'Contact' },
];

export default function Nav() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > window.innerHeight * 0.5);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav
      className={`${styles.nav} ${visible ? styles.visible : ''}`}
      aria-label="Main navigation"
    >
      <button
        className={styles.initials}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        aria-label="Scroll to top"
      >
        // Luke Pura
      </button>

      <div className={styles.links}>
        {SECTIONS.map((section) => (
          <button
            key={section.id}
            className={styles.link}
            onClick={() => scrollTo(section.id)}
          >
            {section.label}
          </button>
        ))}
      </div>
    </nav>
  );
}
