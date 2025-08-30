import { Hero } from '@/components/sections/Hero';
import { Features } from '@/components/sections/Features';
import { CodeShowcase } from '@/components/sections/CodeShowcase';
import { PerformanceShowcase } from '@/components/sections/PerformanceShowcase';
import { Testimonials } from '@/components/sections/Testimonials';
import { CTA } from '@/components/sections/CTA';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export default function HomePage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <Hero />
        <Features />
        <CodeShowcase />
        <PerformanceShowcase />
        <Testimonials />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
