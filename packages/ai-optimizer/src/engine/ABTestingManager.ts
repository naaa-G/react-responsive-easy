import { ABTestingFramework, ExperimentConfig, ExperimentAnalysis, PowerAnalysis } from '../utils/ABTestingFramework.js';
import { ABTestResult, ABTestAnalysis, PowerAnalysisResult, ABTestingStats } from '../types/index.js';

/**
 * Manages A/B testing features for AI Optimizer
 */
export class ABTestingManager {
  private abTestingFramework: ABTestingFramework;

  constructor() {
    this.abTestingFramework = new ABTestingFramework();
  }

  /**
   * Create A/B test experiment
   */
  createABTest(config: Omit<ExperimentConfig, 'id' | 'status'>): string {
    return this.abTestingFramework.createExperiment(config);
  }

  /**
   * Start A/B test experiment
   */
  startABTest(experimentId: string): boolean {
    return this.abTestingFramework.startExperiment(experimentId);
  }

  /**
   * Stop A/B test experiment
   */
  stopABTest(experimentId: string, reason?: string): boolean {
    return this.abTestingFramework.stopExperiment(experimentId, reason);
  }

  /**
   * Assign user to A/B test variant
   */
  assignUserToABTest(userId: string, experimentId: string): string | null {
    return this.abTestingFramework.assignUserToVariant(userId, experimentId);
  }

  /**
   * Record A/B test result
   */
  recordABTestResult(result: ABTestResult): void {
    this.abTestingFramework.recordResult(result);
  }

  /**
   * Get A/B test analysis
   */
  getABTestAnalysis(experimentId: string): ABTestAnalysis {
    const analysis = this.abTestingFramework.getExperimentAnalysis(experimentId);
    if (!analysis) {
      throw new Error(`No analysis found for experiment ${experimentId}`);
    }
    return this.convertExperimentAnalysisToABTestAnalysis(analysis);
  }

  /**
   * Perform power analysis for A/B test
   */
  performPowerAnalysis(effectSize: number, alpha?: number, power?: number): PowerAnalysisResult {
    const powerAnalysis = this.abTestingFramework.performPowerAnalysis(effectSize, alpha, power);
    return this.convertPowerAnalysisToPowerAnalysisResult(powerAnalysis);
  }

  /**
   * Get A/B testing statistics
   */
  getABTestingStats(): ABTestingStats {
    const stats = this.abTestingFramework.getStatistics();
    return this.convertStatisticsToABTestingStats(stats);
  }

  /**
   * Convert ExperimentAnalysis to ABTestAnalysis
   */
  private convertExperimentAnalysisToABTestAnalysis(analysis: ExperimentAnalysis): ABTestAnalysis {
    const variants = Array.from(analysis.variantResults.entries()).map(([name, result]) => ({
      name,
      participants: result.sampleSize,
      conversionRate: result.conversionRate,
      confidence: result.confidenceInterval[1] - result.confidenceInterval[0]
    }));

    const firstStatisticalTest = Array.from(analysis.statisticalTests.values())[0];
    
    return {
      significance: firstStatisticalTest?.pValue || 0,
      confidence: analysis.confidence,
      powerAnalysis: {
        requiredSampleSize: 0,
        currentSampleSize: variants.reduce((sum, v) => sum + v.participants, 0),
        power: firstStatisticalTest?.power || 0,
        effectSize: analysis.expectedLift,
        alpha: 0.05,
        currentPower: firstStatisticalTest?.power || 0,
        beta: 1 - (firstStatisticalTest?.power || 0)
      },
      winner: variants.find(v => v.conversionRate === Math.max(...variants.map(v => v.conversionRate)))?.name,
      effectSize: analysis.expectedLift,
      pValue: firstStatisticalTest?.pValue || 0,
      experimentId: analysis.experimentId,
      status: 'running',
      variants,
      statisticalSignificance: firstStatisticalTest?.pValue || 0
    };
  }

  /**
   * Convert PowerAnalysis to PowerAnalysisResult
   */
  private convertPowerAnalysisToPowerAnalysisResult(powerAnalysis: PowerAnalysis): PowerAnalysisResult {
    return {
      requiredSampleSize: powerAnalysis.sampleSize,
      currentSampleSize: 0,
      power: powerAnalysis.power,
      effectSize: powerAnalysis.effectSize,
      alpha: powerAnalysis.alpha,
      currentPower: powerAnalysis.power,
      beta: 1 - powerAnalysis.power
    };
  }

  /**
   * Convert framework statistics to ABTestingStats
   */
  private convertStatisticsToABTestingStats(stats: {
    totalExperiments: number;
    activeExperiments: number;
    completedExperiments: number;
    successfulExperiments: number;
  }): ABTestingStats {
    return {
      totalExperiments: stats.totalExperiments,
      activeExperiments: stats.activeExperiments,
      completedExperiments: stats.completedExperiments,
      successRate: stats.totalExperiments > 0 ? stats.successfulExperiments / stats.totalExperiments : 0,
      averageDuration: 0,
      averageConversionRate: 0,
      totalParticipants: 0
    };
  }
}
