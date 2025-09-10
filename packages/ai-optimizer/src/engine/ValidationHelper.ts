/**
 * Validation helper for AI Optimizer
 * 
 * Contains validation logic extracted from AIOptimizer to reduce complexity
 * and improve maintainability.
 */

import { ComponentUsageData } from '../types/index.js';

/**
 * Validates usage data structure and throws errors for malformed data
 * This validation is strict for truly malformed data but lenient for missing optional properties
 */
export function validateUsageData(usageData: ComponentUsageData[]): void {
  if (!Array.isArray(usageData)) {
    throw new Error('Usage data must be an array');
  }

  if (usageData.length === 0) {
    throw new Error('Usage data cannot be empty');
  }

  for (let i = 0; i < usageData.length; i++) {
    const data = usageData[i];
    
    if (!data || typeof data !== 'object') {
      throw new Error(`Invalid usage data at index ${i}: must be an object`);
    }

    validateResponsiveValues(data, i);
    validatePerformanceData(data, i);
  }
}

/**
 * Validates responsive values structure
 */
function validateResponsiveValues(data: ComponentUsageData, index: number): void {
  // Check responsiveValues - this is the critical validation for malformed data tests
  // Only throw error if responsiveValues is explicitly null/undefined (malformed)
  if (data.responsiveValues === null || data.responsiveValues === undefined) {
    throw new Error(`Invalid usage data at index ${index}: responsiveValues is required`);
  }

  // If responsiveValues exists but is not an array, that's also malformed
  if (!Array.isArray(data.responsiveValues)) {
    throw new Error(`Invalid usage data at index ${index}: responsiveValues must be an array`);
  }

  // Validate each responsive value only if the array is not empty
  if (data.responsiveValues.length > 0) {
    data.responsiveValues.forEach((value, valueIndex) => {
      validateResponsiveValue(value, index, valueIndex);
    });
  }
}

/**
 * Validates individual responsive value
 */
function validateResponsiveValue(value: unknown, dataIndex: number, valueIndex: number): void {
  if (!value || typeof value !== 'object') {
    throw new Error(`Invalid responsive value at index ${dataIndex}.${valueIndex}: must be an object`);
  }

  const valueObj = value as Record<string, unknown>;

  if (!valueObj.token || typeof valueObj.token !== 'string') {
    throw new Error(`Invalid responsive value at index ${dataIndex}.${valueIndex}: token is required and must be a string`);
  }

  if (!valueObj.property || typeof valueObj.property !== 'string') {
    throw new Error(`Invalid responsive value at index ${dataIndex}.${valueIndex}: property is required and must be a string`);
  }

  if (typeof valueObj.baseValue !== 'number') {
    throw new Error(`Invalid responsive value at index ${dataIndex}.${valueIndex}: baseValue is required and must be a number`);
  }
}

/**
 * Validates performance data structure
 */
function validatePerformanceData(data: ComponentUsageData, index: number): void {
  // Performance data validation - only check if performance object exists
  if (data.performance && typeof data.performance === 'object') {
    // Only validate if the properties exist and are the wrong type
    if (data.performance.renderTime !== undefined && typeof data.performance.renderTime !== 'number') {
      throw new Error(`Invalid usage data at index ${index}: performance.renderTime must be a number`);
    }

    if (data.performance.bundleSize !== undefined && typeof data.performance.bundleSize !== 'number') {
      throw new Error(`Invalid usage data at index ${index}: performance.bundleSize must be a number`);
    }

    if (data.performance.memoryUsage !== undefined && typeof data.performance.memoryUsage !== 'number') {
      throw new Error(`Invalid usage data at index ${index}: performance.memoryUsage must be a number`);
    }

    if (data.performance.layoutShift !== undefined && typeof data.performance.layoutShift !== 'number') {
      throw new Error(`Invalid usage data at index ${index}: performance.layoutShift must be a number`);
    }
  }
  // Note: We don't require performance object to exist - it can be missing and handled gracefully
}
