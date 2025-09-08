/**
 * Unit tests for PostCSS plugin core functionality
 * Tests individual functions and components in isolation
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import postcss from 'postcss';
import plugin from '../index';
import type { PostCSSPluginOptions } from '../index';
import {
  processCss,
  processCssWithWarnings,
  generateTestCSS,
  generateMalformedCSS,
  countOccurrences,
  extractCustomProperties,
  extractMediaQueries,
  extractRreFunctions,
  validateCSS,
  createTestCase,
  runTestCase,
  measureTime,
  measureTimeAsync,
  defaultTestOptions,
  developmentTestOptions,
  productionTestOptions
} from './utils/test-helpers';

describe('PostCSS Plugin Unit Tests', () => {
  describe('Basic rre() Function Processing', () => {
    it('should transform simple rre() function calls', async () => {
      const input = `
        .button {
          font-size: rre(18);
          padding: rre(16);
        }
      `;
      
      const output = await processCss(input, defaultTestOptions);
      
      expect(output).toContain('var(--rre-font-size)');
      expect(output).toContain('var(--rre-padding)');
      expect(output).toContain(':root');
    });

    it('should handle rre() with token parameter', async () => {
      const input = `
        .text {
          font-size: rre(24, 'fontSize');
        }
      `;
      
      const output = await processCss(input, defaultTestOptions);
      
      expect(output).toContain('var(--rre-font-size)');
      expect(output).toContain(':root');
    });

    it('should handle rre() with numeric token parameter', async () => {
      const input = `
        .spacing {
          padding: rre(16, spacing);
        }
      `;
      
      const output = await processCss(input, defaultTestOptions);
      
      expect(output).toContain('var(--rre-padding)');
      expect(output).toContain(':root');
    });

    it('should handle multiple rre() calls in one declaration', async () => {
      const input = `
        .complex {
          margin: rre(10) rre(20) rre(10) rre(20);
        }
      `;
      
      const output = await processCss(input, defaultTestOptions);
      
      expect(output).toContain('var(--rre-margin)');
      expect(output).toContain(':root');
    });

    it('should handle rre() in calc() functions', async () => {
      const input = `
        .calculated {
          width: calc(100% - rre(40));
        }
      `;
      
      const output = await processCss(input, defaultTestOptions);
      
      expect(output).toContain('calc(100% - var(--rre-width))');
    });

    it('should preserve non-rre() values', async () => {
      const input = `
        .mixed {
          font-size: rre(18);
          color: red;
          background: #fff;
          border: 1px solid black;
        }
      `;
      
      const output = await processCss(input, defaultTestOptions);
      
      expect(output).toContain('color: red');
      expect(output).toContain('background: #fff');
      expect(output).toContain('border: 1px solid black');
    });
  });

  describe('CSS Custom Properties Generation', () => {
    it('should generate :root rule with custom properties', async () => {
      const input = `
        .element {
          margin: rre(20);
          padding: rre(16);
        }
      `;
      
      const output = await processCss(input, {
        ...defaultTestOptions,
        customPropertyPrefix: '--my-prefix'
      });
      
      expect(output).toContain(':root');
      expect(output).toContain('--my-prefix-margin: 20px');
      expect(output).toContain('--my-prefix-padding: 16px');
    });

    it('should generate responsive variants in media queries', async () => {
      const input = `
        .text {
          font-size: rre(24);
        }
      `;
      
      const output = await processCss(input, defaultTestOptions);
      
      // Should contain media queries for different breakpoints
      expect(output).toContain('@media (max-width: 390px)'); // mobile
      expect(output).toContain('@media (max-width: 768px)'); // tablet
      expect(output).toContain('@media (max-width: 1366px)'); // laptop
    });

    it('should not generate custom properties when disabled', async () => {
      const input = `
        .button {
          font-size: rre(18);
        }
      `;
      
      const output = await processCss(input, {
        ...defaultTestOptions,
        generateCustomProperties: false
      });
      
      expect(output).toContain('18px');
      expect(output).not.toContain('var(');
      expect(output).not.toContain(':root');
    });

    it('should use custom property prefix', async () => {
      const input = `
        .custom {
          font-size: rre(16);
        }
      `;
      
      const output = await processCss(input, {
        ...defaultTestOptions,
        customPropertyPrefix: '--custom'
      });
      
      expect(output).toContain('var(--custom-font-size)');
      expect(output).toContain('--custom-font-size: 16px');
    });
  });

  describe('@custom-media Rules Generation', () => {
    it('should generate @custom-media rules', async () => {
      const input = `
        .component {
          color: blue;
        }
      `;
      
      const output = await processCss(input, defaultTestOptions);
      
      expect(output).toContain('@custom-media --mobile (max-width: 390px)');
      expect(output).toContain('@custom-media --tablet (max-width: 768px)');
      expect(output).toContain('@custom-media --laptop (max-width: 1366px)');
      expect(output).toContain('@custom-media --desktop (max-width: 1920px)');
    });

    it('should not generate @custom-media when disabled', async () => {
      const input = `
        .component {
          color: blue;
        }
      `;
      
      const output = await processCss(input, {
        ...defaultTestOptions,
        generateCustomMedia: false
      });
      
      expect(output).not.toContain('@custom-media');
    });
  });

  describe('Development Mode', () => {
    it('should add comments in development mode', async () => {
      const input = `
        .button {
          font-size: rre(18);
        }
      `;
      
      const output = await processCss(input, developmentTestOptions);
      
      expect(output).toContain('Generated by @react-responsive-easy/postcss-plugin');
      expect(output).toContain('Custom media queries generated');
    });

    it('should not add comments in production mode', async () => {
      const input = `
        .button {
          font-size: rre(18);
        }
      `;
      
      const output = await processCss(input, productionTestOptions);
      
      expect(output).not.toContain('Generated by @react-responsive-easy/postcss-plugin');
      expect(output).not.toContain('Custom media queries generated');
    });
  });

  describe('Error Handling', () => {
    it('should handle malformed rre() calls gracefully', async () => {
      const input = `
        .malformed {
          font-size: rre();
          padding: rre(invalid);
        }
      `;
      
      const { css, errors } = await processCssWithWarnings(input, defaultTestOptions);
      
      // Should not throw and should preserve original values
      expect(errors).toHaveLength(0);
      expect(css).toContain('rre()');
      expect(css).toContain('rre(invalid)');
    });

    it('should handle empty CSS', async () => {
      const input = '';
      
      const output = await processCss(input, defaultTestOptions);
      
      expect(output).toBe('');
    });

    it('should handle CSS without rre() functions', async () => {
      const input = `
        .normal {
          color: red;
          background: blue;
        }
      `;
      
      const output = await processCss(input, defaultTestOptions);
      
      expect(output).toContain('color: red');
      expect(output).toContain('background: blue');
      expect(output).not.toContain('var(--rre-');
    });
  });

  describe('Configuration Options', () => {
    it('should use default options when none provided', async () => {
      const input = `
        .default {
          font-size: rre(16);
        }
      `;
      
      const output = await processCss(input);
      
      expect(output).toContain('var(--rre-font-size)');
      expect(output).toContain('@custom-media');
    });

    it('should respect all configuration options', async () => {
      const input = `
        .configured {
          font-size: rre(16);
        }
      `;
      
      const options: PostCSSPluginOptions = {
        generateCustomProperties: true,
        generateCustomMedia: true,
        customPropertyPrefix: '--test',
        development: true
      };
      
      const output = await processCss(input, options);
      
      expect(output).toContain('var(--test-font-size)');
      expect(output).toContain('--test-font-size: 16px');
      expect(output).toContain('@custom-media');
      expect(output).toContain('Generated by @react-responsive-easy/postcss-plugin');
    });
  });

  describe('Value Scaling and Calculations', () => {
    it('should scale values correctly for different breakpoints', async () => {
      const input = `
        .scaled {
          font-size: rre(24);
        }
      `;
      
      const output = await processCss(input, defaultTestOptions);
      
      // Check that different values are generated for different breakpoints
      const mobileMatch = output.match(/@media \(max-width: 390px\)[^}]*--rre-font-size: ([^;]+);/);
      const tabletMatch = output.match(/@media \(max-width: 768px\)[^}]*--rre-font-size: ([^;]+);/);
      
      expect(mobileMatch).toBeTruthy();
      expect(tabletMatch).toBeTruthy();
      
      if (mobileMatch && tabletMatch) {
        const mobileValue = parseFloat(mobileMatch[1]);
        const tabletValue = parseFloat(tabletMatch[1]);
        
        // Mobile should have smaller value than tablet
        expect(mobileValue).toBeLessThan(tabletValue);
      }
    });

    it('should apply token-specific scaling', async () => {
      const input = `
        .font-token {
          font-size: rre(20, 'fontSize');
        }
        .spacing-token {
          padding: rre(20, 'spacing');
        }
      `;
      
      const output = await processCss(input, defaultTestOptions);
      
      // Both should be transformed but with different scaling
      expect(output).toContain('var(--rre-font-size)');
      expect(output).toContain('var(--rre-padding)');
    });
  });

  describe('CSS Validation', () => {
    it('should generate valid CSS syntax', async () => {
      const input = generateTestCSS(10);
      
      const output = await processCss(input, defaultTestOptions);
      
      const validation = validateCSS(output);
      expect(validation.valid).toBe(true);
      expect(validation.errors).toHaveLength(0);
    });

    it('should handle complex CSS structures', async () => {
      const input = `
        .container {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(rre(300), 1fr));
          gap: rre(24);
        }
        
        @media (max-width: 768px) {
          .container {
            grid-template-columns: 1fr;
            gap: rre(16);
          }
        }
      `;
      
      const output = await processCss(input, defaultTestOptions);
      
      const validation = validateCSS(output);
      expect(validation.valid).toBe(true);
    });
  });

  describe('Performance Characteristics', () => {
    it('should process small CSS quickly', async () => {
      const input = generateTestCSS(5);
      
      const { time } = await measureTimeAsync(async () => {
        await processCss(input, defaultTestOptions);
      });
      
      // Should process in less than 100ms
      expect(time).toBeLessThan(100);
    });

    it('should handle moderate CSS efficiently', async () => {
      const input = generateTestCSS(50);
      
      const { time } = await measureTimeAsync(async () => {
        await processCss(input, defaultTestOptions);
      });
      
      // Should process in less than 500ms
      expect(time).toBeLessThan(500);
    });
  });

  describe('Utility Functions', () => {
    it('should count rre() functions correctly', () => {
      const css = `
        .test1 { font-size: rre(16); }
        .test2 { padding: rre(20); margin: rre(10); }
      `;
      
      const count = countOccurrences(css, /rre\(/g);
      expect(count).toBe(3);
    });

    it('should extract custom properties correctly', async () => {
      const input = `
        .test {
          font-size: rre(16);
          padding: rre(20);
        }
      `;
      
      const output = await processCss(input, defaultTestOptions);
      const customProps = extractCustomProperties(output);
      
      expect(customProps).toContain('--rre-font-size');
      expect(customProps).toContain('--rre-padding');
    });

    it('should extract media queries correctly', async () => {
      const input = `
        .test {
          font-size: rre(16);
        }
      `;
      
      const output = await processCss(input, defaultTestOptions);
      const mediaQueries = extractMediaQueries(output);
      
      expect(mediaQueries.length).toBeGreaterThan(0);
      expect(mediaQueries[0]).toContain('@media');
    });

    it('should extract rre() functions correctly', () => {
      const css = `
        .test1 { font-size: rre(16, 'fontSize'); }
        .test2 { padding: rre(20); }
      `;
      
      const functions = extractRreFunctions(css);
      
      expect(functions).toContain("rre(16, 'fontSize')");
      expect(functions).toContain('rre(20)');
    });
  });

  describe('Test Case Management', () => {
    it('should create and run test cases correctly', async () => {
      const testCase = createTestCase(
        'simple test',
        '.test { font-size: rre(16); }',
        'var(--rre-font-size)'
      );
      
      const result = await runTestCase(testCase);
      
      expect(result.passed).toBe(true);
      expect(result.errors).toHaveLength(0);
      expect(result.output).toContain('var(--rre-font-size)');
    });

    it('should handle failing test cases', async () => {
      const testCase = createTestCase(
        'failing test',
        '.test { font-size: rre(16); }',
        'nonexistent-pattern'
      );
      
      const result = await runTestCase(testCase);
      
      expect(result.passed).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });
  });

  describe('Edge Cases', () => {
    it('should handle CSS with comments', async () => {
      const input = `
        /* This is a comment */
        .test {
          font-size: rre(16); /* Another comment */
        }
      `;
      
      const output = await processCss(input, defaultTestOptions);
      
      expect(output).toContain('var(--rre-font-size)');
      expect(output).toContain('This is a comment');
    });

    it('should handle CSS with existing custom properties', async () => {
      const input = `
        :root {
          --existing-prop: 20px;
        }
        .test {
          font-size: rre(16);
        }
      `;
      
      const output = await processCss(input, defaultTestOptions);
      
      expect(output).toContain('--existing-prop: 20px');
      expect(output).toContain('var(--rre-font-size)');
    });

    it('should handle CSS with existing media queries', async () => {
      const input = `
        @media (max-width: 600px) {
          .existing { color: red; }
        }
        .test {
          font-size: rre(16);
        }
      `;
      
      const output = await processCss(input, defaultTestOptions);
      
      expect(output).toContain('color: red');
      expect(output).toContain('var(--rre-font-size)');
    });

    it('should handle nested selectors', async () => {
      const input = `
        .parent {
          .child {
            font-size: rre(16);
          }
        }
      `;
      
      const output = await processCss(input, defaultTestOptions);
      
      expect(output).toContain('var(--rre-font-size)');
    });

    it('should handle pseudo-selectors', async () => {
      const input = `
        .button:hover {
          font-size: rre(18);
        }
        .input:focus {
          padding: rre(12);
        }
      `;
      
      const output = await processCss(input, defaultTestOptions);
      
      expect(output).toContain('var(--rre-font-size)');
      expect(output).toContain('var(--rre-padding)');
    });
  });
});
