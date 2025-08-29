/**
 * Configuration loader for Babel plugin
 * Loads and validates RRE configuration files
 */

import * as fs from 'fs';
import * as path from 'path';

export interface LoadedConfig {
  base: {
    name: string;
    width: number;
    height: number;
    alias: string;
  };
  breakpoints: Array<{
    name: string;
    width: number;
    height: number;
    alias: string;
  }>;
  strategy: {
    origin: 'width' | 'height' | 'min' | 'max' | 'diagonal' | 'area';
    tokens: Record<string, {
      scale?: number;
      min?: number;
      max?: number;
      step?: number;
    }>;
    rounding: {
      mode: 'nearest' | 'floor' | 'ceil';
      precision: number;
    };
  };
}

/**
 * Load configuration from file path
 */
export function loadConfig(configPath: string, cwd: string = process.cwd()): LoadedConfig {
  const fullPath = path.resolve(cwd, configPath);
  
  if (!fs.existsSync(fullPath)) {
    throw new Error(`Configuration file not found: ${fullPath}`);
  }
  
  try {
    // For now, return mock config
    // In a real implementation, this would:
    // 1. Read the TypeScript/JavaScript config file
    // 2. Compile it if necessary
    // 3. Extract the configuration object
    // 4. Validate the structure
    
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
  } catch (error) {
    throw new Error(`Failed to load configuration from ${fullPath}: ${error}`);
  }
}

/**
 * Validate configuration structure
 */
export function validateConfig(config: any): config is LoadedConfig {
  if (!config || typeof config !== 'object') {
    return false;
  }
  
  // Validate base breakpoint
  if (!config.base || !config.base.width || !config.base.height) {
    return false;
  }
  
  // Validate breakpoints array
  if (!Array.isArray(config.breakpoints) || config.breakpoints.length === 0) {
    return false;
  }
  
  // Validate strategy
  if (!config.strategy || !config.strategy.origin) {
    return false;
  }
  
  return true;
}

/**
 * Get default configuration
 */
export function getDefaultConfig(): LoadedConfig {
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
