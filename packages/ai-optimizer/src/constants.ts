/**
 * AI Optimizer Constants
 * Centralized constants for the AI Optimizer package to eliminate magic numbers
 * and improve maintainability.
 */

// Base constants to avoid circular references
const KB_TO_BYTES = 1024;
const MB_TO_BYTES = KB_TO_BYTES * KB_TO_BYTES;
const GB_TO_BYTES = MB_TO_BYTES * KB_TO_BYTES;
const MINUTE_MS = 60000;
const HOUR_MS = 60 * MINUTE_MS;
// const DAY_MS = 24 * HOUR_MS; // Removed unused constant

// Additional constants for magic numbers
const MEMORY_200_MB_MULTIPLIER = 200;
const MEMORY_128_KB_MULTIPLIER = 128;
const MEMORY_32_KB_MULTIPLIER = 32;
const CLEANUP_INTERVAL_SECONDS = 10;
const SECONDS_TO_MS = 1000;
const MEMORY_WARNING_MULTIPLIER = 2.5;
const MEMORY_CRITICAL_MULTIPLIER = 5;
const STORAGE_50_MB_MULTIPLIER = 50;
const STORAGE_10_MB_MULTIPLIER = 10;
const SECONDS_IN_MINUTE = 60;
const MINUTES_IN_HOUR = 60;
const HOURS_IN_DAY = 24;
const DAYS_IN_WEEK = 7;
const COMPRESSION_LEVEL_DEFAULT = 6;
const HEALTH_CHECK_INTERVAL_SECONDS = 30;
const METRICS_COLLECTION_INTERVAL_SECONDS = 60;
const RATE_LIMIT_WINDOW_SECONDS = 60;
const MAX_REQUESTS_PER_WINDOW = 100;
const ENCRYPTION_KEY_LENGTH = 256;
const CROSS_VALIDATION_FOLDS = 5;
const TEST_SPLIT = 0.2;
const VALIDATION_SPLIT = 0.1;
const CONFIDENCE_THRESHOLD = 0.95;
const BUFFER_SIZE_KB = 1;
const FLUSH_INTERVAL_SECONDS = 1;
const MAX_QUEUE_SIZE = 10000;
const BACKPRESSURE_THRESHOLD = 0.8;
const ALERT_THRESHOLD = 0.8;
const RECOVERY_THRESHOLD = 0.5;
// Removed unused constants - they are defined in ADDITIONAL_CONSTANTS below

const BASE_CONSTANTS = {
  FEATURE_DIMENSION: 128,
  MEMORY_200MB: MEMORY_200_MB_MULTIPLIER * MB_TO_BYTES,
  MEMORY_1MB: MB_TO_BYTES,
  MEMORY_128KB: MEMORY_128_KB_MULTIPLIER * KB_TO_BYTES,
  MEMORY_32KB: MEMORY_32_KB_MULTIPLIER * KB_TO_BYTES,
  KB_TO_BYTES,
  MB_TO_BYTES,
  GB_TO_BYTES,
} as const;

// Additional constants for memory calculations
const MEMORY_200_MB_MULTIPLIER_CONST = 200;
const MEMORY_128_KB_MULTIPLIER_CONST = 128;
const MEMORY_32_KB_MULTIPLIER_CONST = 32;
const MEMORY_200_MB_BYTES = MEMORY_200_MB_MULTIPLIER_CONST * KB_TO_BYTES * KB_TO_BYTES;
const MEMORY_1_MB_BYTES = KB_TO_BYTES * KB_TO_BYTES;
const MEMORY_128_KB_BYTES = MEMORY_128_KB_MULTIPLIER_CONST * KB_TO_BYTES;
const MEMORY_32_KB_BYTES = MEMORY_32_KB_MULTIPLIER_CONST * KB_TO_BYTES;

export const ADDITIONAL_CONSTANTS = {
  // Memory and Size Constants
  MEMORY_200MB: MEMORY_200_MB_BYTES,
  MEMORY_1MB: MEMORY_1_MB_BYTES,
  MEMORY_128KB: MEMORY_128_KB_BYTES,
  MEMORY_32KB: MEMORY_32_KB_BYTES,
  
  // Feature and Model Constants
  FEATURE_DIMENSION: 10,
  MOBILE_BASE_WIDTH: 375,
  MODEL_INPUT_SIZE: 32,
  MAX_PREDICTION_VALUE: 1000000,
  DEFAULT_CONFIDENCE: 0.8,
  DEFAULT_TOLERANCE: 0.1,
  
  // Performance Constants
  RENDER_THRESHOLD_MS: 16,
  ANIMATION_FRAME: 16,
  DEBOUNCE_DELAY: 300,
  
  // Cache Constants
  CACHE_ENTRY_SIZE: 128,
  CACHE_TTL_MS: 300000,
  MAX_CACHE_ENTRIES: 1000,
  
  // Validation Constants
  MIN_SAMPLE_SIZE: 10,
  MAX_SAMPLE_SIZE: 10000,
  VALIDATION_THRESHOLD: 0.7,
  
  // Model Constants
  DEFAULT_LEARNING_RATE: 0.001,
  DEFAULT_BATCH_SIZE: 32,
  DEFAULT_EPOCHS: 100,
  DEFAULT_VALIDATION_SPLIT: 0.2,
  
  // Feature Engineering Constants
  MAX_FEATURES: 50,
  MIN_FEATURE_IMPORTANCE: 0.01,
  CORRELATION_THRESHOLD: 0.8,
  
  // Performance Monitoring Constants
  METRICS_WINDOW_SIZE: 100,
  ALERT_THRESHOLD: 0.9,
  DEGRADATION_THRESHOLD: 0.1,
  
  // Streaming Constants
  HEARTBEAT_INTERVAL: 30000,
  RECONNECT_DELAY: 5000,
  MAX_RECONNECT_ATTEMPTS: 5,
  
  // Security Constants
  MAX_REQUEST_SIZE: MEMORY_1_MB_BYTES, // 1MB
  RATE_LIMIT_WINDOW: MINUTE_MS, // 1 minute
  MAX_REQUESTS_PER_WINDOW: 100,
  
  // Error Handling Constants
  MAX_RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
  TIMEOUT_DURATION: 30000,
  
  // Data Collection Constants
  BATCH_SIZE: 100,
  FLUSH_INTERVAL: 5000,
  MAX_QUEUE_SIZE: 1000,
  
  // Optimization Constants
  OPTIMIZATION_ITERATIONS: 10,
  CONVERGENCE_THRESHOLD: 0.001,
  STEP_SIZE: 0.01,
  
  // Analytics Constants
  SESSION_TIMEOUT: 1800000, // 30 minutes
  EVENT_BATCH_SIZE: 50,
  ANALYTICS_FLUSH_INTERVAL: 10000,
  
  // Network Constants
  CONNECTION_TIMEOUT: 10000,
  REQUEST_TIMEOUT: 30000,
  MAX_CONCURRENT_REQUESTS: 10,
  
  // Storage Constants
  MAX_STORAGE_SIZE: STORAGE_50_MB_MULTIPLIER * MEMORY_1_MB_BYTES, // 50MB
  STORAGE_CLEANUP_INTERVAL: 3600000, // 1 hour
  MAX_STORAGE_ENTRIES: 10000,
  
  // Monitoring Constants
  HEALTH_CHECK_INTERVAL: 60000, // 1 minute
  METRICS_COLLECTION_INTERVAL: 5000, // 5 seconds
  ALERT_COOLDOWN: 300000, // 5 minutes
  
  // Feature Engineering Constants
  MAX_FEATURE_COMBINATIONS: 1000,
  FEATURE_SELECTION_THRESHOLD: 0.1,
  DIMENSIONALITY_REDUCTION_RATIO: 0.8,
  
  // Model Evaluation Constants
  CROSS_VALIDATION_FOLDS: 5,
  CONFIDENCE_INTERVAL: 0.95,
  STATISTICAL_SIGNIFICANCE: 0.05,
  
  // Streaming Constants
  MESSAGE_QUEUE_SIZE: 1000,
  HEARTBEAT_TIMEOUT: 60000,
  CONNECTION_RETRY_DELAY: 2000,
  
  // Security Constants
  ENCRYPTION_KEY_LENGTH: 256,
  TOKEN_EXPIRY: 3600000, // 1 hour
  MAX_LOGIN_ATTEMPTS: 5,
  
  // Error Handling Constants
  ERROR_REPORTING_THRESHOLD: 10,
  ERROR_AGGREGATION_WINDOW: 300000, // 5 minutes
  MAX_ERROR_DETAILS: 1000,
  
  // Data Collection Constants
  DATA_RETENTION_DAYS: 30,
  PRIVACY_MODE: false,
  ANONYMIZATION_ENABLED: true,
  
  // Optimization Constants
  GRADIENT_DESCENT_STEPS: 1000,
  LEARNING_RATE_DECAY: 0.95,
  MOMENTUM_FACTOR: 0.9,
  
  // Analytics Constants
  USER_SESSION_TIMEOUT: 1800000, // 30 minutes
  EVENT_SAMPLING_RATE: 1.0,
  METRICS_AGGREGATION_WINDOW: 300000, // 5 minutes
  
  // Network Constants
  KEEP_ALIVE_INTERVAL: 30000,
  MAX_RETRY_BACKOFF: 30000,
  CONNECTION_POOL_SIZE: 20,
  
  // Storage Constants
  COMPRESSION_ENABLED: true,
  ENCRYPTION_ENABLED: true,
  BACKUP_FREQUENCY: 86400000, // 24 hours
  
  // Monitoring Constants
  LOG_LEVEL: 'info',
  METRICS_RETENTION_DAYS: 7,
  ALERT_ESCALATION_DELAY: 300000, // 5 minutes
  
  // Additional missing properties
  DEFAULT_STEP: 8,
  MIN_THRESHOLD: 0.1,
  DEFAULT_INDUSTRY_CODE: 1,
  DEFAULT_BREAKPOINT_RATIO: 1.5,
  PERFORMANCE_THRESHOLD_MS: 5000,
  BUNDLE_SIZE_THRESHOLD: 0.05,
  RENDER_THRESHOLD: 16,
  ACCESSIBILITY_THRESHOLD: 44,
  MIN_SCALE_FACTOR: 0.1,
  MAX_SCALE_FACTOR: 2.0,
  DEFAULT_SCALE: 1.0,
  MIN_ALPHA: 0.1,
  MAX_ALPHA: 0.8,
  DEFAULT_ALPHA: 0.5,
  ROUNDING_FACTOR: 0.5,
  MB_TO_BYTES: MEMORY_1_MB_BYTES,
  CACHE_MAX_SIZE: 200,
  
  // Missing constants for type compatibility
  COMPLEX_BREAKPOINT_HEIGHT_BASE: 100,
  COMPLEX_BREAKPOINT_HEIGHT_INCREMENT: 50,
  MEMORY_THRESHOLD: 1,
  KB_TO_BYTES: 1024,
  CACHE_BLOCK_SIZE: 64,
} as const;

export const AI_OPTIMIZER_CONSTANTS = {
  // Additional Constants
  ADDITIONAL_CONSTANTS,

  // Cache Configuration
  CACHE_SIZES: {
    L1: KB_TO_BYTES,
    L2: KB_TO_BYTES,
    L3: KB_TO_BYTES,
    MAX_ITEMS: 50,
    DEFAULT_TTL: MINUTE_MS, // 1 minute in milliseconds
  },

  // Performance Thresholds
  PERFORMANCE_THRESHOLDS: {
    MIN_SCORE: 0.5,
    MAX_SCORE: 1.0,
    WARNING_THRESHOLD: 0.3,
    EXCELLENT_THRESHOLD: 0.8,
    GOOD_THRESHOLD: 0.6,
    FAIR_THRESHOLD: 0.4,
    POOR_THRESHOLD: 0.2,
  },

  // Machine Learning Model Parameters
  ML_PARAMETERS: {
    LEARNING_RATE: 0.001,
    BATCH_SIZE: 16,
    EPOCHS: 32,
    HIDDEN_LAYERS: [BASE_CONSTANTS.FEATURE_DIMENSION / 2, BASE_CONSTANTS.FEATURE_DIMENSION, BASE_CONSTANTS.FEATURE_DIMENSION * 2, BASE_CONSTANTS.FEATURE_DIMENSION * 4],
    DROPOUT_RATE: 0.1,
    REGULARIZATION: 0.2,
    MOMENTUM: 0.9,
    WEIGHT_DECAY: 0.0001,
  },

  // Memory Management
  MEMORY_LIMITS: {
    MAX_HEAP_SIZE: BASE_CONSTANTS.MEMORY_200MB, // 200MB
    WARNING_THRESHOLD: BASE_CONSTANTS.MEMORY_200MB * MEMORY_WARNING_MULTIPLIER, // 500MB
    CRITICAL_THRESHOLD: BASE_CONSTANTS.MEMORY_200MB * MEMORY_CRITICAL_MULTIPLIER, // 1GB
    CLEANUP_INTERVAL: CLEANUP_INTERVAL_SECONDS * SECONDS_TO_MS, // 10 seconds
  },

  // Batch Processing
  BATCH_PROCESSING: {
    DEFAULT_BATCH_SIZE: BASE_CONSTANTS.KB_TO_BYTES,
    MAX_BATCH_SIZE: BASE_CONSTANTS.KB_TO_BYTES,
    PROCESSING_INTERVAL: 5 * MINUTE_MS, // 5 minutes
    RETRY_ATTEMPTS: 3,
    RETRY_DELAY: 1000, // 1 second
  },

  // Analytics and Reporting
  ANALYTICS: {
    SAMPLE_RATE: 0.1,
    REPORT_INTERVAL: HOUR_MS, // 1 hour
    MAX_METRICS: 10000,
    RETENTION_DAYS: 30,
    AGGREGATION_WINDOW: 5 * MINUTE_MS, // 5 minutes
  },

  // Network and API
  NETWORK: {
    DEFAULT_TIMEOUT: 30 * 1000, // 30 seconds
    MAX_RETRIES: 3,
    RETRY_DELAY: 1000, // 1 second
    CONNECTION_POOL_SIZE: 10,
    KEEP_ALIVE_TIMEOUT: MINUTE_MS, // 1 minute
  },

  // Data Collection
  DATA_COLLECTION: {
    SAMPLE_RATE: 0.5,
    MAX_ENTRIES: 10000,
    FLUSH_INTERVAL: MINUTE_MS, // 1 minute
    COMPRESSION_THRESHOLD: 0.1,
    BATCH_SIZE: 20,
  },

  // Optimization Weights
  OPTIMIZATION_WEIGHTS: {
    PERFORMANCE: 0.3,
    MEMORY: 0.2,
    ACCURACY: 0.4,
    EFFICIENCY: 0.1,
  },

  // Performance Constants
  PERFORMANCE: {
    CACHE_EFFICIENCY: 0.8,
    MIN_SCORE: 0.1,
    MAX_SCORE: 1.0,
    THRESHOLD: 0.7,
  },

  // Similarity Thresholds
  SIMILARITY_THRESHOLDS: {
    HIGH: 0.9,
    MEDIUM: 1.1,
    LOW: 0.5,
  },

  // Error Handling
  ERROR_HANDLING: {
    MAX_RETRIES: 3,
    RETRY_DELAY: 1000,
    TIMEOUT: 30000,
    CIRCUIT_BREAKER_THRESHOLD: 5,
  },

  // File and Storage
  STORAGE: {
    MAX_FILE_SIZE: STORAGE_50_MB_MULTIPLIER * BASE_CONSTANTS.MB_TO_BYTES, // 50MB
    TEMP_DIR: '/tmp',
    BACKUP_RETENTION: DAYS_IN_WEEK, // days
    COMPRESSION_LEVEL: COMPRESSION_LEVEL_DEFAULT,
  },

  // Time Constants
  TIME: {
    SECOND: SECONDS_TO_MS,
    MINUTE: SECONDS_IN_MINUTE * SECONDS_TO_MS,
    HOUR: MINUTES_IN_HOUR * SECONDS_IN_MINUTE * SECONDS_TO_MS,
    DAY: HOURS_IN_DAY * MINUTES_IN_HOUR * SECONDS_IN_MINUTE * SECONDS_TO_MS,
  },

  // Mathematical Constants
  MATH: {
    PI: Math.PI,
    E: Math.E,
    GOLDEN_RATIO: 1.618033988749895,
    SQRT_2: Math.sqrt(2),
  },

  // Feature Engineering
  FEATURE_ENGINEERING: {
    POLYNOMIAL_DEGREE: 2,
    INTERACTION_TERMS: 3,
    SCALING_FACTOR: 0.1,
    NORMALIZATION_RANGE: [0, 1],
  },

  // Model Evaluation
  MODEL_EVALUATION: {
    CROSS_VALIDATION_FOLDS,
    TEST_SPLIT,
    VALIDATION_SPLIT,
    CONFIDENCE_THRESHOLD,
  },

  // Streaming and Real-time
  STREAMING: {
    BUFFER_SIZE: BUFFER_SIZE_KB * BASE_CONSTANTS.KB_TO_BYTES,
    FLUSH_INTERVAL: FLUSH_INTERVAL_SECONDS * SECONDS_TO_MS, // 1 second
    MAX_QUEUE_SIZE,
    BACKPRESSURE_THRESHOLD,
  },

  // Security
  SECURITY: {
    MAX_REQUEST_SIZE: STORAGE_10_MB_MULTIPLIER * BASE_CONSTANTS.MB_TO_BYTES, // 10MB
    RATE_LIMIT_WINDOW: RATE_LIMIT_WINDOW_SECONDS * SECONDS_TO_MS, // 1 minute
    MAX_REQUESTS_PER_WINDOW,
    ENCRYPTION_KEY_LENGTH,
  },

  // Monitoring and Health Checks
  MONITORING: {
    HEALTH_CHECK_INTERVAL: HEALTH_CHECK_INTERVAL_SECONDS * SECONDS_TO_MS, // 30 seconds
    METRICS_COLLECTION_INTERVAL: METRICS_COLLECTION_INTERVAL_SECONDS * SECONDS_TO_MS, // 1 minute
    ALERT_THRESHOLD,
    RECOVERY_THRESHOLD,
  },
} as const;

// Type definitions for better type safety
export type CacheSize = typeof AI_OPTIMIZER_CONSTANTS.CACHE_SIZES;
export type PerformanceThreshold = typeof AI_OPTIMIZER_CONSTANTS.PERFORMANCE_THRESHOLDS;
export type MLParameter = typeof AI_OPTIMIZER_CONSTANTS.ML_PARAMETERS;
export type MemoryLimit = typeof AI_OPTIMIZER_CONSTANTS.MEMORY_LIMITS;
export type BatchProcessingConfig = typeof AI_OPTIMIZER_CONSTANTS.BATCH_PROCESSING;
export type AnalyticsConfig = typeof AI_OPTIMIZER_CONSTANTS.ANALYTICS;
export type NetworkConfig = typeof AI_OPTIMIZER_CONSTANTS.NETWORK;
export type DataCollectionConfig = typeof AI_OPTIMIZER_CONSTANTS.DATA_COLLECTION;
export type OptimizationWeight = typeof AI_OPTIMIZER_CONSTANTS.OPTIMIZATION_WEIGHTS;
export type SimilarityThreshold = typeof AI_OPTIMIZER_CONSTANTS.SIMILARITY_THRESHOLDS;
export type ErrorHandlingConfig = typeof AI_OPTIMIZER_CONSTANTS.ERROR_HANDLING;
export type StorageConfig = typeof AI_OPTIMIZER_CONSTANTS.STORAGE;
export type TimeConstant = typeof AI_OPTIMIZER_CONSTANTS.TIME;
export type MathConstant = typeof AI_OPTIMIZER_CONSTANTS.MATH;
export type FeatureEngineeringConfig = typeof AI_OPTIMIZER_CONSTANTS.FEATURE_ENGINEERING;
export type ModelEvaluationConfig = typeof AI_OPTIMIZER_CONSTANTS.MODEL_EVALUATION;
export type StreamingConfig = typeof AI_OPTIMIZER_CONSTANTS.STREAMING;
export type SecurityConfig = typeof AI_OPTIMIZER_CONSTANTS.SECURITY;
export type MonitoringConfig = typeof AI_OPTIMIZER_CONSTANTS.MONITORING;

// Additional type definitions
export interface AIModelConfig {
  modelType: string;
  parameters: Record<string, unknown>;
  trainingData: unknown[];
  validationData: unknown[];
}

// Common type definitions to replace 'any' types
export interface PerformanceData {
  timestamp: number;
  value: number;
  context?: Record<string, unknown>;
}

export interface OptimizationContext {
  config: Record<string, unknown>;
  usageData: Record<string, unknown>;
  performance: PerformanceData[];
}

export interface ModelPrediction {
  value: number;
  confidence: number;
  features: number[];
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

export interface CacheEntry {
  value: unknown;
  timestamp: number;
  size: number;
  compressed?: boolean;
}

export interface MemoryStats {
  used: number;
  total: number;
  available: number;
  percentage: number;
}

export interface StreamingMessage {
  id: string;
  type: string;
  data: unknown;
  timestamp: number;
}

export interface BatchOperation<T> {
  (): Promise<T>;
}

export interface FeatureImportance {
  feature: string;
  importance: number;
}

export interface ModelPerformanceMetrics {
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  auc: number;
  mse: number;
  mae: number;
  r2Score: number;
  confidence: number;
  predictionTime: number;
  lastUpdated: number;
  dataSize?: number;
}

export interface ABTestResult {
  experimentId: string;
  variant: string;
  metrics: Record<string, number>;
  timestamp: number;
}

export interface ABTestAnalysis {
  experimentId: string;
  status: 'running' | 'completed' | 'paused';
  variants: Array<{
    name: string;
    participants: number;
    conversionRate: number;
    confidence: number;
  }>;
  statisticalSignificance: number;
  recommendedVariant?: string;
}

export interface PowerAnalysisResult {
  requiredSampleSize: number;
  currentPower: number;
  effectSize: number;
  alpha: number;
  beta: number;
}

export interface ABTestingStats {
  totalExperiments: number;
  activeExperiments: number;
  completedExperiments: number;
  averageConversionRate: number;
  totalParticipants: number;
}

export interface StreamingStatus {
  connected: boolean;
  lastHeartbeat: number;
  messageCount: number;
  errorCount: number;
  latency: number;
}

export interface StreamingMetrics {
  messagesPerSecond: number;
  averageLatency: number;
  errorRate: number;
  throughput: number;
  memoryUsage: number;
}