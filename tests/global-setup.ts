import { chromium, FullConfig } from '@playwright/test';

/**
 * Global setup for Playwright tests
 * Runs once before all tests to prepare the environment
 */
async function globalSetup(config: FullConfig) {
  console.log('🚀 Starting global test setup...');
  
  // Start a browser instance to verify the environment
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  try {
    // Verify the test environment
    console.log('📋 Verifying test environment...');
    
    // Check if the dev server is accessible
    const response = await page.goto('http://localhost:3000', { 
      waitUntil: 'networkidle',
      timeout: 30000 
    });
    
    if (!response || !response.ok()) {
      throw new Error(`Dev server not accessible: ${response?.status()}`);
    }
    
    // Verify the app is loaded
    await page.waitForSelector('[data-testid="responsive-app"]', { 
      timeout: 10000 
    });
    
    console.log('✅ Test environment verified successfully');
    
    // Store environment info for tests
    const environmentInfo = {
      userAgent: await page.evaluate(() => navigator.userAgent),
      viewport: await page.viewportSize(),
      timestamp: new Date().toISOString(),
      nodeVersion: process.version,
      platform: process.platform
    };
    
    // Save environment info for use in tests
    await page.evaluate((info) => {
      (window as any).__TEST_ENVIRONMENT__ = info;
    }, environmentInfo);
    
  } catch (error) {
    console.error('❌ Global setup failed:', error);
    throw error;
  } finally {
    await browser.close();
  }
  
  console.log('🎉 Global setup completed successfully');
}

export default globalSetup;
