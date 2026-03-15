import useScrollReveal from "../../hooks/use-scroll-reveal";
import Currently from "./currently";
import styles from "./about.module.css";

export default function About() {
  const sectionRef = useScrollReveal();
  const widgetRef = useScrollReveal({ delay: 0.2 });

  return (
    <section className={styles.section} id="about" aria-label="About me">
      <div className={styles.container}>
        <div ref={sectionRef}>
          <h2 className={styles.heading}>About</h2>
          <p className={styles.bio}>
            I'm a results-driven senior frontend engineer who obsesses over
            the customer experience. I build scalable, performant web
            applications from strategy through delivery — always looking for
            the intersection where{" "}
            <em>product, design, and engineering</em> click.
          </p>
          <p className={styles.bio} style={{ marginTop: "1rem" }}>
            When I'm not shipping features, I'm probably chasing powder days
            somewhere in the mountains. I believe the best engineering is
            invisible — users don't notice the code, they just notice that
            everything <em>works</em>.
          </p>
        </div>
        <div ref={widgetRef}>
          <Currently />
        </div>
      </div>
    </section>
  );
}
