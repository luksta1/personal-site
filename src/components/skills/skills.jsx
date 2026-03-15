import { motion } from 'framer-motion';
import useScrollReveal from '../../hooks/use-scroll-reveal';
import styles from './skills.module.css';

const SKILLS = [
  {
    title: 'Frontend Architecture',
    description:
      'Scalable frontend systems built on module federation and micro frontends — with robust state management and caching strategies that keep velocity high.',
  },
  {
    title: 'User-Focused Products',
    description:
      'End-to-end product delivery from planning and strategy through launch. I build features users actually love, backed by real metrics.',
  },
  {
    title: 'Data-Driven Interfaces',
    description:
      'Real-time dashboards, live visualizations, and complex data-heavy UIs that turn raw information into clear, actionable insight.',
  },
  {
    title: 'Developer Experience',
    description:
      'Internal tooling, MCP servers, and onboarding flows that make other engineers faster — because great DX compounds across the whole org.',
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
