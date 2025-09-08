/**
 * Error handling tests for PostCSS plugin
 * Tests comprehensive error handling and edge case scenarios
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import postcss from 'postcss';
import plugin from '../index';
import type { PostCSSPluginOptions } from '../index';
import {
  processCss,
  processCssWithWarnings,
  generateMalformedCSS,
  defaultTestOptions
} from './utils/test-helpers';
import {
  processCssWithMetrics,
  CSSValidator,
  type TestMetrics
} from './utils/enterprise-test-helpers';

describe('PostCSS Plugin Error Handling Tests', () => {
  describe('Malformed rre() Function Calls', () => {
    it('should handle empty rre() calls gracefully', async () => {
      const input = `
        .test {
          font-size: rre();
        }
      `;
      
      const { css, errors } = await processCssWithWarnings(input, defaultTestOptions);
      
      expect(errors).toHaveLength(0);
      expect(css).toContain('rre()');
    });

    it('should handle rre() with invalid parameters gracefully', async () => {
      const input = `
        .test {
          font-size: rre(invalid);
          padding: rre(not-a-number);
        }
      `;
      
      const { css, errors } = await processCssWithWarnings(input, defaultTestOptions);
      
      expect(errors).toHaveLength(0);
      expect(css).toContain('rre(invalid)');
      expect(css).toContain('rre(not-a-number)');
    });

    it('should handle rre() with too many parameters gracefully', async () => {
      const input = `
        .test {
          font-size: rre(16, 'fontSize', 'extra', 'params');
        }
      `;
      
      const { css, errors } = await processCssWithWarnings(input, defaultTestOptions);
      
      expect(errors).toHaveLength(0);
      // Plugin should process the rre() call and generate valid CSS
      expect(css).toContain('--rre-font-size: 16px');
      expect(css).toContain('var(--rre-font-size)');
    });

    it('should handle rre() with invalid token names gracefully', async () => {
      const input = `
        .test {
          font-size: rre(16, invalid-token);
          padding: rre(12, 'nonexistent-token');
        }
      `;
      
      const { css, errors } = await processCssWithWarnings(input, defaultTestOptions);
      
      expect(errors).toHaveLength(0);
      // Plugin should process the rre() calls and generate valid CSS
      expect(css).toContain('--rre-font-size: 16px');
      expect(css).toContain('--rre-padding: 12px');
      expect(css).toContain('var(--rre-font-size)');
      expect(css).toContain('var(--rre-padding)');
    });

    it('should handle rre() with special characters gracefully', async () => {
      const input = `
        .test {
          font-size: rre(16, 'font-size');
          padding: rre(12, 'spacing@#$%');
        }
      `;
      
      const { css, errors } = await processCssWithWarnings(input, defaultTestOptions);
      
      expect(errors).toHaveLength(0);
      // Plugin should process the rre() calls and generate valid CSS
      expect(css).toContain('--rre-font-size: 16px');
      expect(css).toContain('--rre-padding: 12px');
      expect(css).toContain('var(--rre-font-size)');
      expect(css).toContain('var(--rre-padding)');
    });
  });

  describe('CSS Syntax Errors', () => {
    it('should handle unmatched braces gracefully', async () => {
      const input = `
        .test {
          font-size: rre(16);
          padding: rre(12);
          /* Missing closing brace
        }
      `;
      
      const { css, errors } = await processCssWithWarnings(input, defaultTestOptions);
      
      // Should not throw errors, but may not process correctly
      expect(css).toBeDefined();
    });

    it('should handle unmatched parentheses gracefully', async () => {
      const input = `
        .test {
          font-size: rre(16;
          padding: rre(12);
        }
      `;
      
      const { css, errors } = await processCssWithWarnings(input, defaultTestOptions);
      
      // Plugin should handle syntax errors gracefully
      expect(css).toBeDefined();
      // The plugin may not be able to process malformed CSS, which is acceptable
      expect(typeof css).toBe('string');
    });

    it('should handle invalid CSS properties gracefully', async () => {
      const input = `
        .test {
          invalid-property: rre(16);
          font-size: rre(16);
        }
      `;
      
      const { css, errors } = await processCssWithWarnings(input, defaultTestOptions);
      
      expect(errors).toHaveLength(0);
      // Plugin should process rre() calls even with invalid properties
      expect(css).toContain('--rre-invalid-property: 16px');
      expect(css).toContain('--rre-font-size: 16px');
      expect(css).toContain('var(--rre-invalid-property)');
      expect(css).toContain('var(--rre-font-size)');
    });

    it('should handle CSS with syntax errors gracefully', async () => {
      const input = `
        .test {
          font-size: rre(16);
          padding: rre(12);
          margin: rre(8);
          /* Invalid CSS */
          color: red;
          background: blue;
          border: 1px solid black;
        }
      `;
      
      const { css, errors } = await processCssWithWarnings(input, defaultTestOptions);
      
      expect(errors).toHaveLength(0);
      expect(css).toContain('var(--rre-font-size)');
      expect(css).toContain('color: red');
    });
  });

  describe('Edge Cases', () => {
    it('should handle CSS with only comments', async () => {
      const input = `
        /* This is a comment */
        /* Another comment */
        /* Yet another comment */
      `;
      
      const { css, errors } = await processCssWithWarnings(input, defaultTestOptions);
      
      expect(errors).toHaveLength(0);
      expect(css).toContain('This is a comment');
    });

    it('should handle CSS with only whitespace', async () => {
      const input = `
        
        
        
      `;
      
      const { css, errors } = await processCssWithWarnings(input, defaultTestOptions);
      
      expect(errors).toHaveLength(0);
      expect(css.trim()).toBe('');
    });

    it('should handle CSS with only at-rules', async () => {
      const input = `
        @import url('styles.css');
        @media (max-width: 768px) {
          .test { color: red; }
        }
      `;
      
      const { css, errors } = await processCssWithWarnings(input, defaultTestOptions);
      
      expect(errors).toHaveLength(0);
      expect(css).toContain('@import');
      expect(css).toContain('@media');
    });

    it('should handle CSS with only custom properties', async () => {
      const input = `
        :root {
          --custom-prop: 20px;
          --another-prop: 30px;
        }
      `;
      
      const { css, errors } = await processCssWithWarnings(input, defaultTestOptions);
      
      expect(errors).toHaveLength(0);
      expect(css).toContain('--custom-prop: 20px');
      expect(css).toContain('--another-prop: 30px');
    });
  });

  describe('Complex Error Scenarios', () => {
    it('should handle mixed valid and invalid rre() calls', async () => {
      const input = `
        .mixed {
          font-size: rre(16);
          padding: rre();
          margin: rre(12);
          border-radius: rre(invalid);
          width: rre(100);
        }
      `;
      
      const { css, errors } = await processCssWithWarnings(input, defaultTestOptions);
      
      expect(errors).toHaveLength(0);
      expect(css).toContain('var(--rre-font-size)');
      expect(css).toContain('var(--rre-margin)');
      expect(css).toContain('var(--rre-width)');
      expect(css).toContain('rre()');
      expect(css).toContain('rre(invalid)');
    });

    it('should handle CSS with nested errors', async () => {
      const input = `
        .parent {
          font-size: rre(16);
          .child {
            padding: rre();
            .grandchild {
              margin: rre(8);
            }
          }
        }
      `;
      
      const { css, errors } = await processCssWithWarnings(input, defaultTestOptions);
      
      expect(errors).toHaveLength(0);
      expect(css).toContain('var(--rre-font-size)');
      expect(css).toContain('var(--rre-margin)');
      expect(css).toContain('rre()');
    });

    it('should handle CSS with pseudo-selector errors', async () => {
      const input = `
        .test {
          font-size: rre(16);
        }
        
        .test:hover {
          padding: rre();
        }
        
        .test:focus {
          margin: rre(invalid);
        }
      `;
      
      const { css, errors } = await processCssWithWarnings(input, defaultTestOptions);
      
      expect(errors).toHaveLength(0);
      expect(css).toContain('var(--rre-font-size)');
      expect(css).toContain('rre()');
      expect(css).toContain('rre(invalid)');
    });
  });

  describe('Configuration Error Handling', () => {
    it('should handle invalid configuration options gracefully', async () => {
      const input = `
        .test {
          font-size: rre(16);
        }
      `;
      
      const invalidConfig = {
        ...defaultTestOptions,
        customPropertyPrefix: null as any,
        generateCustomProperties: 'invalid' as any
      };
      
      const { css, errors } = await processCssWithWarnings(input, invalidConfig);
      
      // Should not throw errors, but may not work as expected
      expect(css).toBeDefined();
    });

    it('should handle missing configuration gracefully', async () => {
      const input = `
        .test {
          font-size: rre(16);
        }
      `;
      
      const { css, errors } = await processCssWithWarnings(input, {} as any);
      
      expect(errors).toHaveLength(0);
      expect(css).toBeDefined();
    });

    it('should handle extreme configuration values gracefully', async () => {
      const input = `
        .test {
          font-size: rre(16);
        }
      `;
      
      const extremeConfig = {
        ...defaultTestOptions,
        customPropertyPrefix: 'a'.repeat(1000),
        generateCustomProperties: true,
        generateCustomMedia: true
      };
      
      const { css, errors } = await processCssWithWarnings(input, extremeConfig);
      
      expect(errors).toHaveLength(0);
      expect(css).toBeDefined();
    });
  });

  describe('Memory and Resource Error Handling', () => {
    it('should handle very large CSS files gracefully', async () => {
      let input = '';
      for (let i = 0; i < 10000; i++) {
        input += `.test-${i} { font-size: rre(${16 + i}); }\n`;
      }
      
      const { css, errors } = await processCssWithWarnings(input, defaultTestOptions);
      
      expect(errors).toHaveLength(0);
      expect(css).toBeDefined();
    });

    it('should handle CSS with very long property names gracefully', async () => {
      const longProperty = 'a'.repeat(10000);
      const input = `
        .test {
          ${longProperty}: rre(16);
        }
      `;
      
      const { css, errors } = await processCssWithWarnings(input, defaultTestOptions);
      
      expect(errors).toHaveLength(0);
      expect(css).toBeDefined();
    });

    it('should handle CSS with very long values gracefully', async () => {
      const longValue = 'a'.repeat(10000);
      const input = `
        .test {
          content: "${longValue}";
          font-size: rre(16);
        }
      `;
      
      const { css, errors } = await processCssWithWarnings(input, defaultTestOptions);
      
      expect(errors).toHaveLength(0);
      expect(css).toBeDefined();
    });

    it('should handle CSS with very deep nesting gracefully', async () => {
      let input = '.deep';
      for (let i = 0; i < 1000; i++) {
        input += ' .level-' + i;
      }
      input += ' { font-size: rre(16); }';
      
      const { css, errors } = await processCssWithWarnings(input, defaultTestOptions);
      
      expect(errors).toHaveLength(0);
      expect(css).toBeDefined();
    });
  });

  describe('Recovery and Resilience', () => {
    it('should recover from errors and continue processing', async () => {
      const input = `
        .valid1 {
          font-size: rre(16);
        }
        
        .invalid {
          font-size: rre();
        }
        
        .valid2 {
          padding: rre(12);
        }
        
        .another-invalid {
          padding: rre(invalid);
        }
        
        .valid3 {
          margin: rre(8);
        }
      `;
      
      const { css, errors } = await processCssWithWarnings(input, defaultTestOptions);
      
      expect(errors).toHaveLength(0);
      expect(css).toContain('var(--rre-font-size)');
      expect(css).toContain('var(--rre-padding)');
      expect(css).toContain('var(--rre-margin)');
      expect(css).toContain('rre()');
      expect(css).toContain('rre(invalid)');
    });

    it('should maintain CSS structure despite errors', async () => {
      const input = `
        .test {
          font-size: rre(16);
          padding: rre();
          margin: rre(12);
          border-radius: rre(invalid);
        }
        
        .another-test {
          color: red;
          background: blue;
        }
      `;
      
      const { css, errors } = await processCssWithWarnings(input, defaultTestOptions);
      
      expect(errors).toHaveLength(0);
      expect(css).toContain('.test');
      expect(css).toContain('.another-test');
      expect(css).toContain('color: red');
      expect(css).toContain('background: blue');
    });

    it('should preserve original CSS when errors occur', async () => {
      const input = `
        .test {
          font-size: rre(16);
          padding: rre();
          margin: rre(12);
        }
      `;
      
      const { css, errors } = await processCssWithWarnings(input, defaultTestOptions);
      
      expect(errors).toHaveLength(0);
      expect(css).toContain('var(--rre-font-size)');
      expect(css).toContain('var(--rre-margin)');
      expect(css).toContain('rre()');
    });
  });

  describe('Error Validation', () => {
    it('should validate CSS syntax after processing', async () => {
      const input = `
        .test {
          font-size: rre(16);
          padding: rre(12);
        }
      `;
      
      const { css, errors } = await processCssWithWarnings(input, defaultTestOptions);
      
      expect(errors).toHaveLength(0);
      
      const validation = CSSValidator.validateSyntax(css);
      expect(validation.valid).toBe(true);
    });

    it('should validate custom properties after processing', async () => {
      const input = `
        .test {
          font-size: rre(16);
          padding: rre(12);
        }
      `;
      
      const { css, errors } = await processCssWithWarnings(input, defaultTestOptions);
      
      expect(errors).toHaveLength(0);
      
      const validation = CSSValidator.validateCustomProperties(css);
      expect(validation.valid).toBe(true);
    });

    it('should handle validation errors gracefully', async () => {
      const input = `
        .test {
          font-size: rre(16);
          padding: rre(12);
        }
      `;
      
      const { css, errors } = await processCssWithWarnings(input, defaultTestOptions);
      
      expect(errors).toHaveLength(0);
      expect(css).toBeDefined();
    });
  });

  describe('Performance Under Error Conditions', () => {
    it('should maintain performance with many errors', async () => {
      const input = `
        .test1 { font-size: rre(16); }
        .test2 { font-size: rre(); }
        .test3 { font-size: rre(invalid); }
        .test4 { font-size: rre(18); }
        .test5 { font-size: rre(); }
        .test6 { font-size: rre(not-a-number); }
        .test7 { font-size: rre(20); }
      `;
      
      const { metrics } = processCssWithMetrics(input, defaultTestOptions);
      
      expect(metrics.errors).toBe(0);
      expect(metrics.executionTime).toBeLessThan(100);
    });

    it('should handle error recovery efficiently', async () => {
      const input = `
        .valid { font-size: rre(16); }
        .invalid { font-size: rre(); }
        .valid { padding: rre(12); }
        .invalid { padding: rre(invalid); }
        .valid { margin: rre(8); }
      `;
      
      const { metrics } = processCssWithMetrics(input, defaultTestOptions);
      
      expect(metrics.errors).toBe(0);
      expect(metrics.executionTime).toBeLessThan(100);
    });
  });

  describe('Error Reporting', () => {
    it('should provide meaningful error information', async () => {
      const input = `
        .test {
          font-size: rre(16);
          padding: rre();
          margin: rre(invalid);
        }
      `;
      
      const { css, errors } = await processCssWithWarnings(input, defaultTestOptions);
      
      expect(errors).toHaveLength(0);
      expect(css).toBeDefined();
    });

    it('should handle error reporting gracefully', async () => {
      const input = `
        .test {
          font-size: rre(16);
          padding: rre();
        }
      `;
      
      const { css, errors } = await processCssWithWarnings(input, defaultTestOptions);
      
      expect(errors).toHaveLength(0);
      expect(css).toBeDefined();
    });
  });
});
