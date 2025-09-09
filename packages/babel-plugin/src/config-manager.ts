/**
 * Configuration manager for the Babel plugin
 */

// import * as fs from 'fs';
// import * as path from 'path';
import { loadConfig, validateConfig, getDefaultConfig } from './config-loader';
import type { ResponsiveConfig, BabelPluginOptions } from './types';

export class ConfigManager {
  private configCache = new Map<string, ResponsiveConfig>();
  private defaultConfig: ResponsiveConfig;

  constructor() {
    this.defaultConfig = getDefaultConfig();
  }

  /**
   * Get configuration for the plugin
   */
  getConfig(options: BabelPluginOptions, cwd: string = process.cwd()): ResponsiveConfig {
    // Use inline config if provided
    if (options.configInline) {
      if (options.validateConfig && !validateConfig(options.configInline)) {
        throw new Error('Invalid inline configuration provided');
      }
      return options.configInline;
    }

    // Use config file if provided
    if (options.configPath) {
      const configKey = `${cwd}:${options.configPath}`;
      
      if (this.configCache.has(configKey)) {
        return this.configCache.get(configKey)!;
      }

      try {
        const config = loadConfig(options.configPath, cwd);
        
        if (options.validateConfig && !validateConfig(config)) {
          throw new Error(`Invalid configuration in ${options.configPath}`);
        }

        this.configCache.set(configKey, config);
        return config;
      } catch (error) {
        throw new Error(`Failed to load configuration from ${options.configPath}: ${error}`);
      }
    }

    // Return default configuration
    return this.defaultConfig;
  }

  /**
   * Clear configuration cache
   */
  clearCache(): void {
    this.configCache.clear();
  }

  /**
   * Get cache size
   */
  getCacheSize(): number {
    return this.configCache.size;
  }

  /**
   * Validate configuration
   */
  validateConfig(config: any): config is ResponsiveConfig {
    return validateConfig(config);
  }

  /**
   * Get default configuration
   */
  getDefaultConfig(): ResponsiveConfig {
    return this.defaultConfig;
  }
}

// Singleton instance
export const configManager = new ConfigManager();
