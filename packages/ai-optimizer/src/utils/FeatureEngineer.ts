// import { AI_OPTIMIZER_CONSTANTS } from '../constants.js';
import { Logger } from './Logger.js';

export interface FeatureImportance {
  feature: string;
  importance: number;
  type: 'numerical' | 'categorical' | 'temporal';
  correlation: number;
}

export interface FeatureEngineeringResult {
  features: number[][];
  featureNames: string[];
  featureImportance: FeatureImportance[];
  transformations: Array<{
    feature: string;
    transformation: string;
    parameters: Record<string, unknown>;
  }>;
}

/**
 * Handles automated feature engineering and feature importance analysis
 */
export class FeatureEngineer {
  private logger: Logger;
  private featureImportance: FeatureImportance[] = [];

  constructor() {
    this.logger = new Logger('FeatureEngineer');
  }

  /**
   * Perform automated feature engineering
   */
  engineerFeatures(
    rawFeatures: number[][],
    featureNames: string[],
    target?: number[]
  ): FeatureEngineeringResult {
    this.logger.info('Starting automated feature engineering');
    
    const transformations: Array<{
      feature: string;
      transformation: string;
      parameters: Record<string, unknown>;
    }> = [];

    // Apply feature transformations
    const engineeredFeatures = this.applyFeatureTransformations(
      rawFeatures, 
      featureNames, 
      transformations
    );

    // Calculate feature importance if target is provided
    if (target) {
      this.featureImportance = this.calculateFeatureImportance(
        engineeredFeatures, 
        featureNames, 
        target
      );
    }

    // Select most important features
    const selectedFeatures = this.selectImportantFeatures(
      engineeredFeatures, 
      featureNames, 
      this.featureImportance
    );

    this.logger.info(`Feature engineering completed. Selected ${selectedFeatures.features.length} features from ${rawFeatures.length} original features`);

    return {
      features: selectedFeatures.features,
      featureNames: selectedFeatures.featureNames,
      featureImportance: this.featureImportance,
      transformations
    };
  }

  /**
   * Apply various feature transformations
   */
  private applyFeatureTransformations(
    features: number[][],
    featureNames: string[],
    transformations: Array<{
      feature: string;
      transformation: string;
      parameters: Record<string, unknown>;
    }>
  ): number[][] {
    const engineeredFeatures: number[][] = [];
    const numFeatures = features[0]?.length ?? 0;

    for (let i = 0; i < features.length; i++) {
      const row = features[i];
      const engineeredRow: number[] = [];

      // Original features
      engineeredRow.push(...row);

      // Polynomial features (degree 2)
      for (let j = 0; j < numFeatures; j++) {
        for (let k = j; k < numFeatures; k++) {
          const polyFeature = row[j] * row[k];
          engineeredRow.push(polyFeature);
          
          if (i === 0) { // Only add transformation info once
            transformations.push({
              feature: `${featureNames[j]}_x_${featureNames[k]}`,
              transformation: 'polynomial',
              parameters: { degree: 2, features: [j, k] }
            });
          }
        }
      }

      // Statistical features
      const mean = row.reduce((sum, val) => sum + val, 0) / row.length;
      const variance = row.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / row.length;
      const stdDev = Math.sqrt(variance);
      
      engineeredRow.push(mean, variance, stdDev);
      
      if (i === 0) { // Only add transformation info once
        transformations.push(
          {
            feature: 'mean',
            transformation: 'statistical',
            parameters: { operation: 'mean' }
          },
          {
            feature: 'variance',
            transformation: 'statistical',
            parameters: { operation: 'variance' }
          },
          {
            feature: 'std_dev',
            transformation: 'statistical',
            parameters: { operation: 'std_dev' }
          }
        );
      }

      // Normalized features
      const normalizedRow = this.normalizeFeatures(row);
      engineeredRow.push(...normalizedRow);
      
      if (i === 0) { // Only add transformation info once
        for (let j = 0; j < normalizedRow.length; j++) {
          transformations.push({
            feature: `${featureNames[j]}_normalized`,
            transformation: 'normalization',
            parameters: { method: 'min_max' }
          });
        }
      }

      engineeredFeatures.push(engineeredRow);
    }

    return engineeredFeatures;
  }

  /**
   * Normalize features using min-max scaling
   */
  private normalizeFeatures(features: number[]): number[] {
    const min = Math.min(...features);
    const max = Math.max(...features);
    const range = max - min;
    
    if (range === 0) {
      const DEFAULT_CONSTANT_VALUE = 0.5;
      return features.map(() => DEFAULT_CONSTANT_VALUE); // Default value for constant features
    }
    
    return features.map(value => (value - min) / range);
  }

  /**
   * Calculate feature importance using correlation analysis
   */
  private calculateFeatureImportance(
    features: number[][],
    featureNames: string[],
    target: number[]
  ): FeatureImportance[] {
    const importance: FeatureImportance[] = [];
    const numFeatures = features[0]?.length ?? 0;

    for (let i = 0; i < numFeatures; i++) {
      const featureValues = features.map(row => row[i]);
      const correlation = this.calculateCorrelation(featureValues, target);
      
      // Determine feature type based on correlation and variance
      const variance = this.calculateVariance(featureValues);
      const type = this.determineFeatureType(featureValues, variance);
      
      importance.push({
        feature: featureNames[i] || `feature_${i}`,
        importance: Math.abs(correlation),
        type,
        correlation
      });
    }

    // Sort by importance
    importance.sort((a, b) => b.importance - a.importance);

    return importance;
  }

  /**
   * Calculate correlation coefficient between two arrays
   */
  private calculateCorrelation(x: number[], y: number[]): number {
    if (x.length !== y.length || x.length === 0) {
      return 0;
    }

    const n = x.length;
    const sumX = x.reduce((sum, val) => sum + val, 0);
    const sumY = y.reduce((sum, val) => sum + val, 0);
    const sumXY = x.reduce((sum, val, i) => sum + val * y[i], 0);
    const sumX2 = x.reduce((sum, val) => sum + val * val, 0);
    const sumY2 = y.reduce((sum, val) => sum + val * val, 0);

    const numerator = n * sumXY - sumX * sumY;
    const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));

    return denominator === 0 ? 0 : numerator / denominator;
  }

  /**
   * Calculate variance of an array
   */
  private calculateVariance(values: number[]): number {
    if (values.length === 0) return 0;
    
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
    
    return variance;
  }

  /**
   * Determine feature type based on values and variance
   */
  private determineFeatureType(values: number[], variance: number): 'numerical' | 'categorical' | 'temporal' {
    // Check if values are mostly integers (categorical)
    const integerCount = values.filter(val => Number.isInteger(val)).length;
    const integerRatio = integerCount / values.length;
    
    const INTEGER_THRESHOLD = 0.8;
    if (integerRatio > INTEGER_THRESHOLD && variance < 1) {
      return 'categorical';
    }
    
    // Check if values have temporal patterns (simplified check)
    const isIncreasing = values.every((val, i) => i === 0 || val >= values[i - 1]);
    const isDecreasing = values.every((val, i) => i === 0 || val <= values[i - 1]);
    
    if (isIncreasing || isDecreasing) {
      return 'temporal';
    }
    
    return 'numerical';
  }

  /**
   * Select most important features based on importance scores
   */
  private selectImportantFeatures(
    features: number[][],
    featureNames: string[],
    featureImportance: FeatureImportance[]
  ): {
    features: number[][];
    featureNames: string[];
  } {
    // Select top 80% of features or minimum 10 features
    const numFeaturesToSelect = Math.max(
      10,
      // eslint-disable-next-line no-magic-numbers
      Math.floor(featureImportance.length * 0.8) // Keep top 80% of features
    );

    const selectedIndices = featureImportance
      .slice(0, numFeaturesToSelect)
      .map(fi => featureNames.indexOf(fi.feature))
      .filter(index => index !== -1);

    const selectedFeatures = features.map(row => 
      selectedIndices.map(index => row[index])
    );

    const selectedFeatureNames = selectedIndices.map(index => featureNames[index]);

    return {
      features: selectedFeatures,
      featureNames: selectedFeatureNames
    };
  }

  /**
   * Get feature importance scores
   */
  getFeatureImportance(): FeatureImportance[] {
    return [...this.featureImportance];
  }

  /**
   * Generate feature engineering report
   */
  generateReport(): {
    totalFeatures: number;
    selectedFeatures: number;
    topFeatures: FeatureImportance[];
    featureTypes: Record<string, number>;
  } {
    const totalFeatures = this.featureImportance.length;
    const IMPORTANCE_THRESHOLD = 0.1;
    const selectedFeatures = this.featureImportance.filter(fi => fi.importance > IMPORTANCE_THRESHOLD).length;
    const topFeatures = this.featureImportance.slice(0, 10);
    
    const featureTypes = this.featureImportance.reduce((acc, fi) => {
      acc[fi.type] = (acc[fi.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalFeatures,
      selectedFeatures,
      topFeatures,
      featureTypes
    };
  }

  /**
   * Transform features using specified transformations
   */
  transformFeatures(
    features: number[][],
    transformations: Array<{
      feature: string;
      transformation: string;
      parameters: Record<string, unknown>;
    }>
  ): number[][] {
    return this.applyFeatureTransformations(features, [], transformations);
  }

  /**
   * Reset feature importance data
   */
  reset(): void {
    this.featureImportance = [];
  }
}
