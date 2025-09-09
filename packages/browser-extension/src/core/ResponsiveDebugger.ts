/**
 * Core responsive debugging engine
 * 
 * This class provides the main functionality for inspecting and debugging
 * responsive behavior in React applications using React Responsive Easy.
 */
export class ResponsiveDebugger {
  private isEnabled = false;
  private overlayElements: HTMLElement[] = [];
  private currentBreakpoint: string | null = null;
  private responsiveElements: Map<HTMLElement, ResponsiveElementInfo> = new Map();
  private observers: { observer: any; cleanup: () => void }[] = [];

  /**
   * Enable responsive debugging
   */
  enable(): void {
    if (this.isEnabled) {
      console.warn('Responsive debugger is already enabled');
      return;
    }

    this.isEnabled = true;
    this.detectResponsiveElements();
    this.setupObservers();
    this.injectDebugOverlay();
    this.showBreakpointInfo();
    this.highlightResponsiveElements();
    this.createScalingVisualization();

    console.log('🔍 React Responsive Easy Debugger enabled');
    this.notifyExtension({ type: 'debugger-enabled' });
  }

  /**
   * Disable responsive debugging
   */
  disable(): void {
    if (!this.isEnabled) {
      console.warn('Responsive debugger is not enabled');
      return;
    }

    this.isEnabled = false;
    this.cleanup();

    console.log('🔍 React Responsive Easy Debugger disabled');
    this.notifyExtension({ type: 'debugger-disabled' });
  }

  /**
   * Toggle debugging state
   */
  toggle(): void {
    if (this.isEnabled) {
      this.disable();
    } else {
      this.enable();
    }
  }

  /**
   * Get current debugging state
   */
  isDebuggerEnabled(): boolean {
    return this.isEnabled;
  }

  /**
   * Get information about detected responsive elements
   */
  getResponsiveElements(): ResponsiveElementInfo[] {
    return Array.from(this.responsiveElements.values());
  }

  /**
   * Get current breakpoint information
   */
  getCurrentBreakpoint(): BreakpointInfo | null {
    return this.detectCurrentBreakpoint();
  }

  /**
   * Highlight a specific responsive element
   */
  highlightElement(element: HTMLElement, options?: HighlightOptions): void {
    if (!this.isEnabled) return;

    const overlay = this.createElementOverlay(element, options);
    if (overlay) {
      this.overlayElements.push(overlay);
    }
  }

  /**
   * Remove highlighting from an element
   */
  removeHighlight(element: HTMLElement): void {
    const overlays = this.overlayElements.filter(overlay => 
      overlay.dataset.targetElement === this.getElementSelector(element)
    );
    
    overlays.forEach(overlay => {
      overlay.remove();
      const index = this.overlayElements.indexOf(overlay);
      if (index > -1) {
        this.overlayElements.splice(index, 1);
      }
    });
  }

  /**
   * Detect responsive elements on the page
   */
  private detectResponsiveElements(): void {
    // Look for elements with responsive data attributes
    const responsiveElements = document.querySelectorAll('[data-responsive]');
    
    responsiveElements.forEach(element => {
      const htmlElement = element as HTMLElement;
      const info = this.analyzeResponsiveElement(htmlElement);
      this.responsiveElements.set(htmlElement, info);
    });

    // Also look for React components that might be using responsive hooks
    this.detectReactResponsiveComponents();
  }

  /**
   * Detect React components using responsive hooks
   */
  private detectReactResponsiveComponents(): void {
    // Look for React fiber nodes and detect responsive hook usage
    const reactRoots = this.findReactRoots();
    
    reactRoots.forEach(root => {
      this.traverseReactTree(root, (fiber: any) => {
        if (this.hasResponsiveHooks(fiber)) {
          const element = fiber.stateNode;
          if (element instanceof HTMLElement) {
            const info = this.analyzeResponsiveElement(element);
            this.responsiveElements.set(element, info);
          }
        }
      });
    });
  }

  /**
   * Analyze a responsive element to extract debugging information
   */
  private analyzeResponsiveElement(element: HTMLElement): ResponsiveElementInfo {
    const computedStyle = window.getComputedStyle(element);
    const rect = element.getBoundingClientRect();
    
    return {
      element,
      selector: this.getElementSelector(element),
      componentType: this.inferComponentType(element),
      responsiveValues: this.extractResponsiveValues(element),
      currentStyles: {
        fontSize: computedStyle.fontSize,
        padding: computedStyle.padding,
        margin: computedStyle.margin,
        width: `${rect.width}px`,
        height: `${rect.height}px`
      },
      breakpointBehavior: this.analyzeBreakpointBehavior(element),
      scalingInfo: this.getScalingInfo(element),
      performance: this.measureElementPerformance(element)
    };
  }

  /**
   * Setup observers for dynamic changes
   */
  private setupObservers(): void {
    // Resize observer for breakpoint changes
    if (window.ResizeObserver) {
      const resizeObserver = new ResizeObserver(() => {
        this.handleBreakpointChange();
      });
      
      resizeObserver.observe(document.body);
      this.observers.push({
        observer: resizeObserver,
        cleanup: () => resizeObserver.disconnect()
      });
    }

    // Mutation observer for DOM changes
    const mutationObserver = new MutationObserver((mutations) => {
      mutations.forEach(mutation => {
        if (mutation.type === 'childList' || mutation.type === 'attributes') {
          this.handleDOMChange(mutation);
        }
      });
    });

    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['style', 'class', 'data-responsive']
    });

    this.observers.push({
      observer: mutationObserver,
      cleanup: () => mutationObserver.disconnect()
    });
  }

  /**
   * Inject debug overlay into the page
   */
  private injectDebugOverlay(): void {
    // Create main debug panel
    const overlay = document.createElement('div');
    overlay.id = 'rre-debug-overlay';
    overlay.className = 'rre-debug-overlay';
    
    overlay.innerHTML = `
      <div class="rre-debug-panel">
        <div class="rre-debug-header">
          <h3>React Responsive Easy Debugger</h3>
          <button class="rre-debug-close" onclick="window.rreDebugger?.disable()">×</button>
        </div>
        <div class="rre-debug-content">
          <div class="rre-debug-section">
            <h4>Current Breakpoint</h4>
            <div id="rre-current-breakpoint">Detecting...</div>
          </div>
          <div class="rre-debug-section">
            <h4>Responsive Elements</h4>
            <div id="rre-responsive-elements">0 elements found</div>
          </div>
          <div class="rre-debug-section">
            <h4>Scaling Information</h4>
            <div id="rre-scaling-info">No scaling detected</div>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);
    this.overlayElements.push(overlay);

    // Make it draggable
    this.makeDraggable(overlay.querySelector('.rre-debug-panel') as HTMLElement);
  }

  /**
   * Show current breakpoint information
   */
  private showBreakpointInfo(): void {
    const breakpointInfo = this.detectCurrentBreakpoint();
    const breakpointElement = document.getElementById('rre-current-breakpoint');
    
    if (breakpointElement && breakpointInfo) {
      breakpointElement.innerHTML = `
        <div class="rre-breakpoint-info">
          <div><strong>${breakpointInfo.name}</strong> (${breakpointInfo.width}×${breakpointInfo.height})</div>
          <div class="rre-breakpoint-details">
            <small>Scale: ${breakpointInfo.scale.toFixed(2)} | Origin: ${breakpointInfo.origin}</small>
          </div>
        </div>
      `;
    }
  }

  /**
   * Highlight all responsive elements
   */
  private highlightResponsiveElements(): void {
    this.responsiveElements.forEach((info, element) => {
      this.highlightElement(element, {
        showTooltip: true,
        showScalingInfo: true,
        color: this.getElementHighlightColor(info)
      });
    });

    // Update element count
    const elementsCountElement = document.getElementById('rre-responsive-elements');
    if (elementsCountElement) {
      elementsCountElement.textContent = `${this.responsiveElements.size} elements found`;
    }
  }

  /**
   * Create scaling visualization
   */
  private createScalingVisualization(): void {
    const scalingInfoElement = document.getElementById('rre-scaling-info');
    if (!scalingInfoElement) return;

    const breakpoint = this.detectCurrentBreakpoint();
    if (!breakpoint) {
      scalingInfoElement.textContent = 'No breakpoint configuration detected';
      return;
    }

    scalingInfoElement.innerHTML = `
      <div class="rre-scaling-visualization">
        <div class="rre-scaling-bar">
          <div class="rre-scaling-indicator" style="width: ${breakpoint.scale * 50}%"></div>
        </div>
        <div class="rre-scaling-details">
          <div>Scale Factor: ${breakpoint.scale.toFixed(2)}</div>
          <div>Base: ${breakpoint.baseWidth}×${breakpoint.baseHeight}</div>
          <div>Current: ${breakpoint.width}×${breakpoint.height}</div>
        </div>
      </div>
    `;
  }

  /**
   * Create overlay for a specific element
   */
  private createElementOverlay(element: HTMLElement, options: HighlightOptions = {}): HTMLElement | null {
    const rect = element.getBoundingClientRect();
    const info = this.responsiveElements.get(element);
    
    if (!info) return null;

    const overlay = document.createElement('div');
    overlay.className = 'rre-element-overlay';
    overlay.dataset.targetElement = this.getElementSelector(element);
    
    const color = options.color || '#00ff88';
    
    overlay.style.cssText = `
      position: fixed;
      top: ${rect.top}px;
      left: ${rect.left}px;
      width: ${rect.width}px;
      height: ${rect.height}px;
      border: 2px solid ${color};
      background: ${color}20;
      pointer-events: none;
      z-index: 999999;
      box-sizing: border-box;
    `;

    if (options.showTooltip) {
      const tooltip = this.createTooltip(info, options);
      overlay.appendChild(tooltip);
    }

    document.body.appendChild(overlay);
    return overlay;
  }

  /**
   * Create tooltip for element information
   */
  private createTooltip(info: ResponsiveElementInfo, options: HighlightOptions): HTMLElement {
    const tooltip = document.createElement('div');
    tooltip.className = 'rre-element-tooltip';
    
    tooltip.style.cssText = `
      position: absolute;
      top: -10px;
      left: 0;
      background: rgba(0, 0, 0, 0.9);
      color: white;
      padding: 8px 12px;
      border-radius: 4px;
      font-size: 12px;
      font-family: monospace;
      white-space: nowrap;
      z-index: 1000000;
      transform: translateY(-100%);
    `;

    let content = `<strong>${info.componentType}</strong>`;
    
    if (options.showScalingInfo && info.scalingInfo) {
      content += `<br>Scale: ${info.scalingInfo.currentScale.toFixed(2)}`;
      content += `<br>Values: ${Object.keys(info.responsiveValues).length}`;
    }

    if (info.performance) {
      content += `<br>Render: ${info.performance.renderTime.toFixed(1)}ms`;
    }

    tooltip.innerHTML = content;
    return tooltip;
  }

  /**
   * Handle breakpoint changes
   */
  private handleBreakpointChange(): void {
    const newBreakpoint = this.detectCurrentBreakpoint();
    
    if (newBreakpoint && newBreakpoint.name !== this.currentBreakpoint) {
      this.currentBreakpoint = newBreakpoint.name;
      this.showBreakpointInfo();
      this.updateElementHighlights();
      
      this.notifyExtension({
        type: 'breakpoint-changed',
        breakpoint: newBreakpoint
      });
    }
  }

  /**
   * Handle DOM changes
   */
  private handleDOMChange(mutation: MutationRecord): void {
    // Re-detect responsive elements when DOM changes
    if (mutation.type === 'childList') {
      mutation.addedNodes.forEach(node => {
        if (node instanceof HTMLElement) {
          this.scanForResponsiveElements(node);
        }
      });
    }

    // Update element info when attributes change
    if (mutation.type === 'attributes' && mutation.target instanceof HTMLElement) {
      const element = mutation.target;
      if (this.responsiveElements.has(element)) {
        const info = this.analyzeResponsiveElement(element);
        this.responsiveElements.set(element, info);
      }
    }
  }

  /**
   * Update element highlights when breakpoint changes
   */
  private updateElementHighlights(): void {
    // Remove old highlights
    this.overlayElements.forEach(overlay => {
      if (overlay.className === 'rre-element-overlay') {
        overlay.remove();
      }
    });
    this.overlayElements = this.overlayElements.filter(overlay => 
      overlay.className !== 'rre-element-overlay'
    );

    // Add new highlights
    this.highlightResponsiveElements();
  }

  /**
   * Detect current breakpoint
   */
  private detectCurrentBreakpoint(): BreakpointInfo | null {
    const width = window.innerWidth;
    const height = window.innerHeight;

    // Try to get breakpoint info from React Responsive Easy context
    const contextInfo = this.getResponsiveContextInfo();
    if (contextInfo) {
      return {
        name: contextInfo.currentBreakpoint?.name || 'unknown',
        width,
        height,
        scale: this.calculateScale(contextInfo),
        origin: contextInfo.config?.strategy?.origin || 'width',
        baseWidth: contextInfo.config?.base?.width || 1920,
        baseHeight: contextInfo.config?.base?.height || 1080
      };
    }

    // Fallback to standard breakpoints
    if (width <= 480) return { name: 'mobile', width, height, scale: 0.5, origin: 'width', baseWidth: 1920, baseHeight: 1080 };
    if (width <= 768) return { name: 'tablet', width, height, scale: 0.7, origin: 'width', baseWidth: 1920, baseHeight: 1080 };
    if (width <= 1024) return { name: 'laptop', width, height, scale: 0.85, origin: 'width', baseWidth: 1920, baseHeight: 1080 };
    return { name: 'desktop', width, height, scale: 1.0, origin: 'width', baseWidth: 1920, baseHeight: 1080 };
  }

  /**
   * Get responsive context information from React
   */
  private getResponsiveContextInfo(): any {
    // Try to access React Responsive Easy context
    // This would need to be injected via the content script
    return (window as any).__RRE_DEBUG_CONTEXT__;
  }

  /**
   * Calculate scaling factor
   */
  private calculateScale(contextInfo: any): number {
    if (!contextInfo.config) return 1.0;
    
    const base = contextInfo.config.base;
    const current = { width: window.innerWidth, height: window.innerHeight };
    
    switch (contextInfo.config.strategy?.origin) {
      case 'width':
        return current.width / base.width;
      case 'height':
        return current.height / base.height;
      case 'min':
        return Math.min(current.width / base.width, current.height / base.height);
      case 'max':
        return Math.max(current.width / base.width, current.height / base.height);
      default:
        return current.width / base.width;
    }
  }

  /**
   * Scan element tree for responsive elements
   */
  private scanForResponsiveElements(element: HTMLElement): void {
    if (element.hasAttribute('data-responsive')) {
      const info = this.analyzeResponsiveElement(element);
      this.responsiveElements.set(element, info);
    }

    // Recursively scan children
    Array.from(element.children).forEach(child => {
      if (child instanceof HTMLElement) {
        this.scanForResponsiveElements(child);
      }
    });
  }

  /**
   * Extract responsive values from element
   */
  private extractResponsiveValues(element: HTMLElement): Record<string, any> {
    const responsiveData = element.dataset.responsive;
    if (responsiveData) {
      try {
        return JSON.parse(responsiveData);
      } catch {
        console.warn('Failed to parse responsive data:', responsiveData);
      }
    }
    return {};
  }

  /**
   * Analyze breakpoint behavior
   */
  private analyzeBreakpointBehavior(element: HTMLElement): BreakpointBehavior {
    const styles = window.getComputedStyle(element);
    
    return {
      hasMediaQueries: this.hasMediaQueries(element),
      responsiveProperties: this.getResponsiveProperties(styles),
      scalingBehavior: this.getScalingBehavior(element)
    };
  }

  /**
   * Get scaling information for element
   */
  private getScalingInfo(element: HTMLElement): ScalingInfo | null {
    const responsiveValues = this.extractResponsiveValues(element);
    if (Object.keys(responsiveValues).length === 0) return null;

    const currentBreakpoint = this.detectCurrentBreakpoint();
    if (!currentBreakpoint) return null;

    return {
      currentScale: currentBreakpoint.scale,
      baseValues: responsiveValues.base || {},
      scaledValues: responsiveValues.scaled || {},
      scalingOrigin: currentBreakpoint.origin
    };
  }

  /**
   * Measure element performance
   */
  private measureElementPerformance(element: HTMLElement): PerformanceInfo {
    const start = performance.now();
    
    // Force a reflow to measure render time
    element.offsetHeight;
    
    const renderTime = performance.now() - start;

    return {
      renderTime,
      memoryUsage: this.estimateMemoryUsage(element),
      layoutShiftRisk: this.assessLayoutShiftRisk(element)
    };
  }

  /**
   * Estimate memory usage for element
   */
  private estimateMemoryUsage(element: HTMLElement): number {
    // Simplified estimation based on element complexity
    const children = element.getElementsByTagName('*').length;
    const styles = element.getAttribute('style')?.length || 0;
    return (children * 50) + styles + 100; // Base estimation
  }

  /**
   * Assess layout shift risk
   */
  private assessLayoutShiftRisk(element: HTMLElement): 'low' | 'medium' | 'high' {
    const rect = element.getBoundingClientRect();
    const styles = window.getComputedStyle(element);
    
    // High risk factors
    if (styles.position === 'absolute' || styles.position === 'fixed') return 'high';
    if (rect.width > window.innerWidth * 0.5) return 'medium';
    if (rect.height > window.innerHeight * 0.3) return 'medium';
    
    return 'low';
  }

  /**
   * Get element selector
   */
  private getElementSelector(element: HTMLElement): string {
    if (element.id) return `#${element.id}`;
    
    let selector = element.tagName.toLowerCase();
    if (element.className) {
      selector += `.${element.className.split(' ').join('.')}`;
    }
    
    return selector;
  }

  /**
   * Infer component type from element
   */
  private inferComponentType(element: HTMLElement): string {
    // Try to get React component name
    const reactKey = Object.keys(element).find(key => 
      key.startsWith('__reactInternalInstance') || key.startsWith('__reactFiber')
    );
    
    if (reactKey) {
      const fiber = (element as any)[reactKey];
      if (fiber && fiber.type && fiber.type.name) {
        return fiber.type.name;
      }
    }

    // Fallback to element analysis
    const tagName = element.tagName.toLowerCase();
    const className = element.className;
    
    if (className.includes('button')) return 'Button';
    if (className.includes('card')) return 'Card';
    if (className.includes('header')) return 'Header';
    if (className.includes('nav')) return 'Navigation';
    if (tagName === 'button') return 'Button';
    if (tagName === 'nav') return 'Navigation';
    if (tagName === 'header') return 'Header';
    if (tagName === 'main') return 'Main';
    
    return `${tagName.charAt(0).toUpperCase()}${tagName.slice(1)}`;
  }

  /**
   * Get element highlight color based on component info
   */
  private getElementHighlightColor(info: ResponsiveElementInfo): string {
    const colors = {
      'Button': '#ff6b6b',
      'Card': '#4ecdc4',
      'Header': '#45b7d1',
      'Navigation': '#f9ca24',
      'Main': '#6c5ce7',
      'default': '#00ff88'
    };
    
    return colors[info.componentType as keyof typeof colors] || colors.default;
  }

  /**
   * Make element draggable
   */
  private makeDraggable(element: HTMLElement): void {
    let isDragging = false;
    let startX = 0;
    let startY = 0;
    let startLeft = 0;
    let startTop = 0;

    const header = element.querySelector('.rre-debug-header') as HTMLElement;
    if (!header) return;

    header.style.cursor = 'move';

    header.addEventListener('mousedown', (e) => {
      isDragging = true;
      startX = e.clientX;
      startY = e.clientY;
      startLeft = element.offsetLeft;
      startTop = element.offsetTop;
      
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    });

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      
      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;
      
      element.style.left = `${startLeft + deltaX}px`;
      element.style.top = `${startTop + deltaY}px`;
    };

    const handleMouseUp = () => {
      isDragging = false;
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }

  /**
   * Notify extension of events
   */
  private notifyExtension(message: any): void {
    if (typeof chrome !== 'undefined' && chrome.runtime) {
      chrome.runtime.sendMessage(message);
    }
    
    // Also dispatch custom event for content script
    window.dispatchEvent(new CustomEvent('rre-debug-event', { detail: message }));
  }

  /**
   * Clean up all debug elements and observers
   */
  private cleanup(): void {
    // Remove overlay elements
    this.overlayElements.forEach(element => {
      if (element.parentNode) {
        element.parentNode.removeChild(element);
      }
    });
    this.overlayElements = [];

    // Disconnect observers
    this.observers.forEach(({ cleanup }) => cleanup());
    this.observers = [];

    // Clear data
    this.responsiveElements.clear();
    this.currentBreakpoint = null;
  }

  // Helper methods for React integration
  private findReactRoots(): any[] {
    const roots: any[] = [];
    
    // Look for React 18+ roots
    if ((window as any).__REACT_DEVTOOLS_GLOBAL_HOOK__) {
      const hook = (window as any).__REACT_DEVTOOLS_GLOBAL_HOOK__;
      if (hook.renderers) {
        hook.renderers.forEach((renderer: any) => {
          if (renderer.findFiberByHostInstance) {
            // This is a simplified approach
            const bodyFiber = renderer.findFiberByHostInstance(document.body);
            if (bodyFiber) roots.push(bodyFiber);
          }
        });
      }
    }
    
    return roots;
  }

  private traverseReactTree(fiber: any, callback: (fiber: any) => void): void {
    if (!fiber) return;
    
    callback(fiber);
    
    // Traverse children
    let child = fiber.child;
    while (child) {
      this.traverseReactTree(child, callback);
      child = child.sibling;
    }
  }

  private hasResponsiveHooks(fiber: any): boolean {
    if (!fiber.memoizedState) return false;
    
    // Look for hook signatures that match our responsive hooks
    let hook = fiber.memoizedState;
    while (hook) {
      if (hook.queue && hook.queue._dispatchSetState) {
        // This is a simplified check - in reality, we'd need more sophisticated detection
        return true;
      }
      hook = hook.next;
    }
    
    return false;
  }

  private hasMediaQueries(element: HTMLElement): boolean {
    // Check if element has CSS with media queries
    const sheets = Array.from(document.styleSheets);
    const selector = this.getElementSelector(element);
    
    for (const sheet of sheets) {
      try {
        const rules = Array.from(sheet.cssRules || []);
        for (const rule of rules) {
          if (rule instanceof CSSMediaRule) {
            const mediaRules = Array.from(rule.cssRules);
            if (mediaRules.some(r => r instanceof CSSStyleRule && r.selectorText.includes(selector))) {
              return true;
            }
          }
        }
      } catch {
        // Cross-origin stylesheets may throw errors
        continue;
      }
    }
    
    return false;
  }

  private getResponsiveProperties(styles: CSSStyleDeclaration): string[] {
    const responsiveProps = [];
    const props = ['fontSize', 'padding', 'margin', 'width', 'height', 'borderRadius'];
    
    for (const prop of props) {
      const value = styles.getPropertyValue(prop);
      if (value && (value.includes('rem') || value.includes('em') || value.includes('vw') || value.includes('vh'))) {
        responsiveProps.push(prop);
      }
    }
    
    return responsiveProps;
  }

  private getScalingBehavior(element: HTMLElement): 'static' | 'responsive' | 'adaptive' {
    const responsiveData = this.extractResponsiveValues(element);
    if (Object.keys(responsiveData).length > 0) return 'adaptive';
    
    const styles = window.getComputedStyle(element);
    const responsiveProps = this.getResponsiveProperties(styles);
    if (responsiveProps.length > 0) return 'responsive';
    
    return 'static';
  }
}

// Type definitions
export interface ResponsiveElementInfo {
  element: HTMLElement;
  selector: string;
  componentType: string;
  responsiveValues: Record<string, any>;
  currentStyles: Record<string, string>;
  breakpointBehavior: BreakpointBehavior;
  scalingInfo: ScalingInfo | null;
  performance: PerformanceInfo;
}

export interface BreakpointInfo {
  name: string;
  width: number;
  height: number;
  scale: number;
  origin: string;
  baseWidth: number;
  baseHeight: number;
}

export interface HighlightOptions {
  showTooltip?: boolean;
  showScalingInfo?: boolean;
  color?: string;
}

export interface BreakpointBehavior {
  hasMediaQueries: boolean;
  responsiveProperties: string[];
  scalingBehavior: 'static' | 'responsive' | 'adaptive';
}

export interface ScalingInfo {
  currentScale: number;
  baseValues: Record<string, any>;
  scaledValues: Record<string, any>;
  scalingOrigin: string;
}

export interface PerformanceInfo {
  renderTime: number;
  memoryUsage: number;
  layoutShiftRisk: 'low' | 'medium' | 'high';
}
