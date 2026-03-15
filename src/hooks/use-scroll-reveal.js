import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const prefersReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export default function useScrollReveal(options = {}) {
  const ref = useRef(null);

  useEffect(() => {
    if (prefersReducedMotion() || !ref.current) return;

    const {
      y = 40,
      duration = 0.8,
      delay = 0,
      stagger = 0.15,
      ease = 'power3.out',
      start = 'top 85%',
      children = false,
    } = options;

    const targets = children ? ref.current.children : ref.current;

    gsap.set(targets, { y, opacity: 0 });

    const trigger = ScrollTrigger.create({
      trigger: ref.current,
      start,
      once: true,
      onEnter: () => {
        gsap.to(targets, {
          y: 0,
          opacity: 1,
          duration,
          delay,
          stagger: children ? stagger : 0,
          ease,
        });
      },
    });

    return () => trigger.kill();
  }, []);

  return ref;
}
