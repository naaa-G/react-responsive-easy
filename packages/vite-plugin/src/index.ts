/**
 * @react-responsive-easy/vite-plugin
 * 
 * Vite plugin that integrates React Responsive Easy with Vite build process.
 * Combines Babel and PostCSS plugins for seamless development experience.
 */

import type { Plugin } from 'vite';
import path from 'path';
import fs from 'fs';

// Plugin options interface
interface VitePluginOptions {
  /** Path to the RRE configuration file */
  configPath?: string;
  /** Enable build-time pre-computation */
  precompute?: boolean;
  /** Generate CSS custom properties */
  generateCustomProperties?: boolean;
  /** Generate @custom-media rules */
  generateCustomMedia?: boolean;
  /** Custom property prefix */
  customPropertyPrefix?: string;
  /** Enable development mode features */
  development?: boolean;
  /** Include/exclude patterns for file processing */
  include?: string | RegExp | (string | RegExp)[];
  exclude?: string | RegExp | (string | RegExp)[];
}

// Default configuration
const defaultConfig = {
  configPath: 'rre.config.ts',
  precompute: true,
  generateCustomProperties: true,
  generateCustomMedia: true,
  customPropertyPrefix: '--rre',
  development: false,
  include: /\.(tsx?|jsx?|vue|svelte)$/,
  exclude: /node_modules/
};

/**
 * Main Vite plugin function
 */
export function reactResponsiveEasy(options: VitePluginOptions = {}): Plugin[] {
  const config = { ...defaultConfig, ...options };
  
  // Resolve config path
  const configPath = path.resolve(process.cwd(), config.configPath);
  const hasConfig = fs.existsSync(configPath);
  
  if (!hasConfig && config.development) {
    console.warn(`[react-responsive-easy] Configuration file not found: ${configPath}`);
  }

  return [
    // Main plugin for JavaScript/TypeScript processing
    {
      name: 'react-responsive-easy:js',
      enforce: 'pre',
      
      configResolved(resolvedConfig) {
        // Update development mode based on Vite's mode
        config.development = resolvedConfig.command === 'serve' || resolvedConfig.mode === 'development';
      },
      
      transform(code, id) {
        // Check if file should be processed
        if (!shouldProcessFile(id, config.include, config.exclude)) {
          return null;
        }
        
        // Only process files that contain RRE hooks
        if (!containsRREHooks(code)) {
          return null;
        }
        
        try {
          // Apply Babel transformations
          const transformedCode = transformWithBabel(code, {
            configPath: config.configPath,
            precompute: config.precompute,
            development: config.development
          });
          
          return {
            code: transformedCode,
            map: null // TODO: Generate source maps
          };
        } catch (error) {
          if (config.development) {
            console.error('[react-responsive-easy] Transform error:', error);
          }
          return null;
        }
      },
      
      // Add virtual modules for configuration
      resolveId(id) {
        if (id === 'virtual:rre-config') {
          return id;
        }
        return null;
      },
      
      load(id) {
        if (id === 'virtual:rre-config') {
          // Load and return configuration
          try {
            if (hasConfig) {
              const configContent = fs.readFileSync(configPath, 'utf-8');
              return `export default ${extractConfigFromFile(configContent)};`;
            } else {
              return `export default ${JSON.stringify(getMockConfig())};`;
            }
          } catch (error) {
            console.error('[react-responsive-easy] Config load error:', error);
            return `export default ${JSON.stringify(getMockConfig())};`;
          }
        }
        return null;
      }
    },
    
    // CSS processing plugin
    {
      name: 'react-responsive-easy:css',
      enforce: 'pre',
      
      async transform(code, id) {
        // Only process CSS files
        if (!id.endsWith('.css') && !id.endsWith('.scss') && !id.endsWith('.less')) {
          return null;
        }
        
        // Only process CSS that contains rre() functions
        if (!code.includes('rre(')) {
          return null;
        }
        
        try {
          const transformedCSS = await transformWithPostCSS(code, {
            generateCustomProperties: config.generateCustomProperties,
            generateCustomMedia: config.generateCustomMedia,
            customPropertyPrefix: config.customPropertyPrefix,
            development: config.development
          });
          
          return {
            code: transformedCSS,
            map: null // TODO: Generate source maps
          };
        } catch (error) {
          if (config.development) {
            console.error('[react-responsive-easy] CSS transform error:', error);
          }
          return null;
        }
      }
    },
    
    // Development server enhancements
    {
      name: 'react-responsive-easy:dev',
      apply: 'serve',
      
      configureServer(server) {
        // Add middleware for development features
        server.middlewares.use('/rre-dev', (req, res, next) => {
          if (req.url === '/config') {
            // Serve current configuration
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(hasConfig ? loadConfig(configPath) : getMockConfig()));
          } else if (req.url === '/breakpoints') {
            // Serve breakpoint information
            const config = hasConfig ? loadConfig(configPath) : getMockConfig();
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(config.breakpoints));
          } else {
            next();
          }
        });
        
        // Watch config file for changes
        if (hasConfig) {
          server.watcher.add(configPath);
          server.ws.on('rre:config-changed', () => {
            server.ws.send({
              type: 'full-reload',
              path: '*'
            });
          });
        }
      },
      
      handleHotUpdate({ file, server }) {
        // Reload on config file changes
        if (file === configPath) {
          server.ws.send({
            type: 'full-reload',
            path: '*'
          });
          return [];
        }
        return undefined;
      }
    }
  ];
}

// Utility functions
function shouldProcessFile(
  id: string,
  include: VitePluginOptions['include'],
  exclude: VitePluginOptions['exclude']
): boolean {
  // Check exclude patterns first
  if (exclude) {
    const excludePatterns = Array.isArray(exclude) ? exclude : [exclude];
    for (const pattern of excludePatterns) {
      if (typeof pattern === 'string' && id.includes(pattern)) return false;
      if (pattern instanceof RegExp && pattern.test(id)) return false;
    }
  }
  
  // Check include patterns
  if (include) {
    const includePatterns = Array.isArray(include) ? include : [include];
    for (const pattern of includePatterns) {
      if (typeof pattern === 'string' && id.includes(pattern)) return true;
      if (pattern instanceof RegExp && pattern.test(id)) return true;
    }
    return false;
  }
  
  return true;
}

function containsRREHooks(code: string): boolean {
  const rreHookPatterns = [
    /useResponsiveValue\s*\(/,
    /useScaledStyle\s*\(/,
    /useBreakpoint\s*\(/,
    /useResponsiveValues\s*\(/
  ];
  
  return rreHookPatterns.some(pattern => pattern.test(code));
}

function transformWithBabel(code: string, _options: any): string {
  // Mock Babel transformation for now
  // In a real implementation, this would use @react-responsive-easy/babel-plugin
  
  // Simple transformation: add imports if RRE hooks are detected
  let transformedCode = code;
  
  if (containsRREHooks(code)) {
    // Add React import if not present
    if (!code.includes('import') || !code.includes('react')) {
      transformedCode = `import { useMemo } from 'react';\n${transformedCode}`;
    }
    
    // Add RRE import if not present
    if (!code.includes('react-responsive-easy')) {
      transformedCode = `import { useBreakpoint } from 'react-responsive-easy';\n${transformedCode}`;
    }
    
    // Add currentBreakpoint declaration
    if (!code.includes('currentBreakpoint')) {
      transformedCode = transformedCode.replace(
        /^(\s*const\s+)/m,
        'const currentBreakpoint = useBreakpoint();\n$1'
      );
    }
  }
  
  return transformedCode;
}

async function transformWithPostCSS(css: string, options: any): Promise<string> {
  // Mock PostCSS transformation for now
  // In a real implementation, this would use @react-responsive-easy/postcss-plugin
  
  let transformedCSS = css;
  
  // Simple transformation: replace rre() with CSS custom properties
  if (css.includes('rre(')) {
    transformedCSS = css.replace(/rre\((\d+)\)/g, (match, value) => {
      return options.generateCustomProperties 
        ? `var(${options.customPropertyPrefix}-responsive-${value})`
        : `${value}px`;
    });
    
    // Add :root rule with custom properties
    if (options.generateCustomProperties) {
      const customProps = css.match(/rre\((\d+)\)/g);
      if (customProps) {
        let rootRule = ':root {\n';
        customProps.forEach(match => {
          const value = match.match(/\d+/)?.[0];
          if (value) {
            rootRule += `  ${options.customPropertyPrefix}-responsive-${value}: ${value}px;\n`;
          }
        });
        rootRule += '}\n\n';
        
        transformedCSS = rootRule + transformedCSS;
      }
    }
  }
  
  return transformedCSS;
}

function extractConfigFromFile(content: string): string {
  // Simple config extraction - in production this would be more robust
  const match = content.match(/export default\s+defineConfig\s*\(\s*({[\s\S]*?})\s*\)/);
  return match ? match[1] : JSON.stringify(getMockConfig());
}

function loadConfig(configPath: string): any {
  try {
    const content = fs.readFileSync(configPath, 'utf-8');
    return JSON.parse(extractConfigFromFile(content));
  } catch {
    return getMockConfig();
  }
}

function getMockConfig() {
  return {
    base: { name: 'desktop', width: 1920, height: 1080, alias: 'base' },
    breakpoints: [
      { name: 'mobile', width: 390, height: 844, alias: 'mobile' },
      { name: 'tablet', width: 768, height: 1024, alias: 'tablet' },
      { name: 'laptop', width: 1366, height: 768, alias: 'laptop' },
      { name: 'desktop', width: 1920, height: 1080, alias: 'base' }
    ],
    strategy: {
      origin: 'width',
      tokens: {
        fontSize: { scale: 0.85, min: 12, max: 22 },
        spacing: { scale: 0.85, step: 2 },
        radius: { scale: 0.9 }
      },
      rounding: { mode: 'nearest', precision: 0.5 }
    }
  };
}

// Export default for convenience
export default reactResponsiveEasy;
export type { VitePluginOptions };
