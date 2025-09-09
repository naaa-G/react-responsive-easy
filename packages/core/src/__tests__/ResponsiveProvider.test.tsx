import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ResponsiveProvider, useResponsiveContext } from '../provider/ResponsiveContext';
import { createDefaultConfig } from '../utils/defaultConfig';

// Mock window resize
const mockResize = (width: number, height: number) => {
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: width,
  });
  Object.defineProperty(window, 'innerHeight', {
    writable: true,
    configurable: true,
    value: height,
  });
  
  fireEvent(window, new Event('resize'));
};

// Test component that uses the context
const TestComponent: React.FC = () => {
  const { currentBreakpoint, config } = useResponsiveContext();
  
  return (
    <div>
      <div data-testid="breakpoint-name">{currentBreakpoint.name}</div>
      <div data-testid="breakpoint-width">{currentBreakpoint.width}</div>
      <div data-testid="breakpoint-height">{currentBreakpoint.height}</div>
      <div data-testid="base-name">{config.base.name}</div>
    </div>
  );
};

describe('ResponsiveProvider', () => {
  let config: any;

  beforeEach(() => {
    config = createDefaultConfig();
    // Reset window size to desktop
    mockResize(1920, 1080);
    
    // Ensure window properties are properly set
    Object.defineProperty(window, 'innerWidth', { 
      value: 1920, 
      writable: true,
      configurable: true 
    });
    Object.defineProperty(window, 'innerHeight', { 
      value: 1080, 
      writable: true,
      configurable: true 
    });
  });

  it('should render children and provide context', () => {
    render(
      <ResponsiveProvider config={config}>
        <TestComponent />
      </ResponsiveProvider>
    );

    expect(screen.getByTestId('breakpoint-name')).toHaveTextContent('desktop');
    expect(screen.getByTestId('breakpoint-width')).toHaveTextContent('1920');
    expect(screen.getByTestId('breakpoint-height')).toHaveTextContent('1080');
    expect(screen.getByTestId('base-name')).toHaveTextContent('desktop');
  });

  it('should use initialBreakpoint when provided', () => {
    const mobileBreakpoint = config.breakpoints.find((bp: any) => bp.alias === 'mobile')!;
    
    render(
      <ResponsiveProvider config={config} initialBreakpoint={mobileBreakpoint}>
        <TestComponent />
      </ResponsiveProvider>
    );

    expect(screen.getByTestId('breakpoint-name')).toHaveTextContent('mobile');
    expect(screen.getByTestId('breakpoint-width')).toHaveTextContent('390');
    expect(screen.getByTestId('breakpoint-height')).toHaveTextContent('844');
  });

  it('should update breakpoint on window resize', () => {
    render(
      <ResponsiveProvider config={config}>
        <TestComponent />
      </ResponsiveProvider>
    );

    // Initially should be desktop
    expect(screen.getByTestId('breakpoint-name')).toHaveTextContent('desktop');

    // Resize to mobile dimensions
    mockResize(390, 844);
    
    // Should update to mobile breakpoint
    expect(screen.getByTestId('breakpoint-name')).toHaveTextContent('mobile');
  });

  it('should handle debug mode', () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    
    // Set NODE_ENV to development for debug logging
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';
    
    render(
      <ResponsiveProvider config={config} debug={true}>
        <TestComponent />
      </ResponsiveProvider>
    );

    expect(consoleSpy).toHaveBeenCalledWith(
      '🔍 ResponsiveProvider Debug:',
      expect.objectContaining({
        currentBreakpoint: expect.any(Object),
        scalingRatios: expect.any(Object),
        cacheSize: 0,
        config: expect.any(Object)
      })
    );

    // Restore original environment
    process.env.NODE_ENV = originalEnv;
    consoleSpy.mockRestore();
  });

  it('should find best matching breakpoint for viewport', () => {
    render(
      <ResponsiveProvider config={config}>
        <TestComponent />
      </ResponsiveProvider>
    );

    // Test tablet dimensions
    mockResize(768, 1024);
    expect(screen.getByTestId('breakpoint-name')).toHaveTextContent('tablet');

    // Test laptop dimensions
    mockResize(1366, 768);
    expect(screen.getByTestId('breakpoint-name')).toHaveTextContent('laptop');

    // Test mobile dimensions
    mockResize(390, 844);
    expect(screen.getByTestId('breakpoint-name')).toHaveTextContent('mobile');
  });

  it('should handle edge case viewport sizes', () => {
    render(
      <ResponsiveProvider config={config}>
        <TestComponent />
      </ResponsiveProvider>
    );

    // Test very small viewport
    mockResize(320, 568);
    expect(screen.getByTestId('breakpoint-name')).toHaveTextContent('mobile');

    // Test very large viewport
    mockResize(2560, 1440);
    expect(screen.getByTestId('breakpoint-name')).toHaveTextContent('desktop');
  });
});
