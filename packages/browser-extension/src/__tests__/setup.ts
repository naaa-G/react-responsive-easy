/**
 * Jest setup file for React Responsive Easy Browser Extension tests
 * 
 * This file configures the test environment with necessary mocks,
 * utilities, and global configurations for enterprise-grade testing.
 */

import '@testing-library/jest-dom';

// Mock Chrome APIs
const mockChrome = {
  runtime: {
    onInstalled: {
      addListener: jest.fn()
    },
    onMessage: {
      addListener: jest.fn()
    },
    onStartup: {
      addListener: jest.fn()
    },
    sendMessage: jest.fn(),
    getURL: jest.fn((path: string) => `chrome-extension://test-id/${path}`),
    lastError: null,
    getManifest: jest.fn(() => ({
      version: '1.0.0',
      name: 'React Responsive Easy Extension'
    }))
  },
  tabs: {
    onUpdated: {
      addListener: jest.fn()
    },
    onRemoved: {
      addListener: jest.fn()
    },
    query: jest.fn(),
    create: jest.fn(),
    reload: jest.fn(),
    sendMessage: jest.fn()
  },
  contextMenus: {
    create: jest.fn(),
    onClicked: {
      addListener: jest.fn()
    }
  },
  action: {
    setBadgeText: jest.fn(),
    setBadgeBackgroundColor: jest.fn()
  },
  storage: {
    sync: {
      get: jest.fn(),
      set: jest.fn(),
      clear: jest.fn()
    },
    local: {
      clear: jest.fn()
    }
  },
  notifications: {
    create: jest.fn()
  },
  devtools: {
    panels: {
      create: jest.fn()
    }
  },
  debugger: {
    attach: jest.fn(),
    detach: jest.fn(),
    sendCommand: jest.fn()
  }
};

// Mock Chrome global
(global as any).chrome = mockChrome;

// Mock DOM APIs
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock ResizeObserver
const mockResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));
global.ResizeObserver = mockResizeObserver;
(window as any).ResizeObserver = mockResizeObserver;

// Mock MutationObserver
const mockMutationObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  disconnect: jest.fn(),
  takeRecords: jest.fn(() => [])
}));
global.MutationObserver = mockMutationObserver;
(window as any).MutationObserver = mockMutationObserver;

// Mock performance API
Object.defineProperty(window, 'performance', {
  writable: true,
  value: {
    now: jest.fn(() => Date.now()),
    mark: jest.fn(),
    measure: jest.fn(),
    getEntriesByType: jest.fn(() => []),
    getEntriesByName: jest.fn(() => [])
  }
});

// Mock requestAnimationFrame
global.requestAnimationFrame = jest.fn((cb) => setTimeout(cb, 16));
global.cancelAnimationFrame = jest.fn((id) => clearTimeout(id));

// Mock URL.createObjectURL and URL.revokeObjectURL
global.URL.createObjectURL = jest.fn(() => 'mock-object-url');
global.URL.revokeObjectURL = jest.fn();

// Mock console methods to avoid noise in tests
const originalConsole = console;
global.console = {
  ...originalConsole,
  log: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
  info: jest.fn(),
  debug: jest.fn()
};

// Test utilities - defined early to avoid circular dependencies
const createMockElement = (tagName: string = 'div', attributes: Record<string, string> = {}) => {
  const element = document.createElement(tagName);
  
  Object.entries(attributes).forEach(([key, value]) => {
    element.setAttribute(key, value);
  });
  
  // Mock common properties
  Object.defineProperty(element, 'offsetHeight', { value: 100, writable: true });
  Object.defineProperty(element, 'offsetWidth', { value: 100, writable: true });
  Object.defineProperty(element, 'offsetLeft', { value: 0, writable: true });
  Object.defineProperty(element, 'offsetTop', { value: 0, writable: true });
  
  return element;
};

// Mock document methods
const mockQuerySelector = jest.fn(() => null);
const mockQuerySelectorAll = jest.fn(() => {
  const mockNodeList = {
    length: 0,
    item: jest.fn(),
    forEach: jest.fn(),
    [Symbol.iterator]: jest.fn(() => [][Symbol.iterator]())
  };
  return mockNodeList;
});
const mockGetElementById = jest.fn(() => null);
// Store the original createElement before mocking
const originalCreateElement = document.createElement;

const mockCreateElement = jest.fn((tagName: string) => {
  const element = originalCreateElement.call(document, tagName);
  // Ensure the element has all necessary properties for different tag types
  if (tagName === 'link') {
    Object.defineProperty(element, 'rel', { value: '', writable: true });
    Object.defineProperty(element, 'href', { value: '', writable: true });
    Object.defineProperty(element, 'type', { value: '', writable: true });
  } else if (tagName === 'script') {
    Object.defineProperty(element, 'src', { value: '', writable: true });
    Object.defineProperty(element, 'type', { value: 'text/javascript', writable: true });
  } else if (tagName === 'style') {
    Object.defineProperty(element, 'type', { value: 'text/css', writable: true });
  }
  return element;
});

Object.defineProperty(document, 'querySelector', {
  value: mockQuerySelector,
  writable: true
});

Object.defineProperty(document, 'querySelectorAll', {
  value: mockQuerySelectorAll,
  writable: true
});

Object.defineProperty(document, 'getElementById', {
  value: mockGetElementById,
  writable: true
});

Object.defineProperty(document, 'createElement', {
  value: mockCreateElement,
  writable: true
});

// Mock document.head and document.documentElement
Object.defineProperty(document, 'head', {
  value: createMockElement('head'),
  writable: true
});

Object.defineProperty(document, 'documentElement', {
  value: createMockElement('html'),
  writable: true
});

// Mock window methods
Object.defineProperty(window, 'addEventListener', {
  value: jest.fn(),
  writable: true
});

Object.defineProperty(window, 'removeEventListener', {
  value: jest.fn(),
  writable: true
});

Object.defineProperty(window, 'dispatchEvent', {
  value: jest.fn(),
  writable: true
});

// Mock getComputedStyle
Object.defineProperty(window, 'getComputedStyle', {
  value: jest.fn(() => ({
    fontSize: '16px',
    padding: '0px',
    margin: '0px',
    width: '100px',
    height: '100px',
    position: 'static',
    getPropertyValue: jest.fn((prop: string) => {
      const styles: Record<string, string> = {
        fontSize: '16px',
        padding: '0px',
        margin: '0px',
        width: '100px',
        height: '100px',
        position: 'static'
      };
      return styles[prop] || '';
    })
  })),
  writable: true
});

// Mock getBoundingClientRect
Element.prototype.getBoundingClientRect = jest.fn(() => ({
  top: 0,
  left: 0,
  bottom: 100,
  right: 100,
  width: 100,
  height: 100,
  x: 0,
  y: 0,
  toJSON: jest.fn()
}));

// Mock styleSheets
Object.defineProperty(document, 'styleSheets', {
  value: [],
  writable: true
});

// Mock CSSStyleSheet
global.CSSStyleSheet = jest.fn().mockImplementation(() => ({
  cssRules: []
}));

global.CSSMediaRule = jest.fn().mockImplementation(() => ({
  cssRules: []
}));

global.CSSStyleRule = jest.fn().mockImplementation(() => ({
  selectorText: '',
  style: {}
}));

// Export the createMockElement function
export { createMockElement };

export const createMockResponsiveElement = (data: Record<string, any> = {}) => {
  const element = createMockElement('div', { 'data-responsive': JSON.stringify(data) });
  return element;
};

export const createMockBreakpointInfo = (overrides: Partial<any> = {}) => ({
  name: 'desktop',
  width: 1920,
  height: 1080,
  scale: 1.0,
  origin: 'width',
  baseWidth: 1920,
  baseHeight: 1080,
  ...overrides
});

export const createMockResponsiveElementInfo = (overrides: Partial<any> = {}) => ({
  element: createMockElement(),
  selector: '#test-element',
  componentType: 'Button',
  responsiveValues: {},
  currentStyles: {
    fontSize: '16px',
    padding: '8px',
    margin: '0px',
    width: '100px',
    height: '40px'
  },
  breakpointBehavior: {
    hasMediaQueries: false,
    responsiveProperties: [],
    scalingBehavior: 'static' as const
  },
  scalingInfo: null,
  performance: {
    renderTime: 1.5,
    memoryUsage: 100,
    layoutShiftRisk: 'low' as const
  },
  ...overrides
});

export const createMockExtensionState = (overrides: Partial<any> = {}) => ({
  hasResponsiveEasy: false,
  debuggerEnabled: false,
  elementCount: 0,
  currentBreakpoint: null,
  hasContext: false,
  hasReactFiber: false,
  inspectionHistory: [],
  ...overrides
});

export const createMockExtensionSettings = (overrides: Partial<any> = {}) => ({
  autoEnable: false,
  highlightColor: '#00ff88',
  showPerformanceWarnings: true,
  enableKeyboardShortcuts: true,
  debugMode: false,
  ...overrides
});

// Mock Chrome API helpers
export const mockChromeRuntime = {
  sendMessage: jest.fn(),
  onMessage: {
    addListener: jest.fn()
  },
  onInstalled: {
    addListener: jest.fn()
  },
  onStartup: {
    addListener: jest.fn()
  },
  getURL: jest.fn((path: string) => `chrome-extension://test-id/${path}`),
  lastError: null,
  getManifest: jest.fn(() => ({
    version: '1.0.0',
    name: 'React Responsive Easy Extension'
  }))
};

export const mockChromeTabs = {
  query: jest.fn(),
  create: jest.fn(),
  reload: jest.fn(),
  sendMessage: jest.fn(),
  onUpdated: {
    addListener: jest.fn()
  },
  onRemoved: {
    addListener: jest.fn()
  }
};

export const mockChromeStorage = {
  sync: {
    get: jest.fn(),
    set: jest.fn(),
    clear: jest.fn()
  },
  local: {
    clear: jest.fn()
  }
};

// Reset all mocks before each test
beforeEach(() => {
  jest.clearAllMocks();
  
  // Reset DOM mocks
  mockQuerySelector.mockClear();
  mockQuerySelectorAll.mockClear();
  mockGetElementById.mockClear();
  mockCreateElement.mockClear();
  
  // Reset Chrome API mocks
  Object.values(mockChrome).forEach(api => {
    if (typeof api === 'object' && api !== null) {
      Object.values(api).forEach(method => {
        if (typeof method === 'function') {
          method.mockClear();
        }
      });
    }
  });
  
  // Reset global mocks
  (global.console.log as jest.Mock).mockClear();
  (global.console.warn as jest.Mock).mockClear();
  (global.console.error as jest.Mock).mockClear();
  
  // Reset performance mock
  (global.performance.now as jest.Mock).mockReturnValue(Date.now());
});

// Global test helpers
declare global {
  namespace jest {
    interface Matchers<R> {
      toBeValidBreakpointInfo(): R;
      toBeValidResponsiveElementInfo(): R;
      toBeValidExtensionState(): R;
    }
  }
}

// Custom Jest matchers
expect.extend({
  toBeValidBreakpointInfo(received: any) {
    const requiredFields = ['name', 'width', 'height', 'scale', 'origin', 'baseWidth', 'baseHeight'];
    const missingFields = requiredFields.filter(field => !(field in received));
    
    if (missingFields.length > 0) {
      return {
        message: () => `Expected object to be valid breakpoint info, but missing fields: ${missingFields.join(', ')}`,
        pass: false
      };
    }
    
    return {
      message: () => 'Expected object to be valid breakpoint info',
      pass: true
    };
  },
  
  toBeValidResponsiveElementInfo(received: any) {
    const requiredFields = ['element', 'selector', 'componentType', 'responsiveValues', 'currentStyles', 'breakpointBehavior', 'performance'];
    const missingFields = requiredFields.filter(field => !(field in received));
    
    if (missingFields.length > 0) {
      return {
        message: () => `Expected object to be valid responsive element info, but missing fields: ${missingFields.join(', ')}`,
        pass: false
      };
    }
    
    return {
      message: () => 'Expected object to be valid responsive element info',
      pass: true
    };
  },
  
  toBeValidExtensionState(received: any) {
    const requiredFields = ['hasResponsiveEasy', 'debuggerEnabled', 'elementCount', 'currentBreakpoint', 'hasContext', 'hasReactFiber', 'inspectionHistory'];
    const missingFields = requiredFields.filter(field => !(field in received));
    
    if (missingFields.length > 0) {
      return {
        message: () => `Expected object to be valid extension state, but missing fields: ${missingFields.join(', ')}`,
        pass: false
      };
    }
    
    return {
      message: () => 'Expected object to be valid extension state',
      pass: true
    };
  }
});

// Export mock objects for use in tests
export { mockChrome };
