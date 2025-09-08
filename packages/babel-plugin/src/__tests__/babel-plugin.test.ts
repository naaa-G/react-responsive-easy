/**
 * Tests for @react-responsive-easy/babel-plugin
 */

import { describe, it, expect } from 'vitest';
import { transformCode, assertions, testConfigs } from './utils/test-helpers';

describe('@react-responsive-easy/babel-plugin', () => {
  describe('useResponsiveValue transformations', () => {
    it('should transform simple useResponsiveValue call', () => {
      const input = `
        const fontSize = useResponsiveValue(24);
      `;
      
      const output = transformCode(input, testConfigs.development);
      
      assertions.shouldTransform(output);
      expect(output).toContain('24px');
    });
    
    it('should transform useResponsiveValue with token', () => {
      const input = `
        const fontSize = useResponsiveValue(18, { token: 'fontSize' });
      `;
      
      const output = transformCode(input, { precompute: true });
      
      expect(output).toContain('useMemo');
      expect(output).toContain('switch');
      expect(output).toContain('mobile');
      expect(output).toContain('tablet');
      expect(output).toContain('desktop');
    });
    
    it('should not transform when precompute is disabled', () => {
      const input = `
        const fontSize = useResponsiveValue(24);
      `;
      
      const output = transformCode(input, { precompute: false });
      
      expect(output).toContain('useResponsiveValue(24)');
      expect(output).not.toContain('useMemo');
    });
    
    it('should not transform non-static values', () => {
      const input = `
        const fontSize = useResponsiveValue(dynamicValue);
      `;
      
      const output = transformCode(input, { precompute: true });
      
      expect(output).toContain('useResponsiveValue(dynamicValue)');
      expect(output).not.toContain('useMemo');
    });
  });
  
  describe('useScaledStyle transformations', () => {
    it('should transform simple style object', () => {
      const input = `
        const styles = useScaledStyle({
          fontSize: 18,
          padding: 16
        });
      `;
      
      const output = transformCode(input, { precompute: true });
      
      expect(output).toContain('mobile');
      expect(output).toContain('tablet');
      expect(output).toContain('desktop');
    });
    
    it('should preserve non-numeric properties', () => {
      const input = `
        const styles = useScaledStyle({
          fontSize: 18,
          color: 'red',
          backgroundColor: '#fff'
        });
      `;
      
      const output = transformCode(input, { precompute: true });
      
      expect(output).toContain('color');
      expect(output).toContain('backgroundColor');
      expect(output).toContain('red');
      expect(output).toContain('#fff');
    });
  });
  
  describe('import handling', () => {
    it('should add necessary React imports', () => {
      const input = `
        const fontSize = useResponsiveValue(24);
      `;
      
      const output = transformCode(input, { precompute: true });
      
      expect(output).toContain('import { useMemo } from "react"');
    });
    
    it('should add RRE imports', () => {
      const input = `
        const fontSize = useResponsiveValue(24);
      `;
      
      const output = transformCode(input, { precompute: true });
      
      expect(output).toContain('import { useBreakpoint } from "react-responsive-easy"');
    });
    
    it('should use custom import source', () => {
      const input = `
        const fontSize = useResponsiveValue(24);
      `;
      
      const output = transformCode(input, { 
        precompute: true,
        importSource: '@my-org/responsive'
      });
      
      expect(output).toContain('import { useBreakpoint } from "@my-org/responsive"');
    });
  });
  
  describe('development mode', () => {
    it('should add comments in development mode', () => {
      const input = `
        const fontSize = useResponsiveValue(24, { token: 'fontSize' });
      `;
      
      const output = transformCode(input, { 
        precompute: true,
        development: true
      });
      
      expect(output).toContain('Optimized by @react-responsive-easy/babel-plugin');
      expect(output).toContain('useResponsiveValue(24');
    });
    
    it('should not add comments in production mode', () => {
      const input = `
        const fontSize = useResponsiveValue(24);
      `;
      
      const output = transformCode(input, { 
        precompute: true,
        development: false
      });
      
      expect(output).not.toContain('Optimized by @react-responsive-easy/babel-plugin');
    });
  });
  
  describe('error handling', () => {
    it('should handle malformed calls gracefully', () => {
      const input = `
        const fontSize = useResponsiveValue();
      `;
      
      expect(() => transformCode(input, { precompute: true })).not.toThrow();
    });
    
    it('should handle complex expressions', () => {
      const input = `
        const fontSize = useResponsiveValue(baseSize + 4, {
          token: getToken(),
          min: calculateMin()
        });
      `;
      
      expect(() => transformCode(input, { precompute: true })).not.toThrow();
    });
  });
  
  describe('configuration', () => {
    it('should use default options when none provided', () => {
      const input = `
        const fontSize = useResponsiveValue(24);
      `;
      
      const output = transformCode(input);
      
      expect(output).toContain('useMemo');
    });
    
    it('should respect custom configuration path', () => {
      const input = `
        const fontSize = useResponsiveValue(24);
      `;
      
      expect(() => transformCode(input, { 
        configPath: './custom-config.ts'
      })).not.toThrow();
    });
  });
});
