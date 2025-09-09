import React, { useState } from 'react';
import { PerformanceReport } from '../core/PerformanceMonitor';
import { DashboardTheme } from './PerformanceDashboard';

export interface RecommendationsPanelProps {
  report: PerformanceReport | null;
  theme: DashboardTheme;
}

interface EnhancedRecommendation {
  id: number;
  title: string;
  description: string;
  category: 'performance' | 'memory' | 'rendering' | 'caching';
  priority: 'high' | 'medium' | 'low';
  impact: 'high' | 'medium' | 'low';
  effort: 'high' | 'medium' | 'low';
  implementation: string[];
  resources: Array<{ title: string; url: string }>;
}

export const RecommendationsPanel: React.FC<RecommendationsPanelProps> = ({
  report,
  theme: _theme
}) => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'performance' | 'memory' | 'rendering' | 'caching'>('all');
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set());

  if (!report?.recommendations?.length) {
    return (
      <div className="recommendations-panel">
        <div className="panel-header">
          <h2>Performance Recommendations</h2>
        </div>
        <div className="no-recommendations">
          <div className="no-recommendations-icon">🎯</div>
          <h3>All systems optimized!</h3>
          <p>No performance recommendations at this time. Keep monitoring for potential optimizations.</p>
        </div>
      </div>
    );
  }

  // Enhanced recommendations with categories and priorities
  const enhancedRecommendations: EnhancedRecommendation[] = (report.recommendations || []).map((rec: string, index: number) => {
    return {
      id: index,
      title: extractTitle(rec),
      description: rec,
      category: categorizeRecommendation(rec),
      priority: getPriority(rec, report),
      impact: getImpact(rec),
      effort: getEffort(rec),
      implementation: getImplementation(rec),
      resources: getResources(rec)
    };
  });

  // Filter recommendations
  const filteredRecommendations = enhancedRecommendations.filter(rec => 
    selectedCategory === 'all' || rec.category === selectedCategory
  );

  // Sort by priority
  const sortedRecommendations = filteredRecommendations.sort((a, b) => {
    const priorityOrder: Record<string, number> = { high: 3, medium: 2, low: 1 };
    return priorityOrder[b.priority] - priorityOrder[a.priority];
  });

  const toggleExpanded = (id: number) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return '🔴';
      case 'medium': return '🟡';
      case 'low': return '🟢';
      default: return '⚪';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'performance': return '⚡';
      case 'memory': return '🧠';
      case 'rendering': return '🎨';
      case 'caching': return '💾';
      default: return '🔧';
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'success';
      case 'medium': return 'warning';
      case 'low': return 'info';
      default: return 'secondary';
    }
  };

  const getEffortColor = (effort: string) => {
    switch (effort) {
      case 'low': return 'success';
      case 'medium': return 'warning';
      case 'high': return 'danger';
      default: return 'secondary';
    }
  };

  return (
    <div className="recommendations-panel">
      <div className="panel-header">
        <h2>Performance Recommendations</h2>
        <div className="recommendations-summary">
          <div className="summary-item">
            <span className="count">{enhancedRecommendations.length}</span>
            <span className="label">Total</span>
          </div>
          <div className="summary-item high">
            <span className="count">{enhancedRecommendations.filter(r => r.priority === 'high').length}</span>
            <span className="label">High Priority</span>
          </div>
        </div>
      </div>

      <div className="recommendations-controls">
        <div className="category-filters">
          <button
            className={`filter-btn ${selectedCategory === 'all' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('all')}
          >
            All ({enhancedRecommendations.length})
          </button>
          <button
            className={`filter-btn ${selectedCategory === 'performance' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('performance')}
          >
            ⚡ Performance ({enhancedRecommendations.filter(r => r.category === 'performance').length})
          </button>
          <button
            className={`filter-btn ${selectedCategory === 'memory' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('memory')}
          >
            🧠 Memory ({enhancedRecommendations.filter(r => r.category === 'memory').length})
          </button>
          <button
            className={`filter-btn ${selectedCategory === 'rendering' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('rendering')}
          >
            🎨 Rendering ({enhancedRecommendations.filter(r => r.category === 'rendering').length})
          </button>
          <button
            className={`filter-btn ${selectedCategory === 'caching' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('caching')}
          >
            💾 Caching ({enhancedRecommendations.filter(r => r.category === 'caching').length})
          </button>
        </div>
      </div>

      <div className="recommendations-list">
        {sortedRecommendations.map((rec) => (
          <div key={rec.id} className={`recommendation-item priority-${rec.priority}`}>
            <div className="recommendation-header" onClick={() => toggleExpanded(rec.id)}>
              <div className="recommendation-title">
                <span className="priority-icon">{getPriorityIcon(rec.priority)}</span>
                <span className="category-icon">{getCategoryIcon(rec.category)}</span>
                <h3>{rec.title}</h3>
              </div>
              
              <div className="recommendation-badges">
                <span className={`badge impact ${getImpactColor(rec.impact)}`}>
                  {rec.impact} impact
                </span>
                <span className={`badge effort ${getEffortColor(rec.effort)}`}>
                  {rec.effort} effort
                </span>
                <span className="expand-icon">
                  {expandedItems.has(rec.id) ? '▼' : '▶'}
                </span>
              </div>
            </div>

            <div className="recommendation-description">
              <p>{rec.description}</p>
            </div>

            {expandedItems.has(rec.id) && (
              <div className="recommendation-details">
                <div className="details-grid">
                  <div className="detail-section">
                    <h4>📋 Implementation Steps</h4>
                    <ol>
                      {rec.implementation.map((step, index) => (
                        <li key={index}>{step}</li>
                      ))}
                    </ol>
                  </div>

                  <div className="detail-section">
                    <h4>📚 Resources</h4>
                    <ul>
                      {rec.resources.map((resource, index) => (
                        <li key={index}>
                          <a href={resource.url} target="_blank" rel="noopener noreferrer">
                            {resource.title}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="recommendation-actions">
                  <button className="btn btn-primary">
                    Start Implementation
                  </button>
                  <button className="btn btn-secondary">
                    Learn More
                  </button>
                  <button className="btn btn-ghost">
                    Dismiss
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredRecommendations.length === 0 && (
        <div className="no-recommendations filtered">
          <p>No recommendations found for the selected category.</p>
        </div>
      )}
    </div>
  );
};

// Helper functions
function extractTitle(recommendation: string): string {
  // Extract a concise title from the recommendation text
  const sentences = recommendation.split(/[.!?]/);
  const firstSentence = sentences[0].trim();
  
  if (firstSentence.includes('layout shift')) return 'Reduce Layout Shift';
  if (firstSentence.includes('memory')) return 'Optimize Memory Usage';
  if (firstSentence.includes('LCP')) return 'Improve LCP Performance';
  if (firstSentence.includes('cache')) return 'Enhance Caching Strategy';
  if (firstSentence.includes('responsive elements')) return 'Optimize Responsive Elements';
  
  // Fallback to first few words
  return `${firstSentence.split(' ').slice(0, 4).join(' ')  }...`;
}

function categorizeRecommendation(recommendation: string): 'performance' | 'memory' | 'rendering' | 'caching' {
  const text = recommendation.toLowerCase();
  
  if (text.includes('layout shift') || text.includes('rendering') || text.includes('paint')) return 'rendering';
  if (text.includes('memory') || text.includes('heap')) return 'memory';
  if (text.includes('cache') || text.includes('caching')) return 'caching';
  
  return 'performance';
}

function getPriority(recommendation: string, report: PerformanceReport): 'high' | 'medium' | 'low' {
  const text = recommendation.toLowerCase();
  
  // High priority if performance score is low
  if (report.summary?.overall && report.summary.overall < 70) {
    if (text.includes('layout shift') || text.includes('memory') || text.includes('lcp')) {
      return 'high';
    }
  }
  
  // High priority for critical issues
  if (text.includes('critical') || text.includes('slow') || text.includes('high')) {
    return 'high';
  }
  
  // Medium priority for optimization opportunities
  if (text.includes('optimize') || text.includes('improve') || text.includes('consider')) {
    return 'medium';
  }
  
  return 'low';
}

function getImpact(recommendation: string): 'high' | 'medium' | 'low' {
  const text = recommendation.toLowerCase();
  
  if (text.includes('layout shift') || text.includes('lcp') || text.includes('memory')) {
    return 'high';
  }
  
  if (text.includes('cache') || text.includes('optimize')) {
    return 'medium';
  }
  
  return 'low';
}

function getEffort(recommendation: string): 'high' | 'medium' | 'low' {
  const text = recommendation.toLowerCase();
  
  if (text.includes('virtualization') || text.includes('architecture') || text.includes('refactor')) {
    return 'high';
  }
  
  if (text.includes('optimize') || text.includes('review') || text.includes('adjust')) {
    return 'medium';
  }
  
  return 'low';
}

function getImplementation(recommendation: string): string[] {
  const text = recommendation.toLowerCase();
  
  if (text.includes('layout shift')) {
    return [
      'Identify elements causing layout shifts using browser DevTools',
      'Add CSS containment properties to prevent layout propagation',
      'Use size hints for images and dynamic content',
      'Test across different viewport sizes and content scenarios'
    ];
  }
  
  if (text.includes('memory')) {
    return [
      'Profile memory usage using Chrome DevTools Memory tab',
      'Implement object pooling for frequently created/destroyed objects',
      'Review and optimize responsive value caching strategies',
      'Add memory usage monitoring and alerts'
    ];
  }
  
  if (text.includes('lcp')) {
    return [
      'Identify LCP elements using Lighthouse or WebPageTest',
      'Optimize critical resource loading (preload, prefetch)',
      'Minimize render-blocking resources',
      'Implement progressive loading strategies'
    ];
  }
  
  if (text.includes('cache')) {
    return [
      'Analyze current cache hit/miss patterns',
      'Implement more aggressive caching for computed values',
      'Add cache warming strategies for common breakpoints',
      'Monitor cache performance metrics'
    ];
  }
  
  return [
    'Analyze the current implementation',
    'Plan optimization approach',
    'Implement changes incrementally',
    'Monitor performance impact'
  ];
}

function getResources(recommendation: string): Array<{title: string; url: string}> {
  const text = recommendation.toLowerCase();
  
  const baseResources = [
    { title: 'Web Vitals Documentation', url: 'https://web.dev/vitals/' },
    { title: 'Performance Best Practices', url: 'https://web.dev/fast/' }
  ];
  
  if (text.includes('layout shift')) {
    return [
      { title: 'Cumulative Layout Shift Guide', url: 'https://web.dev/cls/' },
      { title: 'Debugging Layout Shifts', url: 'https://web.dev/debug-layout-shifts/' },
      ...baseResources
    ];
  }
  
  if (text.includes('memory')) {
    return [
      { title: 'Memory Management Guide', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Memory_Management' },
      { title: 'Chrome DevTools Memory', url: 'https://developer.chrome.com/docs/devtools/memory-problems/' },
      ...baseResources
    ];
  }
  
  if (text.includes('lcp')) {
    return [
      { title: 'Largest Contentful Paint Guide', url: 'https://web.dev/lcp/' },
      { title: 'Optimize LCP', url: 'https://web.dev/optimize-lcp/' },
      ...baseResources
    ];
  }
  
  return baseResources;
}
