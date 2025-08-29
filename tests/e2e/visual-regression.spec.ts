import { test, expect } from '@playwright/test';

/**
 * Visual regression tests for React Responsive Easy
 * Ensures UI consistency across different breakpoints
 */
test.describe('Visual Regression Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('[data-testid="responsive-app"]', { timeout: 10000 });
    
    // Wait for any animations to complete
    await page.waitForTimeout(1000);
  });

  test.describe('Hero Section', () => {
    test('should maintain visual hierarchy on desktop', async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await page.waitForTimeout(500);
      
      // Take screenshot of hero section
      const heroSection = page.locator('[data-testid="hero-section"]');
      await expect(heroSection).toHaveScreenshot('hero-desktop.png');
      
      // Verify layout proportions
      const title = page.locator('[data-testid="hero-title"]');
      const button = page.locator('[data-testid="hero-button"]');
      
      const titleBox = await title.boundingBox();
      const buttonBox = await button.boundingBox();
      
      // Ensure elements are visible and have bounding boxes
      expect(titleBox).toBeTruthy();
      expect(buttonBox).toBeTruthy();
      
      // Title should be prominently sized
      expect(titleBox!.height).toBeGreaterThan(60);
      
      // Button should be appropriately sized for desktop
      expect(buttonBox!.width).toBeGreaterThan(120);
      expect(buttonBox!.height).toBeGreaterThan(48);
    });

    test('should adapt layout for tablet', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 });
      await page.waitForTimeout(500);
      
      const heroSection = page.locator('[data-testid="hero-section"]');
      await expect(heroSection).toHaveScreenshot('hero-tablet.png');
      
      // Layout should adapt for tablet
      const title = page.locator('[data-testid="hero-title"]');
      const titleBox = await title.boundingBox();
      
      // Ensure element has bounding box
      expect(titleBox).toBeTruthy();
      
      // Title should be scaled down but still prominent
      expect(titleBox!.height).toBeGreaterThan(40);
      expect(titleBox!.height).toBeLessThan(80);
    });

    test('should optimize for mobile', async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 844 });
      await page.waitForTimeout(500);
      
      const heroSection = page.locator('[data-testid="hero-section"]');
      await expect(heroSection).toHaveScreenshot('hero-mobile.png');
      
      // Mobile-specific layout checks
      const title = page.locator('[data-testid="hero-title"]');
      const button = page.locator('[data-testid="hero-button"]');
      
      const titleBox = await title.boundingBox();
      const buttonBox = await button.boundingBox();
      
      // Title should be readable on mobile
      expect(titleBox.height).toBeGreaterThan(32);
      
      // Button should meet mobile accessibility standards
      expect(buttonBox.width).toBeGreaterThan(44);
      expect(buttonBox.height).toBeGreaterThan(44);
      
      // Button should be touch-friendly
      expect(buttonBox.width).toBeGreaterThanOrEqual(buttonBox.height);
    });
  });

  test.describe('Feature Cards', () => {
    test('should maintain card grid layout on desktop', async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await page.waitForTimeout(500);
      
      const cardsContainer = page.locator('[data-testid="feature-cards"]');
      await expect(cardsContainer).toHaveScreenshot('feature-cards-desktop.png');
      
      // Check grid layout
      const cards = page.locator('[data-testid="feature-card"]');
      const cardCount = await cards.count();
      
      // Should have multiple cards in a grid
      expect(cardCount).toBeGreaterThan(1);
      
      // Cards should be arranged horizontally on desktop
      const firstCard = cards.first();
      const lastCard = cards.last();
      
      const firstCardBox = await firstCard.boundingBox();
      const lastCardBox = await lastCard.boundingBox();
      
      // Cards should be side by side on desktop
      expect(firstCardBox.y).toBeCloseTo(lastCardBox.y, 10);
      expect(lastCardBox.x).toBeGreaterThan(firstCardBox.x);
    });

    test('should stack cards vertically on mobile', async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 844 });
      await page.waitForTimeout(500);
      
      const cardsContainer = page.locator('[data-testid="feature-cards"]');
      await expect(cardsContainer).toHaveScreenshot('feature-cards-mobile.png');
      
      // Check vertical stacking
      const cards = page.locator('[data-testid="feature-card"]');
      const cardCount = await cards.count();
      
      if (cardCount > 1) {
        const firstCard = cards.first();
        const secondCard = cards.nth(1);
        
        const firstCardBox = await firstCard.boundingBox();
        const secondCardBox = await secondCard.boundingBox();
        
        // Cards should be stacked vertically on mobile
        expect(secondCardBox.y).toBeGreaterThan(firstCardBox.y);
        expect(secondCardBox.x).toBeCloseTo(firstCardBox.x, 10);
      }
    });
  });

  test.describe('Navigation & Layout', () => {
    test('should maintain navigation accessibility across breakpoints', async ({ page }) => {
      const breakpoints = [
        { width: 1920, height: 1080, name: 'desktop' },
        { width: 768, height: 1024, name: 'tablet' },
        { width: 390, height: 844, name: 'mobile' }
      ];
      
      for (const breakpoint of breakpoints) {
        await page.setViewportSize(breakpoint);
        await page.waitForTimeout(500);
        
        const nav = page.locator('[data-testid="navigation"]');
        await expect(nav).toHaveScreenshot(`navigation-${breakpoint.name}.png`);
        
        // Navigation should always be visible and accessible
        await expect(nav).toBeVisible();
        
        // Check navigation items
        const navItems = nav.locator('[data-testid="nav-item"]');
        const itemCount = await navItems.count();
        
        if (itemCount > 0) {
          const firstItem = navItems.first();
          const itemBox = await firstItem.boundingBox();
          
          // Navigation items should meet accessibility standards
          expect(itemBox.height).toBeGreaterThanOrEqual(44);
          expect(itemBox.width).toBeGreaterThanOrEqual(44);
        }
      }
    });

    test('should maintain consistent spacing and alignment', async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await page.waitForTimeout(500);
      
      // Check consistent spacing between sections
      const sections = page.locator('[data-testid="section"]');
      const sectionCount = await sections.count();
      
      if (sectionCount > 1) {
        const firstSection = sections.first();
        const secondSection = sections.nth(1);
        
        const firstBox = await firstSection.boundingBox();
        const secondBox = await secondSection.boundingBox();
        
        // Sections should have consistent spacing
        const spacing = secondBox.y - (firstBox.y + firstBox.height);
        expect(spacing).toBeGreaterThan(20);
        expect(spacing).toBeLessThan(100);
      }
    });
  });

  test.describe('Responsive Typography', () => {
    test('should maintain readable text across all breakpoints', async ({ page }) => {
      const breakpoints = [
        { width: 1920, height: 1080, name: 'desktop' },
        { width: 768, height: 1024, name: 'tablet' },
        { width: 390, height: 844, name: 'mobile' }
      ];
      
      for (const breakpoint of breakpoints) {
        await page.setViewportSize(breakpoint);
        await page.waitForTimeout(500);
        
        // Check all text elements maintain readability
        const textElements = page.locator('h1, h2, h3, p, span, button');
        const elementCount = await textElements.count();
        
        for (let i = 0; i < Math.min(elementCount, 5); i++) {
          const element = textElements.nth(i);
          const isVisible = await element.isVisible();
          
          if (isVisible) {
            const fontSize = await element.evaluate(el => 
              parseInt(window.getComputedStyle(el).fontSize)
            );
            
            // Text should always be readable
            expect(fontSize).toBeGreaterThanOrEqual(12);
            
            // Check contrast and visibility
            const color = await element.evaluate(el => 
              window.getComputedStyle(el).color
            );
            
            // Should have a defined color (not transparent)
            expect(color).not.toBe('rgba(0, 0, 0, 0)');
            expect(color).not.toBe('transparent');
          }
        }
      }
    });

    test('should scale typography proportionally', async ({ page }) => {
      // Test that typography scales proportionally
      await page.setViewportSize({ width: 1920, height: 1080 });
      await page.waitForTimeout(500);
      
      const desktopTitle = await page.locator('[data-testid="hero-title"]').evaluate(el => 
        parseInt(window.getComputedStyle(el).fontSize)
      );
      
      await page.setViewportSize({ width: 390, height: 844 });
      await page.waitForTimeout(500);
      
      const mobileTitle = await page.locator('[data-testid="hero-title"]').evaluate(el => 
        parseInt(window.getComputedStyle(el).fontSize)
      );
      
      // Mobile title should be smaller but proportional
      expect(mobileTitle).toBeLessThan(desktopTitle);
      
      // Should maintain reasonable proportions (not too small)
      const scaleRatio = mobileTitle / desktopTitle;
      expect(scaleRatio).toBeGreaterThan(0.4);
      expect(scaleRatio).toBeLessThan(0.8);
    });
  });

  test.describe('Interactive Elements', () => {
    test('should maintain button accessibility across breakpoints', async ({ page }) => {
      const breakpoints = [
        { width: 1920, height: 1080, name: 'desktop' },
        { width: 768, height: 1024, name: 'tablet' },
        { width: 390, height: 844, name: 'mobile' }
      ];
      
      for (const breakpoint of breakpoints) {
        await page.setViewportSize(breakpoint);
        await page.waitForTimeout(500);
        
        const buttons = page.locator('button, [role="button"]');
        const buttonCount = await buttons.count();
        
        for (let i = 0; i < Math.min(buttonCount, 3); i++) {
          const button = buttons.nth(i);
          const isVisible = await button.isVisible();
          
          if (isVisible) {
            const buttonBox = await button.boundingBox();
            
            // Buttons should meet accessibility standards
            expect(buttonBox.width).toBeGreaterThanOrEqual(44);
            expect(buttonBox.height).toBeGreaterThanOrEqual(44);
            
            // Check button text is readable
            const buttonText = await button.textContent();
            if (buttonText && buttonText.trim()) {
              const fontSize = await button.evaluate(el => 
                parseInt(window.getComputedStyle(el).fontSize)
              );
              expect(fontSize).toBeGreaterThanOrEqual(12);
            }
          }
        }
      }
    });

    test('should maintain hover and focus states', async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await page.waitForTimeout(500);
      
      const buttons = page.locator('button, [role="button"]');
      const buttonCount = await buttons.count();
      
      if (buttonCount > 0) {
        const firstButton = buttons.first();
        
        // Test focus state
        await firstButton.focus();
        await page.waitForTimeout(100);
        
        // Should have focus indicator
        const hasFocus = await firstButton.evaluate(el => 
          document.activeElement === el
        );
        expect(hasFocus).toBe(true);
        
        // Test hover state (if supported)
        await firstButton.hover();
        await page.waitForTimeout(100);
        
        // Button should still be visible and accessible
        await expect(firstButton).toBeVisible();
      }
    });
  });
});
