/**
 * Dynamic Configuration System for AI Optimizer
 * 
 * Features:
 * - Hot-reloading configuration without restart
 * - Configuration validation and schema enforcement
 * - Environment-specific configurations
 * - Configuration versioning and rollback
 * - Real-time configuration updates
 * - Configuration encryption and security
 * - Performance monitoring and optimization
 */

import { EventEmitter } from 'events';
import { AI_OPTIMIZER_CONSTANTS } from '../constants.js';
import { Logger } from './Logger.js';

export interface ConfigSchema {
  [key: string]: {
    type?: 'string' | 'number' | 'boolean' | 'object' | 'array';
    required?: boolean;
    default?: unknown;
    min?: number;
    max?: number;
    pattern?: RegExp;
    enum?: unknown[];
    description?: string;
    validation?: (_value: unknown) => boolean | string;
  };
}

export interface ConfigSource {
  type: 'file' | 'api' | 'database' | 'environment' | 'memory';
  path?: string;
  url?: string;
  connectionString?: string;
  refreshInterval?: number;
  priority: number;
  enabled: boolean;
}

export interface ConfigVersion {
  version: string;
  timestamp: number;
  config: Record<string, unknown>;
  changes: Array<{
    path: string;
    oldValue: unknown;
    newValue: unknown;
    type: 'add' | 'update' | 'delete';
  }>;
  author?: string;
  description?: string;
}

export interface ConfigValidationResult {
  valid: boolean;
  errors: Array<{
    path: string;
    message: string;
    value: unknown;
  }>;
  warnings: Array<{
    path: string;
    message: string;
    value: unknown;
  }>;
}

export interface ConfigUpdateEvent {
  type: 'update' | 'rollback' | 'validation_error' | 'source_error';
  path?: string;
  oldValue?: unknown;
  newValue?: unknown;
  source: string;
  timestamp: number;
  error?: Error;
}

/**
 * Dynamic Configuration Manager with hot-reloading and validation
 */
export class DynamicConfigManager extends EventEmitter {
  private config: Record<string, unknown> = {};
  private schema: ConfigSchema = {};
  private sources: ConfigSource[] = [];
  private versions: ConfigVersion[] = [];
  private currentVersion = '1.0.0';
  private watchers: Map<string, unknown> = new Map();
  private validationCache: Map<string, ConfigValidationResult> = new Map();
  private updateQueue: Array<{
    path: string;
    value: unknown;
    source: string;
    timestamp: number;
  }> = [];
  private isUpdating = false;
  private encryptionKey?: string;
  private performanceMonitor: ConfigPerformanceMonitor;
  private logger: Logger;

  constructor(options: {
    schema?: ConfigSchema;
    sources?: ConfigSource[];
    encryptionKey?: string;
    enableVersioning?: boolean;
  } = {}) {
    super();
    
    this.schema = options.schema ?? {};
    this.sources = options.sources ?? [];
    this.encryptionKey = options.encryptionKey;
    this.performanceMonitor = new ConfigPerformanceMonitor();
    this.logger = new Logger('DynamicConfigManager');
    
    if (options.enableVersioning !== false) {
      this.initializeVersioning();
    }
    
    this.initializeSources();
    this.startWatching();
  }

  /**
   * Get configuration value by path
   */
  get<T = unknown>(path: string, defaultValue?: T): T {
    const startTime = performance.now();
    
    try {
      const value = this.getNestedValue(this.config, path);
      this.performanceMonitor.recordAccess(path, performance.now() - startTime);
      return (value !== undefined ? value : defaultValue) as T;
    } catch (error) {
      this.performanceMonitor.recordError(path, error as Error);
      return defaultValue as T;
    }
  }

  /**
   * Set configuration value by path
   */
  set(path: string, value: unknown, source = 'manual'): ConfigValidationResult {
    const startTime = performance.now();
    
    try {
      // Validate the value
      const validation = this.validateValue(path, value);
      if (!validation.valid) {
        this.emit('validationError', {
          type: 'validation_error',
          path,
          source,
          timestamp: Date.now(),
          error: new Error(`Validation failed: ${validation.errors.map(e => e.message).join(', ')}`)
        });
        return validation;
      }

      // Get old value for change tracking
      const oldValue = this.getNestedValue(this.config, path);
      
      // Set the new value
      this.setNestedValue(this.config, path, value);
      
      // Record the change
      this.recordChange(path, oldValue, value, source);
      
      // Emit update event
      this.emit('configUpdate', {
        type: 'update',
        path,
        oldValue,
        newValue: value,
        source,
        timestamp: Date.now()
      });

      this.performanceMonitor.recordUpdate(path, performance.now() - startTime);
      return validation;
    } catch (error) {
      this.performanceMonitor.recordError(path, error as Error);
      throw error;
    }
  }

  /**
   * Update multiple configuration values
   */
  update(updates: Record<string, unknown>, source = 'bulk'): ConfigValidationResult {
    const startTime = performance.now();
    const allErrors: Array<{ path: string; message: string; value: unknown }> = [];
    const allWarnings: Array<{ path: string; message: string; value: unknown }> = [];
    
    try {
      // Validate all updates
      const validationResults = Object.entries(updates).map(([path, value]) => {
        return this.validateValue(path, value);
      });
      for (const validation of validationResults) {
        allErrors.push(...validation.errors);
        allWarnings.push(...validation.warnings);
      }

      if (allErrors.length > 0) {
        return {
          valid: false,
          errors: allErrors,
          warnings: allWarnings
        };
      }

      // Apply all updates
      const changes: Array<{
        path: string;
        oldValue: unknown;
        newValue: unknown;
        type: 'add' | 'update' | 'delete';
      }> = [];

      for (const [path, value] of Object.entries(updates)) {
        const oldValue = this.getNestedValue(this.config, path);
        this.setNestedValue(this.config, path, value);
        
        changes.push({
          path,
          oldValue,
          newValue: value,
          type: oldValue === undefined ? 'add' : 'update'
        });
      }

      // Record version
      this.recordVersion(changes, source);
      
      // Emit bulk update event
      this.emit('configBulkUpdate', {
        type: 'update',
        source,
        timestamp: Date.now(),
        changes
      });

      this.performanceMonitor.recordBulkUpdate(Object.keys(updates).length, performance.now() - startTime);
      
      return {
        valid: true,
        errors: [],
        warnings: allWarnings
      };
    } catch (error) {
      this.performanceMonitor.recordError('bulk_update', error as Error);
      throw error;
    }
  }

  /**
   * Load configuration from source
   */
  loadFromSource(sourceId: string): void {
    const source = this.sources.find(s => s.type === sourceId);
    if (!source?.enabled) {
      throw new Error(`Source ${sourceId} not found or disabled`);
    }

    try {
      let configData: Record<string, unknown>;
      
      switch (source.type) {
        case 'file':
          configData = this.loadFromFile(source.path!);
          break;
        case 'api':
          configData = this.loadFromAPI(source.url!);
          break;
        case 'database':
          configData = this.loadFromDatabase(source.connectionString!);
          break;
        case 'environment':
          configData = this.loadFromEnvironment();
          break;
        case 'memory':
          configData = this.loadFromMemory();
          break;
        default:
          throw new Error(`Unsupported source type: ${source.type}`);
      }

      // Decrypt if needed
      if (this.encryptionKey) {
        configData = this.decryptConfig(configData);
      }

      // Validate and apply
      const validation = this.validateConfig(configData);
      if (validation.valid) {
        this.update(configData, sourceId);
      } else {
        throw new Error(`Configuration validation failed: ${validation.errors.map(e => e.message).join(', ')}`);
      }
    } catch (error) {
      this.emit('sourceError', {
        type: 'source_error',
        source: sourceId,
        timestamp: Date.now(),
        error: error as Error
      });
      throw error;
    }
  }

  /**
   * Rollback to previous version
   */
  rollback(version?: string): void {
    const targetVersion = version ?? this.getPreviousVersion();
    if (!targetVersion) {
      throw new Error('No previous version available for rollback');
    }

    const versionData = this.versions.find(v => v.version === targetVersion);
    if (!versionData) {
      throw new Error(`Version ${targetVersion} not found`);
    }

    try {
      const oldConfig = { ...this.config };
      this.config = { ...versionData.config };
      
      this.emit('configRollback', {
        type: 'rollback',
        source: 'rollback',
        timestamp: Date.now(),
        oldValue: oldConfig,
        newValue: this.config
      });

      this.currentVersion = targetVersion;
    } catch (error) {
      throw new Error(`Rollback failed: ${error}`);
    }
  }

  /**
   * Get configuration schema
   */
  getSchema(): ConfigSchema {
    return { ...this.schema };
  }

  /**
   * Update configuration schema
   */
  updateSchema(schema: ConfigSchema): void {
    this.schema = { ...schema };
    this.validationCache.clear();
  }

  /**
   * Get configuration versions
   */
  getVersions(): ConfigVersion[] {
    return [...this.versions];
  }

  /**
   * Get current configuration
   */
  getConfig(): Record<string, unknown> {
    return { ...this.config };
  }

  /**
   * Export configuration
   */
  export(format: 'json' | 'yaml' | 'env' = 'json'): string {
    switch (format) {
      case 'json':
        return JSON.stringify(this.config, null, 2);
      case 'yaml':
        return this.toYAML(this.config);
      case 'env':
        return this.toEnv(this.config);
      default:
        throw new Error(`Unsupported export format: ${format}`);
    }
  }

  /**
   * Import configuration
   */
  import(configData: string, format: 'json' | 'yaml' | 'env' = 'json'): void {
    let parsed: Record<string, unknown>;
    
    switch (format) {
      case 'json':
        parsed = JSON.parse(configData);
        break;
      case 'yaml':
        parsed = this.fromYAML(configData);
        break;
      case 'env':
        parsed = this.fromEnv(configData);
        break;
      default:
        throw new Error(`Unsupported import format: ${format}`);
    }

    const validation = this.validateConfig(parsed);
    if (validation.valid) {
      this.update(parsed, 'import');
    } else {
      throw new Error(`Import validation failed: ${validation.errors.map(e => e.message).join(', ')}`);
    }
  }

  /**
   * Get performance metrics
   */
  getPerformanceMetrics() {
    return this.performanceMonitor.getMetrics();
  }

  // Private methods

  private validateValue(path: string, value: unknown): ConfigValidationResult {
    const cacheKey = `${path}:${JSON.stringify(value)}`;
    
    if (this.validationCache.has(cacheKey)) {
      return this.validationCache.get(cacheKey)!;
    }

    const errors: Array<{ path: string; message: string; value: unknown }> = [];
    const warnings: Array<{ path: string; message: string; value: unknown }> = [];

    const schemaPath = this.getSchemaPath(path);
    const schema = this.getNestedValue(this.schema, schemaPath) as {
      type?: 'string' | 'number' | 'boolean' | 'object' | 'array';
      required?: boolean;
      default?: unknown;
      min?: number;
      max?: number;
      pattern?: RegExp;
      enum?: unknown[];
      description?: string;
      validation?: (_value: unknown) => boolean | string;
    };

    if (schema) {
      this.validateType(schema, path, value, errors);
      this.validateRequired(schema, path, value, errors);
      this.validateRange(schema, path, value, errors);
      this.validatePattern(schema, path, value, errors);
      this.validateEnum(schema, path, value, errors);
      this.validateCustom(schema, path, value, errors);
    }

    const result: ConfigValidationResult = {
      valid: errors.length === 0,
      errors,
      warnings
    };

    this.validationCache.set(cacheKey, result);
    return result;
  }

  private validateType(schema: { type?: string }, path: string, value: unknown, errors: Array<{ path: string; message: string; value: unknown }>): void {
    if (schema.type && typeof value !== schema.type) {
      errors.push({
        path,
        message: `Expected ${schema.type}, got ${typeof value}`,
        value
      });
    }
  }

  private validateRequired(schema: { required?: boolean }, path: string, value: unknown, errors: Array<{ path: string; message: string; value: unknown }>): void {
    if (schema.required && (value === undefined || value === null)) {
      errors.push({
        path,
        message: 'Required field is missing',
        value
      });
    }
  }

  private validateRange(schema: { type?: string; min?: number; max?: number }, path: string, value: unknown, errors: Array<{ path: string; message: string; value: unknown }>): void {
    if (schema.type === 'number' && typeof value === 'number') {
      if (schema.min !== undefined && value < schema.min) {
        errors.push({
          path,
          message: `Value must be >= ${schema.min}`,
          value
        });
      }
      if (schema.max !== undefined && value > schema.max) {
        errors.push({
          path,
          message: `Value must be <= ${schema.max}`,
          value
        });
      }
    }
  }

  private validatePattern(schema: { type?: string; pattern?: RegExp }, path: string, value: unknown, errors: Array<{ path: string; message: string; value: unknown }>): void {
    if (schema.type === 'string' && schema.pattern && typeof value === 'string' && !schema.pattern.test(value)) {
      errors.push({
        path,
        message: `Value does not match required pattern: ${schema.pattern}`,
        value
      });
    }
  }

  private validateEnum(schema: { enum?: unknown[] }, path: string, value: unknown, errors: Array<{ path: string; message: string; value: unknown }>): void {
    if (schema.enum && !schema.enum.includes(value)) {
      errors.push({
        path,
        message: `Value must be one of: ${schema.enum.join(', ')}`,
        value
      });
    }
  }

  private validateCustom(schema: { validation?: (_value: unknown) => boolean | string }, path: string, value: unknown, errors: Array<{ path: string; message: string; value: unknown }>): void {
    if (schema.validation) {
      const customResult = schema.validation(value);
      if (customResult !== true) {
        errors.push({
          path,
          message: typeof customResult === 'string' ? customResult : 'Custom validation failed',
          value
        });
      }
    }
  }

  private validateConfig(config: Record<string, unknown>): ConfigValidationResult {
    const errors: Array<{ path: string; message: string; value: unknown }> = [];
    const warnings: Array<{ path: string; message: string; value: unknown }> = [];

    // Validate all config values
    const validationResults = Array.from(this.flattenConfig(config)).map(([path, value]) => {
      return this.validateValue(path, value);
    });
    for (const validation of validationResults) {
      errors.push(...validation.errors);
      warnings.push(...validation.warnings);
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings
    };
  }

  private getNestedValue(obj: Record<string, unknown>, path: string): unknown {
    return path.split('.').reduce((current, key) => {
      if (current && typeof current === 'object' && key in current) {
        return (current as Record<string, unknown>)[key];
      }
      return undefined;
    }, obj as unknown);
  }

  private setNestedValue(obj: Record<string, unknown>, path: string, value: unknown): void {
    const keys = path.split('.');
    const lastKey = keys.pop()!;
    const target = keys.reduce((current, key) => {
      if (!current[key]) current[key] = {};
      return current[key] as Record<string, unknown>;
    }, obj);
    target[lastKey] = value;
  }

  private getSchemaPath(path: string): string {
    // Convert config path to schema path
    return path;
  }

  private flattenConfig(config: Record<string, unknown>, prefix = ''): Array<[string, unknown]> {
    const result: Array<[string, unknown]> = [];
    
    for (const [key, value] of Object.entries(config)) {
      const fullPath = prefix ? `${prefix}.${key}` : key;
      
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        result.push(...this.flattenConfig(value as Record<string, unknown>, fullPath));
      } else {
        result.push([fullPath, value]);
      }
    }
    
    return result;
  }

  private recordChange(path: string, oldValue: unknown, newValue: unknown, source: string): void {
    this.updateQueue.push({
      path,
      value: newValue,
      source,
      timestamp: Date.now()
    });
  }

  private recordVersion(changes: Array<{
    path: string;
    oldValue: unknown;
    newValue: unknown;
    type: 'add' | 'update' | 'delete';
  }>, source: string): void {
    const version: ConfigVersion = {
      version: this.generateVersion(),
      timestamp: Date.now(),
      config: { ...this.config },
      changes,
      author: source,
      description: `Configuration update from ${source}`
    };

    this.versions.push(version);
    this.currentVersion = version.version;

    // Keep only last 50 versions
    if (this.versions.length > AI_OPTIMIZER_CONSTANTS.ADDITIONAL_CONSTANTS.DEFAULT_STEP * 5) {
      this.versions = this.versions.slice(-AI_OPTIMIZER_CONSTANTS.ADDITIONAL_CONSTANTS.DEFAULT_STEP * 5);
    }
  }

  private generateVersion(): string {
    const now = new Date();
    const timestamp = now.getTime();
    const RANDOM_STRING_LENGTH = 4;
    const BASE_36 = 36;
    const random = Math.random().toString(BASE_36).substr(2, RANDOM_STRING_LENGTH);
    return `${now.getFullYear()}.${now.getMonth() + 1}.${now.getDate()}-${timestamp}-${random}`;
  }

  private getPreviousVersion(): string | null {
    if (this.versions.length < 2) return null;
    return this.versions[this.versions.length - 2].version;
  }

  private initializeVersioning(): void {
    this.versions.push({
      version: this.currentVersion,
      timestamp: Date.now(),
      config: { ...this.config },
      changes: [],
      author: 'system',
      description: 'Initial configuration'
    });
  }

  private initializeSources(): void {
    // Initialize default sources
    if (this.sources.length === 0) {
      this.sources.push({
        type: 'environment',
        priority: 1,
        enabled: true
      });
    }

    // Sort by priority
    this.sources.sort((a, b) => a.priority - b.priority);
  }

  private startWatching(): void {
    // Watch for file changes, API updates, etc.
    this.sources.forEach(source => {
      if (source.refreshInterval && source.enabled) {
        const interval = setInterval(() => {
          try {
            this.loadFromSource(source.type);
          } catch (error) {
            this.logger.warn(`Failed to load from source ${source.type}:`, { error: error instanceof Error ? error : new Error(String(error)) });
          }
        }, source.refreshInterval);

        this.watchers.set(source.type, interval);
      }
    });
  }

  private loadFromFile(_path: string): Record<string, unknown> {
    // Mock file loading - in real implementation, use fs or fetch
    return {};
  }

  private loadFromAPI(_url: string): Record<string, unknown> {
    // Mock API loading - in real implementation, use fetch
    return {};
  }

  private loadFromDatabase(_connectionString: string): Record<string, unknown> {
    // Mock database loading - in real implementation, use database client
    return {};
  }

  private loadFromEnvironment(): Record<string, unknown> {
    // Mock environment loading - in real implementation, use process.env
    return {};
  }

  private loadFromMemory(): Record<string, unknown> {
    return { ...this.config };
  }

  private encryptConfig(config: Record<string, unknown>): Record<string, unknown> {
    // Mock encryption - in real implementation, use crypto
    return config;
  }

  private decryptConfig(config: Record<string, unknown>): Record<string, unknown> {
    // Mock decryption - in real implementation, use crypto
    return config;
  }

  private toYAML(obj: Record<string, unknown>): string {
    // Mock YAML conversion - in real implementation, use yaml library
    return JSON.stringify(obj, null, 2);
  }

  private fromYAML(yaml: string): Record<string, unknown> {
    // Mock YAML parsing - in real implementation, use yaml library
    return JSON.parse(yaml);
  }

  private toEnv(obj: Record<string, unknown>): string {
    const lines: string[] = [];
    for (const [key, value] of this.flattenConfig(obj)) {
      lines.push(`${key.toUpperCase()}=${value}`);
    }
    return lines.join('\n');
  }

  private fromEnv(env: string): Record<string, unknown> {
    const config: Record<string, unknown> = {};
    const lines = env.split('\n');
    
    for (const line of lines) {
      const [key, value] = line.split('=');
      if (key && value) {
        this.setNestedValue(config, key.toLowerCase(), value);
      }
    }
    
    return config;
  }
}

/**
 * Configuration Performance Monitor
 */
class ConfigPerformanceMonitor {
  private metrics: {
    totalAccesses: number;
    totalUpdates: number;
    averageAccessTime: number;
    averageUpdateTime: number;
    validationTime: number;
    errors: number;
  } = {
    totalAccesses: 0,
    totalUpdates: 0,
    averageAccessTime: 0,
    averageUpdateTime: 0,
    validationTime: 0,
    errors: 0
  };

  private accessTimes: number[] = [];
  private updateTimes: number[] = [];

  recordAccess(path: string, time: number): void {
    this.metrics.totalAccesses++;
    this.accessTimes.push(time);
    this.metrics.averageAccessTime = 
      this.accessTimes.reduce((sum, t) => sum + t, 0) / this.accessTimes.length;
  }

  recordUpdate(path: string, time: number): void {
    this.metrics.totalUpdates++;
    this.updateTimes.push(time);
    this.metrics.averageUpdateTime = 
      this.updateTimes.reduce((sum, t) => sum + t, 0) / this.updateTimes.length;
  }

  recordBulkUpdate(count: number, time: number): void {
    this.metrics.totalUpdates += count;
    this.updateTimes.push(time / count); // Average per item
    this.metrics.averageUpdateTime = 
      this.updateTimes.reduce((sum, t) => sum + t, 0) / this.updateTimes.length;
  }

  recordError(_path: string, _error: Error): void {
    this.metrics.errors++;
  }

  getMetrics() {
    return { ...this.metrics };
  }

  reset(): void {
    this.metrics = {
      totalAccesses: 0,
      totalUpdates: 0,
      averageAccessTime: 0,
      averageUpdateTime: 0,
      validationTime: 0,
      errors: 0
    };
    this.accessTimes = [];
    this.updateTimes = [];
  }
}
