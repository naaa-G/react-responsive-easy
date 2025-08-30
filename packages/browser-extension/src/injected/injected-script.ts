import { ResponsiveDebugger } from '../core/ResponsiveDebugger';

/**
 * Injected script for React Responsive Easy Browser Extension
 * 
 * This script runs in the page context and provides direct access
 * to the page's React components and responsive behavior.
 */
class InjectedScript {
  private debugger: ResponsiveDebugger;

  constructor() {
    this.debugger = new ResponsiveDebugger();
    this.init();
  }

  /**
   * Initialize the injected script
   */
  private init(): void {
    // Make debugger available globally
    (window as any).rreDebugger = this.debugger;
    
    // Setup React Responsive Easy integration
    this.setupResponsiveEasyIntegration();
    
    // Setup global keyboard shortcuts
    this.setupKeyboardShortcuts();
    
    // Setup performance monitoring
    this.setupPerformanceMonitoring();
    
    console.log('🔍 React Responsive Easy Debugger injected');
  }

  /**
   * Setup integration with React Responsive Easy
   */
  private setupResponsiveEasyIntegration(): void {
    // Hook into React Responsive Easy context if available
    this.hookIntoResponsiveContext();
    
    // Monitor for responsive elements
    this.monitorResponsiveElements();
    
    // Setup React DevTools integration
    this.setupReactDevToolsIntegration();
  }

  /**
   * Hook into React Responsive Easy context
   */
  private hookIntoResponsiveContext(): void {
    // Try to find and hook into the ResponsiveProvider context
    const React = (window as any).React;
    if (!React?.createElement) return;

    const originalCreateElement = React.createElement;
    const self = this;
    
    // Monkey patch React.createElement to detect ResponsiveProvider
    React.createElement = function(type: any, props: any, ...children: any[]) {
      // Check if this is a ResponsiveProvider
      if (type && type.displayName === 'ResponsiveProvider') {
        console.log('🔍 ResponsiveProvider detected', props);
        
        // Store context information for debugging
        (window as any).__RRE_DEBUG_CONTEXT__ = {
          config: props.config,
          initialBreakpoint: props.initialBreakpoint,
          debug: props.debug
        };
        
        // Enhance the provider with debugging capabilities
        const enhancedProps = {
          ...props,
          children: self.wrapWithDebugging(children, props.config)
        };
        
        return originalCreateElement.call(this, type, enhancedProps);
      }
      
      return originalCreateElement.call(this, type, props, ...children);
    };
  }

  /**
   * Wrap children with debugging capabilities
   */
  private wrapWithDebugging(children: any[], config: any): any[] {
    const React = (window as any).React;
    return React?.Children.map(children, (child: any) => {
      if (React?.isValidElement(child)) {
        return this.enhanceElementWithDebugging(child, config);
      }
      return child;
    }) || children;
  }

  /**
   * Enhance React element with debugging information
   */
  private enhanceElementWithDebugging(element: any, config: any): any {
    const React = (window as any).React;
    if (!React?.cloneElement) return element;

    // Add debugging props
    const debugProps = {
      'data-rre-debug': 'true',
      'data-rre-config': JSON.stringify({
        breakpoints: config?.breakpoints?.length || 0,
        origin: config?.strategy?.origin || 'unknown'
      })
    };

    return React.cloneElement(element, debugProps);
  }

  /**
   * Monitor for responsive elements on the page
   */
  private monitorResponsiveElements(): void {
    // Use MutationObserver to watch for responsive elements
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach((node) => {
            if (node instanceof HTMLElement) {
              this.scanForResponsiveElements(node);
            }
          });
        }
        
        if (mutation.type === 'attributes' && 
            mutation.attributeName === 'data-responsive') {
          const element = mutation.target as HTMLElement;
          this.handleResponsiveElementChange(element);
        }
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['data-responsive', 'style', 'class']
    });
  }

  /**
   * Scan element tree for responsive elements
   */
  private scanForResponsiveElements(element: HTMLElement): void {
    // Check if element has responsive attributes
    if (element.hasAttribute('data-responsive')) {
      this.enhanceResponsiveElement(element);
    }

    // Recursively scan children
    Array.from(element.children).forEach(child => {
      if (child instanceof HTMLElement) {
        this.scanForResponsiveElements(child);
      }
    });
  }

  /**
   * Enhance responsive element with debugging capabilities
   */
  private enhanceResponsiveElement(element: HTMLElement): void {
    // Add debugging attributes
    element.setAttribute('data-rre-enhanced', 'true');
    
    // Store original styles for comparison
    const originalStyles = {
      fontSize: window.getComputedStyle(element).fontSize,
      padding: window.getComputedStyle(element).padding,
      margin: window.getComputedStyle(element).margin
    };
    
    element.setAttribute('data-rre-original-styles', JSON.stringify(originalStyles));
    
    // Add event listeners for debugging
    this.addDebugEventListeners(element);
  }

  /**
   * Add debug event listeners to element
   */
  private addDebugEventListeners(element: HTMLElement): void {
    // Mouse events for inspection
    element.addEventListener('mouseenter', (e) => {
      if (this.debugger.isDebuggerEnabled()) {
        this.showElementTooltip(element, e);
      }
    });

    element.addEventListener('mouseleave', () => {
      this.hideElementTooltip(element);
    });

    element.addEventListener('click', (e) => {
      if (this.debugger.isDebuggerEnabled() && e.ctrlKey) {
        e.preventDefault();
        e.stopPropagation();
        this.inspectElement(element);
      }
    });
  }

  /**
   * Show element tooltip on hover
   */
  private showElementTooltip(element: HTMLElement, event: MouseEvent): void {
    const tooltip = document.createElement('div');
    tooltip.className = 'rre-debug-tooltip';
    tooltip.innerHTML = this.generateTooltipContent(element);
    
    tooltip.style.cssText = `
      position: fixed;
      top: ${event.clientY + 10}px;
      left: ${event.clientX + 10}px;
      background: rgba(0, 0, 0, 0.9);
      color: white;
      padding: 8px 12px;
      border-radius: 4px;
      font-size: 12px;
      font-family: monospace;
      z-index: 1000001;
      pointer-events: none;
      max-width: 300px;
      word-wrap: break-word;
    `;

    document.body.appendChild(tooltip);
    element.setAttribute('data-rre-tooltip', 'active');
  }

  /**
   * Hide element tooltip
   */
  private hideElementTooltip(element: HTMLElement): void {
    const tooltip = document.querySelector('.rre-debug-tooltip');
    if (tooltip) {
      tooltip.remove();
    }
    element.removeAttribute('data-rre-tooltip');
  }

  /**
   * Generate tooltip content for element
   */
  private generateTooltipContent(element: HTMLElement): string {
    const responsiveData = element.dataset.responsive;
    const styles = window.getComputedStyle(element);
    const rect = element.getBoundingClientRect();
    
    let content = `<strong>Responsive Element</strong><br>`;
    content += `Tag: ${element.tagName.toLowerCase()}<br>`;
    content += `Size: ${Math.round(rect.width)}×${Math.round(rect.height)}<br>`;
    content += `Font: ${styles.fontSize}<br>`;
    
    if (responsiveData) {
      try {
        const data = JSON.parse(responsiveData);
        content += `Values: ${Object.keys(data).length}<br>`;
      } catch (e) {
        content += `Data: Invalid JSON<br>`;
      }
    }
    
    content += `<small>Ctrl+Click to inspect</small>`;
    
    return content;
  }

  /**
   * Inspect element in detail
   */
  private inspectElement(element: HTMLElement): void {
    const elementInfo = {
      tagName: element.tagName.toLowerCase(),
      className: element.className,
      id: element.id,
      responsiveData: element.dataset.responsive,
      computedStyles: {
        fontSize: window.getComputedStyle(element).fontSize,
        padding: window.getComputedStyle(element).padding,
        margin: window.getComputedStyle(element).margin,
        width: window.getComputedStyle(element).width,
        height: window.getComputedStyle(element).height
      },
      boundingRect: element.getBoundingClientRect(),
      attributes: Array.from(element.attributes).reduce((acc, attr) => {
        acc[attr.name] = attr.value;
        return acc;
      }, {} as Record<string, string>)
    };

    console.group('🔍 Element Inspection');
    console.log('Element:', element);
    console.log('Info:', elementInfo);
    console.groupEnd();

    // Send to extension
    window.dispatchEvent(new CustomEvent('rre-debug-event', {
      detail: {
        type: 'element-inspected',
        elementInfo
      }
    }));
  }

  /**
   * Handle responsive element changes
   */
  private handleResponsiveElementChange(element: HTMLElement): void {
    console.log('🔍 Responsive element changed:', element);
    
    // Re-enhance the element
    this.enhanceResponsiveElement(element);
    
    // Notify debugger
    if (this.debugger.isDebuggerEnabled()) {
      // Force update of element highlighting
      setTimeout(() => {
        this.debugger.disable();
        this.debugger.enable();
      }, 100);
    }
  }

  /**
   * Setup React DevTools integration
   */
  private setupReactDevToolsIntegration(): void {
    // Hook into React DevTools if available
    if ((window as any).__REACT_DEVTOOLS_GLOBAL_HOOK__) {
      const hook = (window as any).__REACT_DEVTOOLS_GLOBAL_HOOK__;
      
      // Listen for React component updates
      hook.onCommitFiberRoot = (id: any, root: any, priorityLevel: any) => {
        // Check if this commit involved responsive components
        this.checkForResponsiveUpdates(root);
      };
    }
  }

  /**
   * Check for responsive component updates
   */
  private checkForResponsiveUpdates(root: any): void {
    // This is a simplified check - in a real implementation,
    // we'd traverse the fiber tree to find responsive components
    const responsiveElements = document.querySelectorAll('[data-responsive]');
    
    if (responsiveElements.length > 0) {
      window.dispatchEvent(new CustomEvent('rre-debug-event', {
        detail: {
          type: 'responsive-update',
          elementCount: responsiveElements.length
        }
      }));
    }
  }

  /**
   * Setup global keyboard shortcuts
   */
  private setupKeyboardShortcuts(): void {
    document.addEventListener('keydown', (e) => {
      // Ctrl+Shift+R to toggle debugger
      if (e.ctrlKey && e.shiftKey && e.key === 'R') {
        e.preventDefault();
        this.debugger.toggle();
      }
      
      // Ctrl+Shift+H to toggle highlighting
      if (e.ctrlKey && e.shiftKey && e.key === 'H') {
        e.preventDefault();
        if (this.debugger.isDebuggerEnabled()) {
          this.debugger.disable();
        } else {
          this.debugger.enable();
        }
      }
    });
  }

  /**
   * Setup performance monitoring
   */
  private setupPerformanceMonitoring(): void {
    // Monitor for layout shifts
    if ('LayoutShift' in window) {
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry: any) => {
          if (entry.entryType === 'layout-shift' && entry.value > 0.1) {
            console.warn('🔍 Layout shift detected:', entry.value);
            
            // Try to identify which elements caused the shift
            entry.sources?.forEach((source: any) => {
              const element = source.node;
              if (element && element.hasAttribute('data-responsive')) {
                console.warn('🔍 Layout shift from responsive element:', element);
              }
            });
          }
        });
      });

      try {
        observer.observe({ entryTypes: ['layout-shift'] });
      } catch (e) {
        console.warn('Layout shift monitoring not available');
      }
    }

    // Monitor paint timing
    if (window.PerformanceObserver) {
      const paintObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          if (entry.entryType === 'paint') {
            console.log(`🔍 ${entry.name}: ${entry.startTime}ms`);
          }
        });
      });

      try {
        paintObserver.observe({ entryTypes: ['paint'] });
      } catch (e) {
        console.warn('Paint timing monitoring not available');
      }
    }
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new InjectedScript();
  });
} else {
  new InjectedScript();
}

// Export for testing
export { InjectedScript };
