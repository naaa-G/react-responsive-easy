/**
 * Integration tests for PostCSS plugin
 * Tests real-world usage scenarios and component interactions
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import postcss from 'postcss';
import plugin from '../index';
import type { PostCSSPluginOptions } from '../index';
import {
  processCss,
  processCssWithWarnings,
  generateComplexCSS,
  generateTestCSS,
  countOccurrences,
  extractCustomProperties,
  extractMediaQueries,
  validateCSS,
  measureTimeAsync,
  defaultTestOptions,
  developmentTestOptions
} from './utils/test-helpers';
import {
  processCssWithMetrics,
  EnterpriseAssertions,
  TestDataGenerator,
  CSSValidator,
  runEnterpriseTestCase,
  type EnterpriseTestCase
} from './utils/enterprise-test-helpers';

describe('PostCSS Plugin Integration Tests', () => {
  describe('Real-World Component Scenarios', () => {
    it('should process a complete component stylesheet', async () => {
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
          text-decoration: none;
          text-align: center;
        }

        .button:hover {
          background-color: #0056b3;
          transform: translateY(rre(-2));
        }

        .button:active {
          transform: translateY(rre(1));
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

        @media (max-width: 768px) {
          .button {
            padding: rre(10) rre(20);
            font-size: rre(14, 'fontSize');
          }
          
          .button--large {
            padding: rre(14) rre(28);
            font-size: rre(18, 'fontSize');
          }
        }
      `;

      const output = await processCss(input, defaultTestOptions);
      
      // Validate CSS structure
      const validation = CSSValidator.validateSyntax(output);
      expect(validation.valid).toBe(true);
      
      // Check for custom properties
      const customProps = extractCustomProperties(output);
      expect(customProps.length).toBeGreaterThan(0);
      
      // Check for media queries
      const mediaQueries = extractMediaQueries(output);
      expect(mediaQueries.length).toBeGreaterThan(0);
      
      // Check for transformed values
      expect(output).toContain('var(--rre-padding)');
      expect(output).toContain('var(--rre-font-size)');
      expect(output).toContain('var(--rre-border-radius)');
    });

    it('should process a grid layout system', async () => {
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
          transition: transform 0.3s ease;
        }

        .grid-item:hover {
          transform: translateY(rre(-4));
        }

        .grid--2-cols {
          grid-template-columns: repeat(2, 1fr);
        }

        .grid--3-cols {
          grid-template-columns: repeat(3, 1fr);
        }

        @media (max-width: 1024px) {
          .grid {
            grid-template-columns: repeat(auto-fit, minmax(rre(250), 1fr));
            gap: rre(20);
            padding: rre(24);
          }
        }

        @media (max-width: 768px) {
          .grid {
            grid-template-columns: 1fr;
            gap: rre(16);
            padding: rre(16);
          }
          
          .grid--2-cols,
          .grid--3-cols {
            grid-template-columns: 1fr;
          }
        }
      `;

      const output = await processCss(input, defaultTestOptions);
      
      // Validate output
      const validation = CSSValidator.validateSyntax(output);
      expect(validation.valid).toBe(true);
      
      // Check for responsive behavior
      expect(output).toContain('@media (max-width: 1024px)');
      expect(output).toContain('@media (max-width: 768px)');
      
      // Check for custom properties
      expect(output).toContain('var(--rre-gap)');
      expect(output).toContain('var(--rre-padding)');
    });

    it('should process a typography system', async () => {
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

        @media (max-width: 768px) {
          .heading-1 {
            font-size: rre(36, 'fontSize');
            line-height: rre(44);
          }
          
          .heading-2 {
            font-size: rre(28, 'fontSize');
            line-height: rre(36);
          }
          
          .heading-3 {
            font-size: rre(20, 'fontSize');
            line-height: rre(28);
          }
        }
      `;

      const output = await processCss(input, defaultTestOptions);
      
      // Validate output
      const validation = CSSValidator.validateSyntax(output);
      expect(validation.valid).toBe(true);
      
      // Check for typography scaling
      expect(output).toContain('var(--rre-font-size)');
      expect(output).toContain('var(--rre-line-height)');
      expect(output).toContain('var(--rre-margin-bottom)');
    });
  });

  describe('Complex CSS Patterns', () => {
    it('should handle CSS with multiple nested selectors', async () => {
      const input = `
        .card {
          background: white;
          border-radius: rre(8);
          box-shadow: 0 rre(2) rre(4) rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }

        .card .card-header {
          padding: rre(16) rre(24);
          border-bottom: 1px solid #eee;
        }

        .card .card-header h3 {
          font-size: rre(18, 'fontSize');
          margin: 0;
        }

        .card .card-body {
          padding: rre(24);
        }

        .card .card-body p {
          font-size: rre(16, 'fontSize');
          line-height: rre(24);
          margin-bottom: rre(12);
        }

        .card .card-footer {
          padding: rre(16) rre(24);
          background: #f8f9fa;
          border-top: 1px solid #eee;
        }

        .card .card-footer .btn {
          padding: rre(8) rre(16);
          font-size: rre(14, 'fontSize');
          border-radius: rre(4);
        }
      `;

      const output = await processCss(input, defaultTestOptions);
      
      // Validate output
      const validation = CSSValidator.validateSyntax(output);
      expect(validation.valid).toBe(true);
      
      // Check for nested transformations
      expect(output).toContain('var(--rre-border-radius)');
      expect(output).toContain('var(--rre-padding)');
      expect(output).toContain('var(--rre-font-size)');
    });

    it('should handle CSS with pseudo-selectors and pseudo-elements', async () => {
      const input = `
        .input {
          padding: rre(12) rre(16);
          font-size: rre(16, 'fontSize');
          border: 1px solid #ddd;
          border-radius: rre(4);
          transition: border-color 0.3s ease;
        }

        .input:focus {
          outline: none;
          border-color: #007bff;
          box-shadow: 0 0 0 rre(3) rgba(0, 123, 255, 0.25);
        }

        .input::placeholder {
          color: #999;
          font-size: rre(14, 'fontSize');
        }

        .input:invalid {
          border-color: #dc3545;
        }

        .input:valid {
          border-color: #28a745;
        }

        .dropdown::before {
          content: '';
          position: absolute;
          top: rre(-8);
          left: 50%;
          transform: translateX(-50%);
          border-left: rre(8) solid transparent;
          border-right: rre(8) solid transparent;
          border-bottom: rre(8) solid white;
        }
      `;

      const output = await processCss(input, defaultTestOptions);
      
      // Validate output
      const validation = CSSValidator.validateSyntax(output);
      expect(validation.valid).toBe(true);
      
      // Check for pseudo-selector transformations
      expect(output).toContain('var(--rre-padding)');
      expect(output).toContain('var(--rre-font-size)');
      expect(output).toContain('var(--rre-border-radius)');
    });

    it('should handle CSS with complex calc() expressions', async () => {
      const input = `
        .container {
          width: calc(100% - rre(32));
          height: calc(100vh - rre(64));
          padding: rre(16);
          margin: rre(8) auto;
        }

        .sidebar {
          width: calc(rre(300) - rre(16));
          height: calc(100% - rre(32));
          position: fixed;
          left: rre(16);
          top: rre(16);
        }

        .content {
          margin-left: calc(rre(300) + rre(32));
          padding: rre(24);
          min-height: calc(100vh - rre(48));
        }

        @media (max-width: 768px) {
          .sidebar {
            width: calc(100% - rre(32));
            position: relative;
            left: auto;
            top: auto;
          }
          
          .content {
            margin-left: 0;
            padding: rre(16);
          }
        }
      `;

      const output = await processCss(input, defaultTestOptions);
      
      // Validate output
      const validation = CSSValidator.validateSyntax(output);
      expect(validation.valid).toBe(true);
      
      // Check for calc() transformations
      expect(output).toContain('calc(100% - var(--rre-width))');
      expect(output).toContain('calc(100vh - var(--rre-height))');
    });
  });

  describe('Performance Integration', () => {
    it('should handle large CSS files efficiently', async () => {
      const input = TestDataGenerator.generateResponsiveCSS(100);
      
      const { time } = await measureTimeAsync(async () => {
        await processCss(input, defaultTestOptions);
      });
      
      // Should process 100 rules in less than 1 second
      expect(time).toBeLessThan(1000);
    });

    it('should maintain performance with complex CSS', async () => {
      const input = TestDataGenerator.generateComplexCSS();
      
      const { time } = await measureTimeAsync(async () => {
        await processCss(input, defaultTestOptions);
      });
      
      // Should process complex CSS in less than 500ms
      expect(time).toBeLessThan(500);
    });

    it('should handle multiple transformations efficiently', async () => {
      const input = `
        .test-1 { font-size: rre(16); padding: rre(12); margin: rre(8); }
        .test-2 { font-size: rre(18); padding: rre(14); margin: rre(10); }
        .test-3 { font-size: rre(20); padding: rre(16); margin: rre(12); }
        .test-4 { font-size: rre(22); padding: rre(18); margin: rre(14); }
        .test-5 { font-size: rre(24); padding: rre(20); margin: rre(16); }
      `;
      
      const { time } = await measureTimeAsync(async () => {
        await processCss(input, defaultTestOptions);
      });
      
      // Should process multiple transformations quickly
      expect(time).toBeLessThan(100);
    });
  });

  describe('Configuration Integration', () => {
    it('should work with different configuration combinations', async () => {
      const input = `
        .test {
          font-size: rre(16);
          padding: rre(12);
        }
      `;

      const configs: PostCSSPluginOptions[] = [
        { generateCustomProperties: true, generateCustomMedia: true },
        { generateCustomProperties: true, generateCustomMedia: false },
        { generateCustomProperties: false, generateCustomMedia: true },
        { generateCustomProperties: false, generateCustomMedia: false },
        { customPropertyPrefix: '--custom' },
        { development: true },
        { development: false }
      ];

      for (const config of configs) {
        const output = await processCss(input, config);
        
        // Should not throw errors
        expect(output).toBeDefined();
        
        // Should generate valid CSS
        const validation = CSSValidator.validateSyntax(output);
        expect(validation.valid).toBe(true);
      }
    });

    it('should handle custom property prefix correctly', async () => {
      const input = `
        .test {
          font-size: rre(16);
          padding: rre(12);
        }
      `;

      const output = await processCss(input, {
        ...defaultTestOptions,
        customPropertyPrefix: '--my-custom'
      });
      
      expect(output).toContain('var(--my-custom-font-size)');
      expect(output).toContain('var(--my-custom-padding)');
      expect(output).toContain('--my-custom-font-size: 16px');
      expect(output).toContain('--my-custom-padding: 12px');
    });
  });

  describe('Error Recovery Integration', () => {
    it('should recover from malformed CSS gracefully', async () => {
      const input = `
        .valid {
          font-size: rre(16);
          padding: rre(12);
        }
        
        .malformed {
          font-size: rre();
          padding: rre(invalid);
        }
        
        .another-valid {
          margin: rre(8);
          border-radius: rre(4);
        }
      `;

      const { css, errors } = await processCssWithWarnings(input, defaultTestOptions);
      
      // Should not throw errors
      expect(errors).toHaveLength(0);
      
      // Should process valid parts
      expect(css).toContain('var(--rre-font-size)');
      expect(css).toContain('var(--rre-padding)');
      expect(css).toContain('var(--rre-margin)');
      expect(css).toContain('var(--rre-border-radius)');
      
      // Should preserve malformed parts
      expect(css).toContain('rre()');
      expect(css).toContain('rre(invalid)');
    });

    it('should handle CSS with syntax errors', async () => {
      const input = `
        .test {
          font-size: rre(16);
          padding: rre(12);
          /* Missing closing brace
        }
      `;

      const { css, errors } = await processCssWithWarnings(input, defaultTestOptions);
      
      // Should handle gracefully
      expect(css).toBeDefined();
    });
  });

  describe('Enterprise Test Cases', () => {
    it('should pass enterprise test case for basic transformation', async () => {
      const testCase: EnterpriseTestCase = {
        name: 'basic-transformation',
        description: 'Test basic rre() function transformation',
        input: '.test { font-size: rre(16); }',
        shouldContain: ['var(--rre-font-size)', ':root'],
        shouldNotContain: ['rre(16)'],
        performanceThreshold: 100,
        category: 'unit',
        priority: 'high'
      };

      const result = await runEnterpriseTestCase(testCase);
      
      expect(result.passed).toBe(true);
      expect(result.errors).toHaveLength(0);
      expect(result.metrics.executionTime).toBeLessThan(100);
    });

    it('should pass enterprise test case for complex CSS', async () => {
      const testCase: EnterpriseTestCase = {
        name: 'complex-css',
        description: 'Test complex CSS with multiple rre() functions',
        input: TestDataGenerator.generateComplexCSS(),
        shouldContain: ['var(--rre-', '@media'],
        performanceThreshold: 500,
        category: 'integration',
        priority: 'medium'
      };

      const result = await runEnterpriseTestCase(testCase);
      
      expect(result.passed).toBe(true);
      expect(result.errors).toHaveLength(0);
      expect(result.metrics.executionTime).toBeLessThan(500);
    });

    it('should pass enterprise test case for performance', async () => {
      const testCase: EnterpriseTestCase = {
        name: 'performance-test',
        description: 'Test performance with large CSS',
        input: TestDataGenerator.generateResponsiveCSS(50),
        performanceThreshold: 200,
        memoryThreshold: 1024 * 1024, // 1MB
        category: 'performance',
        priority: 'high'
      };

      const result = await runEnterpriseTestCase(testCase);
      
      expect(result.passed).toBe(true);
      expect(result.errors).toHaveLength(0);
      expect(result.metrics.executionTime).toBeLessThan(200);
      expect(result.metrics.memoryUsage).toBeLessThan(1024 * 1024);
    });
  });

  describe('Real-World Scenarios', () => {
    it('should process a complete design system', async () => {
      const input = `
        /* Design System - Colors */
        :root {
          --primary-color: #007bff;
          --secondary-color: #6c757d;
          --success-color: #28a745;
          --danger-color: #dc3545;
        }

        /* Design System - Typography */
        .text-xs { font-size: rre(12, 'fontSize'); }
        .text-sm { font-size: rre(14, 'fontSize'); }
        .text-base { font-size: rre(16, 'fontSize'); }
        .text-lg { font-size: rre(18, 'fontSize'); }
        .text-xl { font-size: rre(20, 'fontSize'); }
        .text-2xl { font-size: rre(24, 'fontSize'); }

        /* Design System - Spacing */
        .p-1 { padding: rre(4, 'spacing'); }
        .p-2 { padding: rre(8, 'spacing'); }
        .p-3 { padding: rre(12, 'spacing'); }
        .p-4 { padding: rre(16, 'spacing'); }
        .p-5 { padding: rre(20, 'spacing'); }
        .p-6 { padding: rre(24, 'spacing'); }

        /* Design System - Border Radius */
        .rounded-sm { border-radius: rre(2, 'radius'); }
        .rounded { border-radius: rre(4, 'radius'); }
        .rounded-md { border-radius: rre(6, 'radius'); }
        .rounded-lg { border-radius: rre(8, 'radius'); }
        .rounded-xl { border-radius: rre(12, 'radius'); }

        /* Responsive Design System */
        @media (max-width: 768px) {
          .text-xs { font-size: rre(10, 'fontSize'); }
          .text-sm { font-size: rre(12, 'fontSize'); }
          .text-base { font-size: rre(14, 'fontSize'); }
          .text-lg { font-size: rre(16, 'fontSize'); }
          .text-xl { font-size: rre(18, 'fontSize'); }
          .text-2xl { font-size: rre(20, 'fontSize'); }
        }
      `;

      const output = await processCss(input, defaultTestOptions);
      
      // Validate output
      const validation = CSSValidator.validateSyntax(output);
      expect(validation.valid).toBe(true);
      
      // Check for design system elements
      expect(output).toContain('--primary-color: #007bff');
      expect(output).toContain('var(--rre-font-size)');
      expect(output).toContain('var(--rre-padding)');
      expect(output).toContain('var(--rre-border-radius)');
      
      // Check for responsive behavior
      expect(output).toContain('@media (max-width: 768px)');
    });

    it('should process a component library stylesheet', async () => {
      const input = `
        /* Button Component Library */
        .btn {
          display: inline-block;
          padding: rre(12) rre(24);
          font-size: rre(16, 'fontSize');
          font-weight: 500;
          line-height: 1.5;
          text-align: center;
          text-decoration: none;
          vertical-align: middle;
          cursor: pointer;
          border: 1px solid transparent;
          border-radius: rre(4, 'radius');
          transition: all 0.15s ease-in-out;
        }

        .btn-primary {
          color: #fff;
          background-color: #007bff;
          border-color: #007bff;
        }

        .btn-primary:hover {
          background-color: #0056b3;
          border-color: #004085;
        }

        .btn-secondary {
          color: #fff;
          background-color: #6c757d;
          border-color: #6c757d;
        }

        .btn-lg {
          padding: rre(16) rre(32);
          font-size: rre(20, 'fontSize');
          border-radius: rre(6, 'radius');
        }

        .btn-sm {
          padding: rre(8) rre(16);
          font-size: rre(14, 'fontSize');
          border-radius: rre(3, 'radius');
        }

        /* Card Component Library */
        .card {
          position: relative;
          display: flex;
          flex-direction: column;
          min-width: 0;
          word-wrap: break-word;
          background-color: #fff;
          background-clip: border-box;
          border: 1px solid rgba(0,0,0,.125);
          border-radius: rre(8, 'radius');
        }

        .card-header {
          padding: rre(16) rre(20);
          margin-bottom: 0;
          background-color: rgba(0,0,0,.03);
          border-bottom: 1px solid rgba(0,0,0,.125);
        }

        .card-body {
          flex: 1 1 auto;
          padding: rre(20);
        }

        .card-footer {
          padding: rre(16) rre(20);
          background-color: rgba(0,0,0,.03);
          border-top: 1px solid rgba(0,0,0,.125);
        }

        @media (max-width: 768px) {
          .btn {
            padding: rre(10) rre(20);
            font-size: rre(14, 'fontSize');
          }
          
          .btn-lg {
            padding: rre(14) rre(28);
            font-size: rre(18, 'fontSize');
          }
          
          .card-header,
          .card-body,
          .card-footer {
            padding: rre(16);
          }
        }
      `;

      const output = await processCss(input, defaultTestOptions);
      
      // Validate output
      const validation = CSSValidator.validateSyntax(output);
      expect(validation.valid).toBe(true);
      
      // Check for component library elements
      expect(output).toContain('var(--rre-padding)');
      expect(output).toContain('var(--rre-font-size)');
      expect(output).toContain('var(--rre-border-radius)');
      
      // Check for responsive behavior
      expect(output).toContain('@media (max-width: 768px)');
    });
  });
});
