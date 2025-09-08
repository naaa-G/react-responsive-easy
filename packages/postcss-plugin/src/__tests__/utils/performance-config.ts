/**
 * Enterprise Performance Testing Configuration
 * Configurable settings for performance testing across different environments
 */

import { PerformanceConfig } from './adaptive-performance';

export interface EnterprisePerformanceConfig extends PerformanceConfig {
  // Environment-specific settings
  environments: {
    ci: {
      multiplier: number;
      maxExecutionTime: number;
      warningThreshold: number;
      failureThreshold: number;
    };
    local: {
      multiplier: number;
      maxExecutionTime: number;
      warningThreshold: number;
      failureThreshold: number;
    };
    production: {
      multiplier: number;
      maxExecutionTime: number;
      warningThreshold: number;
      failureThreshold: number;
    };
  };
  
  // Test-specific configurations
  testConfigs: {
    [testName: string]: {
      baseThreshold: number;
      maxIterations: number;
      timeout: number;
      skipInCI?: boolean;
      skipInLocal?: boolean;
      skipInProduction?: boolean;
    };
  };
  
  // Reporting configuration
  reporting: {
    enableConsoleOutput: boolean;
    enableFileOutput: boolean;
    outputDirectory: string;
    formats: ('json' | 'csv' | 'junit' | 'html')[];
    includeHistoricalData: boolean;
    maxHistoricalReports: number;
  };
  
  // Alerting configuration
  alerting: {
    enableAlerts: boolean;
    alertThresholds: {
      regression: number;
      improvement: number;
      anomaly: number;
    };
    notificationChannels: string[];
  };
  
  // Performance optimization settings
  optimization: {
    enableCaching: boolean;
    cacheSize: number;
    enableParallelExecution: boolean;
    maxConcurrency: number;
  };
}

/**
 * Default enterprise performance configuration
 */
export const defaultEnterpriseConfig: EnterprisePerformanceConfig = {
  // Base configuration
  ciMultiplier: 3.0,
  localMultiplier: 1.0,
  productionMultiplier: 0.8,
  warningThreshold: 1.5,
  failureThreshold: 2.0,
  minSampleSize: 5,
  maxHistoricalPoints: 50,
  environmentDetection: {
    ci: ['CI', 'GITHUB_ACTIONS', 'GITLAB_CI', 'CIRCLECI', 'TRAVIS', 'JENKINS_URL', 'TF_BUILD'],
    local: ['NODE_ENV=development', 'USER', 'HOME'],
    production: ['NODE_ENV=production']
  },
  
  // Environment-specific settings
  environments: {
    ci: {
      multiplier: 3.0,
      maxExecutionTime: 30000, // 30 seconds
      warningThreshold: 1.5,
      failureThreshold: 2.0
    },
    local: {
      multiplier: 1.0,
      maxExecutionTime: 10000, // 10 seconds
      warningThreshold: 1.3,
      failureThreshold: 1.8
    },
    production: {
      multiplier: 0.8,
      maxExecutionTime: 5000, // 5 seconds
      warningThreshold: 1.2,
      failureThreshold: 1.5
    }
  },
  
  // Test-specific configurations
  testConfigs: {
    'CI/CD Performance Requirements': {
      baseThreshold: 1000,
      maxIterations: 5,
      timeout: 30000
    },
    'Cross-Environment Performance Consistency': {
      baseThreshold: 1000,
      maxIterations: 3,
      timeout: 20000
    },
    'small-css': {
      baseThreshold: 100,
      maxIterations: 10,
      timeout: 5000
    },
    'medium-css': {
      baseThreshold: 500,
      maxIterations: 5,
      timeout: 10000
    },
    'large-css': {
      baseThreshold: 2000,
      maxIterations: 3,
      timeout: 20000
    }
  },
  
  // Reporting configuration
  reporting: {
    enableConsoleOutput: true,
    enableFileOutput: false,
    outputDirectory: './performance-reports',
    formats: ['json', 'csv'],
    includeHistoricalData: true,
    maxHistoricalReports: 100
  },
  
  // Alerting configuration
  alerting: {
    enableAlerts: true,
    alertThresholds: {
      regression: 1.5,
      improvement: -0.2,
      anomaly: 3.0
    },
    notificationChannels: ['console']
  },
  
  // Performance optimization settings
  optimization: {
    enableCaching: true,
    cacheSize: 1000,
    enableParallelExecution: false,
    maxConcurrency: 4
  }
};

/**
 * Load configuration from environment variables
 */
export function loadConfigFromEnv(): Partial<EnterprisePerformanceConfig> {
  const config: Partial<EnterprisePerformanceConfig> = {};
  
  // Load environment-specific multipliers
  if (process.env.PERFORMANCE_CI_MULTIPLIER) {
    config.ciMultiplier = parseFloat(process.env.PERFORMANCE_CI_MULTIPLIER);
  }
  
  if (process.env.PERFORMANCE_LOCAL_MULTIPLIER) {
    config.localMultiplier = parseFloat(process.env.PERFORMANCE_LOCAL_MULTIPLIER);
  }
  
  if (process.env.PERFORMANCE_PRODUCTION_MULTIPLIER) {
    config.productionMultiplier = parseFloat(process.env.PERFORMANCE_PRODUCTION_MULTIPLIER);
  }
  
  // Load threshold settings
  if (process.env.PERFORMANCE_WARNING_THRESHOLD) {
    config.warningThreshold = parseFloat(process.env.PERFORMANCE_WARNING_THRESHOLD);
  }
  
  if (process.env.PERFORMANCE_FAILURE_THRESHOLD) {
    config.failureThreshold = parseFloat(process.env.PERFORMANCE_FAILURE_THRESHOLD);
  }
  
  // Load reporting settings
  if (process.env.PERFORMANCE_ENABLE_CONSOLE_OUTPUT) {
    config.reporting = {
      ...defaultEnterpriseConfig.reporting,
      enableConsoleOutput: process.env.PERFORMANCE_ENABLE_CONSOLE_OUTPUT === 'true'
    };
  }
  
  if (process.env.PERFORMANCE_OUTPUT_DIRECTORY) {
    config.reporting = {
      ...defaultEnterpriseConfig.reporting,
      outputDirectory: process.env.PERFORMANCE_OUTPUT_DIRECTORY
    };
  }
  
  // Load optimization settings
  if (process.env.PERFORMANCE_ENABLE_CACHING) {
    config.optimization = {
      ...defaultEnterpriseConfig.optimization,
      enableCaching: process.env.PERFORMANCE_ENABLE_CACHING === 'true'
    };
  }
  
  return config;
}

/**
 * Merge configuration with defaults
 */
export function createConfig(overrides?: Partial<EnterprisePerformanceConfig>): EnterprisePerformanceConfig {
  const envConfig = loadConfigFromEnv();
  
  return {
    ...defaultEnterpriseConfig,
    ...envConfig,
    ...overrides,
    environments: {
      ...defaultEnterpriseConfig.environments,
      ...envConfig.environments,
      ...overrides?.environments
    },
    testConfigs: {
      ...defaultEnterpriseConfig.testConfigs,
      ...envConfig.testConfigs,
      ...overrides?.testConfigs
    },
    reporting: {
      ...defaultEnterpriseConfig.reporting,
      ...envConfig.reporting,
      ...overrides?.reporting
    },
    alerting: {
      ...defaultEnterpriseConfig.alerting,
      ...envConfig.alerting,
      ...overrides?.alerting
    },
    optimization: {
      ...defaultEnterpriseConfig.optimization,
      ...envConfig.optimization,
      ...overrides?.optimization
    }
  };
}

/**
 * Get test-specific configuration
 */
export function getTestConfig(testName: string, config: EnterprisePerformanceConfig) {
  return config.testConfigs[testName] || {
    baseThreshold: 1000,
    maxIterations: 1,
    timeout: 10000
  };
}

/**
 * Check if test should be skipped in current environment
 */
export function shouldSkipTest(testName: string, environment: string, config: EnterprisePerformanceConfig): boolean {
  const testConfig = getTestConfig(testName, config);
  
  switch (environment) {
    case 'ci':
      return testConfig.skipInCI === true;
    case 'local':
      return testConfig.skipInLocal === true;
    case 'production':
      return testConfig.skipInProduction === true;
    default:
      return false;
  }
}

/**
 * Get environment-specific configuration
 */
export function getEnvironmentConfig(environment: string, config: EnterprisePerformanceConfig) {
  return config.environments[environment as keyof typeof config.environments] || config.environments.local;
}

/**
 * Validate configuration
 */
export function validateConfig(config: EnterprisePerformanceConfig): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  // Validate multipliers
  if (config.ciMultiplier <= 0) {
    errors.push('CI multiplier must be greater than 0');
  }
  
  if (config.localMultiplier <= 0) {
    errors.push('Local multiplier must be greater than 0');
  }
  
  if (config.productionMultiplier <= 0) {
    errors.push('Production multiplier must be greater than 0');
  }
  
  // Validate thresholds
  if (config.warningThreshold <= 1.0) {
    errors.push('Warning threshold must be greater than 1.0');
  }
  
  if (config.failureThreshold <= config.warningThreshold) {
    errors.push('Failure threshold must be greater than warning threshold');
  }
  
  // Validate sample size
  if (config.minSampleSize < 1) {
    errors.push('Minimum sample size must be at least 1');
  }
  
  // Validate test configurations
  for (const [testName, testConfig] of Object.entries(config.testConfigs)) {
    if (testConfig.baseThreshold <= 0) {
      errors.push(`Test "${testName}" base threshold must be greater than 0`);
    }
    
    if (testConfig.maxIterations < 1) {
      errors.push(`Test "${testName}" max iterations must be at least 1`);
    }
    
    if (testConfig.timeout <= 0) {
      errors.push(`Test "${testName}" timeout must be greater than 0`);
    }
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Export configuration to file
 */
export function exportConfig(config: EnterprisePerformanceConfig, format: 'json' | 'yaml' = 'json'): string {
  if (format === 'json') {
    return JSON.stringify(config, null, 2);
  }
  
  // Simple YAML export (for basic cases)
  let yaml = '';
  yaml += `ciMultiplier: ${config.ciMultiplier}\n`;
  yaml += `localMultiplier: ${config.localMultiplier}\n`;
  yaml += `productionMultiplier: ${config.productionMultiplier}\n`;
  yaml += `warningThreshold: ${config.warningThreshold}\n`;
  yaml += `failureThreshold: ${config.failureThreshold}\n`;
  yaml += `minSampleSize: ${config.minSampleSize}\n`;
  yaml += `maxHistoricalPoints: ${config.maxHistoricalPoints}\n`;
  
  return yaml;
}
