/**
 * Responsive Documentation Component
 * 
 * This component provides comprehensive documentation and examples
 * for responsive components.
 */

import React, { useState } from 'react';
import type { BreakpointConfig } from '../types';
import type { ResponsiveConfig } from '@yaseratiar/react-responsive-easy-core';

interface ResponsiveDocumentationProps {
  config: ResponsiveConfig | null;
  breakpoints: BreakpointConfig[];
}

export const ResponsiveDocumentation: React.FC<ResponsiveDocumentationProps> = ({
  config,
  breakpoints
}) => {
  const [activeSection, setActiveSection] = useState<'overview' | 'examples' | 'api' | 'best-practices'>('overview');

  return (
    <div className="responsive-documentation">
      {/* Documentation Navigation */}
      <div className="doc-nav">
        <button
          className={`nav-button ${activeSection === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveSection('overview')}
        >
          📋 Overview
        </button>
        <button
          className={`nav-button ${activeSection === 'examples' ? 'active' : ''}`}
          onClick={() => setActiveSection('examples')}
        >
          💡 Examples
        </button>
        <button
          className={`nav-button ${activeSection === 'api' ? 'active' : ''}`}
          onClick={() => setActiveSection('api')}
        >
          📖 API
        </button>
        <button
          className={`nav-button ${activeSection === 'best-practices' ? 'active' : ''}`}
          onClick={() => setActiveSection('best-practices')}
        >
          ✨ Best Practices
        </button>
      </div>

      {/* Documentation Content */}
      <div className="doc-content">
        {activeSection === 'overview' && (
          <div className="doc-section">
            <h3>📋 Responsive Component Overview</h3>
            
            <div className="overview-content">
              <p>
                This component uses React Responsive Easy to automatically scale
                and adapt across different screen sizes and devices.
              </p>

              {config && (
                <div className="config-summary">
                  <h4>Configuration Summary</h4>
                  <div className="config-details">
                    <div className="config-item">
                      <strong>Base Breakpoint:</strong> {config.base.name} ({config.base.width}×{config.base.height})
                    </div>
                    <div className="config-item">
                      <strong>Scaling Strategy:</strong> {config.strategy.mode}
                    </div>
                    <div className="config-item">
                      <strong>Origin Point:</strong> {config.strategy.origin}
                    </div>
                    <div className="config-item">
                      <strong>Target Breakpoints:</strong> {config.breakpoints.length}
                    </div>
                  </div>
                </div>
              )}

              {breakpoints.length > 0 && (
                <div className="breakpoints-summary">
                  <h4>Supported Breakpoints</h4>
                  <div className="breakpoints-list">
                    {breakpoints.map(bp => (
                      <div key={bp.alias} className="breakpoint-summary">
                        <span className="bp-icon">{getBreakpointIcon(bp)}</span>
                        <span className="bp-name">{bp.name}</span>
                        <span className="bp-size">{bp.width}×{bp.height}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {activeSection === 'examples' && (
          <div className="doc-section">
            <h3>💡 Usage Examples</h3>
            
            <div className="examples-content">
              <div className="example-block">
                <h4>Basic Usage</h4>
                <pre className="code-block">{`import { ResponsiveProvider, useResponsiveValue } from '@yaseratiar/react-responsive-easy-core';

function MyComponent() {
  const fontSize = useResponsiveValue(24); // Base font size
  const padding = useResponsiveValue({ top: 16, left: 20 });
  
  return (
    <div style={{ fontSize, padding }}>
      Responsive content that scales automatically
    </div>
  );
}`}</pre>
              </div>

              <div className="example-block">
                <h4>Advanced Scaling</h4>
                <pre className="code-block">{`import { useScaledStyle } from '@yaseratiar/react-responsive-easy-core';

function Card() {
  const styles = useScaledStyle({
    width: 300,
    height: 200,
    padding: 20,
    borderRadius: 8,
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
  });
  
  return <div style={styles}>Scaled card component</div>;
}`}</pre>
              </div>

              <div className="example-block">
                <h4>Breakpoint-Specific Values</h4>
                <pre className="code-block">{`import { useBreakpoint } from '@yaseratiar/react-responsive-easy-core';

function ResponsiveLayout() {
  const breakpoint = useBreakpoint();
  
  const columns = {
    mobile: 1,
    tablet: 2,
    desktop: 3
  }[breakpoint.alias] ?? 1;
  
  return (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: \`repeat(\${columns}, 1fr)\` 
    }}>
      {/* Grid items */}
    </div>
  );
}`}</pre>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'api' && (
          <div className="doc-section">
            <h3>📖 API Reference</h3>
            
            <div className="api-content">
              <div className="api-section">
                <h4>Hooks</h4>
                
                <div className="api-item">
                  <div className="api-signature">
                    <code>useResponsiveValue(value: any): any</code>
                  </div>
                  <p>Scales a single value based on the current breakpoint.</p>
                  <div className="api-params">
                    <strong>Parameters:</strong>
                    <ul>
                      <li><code>value</code> - The base value to scale</li>
                    </ul>
                  </div>
                </div>

                <div className="api-item">
                  <div className="api-signature">
                    <code>useScaledStyle(styles: CSSProperties): CSSProperties</code>
                  </div>
                  <p>Scales an entire style object based on the current breakpoint.</p>
                  <div className="api-params">
                    <strong>Parameters:</strong>
                    <ul>
                      <li><code>styles</code> - The base styles object to scale</li>
                    </ul>
                  </div>
                </div>

                <div className="api-item">
                  <div className="api-signature">
                    <code>useBreakpoint(): Breakpoint</code>
                  </div>
                  <p>Returns the current active breakpoint information.</p>
                  <div className="api-returns">
                    <strong>Returns:</strong> Object with <code>name</code>, <code>width</code>, <code>height</code>, and <code>alias</code>
                  </div>
                </div>
              </div>

              <div className="api-section">
                <h4>Components</h4>
                
                <div className="api-item">
                  <div className="api-signature">
                    <code>{'<ResponsiveProvider config={config}>'}</code>
                  </div>
                  <p>Provides responsive context to child components.</p>
                  <div className="api-params">
                    <strong>Props:</strong>
                    <ul>
                      <li><code>config</code> - Responsive configuration object</li>
                      <li><code>initialBreakpoint</code> - Initial breakpoint (optional)</li>
                      <li><code>debug</code> - Enable debug mode (optional)</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'best-practices' && (
          <div className="doc-section">
            <h3>✨ Best Practices</h3>
            
            <div className="practices-content">
              <div className="practice-item">
                <div className="practice-icon">🎯</div>
                <div className="practice-content">
                  <h4>Design for the Base Breakpoint</h4>
                  <p>
                    Always design and develop for your base breakpoint first (usually desktop at 1920×1080).
                    Let React Responsive Easy handle the scaling to other breakpoints automatically.
                  </p>
                </div>
              </div>

              <div className="practice-item">
                <div className="practice-icon">⚡</div>
                <div className="practice-content">
                  <h4>Optimize Performance</h4>
                  <p>
                    Use memoization for expensive calculations and avoid unnecessary re-renders.
                    The performance panel in this addon helps you identify bottlenecks.
                  </p>
                </div>
              </div>

              <div className="practice-item">
                <div className="practice-icon">🧪</div>
                <div className="practice-content">
                  <h4>Test Across Breakpoints</h4>
                  <p>
                    Use the breakpoint preview in this addon to test your components across
                    all supported screen sizes and ensure consistent behavior.
                  </p>
                </div>
              </div>

              <div className="practice-item">
                <div className="practice-icon">🎨</div>
                <div className="practice-content">
                  <h4>Maintain Visual Hierarchy</h4>
                  <p>
                    Ensure that relative sizes and relationships between elements are preserved
                    across breakpoints. Use proportional scaling for consistent design.
                  </p>
                </div>
              </div>

              <div className="practice-item">
                <div className="practice-icon">♿</div>
                <div className="practice-content">
                  <h4>Consider Accessibility</h4>
                  <p>
                    Ensure text remains readable, touch targets stay accessible, and
                    focus indicators are visible across all breakpoints.
                  </p>
                </div>
              </div>

              <div className="practice-item">
                <div className="practice-icon">📊</div>
                <div className="practice-content">
                  <h4>Monitor Performance</h4>
                  <p>
                    Regularly check the performance metrics to ensure your responsive
                    components don't negatively impact user experience.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .responsive-documentation {
          display: flex;
          flex-direction: column;
          height: 100%;
        }

        .doc-nav {
          display: flex;
          border-bottom: 1px solid #e0e0e0;
          background: #f8f9fa;
          overflow-x: auto;
        }

        .nav-button {
          flex: 1;
          padding: 8px 12px;
          border: none;
          background: none;
          font-size: 11px;
          color: #666;
          cursor: pointer;
          border-bottom: 2px solid transparent;
          transition: all 0.2s ease;
          white-space: nowrap;
        }

        .nav-button:hover {
          color: #333;
          background: #e9ecef;
        }

        .nav-button.active {
          color: #007bff;
          border-bottom-color: #007bff;
          background: white;
        }

        .doc-content {
          flex: 1;
          overflow-y: auto;
          padding: 16px;
        }

        .doc-section h3 {
          margin: 0 0 16px 0;
          font-size: 14px;
          font-weight: 600;
          color: #333;
        }

        .overview-content {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .config-summary,
        .breakpoints-summary {
          background: #f8f9fa;
          border: 1px solid #e9ecef;
          border-radius: 6px;
          padding: 12px;
        }

        .config-summary h4,
        .breakpoints-summary h4 {
          margin: 0 0 8px 0;
          font-size: 12px;
          font-weight: 600;
          color: #495057;
        }

        .config-details {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .config-item {
          font-size: 11px;
          color: #6c757d;
        }

        .breakpoints-list {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .breakpoint-summary {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 11px;
        }

        .bp-icon {
          width: 16px;
          text-align: center;
        }

        .bp-name {
          font-weight: 500;
          color: #495057;
        }

        .bp-size {
          color: #6c757d;
          margin-left: auto;
        }

        .examples-content {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .example-block h4 {
          margin: 0 0 8px 0;
          font-size: 12px;
          font-weight: 600;
          color: #495057;
        }

        .code-block {
          background: #f8f9fa;
          border: 1px solid #e9ecef;
          border-radius: 4px;
          padding: 12px;
          font-size: 10px;
          font-family: 'SF Mono', monospace;
          overflow-x: auto;
          white-space: pre;
          margin: 0;
          line-height: 1.4;
        }

        .api-content {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .api-section h4 {
          margin: 0 0 12px 0;
          font-size: 12px;
          font-weight: 600;
          color: #495057;
          border-bottom: 1px solid #e9ecef;
          padding-bottom: 4px;
        }

        .api-item {
          margin-bottom: 16px;
          padding: 12px;
          background: #f8f9fa;
          border-radius: 6px;
          border: 1px solid #e9ecef;
        }

        .api-signature {
          margin-bottom: 8px;
        }

        .api-signature code {
          background: #e9ecef;
          padding: 2px 4px;
          border-radius: 2px;
          font-size: 10px;
          font-family: 'SF Mono', monospace;
        }

        .api-item p {
          margin: 0 0 8px 0;
          font-size: 11px;
          color: #6c757d;
        }

        .api-params,
        .api-returns {
          font-size: 10px;
          color: #495057;
        }

        .api-params ul,
        .api-returns ul {
          margin: 4px 0 0 16px;
          padding: 0;
        }

        .api-params li {
          margin-bottom: 2px;
        }

        .practices-content {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .practice-item {
          display: flex;
          gap: 12px;
          padding: 12px;
          background: #f8f9fa;
          border-radius: 6px;
          border: 1px solid #e9ecef;
        }

        .practice-icon {
          font-size: 18px;
          width: 24px;
          text-align: center;
          flex-shrink: 0;
        }

        .practice-content h4 {
          margin: 0 0 6px 0;
          font-size: 12px;
          font-weight: 600;
          color: #495057;
        }

        .practice-content p {
          margin: 0;
          font-size: 11px;
          color: #6c757d;
          line-height: 1.4;
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
