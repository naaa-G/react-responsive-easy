/**
 * Responsive Controls Component
 * 
 * This component provides controls for managing responsive behavior,
 * breakpoints, and configuration settings.
 */

import React, { useState, useCallback } from 'react';
import type { ResponsiveState, BreakpointConfig } from '../types';
import type { ResponsiveConfig } from '@yaseratiar/react-responsive-easy-core';

interface ResponsiveControlsProps {
  state: ResponsiveState;
  onBreakpointChange: (breakpoint: BreakpointConfig) => void; // eslint-disable-line no-unused-vars
  onConfigUpdate: (config: ResponsiveConfig) => void; // eslint-disable-line no-unused-vars
}

export const ResponsiveControls: React.FC<ResponsiveControlsProps> = ({
  state,
  onBreakpointChange,
  onConfigUpdate
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [customConfig, setCustomConfig] = useState('');

  const handleBreakpointSelect = useCallback((breakpoint: BreakpointConfig) => {
    onBreakpointChange(breakpoint);
  }, [onBreakpointChange]);

  const handleConfigImport = useCallback(() => {
    try {
      const config = JSON.parse(customConfig);
      onConfigUpdate(config);
      setCustomConfig('');
    } catch {
      // In production, this should be handled by a proper error reporting system
      if (process.env.NODE_ENV === 'development') {
        // eslint-disable-next-line no-alert
        alert('Invalid JSON configuration');
      }
    }
  }, [customConfig, onConfigUpdate]);

  const exportCurrentConfig = useCallback(() => {
    if (state.config) {
      const configStr = JSON.stringify(state.config, null, 2);
      navigator.clipboard.writeText(configStr).then(() => {
        // In production, this should be handled by a proper notification system
        if (process.env.NODE_ENV === 'development') {
          // eslint-disable-next-line no-alert
          alert('Configuration copied to clipboard!');
        }
      }).catch((error) => {
        if (process.env.NODE_ENV === 'development') {
          // eslint-disable-next-line no-console
          console.error('Failed to copy configuration:', error);
        }
      });
    }
  }, [state.config]);

  return (
    <div className="responsive-controls">
      {/* Breakpoint Selection */}
      <div className="control-section">
        <h3>Current Breakpoint</h3>
        <div className="breakpoint-selector">
          {state.availableBreakpoints.map((breakpoint) => (
            <button
              key={breakpoint.alias}
              className={`breakpoint-button ${
                state.currentBreakpoint?.alias === breakpoint.alias ? 'active' : ''
              }`}
              onClick={() => handleBreakpointSelect(breakpoint)}
            >
              <div className="breakpoint-icon">
                {getBreakpointIcon(breakpoint)}
              </div>
              <div className="breakpoint-info">
                <div className="breakpoint-name">{breakpoint.name}</div>
                <div className="breakpoint-size">
                  {breakpoint.width}×{breakpoint.height}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="control-section">
        <h3>Quick Actions</h3>
        <div className="action-buttons">
          <button className="btn btn-secondary" onClick={() => window.location.reload()}>
            🔄 Refresh Story
          </button>
          
          <button 
            className="btn btn-secondary"
            onClick={() => {
              if (state.config && process.env.NODE_ENV === 'development') {
                // eslint-disable-next-line no-console
                console.log('Current Responsive Config:', state.config);
              }
            }}
          >
            🐛 Debug Config
          </button>
          
          <button 
            className="btn btn-secondary"
            onClick={exportCurrentConfig}
            disabled={!state.config}
          >
            📋 Copy Config
          </button>
        </div>
      </div>

      {/* Responsive Information */}
      {state.config && (
        <div className="control-section">
          <h3>Configuration Info</h3>
          <div className="config-info">
            <div className="info-item">
              <span className="info-label">Base Breakpoint:</span>
              <span className="info-value">
                {state.config.base.name} ({state.config.base.width}×{state.config.base.height})
              </span>
            </div>
            
            <div className="info-item">
              <span className="info-label">Scaling Mode:</span>
              <span className="info-value">{state.config.strategy.mode}</span>
            </div>
            
            <div className="info-item">
              <span className="info-label">Origin:</span>
              <span className="info-value">{state.config.strategy.origin}</span>
            </div>
            
            <div className="info-item">
              <span className="info-label">Breakpoints:</span>
              <span className="info-value">{state.config.breakpoints.length}</span>
            </div>
          </div>
        </div>
      )}

      {/* Advanced Controls */}
      <div className="control-section">
        <button
          className="btn btn-ghost"
          onClick={() => setShowAdvanced(!showAdvanced)}
        >
          {showAdvanced ? '▼' : '▶'} Advanced Settings
        </button>
        
        {showAdvanced && (
          <div className="advanced-controls">
            <div className="form-group">
              <label>Import Configuration</label>
              <textarea
                value={customConfig}
                onChange={(e) => setCustomConfig(e.target.value)}
                placeholder="Paste your responsive configuration JSON here..."
                rows={6}
              />
              <button
                className="btn btn-primary btn-sm"
                onClick={handleConfigImport}
                disabled={!customConfig.trim()}
              >
                Import Config
              </button>
            </div>
            
            <div className="form-group">
              <label>Performance Settings</label>
              <div className="checkbox-group">
                <label className="checkbox-label">
                  <input type="checkbox" defaultChecked />
                  <span>Enable performance monitoring</span>
                </label>
                <label className="checkbox-label">
                  <input type="checkbox" defaultChecked />
                  <span>Show performance warnings</span>
                </label>
                <label className="checkbox-label">
                  <input type="checkbox" />
                  <span>Enable debug mode</span>
                </label>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .responsive-controls {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .control-section {
          border-bottom: 1px solid #e0e0e0;
          padding-bottom: 16px;
        }

        .control-section:last-child {
          border-bottom: none;
          padding-bottom: 0;
        }

        .control-section h3 {
          margin: 0 0 12px 0;
          font-size: 12px;
          font-weight: 600;
          color: #333;
        }

        .breakpoint-selector {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .breakpoint-button {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 8px 12px;
          border: 1px solid #e0e0e0;
          border-radius: 6px;
          background: white;
          cursor: pointer;
          transition: all 0.2s ease;
          text-align: left;
        }

        .breakpoint-button:hover {
          border-color: #007bff;
          background: #f8f9ff;
        }

        .breakpoint-button.active {
          border-color: #007bff;
          background: #007bff;
          color: white;
        }

        .breakpoint-icon {
          font-size: 18px;
          width: 24px;
          text-align: center;
        }

        .breakpoint-name {
          font-size: 12px;
          font-weight: 500;
          margin-bottom: 2px;
        }

        .breakpoint-size {
          font-size: 10px;
          opacity: 0.8;
        }

        .action-buttons {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .btn {
          padding: 6px 12px;
          border: 1px solid #ddd;
          border-radius: 4px;
          background: white;
          font-size: 11px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
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

        .btn-ghost {
          background: transparent;
          border: none;
          color: #666;
          padding: 4px 0;
          font-size: 11px;
        }

        .btn-sm {
          padding: 4px 8px;
          font-size: 10px;
        }

        .config-info {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .info-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 11px;
        }

        .info-label {
          color: #666;
        }

        .info-value {
          font-weight: 500;
          color: #333;
        }

        .advanced-controls {
          margin-top: 12px;
          padding-top: 12px;
          border-top: 1px solid #e0e0e0;
        }

        .form-group {
          margin-bottom: 16px;
        }

        .form-group label {
          display: block;
          font-size: 11px;
          font-weight: 500;
          color: #333;
          margin-bottom: 6px;
        }

        .form-group textarea {
          width: 100%;
          padding: 8px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 10px;
          font-family: monospace;
          resize: vertical;
          margin-bottom: 8px;
        }

        .checkbox-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .checkbox-label {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 11px;
          cursor: pointer;
        }

        .checkbox-label input[type="checkbox"] {
          margin: 0;
        }
      `}</style>
    </div>
  );
};

function getBreakpointIcon(breakpoint: BreakpointConfig): string {
  if (breakpoint.width <= 480) return '📱';
  if (breakpoint.width <= 768) return '📱';
  if (breakpoint.width <= 1024) return '💻';
  if (breakpoint.width <= 1440) return '🖥️';
  return '🖥️';
}
