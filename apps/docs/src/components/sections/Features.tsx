'use client';

import { motion } from 'framer-motion';
import { 
  Cpu,
  Rocket,
  Shield,
  Sparkles,
  Zap,
  BarChart3,
  Code2,
  Smartphone
} from 'lucide-react';

const features = [
  {
    name: 'Mathematical Scaling',
    description: 'Precise scaling algorithms ensure pixel-perfect responsive design across all breakpoints.',
    icon: Cpu,
    color: 'from-blue-500 to-cyan-500'
  },
  {
    name: 'Zero Config Setup',
    description: 'Get started in minutes with sensible defaults and automatic breakpoint detection.',
    icon: Rocket,
    color: 'from-purple-500 to-pink-500'
  },
  {
    name: 'Enterprise Ready',
    description: 'Built for scale with TypeScript, comprehensive testing, and production-grade performance.',
    icon: Shield,
    color: 'from-green-500 to-emerald-500'
  },
  {
    name: 'AI-Powered Optimization',
    description: 'Machine learning suggestions to optimize your responsive design performance.',
    icon: Sparkles,
    color: 'from-yellow-500 to-orange-500'
  },
  {
    name: 'Lightning Fast',
    description: 'Sub-15KB bundle size with tree-shaking and optimal performance characteristics.',
    icon: Zap,
    color: 'from-red-500 to-pink-500'
  },
  {
    name: 'Real-time Analytics',
    description: 'Monitor responsive performance with built-in analytics and debugging tools.',
    icon: BarChart3,
    color: 'from-indigo-500 to-purple-500'
  },
  {
    name: 'Developer Experience',
    description: 'Intuitive APIs, comprehensive documentation, and powerful development tools.',
    icon: Code2,
    color: 'from-teal-500 to-green-500'
  },
  {
    name: 'Mobile First',
    description: 'Optimized for mobile performance with progressive enhancement for larger screens.',
    icon: Smartphone,
    color: 'from-cyan-500 to-blue-500'
  }
];

export function Features() {
  return (
    <section className="section-padding bg-gray-50 dark:bg-gray-900/50">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl"
          >
            Everything you need for{' '}
            <span className="gradient-text">responsive excellence</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="mt-4 text-lg text-gray-600 dark:text-gray-300"
          >
            Built by developers, for developers. Every feature is designed to make 
            responsive design effortless and performant.
          </motion.p>
        </div>

        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <motion.div
              key={feature.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-soft transition-all duration-300 hover:shadow-medium dark:bg-gray-900"
            >
              {/* Background Gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 transition-opacity duration-300 group-hover:opacity-5`} />
              
              {/* Icon */}
              <div className={`inline-flex rounded-xl bg-gradient-to-br ${feature.color} p-3`}>
                <feature.icon size={20} className="text-white" />
              </div>

              {/* Content */}
              <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">
                {feature.name}
              </h3>
              <p className="mt-2 text-gray-600 dark:text-gray-300">
                {feature.description}
              </p>

              {/* Hover Effect */}
              <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-gray-200 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:via-gray-700" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
