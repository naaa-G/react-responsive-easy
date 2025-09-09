/**
 * Responsive Panel Component for Storybook Addon
 * 
 * This component provides the main panel interface for managing
 * responsive behavior and viewing performance metrics.
 */

import React, { useState, useEffect, useCallback } from 'react';
import { AddonPanel } from '@storybook/components';
import { EVENTS } from '../constants';
import { ResponsiveControls } from './ResponsiveControls';
import { PerformanceMetrics as PerformanceMetricsComponent } from './PerformanceMetrics';
import { BreakpointPreview } from './BreakpointPreview';
import { ResponsiveDocumentation } from './ResponsiveDocumentation';
import type { AddonPanelProps, ResponsiveState, BreakpointConfig, PerformanceMetrics } from '../types';
import type { ResponsiveConfig } from '@react-responsive-easy/core';

export const ResponsivePanel: React.FC<AddonPanelProps> = ({ active, api }) => {
  const [state, setState] = useState<ResponsiveState>({
    currentBreakpoint: null,
    availableBreakpoints: [],
    isOverlayVisible: false,
    isPerformanceVisible: true,
    performanceData: null,
    config: null
  });

  const [activeTab, setActiveTab] = useState<'controls' | 'performance' | 'preview' | 'docs'>('controls');

  // Load story parameters and update state
  useEffect(() => {
    const updateFromStory = () => {
      const storyData = api.getCurrentStoryData();
      const parameters = storyData?.parameters?.responsiveEasy;
      
      if (parameters) {
        setState(prevState => ({
          ...prevState,
        config: parameters.config ?? null,
        availableBreakpoints: parameters.breakpoints ?? [],
        currentBreakpoint: parameters.breakpoints?.[0] ?? null
        }));
      }
    };

    // Listen for story changes
    api.on('storyChanged', updateFromStory);
    updateFromStory();

    return () => {
      api.off('storyChanged', updateFromStory);
    };
  }, [api]);

  // Handle breakpoint changes
  const handleBreakpointChange = useCallback((breakpoint: BreakpointConfig) => {
    setState(prevState => ({
      ...prevState,
      currentBreakpoint: breakpoint
    }));
    
    // Emit event to update viewport
    api.emit(EVENTS.BREAKPOINT_CHANGED, { breakpoint });
  }, [api]);

  // Handle overlay toggle
  const handleOverlayToggle = useCallback(() => {
    setState(prevState => {
      const newOverlayState = !prevState.isOverlayVisible;
      
      // Emit event to toggle overlay in preview
      api.emit(EVENTS.TOGGLE_OVERLAY, { visible: newOverlayState });
      
      return {
        ...prevState,
        isOverlayVisible: newOverlayState
      };
    });
  }, [api]);

  // Handle config updates
  const handleConfigUpdate = useCallback((config: ResponsiveConfig) => {
    setState(prevState => ({
      ...prevState,
      config
    }));
    
    // Emit event to update config in preview
    api.emit(EVENTS.CONFIG_UPDATED, { config });
  }, [api]);

  // Handle reset viewport
  const handleResetViewport = useCallback(() => {
    api.emit(EVENTS.RESET_VIEWPORT);
  }, [api]);

  // Listen for performance data updates
  useEffect(() => {
    const handlePerformanceData = (data: PerformanceMetrics) => {
      setState(prevState => ({
        ...prevState,
        performanceData: data
      }));
    };

    api.on(EVENTS.PERFORMANCE_DATA, handlePerformanceData);
    
    return () => {
      api.off(EVENTS.PERFORMANCE_DATA, handlePerformanceData);
    };
  }, [api]);

  if (!active) {
    return null;
  }

  return (
    <AddonPanel active={active}>
      <div className="rre-addon-panel">
        {/* Header */}
        <div className="panel-header">
          <div className="panel-title">
            <h2>React Responsive Easy</h2>
            {state.currentBreakpoint && (
              <div className="current-breakpoint">
                {state.currentBreakpoint.name} ({state.currentBreakpoint.width}×{state.currentBreakpoint.height})
              </div>
            )}
          </div>
          
          <div className="panel-actions">
            <button
              className={`btn btn-sm ${state.isOverlayVisible ? 'btn-primary' : 'btn-secondary'}`}
              onClick={handleOverlayToggle}
              title="Toggle responsive overlay"
            >
              👁️ Overlay
            </button>
            
            <button
              className="btn btn-sm btn-secondary"
              onClick={handleResetViewport}
              title="Reset viewport"
            >
              🔄 Reset
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="panel-tabs">
          <button
            className={`tab-button ${activeTab === 'controls' ? 'active' : ''}`}
            onClick={() => setActiveTab('controls')}
          >
            ⚙️ Controls
          </button>
          
          <button
            className={`tab-button ${activeTab === 'performance' ? 'active' : ''}`}
            onClick={() => setActiveTab('performance')}
          >
            📊 Performance
          </button>
          
          <button
            className={`tab-button ${activeTab === 'preview' ? 'active' : ''}`}
            onClick={() => setActiveTab('preview')}
          >
            👁️ Preview
          </button>
          
          <button
            className={`tab-button ${activeTab === 'docs' ? 'active' : ''}`}
            onClick={() => setActiveTab('docs')}
          >
            📚 Docs
          </button>
        </div>

        {/* Tab Content */}
        <div className="panel-content">
          {activeTab === 'controls' && (
            <ResponsiveControls
              state={state}
              onBreakpointChange={handleBreakpointChange}
              onConfigUpdate={handleConfigUpdate}
            />
          )}
          
          {activeTab === 'performance' && (
            <PerformanceMetricsComponent
              data={state.performanceData}
              isVisible={state.isPerformanceVisible}
            />
          )}
          
          {activeTab === 'preview' && (
            <BreakpointPreview
              breakpoints={state.availableBreakpoints}
              currentBreakpoint={state.currentBreakpoint}
              onBreakpointChange={handleBreakpointChange}
            />
          )}
          
          {activeTab === 'docs' && (
            <ResponsiveDocumentation
              config={state.config}
              breakpoints={state.availableBreakpoints}
            />
          )}
        </div>
      </div>
      
      <style>{`
        .rre-addon-panel {
          height: 100%;
          display: flex;
          flex-direction: column;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }

        .panel-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 16px;
          border-bottom: 1px solid #e0e0e0;
          background: #f8f9fa;
        }

        .panel-title h2 {
          margin: 0;
          font-size: 14px;
          font-weight: 600;
          color: #333;
        }

        .current-breakpoint {
          font-size: 11px;
          color: #666;
          margin-top: 2px;
        }

        .panel-actions {
          display: flex;
          gap: 8px;
        }

        .btn {
          padding: 4px 8px;
          border: 1px solid #ddd;
          border-radius: 4px;
          background: white;
          font-size: 11px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-primary {
          background: #007bff;
          color: white;
          border-color: #007bff;
        }

        .btn-secondary {
          background: #6c757d;
          color: white;
          border-color: #6c757d;
        }

        .btn:hover {
          opacity: 0.8;
        }

        .panel-tabs {
          display: flex;
          border-bottom: 1px solid #e0e0e0;
          background: white;
        }

        .tab-button {
          flex: 1;
          padding: 8px 12px;
          border: none;
          background: none;
          font-size: 11px;
          color: #666;
          cursor: pointer;
          border-bottom: 2px solid transparent;
          transition: all 0.2s ease;
        }

        .tab-button:hover {
          color: #333;
          background: #f8f9fa;
        }

        .tab-button.active {
          color: #007bff;
          border-bottom-color: #007bff;
        }

        .panel-content {
          flex: 1;
          overflow-y: auto;
          padding: 16px;
        }
      `}</style>
    </AddonPanel>
  );
};
