/**
 * Tests for configuration loader
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';
import { loadConfig, validateConfig, getDefaultConfig, type LoadedConfig } from '../config-loader';

// Mock fs module
vi.mock('fs');
const mockedFs = vi.mocked(fs);

describe('config-loader', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('loadConfig', () => {
    it('should load configuration from valid file path', () => {
      const mockConfig = {
        base: { name: 'desktop', width: 1920, height: 1080, alias: 'base' },
        breakpoints: [
          { name: 'mobile', width: 390, height: 844, alias: 'mobile' }
        ],
        strategy: {
          origin: 'width',
          tokens: { fontSize: { scale: 0.85 } },
          rounding: { mode: 'nearest', precision: 0.5 }
        }
      };

      mockedFs.existsSync.mockReturnValue(true);
      mockedFs.readFileSync.mockReturnValue('export default { base: {}, breakpoints: [] }');

      const result = loadConfig('test-config.ts');

      expect(mockedFs.existsSync).toHaveBeenCalledWith(
        path.resolve(process.cwd(), 'test-config.ts')
      );
      expect(result).toBeDefined();
      expect(result.base).toBeDefined();
      expect(result.breakpoints).toBeDefined();
      expect(result.strategy).toBeDefined();
    });

    it('should throw error when config file does not exist', () => {
      mockedFs.existsSync.mockReturnValue(false);

      expect(() => {
        loadConfig('non-existent-config.ts');
      }).toThrow('Configuration file not found:');
    });

    it('should use custom working directory', () => {
      const customCwd = '/custom/path';
      mockedFs.existsSync.mockReturnValue(true);
      mockedFs.readFileSync.mockReturnValue('export default { base: {}, breakpoints: [] }');

      loadConfig('config.ts', customCwd);

      expect(mockedFs.existsSync).toHaveBeenCalledWith(
        path.resolve(customCwd, 'config.ts')
      );
    });

    it('should handle file reading errors gracefully', () => {
      mockedFs.existsSync.mockReturnValue(true);
      mockedFs.readFileSync.mockImplementation(() => {
        throw new Error('File read error');
      });

      expect(() => {
        loadConfig('error-config.ts');
      }).toThrow('Failed to load configuration from');
    });
  });

  describe('validateConfig', () => {
    it('should validate correct configuration structure', () => {
      const validConfig: LoadedConfig = {
        base: { name: 'desktop', width: 1920, height: 1080, alias: 'base' },
        breakpoints: [
          { name: 'mobile', width: 390, height: 844, alias: 'mobile' }
        ],
        strategy: {
          origin: 'width',
          tokens: { fontSize: { scale: 0.85 } },
          rounding: { mode: 'nearest', precision: 0.5 }
        }
      };

      expect(validateConfig(validConfig)).toBe(true);
    });

    it('should reject null or undefined config', () => {
      expect(validateConfig(null)).toBe(false);
      expect(validateConfig(undefined)).toBe(false);
    });

    it('should reject non-object config', () => {
      expect(validateConfig('string')).toBe(false);
      expect(validateConfig(123)).toBe(false);
      expect(validateConfig([])).toBe(false);
    });

    it('should reject config without base breakpoint', () => {
      const invalidConfig = {
        breakpoints: [{ name: 'mobile', width: 390, height: 844, alias: 'mobile' }],
        strategy: { origin: 'width', tokens: {}, rounding: { mode: 'nearest', precision: 0.5 } }
      };

      expect(validateConfig(invalidConfig)).toBe(false);
    });

    it('should reject config without breakpoints array', () => {
      const invalidConfig = {
        base: { name: 'desktop', width: 1920, height: 1080, alias: 'base' },
        strategy: { origin: 'width', tokens: {}, rounding: { mode: 'nearest', precision: 0.5 } }
      };

      expect(validateConfig(invalidConfig)).toBe(false);
    });

    it('should reject config with empty breakpoints array', () => {
      const invalidConfig = {
        base: { name: 'desktop', width: 1920, height: 1080, alias: 'base' },
        breakpoints: [],
        strategy: { origin: 'width', tokens: {}, rounding: { mode: 'nearest', precision: 0.5 } }
      };

      expect(validateConfig(invalidConfig)).toBe(false);
    });

    it('should reject config without strategy', () => {
      const invalidConfig = {
        base: { name: 'desktop', width: 1920, height: 1080, alias: 'base' },
        breakpoints: [{ name: 'mobile', width: 390, height: 844, alias: 'mobile' }]
      };

      expect(validateConfig(invalidConfig)).toBe(false);
    });

    it('should reject config without strategy origin', () => {
      const invalidConfig = {
        base: { name: 'desktop', width: 1920, height: 1080, alias: 'base' },
        breakpoints: [{ name: 'mobile', width: 390, height: 844, alias: 'mobile' }],
        strategy: { tokens: {}, rounding: { mode: 'nearest', precision: 0.5 } }
      };

      expect(validateConfig(invalidConfig)).toBe(false);
    });
  });

  describe('getDefaultConfig', () => {
    it('should return valid default configuration', () => {
      const defaultConfig = getDefaultConfig();

      expect(validateConfig(defaultConfig)).toBe(true);
      expect(defaultConfig.base).toBeDefined();
      expect(defaultConfig.breakpoints).toBeDefined();
      expect(defaultConfig.strategy).toBeDefined();
    });

    it('should have correct default values', () => {
      const defaultConfig = getDefaultConfig();

      expect(defaultConfig.base.name).toBe('desktop');
      expect(defaultConfig.base.width).toBe(1920);
      expect(defaultConfig.base.height).toBe(1080);
      expect(defaultConfig.strategy.origin).toBe('width');
      expect(defaultConfig.breakpoints).toHaveLength(4);
    });

    it('should include all required breakpoints', () => {
      const defaultConfig = getDefaultConfig();
      const breakpointNames = defaultConfig.breakpoints.map(bp => bp.name);

      expect(breakpointNames).toContain('mobile');
      expect(breakpointNames).toContain('tablet');
      expect(breakpointNames).toContain('laptop');
      expect(breakpointNames).toContain('desktop');
    });

    it('should have proper token configurations', () => {
      const defaultConfig = getDefaultConfig();

      expect(defaultConfig.strategy.tokens.fontSize).toBeDefined();
      expect(defaultConfig.strategy.tokens.spacing).toBeDefined();
      expect(defaultConfig.strategy.tokens.radius).toBeDefined();
    });
  });

  describe('edge cases', () => {
    it('should handle malformed configuration files', () => {
      mockedFs.existsSync.mockReturnValue(true);
      mockedFs.readFileSync.mockReturnValue('invalid json content');

      expect(() => {
        loadConfig('malformed-config.json');
      }).toThrow('Failed to load configuration from');
    });

    it('should handle configuration with missing required fields', () => {
      const partialConfig = {
        base: { name: 'desktop' }, // Missing width and height
        breakpoints: [],
        strategy: { origin: 'width' }
      };

      expect(validateConfig(partialConfig)).toBe(false);
    });

    it('should handle configuration with invalid strategy origin', () => {
      const invalidConfig = {
        base: { name: 'desktop', width: 1920, height: 1080, alias: 'base' },
        breakpoints: [{ name: 'mobile', width: 390, height: 844, alias: 'mobile' }],
        strategy: {
          origin: 'invalid-origin',
          tokens: {},
          rounding: { mode: 'nearest', precision: 0.5 }
        }
      };

      // Should still pass validation as we only check for existence
      expect(validateConfig(invalidConfig)).toBe(true);
    });
  });
});
