/**
 * Enterprise-related type definitions for CLI
 * 
 * These are local implementations to avoid circular dependencies
 * with the performance-dashboard package.
 */

export interface AIIntegrationManager {
  // Placeholder interface - will be implemented at runtime
}

export interface AlertingSystem {
  // Placeholder interface - will be implemented at runtime
}

export interface AnalyticsEngine {
  // Placeholder interface - will be implemented at runtime
}

// Factory functions that will be implemented at runtime
export const createAIIntegrationManager = (): AIIntegrationManager => {
  // This will be replaced with actual implementation at runtime
  return {} as AIIntegrationManager;
};

export const createAlertingSystem = (config: any): AlertingSystem => {
  // This will be replaced with actual implementation at runtime
  return {} as AlertingSystem;
};

export const createAnalyticsEngine = (config: any): AnalyticsEngine => {
  // This will be replaced with actual implementation at runtime
  return {} as AnalyticsEngine;
};
