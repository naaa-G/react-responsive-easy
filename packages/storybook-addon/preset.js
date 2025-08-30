/**
 * Storybook preset for React Responsive Easy
 * 
 * This preset automatically configures Storybook to work with
 * React Responsive Easy components and provides default settings.
 */

function config(entry = []) {
  return [...entry, require.resolve('./dist/preset/manager')];
}

function managerEntries(entry = []) {
  return [...entry, require.resolve('./manager')];
}

function webpackFinal(config, options) {
  // Add webpack configurations for React Responsive Easy
  return {
    ...config,
    resolve: {
      ...config.resolve,
      alias: {
        ...config.resolve?.alias,
        '@react-responsive-easy/core': require.resolve('@react-responsive-easy/core'),
        '@react-responsive-easy/performance-dashboard': require.resolve('@react-responsive-easy/performance-dashboard')
      }
    }
  };
}

module.exports = {
  config,
  managerEntries,
  webpackFinal
};
