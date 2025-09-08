/**
 * Custom configuration for testing
 */

export default {
  base: { name: 'desktop', width: 1920, height: 1080, alias: 'base' },
  breakpoints: [
    { name: 'mobile', width: 390, height: 844, alias: 'mobile' },
    { name: 'tablet', width: 768, height: 1024, alias: 'tablet' },
    { name: 'laptop', width: 1366, height: 768, alias: 'laptop' },
    { name: 'desktop', width: 1920, height: 1080, alias: 'base' }
  ],
  strategy: {
    origin: 'width' as const,
    tokens: {
      fontSize: { scale: 0.85, min: 12, max: 22 },
      spacing: { scale: 0.85, step: 2 },
      radius: { scale: 0.9 }
    },
    rounding: { mode: 'nearest' as const, precision: 0.5 }
  }
};
