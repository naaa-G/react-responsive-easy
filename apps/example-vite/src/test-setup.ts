// Test setup for React Responsive Easy Vite Example
import { vi } from 'vitest'

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}))

// Mock IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}))

// Mock performance API
Object.defineProperty(window, 'performance', {
  writable: true,
  value: {
    now: vi.fn(() => Date.now()),
    getEntriesByType: vi.fn(() => []),
    mark: vi.fn(),
    measure: vi.fn(),
    clearMarks: vi.fn(),
    clearMeasures: vi.fn(),
  },
})

// Mock requestAnimationFrame
global.requestAnimationFrame = vi.fn(cb => setTimeout(cb, 0))
global.cancelAnimationFrame = vi.fn()

// Mock console methods in tests
global.console = {
  ...console,
  warn: vi.fn(),
  error: vi.fn(),
  log: vi.fn(),
}
