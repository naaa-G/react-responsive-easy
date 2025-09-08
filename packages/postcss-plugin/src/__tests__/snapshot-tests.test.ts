/**
 * Snapshot tests for PostCSS plugin
 * Tests for consistent CSS output validation and regression detection
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import postcss from 'postcss';
import plugin from '../index';
import type { PostCSSPluginOptions } from '../index';
import {
  processCss,
  generateTestCSS,
  generateComplexCSS,
  defaultTestOptions,
  developmentTestOptions,
  productionTestOptions
} from './utils/test-helpers';

describe('PostCSS Plugin Snapshot Tests', () => {
  describe('Basic CSS Transformations', () => {
    it('should generate consistent output for simple rre() functions', async () => {
      const input = `
        .button {
          font-size: rre(18);
          padding: rre(16);
        }
      `;
      
      const output = await processCss(input, defaultTestOptions);
      
      expect(output).toMatchSnapshot('simple-rre-functions');
    });

    it('should generate consistent output for rre() with tokens', async () => {
      const input = `
        .text {
          font-size: rre(24, 'fontSize');
          padding: rre(16, 'spacing');
          border-radius: rre(8, 'radius');
        }
      `;
      
      const output = await processCss(input, defaultTestOptions);
      
      expect(output).toMatchSnapshot('rre-with-tokens');
    });

    it('should generate consistent output for multiple rre() calls', async () => {
      const input = `
        .complex {
          margin: rre(10) rre(20) rre(10) rre(20);
          padding: rre(12) rre(24);
          border-radius: rre(4) rre(8) rre(4) rre(8);
        }
      `;
      
      const output = await processCss(input, defaultTestOptions);
      
      expect(output).toMatchSnapshot('multiple-rre-calls');
    });

    it('should generate consistent output for rre() in calc()', async () => {
      const input = `
        .calculated {
          width: calc(100% - rre(40));
          height: calc(100vh - rre(64));
          padding: calc(rre(16) + rre(8));
        }
      `;
      
      const output = await processCss(input, defaultTestOptions);
      
      expect(output).toMatchSnapshot('rre-in-calc');
    });
  });

  describe('CSS Custom Properties Generation', () => {
    it('should generate consistent custom properties', async () => {
      const input = `
        .element {
          font-size: rre(16);
          padding: rre(12);
          margin: rre(8);
          border-radius: rre(4);
        }
      `;
      
      const output = await processCss(input, defaultTestOptions);
      
      expect(output).toMatchSnapshot('custom-properties');
    });

    it('should generate consistent custom properties with custom prefix', async () => {
      const input = `
        .element {
          font-size: rre(16);
          padding: rre(12);
        }
      `;
      
      const output = await processCss(input, {
        ...defaultTestOptions,
        customPropertyPrefix: '--my-prefix'
      });
      
      expect(output).toMatchSnapshot('custom-properties-custom-prefix');
    });

    it('should generate consistent responsive variants', async () => {
      const input = `
        .responsive {
          font-size: rre(20);
          padding: rre(16);
        }
      `;
      
      const output = await processCss(input, defaultTestOptions);
      
      expect(output).toMatchSnapshot('responsive-variants');
    });
  });

  describe('Media Query Generation', () => {
    it('should generate consistent media queries', async () => {
      const input = `
        .media-test {
          font-size: rre(18);
        }
      `;
      
      const output = await processCss(input, defaultTestOptions);
      
      expect(output).toMatchSnapshot('media-queries');
    });

    it('should generate consistent custom media rules', async () => {
      const input = `
        .custom-media-test {
          color: blue;
        }
      `;
      
      const output = await processCss(input, defaultTestOptions);
      
      expect(output).toMatchSnapshot('custom-media-rules');
    });
  });

  describe('Development vs Production Modes', () => {
    it('should generate consistent output in development mode', async () => {
      const input = `
        .dev-test {
          font-size: rre(16);
          padding: rre(12);
        }
      `;
      
      const output = await processCss(input, developmentTestOptions);
      
      expect(output).toMatchSnapshot('development-mode');
    });

    it('should generate consistent output in production mode', async () => {
      const input = `
        .prod-test {
          font-size: rre(16);
          padding: rre(12);
        }
      `;
      
      const output = await processCss(input, productionTestOptions);
      
      expect(output).toMatchSnapshot('production-mode');
    });

    it('should generate consistent output with custom properties disabled', async () => {
      const input = `
        .no-custom-props {
          font-size: rre(16);
          padding: rre(12);
        }
      `;
      
      const output = await processCss(input, {
        ...defaultTestOptions,
        generateCustomProperties: false
      });
      
      expect(output).toMatchSnapshot('no-custom-properties');
    });

    it('should generate consistent output with custom media disabled', async () => {
      const input = `
        .no-custom-media {
          font-size: rre(16);
        }
      `;
      
      const output = await processCss(input, {
        ...defaultTestOptions,
        generateCustomMedia: false
      });
      
      expect(output).toMatchSnapshot('no-custom-media');
    });
  });

  describe('Complex CSS Structures', () => {
    it('should generate consistent output for nested selectors', async () => {
      const input = `
        .parent {
          .child {
            font-size: rre(16);
            padding: rre(12);
          }
          
          .another-child {
            margin: rre(8);
            border-radius: rre(4);
          }
        }
      `;
      
      const output = await processCss(input, defaultTestOptions);
      
      expect(output).toMatchSnapshot('nested-selectors');
    });

    it('should generate consistent output for pseudo-selectors', async () => {
      const input = `
        .button {
          font-size: rre(16);
          padding: rre(12);
        }
        
        .button:hover {
          font-size: rre(18);
          padding: rre(14);
        }
        
        .button:active {
          font-size: rre(14);
          padding: rre(10);
        }
      `;
      
      const output = await processCss(input, defaultTestOptions);
      
      expect(output).toMatchSnapshot('pseudo-selectors');
    });

    it('should generate consistent output for existing media queries', async () => {
      const input = `
        .existing-media {
          font-size: rre(16);
        }
        
        @media (max-width: 600px) {
          .existing-media {
            font-size: rre(14);
          }
        }
      `;
      
      const output = await processCss(input, defaultTestOptions);
      
      expect(output).toMatchSnapshot('existing-media-queries');
    });

    it('should generate consistent output for existing custom properties', async () => {
      const input = `
        :root {
          --existing-prop: 20px;
        }
        
        .existing-custom-props {
          font-size: rre(16);
          padding: rre(12);
        }
      `;
      
      const output = await processCss(input, defaultTestOptions);
      
      expect(output).toMatchSnapshot('existing-custom-properties');
    });
  });

  describe('Edge Cases', () => {
    it('should generate consistent output for malformed rre() calls', async () => {
      const input = `
        .malformed {
          font-size: rre();
          padding: rre(invalid);
          margin: rre(16, invalid-token);
        }
      `;
      
      const output = await processCss(input, defaultTestOptions);
      
      expect(output).toMatchSnapshot('malformed-rre-calls');
    });

    it('should generate consistent output for mixed valid and invalid CSS', async () => {
      const input = `
        .mixed {
          font-size: rre(16);
          color: red;
          padding: rre(invalid);
          background: blue;
          margin: rre(8);
        }
      `;
      
      const output = await processCss(input, defaultTestOptions);
      
      expect(output).toMatchSnapshot('mixed-valid-invalid');
    });

    it('should generate consistent output for CSS with comments', async () => {
      const input = `
        /* This is a comment */
        .commented {
          font-size: rre(16); /* Another comment */
          padding: rre(12);
        }
      `;
      
      const output = await processCss(input, defaultTestOptions);
      
      expect(output).toMatchSnapshot('css-with-comments');
    });

    it('should generate consistent output for empty CSS', async () => {
      const input = '';
      
      const output = await processCss(input, defaultTestOptions);
      
      expect(output).toMatchSnapshot('empty-css');
    });

    it('should generate consistent output for CSS without rre() functions', async () => {
      const input = `
        .normal {
          color: red;
          background: blue;
          border: 1px solid black;
        }
      `;
      
      const output = await processCss(input, defaultTestOptions);
      
      expect(output).toMatchSnapshot('css-without-rre');
    });
  });

  describe('Real-World Scenarios', () => {
    it('should generate consistent output for component stylesheet', async () => {
      const input = `
        /* Button Component */
        .button {
          display: inline-block;
          padding: rre(12) rre(24);
          font-size: rre(16, 'fontSize');
          font-weight: 600;
          color: white;
          background-color: #007bff;
          border: none;
          border-radius: rre(6, 'radius');
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .button:hover {
          background-color: #0056b3;
          transform: translateY(rre(-2));
        }

        .button--large {
          padding: rre(16) rre(32);
          font-size: rre(20, 'fontSize');
          border-radius: rre(8, 'radius');
        }

        .button--small {
          padding: rre(8) rre(16);
          font-size: rre(14, 'fontSize');
          border-radius: rre(4, 'radius');
        }
      `;
      
      const output = await processCss(input, defaultTestOptions);
      
      expect(output).toMatchSnapshot('button-component');
    });

    it('should generate consistent output for grid system', async () => {
      const input = `
        /* Grid System */
        .grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(rre(300), 1fr));
          gap: rre(24);
          padding: rre(32);
          margin: rre(16) auto;
          max-width: rre(1200);
        }

        .grid-item {
          background: white;
          padding: rre(24);
          border-radius: rre(8);
          box-shadow: 0 rre(2) rre(4) rgba(0, 0, 0, 0.1);
        }

        .grid--2-cols {
          grid-template-columns: repeat(2, 1fr);
        }

        .grid--3-cols {
          grid-template-columns: repeat(3, 1fr);
        }
      `;
      
      const output = await processCss(input, defaultTestOptions);
      
      expect(output).toMatchSnapshot('grid-system');
    });

    it('should generate consistent output for typography system', async () => {
      const input = `
        /* Typography System */
        .heading-1 {
          font-size: rre(48, 'fontSize');
          line-height: rre(56);
          font-weight: 700;
          margin-bottom: rre(24);
        }

        .heading-2 {
          font-size: rre(36, 'fontSize');
          line-height: rre(44);
          font-weight: 600;
          margin-bottom: rre(20);
        }

        .heading-3 {
          font-size: rre(24, 'fontSize');
          line-height: rre(32);
          font-weight: 600;
          margin-bottom: rre(16);
        }

        .body-text {
          font-size: rre(16, 'fontSize');
          line-height: rre(24);
          margin-bottom: rre(16);
        }

        .caption {
          font-size: rre(14, 'fontSize');
          line-height: rre(20);
          margin-bottom: rre(12);
        }
      `;
      
      const output = await processCss(input, defaultTestOptions);
      
      expect(output).toMatchSnapshot('typography-system');
    });

    it('should generate consistent output for design system', async () => {
      const input = `
        /* Design System */
        :root {
          --primary-color: #007bff;
          --secondary-color: #6c757d;
          --success-color: #28a745;
          --danger-color: #dc3545;
        }

        .text-xs { font-size: rre(12, 'fontSize'); }
        .text-sm { font-size: rre(14, 'fontSize'); }
        .text-base { font-size: rre(16, 'fontSize'); }
        .text-lg { font-size: rre(18, 'fontSize'); }
        .text-xl { font-size: rre(20, 'fontSize'); }

        .p-1 { padding: rre(4, 'spacing'); }
        .p-2 { padding: rre(8, 'spacing'); }
        .p-3 { padding: rre(12, 'spacing'); }
        .p-4 { padding: rre(16, 'spacing'); }
        .p-5 { padding: rre(20, 'spacing'); }

        .rounded-sm { border-radius: rre(2, 'radius'); }
        .rounded { border-radius: rre(4, 'radius'); }
        .rounded-md { border-radius: rre(6, 'radius'); }
        .rounded-lg { border-radius: rre(8, 'radius'); }
        .rounded-xl { border-radius: rre(12, 'radius'); }
      `;
      
      const output = await processCss(input, defaultTestOptions);
      
      expect(output).toMatchSnapshot('design-system');
    });
  });

  describe('Configuration Variations', () => {
    it('should generate consistent output with different prefixes', async () => {
      const input = `
        .test {
          font-size: rre(16);
          padding: rre(12);
        }
      `;
      
      const prefixes = ['--rre', '--custom', '--my-prefix', '--design-system'];
      
      for (const prefix of prefixes) {
        const output = await processCss(input, {
          ...defaultTestOptions,
          customPropertyPrefix: prefix
        });
        
        expect(output).toMatchSnapshot(`prefix-${prefix.replace('--', '')}`);
      }
    });

    it('should generate consistent output with different configurations', async () => {
      const input = `
        .test {
          font-size: rre(16);
          padding: rre(12);
        }
      `;
      
      const configs = [
        { name: 'default', options: defaultTestOptions },
        { name: 'development', options: developmentTestOptions },
        { name: 'production', options: productionTestOptions },
        { name: 'no-custom-props', options: { ...defaultTestOptions, generateCustomProperties: false } },
        { name: 'no-custom-media', options: { ...defaultTestOptions, generateCustomMedia: false } },
        { name: 'both-disabled', options: { ...defaultTestOptions, generateCustomProperties: false, generateCustomMedia: false } }
      ];
      
      for (const config of configs) {
        const output = await processCss(input, config.options);
        
        expect(output).toMatchSnapshot(`config-${config.name}`);
      }
    });
  });

  describe('Regression Tests', () => {
    it('should maintain consistent output across versions', async () => {
      const input = `
        .regression-test {
          font-size: rre(16);
          padding: rre(12);
          margin: rre(8);
          border-radius: rre(4);
        }
      `;
      
      const output = await processCss(input, defaultTestOptions);
      
      expect(output).toMatchSnapshot('regression-test');
    });

    it('should maintain consistent output for complex scenarios', async () => {
      const input = generateComplexCSS();
      
      const output = await processCss(input, defaultTestOptions);
      
      expect(output).toMatchSnapshot('complex-regression-test');
    });

    it('should maintain consistent output for large CSS', async () => {
      const input = generateTestCSS(50);
      
      const output = await processCss(input, defaultTestOptions);
      
      expect(output).toMatchSnapshot('large-css-regression-test');
    });
  });
});
