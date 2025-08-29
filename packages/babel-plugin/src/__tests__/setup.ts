/**
 * Test setup for Babel plugin
 */

import { vi } from 'vitest';

// Mock console to reduce noise in tests
global.console = {
  ...console,
  log: vi.fn(),
  warn: vi.fn(),
  error: vi.fn(),
};
