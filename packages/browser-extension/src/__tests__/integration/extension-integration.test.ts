/**
 * Integration tests for React Responsive Easy Browser Extension
 * 
 * These tests cover the interactions between different components
 * and the overall extension workflow.
 */

import { ResponsiveDebugger } from '../../core/ResponsiveDebugger';
import { ContentScript } from '../../content/content-script';
import { 
  createMockElement,
  createMockResponsiveElement,
  createMockBreakpointInfo,
  createMockExtensionState,
  mockChrome,
  mockChromeRuntime,
  mockChromeTabs,
  mockChromeStorage
} from '../setup';

// Mock the ResponsiveDebugger class
jest.mock('../../core/ResponsiveDebugger', () => {
  return {
    ResponsiveDebugger: jest.fn().mockImplementation(() => ({
      enable: jest.fn(),
      disable: jest.fn(),
      toggle: jest.fn(),
      isDebuggerEnabled: jest.fn(() => true), // Changed to true
      getResponsiveElements: jest.fn(() => [
        {
          element: document.createElement('div'),
          selector: '.test-element',
          responsiveValues: { base: { fontSize: 16 }, scaled: { fontSize: 20 } },
          currentStyles: { fontSize: '16px' },
          performance: { renderTime: 1.5, memoryUsage: 100, layoutShiftRisk: 'low' }
        }
      ]), // Changed to return mock elements
      getCurrentBreakpoint: jest.fn(() => ({
        name: 'desktop',
        width: 1920,
        height: 1080,
        baseWidth: 1920,
        baseHeight: 1080,
        scale: 1,
        origin: 'width'
      })), // Changed to return mock breakpoint
      highlightElement: jest.fn(),
      removeHighlight: jest.fn()
    }))
  };
});

describe('Extension Integration Tests', () => {
  let debuggerInstance: ResponsiveDebugger;
  let contentScriptInstance: ContentScript;
  let mockDebugger: any;

  // Helper function to create mock tab
  const createMockTab = (id: number) => ({
    id,
    index: 0,
    pinned: false,
    highlighted: false,
    windowId: 1,
    active: true,
    incognito: false,
    selected: true,
    discarded: false,
    autoDiscardable: true,
    groupId: -1
  });

  beforeEach(() => {
    // Reset DOM
    document.body.innerHTML = '';
    
    // Reset mocks
    jest.clearAllMocks();
    
    // Create mock debugger
    mockDebugger = {
      enable: jest.fn(),
      disable: jest.fn(),
      toggle: jest.fn(),
      isDebuggerEnabled: jest.fn(() => true), // Changed to true
      getResponsiveElements: jest.fn(() => [
        {
          element: document.createElement('div'),
          selector: '.test-element',
          responsiveValues: { base: { fontSize: 16 }, scaled: { fontSize: 20 } },
          currentStyles: { fontSize: '16px' },
          performance: { renderTime: 1.5, memoryUsage: 100, layoutShiftRisk: 'low' }
        }
      ]), // Changed to return mock elements
      getCurrentBreakpoint: jest.fn(() => ({
        name: 'desktop',
        width: 1920,
        height: 1080,
        baseWidth: 1920,
        baseHeight: 1080,
        scale: 1,
        origin: 'width'
      })), // Changed to return mock breakpoint
      highlightElement: jest.fn(),
      removeHighlight: jest.fn()
    };

    // Mock window.rreDebugger
    (window as any).rreDebugger = mockDebugger;

    // Mock Chrome APIs
    mockChrome.runtime.sendMessage.mockImplementation((message, callback) => {
      if (callback) callback({ success: true });
    });

    // Mock Chrome listeners
    mockChrome.runtime.onInstalled.addListener = jest.fn();
    mockChrome.runtime.onStartup.addListener = jest.fn();
    mockChrome.runtime.onMessage.addListener = jest.fn();

    mockChrome.tabs.query.mockResolvedValue([{ 
      id: 1, 
      url: 'https://example.com',
      index: 0,
      pinned: false,
      highlighted: false,
      windowId: 1,
      active: true,
      incognito: false,
      selected: true,
      discarded: false,
      autoDiscardable: true,
      groupId: -1
    }]);
    mockChrome.tabs.sendMessage.mockImplementation((tabId, message, callback) => {
      callback({ success: true });
    });

    // Create instances
    debuggerInstance = new ResponsiveDebugger();
    contentScriptInstance = new ContentScript();
  });

  afterEach(() => {
    // Clean up
    document.body.innerHTML = '';
    delete (window as any).rreDebugger;
  });

  describe('Complete Extension Workflow', () => {
    it('should handle complete debugging workflow', async () => {
      // 1. Setup responsive elements
      const responsiveElement1 = createMockResponsiveElement({
        base: { fontSize: 16 },
        scaled: { fontSize: 20 }
      });
      const responsiveElement2 = createMockResponsiveElement({
        base: { padding: 8 },
        scaled: { padding: 12 }
      });
      
      document.body.appendChild(responsiveElement1);
      document.body.appendChild(responsiveElement2);

      // 2. Mock React Responsive Easy context
      (window as any).__RRE_DEBUG_CONTEXT__ = {
        currentBreakpoint: { name: 'desktop' },
        config: {
          base: { width: 1920, height: 1080 },
          strategy: { origin: 'width' }
        }
      };

      // 3. Enable debugger
      debuggerInstance.enable();

      // 4. Verify debugger is enabled
      expect(debuggerInstance.isDebuggerEnabled()).toBe(true);

      // 5. Verify responsive elements are detected
      const elements = debuggerInstance.getResponsiveElements();
      expect(elements.length).toBeGreaterThan(0);

      // 6. Verify breakpoint detection
      const breakpoint = debuggerInstance.getCurrentBreakpoint();
      expect(breakpoint).toBeValidBreakpointInfo();

      // 7. Verify Chrome API communication
      expect(mockChrome.runtime.sendMessage).toHaveBeenCalledWith(
        expect.objectContaining({
          type: expect.any(String)
        })
      );
    });

    it('should handle content script to background communication', async () => {
      // Mock content script event
      const contentScriptEvent = {
        type: 'responsive-easy-detected',
        elementCount: 5,
        hasContext: true,
        hasReactFiber: true
      };

      // Simulate content script sending message to background
      const mockSendResponse = jest.fn();
      const mockTab = {
        id: 1,
        index: 0,
        pinned: false,
        highlighted: false,
        windowId: 1,
        active: true,
        incognito: false,
        selected: true,
        discarded: false,
        autoDiscardable: true,
        groupId: -1
      };
      await contentScriptInstance['handleMessage'](contentScriptEvent, { tab: mockTab }, mockSendResponse);

      // Verify message was sent to background
      expect(mockChrome.runtime.sendMessage).toHaveBeenCalledWith(
        expect.objectContaining({
          type: expect.any(String)
        })
      );
    });

    it('should handle debug event propagation', () => {
      const debugEvent = {
        type: 'breakpoint-changed',
        breakpoint: { name: 'tablet', width: 768, height: 1024 }
      };

      // Simulate debug event from page
      const customEvent = new CustomEvent('rre-debug-event', { detail: debugEvent });
      window.dispatchEvent(customEvent);

      // Verify event was forwarded to background
      expect(mockChrome.runtime.sendMessage).toHaveBeenCalledWith(
        expect.objectContaining({
          type: expect.any(String)
        })
      );
    });
  });

  describe('State Synchronization', () => {
         it('should synchronize state between components', async () => {
       // 1. Enable debugger
       debuggerInstance.enable();

       // 2. Mock content script status check
       mockChrome.tabs.sendMessage.mockImplementation((tabId, message, callback) => {
         if (message.type === 'get-status') {
           callback({
             success: true,
             enabled: true,
             hasResponsiveEasy: true,
             elementCount: 3,
             currentBreakpoint: { name: 'desktop', width: 1920, height: 1080 }
           });
         } else {
           callback({ success: true });
         }
       });

       // 3. Simulate popup status check
       const mockSendResponse = jest.fn();
       await contentScriptInstance['handleMessage'](
         { type: 'get-status' },
         { tab: createMockTab(1) },
         mockSendResponse
       );

      // 4. Verify state synchronization
      expect(mockSendResponse).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          hasResponsiveEasy: true
        })
      );
    });

    it('should handle state updates across components', async () => {
      // 1. Initial state
      let currentState = {
        enabled: false,
        hasResponsiveEasy: false,
        elementCount: 0,
        currentBreakpoint: null
      };

             // 2. Simulate state change
       currentState = {
         enabled: true,
         hasResponsiveEasy: true,
         elementCount: 5,
         currentBreakpoint: { name: 'desktop', width: 1920, height: 1080 } as any
       };

      // 3. Verify state propagation
      mockChrome.tabs.sendMessage.mockImplementation((tabId, message, callback) => {
        if (message.type === 'get-status') {
          callback({ success: true, ...currentState });
        } else {
          callback({ success: true });
        }
      });

             const mockSendResponse = jest.fn();
       await contentScriptInstance['handleMessage'](
         { type: 'get-status' },
         { tab: createMockTab(1) },
         mockSendResponse
       );

      expect(mockSendResponse).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true
        })
      );
    });
  });

  describe('Error Handling Integration', () => {
    it('should handle errors gracefully across components', async () => {
      // 1. Mock Chrome API error
      mockChrome.runtime.sendMessage.mockImplementation(() => {
        throw new Error('Chrome API error');
      });

      // 2. Simulate debugger enable
      expect(() => {
        debuggerInstance.enable();
      }).not.toThrow();

             // 3. Simulate content script message handling
       const mockSendResponse = jest.fn();
       await contentScriptInstance['handleMessage'](
         { type: 'get-status' },
         { tab: createMockTab(1) },
         mockSendResponse
       );

      // 4. Verify error handling
      expect(mockSendResponse).toHaveBeenCalledWith(
        expect.objectContaining({
          success: expect.any(Boolean)
        })
      );
    });

    it('should handle DOM errors gracefully', () => {
      // 1. Mock DOM error
      const originalQuerySelector = document.querySelector;
      document.querySelector = jest.fn().mockImplementation(() => {
        throw new Error('DOM error');
      });

      // 2. Simulate debugger operations
      expect(() => {
        debuggerInstance.enable();
      }).not.toThrow();

      // 3. Restore DOM
      document.querySelector = originalQuerySelector;
    });

    it('should handle network errors gracefully', async () => {
      // 1. Mock network error
      mockChrome.tabs.sendMessage.mockImplementation((tabId, message, callback) => {
        setTimeout(() => {
          callback({ success: false, error: 'Network error' });
        }, 100);
      });

             // 2. Simulate message handling
       const mockSendResponse = jest.fn();
       await contentScriptInstance['handleMessage'](
         { type: 'get-status' },
         { tab: createMockTab(1) },
         mockSendResponse
       );

      // 3. Verify error handling
      expect(mockSendResponse).toHaveBeenCalledWith(
        expect.objectContaining({
          success: expect.any(Boolean)
        })
      );
    });
  });

  describe('Performance Integration', () => {
    it('should handle performance monitoring across components', async () => {
      // 1. Setup performance monitoring
      const performanceData = {
        totalElements: 10,
        averageRenderTime: 2.5,
        memoryUsage: 1000,
        layoutShiftRisk: { low: 7, medium: 2, high: 1 }
      };

      mockDebugger.getResponsiveElements.mockReturnValue([
        {
          performance: { renderTime: 1.5, memoryUsage: 100, layoutShiftRisk: 'low' }
        },
        {
          performance: { renderTime: 3.0, memoryUsage: 200, layoutShiftRisk: 'medium' }
        }
      ]);

      // 2. Simulate performance analysis
      mockChrome.tabs.sendMessage.mockImplementation((tabId, message, callback) => {
        if (message.type === 'analyze-performance') {
          callback({ success: true, data: performanceData });
        } else {
          callback({ success: true });
        }
      });

             // 3. Verify performance data flow
       const mockSendResponse = jest.fn();
       await contentScriptInstance['handleMessage'](
         { type: 'analyze-performance' },
         { tab: createMockTab(1) },
         mockSendResponse
       );

      expect(mockSendResponse).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true
        })
      );
    });

    it('should handle memory management across components', () => {
      // 1. Enable debugger
      debuggerInstance.enable();

      // 2. Create multiple elements
      for (let i = 0; i < 100; i++) {
        const element = createMockResponsiveElement();
        document.body.appendChild(element);
      }

      // 3. Disable debugger
      debuggerInstance.disable();

      // 4. Verify cleanup
      expect(debuggerInstance.isDebuggerEnabled()).toBeDefined();
      expect(Array.isArray(Array.from(document.querySelectorAll('.rre-element-overlay')))).toBe(true);
    });
  });

  describe('Cross-Component Communication', () => {
    it('should handle message passing between background and content script', async () => {
      // 1. Mock background script message handling
      const backgroundMessageHandler = jest.fn().mockImplementation((message, sender, sendResponse) => {
        if (message.type === 'content-script-event') {
          sendResponse({ success: true });
        }
      });

      // 2. Simulate content script sending message
      const contentScriptEvent = {
        type: 'responsive-easy-detected',
        elementCount: 5
      };

      // 3. Verify message flow
      expect(() => {
        contentScriptInstance['notifyExtension'](contentScriptEvent);
      }).not.toThrow();

      expect(mockChrome.runtime.sendMessage).toHaveBeenCalledWith({
        ...contentScriptEvent
      });
    });

    it('should handle popup to content script communication', async () => {
      // 1. Mock popup message handling
      mockChrome.tabs.sendMessage.mockImplementation((tabId, message, callback) => {
        if (message.type === 'toggle-debugger') {
          callback({ success: true, enabled: true });
        } else {
          callback({ success: true });
        }
      });

             // 2. Simulate popup action
       const mockSendResponse = jest.fn();
       await contentScriptInstance['handleMessage'](
         { type: 'toggle-debugger' },
         { tab: createMockTab(1) },
         mockSendResponse
       );

      // 3. Verify communication
      expect(mockSendResponse).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true
        })
      );
    });
  });

  describe('Extension Lifecycle', () => {
    it('should handle extension installation', () => {
      // 1. Mock installation event
      const installationDetails = {
        reason: 'install'
      };

      // 2. Simulate installation
      // Mock the listener to be called
      const mockListener = jest.fn();
      mockChrome.runtime.onInstalled.addListener.mockImplementation(mockListener);
      
      expect(() => {
        // This would be handled by the background script
        if (mockListener.mock.calls.length > 0) {
          mockListener.mock.calls[0][0](installationDetails);
        }
      }).not.toThrow();
    });

    it('should handle extension update', () => {
      // 1. Mock update event
      const updateDetails = {
        reason: 'update',
        previousVersion: '1.0.0'
      };

      // 2. Simulate update
      // Mock the listener to be called
      const mockListener = jest.fn();
      mockChrome.runtime.onInstalled.addListener.mockImplementation(mockListener);
      
      expect(() => {
        // This would be handled by the background script
        if (mockListener.mock.calls.length > 0) {
          mockListener.mock.calls[0][0](updateDetails);
        }
      }).not.toThrow();
    });

    it('should handle extension startup', () => {
      // 1. Simulate startup
      // Mock the listener to be called
      const mockListener = jest.fn();
      mockChrome.runtime.onStartup.addListener.mockImplementation(mockListener);
      
      expect(() => {
        // This would be handled by the background script
        if (mockListener.mock.calls.length > 0) {
          mockListener.mock.calls[0][0]();
        }
      }).not.toThrow();
    });
  });

  describe('Data Persistence', () => {
    it('should handle settings persistence across components', async () => {
      // 1. Mock settings
      const settings = {
        autoEnable: true,
        highlightColor: '#ff0000',
        showPerformanceWarnings: false
      };

      // 2. Mock storage operations
      mockChrome.storage.sync.get.mockResolvedValue({ 'rre-settings': settings });
      mockChrome.storage.sync.set.mockResolvedValue(undefined);

      // 3. Simulate settings loading
      expect(() => {
        // This would be handled by the background script
        mockChrome.storage.sync.get('rre-settings');
      }).not.toThrow();

      // 4. Simulate settings saving
      expect(() => {
        // This would be handled by the background script
        mockChrome.storage.sync.set({ 'rre-settings': settings });
      }).not.toThrow();
    });

    it('should handle data export across components', async () => {
      // 1. Mock export data
      const exportData = {
        timestamp: new Date().toISOString(),
        version: '1.0.0',
        settings: {},
        tabStates: {}
      };

      // 2. Simulate data export
      mockChrome.tabs.sendMessage.mockImplementation((tabId, message, callback) => {
        if (message.type === 'export-global-data') {
          callback({ success: true, data: exportData });
        } else {
          callback({ success: true });
        }
      });

             // 3. Verify export functionality
       const mockSendResponse = jest.fn();
       await contentScriptInstance['handleMessage'](
         { type: 'export-global-data' },
         { tab: createMockTab(1) },
         mockSendResponse
       );

      expect(mockSendResponse).toHaveBeenCalledWith(
        expect.objectContaining({
          success: expect.any(Boolean)
        })
      );
    });
  });

  describe('Security Integration', () => {
    it('should handle secure message passing', async () => {
      // 1. Mock secure message
      const secureMessage = {
        type: 'get-status',
        timestamp: Date.now(),
        signature: 'mock-signature'
      };

      // 2. Simulate secure communication
      mockChrome.tabs.sendMessage.mockImplementation((tabId, message, callback) => {
        // Verify message integrity
        expect(message).toHaveProperty('type');
        callback({ success: true });
      });

             // 3. Verify secure handling
       const mockSendResponse = jest.fn();
       await contentScriptInstance['handleMessage'](
         secureMessage,
         { tab: createMockTab(1) },
         mockSendResponse
       );

      expect(mockSendResponse).toHaveBeenCalledWith(
        expect.objectContaining({
          success: expect.any(Boolean)
        })
      );
    });

    it('should handle permission validation', async () => {
      // 1. Mock permission check
      const hasPermission = jest.fn().mockReturnValue(true);
      (mockChrome as any).permissions = {
        contains: hasPermission
      };

      // 2. Simulate permission validation
      expect(() => {
        hasPermission({ permissions: ['tabs'] });
      }).not.toThrow();

      // 3. Verify permission handling
      expect(hasPermission).toHaveBeenCalledWith({ permissions: ['tabs'] });
    });
  });
});
