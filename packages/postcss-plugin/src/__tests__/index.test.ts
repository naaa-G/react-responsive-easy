/**
 * Main test index for PostCSS plugin
 * Imports and runs all test suites
 */

// Import all test files to ensure they are executed
import './setup';
import './postcss-plugin.test';
import './unit-tests.test';
import './integration-tests.test';
import './performance-tests.test';
import './stress-tests.test';
import './ci-cd-tests.test';
import './snapshot-tests.test';
import './error-handling-tests.test';

// Export test utilities for external use
export * from './utils/test-helpers';
export * from './utils/enterprise-test-helpers';
