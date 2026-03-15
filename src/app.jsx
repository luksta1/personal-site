import { lazy, Suspense } from 'react';
import { Nav, Footer } from './components/layout';
import Hero from './components/hero';
import About from './components/about';
import Skills from './components/skills';
import Work from './components/work';
import Contact from './components/contact';

const PowderMap = lazy(() => import('./components/powder-map'));

export default function App() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <About />
        <Skills />
        <Work />
        <Suspense
          fallback={
            <section
              style={{
                height: '100vh',
                background: 'var(--bg-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--text-muted)',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.85rem',
              }}
            >
              Loading map…
            </section>
          }
        >
          <PowderMap />
        </Suspense>
        <Contact />
      </main>
      <Footer />
    </>
  );
}
