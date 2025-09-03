import { vi } from 'vitest';

/**
 * Enterprise-grade test setup for AI Optimizer
 * 
 * This setup provides comprehensive mocking, realistic test data,
 * and proper test environment configuration for enterprise-grade testing.
 */

// Enhanced mock tensor factory with realistic behavior
const createMockTensor = (data?: number[][] | number[], shape?: number[]) => {
  const flatData: number[] = Array.isArray(data) 
    ? (Array.isArray(data[0]) ? (data as number[][]).flat() : data as number[])
    : [0.5];
  
  const tensorShape: number[] = shape || (
    Array.isArray(data) && Array.isArray(data[0]) 
      ? [(data as number[][]).length, (data as number[][])[0].length] 
      : [1, flatData.length]
  );
  
  const mockTensor: any = {
    shape: tensorShape,
    data: vi.fn(() => Promise.resolve(new Float32Array(flatData))),
    dataSync: vi.fn(() => new Float32Array(flatData)),
    dispose: vi.fn(),
    
    // Mathematical operations with realistic chaining
    sub: vi.fn((other: any) => {
      const otherData = other?.dataSync?.() || [0];
      return createMockTensor(
        flatData.map((val, i) => val - (otherData[i] || 0)), 
        tensorShape
      );
    }),
    add: vi.fn((other: any) => {
      const otherData = other?.dataSync?.() || [0];
      return createMockTensor(
        flatData.map((val, i) => val + (otherData[i] || 0)), 
        tensorShape
      );
    }),
    div: vi.fn((other: any) => {
      const otherData = other?.dataSync?.() || [1];
      return createMockTensor(
        flatData.map((val, i) => val / (otherData[i] || 1)), 
        tensorShape
      );
    }),
    mul: vi.fn((other: any) => {
      const otherData = other?.dataSync?.() || [1];
      return createMockTensor(
        flatData.map((val, i) => val * (otherData[i] || 1)), 
        tensorShape
      );
    }),
    square: vi.fn(() => createMockTensor(flatData.map(val => val * val), tensorShape)),
    sqrt: vi.fn(() => createMockTensor(flatData.map(val => Math.sqrt(Math.abs(val))), tensorShape)),
    abs: vi.fn(() => createMockTensor(flatData.map(val => Math.abs(val)), tensorShape)),
    
    // Statistical operations
    mean: vi.fn((axis?: number, keepDims?: boolean) => {
      const meanValue = flatData.reduce((sum, val) => sum + val, 0) / flatData.length;
      return createMockTensor([meanValue], keepDims ? [1, 1] : [1]);
    }),
    min: vi.fn((axis?: number, keepDims?: boolean) => {
      const minValue = Math.min(...flatData);
      return createMockTensor([minValue], keepDims ? [1, 1] : [1]);
    }),
    max: vi.fn((axis?: number, keepDims?: boolean) => {
      const maxValue = Math.max(...flatData);
      return createMockTensor([maxValue], keepDims ? [1, 1] : [1]);
    }),
    sum: vi.fn((axis?: number, keepDims?: boolean) => {
      const sumValue = flatData.reduce((sum, val) => sum + val, 0);
      return createMockTensor([sumValue], keepDims ? [1, 1] : [1]);
    }),
    
    // Tensor manipulation
    slice: vi.fn((begin: number[], size?: number[]) => {
      const start = begin[0] || 0;
      const end = size ? start + size[0] : flatData.length;
      return createMockTensor(flatData.slice(start, end));
    }),
    lessEqual: vi.fn((other: any) => {
      const otherData = other?.dataSync?.() || [0];
      return createMockTensor(
        flatData.map((val, i) => val <= (otherData[i] || 0) ? 1 : 0), 
        tensorShape
      );
    }),
    greater: vi.fn((other: any) => {
      const otherData = other?.dataSync?.() || [0];
      return createMockTensor(
        flatData.map((val, i) => val > (otherData[i] || 0) ? 1 : 0), 
        tensorShape
      );
    }),
    equal: vi.fn((other: any) => {
      const otherData = other?.dataSync?.() || [0];
      return createMockTensor(
        flatData.map((val, i) => val === (otherData[i] || 0) ? 1 : 0), 
        tensorShape
      );
    }),
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
    grad: vi.fn(() => createMockTensor(flatData.map(() => Math.random() * 0.1 - 0.05), tensorShape)),
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
      fit: vi.fn().mockResolvedValue({ history: { loss: [0.5, 0.3, 0.1] } }),
      predict: vi.fn().mockReturnValue(mockTensor([[0.8]])),
      evaluate: vi.fn().mockResolvedValue([0.85, 0.92]),
      save: vi.fn().mockResolvedValue('model-saved'),
      countParams: vi.fn(() => 1000),
      layers: { length: 3 },
      inputs: [{ shape: [null, 128] }],
      outputs: [{ shape: [null, 64] }],
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
        apply: vi.fn((tensor: any) => tensor)
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
      l2: vi.fn((config: { l2: number }) => ({})),
      l1: vi.fn((config: { l1: number }) => ({})),
      l1l2: vi.fn((config: { l1: number; l2: number }) => ({}))
    },

    // Losses
    losses: {
      meanSquaredError: vi.fn(() => mockTensor([[0.1]])),
      absoluteDifference: vi.fn(() => mockTensor([[0.05]]))
    },

    // Tensor operations - CRITICAL: These must be at the top level
    scalar: vi.fn((value: number) => mockTensor([value])),
    tensor: vi.fn((data: number[], shape?: number[]) => mockTensor([data])),
    tensor2d: vi.fn((data: number[][]) => mockTensor(data)),
    zeros: vi.fn(() => mockTensor([[0]])),
    ones: vi.fn(() => mockTensor([[1]])),
    randomNormal: vi.fn(() => mockTensor([[0.5]])),

    loadLayersModel: vi.fn().mockResolvedValue({
      predict: vi.fn().mockReturnValue(mockTensor([[0.8]])),
      layers: { length: 3 },
      inputs: [{ shape: [null, 128] }],
      outputs: [{ shape: [null, 64] }],
      optimizer: { applyGradients: vi.fn() }
    }),

    grad: vi.fn((fn: Function) => vi.fn(() => mockTensor())),

    linspace: vi.fn((start: number, end: number, steps: number) => ({
      slice: vi.fn(() => mockTensor()),
      dispose: vi.fn()
    })),

    stack: vi.fn((tensors: any[]) => ({
      mean: vi.fn(() => Promise.resolve(0.5)),
      dispose: vi.fn()
    }))
  };
});

// Mock TensorFlow.js Node
vi.mock('@tensorflow/tfjs-node', () => ({
  sequential: vi.fn(() => ({
    add: vi.fn().mockReturnThis(),
    compile: vi.fn().mockReturnThis(),
    fit: vi.fn().mockResolvedValue({ history: { loss: [0.5, 0.3, 0.1] } }),
    predict: vi.fn().mockReturnValue({ dataSync: () => [0.8, 0.9, 0.7] }),
    evaluate: vi.fn().mockResolvedValue([0.85, 0.92]),
    save: vi.fn().mockResolvedValue('model-saved'),
    loadLayersModel: vi.fn().mockResolvedValue({}),
    countParams: vi.fn(() => 1000),
    layers: { length: 3 }
  })),
  layers: {
    dense: vi.fn(() => ({})),
    dropout: vi.fn(() => ({})),
    flatten: vi.fn(() => ({})),
    conv2d: vi.fn(() => ({})),
    maxPooling2d: vi.fn(() => ({})),
    globalAveragePooling2d: vi.fn(() => ({})),
    batchNormalization: vi.fn(() => ({
      apply: vi.fn((tensor: any) => tensor)
    }))
  },
  train: {
    adam: vi.fn(() => ({})),
    sgd: vi.fn(() => ({})),
    rmsprop: vi.fn(() => ({}))
  },
  regularizers: {
    l2: vi.fn((config: { l2: number }) => ({})),
    l1: vi.fn((config: { l1: number }) => ({})),
    l1l2: vi.fn((config: { l1: number; l2: number }) => ({}))
  },
  losses: {
    meanSquaredError: vi.fn(() => createMockTensor([[0.1]])),
    absoluteDifference: vi.fn(() => createMockTensor([[0.05]]))
  },
  scalar: vi.fn((value: number) => ({
    data: vi.fn(() => [value]),
    dispose: vi.fn()
  })),
  tensor: vi.fn((data: number[], shape?: number[]) => createMockTensor([data])),
  tensor2d: vi.fn((data: number[][]) => createMockTensor(data)),
  zeros: vi.fn(() => createMockTensor([[0]])),
  ones: vi.fn(() => createMockTensor([[1]])),
  randomNormal: vi.fn(() => createMockTensor([[0.5]])),
  loadLayersModel: vi.fn().mockResolvedValue({
    predict: vi.fn().mockReturnValue(createMockTensor([[0.8]]))
  }),
  grad: vi.fn((fn: Function) => vi.fn(() => createMockTensor())),
  linspace: vi.fn((start: number, end: number, steps: number) => ({
    slice: vi.fn(() => createMockTensor()),
    dispose: vi.fn()
  })),
  stack: vi.fn((tensors: any[]) => ({
    mean: vi.fn(() => Promise.resolve(0.5)),
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
      fit: vi.fn().mockResolvedValue({ history: { loss: [0.5, 0.3, 0.1] } }),
      predict: vi.fn().mockReturnValue(mockTensor([[0.8]])),
      evaluate: vi.fn().mockResolvedValue([0.85, 0.92]),
      save: vi.fn().mockResolvedValue('model-saved'),
      countParams: vi.fn(() => 1000),
      layers: { length: 3 },
      inputs: [{ shape: [null, 128] }],
      outputs: [{ shape: [null, 64] }],
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
        apply: vi.fn((tensor: any) => tensor)
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
      l2: vi.fn((config: { l2: number }) => ({})),
      l1: vi.fn((config: { l1: number }) => ({}))
    },

    // Losses
    losses: {
      meanSquaredError: vi.fn(() => mockTensor([[0.1]])),
      absoluteDifference: vi.fn(() => mockTensor([[0.05]]))
    },

    // Metrics
    metrics: {
      binaryAccuracy: vi.fn(() => mockTensor([[0.85]])),
      categoricalAccuracy: vi.fn(() => mockTensor([[0.92]]))
    },

    // Callbacks
    callbacks: {
      earlyStopping: vi.fn(() => ({})),
      modelCheckpoint: vi.fn(() => ({}))
    },

    // Tensor operations
    scalar: vi.fn((value: number) => createMockTensor([value])),
    tensor: vi.fn((data: number[], shape?: number[]) => createMockTensor([data])),
    tensor2d: vi.fn((data: number[][]) => createMockTensor(data)),
    zeros: vi.fn(() => createMockTensor([[0]])),
    ones: vi.fn(() => createMockTensor([[1]])),
    randomNormal: vi.fn(() => createMockTensor([[0.5]])),
    loadLayersModel: vi.fn().mockResolvedValue({
      predict: vi.fn().mockReturnValue(createMockTensor([[0.8]]))
    }),
    grad: vi.fn((fn: Function) => vi.fn(() => createMockTensor())),
    linspace: vi.fn((start: number, end: number, steps: number) => ({
      slice: vi.fn(() => createMockTensor()),
      dispose: vi.fn()
    })),
    stack: vi.fn((tensors: any[]) => ({
      mean: vi.fn(() => Promise.resolve(0.5)),
      dispose: vi.fn()
    })),

    // Memory management
    memory: vi.fn(() => ({
      numTensors: 0,
      numDataBuffers: 0,
      numBytes: 0
    }))
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
