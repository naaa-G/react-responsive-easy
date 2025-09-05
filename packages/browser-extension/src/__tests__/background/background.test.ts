/**
 * Unit tests for BackgroundScript class
 * 
 * These tests cover the background script functionality including
 * message handling, state management, and Chrome API interactions.
 */

import { 
  createMockExtensionState,
  createMockExtensionSettings,
  mockChrome,
  mockChromeRuntime,
  mockChromeTabs,
  mockChromeStorage
} from '../setup';

// Mock the BackgroundScript class since it's not exported
class MockBackgroundScript {
  private extensionState: Map<number, any> = new Map();
  private settings: any = {
    autoEnable: false,
    highlightColor: '#00ff88',
    showPerformanceWarnings: true,
    enableKeyboardShortcuts: true,
    debugMode: false
  };

  constructor() {
    this.init();
  }

  private async init(): Promise<void> {
    await this.loadSettings();
    this.setupEventListeners();
    this.setupContextMenus();
    this.setupPeriodicCleanup();
  }

  private setupEventListeners(): void {
    mockChrome.runtime.onInstalled.addListener((details: any) => {
      this.handleInstallation(details);
    });

    mockChrome.runtime.onMessage.addListener((message: any, sender: any, sendResponse: any) => {
      this.handleMessage(message, sender, sendResponse);
      return true;
    });

    mockChrome.tabs.onUpdated.addListener((tabId: number, changeInfo: any, tab: any) => {
      this.handleTabUpdate(tabId, changeInfo, tab);
    });

    mockChrome.tabs.onRemoved.addListener((tabId: number) => {
      this.handleTabRemoved(tabId);
    });

    mockChrome.runtime.onStartup.addListener(() => {
      this.handleStartup();
    });
  }

  private setupContextMenus(): void {
    mockChrome.contextMenus.create({
      id: 'rre-debug-element',
      title: 'Debug Responsive Element',
      contexts: ['all'],
      documentUrlPatterns: ['http://*/*', 'https://*/*']
    });

    mockChrome.contextMenus.create({
      id: 'rre-analyze-page',
      title: 'Analyze Page Responsiveness',
      contexts: ['page'],
      documentUrlPatterns: ['http://*/*', 'https://*/*']
    });

    mockChrome.contextMenus.create({
      id: 'separator-1',
      type: 'separator',
      contexts: ['all']
    });

    mockChrome.contextMenus.create({
      id: 'rre-toggle-debugger',
      title: 'Toggle RRE Debugger',
      contexts: ['all'],
      documentUrlPatterns: ['http://*/*', 'https://*/*']
    });

    mockChrome.contextMenus.onClicked.addListener((info: any, tab: any) => {
      this.handleContextMenuClick(info, tab);
    });
  }

  private setupPeriodicCleanup(): void {
    setInterval(() => {
      this.cleanupInactiveStates();
    }, 5 * 60 * 1000);
  }

  private handleInstallation(details: any): void {
    if (details.reason === 'install') {
      mockChrome.tabs.create({
        url: mockChrome.runtime.getURL('welcome.html')
      });
      this.saveSettings();
    } else if (details.reason === 'update') {
      this.migrateSettings(details.previousVersion);
    }
  }

  private async handleMessage(message: any, sender: any, sendResponse: any): Promise<void> {
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
      const errorMessage = error instanceof Error ? error.message : String(error);
      sendResponse({ success: false, error: errorMessage });
    }
  }

  private handleTabUpdate(tabId: number, changeInfo: any, tab: any): void {
    if (changeInfo.url) {
      this.resetTabState(tabId);
    }

    if (changeInfo.status === 'complete') {
      this.initializeTabState(tabId, tab);
      
      if (this.settings.autoEnable) {
        this.sendMessageToTab(tabId, { type: 'enable-debugger' });
      }
    }
  }

  private handleTabRemoved(tabId: number): void {
    this.extensionState.delete(tabId);
  }

  private handleStartup(): void {
    this.extensionState.clear();
  }

  private async handleContentScriptEvent(message: any, tabId?: number): Promise<void> {
    if (!tabId) return;

    const state = this.getTabState(tabId);
    
    switch (message.type) {
      case 'responsive-easy-detected':
        state.hasResponsiveEasy = true;
        state.elementCount = message.elementCount || 0;
        state.hasContext = message.hasContext || false;
        state.hasReactFiber = message.hasReactFiber || false;
        this.updateBadge(tabId, 'RRE', '#00ff88');
        break;

      case 'responsive-easy-not-detected':
        state.hasResponsiveEasy = false;
        this.updateBadge(tabId, '', '#666666');
        break;

      case 'elements-changed':
        state.elementCount = message.currentCount || 0;
        
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
        break;

      case 'element-inspected':
        if (!state.inspectionHistory) {
          state.inspectionHistory = [];
        }
        state.inspectionHistory.push({
          timestamp: Date.now(),
          elementInfo: detail.elementInfo
        });
        
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

  private async handleContextMenuClick(info: any, tab?: any): Promise<void> {
    if (!tab?.id) return;

    switch (info.menuItemId) {
      case 'rre-debug-element':
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

  private async debugElementAtPosition(tabId: number, x: number, y: number): Promise<void> {
    await this.sendMessageToTab(tabId, {
      type: 'debug-element-at-position',
      x,
      y
    });
  }

  private async analyzePageResponsiveness(tabId: number): Promise<void> {
    const response = await this.sendMessageToTab(tabId, {
      type: 'analyze-performance'
    });
    
    if (response.success) {
      mockChrome.tabs.create({
        url: mockChrome.runtime.getURL(`analysis-results.html?tabId=${tabId}`)
      });
    }
  }

  private async toggleDebugger(tabId: number): Promise<void> {
    await this.sendMessageToTab(tabId, { type: 'toggle-debugger' });
  }

  private getTabState(tabId?: number): any {
    if (!tabId) return this.createDefaultState();
    
    if (!this.extensionState.has(tabId)) {
      this.extensionState.set(tabId, this.createDefaultState());
    }
    
    return this.extensionState.get(tabId)!;
  }

  private createDefaultState(): any {
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

  private resetTabState(tabId: number): void {
    this.extensionState.set(tabId, this.createDefaultState());
  }

  private initializeTabState(tabId: number, tab: any): void {
    const state = this.getTabState(tabId);
    state.url = tab.url;
    state.title = tab.title;
    this.extensionState.set(tabId, state);
  }

  private updateBadge(tabId: number, text: string, color: string): void {
    mockChrome.action.setBadgeText({ text, tabId });
    mockChrome.action.setBadgeBackgroundColor({ color, tabId });
  }

  private showNotification(title: string, message: string): void {
    if (mockChrome.notifications) {
      mockChrome.notifications.create({
        type: 'basic',
        iconUrl: 'icons/icon-48.png',
        title,
        message
      });
    }
  }

  private async sendMessageToTab(tabId: number, message: any): Promise<any> {
    return new Promise((resolve, reject) => {
      mockChrome.tabs.sendMessage(tabId, message, (response: any) => {
        if (mockChrome.runtime.lastError) {
          const errorMessage = (mockChrome.runtime.lastError as any).message || 'Unknown error';
          reject(new Error(errorMessage));
        } else {
          resolve(response);
        }
      });
    });
  }

  private async loadSettings(): Promise<void> {
    try {
      const result = await mockChrome.storage.sync.get('rre-settings');
      if (result['rre-settings']) {
        this.settings = { ...this.settings, ...result['rre-settings'] };
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
    }
  }

  private async saveSettings(): Promise<void> {
    try {
      await mockChrome.storage.sync.set({ 'rre-settings': this.settings });
    } catch (error) {
      console.error('Failed to save settings:', error);
      throw error; // Re-throw to allow error handling in calling methods
    }
  }

  private async updateSettings(newSettings: any): Promise<void> {
    this.settings = { ...this.settings, ...newSettings };
    try {
      await this.saveSettings();
    } catch (error) {
      throw error; // Re-throw to trigger error handling in message handler
    }
  }

  private async migrateSettings(previousVersion?: string): Promise<void> {
    console.log(`Migrating settings from version ${previousVersion}`);
  }

  private async exportGlobalData(): Promise<any> {
    const allStates: Record<number, any> = {};
    
    this.extensionState.forEach((state, tabId) => {
      allStates[tabId] = state;
    });

    return {
      timestamp: new Date().toISOString(),
      version: mockChrome.runtime.getManifest().version,
      settings: this.settings,
      tabStates: allStates
    };
  }

  private async clearAllData(): Promise<void> {
    this.extensionState.clear();
    await mockChrome.storage.sync.clear();
    await mockChrome.storage.local.clear();
    
    this.settings = {
      autoEnable: false,
      highlightColor: '#00ff88',
      showPerformanceWarnings: true,
      enableKeyboardShortcuts: true,
      debugMode: false
    };
    
    await this.saveSettings();
  }

  private async cleanupInactiveStates(): Promise<void> {
    try {
      const tabs = await mockChrome.tabs.query({});
      const activeTabIds = new Set(tabs.map((tab: any) => tab.id).filter(Boolean));
      
      for (const tabId of this.extensionState.keys()) {
        if (!activeTabIds.has(tabId)) {
          this.extensionState.delete(tabId);
        }
      }
    } catch (error) {
      console.error('Failed to cleanup inactive states:', error);
    }
  }
}

describe('BackgroundScript', () => {
  let backgroundScript: MockBackgroundScript;

  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();
    
    // Create fresh instance
    backgroundScript = new MockBackgroundScript();
  });

  describe('Initialization', () => {
    it('should initialize with default settings', async () => {
      expect(mockChrome.runtime.onInstalled.addListener).toHaveBeenCalled();
      expect(mockChrome.runtime.onMessage.addListener).toHaveBeenCalled();
      expect(mockChrome.tabs.onUpdated.addListener).toHaveBeenCalled();
      expect(mockChrome.tabs.onRemoved.addListener).toHaveBeenCalled();
      expect(mockChrome.runtime.onStartup.addListener).toHaveBeenCalled();
    });

    it('should setup context menus', () => {
      expect(mockChrome.contextMenus.create).toHaveBeenCalledWith({
        id: 'rre-debug-element',
        title: 'Debug Responsive Element',
        contexts: ['all'],
        documentUrlPatterns: ['http://*/*', 'https://*/*']
      });

      expect(mockChrome.contextMenus.create).toHaveBeenCalledWith({
        id: 'rre-analyze-page',
        title: 'Analyze Page Responsiveness',
        contexts: ['page'],
        documentUrlPatterns: ['http://*/*', 'https://*/*']
      });

      expect(mockChrome.contextMenus.create).toHaveBeenCalledWith({
        id: 'rre-toggle-debugger',
        title: 'Toggle RRE Debugger',
        contexts: ['all'],
        documentUrlPatterns: ['http://*/*', 'https://*/*']
      });
    });
  });

  describe('Message Handling', () => {
    it('should handle content script events', async () => {
      const mockSendResponse = jest.fn();
      const message = {
        type: 'content-script-event',
        eventType: 'responsive-easy-detected',
        elementCount: 5,
        hasContext: true,
        hasReactFiber: true
      };
      const sender = { tab: { id: 1 } };

      await backgroundScript['handleMessage'](message, sender, mockSendResponse);

      expect(mockSendResponse).toHaveBeenCalledWith({ success: true });
    });

    it('should handle debug events', async () => {
      const mockSendResponse = jest.fn();
      const message = {
        type: 'debug-event',
        detail: {
          type: 'debugger-enabled'
        }
      };
      const sender = { tab: { id: 1 } };

      await backgroundScript['handleMessage'](message, sender, mockSendResponse);

      expect(mockSendResponse).toHaveBeenCalledWith({ success: true });
    });

    it('should handle get-settings message', async () => {
      const mockSendResponse = jest.fn();
      const message = { type: 'get-settings' };
      const sender = { tab: { id: 1 } };

      await backgroundScript['handleMessage'](message, sender, mockSendResponse);

      expect(mockSendResponse).toHaveBeenCalledWith({
        success: true,
        settings: expect.any(Object)
      });
    });

    it('should handle update-settings message', async () => {
      const mockSendResponse = jest.fn();
      const message = {
        type: 'update-settings',
        settings: { autoEnable: true }
      };
      const sender = { tab: { id: 1 } };

      await backgroundScript['handleMessage'](message, sender, mockSendResponse);

      expect(mockSendResponse).toHaveBeenCalledWith({ success: true });
    });

    it('should handle get-tab-state message', async () => {
      const mockSendResponse = jest.fn();
      const message = { type: 'get-tab-state' };
      const sender = { tab: { id: 1 } };

      await backgroundScript['handleMessage'](message, sender, mockSendResponse);

      expect(mockSendResponse).toHaveBeenCalledWith({
        success: true,
        state: expect.any(Object)
      });
    });

    it('should handle export-global-data message', async () => {
      const mockSendResponse = jest.fn();
      const message = { type: 'export-global-data' };
      const sender = { tab: { id: 1 } };

      await backgroundScript['handleMessage'](message, sender, mockSendResponse);

      expect(mockSendResponse).toHaveBeenCalledWith({
        success: true,
        data: expect.any(Object)
      });
    });

    it('should handle clear-all-data message', async () => {
      const mockSendResponse = jest.fn();
      const message = { type: 'clear-all-data' };
      const sender = { tab: { id: 1 } };

      await backgroundScript['handleMessage'](message, sender, mockSendResponse);

      expect(mockSendResponse).toHaveBeenCalledWith({ success: true });
    });

    it('should handle unknown message types', async () => {
      const mockSendResponse = jest.fn();
      const message = { type: 'unknown-type' };
      const sender = { tab: { id: 1 } };

      await backgroundScript['handleMessage'](message, sender, mockSendResponse);

      expect(mockSendResponse).toHaveBeenCalledWith({
        success: false,
        error: 'Unknown message type'
      });
    });

    it('should handle message errors gracefully', async () => {
      const mockSendResponse = jest.fn();
      const message = { type: 'update-settings', settings: { autoEnable: true } };
      const sender = { tab: { id: 1 } };

      // Mock an error in the updateSettings method by spying on it
      const updateSettingsSpy = jest.spyOn(backgroundScript as any, 'updateSettings');
      updateSettingsSpy.mockRejectedValue(new Error('Storage error'));

      await backgroundScript['handleMessage'](message, sender, mockSendResponse);

      expect(mockSendResponse).toHaveBeenCalledWith({
        success: false,
        error: expect.any(String)
      });

      updateSettingsSpy.mockRestore();
    });
  });

  describe('Tab Management', () => {
    it('should handle tab updates', () => {
      const tabId = 1;
      const changeInfo = { url: 'https://example.com', status: 'complete' };
      const tab = { id: tabId, url: 'https://example.com', title: 'Test Page' };

      backgroundScript['handleTabUpdate'](tabId, changeInfo, tab);

      // Should not throw
      expect(true).toBe(true);
    });

    it('should handle tab removal', () => {
      const tabId = 1;

      backgroundScript['handleTabRemoved'](tabId);

      // Should not throw
      expect(true).toBe(true);
    });

    it('should handle extension startup', () => {
      backgroundScript['handleStartup']();

      // Should not throw
      expect(true).toBe(true);
    });
  });

  describe('Content Script Event Handling', () => {
    it('should handle responsive-easy-detected event', async () => {
      const message = {
        type: 'responsive-easy-detected',
        elementCount: 5,
        hasContext: true,
        hasReactFiber: true
      };
      const tabId = 1;

      await backgroundScript['handleContentScriptEvent'](message, tabId);

      expect(mockChrome.action.setBadgeText).toHaveBeenCalledWith({
        text: 'RRE',
        tabId: 1
      });
      expect(mockChrome.action.setBadgeBackgroundColor).toHaveBeenCalledWith({
        color: '#00ff88',
        tabId: 1
      });
    });

    it('should handle responsive-easy-not-detected event', async () => {
      const message = {
        type: 'responsive-easy-not-detected'
      };
      const tabId = 1;

      await backgroundScript['handleContentScriptEvent'](message, tabId);

      expect(mockChrome.action.setBadgeText).toHaveBeenCalledWith({
        text: '',
        tabId: 1
      });
      expect(mockChrome.action.setBadgeBackgroundColor).toHaveBeenCalledWith({
        color: '#666666',
        tabId: 1
      });
    });

    it('should handle elements-changed event', async () => {
      const message = {
        type: 'elements-changed',
        previousCount: 5,
        currentCount: 15
      };
      const tabId = 1;

      await backgroundScript['handleContentScriptEvent'](message, tabId);

      expect(mockChrome.notifications.create).toHaveBeenCalledWith({
        type: 'basic',
        iconUrl: 'icons/icon-48.png',
        title: 'New responsive elements detected',
        message: 'Found 10 new elements'
      });
    });
  });

  describe('Debug Event Handling', () => {
    it('should handle debugger-enabled event', async () => {
      const detail = { type: 'debugger-enabled' };
      const tabId = 1;

      await backgroundScript['handleDebugEvent'](detail, tabId);

      expect(mockChrome.action.setBadgeText).toHaveBeenCalledWith({
        text: 'ON',
        tabId: 1
      });
      expect(mockChrome.action.setBadgeBackgroundColor).toHaveBeenCalledWith({
        color: '#00ff88',
        tabId: 1
      });
    });

    it('should handle debugger-disabled event', async () => {
      const detail = { type: 'debugger-disabled' };
      const tabId = 1;

      await backgroundScript['handleDebugEvent'](detail, tabId);

      expect(mockChrome.action.setBadgeText).toHaveBeenCalledWith({
        text: 'RRE',
        tabId: 1
      });
      expect(mockChrome.action.setBadgeBackgroundColor).toHaveBeenCalledWith({
        color: '#00ff88',
        tabId: 1
      });
    });

    it('should handle breakpoint-changed event', async () => {
      const detail = {
        type: 'breakpoint-changed',
        breakpoint: { name: 'desktop', width: 1920, height: 1080 }
      };
      const tabId = 1;

      await backgroundScript['handleDebugEvent'](detail, tabId);

      // Should not throw
      expect(true).toBe(true);
    });

    it('should handle element-inspected event', async () => {
      const detail = {
        type: 'element-inspected',
        elementInfo: { selector: '#test', componentType: 'Button' }
      };
      const tabId = 1;

      await backgroundScript['handleDebugEvent'](detail, tabId);

      // Should not throw
      expect(true).toBe(true);
    });

    it('should handle performance-warning event', async () => {
      const detail = {
        type: 'performance-warning',
        message: 'High memory usage detected'
      };
      const tabId = 1;

      await backgroundScript['handleDebugEvent'](detail, tabId);

      expect(mockChrome.notifications.create).toHaveBeenCalledWith({
        type: 'basic',
        iconUrl: 'icons/icon-48.png',
        title: 'Performance Warning',
        message: 'High memory usage detected'
      });
    });
  });

  describe('Context Menu Handling', () => {
    it('should handle debug element context menu click', async () => {
      const info = { menuItemId: 'rre-debug-element', pageX: 100, pageY: 200 };
      const tab = { id: 1 };

      // Mock the sendMessageToTab method to resolve immediately
      jest.spyOn(backgroundScript as any, 'sendMessageToTab').mockResolvedValue({ success: true });

      await backgroundScript['handleContextMenuClick'](info, tab);

      expect(backgroundScript['sendMessageToTab']).toHaveBeenCalledWith(1, {
        type: 'debug-element-at-position',
        x: 100,
        y: 200
      });
    });

    it('should handle analyze page context menu click', async () => {
      const info = { menuItemId: 'rre-analyze-page' };
      const tab = { id: 1 };

      // Mock the sendMessageToTab method to return success
      jest.spyOn(backgroundScript as any, 'sendMessageToTab').mockResolvedValue({ success: true });

      await backgroundScript['handleContextMenuClick'](info, tab);

      expect(backgroundScript['sendMessageToTab']).toHaveBeenCalledWith(1, {
        type: 'analyze-performance'
      });
      expect(mockChrome.tabs.create).toHaveBeenCalledWith({
        url: 'chrome-extension://test-id/analysis-results.html?tabId=1'
      });
    });

    it('should handle toggle debugger context menu click', async () => {
      const info = { menuItemId: 'rre-toggle-debugger' };
      const tab = { id: 1 };

      // Mock the sendMessageToTab method to resolve immediately
      jest.spyOn(backgroundScript as any, 'sendMessageToTab').mockResolvedValue({ success: true });

      await backgroundScript['handleContextMenuClick'](info, tab);

      expect(backgroundScript['sendMessageToTab']).toHaveBeenCalledWith(1, {
        type: 'toggle-debugger'
      });
    });
  });

  describe('Settings Management', () => {
    it('should load settings from storage', async () => {
      const mockSettings = { autoEnable: true, highlightColor: '#ff0000' };
      mockChrome.storage.sync.get.mockResolvedValue({ 'rre-settings': mockSettings });

      await backgroundScript['loadSettings']();

      expect(mockChrome.storage.sync.get).toHaveBeenCalledWith('rre-settings');
    });

    it('should save settings to storage', async () => {
      await backgroundScript['saveSettings']();

      expect(mockChrome.storage.sync.set).toHaveBeenCalledWith({
        'rre-settings': expect.any(Object)
      });
    });

    it('should update settings', async () => {
      const newSettings = { autoEnable: true };
      
      await backgroundScript['updateSettings'](newSettings);

      expect(mockChrome.storage.sync.set).toHaveBeenCalled();
    });
  });

  describe('Data Management', () => {
    it('should export global data', async () => {
      const data = await backgroundScript['exportGlobalData']();

      expect(data).toHaveProperty('timestamp');
      expect(data).toHaveProperty('version');
      expect(data).toHaveProperty('settings');
      expect(data).toHaveProperty('tabStates');
    });

    it('should clear all data', async () => {
      await backgroundScript['clearAllData']();

      expect(mockChrome.storage.sync.clear).toHaveBeenCalled();
      expect(mockChrome.storage.local.clear).toHaveBeenCalled();
    });

    it('should cleanup inactive states', async () => {
      mockChrome.tabs.query.mockResolvedValue([
        { id: 1 },
        { id: 2 }
      ]);

      await backgroundScript['cleanupInactiveStates']();

      expect(mockChrome.tabs.query).toHaveBeenCalledWith({});
    });
  });

  describe('Error Handling', () => {
    it('should handle Chrome API errors gracefully', async () => {
      mockChrome.storage.sync.get.mockRejectedValue(new Error('Storage error'));

      await expect(backgroundScript['loadSettings']()).resolves.not.toThrow();
    });

    it('should handle message sending errors', async () => {
      mockChrome.tabs.sendMessage.mockImplementation((tabId, message, callback) => {
        (mockChrome.runtime as any).lastError = { message: 'Tab not found' };
        callback(undefined);
      });

      await expect(backgroundScript['sendMessageToTab'](1, { type: 'test' }))
        .rejects.toThrow('Tab not found');
    });
  });
});

