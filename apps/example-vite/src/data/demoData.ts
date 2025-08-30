// Demo data for showcasing React Responsive Easy features

export const demoStats = [
  { label: 'Bundle Size', value: '< 15KB', icon: '📦' },
  { label: 'Performance', value: '99.9%', icon: '⚡' },
  { label: 'Breakpoints', value: '∞', icon: '🎯' },
  { label: 'Frameworks', value: '5+', icon: '🛠️' },
  { label: 'Components', value: '25+', icon: '🧩' },
  { label: 'Hooks', value: '8+', icon: '🎣' }
]

export const demoFeatures = [
  {
    icon: '🚀',
    title: 'Mathematical Scaling',
    content: 'Values scale mathematically across breakpoints using our advanced scaling engine. No more manual CSS calculations!',
    category: 'core'
  },
  {
    icon: '⚡',
    title: 'Performance Optimized',
    content: 'Built-in performance monitoring, caching, and optimization. Track render times and memory usage in real-time.',
    category: 'performance'
  },
  {
    icon: '🎯',
    title: 'Smart Breakpoints',
    content: 'Intelligent breakpoint detection with smooth transitions. Supports custom breakpoints and orientation changes.',
    category: 'responsive'
  },
  {
    icon: '🛠️',
    title: 'Developer Experience',
    content: 'TypeScript support, React hooks, and comprehensive tooling. Build responsive apps faster than ever.',
    category: 'dx'
  },
  {
    icon: '📱',
    title: 'Mobile First',
    content: 'Responsive by design with accessibility built-in. Automatic scaling ensures perfect proportions on all devices.',
    category: 'mobile'
  },
  {
    icon: '🔧',
    title: 'Framework Agnostic',
    content: 'Works with Next.js, Vite, Create React App, and more. Includes build plugins for optimal performance.',
    category: 'integration'
  },
  {
    icon: '🎨',
    title: 'Advanced Layouts',
    content: 'Responsive grids, masonry layouts, and advanced positioning. Create complex layouts with mathematical precision.',
    category: 'layouts'
  },
  {
    icon: '📊',
    title: 'Real-time Monitoring',
    content: 'Performance dashboard with live metrics, alerts, and optimization recommendations.',
    category: 'monitoring'
  }
]

export const demoTimeline = [
  {
    title: "Core Engine Development",
    description: "Built mathematical scaling algorithms and responsive hooks with TypeScript support",
    date: "Phase 1 - Foundation",
    icon: "🔧",
    status: "completed"
  },
  {
    title: "Performance Dashboard",
    description: "Added real-time monitoring, optimization tools, and performance analytics",
    date: "Phase 2 - Monitoring",
    icon: "📊",
    status: "completed"
  },
  {
    title: "Advanced Components",
    description: "Created responsive layout components, navigation, and advanced patterns",
    date: "Phase 3 - Components",
    icon: "🎨",
    status: "completed"
  },
  {
    title: "Framework Integration",
    description: "Built plugins for Vite, Next.js, and other popular frameworks",
    date: "Phase 4 - Integration",
    icon: "🚀",
    status: "in-progress"
  },
  {
    title: "Ecosystem Expansion",
    description: "Additional tools, plugins, and community-driven features",
    date: "Phase 5 - Ecosystem",
    icon: "🌍",
    status: "planned"
  }
]

export const demoTestimonials = [
  {
    name: "Sarah Chen",
    role: "Frontend Engineer",
    company: "TechCorp",
    content: "React Responsive Easy transformed how we build responsive UIs. The mathematical scaling is pure magic! We reduced our CSS by 60% and improved performance significantly.",
    avatar: "👩‍💻",
    rating: 5
  },
  {
    name: "Marcus Rodriguez",
    role: "UI/UX Designer",
    company: "DesignStudio",
    content: "Finally, a library that understands responsive design isn't just about breakpoints, but mathematical relationships. Our designs now scale perfectly across all devices.",
    avatar: "🎨",
    rating: 5
  },
  {
    name: "Alex Thompson",
    role: "Full Stack Developer",
    company: "StartupXYZ",
    content: "The performance dashboard helped us identify and fix critical bottlenecks in our app. Game changer! Our app now loads 3x faster on mobile devices.",
    avatar: "👨‍💻",
    rating: 5
  },
  {
    name: "Emma Wilson",
    role: "Product Manager",
    company: "InnovateCorp",
    content: "As a PM, I love how this library makes responsive design predictable. Our team can now estimate development time accurately for responsive features.",
    avatar: "👩‍💼",
    rating: 5
  },
  {
    name: "David Kim",
    role: "Tech Lead",
    company: "ScaleTech",
    content: "The mathematical approach to responsive design is revolutionary. We've standardized our entire design system around this library.",
    avatar: "👨‍💻",
    rating: 5
  }
]

export const demoMetrics = {
  performance: {
    renderTime: 12.5,
    memoryUsage: 45.2,
    bundleSize: 14.8,
    lighthouseScore: 98
  },
  responsive: {
    breakpoints: 4,
    scalingAccuracy: 99.9,
    mobileOptimization: 95.2,
    crossDeviceConsistency: 98.7
  },
  developer: {
    linesOfCode: 1250,
    components: 25,
    hooks: 8,
    plugins: 5
  }
}

export const demoBreakpoints = [
  { name: 'mobile', width: 320, height: 568, alias: 'mobile' },
  { name: 'tablet', width: 768, height: 1024, alias: 'tablet' },
  { name: 'desktop', width: 1024, height: 768, alias: 'desktop' },
  { name: 'wide', width: 1440, height: 900, alias: 'wide' },
  { name: 'ultra-wide', width: 1920, height: 1080, alias: 'ultra-wide' }
]

export const demoScalingTokens = {
  fontSize: { scale: 1.0, min: 12, unit: 'px', responsive: true },
  spacing: { scale: 1.0, unit: 'px', responsive: true },
  radius: { scale: 1.0, unit: 'px', responsive: true },
  lineHeight: { scale: 1.0, responsive: true },
  shadow: { scale: 1.0, responsive: true },
  border: { scale: 1.0, unit: 'px', responsive: true },
  padding: { scale: 1.0, unit: 'px', responsive: true },
  margin: { scale: 1.0, unit: 'px', responsive: true }
}

export const demoPerformanceAlerts = [
  {
    type: 'warning',
    message: 'Render time exceeded 16ms threshold',
    severity: 'medium',
    timestamp: Date.now() - 300000,
    component: 'ResponsiveGrid'
  },
  {
    type: 'info',
    message: 'Memory usage optimized by 15%',
    severity: 'low',
    timestamp: Date.now() - 600000,
    component: 'PerformanceMonitor'
  },
  {
    type: 'success',
    message: 'Bundle size reduced to 14.8KB',
    severity: 'low',
    timestamp: Date.now() - 900000,
    component: 'BuildOptimizer'
  }
]

export const demoResponsiveExamples = [
  {
    title: 'Mathematical Grid',
    description: 'Grid that automatically adjusts columns based on mathematical scaling',
    component: 'AdvancedResponsiveGrid',
    complexity: 'medium'
  },
  {
    title: 'Responsive Typography',
    description: 'Font sizes that scale mathematically across breakpoints',
    component: 'ResponsiveText',
    complexity: 'low'
  },
  {
    title: 'Dynamic Spacing',
    description: 'Spacing values that maintain proportional relationships',
    component: 'ResponsiveSpacing',
    complexity: 'low'
  },
  {
    title: 'Adaptive Layouts',
    description: 'Layouts that transform based on screen dimensions',
    component: 'ResponsiveLayout',
    complexity: 'high'
  }
]
