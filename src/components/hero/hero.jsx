import { useEffect, useRef, Suspense, lazy } from "react";
import gsap from "gsap";
import styles from "./hero.module.css";

const HaloEffect = lazy(() => import("./scene"));

const NAME = "Luke Pura";

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export default function Hero() {
  const nameRef = useRef(null);

  useEffect(() => {
    if (prefersReducedMotion() || !nameRef.current) return;

    const letters = nameRef.current.querySelectorAll(`.${styles.letter}`);
    gsap.to(letters, {
      y: 0,
      opacity: 1,
      duration: 0.6,
      stagger: 0.03,
      ease: "power3.out",
      delay: 0.3,
    });
  }, []);

  return (
    <section className={styles.hero} id="hero" aria-label="Introduction">
      <div className={styles.canvas}>
        <Suspense fallback={null}>
          <HaloEffect />
        </Suspense>
      </div>

      <div className={styles.content}>
        <h1 className={styles.name} ref={nameRef} aria-label="Luke Pura">
          {NAME.split("").map((char, i) =>
            char === " " ? (
              <span key={i} className={styles.space} />
            ) : (
              <span key={i} className={styles.letter}>
                {char}
              </span>
            ),
          )}
        </h1>
        <p className={styles.tagline}>
          Software engineer building{" "}
          <span className={styles.accent}>user-focused</span> products that
          deliver real impact.
        </p>
      </div>

      <div className={styles.scrollIndicator} aria-hidden="true">
        <div className={styles.scrollLine} />
        <span className={styles.scrollText}>Scroll</span>
      </div>
    </section>
  );
}
