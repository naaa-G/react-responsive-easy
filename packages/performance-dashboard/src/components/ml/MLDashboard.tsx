import React, { useState, useEffect, useCallback } from 'react';
import { 
  useAdvancedML, 
  useRealTimeMLAnalysis,
  MLConfig,
  MLModel,
  AnomalyDetectionResult,
  PredictionResult,
  PatternRecognitionResult
} from '../../hooks/useAdvancedML';
import { PerformanceSnapshot } from '../../core/PerformanceMonitor';
import './MLDashboard.css';

export interface MLDashboardProps {
  data: PerformanceSnapshot[];
  config?: Partial<MLConfig>;
  onAnomalyDetected?: (anomaly: AnomalyDetectionResult) => void;
  onPredictionGenerated?: (prediction: PredictionResult) => void;
  onPatternRecognized?: (pattern: PatternRecognitionResult) => void;
  className?: string;
  style?: React.CSSProperties;
  showModelManagement?: boolean;
  showAnomalyDetection?: boolean;
  showPredictions?: boolean;
  showPatternRecognition?: boolean;
  showTrainingProgress?: boolean;
  showModelInsights?: boolean;
  autoRefresh?: boolean;
  refreshInterval?: number;
}

/**
 * Enterprise-grade ML Dashboard for advanced analytics and predictions
 * Provides real-time anomaly detection, predictions, and pattern recognition
 */
export const MLDashboard = ({
  data,
  config = {},
  onAnomalyDetected,
  onPredictionGenerated,
  onPatternRecognized,
  className = '',
  style,
  showModelManagement = true,
  showAnomalyDetection = true,
  showPredictions = true,
  showPatternRecognition = true,
  showTrainingProgress = true,
  showModelInsights: _showModelInsights = true,
  autoRefresh = true,
  refreshInterval = 30000
}: MLDashboardProps) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'anomalies' | 'predictions' | 'patterns' | 'models'>('overview');
  const [_selectedModel, _setSelectedModel] = useState<string | null>(null);
  const [isTraining, setIsTraining] = useState(false);
  const [_trainingProgress, _setTrainingProgress] = useState(0);

  // ML configuration
  const mlConfig: MLConfig = {
    enableAnomalyDetection: true,
    enablePredictions: true,
    enablePatternRecognition: true,
    enableAutoRetraining: true,
    anomalyThreshold: 0.8,
    predictionHorizon: 60,
    trainingWindow: 24,
    retrainingInterval: 6,
    minDataPoints: 100,
    maxModels: 10,
    ...config
  };

  // Initialize ML system
  const [mlState, mlActions] = useAdvancedML(mlConfig);

  // Real-time analysis
  const analysisResults = useRealTimeMLAnalysis(mlActions, data);

  // Initialize ML system
  useEffect(() => {
    if (!mlState.isInitialized) {
      void mlActions.initialize();
    }
  }, [mlState.isInitialized, mlActions]);

  // Handle callbacks
  useEffect(() => {
    if (analysisResults.anomalies.length > 0) {
      analysisResults.anomalies.forEach(anomaly => {
        onAnomalyDetected?.(anomaly);
      });
    }
  }, [analysisResults.anomalies, onAnomalyDetected]);

  useEffect(() => {
    if (analysisResults.predictions.length > 0) {
      analysisResults.predictions.forEach(prediction => {
        onPredictionGenerated?.(prediction);
      });
    }
  }, [analysisResults.predictions, onPredictionGenerated]);

  useEffect(() => {
    if (analysisResults.patterns.length > 0) {
      analysisResults.patterns.forEach(pattern => {
        onPatternRecognized?.(pattern);
      });
    }
  }, [analysisResults.patterns, onPatternRecognized]);

  // Auto-refresh
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      if (data.length > 0) {
        void mlActions.detectAnomalies(data.slice(-10));
        void mlActions.generatePredictions(data);
        void mlActions.recognizePatterns(data);
      }
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval, data, mlActions]);

  // Training handler
  const handleTrainModel = useCallback(async (modelId: string) => {
    setIsTraining(true);
    _setTrainingProgress(0);
    
    try {
      await mlActions.trainModel(modelId, data);
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        // eslint-disable-next-line no-console
        console.error('Training failed:', error);
      }
    } finally {
      setIsTraining(false);
      _setTrainingProgress(0);
    }
  }, [mlActions, data]);

  // Get severity color
  const getSeverityColor = (severity: AnomalyDetectionResult['severity']) => {
    switch (severity) {
      case 'critical': return '#dc3545';
      case 'high': return '#fd7e14';
      case 'medium': return '#ffc107';
      case 'low': return '#28a745';
      default: return '#6c757d';
    }
  };

  // Get confidence color
  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.9) return '#28a745';
    if (confidence >= 0.7) return '#ffc107';
    if (confidence >= 0.5) return '#fd7e14';
    return '#dc3545';
  };

  // Get trend color
  const getTrendColor = (trend: PredictionResult['trend']) => {
    switch (trend) {
      case 'increasing': return '#dc3545';
      case 'decreasing': return '#28a745';
      case 'stable': return '#6c757d';
      default: return '#6c757d';
    }
  };

  // Render model card
  const renderModelCard = (model: MLModel) => (
    <div key={model.id} className="model-card">
      <div className="model-header">
        <div className="model-info">
          <h4 className="model-name">{model.name}</h4>
          <span className="model-type">{model.type}</span>
        </div>
        <div className="model-status">
          <div className={`status-indicator ${model.isActive ? 'active' : 'inactive'}`} />
          <span className="status-text">{model.isActive ? 'Active' : 'Inactive'}</span>
        </div>
      </div>
      
      <div className="model-metrics">
        <div className="metric">
          <span className="metric-label">Accuracy</span>
          <span className="metric-value">{Math.round(model.accuracy * 100)}%</span>
        </div>
        <div className="metric">
          <span className="metric-label">Version</span>
          <span className="metric-value">{model.version}</span>
        </div>
        <div className="metric">
          <span className="metric-label">Last Trained</span>
          <span className="metric-value">
            {new Date(model.lastTrained).toLocaleDateString()}
          </span>
        </div>
      </div>
      
      <div className="model-actions">
        <button
          className="action-button primary"
          onClick={() => void handleTrainModel(model.id)}
          disabled={isTraining}
        >
          {isTraining ? 'Training...' : 'Train'}
        </button>
        <button
          className="action-button secondary"
          onClick={() => _setSelectedModel(model.id)}
        >
          Details
        </button>
      </div>
    </div>
  );

  // Render anomaly card
  const renderAnomalyCard = (anomaly: AnomalyDetectionResult) => (
    <div key={anomaly.timestamp.getTime()} className="anomaly-card">
      <div className="anomaly-header">
        <div className="anomaly-severity">
          <div 
            className="severity-indicator" 
            style={{ backgroundColor: getSeverityColor(anomaly.severity) }}
          />
          <span className="severity-text">{anomaly.severity.toUpperCase()}</span>
        </div>
        <div className="anomaly-confidence">
          <span className="confidence-label">Confidence</span>
          <span 
            className="confidence-value"
            style={{ color: getConfidenceColor(anomaly.confidence) }}
          >
            {Math.round(anomaly.confidence * 100)}%
          </span>
        </div>
      </div>
      
      <div className="anomaly-content">
        <h5 className="anomaly-description">{anomaly.description}</h5>
        <div className="anomaly-metrics">
          <span className="metrics-label">Affected Metrics:</span>
          <div className="metrics-list">
            {anomaly.affectedMetrics.map(metric => (
              <span key={metric} className="metric-tag">{metric}</span>
            ))}
          </div>
        </div>
        <div className="anomaly-actions">
          <span className="actions-label">Suggested Actions:</span>
          <ul className="actions-list">
            {anomaly.suggestedActions.map((action, index) => (
              <li key={index} className="action-item">{action}</li>
            ))}
          </ul>
        </div>
      </div>
      
      <div className="anomaly-footer">
        <span className="anomaly-time">
          {anomaly.timestamp.toLocaleString()}
        </span>
        <span className="anomaly-type">{anomaly.type}</span>
      </div>
    </div>
  );

  // Render prediction card
  const renderPredictionCard = (prediction: PredictionResult) => (
    <div key={`${prediction.metric}-${prediction.timestamp.getTime()}`} className="prediction-card">
      <div className="prediction-header">
        <h5 className="prediction-metric">{prediction.metric}</h5>
        <div className="prediction-confidence">
          <span 
            className="confidence-value"
            style={{ color: getConfidenceColor(prediction.confidence) }}
          >
            {Math.round(prediction.confidence * 100)}%
          </span>
        </div>
      </div>
      
      <div className="prediction-content">
        <div className="prediction-value">
          <span className="value-label">Predicted Value</span>
          <span className="value-number">{prediction.predictedValue.toFixed(2)}</span>
        </div>
        <div className="prediction-trend">
          <span className="trend-label">Trend</span>
          <span 
            className="trend-value"
            style={{ color: getTrendColor(prediction.trend) }}
          >
            {prediction.trend}
          </span>
        </div>
        <div className="prediction-horizon">
          <span className="horizon-label">Time Horizon</span>
          <span className="horizon-value">{prediction.timeHorizon} min</span>
        </div>
      </div>
      
      <div className="prediction-factors">
        <span className="factors-label">Key Factors:</span>
        <div className="factors-list">
          {prediction.factors.slice(0, 3).map((factor, index) => (
            <div key={index} className="factor-item">
              <span className="factor-metric">{factor.metric}</span>
              <span className="factor-influence">
                {Math.round(factor.influence * 100)}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Render pattern card
  const renderPatternCard = (pattern: PatternRecognitionResult) => (
    <div key={pattern.timestamp.getTime()} className="pattern-card">
      <div className="pattern-header">
        <h5 className="pattern-type">{pattern.patternType}</h5>
        <div className="pattern-confidence">
          <span 
            className="confidence-value"
            style={{ color: getConfidenceColor(pattern.confidence) }}
          >
            {Math.round(pattern.confidence * 100)}%
          </span>
        </div>
      </div>
      
      <div className="pattern-content">
        <p className="pattern-description">{pattern.description}</p>
        {pattern.period && (
          <div className="pattern-period">
            <span className="period-label">Period</span>
            <span className="period-value">{pattern.period} hours</span>
          </div>
        )}
      </div>
      
      <div className="pattern-metrics">
        <span className="metrics-label">Affected Metrics:</span>
        <div className="metrics-list">
          {pattern.affectedMetrics.map(metric => (
            <span key={metric} className="metric-tag">{metric}</span>
          ))}
        </div>
      </div>
      
      <div className="pattern-recommendations">
        <span className="recommendations-label">Recommendations:</span>
        <ul className="recommendations-list">
          {pattern.recommendations.map((rec, index) => (
            <li key={index} className="recommendation-item">{rec}</li>
          ))}
        </ul>
      </div>
    </div>
  );

  // Render overview
  const renderOverview = () => (
    <div className="ml-overview">
      <div className="overview-stats">
        <div className="stat-card">
          <div className="stat-icon">🤖</div>
          <div className="stat-content">
            <div className="stat-value">{mlState.models.size}</div>
            <div className="stat-label">Active Models</div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">⚠️</div>
          <div className="stat-content">
            <div className="stat-value">{mlState.anomalies.length}</div>
            <div className="stat-label">Anomalies Detected</div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">📈</div>
          <div className="stat-content">
            <div className="stat-value">{mlState.predictions.length}</div>
            <div className="stat-label">Predictions Generated</div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">🔍</div>
          <div className="stat-content">
            <div className="stat-value">{mlState.patterns.length}</div>
            <div className="stat-label">Patterns Recognized</div>
          </div>
        </div>
      </div>
      
      {showTrainingProgress && mlState.isTraining && (
        <div className="training-progress">
          <h4>Training Progress</h4>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${mlState.trainingProgress}%` }}
            />
          </div>
          <span className="progress-text">{Math.round(mlState.trainingProgress)}%</span>
        </div>
      )}
      
      <div className="recent-activity">
        <h4>Recent Activity</h4>
        <div className="activity-list">
          {mlState.anomalies.slice(-3).map(anomaly => (
            <div key={anomaly.timestamp.getTime()} className="activity-item">
              <div className="activity-icon">⚠️</div>
              <div className="activity-content">
                <div className="activity-title">Anomaly Detected</div>
                <div className="activity-description">{anomaly.description}</div>
                <div className="activity-time">{anomaly.timestamp.toLocaleString()}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className={`ml-dashboard ${className}`} style={style}>
      {/* Header */}
      <div className="ml-header">
        <h2 className="ml-title">Machine Learning Dashboard</h2>
        <div className="ml-status">
          <div className={`status-indicator ${mlState.isInitialized ? 'active' : 'inactive'}`} />
          <span className="status-text">
            {mlState.isInitialized ? 'ML System Active' : 'Initializing...'}
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="ml-tabs">
        <button
          className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button
          className={`tab-button ${activeTab === 'anomalies' ? 'active' : ''}`}
          onClick={() => setActiveTab('anomalies')}
        >
          Anomalies ({mlState.anomalies.length})
        </button>
        <button
          className={`tab-button ${activeTab === 'predictions' ? 'active' : ''}`}
          onClick={() => setActiveTab('predictions')}
        >
          Predictions ({mlState.predictions.length})
        </button>
        <button
          className={`tab-button ${activeTab === 'patterns' ? 'active' : ''}`}
          onClick={() => setActiveTab('patterns')}
        >
          Patterns ({mlState.patterns.length})
        </button>
        <button
          className={`tab-button ${activeTab === 'models' ? 'active' : ''}`}
          onClick={() => setActiveTab('models')}
        >
          Models ({mlState.models.size})
        </button>
      </div>

      {/* Content */}
      <div className="ml-content">
        {activeTab === 'overview' && renderOverview()}
        
        {activeTab === 'anomalies' && showAnomalyDetection && (
          <div className="anomalies-section">
            <div className="section-header">
              <h3>Anomaly Detection</h3>
              <button
                className="action-button primary"
                onClick={() => void mlActions.detectAnomalies(data)}
              >
                Detect Anomalies
              </button>
            </div>
            <div className="anomalies-grid">
              {mlState.anomalies.map(renderAnomalyCard)}
            </div>
          </div>
        )}
        
        {activeTab === 'predictions' && showPredictions && (
          <div className="predictions-section">
            <div className="section-header">
              <h3>Performance Predictions</h3>
              <button
                className="action-button primary"
                onClick={() => void mlActions.generatePredictions(data)}
              >
                Generate Predictions
              </button>
            </div>
            <div className="predictions-grid">
              {mlState.predictions.map(renderPredictionCard)}
            </div>
          </div>
        )}
        
        {activeTab === 'patterns' && showPatternRecognition && (
          <div className="patterns-section">
            <div className="section-header">
              <h3>Pattern Recognition</h3>
              <button
                className="action-button primary"
                onClick={() => void mlActions.recognizePatterns(data)}
              >
                Recognize Patterns
              </button>
            </div>
            <div className="patterns-grid">
              {mlState.patterns.map(renderPatternCard)}
            </div>
          </div>
        )}
        
        {activeTab === 'models' && showModelManagement && (
          <div className="models-section">
            <div className="section-header">
              <h3>Model Management</h3>
              <button
                className="action-button primary"
                onClick={() => void mlActions.retrainAllModels()}
                disabled={isTraining}
              >
                {isTraining ? 'Training...' : 'Retrain All Models'}
              </button>
            </div>
            <div className="models-grid">
              {Array.from(mlState.models.values()).map(renderModelCard)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MLDashboard;
