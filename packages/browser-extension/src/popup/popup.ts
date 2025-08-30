/**
 * Popup script for React Responsive Easy Browser Extension
 * 
 * This script handles the popup interface and communication with content scripts.
 */
class PopupController {
  private currentTab: chrome.tabs.Tab | null = null;
  private debuggerEnabled = false;
  private rreDetected = false;
  private elements: any[] = [];
  private performanceData: any = null;

  constructor() {
    this.init();
  }

  /**
   * Initialize the popup
   */
  private async init(): Promise<void> {
    // Get current active tab
    await this.getCurrentTab();
    
    // Setup event listeners
    this.setupEventListeners();
    
    // Load initial status
    await this.loadStatus();
    
    // Setup periodic updates
    this.setupPeriodicUpdates();
  }

  /**
   * Get current active tab
   */
  private async getCurrentTab(): Promise<void> {
    try {
      const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
      this.currentTab = tabs[0] || null;
    } catch (error) {
      console.error('Failed to get current tab:', error);
    }
  }

  /**
   * Setup event listeners for popup controls
   */
  private setupEventListeners(): void {
    // Toggle debugger
    const toggleBtn = document.getElementById('toggle-debugger') as HTMLButtonElement;
    toggleBtn?.addEventListener('click', () => this.toggleDebugger());

    // Highlight elements
    const highlightBtn = document.getElementById('highlight-elements') as HTMLButtonElement;
    highlightBtn?.addEventListener('click', () => this.toggleHighlighting());

    // Analyze performance
    const performanceBtn = document.getElementById('analyze-performance') as HTMLButtonElement;
    performanceBtn?.addEventListener('click', () => this.analyzePerformance());

    // Reload page
    const reloadBtn = document.getElementById('reload-page') as HTMLButtonElement;
    reloadBtn?.addEventListener('click', () => this.reloadPage());

    // Open DevTools
    const devtoolsBtn = document.getElementById('open-devtools') as HTMLButtonElement;
    devtoolsBtn?.addEventListener('click', () => this.openDevTools());

    // Export data
    const exportBtn = document.getElementById('export-data') as HTMLButtonElement;
    exportBtn?.addEventListener('click', () => this.exportData());

    // Settings
    const settingsBtn = document.getElementById('settings') as HTMLButtonElement;
    settingsBtn?.addEventListener('click', () => this.openSettings());
  }

  /**
   * Load current status from content script
   */
  private async loadStatus(): Promise<void> {
    if (!this.currentTab?.id) return;

    try {
      const response = await this.sendMessage({ type: 'get-status' });
      
      if (response.success) {
        this.updateStatus(response);
        await this.loadBreakpointInfo();
        await this.loadElementsInfo();
      } else {
        this.showError('Failed to load status');
      }
    } catch (error) {
      console.error('Failed to load status:', error);
      this.showError('Extension not available on this page');
    }
  }

  /**
   * Update UI based on status response
   */
  private updateStatus(status: any): void {
    this.debuggerEnabled = status.enabled;
    this.rreDetected = status.hasResponsiveEasy;

    // Update debugger status
    const debuggerStatus = document.getElementById('debugger-status');
    if (debuggerStatus) {
      debuggerStatus.textContent = status.enabled ? 'Active' : 'Inactive';
      debuggerStatus.className = `status-value ${status.enabled ? 'active' : 'inactive'}`;
    }

    // Update RRE detection status
    const rreStatus = document.getElementById('rre-status');
    if (rreStatus) {
      rreStatus.textContent = status.hasResponsiveEasy ? 'Detected' : 'Not Found';
      rreStatus.className = `status-value ${status.hasResponsiveEasy ? 'detected' : 'not-detected'}`;
    }

    // Update toggle button
    const toggleBtn = document.getElementById('toggle-debugger') as HTMLButtonElement;
    if (toggleBtn) {
      toggleBtn.disabled = false;
      toggleBtn.querySelector('.btn-text')!.textContent = status.enabled ? 'Disable Debugger' : 'Enable Debugger';
      toggleBtn.className = `btn ${status.enabled ? 'btn-danger' : 'btn-primary'}`;
    }

    // Enable/disable action buttons
    const actionButtons = document.querySelectorAll('.btn-secondary, #export-data');
    actionButtons.forEach(btn => {
      (btn as HTMLButtonElement).disabled = !status.hasResponsiveEasy;
    });
  }

  /**
   * Load breakpoint information
   */
  private async loadBreakpointInfo(): Promise<void> {
    if (!this.currentTab?.id) return;

    try {
      const response = await this.sendMessage({ type: 'get-status' });
      
      if (response.success && response.currentBreakpoint) {
        this.updateBreakpointInfo(response.currentBreakpoint);
      } else {
        this.showNoBreakpointInfo();
      }
    } catch (error) {
      console.error('Failed to load breakpoint info:', error);
      this.showNoBreakpointInfo();
    }
  }

  /**
   * Update breakpoint information display
   */
  private updateBreakpointInfo(breakpoint: any): void {
    const breakpointInfo = document.getElementById('breakpoint-info');
    if (!breakpointInfo) return;

    breakpointInfo.innerHTML = `
      <div class="breakpoint-details">
        <div class="breakpoint-name">${breakpoint.name}</div>
        <div class="breakpoint-size">${breakpoint.width}×${breakpoint.height}</div>
        <div class="breakpoint-scale">Scale: ${breakpoint.scale.toFixed(2)}</div>
        <div class="breakpoint-origin">Origin: ${breakpoint.origin}</div>
      </div>
    `;
  }

  /**
   * Show no breakpoint info message
   */
  private showNoBreakpointInfo(): void {
    const breakpointInfo = document.getElementById('breakpoint-info');
    if (breakpointInfo) {
      breakpointInfo.innerHTML = '<div class="no-data">No breakpoint detected</div>';
    }
  }

  /**
   * Load responsive elements information
   */
  private async loadElementsInfo(): Promise<void> {
    if (!this.currentTab?.id) return;

    try {
      const response = await this.sendMessage({ type: 'get-responsive-elements' });
      
      if (response.success) {
        this.elements = response.elements || [];
        this.updateElementsInfo();
      } else {
        this.showNoElementsInfo();
      }
    } catch (error) {
      console.error('Failed to load elements info:', error);
      this.showNoElementsInfo();
    }
  }

  /**
   * Update elements information display
   */
  private updateElementsInfo(): void {
    const elementsInfo = document.getElementById('elements-info');
    if (!elementsInfo) return;

    if (this.elements.length === 0) {
      elementsInfo.innerHTML = '<div class="no-data">No responsive elements found</div>';
      return;
    }

    const elementsByType = this.groupElementsByType();
    
    let html = `<div class="elements-summary">Found ${this.elements.length} elements</div>`;
    html += '<div class="elements-breakdown">';
    
    Object.entries(elementsByType).forEach(([type, count]) => {
      html += `
        <div class="element-type">
          <span class="type-name">${type}</span>
          <span class="type-count">${count}</span>
        </div>
      `;
    });
    
    html += '</div>';
    elementsInfo.innerHTML = html;
  }

  /**
   * Group elements by component type
   */
  private groupElementsByType(): Record<string, number> {
    const grouped: Record<string, number> = {};
    
    this.elements.forEach(element => {
      const type = element.componentType || 'Unknown';
      grouped[type] = (grouped[type] || 0) + 1;
    });
    
    return grouped;
  }

  /**
   * Show no elements info message
   */
  private showNoElementsInfo(): void {
    const elementsInfo = document.getElementById('elements-info');
    if (elementsInfo) {
      elementsInfo.innerHTML = '<div class="no-data">No responsive elements found</div>';
    }
  }

  /**
   * Toggle debugger on/off
   */
  private async toggleDebugger(): Promise<void> {
    if (!this.currentTab?.id) return;

    try {
      const response = await this.sendMessage({ type: 'toggle-debugger' });
      
      if (response.success) {
        this.debuggerEnabled = response.enabled;
        await this.loadStatus();
        
        // Show success message
        this.showMessage(
          response.enabled ? 'Debugger enabled' : 'Debugger disabled',
          'success'
        );
      } else {
        this.showError(response.error || 'Failed to toggle debugger');
      }
    } catch (error) {
      console.error('Failed to toggle debugger:', error);
      this.showError('Failed to communicate with page');
    }
  }

  /**
   * Toggle element highlighting
   */
  private async toggleHighlighting(): Promise<void> {
    if (!this.debuggerEnabled) {
      await this.toggleDebugger();
      return;
    }

    this.showMessage('Highlighting toggled', 'info');
  }

  /**
   * Analyze performance
   */
  private async analyzePerformance(): Promise<void> {
    if (!this.currentTab?.id) return;

    try {
      const response = await this.sendMessage({ type: 'analyze-performance' });
      
      if (response.success) {
        this.performanceData = response.data;
        this.showPerformanceInfo();
        
        this.showMessage('Performance analysis complete', 'success');
      } else {
        this.showError(response.error || 'Failed to analyze performance');
      }
    } catch (error) {
      console.error('Failed to analyze performance:', error);
      this.showError('Performance analysis failed');
    }
  }

  /**
   * Show performance information
   */
  private showPerformanceInfo(): void {
    const performanceCard = document.getElementById('performance-card');
    const performanceInfo = document.getElementById('performance-info');
    
    if (!performanceCard || !performanceInfo || !this.performanceData) return;

    performanceCard.style.display = 'block';
    
    const data = this.performanceData;
    
    performanceInfo.innerHTML = `
      <div class="performance-summary">
        <div class="perf-metric">
          <span class="metric-label">Total Elements:</span>
          <span class="metric-value">${data.totalElements}</span>
        </div>
        <div class="perf-metric">
          <span class="metric-label">Avg Render Time:</span>
          <span class="metric-value">${data.averageRenderTime.toFixed(2)}ms</span>
        </div>
        <div class="perf-metric">
          <span class="metric-label">Memory Usage:</span>
          <span class="metric-value">${(data.memoryUsage / 1024).toFixed(1)}KB</span>
        </div>
      </div>
      
      <div class="layout-shift-risk">
        <h4>Layout Shift Risk</h4>
        <div class="risk-breakdown">
          <div class="risk-item low">Low: ${data.layoutShiftRisk.low}</div>
          <div class="risk-item medium">Medium: ${data.layoutShiftRisk.medium}</div>
          <div class="risk-item high">High: ${data.layoutShiftRisk.high}</div>
        </div>
      </div>
    `;
  }

  /**
   * Reload current page
   */
  private async reloadPage(): Promise<void> {
    if (!this.currentTab?.id) return;

    try {
      await chrome.tabs.reload(this.currentTab.id);
      this.showMessage('Page reloaded', 'info');
      
      // Close popup after reload
      setTimeout(() => window.close(), 1000);
    } catch (error) {
      console.error('Failed to reload page:', error);
      this.showError('Failed to reload page');
    }
  }

  /**
   * Open Chrome DevTools
   */
  private async openDevTools(): Promise<void> {
    if (!this.currentTab?.id) return;

    try {
      // This requires debugger permission in manifest
      await chrome.debugger.attach({ tabId: this.currentTab.id }, '1.0');
      await chrome.debugger.sendCommand({ tabId: this.currentTab.id }, 'Runtime.evaluate', {
        expression: 'console.log("React Responsive Easy DevTools opened");'
      });
      await chrome.debugger.detach({ tabId: this.currentTab.id });
      
      this.showMessage('DevTools opened', 'info');
    } catch (error) {
      console.error('Failed to open DevTools:', error);
      // Fallback: try to open DevTools panel
      this.openDevToolsPanel();
    }
  }

  /**
   * Open DevTools panel (fallback)
   */
  private openDevToolsPanel(): void {
    // Create a new tab with DevTools instructions
    chrome.tabs.create({
      url: chrome.runtime.getURL('devtools-panel.html')
    });
  }

  /**
   * Export debugging data
   */
  private async exportData(): Promise<void> {
    if (!this.elements.length && !this.performanceData) {
      this.showError('No data to export');
      return;
    }

    const exportData = {
      timestamp: new Date().toISOString(),
      url: this.currentTab?.url,
      elements: this.elements,
      performance: this.performanceData,
      debuggerEnabled: this.debuggerEnabled,
      rreDetected: this.rreDetected
    };

    try {
      const dataStr = JSON.stringify(exportData, null, 2);
      const blob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `rre-debug-data-${Date.now()}.json`;
      a.click();
      
      URL.revokeObjectURL(url);
      
      this.showMessage('Data exported successfully', 'success');
    } catch (error) {
      console.error('Failed to export data:', error);
      this.showError('Failed to export data');
    }
  }

  /**
   * Open settings page
   */
  private openSettings(): void {
    chrome.tabs.create({
      url: chrome.runtime.getURL('settings.html')
    });
  }

  /**
   * Setup periodic updates
   */
  private setupPeriodicUpdates(): void {
    // Update status every 5 seconds
    setInterval(async () => {
      if (this.rreDetected) {
        await this.loadElementsInfo();
      }
    }, 5000);
  }

  /**
   * Send message to content script
   */
  private async sendMessage(message: any): Promise<any> {
    if (!this.currentTab?.id) {
      throw new Error('No active tab');
    }

    return new Promise((resolve, reject) => {
      chrome.tabs.sendMessage(this.currentTab!.id!, message, (response) => {
        if (chrome.runtime.lastError) {
          reject(new Error(chrome.runtime.lastError.message));
        } else {
          resolve(response);
        }
      });
    });
  }

  /**
   * Show success/info message
   */
  private showMessage(message: string, type: 'success' | 'info' | 'warning' = 'info'): void {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    
    toast.style.cssText = `
      position: fixed;
      top: 10px;
      right: 10px;
      padding: 8px 12px;
      border-radius: 4px;
      color: white;
      font-size: 12px;
      z-index: 10000;
      animation: slideIn 0.3s ease-out;
    `;
    
    switch (type) {
      case 'success':
        toast.style.backgroundColor = '#4CAF50';
        break;
      case 'warning':
        toast.style.backgroundColor = '#FF9800';
        break;
      default:
        toast.style.backgroundColor = '#2196F3';
    }
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.remove();
    }, 3000);
  }

  /**
   * Show error message
   */
  private showError(message: string): void {
    const toast = document.createElement('div');
    toast.className = 'toast toast-error';
    toast.textContent = message;
    
    toast.style.cssText = `
      position: fixed;
      top: 10px;
      right: 10px;
      padding: 8px 12px;
      border-radius: 4px;
      background-color: #f44336;
      color: white;
      font-size: 12px;
      z-index: 10000;
      animation: slideIn 0.3s ease-out;
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.remove();
    }, 4000);
  }
}

// Initialize popup when DOM is loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new PopupController();
  });
} else {
  new PopupController();
}

// Export for testing
export { PopupController };
