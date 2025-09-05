import { FullConfig } from '@playwright/test';

/**
 * Global teardown for Playwright tests
 * Runs once after all tests to clean up resources
 */
async function globalTeardown(config: FullConfig) {
  console.log('🧹 Starting global test teardown...');
  
  try {
    // Clean up any temporary files or resources
    console.log('📁 Cleaning up test artifacts...');
    
    // Log test completion summary
    const timestamp = new Date().toISOString();
    console.log(`✅ All tests completed at ${timestamp}`);
    
    // Additional cleanup can be added here
    // - Remove temporary files
    // - Close any remaining connections
    // - Generate final reports
    
  } catch (error) {
    console.error('❌ Global teardown failed:', error);
    // Don't throw here to avoid masking test failures
  }
  
  console.log('🎉 Global teardown completed');
}

export default globalTeardown;
