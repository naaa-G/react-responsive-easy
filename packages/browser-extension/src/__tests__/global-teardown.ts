/**
 * Global teardown for Jest tests
 * 
 * This file runs once after all tests complete and cleans up the global test environment.
 */

export default async function globalTeardown() {
  console.log('🧹 Cleaning up global test environment for React Responsive Easy Browser Extension');
  
  // Clean up any global resources
  // For example, closing database connections, stopping servers, etc.
  
  // Clear any global state
  if (global.gc) {
    global.gc();
  }
}

