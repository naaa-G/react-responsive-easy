'use client';

import { useState, useEffect, useRef } from 'react';
import { transform } from '@babel/standalone';
import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils';

// Mock React Responsive Easy components for the playground
const mockResponsiveProvider = ({ children, config, debug }: any) => {
  return React.createElement('div', {
    'data-responsive-provider': true,
    'data-config': JSON.stringify(config),
    'data-debug': debug,
    style: {
      fontFamily: 'Inter, sans-serif',
      padding: '20px',
      background: 'linear-gradient(135deg, #f0f9ff 0%, #e0e7ff 100%)',
      borderRadius: '12px',
      minHeight: '200px',
    }
  }, children);
};

const mockUseResponsiveValue = (value: any) => {
  // Simple scaling simulation
  const scale = typeof window !== 'undefined' ? 
    Math.min(window.innerWidth / 1440, 1) : 1;
  
  if (typeof value === 'number') {
    return Math.round(value * scale);
  }
  return value;
};

const mockUseScaledStyle = (styles: any) => {
  const scale = typeof window !== 'undefined' ? 
    Math.min(window.innerWidth / 1440, 1) : 1;
  
  const scaledStyles = { ...styles };
  
  // Scale numeric CSS properties
  Object.keys(scaledStyles).forEach(key => {
    const value = scaledStyles[key];
    if (typeof value === 'number') {
      scaledStyles[key] = Math.round(value * scale);
    }
  });
  
  return scaledStyles;
};

const mockUseBreakpoint = () => {
  const width = typeof window !== 'undefined' ? window.innerWidth : 1440;
  
  if (width < 768) {
    return { name: 'Mobile', width: 375, height: 667, alias: 'mobile' };
  } else if (width < 1024) {
    return { name: 'Tablet', width: 768, height: 1024, alias: 'tablet' };
  } else {
    return { name: 'Desktop', width: 1440, height: 900, alias: 'desktop' };
  }
};

// Available imports for the playground
const availableImports = {
  'react': React,
  '@react-responsive-easy/core': {
    ResponsiveProvider: mockResponsiveProvider,
    useResponsiveValue: mockUseResponsiveValue,
    useScaledStyle: mockUseScaledStyle,
    useBreakpoint: mockUseBreakpoint,
  },
};

interface LivePreviewProps {
  code: string;
  className?: string;
  showRefresh?: boolean;
  onError?: (error: Error) => void;
  onSuccess?: () => void;
}

export function LivePreview({ 
  code, 
  className, 
  showRefresh = true,
  onError,
  onSuccess 
}: LivePreviewProps) {
  const [compiledCode, setCompiledCode] = useState<string>('');
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const previewRef = useRef<HTMLDivElement>(null);

  // Setup React and mock components in global scope for playground execution
  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).React = React;
      
      // Also make mock components available globally
      (window as any).mockResponsiveProvider = mockResponsiveProvider;
      (window as any).mockUseResponsiveValue = mockUseResponsiveValue;
      (window as any).mockUseScaledStyle = mockUseScaledStyle;
      (window as any).mockUseBreakpoint = mockUseBreakpoint;
    }
    
    // Cleanup function to remove from global scope
    return () => {
      if (typeof window !== 'undefined') {
        delete (window as any).React;
        delete (window as any).mockResponsiveProvider;
        delete (window as any).mockUseResponsiveValue;
        delete (window as any).mockUseScaledStyle;
        delete (window as any).mockUseBreakpoint;
      }
    };
  }, []);

  // Transform and execute code
  const executeCode = async (sourceCode: string) => {
    try {
      setIsLoading(true);
      setError(null);

      // Transform JSX/TSX to executable JavaScript
      const result = transform(sourceCode, {
        presets: [
          ['react', { runtime: 'classic' }],
          ['typescript', { isTSX: true, allExtensions: true }]
        ],
        plugins: []
      });

      if (!result.code) {
        throw new Error('Failed to compile code');
      }

      let transformedCode = result.code;

      // Manually handle export statements to prevent syntax errors
      transformedCode = transformedCode
        .replace(/export\s+default\s+/g, 'var __defaultExport = ')
        .replace(/export\s*{([^}]+)}\s*;?/g, (match, exports) => {
          const exportNames = exports.split(',').map((exp: string) => exp.trim());
          return exportNames.map((exp: string) => {
            const [name, alias] = exp.split(' as ').map((s: string) => s.trim());
            const finalName = alias || name;
            return `var ${finalName} = ${name};`;
          }).join('\n');
        });

      // Replace import statements with available imports
      Object.entries(availableImports).forEach(([moduleName, moduleExports]) => {
        const importRegex = new RegExp(
          `import\\s+(?:{([^}]+)}|([\\w$]+))\\s+from\\s+['"]${moduleName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}['"];?`,
          'g'
        );
        
        transformedCode = transformedCode.replace(importRegex, (match, namedImports, defaultImport) => {
          if (namedImports) {
            // Handle named imports: import { Component } from 'module'
            const imports = namedImports.split(',').map((imp: string) => imp.trim());
            return imports.map((imp: string) => {
              const [importName, alias] = imp.split(' as ').map((s: string) => s.trim());
              const finalName = alias || importName;
              if (moduleName === 'react') {
                // Handle React imports
                return `var ${finalName} = React.${importName};`;
              } else {
                // Handle other module imports
                return `var ${finalName} = ${JSON.stringify((moduleExports as any)[importName])};`;
              }
            }).join('\n');
          } else if (defaultImport) {
            // Handle default imports: import React from 'react'
            if (moduleName === 'react') {
              return `var ${defaultImport} = React;`;
            } else {
              return `var ${defaultImport} = ${JSON.stringify(moduleExports)};`;
            }
          }
          return '';
        });
      });

                    // Wrap in function and execute
        const executeFunction = new Function(`
          return function() {
            // Make React available globally by referencing it from the outer scope
            var React = window.React || this.React;
            
            // Make mock components available - use direct assignment instead of JSON.stringify
            var ResponsiveProvider = window.mockResponsiveProvider || window.ResponsiveProvider;
            var useResponsiveValue = window.mockUseResponsiveValue || window.useResponsiveValue;
            var useScaledStyle = window.mockUseScaledStyle || window.useScaledStyle;
            var useBreakpoint = window.mockUseBreakpoint || window.useBreakpoint;
            
            // Debug: Log what we're getting from window
            console.log('executeCode - Getting ResponsiveProvider from window:', window.mockResponsiveProvider);
            console.log('executeCode - Getting useResponsiveValue from window:', window.mockUseResponsiveValue);
            
            // If mock components are not available, create fallback versions
            if (!ResponsiveProvider) {
              console.warn('executeCode - ResponsiveProvider not found, creating fallback');
              ResponsiveProvider = function(props) { 
                return React.createElement('div', {
                  'data-responsive-provider': true,
                  style: { padding: '20px', background: '#f0f9ff', borderRadius: '8px' }
                }, props.children);
              };
            }
            
            if (!useResponsiveValue) {
              console.warn('executeCode - useResponsiveValue not found, creating fallback');
              useResponsiveValue = function(value) { return value; };
            }
            
            if (!useScaledStyle) {
              console.warn('executeCode - useScaledStyle not found, creating fallback');
              useScaledStyle = function(styles) { return styles; };
            }
            
            if (!useBreakpoint) {
              console.warn('executeCode - useBreakpoint not found, creating fallback');
              useBreakpoint = function() { return { name: 'Desktop', width: 1440, height: 900, alias: 'desktop' }; };
            }
            
            // Also make them available in global scope for cross-referencing
            window.ResponsiveProvider = ResponsiveProvider;
            window.useResponsiveValue = useResponsiveValue;
            window.useScaledStyle = useScaledStyle;
            window.useBreakpoint = useBreakpoint;
            
            // Debug: Log what we're setting
            console.log('executeCode - Setting ResponsiveProvider in window:', ResponsiveProvider);
            console.log('executeCode - Setting useResponsiveValue in window:', useResponsiveValue);
            
            // Ensure ResponsiveProvider is available in local scope
            if (!ResponsiveProvider && window.ResponsiveProvider) {
              ResponsiveProvider = window.ResponsiveProvider;
              console.log('executeCode - Assigned ResponsiveProvider from window.ResponsiveProvider:', ResponsiveProvider);
            }
            
            // Ensure useResponsiveValue is available in local scope
            if (!useResponsiveValue && window.useResponsiveValue) {
              useResponsiveValue = window.useResponsiveValue;
              console.log('executeCode - Assigned useResponsiveValue from window.useResponsiveValue:', useResponsiveValue);
            }
            
            ${transformedCode}
            
            // Debug: Check what was actually defined
            console.log('executeCode - After executing transformed code, this contains:', Object.keys(this));
            console.log('executeCode - Looking for components with first letter uppercase...');
            
            // Store all defined components in global scope first
            const componentNames = Object.keys(this).filter(key => 
              typeof this[key] === 'function' && 
              key[0] === key[0].toUpperCase() &&
              !key.startsWith('$') // Exclude webpack internal functions
            );
            
            console.log('executeCode - Available component names:', componentNames);
            console.log('executeCode - All available variables:', Object.keys(this));
            console.log('executeCode - All available variables with types:', Object.keys(this).map(key => ({ key, type: typeof this[key], value: this[key] })));
            
            // Also check for components that might be defined as local variables
            const localComponentNames = [];
            if (typeof Card !== 'undefined') localComponentNames.push('Card');
            if (typeof App !== 'undefined') localComponentNames.push('App');
            if (typeof Dashboard !== 'undefined') localComponentNames.push('Dashboard');
            
            console.log('executeCode - Local component names found:', localComponentNames);
            
            // Make all components available in global scope for cross-referencing
            componentNames.forEach(name => {
              if (typeof this[name] === 'function') {
                // Make component available globally so other components can reference it
                window[name] = this[name];
                console.log('executeCode - Made component globally available:', name, window[name]);
              }
            });
            
            // Also make local components available globally
            localComponentNames.forEach(name => {
              if (typeof eval(name) === 'function') {
                window[name] = eval(name);
                console.log('executeCode - Made local component globally available:', name, window[name]);
              }
            });
            
            // Store the components in a way that they can be accessed later
            window.__playgroundComponents = {};
            componentNames.forEach(name => {
              if (typeof this[name] === 'function') {
                window.__playgroundComponents[name] = this[name];
                console.log('executeCode - Stored component in __playgroundComponents:', name, window.__playgroundComponents[name]);
              }
            });
            
            // Also store local components
            localComponentNames.forEach(name => {
              if (typeof eval(name) === 'function') {
                window.__playgroundComponents[name] = eval(name);
                console.log('executeCode - Stored local component in __playgroundComponents:', name, window.__playgroundComponents[name]);
              }
            });
            
            // Look for the default export first
            if (typeof __defaultExport !== 'undefined') {
              return __defaultExport;
            }
            
            if (componentNames.length > 0) {
              return this[componentNames[0]];
            }
            
            return null;
          };
        `);

      const compiledFunction = executeFunction();
      const Component = compiledFunction();

      if (Component && typeof Component === 'function') {
        setCompiledCode(sourceCode);
        onSuccess?.();
      } else {
        throw new Error('No valid React component found in code');
      }

    } catch (err) {
      const error = err as Error;
      setError(error);
      onError?.(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Execute code when it changes
  useEffect(() => {
    if (code.trim()) {
      executeCode(code);
    }
  }, [code, refreshKey]);

  // Render the component
  const renderComponent = () => {
    if (!compiledCode || error) return null;

    try {
      // Re-execute to get fresh component
      const result = transform(compiledCode, {
        presets: [
          ['react', { runtime: 'classic' }],
          ['typescript', { isTSX: true, allExtensions: true }]
        ]
      });

      if (!result.code) return null;

      let transformedCode = result.code;

      // Manually handle export statements to prevent syntax errors
      transformedCode = transformedCode
        .replace(/export\s+default\s+/g, 'var __defaultExport = ')
        .replace(/export\s*{([^}]+)}\s*;?/g, (match, exports) => {
          const exportNames = exports.split(',').map((exp: string) => exp.trim());
          return exportNames.map((exp: string) => {
            const [exportName, alias] = exp.split(' as ').map((s: string) => s.trim());
            const finalName = alias || exportName;
            return `var ${finalName} = ${exportName};`;
          }).join('\n');
        });

      // Replace imports
      Object.entries(availableImports).forEach(([moduleName, moduleExports]) => {
        const importRegex = new RegExp(
          `import\\s+(?:{([^}]+)}|([\\w$]+))\\s+from\\s+['"]${moduleName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}['"];?`,
          'g'
        );
        
        transformedCode = transformedCode.replace(importRegex, (match, namedImports, defaultImport) => {
           if (namedImports) {
             const imports = namedImports.split(',').map((imp: string) => imp.trim());
             return imports.map((imp: string) => {
               const [importName, alias] = imp.split(' as ').map((s: string) => imp.trim());
               const finalName = alias || importName;
               if (moduleName === 'react') {
                 // Handle React imports
                 return `var ${finalName} = React.${importName};`;
               } else {
                 // Handle other module imports
                 return `var ${finalName} = ${JSON.stringify((moduleExports as any)[importName])};`;
               }
             }).join('\n');
           } else if (defaultImport) {
             if (moduleName === 'react') {
               return `var ${defaultImport} = React;`;
             } else {
               return `var ${defaultImport} = ${JSON.stringify(moduleExports)};`;
             }
           }
           return '';
         });
      });

      const executeFunction = new Function(`
         return function() {
           // Make React available globally by referencing it from the outer scope
           var React = window.React || this.React;
           
           if (!React) {
             console.error('React is not available in playground execution');
             return null;
           }
           
            // Make mock components available - use direct assignment instead of JSON.stringify
            var ResponsiveProvider = window.mockResponsiveProvider || window.ResponsiveProvider;
            var useResponsiveValue = window.mockUseResponsiveValue || window.useResponsiveValue;
            var useScaledStyle = window.mockUseScaledStyle || window.useScaledStyle;
            var useBreakpoint = window.mockUseBreakpoint || window.useBreakpoint;
            
            // Debug: Log what we're getting from window
            console.log('renderComponent - Getting ResponsiveProvider from window:', window.mockResponsiveProvider);
            console.log('renderComponent - Getting useResponsiveValue from window:', window.mockUseResponsiveValue);
            
            // If mock components are not available, create fallback versions
            if (!ResponsiveProvider) {
              console.warn('ResponsiveProvider not found, creating fallback');
              ResponsiveProvider = function(props) { 
                return React.createElement('div', {
                  'data-responsive-provider': true,
                  style: { padding: '20px', background: '#f0f9ff', borderRadius: '8px' }
                }, props.children);
              };
            }
            
            if (!useResponsiveValue) {
              console.warn('useResponsiveValue not found, creating fallback');
              useResponsiveValue = function(value) { return value; };
            }
            
            if (!useScaledStyle) {
              console.warn('useScaledStyle not found, creating fallback');
              useScaledStyle = function(styles) { return styles; };
            }
            
            if (!useBreakpoint) {
              console.warn('useBreakpoint not found, creating fallback');
              useBreakpoint = function() { return { name: 'Desktop', width: 1440, height: 900, alias: 'desktop' }; };
            }
           
           // Import all globally available components into current scope
           var Card = window.Card;
           var App = window.App;
           var Dashboard = window.Dashboard;
           
           console.log('renderComponent - Imported Card from global:', Card);
           console.log('renderComponent - Imported App from global:', App);
           console.log('renderComponent - Imported Dashboard from global:', Dashboard);
           
           // Debug: Check what's actually available globally
           console.log('renderComponent - All global variables:', Object.keys(window));
           console.log('renderComponent - __playgroundComponents:', window.__playgroundComponents);
           
           // If components are not available globally, try to find them in __playgroundComponents
           if (!Card || !App) {
             console.log('Components not found globally, checking __playgroundComponents...');
             if (window.__playgroundComponents) {
               console.log('__playgroundComponents available:', Object.keys(window.__playgroundComponents));
               
               if (!Card && window.__playgroundComponents.Card) {
                 Card = window.__playgroundComponents.Card;
                 console.log('Found Card in __playgroundComponents:', Card);
               }
               if (!App && window.__playgroundComponents.App) {
                 App = window.__playgroundComponents.App;
                 console.log('Found App in __playgroundComponents:', App);
               }
               if (!Dashboard && window.__playgroundComponents.Dashboard) {
                 Dashboard = window.__playgroundComponents.Dashboard;
                 console.log('Found Dashboard in __playgroundComponents:', Dashboard);
               }
             }
           }
           
           // If still not found, try to find them in the current scope
           if (!Card || !App) {
             console.log('Components not found in __playgroundComponents, searching in current scope...');
             const localComponentNames = Object.keys(this).filter(key => 
               typeof this[key] === 'function' && 
               key[0] === key[0].toUpperCase()
             );
             console.log('Local component names found:', localComponentNames);
             
             // Try to find Card and App in local scope
             if (!Card && localComponentNames.includes('Card')) {
               Card = this.Card;
               console.log('Found Card in local scope:', Card);
             }
             if (!App && localComponentNames.includes('App')) {
               App = this.App;
               console.log('Found App in local scope:', App);
             }
           }
           
            ${transformedCode}
            
            // Debug: Check if ResponsiveProvider is available
            console.log('renderComponent - ResponsiveProvider available:', typeof ResponsiveProvider, ResponsiveProvider);
            console.log('renderComponent - window.ResponsiveProvider available:', typeof window.ResponsiveProvider, window.ResponsiveProvider);
            console.log('renderComponent - window.mockResponsiveProvider available:', typeof window.mockResponsiveProvider, window.mockResponsiveProvider);
            
            // Ensure ResponsiveProvider is available in local scope
            if (!ResponsiveProvider && window.ResponsiveProvider) {
              ResponsiveProvider = window.ResponsiveProvider;
              console.log('renderComponent - Assigned ResponsiveProvider from window.ResponsiveProvider:', ResponsiveProvider);
            }
            
            // Ensure useResponsiveValue is available in local scope
            if (!useResponsiveValue && window.useResponsiveValue) {
              useResponsiveValue = window.useResponsiveValue;
              console.log('renderComponent - Assigned useResponsiveValue from window.useResponsiveValue:', useResponsiveValue);
            }
            
            // Look for the default export
            if (typeof __defaultExport !== 'undefined') {
              console.log('Found default export:', __defaultExport);
              return __defaultExport;
            }
           
           // Look for React component in local scope
           const componentNames = Object.keys(this).filter(key => 
             typeof this[key] === 'function' && 
             key[0] === key[0].toUpperCase()
           );
           
           console.log('renderComponent - Available component names:', componentNames);
           console.log('renderComponent - All available variables:', Object.keys(this));
           
           if (componentNames.length > 0) {
             console.log('Returning component:', this[componentNames[0]]);
             return this[componentNames[0]];
           }
           
           console.log('No component found');
           return null;
         };
       `);

      const compiledFunction = executeFunction();
      const Component = compiledFunction();

      if (!Component) {
        return React.createElement('div', {
          className: 'text-red-500 p-4 text-sm'
        }, 'No component found. Check the console for details.');
      }

      if (typeof Component !== 'function') {
        return React.createElement('div', {
          className: 'text-red-500 p-4 text-sm'
        }, `Component is not a function: ${typeof Component}`);
      }

      return React.createElement(Component);
    } catch (err) {
      return React.createElement('div', {
        className: 'text-red-500 p-4 text-sm'
      }, `Render Error: ${(err as Error).message}`);
    }
  };

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className={cn('relative', className)}>
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 bg-gray-50 px-4 py-2 dark:border-gray-700 dark:bg-gray-800">
        <div className="flex items-center space-x-2">
          <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Live Preview
          </div>
          {isLoading ? (
            <ArrowPathIcon className="h-4 w-4 animate-spin text-blue-500" />
          ) : error ? (
            <ExclamationTriangleIcon className="h-4 w-4 text-red-500" />
          ) : (
            <CheckCircleIcon className="h-4 w-4 text-green-500" />
          )}
        </div>
        
        {showRefresh && (
          <button
            onClick={handleRefresh}
            className="rounded p-1 text-gray-500 hover:bg-gray-200 hover:text-gray-700 dark:hover:bg-gray-700 dark:hover:text-gray-300"
            title="Refresh preview"
          >
            <ArrowPathIcon className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Content */}
      <div className="relative min-h-[200px] bg-white dark:bg-gray-900">
        <AnimatePresence mode="wait">
          {error ? (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-4"
            >
              <div className="rounded-lg bg-red-50 p-4 dark:bg-red-950/20">
                <div className="flex items-start space-x-3">
                  <ExclamationTriangleIcon className="h-5 w-5 flex-shrink-0 text-red-500" />
                  <div>
                    <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                      Compilation Error
                    </h3>
                    <pre className="mt-2 text-sm text-red-700 dark:text-red-300 whitespace-pre-wrap">
                      {error.message}
                    </pre>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key={`preview-${refreshKey}`}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="p-4"
            >
              <div ref={previewRef}>
                {renderComponent()}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
