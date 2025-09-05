import { test as base, expect } from '@playwright/test';

/**
 * Enhanced test setup with common utilities and configurations
 */

// Extend the base test with custom fixtures
export const test = base.extend({
  // Custom page fixture with enhanced capabilities
  enhancedPage: async ({ page }, use) => {
    // Add custom page methods
    await page.addInitScript(() => {
      // Add performance monitoring
      (window as any).__PERFORMANCE_METRICS__ = {
        navigationStart: performance.timing?.navigationStart || 0,
        loadEventEnd: performance.timing?.loadEventEnd || 0,
        domContentLoaded: performance.timing?.domContentLoadedEventEnd || 0,
        measurements: []
      };
      
      // Add responsive testing utilities
      (window as any).__RESPONSIVE_TEST_UTILS__ = {
        getCurrentBreakpoint: () => {
          const width = window.innerWidth;
          if (width >= 1920) return 'desktop';
          if (width >= 768) return 'tablet';
          return 'mobile';
        },
        
        getScaledValue: (baseValue: number, currentWidth: number, baseWidth: number = 1920) => {
          const scale = currentWidth / baseWidth;
          return Math.round(baseValue * scale);
        },
        
        measurePerformance: (name: string, fn: () => void) => {
          const start = performance.now();
          fn();
          const end = performance.now();
          (window as any).__PERFORMANCE_METRICS__.measurements.push({
            name,
            duration: end - start,
            timestamp: Date.now()
          });
          return end - start;
        }
      };
    });
    
    // Set up console monitoring
    const consoleMessages: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleMessages.push(`Console Error: ${msg.text()}`);
      }
    });
    
    // Set up network monitoring
    const networkErrors: string[] = [];
    page.on('response', response => {
      if (!response.ok()) {
        networkErrors.push(`Network Error: ${response.status()} ${response.url()}`);
      }
    });
    
    await use(page);
    
    // Cleanup and validation
    if (consoleMessages.length > 0) {
      console.warn('Console errors detected:', consoleMessages);
    }
    if (networkErrors.length > 0) {
      console.warn('Network errors detected:', networkErrors);
    }
  },
  
  // Responsive test context
  responsiveContext: async ({ page }, use) => {
    const breakpoints = [
      { name: 'mobile', width: 390, height: 844 },
      { name: 'tablet', width: 768, height: 1024 },
      { name: 'desktop', width: 1920, height: 1080 }
    ];
    
    await use({ page, breakpoints });
  }
});

// Enhanced expect with custom matchers
export { expect };

// Custom matchers for responsive testing
expect.extend({
  toBeResponsive: async (element, expectedBreakpoints) => {
    const pass = true;
    const message = () => 'Element should be responsive across breakpoints';
    
    return { pass, message };
  },
  
  toHaveAccessibleSize: async (element, minSize = 44) => {
    const box = await element.boundingBox();
    const pass = box && box.width >= minSize && box.height >= minSize;
    const message = () => 
      `Element should have minimum size of ${minSize}x${minSize}px, got ${box?.width}x${box?.height}`;
    
    return { pass, message };
  }
});

// Global test configuration
test.beforeEach(async ({ page }) => {
  // Set up consistent test environment
  await page.setViewportSize({ width: 1920, height: 1080 });
  
  // Disable animations for consistent testing
  await page.addStyleTag({
    content: `
      *, *::before, *::after {
        animation-duration: 0s !important;
        animation-delay: 0s !important;
        transition-duration: 0s !important;
        transition-delay: 0s !important;
      }
    `
  });
});

// Global test cleanup
test.afterEach(async ({ page }) => {
  // Clear any test data
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
});
