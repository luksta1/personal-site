import { motion } from 'framer-motion';
import useScrollReveal from '../../hooks/use-scroll-reveal';
import projects from '../../data/projects';
import styles from './work.module.css';

export default function Work() {
  const headingRef = useScrollReveal();
  const listRef = useScrollReveal({ children: true, stagger: 0.15 });

  return (
    <section className={styles.section} id="work" aria-label="Featured work">
      <div className={styles.container}>
        <h2 className={styles.heading} ref={headingRef}>
          Featured Work
        </h2>
        <div className={styles.list} ref={listRef}>
          {projects.map((project) => (
            <motion.article
              key={project.id}
              className={styles.card}
              whileHover={{ y: -3 }}
            >
              <h3 className={styles.cardTitle}>{project.title}</h3>
              {project.company && (
                <p className={styles.cardMeta}>
                  {project.company} · {project.role}
                </p>
              )}
              <div className={styles.problemSolution}>
                <div>
                  <p className={styles.label}>Problem</p>
                  <p className={styles.text}>{project.problem}</p>
                </div>
                <div>
                  <p className={styles.label}>Solution</p>
                  <p className={styles.text}>{project.solution}</p>
                </div>
              </div>
              <div className={styles.tags} aria-label="Technologies used">
                {project.tech.map((t) => (
                  <span key={t} className={styles.tag}>
                    {t}
                  </span>
                ))}
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
