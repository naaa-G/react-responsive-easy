import { test, expect } from '@playwright/test';

/**
 * E2E tests for React Responsive Easy hooks
 * Tests responsive behavior across different breakpoints
 */
test.describe('Responsive Hooks E2E', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the test page
    await page.goto('/');
    
    // Wait for the app to load
    await page.waitForSelector('[data-testid="responsive-app"]', { timeout: 10000 });
  });

  test.describe('useResponsiveValue Hook', () => {
    test('should scale font size correctly across breakpoints', async ({ page }) => {
      // Test desktop breakpoint (1920x1080)
      await page.setViewportSize({ width: 1920, height: 1080 });
      await page.waitForTimeout(500); // Wait for responsive updates
      
      const desktopFontSize = await page.locator('[data-testid="hero-title"]').evaluate(el => 
        window.getComputedStyle(el).fontSize
      );
      
      expect(desktopFontSize).toBe('48px'); // Base size
      
      // Test tablet breakpoint (768x1024)
      await page.setViewportSize({ width: 768, height: 1024 });
      await page.waitForTimeout(500);
      
      const tabletFontSize = await page.locator('[data-testid="hero-title"]').evaluate(el => 
        window.getComputedStyle(el).fontSize
      );
      
      // Should be scaled down from desktop
      expect(parseInt(tabletFontSize)).toBeLessThan(48);
      expect(parseInt(tabletFontSize)).toBeGreaterThan(12); // More realistic expectation
      
      // Test mobile breakpoint (390x844)
      await page.setViewportSize({ width: 390, height: 844 });
      await page.waitForTimeout(500);
      
      const mobileFontSize = await page.locator('[data-testid="hero-title"]').evaluate(el => 
        window.getComputedStyle(el).fontSize
      );
      
      // Should be further scaled down
      expect(parseInt(mobileFontSize)).toBeLessThan(parseInt(tabletFontSize));
      expect(parseInt(mobileFontSize)).toBeGreaterThanOrEqual(12); // Min constraint
    });

    test('should apply token-specific scaling rules', async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await page.waitForTimeout(500);
      
      // Test spacing token with step constraint
      const buttonPadding = await page.locator('[data-testid="hero-button"]').evaluate(el => 
        window.getComputedStyle(el).padding
      );
      
      // Should respect step constraint (step: 2)
      const paddingValue = parseInt(buttonPadding);
      expect(paddingValue % 2).toBe(0);
      
      // Test radius token scaling
      const buttonRadius = await page.locator('[data-testid="hero-button"]').evaluate(el => 
        window.getComputedStyle(el).borderRadius
      );
      
      expect(buttonRadius).toBe('8px'); // Base radius
    });
  });

  test.describe('useScaledStyle Hook', () => {
    test('should scale all numeric values in style objects', async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await page.waitForTimeout(500);
      
      const cardStyle = await page.locator('[data-testid="feature-card"]').first().evaluate(el => {
        const style = window.getComputedStyle(el);
        return {
          padding: style.padding,
          margin: style.margin,
          borderRadius: style.borderRadius,
          fontSize: style.fontSize
        };
      });
      
      // All values should be scaled appropriately
      expect(cardStyle.padding).toBe('24px');
      expect(cardStyle.margin).toBe('16px');
      expect(cardStyle.borderRadius).toBe('12px');
      expect(cardStyle.fontSize).toBe('18px');
      
      // Test mobile scaling
      await page.setViewportSize({ width: 390, height: 844 });
      await page.waitForTimeout(500);
      
      const mobileCardStyle = await page.locator('[data-testid="feature-card"]').first().evaluate(el => {
        const style = window.getComputedStyle(el);
        return {
          padding: style.padding,
          margin: style.margin,
          borderRadius: style.borderRadius,
          fontSize: style.fontSize
        };
      });
      
      // Values should be scaled down on mobile
      expect(parseInt(mobileCardStyle.padding)).toBeLessThan(24);
      expect(parseInt(mobileCardStyle.margin)).toBeLessThan(16);
      expect(parseInt(mobileCardStyle.borderRadius)).toBeLessThan(12);
      expect(parseInt(mobileCardStyle.fontSize)).toBeLessThan(18);
    });
  });

  test.describe('useBreakpoint Hook', () => {
    test('should detect current breakpoint correctly', async ({ page }) => {
      // Test desktop breakpoint
      await page.setViewportSize({ width: 1920, height: 1080 });
      await page.waitForTimeout(500);
      
      const desktopBreakpoint = await page.locator('[data-testid="breakpoint-info"]').textContent();
      expect(desktopBreakpoint).toContain('desktop');
      
      // Test tablet breakpoint
      await page.setViewportSize({ width: 768, height: 1024 });
      await page.waitForTimeout(500);
      
      const tabletBreakpoint = await page.locator('[data-testid="breakpoint-info"]').textContent();
      expect(tabletBreakpoint).toContain('tablet');
      
      // Test mobile breakpoint
      await page.setViewportSize({ width: 390, height: 844 });
      await page.waitForTimeout(500);
      
      const mobileBreakpoint = await page.locator('[data-testid="breakpoint-info"]').textContent();
      expect(mobileBreakpoint).toContain('mobile');
    });

    test('should provide breakpoint-specific values', async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await page.waitForTimeout(500);
      
      const desktopValues = await page.locator('[data-testid="breakpoint-values"]').textContent();
      expect(desktopValues).toContain('1920x1080');
      
      await page.setViewportSize({ width: 390, height: 844 });
      await page.waitForTimeout(500);
      
      const mobileValues = await page.locator('[data-testid="breakpoint-values"]').textContent();
      expect(mobileValues).toContain('390x844');
    });
  });

  test.describe('Responsive Provider', () => {
    test('should provide context to all child components', async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await page.waitForTimeout(500);
      
      // All components should have access to responsive context
      const hasContext = await page.locator('[data-testid="responsive-app"]').evaluate(el => {
        return el.hasAttribute('data-responsive-context');
      });
      
      expect(hasContext).toBe(true);
    });

    test('should handle SSR with initial breakpoint', async ({ page }) => {
      // Test that the app renders correctly on initial load
      const appContent = await page.locator('[data-testid="responsive-app"]').textContent();
      expect(appContent).toBeTruthy();
      
      // Should not have hydration mismatches
      const consoleErrors = [];
      page.on('console', msg => {
        if (msg.type() === 'error') {
          consoleErrors.push(msg.text());
        }
      });
      
      await page.waitForTimeout(1000);
      
      // Check for hydration warnings
      const hydrationErrors = consoleErrors.filter(error => 
        error.includes('hydration') || error.includes('mismatch')
      );
      
      expect(hydrationErrors).toHaveLength(0);
    });
  });

  test.describe('Performance & Accessibility', () => {
    test('should maintain performance across breakpoint changes', async ({ page }) => {
      const startTime = Date.now();
      
      // Rapidly change breakpoints
      const breakpoints = [
        { width: 1920, height: 1080 },
        { width: 768, height: 1024 },
        { width: 390, height: 844 },
        { width: 1920, height: 1080 }
      ];
      
      for (const breakpoint of breakpoints) {
        await page.setViewportSize(breakpoint);
        await page.waitForTimeout(100);
      }
      
      const endTime = Date.now();
      const totalTime = endTime - startTime;
      
      // Should complete all breakpoint changes within reasonable time
      expect(totalTime).toBeLessThan(2000);
    });

    test('should maintain accessibility standards', async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await page.waitForTimeout(500);
      
      // Check that text remains readable
      const title = page.locator('[data-testid="hero-title"]');
      const fontSize = await title.evaluate(el => 
        parseInt(window.getComputedStyle(el).fontSize)
      );
      
      // Font size should meet minimum accessibility requirements
      expect(fontSize).toBeGreaterThanOrEqual(12);
      
      // Check button tap target size on mobile
      await page.setViewportSize({ width: 390, height: 844 });
      await page.waitForTimeout(500);
      
      const button = page.locator('[data-testid="hero-button"]');
      const buttonSize = await button.boundingBox();
      
      // Button should meet minimum tap target size (44x44px)
      expect(buttonSize.width).toBeGreaterThanOrEqual(44);
      expect(buttonSize.height).toBeGreaterThanOrEqual(44);
    });
  });
});
