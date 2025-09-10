import { EventEmitter } from 'events';
import { AI_OPTIMIZER_CONSTANTS, type ModelPerformanceMetrics as BaseModelPerformanceMetrics } from '../constants.js';
import { Logger } from './Logger.js';

export type ModelPerformanceMetrics = BaseModelPerformanceMetrics;

export interface AdaptiveLearningConfig {
  enableOnlineLearning: boolean;
  learningRate: number;
  batchSize: number;
  updateFrequency: number; // in milliseconds
  performanceThreshold: number;
  enableTransferLearning: boolean;
  sourceModelPath?: string;
}

export interface LearningHistoryEntry {
  timestamp: number;
  performance: ModelPerformanceMetrics;
  dataSize: number;
}

/**
 * Manages adaptive learning and online model updates
 */
export class AdaptiveLearningManager extends EventEmitter {
  private adaptiveConfig: AdaptiveLearningConfig;
  private learningHistory: LearningHistoryEntry[] = [];
  private isLearning = false;
  private updateInterval?: ReturnType<typeof setTimeout>;
  private logger: Logger;

  constructor(adaptiveConfig: Partial<AdaptiveLearningConfig> = {}) {
    super();
    this.logger = new Logger('AdaptiveLearningManager');
    
    this.adaptiveConfig = {
      enableOnlineLearning: true,
      learningRate: AI_OPTIMIZER_CONSTANTS.ML_PARAMETERS.LEARNING_RATE,
      batchSize: AI_OPTIMIZER_CONSTANTS.ML_PARAMETERS.BATCH_SIZE,
      updateFrequency: AI_OPTIMIZER_CONSTANTS.TIME.MINUTE,
      performanceThreshold: AI_OPTIMIZER_CONSTANTS.PERFORMANCE_THRESHOLDS.EXCELLENT_THRESHOLD,
      enableTransferLearning: false,
      ...adaptiveConfig
    };

    this.startAdaptiveLearning();
  }

  /**
   * Start adaptive learning process
   */
  private startAdaptiveLearning(): void {
    if (!this.adaptiveConfig.enableOnlineLearning) {
      this.logger.info('Adaptive learning disabled');
      return;
    }

    this.logger.info('Starting adaptive learning process');
    this.isLearning = true;

    this.updateInterval = setInterval(() => {
      this.performAdaptiveUpdate();
    }, this.adaptiveConfig.updateFrequency);
  }

  /**
   * Stop adaptive learning process
   */
  stopAdaptiveLearning(): void {
    this.logger.info('Stopping adaptive learning process');
    this.isLearning = false;

    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = undefined;
    }
  }

  /**
   * Perform adaptive update based on learning history
   */
  private performAdaptiveUpdate(): void {
    if (!this.isLearning || this.learningHistory.length === 0) {
      return;
    }

    try {
      const recentPerformance = this.getRecentPerformance();
      if (!recentPerformance) {
        return;
      }

      // Check if performance has degraded
      if (recentPerformance.accuracy < this.adaptiveConfig.performanceThreshold) {
        this.logger.warn('Performance degradation detected, triggering adaptive update');
        this.emit('performanceDegradation', { performance: recentPerformance });
        
        // Trigger model retraining or adjustment
        this.triggerModelUpdate();
      }

      // Check for learning opportunities
      const learningOpportunity = this.identifyLearningOpportunity();
      if (learningOpportunity) {
        this.logger.info('Learning opportunity identified');
        this.emit('learningOpportunity', learningOpportunity);
      }

    } catch (error) {
      this.logger.error('Adaptive update failed:', error instanceof Error ? error : new Error(String(error)));
    }
  }

  /**
   * Get recent performance metrics
   */
  private getRecentPerformance(): ModelPerformanceMetrics | null {
    if (this.learningHistory.length === 0) {
      return null;
    }

    // Get the most recent performance entry
    const recentEntry = this.learningHistory[this.learningHistory.length - 1];
    return recentEntry.performance;
  }

  /**
   * Identify learning opportunities based on performance trends
   */
  private identifyLearningOpportunity(): {
    type: 'performance_improvement' | 'data_drift' | 'model_staleness';
    confidence: number;
    recommendation: string;
  } | null {
    if (this.learningHistory.length < 3) {
      return null;
    }

    const RECENT_ENTRIES_COUNT = 3;
    const recentEntries = this.learningHistory.slice(-RECENT_ENTRIES_COUNT);
    const performanceTrend = this.calculatePerformanceTrend(recentEntries);

    // Check for performance improvement opportunity
    const LOW_PERFORMANCE_THRESHOLD = 0.1;
    if (performanceTrend.accuracy < LOW_PERFORMANCE_THRESHOLD && performanceTrend.f1Score < LOW_PERFORMANCE_THRESHOLD) {
      return {
        type: 'performance_improvement',
        confidence: 0.8, // Performance threshold for model updates
        recommendation: 'Consider increasing model complexity or training data'
      };
    }

    // Check for data drift
    const dataDriftScore = this.calculateDataDriftScore(recentEntries);
    const DRIFT_THRESHOLD = 0.3;
    if (dataDriftScore > DRIFT_THRESHOLD) {
      return {
        type: 'data_drift',
        confidence: dataDriftScore,
        recommendation: 'Retrain model with recent data to address data drift'
      };
    }

    // Check for model staleness
    const lastUpdate = recentEntries[recentEntries.length - 1].timestamp;
    const timeSinceUpdate = Date.now() - lastUpdate;
    if (timeSinceUpdate > this.adaptiveConfig.updateFrequency * 10) {
      return {
        type: 'model_staleness',
        confidence: 0.9,
        recommendation: 'Model is stale, consider updating with recent data'
      };
    }

    return null;
  }

  /**
   * Calculate performance trend from recent entries
   */
  private calculatePerformanceTrend(entries: LearningHistoryEntry[]): {
    accuracy: number;
    f1Score: number;
    mse: number;
  } {
    if (entries.length < 2) {
      return { accuracy: 0, f1Score: 0, mse: 0 };
    }

    const first = entries[0].performance;
    const last = entries[entries.length - 1].performance;

    return {
      accuracy: last.accuracy - first.accuracy,
      f1Score: last.f1Score - first.f1Score,
      mse: last.mse - first.mse
    };
  }

  /**
   * Calculate data drift score based on performance variance
   */
  private calculateDataDriftScore(entries: LearningHistoryEntry[]): number {
    if (entries.length < 3) {
      return 0;
    }

    const accuracies = entries.map(e => e.performance.accuracy);
    const mean = accuracies.reduce((sum, acc) => sum + acc, 0) / accuracies.length;
    const variance = accuracies.reduce((sum, acc) => sum + Math.pow(acc - mean, 2), 0) / accuracies.length;
    
    return Math.sqrt(variance);
  }

  /**
   * Trigger model update
   */
  private triggerModelUpdate(): void {
    this.logger.info('Triggering model update');
    this.emit('modelUpdateRequired', {
      reason: 'performance_degradation',
      timestamp: Date.now()
    });
  }

  /**
   * Add learning history entry
   */
  addLearningHistory(performance: ModelPerformanceMetrics, dataSize: number): void {
    this.learningHistory.push({
      timestamp: Date.now(),
      performance,
      dataSize
    });

    // Keep only recent history (last 100 entries)
    if (this.learningHistory.length > 100) {
      this.learningHistory = this.learningHistory.slice(-100);
    }

    this.emit('learningHistoryUpdated', {
      entry: this.learningHistory[this.learningHistory.length - 1],
      totalEntries: this.learningHistory.length
    });
  }

  /**
   * Get learning history
   */
  getLearningHistory(): LearningHistoryEntry[] {
    return [...this.learningHistory];
  }

  /**
   * Get adaptive learning configuration
   */
  getAdaptiveConfig(): AdaptiveLearningConfig {
    return { ...this.adaptiveConfig };
  }

  /**
   * Update adaptive learning configuration
   */
  updateAdaptiveConfig(config: Partial<AdaptiveLearningConfig>): void {
    this.adaptiveConfig = { ...this.adaptiveConfig, ...config };
    
    // Restart adaptive learning if configuration changed
    if (config.enableOnlineLearning !== undefined || config.updateFrequency !== undefined) {
      this.stopAdaptiveLearning();
      this.startAdaptiveLearning();
    }
  }

  /**
   * Check if adaptive learning is active
   */
  isAdaptiveLearningActive(): boolean {
    return this.isLearning;
  }

  /**
   * Get learning statistics
   */
  getLearningStatistics(): {
    totalUpdates: number;
    averagePerformance: ModelPerformanceMetrics;
    performanceTrend: 'improving' | 'degrading' | 'stable';
    lastUpdateTime: number;
  } {
    const totalUpdates = this.learningHistory.length;
    const lastUpdateTime = this.learningHistory.length > 0 
      ? this.learningHistory[this.learningHistory.length - 1].timestamp 
      : 0;

    // Calculate average performance
    const averagePerformance: ModelPerformanceMetrics = {
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
    };

    if (this.learningHistory.length > 0) {
      const sum = this.learningHistory.reduce((acc, entry) => ({
        accuracy: acc.accuracy + entry.performance.accuracy,
        precision: acc.precision + entry.performance.precision,
        recall: acc.recall + entry.performance.recall,
        f1Score: acc.f1Score + entry.performance.f1Score,
        auc: acc.auc + entry.performance.auc,
        mse: acc.mse + entry.performance.mse,
        mae: acc.mae + entry.performance.mae,
        r2Score: acc.r2Score + entry.performance.r2Score,
        confidence: acc.confidence + entry.performance.confidence,
        predictionTime: acc.predictionTime + entry.performance.predictionTime,
        lastUpdated: 0
      }), averagePerformance);

      const count = this.learningHistory.length;
      averagePerformance.accuracy = sum.accuracy / count;
      averagePerformance.precision = sum.precision / count;
      averagePerformance.recall = sum.recall / count;
      averagePerformance.f1Score = sum.f1Score / count;
      averagePerformance.auc = sum.auc / count;
      averagePerformance.mse = sum.mse / count;
      averagePerformance.mae = sum.mae / count;
      averagePerformance.r2Score = sum.r2Score / count;
      averagePerformance.confidence = sum.confidence / count;
      averagePerformance.predictionTime = sum.predictionTime / count;
    }

    // Determine performance trend
    let performanceTrend: 'improving' | 'degrading' | 'stable' = 'stable';
    if (this.learningHistory.length >= 3) {
      const RECENT_ENTRIES_COUNT = 3;
    const recentEntries = this.learningHistory.slice(-RECENT_ENTRIES_COUNT);
      const trend = this.calculatePerformanceTrend(recentEntries);
      
      const TREND_THRESHOLD = 0.05;
      if (trend.accuracy > TREND_THRESHOLD && trend.f1Score > TREND_THRESHOLD) {
        performanceTrend = 'improving';
      } else if (trend.accuracy < -TREND_THRESHOLD && trend.f1Score < -TREND_THRESHOLD) {
        performanceTrend = 'degrading';
      }
    }

    return {
      totalUpdates,
      averagePerformance,
      performanceTrend,
      lastUpdateTime
    };
  }

  /**
   * Dispose resources
   */
  dispose(): void {
    this.stopAdaptiveLearning();
    this.learningHistory = [];
  }
}
