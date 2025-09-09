/**
 * Validation utilities for the Babel plugin
 */

import type { BabelPluginOptions, ResponsiveConfig } from '../types';

/**
 * Validate plugin options
 */
export function validatePluginOptions(options: any): options is BabelPluginOptions {
  if (!options || typeof options !== 'object') {
    return false;
  }

  // Validate boolean options
  const booleanOptions = [
    'precompute', 'development', 'generateCSSProps', 'enableCaching',
    'enableMemoization', 'addComments', 'validateConfig', 'performanceMetrics',
    'generateSourceMaps', 'preserveTypeInfo', 'minifyOutput'
  ];

  for (const option of booleanOptions) {
    if (option in options && typeof options[option] !== 'boolean') {
      return false;
    }
  }

  // Validate string options
  const stringOptions = ['configPath', 'importSource'];
  for (const option of stringOptions) {
    if (option in options && typeof options[option] !== 'string') {
      return false;
    }
  }

  // Validate number options
  const numberOptions = ['cacheSize'];
  for (const option of numberOptions) {
    if (option in options && typeof options[option] !== 'number') {
      return false;
    }
  }

  // Validate function options
  const functionOptions = ['onTransform', 'onError'];
  for (const option of functionOptions) {
    if (option in options && typeof options[option] !== 'function') {
      return false;
    }
  }

  // Validate configInline
  if (options.configInline && !validateResponsiveConfig(options.configInline)) {
    return false;
  }

  return true;
}

/**
 * Validate responsive configuration
 */
export function validateResponsiveConfig(config: any): config is ResponsiveConfig {
  if (!config || typeof config !== 'object') {
    return false;
  }

  // Validate base breakpoint
  if (!config.base || !isValidViewport(config.base)) {
    return false;
  }

  // Validate breakpoints array
  if (!Array.isArray(config.breakpoints) || config.breakpoints.length === 0) {
    return false;
  }

  for (const breakpoint of config.breakpoints) {
    if (!isValidBreakpoint(breakpoint)) {
      return false;
    }
  }

  // Validate strategy
  if (!config.strategy || !isValidScalingStrategy(config.strategy)) {
    return false;
  }

  return true;
}

/**
 * Validate viewport object
 */
function isValidViewport(viewport: any): boolean {
  return (
    viewport &&
    typeof viewport === 'object' &&
    typeof viewport.name === 'string' &&
    typeof viewport.width === 'number' &&
    typeof viewport.height === 'number' &&
    typeof viewport.alias === 'string' &&
    viewport.width > 0 &&
    viewport.height > 0
  );
}

/**
 * Validate breakpoint object
 */
function isValidBreakpoint(breakpoint: any): boolean {
  return (
    breakpoint &&
    typeof breakpoint === 'object' &&
    typeof breakpoint.name === 'string' &&
    typeof breakpoint.width === 'number' &&
    typeof breakpoint.height === 'number' &&
    typeof breakpoint.alias === 'string' &&
    breakpoint.width > 0 &&
    breakpoint.height > 0
  );
}

/**
 * Validate scaling strategy
 */
function isValidScalingStrategy(strategy: any): boolean {
  if (!strategy || typeof strategy !== 'object') {
    return false;
  }

  // Validate origin
  const validOrigins = ['width', 'height', 'min', 'max', 'diagonal', 'area'];
  if (!validOrigins.includes(strategy.origin)) {
    return false;
  }

  // Validate tokens
  if (!strategy.tokens || typeof strategy.tokens !== 'object') {
    return false;
  }

  for (const [, tokenConfig] of Object.entries(strategy.tokens)) {
    if (!isValidTokenConfig(tokenConfig)) {
      return false;
    }
  }

  // Validate rounding
  if (!strategy.rounding || !isValidRoundingConfig(strategy.rounding)) {
    return false;
  }

  return true;
}

/**
 * Validate token configuration
 */
function isValidTokenConfig(tokenConfig: any): boolean {
  if (!tokenConfig || typeof tokenConfig !== 'object') {
    return false;
  }

  // Validate scale
  if (tokenConfig.scale !== undefined) {
    if (typeof tokenConfig.scale !== 'number' && typeof tokenConfig.scale !== 'function') {
      return false;
    }
  }

  // Validate min/max
  if (tokenConfig.min !== undefined && typeof tokenConfig.min !== 'number') {
    return false;
  }
  if (tokenConfig.max !== undefined && typeof tokenConfig.max !== 'number') {
    return false;
  }

  // Validate step
  if (tokenConfig.step !== undefined && typeof tokenConfig.step !== 'number') {
    return false;
  }

  // Validate round
  if (tokenConfig.round !== undefined && typeof tokenConfig.round !== 'boolean') {
    return false;
  }

  // Validate unit
  if (tokenConfig.unit !== undefined && typeof tokenConfig.unit !== 'string') {
    return false;
  }

  return true;
}

/**
 * Validate rounding configuration
 */
function isValidRoundingConfig(rounding: any): boolean {
  if (!rounding || typeof rounding !== 'object') {
    return false;
  }

  const validModes = ['nearest', 'floor', 'ceil'];
  if (!validModes.includes(rounding.mode)) {
    return false;
  }

  if (typeof rounding.precision !== 'number' || rounding.precision < 0) {
    return false;
  }

  return true;
}

/**
 * Get validation errors for plugin options
 */
export function getPluginOptionsErrors(options: any): string[] {
  const errors: string[] = [];

  if (!options || typeof options !== 'object') {
    errors.push('Options must be an object');
    return errors;
  }

  // Check boolean options
  const booleanOptions = [
    'precompute', 'development', 'generateCSSProps', 'enableCaching',
    'enableMemoization', 'addComments', 'validateConfig', 'performanceMetrics',
    'generateSourceMaps', 'preserveTypeInfo', 'minifyOutput'
  ];

  for (const option of booleanOptions) {
    if (option in options && typeof options[option] !== 'boolean') {
      errors.push(`Option '${option}' must be a boolean`);
    }
  }

  // Check string options
  const stringOptions = ['configPath', 'importSource'];
  for (const option of stringOptions) {
    if (option in options && typeof options[option] !== 'string') {
      errors.push(`Option '${option}' must be a string`);
    }
  }

  // Check number options
  const numberOptions = ['cacheSize'];
  for (const option of numberOptions) {
    if (option in options && typeof options[option] !== 'number') {
      errors.push(`Option '${option}' must be a number`);
    }
  }

  // Check function options
  const functionOptions = ['onTransform', 'onError'];
  for (const option of functionOptions) {
    if (option in options && typeof options[option] !== 'function') {
      errors.push(`Option '${option}' must be a function`);
    }
  }

  // Check configInline
  if (options.configInline && !validateResponsiveConfig(options.configInline)) {
    errors.push('Invalid configInline configuration');
  }

  return errors;
}

/**
 * Get validation errors for responsive configuration
 */
export function getResponsiveConfigErrors(config: any): string[] {
  const errors: string[] = [];

  if (!config || typeof config !== 'object') {
    errors.push('Configuration must be an object');
    return errors;
  }

  // Check base breakpoint
  if (!config.base) {
    errors.push('Missing required base breakpoint');
  } else if (!isValidViewport(config.base)) {
    errors.push('Invalid base breakpoint configuration');
  }

  // Check breakpoints array
  if (!Array.isArray(config.breakpoints)) {
    errors.push('Breakpoints must be an array');
  } else if (config.breakpoints.length === 0) {
    errors.push('At least one breakpoint is required');
  } else {
    config.breakpoints.forEach((breakpoint: any, index: number) => {
      if (!isValidBreakpoint(breakpoint)) {
        errors.push(`Invalid breakpoint at index ${index}`);
      }
    });
  }

  // Check strategy
  if (!config.strategy) {
    errors.push('Missing required strategy configuration');
  } else if (!isValidScalingStrategy(config.strategy)) {
    errors.push('Invalid strategy configuration');
  }

  return errors;
}
