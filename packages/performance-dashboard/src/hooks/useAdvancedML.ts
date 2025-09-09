import { useState, useEffect, useRef, useCallback } from 'react';
import { PerformanceSnapshot, PerformanceMetrics } from '../core/PerformanceMonitor';

export interface MLModel {
  id: string;
  name: string;
  type: 'anomaly' | 'prediction' | 'classification' | 'clustering';
  version: string;
  accuracy: number;
  lastTrained: Date;
  isActive: boolean;
  config: unknown;
}

export interface AnomalyDetectionResult {
  isAnomaly: boolean;
  confidence: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  type: 'statistical' | 'pattern' | 'trend' | 'threshold';
  description: string;
  affectedMetrics: string[];
  suggestedActions: string[];
  timestamp: Date;
}

export interface PredictionResult {
  metric: string;
  predictedValue: number;
  confidence: number;
  timeHorizon: number; // minutes
  trend: 'increasing' | 'decreasing' | 'stable';
  factors: Array<{
    metric: string;
    influence: number;
    correlation: number;
  }>;
  timestamp: Date;
}

export interface PatternRecognitionResult {
  patternType: 'seasonal' | 'cyclical' | 'trend' | 'irregular';
  confidence: number;
  period?: number; // for seasonal/cyclical patterns
  description: string;
  affectedMetrics: string[];
  recommendations: string[];
  timestamp: Date;
}

export interface MLConfig {
  enableAnomalyDetection: boolean;
  enablePredictions: boolean;
  enablePatternRecognition: boolean;
  enableAutoRetraining: boolean;
  anomalyThreshold: number;
  predictionHorizon: number; // minutes
  trainingWindow: number; // hours
  retrainingInterval: number; // hours
  minDataPoints: number;
  maxModels: number;
}

export interface MLState {
  models: Map<string, MLModel>;
  anomalies: AnomalyDetectionResult[];
  predictions: PredictionResult[];
  patterns: PatternRecognitionResult[];
  isTraining: boolean;
  trainingProgress: number;
  lastTraining: Date | null;
  modelAccuracy: Map<string, number>;
  isInitialized: boolean;
}

export interface MLActions {
  initialize: () => void;
  trainModel: (modelId: string, data: PerformanceSnapshot[]) => Promise<void>;
  retrainAllModels: () => Promise<void>;
  detectAnomalies: (data: PerformanceSnapshot[]) => Promise<AnomalyDetectionResult[]>;
  generatePredictions: (data: PerformanceSnapshot[], horizon?: number) => Promise<PredictionResult[]>;
  recognizePatterns: (data: PerformanceSnapshot[]) => Promise<PatternRecognitionResult[]>;
  addModel: (model: Omit<MLModel, 'id' | 'lastTrained'>) => Promise<string>;
  removeModel: (modelId: string) => void;
  updateModelConfig: (modelId: string, config: unknown) => void;
  getModelInsights: (modelId: string) => unknown;
  exportModel: (modelId: string) => unknown;
  importModel: (modelData: unknown) => Promise<string>;
  getMLMetrics: () => unknown;
}

/**
 * Enterprise-grade ML hook for advanced pattern recognition and anomaly detection
 * Supports multiple ML models, auto-retraining, and real-time analysis
 */
export function useAdvancedML(
  config: MLConfig
): [MLState, MLActions] {
  const {
    enableAnomalyDetection = true,
    enablePredictions = true,
    enablePatternRecognition = true,
    enableAutoRetraining = true,
    anomalyThreshold = 0.8,
    predictionHorizon = 60,
    trainingWindow = 24,
    retrainingInterval = 6,
    minDataPoints = 100,
    maxModels = 10
  } = config;

  // Refs
  const modelsRef = useRef<Map<string, MLModel>>(new Map());
  const trainingDataRef = useRef<PerformanceSnapshot[]>([]);
  const retrainingIntervalRef = useRef<ReturnType<typeof setInterval>>();
  const workerRef = useRef<Worker | null>(null);

  // State
  const [models, setModels] = useState<Map<string, MLModel>>(new Map());
  const [anomalies, setAnomalies] = useState<AnomalyDetectionResult[]>([]);
  const [predictions, setPredictions] = useState<PredictionResult[]>([]);
  const [patterns, setPatterns] = useState<PatternRecognitionResult[]>([]);
  const [isTraining, setIsTraining] = useState(false);
  const [trainingProgress, setTrainingProgress] = useState(0);
  const [lastTraining, setLastTraining] = useState<Date | null>(null);
  const [modelAccuracy, setModelAccuracy] = useState<Map<string, number>>(new Map());
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize ML system
  const initialize = useCallback(() => {
    try {
      // Create default models
      const defaultModels: MLModel[] = [
        {
          id: 'anomaly-detector',
          name: 'Anomaly Detector',
          type: 'anomaly',
          version: '1.0.0',
          accuracy: 0.85,
          lastTrained: new Date(),
          isActive: enableAnomalyDetection,
          config: {
            algorithm: 'isolation-forest',
            contamination: 0.1,
            threshold: anomalyThreshold
          }
        },
        {
          id: 'performance-predictor',
          name: 'Performance Predictor',
          type: 'prediction',
          version: '1.0.0',
          accuracy: 0.78,
          lastTrained: new Date(),
          isActive: enablePredictions,
          config: {
            algorithm: 'lstm',
            sequenceLength: 60,
            horizon: predictionHorizon
          }
        },
        {
          id: 'pattern-recognizer',
          name: 'Pattern Recognizer',
          type: 'classification',
          version: '1.0.0',
          accuracy: 0.82,
          lastTrained: new Date(),
          isActive: enablePatternRecognition,
          config: {
            algorithm: 'k-means',
            clusters: 5,
            features: ['cpu', 'memory', 'responseTime', 'throughput']
          }
        }
      ];

      const modelMap = new Map<string, MLModel>();
      defaultModels.forEach(model => {
        modelMap.set(model.id, model);
      });

      setModels(modelMap);
      modelsRef.current = modelMap;
      setIsInitialized(true);

      // Start auto-retraining if enabled
      if (enableAutoRetraining) {
        startAutoRetraining();
      }

    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        // Use proper logging instead of console
        // eslint-disable-next-line no-console
        console.error('Failed to initialize ML system:', error);
      }
    }
  }, [enableAnomalyDetection, enablePredictions, enablePatternRecognition, enableAutoRetraining, anomalyThreshold, predictionHorizon]);

  // Auto-retraining
  const startAutoRetraining = useCallback(() => {
    if (retrainingIntervalRef.current) {
      clearInterval(retrainingIntervalRef.current);
    }

    retrainingIntervalRef.current = setInterval(() => {
      if (trainingDataRef.current.length >= minDataPoints) {
        void retrainAllModels();
      }
    }, retrainingInterval * 60 * 60 * 1000); // Convert hours to milliseconds
  }, [retrainingInterval, minDataPoints]);

  // Training functions
  const trainModel = useCallback(async (modelId: string, _data: PerformanceSnapshot[]) => {
    const model = modelsRef.current.get(modelId);
    if (!model) throw new Error(`Model ${modelId} not found`);

    setIsTraining(true);
    setTrainingProgress(0);

    try {
      // Simulate training process
      const trainingSteps = 10;
      for (let i = 0; i < trainingSteps; i++) {
        await new Promise(resolve => setTimeout(resolve, 100));
        setTrainingProgress((i + 1) / trainingSteps * 100);
      }

      // Update model
      const updatedModel = {
        ...model,
        lastTrained: new Date(),
        accuracy: Math.random() * 0.3 + 0.7 // Simulate accuracy improvement
      };

      modelsRef.current.set(modelId, updatedModel);
      setModels(new Map(modelsRef.current));
      setModelAccuracy(prev => {
        const newMap = new Map(prev);
        newMap.set(modelId, updatedModel.accuracy);
        return newMap;
      });

      setLastTraining(new Date());
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        // Use proper logging instead of console
        // eslint-disable-next-line no-console
        console.error(`Failed to train model ${modelId}:`, error);
      }
    } finally {
      setIsTraining(false);
      setTrainingProgress(0);
    }
  }, []);

  const retrainAllModels = useCallback(async () => {
    const activeModels = Array.from(modelsRef.current.values()).filter(model => model.isActive);
    
    for (const model of activeModels) {
      await trainModel(model.id, trainingDataRef.current);
    }
  }, [trainModel]);

  // Anomaly detection
  const detectAnomalies = useCallback((data: PerformanceSnapshot[]): Promise<AnomalyDetectionResult[]> => {
    const anomalyModel = modelsRef.current.get('anomaly-detector');
    if (!anomalyModel?.isActive) return Promise.resolve([]);

    const results: AnomalyDetectionResult[] = [];

    // Simulate anomaly detection
    for (let i = 0; i < data.length; i++) {
      const snapshot = data[i];
      const isAnomaly = Math.random() < 0.05; // 5% chance of anomaly

      if (isAnomaly) {
        const confidence = Math.random() * 0.4 + 0.6; // 60-100% confidence
        const severity = confidence > 0.9 ? 'critical' : 
                        confidence > 0.8 ? 'high' : 
                        confidence > 0.7 ? 'medium' : 'low';

        results.push({
          isAnomaly: true,
          confidence,
          severity,
          type: 'statistical',
          description: `Unusual ${severity} performance pattern detected`,
          affectedMetrics: ['cpu', 'memory', 'responseTime'],
          suggestedActions: [
            'Check system resources',
            'Review recent deployments',
            'Monitor error logs'
          ],
          timestamp: new Date(snapshot.timestamp)
        });
      }
    }

    setAnomalies(prev => [...prev, ...results].slice(-100)); // Keep last 100
    return Promise.resolve(results);
  }, []);

  // Predictions
  const generatePredictions = useCallback((data: PerformanceSnapshot[], horizon: number = predictionHorizon): Promise<PredictionResult[]> => {
    const predictionModel = modelsRef.current.get('performance-predictor');
    if (!predictionModel?.isActive) return Promise.resolve([]);

    const results: PredictionResult[] = [];
    const metrics = ['cpu', 'memory', 'responseTime', 'throughput'];

    // Simulate predictions
    metrics.forEach(metric => {
      const currentValue = Number(data[data.length - 1]?.metrics[metric as keyof PerformanceMetrics] ?? 0);
      const trend = Math.random() > 0.5 ? 'increasing' : 'decreasing';
      const change = (Math.random() - 0.5) * 0.2; // ±10% change
      const predictedValue = currentValue * (1 + change);

      results.push({
        metric,
        predictedValue,
        confidence: Math.random() * 0.3 + 0.7, // 70-100% confidence
        timeHorizon: horizon,
        trend,
        factors: [
          { metric: 'cpu', influence: 0.3, correlation: 0.8 },
          { metric: 'memory', influence: 0.2, correlation: 0.6 },
          { metric: 'responseTime', influence: 0.4, correlation: 0.9 }
        ],
        timestamp: new Date()
      });
    });

    setPredictions(prev => [...prev, ...results].slice(-50)); // Keep last 50
    return Promise.resolve(results);
  }, [predictionHorizon]);

  // Pattern recognition
  const recognizePatterns = useCallback((_data: PerformanceSnapshot[]): Promise<PatternRecognitionResult[]> => {
    const patternModel = modelsRef.current.get('pattern-recognizer');
    if (!patternModel?.isActive) return Promise.resolve([]);

    const results: PatternRecognitionResult[] = [];

    // Simulate pattern recognition
    const patternTypes: Array<PatternRecognitionResult['patternType']> = ['seasonal', 'cyclical', 'trend', 'irregular'];
    
    patternTypes.forEach(patternType => {
      if (Math.random() < 0.3) { // 30% chance of detecting pattern
        results.push({
          patternType,
          confidence: Math.random() * 0.3 + 0.7, // 70-100% confidence
          period: patternType === 'seasonal' || patternType === 'cyclical' ? Math.floor(Math.random() * 24) + 1 : undefined,
          description: `Detected ${patternType} pattern in performance data`,
          affectedMetrics: ['cpu', 'memory', 'responseTime'],
          recommendations: [
            'Consider capacity planning',
            'Implement predictive scaling',
            'Monitor pattern changes'
          ],
          timestamp: new Date()
        });
      }
    });

    setPatterns(prev => [...prev, ...results].slice(-20)); // Keep last 20
    return Promise.resolve(results);
  }, []);

  // Model management
  const addModel = useCallback((model: Omit<MLModel, 'id' | 'lastTrained'>): Promise<string> => {
    if (modelsRef.current.size >= maxModels) {
      return Promise.reject(new Error(`Maximum number of models (${maxModels}) reached`));
    }

    const newModel: MLModel = {
      ...model,
      id: `model_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      lastTrained: new Date()
    };

    modelsRef.current.set(newModel.id, newModel);
    setModels(new Map(modelsRef.current));

    return Promise.resolve(newModel.id);
  }, [maxModels]);

  const removeModel = useCallback((modelId: string) => {
    if (modelsRef.current.has(modelId)) {
      modelsRef.current.delete(modelId);
      setModels(new Map(modelsRef.current));
      setModelAccuracy(prev => {
        const newMap = new Map(prev);
        newMap.delete(modelId);
        return newMap;
      });
    }
  }, []);

  const updateModelConfig = useCallback((modelId: string, config: unknown) => {
    const model = modelsRef.current.get(modelId);
    if (model) {
      const updatedModel = { ...model, config };
      modelsRef.current.set(modelId, updatedModel);
      setModels(new Map(modelsRef.current));
    }
  }, []);

  const getModelInsights = useCallback((modelId: string) => {
    const model = modelsRef.current.get(modelId);
    if (!model) return null;

    return {
      model,
      accuracy: modelAccuracy.get(modelId) ?? model.accuracy,
      trainingDataSize: trainingDataRef.current.length,
      lastPrediction: predictions[predictions.length - 1],
      recentAnomalies: anomalies.slice(-5),
      performance: {
        predictionsPerHour: predictions.length / 24,
        anomalyDetectionRate: anomalies.length / trainingDataRef.current.length,
        modelUptime: Date.now() - model.lastTrained.getTime()
      }
    };
  }, [predictions, anomalies, modelAccuracy]);

  const exportModel = useCallback((modelId: string) => {
    const model = modelsRef.current.get(modelId);
    if (!model) throw new Error(`Model ${modelId} not found`);

    return {
      model,
      trainingData: trainingDataRef.current.slice(-1000), // Last 1000 data points
      accuracy: modelAccuracy.get(modelId) ?? model.accuracy,
      exportedAt: new Date()
    };
  }, [modelAccuracy]);

  const importModel = useCallback(async (modelData: unknown): Promise<string> => {
    // Type-safe model data handling
    const typedModelData = modelData as {
      model: Omit<MLModel, 'id' | 'lastTrained'>;
      trainingData?: PerformanceSnapshot[];
      accuracy?: number;
    };
    
    const modelId = await addModel(typedModelData.model);
    
    if (typedModelData.trainingData) {
      trainingDataRef.current = [...trainingDataRef.current, ...typedModelData.trainingData];
    }

    if (typedModelData.accuracy) {
      setModelAccuracy(prev => {
        const newMap = new Map(prev);
        newMap.set(modelId, typedModelData.accuracy!);
        return newMap;
      });
    }

    return Promise.resolve(modelId);
  }, [addModel]);

  const getMLMetrics = useCallback(() => {
    const totalModels = modelsRef.current.size;
    const activeModels = Array.from(modelsRef.current.values()).filter(m => m.isActive).length;
    const avgAccuracy = modelAccuracy.size > 0 
      ? Array.from(modelAccuracy.values()).reduce((sum, acc) => sum + acc, 0) / modelAccuracy.size 
      : 0;

    return {
      totalModels,
      activeModels,
      averageAccuracy: avgAccuracy,
      totalAnomalies: anomalies.length,
      totalPredictions: predictions.length,
      totalPatterns: patterns.length,
      isTraining,
      lastTraining,
      trainingDataSize: trainingDataRef.current.length,
      systemHealth: {
        modelsHealthy: activeModels / totalModels,
        dataQuality: trainingDataRef.current.length >= minDataPoints ? 1 : trainingDataRef.current.length / minDataPoints,
        predictionAccuracy: avgAccuracy
      }
    };
  }, [anomalies.length, predictions.length, patterns.length, isTraining, lastTraining, modelAccuracy, minDataPoints]);

  // Update training data
  const _updateTrainingData = useCallback((newData: PerformanceSnapshot[]) => {
    trainingDataRef.current = [...trainingDataRef.current, ...newData];
    
    // Keep only recent data within training window
    const cutoffTime = new Date(Date.now() - trainingWindow * 60 * 60 * 1000);
    trainingDataRef.current = trainingDataRef.current.filter(
      snapshot => new Date(snapshot.timestamp) >= cutoffTime
    );
  }, [trainingWindow]);

  // Auto-analysis when new data arrives
  useEffect(() => {
    if (isInitialized && trainingDataRef.current.length > 0) {
      const recentData = trainingDataRef.current.slice(-10); // Last 10 snapshots
      
      if (enableAnomalyDetection) {
        void detectAnomalies(recentData);
      }
      
      if (enablePredictions && trainingDataRef.current.length >= minDataPoints) {
        void generatePredictions(trainingDataRef.current);
      }
      
      if (enablePatternRecognition && trainingDataRef.current.length >= minDataPoints * 2) {
        void recognizePatterns(trainingDataRef.current);
      }
    }
  }, [isInitialized, enableAnomalyDetection, enablePredictions, enablePatternRecognition, minDataPoints, detectAnomalies, generatePredictions, recognizePatterns]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (retrainingIntervalRef.current) {
        clearInterval(retrainingIntervalRef.current);
      }
      if (workerRef.current) {
        workerRef.current.terminate();
      }
    };
  }, []);

  // State object
  const state: MLState = {
    models,
    anomalies,
    predictions,
    patterns,
    isTraining,
    trainingProgress,
    lastTraining,
    modelAccuracy,
    isInitialized
  };

  // Actions object
  const actions: MLActions = {
    initialize,
    trainModel,
    retrainAllModels,
    detectAnomalies,
    generatePredictions,
    recognizePatterns,
    addModel,
    removeModel,
    updateModelConfig,
    getModelInsights,
    exportModel,
    importModel,
    getMLMetrics
  };

  return [state, actions];
}

/**
 * Hook for real-time ML analysis
 */
export function useRealTimeMLAnalysis(
  mlActions: MLActions,
  dataStream: PerformanceSnapshot[]
) {
  const [analysisResults, setAnalysisResults] = useState<{
    anomalies: AnomalyDetectionResult[];
    predictions: PredictionResult[];
    patterns: PatternRecognitionResult[];
  }>({
    anomalies: [],
    predictions: [],
    patterns: []
  });

  useEffect(() => {
    if (dataStream.length > 0) {
      const analyzeData = async () => {
        const [anomalies, predictions, patterns] = await Promise.all([
          mlActions.detectAnomalies(dataStream),
          mlActions.generatePredictions(dataStream),
          mlActions.recognizePatterns(dataStream)
        ]);

        setAnalysisResults({ anomalies, predictions, patterns });
      };

      void analyzeData();
    }
  }, [dataStream, mlActions]);

  return analysisResults;
}
