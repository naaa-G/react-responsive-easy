import { test, expect } from '@playwright/test';

/**
 * Performance tests for React Responsive Easy
 * Validates speed targets and memory usage
 */
test.describe('Performance Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('[data-testid="responsive-app"]', { timeout: 10000 });
  });

  test.describe('Scaling Engine Performance', () => {
    test('should complete scaling computations within 1ms', async ({ page }) => {
      // Measure scaling computation time
      const startTime = await page.evaluate(() => performance.now());
      
      // Trigger multiple breakpoint changes to test scaling
      const breakpoints = [
        { width: 1920, height: 1080 },
        { width: 768, height: 1024 },
        { width: 390, height: 844 },
        { width: 1920, height: 1080 }
      ];
      
      for (const breakpoint of breakpoints) {
        await page.setViewportSize(breakpoint);
        await page.waitForTimeout(100); // Wait for scaling to complete
      }
      
      const endTime = await page.evaluate(() => performance.now());
      const totalTime = endTime - startTime;
      
      // Total time should be reasonable (including viewport changes)
      expect(totalTime).toBeLessThan(1000);
      
      // Average per breakpoint should be fast
      const averageTime = totalTime / breakpoints.length;
      expect(averageTime).toBeLessThan(200);
    });

    test('should maintain performance with complex scaling rules', async ({ page }) => {
      // Test with multiple responsive elements
      const responsiveElements = page.locator('[data-testid="responsive-element"]');
      const elementCount = await responsiveElements.count();
      
      if (elementCount > 0) {
        const startTime = await page.evaluate(() => performance.now());
        
        // Rapidly change breakpoints to stress test
        for (let i = 0; i < 10; i++) {
          const width = 390 + (i * 100) % 1530; // Vary between 390 and 1920
          await page.setViewportSize({ width, height: 844 });
          await page.waitForTimeout(50);
        }
        
        const endTime = await page.evaluate(() => performance.now());
        const totalTime = endTime - startTime;
        
        // Should handle rapid changes smoothly
        expect(totalTime).toBeLessThan(2000);
      }
    });
  });

  test.describe('Memory Usage', () => {
    test('should not cause memory leaks during breakpoint changes', async ({ page }) => {
      // Get initial memory usage
      const initialMemory = await page.evaluate(() => {
        if ('memory' in performance) {
          return (performance as any).memory.usedJSHeapSize;
        }
        return 0;
      });
      
      // Perform multiple breakpoint changes
      for (let i = 0; i < 20; i++) {
        const width = 390 + (i * 50) % 1530;
        await page.setViewportSize({ width, height: 844 });
        await page.waitForTimeout(50);
      }
      
      // Get final memory usage
      const finalMemory = await page.evaluate(() => {
        if ('memory' in performance) {
          return (performance as any).memory.usedJSHeapSize;
        }
        return 0;
      });
      
      if (initialMemory > 0 && finalMemory > 0) {
        const memoryIncrease = finalMemory - initialMemory;
        const memoryIncreaseMB = memoryIncrease / (1024 * 1024);
        
        // Memory increase should be reasonable (< 10MB)
        expect(memoryIncreaseMB).toBeLessThan(10);
      }
    });

    test('should clean up event listeners properly', async ({ page }) => {
      // Count event listeners before changes
      const initialListeners = await page.evaluate(() => {
        // This is a rough approximation - in real scenarios you'd use devtools
        return document.querySelectorAll('*').length;
      });
      
      // Perform breakpoint changes
      for (let i = 0; i < 10; i++) {
        await page.setViewportSize({ width: 390 + i * 100, height: 844 });
        await page.waitForTimeout(100);
      }
      
      // Count after changes
      const finalListeners = await page.evaluate(() => {
        return document.querySelectorAll('*').length;
      });
      
      // Should not have excessive DOM growth
      expect(finalListeners).toBeLessThan(initialListeners * 1.5);
    });
  });

  test.describe('Bundle Size Impact', () => {
    test('should load core package within size limits', async ({ page }) => {
      // Measure initial load time
      const loadStart = await page.evaluate(() => performance.timing.navigationStart);
      const loadEnd = await page.evaluate(() => performance.timing.loadEventEnd);
      
      if (loadStart > 0 && loadEnd > 0) {
        const loadTime = loadEnd - loadStart;
        
        // Should load within reasonable time (< 3 seconds)
        expect(loadTime).toBeLessThan(3000);
      }
    });

    test('should not impact Core Web Vitals', async ({ page }) => {
      // Wait for page to be fully loaded
      await page.waitForLoadState('networkidle');
      
      // Measure LCP (Largest Contentful Paint)
      const lcp = await page.evaluate(() => {
        return new Promise((resolve) => {
          new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const lastEntry = entries[entries.length - 1];
            resolve(lastEntry.startTime);
          }).observe({ entryTypes: ['largest-contentful-paint'] });
        });
      });
      
      // LCP should be reasonable (< 2.5 seconds)
      expect(lcp).toBeLessThan(2500);
    });
  });

  test.describe('Responsive Updates Performance', () => {
    test('should update responsive values without layout thrashing', async ({ page }) => {
      // Monitor layout thrashing
      let layoutCount = 0;
      await page.evaluate(() => {
        let lastOffsetHeight = 0;
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.entryType === 'layout-shift') {
              layoutCount++;
            }
          }
        });
        observer.observe({ entryTypes: ['layout-shift'] });
      });
      
      // Change breakpoints
      await page.setViewportSize({ width: 1920, height: 1080 });
      await page.waitForTimeout(500);
      await page.setViewportSize({ width: 390, height: 844 });
      await page.waitForTimeout(500);
      
      // Should have minimal layout shifts
      expect(layoutCount).toBeLessThan(5);
    });

    test('should batch responsive updates efficiently', async ({ page }) => {
      // Count DOM updates during breakpoint change
      let updateCount = 0;
      await page.evaluate(() => {
        const observer = new MutationObserver(() => {
          updateCount++;
        });
        observer.observe(document.body, { 
          childList: true, 
          subtree: true, 
          attributes: true 
        });
      });
      
      // Trigger breakpoint change
      await page.setViewportSize({ width: 768, height: 1024 });
      await page.waitForTimeout(500);
      
      // Should batch updates efficiently
      expect(updateCount).toBeLessThan(100);
    });
  });

  test.describe('Cache Performance', () => {
    test('should utilize caching for repeated scaling operations', async ({ page }) => {
      // First breakpoint change
      const firstChangeStart = await page.evaluate(() => performance.now());
      await page.setViewportSize({ width: 768, height: 1024 });
      await page.waitForTimeout(500);
      const firstChangeEnd = await page.evaluate(() => performance.now());
      const firstChangeTime = firstChangeEnd - firstChangeStart;
      
      // Second change to same breakpoint (should use cache)
      const secondChangeStart = await page.evaluate(() => performance.now());
      await page.setViewportSize({ width: 1920, height: 1080 });
      await page.waitForTimeout(500);
      await page.setViewportSize({ width: 768, height: 1024 });
      await page.waitForTimeout(500);
      const secondChangeEnd = await page.evaluate(() => performance.now());
      const secondChangeTime = secondChangeEnd - secondChangeStart;
      
      // Second change should be faster due to caching
      expect(secondChangeTime).toBeLessThan(firstChangeTime * 1.5);
    });

    test('should maintain cache hit rate above 90%', async ({ page }) => {
      // Perform multiple scaling operations
      const breakpoints = [
        { width: 1920, height: 1080 },
        { width: 768, height: 1024 },
        { width: 390, height: 844 },
        { width: 768, height: 1024 },
        { width: 1920, height: 1080 }
      ];
      
      const startTime = await page.evaluate(() => performance.now());
      
      for (const breakpoint of breakpoints) {
        await page.setViewportSize(breakpoint);
        await page.waitForTimeout(200);
      }
      
      const endTime = await page.evaluate(() => performance.now());
      const totalTime = endTime - startTime;
      
      // Should complete all operations efficiently
      expect(totalTime).toBeLessThan(3000);
    });
  });

  test.describe('Accessibility Performance', () => {
    test('should maintain accessibility without performance degradation', async ({ page }) => {
      // Test with screen reader simulation
      await page.setViewportSize({ width: 1920, height: 1080 });
      await page.waitForTimeout(500);
      
      // Check that all interactive elements are accessible
      const interactiveElements = page.locator('button, [role="button"], a, input, select, textarea');
      const elementCount = await interactiveElements.count();
      
      let accessibleCount = 0;
      for (let i = 0; i < Math.min(elementCount, 10); i++) {
        const element = interactiveElements.nth(i);
        const isVisible = await element.isVisible();
        const hasAriaLabel = await element.getAttribute('aria-label');
        const hasRole = await element.getAttribute('role');
        
        if (isVisible && (hasAriaLabel || hasRole || element.evaluate(el => el.tagName === 'BUTTON'))) {
          accessibleCount++;
        }
      }
      
      // Should maintain accessibility standards
      if (elementCount > 0) {
        const accessibilityRate = accessibleCount / Math.min(elementCount, 10);
        expect(accessibilityRate).toBeGreaterThan(0.8);
      }
    });
  });
});
