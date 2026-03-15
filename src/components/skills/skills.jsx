import { motion } from 'framer-motion';
import useScrollReveal from '../../hooks/use-scroll-reveal';
import styles from './skills.module.css';

const SKILLS = [
  {
    title: 'Frontend Architecture',
    description:
      'Scalable, performant frontend systems built to last — from component libraries and state management to cross-team patterns that keep velocity high.',
  },
  {
    title: 'User-Focused Products',
    description:
      'End-to-end product delivery from planning and strategy through launch. I build features users actually love, backed by real metrics.',
  },
  {
    title: 'Cross-Team Collaboration',
    description:
      'Creating synergy between product, design, and engineering — bridging the gap so teams ship faster without sacrificing quality.',
  },
  {
    title: 'UI & UX Engineering',
    description:
      'High-quality interfaces with accessibility, performance, and the customer experience baked in from day one. Every interaction matters.',
  },
];

export default function Skills() {
  const headingRef = useScrollReveal();
  const gridRef = useScrollReveal({ children: true, stagger: 0.15 });

  return (
    <section className={styles.section} id="skills" aria-label="What I build">
      <div className={styles.container}>
        <h2 className={styles.heading} ref={headingRef}>
          What I Build
        </h2>
        <div className={styles.grid} ref={gridRef}>
          {SKILLS.map((skill) => (
            <motion.article
              key={skill.title}
              className={styles.card}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.99 }}
            >
              <h3 className={styles.cardTitle}>{skill.title}</h3>
              <p className={styles.cardDescription}>{skill.description}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
