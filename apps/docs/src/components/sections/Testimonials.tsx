'use client';

import { motion } from 'framer-motion';

export function Testimonials() {
  return (
    <section className="section-padding">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            Trusted by <span className="gradient-text">developers worldwide</span>
          </h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
            Join thousands of developers building better responsive experiences.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
