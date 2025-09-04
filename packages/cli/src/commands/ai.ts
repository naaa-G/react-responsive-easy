/**
 * AI Command - Enterprise AI-powered analysis and optimization
 */

import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import boxen from 'boxen';
// @ts-ignore - figlet doesn't have type declarations
import figlet from 'figlet';
// @ts-ignore - gradient-string doesn't have type declarations
import gradient from 'gradient-string';
import fs from 'fs-extra';
import path from 'path';
import { table } from 'table';
import { EnterpriseCLI } from '../core/EnterpriseCLI';
import { AIIntegrationService } from '../services/AIIntegrationService';
import { ResponsiveConfig } from '@yaseratiar/react-responsive-easy-core';

export const aiCommand = new Command('ai')
  .description('🤖 AI-powered analysis and optimization for React Responsive Easy')
  .option('-p, --project <path>', 'Project path to analyze', '.')
  .option('-a, --analyze', 'Run comprehensive AI analysis')
  .option('-o, --optimize', 'Apply AI-suggested optimizations')
  .option('-l, --learn', 'Learn from project usage patterns')
  .option('-r, --recommendations', 'Get intelligent recommendations')
  .option('--dry-run', 'Show what would be optimized without applying changes')
  .option('--confidence <threshold>', 'Minimum confidence threshold for suggestions', '0.7')
  .option('--format <format>', 'Output format (table, json, detailed)', 'table')
  .option('--export <path>', 'Export results to file')
  .action(async (options) => {
    const spinner = ora('Initializing AI-powered analysis...').start();
    
    try {
      // Show AI banner
      console.log(gradient.rainbow(figlet.textSync('RRE AI', { horizontalLayout: 'full' })));
      console.log(chalk.blue('🚀 Enterprise AI-Powered Analysis & Optimization\n'));

      // Initialize Enterprise CLI
      spinner.text = 'Initializing enterprise AI services...';
      const enterpriseCLI = new EnterpriseCLI({
        ai: {
          enabled: true,
          optimizationLevel: 'balanced',
          autoOptimize: false,
          learningEnabled: true
        },
        performance: {
          enabled: true,
          preset: 'development',
          realTimeMonitoring: false,
          alerting: false
        },
        analytics: {
          enabled: true,
          dataRetention: 30,
          anonymizeData: false,
          exportFormat: 'json'
        }
      });

      // Initialize AI Integration Service
      const aiService = new AIIntegrationService(enterpriseCLI['logger']);
      await aiService.initialize();

      spinner.succeed('AI services initialized successfully');

      // Validate project path
      const projectPath = path.resolve(options.project);
      if (!fs.existsSync(projectPath)) {
        console.error(chalk.red(`❌ Project path does not exist: ${projectPath}`));
        process.exit(1);
      }

      // Load project configuration
      spinner.start('Loading project configuration...');
      const config = await loadProjectConfig(projectPath);
      spinner.succeed('Project configuration loaded');

      // Run analysis if requested
      if (options.analyze) {
        await runAIAnalysis(aiService, projectPath, config, options);
      }

      // Get recommendations if requested
      if (options.recommendations) {
        await getAIRecommendations(aiService, projectPath, config, options);
      }

      // Apply optimizations if requested
      if (options.optimize) {
        await applyAIOptimizations(aiService, projectPath, config, options);
      }

      // Learn from project if requested
      if (options.learn) {
        await learnFromProject(aiService, projectPath, config, options);
      }

      // If no specific action requested, run comprehensive analysis
      if (!options.analyze && !options.recommendations && !options.optimize && !options.learn) {
        await runComprehensiveAnalysis(aiService, projectPath, config, options);
      }

      // Cleanup
      await aiService.cleanup();
      await enterpriseCLI.cleanup();

    } catch (error) {
      spinner.fail('AI analysis failed');
      console.error(chalk.red('\n❌ Error:'), error);
      process.exit(1);
    }
  });

async function loadProjectConfig(projectPath: string): Promise<ResponsiveConfig> {
  const configPath = path.join(projectPath, 'rre.config.ts');
  
  if (!fs.existsSync(configPath)) {
    throw new Error(`Configuration file not found: ${configPath}. Run 'rre init' first.`);
  }

  const configContent = await fs.readFile(configPath, 'utf-8');
  const configMatch = configContent.match(/defineConfig\(([\s\S]*?)\)/);
  
  if (!configMatch) {
    throw new Error('Could not parse configuration file');
  }

  return JSON.parse(configMatch[1]!);
}

async function runAIAnalysis(
  aiService: AIIntegrationService,
  projectPath: string,
  config: ResponsiveConfig,
  options: any
): Promise<void> {
  const spinner = ora('Running AI-powered analysis...').start();

  try {
    const insights = await aiService.analyzeProject(projectPath, config, {
      includePerformance: true,
      includeAccessibility: true,
      includeOptimization: true,
      learningMode: true,
      confidenceThreshold: parseFloat(options.confidence)
    });

    spinner.succeed('AI analysis completed');

    // Display results
    displayAIAnalysis(insights, options);

    // Export if requested
    if (options.export) {
      await exportResults(insights, options.export, options.format);
    }

  } catch (error) {
    spinner.fail('AI analysis failed');
    throw error;
  }
}

async function getAIRecommendations(
  aiService: AIIntegrationService,
  projectPath: string,
  config: ResponsiveConfig,
  options: any
): Promise<void> {
  const spinner = ora('Getting AI recommendations...').start();

  try {
    // Collect usage data for context
    const usageData = await collectUsageData(projectPath);
    const performanceMetrics = await collectPerformanceMetrics(projectPath);

    const recommendations = await aiService.getRecommendations('performance', {
      config,
      usageData,
      performanceMetrics
    });

    spinner.succeed('AI recommendations generated');

    // Display recommendations
    displayRecommendations(recommendations, options);

    // Export if requested
    if (options.export) {
      await exportResults(recommendations, options.export, options.format);
    }

  } catch (error) {
    spinner.fail('Failed to get AI recommendations');
    throw error;
  }
}

async function applyAIOptimizations(
  aiService: AIIntegrationService,
  projectPath: string,
  config: ResponsiveConfig,
  options: any
): Promise<void> {
  const spinner = ora('Applying AI optimizations...').start();

  try {
    // Get optimization suggestions
    const usageData = await collectUsageData(projectPath);
    const suggestions = await aiService['aiOptimizer']?.optimizeScaling(config, usageData);

    if (!suggestions) {
      throw new Error('No optimization suggestions available');
    }

    const result = await aiService.applyOptimizations(config, suggestions, {
      dryRun: options.dryRun,
      confidenceThreshold: parseFloat(options.confidence)
    });

    spinner.succeed('AI optimizations applied');

    // Display results
    displayOptimizationResults(result, options);

    // Export if requested
    if (options.export) {
      await exportResults(result, options.export, options.format);
    }

  } catch (error) {
    spinner.fail('Failed to apply AI optimizations');
    throw error;
  }
}

async function learnFromProject(
  aiService: AIIntegrationService,
  projectPath: string,
  config: ResponsiveConfig,
  options: any
): Promise<void> {
  const spinner = ora('Learning from project patterns...').start();

  try {
    const performanceData = await collectPerformanceMetrics(projectPath);
    
    await aiService.learnFromProject(projectPath, config, performanceData);

    spinner.succeed('AI learning completed');

    console.log(chalk.green('\n🎓 AI has learned from your project patterns!'));
    console.log(chalk.cyan('💡 Future recommendations will be more accurate and personalized'));

  } catch (error) {
    spinner.fail('AI learning failed');
    throw error;
  }
}

async function runComprehensiveAnalysis(
  aiService: AIIntegrationService,
  projectPath: string,
  config: ResponsiveConfig,
  options: any
): Promise<void> {
  console.log(chalk.blue('\n🔍 Running comprehensive AI analysis...\n'));

  // Run all analysis types
  await runAIAnalysis(aiService, projectPath, config, options);
  await getAIRecommendations(aiService, projectPath, config, options);
  
  // Show summary
  console.log(chalk.green('\n✅ Comprehensive AI analysis completed!'));
  console.log(chalk.cyan('💡 Use --optimize to apply suggested improvements'));
  console.log(chalk.cyan('💡 Use --learn to improve AI recommendations'));
}

function displayAIAnalysis(insights: any, options: any): void {
  console.log(chalk.blue('\n📊 AI Analysis Results'));
  console.log(chalk.gray('='.repeat(50)));

  // Summary metrics
  console.log(chalk.yellow('\n📈 Summary:'));
  console.log(chalk.gray(`  • Total Issues: ${insights.metrics.totalIssues}`));
  console.log(chalk.gray(`  • Critical Issues: ${insights.metrics.criticalIssues}`));
  console.log(chalk.gray(`  • Auto-fixable: ${insights.metrics.autoFixableIssues}`));
  console.log(chalk.gray(`  • Estimated Improvement: ${insights.metrics.estimatedImprovement}%`));

  // Insights
  if (insights.insights.length > 0) {
    console.log(chalk.yellow('\n💡 Key Insights:'));
    insights.insights.forEach((insight: string, index: number) => {
      console.log(chalk.gray(`  ${index + 1}. ${insight}`));
    });
  }

  // Recommendations
  if (insights.recommendations.length > 0) {
    console.log(chalk.yellow('\n🎯 AI Recommendations:'));
    
    if (options.format === 'table') {
      const tableData = [
        ['Priority', 'Type', 'Title', 'Impact', 'Effort', 'Auto-fixable']
      ];
      
      insights.recommendations.forEach((rec: any) => {
        tableData.push([
          getPriorityIcon(rec.priority),
          rec.type,
          rec.title,
          `${rec.impact.performance}%`,
          rec.estimatedEffort,
          rec.autoFixable ? '✅' : '❌'
        ]);
      });
      
      console.log(table(tableData, {
        border: {
          topBody: '─',
          topJoin: '┬',
          topLeft: '┌',
          topRight: '┐',
          bottomBody: '─',
          bottomJoin: '┴',
          bottomLeft: '└',
          bottomRight: '┘',
          bodyLeft: '│',
          bodyRight: '│',
          bodyJoin: '│',
          joinBody: '─',
          joinLeft: '├',
          joinRight: '┤',
          joinJoin: '┼'
        }
      }));
    } else {
      insights.recommendations.forEach((rec: any, index: number) => {
        console.log(chalk.blue(`\n${index + 1}. ${rec.title}`));
        console.log(chalk.gray(`   Priority: ${rec.priority} | Type: ${rec.type}`));
        console.log(chalk.gray(`   Impact: Performance ${rec.impact.performance}%, Accessibility ${rec.impact.accessibility}%`));
        console.log(chalk.gray(`   Effort: ${rec.estimatedEffort} | Auto-fixable: ${rec.autoFixable ? 'Yes' : 'No'}`));
        console.log(chalk.gray(`   Description: ${rec.description}`));
        
        if (rec.codeExample) {
          console.log(chalk.gray('   Code Example:'));
          console.log(chalk.gray(`   ${rec.codeExample}`));
        }
      });
    }
  }

  // Show next steps
  console.log(chalk.blue('\n🚀 Next Steps:'));
  console.log(chalk.cyan('  • Run "rre ai --optimize" to apply high-confidence suggestions'));
  console.log(chalk.cyan('  • Run "rre ai --learn" to improve future recommendations'));
  console.log(chalk.cyan('  • Use --export to save results for team review'));
}

function displayRecommendations(recommendations: any[], options: any): void {
  console.log(chalk.blue('\n🎯 AI Recommendations'));
  console.log(chalk.gray('='.repeat(50)));

  if (recommendations.length === 0) {
    console.log(chalk.green('✅ No specific recommendations at this time'));
    return;
  }

  recommendations.forEach((rec, index) => {
    console.log(chalk.blue(`\n${index + 1}. ${rec.title}`));
    console.log(chalk.gray(`   Priority: ${getPriorityIcon(rec.priority)} ${rec.priority}`));
    console.log(chalk.gray(`   Type: ${rec.type}`));
    console.log(chalk.gray(`   Confidence: ${(rec.confidence * 100).toFixed(1)}%`));
    console.log(chalk.gray(`   Description: ${rec.description}`));
    
    if (rec.implementationSteps.length > 0) {
      console.log(chalk.gray('   Implementation Steps:'));
      rec.implementationSteps.forEach((step: string, stepIndex: number) => {
        console.log(chalk.gray(`     ${stepIndex + 1}. ${step}`));
      });
    }
  });
}

function displayOptimizationResults(result: any, options: any): void {
  console.log(chalk.blue('\n⚡ Optimization Results'));
  console.log(chalk.gray('='.repeat(50)));

  if (result.applied) {
    console.log(chalk.green('✅ Optimizations applied successfully!'));
  } else {
    console.log(chalk.yellow('🔍 Dry run completed - no changes applied'));
  }

  console.log(chalk.yellow('\n📋 Changes:'));
  result.changes.forEach((change: string, index: number) => {
    console.log(chalk.gray(`  ${index + 1}. ${change}`));
  });

  console.log(chalk.yellow('\n📊 Impact:'));
  console.log(chalk.gray(`  • Performance Impact: ${result.impact}`));

  if (result.rollback) {
    console.log(chalk.yellow('\n🔄 Rollback:'));
    console.log(chalk.gray(`  • Backup available at: ${result.rollback}`));
    console.log(chalk.cyan('  • Run "rre ai --rollback" to revert changes'));
  }
}

async function collectUsageData(projectPath: string): Promise<any[]> {
  // In a real implementation, this would analyze the codebase
  return [];
}

async function collectPerformanceMetrics(projectPath: string): Promise<any> {
  // In a real implementation, this would collect actual performance metrics
  return {
    lcp: 2500,
    fcp: 1800,
    layoutShift: 0.1,
    memoryUsage: 0.7,
    renderTime: 16.67,
    cacheHitRate: 0.8,
    timestamp: new Date()
  };
}

async function exportResults(data: any, exportPath: string, format: string): Promise<void> {
  const fullPath = path.resolve(exportPath);
  const dir = path.dirname(fullPath);
  
  await fs.ensureDir(dir);
  
  if (format === 'json') {
    await fs.writeJson(fullPath, data, { spaces: 2 });
  } else {
    await fs.writeFile(fullPath, JSON.stringify(data, null, 2));
  }
  
  console.log(chalk.green(`\n📁 Results exported to: ${fullPath}`));
}

function getPriorityIcon(priority: string): string {
  switch (priority) {
    case 'critical': return '🔴';
    case 'high': return '🟠';
    case 'medium': return '🟡';
    case 'low': return '🟢';
    default: return '⚪';
  }
}
