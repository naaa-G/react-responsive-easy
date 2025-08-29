/**
 * @react-responsive-easy/next-plugin
 * 
 * Next.js plugin that integrates React Responsive Easy with Next.js build process.
 * Supports both App Router and Pages Router with SSR optimization.
 */

import type { NextConfig } from 'next';
import path from 'path';
import fs from 'fs';

// Plugin options interface
interface NextPluginOptions {
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
  /** Enable SSR optimizations */
  ssr?: boolean;
  /** Include/exclude patterns for file processing */
  include?: string | RegExp | (string | RegExp)[];
  exclude?: string | RegExp | (string | RegExp)[];
}

// Default configuration
const defaultOptions: Required<NextPluginOptions> = {
  configPath: 'rre.config.ts',
  precompute: true,
  generateCustomProperties: true,
  generateCustomMedia: true,
  customPropertyPrefix: '--rre',
  development: false,
  ssr: true,
  include: /\.(tsx?|jsx?)$/,
  exclude: /node_modules/
};

/**
 * Main Next.js plugin function
 */
export function withReactResponsiveEasy(
  pluginOptions: NextPluginOptions = {}
) {
  return (nextConfig: NextConfig = {}): NextConfig => {
    const options = { ...defaultOptions, ...pluginOptions };
    
    // Resolve config path
    const configPath = path.resolve(process.cwd(), options.configPath);
    const hasConfig = fs.existsSync(configPath);
    
    if (!hasConfig && options.development) {
      console.warn(`[react-responsive-easy] Configuration file not found: ${configPath}`);
    }

    return {
      ...nextConfig,
      
      // Webpack configuration
      webpack: (config, { dev, isServer }) => {
        // Update development mode
        options.development = dev;
        
        // Add Babel plugin for JavaScript/TypeScript processing
        config.module.rules.push({
          test: /\.(tsx?|jsx?)$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: [
                ['@babel/preset-env', { targets: { node: 'current' } }],
                '@babel/preset-typescript',
                '@babel/preset-react'
              ],
              plugins: [
                [
                  '@react-responsive-easy/babel-plugin',
                  {
                    configPath: options.configPath,
                    precompute: options.precompute,
                    development: options.development
                  }
                ]
              ]
            }
          }
        });
        
        // Add PostCSS plugin for CSS processing
        config.module.rules.push({
          test: /\.css$/,
          use: [
            'style-loader',
            'css-loader',
            {
              loader: 'postcss-loader',
              options: {
                postcssOptions: {
                  plugins: [
                    [
                      '@react-responsive-easy/postcss-plugin',
                      {
                        generateCustomProperties: options.generateCustomProperties,
                        generateCustomMedia: options.generateCustomMedia,
                        customPropertyPrefix: options.customPropertyPrefix,
                        development: options.development
                      }
                    ]
                  ]
                }
              }
            }
          ]
        });
        
        // Add webpack plugin for development features
        if (options.development) {
          config.plugins.push(new RREDevPlugin(options));
        }
        
        // SSR optimizations
        if (options.ssr && isServer) {
          // Add server-side configuration resolution
          config.resolve.alias = {
            ...config.resolve.alias,
            'virtual:rre-config': path.resolve(__dirname, 'virtual-config.js')
          };
        }
        
        // Call original webpack config if it exists
        if (typeof nextConfig.webpack === 'function') {
          return nextConfig.webpack(config, { dev, isServer });
        }
        
        return config;
      },
      
      // Environment variables for runtime
      env: {
        ...nextConfig.env,
        RRE_CONFIG_PATH: options.configPath,
        RRE_SSR_ENABLED: options.ssr.toString(),
        RRE_DEV_MODE: options.development.toString()
      },
      
      // Experimental features for App Router
      experimental: {
        ...nextConfig.experimental,
        // Enable CSS-in-JS for responsive styles
        appDir: nextConfig.experimental?.appDir,
        // Enable server components optimization
        serverComponentsExternalPackages: [
          ...(nextConfig.experimental?.serverComponentsExternalPackages || []),
          '@react-responsive-easy/core'
        ]
      },
      
      // Headers for development
      async headers() {
        const headers = await nextConfig.headers?.() || [];
        
        if (options.development) {
          headers.push({
            source: '/api/rre/:path*',
            headers: [
              {
                key: 'Access-Control-Allow-Origin',
                value: '*'
              },
              {
                key: 'Access-Control-Allow-Methods',
                value: 'GET, POST, PUT, DELETE, OPTIONS'
              }
            ]
          });
        }
        
        return headers;
      },
      
      // API routes for development
      async rewrites() {
        const rewrites = await nextConfig.rewrites?.() || [];
        
        if (options.development) {
          const devRewrites = [
            {
              source: '/api/rre/config',
              destination: '/api/rre-config'
            },
            {
              source: '/api/rre/breakpoints',
              destination: '/api/rre-breakpoints'
            }
          ];
          
          if (Array.isArray(rewrites)) {
            return [...devRewrites, ...rewrites];
          } else {
            return {
              ...rewrites,
              beforeFiles: [...devRewrites, ...(rewrites.beforeFiles || [])]
            };
          }
        }
        
        return rewrites;
      }
    };
  };
}

/**
 * Webpack plugin for development features
 */
class RREDevPlugin {
  private options: Required<NextPluginOptions>;
  
  constructor(options: Required<NextPluginOptions>) {
    this.options = options;
  }
  
  apply(compiler: any) {
    compiler.hooks.emit.tapAsync('RREDevPlugin', (compilation: any, callback: any) => {
      // Generate virtual config module
      const configContent = this.generateVirtualConfig();
      
      compilation.assets['virtual-config.js'] = {
        source: () => configContent,
        size: () => configContent.length
      };
      
      // Generate development assets
      if (this.options.development) {
        const devAssets = this.generateDevAssets();
        
        Object.entries(devAssets).forEach(([filename, content]) => {
          compilation.assets[filename] = {
            source: () => content,
            size: () => content.length
          };
        });
      }
      
      callback();
    });
  }
  
  private generateVirtualConfig(): string {
    const configPath = path.resolve(process.cwd(), this.options.configPath);
    
    try {
      if (fs.existsSync(configPath)) {
        const content = fs.readFileSync(configPath, 'utf-8');
        const config = this.extractConfigFromFile(content);
        return `module.exports = ${JSON.stringify(config)};`;
      }
    } catch (error) {
      console.warn('[react-responsive-easy] Failed to load config:', error);
    }
    
    return `module.exports = ${JSON.stringify(this.getMockConfig())};`;
  }
  
  private generateDevAssets(): Record<string, string> {
    return {
      'rre-dev-panel.html': this.generateDevPanel(),
      'rre-dev-panel.js': this.generateDevPanelScript()
    };
  }
  
  private generateDevPanel(): string {
    return `
<!DOCTYPE html>
<html>
<head>
  <title>React Responsive Easy - Dev Panel</title>
  <style>
    body { font-family: system-ui; margin: 20px; }
    .breakpoint { padding: 10px; margin: 5px 0; border: 1px solid #ccc; }
    .active { background: #e3f2fd; }
    button { padding: 8px 16px; margin: 4px; cursor: pointer; }
  </style>
</head>
<body>
  <h1>React Responsive Easy - Development Panel</h1>
  <div id="breakpoints"></div>
  <div id="controls">
    <button onclick="reloadConfig()">Reload Config</button>
    <button onclick="togglePreview()">Toggle Preview</button>
  </div>
  <script src="rre-dev-panel.js"></script>
</body>
</html>
    `.trim();
  }
  
  private generateDevPanelScript(): string {
    return `
// React Responsive Easy Development Panel
let currentConfig = null;

async function loadConfig() {
  try {
    const response = await fetch('/api/rre/config');
    currentConfig = await response.json();
    renderBreakpoints();
  } catch (error) {
    console.error('Failed to load RRE config:', error);
  }
}

function renderBreakpoints() {
  const container = document.getElementById('breakpoints');
  if (!currentConfig || !container) return;
  
  container.innerHTML = '<h2>Breakpoints</h2>';
  
  currentConfig.breakpoints.forEach(bp => {
    const div = document.createElement('div');
    div.className = 'breakpoint';
    div.innerHTML = \`
      <strong>\${bp.name}</strong> (\${bp.alias})
      <br>Size: \${bp.width}x\${bp.height}px
      <button onclick="previewBreakpoint('\${bp.name}')">Preview</button>
    \`;
    container.appendChild(div);
  });
}

function previewBreakpoint(name) {
  const bp = currentConfig.breakpoints.find(b => b.name === name);
  if (bp) {
    window.parent.postMessage({
      type: 'rre-preview-breakpoint',
      breakpoint: bp
    }, '*');
  }
}

function reloadConfig() {
  loadConfig();
}

function togglePreview() {
  window.parent.postMessage({
    type: 'rre-toggle-preview'
  }, '*');
}

// Initialize
loadConfig();
    `.trim();
  }
  
  private extractConfigFromFile(content: string): any {
    // Simple config extraction - in production this would be more robust
    const match = content.match(/export default\s+defineConfig\s*\(\s*({[\s\S]*?})\s*\)/);
    if (match) {
      try {
        return JSON.parse(match[1]);
      } catch {
        // Fallback to eval (not recommended for production)
        try {
          return eval(`(${match[1]})`);
        } catch {
          return this.getMockConfig();
        }
      }
    }
    return this.getMockConfig();
  }
  
  private getMockConfig() {
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
}

// Export default for convenience
export default withReactResponsiveEasy;
export type { NextPluginOptions };
