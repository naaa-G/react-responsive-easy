/**
 * Advanced AI Features for AI Optimizer
 * 
 * Features:
 * - Model Ensemble with multiple prediction strategies
 * - Adaptive Learning with online model updates
 * - Transfer Learning capabilities
 * - Model Performance Monitoring
 * - Automated Hyperparameter Tuning
 * - Feature Engineering Automation
 * - Model Explainability and Interpretability
 */

import { EventEmitter } from 'events';
import { type ModelPerformanceMetrics as BaseModelPerformanceMetrics } from '../constants';
import { Logger } from './Logger';
import { EnsembleManager, type ModelEnsembleConfig } from './EnsembleManager';
import { AdaptiveLearningManager, type AdaptiveLearningConfig } from './AdaptiveLearningManager';
import { FeatureEngineer, type FeatureImportance } from './FeatureEngineer';
import { ModelExplainer, type ModelExplanation } from './ModelExplainer';
import { PerformanceMonitor } from './PerformanceMonitor';

export type ModelPerformanceMetrics = BaseModelPerformanceMetrics;

/**
 * Advanced AI Features Manager
 */
export class AdvancedAIManager extends EventEmitter {
  private ensembleManager: EnsembleManager;
  private adaptiveLearningManager: AdaptiveLearningManager;
  private featureEngineer: FeatureEngineer;
  private modelExplainer: ModelExplainer;
  private performanceMonitor: PerformanceMonitor;
  private logger: Logger;

  constructor(
    ensembleConfig: Partial<ModelEnsembleConfig> = {},
    adaptiveConfig: Partial<AdaptiveLearningConfig> = {}
  ) {
    super();
    this.logger = new Logger('AdvancedAIManager');
    
    // Initialize component managers
    this.ensembleManager = new EnsembleManager(ensembleConfig);
    this.adaptiveLearningManager = new AdaptiveLearningManager(adaptiveConfig);
    this.featureEngineer = new FeatureEngineer();
    this.modelExplainer = new ModelExplainer();
    this.performanceMonitor = new PerformanceMonitor();

    // Set up event forwarding
    this.setupEventForwarding();
  }

  /**
   * Set up event forwarding between components
   */
  private setupEventForwarding(): void {
    // Forward ensemble manager events
    this.ensembleManager.on('modelTrained', (data) => this.emit('modelTrained', data));
    this.ensembleManager.on('modelTrainingFailed', (data) => this.emit('modelTrainingFailed', data));

    // Forward adaptive learning events
    this.adaptiveLearningManager.on('performanceDegradation', (data) => this.emit('performanceDegradation', data));
    this.adaptiveLearningManager.on('learningOpportunity', (data) => this.emit('learningOpportunity', data));
    this.adaptiveLearningManager.on('learningHistoryUpdated', (data) => this.emit('learningHistoryUpdated', data));

    // Forward performance monitor events
    this.performanceMonitor.on('performanceAlert', (data) => this.emit('performanceAlert', data));
    this.performanceMonitor.on('metricsRecorded', (data) => this.emit('metricsRecorded', data));
  }

  /**
   * Train the ensemble of models
   */
  async trainEnsemble(features: number[][], labels: number[]): Promise<void> {
    this.logger.info('Starting ensemble training');
    
    // Perform feature engineering
    const featureResult = this.featureEngineer.engineerFeatures(features, [], labels);
    
    // Train ensemble with engineered features
    await this.ensembleManager.trainEnsemble(featureResult.features, labels);
    
    // Record performance metrics
    const metrics = this.getEnsembleMetrics();
    this.performanceMonitor.recordMetrics('ensemble', metrics);
    this.adaptiveLearningManager.addLearningHistory(metrics, features.length);
    
    this.emit('ensembleTrained', { featuresCount: features.length, labelsCount: labels.length });
  }

  /**
   * Make predictions using the ensemble
   */
  async predict(features: number[][]): Promise<{
    prediction: number[];
    confidence: number;
    explanation?: ModelExplanation;
  }> {
    this.logger.info('Making ensemble prediction');
    
    // Perform feature engineering
    const featureResult = this.featureEngineer.engineerFeatures(features, []);
    
    // Get ensemble prediction
    const result = await this.ensembleManager.predict(featureResult.features);
    
    // Generate explanation if confidence is high enough
    const CONFIDENCE_THRESHOLD = 0.7;
    let explanation: ModelExplanation | undefined;
    if (result.confidence > CONFIDENCE_THRESHOLD) {
      const featureNames = featureResult.featureNames;
      const featuresObj = featureNames.reduce((obj, name, index) => {
        obj[name] = featureResult.features[0]?.[index] ?? 0;
        return obj;
      }, {} as Record<string, unknown>);
      
      explanation = this.modelExplainer.explainPrediction(
        result.prediction,
        featuresObj,
        featureNames,
        result.confidence
      );
    }
    
    return {
      prediction: result.prediction,
      confidence: result.confidence,
      explanation
    };
  }

  /**
   * Get ensemble performance metrics
   */
  private getEnsembleMetrics(): ModelPerformanceMetrics {
    const allMetrics = this.ensembleManager.getAllModelMetrics();
    const metricsArray = Array.from(allMetrics.values());
    
    if (metricsArray.length === 0) {
      return {
        accuracy: 0,
        precision: 0,
        recall: 0,
        f1Score: 0,
        auc: 0,
        mse: 0,
        mae: 0,
        r2Score: 0,
        confidence: 0,
        predictionTime: 0,
        lastUpdated: Date.now()
      };
    }
    
    // Calculate average metrics
    const avgMetrics = metricsArray.reduce((acc, metrics) => ({
      accuracy: acc.accuracy + metrics.accuracy,
      precision: acc.precision + metrics.precision,
      recall: acc.recall + metrics.recall,
      f1Score: acc.f1Score + metrics.f1Score,
      auc: acc.auc + metrics.auc,
      mse: acc.mse + metrics.mse,
      mae: acc.mae + metrics.mae,
      r2Score: acc.r2Score + metrics.r2Score,
      confidence: acc.confidence + metrics.confidence,
      predictionTime: acc.predictionTime + metrics.predictionTime,
      lastUpdated: 0
    }), {
      accuracy: 0,
      precision: 0,
      recall: 0,
      f1Score: 0,
      auc: 0,
      mse: 0,
      mae: 0,
      r2Score: 0,
      confidence: 0,
      predictionTime: 0,
      lastUpdated: 0
    });
    
    const count = metricsArray.length;
    return {
      accuracy: avgMetrics.accuracy / count,
      precision: avgMetrics.precision / count,
      recall: avgMetrics.recall / count,
      f1Score: avgMetrics.f1Score / count,
      auc: avgMetrics.auc / count,
      mse: avgMetrics.mse / count,
      mae: avgMetrics.mae / count,
      r2Score: avgMetrics.r2Score / count,
      confidence: avgMetrics.confidence / count,
      predictionTime: avgMetrics.predictionTime / count,
      lastUpdated: Date.now()
    };
  }

  /**
   * Get feature importance scores
   */
  getFeatureImportance(): FeatureImportance[] {
    return this.featureEngineer.getFeatureImportance();
  }

  /**
   * Get performance report
   */
  getPerformanceReport(): {
    ensemble: Map<string, ModelPerformanceMetrics>;
    adaptive: {
      totalUpdates: number;
      averagePerformance: ModelPerformanceMetrics;
      performanceTrend: 'improving' | 'degrading' | 'stable';
      lastUpdateTime: number;
    };
    monitoring: {
      totalModels: number;
      totalAlerts: number;
      criticalAlerts: number;
      averageAccuracy: number;
      monitoringActive: boolean;
    };
  } {
    return {
      ensemble: this.ensembleManager.getAllModelMetrics(),
      adaptive: this.adaptiveLearningManager.getLearningStatistics(),
      monitoring: this.performanceMonitor.getStatistics()
    };
  }

  /**
   * Update ensemble configuration
   */
  updateEnsembleConfig(config: Partial<ModelEnsembleConfig>): void {
    this.ensembleManager.updateEnsembleConfig(config);
  }

  /**
   * Update adaptive learning configuration
   */
  updateAdaptiveConfig(config: Partial<AdaptiveLearningConfig>): void {
    this.adaptiveLearningManager.updateAdaptiveConfig(config);
  }

  /**
   * Start performance monitoring
   */
  startMonitoring(): void {
    this.performanceMonitor.startMonitoring();
  }

  /**
   * Stop performance monitoring
   */
  stopMonitoring(): void {
    this.performanceMonitor.stopMonitoring();
  }

  /**
   * Get performance metrics
   */
  getPerformanceMetrics(): Map<string, unknown> {
    return this.performanceMonitor.getPerformanceMetrics();
  }

  /**
   * Get learning history
   */
  getLearningHistory(): unknown[] {
    return this.adaptiveLearningManager.getLearningHistory();
  }

  /**
   * Dispose all resources
   */
  dispose(): void {
    this.ensembleManager.dispose();
    this.adaptiveLearningManager.dispose();
    this.performanceMonitor.dispose();
    this.featureEngineer.reset();
    this.modelExplainer.clearHistoricalCases();
  }
}