/**
 * Fixture-based tests for real-world scenarios
 */

import { describe, it, expect } from 'vitest';
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
  
  return result?.code || '';
}

describe('Fixture Tests', () => {
  describe('Real-world component fixtures', () => {
    it('should transform a typical button component', () => {
      const input = `
        import React from 'react';
        import { useResponsiveValue } from 'react-responsive-easy';

        interface ButtonProps {
          children: React.ReactNode;
          variant?: 'primary' | 'secondary' | 'danger';
          size?: 'small' | 'medium' | 'large';
          disabled?: boolean;
          onClick?: () => void;
        }

        const Button: React.FC<ButtonProps> = ({
          children,
          variant = 'primary',
          size = 'medium',
          disabled = false,
          onClick
        }) => {
          const fontSize = useResponsiveValue(16, { token: 'fontSize' });
          const padding = useResponsiveValue(12, { token: 'spacing' });
          const borderRadius = useResponsiveValue(6, { token: 'radius' });
          const minHeight = useResponsiveValue(40, { token: 'spacing' });

          const getVariantStyles = () => {
            switch (variant) {
              case 'primary':
                return { backgroundColor: '#007bff', color: 'white' };
              case 'secondary':
                return { backgroundColor: '#6c757d', color: 'white' };
              case 'danger':
                return { backgroundColor: '#dc3545', color: 'white' };
              default:
                return { backgroundColor: '#007bff', color: 'white' };
            }
          };

          const getSizeStyles = () => {
            switch (size) {
              case 'small':
                return { fontSize: fontSize * 0.875, padding: padding * 0.75 };
              case 'large':
                return { fontSize: fontSize * 1.25, padding: padding * 1.25 };
              default:
                return { fontSize, padding };
            }
          };

          return (
            <button
              onClick={onClick}
              disabled={disabled}
              style={{
                ...getVariantStyles(),
                ...getSizeStyles(),
                borderRadius,
                minHeight,
                border: 'none',
                cursor: disabled ? 'not-allowed' : 'pointer',
                opacity: disabled ? 0.6 : 1,
                transition: 'all 0.2s ease'
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
      
      // Should preserve component structure
      expect(output).toContain('const Button = (');
      expect(output).toContain('getVariantStyles');
      expect(output).toContain('getSizeStyles');
    });

    it('should transform a card component with complex layout', () => {
      const input = `
        import React from 'react';
        import { useResponsiveValue, useScaledStyle } from 'react-responsive-easy';

        interface CardProps {
          title: string;
          content: string;
          image?: string;
          actions?: React.ReactNode;
          elevation?: 'low' | 'medium' | 'high';
        }

        const Card: React.FC<CardProps> = ({
          title,
          content,
          image,
          actions,
          elevation = 'medium'
        }) => {
          const titleSize = useResponsiveValue(20, { token: 'fontSize' });
          const contentSize = useResponsiveValue(14, { token: 'fontSize' });
          const padding = useResponsiveValue(16, { token: 'spacing' });
          const margin = useResponsiveValue(8, { token: 'spacing' });
          const borderRadius = useResponsiveValue(8, { token: 'radius' });
          
          const styles = useScaledStyle({
            fontSize: 12,
            padding: 8,
            margin: 4,
            borderRadius: 4
          });

          const getElevationStyles = () => {
            switch (elevation) {
              case 'low':
                return { boxShadow: '0 1px 3px rgba(0,0,0,0.12)' };
              case 'high':
                return { boxShadow: '0 8px 24px rgba(0,0,0,0.15)' };
              default:
                return { boxShadow: '0 2px 8px rgba(0,0,0,0.1)' };
            }
          };

          return (
            <div
              style={{
                padding,
                margin,
                borderRadius,
                backgroundColor: 'white',
                ...getElevationStyles()
              }}
            >
              {image && (
                <img
                  src={image}
                  alt={title}
                  style={{
                    width: '100%',
                    height: 'auto',
                    borderRadius: borderRadius * 0.5,
                    marginBottom: padding * 0.5
                  }}
                />
              )}
              <h3 style={{ fontSize: titleSize, margin: 0, marginBottom: padding * 0.5 }}>
                {title}
              </h3>
              <p style={{ fontSize: contentSize, margin: 0, marginBottom: padding }}>
                {content}
              </p>
              {actions && (
                <div style={styles}>
                  {actions}
                </div>
              )}
            </div>
          );
        };

        export default Card;
      `;
      
      const output = transformCode(input, { precompute: true });
      
      // Should transform all responsive values
      expect(output).toContain('useMemo');
      expect(output).toContain('switch');
      
      // Should preserve complex component structure
      expect(output).toContain('const Card = (');
      expect(output).toContain('getElevationStyles');
      expect(output).toContain('image &&');
    });

    it('should transform a navigation component', () => {
      const input = `
        import React, { useState } from 'react';
        import { useResponsiveValue } from 'react-responsive-easy';

        interface NavItem {
          label: string;
          href: string;
          active?: boolean;
        }

        interface NavigationProps {
          items: NavItem[];
          brand?: string;
          onItemClick?: (item: NavItem) => void;
        }

        const Navigation: React.FC<NavigationProps> = ({
          items,
          brand,
          onItemClick
        }) => {
          const [isOpen, setIsOpen] = useState(false);
          
          const fontSize = useResponsiveValue(16, { token: 'fontSize' });
          const padding = useResponsiveValue(16, { token: 'spacing' });
          const height = useResponsiveValue(60, { token: 'spacing' });
          const itemSpacing = useResponsiveValue(24, { token: 'spacing' });

          return (
            <nav
              style={{
                height,
                padding,
                backgroundColor: '#fff',
                borderBottom: '1px solid #e0e0e0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              {brand && (
                <div
                  style={{
                    fontSize: fontSize * 1.25,
                    fontWeight: 'bold',
                    color: '#333'
                  }}
                >
                  {brand}
                </div>
              )}
              
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: itemSpacing
                }}
              >
                {items.map((item, index) => (
                  <a
                    key={index}
                    href={item.href}
                    onClick={(e) => {
                      e.preventDefault();
                      onItemClick?.(item);
                    }}
                    style={{
                      fontSize,
                      color: item.active ? '#007bff' : '#666',
                      textDecoration: 'none',
                      padding: padding * 0.5,
                      borderRadius: 4,
                      transition: 'color 0.2s ease'
                    }}
                  >
                    {item.label}
                  </a>
                ))}
              </div>
            </nav>
          );
        };

        export default Navigation;
      `;
      
      const output = transformCode(input, { precompute: true });
      
      // Should transform all useResponsiveValue calls
      expect(output).toContain('useMemo');
      expect(output).toContain('switch');
      
      // Should preserve navigation structure
      expect(output).toContain('const Navigation = (');
      expect(output).toContain('items.map');
    });

    it('should transform a form component with validation', () => {
      const input = `
        import React, { useState, useCallback } from 'react';
        import { useResponsiveValue } from 'react-responsive-easy';

        interface FormFieldProps {
          label: string;
          type?: 'text' | 'email' | 'password' | 'number';
          required?: boolean;
          error?: string;
          value: string;
          onChange: (value: string) => void;
        }

        const FormField: React.FC<FormFieldProps> = ({
          label,
          type = 'text',
          required = false,
          error,
          value,
          onChange
        }) => {
          const labelSize = useResponsiveValue(14, { token: 'fontSize' });
          const inputSize = useResponsiveValue(16, { token: 'fontSize' });
          const padding = useResponsiveValue(12, { token: 'spacing' });
          const margin = useResponsiveValue(8, { token: 'spacing' });
          const borderRadius = useResponsiveValue(4, { token: 'radius' });

          const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
            onChange(e.target.value);
          }, [onChange]);

          return (
            <div style={{ marginBottom: margin * 2 }}>
              <label
                style={{
                  display: 'block',
                  fontSize: labelSize,
                  fontWeight: '500',
                  marginBottom: margin * 0.5,
                  color: error ? '#dc3545' : '#333'
                }}
              >
                {label}
                {required && <span style={{ color: '#dc3545' }}> *</span>}
              </label>
              <input
                type={type}
                value={value}
                onChange={handleChange}
                required={required}
                style={{
                  width: '100%',
                  fontSize: inputSize,
                  padding,
                  borderRadius,
                  border: error ? '2px solid #dc3545' : '1px solid #ddd',
                  outline: 'none',
                  transition: 'border-color 0.2s ease'
                }}
              />
              {error && (
                <div
                  style={{
                    fontSize: labelSize * 0.875,
                    color: '#dc3545',
                    marginTop: margin * 0.5
                  }}
                >
                  {error}
                </div>
              )}
            </div>
          );
        };

        export default FormField;
      `;
      
      const output = transformCode(input, { precompute: true });
      
      // Should transform all useResponsiveValue calls
      expect(output).toContain('useMemo');
      expect(output).toContain('switch');
      
      // Should preserve form structure
      expect(output).toContain('const FormField = (');
      expect(output).toContain('useCallback');
      expect(output).toContain('handleChange');
    });
  });

  describe('Complex layout fixtures', () => {
    it('should transform a dashboard layout', () => {
      const input = `
        import React from 'react';
        import { useResponsiveValue, useScaledStyle } from 'react-responsive-easy';

        interface DashboardProps {
          sidebar?: React.ReactNode;
          header?: React.ReactNode;
          children: React.ReactNode;
        }

        const Dashboard: React.FC<DashboardProps> = ({
          sidebar,
          header,
          children
        }) => {
          const sidebarWidth = useResponsiveValue(250, { token: 'spacing' });
          const headerHeight = useResponsiveValue(60, { token: 'spacing' });
          const padding = useResponsiveValue(16, { token: 'spacing' });
          const gap = useResponsiveValue(16, { token: 'spacing' });
          
          const contentStyles = useScaledStyle({
            padding: 12,
            margin: 8,
            borderRadius: 8
          });

          return (
            <div
              style={{
                display: 'flex',
                height: '100vh',
                backgroundColor: '#f5f5f5'
              }}
            >
              {sidebar && (
                <aside
                  style={{
                    width: sidebarWidth,
                    backgroundColor: '#fff',
                    borderRight: '1px solid #e0e0e0',
                    padding,
                    overflowY: 'auto'
                  }}
                >
                  {sidebar}
                </aside>
              )}
              
              <div
                style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  overflow: 'hidden'
                }}
              >
                {header && (
                  <header
                    style={{
                      height: headerHeight,
                      backgroundColor: '#fff',
                      borderBottom: '1px solid #e0e0e0',
                      padding,
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    {header}
                  </header>
                )}
                
                <main
                  style={{
                    flex: 1,
                    padding,
                    overflowY: 'auto',
                    display: 'grid',
                    gap,
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))'
                  }}
                >
                  {React.Children.map(children, (child, index) => (
                    <div key={index} style={contentStyles}>
                      {child}
                    </div>
                  ))}
                </main>
              </div>
            </div>
          );
        };

        export default Dashboard;
      `;
      
      const output = transformCode(input, { precompute: true });
      
      // Should transform all responsive values
      expect(output).toContain('useMemo');
      expect(output).toContain('switch');
      
      // Should preserve complex layout structure
      expect(output).toContain('const Dashboard = (');
      expect(output).toContain('_react.default.Children.map');
    });

    it('should transform a responsive grid component', () => {
      const input = `
        import React from 'react';
        import { useResponsiveValue } from 'react-responsive-easy';

        interface GridItemProps {
          children: React.ReactNode;
          span?: number;
          order?: number;
        }

        interface GridProps {
          children: React.ReactNode;
          columns?: number;
          gap?: number;
          alignItems?: 'start' | 'center' | 'end' | 'stretch';
        }

        const GridItem: React.FC<GridItemProps> = ({
          children,
          span = 1,
          order = 0
        }) => {
          const padding = useResponsiveValue(16, { token: 'spacing' });
          const borderRadius = useResponsiveValue(8, { token: 'radius' });

          return (
            <div
              style={{
                gridColumn: \`span \${span}\`,
                order,
                padding,
                borderRadius,
                backgroundColor: '#fff',
                border: '1px solid #e0e0e0'
              }}
            >
              {children}
            </div>
          );
        };

        const Grid: React.FC<GridProps> = ({
          children,
          columns = 12,
          gap = 16,
          alignItems = 'stretch'
        }) => {
          const responsiveGap = useResponsiveValue(gap, { token: 'spacing' });
          const padding = useResponsiveValue(16, { token: 'spacing' });

          return (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: \`repeat(\${columns}, 1fr)\`,
                gap: responsiveGap,
                padding,
                alignItems
              }}
            >
              {children}
            </div>
          );
        };

        export { Grid, GridItem };
      `;
      
      const output = transformCode(input, { precompute: true });
      
      // Should transform all useResponsiveValue calls
      expect(output).toContain('useMemo');
      expect(output).toContain('switch');
      
      // Should preserve grid structure
      expect(output).toContain('const GridItem = (');
      expect(output).toContain('const Grid = (');
      expect(output).toContain('exports.Grid = Grid');
    });
  });

  describe('Animation and interaction fixtures', () => {
    it('should transform a modal component with animations', () => {
      const input = `
        import React, { useEffect, useRef } from 'react';
        import { useResponsiveValue } from 'react-responsive-easy';

        interface ModalProps {
          isOpen: boolean;
          onClose: () => void;
          title?: string;
          children: React.ReactNode;
          size?: 'small' | 'medium' | 'large';
        }

        const Modal: React.FC<ModalProps> = ({
          isOpen,
          onClose,
          title,
          children,
          size = 'medium'
        }) => {
          const modalRef = useRef<HTMLDivElement>(null);
          
          const fontSize = useResponsiveValue(18, { token: 'fontSize' });
          const padding = useResponsiveValue(24, { token: 'spacing' });
          const borderRadius = useResponsiveValue(8, { token: 'radius' });
          const maxWidth = useResponsiveValue(500, { token: 'spacing' });

          const getSizeStyles = () => {
            switch (size) {
              case 'small':
                return { maxWidth: maxWidth * 0.6 };
              case 'large':
                return { maxWidth: maxWidth * 1.4 };
              default:
                return { maxWidth };
            }
          };

          useEffect(() => {
            const handleEscape = (e: KeyboardEvent) => {
              if (e.key === 'Escape') {
                onClose();
              }
            };

            if (isOpen) {
              document.addEventListener('keydown', handleEscape);
              document.body.style.overflow = 'hidden';
            }

            return () => {
              document.removeEventListener('keydown', handleEscape);
              document.body.style.overflow = 'unset';
            };
          }, [isOpen, onClose]);

          if (!isOpen) return null;

          return (
            <div
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1000,
                animation: 'fadeIn 0.3s ease'
              }}
              onClick={onClose}
            >
              <div
                ref={modalRef}
                style={{
                  backgroundColor: 'white',
                  borderRadius,
                  padding,
                  ...getSizeStyles(),
                  maxHeight: '90vh',
                  overflowY: 'auto',
                  animation: 'slideIn 0.3s ease',
                  transform: 'translateY(0)'
                }}
                onClick={(e) => e.stopPropagation()}
              >
                {title && (
                  <h2
                    style={{
                      fontSize,
                      margin: 0,
                      marginBottom: padding * 0.5,
                      color: '#333'
                    }}
                  >
                    {title}
                  </h2>
                )}
                {children}
              </div>
            </div>
          );
        };

        export default Modal;
      `;
      
      const output = transformCode(input, { precompute: true });
      
      // Should transform all useResponsiveValue calls
      expect(output).toContain('useMemo');
      expect(output).toContain('switch');
      
      // Should preserve modal structure
      expect(output).toContain('const Modal = (');
      expect(output).toContain('useEffect');
      expect(output).toContain('useRef');
    });
  });

  describe('Error boundary fixtures', () => {
    it('should transform components with error handling', () => {
      const input = `
        import React, { Component, ErrorInfo, ReactNode } from 'react';
        import { useResponsiveValue } from 'react-responsive-easy';

        interface ErrorBoundaryState {
          hasError: boolean;
          error?: Error;
        }

        interface ErrorBoundaryProps {
          children: ReactNode;
          fallback?: ReactNode;
        }

        class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
          constructor(props: ErrorBoundaryProps) {
            super(props);
            this.state = { hasError: false };
          }

          static getDerivedStateFromError(error: Error): ErrorBoundaryState {
            return { hasError: true, error };
          }

          componentDidCatch(error: Error, errorInfo: ErrorInfo) {
            console.error('Error caught by boundary:', error, errorInfo);
          }

          render() {
            if (this.state.hasError) {
              return this.props.fallback || <ErrorFallback error={this.state.error} />;
            }

            return this.props.children;
          }
        }

        const ErrorFallback: React.FC<{ error?: Error }> = ({ error }) => {
          const fontSize = useResponsiveValue(16, { token: 'fontSize' });
          const padding = useResponsiveValue(16, { token: 'spacing' });
          const borderRadius = useResponsiveValue(8, { token: 'radius' });

          return (
            <div
              style={{
                padding,
                borderRadius,
                backgroundColor: '#f8d7da',
                border: '1px solid #f5c6cb',
                color: '#721c24'
              }}
            >
              <h2 style={{ fontSize: fontSize * 1.25, margin: 0, marginBottom: padding * 0.5 }}>
                Something went wrong
              </h2>
              <p style={{ fontSize, margin: 0 }}>
                {error?.message || 'An unexpected error occurred'}
              </p>
            </div>
          );
        };

        export { ErrorBoundary, ErrorFallback };
      `;
      
      const output = transformCode(input, { precompute: true });
      
      // Should transform useResponsiveValue calls
      expect(output).toContain('useMemo');
      expect(output).toContain('switch');
      
      // Should preserve error boundary structure
      expect(output).toContain('class ErrorBoundary');
      expect(output).toContain('componentDidCatch');
      expect(output).toContain('getDerivedStateFromError');
    });
  });
});
