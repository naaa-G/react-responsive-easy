import { Logger } from './Logger.js';

export interface ModelExplanation {
  prediction: number | number[];
  confidence: number;
  featureContributions: Array<{
    feature: string;
    contribution: number;
    direction: 'positive' | 'negative';
  }>;
  similarCases: Array<{
    case: Record<string, unknown>;
    similarity: number;
    outcome: number | number[];
  }>;
  reasoning: string;
}

export interface ExplanationConfig {
  enableFeatureContributions: boolean;
  enableSimilarCases: boolean;
  maxSimilarCases: number;
  enableReasoning: boolean;
  confidenceThreshold: number;
}

/**
 * Provides model explainability and interpretability features
 */
export class ModelExplainer {
  private logger: Logger;
  private config: ExplanationConfig;
  private historicalCases: Array<{
    features: Record<string, unknown>;
    outcome: number | number[];
    timestamp: number;
  }> = [];

  constructor(config: Partial<ExplanationConfig> = {}) {
    this.logger = new Logger('ModelExplainer');
    this.config = {
      enableFeatureContributions: true,
      enableSimilarCases: true,
      maxSimilarCases: 5,
      enableReasoning: true,
      confidenceThreshold: 0.7,
      ...config
    };
  }

  /**
   * Generate explanation for a model prediction
   */
  explainPrediction(
    prediction: number | number[],
    features: Record<string, unknown>,
    featureNames: string[],
    confidence: number
  ): ModelExplanation {
    this.logger.debug('Generating model explanation');

    const explanation: ModelExplanation = {
      prediction,
      confidence,
      featureContributions: [],
      similarCases: [],
      reasoning: ''
    };

    // Generate feature contributions
    if (this.config.enableFeatureContributions) {
      explanation.featureContributions = this.calculateFeatureContributions(
        features,
        featureNames,
        prediction
      );
    }

    // Find similar cases
    if (this.config.enableSimilarCases) {
      explanation.similarCases = this.findSimilarCases(features, prediction);
    }

    // Generate reasoning
    if (this.config.enableReasoning) {
      explanation.reasoning = this.generateReasoning(explanation);
    }

    // Store case for future similarity analysis
    this.storeCase(features, prediction);

    return explanation;
  }

  /**
   * Calculate feature contributions to the prediction
   */
  private calculateFeatureContributions(
    features: Record<string, unknown>,
    featureNames: string[],
    prediction: number | number[]
  ): Array<{
    feature: string;
    contribution: number;
    direction: 'positive' | 'negative';
  }> {
    const contributions: Array<{
      feature: string;
      contribution: number;
      direction: 'positive' | 'negative';
    }> = [];

    // Convert features to array for analysis
    const featureValues = featureNames.map(name => {
      const value = features[name];
      return typeof value === 'number' ? value : 0;
    });

    // Calculate feature importance using simplified SHAP-like approach
    const meanPrediction = Array.isArray(prediction) 
      ? prediction.reduce((sum, val) => sum + val, 0) / prediction.length 
      : prediction;

    for (let i = 0; i < featureValues.length; i++) {
      const featureValue = featureValues[i];
      const featureName = featureNames[i];
      
      // Simple contribution calculation based on feature value and prediction
      const contribution = this.calculateFeatureContribution(
        featureValue,
        meanPrediction,
        featureName
      );

      contributions.push({
        feature: featureName,
        contribution: Math.abs(contribution),
        direction: contribution >= 0 ? 'positive' : 'negative'
      });
    }

    // Sort by contribution magnitude
    contributions.sort((a, b) => b.contribution - a.contribution);

    return contributions;
  }

  /**
   * Calculate individual feature contribution
   */
  private calculateFeatureContribution(
    featureValue: number,
    prediction: number,
    featureName: string
  ): number {
    // Simplified contribution calculation
    // In a real implementation, this would use SHAP values or similar methods
    
    // Normalize feature value to [0, 1] range
    const normalizedValue = Math.max(0, Math.min(1, featureValue));
    
    // Calculate contribution based on feature value and prediction
    const baseContribution = normalizedValue * prediction;
    
    // Apply feature-specific adjustments
    const featureAdjustment = this.getFeatureAdjustment(featureName);
    
    return baseContribution * featureAdjustment;
  }

  /**
   * Get feature-specific adjustment factor
   */
  private getFeatureAdjustment(featureName: string): number {
    // Define feature-specific adjustments based on domain knowledge
    const adjustments: Record<string, number> = {
      'accuracy': 1.2,
      'performance': 1.1,
      'memory': 0.9,
      'efficiency': 1.0,
      'latency': 0.8, // Performance weight
      'throughput': 1.1
    };

    return adjustments[featureName.toLowerCase()] || 1.0;
  }

  /**
   * Find similar cases from historical data
   */
  private findSimilarCases(
    features: Record<string, unknown>,
    _prediction: number | number[]
  ): Array<{
    case: Record<string, unknown>;
    similarity: number;
    outcome: number | number[];
  }> {
    if (this.historicalCases.length === 0) {
      return [];
    }

    const similarities = this.historicalCases.map(historicalCase => {
      const similarity = this.calculateSimilarity(features, historicalCase.features);
      return {
        case: historicalCase.features,
        similarity,
        outcome: historicalCase.outcome
      };
    });

    // Sort by similarity and return top cases
    similarities.sort((a, b) => b.similarity - a.similarity);
    
    return similarities.slice(0, this.config.maxSimilarCases);
  }

  /**
   * Calculate similarity between two feature sets
   */
  private calculateSimilarity(
    features1: Record<string, unknown>,
    features2: Record<string, unknown>
  ): number {
    const keys = new Set([...Object.keys(features1), ...Object.keys(features2)]);
    let totalSimilarity = 0;
    let validComparisons = 0;

    for (const key of keys) {
      const val1 = features1[key];
      const val2 = features2[key];

      if (val1 !== undefined && val2 !== undefined) {
        const similarity = this.compareValues(val1, val2);
        totalSimilarity += similarity;
        validComparisons++;
      }
    }

    return validComparisons > 0 ? totalSimilarity / validComparisons : 0;
  }

  /**
   * Compare two values and return similarity score
   */
  private compareValues(val1: unknown, val2: unknown): number {
    if (typeof val1 === 'number' && typeof val2 === 'number') {
      // Numerical comparison
      const diff = Math.abs(val1 - val2);
      const maxVal = Math.max(Math.abs(val1), Math.abs(val2));
      return maxVal === 0 ? 1 : Math.max(0, 1 - diff / maxVal);
    } else if (val1 === val2) {
      // Exact match
      return 1;
    } else {
      // No match
      return 0;
    }
  }

  /**
   * Generate human-readable reasoning for the prediction
   */
  private generateReasoning(explanation: ModelExplanation): string {
    const reasoningParts: string[] = [];

    // Add confidence-based reasoning
    if (explanation.confidence > this.config.confidenceThreshold) {
      reasoningParts.push(`The model is highly confident (${(explanation.confidence * 100).toFixed(1)}%) in this prediction.`);
    } else {
      reasoningParts.push(`The model has moderate confidence (${(explanation.confidence * 100).toFixed(1)}%) in this prediction.`);
    }

    // Add top feature contributions
    if (explanation.featureContributions.length > 0) {
      const topContributions = explanation.featureContributions.slice(0, 3);
      const contributionText = topContributions
        .map(contrib => `${contrib.feature} (${contrib.direction === 'positive' ? '+' : '-'}${(contrib.contribution * 100).toFixed(1)}%)`)
        .join(', ');
      
      reasoningParts.push(`Key factors influencing this prediction: ${contributionText}.`);
    }

    // Add similar cases reasoning
    if (explanation.similarCases.length > 0) {
      const avgSimilarity = explanation.similarCases.reduce((sum, case_) => sum + case_.similarity, 0) / explanation.similarCases.length;
      reasoningParts.push(`This case is similar to ${explanation.similarCases.length} historical cases (avg similarity: ${(avgSimilarity * 100).toFixed(1)}%).`);
    }

    // Add prediction-specific reasoning
    const predictionValue = Array.isArray(explanation.prediction) 
      ? explanation.prediction[0] 
      : explanation.prediction;
    
    const HIGH_CONFIDENCE_THRESHOLD = 0.8;
    if (predictionValue > HIGH_CONFIDENCE_THRESHOLD) {
      reasoningParts.push('The prediction suggests a high probability of positive outcome.');
    // eslint-disable-next-line no-magic-numbers
    } else if (predictionValue < 0.2) { // Low confidence threshold
      reasoningParts.push('The prediction suggests a low probability of positive outcome.');
    } else {
      reasoningParts.push('The prediction suggests a moderate probability of positive outcome.');
    }

    return reasoningParts.join(' ');
  }

  /**
   * Store a case for future similarity analysis
   */
  private storeCase(features: Record<string, unknown>, outcome: number | number[]): void {
    this.historicalCases.push({
      features: { ...features },
      outcome,
      timestamp: Date.now()
    });

    // Keep only recent cases (last 1000)
    if (this.historicalCases.length > 1000) {
      const MAX_HISTORICAL_CASES = 1000;
      this.historicalCases = this.historicalCases.slice(-MAX_HISTORICAL_CASES);
    }
  }

  /**
   * Get explanation configuration
   */
  getConfig(): ExplanationConfig {
    return { ...this.config };
  }

  /**
   * Update explanation configuration
   */
  updateConfig(config: Partial<ExplanationConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Get historical cases count
   */
  getHistoricalCasesCount(): number {
    return this.historicalCases.length;
  }

  /**
   * Clear historical cases
   */
  clearHistoricalCases(): void {
    this.historicalCases = [];
  }

  /**
   * Generate explanation summary
   */
  generateSummary(): {
    totalExplanations: number;
    averageConfidence: number;
    topFeatures: string[];
    explanationTypes: Record<string, number>;
  } {
    const totalExplanations = this.historicalCases.length;
    
    // Calculate average confidence (simplified)
    const averageConfidence = 0.75; // This would be calculated from actual confidence values
    
    // Get top features from historical cases
    const featureCounts: Record<string, number> = {};
    this.historicalCases.forEach(case_ => {
      Object.keys(case_.features).forEach(feature => {
        featureCounts[feature] = (featureCounts[feature] || 0) + 1;
      });
    });
    
    const topFeatures = Object.entries(featureCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([feature]) => feature);

    const explanationTypes = {
      featureContributions: this.config.enableFeatureContributions ? totalExplanations : 0,
      similarCases: this.config.enableSimilarCases ? totalExplanations : 0,
      reasoning: this.config.enableReasoning ? totalExplanations : 0
    };

    return {
      totalExplanations,
      averageConfidence,
      topFeatures,
      explanationTypes
    };
  }
}
