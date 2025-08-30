/**
 * Figma Plugin UI for React Responsive Easy
 * 
 * This file handles the plugin UI interactions and communication
 * with the main plugin thread.
 */

// Global state
let currentTokens: any = null;
let currentConfig: any = null;
let exportContent: string = '';
let selectedFormat: string = 'json';

// Initialize UI when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  initializeUI();
  setupEventListeners();
});

/**
 * Initialize UI components
 */
function initializeUI(): void {
  // Set up tab navigation
  setupTabNavigation();
  
  // Initialize form elements
  initializeFormElements();
  
  // Update UI state
  updateUIState();
}

/**
 * Setup tab navigation
 */
function setupTabNavigation(): void {
  const tabButtons = document.querySelectorAll('.tab-button');
  const tabPanels = document.querySelectorAll('.tab-panel');

  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      const tabId = button.getAttribute('data-tab');
      
      // Update active tab button
      tabButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      
      // Update active tab panel
      tabPanels.forEach(panel => {
        panel.classList.remove('active');
        if (panel.getAttribute('data-panel') === tabId) {
          panel.classList.add('active');
        }
      });
    });
  });
}

/**
 * Initialize form elements
 */
function initializeFormElements(): void {
  // Export format selection
  const formatOptions = document.querySelectorAll('input[name="export-format"]');
  formatOptions.forEach(option => {
    option.addEventListener('change', (e) => {
      selectedFormat = (e.target as HTMLInputElement).value;
    });
  });
}

/**
 * Setup event listeners
 */
function setupEventListeners(): void {
  // Extract tokens
  const extractButton = document.getElementById('extract-tokens');
  extractButton?.addEventListener('click', () => {
    showLoading('Extracting design tokens...');
    parent.postMessage({ pluginMessage: { type: 'extract-tokens' } }, '*');
  });

  // Analyze selection
  const analyzeButton = document.getElementById('analyze-selection');
  analyzeButton?.addEventListener('click', () => {
    showLoading('Analyzing selection...');
    parent.postMessage({ pluginMessage: { type: 'analyze-selection' } }, '*');
  });

  // Generate configuration
  const generateConfigButton = document.getElementById('generate-config');
  generateConfigButton?.addEventListener('click', handleGenerateConfig);

  // Import configuration
  const importConfigButton = document.getElementById('import-config-btn');
  importConfigButton?.addEventListener('click', handleImportConfigRequest);

  // Preview breakpoints
  const previewButton = document.getElementById('preview-breakpoints');
  previewButton?.addEventListener('click', handlePreviewBreakpointsRequest);

  // Create component
  const createComponentButton = document.getElementById('create-component');
  createComponentButton?.addEventListener('click', handleCreateComponent);

  // Export tokens
  const exportButton = document.getElementById('export-tokens');
  exportButton?.addEventListener('click', handleExportTokensRequest);

  // Copy export content
  const copyButton = document.getElementById('copy-export');
  copyButton?.addEventListener('click', () => {
    navigator.clipboard.writeText(exportContent).then(() => {
      showStatus('Copied to clipboard!', 'success');
    });
  });

  // Download export content
  const downloadButton = document.getElementById('download-export');
  downloadButton?.addEventListener('click', handleDownloadExport);

  // Add breakpoint
  const addBreakpointButton = document.getElementById('add-breakpoint');
  addBreakpointButton?.addEventListener('click', addBreakpointItem);

  // Remove breakpoint buttons (delegated event handling)
  document.addEventListener('click', (e) => {
    if ((e.target as HTMLElement).classList.contains('btn-remove')) {
      (e.target as HTMLElement).closest('.breakpoint-item')?.remove();
    }
  });

  // Documentation links
  const docLinks = document.querySelectorAll('.doc-link');
  docLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const docType = link.getAttribute('data-doc');
      showDocumentation(docType);
    });
  });

  // Close plugin
  const closeButton = document.getElementById('close-plugin');
  closeButton?.addEventListener('click', () => {
    parent.postMessage({ pluginMessage: { type: 'close-plugin' } }, '*');
  });
}

/**
 * Handle messages from the main plugin thread
 */
window.onmessage = (event) => {
  const { type, data } = event.data.pluginMessage || {};

  switch (type) {
    case 'selection-changed':
      handleSelectionChanged(data);
      break;

    case 'tokens-extracted':
      handleTokensExtracted(data);
      break;

    case 'analysis-complete':
      handleAnalysisComplete(data);
      break;

    case 'config-generated':
      handleConfigGenerated(data);
      break;

    case 'config-imported':
      handleConfigImported(data);
      break;

    case 'preview-created':
      handlePreviewCreated(data);
      break;

    case 'component-created':
      handleComponentCreated(data);
      break;

    case 'tokens-exported':
      handleTokensExported(data);
      break;

    case 'error':
      handleError(data);
      break;

    default:
      console.log('Unknown message type:', type);
  }
};

/**
 * Handle selection change
 */
function handleSelectionChanged(data: any): void {
  const { count, nodes } = data;
  
  // Update selection count
  const selectionCount = document.getElementById('selection-count');
  if (selectionCount) {
    selectionCount.textContent = count.toString();
  }

  // Update selection details
  const selectionDetails = document.getElementById('selection-details');
  if (selectionDetails) {
    if (count === 0) {
      selectionDetails.innerHTML = '<p class="hint">Select elements to get started</p>';
    } else {
      const nodeTypes = nodes.reduce((acc: any, node: any) => {
        acc[node.type] = (acc[node.type] || 0) + 1;
        return acc;
      }, {});
      
      const typesList = Object.entries(nodeTypes)
        .map(([type, count]) => `${count} ${type.toLowerCase()}${count === 1 ? '' : 's'}`)
        .join(', ');
      
      selectionDetails.innerHTML = `<p>${typesList}</p>`;
    }
  }

  // Update button states
  updateButtonStates(count > 0);
}

/**
 * Handle tokens extracted
 */
function handleTokensExtracted(data: any): void {
  hideLoading();
  currentTokens = data.tokens;
  
  // Show tokens preview
  const tokensPreview = document.getElementById('extracted-tokens');
  if (tokensPreview) {
    tokensPreview.style.display = 'block';
    
    // Update color tokens
    updateTokenPreview('colors-preview', data.tokens.colors, renderColorToken);
    
    // Update typography tokens
    updateTokenPreview('typography-preview', data.tokens.typography, renderTypographyToken);
    
    // Update spacing tokens
    updateTokenPreview('spacing-preview', data.tokens.spacing, renderSpacingToken);
    
    // Update shadow tokens
    updateTokenPreview('shadows-preview', data.tokens.shadows, renderShadowToken);
  }
  
  showStatus('Design tokens extracted successfully!', 'success');
  updateUIState();
}

/**
 * Handle analysis complete
 */
function handleAnalysisComplete(data: any): void {
  hideLoading();
  const { analysis } = data;
  
  // Update analysis results
  const analysisResults = document.getElementById('analysis-results');
  if (analysisResults) {
    analysisResults.style.display = 'block';
    
    // Update metrics
    const totalElements = document.getElementById('total-elements');
    const responsiveCandidates = document.getElementById('responsive-candidates');
    const complexity = document.getElementById('complexity');
    
    if (totalElements) totalElements.textContent = analysis.totalElements.toString();
    if (responsiveCandidates) responsiveCandidates.textContent = analysis.responsiveCandidates.toString();
    if (complexity) {
      complexity.textContent = analysis.complexity.charAt(0).toUpperCase() + analysis.complexity.slice(1);
      complexity.className = `metric-value complexity-${analysis.complexity}`;
    }
    
    // Update recommendations
    const recommendations = document.getElementById('recommendations');
    if (recommendations && analysis.recommendations.length > 0) {
      recommendations.innerHTML = `
        <h4>💡 Recommendations</h4>
        <ul class="recommendation-list">
          ${analysis.recommendations.map((rec: string) => `<li>${rec}</li>`).join('')}
        </ul>
      `;
    }
  }
  
  showStatus('Analysis completed!', 'success');
}

/**
 * Handle generate configuration
 */
function handleGenerateConfig(): void {
  const baseBreakpoint = {
    name: (document.getElementById('base-name') as HTMLInputElement)?.value || 'Desktop',
    width: parseInt((document.getElementById('base-width') as HTMLInputElement)?.value || '1920'),
    height: parseInt((document.getElementById('base-height') as HTMLInputElement)?.value || '1080'),
    alias: 'base'
  };

  const targetBreakpoints = Array.from(document.querySelectorAll('.breakpoint-item')).map(item => {
    const inputs = item.querySelectorAll('input');
    return {
      name: (inputs[0] as HTMLInputElement).value,
      width: parseInt((inputs[1] as HTMLInputElement).value),
      height: parseInt((inputs[2] as HTMLInputElement).value),
      alias: (inputs[0] as HTMLInputElement).value.toLowerCase()
    };
  });

  showLoading('Generating configuration...');
  parent.postMessage({
    pluginMessage: {
      type: 'generate-responsive-config',
      data: { baseBreakpoint, targetBreakpoints }
    }
  }, '*');
}

/**
 * Handle configuration generated
 */
function handleConfigGenerated(data: any): void {
  hideLoading();
  currentConfig = data.config;
  
  // Show config preview
  const configPreview = document.getElementById('config-preview');
  const configJson = document.getElementById('config-json');
  
  if (configPreview && configJson) {
    configPreview.style.display = 'block';
    configJson.textContent = JSON.stringify(data.config, null, 2);
  }
  
  showStatus('Configuration generated successfully!', 'success');
  updateUIState();
}

/**
 * Handle import configuration request
 */
function handleImportConfigRequest(): void {
  const textarea = document.getElementById('import-config') as HTMLTextAreaElement;
  const configText = textarea.value.trim();
  
  if (!configText) {
    showStatus('Please paste a configuration to import', 'error');
    return;
  }
  
  showLoading('Importing configuration...');
  parent.postMessage({
    pluginMessage: {
      type: 'import-config',
      data: { config: configText }
    }
  }, '*');
}

/**
 * Handle configuration imported
 */
function handleConfigImported(data: any): void {
  hideLoading();
  currentConfig = data.config;
  showStatus(data.message, 'success');
  updateUIState();
}

/**
 * Handle preview breakpoints request
 */
function handlePreviewBreakpointsRequest(): void {
  if (!currentConfig) {
    showStatus('Please generate a configuration first', 'error');
    return;
  }
  
  showLoading('Creating breakpoint previews...');
  parent.postMessage({
    pluginMessage: {
      type: 'preview-breakpoints',
      data: { breakpoints: currentConfig.breakpoints }
    }
  }, '*');
}

/**
 * Handle preview created
 */
function handlePreviewCreated(data: any): void {
  hideLoading();
  showStatus(data.message, 'success');
}

/**
 * Handle create component
 */
function handleCreateComponent(): void {
  const componentName = (document.getElementById('component-name') as HTMLInputElement)?.value;
  
  if (!componentName) {
    showStatus('Please enter a component name', 'error');
    return;
  }
  
  if (!currentConfig) {
    showStatus('Please generate a configuration first', 'error');
    return;
  }
  
  showLoading('Creating responsive component...');
  parent.postMessage({
    pluginMessage: {
      type: 'create-responsive-component',
      data: {
        componentName,
        breakpoints: currentConfig.breakpoints
      }
    }
  }, '*');
}

/**
 * Handle component created
 */
function handleComponentCreated(data: any): void {
  hideLoading();
  showStatus(data.message, 'success');
}

/**
 * Handle export tokens request
 */
function handleExportTokensRequest(): void {
  if (!currentTokens && !currentConfig) {
    showStatus('Please extract tokens or generate configuration first', 'error');
    return;
  }
  
  showLoading('Exporting tokens...');
  parent.postMessage({
    pluginMessage: {
      type: 'export-tokens',
      data: { format: selectedFormat }
    }
  }, '*');
}

/**
 * Handle tokens exported
 */
function handleTokensExported(data: any): void {
  hideLoading();
  exportContent = data.content;
  
  // Show export result
  const exportResult = document.getElementById('export-result');
  const exportContentEl = document.getElementById('export-content');
  
  if (exportResult && exportContentEl) {
    exportResult.style.display = 'block';
    exportContentEl.textContent = data.content;
  }
  
  showStatus('Tokens exported successfully!', 'success');
}

/**
 * Handle download export
 */
function handleDownloadExport(): void {
  if (!exportContent) return;
  
  const blob = new Blob([exportContent], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `rre-design-tokens.${selectedFormat === 'rre-config' ? 'json' : selectedFormat}`;
  a.click();
  URL.revokeObjectURL(url);
  
  showStatus('File downloaded!', 'success');
}

/**
 * Handle errors
 */
function handleError(data: any): void {
  hideLoading();
  showStatus(data.message, 'error');
}

/**
 * Add breakpoint item
 */
function addBreakpointItem(): void {
  const breakpointsList = document.getElementById('breakpoints-list');
  if (!breakpointsList) return;
  
  const item = document.createElement('div');
  item.className = 'breakpoint-item';
  item.innerHTML = `
    <input type="text" placeholder="Breakpoint name">
    <input type="number" placeholder="Width">
    <span>×</span>
    <input type="number" placeholder="Height">
    <button class="btn-remove">×</button>
  `;
  
  breakpointsList.appendChild(item);
}

/**
 * Update token preview
 */
function updateTokenPreview(containerId: string, tokens: any, renderer: (key: string, token: any) => string): void {
  const container = document.getElementById(containerId);
  if (!container) return;
  
  const tokenEntries = Object.entries(tokens);
  
  if (tokenEntries.length === 0) {
    container.innerHTML = '<p class="no-tokens">No tokens found</p>';
    return;
  }
  
  container.innerHTML = tokenEntries
    .slice(0, 5) // Show first 5 tokens
    .map(([key, token]) => renderer(key, token))
    .join('');
  
  if (tokenEntries.length > 5) {
    container.innerHTML += `<p class="more-tokens">+${tokenEntries.length - 5} more</p>`;
  }
}

/**
 * Render color token
 */
function renderColorToken(key: string, token: any): string {
  return `
    <div class="token-item">
      <div class="color-swatch" style="background-color: ${token.value}"></div>
      <div class="token-info">
        <div class="token-name">${key}</div>
        <div class="token-value">${token.value}</div>
      </div>
    </div>
  `;
}

/**
 * Render typography token
 */
function renderTypographyToken(key: string, token: any): string {
  return `
    <div class="token-item">
      <div class="token-info">
        <div class="token-name">${key}</div>
        <div class="token-value">${token.fontSize} / ${token.fontWeight}</div>
      </div>
    </div>
  `;
}

/**
 * Render spacing token
 */
function renderSpacingToken(key: string, token: any): string {
  return `
    <div class="token-item">
      <div class="token-info">
        <div class="token-name">${key}</div>
        <div class="token-value">${token.gap || token.top}</div>
      </div>
    </div>
  `;
}

/**
 * Render shadow token
 */
function renderShadowToken(key: string, token: any): string {
  return `
    <div class="token-item">
      <div class="token-info">
        <div class="token-name">${key}</div>
        <div class="token-value">${token.x} ${token.y} ${token.blur}</div>
      </div>
    </div>
  `;
}

/**
 * Update button states
 */
function updateButtonStates(hasSelection: boolean): void {
  const buttons = [
    'extract-tokens',
    'analyze-selection',
    'preview-breakpoints'
  ];
  
  buttons.forEach(id => {
    const button = document.getElementById(id);
    if (button) {
      (button as HTMLButtonElement).disabled = !hasSelection;
    }
  });
}

/**
 * Update UI state
 */
function updateUIState(): void {
  // Enable export button if we have tokens or config
  const exportButton = document.getElementById('export-tokens');
  if (exportButton) {
    (exportButton as HTMLButtonElement).disabled = !currentTokens && !currentConfig;
  }
  
  // Enable preview button if we have config
  const previewButton = document.getElementById('preview-breakpoints');
  if (previewButton) {
    (previewButton as HTMLButtonElement).disabled = !currentConfig;
  }
}

/**
 * Show loading overlay
 */
function showLoading(message: string): void {
  const overlay = document.getElementById('loading-overlay');
  const messageEl = overlay?.querySelector('.loading-message');
  
  if (overlay) {
    overlay.style.display = 'flex';
    if (messageEl) {
      messageEl.textContent = message;
    }
  }
}

/**
 * Hide loading overlay
 */
function hideLoading(): void {
  const overlay = document.getElementById('loading-overlay');
  if (overlay) {
    overlay.style.display = 'none';
  }
}

/**
 * Show status message
 */
function showStatus(message: string, type: 'success' | 'error' | 'info' = 'info'): void {
  const statusMessage = document.getElementById('status-message');
  if (statusMessage) {
    statusMessage.textContent = message;
    statusMessage.className = `status-${type}`;
    
    // Clear after 3 seconds
    setTimeout(() => {
      statusMessage.textContent = 'Ready';
      statusMessage.className = '';
    }, 3000);
  }
}

/**
 * Show documentation
 */
function showDocumentation(docType: string | null): void {
  const docs = {
    installation: `
# Installation

npm install @react-responsive-easy/core
npm install @react-responsive-easy/performance-dashboard

# Usage
import { ResponsiveProvider } from '@react-responsive-easy/core';
import { PerformanceDashboard } from '@react-responsive-easy/performance-dashboard';
    `,
    usage: `
# Basic Usage

<ResponsiveProvider config={responsiveConfig}>
  <App />
</ResponsiveProvider>

const scaledValue = useResponsiveValue(baseValue);
const scaledStyle = useScaledStyle(baseStyle);
    `,
    api: `
# API Reference

- ResponsiveProvider: Main provider component
- useResponsiveValue: Scale individual values
- useScaledStyle: Scale style objects
- useBreakpoint: Get current breakpoint
- withResponsive: HOC for class components
    `,
    'best-practices': `
# Best Practices

1. Define base breakpoint at your design resolution
2. Use semantic token names
3. Test across all target breakpoints
4. Monitor performance with dashboard
5. Use TypeScript for better DX
    `
  };
  
  const content = docs[docType as keyof typeof docs] || 'Documentation not found';
  alert(content); // In a real implementation, this would show a proper modal
}
