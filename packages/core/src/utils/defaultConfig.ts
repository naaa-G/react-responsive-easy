import { ResponsiveConfig, Breakpoint, ScalingStrategy } from '../types';

// Constants for better maintainability and enterprise-grade code
const MIN_FONT_SIZE = 12;
const MAX_FONT_SIZE = 48;
const MIN_RADIUS = 2;
const MIN_LINE_HEIGHT = 1.2;
const MIN_BORDER = 1;
const MIN_TAP_TARGET = 44;
const MIN_ACCESSIBILITY_FONT_SIZE = 8;
const PRECISION_DEFAULT = 1;
const PRECISION_LINE_HEIGHT = 0.1;

// Breakpoint dimensions
const MOBILE_WIDTH = 390;
const MOBILE_HEIGHT = 844;
const TABLET_WIDTH = 768;
const TABLET_HEIGHT = 1024;
const LAPTOP_WIDTH = 1366;
const LAPTOP_HEIGHT = 768;
const DESKTOP_WIDTH = 1920;
const DESKTOP_HEIGHT = 1080;

// Scaling factors
const FONT_SIZE_SCALE = 0.85;
const SPACING_SCALE = 0.9;
const RADIUS_SCALE = 0.95;
const LINE_HEIGHT_SCALE = 0.9;
const SHADOW_SCALE = 0.8;
const BORDER_SCALE = 0.9;

/**
 * Default configuration for React Responsive Easy
 * Provides sensible defaults that work for most applications
 */
/**
 * Create default breakpoints configuration
 */
function createDefaultBreakpoints(): Breakpoint[] {
  return [
    {
      name: 'mobile',
      width: MOBILE_WIDTH,
      height: MOBILE_HEIGHT,
      alias: 'mobile'
    },
    {
      name: 'tablet',
      width: TABLET_WIDTH,
      height: TABLET_HEIGHT,
      alias: 'tablet'
    },
    {
      name: 'laptop',
      width: LAPTOP_WIDTH,
      height: LAPTOP_HEIGHT,
      alias: 'laptop'
    },
    {
      name: 'desktop',
      width: DESKTOP_WIDTH,
      height: DESKTOP_HEIGHT,
      alias: 'base'
    }
  ];
}

/**
 * Create default scaling tokens configuration
 */
function createDefaultTokens() {
  return {
    fontSize: {
      scale: FONT_SIZE_SCALE,
      min: MIN_FONT_SIZE,
      max: MAX_FONT_SIZE,
      unit: 'px',
      precision: PRECISION_DEFAULT,
      responsive: true
    },
    spacing: {
      scale: SPACING_SCALE,
      step: 2,
      unit: 'px',
      precision: PRECISION_DEFAULT,
      responsive: true
    },
    radius: {
      scale: RADIUS_SCALE,
      min: MIN_RADIUS,
      unit: 'px',
      precision: PRECISION_DEFAULT,
      responsive: true
    },
    lineHeight: {
      scale: LINE_HEIGHT_SCALE,
      min: MIN_LINE_HEIGHT,
      unit: 'em',
      precision: PRECISION_LINE_HEIGHT,
      responsive: true
    },
    shadow: {
      scale: SHADOW_SCALE,
      unit: 'px',
      precision: PRECISION_DEFAULT,
      responsive: true
    },
    border: {
      scale: BORDER_SCALE,
      min: MIN_BORDER,
      unit: 'px',
      precision: PRECISION_DEFAULT,
      responsive: true
    }
  };
}

/**
 * Create default scaling strategy configuration
 */
function createDefaultStrategy(): ScalingStrategy {
  return {
    origin: 'width',
    mode: 'linear',
    tokens: createDefaultTokens(),
    rounding: {
      mode: 'nearest',
      precision: PRECISION_DEFAULT
    },
    accessibility: {
      minFontSize: MIN_FONT_SIZE,
      minTapTarget: MIN_TAP_TARGET,
      contrastPreservation: true
    },
    performance: {
      memoization: true,
      cacheStrategy: 'memory',
      precomputeValues: true
    }
  };
}

export function createDefaultConfig(): ResponsiveConfig {
  return {
    base: {
      name: 'desktop',
      width: DESKTOP_WIDTH,
      height: DESKTOP_HEIGHT,
      alias: 'base'
    },
    breakpoints: createDefaultBreakpoints(),
    strategy: createDefaultStrategy(),
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
  const defaultStrategy: ScalingStrategy = createDefaultStrategy();

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
  if (config.strategy.accessibility.minFontSize < MIN_ACCESSIBILITY_FONT_SIZE) {
    issues.push(`Minimum font size should be at least ${MIN_ACCESSIBILITY_FONT_SIZE}px for accessibility`);
  }

  if (config.strategy.accessibility.minTapTarget < MIN_TAP_TARGET) {
    issues.push(`Minimum tap target should be at least ${MIN_TAP_TARGET}px for accessibility`);
  }

  return issues;
}
