import { ComponentUsageData, ResponsiveValueUsage, PerformanceMetrics, InteractionData, ComponentContext } from '../types/index.js';
import { AI_OPTIMIZER_CONSTANTS } from '../constants.js';
import { Logger } from './Logger.js';

/**
 * Data collection utility for gathering component usage information
 * 
 * This class helps collect real-world usage data that can be used
 * to train and improve the AI optimization models.
 */
export class DataCollector {
  private usageData: ComponentUsageData[] = [];
  private isCollecting = false;
  private performanceObserver?: PerformanceObserver;
  private mutationObserver?: MutationObserver;
  private logger: Logger;

  constructor() {
    this.logger = new Logger('DataCollector');
  }

  /**
   * Start collecting usage data
   */
  startCollection(): void {
    if (this.isCollecting) {
      this.logger.warn('Data collection is already active');
      return;
    }

    this.isCollecting = true;
    this.setupPerformanceObserver();
    this.setupMutationObserver();
    this.setupInteractionTracking();
    
    this.logger.info('📊 AI data collection started');
  }

  /**
   * Stop collecting usage data
   */
  stopCollection(): void {
    if (!this.isCollecting) {
      this.logger.warn('Data collection is not active');
      return;
    }

    this.isCollecting = false;
    
    if (this.performanceObserver) {
      this.performanceObserver.disconnect();
    }
    
    if (this.mutationObserver) {
      this.mutationObserver.disconnect();
    }
    
    this.removeInteractionTracking();
    
    this.logger.info('📊 AI data collection stopped');
  }

  /**
   * Get collected usage data
   */
  getCollectedData(): ComponentUsageData[] {
    return [...this.usageData];
  }

  /**
   * Clear collected data
   */
  clearData(): void {
    this.usageData = [];
    this.logger.info('🗑️ Collected data cleared');
  }

  /**
   * Add manual usage data entry
   */
  addUsageData(data: ComponentUsageData): void {
    this.usageData.push(data);
  }

  /**
   * Export collected data to JSON
   */
  exportData(): string {
    return JSON.stringify({
      collectionDate: new Date().toISOString(),
      dataCount: this.usageData.length,
      data: this.usageData
    }, null, 2);
  }

  /**
   * Import data from JSON
   */
  importData(jsonData: string): void {
    try {
      const imported = JSON.parse(jsonData);
      if (imported.data && Array.isArray(imported.data)) {
        this.usageData = [...this.usageData, ...imported.data];
        this.logger.info(`📥 Imported ${imported.data.length} data entries`);
      }
    } catch (error) {
      this.logger.error('❌ Failed to import data:', error instanceof Error ? error : new Error(String(error)));
    }
  }

  /**
   * Collect data from a specific component
   */
  collectComponentData(
    element: HTMLElement,
    componentType: string,
    responsiveValues: ResponsiveValueUsage[]
  ): void {
    if (!this.isCollecting) return;

    const componentId = this.generateComponentId(element, componentType);
    const performance = this.measureComponentPerformance(element);
    const interactions = this.getInteractionData(element);
    const context = this.getComponentContext(element);

    const usageData: ComponentUsageData = {
      componentId,
      componentType,
      responsiveValues,
      performance,
      interactions,
      context
    };

    this.usageData.push(usageData);
  }

  /**
   * Setup performance observer for collecting performance metrics
   */
  private setupPerformanceObserver(): void {
    if (!('PerformanceObserver' in window)) {
      this.logger.warn('PerformanceObserver not supported');
      return;
    }

    this.performanceObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach(entry => {
        if (entry.entryType === 'measure' || entry.entryType === 'navigation') {
          this.processPerformanceEntry(entry);
        }
      });
    });

    try {
      this.performanceObserver.observe({ entryTypes: ['measure', 'navigation', 'paint'] });
    } catch (error) {
      this.logger.error('Failed to setup performance observer:', error instanceof Error ? error : new Error(String(error)));
    }
  }

  /**
   * Setup mutation observer for tracking DOM changes
   */
  private setupMutationObserver(): void {
    this.mutationObserver = new MutationObserver((mutations) => {
      mutations.forEach(mutation => {
        if (mutation.type === 'childList' || mutation.type === 'attributes') {
          this.processMutation(mutation);
        }
      });
    });

    this.mutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['style', 'class', 'data-responsive']
    });
  }

  /**
   * Setup interaction tracking
   */
  private setupInteractionTracking(): void {
    document.addEventListener('click', this.handleInteraction.bind(this));
    document.addEventListener('scroll', this.handleScroll.bind(this));
    document.addEventListener('resize', this.handleResize.bind(this));
  }

  /**
   * Remove interaction tracking
   */
  private removeInteractionTracking(): void {
    document.removeEventListener('click', this.handleInteraction.bind(this));
    document.removeEventListener('scroll', this.handleScroll.bind(this));
    document.removeEventListener('resize', this.handleResize.bind(this));
  }

  /**
   * Generate unique component ID
   */
  private generateComponentId(element: HTMLElement, componentType: string): string {
    const path = this.getElementPath(element);
    const timestamp = Date.now();
    return `${componentType}_${path}_${timestamp}`;
  }

  /**
   * Get element path for unique identification
   */
  private getElementPath(element: HTMLElement): string {
    const path: string[] = [];
    let current = element;

    while (current && current !== document.body) {
      let selector = current.tagName.toLowerCase();
      
      if (current.id) {
        selector += `#${current.id}`;
      } else if (current.className) {
        selector += `.${current.className.split(' ').join('.')}`;
      }
      
      path.unshift(selector);
      current = current.parentElement!;
    }

    return path.join(' > ');
  }

  /**
   * Measure component performance metrics
   */
  private measureComponentPerformance(element: HTMLElement): PerformanceMetrics {
    const startTime = performance.now();
    
    // Trigger a reflow to measure render time
    // Force reflow for measurement by accessing offsetHeight
    // eslint-disable-next-line no-unused-expressions
    element.offsetHeight;
    
    const renderTime = performance.now() - startTime;
    
    // Estimate memory usage (simplified)
    const memoryInfo = (performance as unknown as { memory?: { usedJSHeapSize: number } }).memory;
    const memoryUsage = memoryInfo ? memoryInfo.usedJSHeapSize : 0;
    
    // Get layout shift score (simplified)
    const layoutShift = this.calculateLayoutShift(element);
    
    // Estimate bundle size impact (simplified)
    const bundleSize = this.estimateBundleSize(element);

    return {
      renderTime,
      layoutShift,
      memoryUsage,
      bundleSize
    };
  }

  /**
   * Get interaction data for component
   */
  private getInteractionData(element: HTMLElement): InteractionData {
    // This would be enhanced with real tracking data
    return {
      interactionRate: Math.random() * AI_OPTIMIZER_CONSTANTS.PERFORMANCE_THRESHOLDS.POOR_THRESHOLD + AI_OPTIMIZER_CONSTANTS.ADDITIONAL_CONSTANTS.MIN_ALPHA, // Simulated
      viewTime: Math.random() * AI_OPTIMIZER_CONSTANTS.ADDITIONAL_CONSTANTS.DEFAULT_STEP * 1000 + AI_OPTIMIZER_CONSTANTS.ADDITIONAL_CONSTANTS.DEFAULT_STEP * 100, // Simulated
      scrollBehavior: 'normal',
      accessibilityScore: this.calculateAccessibilityScore(element)
    };
  }

  /**
   * Get component context information
   */
  private getComponentContext(element: HTMLElement): ComponentContext {
    const parent = element.parentElement;
    const children = Array.from(element.children).map(child => 
      child.tagName.toLowerCase()
    );
    
    const position = this.determinePosition(element);
    const importance = this.determineImportance(element);

    return {
      parent: parent?.tagName.toLowerCase() ?? undefined,
      children,
      position,
      importance
    };
  }

  /**
   * Process performance entry
   */
  private processPerformanceEntry(_entry: PerformanceEntry): void {
    // Store performance data for later analysis
    // This could be enhanced to correlate with specific components
  }

  /**
   * Process DOM mutation
   */
  private processMutation(mutation: MutationRecord): void {
    // Track responsive-related changes
    if (mutation.target instanceof HTMLElement) {
      const element = mutation.target;
      if (element.hasAttribute('data-responsive')) {
        // Component with responsive behavior changed
        this.trackResponsiveChange(element);
      }
    }
  }

  /**
   * Handle user interactions
   */
  private handleInteraction(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (target?.hasAttribute('data-responsive')) {
      this.trackInteraction(target, 'click');
    }
  }

  /**
   * Handle scroll events
   */
  private handleScroll(): void {
    // Track scroll behavior for responsive elements
    const responsiveElements = document.querySelectorAll('[data-responsive]');
    responsiveElements.forEach(element => {
      if (this.isElementInViewport(element as HTMLElement)) {
        this.trackInteraction(element as HTMLElement, 'scroll');
      }
    });
  }

  /**
   * Handle resize events
   */
  private handleResize(): void {
    // Track how responsive elements adapt to size changes
    const responsiveElements = document.querySelectorAll('[data-responsive]');
    responsiveElements.forEach(element => {
      this.trackResponsiveChange(element as HTMLElement);
    });
  }

  /**
   * Track responsive behavior changes
   */
  private trackResponsiveChange(_element: HTMLElement): void {
    // Record how the element's responsive properties changed
    // This would be enhanced with specific property tracking
  }

  /**
   * Track user interactions with elements
   */
  private trackInteraction(_element: HTMLElement, _type: string): void {
    // Record interaction data
    // This would be enhanced with detailed interaction tracking
  }

  /**
   * Check if element is in viewport
   */
  private isElementInViewport(element: HTMLElement): boolean {
    const rect = element.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight ?? document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth ?? document.documentElement.clientWidth)
    );
  }

  /**
   * Calculate layout shift for element
   */
  private calculateLayoutShift(_element: HTMLElement): number {
    // Simplified layout shift calculation
    // In production, this would use the Layout Instability API
    return Math.random() * AI_OPTIMIZER_CONSTANTS.PERFORMANCE_THRESHOLDS.POOR_THRESHOLD; // Simulated CLS score
  }

  /**
   * Estimate bundle size impact
   */
  private estimateBundleSize(element: HTMLElement): number {
    // Estimate how much this component contributes to bundle size
    const complexity = element.children.length + (element.getAttribute('style')?.length ?? 0);
    return complexity * AI_OPTIMIZER_CONSTANTS.ADDITIONAL_CONSTANTS.DEFAULT_STEP + 2; // Simplified estimation
  }

  /**
   * Calculate accessibility score
   */
  private calculateAccessibilityScore(element: HTMLElement): number {
    let score = 100;
    
    // Check for common accessibility issues
    const ACCESSIBILITY_PENALTY_MULTIPLIER = 2.5;
    if (!element.getAttribute('aria-label') && !element.textContent?.trim()) {
      score -= AI_OPTIMIZER_CONSTANTS.ADDITIONAL_CONSTANTS.DEFAULT_STEP * ACCESSIBILITY_PENALTY_MULTIPLIER;
    }
    
    const styles = window.getComputedStyle(element);
    const fontSize = parseFloat(styles.fontSize);
    if (fontSize < AI_OPTIMIZER_CONSTANTS.ADDITIONAL_CONSTANTS.DEFAULT_STEP) {
      score -= AI_OPTIMIZER_CONSTANTS.ADDITIONAL_CONSTANTS.DEFAULT_STEP + 3;
    }
    
    const minTapTarget = Math.min(
      parseFloat(styles.width) ?? 0,
      parseFloat(styles.height) ?? 0
    );
    if (minTapTarget < AI_OPTIMIZER_CONSTANTS.ADDITIONAL_CONSTANTS.ACCESSIBILITY_THRESHOLD) {
      score -= AI_OPTIMIZER_CONSTANTS.ADDITIONAL_CONSTANTS.DEFAULT_STEP + 2;
    }
    
    return Math.max(0, score);
  }

  /**
   * Determine component position in layout
   */
  private determinePosition(element: HTMLElement): 'header' | 'main' | 'sidebar' | 'footer' | 'modal' | 'other' {
    const rect = element.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const windowWidth = window.innerWidth;
    
    if (rect.top < windowHeight * AI_OPTIMIZER_CONSTANTS.PERFORMANCE_THRESHOLDS.POOR_THRESHOLD) return 'header';
    if (rect.top > windowHeight * AI_OPTIMIZER_CONSTANTS.PERFORMANCE_THRESHOLDS.EXCELLENT_THRESHOLD) return 'footer';
    if (rect.left > (windowWidth * AI_OPTIMIZER_CONSTANTS.PERFORMANCE_THRESHOLDS.EXCELLENT_THRESHOLD) || rect.right < (windowWidth * AI_OPTIMIZER_CONSTANTS.PERFORMANCE_THRESHOLDS.POOR_THRESHOLD)) return 'sidebar';
    if (element.closest('[role="dialog"]') ?? element.closest('.modal')) return 'modal';
    if (rect.top >= windowHeight * AI_OPTIMIZER_CONSTANTS.PERFORMANCE_THRESHOLDS.POOR_THRESHOLD && rect.top <= windowHeight * AI_OPTIMIZER_CONSTANTS.PERFORMANCE_THRESHOLDS.EXCELLENT_THRESHOLD) return 'main';
    
    return 'other';
  }

  /**
   * Determine component importance
   */
  private determineImportance(element: HTMLElement): 'primary' | 'secondary' | 'tertiary' {
    // Check for importance indicators
    if (element.matches('h1, h2, .hero, .primary, [role="main"]')) return 'primary';
    if (element.matches('h3, h4, .secondary, nav, aside')) return 'secondary';
    return 'tertiary';
  }
}
