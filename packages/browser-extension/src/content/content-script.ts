import { ResponsiveDebugger } from '../core/ResponsiveDebugger';

/**
 * Content script for React Responsive Easy Browser Extension
 * 
 * This script runs in the context of web pages and provides the interface
 * between the extension and the responsive debugging functionality.
 */
class ContentScript {
  private debugger: ResponsiveDebugger | null = null;
  private isInjected = false;

  constructor() {
    this.init();
  }

  /**
   * Initialize the content script
   */
  private async init(): Promise<void> {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.setup());
    } else {
      this.setup();
    }

    // Listen for messages from the extension
    this.setupMessageListener();
    
    // Listen for debug events from the page
    this.setupDebugEventListener();
  }

  /**
   * Setup the content script after DOM is ready
   */
  private setup(): void {
    console.log('🔍 React Responsive Easy Extension loaded');
    
    // Inject the debugger script
    this.injectDebuggerScript();
    
    // Check if React Responsive Easy is present
    this.detectResponsiveEasy();
    
    // Setup periodic checks for responsive elements
    this.setupPeriodicChecks();
  }

  /**
   * Setup message listener for extension communication
   */
  private setupMessageListener(): void {
    chrome.runtime.onMessage.addListener((message, sender, __sendResponse) => {
      this.handleMessage(message, sender, __sendResponse);
      return true; // Keep message channel open for async responses
    });
  }

  /**
   * Setup debug event listener for page events
   */
  private setupDebugEventListener(): void {
    window.addEventListener('rre-debug-event', (event: Event) => {
      const customEvent = event as CustomEvent;
      this.handleDebugEvent(customEvent.detail);
    });
  }

  /**
   * Handle messages from the extension
   */
  private async handleMessage(
    message: any, 
    _sender: chrome.runtime.MessageSender, 
    __sendResponse: (response?: any) => void
  ): Promise<void> {
    try {
      switch (message.type) {
        case 'enable-debugger':
          await this.enableDebugger();
          __sendResponse({ success: true, enabled: true });
          break;

        case 'disable-debugger':
          await this.disableDebugger();
          __sendResponse({ success: true, enabled: false });
          break;

        case 'toggle-debugger':
          await this.toggleDebugger();
          __sendResponse({ 
            success: true, 
            enabled: this.debugger?.isDebuggerEnabled() || false 
          });
          break;

        case 'get-status':
          __sendResponse({
            success: true,
            enabled: this.debugger?.isDebuggerEnabled() || false,
            hasResponsiveEasy: this.hasResponsiveEasy(),
            elementCount: this.debugger?.getResponsiveElements().length || 0,
            currentBreakpoint: this.debugger?.getCurrentBreakpoint()
          });
          break;

        case 'get-responsive-elements': {
          const elements = this.debugger?.getResponsiveElements() || [];
          __sendResponse({
            success: true,
            elements: elements.map(el => ({
              selector: el.selector,
              componentType: el.componentType,
              responsiveValues: el.responsiveValues,
              currentStyles: el.currentStyles,
              performance: el.performance
            }))
          });
          break;
        }

        case 'highlight-element':
          await this.highlightElement(message.selector, message.options);
          __sendResponse({ success: true });
          break;

        case 'remove-highlight':
          await this.removeHighlight(message.selector);
          __sendResponse({ success: true });
          break;

        case 'analyze-performance': {
          const performanceData = await this.analyzePerformance();
          __sendResponse({ success: true, data: performanceData });
          break;
        }

        default:
          __sendResponse({ success: false, error: 'Unknown message type' });
      }
    } catch (error) {
      console.error('Content script error:', error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      __sendResponse({ success: false, error: errorMessage });
    }
  }

  /**
   * Handle debug events from the page
   */
  private handleDebugEvent(detail: any): void {
    // Forward debug events to the extension
    chrome.runtime.sendMessage({
      type: 'debug-event',
      detail
    });
  }

  /**
   * Inject the debugger script into the page
   */
  private injectDebuggerScript(): void {
    if (this.isInjected) return;

    try {
      // Inject CSS styles
      this.injectStyles();

      // Create and inject the debugger script
      const script = document.createElement('script');
      script.src = chrome.runtime.getURL('injected-script.js');
      script.onload = () => {
        this.isInjected = true;
        console.log('🔍 Debugger script injected successfully');
      };
      
      (document.head || document.documentElement).appendChild(script);
    } catch (error) {
      console.error('Failed to inject debugger script:', error);
      // Don't rethrow to prevent breaking the extension
    }
  }

  /**
   * Inject CSS styles for the debugger
   */
  private injectStyles(): void {
    try {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = chrome.runtime.getURL('overlay-styles.css');
      (document.head || document.documentElement).appendChild(link);
    } catch (error) {
      console.error('Failed to inject styles:', error);
      // Don't rethrow to prevent breaking the extension
    }
  }

  /**
   * Detect if React Responsive Easy is present on the page
   */
  private detectResponsiveEasy(): void {
    // Check for React Responsive Easy context or components
    const hasContext = !!(window as any).__RRE_DEBUG_CONTEXT__;
    
    // Safely check for responsive elements with error handling
    let hasResponsiveElements = false;
    try {
      const elements = document.querySelectorAll('[data-responsive]');
      hasResponsiveElements = elements && elements.length > 0;
    } catch (error) {
      console.warn('Failed to query responsive elements:', error);
      hasResponsiveElements = false;
    }
    
    const hasReactFiber = !!(window as any).__REACT_DEVTOOLS_GLOBAL_HOOK__;

    if (hasContext || hasResponsiveElements) {
      console.log('✅ React Responsive Easy detected');
      this.notifyExtension({
        type: 'responsive-easy-detected',
        hasContext,
        hasResponsiveElements,
        hasReactFiber,
        elementCount: document.querySelectorAll('[data-responsive]').length
      });
    } else {
      console.log('❌ React Responsive Easy not detected');
      this.notifyExtension({
        type: 'responsive-easy-not-detected'
      });
    }
  }

  /**
   * Check if React Responsive Easy is present
   */
  private hasResponsiveEasy(): boolean {
    const hasContext = !!(window as any).__RRE_DEBUG_CONTEXT__;
    
    // Safely check for responsive elements with error handling
    let hasResponsiveElements = false;
    try {
      const elements = document.querySelectorAll('[data-responsive]');
      hasResponsiveElements = elements && elements.length > 0;
    } catch (error) {
      console.warn('Failed to query responsive elements in hasResponsiveEasy:', error);
      hasResponsiveElements = false;
    }
    
    return hasContext || hasResponsiveElements;
  }

  /**
   * Setup periodic checks for responsive elements
   */
  private setupPeriodicChecks(): void {
    // Check every 5 seconds for new responsive elements
    setInterval(() => {
      // Safely get element count with error handling
      let elementCount = 0;
      try {
        const elements = document.querySelectorAll('[data-responsive]');
        elementCount = elements && elements.length ? elements.length : 0;
      } catch (error) {
        console.warn('Failed to query responsive elements in periodic check:', error);
        elementCount = 0;
      }
      
      const previousCount = this.debugger?.getResponsiveElements().length || 0;
      
      if (elementCount !== previousCount) {
        console.log(`🔍 Responsive elements changed: ${previousCount} → ${elementCount}`);
        this.notifyExtension({
          type: 'elements-changed',
          previousCount,
          currentCount: elementCount
        });
      }
    }, 5000);
  }

  /**
   * Enable the debugger
   */
  private async enableDebugger(): Promise<void> {
    if (!this.debugger) {
      // Wait for debugger to be available
      await this.waitForDebugger();
    }

    if (this.debugger) {
      this.debugger.enable();
      console.log('🔍 Debugger enabled');
    } else {
      throw new Error('Debugger not available');
    }
  }

  /**
   * Disable the debugger
   */
  private async disableDebugger(): Promise<void> {
    if (this.debugger) {
      this.debugger.disable();
      console.log('🔍 Debugger disabled');
    }
  }

  /**
   * Toggle the debugger
   */
  private async toggleDebugger(): Promise<void> {
    if (!this.debugger) {
      await this.enableDebugger();
    } else {
      this.debugger.toggle();
    }
  }

  /**
   * Highlight a specific element
   */
  private async highlightElement(selector: string, options: any = {}): Promise<void> {
    if (!this.debugger) return;

    const element = document.querySelector(selector) as HTMLElement;
    if (element) {
      this.debugger.highlightElement(element, options);
    }
  }

  /**
   * Remove highlight from element
   */
  private async removeHighlight(selector: string): Promise<void> {
    if (!this.debugger) return;

    const element = document.querySelector(selector) as HTMLElement;
    if (element) {
      this.debugger.removeHighlight(element);
    }
  }

  /**
   * Analyze performance of responsive elements
   */
  private async analyzePerformance(): Promise<any> {
    if (!this.debugger) return null;

    const elements = this.debugger.getResponsiveElements();
    const performanceData = {
      totalElements: elements.length,
      averageRenderTime: 0,
      memoryUsage: 0,
      layoutShiftRisk: { low: 0, medium: 0, high: 0 },
      elementDetails: [] as Array<{
        selector: string;
        componentType: string;
        renderTime: number;
        memoryUsage: number;
        layoutShiftRisk: string;
      }>
    };

    let totalRenderTime = 0;
    let totalMemoryUsage = 0;

    elements.forEach(element => {
      totalRenderTime += element.performance.renderTime;
      totalMemoryUsage += element.performance.memoryUsage;
      
      performanceData.layoutShiftRisk[element.performance.layoutShiftRisk]++;
      
      performanceData.elementDetails.push({
        selector: element.selector,
        componentType: element.componentType,
        renderTime: element.performance.renderTime,
        memoryUsage: element.performance.memoryUsage,
        layoutShiftRisk: element.performance.layoutShiftRisk
      });
    });

    if (elements.length > 0) {
      performanceData.averageRenderTime = totalRenderTime / elements.length;
      performanceData.memoryUsage = totalMemoryUsage;
    }

    return performanceData;
  }

  /**
   * Wait for debugger to be available in the page
   */
  private waitForDebugger(): Promise<void> {
    return new Promise((resolve, reject) => {
      const checkForDebugger = () => {
        const pageDebugger = (window as any).rreDebugger;
        if (pageDebugger) {
          this.debugger = pageDebugger;
          resolve();
        } else {
          setTimeout(checkForDebugger, 100);
        }
      };

      checkForDebugger();

      // Timeout after 10 seconds
      setTimeout(() => {
        if (!this.debugger) {
          reject(new Error('Debugger not available after timeout'));
        }
      }, 10000);
    });
  }

  /**
   * Notify the extension of events
   */
  private notifyExtension(message: any): void {
    chrome.runtime.sendMessage({
      type: 'content-script-event',
      ...message
    });
  }
}

// Initialize the content script
new ContentScript();

// Export for testing
export { ContentScript };
