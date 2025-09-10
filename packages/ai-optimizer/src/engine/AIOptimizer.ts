import * as tf from '@tensorflow/tfjs';
import { ResponsiveConfig } from '@yaseratiar/react-responsive-easy-core';
import {
  ComponentUsageData,
  OptimizationSuggestions,
  ModelFeatures,
  TrainingData,
  ModelEvaluationMetrics,
  ABTestResult,
  type AIModelConfig
} from '../types/index.js';
import { FeatureExtractor } from './FeatureExtractor.js';
import { ModelTrainer } from './ModelTrainer.js';
import { PredictionEngine } from './PredictionEngine.js';
import { ModelManager } from './ModelManager.js';
import { ValidationManager } from './ValidationManager.js';
import { SuggestionGenerator } from './SuggestionGenerator.js';
import { EnterpriseManager } from './EnterpriseManager.js';
import { ABTestingManager } from './ABTestingManager.js';
import { StreamingManager } from './StreamingManager.js';
import { AdvancedAIManager } from '../utils/AdvancedAI.js';
import { HyperparameterTuner } from '../utils/HyperparameterTuner.js';
import { FeatureEngineer } from '../utils/FeatureEngineer.js';
import { 
  AI_OPTIMIZER_CONSTANTS, 
  FeatureImportance, 
  ModelPerformanceMetrics,
  ABTestAnalysis,
  PowerAnalysisResult,
  ABTestingStats,
  StreamingStatus,
  StreamingMetrics
} from '../constants.js';
import { logger } from '../utils/Logger.js';

/**
 * AI-powered optimization engine for React Responsive Easy
 * 
 * This class uses machine learning to analyze component usage patterns
 * and provide intelligent optimization suggestions for responsive scaling.
 */
export class AIOptimizer {
  private featureExtractor!: FeatureExtractor;
  private modelTrainer!: ModelTrainer;
  private predictionEngine!: PredictionEngine;
  private modelManager!: ModelManager;
  private validationManager!: ValidationManager;
  private suggestionGenerator!: SuggestionGenerator;
  private enterpriseManager!: EnterpriseManager;
  private abTestingManager!: ABTestingManager;
  private streamingManager!: StreamingManager;
  private config!: AIModelConfig;
  private isInitialized = false;
  
  // Advanced AI features
  private advancedAI!: AdvancedAIManager;
  private hyperparameterTuner!: HyperparameterTuner;
  private featureEngineer!: FeatureEngineer;

  constructor(config?: Partial<AIModelConfig>) {
    this.initializeConfig(config);
    this.initializeCoreComponents();
    this.initializeManagers();
    this.initializeAdvancedFeatures();
    this.startMonitoring();
  }

  private initializeConfig(config?: Partial<AIModelConfig>): void {
    this.config = {
      architecture: 'neural-network',
      training: {
        epochs: 100,
        batchSize: 32,
        learningRate: 0.001,
        validationSplit: AI_OPTIMIZER_CONSTANTS.MODEL_EVALUATION.VALIDATION_SPLIT
      },
      features: {
        normalization: 'standard',
        dimensionalityReduction: true,
        featureSelection: true
      },
      persistence: {
        saveFrequency: 10,
        modelVersioning: true,
        backupStrategy: 'local'
      },
      ...config
    };
  }

  private initializeCoreComponents(): void {
    this.featureExtractor = new FeatureExtractor();
    this.modelTrainer = new ModelTrainer(this.config);
    this.predictionEngine = new PredictionEngine();
  }

  private initializeManagers(): void {
    this.modelManager = new ModelManager(this.config);
    this.validationManager = new ValidationManager();
    this.suggestionGenerator = new SuggestionGenerator();
    this.enterpriseManager = new EnterpriseManager();
    this.abTestingManager = new ABTestingManager();
    this.streamingManager = new StreamingManager();
  }

  private initializeAdvancedFeatures(): void {
    this.advancedAI = new AdvancedAIManager(
      {
        models: [
          {
            name: 'neural-network',
            weight: AI_OPTIMIZER_CONSTANTS.OPTIMIZATION_WEIGHTS.PERFORMANCE,
            type: 'neural-network',
            config: { layers: 3, neurons: 128, inputSize: 50 }
          },
          {
            name: 'linear-regression',
            weight: AI_OPTIMIZER_CONSTANTS.OPTIMIZATION_WEIGHTS.MEMORY,
            type: 'linear-regression',
            config: { inputSize: 50, regularization: 0.01 }
          },
          {
            name: 'decision-tree',
            weight: AI_OPTIMIZER_CONSTANTS.OPTIMIZATION_WEIGHTS.ACCURACY,
            type: 'decision-tree',
            config: { inputSize: 50, maxDepth: 10 }
          }
        ],
        votingStrategy: 'weighted',
        confidenceThreshold: AI_OPTIMIZER_CONSTANTS.MODEL_EVALUATION.CONFIDENCE_THRESHOLD,
        enableAdaptiveWeights: true
      },
      {
        enableOnlineLearning: true,
        learningRate: 0.001,
        batchSize: 32,
        updateFrequency: 60000,
        performanceThreshold: AI_OPTIMIZER_CONSTANTS.PERFORMANCE_THRESHOLDS.EXCELLENT_THRESHOLD,
        enableTransferLearning: false
      }
    );

    this.hyperparameterTuner = new HyperparameterTuner();
    this.featureEngineer = new FeatureEngineer();
  }

  private startMonitoring(): void {
    this.enterpriseManager.startMonitoring();
  }

  /**
   * Initialize the AI optimizer with a pre-trained model or create a new one
   */
  async initialize(modelPath?: string): Promise<void> {
    try {
      // Validate configuration before initialization
      this.validationManager.validateConfiguration(this.config);
      
      // Initialize the model using ModelManager
      await this.modelManager.initialize(modelPath);
      
      this.isInitialized = true;
    } catch (error) {
      logger.error('Failed to initialize AI optimizer', error as Error);
      this.isInitialized = false;
      throw new Error(`AI Optimizer initialization failed: ${error}`);
    }
  }


  /**
   * Generate optimization suggestions based on usage data
   */
  async optimizeScaling(
    config: ResponsiveConfig,
    usageData: ComponentUsageData[]
  ): Promise<OptimizationSuggestions> {
    if (!this.isInitialized || !this.modelManager.isInitialized()) {
      throw new Error('AI Optimizer not initialized. Call initialize() first.');
    }

    const startTime = performance.now();
    
    try {
      // Validate input parameters using ValidationManager
      this.validationManager.validateOptimizationInputs(config, usageData);

      logger.info('Starting optimization', { componentCount: usageData.length });
      
      // Use performance optimizer with caching
      const result = await this.enterpriseManager.getPerformanceOptimizer().optimizeWithCaching(
        config,
        usageData,
        async (cfg, data) => {
          return this.enterpriseManager.getMemoryAwareOps().withCleanup(async () => {
            // Extract features from configuration and usage data
            const features = this.featureExtractor.extractFeatures(cfg, data);
            
            // Normalize features for model input
            const normalizedFeatures = this.normalizeFeatures(features);
            
            // Generate predictions using the trained model
            const predictions = await this.predictionEngine.predict(this.modelManager.getModel()!, normalizedFeatures);
            
            // Convert predictions to optimization suggestions using SuggestionGenerator
            const suggestions = await this.suggestionGenerator.generateSuggestions(
              cfg,
              data,
              features,
              predictions as tf.Tensor
            );

            // Clean up tensors
            normalizedFeatures.dispose();
            (predictions as tf.Tensor).dispose();
            
            return suggestions;
          });
        }
      );
      
      const duration = performance.now() - startTime;
      
      // Track analytics
      this.enterpriseManager.getAnalyticsEngine().trackOptimization(config, usageData, result, duration, true);
      
      return result;
    } catch (error) {
      const duration = performance.now() - startTime;
      
      // Track error analytics
      this.enterpriseManager.getAnalyticsEngine().trackError(error as Error, { config, usageData, duration });
      
      logger.error('Optimization generation failed', error as Error);
      throw new Error(`Optimization failed: ${error}`);
    }
  }

  /**
   * Train the model with new data
   */
  async trainModel(trainingData: TrainingData[]): Promise<ModelEvaluationMetrics> {
    this.validationManager.validateModelInitialization(this.modelManager.getModel());
    this.validationManager.validateTrainingData(trainingData);
    
    if (trainingData.length < 2) {
      logger.warn('Insufficient data points for training, returning default metrics');
      return this.getDefaultMetrics();
    }

    return this.performTraining(trainingData);
  }


  private getDefaultMetrics(): ModelEvaluationMetrics {
    return {
      accuracy: 0,
      mse: 0,
      f1Score: 0,
      precision: 0,
      recall: 0,
      confidenceIntervals: {}
    };
  }

  private async performTraining(trainingData: TrainingData[]): Promise<ModelEvaluationMetrics> {
    try {
      logger.info('Starting AI model training');
      
      const metrics = await this.modelTrainer.train(this.modelManager.getModel()!, trainingData);
      
      logger.info('Model training completed', { 
        accuracy: `${(metrics.accuracy * 100).toFixed(2)}%`,
        f1Score: metrics.f1Score.toFixed(3)
      });
      
      return metrics;
    } catch (error) {
      logger.error('Model training failed', error as Error);
      throw new Error(`Training failed: ${error}`);
    }
  }

  /**
   * Evaluate model performance on test data
   */
  evaluateModel(testData: TrainingData[]): Promise<ModelEvaluationMetrics> {
    if (!this.modelManager.isInitialized()) {
      throw new Error('Model not initialized');
    }

    // Validate test data
    this.validationManager.validateTestData(testData);

    // Validate model interface before evaluation
    this.validationManager.validateModelInterface(this.modelManager.getModel()!);

    return this.modelTrainer.evaluate(this.modelManager.getModel()!, testData);
  }

  /**
   * Save the trained model
   */
  async saveModel(path: string): Promise<void> {
    await this.modelManager.saveModel(path);
  }

  /**
   * Get model performance metrics
   */
  getModelInfo(): {
    architecture: string;
    parameters: number;
    layers: number;
    isInitialized: boolean;
  } {
    return this.modelManager.getModelInfo();
  }


  /**
   * Normalize features for model input
   */
  private normalizeFeatures(features: ModelFeatures): tf.Tensor {
    // Convert features to tensor format
    const featureVector = this.featureExtractor.featuresToVector(features);
    
    // Normalize using standard scaling
    const tensor = tf.tensor2d([featureVector]);
    const normalized = tf.layers.batchNormalization().apply(tensor) as tf.Tensor;
    
    return normalized;
  }



  // ==================== ENTERPRISE FEATURES ====================

  /**
   * Get comprehensive performance metrics
   */
  getPerformanceMetrics() {
    return this.enterpriseManager.getPerformanceMetrics();
  }

  /**
   * Get system health status
   */
  getSystemHealth() {
    return this.enterpriseManager.getSystemHealth();
  }

  /**
   * Get analytics report
   */
  getAnalyticsReport() {
    return this.enterpriseManager.getAnalyticsReport();
  }

  /**
   * Export analytics data
   */
  exportAnalytics(): string {
    return this.enterpriseManager.exportAnalytics();
  }

  /**
   * Batch optimize multiple configurations
   */
  async batchOptimize(
    requests: Array<{ config: ResponsiveConfig; usageData: ComponentUsageData[] }>
  ): Promise<OptimizationSuggestions[]> {
    const startTime = performance.now();
    
    try {
      // Validate all requests before processing
      requests.forEach((request, index) => {
        if (!request.config) {
          throw new Error(`Request ${index}: Configuration is required`);
        }
        this.validationManager.validateOptimizationInputs(request.config, request.usageData);
      });
      
      const results = await this.enterpriseManager.getPerformanceOptimizer().batchOptimize(
        requests,
        async (batchRequests) => {
          return Promise.all(
            batchRequests.map(async ({ config, usageData }) => {
              return this.enterpriseManager.getMemoryAwareOps().withCleanup(async () => {
                const features = this.featureExtractor.extractFeatures(config, usageData);
                const normalizedFeatures = this.normalizeFeatures(features);
                const predictions = await this.predictionEngine.predict(this.modelManager.getModel()!, normalizedFeatures);
                const suggestions = await this.suggestionGenerator.generateSuggestions(config, usageData, features, predictions as tf.Tensor);
                
                normalizedFeatures.dispose();
                (predictions as tf.Tensor).dispose();
                
                return suggestions;
              });
            })
          );
        }
      );
      
      const duration = performance.now() - startTime;
      
      // Track batch analytics
      this.enterpriseManager.getAnalyticsEngine().trackOptimization(
        requests[0]?.config || {} as ResponsiveConfig,
        requests.flatMap(r => r.usageData),
        results[0] || {} as OptimizationSuggestions,
        duration,
        true
      );
      
      return results;
    } catch (error) {
      const duration = performance.now() - startTime;
      this.enterpriseManager.getAnalyticsEngine().trackError(error as Error, { requests, duration });
      throw error;
    }
  }

  /**
   * Clear all caches and reset metrics
   */
  clearCache(): void {
    this.enterpriseManager.clearCache();
  }



  /**
   * Get memory statistics
   */
  getMemoryStats() {
    return this.enterpriseManager.getMemoryStats();
  }

  /**
   * Force memory cleanup
   */
  forceMemoryCleanup(): void {
    this.enterpriseManager.forceMemoryCleanup();
  }

  // ==================== ADVANCED ENTERPRISE FEATURES ====================

  /**
   * Get advanced cache statistics
   */
  getCacheStats() {
    return this.enterpriseManager.getCacheStats();
  }

  /**
   * Warm cache with frequently accessed data
   */
  async warmCache(dataProvider: (_key: string) => Promise<unknown>): Promise<void> {
    await this.enterpriseManager.warmCache(dataProvider);
  }

  /**
   * Invalidate cache entries
   */
  invalidateCache(pattern: string | RegExp | string[]): void {
    this.enterpriseManager.invalidateCache(pattern);
  }

  /**
   * Batch optimize multiple configurations with priority
   */
  async batchOptimizeWithPriority(
    requests: Array<{
      config: ResponsiveConfig;
      usageData: ComponentUsageData[];
      priority?: number;
      metadata?: Record<string, unknown>;
    }>
  ): Promise<Map<string, OptimizationSuggestions>> {
    const startTime = performance.now();
    
    try {
      // Validate all requests before processing
      requests.forEach((request, index) => {
        if (!request.config) {
          throw new Error(`Request ${index}: Configuration is required`);
        }
        this.validationManager.validateOptimizationInputs(request.config, request.usageData);
      });
      
      // Use enterprise manager for batch processing
      const results = await this.enterpriseManager.batchOptimizeWithPriority(requests);
      
      const duration = performance.now() - startTime;
      
      // Track batch analytics
      this.enterpriseManager.getAnalyticsEngine().trackOptimization(
        requests[0]?.config || {} as ResponsiveConfig,
        requests.flatMap(r => r.usageData),
        results.values().next().value ?? {} as OptimizationSuggestions,
        duration,
        true
      );

      return results;
    } catch (error) {
      const duration = performance.now() - startTime;
      this.enterpriseManager.getAnalyticsEngine().trackError(error as Error, { requests, duration });
      throw error;
    }
  }

  /**
   * Get batch processing statistics
   */
  getBatchStats() {
    return this.enterpriseManager.getBatchStats();
  }

  /**
   * Get dynamic configuration value
   */
  getConfigValue<T = unknown>(path: string, defaultValue?: T): T {
    return this.enterpriseManager.getConfigValue(path, defaultValue);
  }

  /**
   * Update dynamic configuration
   */
  updateConfig(path: string, value: unknown, source = 'api'): void {
    this.enterpriseManager.updateConfig(path, value, source);
  }

  /**
   * Bulk update configuration
   */
  bulkUpdateConfig(
    updates: Record<string, unknown>, 
    source = 'bulk'
  ): void {
    this.enterpriseManager.bulkUpdateConfig(updates, source);
  }

  /**
   * Get configuration schema
   */
  getConfigSchema() {
    return this.enterpriseManager.getConfigSchema();
  }

  /**
   * Export configuration
   */
  exportConfig(format: 'json' | 'yaml' | 'env' = 'json'): string {
    return this.enterpriseManager.exportConfig(format);
  }

  /**
   * Import configuration
   */
  importConfig(
    configData: string, 
    format: 'json' | 'yaml' | 'env' = 'json'
  ): void {
    this.enterpriseManager.importConfig(configData, format);
  }

  /**
   * Rollback configuration to previous version
   */
  rollbackConfig(version?: string): void {
    this.enterpriseManager.rollbackConfig(version);
  }

  /**
   * Get configuration versions
   */
  getConfigVersions() {
    return this.enterpriseManager.getConfigVersions();
  }

  /**
   * Get comprehensive enterprise metrics
   */
  getEnterpriseMetrics() {
    return this.enterpriseManager.getEnterpriseMetrics();
  }

  /**
   * Optimize system performance
   */
  optimizeSystem(): void {
    this.enterpriseManager.optimizeSystem();
  }

  // Advanced AI Features Methods

  /**
   * Get advanced AI performance metrics
   */
  getAdvancedAIMetrics(): Map<string, unknown> {
    return this.advancedAI.getPerformanceMetrics();
  }

  /**
   * Get feature importance analysis
   */
  getFeatureImportance(): FeatureImportance[] {
    return this.advancedAI.getFeatureImportance();
  }

  /**
   * Get learning history
   */
  getLearningHistory(): Array<{ timestamp: number; metrics: ModelPerformanceMetrics; dataSize: number }> {
    return this.advancedAI.getLearningHistory() as Array<{ timestamp: number; metrics: ModelPerformanceMetrics; dataSize: number }>;
  }

  /**
   * Optimize hyperparameters
   */
  optimizeHyperparameters(
    trainingData: { features: tf.Tensor; labels: tf.Tensor },
    validationData: { features: tf.Tensor; labels: tf.Tensor }
  ): Promise<Map<string, unknown>> {
    return this.hyperparameterTuner.optimize(
      (params) => this.createModelWithParams(new Map(Object.entries(params))),
      trainingData,
      validationData
    );
  }

  /**
   * Transform features using feature engineering
   */
  transformFeatures(features: tf.Tensor, transformations: string[]): tf.Tensor {
    // Convert tensor to array for feature engineering
    const featuresArray = features.arraySync() as number[][];
    
    // Convert string transformations to the expected format
    const transformationObjects = transformations.map(transformation => ({
      feature: 'all',
      transformation,
      parameters: {}
    }));
    
    const transformedArray = this.featureEngineer.transformFeatures(featuresArray, transformationObjects);
    // Convert back to tensor
    return tf.tensor2d(transformedArray);
  }

  /**
   * Create model with specific parameters
   */
  private createModelWithParams(_params: Map<string, unknown>): Promise<unknown> {
    // Mock implementation - in real scenario, create model with given parameters
    return Promise.resolve({});
  }

  // A/B Testing Framework Methods

  /**
   * Create A/B test experiment
   */
  createABTest(config: Omit<Record<string, unknown>, 'id' | 'status'>): string {
    // Convert to ExperimentConfig format
    const experimentConfig = {
      name: config.name as string || 'Untitled Experiment',
      description: config.description as string || 'AI Optimizer A/B Test',
      variants: config.variants as Array<{ id: string; name: string; weight: number; config: Record<string, unknown> }> || [],
      metrics: config.metrics as Array<{ name: string; type: 'conversion' | 'revenue' | 'engagement' | 'performance'; target: 'increase' | 'decrease' | 'neutral'; minimumDetectableEffect: number }> || [],
      trafficAllocation: config.trafficAllocation as number || 100,
      duration: config.duration as number || 7 * 24 * 60 * 60 * 1000, // 7 days
      startDate: config.startDate as Date || new Date(),
      endDate: config.endDate as Date || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      hypothesis: config.hypothesis as string || 'AI optimization will improve performance',
      successCriteria: config.successCriteria as { primaryMetric: string; minimumImprovement: number; confidenceLevel: number } || {
        primaryMetric: 'conversion',
        minimumImprovement: 0.1,
        confidenceLevel: 0.95
      }
    };
    return this.abTestingManager.createABTest(experimentConfig);
  }

  /**
   * Start A/B test experiment
   */
  startABTest(experimentId: string): boolean {
    return this.abTestingManager.startABTest(experimentId);
  }

  /**
   * Stop A/B test experiment
   */
  stopABTest(experimentId: string, reason?: string): boolean {
    return this.abTestingManager.stopABTest(experimentId, reason);
  }

  /**
   * Assign user to A/B test variant
   */
  assignUserToABTest(userId: string, experimentId: string): string | null {
    return this.abTestingManager.assignUserToABTest(userId, experimentId);
  }

  /**
   * Record A/B test result
   */
  recordABTestResult(result: ABTestResult): void {
    this.abTestingManager.recordABTestResult(result);
  }

  /**
   * Get A/B test analysis
   */
  getABTestAnalysis(experimentId: string): ABTestAnalysis {
    return this.abTestingManager.getABTestAnalysis(experimentId);
  }

  /**
   * Perform power analysis for A/B test
   */
  performPowerAnalysis(effectSize: number, alpha?: number, power?: number): PowerAnalysisResult {
    return this.abTestingManager.performPowerAnalysis(effectSize, alpha, power);
  }

  /**
   * Get A/B testing statistics
   */
  getABTestingStats(): ABTestingStats {
    return this.abTestingManager.getABTestingStats();
  }

  // Streaming API Methods

  /**
   * Connect to streaming API
   */
  async connectStreaming(): Promise<void> {
    await this.streamingManager.connectStreaming();
  }

  /**
   * Disconnect from streaming API
   */
  disconnectStreaming(): void {
    this.streamingManager.disconnectStreaming();
  }

  /**
   * Get streaming connection status
   */
  getStreamingStatus(): StreamingStatus {
    return this.streamingManager.getStreamingStatus();
  }

  /**
   * Get streaming performance metrics
   */
  getStreamingMetrics(): StreamingMetrics {
    return this.streamingManager.getStreamingMetrics();
  }

  /**
   * Stream optimization request
   */
  async streamOptimization(
    requestId: string,
    config: ResponsiveConfig,
    usageData: ComponentUsageData[],
    callback: (_result: OptimizationSuggestions) => void
  ): Promise<void> {
    await this.streamingManager.streamOptimization(requestId, config, usageData, callback);
  }

  /**
   * Cancel streaming optimization
   */
  async cancelStreamingOptimization(requestId: string): Promise<void> {
    await this.streamingManager.cancelStreamingOptimization(requestId);
  }

  /**
   * Update streaming configuration
   */
  updateStreamingConfig(config: Partial<Record<string, unknown>>): void {
    this.streamingManager.updateStreamingConfig(config);
  }

  /**
   * Dispose all enterprise resources
   */
  dispose(): void {
    // Dispose managers
    this.modelManager.dispose();
    this.enterpriseManager.dispose();
    this.abTestingManager = new ABTestingManager(); // Reset
    this.streamingManager.dispose();
    
    // Dispose advanced AI resources
    this.advancedAI.dispose();

    this.isInitialized = false;
  }
}
