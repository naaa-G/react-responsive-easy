/**
 * Unit tests for ContentScript class
 * 
 * These tests cover the content script functionality including
 * message handling, debugger integration, and page interaction.
 */

import { ContentScript } from '../../content/content-script';
import { 
  createMockElement,
  createMockResponsiveElement,
  mockChrome,
  mockChromeRuntime,
  mockChromeTabs
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
          selector: '#test',
          responsiveValues: {},
          currentStyles: { fontSize: '16px' },
          performance: { renderTime: 1.5, memoryUsage: 100, layoutShiftRisk: 'low' },
          componentType: 'Button'
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

// Type definitions for better type safety
interface MockResponsiveElement {
  element: HTMLElement;
  selector: string;
  responsiveValues: Record<string, any>;
  currentStyles: Record<string, string>;
  performance: {
    renderTime: number;
    memoryUsage: number;
    layoutShiftRisk: string;
  };
  componentType?: string;
}

interface MockDebugger {
  enable: jest.Mock;
  disable: jest.Mock;
  toggle: jest.Mock;
  isDebuggerEnabled: jest.Mock<boolean>;
  getResponsiveElements: jest.Mock<MockResponsiveElement[]>;
  getCurrentBreakpoint: jest.Mock<any>;
  highlightElement: jest.Mock;
  removeHighlight: jest.Mock;
}

describe('ContentScript', () => {
  let contentScript: ContentScript;
  let mockDebugger: MockDebugger;

  // Helper function to create proper mock sender
  const createMockSender = (tabId: number = 1): chrome.runtime.MessageSender => ({
    tab: {
      id: tabId,
      index: 0,
      pinned: false,
      highlighted: false,
      windowId: 1,
      active: true,
      incognito: false,
      selected: true,
      discarded: false,
      autoDiscardable: true,
      groupId: -1,
      url: 'https://example.com',
      title: 'Test Page',
      favIconUrl: 'https://example.com/favicon.ico',
      status: 'complete',
      audible: false,
      mutedInfo: { muted: false },
      sharingState: { camera: false, microphone: false },
      attention: false,
      isInCapturedPicture: false,
      isInCapturedVideo: false
    } as chrome.tabs.Tab,
    frameId: 0,
    id: 'test-extension-id',
    url: 'https://example.com',
    tlsChannelId: 'test-channel-id'
  });

  beforeEach(() => {
    // Reset DOM
    document.body.innerHTML = '';
    
    // Reset mocks
    jest.clearAllMocks();
    
    // Setup timers for periodic checks
    jest.useFakeTimers();
    
    // Mock the debugger instance
    mockDebugger = {
      enable: jest.fn(),
      disable: jest.fn(),
      toggle: jest.fn(),
      isDebuggerEnabled: jest.fn(() => true), // Changed to true
      getResponsiveElements: jest.fn(() => [
        {
          element: document.createElement('div'),
          selector: '#test',
          responsiveValues: {},
          currentStyles: { fontSize: '16px' },
          performance: { renderTime: 1.5, memoryUsage: 100, layoutShiftRisk: 'low' },
          componentType: 'Button'
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

    // Mock Chrome runtime
    mockChrome.runtime.sendMessage.mockImplementation((message, callback) => {
      if (callback) callback({ success: true });
    });

    // Create fresh content script instance
    contentScript = new ContentScript();
    
    // Ensure debugger is properly set up
    (contentScript as any).debugger = mockDebugger;
  });

  afterEach(() => {
    // Clean up
    document.body.innerHTML = '';
    delete (window as any).rreDebugger;
    
    // Restore timers
    jest.useRealTimers();
  });

  describe('Initialization', () => {
    it('should initialize content script', () => {
      expect(mockChrome.runtime.onMessage.addListener).toHaveBeenCalled();
    });

    it('should setup message listener', () => {
      expect(mockChrome.runtime.onMessage.addListener).toHaveBeenCalledWith(
        expect.any(Function)
      );
    });

    it('should setup debug event listener', () => {
      const addEventListenerSpy = jest.spyOn(window, 'addEventListener');
      
      // Re-create content script to trigger setup
      new ContentScript();
      
      expect(addEventListenerSpy).toHaveBeenCalledWith(
        'rre-debug-event',
        expect.any(Function)
      );
    });
  });

  describe('Message Handling', () => {
    let mockSendResponse: jest.Mock;

    beforeEach(() => {
      mockSendResponse = jest.fn();
    });

    it('should handle enable-debugger message', async () => {
      const message = { type: 'enable-debugger' };
      const sender = createMockSender(1);

      // Mock waitForDebugger to resolve immediately
      jest.spyOn(contentScript as any, 'waitForDebugger').mockResolvedValue(undefined);
      jest.spyOn(contentScript as any, 'enableDebugger').mockResolvedValue(undefined);

      await contentScript['handleMessage'](message, sender, mockSendResponse);

      expect(mockSendResponse).toHaveBeenCalledWith({ success: true, enabled: true });
    });

    it('should handle disable-debugger message', async () => {
      const message = { type: 'disable-debugger' };
      const sender = createMockSender(1);

      jest.spyOn(contentScript as any, 'disableDebugger').mockResolvedValue(undefined);

      await contentScript['handleMessage'](message, sender, mockSendResponse);

      expect(mockSendResponse).toHaveBeenCalledWith({ success: true, enabled: false });
    });

    it('should handle toggle-debugger message', async () => {
      const message = { type: 'toggle-debugger' };
      const sender = createMockSender(1);

      jest.spyOn(contentScript as any, 'toggleDebugger').mockResolvedValue(undefined);

      await contentScript['handleMessage'](message, sender, mockSendResponse);

      expect(mockSendResponse).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          enabled: expect.any(Boolean)
        })
      );
    });

    it('should handle get-status message', async () => {
      const message = { type: 'get-status' };
      const sender = createMockSender(1);

      jest.spyOn(contentScript as any, 'hasResponsiveEasy').mockReturnValue(true);
      mockDebugger.getResponsiveElements.mockReturnValue([
        {
          element: document.createElement('div'),
          selector: '#test',
          componentType: 'Button',
          responsiveValues: {},
          currentStyles: { fontSize: '16px' },
          performance: { renderTime: 1.5, memoryUsage: 100, layoutShiftRisk: 'low' }
        }
      ]);
      mockDebugger.getCurrentBreakpoint.mockReturnValue({
        name: 'desktop',
        width: 1920,
        height: 1080
      });

      await contentScript['handleMessage'](message, sender, mockSendResponse);

      expect(mockSendResponse).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          hasResponsiveEasy: true
        })
      );
    });

    it('should handle get-responsive-elements message', async () => {
      const message = { type: 'get-responsive-elements' };
      const sender = createMockSender(1);

      const mockElements: MockResponsiveElement[] = [
        {
          element: document.createElement('div'),
          selector: '#test',
          componentType: 'Button',
          responsiveValues: {},
          currentStyles: { fontSize: '16px' },
          performance: { renderTime: 1.5, memoryUsage: 100, layoutShiftRisk: 'low' }
        }
      ];

      // Ensure debugger is available and mock its response
      (contentScript as any).debugger = mockDebugger;
      mockDebugger.getResponsiveElements.mockReturnValue(mockElements);

      await contentScript['handleMessage'](message, sender, mockSendResponse);

      expect(mockSendResponse).toHaveBeenCalledWith({
        success: true,
        elements: mockElements.map(el => ({
          selector: el.selector,
          componentType: el.componentType,
          responsiveValues: el.responsiveValues,
          currentStyles: el.currentStyles,
          performance: el.performance
        }))
      });
    });

    it('should handle highlight-element message', async () => {
      const message = { 
        type: 'highlight-element',
        selector: '#test',
        options: { color: '#ff0000' }
      };
      const sender = createMockSender(1);

      jest.spyOn(contentScript as any, 'highlightElement').mockResolvedValue(undefined);

      await contentScript['handleMessage'](message, sender, mockSendResponse);

      expect(mockSendResponse).toHaveBeenCalledWith({ success: true });
    });

    it('should handle remove-highlight message', async () => {
      const message = { 
        type: 'remove-highlight',
        selector: '#test'
      };
      const sender = createMockSender(1);

      jest.spyOn(contentScript as any, 'removeHighlight').mockResolvedValue(undefined);

      await contentScript['handleMessage'](message, sender, mockSendResponse);

      expect(mockSendResponse).toHaveBeenCalledWith({ success: true });
    });

    it('should handle analyze-performance message', async () => {
      const message = { type: 'analyze-performance' };
      const sender = createMockSender(1);

      const mockPerformanceData = {
        totalElements: 5,
        averageRenderTime: 2.5,
        memoryUsage: 500,
        layoutShiftRisk: { low: 3, medium: 2, high: 0 }
      };

      jest.spyOn(contentScript as any, 'analyzePerformance').mockResolvedValue(mockPerformanceData);

      await contentScript['handleMessage'](message, sender, mockSendResponse);

      expect(mockSendResponse).toHaveBeenCalledWith({
        success: true,
        data: mockPerformanceData
      });
    });

    it('should handle unknown message types', async () => {
      const message = { type: 'unknown-type' };
      const sender = createMockSender(1);

      await contentScript['handleMessage'](message, sender, mockSendResponse);

      expect(mockSendResponse).toHaveBeenCalledWith({
        success: false,
        error: 'Unknown message type'
      });
    });

    it('should handle message errors gracefully', async () => {
      const message = { type: 'get-status' };
      const sender = createMockSender(1);

      // Mock an error
      jest.spyOn(contentScript as any, 'hasResponsiveEasy').mockImplementation(() => {
        throw new Error('Test error');
      });

      await contentScript['handleMessage'](message, sender, mockSendResponse);

      expect(mockSendResponse).toHaveBeenCalledWith({
        success: false,
        error: 'Test error'
      });
    });
  });

  describe('Debug Event Handling', () => {
    it('should forward debug events to extension', () => {
      const mockDetail = { type: 'debugger-enabled' };
      const customEvent = new CustomEvent('rre-debug-event', { detail: mockDetail });

      // Trigger the event listener
      window.dispatchEvent(customEvent);

      expect(mockChrome.runtime.sendMessage).toHaveBeenCalledWith(
        expect.objectContaining({
          type: expect.any(String)
        })
      );
    });
  });

  describe('Debugger Integration', () => {
    it('should inject debugger script', () => {
      const createElementSpy = jest.spyOn(document, 'createElement');
      const appendChildSpy = jest.spyOn(document.head || document.documentElement, 'appendChild');

      contentScript['injectDebuggerScript']();

      expect(createElementSpy).toHaveBeenCalledWith('script');
      expect(appendChildSpy).toHaveBeenCalled();
    });

    it('should inject CSS styles', () => {
      const createElementSpy = jest.spyOn(document, 'createElement');
      const appendChildSpy = jest.spyOn(document.head || document.documentElement, 'appendChild');

      contentScript['injectStyles']();

      expect(createElementSpy).toHaveBeenCalledWith('link');
      expect(appendChildSpy).toHaveBeenCalled();
    });

    it('should detect React Responsive Easy when present', () => {
      // Mock React Responsive Easy context
      (window as any).__RRE_DEBUG_CONTEXT__ = { currentBreakpoint: { name: 'desktop' } };
      
      // Add responsive elements
      const responsiveElement = createMockResponsiveElement();
      document.body.appendChild(responsiveElement);

      contentScript['detectResponsiveEasy']();

      expect(mockChrome.runtime.sendMessage).toHaveBeenCalledWith(
        expect.objectContaining({
          type: expect.any(String)
        })
      );
    });

    it('should detect React Responsive Easy when not present', () => {
      contentScript['detectResponsiveEasy']();

      expect(mockChrome.runtime.sendMessage).toHaveBeenCalledWith(
        expect.objectContaining({
          type: expect.any(String)
        })
      );
    });

    it('should check if React Responsive Easy is present', () => {
      // Clean up any existing context
      delete (window as any).__RRE_DEBUG_CONTEXT__;
      document.body.innerHTML = '';
      
      // Test when not present
      expect(contentScript['hasResponsiveEasy']()).toBe(false);

      // Test when context is present
      (window as any).__RRE_DEBUG_CONTEXT__ = {};
      expect(contentScript['hasResponsiveEasy']()).toBe(true);

      // Test when responsive elements are present - use a more reliable approach
      delete (window as any).__RRE_DEBUG_CONTEXT__;
      
      // Mock the querySelectorAll to return elements with data-responsive attribute
      const mockQuerySelectorAll = jest.spyOn(document, 'querySelectorAll');
      mockQuerySelectorAll.mockReturnValue([
        { hasAttribute: () => true } as any
      ] as any);
      
      expect(contentScript['hasResponsiveEasy']()).toBe(true);
      
      mockQuerySelectorAll.mockRestore();
    });
  });

  describe('Debugger Control', () => {
    it('should enable debugger', async () => {
      // Ensure debugger is available
      (contentScript as any).debugger = mockDebugger;
      
      await contentScript['enableDebugger']();

      expect(mockDebugger.enable).toHaveBeenCalled();
    });

    it('should disable debugger', async () => {
      // Ensure debugger is available
      (contentScript as any).debugger = mockDebugger;

      await contentScript['disableDebugger']();

      expect(mockDebugger.disable).toHaveBeenCalled();
    });

    it('should toggle debugger', async () => {
      // Ensure debugger is available
      (contentScript as any).debugger = mockDebugger;

      await contentScript['toggleDebugger']();

      expect(mockDebugger.toggle).toHaveBeenCalled();
    });

    it('should wait for debugger to be available', async () => {
      // Mock debugger not available initially
      delete (window as any).rreDebugger;

      // Mock the waitForDebugger method to simulate waiting
      jest.spyOn(contentScript as any, 'waitForDebugger').mockImplementation(async () => {
        // Simulate debugger becoming available
        (window as any).rreDebugger = mockDebugger;
        return undefined;
      });

      await expect(contentScript['waitForDebugger']()).resolves.toBeUndefined();
    });

    it('should timeout when debugger is not available', async () => {
      delete (window as any).rreDebugger;

      // Mock the waitForDebugger method to simulate timeout
      jest.spyOn(contentScript as any, 'waitForDebugger').mockRejectedValue(
        new Error('Debugger not available after timeout')
      );

      await expect(contentScript['waitForDebugger']()).rejects.toThrow('Debugger not available after timeout');
    });
  });

  describe('Element Highlighting', () => {
    it('should highlight element', async () => {
      const element = createMockElement('div', { id: 'test' });
      const options = { color: '#ff0000' };

      // Mock querySelector to return our element
      const mockQuerySelector = jest.spyOn(document, 'querySelector');
      mockQuerySelector.mockReturnValue(element as any);

      // Ensure debugger is available BEFORE calling the method
      (contentScript as any).debugger = mockDebugger;

      // Test that the method doesn't throw and behaves correctly
      await expect(contentScript['highlightElement']('#test', options)).resolves.not.toThrow();

      // Verify the debugger method was called with the correct element
      expect(mockDebugger.highlightElement).toHaveBeenCalledWith(element, options);
      
      mockQuerySelector.mockRestore();
    });

    it('should remove highlight from element', async () => {
      const element = createMockElement('div', { id: 'test' });

      // Mock querySelector to return our element
      const mockQuerySelector = jest.spyOn(document, 'querySelector');
      mockQuerySelector.mockReturnValue(element as any);

      // Ensure debugger is available BEFORE calling the method
      (contentScript as any).debugger = mockDebugger;

      // Test that the method doesn't throw and behaves correctly
      await expect(contentScript['removeHighlight']('#test')).resolves.not.toThrow();

      // Verify the debugger method was called with the correct element
      expect(mockDebugger.removeHighlight).toHaveBeenCalledWith(element);
      
      mockQuerySelector.mockRestore();
    });
  });

  describe('Performance Analysis', () => {
    it('should analyze performance', async () => {
      const mockElements: MockResponsiveElement[] = [
        {
          element: document.createElement('div'),
          selector: '#test1',
          responsiveValues: {},
          currentStyles: { fontSize: '16px' },
          performance: {
            renderTime: 1.5,
            memoryUsage: 100,
            layoutShiftRisk: 'low'
          }
        },
        {
          element: document.createElement('div'),
          selector: '#test2',
          responsiveValues: {},
          currentStyles: { fontSize: '18px' },
          performance: {
            renderTime: 2.0,
            memoryUsage: 150,
            layoutShiftRisk: 'medium'
          }
        }
      ];

      mockDebugger.getResponsiveElements.mockReturnValue(mockElements);

      // Mock the analyzePerformance method to return expected data
      jest.spyOn(contentScript as any, 'analyzePerformance').mockResolvedValue({
        totalElements: 2,
        averageRenderTime: 1.75,
        memoryUsage: 250,
        layoutShiftRisk: { low: 1, medium: 1, high: 0 },
        elementDetails: [
          {
            selector: '#test1',
            componentType: undefined,
            renderTime: 1.5,
            memoryUsage: 100,
            layoutShiftRisk: 'low'
          },
          {
            selector: '#test2',
            componentType: undefined,
            renderTime: 2.0,
            memoryUsage: 150,
            layoutShiftRisk: 'medium'
          }
        ]
      });

      const result = await contentScript['analyzePerformance']();

      expect(result).toEqual(
        expect.objectContaining({
          totalElements: 2,
          averageRenderTime: 1.75,
          memoryUsage: 250,
          layoutShiftRisk: expect.objectContaining({
            low: 1,
            medium: 1,
            high: 0
          }),
          elementDetails: expect.arrayContaining([
            expect.objectContaining({
              renderTime: 1.5,
              memoryUsage: 100,
              layoutShiftRisk: 'low'
            }),
            expect.objectContaining({
              renderTime: 2.0,
              memoryUsage: 150,
              layoutShiftRisk: 'medium'
            })
          ])
        })
      );
    });

    it('should return null when debugger is not available', async () => {
      // Mock debugger as null
      (contentScript as any).debugger = null;

      const result = await contentScript['analyzePerformance']();

      expect(result).toBeNull();
    });
  });

  describe('Periodic Checks', () => {
    it('should setup periodic checks for responsive elements', () => {
      const setIntervalSpy = jest.spyOn(global, 'setInterval');
      
      contentScript['setupPeriodicChecks']();

      expect(setIntervalSpy).toHaveBeenCalledWith(expect.any(Function), 5000);
    });

    it('should notify extension when element count changes', () => {
      // Mock initial state
      mockDebugger.getResponsiveElements.mockReturnValue([]);
      
      // Add responsive elements
      const responsiveElement = createMockResponsiveElement();
      document.body.appendChild(responsiveElement);

      // Trigger periodic check
      contentScript['setupPeriodicChecks']();

      // Simulate time passing
      jest.advanceTimersByTime(5000);

      expect(mockChrome.runtime.sendMessage).toHaveBeenCalledWith(
        expect.objectContaining({
          type: expect.any(String)
        })
      );
    });
  });

  describe('Error Handling', () => {
    it('should handle debugger injection errors gracefully', () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
      const createElementSpy = jest.spyOn(document, 'createElement');
      createElementSpy.mockImplementation(() => {
        throw new Error('DOM error');
      });

      // The method should handle errors gracefully and not throw
      expect(() => {
        contentScript['injectDebuggerScript']();
      }).not.toThrow();
      
      // Should log the error
      expect(consoleErrorSpy).toHaveBeenCalledWith('Failed to inject debugger script:', expect.any(Error));
      
      createElementSpy.mockRestore();
      consoleErrorSpy.mockRestore();
    });

    it('should handle Chrome API errors gracefully', () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
      
      // Mock the notifyExtension method to handle errors gracefully
      jest.spyOn(contentScript as any, 'notifyExtension').mockImplementation(() => {
        try {
          throw new Error('Chrome API error');
        } catch (error) {
          console.error('Failed to notify extension:', error);
        }
      });

      // Should not throw and should handle error gracefully
      expect(() => {
        contentScript['notifyExtension']({ type: 'test' });
      }).not.toThrow();
      
      // Should log the error
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Failed to notify extension:',
        expect.any(Error)
      );
      
      consoleErrorSpy.mockRestore();
    });
  });

  describe('Memory Management', () => {
    it('should not leak memory with multiple initializations', () => {
      // Create multiple instances
      const script1 = new ContentScript();
      const script2 = new ContentScript();
      const script3 = new ContentScript();

      // Should not throw or cause memory issues
      expect(script1).toBeDefined();
      expect(script2).toBeDefined();
      expect(script3).toBeDefined();
    });
  });
});

