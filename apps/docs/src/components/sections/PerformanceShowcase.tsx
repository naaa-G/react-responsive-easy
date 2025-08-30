'use client';

import { motion } from 'framer-motion';

export function PerformanceShowcase() {
  return (
    <section className="section-padding bg-gray-50 dark:bg-gray-900/50">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            Performance <span className="gradient-text">Matters</span>
          </h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
            Built for speed with enterprise-grade performance monitoring.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
