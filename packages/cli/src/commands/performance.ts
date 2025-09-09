/**
 * Performance Command - Real-time performance monitoring and analytics
 */

import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import _boxen from 'boxen';
// @ts-ignore - figlet doesn't have type declarations
import figlet from 'figlet';
// @ts-ignore - gradient-string doesn't have type declarations
import gradient from 'gradient-string';
import fs from 'fs-extra';
import path from 'path';
import { table } from 'table';
import { EnterpriseCLI } from '../core/EnterpriseCLI';
import { PerformanceIntegrationService } from '../services/PerformanceIntegrationService';

export const performanceCommand = new Command('performance')
  .description('📊 Real-time performance monitoring and analytics')
  .option('-p, --project <path>', 'Project path to monitor', '.')
  .option('-m, --monitor', 'Start real-time monitoring')
  .option('-s, --snapshot', 'Get current performance snapshot')
  .option('-r, --report', 'Generate performance report')
  .option('-t, --trends', 'Show performance trends')
  .option('-a, --alerts', 'Show performance alerts')
  .option('--thresholds', 'Set custom performance thresholds')
  .option('--export <format>', 'Export performance data (json, csv, xlsx)', 'json')
  .option('--period <days>', 'Report period in days', '7')
  .option('--preset <preset>', 'Performance preset (development, production, strict)', 'development')
  .action(async (_options) => {
    const spinner = ora('Initializing performance monitoring...').start();
    
    try {
      // Show performance banner
      console.log(gradient.rainbow(figlet.textSync('RRE Performance', { horizontalLayout: 'full' })));
      console.log(chalk.blue('📊 Enterprise Performance Monitoring & Analytics\n'));

      // Initialize Enterprise CLI
      spinner.text = 'Initializing enterprise performance services...';
      const enterpriseCLI = new EnterpriseCLI({
        ai: {
          enabled: false,
          optimizationLevel: 'balanced',
          autoOptimize: false,
          learningEnabled: false
        },
        performance: {
          enabled: true,
          preset: _options.preset as any,
          realTimeMonitoring: true,
          alerting: true
        },
        analytics: {
          enabled: true,
          dataRetention: parseInt(_options.period, 10),
          anonymizeData: false,
          exportFormat: _options.export as any
        }
      });

      // Initialize Performance Integration Service
      const performanceService = new PerformanceIntegrationService({
        preset: _options.preset as any,
        realTimeMonitoring: true,
        alerting: true,
        analytics: true,
        dataRetention: parseInt(_options.period, 10)
      }, enterpriseCLI['logger']);

      await performanceService.initialize();

      spinner.succeed('Performance services initialized successfully');

      // Validate project path
      const projectPath = path.resolve(_options.project);
      if (!fs.existsSync(projectPath)) {
        console.error(chalk.red(`❌ Project path does not exist: ${projectPath}`));
        process.exit(1);
      }

      // Start monitoring if requested
      if (_options.monitor) {
        await startMonitoring(performanceService, projectPath, _options);
      }

      // Get snapshot if requested
      if (_options.snapshot) {
        await getPerformanceSnapshot(performanceService, _options);
      }

      // Generate report if requested
      if (_options.report) {
        await generatePerformanceReport(performanceService, projectPath, _options);
      }

      // Show trends if requested
      if (_options.trends) {
        await showPerformanceTrends(performanceService, _options);
      }

      // Show alerts if requested
      if (_options.alerts) {
        await showPerformanceAlerts(performanceService, _options);
      }

      // Set thresholds if requested
      if (_options.thresholds) {
        await setPerformanceThresholds(performanceService, _options);
      }

      // If no specific action requested, show dashboard
      if (!_options.monitor && !_options.snapshot && !_options.report && !_options.trends && !_options.alerts && !_options.thresholds) {
        await showPerformanceDashboard(performanceService, projectPath, _options);
      }

      // Cleanup
      await performanceService.cleanup();
      await enterpriseCLI.cleanup();

    } catch (error) {
      spinner.fail('Performance monitoring failed');
      console.error(chalk.red('\n❌ Error:'), error);
      process.exit(1);
    }
  });

async function startMonitoring(
  performanceService: PerformanceIntegrationService,
  projectPath: string,
  _options: any
): Promise<void> {
  const spinner = ora('Starting real-time performance monitoring...').start();

  try {
    await performanceService.startMonitoring(projectPath);
    spinner.succeed('Real-time monitoring started');

    console.log(chalk.green('\n🚀 Real-time performance monitoring is now active!'));
    console.log(chalk.cyan('💡 Press Ctrl+C to stop monitoring'));
    console.log(chalk.cyan('💡 Use --snapshot to get current performance data'));
    console.log(chalk.cyan('💡 Use --alerts to check for performance issues'));

    // Set up real-time updates
    performanceService.on('snapshot:created', (snapshot) => {
      console.log(chalk.blue(`\n📊 Performance Snapshot - Score: ${snapshot.score}/100`));
      console.log(chalk.gray(`   LCP: ${snapshot.metrics.lcp}ms | FCP: ${snapshot.metrics.fcp}ms | Memory: ${(snapshot.metrics.memoryUsage * 100).toFixed(1)}%`));
    });

    performanceService.on('alerts:detected', (alerts) => {
      console.log(chalk.red(`\n⚠️  ${alerts.length} performance alert(s) detected:`));
      alerts.forEach((alert: any) => {
        console.log(chalk.red(`   • ${alert.type}: ${alert.message}`));
      });
    });

    performanceService.on('performance:degraded', (data) => {
      console.log(chalk.red(`\n🔴 Performance degraded! Score: ${data.score}/100`));
    });

    // Keep the process running
    process.on('SIGINT', () => {
      console.log(chalk.yellow('\n🛑 Stopping performance monitoring...'));
      performanceService.stopMonitoring().then(() => {
        console.log(chalk.green('✅ Performance monitoring stopped'));
        process.exit(0);
      }).catch(() => undefined);
    });

    // Keep alive
    setInterval(() => {}, 1000);

  } catch (error) {
    spinner.fail('Failed to start monitoring');
    throw error;
  }
}

async function getPerformanceSnapshot(
  performanceService: PerformanceIntegrationService,
  _options: any
): Promise<void> {
  const spinner = ora('Getting performance snapshot...').start();

  try {
    const snapshot = await performanceService.getCurrentSnapshot();
    spinner.succeed('Performance snapshot captured');

    // Display snapshot
    displayPerformanceSnapshot(snapshot, _options);

  } catch (error) {
    spinner.fail('Failed to get performance snapshot');
    throw error;
  }
}

async function generatePerformanceReport(
  performanceService: PerformanceIntegrationService,
  projectPath: string,
  _options: any
): Promise<void> {
  const spinner = ora('Generating performance report...').start();

  try {
    const projectId = path.basename(projectPath);
    const period = {
      start: new Date(Date.now() - parseInt(_options.period, 10) * 24 * 60 * 60 * 1000),
      end: new Date()
    };

    const report = await performanceService.generateReport(projectId, {
      period,
      includeTrends: true,
      includeComparisons: true,
      includeRecommendations: true
    });

    spinner.succeed('Performance report generated');

    // Display report
    displayPerformanceReport(report, _options);

    // Export if requested
    if (_options.export) {
      const exportPath = await performanceService.exportData(_options.export, {
        period,
        includeSnapshots: true,
        includeReports: true
      });
      console.log(chalk.green(`\n📁 Report exported to: ${exportPath}`));
    }

  } catch (error) {
    spinner.fail('Failed to generate performance report');
    throw error;
  }
}

async function showPerformanceTrends(
  performanceService: PerformanceIntegrationService,
  _options: any
): Promise<void> {
  const spinner = ora('Analyzing performance trends...').start();

  try {
    const period = {
      start: new Date(Date.now() - parseInt(_options.period, 10) * 24 * 60 * 60 * 1000),
      end: new Date()
    };

    const trends = performanceService.getPerformanceTrends(period);
    spinner.succeed('Performance trends analyzed');

    // Display trends
    displayPerformanceTrends(trends, _options);

  } catch (error) {
    spinner.fail('Failed to analyze performance trends');
    throw error;
  }
}

async function showPerformanceAlerts(
  performanceService: PerformanceIntegrationService,
  _options: any
): Promise<void> {
  const spinner = ora('Checking performance alerts...').start();

  try {
    const alerts = await performanceService.getAlerts({
      limit: 10
    });
    spinner.succeed('Performance alerts checked');

    // Display alerts
    displayPerformanceAlerts(alerts, _options);

  } catch (error) {
    spinner.fail('Failed to get performance alerts');
    throw error;
  }
}

async function setPerformanceThresholds(
  performanceService: PerformanceIntegrationService,
  _options: any
): Promise<void> {
  console.log(chalk.blue('\n⚙️  Performance Thresholds Configuration'));
  console.log(chalk.gray('='.repeat(50)));

  // In a real implementation, this would be interactive
  const thresholds = {
    lcp: 2500,
    fcp: 1800,
    layoutShift: 0.1,
    memoryUsage: 0.8,
    renderTime: 33
  };

  const spinner = ora('Setting performance thresholds...').start();

  try {
    await performanceService.setThresholds(thresholds);
    spinner.succeed('Performance thresholds updated');

    console.log(chalk.green('\n✅ Performance thresholds updated:'));
    Object.entries(thresholds).forEach(([key, value]) => {
      console.log(chalk.gray(`   • ${key}: ${value}`));
    });

  } catch (error) {
    spinner.fail('Failed to set performance thresholds');
    throw error;
  }
}

async function showPerformanceDashboard(
  performanceService: PerformanceIntegrationService,
  _projectPath: string,
  _options: any
): Promise<void> {
  console.log(chalk.blue('\n📊 Performance Dashboard'));
  console.log(chalk.gray('='.repeat(50)));

  try {
    // Get current snapshot
    const snapshot = await performanceService.getCurrentSnapshot();
    
    // Get recent trends
    const period = {
      start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      end: new Date()
    };
    const trends = performanceService.getPerformanceTrends(period);

    // Get alerts
    const alerts = await performanceService.getAlerts({ limit: 5 });

    // Display dashboard
    displayPerformanceDashboard(snapshot, trends, alerts, _options);

  } catch (error) {
    console.error(chalk.red('Failed to load performance dashboard:'), error);
  }
}

function displayPerformanceSnapshot(snapshot: any, _options: any): void {
  console.log(chalk.blue('\n📊 Performance Snapshot'));
  console.log(chalk.gray('='.repeat(50)));

  // Overall score
  const scoreColor = snapshot.score >= 90 ? 'green' : snapshot.score >= 70 ? 'yellow' : 'red';
  console.log(chalk[scoreColor](`\n🎯 Overall Score: ${snapshot.score}/100`));

  // Metrics table
  const metricsData = [
    ['Metric', 'Value', 'Status'],
    ['LCP (Largest Contentful Paint)', `${snapshot.metrics.lcp}ms`, getMetricStatus(snapshot.metrics.lcp, 2500, 'lower')],
    ['FCP (First Contentful Paint)', `${snapshot.metrics.fcp}ms`, getMetricStatus(snapshot.metrics.fcp, 1800, 'lower')],
    ['CLS (Cumulative Layout Shift)', snapshot.metrics.layoutShift.toFixed(3), getMetricStatus(snapshot.metrics.layoutShift, 0.1, 'lower')],
    ['Memory Usage', `${(snapshot.metrics.memoryUsage * 100).toFixed(1)}%`, getMetricStatus(snapshot.metrics.memoryUsage, 0.8, 'lower')],
    ['Render Time', `${snapshot.metrics.renderTime.toFixed(2)}ms`, getMetricStatus(snapshot.metrics.renderTime, 33, 'lower')],
    ['Cache Hit Rate', `${(snapshot.metrics.cacheHitRate * 100).toFixed(1)}%`, getMetricStatus(snapshot.metrics.cacheHitRate, 0.8, 'higher')]
  ];

  console.log(table(metricsData, {
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

  // Trends
  console.log(chalk.yellow('\n📈 Trends:'));
  console.log(chalk.gray(`   • Performance: ${getTrendIcon(snapshot.trends.performance)} ${snapshot.trends.performance}`));
  console.log(chalk.gray(`   • Memory: ${getTrendIcon(snapshot.trends.memory)} ${snapshot.trends.memory}`));
  console.log(chalk.gray(`   • Responsiveness: ${getTrendIcon(snapshot.trends.responsiveness)} ${snapshot.trends.responsiveness}`));

  // Alerts
  if (snapshot.alerts.length > 0) {
    console.log(chalk.red('\n⚠️  Active Alerts:'));
    snapshot.alerts.forEach((alert: any) => {
      console.log(chalk.red(`   • ${alert.type}: ${alert.message}`));
    });
  } else {
    console.log(chalk.green('\n✅ No active alerts'));
  }
}

function displayPerformanceReport(report: any, _options: any): void {
  console.log(chalk.blue('\n📊 Performance Report'));
  console.log(chalk.gray('='.repeat(50)));

  // Summary
  console.log(chalk.yellow('\n📈 Summary:'));
  console.log(chalk.gray(`   • Average Score: ${report.summary.averageScore}/100`));
  console.log(chalk.gray(`   • Total Alerts: ${report.summary.totalAlerts}`));
  console.log(chalk.gray(`   • Critical Issues: ${report.summary.criticalIssues}`));
  console.log(chalk.gray(`   • Recommendations: ${report.summary.recommendations}`));

  // Period
  console.log(chalk.yellow('\n📅 Period:'));
  console.log(chalk.gray(`   • From: ${report.period.start.toLocaleDateString()}`));
  console.log(chalk.gray(`   • To: ${report.period.end.toLocaleDateString()}`));

  // Insights
  if (report.insights.topIssues.length > 0) {
    console.log(chalk.red('\n🔴 Top Issues:'));
    report.insights.topIssues.forEach((issue: string, index: number) => {
      console.log(chalk.gray(`   ${index + 1}. ${issue}`));
    });
  }

  if (report.insights.improvements.length > 0) {
    console.log(chalk.green('\n✅ Improvements:'));
    report.insights.improvements.forEach((improvement: string, index: number) => {
      console.log(chalk.gray(`   ${index + 1}. ${improvement}`));
    });
  }

  if (report.insights.recommendations.length > 0) {
    console.log(chalk.blue('\n💡 Recommendations:'));
    report.insights.recommendations.forEach((rec: string, index: number) => {
      console.log(chalk.gray(`   ${index + 1}. ${rec}`));
    });
  }
}

function displayPerformanceTrends(trends: any, _options: any): void {
  console.log(chalk.blue('\n📈 Performance Trends'));
  console.log(chalk.gray('='.repeat(50)));

  if (trends.performance.length === 0) {
    console.log(chalk.yellow('No trend data available'));
    return;
  }

  // Performance trend
  const latestScore = trends.performance[trends.performance.length - 1];
  const firstScore = trends.performance[0];
  const scoreChange = latestScore - firstScore;
  
  console.log(chalk.yellow('\n🎯 Performance Score Trend:'));
  console.log(chalk.gray(`   • Latest: ${latestScore}/100`));
  console.log(chalk.gray(`   • Change: ${scoreChange > 0 ? '+' : ''}${scoreChange.toFixed(1)}`));
  console.log(chalk.gray(`   • Trend: ${getTrendIcon(scoreChange > 5 ? 'improving' : scoreChange < -5 ? 'degrading' : 'stable')}`));

  // Memory trend
  const latestMemory = trends.memory[trends.memory.length - 1];
  const firstMemory = trends.memory[0];
  const memoryChange = latestMemory - firstMemory;
  
  console.log(chalk.yellow('\n🧠 Memory Usage Trend:'));
  console.log(chalk.gray(`   • Latest: ${latestMemory.toFixed(1)}%`));
  console.log(chalk.gray(`   • Change: ${memoryChange > 0 ? '+' : ''}${memoryChange.toFixed(1)}%`));
  console.log(chalk.gray(`   • Trend: ${getTrendIcon(memoryChange > 5 ? 'increasing' : memoryChange < -5 ? 'decreasing' : 'stable')}`));

  // Responsiveness trend
  const latestRender = trends.responsiveness[trends.responsiveness.length - 1];
  const firstRender = trends.responsiveness[0];
  const renderChange = latestRender - firstRender;
  
  console.log(chalk.yellow('\n⚡ Responsiveness Trend:'));
  console.log(chalk.gray(`   • Latest: ${latestRender.toFixed(2)}ms`));
  console.log(chalk.gray(`   • Change: ${renderChange > 0 ? '+' : ''}${renderChange.toFixed(2)}ms`));
  console.log(chalk.gray(`   • Trend: ${getTrendIcon(renderChange < -2 ? 'improving' : renderChange > 2 ? 'degrading' : 'stable')}`));
}

function displayPerformanceAlerts(alerts: any[], _options: any): void {
  console.log(chalk.blue('\n⚠️  Performance Alerts'));
  console.log(chalk.gray('='.repeat(50)));

  if (alerts.length === 0) {
    console.log(chalk.green('✅ No active performance alerts'));
    return;
  }

  alerts.forEach((alert, index) => {
    const severityColor = alert.severity === 'critical' ? 'red' : alert.severity === 'warning' ? 'yellow' : 'blue';
    console.log(chalk[severityColor](`\n${index + 1}. ${alert.type.toUpperCase()}`));
    console.log(chalk.gray(`   Severity: ${alert.severity}`));
    console.log(chalk.gray(`   Message: ${alert.message}`));
    console.log(chalk.gray(`   Timestamp: ${alert.timestamp}`));
  });
}

function displayPerformanceDashboard(snapshot: any, trends: any, alerts: any[], _options: any): void {
  console.log(chalk.blue('\n📊 Performance Dashboard'));
  console.log(chalk.gray('='.repeat(50)));

  // Quick overview
  const scoreColor = snapshot.score >= 90 ? 'green' : snapshot.score >= 70 ? 'yellow' : 'red';
  console.log(chalk[scoreColor](`\n🎯 Current Score: ${snapshot.score}/100`));
  console.log(chalk.gray(`   LCP: ${snapshot.metrics.lcp}ms | Memory: ${(snapshot.metrics.memoryUsage * 100).toFixed(1)}% | Alerts: ${alerts.length}`));

  // Quick actions
  console.log(chalk.blue('\n🚀 Quick Actions:'));
  console.log(chalk.cyan('  • Run "rre performance --monitor" to start real-time monitoring'));
  console.log(chalk.cyan('  • Run "rre performance --report" to generate detailed report'));
  console.log(chalk.cyan('  • Run "rre performance --alerts" to check for issues'));
  console.log(chalk.cyan('  • Run "rre ai --analyze" for AI-powered insights'));
}

function getMetricStatus(value: number, threshold: number, direction: 'higher' | 'lower'): string {
  const isGood = direction === 'higher' ? value >= threshold : value <= threshold;
  return isGood ? '✅ Good' : '⚠️  Needs Attention';
}

function getTrendIcon(trend: string): string {
  switch (trend) {
    case 'improving': return '📈';
    case 'degrading': return '📉';
    case 'increasing': return '📈';
    case 'decreasing': return '📉';
    case 'stable': return '➡️';
    default: return '❓';
  }
}
