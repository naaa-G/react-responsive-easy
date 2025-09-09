/**
 * Responsive Decorator for Storybook
 * 
 * This decorator wraps stories with responsive functionality and
 * provides performance monitoring capabilities.
 */

import React, { useEffect } from 'react';
import type { DecoratorFunction } from '@storybook/types';
import { useChannel, addons } from '@storybook/addons';
import { EVENTS } from '../constants';
import { PerformanceMonitor, PerformanceMetrics } from '@react-responsive-easy/performance-dashboard';

interface ResponsiveDecoratorProps {
  children: React.ReactNode;
  context: {
    parameters?: {
      responsiveEasy?: {
        performance?: {
          enabled?: boolean;
          thresholds?: Record<string, number>;
        };
      };
    };
  };
}

const ResponsiveDecoratorComponent: React.FC<ResponsiveDecoratorProps> = ({ 
  children, 
  context 
}) => {
  const emit = useChannel({});
  const parameters = context.parameters?.responsiveEasy ?? {};
  
  // Initialize performance monitoring
  useEffect(() => {
    if (parameters.performance?.enabled !== false) {
      const monitor = new PerformanceMonitor({
        collectionInterval: 1000,
        maxHistorySize: 100,
        thresholds: parameters.performance?.thresholds
      });

      monitor.start(); // eslint-disable-line @typescript-eslint/no-floating-promises

      // Send performance data to addon panel
      const unsubscribe = monitor.on('metrics-updated', (metrics: PerformanceMetrics) => {
        const performanceData = {
          renderTime: metrics.responsiveElements.averageRenderTime ?? 0,
          memoryUsage: metrics.memory?.used ?? 0,
          layoutShifts: metrics.layoutShift.current,
          scalingOperations: metrics.custom?.scalingOperations ?? 0,
          cacheHitRate: metrics.custom?.cacheHitRate ?? 0
        };

        emit(EVENTS.PERFORMANCE_DATA, performanceData);
      });

      return () => {
        monitor.stop();
        unsubscribe();
      };
    }
  }, [emit, parameters.performance]);

  // Handle breakpoint changes from addon panel
  useEffect(() => {
    const handleBreakpointChange = ({ breakpoint }: { breakpoint: { width: number; height: number } }) => {
      // Update viewport size
      const iframe = document.querySelector('iframe[data-is-storybook="true"]') as HTMLIFrameElement;
      if (iframe) {
        iframe.style.width = `${breakpoint.width}px`;
        iframe.style.height = `${breakpoint.height}px`;
      }
    };

    const handleOverlayToggle = ({ visible }: { visible: boolean }) => {
      // Toggle responsive overlay
      toggleResponsiveOverlay(visible);
    };

    const handleConfigUpdate = ({ config }: { config: unknown }) => {
      // Update responsive configuration
      if (process.env.NODE_ENV === 'development') {
        // eslint-disable-next-line no-console
        console.log('Config updated:', config);
      }
      emit(EVENTS.CONFIG_UPDATED, { config });
    };

    const handleResetViewport = () => {
      // Reset viewport to default
      const iframe = document.querySelector('iframe[data-is-storybook="true"]') as HTMLIFrameElement;
      if (iframe) {
        iframe.style.width = '';
        iframe.style.height = '';
      }
    };

    // Listen for events from the addon panel
    const channel = addons.getChannel();
    channel.on(EVENTS.BREAKPOINT_CHANGED, handleBreakpointChange);
    channel.on(EVENTS.TOGGLE_OVERLAY, handleOverlayToggle);
    channel.on(EVENTS.CONFIG_UPDATED, handleConfigUpdate);
    channel.on(EVENTS.RESET_VIEWPORT, handleResetViewport);

    return () => {
      channel.off(EVENTS.BREAKPOINT_CHANGED, handleBreakpointChange);
      channel.off(EVENTS.TOGGLE_OVERLAY, handleOverlayToggle);
      channel.off(EVENTS.CONFIG_UPDATED, handleConfigUpdate);
      channel.off(EVENTS.RESET_VIEWPORT, handleResetViewport);
    };
  }, [emit]);

  // Add responsive overlay styles
  useEffect(() => {
    const style = document.createElement('style');
    style.id = 'rre-overlay-styles';
    style.textContent = `
      .rre-responsive-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        pointer-events: none;
        z-index: 999999;
        border: 2px dashed rgba(0, 123, 255, 0.5);
        background: linear-gradient(
          45deg,
          rgba(0, 123, 255, 0.05) 25%,
          transparent 25%,
          transparent 75%,
          rgba(0, 123, 255, 0.05) 75%
        );
        background-size: 20px 20px;
        display: none;
      }

      .rre-responsive-overlay.visible {
        display: block;
      }

      .rre-overlay-info {
        position: absolute;
        top: 10px;
        right: 10px;
        background: rgba(0, 123, 255, 0.9);
        color: white;
        padding: 8px 12px;
        border-radius: 4px;
        font-size: 12px;
        font-family: monospace;
        pointer-events: none;
      }

      .rre-responsive-element {
        outline: 1px solid rgba(0, 255, 136, 0.7) !important;
        background: rgba(0, 255, 136, 0.1) !important;
        position: relative;
      }

      .rre-responsive-element::after {
        content: 'RRE';
        position: absolute;
        top: -12px;
        left: -1px;
        background: rgba(0, 255, 136, 0.9);
        color: white;
        font-size: 8px;
        padding: 1px 3px;
        border-radius: 2px;
        font-family: monospace;
        line-height: 1;
      }
    `;
    
    document.head.appendChild(style);

    return () => {
      const existingStyle = document.getElementById('rre-overlay-styles');
      if (existingStyle) {
        existingStyle.remove();
      }
    };
  }, []);

  return (
    <div className="rre-story-wrapper">
      {children}
      <div id="rre-responsive-overlay" className="rre-responsive-overlay">
        <div className="rre-overlay-info">
          Responsive Overlay Active
        </div>
      </div>
    </div>
  );
};

function toggleResponsiveOverlay(visible: boolean) {
  const overlay = document.getElementById('rre-responsive-overlay');
  if (overlay) {
    overlay.classList.toggle('visible', visible);
  }

  // Highlight responsive elements
  const elements = document.querySelectorAll('[data-responsive]');
  elements.forEach(element => {
    element.classList.toggle('rre-responsive-element', visible);
  });
}

export const ResponsiveDecorator: DecoratorFunction = (Story, context) => {
  return (
    <ResponsiveDecoratorComponent context={context}>
      {Story(context) as React.ReactElement}
    </ResponsiveDecoratorComponent>
  );
};
