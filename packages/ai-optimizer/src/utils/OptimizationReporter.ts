import {
  OptimizationSuggestions,
  PerformanceImpact,
  AccessibilityWarning,
  ScalingCurveRecommendation,
  EstimatedImprovements
} from '../types/index.js';

/**
 * Optimization reporting utility for generating human-readable reports
 * 
 * This class creates comprehensive reports from AI optimization suggestions
 * that can be used by developers and stakeholders.
 */
export class OptimizationReporter {
  // Constants for magic numbers
  private static readonly HIGH_CONFIDENCE_THRESHOLD = 0.8;
  private static readonly MODERATE_CONFIDENCE_THRESHOLD = 0.6;
  private static readonly LOW_CONFIDENCE_THRESHOLD = 0.7;
  private static readonly SCALE_AGGRESSIVE_THRESHOLD = 0.8;
  private static readonly SCALE_CONSERVATIVE_THRESHOLD = 1.2;
  private static readonly SCALE_HIGH_PRIORITY_MIN = 0.7;
  private static readonly SCALE_HIGH_PRIORITY_MAX = 1.3;
  private static readonly FONT_SIZE_MEDIUM_PRIORITY_MIN = 16;
  private static readonly FONT_SIZE_MEDIUM_PRIORITY_MAX = 32;
  private static readonly TIMELINE_TOKEN_MULTIPLIER = 0.5;
  private static readonly TIMELINE_ACCESSIBILITY_MULTIPLIER = 0.5;
  private static readonly SCALE_BASELINE = 0.85;
  private static readonly SCALE_VARIANCE_THRESHOLD = 0.2;
  private static readonly MIN_FONT_SIZE_ACCESSIBILITY = 12;
  private static readonly MAX_FONT_SIZE_LIMIT = 48;

  /**
   * Generate a comprehensive optimization report
   */
  generateReport(suggestions: OptimizationSuggestions): OptimizationReport {
    const summary = this.generateSummary(suggestions);
    const tokenRecommendations = this.formatTokenRecommendations(suggestions.suggestedTokens);
    const scalingRecommendations = this.formatScalingRecommendations(suggestions.scalingCurveRecommendations);
    const performanceAnalysis = this.formatPerformanceAnalysis(suggestions.performanceImpacts);
    const accessibilityAnalysis = this.formatAccessibilityAnalysis(suggestions.accessibilityWarnings);
    const improvementEstimates = this.formatImprovementEstimates(suggestions.estimatedImprovements);
    const actionPlan = this.generateActionPlan(suggestions);
    
    return {
      summary,
      confidenceScore: suggestions.confidenceScore,
      tokenRecommendations,
      scalingRecommendations,
      performanceAnalysis,
      accessibilityAnalysis,
      improvementEstimates,
      actionPlan,
      generatedAt: new Date().toISOString()
    };
  }

  /**
   * Generate executive summary
   */
  private generateSummary(suggestions: OptimizationSuggestions): string {
    const confidence = (suggestions.confidenceScore * 100).toFixed(1);
    const tokenCount = Object.keys(suggestions.suggestedTokens).length;
    const performanceImpacts = suggestions.performanceImpacts.length;
    const accessibilityWarnings = suggestions.accessibilityWarnings.length;
    
    let summary = `AI optimization analysis completed with ${confidence}% confidence. `;
    summary += `Found ${tokenCount} token optimization opportunities, `;
    summary += `${performanceImpacts} performance improvements, `;
    summary += `and ${accessibilityWarnings} accessibility enhancements.`;
    
    if (suggestions.confidenceScore > OptimizationReporter.HIGH_CONFIDENCE_THRESHOLD) {
      summary += ' High confidence recommendations ready for implementation.';
    } else if (suggestions.confidenceScore > OptimizationReporter.MODERATE_CONFIDENCE_THRESHOLD) {
      summary += ' Moderate confidence recommendations require validation.';
    } else {
      summary += ' Low confidence recommendations need further analysis.';
    }
    
    return summary;
  }

  /**
   * Format token recommendations
   */
  private formatTokenRecommendations(suggestedTokens: Record<string, unknown>): TokenRecommendation[] {
    return Object.entries(suggestedTokens).map(([tokenName, token]) => {
      const tokenConfig = token as { scale: number; min: number; max: number; step: number; responsive: boolean };
      return {
        token: tokenName,
        currentConfig: 'N/A', // Would be populated with current values
        suggestedConfig: {
          scale: tokenConfig.scale,
          min: tokenConfig.min,
          max: tokenConfig.max,
          step: tokenConfig.step
        },
        reasoning: this.generateTokenReasoning(tokenName, token as { scale: number; min: number; max: number }),
        priority: this.calculateTokenPriority(token as { scale: number; min: number; max: number }),
        estimatedImpact: this.estimateTokenImpact(tokenName, token)
      };
    });
  }

  /**
   * Format scaling curve recommendations
   */
  private formatScalingRecommendations(recommendations: ScalingCurveRecommendation[]): ScalingRecommendation[] {
    return recommendations.map(rec => ({
      token: rec.token,
      currentMode: 'linear', // Would be populated with current mode
      suggestedMode: rec.mode,
      suggestedScale: rec.scale,
      breakpointAdjustments: rec.breakpointAdjustments,
      confidence: rec.confidence,
      reasoning: rec.reasoning,
      implementation: this.generateImplementationGuide(rec)
    }));
  }

  /**
   * Format performance analysis
   */
  private formatPerformanceAnalysis(impacts: PerformanceImpact[]): PerformanceAnalysis {
    const criticalImpacts = impacts.filter(i => i.severity === 'critical');
    const highImpacts = impacts.filter(i => i.severity === 'high');
    const mediumImpacts = impacts.filter(i => i.severity === 'medium');
    const lowImpacts = impacts.filter(i => i.severity === 'low');
    
    return {
      overview: `${impacts.length} performance optimization opportunities identified`,
      breakdown: {
        critical: criticalImpacts.length,
        high: highImpacts.length,
        medium: mediumImpacts.length,
        low: lowImpacts.length
      },
      topImpacts: impacts
        .sort((a, b) => b.improvementPercent - a.improvementPercent)
        .slice(0, 5)
        .map(impact => ({
          aspect: impact.aspect,
          currentValue: impact.currentValue,
          predictedValue: impact.predictedValue,
          improvement: `${impact.improvementPercent.toFixed(1)}%`,
          severity: impact.severity
        })),
      recommendations: this.generatePerformanceRecommendations(impacts)
    };
  }

  /**
   * Format accessibility analysis
   */
  private formatAccessibilityAnalysis(warnings: AccessibilityWarning[]): AccessibilityAnalysis {
    const aaWarnings = warnings.filter(w => w.severity === 'AA');
    const aaaWarnings = warnings.filter(w => w.severity === 'AAA');
    const bestPractices = warnings.filter(w => w.severity === 'best-practice');
    
    return {
      overview: `${warnings.length} accessibility improvements identified`,
      complianceLevel: this.calculateComplianceLevel(warnings),
      breakdown: {
        wcagAA: aaWarnings.length,
        wcagAAA: aaaWarnings.length,
        bestPractices: bestPractices.length
      },
      criticalIssues: warnings
        .filter(w => w.severity === 'AA')
        .map(warning => ({
          type: warning.type,
          description: warning.description,
          currentValue: warning.currentValue,
          recommendedValue: warning.recommendedValue,
          wcagReference: warning.wcagReference
        })),
      recommendations: this.generateAccessibilityRecommendations(warnings)
    };
  }

  /**
   * Format improvement estimates
   */
  private formatImprovementEstimates(estimates: EstimatedImprovements): FormattedImprovements {
    return {
      performance: {
        renderTime: `${estimates.performance.renderTime.toFixed(1)}% faster`,
        bundleSize: `${estimates.performance.bundleSize.toFixed(1)}% smaller`,
        memoryUsage: `${estimates.performance.memoryUsage.toFixed(1)}% less memory`,
        layoutShift: `${estimates.performance.layoutShift.toFixed(3)} CLS improvement`
      },
      userExperience: {
        interactionRate: `${estimates.userExperience.interactionRate.toFixed(1)}% more interactions`,
        accessibilityScore: `${estimates.userExperience.accessibilityScore.toFixed(0)} point improvement`,
        visualHierarchy: `${estimates.userExperience.visualHierarchy.toFixed(1)}% clearer hierarchy`
      },
      developerExperience: {
        codeReduction: `${estimates.developerExperience.codeReduction.toFixed(1)}% less code`,
        maintenanceEffort: `${estimates.developerExperience.maintenanceEffort.toFixed(1)}% easier maintenance`,
        debuggingTime: `${estimates.developerExperience.debuggingTime.toFixed(1)}% faster debugging`
      },
      overallScore: this.calculateOverallImprovementScore(estimates)
    };
  }

  /**
   * Generate action plan
   */
  private generateActionPlan(suggestions: OptimizationSuggestions): ActionPlan {
    const phases = this.createImplementationPhases(suggestions);
    const timeline = this.estimateTimeline(suggestions);
    const resources = this.identifyRequiredResources(suggestions);
    const risks = this.identifyRisks(suggestions);
    
    return {
      phases,
      estimatedTimeline: timeline,
      requiredResources: resources,
      identifiedRisks: risks,
      successMetrics: this.defineSuccessMetrics(suggestions)
    };
  }

  /**
   * Generate token reasoning
   */
  private generateTokenReasoning(tokenName: string, token: { scale: number; min: number; max: number }): string {
    const reasons = [];
    
    if (token.scale < OptimizationReporter.SCALE_AGGRESSIVE_THRESHOLD) {
      reasons.push(`More aggressive scaling for better mobile adaptation`);
    } else if (token.scale > OptimizationReporter.SCALE_CONSERVATIVE_THRESHOLD) {
      reasons.push(`Conservative scaling to maintain desktop readability`);
    }
    
    if (token.min > OptimizationReporter.MIN_FONT_SIZE_ACCESSIBILITY) {
      reasons.push(`Higher minimum for accessibility compliance`);
    }
    
    if (token.max < OptimizationReporter.MAX_FONT_SIZE_LIMIT) {
      reasons.push(`Lower maximum to prevent oversized elements`);
    }
    
    return reasons.length > 0 
      ? reasons.join('; ')
      : `Optimized ${tokenName} scaling based on usage patterns`;
  }

  /**
   * Calculate token priority
   */
  private calculateTokenPriority(token: { scale: number; min: number; max: number }): 'high' | 'medium' | 'low' {
    if (token.scale < OptimizationReporter.SCALE_HIGH_PRIORITY_MIN || token.scale > OptimizationReporter.SCALE_HIGH_PRIORITY_MAX) return 'high';
    if (token.min > OptimizationReporter.FONT_SIZE_MEDIUM_PRIORITY_MIN || token.max < OptimizationReporter.FONT_SIZE_MEDIUM_PRIORITY_MAX) return 'medium';
    return 'low';
  }

  /**
   * Estimate token impact
   */
  private estimateTokenImpact(tokenName: string, _token: unknown): string {
    const impactAreas = [];
    
    if (tokenName === 'fontSize') impactAreas.push('readability', 'accessibility');
    if (tokenName === 'spacing') impactAreas.push('layout', 'visual hierarchy');
    if (tokenName === 'radius') impactAreas.push('visual consistency');
    
    return `Affects: ${impactAreas.join(', ')}`;
  }

  /**
   * Generate implementation guide
   */
  private generateImplementationGuide(rec: ScalingCurveRecommendation): string {
    return `Update ${rec.token} scaling mode to ${rec.mode} with scale factor ${rec.scale.toFixed(2)}. ` +
           `Apply breakpoint adjustments gradually and test across devices.`;
  }

  /**
   * Generate performance recommendations
   */
  private generatePerformanceRecommendations(impacts: PerformanceImpact[]): string[] {
    const recommendations = [];
    
    const bundleImpact = impacts.find(i => i.aspect === 'bundle-size');
    if (bundleImpact && bundleImpact.improvementPercent > 10) {
      recommendations.push('Implement build-time pre-computation to reduce bundle size');
    }
    
    const renderImpact = impacts.find(i => i.aspect === 'render-time');
    if (renderImpact && renderImpact.improvementPercent > 5) {
      recommendations.push('Enable memoization for frequently used responsive values');
    }
    
    if (recommendations.length === 0) {
      recommendations.push('Current performance is well-optimized');
    }
    
    return recommendations;
  }

  /**
   * Calculate compliance level
   */
  private calculateComplianceLevel(warnings: AccessibilityWarning[]): string {
    const aaWarnings = warnings.filter(w => w.severity === 'AA').length;
    
    if (aaWarnings === 0) return 'WCAG AA Compliant';
    if (aaWarnings <= 2) return 'Near WCAG AA Compliance';
    return 'WCAG AA Non-Compliant';
  }

  /**
   * Generate accessibility recommendations
   */
  private generateAccessibilityRecommendations(warnings: AccessibilityWarning[]): string[] {
    const recommendations = [];
    
    if (warnings.some(w => w.type === 'font-size')) {
      recommendations.push('Increase minimum font sizes for better readability');
    }
    
    if (warnings.some(w => w.type === 'tap-target')) {
      recommendations.push('Ensure tap targets meet minimum size requirements');
    }
    
    if (warnings.some(w => w.type === 'contrast')) {
      recommendations.push('Improve color contrast ratios');
    }
    
    if (recommendations.length === 0) {
      recommendations.push('Current accessibility implementation is well-optimized');
    }
    
    return recommendations;
  }

  /**
   * Calculate overall improvement score
   */
  private calculateOverallImprovementScore(estimates: EstimatedImprovements): number {
    const performanceScore = (
      estimates.performance.renderTime +
      estimates.performance.bundleSize +
      estimates.performance.memoryUsage
    ) / 3;
    
    const uxScore = (
      estimates.userExperience.interactionRate +
      estimates.userExperience.accessibilityScore +
      estimates.userExperience.visualHierarchy
    ) / 3;
    
    const dxScore = (
      estimates.developerExperience.codeReduction +
      estimates.developerExperience.maintenanceEffort +
      estimates.developerExperience.debuggingTime
    ) / 3;
    
    return Math.round((performanceScore + uxScore + dxScore) / 3);
  }

  /**
   * Create implementation phases
   */
  private createImplementationPhases(_suggestions: OptimizationSuggestions): ImplementationPhase[] {
    return [
      {
        phase: 1,
        name: 'High-Impact Token Optimizations',
        description: 'Implement critical token adjustments with highest confidence',
        duration: '1-2 weeks',
        tasks: ['Update fontSize tokens', 'Adjust spacing tokens', 'Test on key breakpoints']
      },
      {
        phase: 2,
        name: 'Performance Optimizations',
        description: 'Apply performance improvements and bundle optimizations',
        duration: '1 week',
        tasks: ['Enable pre-computation', 'Optimize scaling algorithms', 'Performance testing']
      },
      {
        phase: 3,
        name: 'Accessibility Enhancements',
        description: 'Address accessibility warnings and compliance issues',
        duration: '1 week',
        tasks: ['Fix font size issues', 'Improve tap targets', 'Accessibility testing']
      }
    ];
  }

  /**
   * Estimate implementation timeline
   */
  private estimateTimeline(suggestions: OptimizationSuggestions): string {
    const tokenCount = Object.keys(suggestions.suggestedTokens).length;
    const complexChanges = suggestions.scalingCurveRecommendations.filter(r => r.confidence > OptimizationReporter.HIGH_CONFIDENCE_THRESHOLD).length;
    const accessibilityIssues = suggestions.accessibilityWarnings.filter(w => w.severity === 'AA').length;
    
    const estimatedWeeks = Math.ceil((tokenCount * OptimizationReporter.TIMELINE_TOKEN_MULTIPLIER) + (complexChanges * 1) + (accessibilityIssues * OptimizationReporter.TIMELINE_ACCESSIBILITY_MULTIPLIER));
    
    return `${estimatedWeeks}-${estimatedWeeks + 2} weeks`;
  }

  /**
   * Identify required resources
   */
  private identifyRequiredResources(suggestions: OptimizationSuggestions): string[] {
    const resources = ['Frontend Developer'];
    
    if (suggestions.accessibilityWarnings.length > 0) {
      resources.push('Accessibility Specialist');
    }
    
    if (suggestions.performanceImpacts.some(p => p.severity === 'high')) {
      resources.push('Performance Engineer');
    }
    
    resources.push('QA Engineer', 'Designer (for visual validation)');
    
    return resources;
  }

  /**
   * Identify implementation risks
   */
  private identifyRisks(suggestions: OptimizationSuggestions): Risk[] {
    const risks: Risk[] = [];
    
    if (suggestions.confidenceScore < OptimizationReporter.LOW_CONFIDENCE_THRESHOLD) {
      risks.push({
        risk: 'Low confidence predictions',
        impact: 'medium',
        mitigation: 'Implement changes gradually with extensive testing'
      });
    }
    
    const majorChanges = suggestions.scalingCurveRecommendations.filter(r => 
      r.mode !== 'linear' || Math.abs(r.scale - OptimizationReporter.SCALE_BASELINE) > OptimizationReporter.SCALE_VARIANCE_THRESHOLD
    ).length;
    
    if (majorChanges > 2) {
      risks.push({
        risk: 'Significant scaling changes may affect visual consistency',
        impact: 'high',
        mitigation: 'Implement in phases with design team validation'
      });
    }
    
    return risks;
  }

  /**
   * Define success metrics
   */
  private defineSuccessMetrics(suggestions: OptimizationSuggestions): string[] {
    const metrics = [];
    
    if (suggestions.performanceImpacts.some(p => p.aspect === 'render-time')) {
      metrics.push('Render time improvement > 10%');
    }
    
    if (suggestions.performanceImpacts.some(p => p.aspect === 'bundle-size')) {
      metrics.push('Bundle size reduction > 5%');
    }
    
    if (suggestions.accessibilityWarnings.length > 0) {
      metrics.push('WCAG AA compliance achieved');
    }
    
    metrics.push('No visual regressions in key user flows');
    metrics.push('Positive user feedback on responsive behavior');
    
    return metrics;
  }
}

// Type definitions for the report structure
export interface OptimizationReport {
  summary: string;
  confidenceScore: number;
  tokenRecommendations: TokenRecommendation[];
  scalingRecommendations: ScalingRecommendation[];
  performanceAnalysis: PerformanceAnalysis;
  accessibilityAnalysis: AccessibilityAnalysis;
  improvementEstimates: FormattedImprovements;
  actionPlan: ActionPlan;
  generatedAt: string;
}

export interface TokenRecommendation {
  token: string;
  currentConfig: string;
  suggestedConfig: {
    scale: number;
    min: number;
    max: number;
    step: number;
  };
  reasoning: string;
  priority: 'high' | 'medium' | 'low';
  estimatedImpact: string;
}

export interface ScalingRecommendation {
  token: string;
  currentMode: string;
  suggestedMode: string;
  suggestedScale: number;
  breakpointAdjustments: Record<string, number>;
  confidence: number;
  reasoning: string;
  implementation: string;
}

export interface PerformanceAnalysis {
  overview: string;
  breakdown: {
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
  topImpacts: Array<{
    aspect: string;
    currentValue: number;
    predictedValue: number;
    improvement: string;
    severity: string;
  }>;
  recommendations: string[];
}

export interface AccessibilityAnalysis {
  overview: string;
  complianceLevel: string;
  breakdown: {
    wcagAA: number;
    wcagAAA: number;
    bestPractices: number;
  };
  criticalIssues: Array<{
    type: string;
    description: string;
    currentValue: number;
    recommendedValue: number;
    wcagReference: string;
  }>;
  recommendations: string[];
}

export interface FormattedImprovements {
  performance: {
    renderTime: string;
    bundleSize: string;
    memoryUsage: string;
    layoutShift: string;
  };
  userExperience: {
    interactionRate: string;
    accessibilityScore: string;
    visualHierarchy: string;
  };
  developerExperience: {
    codeReduction: string;
    maintenanceEffort: string;
    debuggingTime: string;
  };
  overallScore: number;
}

export interface ActionPlan {
  phases: ImplementationPhase[];
  estimatedTimeline: string;
  requiredResources: string[];
  identifiedRisks: Risk[];
  successMetrics: string[];
}

export interface ImplementationPhase {
  phase: number;
  name: string;
  description: string;
  duration: string;
  tasks: string[];
}

export interface Risk {
  risk: string;
  impact: 'low' | 'medium' | 'high';
  mitigation: string;
}
