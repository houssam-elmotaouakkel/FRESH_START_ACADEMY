import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import SEO from '../components/common/SEO';
import Hero from './sections/Hero';
import Stats from './sections/Stats';
import Services from './sections/Services';
import Pricing from './sections/Pricing';
import About from './sections/About';
import Gallery from './sections/Gallery';
import Testimonials from './sections/Testimonials';
import FAQ from './sections/FAQ';
import Register from './sections/Register';
import CTA from './sections/CTA';
import Contact from './sections/Contact';

function Home() {
  const { t } = useTranslation();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('in');
        });
      },
      { threshold: 0.1 }
    );
    const els = document.querySelectorAll('.reveal, .reveal-l, .reveal-r');
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const btn = document.getElementById('scrollTop');
    if (!btn) return;
    const onScroll = () => btn.classList.toggle('vis', window.scrollY > 400);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <SEO
        title={t('landing.seo.title')}
        description={t('landing.seo.description')}
        path="/"
      />
      <Hero />
      <Stats />
      <Services />
      <Pricing />
      <About />
      <Gallery />
      <Testimonials />
      <FAQ />
      <Register />
      <CTA />
      <Contact />
    </>
  );
}

export default Home;
