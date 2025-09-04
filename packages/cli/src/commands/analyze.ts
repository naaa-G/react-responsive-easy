import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import fs from 'fs-extra';
import path from 'path';
import { glob } from 'glob';
// Mock validation function for now
const validateConfig = (config: any) => {
  const errors: string[] = [];
  
  if (!config.base) {
    errors.push('Missing base breakpoint configuration');
  }
  
  if (!config.breakpoints || !Array.isArray(config.breakpoints)) {
    errors.push('Missing or invalid breakpoints configuration');
  }
  
  if (!config.strategy) {
    errors.push('Missing scaling strategy configuration');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
};

export const analyzeCommand = new Command('analyze')
  .description('Analyze your React Responsive Easy setup and provide insights')
  .option('-c, --config <path>', 'Path to configuration file', 'rre.config.ts')
  .option('-i, --input <pattern>', 'Input file pattern', 'src/**/*.{ts,tsx,js,jsx}')
  .option('--detailed', 'Show detailed analysis for each file')
  .option('--performance', 'Include performance analysis')
  .option('--accessibility', 'Include accessibility checks')
  .option('--export <path>', 'Export analysis report to file')
  .action(async (options) => {
    const spinner = ora('Analyzing React Responsive Easy setup...').start();
    
    try {
      // Load configuration
      spinner.text = 'Loading configuration...';
      const configPath = path.resolve(options.config);
      
      if (!fs.existsSync(configPath)) {
        spinner.fail(`Configuration file not found: ${configPath}`);
        console.log(chalk.yellow('\n💡 Run "rre init" to create a configuration file'));
        process.exit(1);
      }
      
      const config = await loadConfig(configPath);
      
      // Validate configuration
      spinner.text = 'Validating configuration...';
      const validationResult = validateConfig(config);
      
      if (!validationResult.valid) {
        spinner.fail('Configuration validation failed');
        console.error(chalk.red('\n❌ Configuration errors:'));
        validationResult.errors.forEach(error => {
          console.error(chalk.red(`  • ${error}`));
        });
        process.exit(1);
      }
      
      spinner.succeed('Configuration loaded and validated');
      
      // Analyze configuration
      const configAnalysis = analyzeConfiguration(config);
      
      // Find and analyze source files
      spinner.text = 'Analyzing source files...';
      const inputPattern = options.input;
      const inputFiles = glob.sync(inputPattern, { 
        ignore: ['node_modules/**', 'dist/**', 'build/**'],
        absolute: true 
      });
      
      if (inputFiles.length === 0) {
        spinner.warn('No source files found for analysis');
      } else {
        spinner.succeed(`Found ${inputFiles.length} source files`);
      }
      
      // Analyze files
      const fileAnalysis = await analyzeFiles(inputFiles, config, options);
      
      // Generate comprehensive analysis
      const analysis = generateAnalysis(configAnalysis, fileAnalysis, config, options);
      
      // Display results
      displayAnalysis(analysis, options);
      
      // Export if requested
      if (options.export) {
        await exportAnalysis(analysis, options.export);
        console.log(chalk.green(`\n📊 Analysis exported to: ${options.export}`));
      }
      
      // Show summary
      showSummary(analysis);
      
    } catch (error) {
      spinner.fail('Analysis failed');
      console.error(chalk.red('\n❌ Error:'), error);
      process.exit(1);
    }
  });

async function loadConfig(configPath: string): Promise<any> {
  try {
    const configContent = await fs.readFile(configPath, 'utf-8');
    const configMatch = configContent.match(/defineConfig\(([\s\S]*?)\)/);
    if (!configMatch) {
      throw new Error('Could not parse configuration file');
    }
    const configString = configMatch[1];
    return JSON.parse(configString!);
  } catch (error) {
    throw new Error(`Failed to load configuration: ${error}`);
  }
}

function analyzeConfiguration(config: any): any {
  const analysis = {
    breakpoints: {
      count: config.breakpoints.length,
      coverage: analyzeBreakpointCoverage(config.breakpoints),
      distribution: analyzeBreakpointDistribution(config.breakpoints)
    },
    strategy: {
      origin: config.strategy.origin,
      complexity: calculateStrategyComplexity(config.strategy),
      tokens: analyzeTokens(config.strategy.tokens)
    },
    performance: {
      estimatedOverhead: estimateConfigurationOverhead(config),
      optimizationOpportunities: findOptimizationOpportunities(config)
    }
  };
  
  return analysis;
}

function analyzeBreakpointCoverage(breakpoints: any[]): any {
  const widths = breakpoints.map(bp => bp.width).sort((a, b) => a - b);
  const heights = breakpoints.map(bp => bp.height).sort((a, b) => a - b);
  
  const widthRange = { min: widths[0], max: widths[widths.length - 1] };
  const heightRange = { min: heights[0], max: heights[heights.length - 1] };
  
  // Check for common device sizes
  const commonDevices = {
    mobile: breakpoints.some(bp => bp.width <= 480),
    tablet: breakpoints.some(bp => bp.width > 480 && bp.width <= 1024),
    desktop: breakpoints.some(bp => bp.width > 1024)
  };
  
  return {
    widthRange,
    heightRange,
    commonDevices,
    gaps: findBreakpointGaps(widths)
  };
}

function findBreakpointGaps(widths: number[]): any[] {
  const gaps = [];
  for (let i = 1; i < widths.length; i++) {
    const gap = widths[i]! - widths[i - 1]!;
    if (gap > 200) { // Large gap threshold
      gaps.push({
        from: widths[i - 1],
        to: widths[i],
        size: gap
      });
    }
  }
  return gaps;
}

function analyzeBreakpointDistribution(breakpoints: any[]): any {
  const sorted = breakpoints.sort((a, b) => a.width - b.width);
  const ratios = [];
  
  for (let i = 1; i < sorted.length; i++) {
    const ratio = sorted[i].width / sorted[i - 1].width;
    ratios.push(ratio);
  }
  
  const avgRatio = ratios.reduce((sum, r) => sum + r, 0) / ratios.length;
  
  return {
    ratios,
    averageRatio: avgRatio,
    consistency: avgRatio < 1.5 ? 'Good' : avgRatio < 2.0 ? 'Fair' : 'Poor'
  };
}

function calculateStrategyComplexity(strategy: any): string {
  const tokenCount = Object.keys(strategy.tokens || {}).length;
  const hasCustomRounding = strategy.rounding && strategy.rounding.mode !== 'nearest';
  const hasCustomCurves = Object.values(strategy.tokens || {}).some((token: any) => 
    token.curve && token.curve !== 'linear'
  );
  
  let complexity = 0;
  if (tokenCount > 3) complexity += 2;
  if (hasCustomRounding) complexity += 1;
  if (hasCustomCurves) complexity += 1;
  
  if (complexity <= 1) return 'Low';
  if (complexity <= 3) return 'Medium';
  return 'High';
}

function analyzeTokens(tokens: any): any {
  if (!tokens) return { count: 0, types: [] };
  
  const types = Object.keys(tokens);
  const analysis = types.map(type => {
    const token = tokens[type];
    return {
      type,
      hasMin: !!token.min,
      hasMax: !!token.max,
      hasStep: !!token.step,
      hasCurve: !!token.curve && token.curve !== 'linear',
      scale: token.scale || 1
    };
  });
  
  return {
    count: types.length,
    types: analysis,
    accessibility: analyzeTokenAccessibility(tokens)
  };
}

function analyzeTokenAccessibility(tokens: any): any {
  const fontSize = tokens.fontSize;
  const spacing = tokens.spacing;
  
  const issues = [];
  
  if (fontSize && fontSize.min && fontSize.min < 12) {
    issues.push('Font size minimum below 12px may affect readability');
  }
  
  if (spacing && spacing.min && spacing.min < 4) {
    issues.push('Spacing minimum below 4px may affect touch targets');
  }
  
  return {
    issues,
    score: issues.length === 0 ? 'Good' : issues.length <= 2 ? 'Fair' : 'Poor'
  };
}

function estimateConfigurationOverhead(config: any): string {
  const breakpointCount = config.breakpoints.length;
  const tokenCount = Object.keys(config.strategy.tokens || {}).length;
  
  // Rough estimation of runtime overhead
  const baseOverhead = 5; // KB
  const breakpointOverhead = breakpointCount * 0.3; // KB per breakpoint
  const tokenOverhead = tokenCount * 0.2; // KB per token
  
  const totalKB = baseOverhead + breakpointOverhead + tokenOverhead;
  return `${totalKB.toFixed(1)} KB`;
}

function findOptimizationOpportunities(config: any): string[] {
  const opportunities = [];
  
  if (config.breakpoints.length > 6) {
    opportunities.push('Consider reducing breakpoints to 4-6 for optimal performance');
  }
  
  if (Object.keys(config.strategy.tokens || {}).length > 5) {
    opportunities.push('Consider consolidating similar token types');
  }
  
  const hasUnusedBreakpoints = config.breakpoints.some((bp: any) => 
    bp.width < 320 || bp.width > 2560
  );
  if (hasUnusedBreakpoints) {
    opportunities.push('Remove breakpoints outside common device ranges (320px - 2560px)');
  }
  
  return opportunities;
}

async function analyzeFiles(
  files: string[], 
  config: any, 
  options: any
): Promise<any> {
  const analysis = {
    totalFiles: files.length,
    responsiveFiles: 0,
    totalResponsiveValues: 0,
    hookUsage: {
      useResponsiveValue: 0,
      useScaledStyle: 0,
      useBreakpoint: 0,
      useBreakpointMatch: 0
    },
    issues: [] as any[],
    recommendations: [] as string[],
    fileDetails: [] as any[]
  };
  
  for (const file of files) {
    try {
      const content = await fs.readFile(file, 'utf-8');
      const fileAnalysis = analyzeFile(file, content, config);
      
      if (fileAnalysis.hasResponsiveCode) {
        analysis.responsiveFiles++;
      }
      
      analysis.totalResponsiveValues += fileAnalysis.responsiveValues;
      analysis.hookUsage.useResponsiveValue += fileAnalysis.hooks.useResponsiveValue;
      analysis.hookUsage.useScaledStyle += fileAnalysis.hooks.useScaledStyle;
      analysis.hookUsage.useBreakpoint += fileAnalysis.hooks.useBreakpoint;
      analysis.hookUsage.useBreakpointMatch += fileAnalysis.hooks.useBreakpointMatch;
      
      if (fileAnalysis.issues.length > 0) {
        analysis.issues.push(...fileAnalysis.issues.map((issue: any) => ({
          ...issue,
          file
        })));
      }
      
      if (options.detailed) {
        analysis.fileDetails.push(fileAnalysis);
      }
      
    } catch (error) {
      analysis.issues.push({
        type: 'error',
        message: `Failed to analyze file: ${error}`,
        file
      });
    }
  }
  
  // Generate recommendations
  analysis.recommendations = generateFileRecommendations(analysis);
  
  return analysis;
}

function analyzeFile(file: string, content: string, config: any): any {
  const analysis = {
    file,
    hasResponsiveCode: false,
    responsiveValues: 0,
    hooks: {
      useResponsiveValue: 0,
      useScaledStyle: 0,
      useBreakpoint: 0,
      useBreakpointMatch: 0
    },
    issues: [] as any[],
    suggestions: [] as string[]
  };
  
  // Check for ResponsiveProvider usage
  const hasProvider = content.includes('ResponsiveProvider');
  
  // Count hook usage
  const hookPatterns = [
    { name: 'useResponsiveValue', pattern: /useResponsiveValue\s*\(/g },
    { name: 'useScaledStyle', pattern: /useScaledStyle\s*\(/g },
    { name: 'useBreakpoint', pattern: /useBreakpoint\s*\(/g },
    { name: 'useBreakpointMatch', pattern: /useBreakpointMatch\s*\(/g }
  ];
  
  for (const hook of hookPatterns) {
    const matches = content.match(hook.pattern);
    if (matches) {
      analysis.hooks[hook.name as keyof typeof analysis.hooks] = matches.length;
      analysis.responsiveValues += matches.length;
      analysis.hasResponsiveCode = true;
    }
  }
  
  // Check for issues
  if (analysis.hasResponsiveCode && !hasProvider) {
    analysis.issues.push({
      type: 'warning',
      message: 'Responsive hooks used without ResponsiveProvider wrapper'
    });
  }
  
  if (analysis.responsiveValues > 20) {
    analysis.suggestions.push('Consider breaking down large components with many responsive values');
  }
  
  return analysis;
}

function generateFileRecommendations(analysis: any): string[] {
  const recommendations = [];
  
  if (analysis.responsiveFiles === 0) {
    recommendations.push('No responsive code found. Consider using responsive hooks for better mobile experience.');
  }
  
  if (analysis.hookUsage.useResponsiveValue === 0) {
    recommendations.push('Consider using useResponsiveValue for dynamic font sizes and spacing.');
  }
  
  if (analysis.issues.length > 0) {
    recommendations.push('Fix identified issues to ensure proper responsive behavior.');
  }
  
  if (analysis.totalResponsiveValues > 100) {
    recommendations.push('High number of responsive values detected. Consider performance optimization.');
  }
  
  return recommendations;
}

function generateAnalysis(configAnalysis: any, fileAnalysis: any, config: any, options: any): any {
  return {
    timestamp: new Date().toISOString(),
    summary: {
      status: fileAnalysis.issues.length === 0 ? 'Healthy' : 'Needs Attention',
      score: calculateOverallScore(configAnalysis, fileAnalysis),
      priority: determinePriority(configAnalysis, fileAnalysis)
    },
    configuration: configAnalysis,
    files: fileAnalysis,
    performance: options.performance ? generatePerformanceAnalysis(config, fileAnalysis) : null,
    accessibility: options.accessibility ? generateAccessibilityAnalysis(config, fileAnalysis) : null
  };
}

function calculateOverallScore(configAnalysis: any, fileAnalysis: any): number {
  let score = 100;
  
  // Deduct points for issues
  score -= fileAnalysis.issues.length * 5;
  
  // Deduct points for configuration complexity
  if (configAnalysis.strategy.complexity === 'High') score -= 10;
  if (configAnalysis.breakpoints.count > 6) score -= 5;
  
  // Bonus for good practices
  if (fileAnalysis.responsiveFiles > 0) score += 10;
  if (configAnalysis.breakpoints.coverage.commonDevices.mobile) score += 5;
  
  return Math.max(0, Math.min(100, score));
}

function determinePriority(configAnalysis: any, fileAnalysis: any): string {
  if (fileAnalysis.issues.length > 5) return 'High';
  if (fileAnalysis.issues.length > 2) return 'Medium';
  if (configAnalysis.strategy.complexity === 'High') return 'Medium';
  return 'Low';
}

function generatePerformanceAnalysis(config: any, fileAnalysis: any): any {
  return {
    estimatedBundleSize: estimateBundleSize(fileAnalysis, config),
    scalingComplexity: calculateScalingComplexity(config),
    optimizationOpportunities: findPerformanceOptimizations(fileAnalysis, config)
  };
}

function generateAccessibilityAnalysis(config: any, fileAnalysis: any): any {
  return {
    tokenAccessibility: analyzeTokenAccessibility(config.strategy.tokens),
    breakpointCoverage: config.breakpoints.some((bp: any) => bp.width <= 480),
    recommendations: generateAccessibilityRecommendations(config, fileAnalysis)
  };
}

function estimateBundleSize(fileAnalysis: any, config: any): string {
  const baseSize = 50; // KB
  const responsiveOverhead = fileAnalysis.totalResponsiveValues * 0.3;
  const breakpointOverhead = config.breakpoints.length * 0.2;
  
  const totalKB = baseSize + responsiveOverhead + breakpointOverhead;
  return `${totalKB.toFixed(1)} KB`;
}

function calculateScalingComplexity(config: any): string {
  const breakpointCount = config.breakpoints.length;
  const tokenCount = Object.keys(config.strategy.tokens || {}).length;
  
  if (breakpointCount <= 3 && tokenCount <= 3) return 'Low';
  if (breakpointCount <= 5 && tokenCount <= 5) return 'Medium';
  return 'High';
}

function findPerformanceOptimizations(fileAnalysis: any, config: any): string[] {
  const optimizations = [];
  
  if (fileAnalysis.totalResponsiveValues > 50) {
    optimizations.push('Consider lazy loading responsive values for better initial load');
  }
  
  if (config.breakpoints.length > 6) {
    optimizations.push('Reduce breakpoints to improve runtime performance');
  }
  
  return optimizations;
}

function generateAccessibilityRecommendations(config: any, fileAnalysis: any): string[] {
  const recommendations = [];
  
  if (!config.strategy.tokens?.fontSize?.min || config.strategy.tokens.fontSize.min < 12) {
    recommendations.push('Set minimum font size to 12px for better readability');
  }
  
  if (!config.strategy.tokens?.spacing?.min || config.strategy.tokens.spacing.min < 4) {
    recommendations.push('Set minimum spacing to 4px for better touch targets');
  }
  
  return recommendations;
}

function displayAnalysis(analysis: any, options: any): void {
  console.log(chalk.blue('\n🔍 React Responsive Easy Analysis Report'));
  console.log(chalk.gray('='.repeat(60)));
  
  // Summary
  console.log(chalk.green(`\n📊 Overall Status: ${analysis.summary.status}`));
  console.log(chalk.cyan(`   Score: ${analysis.summary.score}/100`));
  console.log(chalk.cyan(`   Priority: ${analysis.summary.priority}`));
  
  // Configuration
  console.log(chalk.yellow('\n⚙️  Configuration Analysis:'));
  console.log(chalk.gray(`   Breakpoints: ${analysis.configuration.breakpoints.count}`));
  console.log(chalk.gray(`   Strategy Complexity: ${analysis.configuration.strategy.complexity}`));
  console.log(chalk.gray(`   Tokens: ${analysis.configuration.strategy.tokens.count}`));
  console.log(chalk.gray(`   Estimated Overhead: ${analysis.configuration.performance.estimatedOverhead}`));
  
  // Files
  console.log(chalk.yellow('\n📁 File Analysis:'));
  console.log(chalk.gray(`   Total Files: ${analysis.files.totalFiles}`));
  console.log(chalk.gray(`   Responsive Files: ${analysis.files.responsiveFiles}`));
  console.log(chalk.gray(`   Total Responsive Values: ${analysis.files.totalResponsiveValues}`));
  
  // Hook Usage
  console.log(chalk.yellow('\n🪝 Hook Usage:'));
  Object.entries(analysis.files.hookUsage).forEach(([hook, count]) => {
    if ((count as number) > 0) {
      console.log(chalk.gray(`   ${hook}: ${count}`));
    }
  });
  
  // Issues
  if (analysis.files.issues.length > 0) {
    console.log(chalk.red('\n⚠️  Issues Found:'));
    analysis.files.issues.forEach((issue: any) => {
      const icon = issue.type === 'error' ? '❌' : '⚠️';
      console.log(chalk.red(`   ${icon} ${issue.message}`));
      if (issue.file) {
        console.log(chalk.gray(`      File: ${issue.file}`));
      }
    });
  }
  
  // Recommendations
  if (analysis.files.recommendations.length > 0) {
    console.log(chalk.blue('\n💡 Recommendations:'));
    analysis.files.recommendations.forEach((rec: string) => {
      console.log(chalk.blue(`   • ${rec}`));
    });
  }
  
  // Performance (if requested)
  if (analysis.performance) {
    console.log(chalk.yellow('\n⚡ Performance Analysis:'));
    console.log(chalk.gray(`   Estimated Bundle Size: ${analysis.performance.estimatedBundleSize}`));
    console.log(chalk.gray(`   Scaling Complexity: ${analysis.performance.scalingComplexity}`));
    
    if (analysis.performance.optimizationOpportunities.length > 0) {
      console.log(chalk.blue('   Optimization Opportunities:'));
      analysis.performance.optimizationOpportunities.forEach((opt: string) => {
        console.log(chalk.blue(`     • ${opt}`));
      });
    }
  }
  
  // Accessibility (if requested)
  if (analysis.accessibility) {
    console.log(chalk.yellow('\n♿ Accessibility Analysis:'));
    console.log(chalk.gray(`   Token Accessibility: ${analysis.accessibility.tokenAccessibility.score}`));
    console.log(chalk.gray(`   Mobile Coverage: ${analysis.accessibility.breakpointCoverage ? 'Yes' : 'No'}`));
    
    if (analysis.accessibility.recommendations.length > 0) {
      console.log(chalk.blue('   Accessibility Recommendations:'));
      analysis.accessibility.recommendations.forEach((rec: string) => {
        console.log(chalk.blue(`     • ${rec}`));
      });
    }
  }
}

function showSummary(analysis: any): void {
  console.log(chalk.gray('\n' + '='.repeat(60)));
  
  if (analysis.summary.score >= 80) {
    console.log(chalk.green('🎉 Excellent! Your setup is well-optimized.'));
  } else if (analysis.summary.score >= 60) {
    console.log(chalk.yellow('👍 Good setup with room for improvement.'));
  } else {
    console.log(chalk.red('⚠️  Setup needs attention. Review issues and recommendations.'));
  }
  
  console.log(chalk.blue('\n💡 Run "rre build" to transform your code for production'));
  console.log(chalk.blue('💡 Run "rre dev" to start development server with live preview'));
}

async function exportAnalysis(analysis: any, exportPath: string): Promise<void> {
  await fs.writeJson(exportPath, analysis, { spaces: 2 });
}
