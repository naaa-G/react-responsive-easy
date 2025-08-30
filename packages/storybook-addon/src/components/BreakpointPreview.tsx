/**
 * Breakpoint Preview Component
 * 
 * This component provides a visual preview of how components look
 * across different breakpoints.
 */

import React from 'react';
import type { BreakpointConfig } from '../types';

interface BreakpointPreviewProps {
  breakpoints: BreakpointConfig[];
  currentBreakpoint: BreakpointConfig | null;
  onBreakpointChange: (breakpoint: BreakpointConfig) => void;
}

export const BreakpointPreview: React.FC<BreakpointPreviewProps> = ({
  breakpoints,
  currentBreakpoint,
  onBreakpointChange
}) => {
  if (!breakpoints.length) {
    return (
      <div className="preview-empty">
        <p>No breakpoints configured for this story.</p>
        <p>Add breakpoints to your story parameters to see previews.</p>
      </div>
    );
  }

  return (
    <div className="breakpoint-preview">
      <div className="preview-header">
        <h3>Breakpoint Overview</h3>
        <p>Click on a breakpoint to switch the viewport</p>
      </div>

      <div className="preview-grid">
        {breakpoints.map((breakpoint) => (
          <div
            key={breakpoint.alias}
            className={`preview-card ${
              currentBreakpoint?.alias === breakpoint.alias ? 'active' : ''
            }`}
            onClick={() => onBreakpointChange(breakpoint)}
          >
            <div className="preview-header-card">
              <div className="preview-icon">
                {getBreakpointIcon(breakpoint)}
              </div>
              <div className="preview-info">
                <div className="preview-name">{breakpoint.name}</div>
                <div className="preview-size">
                  {breakpoint.width} × {breakpoint.height}
                </div>
              </div>
            </div>
            
            <div className="preview-viewport">
              <div 
                className="viewport-frame"
                style={{
                  aspectRatio: `${breakpoint.width} / ${breakpoint.height}`,
                  maxWidth: '100%',
                  maxHeight: '120px'
                }}
              >
                <div className="viewport-content">
                  <div className="viewport-placeholder">
                    {breakpoint.name} View
                  </div>
                </div>
              </div>
            </div>
            
            <div className="preview-details">
              <div className="detail-item">
                <span className="detail-label">Width:</span>
                <span className="detail-value">{breakpoint.width}px</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Height:</span>
                <span className="detail-value">{breakpoint.height}px</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Ratio:</span>
                <span className="detail-value">
                  {(breakpoint.width / breakpoint.height).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="preview-controls">
        <button className="btn btn-secondary">
          📱 Test All Breakpoints
        </button>
        <button className="btn btn-secondary">
          📸 Take Screenshots
        </button>
        <button className="btn btn-secondary">
          📊 Compare Performance
        </button>
      </div>

      <style>{`
        .breakpoint-preview {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .preview-empty {
          text-align: center;
          padding: 40px 20px;
          color: #666;
        }

        .preview-header h3 {
          margin: 0 0 4px 0;
          font-size: 14px;
          font-weight: 600;
          color: #333;
        }

        .preview-header p {
          margin: 0;
          font-size: 11px;
          color: #666;
        }

        .preview-grid {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .preview-card {
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          padding: 12px;
          cursor: pointer;
          transition: all 0.2s ease;
          background: white;
        }

        .preview-card:hover {
          border-color: #007bff;
          box-shadow: 0 2px 8px rgba(0, 123, 255, 0.1);
        }

        .preview-card.active {
          border-color: #007bff;
          background: #f8f9ff;
          box-shadow: 0 2px 8px rgba(0, 123, 255, 0.15);
        }

        .preview-header-card {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 8px;
        }

        .preview-icon {
          font-size: 18px;
          width: 24px;
          text-align: center;
        }

        .preview-name {
          font-size: 12px;
          font-weight: 600;
          color: #333;
        }

        .preview-size {
          font-size: 10px;
          color: #666;
        }

        .preview-viewport {
          margin-bottom: 8px;
          display: flex;
          justify-content: center;
        }

        .viewport-frame {
          border: 1px solid #ddd;
          border-radius: 4px;
          background: #f8f9fa;
          overflow: hidden;
          position: relative;
        }

        .viewport-content {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .viewport-placeholder {
          font-size: 10px;
          color: #666;
          text-align: center;
        }

        .preview-details {
          display: flex;
          justify-content: space-between;
          font-size: 10px;
        }

        .detail-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2px;
        }

        .detail-label {
          color: #666;
        }

        .detail-value {
          font-weight: 500;
          color: #333;
        }

        .preview-controls {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
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

        .btn-secondary {
          background: #6c757d;
          color: white;
          border-color: #6c757d;
        }

        .btn:hover {
          opacity: 0.8;
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
