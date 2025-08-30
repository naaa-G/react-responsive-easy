'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Rocket, BookOpen } from 'lucide-react';

export function CTA() {
  return (
    <section className="section-padding bg-gradient-to-r from-brand-600 to-purple-600">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Ready to build amazing responsive experiences?
          </h2>
          <p className="mt-4 text-xl text-brand-100">
            Join thousands of developers already using React Responsive Easy.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button size="lg" variant="secondary" asChild>
              <Link href="/docs/getting-started">
                <Rocket size={18} className="mr-2" />
                Get Started
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="border-white/20 text-white hover:bg-white/10">
              <Link href="/docs">
                <BookOpen size={18} className="mr-2" />
                Read Docs
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
