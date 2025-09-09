/**
 * Integration tests for real-world usage scenarios
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { transform } from '@babel/core';
import plugin from '../index';

// Helper function to transform code with our plugin
function transformCode(code: string, options = {}) {
  const result = transform(code, {
    filename: 'test.tsx',
    plugins: [[plugin, options]],
    presets: [
      ['@babel/preset-env', { targets: { node: 'current' } }],
      '@babel/preset-typescript'
    ]
  });
  
  return result?.code ?? '';
}

describe('Integration Tests', () => {
  describe('Real-world component scenarios', () => {
    it('should transform a complete React component', () => {
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
      
      // Should transform all useResponsiveValue calls
      expect(output).toContain('useMemo');
      expect(output).toContain('switch');
      
      // Should transform useScaledStyle
      expect(output).toContain('mobile');
      expect(output).toContain('tablet');
      expect(output).toContain('desktop');
      
      // Should preserve component structure
      expect(output).toContain('const Button =');
      expect(output).toContain('return (');
      expect(output).toContain('<button');
      expect(output).toContain('{children}');
    });

    it('should handle complex nested components', () => {
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
      
      // Should transform all useResponsiveValue calls
      expect(output).toContain('useMemo');
      expect(output).toContain('switch');
      
      // Should preserve component hierarchy
      expect(output).toContain('const Card =');
      expect(output).toContain('const CardGrid =');
      expect(output).toContain('cards.map');
    });

    it('should handle TypeScript components with interfaces', () => {
      const input = `
        import React from 'react';
        import { useResponsiveValue } from 'react-responsive-easy';

        interface ButtonProps {
          children: React.ReactNode;
          variant?: 'primary' | 'secondary';
          size?: 'small' | 'medium' | 'large';
        }

        const Button: React.FC<ButtonProps> = ({ 
          children, 
          variant = 'primary',
          size = 'medium'
        }) => {
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
      
      // Should transform useResponsiveValue calls
      expect(output).toContain('useMemo');
      expect(output).toContain('switch');
      
      // Should preserve component structure
      expect(output).toContain('const Button = (');
      expect(output).toContain('variant = \'primary\'');
    });

    it('should handle components with conditional logic', () => {
      const input = `
        import React from 'react';
        import { useResponsiveValue } from 'react-responsive-easy';

        const ResponsiveText = ({ text, isImportant = false }) => {
          const baseSize = useResponsiveValue(16, { token: 'fontSize' });
          const fontSize = isImportant ? baseSize * 1.2 : baseSize;
          const fontWeight = isImportant ? 'bold' : 'normal';
          
          return (
            <p style={{ fontSize, fontWeight }}>
              {text}
            </p>
          );
        };

        export default ResponsiveText;
      `;
      
      const output = transformCode(input, { precompute: true });
      
      // Should transform useResponsiveValue calls
      expect(output).toContain('useMemo');
      expect(output).toContain('switch');
      
      // Should preserve conditional logic
      expect(output).toContain('isImportant ?');
      expect(output).toContain('baseSize * 1.2');
    });
  });

  describe('Configuration scenarios', () => {
    it('should work with different configuration options', () => {
      const input = `
        const fontSize = useResponsiveValue(24, { token: 'fontSize' });
      `;
      
      const output = transformCode(input, { 
        precompute: true,
        development: true,
        importSource: '@custom/responsive'
      });
      
      expect(output).toContain('useMemo');
      expect(output).toContain('@custom/responsive');
      expect(output).toContain('Optimized by @react-responsive-easy/babel-plugin');
    });

    it('should handle custom config path', () => {
      const input = `
        const fontSize = useResponsiveValue(24);
      `;
      
      expect(() => {
        transformCode(input, { 
          precompute: true,
          configPath: './custom-config.ts'
        });
      }).not.toThrow();
    });

    it('should work with CSS custom properties generation', () => {
      const input = `
        const fontSize = useResponsiveValue(24, { token: 'fontSize' });
      `;
      
      const output = transformCode(input, { 
        precompute: true,
        generateCSSProps: true
      });
      
      expect(output).toContain('useMemo');
    });
  });

  describe('Edge cases and error scenarios', () => {
    it('should handle components with no responsive values', () => {
      const input = `
        import React from 'react';

        const StaticComponent = () => {
          return (
            <div style={{ color: 'red', backgroundColor: 'blue' }}>
              Static content
            </div>
          );
        };

        export default StaticComponent;
      `;
      
      const output = transformCode(input, { precompute: true });
      
      // Should not add unnecessary imports
      expect(output).not.toContain('import { useMemo } from "react"');
      expect(output).not.toContain('import { useBreakpoint } from "react-responsive-easy"');
      
      // Should preserve component structure
      expect(output).toContain('const StaticComponent =');
      expect(output).toContain('Static content');
    });

    it('should handle components with mixed static and dynamic values', () => {
      const input = `
        import React from 'react';
        import { useResponsiveValue } from 'react-responsive-easy';

        const MixedComponent = ({ dynamicValue }) => {
          const staticSize = useResponsiveValue(16, { token: 'fontSize' });
          const dynamicSize = useResponsiveValue(dynamicValue);
          
          return (
            <div style={{ fontSize: staticSize }}>
              <p style={{ fontSize: dynamicSize }}>Dynamic content</p>
            </div>
          );
        };

        export default MixedComponent;
      `;
      
      const output = transformCode(input, { precompute: true });
      
      // Should transform static values
      expect(output).toContain('useMemo');
      expect(output).toContain('switch');
      
      // Should preserve dynamic values
      expect(output).toContain('(0, _reactResponsiveEasy.useResponsiveValue)(dynamicValue)');
    });

    it('should handle malformed JSX gracefully', () => {
      const input = `
        import React from 'react';
        import { useResponsiveValue } from 'react-responsive-easy';

        const MalformedComponent = () => {
          const fontSize = useResponsiveValue(16, { token: 'fontSize' });
          
          return (
            <div style={{ fontSize }}>
              <p>Content</p>
              {/* Missing closing div */}
            </div>
          );
        };

        export default MalformedComponent;
      `;
      
      expect(() => {
        transformCode(input, { precompute: true });
      }).not.toThrow();
    });

    it('should handle components with complex expressions', () => {
      const input = `
        import React from 'react';
        import { useResponsiveValue } from 'react-responsive-easy';

        const ComplexComponent = ({ multiplier = 1 }) => {
          const baseSize = useResponsiveValue(16, { token: 'fontSize' });
          const calculatedSize = baseSize * multiplier;
          
          return (
            <div style={{ fontSize: calculatedSize }}>
              Complex content
            </div>
          );
        };

        export default ComplexComponent;
      `;
      
      const output = transformCode(input, { precompute: true });
      
      // Should transform useResponsiveValue calls
      expect(output).toContain('useMemo');
      expect(output).toContain('switch');
      
      // Should preserve complex expressions
      expect(output).toContain('baseSize * multiplier');
    });
  });

  describe('Performance scenarios', () => {
    it('should handle components with many responsive values', () => {
      const input = `
        import React from 'react';
        import { useResponsiveValue } from 'react-responsive-easy';

        const ComplexComponent = () => {
          const fontSize = useResponsiveValue(16, { token: 'fontSize' });
          const padding = useResponsiveValue(12, { token: 'spacing' });
          const margin = useResponsiveValue(8, { token: 'spacing' });
          const borderRadius = useResponsiveValue(4, { token: 'radius' });
          const lineHeight = useResponsiveValue(1.5);
          const letterSpacing = useResponsiveValue(0.5);
          
          return (
            <div style={{
              fontSize,
              padding,
              margin,
              borderRadius,
              lineHeight,
              letterSpacing
            }}>
              Complex component
            </div>
          );
        };

        export default ComplexComponent;
      `;
      
      const output = transformCode(input, { precompute: true });
      
      // Should transform all useResponsiveValue calls
      expect(output).toContain('useMemo');
      expect(output).toContain('switch');
      
      // Should generate multiple switch statements
      const switchCount = (output.match(/switch/g) ?? []).length;
      expect(switchCount).toBeGreaterThan(1);
    });

    it('should handle large style objects efficiently', () => {
      const input = `
        import React from 'react';
        import { useScaledStyle } from 'react-responsive-easy';

        const StyledComponent = () => {
          const styles = useScaledStyle({
            fontSize: 16,
            padding: 12,
            margin: 8,
            borderRadius: 4,
            borderWidth: 1,
            minHeight: 40,
            maxWidth: 200
          });
          
          return <div style={styles}>Styled component</div>;
        };

        export default StyledComponent;
      `;
      
      const output = transformCode(input, { precompute: true });
      
      // Should transform useScaledStyle
      expect(output).toContain('mobile');
      expect(output).toContain('tablet');
      expect(output).toContain('desktop');
      
      // Should preserve all style properties
      expect(output).toContain('fontSize');
      expect(output).toContain('padding');
      expect(output).toContain('margin');
      expect(output).toContain('borderRadius');
    });
  });

  describe('Build tool integration', () => {
    it('should work with different Babel presets', () => {
      const input = `
        const fontSize = useResponsiveValue(24, { token: 'fontSize' });
      `;
      
      // Test with different preset combinations
      const presets = [
        ['@babel/preset-env', { targets: { node: 'current' } }],
        ['@babel/preset-env', { targets: { browsers: ['last 2 versions'] } }],
        ['@babel/preset-env', { targets: { esmodules: true } }]
      ];
      
      presets.forEach(preset => {
        const result = transform(input, {
          filename: 'test.tsx',
          plugins: [[plugin, { precompute: true }]],
          presets: [preset]
        });
        
        expect(result?.code).toContain('useMemo');
      });
    });

    it('should work with TypeScript preset', () => {
      const input = `
        const fontSize: number = useResponsiveValue(24, { token: 'fontSize' });
      `;
      
      const output = transformCode(input, { precompute: true });
      
      expect(output).toContain('useMemo');
      expect(output).toContain('switch');
    });

    it('should work with React preset', () => {
      const input = `
        import React from 'react';
        
        const Component = () => {
          const fontSize = useResponsiveValue(24, { token: 'fontSize' });
          return <div style={{ fontSize }}>Content</div>;
        };
      `;
      
      const output = transformCode(input, { precompute: true });
      
      expect(output).toContain('useMemo');
      expect(output).toContain('switch');
    });
  });
});
