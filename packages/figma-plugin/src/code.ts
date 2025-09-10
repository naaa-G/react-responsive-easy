/**
 * Figma Plugin Main Code for React Responsive Easy
 * 
 * This file runs in the main thread and has access to the Figma API.
 * It handles design token extraction, responsive preview generation,
 * and communication with the UI thread.
 */

// Show the plugin UI
figma.showUI(__html__, {
  width: 400,
  height: 600,
  title: 'React Responsive Easy'
});

// Plugin state
let currentSelection: readonly SceneNode[] = [];
let extractedTokens: DesignTokens = {
  colors: {},
  typography: {},
  spacing: {},
  shadows: {},
  borders: {},
  breakpoints: {}
};
let responsiveConfig: ResponsiveConfig | null = null;

// Message handler for UI communication
figma.ui.onmessage = (msg: PluginMessage) => {
  console.log('Plugin received message:', msg.type);

  const handleMessage = async (): Promise<void> => {
    try {
      switch (msg.type) {
        case 'extract-tokens':
          await handleExtractTokens();
          break;

        case 'generate-responsive-config':
          await handleGenerateResponsiveConfig(msg.data);
          break;

        case 'preview-breakpoints':
          await handlePreviewBreakpoints(msg.data);
          break;

        case 'export-tokens':
          await handleExportTokens(msg.data);
          break;

        case 'import-config':
          await handleImportConfig(msg.data);
          break;

        case 'analyze-selection':
          await handleAnalyzeSelection();
          break;

        case 'create-responsive-component':
          await handleCreateResponsiveComponent(msg.data);
          break;

        case 'close-plugin':
          figma.closePlugin();
          break;

        default:
          console.warn('Unknown message type:', msg.type);
      }
    } catch (error) {
      console.error('Plugin error:', error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      figma.ui.postMessage({
        type: 'error',
        data: { message: errorMessage }
      });
    }
  };

  // Execute async handler without awaiting to avoid blocking
  void handleMessage();
};

// Handle selection changes
figma.on('selectionchange', () => {
  currentSelection = figma.currentPage.selection;
  figma.ui.postMessage({
    type: 'selection-changed',
    data: {
      count: currentSelection.length,
      nodes: currentSelection.map(node => ({
        id: node.id,
        name: node.name,
        type: node.type,
        width: 'width' in node ? node.width : null,
        height: 'height' in node ? node.height : null
      }))
    }
  });
});

/**
 * Extract design tokens from selected elements
 */
async function handleExtractTokens(): Promise<void> {
  const selection = figma.currentPage.selection;
  
  if (selection.length === 0) {
    figma.ui.postMessage({
      type: 'error',
      data: { message: 'Please select at least one element to extract tokens from.' }
    });
    return;
  }

  const tokens: DesignTokens = {
    colors: {},
    typography: {},
    spacing: {},
    shadows: {},
    borders: {},
    breakpoints: {}
  };

  // Extract tokens from each selected element
  for (const node of selection) {
    await extractTokensFromNode(node, tokens);
  }

  extractedTokens = tokens;

  figma.ui.postMessage({
    type: 'tokens-extracted',
    data: { tokens }
  });
}

/**
 * Extract tokens from a single node
 */
async function extractTokensFromNode(node: SceneNode, tokens: DesignTokens): Promise<void> {
  // Extract colors
  if ('fills' in node && node.fills !== figma.mixed) {
    node.fills.forEach((fill, index) => {
      if (fill.type === 'SOLID') {
        const colorName = `${node.name.toLowerCase().replace(/\s+/g, '-')}-fill-${index}`;
        tokens.colors[colorName] = {
          value: rgbToHex(fill.color),
          opacity: fill.opacity || 1,
          description: `Color extracted from ${node.name}`
        };
      }
    });
  }

  // Extract typography
  if (node.type === 'TEXT') {
    const textNode = node;
    const fontName = textNode.fontName !== figma.mixed ? textNode.fontName : { family: 'Unknown', style: 'Regular' };
    const fontSize = textNode.fontSize !== figma.mixed ? textNode.fontSize : 16;
    const lineHeight = textNode.lineHeight !== figma.mixed ? textNode.lineHeight : { value: 1.2, unit: 'PERCENT' };
    const letterSpacing = textNode.letterSpacing !== figma.mixed ? textNode.letterSpacing : { value: 0, unit: 'PERCENT' };

    const typographyName = `${node.name.toLowerCase().replace(/\s+/g, '-')}-text`;
    tokens.typography[typographyName] = {
      fontFamily: fontName.family,
      fontWeight: getFontWeight(fontName.style),
      fontSize: `${fontSize}px`,
      lineHeight: lineHeight.unit === 'PERCENT' && 'value' in lineHeight ? `${lineHeight.value}%` : '120%',
      letterSpacing: letterSpacing.unit === 'PERCENT' && 'value' in letterSpacing ? `${letterSpacing.value}%` : '0%',
      description: `Typography extracted from ${node.name}`
    };
  }

  // Extract spacing (from auto-layout)
  if ('paddingTop' in node && node.layoutMode !== 'NONE') {
    const spacingName = `${node.name.toLowerCase().replace(/\s+/g, '-')}-spacing`;
    tokens.spacing[spacingName] = {
      top: `${node.paddingTop}px`,
      right: `${node.paddingRight}px`,
      bottom: `${node.paddingBottom}px`,
      left: `${node.paddingLeft}px`,
      gap: `${node.itemSpacing}px`,
      description: `Spacing extracted from ${node.name}`
    };
  }

  // Extract shadows
  if ('effects' in node && node.effects.length > 0) {
    node.effects.forEach((effect, index) => {
      if (effect.type === 'DROP_SHADOW') {
        const shadowName = `${node.name.toLowerCase().replace(/\s+/g, '-')}-shadow-${index}`;
        tokens.shadows[shadowName] = {
          x: `${effect.offset.x}px`,
          y: `${effect.offset.y}px`,
          blur: `${effect.radius}px`,
          spread: `${effect.spread || 0}px`,
          color: rgbToHex(effect.color),
          opacity: effect.color.a || 1,
          description: `Shadow extracted from ${node.name}`
        };
      }
    });
  }

  // Extract borders
  if ('strokes' in node && node.strokes.length > 0) {
    node.strokes.forEach((stroke, index) => {
      if (stroke.type === 'SOLID') {
        const borderName = `${node.name.toLowerCase().replace(/\s+/g, '-')}-border-${index}`;
        tokens.borders[borderName] = {
          width: `${String(node.strokeWeight)}px`,
          style: 'solid',
          color: rgbToHex(stroke.color),
          opacity: stroke.opacity || 1,
          description: `Border extracted from ${node.name}`
        };
      }
    });
  }

  // Recursively extract from children
  if ('children' in node) {
    for (const child of node.children) {
      await extractTokensFromNode(child, tokens);
    }
  }
}

/**
 * Generate responsive configuration based on extracted tokens
 */
function handleGenerateResponsiveConfig(data: any): void {
  const { baseBreakpoint, targetBreakpoints } = data;
  
  if (!extractedTokens || Object.keys(extractedTokens).length === 0) {
    figma.ui.postMessage({
      type: 'error',
      data: { message: 'Please extract design tokens first.' }
    });
    return;
  }

  // Generate responsive configuration
  const config: ResponsiveConfig = {
    base: {
      name: baseBreakpoint.name,
      width: baseBreakpoint.width,
      height: baseBreakpoint.height,
      alias: baseBreakpoint.alias
    },
    breakpoints: targetBreakpoints.map((bp: any) => ({
      name: bp.name,
      width: bp.width,
      height: bp.height,
      alias: bp.alias
    })),
    strategy: {
      origin: 'top-left',
      mode: 'scale',
      tokens: generateScalingTokens(extractedTokens),
      rounding: 'round',
      lineHeight: 'scale',
      shadow: 'scale',
      border: 'scale',
      accessibility: {
        respectMotionPreference: true,
        maintainFocusVisibility: true,
        preserveSemanticStructure: true
      },
      performance: {
        enableCaching: true,
        batchUpdates: true,
        lazyCalculation: true
      }
    }
  };

  responsiveConfig = config;

  figma.ui.postMessage({
    type: 'config-generated',
    data: { config }
  });
}

/**
 * Generate scaling tokens from design tokens
 */
function generateScalingTokens(tokens: DesignTokens): any {
  const scalingTokens: any = {};

  // Generate scaling rules for typography
  Object.keys(tokens.typography).forEach(key => {
    const typography = tokens.typography[key];
    scalingTokens[`typography.${key}.fontSize`] = {
      scale: true,
      min: parseFloat(typography.fontSize) * 0.75,
      max: parseFloat(typography.fontSize) * 1.25
    };
  });

  // Generate scaling rules for spacing
  Object.keys(tokens.spacing).forEach(key => {
    const spacing = tokens.spacing[key];
    ['top', 'right', 'bottom', 'left', 'gap'].forEach(prop => {
      const value = spacing[prop as keyof typeof spacing];
      if (value) {
        scalingTokens[`spacing.${key}.${prop}`] = {
          scale: true,
          min: parseFloat(value) * 0.5,
          max: parseFloat(value) * 1.5
        };
      }
    });
  });

  // Generate scaling rules for shadows
  Object.keys(tokens.shadows).forEach(key => {
    const shadow = tokens.shadows[key];
    ['x', 'y', 'blur', 'spread'].forEach(prop => {
      const value = shadow[prop as keyof typeof shadow];
      if (value) {
        scalingTokens[`shadow.${key}.${prop}`] = {
          scale: true,
          min: parseFloat(String(value)) * 0.5,
          max: parseFloat(String(value)) * 2
        };
      }
    });
  });

  return scalingTokens;
}

/**
 * Preview breakpoints by creating frames
 */
function handlePreviewBreakpoints(data: any): void {
  const { breakpoints } = data;
  
  if (figma.currentPage.selection.length === 0) {
    figma.ui.postMessage({
      type: 'error',
      data: { message: 'Please select elements to preview.' }
    });
    return;
  }

  const selection = figma.currentPage.selection[0];
  const originalX = selection.x;
  let currentX = originalX + selection.width + 100;

  // Create preview frames for each breakpoint
  for (const breakpoint of breakpoints) {
    const frame = figma.createFrame();
    frame.name = `${breakpoint.name} Preview`;
    frame.x = currentX;
    frame.y = selection.y;
    frame.resize(breakpoint.width, breakpoint.height);
    
    // Set frame background
    frame.fills = [{
      type: 'SOLID',
      color: { r: 0.95, g: 0.95, b: 0.95 }
    }];

    // Clone and scale the selected element
    const clone = selection.clone();
    frame.appendChild(clone);
    
    // Calculate scale factor
    const scale = Math.min(
      breakpoint.width / selection.width,
      breakpoint.height / selection.height
    ) * 0.8; // Leave some padding

    // Apply scaling - only if the clone supports resize
    if ('resize' in clone) {
      (clone as { resize: (w: number, h: number) => void }).resize(
        selection.width * scale,
        selection.height * scale
      );
    }
    
    // Center the clone in the frame
    clone.x = (breakpoint.width - clone.width) / 2;
    clone.y = (breakpoint.height - clone.height) / 2;

    // Add breakpoint label
    const label = figma.createText();
    label.characters = `${breakpoint.name}\n${breakpoint.width}×${breakpoint.height}`;
    label.fontSize = 12;
    label.x = 10;
    label.y = 10;
    frame.appendChild(label);

    currentX += breakpoint.width + 50;
  }

  figma.ui.postMessage({
    type: 'preview-created',
    data: { message: 'Breakpoint previews created successfully!' }
  });
}

/**
 * Export tokens in various formats
 */
function handleExportTokens(data: any): void {
  const { format } = data;
  
  if (!extractedTokens || Object.keys(extractedTokens).length === 0) {
    figma.ui.postMessage({
      type: 'error',
      data: { message: 'No tokens to export. Please extract tokens first.' }
    });
    return;
  }

  let exportData: string;

  switch (format) {
    case 'json':
      exportData = JSON.stringify(extractedTokens, null, 2);
      break;

    case 'css':
      exportData = generateCSSTokens(extractedTokens);
      break;

    case 'scss':
      exportData = generateSCSSTokens(extractedTokens);
      break;

    case 'js':
      exportData = generateJSTokens(extractedTokens);
      break;

    case 'rre-config':
      exportData = JSON.stringify(responsiveConfig, null, 2);
      break;

    default:
      throw new Error(`Unsupported export format: ${format}`);
  }

  figma.ui.postMessage({
    type: 'tokens-exported',
    data: { 
      format,
      content: exportData,
      filename: `rre-design-tokens.${format === 'rre-config' ? 'json' : format}`
    }
  });
}

/**
 * Import responsive configuration
 */
function handleImportConfig(data: any): void {
  const { config } = data;
  
  try {
    responsiveConfig = JSON.parse(config);
    
    figma.ui.postMessage({
      type: 'config-imported',
      data: { 
        message: 'Configuration imported successfully!',
        config: responsiveConfig
      }
    });
  } catch (_error) {
    figma.ui.postMessage({
      type: 'error',
      data: { message: 'Invalid configuration format.' }
    });
  }
}

/**
 * Analyze selected elements for responsive potential
 */
function handleAnalyzeSelection(): void {
  const selection = figma.currentPage.selection;
  
  if (selection.length === 0) {
    figma.ui.postMessage({
      type: 'error',
      data: { message: 'Please select elements to analyze.' }
    });
    return;
  }

  const analysis = {
    totalElements: selection.length,
    responsiveCandidates: 0,
    recommendations: [] as string[],
    complexity: 'low' as 'low' | 'medium' | 'high'
  };

  for (const node of selection) {
    const nodeAnalysis = analyzeNode(node);
    analysis.responsiveCandidates += nodeAnalysis.isResponsiveCandidate ? 1 : 0;
    analysis.recommendations.push(...nodeAnalysis.recommendations);
  }

  // Determine complexity
  if (analysis.responsiveCandidates > 10) {
    analysis.complexity = 'high';
  } else if (analysis.responsiveCandidates > 5) {
    analysis.complexity = 'medium';
  }

  figma.ui.postMessage({
    type: 'analysis-complete',
    data: { analysis }
  });
}

/**
 * Analyze a single node for responsive potential
 */
function analyzeNode(node: SceneNode): { isResponsiveCandidate: boolean; recommendations: string[] } {
  const recommendations: string[] = [];
  let isResponsiveCandidate = false;

  // Check if node has text that might need scaling
  if (node.type === 'TEXT') {
    isResponsiveCandidate = true;
    recommendations.push(`Text element "${node.name}" should use responsive font sizes`);
  }

  // Check if node has fixed dimensions that might need scaling
  if ('width' in node && 'height' in node) {
    if (node.width > 200 || node.height > 200) {
      isResponsiveCandidate = true;
      recommendations.push(`Large element "${node.name}" should consider responsive dimensions`);
    }
  }

  // Check if node has padding/spacing
  if ('paddingTop' in node && node.layoutMode !== 'NONE') {
    isResponsiveCandidate = true;
    recommendations.push(`Auto-layout element "${node.name}" should use responsive spacing`);
  }

  // Check for complex effects
  if ('effects' in node && node.effects.length > 0) {
    isResponsiveCandidate = true;
    recommendations.push(`Element "${node.name}" with effects should consider responsive scaling`);
  }

  return { isResponsiveCandidate, recommendations };
}

/**
 * Create responsive component template
 */
function handleCreateResponsiveComponent(data: any): void {
  const { componentName, breakpoints } = data;
  
  // Create main component frame
  const componentFrame = figma.createComponent();
  componentFrame.name = componentName;
  componentFrame.resize(375, 200); // Default mobile size

  // Add responsive variants for each breakpoint
  for (let i = 0; i < breakpoints.length; i++) {
    const breakpoint = breakpoints[i];
    const variant = componentFrame.createInstance();
    variant.name = `${componentName}/${breakpoint.name}`;
    variant.x = i * 400;
    variant.resize(breakpoint.width * 0.3, breakpoint.height * 0.3); // Scaled down for overview
  }

  figma.ui.postMessage({
    type: 'component-created',
    data: { message: `Responsive component "${componentName}" created successfully!` }
  });
}

// Utility functions
function rgbToHex(color: RGB): string {
  const toHex = (c: number) => {
    const hex = Math.round(c * 255).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  
  return `#${toHex(color.r)}${toHex(color.g)}${toHex(color.b)}`;
}

function getFontWeight(style: string): string {
  const weightMap: Record<string, string> = {
    'Thin': '100',
    'Extra Light': '200',
    'Light': '300',
    'Regular': '400',
    'Medium': '500',
    'Semi Bold': '600',
    'Bold': '700',
    'Extra Bold': '800',
    'Black': '900'
  };
  
  return weightMap[style] || '400';
}

function generateCSSTokens(tokens: DesignTokens): string {
  let css = ':root {\n';
  
  // Colors
  Object.entries(tokens.colors).forEach(([key, value]) => {
    css += `  --color-${key}: ${value.value};\n`;
    if (value.opacity !== 1) {
      css += `  --color-${key}-opacity: ${value.opacity};\n`;
    }
  });
  
  // Typography
  Object.entries(tokens.typography).forEach(([key, value]) => {
    css += `  --font-${key}-family: ${value.fontFamily};\n`;
    css += `  --font-${key}-size: ${value.fontSize};\n`;
    css += `  --font-${key}-weight: ${value.fontWeight};\n`;
    css += `  --font-${key}-line-height: ${value.lineHeight};\n`;
  });
  
  css += '}\n';
  return css;
}

function generateSCSSTokens(tokens: DesignTokens): string {
  let scss = '// React Responsive Easy Design Tokens\n\n';
  
  // Colors
  scss += '// Colors\n';
  Object.entries(tokens.colors).forEach(([key, value]) => {
    scss += `$color-${key}: ${value.value};\n`;
  });
  
  scss += '\n// Typography\n';
  Object.entries(tokens.typography).forEach(([key, value]) => {
    scss += `$font-${key}: (\n`;
    scss += `  family: ${value.fontFamily},\n`;
    scss += `  size: ${value.fontSize},\n`;
    scss += `  weight: ${value.fontWeight},\n`;
    scss += `  line-height: ${value.lineHeight}\n`;
    scss += `);\n\n`;
  });
  
  return scss;
}

function generateJSTokens(tokens: DesignTokens): string {
  return `// React Responsive Easy Design Tokens
export const designTokens = ${JSON.stringify(tokens, null, 2)};

export default designTokens;
`;
}

// Type definitions
interface PluginMessage {
  type: string;
  data?: any;
}

interface DesignTokens {
  colors: Record<string, {
    value: string;
    opacity: number;
    description: string;
  }>;
  typography: Record<string, {
    fontFamily: string;
    fontWeight: string;
    fontSize: string;
    lineHeight: string;
    letterSpacing: string;
    description: string;
  }>;
  spacing: Record<string, {
    top: string;
    right: string;
    bottom: string;
    left: string;
    gap: string;
    description: string;
  }>;
  shadows: Record<string, {
    x: string;
    y: string;
    blur: string;
    spread: string;
    color: string;
    opacity: number;
    description: string;
  }>;
  borders: Record<string, {
    width: string;
    style: string;
    color: string;
    opacity: number;
    description: string;
  }>;
  breakpoints: Record<string, {
    width: number;
    height: number;
    description: string;
  }>;
}

interface ResponsiveConfig {
  base: {
    name: string;
    width: number;
    height: number;
    alias: string;
  };
  breakpoints: Array<{
    name: string;
    width: number;
    height: number;
    alias: string;
  }>;
  strategy: any;
}
