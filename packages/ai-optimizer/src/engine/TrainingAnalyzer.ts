
// Training constants
const TRAINING_CONSTANTS = {
  OVERFITTING_THRESHOLD: 1.5,
  LEARNING_RATE_FACTOR: 1.2,
  NEGATIVE_THRESHOLD_1: -5,
  NEGATIVE_THRESHOLD_2: -10,
  SMALL_VALUE: 0.01,
  MEDIUM_THRESHOLD: 0.5,
  MEMORY_FACTOR: 0.3
} as const;

/**
 * Analyzes training history and provides insights for model improvement
 */
export class TrainingAnalyzer {
  /**
   * Analyze training history for insights and optimization opportunities
   * Provides actionable feedback for model improvement
   */
  public analyzeTrainingHistory(history: {
    loss: number[];
    val_loss?: number[];
    accuracy?: number[];
    val_accuracy?: number[];
  }): {
    overfitting: boolean;
    underfitting: boolean;
    convergence: boolean;
    recommendations: string[];
    learningCurve: 'stable' | 'unstable' | 'oscillating' | 'plateauing';
  } {
    const recommendations: string[] = [];
    let overfitting = false;
    let underfitting = false;
    let convergence = false;
    let learningCurve: 'stable' | 'unstable' | 'oscillating' | 'plateauing' = 'stable';

    overfitting = this.checkOverfitting(history, recommendations);
    underfitting = this.checkUnderfitting(history, recommendations);
    convergence = this.checkConvergence(history, recommendations);
    learningCurve = this.analyzeLearningCurve(history, recommendations);

    return {
      overfitting,
      underfitting,
      convergence,
      recommendations,
      learningCurve
    };
  }

  /**
   * Check for overfitting in training history
   */
  private checkOverfitting(history: Record<string, number[]>, recommendations: string[]): boolean {
    if (history.val_loss && history.loss) {
      const lastValLoss = history.val_loss[history.val_loss.length - 1];
      const lastTrainLoss = history.loss[history.loss.length - 1];
      
      if (lastValLoss > lastTrainLoss * TRAINING_CONSTANTS.LEARNING_RATE_FACTOR) {
        recommendations.push('Consider adding dropout layers or regularization');
        recommendations.push('Reduce model complexity or increase training data');
        return true;
      }
    }
    return false;
  }

  /**
   * Check for underfitting in training history
   */
  private checkUnderfitting(history: Record<string, number[]>, recommendations: string[]): boolean {
    if (history.loss.length > 10) {
      const earlyLoss = history.loss[5];
      const lateLoss = history.loss[history.loss.length - 1];
      
      if (lateLoss > earlyLoss * 0.9) {
        recommendations.push('Increase model capacity or training time');
        recommendations.push('Check if learning rate is too low');
        return true;
      }
    }
    return false;
  }

  /**
   * Check for convergence in training history
   */
  private checkConvergence(history: Record<string, number[]>, recommendations: string[]): boolean {
    if (history.loss.length > 5) {
      const recentLosses = history.loss.slice(TRAINING_CONSTANTS.NEGATIVE_THRESHOLD_1);
      const lossVariance = this.calculateVariance(recentLosses);
      const meanLoss = this.calculateMean(recentLosses);
      
      if (lossVariance < meanLoss * TRAINING_CONSTANTS.SMALL_VALUE) {
        recommendations.push('Model has converged, consider early stopping');
        return true;
      }
    }
    return false;
  }

  /**
   * Analyze learning curve stability
   */
  private analyzeLearningCurve(history: Record<string, number[]>, recommendations: string[]): 'stable' | 'unstable' | 'oscillating' | 'plateauing' {
    if (history.loss.length > 10) {
      const recentLosses = history.loss.slice(TRAINING_CONSTANTS.NEGATIVE_THRESHOLD_2);
      const lossVariance = this.calculateVariance(recentLosses);
      const meanLoss = this.calculateMean(recentLosses);
      
      if (lossVariance > meanLoss * TRAINING_CONSTANTS.MEDIUM_THRESHOLD) {
        recommendations.push('Learning rate may be too high, consider reducing it');
        return 'unstable';
      } else if (lossVariance < meanLoss * TRAINING_CONSTANTS.SMALL_VALUE) {
        recommendations.push('Learning rate may be too low, consider increasing it');
        return 'plateauing';
      } else if (this.hasOscillations(recentLosses)) {
        recommendations.push('Consider using learning rate scheduling');
        return 'oscillating';
      }
    }
    return 'stable';
  }

  /**
   * Calculate mean of an array of numbers
   * Utility method for statistical calculations
   */
  private calculateMean(values: number[]): number {
    if (values.length === 0) return 0;
    return values.reduce((sum, val) => sum + val, 0) / values.length;
  }

  /**
   * Calculate variance of an array of numbers
   * Utility method for statistical calculations
   */
  private calculateVariance(values: number[]): number {
    if (values.length === 0) return 0;
    
    const mean = this.calculateMean(values);
    const squaredDiffs = values.map(val => Math.pow(val - mean, 2));
    
    return this.calculateMean(squaredDiffs);
  }

  /**
   * Check if loss values are oscillating
   * Utility method for learning curve analysis
   */
  private hasOscillations(values: number[]): boolean {
    if (values.length < 3) return false;
    
    let oscillations = 0;
    for (let i = 1; i < values.length - 1; i++) {
      if ((values[i] > values[i - 1] && values[i] > values[i + 1]) ||
          (values[i] < values[i - 1] && values[i] < values[i + 1])) {
        oscillations++;
      }
    }
    
    return oscillations > values.length * TRAINING_CONSTANTS.MEMORY_FACTOR; // More than 30% oscillations
  }
}
