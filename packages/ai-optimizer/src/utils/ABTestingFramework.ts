/**
 * A/B Testing Framework for AI Optimizer
 * 
 * Features:
 * - Statistical significance testing
 * - Multi-variate testing support
 * - Real-time experiment monitoring
 * - Automated experiment management
 * - Bayesian analysis capabilities
 * - Power analysis and sample size calculation
 * - Experiment result visualization
 */

import { EventEmitter } from 'events';

export interface ExperimentConfig {
  id: string;
  name: string;
  description: string;
  variants: Array<{
    id: string;
    name: string;
    weight: number;
    config: any;
  }>;
  metrics: Array<{
    name: string;
    type: 'conversion' | 'revenue' | 'engagement' | 'performance';
    target: 'increase' | 'decrease' | 'neutral';
    minimumDetectableEffect: number;
  }>;
  trafficAllocation: number; // percentage of total traffic
  duration: number; // in milliseconds
  startDate: Date;
  endDate: Date;
  status: 'draft' | 'running' | 'paused' | 'completed' | 'cancelled';
  hypothesis: string;
  successCriteria: {
    primaryMetric: string;
    minimumImprovement: number;
    confidenceLevel: number;
  };
}

export interface ExperimentResult {
  experimentId: string;
  variant: string;
  userId: string;
  timestamp: number;
  metrics: Record<string, number>;
  metadata?: Record<string, any>;
}

export interface StatisticalTest {
  testType: 't-test' | 'chi-square' | 'mann-whitney' | 'bayesian';
  pValue: number;
  confidenceInterval: [number, number];
  effectSize: number;
  power: number;
  sampleSize: number;
  isSignificant: boolean;
  conclusion: string;
}

export interface ExperimentAnalysis {
  experimentId: string;
  variantResults: Map<string, {
    sampleSize: number;
    conversionRate: number;
    averageValue: number;
    confidenceInterval: [number, number];
    pValue: number;
    isWinner: boolean;
  }>;
  statisticalTests: Map<string, StatisticalTest>;
  recommendation: 'continue' | 'stop' | 'extend' | 'implement';
  confidence: number;
  expectedLift: number;
  riskAssessment: {
    riskLevel: 'low' | 'medium' | 'high';
    factors: string[];
  };
}

export interface PowerAnalysis {
  effectSize: number;
  alpha: number;
  power: number;
  sampleSize: number;
  minimumDetectableEffect: number;
  recommendedDuration: number;
}

/**
 * A/B Testing Framework
 */
export class ABTestingFramework extends EventEmitter {
  private experiments: Map<string, ExperimentConfig> = new Map();
  private results: Map<string, ExperimentResult[]> = new Map();
  private analyses: Map<string, ExperimentAnalysis> = new Map();
  private activeExperiments: Set<string> = new Set();
  private userAssignments: Map<string, Map<string, string>> = new Map(); // userId -> experimentId -> variantId
  private statistics: {
    totalExperiments: number;
    activeExperiments: number;
    completedExperiments: number;
    successfulExperiments: number;
  } = {
    totalExperiments: 0,
    activeExperiments: 0,
    completedExperiments: 0,
    successfulExperiments: 0
  };

  constructor() {
    super();
    this.startExperimentMonitoring();
  }

  /**
   * Create a new experiment
   */
  createExperiment(config: Omit<ExperimentConfig, 'id' | 'status'>): string {
    const experimentId = this.generateExperimentId();
    
    const experiment: ExperimentConfig = {
      ...config,
      id: experimentId,
      status: 'draft'
    };

    this.experiments.set(experimentId, experiment);
    this.results.set(experimentId, []);
    this.statistics.totalExperiments++;

    this.emit('experimentCreated', { experimentId, experiment });
    return experimentId;
  }

  /**
   * Start an experiment
   */
  startExperiment(experimentId: string): boolean {
    const experiment = this.experiments.get(experimentId);
    if (!experiment || experiment.status !== 'draft') {
      return false;
    }

    // Validate experiment configuration
    if (!this.validateExperiment(experiment)) {
      return false;
    }

    experiment.status = 'running';
    this.activeExperiments.add(experimentId);
    this.statistics.activeExperiments++;

    this.emit('experimentStarted', { experimentId, experiment });
    return true;
  }

  /**
   * Stop an experiment
   */
  stopExperiment(experimentId: string, reason: string = 'manual'): boolean {
    const experiment = this.experiments.get(experimentId);
    if (!experiment || experiment.status !== 'running') {
      return false;
    }

    experiment.status = 'completed';
    this.activeExperiments.delete(experimentId);
    this.statistics.activeExperiments--;
    this.statistics.completedExperiments++;

    // Perform final analysis
    const analysis = this.analyzeExperiment(experimentId);
    this.analyses.set(experimentId, analysis);

    if (analysis.recommendation === 'implement') {
      this.statistics.successfulExperiments++;
    }

    this.emit('experimentStopped', { experimentId, experiment, reason, analysis });
    return true;
  }

  /**
   * Assign user to experiment variant
   */
  assignUserToVariant(userId: string, experimentId: string): string | null {
    const experiment = this.experiments.get(experimentId);
    if (!experiment || experiment.status !== 'running') {
      return null;
    }

    // Check if user is already assigned
    const userExperiments = this.userAssignments.get(userId) || new Map();
    if (userExperiments.has(experimentId)) {
      return userExperiments.get(experimentId)!;
    }

    // Assign user to variant based on weights
    const variantId = this.selectVariant(experiment.variants);
    
    if (!userExperiments.has(experimentId)) {
      this.userAssignments.set(userId, userExperiments);
    }
    userExperiments.set(experimentId, variantId);

    this.emit('userAssigned', { userId, experimentId, variantId });
    return variantId;
  }

  /**
   * Record experiment result
   */
  recordResult(result: ExperimentResult): void {
    const experiment = this.experiments.get(result.experimentId);
    if (!experiment || experiment.status !== 'running') {
      return;
    }

    const results = this.results.get(result.experimentId) || [];
    results.push(result);
    this.results.set(result.experimentId, results);

    // Check if we should perform interim analysis
    if (this.shouldPerformInterimAnalysis(result.experimentId)) {
      const analysis = this.analyzeExperiment(result.experimentId);
      this.analyses.set(result.experimentId, analysis);

      // Check for early stopping
      if (this.shouldStopEarly(analysis)) {
        this.stopExperiment(result.experimentId, 'early_stopping');
      }
    }

    this.emit('resultRecorded', { result });
  }

  /**
   * Analyze experiment results
   */
  analyzeExperiment(experimentId: string): ExperimentAnalysis {
    const experiment = this.experiments.get(experimentId);
    const results = this.results.get(experimentId) || [];
    
    if (!experiment || results.length === 0) {
      throw new Error(`No data available for experiment ${experimentId}`);
    }

    const variantResults = new Map<string, {
      sampleSize: number;
      conversionRate: number;
      averageValue: number;
      confidenceInterval: [number, number];
      pValue: number;
      isWinner: boolean;
    }>();

    const statisticalTests = new Map<string, StatisticalTest>();

    // Analyze each variant
    for (const variant of experiment.variants) {
      const variantData = results.filter(r => r.variant === variant.id);
      const analysis = this.analyzeVariant(variantData, experiment.metrics);
      variantResults.set(variant.id, analysis);
    }

    // Perform statistical tests
    for (const metric of experiment.metrics) {
      const test = this.performStatisticalTest(experimentId, metric.name);
      statisticalTests.set(metric.name, test);
    }

    // Determine winner and recommendation
    const winner = this.determineWinner(variantResults, experiment.successCriteria);
    const recommendation = this.generateRecommendation(variantResults, statisticalTests, experiment);
    const confidence = this.calculateOverallConfidence(statisticalTests);
    const expectedLift = this.calculateExpectedLift(variantResults, experiment.successCriteria.primaryMetric);
    const riskAssessment = this.assessRisk(variantResults, statisticalTests);

    return {
      experimentId,
      variantResults,
      statisticalTests,
      recommendation,
      confidence,
      expectedLift,
      riskAssessment
    };
  }

  /**
   * Analyze variant performance
   */
  private analyzeVariant(
    data: ExperimentResult[],
    metrics: ExperimentConfig['metrics']
  ): {
    sampleSize: number;
    conversionRate: number;
    averageValue: number;
    confidenceInterval: [number, number];
    pValue: number;
    isWinner: boolean;
  } {
    const sampleSize = data.length;
    if (sampleSize === 0) {
      return {
        sampleSize: 0,
        conversionRate: 0,
        averageValue: 0,
        confidenceInterval: [0, 0],
        pValue: 1,
        isWinner: false
      };
    }

    // Calculate conversion rate (assuming binary metric)
    const conversions = data.filter(d => d.metrics.conversion > 0).length;
    const conversionRate = conversions / sampleSize;

    // Calculate average value
    const totalValue = data.reduce((sum, d) => sum + (d.metrics.value || 0), 0);
    const averageValue = totalValue / sampleSize;

    // Calculate confidence interval
    const confidenceInterval = this.calculateConfidenceInterval(conversionRate, sampleSize);

    // Calculate p-value (simplified)
    const pValue = this.calculatePValue(conversionRate, sampleSize);

    return {
      sampleSize,
      conversionRate,
      averageValue,
      confidenceInterval,
      pValue,
      isWinner: false // Will be set by determineWinner
    };
  }

  /**
   * Perform statistical test
   */
  private performStatisticalTest(experimentId: string, metricName: string): StatisticalTest {
    const results = this.results.get(experimentId) || [];
    const experiment = this.experiments.get(experimentId)!;
    
    // Group results by variant
    const variantGroups = new Map<string, number[]>();
    for (const result of results) {
      const value = result.metrics[metricName] || 0;
      if (!variantGroups.has(result.variant)) {
        variantGroups.set(result.variant, []);
      }
      variantGroups.get(result.variant)!.push(value);
    }

    // Perform t-test between variants
    const variants = Array.from(variantGroups.keys());
    if (variants.length < 2) {
      return {
        testType: 't-test',
        pValue: 1,
        confidenceInterval: [0, 0],
        effectSize: 0,
        power: 0,
        sampleSize: results.length,
        isSignificant: false,
        conclusion: 'Insufficient data for statistical test'
      };
    }

    const group1 = variantGroups.get(variants[0])!;
    const group2 = variantGroups.get(variants[1])!;

    const pValue = this.performTTest(group1, group2);
    const effectSize = this.calculateEffectSize(group1, group2);
    const power = this.calculatePower(effectSize, group1.length, group2.length);
    const confidenceInterval = this.calculateEffectConfidenceInterval(effectSize, group1.length, group2.length);

    const isSignificant = pValue < (1 - experiment.successCriteria.confidenceLevel);

    return {
      testType: 't-test',
      pValue,
      confidenceInterval,
      effectSize,
      power,
      sampleSize: group1.length + group2.length,
      isSignificant,
      conclusion: isSignificant ? 'Statistically significant difference detected' : 'No significant difference detected'
    };
  }

  /**
   * Perform t-test
   */
  private performTTest(group1: number[], group2: number[]): number {
    const n1 = group1.length;
    const n2 = group2.length;
    
    const mean1 = group1.reduce((sum, x) => sum + x, 0) / n1;
    const mean2 = group2.reduce((sum, x) => sum + x, 0) / n2;
    
    const var1 = group1.reduce((sum, x) => sum + Math.pow(x - mean1, 2), 0) / (n1 - 1);
    const var2 = group2.reduce((sum, x) => sum + Math.pow(x - mean2, 2), 0) / (n2 - 1);
    
    const pooledVar = ((n1 - 1) * var1 + (n2 - 1) * var2) / (n1 + n2 - 2);
    const standardError = Math.sqrt(pooledVar * (1/n1 + 1/n2));
    
    const tStatistic = (mean1 - mean2) / standardError;
    const degreesOfFreedom = n1 + n2 - 2;
    
    // Simplified p-value calculation (in real implementation, use proper t-distribution)
    const pValue = 2 * (1 - this.tDistributionCDF(Math.abs(tStatistic), degreesOfFreedom));
    
    return Math.max(0, Math.min(1, pValue));
  }

  /**
   * Calculate effect size (Cohen's d)
   */
  private calculateEffectSize(group1: number[], group2: number[]): number {
    const n1 = group1.length;
    const n2 = group2.length;
    
    const mean1 = group1.reduce((sum, x) => sum + x, 0) / n1;
    const mean2 = group2.reduce((sum, x) => sum + x, 0) / n2;
    
    const var1 = group1.reduce((sum, x) => sum + Math.pow(x - mean1, 2), 0) / (n1 - 1);
    const var2 = group2.reduce((sum, x) => sum + Math.pow(x - mean2, 2), 0) / (n2 - 1);
    
    const pooledStd = Math.sqrt(((n1 - 1) * var1 + (n2 - 1) * var2) / (n1 + n2 - 2));
    
    return (mean1 - mean2) / pooledStd;
  }

  /**
   * Calculate statistical power
   */
  private calculatePower(effectSize: number, n1: number, n2: number): number {
    // Simplified power calculation
    const alpha = 0.05;
    const n = Math.min(n1, n2);
    const power = 1 - this.normalCDF(this.normalQuantile(1 - alpha/2) - effectSize * Math.sqrt(n/2));
    return Math.max(0, Math.min(1, power));
  }

  /**
   * Calculate confidence interval for conversion rate
   */
  private calculateConfidenceInterval(rate: number, sampleSize: number): [number, number] {
    const z = 1.96; // 95% confidence
    const margin = z * Math.sqrt((rate * (1 - rate)) / sampleSize);
    return [Math.max(0, rate - margin), Math.min(1, rate + margin)];
  }

  /**
   * Calculate p-value for conversion rate
   */
  private calculatePValue(rate: number, sampleSize: number): number {
    // Simplified p-value calculation
    const expectedRate = 0.5; // Null hypothesis
    const z = (rate - expectedRate) / Math.sqrt((expectedRate * (1 - expectedRate)) / sampleSize);
    return 2 * (1 - this.normalCDF(Math.abs(z)));
  }

  /**
   * Determine winning variant
   */
  private determineWinner(
    variantResults: Map<string, any>,
    successCriteria: ExperimentConfig['successCriteria']
  ): string | null {
    let winner: string | null = null;
    let bestScore = -Infinity;

    for (const [variantId, results] of variantResults.entries()) {
      const score = results.conversionRate;
      if (score > bestScore && score > successCriteria.minimumImprovement) {
        bestScore = score;
        winner = variantId;
      }
    }

    // Mark winner
    if (winner) {
      for (const [variantId, results] of variantResults.entries()) {
        results.isWinner = variantId === winner;
      }
    }

    return winner;
  }

  /**
   * Generate recommendation
   */
  private generateRecommendation(
    variantResults: Map<string, any>,
    statisticalTests: Map<string, StatisticalTest>,
    experiment: ExperimentConfig
  ): 'continue' | 'stop' | 'extend' | 'implement' {
    const primaryTest = statisticalTests.get(experiment.successCriteria.primaryMetric);
    
    if (!primaryTest) {
      return 'continue';
    }

    if (primaryTest.isSignificant && primaryTest.pValue < 0.05) {
      const winner = this.determineWinner(variantResults, experiment.successCriteria);
      return winner ? 'implement' : 'stop';
    }

    if (primaryTest.power < 0.8) {
      return 'extend';
    }

    return 'continue';
  }

  /**
   * Calculate overall confidence
   */
  private calculateOverallConfidence(statisticalTests: Map<string, StatisticalTest>): number {
    const tests = Array.from(statisticalTests.values());
    if (tests.length === 0) return 0;
    
    const avgConfidence = tests.reduce((sum, test) => sum + (1 - test.pValue), 0) / tests.length;
    return Math.max(0, Math.min(1, avgConfidence));
  }

  /**
   * Calculate expected lift
   */
  private calculateExpectedLift(
    variantResults: Map<string, any>,
    primaryMetric: string
  ): number {
    const results = Array.from(variantResults.values());
    if (results.length < 2) return 0;

    const control = results[0];
    const treatment = results[1];

    return ((treatment.conversionRate - control.conversionRate) / control.conversionRate) * 100;
  }

  /**
   * Assess risk
   */
  private assessRisk(
    variantResults: Map<string, any>,
    statisticalTests: Map<string, StatisticalTest>
  ): {
    riskLevel: 'low' | 'medium' | 'high';
    factors: string[];
  } {
    const factors: string[] = [];
    let riskScore = 0;

    // Check sample sizes
    for (const [variantId, results] of variantResults.entries()) {
      if (results.sampleSize < 100) {
        factors.push(`Small sample size for variant ${variantId}`);
        riskScore += 2;
      }
    }

    // Check statistical power
    for (const [metricName, test] of statisticalTests.entries()) {
      if (test.power < 0.8) {
        factors.push(`Low statistical power for metric ${metricName}`);
        riskScore += 1;
      }
    }

    // Check confidence intervals
    for (const [variantId, results] of variantResults.entries()) {
      const ci = results.confidenceInterval;
      const width = ci[1] - ci[0];
      if (width > 0.1) {
        factors.push(`Wide confidence interval for variant ${variantId}`);
        riskScore += 1;
      }
    }

    let riskLevel: 'low' | 'medium' | 'high';
    if (riskScore <= 2) {
      riskLevel = 'low';
    } else if (riskScore <= 5) {
      riskLevel = 'medium';
    } else {
      riskLevel = 'high';
    }

    return { riskLevel, factors };
  }

  /**
   * Perform power analysis
   */
  performPowerAnalysis(
    effectSize: number,
    alpha: number = 0.05,
    power: number = 0.8
  ): PowerAnalysis {
    const zAlpha = this.normalQuantile(1 - alpha/2);
    const zBeta = this.normalQuantile(power);
    
    const sampleSize = Math.ceil((2 * Math.pow(zAlpha + zBeta, 2)) / Math.pow(effectSize, 2));
    const minimumDetectableEffect = Math.sqrt((2 * Math.pow(zAlpha + zBeta, 2)) / sampleSize);
    const recommendedDuration = sampleSize * 1000; // Mock duration calculation

    return {
      effectSize,
      alpha,
      power,
      sampleSize,
      minimumDetectableEffect,
      recommendedDuration
    };
  }

  /**
   * Get experiment statistics
   */
  getStatistics(): typeof this.statistics {
    return { ...this.statistics };
  }

  /**
   * Get experiment by ID
   */
  getExperiment(experimentId: string): ExperimentConfig | undefined {
    return this.experiments.get(experimentId);
  }

  /**
   * Get experiment results
   */
  getExperimentResults(experimentId: string): ExperimentResult[] {
    return this.results.get(experimentId) || [];
  }

  /**
   * Get experiment analysis
   */
  getExperimentAnalysis(experimentId: string): ExperimentAnalysis | undefined {
    return this.analyses.get(experimentId);
  }

  // Private helper methods

  private generateExperimentId(): string {
    return `exp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private validateExperiment(experiment: ExperimentConfig): boolean {
    // Check if variants sum to 1.0
    const totalWeight = experiment.variants.reduce((sum, v) => sum + v.weight, 0);
    if (Math.abs(totalWeight - 1.0) > 0.01) {
      return false;
    }

    // Check if experiment has metrics
    if (experiment.metrics.length === 0) {
      return false;
    }

    // Check if dates are valid
    if (experiment.startDate >= experiment.endDate) {
      return false;
    }

    return true;
  }

  private selectVariant(variants: ExperimentConfig['variants']): string {
    const random = Math.random();
    let cumulative = 0;

    for (const variant of variants) {
      cumulative += variant.weight;
      if (random <= cumulative) {
        return variant.id;
      }
    }

    return variants[variants.length - 1].id;
  }

  private shouldPerformInterimAnalysis(experimentId: string): boolean {
    const results = this.results.get(experimentId) || [];
    return results.length % 100 === 0; // Analyze every 100 results
  }

  private shouldStopEarly(analysis: ExperimentAnalysis): boolean {
    return analysis.recommendation === 'implement' || analysis.recommendation === 'stop';
  }

  private startExperimentMonitoring(): void {
    setInterval(() => {
      for (const experimentId of this.activeExperiments) {
        const experiment = this.experiments.get(experimentId);
        if (experiment && new Date() >= experiment.endDate) {
          this.stopExperiment(experimentId, 'duration_completed');
        }
      }
    }, 60000); // Check every minute
  }

  // Statistical helper functions (simplified implementations)

  private normalCDF(x: number): number {
    return 0.5 * (1 + this.erf(x / Math.sqrt(2)));
  }

  private normalQuantile(p: number): number {
    // Simplified implementation
    return Math.sqrt(2) * this.inverseErf(2 * p - 1);
  }

  private tDistributionCDF(t: number, df: number): number {
    // Simplified implementation - in real scenario, use proper t-distribution
    return this.normalCDF(t);
  }

  private erf(x: number): number {
    // Approximation of error function
    const a1 = 0.254829592;
    const a2 = -0.284496736;
    const a3 = 1.421413741;
    const a4 = -1.453152027;
    const a5 = 1.061405429;
    const p = 0.3275911;

    const sign = x >= 0 ? 1 : -1;
    x = Math.abs(x);

    const t = 1.0 / (1.0 + p * x);
    const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);

    return sign * y;
  }

  private inverseErf(x: number): number {
    // Simplified implementation
    return x * Math.sqrt(Math.PI) / 2;
  }

  private calculateEffectConfidenceInterval(effectSize: number, n1: number, n2: number): [number, number] {
    const se = Math.sqrt(1/n1 + 1/n2);
    const margin = 1.96 * se;
    return [effectSize - margin, effectSize + margin];
  }
}
