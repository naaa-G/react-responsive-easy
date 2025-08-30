/**
 * Background script for React Responsive Easy Browser Extension
 * 
 * This script handles extension lifecycle, storage, and communication
 * between different parts of the extension.
 */
class BackgroundScript {
  private extensionState: Map<number, ExtensionState> = new Map();
  private settings: ExtensionSettings = {
    autoEnable: false,
    highlightColor: '#00ff88',
    showPerformanceWarnings: true,
    enableKeyboardShortcuts: true,
    debugMode: false
  };

  constructor() {
    this.init();
  }

  /**
   * Initialize the background script
   */
  private async init(): Promise<void> {
    // Load settings from storage
    await this.loadSettings();
    
    // Setup event listeners
    this.setupEventListeners();
    
    // Setup context menus
    this.setupContextMenus();
    
    // Setup periodic cleanup
    this.setupPeriodicCleanup();
    
    console.log('🔍 React Responsive Easy Extension background script initialized');
  }

  /**
   * Setup event listeners
   */
  private setupEventListeners(): void {
    // Handle extension installation/update
    chrome.runtime.onInstalled.addListener((details) => {
      this.handleInstallation(details);
    });

    // Handle messages from content scripts and popup
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      this.handleMessage(message, sender, sendResponse);
      return true; // Keep message channel open for async responses
    });

    // Handle tab updates
    chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
      this.handleTabUpdate(tabId, changeInfo, tab);
    });

    // Handle tab removal
    chrome.tabs.onRemoved.addListener((tabId) => {
      this.handleTabRemoved(tabId);
    });

    // Handle extension startup
    chrome.runtime.onStartup.addListener(() => {
      this.handleStartup();
    });
  }

  /**
   * Setup context menus
   */
  private setupContextMenus(): void {
    chrome.contextMenus.create({
      id: 'rre-debug-element',
      title: 'Debug Responsive Element',
      contexts: ['all'],
      documentUrlPatterns: ['http://*/*', 'https://*/*']
    });

    chrome.contextMenus.create({
      id: 'rre-analyze-page',
      title: 'Analyze Page Responsiveness',
      contexts: ['page'],
      documentUrlPatterns: ['http://*/*', 'https://*/*']
    });

    chrome.contextMenus.create({
      id: 'separator-1',
      type: 'separator',
      contexts: ['all']
    });

    chrome.contextMenus.create({
      id: 'rre-toggle-debugger',
      title: 'Toggle RRE Debugger',
      contexts: ['all'],
      documentUrlPatterns: ['http://*/*', 'https://*/*']
    });

    // Handle context menu clicks
    chrome.contextMenus.onClicked.addListener((info, tab) => {
      this.handleContextMenuClick(info, tab);
    });
  }

  /**
   * Setup periodic cleanup
   */
  private setupPeriodicCleanup(): void {
    // Clean up inactive tab states every 5 minutes
    setInterval(() => {
      this.cleanupInactiveStates();
    }, 5 * 60 * 1000);
  }

  /**
   * Handle extension installation
   */
  private handleInstallation(details: chrome.runtime.InstalledDetails): void {
    if (details.reason === 'install') {
      // First installation
      console.log('🎉 React Responsive Easy Extension installed');
      
      // Open welcome page
      chrome.tabs.create({
        url: chrome.runtime.getURL('welcome.html')
      });
      
      // Set default settings
      this.saveSettings();
      
    } else if (details.reason === 'update') {
      // Extension updated
      console.log('🔄 React Responsive Easy Extension updated');
      
      // Migrate settings if needed
      this.migrateSettings(details.previousVersion);
    }
  }

  /**
   * Handle messages from content scripts and popup
   */
  private async handleMessage(
    message: any,
    sender: chrome.runtime.MessageSender,
    sendResponse: (response: any) => void
  ): Promise<void> {
    const tabId = sender.tab?.id;
    
    try {
      switch (message.type) {
        case 'content-script-event':
          await this.handleContentScriptEvent(message, tabId);
          sendResponse({ success: true });
          break;

        case 'debug-event':
          await this.handleDebugEvent(message.detail, tabId);
          sendResponse({ success: true });
          break;

        case 'get-settings':
          sendResponse({ success: true, settings: this.settings });
          break;

        case 'update-settings':
          await this.updateSettings(message.settings);
          sendResponse({ success: true });
          break;

        case 'get-tab-state':
          const state = this.getTabState(tabId);
          sendResponse({ success: true, state });
          break;

        case 'export-global-data':
          const globalData = await this.exportGlobalData();
          sendResponse({ success: true, data: globalData });
          break;

        case 'clear-all-data':
          await this.clearAllData();
          sendResponse({ success: true });
          break;

        default:
          sendResponse({ success: false, error: 'Unknown message type' });
      }
    } catch (error) {
      console.error('Background script error:', error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      sendResponse({ success: false, error: errorMessage });
    }
  }

  /**
   * Handle tab updates
   */
  private handleTabUpdate(
    tabId: number,
    changeInfo: chrome.tabs.TabChangeInfo,
    tab: chrome.tabs.Tab
  ): void {
    // Reset state when URL changes
    if (changeInfo.url) {
      this.resetTabState(tabId);
    }

    // Update tab state
    if (changeInfo.status === 'complete') {
      this.initializeTabState(tabId, tab);
      
      // Auto-enable debugger if setting is enabled
      if (this.settings.autoEnable) {
        this.sendMessageToTab(tabId, { type: 'enable-debugger' });
      }
    }
  }

  /**
   * Handle tab removal
   */
  private handleTabRemoved(tabId: number): void {
    this.extensionState.delete(tabId);
    console.log(`🗑️ Cleaned up state for tab ${tabId}`);
  }

  /**
   * Handle extension startup
   */
  private handleStartup(): void {
    console.log('🚀 React Responsive Easy Extension started');
    
    // Clear all tab states on startup
    this.extensionState.clear();
  }

  /**
   * Handle content script events
   */
  private async handleContentScriptEvent(message: any, tabId?: number): Promise<void> {
    if (!tabId) return;

    const state = this.getTabState(tabId);
    
    switch (message.type) {
      case 'responsive-easy-detected':
        state.hasResponsiveEasy = true;
        state.elementCount = message.elementCount || 0;
        state.hasContext = message.hasContext || false;
        state.hasReactFiber = message.hasReactFiber || false;
        
        // Update badge
        this.updateBadge(tabId, 'RRE', '#00ff88');
        break;

      case 'responsive-easy-not-detected':
        state.hasResponsiveEasy = false;
        
        // Update badge
        this.updateBadge(tabId, '', '#666666');
        break;

      case 'elements-changed':
        state.elementCount = message.currentCount || 0;
        
        // Show notification if significant change
        if (message.currentCount > message.previousCount + 5) {
          this.showNotification(
            'New responsive elements detected',
            `Found ${message.currentCount - message.previousCount} new elements`
          );
        }
        break;
    }

    this.extensionState.set(tabId, state);
  }

  /**
   * Handle debug events
   */
  private async handleDebugEvent(detail: any, tabId?: number): Promise<void> {
    if (!tabId) return;

    const state = this.getTabState(tabId);
    
    switch (detail.type) {
      case 'debugger-enabled':
        state.debuggerEnabled = true;
        this.updateBadge(tabId, 'ON', '#00ff88');
        break;

      case 'debugger-disabled':
        state.debuggerEnabled = false;
        this.updateBadge(tabId, 'RRE', '#00ff88');
        break;

      case 'breakpoint-changed':
        state.currentBreakpoint = detail.breakpoint;
        
        // Log breakpoint change for analytics
        console.log('📱 Breakpoint changed:', detail.breakpoint);
        break;

      case 'element-inspected':
        // Store inspection data
        if (!state.inspectionHistory) {
          state.inspectionHistory = [];
        }
        state.inspectionHistory.push({
          timestamp: Date.now(),
          elementInfo: detail.elementInfo
        });
        
        // Keep only last 10 inspections
        if (state.inspectionHistory.length > 10) {
          state.inspectionHistory = state.inspectionHistory.slice(-10);
        }
        break;

      case 'performance-warning':
        if (this.settings.showPerformanceWarnings) {
          this.showNotification(
            'Performance Warning',
            detail.message || 'Performance issue detected'
          );
        }
        break;
    }

    this.extensionState.set(tabId, state);
  }

  /**
   * Handle context menu clicks
   */
  private async handleContextMenuClick(
    info: chrome.contextMenus.OnClickData,
    tab?: chrome.tabs.Tab
  ): Promise<void> {
    if (!tab?.id) return;

    switch (info.menuItemId) {
      case 'rre-debug-element':
        // Use click position from context menu info
        const x = (info as any).pageX || 0;
        const y = (info as any).pageY || 0;
        await this.debugElementAtPosition(tab.id, x, y);
        break;

      case 'rre-analyze-page':
        await this.analyzePageResponsiveness(tab.id);
        break;

      case 'rre-toggle-debugger':
        await this.toggleDebugger(tab.id);
        break;
    }
  }

  /**
   * Debug element at specific position
   */
  private async debugElementAtPosition(tabId: number, x: number, y: number): Promise<void> {
    try {
      await this.sendMessageToTab(tabId, {
        type: 'debug-element-at-position',
        x,
        y
      });
    } catch (error) {
      console.error('Failed to debug element at position:', error);
    }
  }

  /**
   * Analyze page responsiveness
   */
  private async analyzePageResponsiveness(tabId: number): Promise<void> {
    try {
      const response = await this.sendMessageToTab(tabId, {
        type: 'analyze-performance'
      });
      
      if (response.success) {
        // Open results in new tab
        chrome.tabs.create({
          url: chrome.runtime.getURL(`analysis-results.html?tabId=${tabId}`)
        });
      }
    } catch (error) {
      console.error('Failed to analyze page responsiveness:', error);
    }
  }

  /**
   * Toggle debugger for tab
   */
  private async toggleDebugger(tabId: number): Promise<void> {
    try {
      await this.sendMessageToTab(tabId, { type: 'toggle-debugger' });
    } catch (error) {
      console.error('Failed to toggle debugger:', error);
    }
  }

  /**
   * Get tab state
   */
  private getTabState(tabId?: number): ExtensionState {
    if (!tabId) return this.createDefaultState();
    
    if (!this.extensionState.has(tabId)) {
      this.extensionState.set(tabId, this.createDefaultState());
    }
    
    return this.extensionState.get(tabId)!;
  }

  /**
   * Create default extension state
   */
  private createDefaultState(): ExtensionState {
    return {
      hasResponsiveEasy: false,
      debuggerEnabled: false,
      elementCount: 0,
      currentBreakpoint: null,
      hasContext: false,
      hasReactFiber: false,
      inspectionHistory: []
    };
  }

  /**
   * Reset tab state
   */
  private resetTabState(tabId: number): void {
    this.extensionState.set(tabId, this.createDefaultState());
  }

  /**
   * Initialize tab state
   */
  private initializeTabState(tabId: number, tab: chrome.tabs.Tab): void {
    const state = this.getTabState(tabId);
    state.url = tab.url;
    state.title = tab.title;
    this.extensionState.set(tabId, state);
  }

  /**
   * Update extension badge
   */
  private updateBadge(tabId: number, text: string, color: string): void {
    chrome.action.setBadgeText({ text, tabId });
    chrome.action.setBadgeBackgroundColor({ color, tabId });
  }

  /**
   * Show notification
   */
  private showNotification(title: string, message: string): void {
    if (chrome.notifications) {
      chrome.notifications.create({
        type: 'basic',
        iconUrl: 'icons/icon-48.png',
        title,
        message
      });
    }
  }

  /**
   * Send message to tab
   */
  private async sendMessageToTab(tabId: number, message: any): Promise<any> {
    return new Promise((resolve, reject) => {
      chrome.tabs.sendMessage(tabId, message, (response) => {
        if (chrome.runtime.lastError) {
          reject(new Error(chrome.runtime.lastError.message));
        } else {
          resolve(response);
        }
      });
    });
  }

  /**
   * Load settings from storage
   */
  private async loadSettings(): Promise<void> {
    try {
      const result = await chrome.storage.sync.get('rre-settings');
      if (result['rre-settings']) {
        this.settings = { ...this.settings, ...result['rre-settings'] };
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
    }
  }

  /**
   * Save settings to storage
   */
  private async saveSettings(): Promise<void> {
    try {
      await chrome.storage.sync.set({ 'rre-settings': this.settings });
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  }

  /**
   * Update settings
   */
  private async updateSettings(newSettings: Partial<ExtensionSettings>): Promise<void> {
    this.settings = { ...this.settings, ...newSettings };
    await this.saveSettings();
  }

  /**
   * Migrate settings from previous version
   */
  private async migrateSettings(previousVersion?: string): Promise<void> {
    // Implement settings migration logic here if needed
    console.log(`Migrating settings from version ${previousVersion}`);
  }

  /**
   * Export global data
   */
  private async exportGlobalData(): Promise<any> {
    const allStates: Record<number, ExtensionState> = {};
    
    this.extensionState.forEach((state, tabId) => {
      allStates[tabId] = state;
    });

    return {
      timestamp: new Date().toISOString(),
      version: chrome.runtime.getManifest().version,
      settings: this.settings,
      tabStates: allStates
    };
  }

  /**
   * Clear all data
   */
  private async clearAllData(): Promise<void> {
    // Clear extension state
    this.extensionState.clear();
    
    // Clear storage
    await chrome.storage.sync.clear();
    await chrome.storage.local.clear();
    
    // Reset settings to defaults
    this.settings = {
      autoEnable: false,
      highlightColor: '#00ff88',
      showPerformanceWarnings: true,
      enableKeyboardShortcuts: true,
      debugMode: false
    };
    
    await this.saveSettings();
  }

  /**
   * Clean up inactive states
   */
  private async cleanupInactiveStates(): Promise<void> {
    try {
      const tabs = await chrome.tabs.query({});
      const activeTabIds = new Set(tabs.map(tab => tab.id).filter(Boolean));
      
      // Remove states for tabs that no longer exist
      for (const tabId of this.extensionState.keys()) {
        if (!activeTabIds.has(tabId)) {
          this.extensionState.delete(tabId);
        }
      }
      
      console.log(`🧹 Cleaned up ${this.extensionState.size} inactive tab states`);
    } catch (error) {
      console.error('Failed to cleanup inactive states:', error);
    }
  }
}

// Type definitions
interface ExtensionState {
  hasResponsiveEasy: boolean;
  debuggerEnabled: boolean;
  elementCount: number;
  currentBreakpoint: any;
  hasContext: boolean;
  hasReactFiber: boolean;
  inspectionHistory: any[];
  url?: string;
  title?: string;
}

interface ExtensionSettings {
  autoEnable: boolean;
  highlightColor: string;
  showPerformanceWarnings: boolean;
  enableKeyboardShortcuts: boolean;
  debugMode: boolean;
}

// Initialize background script
new BackgroundScript();
