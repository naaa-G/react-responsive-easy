import { vi } from 'vitest';
import { AI_OPTIMIZER_CONSTANTS } from '../constants';

/**
 * Enterprise-grade test setup for AI Optimizer
 * 
 * This setup provides comprehensive mocking, realistic test data,
 * and proper test environment configuration for enterprise-grade testing.
 */

// Constants for magic numbers
const DEFAULT_TENSOR_VALUE = AI_OPTIMIZER_CONSTANTS.ADDITIONAL_CONSTANTS.DEFAULT_ALPHA;
const DEFAULT_LOSS_VALUES = [
  AI_OPTIMIZER_CONSTANTS.ADDITIONAL_CONSTANTS.DEFAULT_ALPHA,
  AI_OPTIMIZER_CONSTANTS.ADDITIONAL_CONSTANTS.MIN_ALPHA,
  AI_OPTIMIZER_CONSTANTS.ADDITIONAL_CONSTANTS.MIN_THRESHOLD
];
const DEFAULT_PREDICTION_VALUE = AI_OPTIMIZER_CONSTANTS.ADDITIONAL_CONSTANTS.DEFAULT_CONFIDENCE;
const CONFIDENCE_OFFSET = 0.12;
const DEFAULT_EVALUATION_VALUES = [
  AI_OPTIMIZER_CONSTANTS.ADDITIONAL_CONSTANTS.DEFAULT_CONFIDENCE,
  AI_OPTIMIZER_CONSTANTS.ADDITIONAL_CONSTANTS.DEFAULT_CONFIDENCE + CONFIDENCE_OFFSET
];
const DEFAULT_PARAM_COUNT = 1000;
const DEFAULT_LAYER_COUNT = 3;
const DEFAULT_FEATURE_DIMENSION = 128;
const DEFAULT_OUTPUT_DIMENSION = 64;
const DEFAULT_LOSS_VALUE = 0.1;
const DEFAULT_ABSOLUTE_DIFFERENCE = 0.05;
const ACCURACY_VALUE_1 = 0.85;
const ACCURACY_VALUE_2 = 0.92;
const DEFAULT_ACCURACY_VALUES = [ACCURACY_VALUE_1, ACCURACY_VALUE_2];
const DEFAULT_RANDOM_FACTOR = 0.1;
const DEFAULT_GRADIENT_FACTOR = 0.05;
const DEFAULT_MEMORY_VALUES = { numTensors: 0, numDataBuffers: 0, numBytes: 0 };
const DEFAULT_MEAN_SQUARED_ERROR = 0.1;
const DEFAULT_ABSOLUTE_DIFFERENCE_VALUE = 0.05;
const DEFAULT_RANDOM_NORMAL_VALUE = 0.5;
const DEFAULT_PREDICTION_RESULT = 0.8;
const DEFAULT_MEAN_RESULT = 0.5;
const PREDICTION_VALUE_1 = 0.9;
const PREDICTION_VALUE_2 = 0.7;

// Helper function to create mathematical operations
const createMathOperations = (flatData: number[], tensorShape: number[]) => ({
  sub: vi.fn((other: Record<string, unknown>) => {
    const otherData = (other?.dataSync as (() => number[]) | undefined)?.() ?? [0];
    return createMockTensor(
      flatData.map((val, i) => val - (otherData[i] || 0)), 
      tensorShape
    );
  }),
  add: vi.fn((other: Record<string, unknown>) => {
    const otherData = (other?.dataSync as (() => number[]) | undefined)?.() ?? [0];
    return createMockTensor(
      flatData.map((val, i) => val + (otherData[i] || 0)), 
      tensorShape
    );
  }),
  div: vi.fn((other: Record<string, unknown>) => {
    const otherData = (other?.dataSync as (() => number[]) | undefined)?.() ?? [1];
    return createMockTensor(
      flatData.map((val, i) => val / (otherData[i] || 1)), 
      tensorShape
    );
  }),
  mul: vi.fn((other: Record<string, unknown>) => {
    const otherData = (other?.dataSync as (() => number[]) | undefined)?.() ?? [1];
    return createMockTensor(
      flatData.map((val, i) => val * (otherData[i] || 1)), 
      tensorShape
    );
  }),
  square: vi.fn(() => createMockTensor(flatData.map(val => val * val), tensorShape)),
  sqrt: vi.fn(() => createMockTensor(flatData.map(val => Math.sqrt(Math.abs(val))), tensorShape)),
  abs: vi.fn(() => createMockTensor(flatData.map(val => Math.abs(val)), tensorShape)),
});

// Helper function to create statistical operations
const createStatisticalOperations = (flatData: number[]) => ({
  mean: vi.fn((_axis?: number, keepDims?: boolean) => {
    const meanValue = flatData.reduce((sum, val) => sum + val, 0) / flatData.length;
    return createMockTensor([meanValue], keepDims ? [1, 1] : [1]);
  }),
  min: vi.fn((_axis?: number, keepDims?: boolean) => {
    const minValue = Math.min(...flatData);
    return createMockTensor([minValue], keepDims ? [1, 1] : [1]);
  }),
  max: vi.fn((_axis?: number, keepDims?: boolean) => {
    const maxValue = Math.max(...flatData);
    return createMockTensor([maxValue], keepDims ? [1, 1] : [1]);
  }),
  sum: vi.fn((_axis?: number, keepDims?: boolean) => {
    const sumValue = flatData.reduce((sum, val) => sum + val, 0);
    return createMockTensor([sumValue], keepDims ? [1, 1] : [1]);
  }),
});

// Helper function to create comparison operations
const createComparisonOperations = (flatData: number[], tensorShape: number[]) => ({
  lessEqual: vi.fn((other: Record<string, unknown>) => {
    const otherData = (other?.dataSync as (() => number[]) | undefined)?.() ?? [0];
    return createMockTensor(
      flatData.map((val, i) => val <= (otherData[i] || 0) ? 1 : 0), 
      tensorShape
    );
  }),
  greater: vi.fn((other: Record<string, unknown>) => {
    const otherData = (other?.dataSync as (() => number[]) | undefined)?.() ?? [0];
    return createMockTensor(
      flatData.map((val, i) => val > (otherData[i] || 0) ? 1 : 0), 
      tensorShape
    );
  }),
  equal: vi.fn((other: Record<string, unknown>) => {
    const otherData = (other?.dataSync as (() => number[]) | undefined)?.() ?? [0];
    return createMockTensor(
      flatData.map((val, i) => val === (otherData[i] || 0) ? 1 : 0), 
      tensorShape
    );
  }),
});

// Enhanced mock tensor factory with realistic behavior
const createMockTensor = (data?: number[][] | number[], shape?: number[]) => {
  const flatData: number[] = Array.isArray(data) 
    ? (Array.isArray(data[0]) ? (data as number[][]).flat() : data as number[])
    : [DEFAULT_TENSOR_VALUE];
  
  const tensorShape: number[] = shape ?? (
    Array.isArray(data) && Array.isArray(data[0]) 
      ? [(data as number[][]).length, (data as number[][])[0].length] 
      : [1, flatData.length]
  );
  
  const mockTensor: Record<string, unknown> = {
    shape: tensorShape,
    data: vi.fn(() => Promise.resolve(new Float32Array(flatData))),
    dataSync: vi.fn(() => new Float32Array(flatData)),
    dispose: vi.fn(),
    
    // Mathematical operations with realistic chaining
    ...createMathOperations(flatData, tensorShape),
    
    // Statistical operations
    ...createStatisticalOperations(flatData),
    
    // Tensor manipulation
    slice: vi.fn((begin: number[], size?: number[]) => {
      const start = begin[0] || 0;
      const end = size ? start + size[0] : flatData.length;
      return createMockTensor(flatData.slice(start, end));
    }),
    
    // Comparison operations
    ...createComparisonOperations(flatData, tensorShape),
    cast: vi.fn(() => createMockTensor(flatData, tensorShape)),
    reshape: vi.fn((newShape: number[]) => createMockTensor(flatData, newShape)),
    transpose: vi.fn(() => createMockTensor(flatData, tensorShape.slice().reverse())),
    expandDims: vi.fn((axis: number) => {
      const newShape = [...tensorShape];
      newShape.splice(axis, 0, 1);
      return createMockTensor(flatData, newShape);
    }),
    squeeze: vi.fn(() => createMockTensor(flatData, tensorShape.filter(dim => dim !== 1))),
    
    // Advanced operations
    grad: vi.fn(() => createMockTensor(flatData.map(() => Math.random() * DEFAULT_RANDOM_FACTOR - DEFAULT_GRADIENT_FACTOR), tensorShape)),
    async: vi.fn(() => Promise.resolve(createMockTensor(flatData, tensorShape)))
  };
  
  return mockTensor;
};

// Mock TensorFlow.js - Simplified approach
vi.mock('@tensorflow/tfjs', () => {
  const mockTensor = createMockTensor;
  
  return {
    // Sequential model mock
    sequential: vi.fn(() => ({
      add: vi.fn().mockReturnThis(),
      compile: vi.fn().mockReturnThis(),
      fit: vi.fn().mockResolvedValue({ history: { loss: DEFAULT_LOSS_VALUES } }),
      predict: vi.fn().mockReturnValue(mockTensor([[DEFAULT_PREDICTION_VALUE]])),
      evaluate: vi.fn().mockResolvedValue(DEFAULT_EVALUATION_VALUES),
      save: vi.fn().mockResolvedValue('model-saved'),
      countParams: vi.fn(() => DEFAULT_PARAM_COUNT),
      layers: { length: DEFAULT_LAYER_COUNT },
      inputs: [{ shape: [null, DEFAULT_FEATURE_DIMENSION] }],
      outputs: [{ shape: [null, DEFAULT_OUTPUT_DIMENSION] }],
      optimizer: { applyGradients: vi.fn() },
      loss: 'meanSquaredError',
      metrics: ['accuracy']
    })),

    // Layers
    layers: {
      dense: vi.fn(() => ({})),
      dropout: vi.fn(() => ({})),
      flatten: vi.fn(() => ({})),
      conv2d: vi.fn(() => ({})),
      maxPooling2d: vi.fn(() => ({})),
      globalAveragePooling2d: vi.fn(() => ({})),
      batchNormalization: vi.fn(() => ({
        apply: vi.fn((tensor: Record<string, unknown>) => tensor)
      }))
    },

    // Training
    train: {
      adam: vi.fn(() => ({})),
      sgd: vi.fn(() => ({})),
      rmsprop: vi.fn(() => ({}))
    },

    // Regularizers
    regularizers: {
      l2: vi.fn((_config: { l2: number }) => ({})),
      l1: vi.fn((_config: { l1: number }) => ({})),
      l1l2: vi.fn((_config: { l1: number; l2: number }) => ({}))
    },

    // Losses
    losses: {
      meanSquaredError: vi.fn(() => mockTensor([[DEFAULT_MEAN_SQUARED_ERROR]])),
      absoluteDifference: vi.fn(() => mockTensor([[DEFAULT_ABSOLUTE_DIFFERENCE_VALUE]]))
    },

    // Tensor operations - CRITICAL: These must be at the top level
    scalar: vi.fn((value: number) => mockTensor([value])),
    tensor: vi.fn((data: number[], _shape?: number[]) => mockTensor([data])),
    tensor2d: vi.fn((data: number[][]) => mockTensor(data)),
    zeros: vi.fn(() => mockTensor([[0]])),
    ones: vi.fn(() => mockTensor([[1]])),
    randomNormal: vi.fn(() => mockTensor([[DEFAULT_TENSOR_VALUE]])),

    loadLayersModel: vi.fn().mockResolvedValue({
      predict: vi.fn().mockReturnValue(mockTensor([[DEFAULT_PREDICTION_VALUE]])),
      layers: { length: DEFAULT_LAYER_COUNT },
      inputs: [{ shape: [null, DEFAULT_FEATURE_DIMENSION] }],
      outputs: [{ shape: [null, DEFAULT_OUTPUT_DIMENSION] }],
      optimizer: { applyGradients: vi.fn() }
    }),

    grad: vi.fn((_fn: () => Record<string, unknown>) => vi.fn(() => mockTensor())),

    linspace: vi.fn((_start: number, _end: number, _steps: number) => ({
      slice: vi.fn(() => mockTensor()),
      dispose: vi.fn()
    })),

    stack: vi.fn((_tensors: Record<string, unknown>[]) => ({
      mean: vi.fn(() => Promise.resolve(DEFAULT_MEAN_RESULT)),
      dispose: vi.fn()
    }))
  };
});

// Mock TensorFlow.js Node
vi.mock('@tensorflow/tfjs-node', () => ({
  sequential: vi.fn(() => ({
    add: vi.fn().mockReturnThis(),
    compile: vi.fn().mockReturnThis(),
    fit: vi.fn().mockResolvedValue({ history: { loss: DEFAULT_LOSS_VALUES } }),
    predict: vi.fn().mockReturnValue({ dataSync: () => [DEFAULT_PREDICTION_VALUE, PREDICTION_VALUE_1, PREDICTION_VALUE_2] }),
    evaluate: vi.fn().mockResolvedValue(DEFAULT_EVALUATION_VALUES),
    save: vi.fn().mockResolvedValue('model-saved'),
    loadLayersModel: vi.fn().mockResolvedValue({}),
    countParams: vi.fn(() => DEFAULT_PARAM_COUNT),
    layers: { length: DEFAULT_LAYER_COUNT }
  })),
  layers: {
    dense: vi.fn(() => ({})),
    dropout: vi.fn(() => ({})),
    flatten: vi.fn(() => ({})),
    conv2d: vi.fn(() => ({})),
    maxPooling2d: vi.fn(() => ({})),
    globalAveragePooling2d: vi.fn(() => ({})),
    batchNormalization: vi.fn(() => ({
      apply: vi.fn((tensor: Record<string, unknown>) => tensor)
    }))
  },
  train: {
    adam: vi.fn(() => ({})),
    sgd: vi.fn(() => ({})),
    rmsprop: vi.fn(() => ({}))
  },
  regularizers: {
    l2: vi.fn((_config: { l2: number }) => ({})),
    l1: vi.fn((_config: { l1: number }) => ({})),
    l1l2: vi.fn((_config: { l1: number; l2: number }) => ({}))
  },
  losses: {
    meanSquaredError: vi.fn(() => createMockTensor([[DEFAULT_MEAN_SQUARED_ERROR]])),
    absoluteDifference: vi.fn(() => createMockTensor([[DEFAULT_ABSOLUTE_DIFFERENCE_VALUE]]))
  },
  scalar: vi.fn((value: number) => ({
    data: vi.fn(() => [value]),
    dispose: vi.fn()
  })),
  tensor: vi.fn((data: number[], _shape?: number[]) => createMockTensor([data])),
  tensor2d: vi.fn((data: number[][]) => createMockTensor(data)),
  zeros: vi.fn(() => createMockTensor([[0]])),
  ones: vi.fn(() => createMockTensor([[1]])),
  randomNormal: vi.fn(() => createMockTensor([[DEFAULT_RANDOM_NORMAL_VALUE]])),
  loadLayersModel: vi.fn().mockResolvedValue({
    predict: vi.fn().mockReturnValue(createMockTensor([[DEFAULT_PREDICTION_RESULT]]))
  }),
  grad: vi.fn((_fn: Function) => vi.fn(() => createMockTensor())),
  linspace: vi.fn((_start: number, _end: number, _steps: number) => ({
    slice: vi.fn(() => createMockTensor()),
    dispose: vi.fn()
  })),
  stack: vi.fn((_tensors: Record<string, unknown>[]) => ({
    mean: vi.fn(() => Promise.resolve(DEFAULT_MEAN_RESULT)),
    dispose: vi.fn()
  })),

  // Memory management
  memory: vi.fn(() => ({
    numTensors: 0,
    numDataBuffers: 0,
    numBytes: 0
  }))
}));

// TensorFlow.js mock with default export compatibility
vi.mock('@tensorflow/tfjs', () => {
  const mockTensor = createMockTensor;
  
  const mockTf = {
    // Sequential model mock
    sequential: vi.fn(() => ({
      add: vi.fn().mockReturnThis(),
      compile: vi.fn().mockReturnThis(),
      fit: vi.fn().mockResolvedValue({ history: { loss: DEFAULT_LOSS_VALUES } }),
      predict: vi.fn().mockReturnValue(mockTensor([[DEFAULT_PREDICTION_VALUE]])),
      evaluate: vi.fn().mockResolvedValue(DEFAULT_EVALUATION_VALUES),
      save: vi.fn().mockResolvedValue('model-saved'),
      countParams: vi.fn(() => DEFAULT_PARAM_COUNT),
      layers: { length: DEFAULT_LAYER_COUNT },
      inputs: [{ shape: [null, DEFAULT_FEATURE_DIMENSION] }],
      outputs: [{ shape: [null, DEFAULT_OUTPUT_DIMENSION] }],
      optimizer: { applyGradients: vi.fn() },
      loss: 'meanSquaredError',
      metrics: ['accuracy']
    })),

    // Layers
    layers: {
      dense: vi.fn(() => ({})),
      dropout: vi.fn(() => ({})),
      flatten: vi.fn(() => ({})),
      conv2d: vi.fn(() => ({})),
      maxPooling2d: vi.fn(() => ({})),
      globalAveragePooling2d: vi.fn(() => ({})),
      batchNormalization: vi.fn(() => ({
        apply: vi.fn((tensor: Record<string, unknown>) => tensor)
      }))
    },

    // Training
    train: {
      adam: vi.fn(() => ({})),
      sgd: vi.fn(() => ({})),
      rmsprop: vi.fn(() => ({}))
    },

    // Regularizers
    regularizers: {
      l2: vi.fn((_config: { l2: number }) => ({})),
      l1: vi.fn((_config: { l1: number }) => ({}))
    },

    // Losses
    losses: {
      meanSquaredError: vi.fn(() => mockTensor([[DEFAULT_LOSS_VALUE]])),
      absoluteDifference: vi.fn(() => mockTensor([[DEFAULT_ABSOLUTE_DIFFERENCE]]))
    },

    // Metrics
    metrics: {
      binaryAccuracy: vi.fn(() => mockTensor([[DEFAULT_ACCURACY_VALUES[0]]])),
      categoricalAccuracy: vi.fn(() => mockTensor([[DEFAULT_ACCURACY_VALUES[1]]]))
    },

    // Callbacks
    callbacks: {
      earlyStopping: vi.fn(() => ({})),
      modelCheckpoint: vi.fn(() => ({}))
    },

    // Tensor operations
    scalar: vi.fn((value: number) => createMockTensor([value])),
    tensor: vi.fn((data: number[], _shape?: number[]) => createMockTensor([data])),
    tensor2d: vi.fn((data: number[][]) => createMockTensor(data)),
    zeros: vi.fn(() => createMockTensor([[0]])),
    ones: vi.fn(() => createMockTensor([[1]])),
    randomNormal: vi.fn(() => createMockTensor([[DEFAULT_TENSOR_VALUE]])),
    loadLayersModel: vi.fn().mockResolvedValue({
      predict: vi.fn().mockReturnValue(createMockTensor([[DEFAULT_PREDICTION_VALUE]]))
    }),
    grad: vi.fn((_fn: Function) => vi.fn(() => createMockTensor())),
    linspace: vi.fn((_start: number, _end: number, _steps: number) => ({
      slice: vi.fn(() => createMockTensor()),
      dispose: vi.fn()
    })),
    stack: vi.fn((_tensors: Record<string, unknown>[]) => ({
      mean: vi.fn(() => Promise.resolve(DEFAULT_TENSOR_VALUE)),
      dispose: vi.fn()
    })),

    // Memory management
    memory: vi.fn(() => DEFAULT_MEMORY_VALUES)
  };

  return {
    ...mockTf,
    default: mockTf // Add default export for compatibility
  };
});

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});
