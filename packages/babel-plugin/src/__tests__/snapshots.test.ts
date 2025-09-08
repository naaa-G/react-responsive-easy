/**
 * Snapshot tests for consistent output
 */

import { describe, it, expect } from 'vitest';
import { transformCodeForSnapshots } from './utils/test-helpers';

// Helper function to transform code with our plugin
function transformCode(code: string, options = {}) {
  return transformCodeForSnapshots(code, options);
}

describe('Snapshot Tests', () => {
  describe('useResponsiveValue transformations', () => {
    it('should generate consistent output for simple numeric literal', () => {
      const input = `
        const fontSize = useResponsiveValue(24);
      `;
      
      const output = transformCode(input, { precompute: true });
      
      expect(output).toMatchSnapshot();
    });

    it('should generate consistent output with token configuration', () => {
      const input = `
        const fontSize = useResponsiveValue(18, { token: 'fontSize' });
      `;
      
      const output = transformCode(input, { precompute: true });
      
      expect(output).toMatchSnapshot();
    });

    it('should generate consistent output with spacing token', () => {
      const input = `
        const padding = useResponsiveValue(16, { token: 'spacing' });
      `;
      
      const output = transformCode(input, { precompute: true });
      
      expect(output).toMatchSnapshot();
    });

    it('should generate consistent output with radius token', () => {
      const input = `
        const borderRadius = useResponsiveValue(8, { token: 'radius' });
      `;
      
      const output = transformCode(input, { precompute: true });
      
      expect(output).toMatchSnapshot();
    });

    it('should generate consistent output for different numeric values', () => {
      const input = `
        const smallSize = useResponsiveValue(12, { token: 'fontSize' });
        const mediumSize = useResponsiveValue(16, { token: 'fontSize' });
        const largeSize = useResponsiveValue(24, { token: 'fontSize' });
        const xlSize = useResponsiveValue(32, { token: 'fontSize' });
      `;
      
      const output = transformCode(input, { precompute: true });
      
      expect(output).toMatchSnapshot();
    });
  });

  describe('useScaledStyle transformations', () => {
    it('should generate consistent output for simple style object', () => {
      const input = `
        const styles = useScaledStyle({
          fontSize: 18,
          padding: 16
        });
      `;
      
      const output = transformCode(input, { precompute: true });
      
      expect(output).toMatchSnapshot();
    });

    it('should generate consistent output for complex style object', () => {
      const input = `
        const styles = useScaledStyle({
          fontSize: 16,
          padding: 12,
          margin: 8,
          borderRadius: 4,
          borderWidth: 1,
          minHeight: 40,
          maxWidth: 200
        });
      `;
      
      const output = transformCode(input, { precompute: true });
      
      expect(output).toMatchSnapshot();
    });

    it('should generate consistent output for mixed properties', () => {
      const input = `
        const styles = useScaledStyle({
          fontSize: 18,
          color: 'red',
          backgroundColor: '#fff',
          padding: 16,
          margin: 8
        });
      `;
      
      const output = transformCode(input, { precompute: true });
      
      expect(output).toMatchSnapshot();
    });
  });

  describe('import handling', () => {
    it('should generate consistent import statements', () => {
      const input = `
        const fontSize = useResponsiveValue(24);
      `;
      
      const output = transformCode(input, { precompute: true });
      
      expect(output).toMatchSnapshot();
    });

    it('should generate consistent imports with custom source', () => {
      const input = `
        const fontSize = useResponsiveValue(24);
      `;
      
      const output = transformCode(input, { 
        precompute: true,
        importSource: '@custom/responsive'
      });
      
      expect(output).toMatchSnapshot();
    });

    it('should handle existing imports consistently', () => {
      const input = `
        import React from 'react';
        import { useState } from 'react';
        const fontSize = useResponsiveValue(24);
      `;
      
      const output = transformCode(input, { precompute: true });
      
      expect(output).toMatchSnapshot();
    });
  });

  describe('development mode', () => {
    it('should generate consistent development comments', () => {
      const input = `
        const fontSize = useResponsiveValue(24, { token: 'fontSize' });
      `;
      
      const output = transformCode(input, { 
        precompute: true,
        development: true
      });
      
      expect(output).toMatchSnapshot();
    });

    it('should generate consistent development comments for useScaledStyle', () => {
      const input = `
        const styles = useScaledStyle({ fontSize: 18 });
      `;
      
      const output = transformCode(input, { 
        precompute: true,
        development: true
      });
      
      expect(output).toMatchSnapshot();
    });

    it('should generate consistent production output', () => {
      const input = `
        const fontSize = useResponsiveValue(24, { token: 'fontSize' });
      `;
      
      const output = transformCode(input, { 
        precompute: true,
        development: false
      });
      
      expect(output).toMatchSnapshot();
    });
  });

  describe('configuration options', () => {
    it('should generate consistent output with precompute disabled', () => {
      const input = `
        const fontSize = useResponsiveValue(24, { token: 'fontSize' });
      `;
      
      const output = transformCode(input, { precompute: false });
      
      expect(output).toMatchSnapshot();
    });

    it('should generate consistent output with CSS props enabled', () => {
      const input = `
        const fontSize = useResponsiveValue(24, { token: 'fontSize' });
      `;
      
      const output = transformCode(input, { 
        precompute: true,
        generateCSSProps: true
      });
      
      expect(output).toMatchSnapshot();
    });

    it('should generate consistent output with custom config path', () => {
      const input = `
        const fontSize = useResponsiveValue(24, { token: 'fontSize' });
      `;
      
      const output = transformCode(input, { 
        precompute: true,
        configPath: './custom-config.ts'
      });
      
      expect(output).toMatchSnapshot();
    });
  });

  describe('complex scenarios', () => {
    it('should generate consistent output for complete component', () => {
      const input = `
        import React from 'react';
        import { useResponsiveValue, useScaledStyle } from 'react-responsive-easy';

        const Button = ({ children, variant = 'primary' }) => {
          const fontSize = useResponsiveValue(16, { token: 'fontSize' });
          const padding = useResponsiveValue(12, { token: 'spacing' });
          const borderRadius = useResponsiveValue(8, { token: 'radius' });
          
          const styles = useScaledStyle({
            fontSize: 14,
            padding: 8,
            margin: 4
          });

          return (
            <button
              style={{
                fontSize,
                padding,
                borderRadius,
                ...styles
              }}
            >
              {children}
            </button>
          );
        };

        export default Button;
      `;
      
      const output = transformCode(input, { precompute: true });
      
      expect(output).toMatchSnapshot();
    });

    it('should generate consistent output for TypeScript component', () => {
      const input = `
        import React from 'react';
        import { useResponsiveValue } from 'react-responsive-easy';

        interface ButtonProps {
          children: React.ReactNode;
          variant?: 'primary' | 'secondary';
        }

        const Button: React.FC<ButtonProps> = ({ children, variant = 'primary' }) => {
          const fontSize = useResponsiveValue(16, { token: 'fontSize' });
          const padding = useResponsiveValue(12, { token: 'spacing' });
          
          return (
            <button
              style={{
                fontSize,
                padding,
                backgroundColor: variant === 'primary' ? 'blue' : 'gray'
              }}
            >
              {children}
            </button>
          );
        };

        export default Button;
      `;
      
      const output = transformCode(input, { precompute: true });
      
      expect(output).toMatchSnapshot();
    });

    it('should generate consistent output for nested components', () => {
      const input = `
        import React from 'react';
        import { useResponsiveValue } from 'react-responsive-easy';

        const Card = ({ title, content }) => {
          const titleSize = useResponsiveValue(24, { token: 'fontSize' });
          const contentSize = useResponsiveValue(16, { token: 'fontSize' });
          const padding = useResponsiveValue(20, { token: 'spacing' });
          
          return (
            <div style={{ padding }}>
              <h2 style={{ fontSize: titleSize }}>{title}</h2>
              <p style={{ fontSize: contentSize }}>{content}</p>
            </div>
          );
        };

        const CardGrid = ({ cards }) => {
          const gap = useResponsiveValue(16, { token: 'spacing' });
          
          return (
            <div style={{ display: 'grid', gap }}>
              {cards.map(card => (
                <Card key={card.id} {...card} />
              ))}
            </div>
          );
        };

        export default CardGrid;
      `;
      
      const output = transformCode(input, { precompute: true });
      
      expect(output).toMatchSnapshot();
    });
  });

  describe('error scenarios', () => {
    it('should generate consistent output for malformed calls', () => {
      const input = `
        const fontSize = useResponsiveValue();
        const padding = useResponsiveValue(undefined);
        const margin = useResponsiveValue(null);
      `;
      
      const output = transformCode(input, { precompute: true });
      
      expect(output).toMatchSnapshot();
    });

    it('should generate consistent output for complex expressions', () => {
      const input = `
        const fontSize = useResponsiveValue(baseSize + 4, {
          token: getToken(),
          min: calculateMin()
        });
      `;
      
      const output = transformCode(input, { precompute: true });
      
      expect(output).toMatchSnapshot();
    });

    it('should generate consistent output for non-object arguments', () => {
      const input = `
        const styles = useScaledStyle(null);
        const otherStyles = useScaledStyle(undefined);
        const moreStyles = useScaledStyle('string');
      `;
      
      const output = transformCode(input, { precompute: true });
      
      expect(output).toMatchSnapshot();
    });
  });
});
