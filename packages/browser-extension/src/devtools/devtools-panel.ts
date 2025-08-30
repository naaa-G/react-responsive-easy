/**
 * DevTools Panel for React Responsive Easy Browser Extension
 */
class DevToolsPanel {
  private selectedElement: any = null;
  private elements: any[] = [];
  private performanceData: any = null;
  private consoleMessages: any[] = [];

  constructor() {
    this.init();
  }

  private async init(): Promise<void> {
    // Setup event listeners
    this.setupEventListeners();
    
    // Load initial data
    await this.loadData();
    
    // Setup periodic updates
    this.setupPeriodicUpdates();
    
    console.log('🛠️ DevTools panel initialized');
  }

  private setupEventListeners(): void {
    // Refresh button
    document.getElementById('refresh-data')?.addEventListener('click', () => {
      this.loadData();
    });

    // Tab switching
    document.querySelectorAll('.tab-button').forEach(button => {
      button.addEventListener('click', (e) => {
        const tabName = (e.target as HTMLElement).dataset.tab;
        if (tabName) {
          this.switchTab(tabName);
        }
      });
    });

    // Inspector controls
    document.getElementById('highlight-element')?.addEventListener('click', () => {
      this.highlightSelectedElement();
    });

    document.getElementById('copy-styles')?.addEventListener('click', () => {
      this.copyElementStyles();
    });
  }

  private async loadData(): Promise<void> {
    try {
      // Get data from content script
      const response = await this.sendMessageToContentScript({
        type: 'get-devtools-data'
      });

      if (response.success) {
        this.updateStatus(response.status);
        this.updateElementsTree(response.elements);
        this.updateBreakpointsList(response.breakpoints);
        this.updatePerformanceData(response.performance);
      }
    } catch (error) {
      console.error('Failed to load data:', error);
      this.showError('Failed to load data from page');
    }
  }

  private updateStatus(status: any): void {
    // Update debugger status
    const debuggerStatus = document.getElementById('debugger-status');
    if (debuggerStatus) {
      debuggerStatus.textContent = status.debuggerEnabled ? 'Active' : 'Inactive';
      debuggerStatus.className = `status-value ${status.debuggerEnabled ? 'active' : 'inactive'}`;
    }

    // Update element count
    const elementCount = document.getElementById('element-count');
    if (elementCount) {
      elementCount.textContent = status.elementCount.toString();
    }

    // Update current breakpoint
    const currentBreakpoint = document.getElementById('current-breakpoint');
    if (currentBreakpoint) {
      currentBreakpoint.textContent = status.currentBreakpoint?.name || 'Unknown';
    }
  }

  private updateElementsTree(elements: any[]): void {
    this.elements = elements;
    const elementsTree = document.getElementById('elements-tree');
    
    if (!elementsTree) return;

    if (elements.length === 0) {
      elementsTree.innerHTML = '<div class="no-data">No responsive elements found</div>';
      return;
    }

    // Build tree structure
    const treeHtml = this.buildElementsTreeHtml(elements);
    elementsTree.innerHTML = treeHtml;

    // Add click handlers
    elementsTree.querySelectorAll('.element-node').forEach(node => {
      node.addEventListener('click', (e) => {
        e.stopPropagation();
        const elementId = (e.currentTarget as HTMLElement).dataset.elementId;
        const element = elements.find(el => el.selector === elementId);
        if (element) {
          this.selectElement(element);
        }
      });
    });
  }

  private buildElementsTreeHtml(elements: any[]): string {
    let html = '<div class="tree-root">';
    
    elements.forEach(element => {
      html += `
        <div class="element-node" data-element-id="${element.selector}">
          <div class="element-header">
            <span class="element-type">${element.componentType}</span>
            <span class="element-selector">${element.selector}</span>
            <span class="element-values">${Object.keys(element.responsiveValues).length} values</span>
          </div>
          <div class="element-details">
            <div class="detail-item">
              <span class="detail-label">Render Time:</span>
              <span class="detail-value">${element.performance.renderTime.toFixed(1)}ms</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Layout Risk:</span>
              <span class="detail-value ${element.performance.layoutShiftRisk}">${element.performance.layoutShiftRisk}</span>
            </div>
          </div>
        </div>
      `;
    });
    
    html += '</div>';
    return html;
  }

  private updateBreakpointsList(breakpoints: any[]): void {
    const breakpointsList = document.getElementById('breakpoints-list');
    
    if (!breakpointsList) return;

    if (!breakpoints || breakpoints.length === 0) {
      breakpointsList.innerHTML = '<div class="no-data">No breakpoints configured</div>';
      return;
    }

    let html = '';
    breakpoints.forEach(bp => {
      html += `
        <div class="breakpoint-item ${bp.active ? 'active' : ''}">
          <div class="breakpoint-name">${bp.name}</div>
          <div class="breakpoint-size">${bp.width}×${bp.height}</div>
          <div class="breakpoint-scale">Scale: ${bp.scale.toFixed(2)}</div>
        </div>
      `;
    });

    breakpointsList.innerHTML = html;
  }

  private updatePerformanceData(performance: any): void {
    this.performanceData = performance;
    const performanceMetrics = document.getElementById('performance-metrics');
    
    if (!performanceMetrics || !performance) return;

    performanceMetrics.innerHTML = `
      <div class="metrics-grid">
        <div class="metric-card">
          <div class="metric-title">Total Elements</div>
          <div class="metric-value">${performance.totalElements}</div>
        </div>
        
        <div class="metric-card">
          <div class="metric-title">Average Render Time</div>
          <div class="metric-value">${performance.averageRenderTime.toFixed(2)}ms</div>
        </div>
        
        <div class="metric-card">
          <div class="metric-title">Memory Usage</div>
          <div class="metric-value">${(performance.memoryUsage / 1024).toFixed(1)}KB</div>
        </div>
        
        <div class="metric-card">
          <div class="metric-title">Layout Shift Risk</div>
          <div class="metric-value">
            <div class="risk-indicator">
              <span class="risk-low">${performance.layoutShiftRisk.low}</span>
              <span class="risk-medium">${performance.layoutShiftRisk.medium}</span>
              <span class="risk-high">${performance.layoutShiftRisk.high}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div class="performance-chart">
        <h4>Performance Timeline</h4>
        <div class="chart-placeholder">
          Performance chart would be rendered here
        </div>
      </div>
    `;
  }

  private selectElement(element: any): void {
    this.selectedElement = element;
    
    // Update selected state in tree
    document.querySelectorAll('.element-node').forEach(node => {
      node.classList.remove('selected');
    });
    
    const selectedNode = document.querySelector(`[data-element-id="${element.selector}"]`);
    selectedNode?.classList.add('selected');
    
    // Update inspector panel
    this.updateInspectorPanel(element);
  }

  private updateInspectorPanel(element: any): void {
    const inspectorContent = document.getElementById('inspector-content');
    
    if (!inspectorContent) return;

    inspectorContent.innerHTML = `
      <div class="inspector-sections">
        <!-- Element Info -->
        <div class="inspector-section">
          <h4>Element Information</h4>
          <div class="info-grid">
            <div class="info-item">
              <span class="info-label">Component Type:</span>
              <span class="info-value">${element.componentType}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Selector:</span>
              <span class="info-value">${element.selector}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Responsive Values:</span>
              <span class="info-value">${Object.keys(element.responsiveValues).length}</span>
            </div>
          </div>
        </div>

        <!-- Current Styles -->
        <div class="inspector-section">
          <h4>Current Styles</h4>
          <div class="styles-grid">
            ${Object.entries(element.currentStyles).map(([prop, value]) => `
              <div class="style-item">
                <span class="style-property">${prop}:</span>
                <span class="style-value">${value}</span>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Responsive Values -->
        <div class="inspector-section">
          <h4>Responsive Values</h4>
          <div class="responsive-values">
            ${Object.keys(element.responsiveValues).length > 0 
              ? Object.entries(element.responsiveValues).map(([key, value]) => `
                  <div class="responsive-item">
                    <span class="responsive-key">${key}:</span>
                    <span class="responsive-value">${JSON.stringify(value)}</span>
                  </div>
                `).join('')
              : '<div class="no-data">No responsive values found</div>'
            }
          </div>
        </div>

        <!-- Performance -->
        <div class="inspector-section">
          <h4>Performance Metrics</h4>
          <div class="performance-grid">
            <div class="perf-item">
              <span class="perf-label">Render Time:</span>
              <span class="perf-value">${element.performance.renderTime.toFixed(1)}ms</span>
            </div>
            <div class="perf-item">
              <span class="perf-label">Memory Usage:</span>
              <span class="perf-value">${(element.performance.memoryUsage / 1024).toFixed(1)}KB</span>
            </div>
            <div class="perf-item">
              <span class="perf-label">Layout Shift Risk:</span>
              <span class="perf-value ${element.performance.layoutShiftRisk}">${element.performance.layoutShiftRisk}</span>
            </div>
          </div>
        </div>

        <!-- Scaling Information -->
        ${element.scalingInfo ? `
          <div class="inspector-section">
            <h4>Scaling Information</h4>
            <div class="scaling-info">
              <div class="scaling-item">
                <span class="scaling-label">Current Scale:</span>
                <span class="scaling-value">${element.scalingInfo.currentScale.toFixed(2)}</span>
              </div>
              <div class="scaling-item">
                <span class="scaling-label">Origin:</span>
                <span class="scaling-value">${element.scalingInfo.scalingOrigin}</span>
              </div>
            </div>
          </div>
        ` : ''}
      </div>
    `;
  }

  private switchTab(tabName: string): void {
    // Update tab buttons
    document.querySelectorAll('.tab-button').forEach(button => {
      button.classList.remove('active');
    });
    document.querySelector(`[data-tab="${tabName}"]`)?.classList.add('active');

    // Update tab panels
    document.querySelectorAll('.tab-panel').forEach(panel => {
      panel.classList.remove('active');
    });
    document.getElementById(`${tabName}-tab`)?.classList.add('active');
  }

  private async highlightSelectedElement(): Promise<void> {
    if (!this.selectedElement) return;

    try {
      await this.sendMessageToContentScript({
        type: 'highlight-element',
        selector: this.selectedElement.selector,
        options: { showTooltip: true, showScalingInfo: true }
      });
    } catch (error) {
      console.error('Failed to highlight element:', error);
    }
  }

  private copyElementStyles(): void {
    if (!this.selectedElement) return;

    const styles = this.selectedElement.currentStyles;
    const styleText = Object.entries(styles)
      .map(([prop, value]) => `${prop}: ${value};`)
      .join('\n');

    navigator.clipboard.writeText(styleText).then(() => {
      this.showMessage('Styles copied to clipboard', 'success');
    }).catch(() => {
      this.showMessage('Failed to copy styles', 'error');
    });
  }

  private setupPeriodicUpdates(): void {
    // Update data every 5 seconds
    setInterval(() => {
      this.loadData();
    }, 5000);
  }

  private async sendMessageToContentScript(message: any): Promise<any> {
    return new Promise((resolve, reject) => {
      chrome.devtools.inspectedWindow.eval(
        `window.postMessage(${JSON.stringify({ ...message, source: 'devtools' })}, '*')`,
        (result, isException) => {
          if (isException) {
            reject(new Error('Failed to communicate with content script'));
          } else {
            resolve({ success: true, result });
          }
        }
      );
    });
  }

  private showMessage(message: string, type: 'success' | 'error' | 'info' = 'info'): void {
    // Add message to console tab
    this.consoleMessages.push({
      timestamp: new Date().toISOString(),
      type,
      message
    });

    // Update console output
    this.updateConsoleOutput();

    // Show toast notification
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    
    toast.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 12px 16px;
      border-radius: 4px;
      color: white;
      font-size: 14px;
      z-index: 10000;
      animation: slideIn 0.3s ease-out;
    `;
    
    switch (type) {
      case 'success':
        toast.style.backgroundColor = '#4CAF50';
        break;
      case 'error':
        toast.style.backgroundColor = '#f44336';
        break;
      default:
        toast.style.backgroundColor = '#2196F3';
    }
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.remove();
    }, 3000);
  }

  private updateConsoleOutput(): void {
    const consoleOutput = document.getElementById('console-output');
    if (!consoleOutput) return;

    const messagesHtml = this.consoleMessages.map(msg => `
      <div class="console-message ${msg.type}">
        <span class="message-time">${new Date(msg.timestamp).toLocaleTimeString()}</span>
        <span class="message-content">${msg.message}</span>
      </div>
    `).join('');

    consoleOutput.innerHTML = `
      <div class="console-message info">
        React Responsive Easy DevTools Console
      </div>
      ${messagesHtml}
    `;

    // Auto-scroll to bottom
    consoleOutput.scrollTop = consoleOutput.scrollHeight;
  }

  private showError(message: string): void {
    this.showMessage(message, 'error');
  }
}

// Initialize DevTools panel when DOM is loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new DevToolsPanel();
  });
} else {
  new DevToolsPanel();
}
