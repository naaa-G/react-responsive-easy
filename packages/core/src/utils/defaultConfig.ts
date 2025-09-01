import { ResponsiveConfig, Breakpoint, ScalingStrategy } from '../types';

/**
 * Default configuration for React Responsive Easy
 * Provides sensible defaults that work for most applications
 */
export function createDefaultConfig(): ResponsiveConfig {
  return {
    base: {
      name: 'desktop',
      width: 1920,
      height: 1080,
      alias: 'base'
    },
    breakpoints: [
      {
        name: 'mobile',
        width: 390,
        height: 844,
        alias: 'mobile'
      },
      {
        name: 'tablet',
        width: 768,
        height: 1024,
        alias: 'tablet'
      },
      {
        name: 'laptop',
        width: 1366,
        height: 768,
        alias: 'laptop'
      },
      {
        name: 'desktop',
        width: 1920,
        height: 1080,
        alias: 'base'
      }
    ],
    strategy: {
      origin: 'width',
      mode: 'linear',
      tokens: {
        fontSize: {
          scale: 0.85,
          min: 12,
          max: 48,
          unit: 'px',
          precision: 1,
          responsive: true
        },
        spacing: {
          scale: 0.9,
          step: 2,
          unit: 'px',
          precision: 1,
          responsive: true
        },
        radius: {
          scale: 0.95,
          min: 2,
          unit: 'px',
          precision: 1,
          responsive: true
        },
        lineHeight: {
          scale: 0.9,
          min: 1.2,
          unit: 'em',
          precision: 0.1,
          responsive: true
        },
        shadow: {
          scale: 0.8,
          unit: 'px',
          precision: 1,
          responsive: true
        },
        border: {
          scale: 0.9,
          min: 1,
          unit: 'px',
          precision: 1,
          responsive: true
        }
      },
      rounding: {
        mode: 'nearest',
        precision: 1
      },
      accessibility: {
        minFontSize: 12,
        minTapTarget: 44,
        contrastPreservation: true
      },
      performance: {
        memoization: true,
        cacheStrategy: 'memory',
        precomputeValues: true
      }
    },
    development: {
      enableDebugMode: false,
      showScalingInfo: false,
      logScalingCalculations: false
    }
  };
}

/**
 * Create a custom breakpoint with proper typing
 */
export function createBreakpoint(name: string, width: number, height: number, alias?: string): Breakpoint {
  return {
    name,
    width,
    height,
    alias,
    custom: {}
  };
}

/**
 * Create a custom scaling strategy with proper typing
 */
export function createScalingStrategy(overrides: Partial<ScalingStrategy> = {}): ScalingStrategy {
  const defaultStrategy: ScalingStrategy = {
    origin: 'width',
    mode: 'linear',
    tokens: {
      fontSize: {
        scale: 0.85,
        min: 12,
        max: 48,
        unit: 'px',
        precision: 1,
        responsive: true
      },
      spacing: {
        scale: 0.9,
        step: 2,
        unit: 'px',
        precision: 1,
        responsive: true
      },
      radius: {
        scale: 0.95,
        min: 2,
        unit: 'px',
        precision: 1,
        responsive: true
      },
      lineHeight: {
        scale: 0.9,
        min: 1.2,
        unit: 'em',
        precision: 0.1,
        responsive: true
      },
      shadow: {
        scale: 0.8,
        unit: 'px',
        precision: 1,
        responsive: true
      },
      border: {
        scale: 0.9,
        min: 1,
        unit: 'px',
        precision: 1,
        responsive: true
      }
    },
    rounding: {
      mode: 'nearest',
      precision: 1
    },
    accessibility: {
      minFontSize: 12,
      minTapTarget: 44,
      contrastPreservation: true
    },
    performance: {
      memoization: true,
      cacheStrategy: 'memory',
      precomputeValues: true
    }
  };

  return {
    ...defaultStrategy,
    ...overrides,
    tokens: {
      ...defaultStrategy.tokens,
      ...overrides.tokens
    },
    rounding: {
      ...defaultStrategy.rounding,
      ...overrides.rounding
    },
    accessibility: {
      ...defaultStrategy.accessibility,
      ...overrides.accessibility
    },
    performance: {
      ...defaultStrategy.performance,
      ...overrides.performance
    }
  };
}

/**
 * Configuration presets for common use cases
 */
export const configPresets = {
  /**
   * Conservative scaling - minimal changes between breakpoints
   */
  conservative: (config: ResponsiveConfig): ResponsiveConfig => ({
    ...config,
    strategy: {
      ...config.strategy,
      tokens: {
        ...config.strategy.tokens,
        fontSize: { ...config.strategy.tokens.fontSize, scale: 0.95 },
        spacing: { ...config.strategy.tokens.spacing, scale: 0.95 },
        radius: { ...config.strategy.tokens.radius, scale: 0.98 }
      }
    }
  }),

  /**
   * Aggressive scaling - dramatic changes between breakpoints
   */
  aggressive: (config: ResponsiveConfig): ResponsiveConfig => ({
    ...config,
    strategy: {
      ...config.strategy,
      tokens: {
        ...config.strategy.tokens,
        fontSize: { ...config.strategy.tokens.fontSize, scale: 0.7 },
        spacing: { ...config.strategy.tokens.spacing, scale: 0.75 },
        radius: { ...config.strategy.tokens.radius, scale: 0.8 }
      }
    }
  }),

  /**
   * Mobile-first approach - design for mobile, scale up
   */
  'mobile-first': (config: ResponsiveConfig): ResponsiveConfig => {
    const mobileFirstConfig = { ...config };
    
    // Swap base to mobile
    const mobileBreakpoint = config.breakpoints.find(bp => bp.alias === 'mobile');
    const desktopBreakpoint = config.breakpoints.find(bp => bp.alias === 'base');
    
    if (mobileBreakpoint && desktopBreakpoint) {
      mobileFirstConfig.base = mobileBreakpoint;
      mobileFirstConfig.strategy.origin = 'width';
      mobileFirstConfig.strategy.tokens.fontSize.scale = 1.2; // Scale up from mobile
      mobileFirstConfig.strategy.tokens.fontSize.min = 14; // Larger minimum for mobile-first
    }
    
    return mobileFirstConfig;
  }
};

/**
 * Validate configuration and return any issues
 */
export function validateConfig(config: ResponsiveConfig): string[] {
  const issues: string[] = [];

  // Check base breakpoint exists
  if (!config.base) {
    issues.push('Base breakpoint is required');
  }

  // Check breakpoints array
  if (!Array.isArray(config.breakpoints) || config.breakpoints.length === 0) {
    issues.push('At least one breakpoint is required');
  }

  // Check base breakpoint is in breakpoints array
  const baseInBreakpoints = config.breakpoints.some(bp => 
    bp.name === config.base.name || bp.alias === config.base.alias
  );
  if (!baseInBreakpoints) {
    issues.push('Base breakpoint must be included in breakpoints array');
  }

  // Check for duplicate names
  const names = config.breakpoints.map(bp => bp.name);
  const uniqueNames = new Set(names);
  if (names.length !== uniqueNames.size) {
    issues.push('Breakpoint names must be unique');
  }

  // Check scaling strategy
  if (!config.strategy) {
    issues.push('Scaling strategy is required');
  } else {
    if (!['width', 'height', 'min', 'max', 'diagonal', 'area'].includes(config.strategy.origin)) {
      issues.push('Invalid scaling origin');
    }
    
    if (!['linear', 'exponential', 'logarithmic', 'golden-ratio', 'custom'].includes(config.strategy.mode)) {
      issues.push('Invalid scaling mode');
    }
  }

  // Check accessibility constraints
  if (config.strategy.accessibility.minFontSize < 8) {
    issues.push('Minimum font size should be at least 8px for accessibility');
  }

  if (config.strategy.accessibility.minTapTarget < 44) {
    issues.push('Minimum tap target should be at least 44px for accessibility');
  }

  return issues;
}
