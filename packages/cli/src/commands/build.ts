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

export const buildCommand = new Command('build')
  .description('Build and transform your React Responsive Easy code')
  .option('-c, --config <path>', 'Path to configuration file', 'rre.config.ts')
  .option('-i, --input <pattern>', 'Input file pattern', 'src/**/*.{ts,tsx,js,jsx}')
  .option('-o, --output <path>', 'Output directory', 'dist')
  .option('-w, --watch', 'Watch mode for development')
  .option('--clean', 'Clean output directory before building')
  .option('--verbose', 'Verbose output')
  .action(async (options) => {
    const spinner = ora('Building React Responsive Easy project...').start();
    
    try {
      // Validate configuration
      spinner.text = 'Validating configuration...';
      const configPath = path.resolve(options.config);
      
      if (!fs.existsSync(configPath)) {
        spinner.fail(`Configuration file not found: ${configPath}`);
        console.log(chalk.yellow('\n💡 Run "rre init" to create a configuration file'));
        process.exit(1);
      }
      
      // Load and validate config
      const config = await loadConfig(configPath);
      const validationResult = validateConfig(config);
      
      if (!validationResult.valid) {
        spinner.fail('Configuration validation failed');
        console.error(chalk.red('\n❌ Configuration errors:'));
        validationResult.errors.forEach(error => {
          console.error(chalk.red(`  • ${error}`));
        });
        process.exit(1);
      }
      
      spinner.succeed('Configuration validated successfully');
      
      // Clean output directory if requested
      if (options.clean) {
        spinner.text = 'Cleaning output directory...';
        const outputDir = path.resolve(options.output);
        if (fs.existsSync(outputDir)) {
          await fs.remove(outputDir);
        }
        await fs.ensureDir(outputDir);
        spinner.succeed('Output directory cleaned');
      }
      
      // Find input files
      spinner.text = 'Scanning input files...';
      const inputPattern = options.input;
      const inputFiles = glob.sync(inputPattern, { 
        ignore: ['node_modules/**', 'dist/**', 'build/**'],
        absolute: true 
      });
      
      if (inputFiles.length === 0) {
        spinner.warn('No input files found');
        console.log(chalk.yellow(`\n💡 Pattern: ${inputPattern}`));
        console.log(chalk.yellow('💡 Make sure you have source files in your project'));
        return;
      }
      
      spinner.succeed(`Found ${inputFiles.length} input files`);
      
      // Process files
      spinner.text = 'Processing files...';
      const results = await processFiles(inputFiles, config, options);
      
      // Generate build report
      const report = generateBuildReport(results, config);
      
      // Save build report
      const outputDir = path.resolve(options.output);
      await fs.ensureDir(outputDir);
      const reportPath = path.join(outputDir, 'rre-build-report.json');
      await fs.writeJson(reportPath, report, { spaces: 2 });
      
      // Show results
      spinner.succeed('Build completed successfully!');
      
      console.log(chalk.green('\n🎉 Build Results:'));
      console.log(chalk.cyan('  • ') + `Files processed: ${results.totalFiles}`);
      console.log(chalk.cyan('  • ') + `Responsive values found: ${results.responsiveValues}`);
      console.log(chalk.cyan('  • ') + `Breakpoints configured: ${config.breakpoints.length}`);
      console.log(chalk.cyan('  • ') + `Build report: ${reportPath}`);
      
      if (results.warnings.length > 0) {
        console.log(chalk.yellow('\n⚠️  Warnings:'));
        results.warnings.forEach((warning: string) => {
          console.log(chalk.yellow(`  • ${warning}`));
        });
      }
      
      if (options.verbose) {
        console.log(chalk.gray('\n📊 Detailed Results:'));
        console.log(JSON.stringify(results, null, 2));
      }
      
    } catch (error) {
      spinner.fail('Build failed');
      console.error(chalk.red('\n❌ Error:'), error);
      process.exit(1);
    }
  });

async function loadConfig(configPath: string): Promise<any> {
  try {
    const configContent = await fs.readFile(configPath, 'utf-8');
    
    // Extract the config object from the file
    const configMatch = configContent.match(/defineConfig\(([\s\S]*?)\)/);
    if (!configMatch) {
      throw new Error('Could not parse configuration file');
    }
    
    // This is a simplified approach - in production you'd want proper TypeScript compilation
    const configString = configMatch[1];
    return JSON.parse(configString!);
  } catch (error) {
    throw new Error(`Failed to load configuration: ${error}`);
  }
}

async function processFiles(
  files: string[], 
  config: any, 
  options: any
): Promise<any> {
  const results = {
    totalFiles: files.length,
    responsiveValues: 0,
    processedFiles: 0,
    warnings: [] as string[],
    errors: [] as string[],
    fileResults: [] as any[]
  };
  
  for (const file of files) {
    try {
      const content = await fs.readFile(file, 'utf-8');
      const fileResult = await processFile(file, content, config);
      
      results.responsiveValues += fileResult.responsiveValues;
      results.processedFiles++;
      results.fileResults.push(fileResult);
      
      if (fileResult.warnings.length > 0) {
        results.warnings.push(...fileResult.warnings.map((w: string) => `${file}: ${w}`));
      }
      
    } catch (error) {
      results.errors.push(`${file}: ${error}`);
    }
  }
  
  return results;
}

async function processFile(
  filePath: string, 
  content: string, 
  config: any
): Promise<any> {
  const result = {
    file: filePath,
    responsiveValues: 0,
    warnings: [] as string[],
    transformations: [] as any[]
  };
  
  // Look for responsive hook usage
  const hookPatterns = [
    /useResponsiveValue\s*\(\s*(\d+)/g,
    /useScaledStyle\s*\(\s*\{/g,
    /useBreakpointMatch\s*\(\s*['"`]([^'"`]+)['"`]/g
  ];
  
  for (const pattern of hookPatterns) {
    const matches = content.matchAll(pattern);
    for (const match of matches) {
      result.responsiveValues++;
      
      // Analyze the usage
      const transformation = analyzeResponsiveUsage(match, config);
      if (transformation) {
        result.transformations.push(transformation);
      }
    }
  }
  
  // Check for potential issues
  if (content.includes('useResponsiveValue') && !content.includes('ResponsiveProvider')) {
    result.warnings.push('useResponsiveValue used without ResponsiveProvider wrapper');
  }
  
  return result;
}

function analyzeResponsiveUsage(match: RegExpMatchArray, config: any): any {
  // This would contain logic to analyze how the responsive value is used
  // and suggest optimizations
  return {
    type: 'responsive_value',
    value: match[1],
    suggestions: []
  };
}

function generateBuildReport(results: any, config: any): any {
  return {
    timestamp: new Date().toISOString(),
    config: {
      base: config.base,
      breakpoints: config.breakpoints.length,
      strategy: config.strategy.origin
    },
    build: {
      totalFiles: results.totalFiles,
      processedFiles: results.processedFiles,
      responsiveValues: results.responsiveValues,
      warnings: results.warnings.length,
      errors: results.errors.length
    },
    performance: {
      estimatedBundleSize: estimateBundleSize(results, config),
      scalingComplexity: calculateScalingComplexity(config)
    },
    recommendations: generateRecommendations(results, config)
  };
}

function estimateBundleSize(results: any, config: any): string {
  // Simple estimation based on responsive values and breakpoints
  const baseSize = 50; // KB base size
  const responsiveOverhead = results.responsiveValues * 0.5; // KB per responsive value
  const breakpointOverhead = config.breakpoints.length * 0.2; // KB per breakpoint
  
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

function generateRecommendations(results: any, config: any): string[] {
  const recommendations = [];
  
  if (results.responsiveValues === 0) {
    recommendations.push('No responsive values found. Consider using useResponsiveValue for dynamic scaling.');
  }
  
  if (config.breakpoints.length > 6) {
    recommendations.push('Consider reducing breakpoints to 4-6 for optimal performance.');
  }
  
  const hasUnusedBreakpoints = config.breakpoints.some((bp: any) => 
    bp.width < 320 || bp.width > 2560
  );
  if (hasUnusedBreakpoints) {
    recommendations.push('Remove breakpoints outside common device ranges (320px - 2560px)');
  }
  
  return recommendations;
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
