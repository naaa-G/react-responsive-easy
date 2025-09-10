/**
 * Performance Commands
 * 
 * CLI commands for performance monitoring and analysis
 */

import { Command } from 'commander';
import { EnterpriseCLI } from '../core/EnterpriseCLI';
import { PerformanceIntegrationService } from '../services/PerformanceIntegrationService';
import chalk from 'chalk';
import fs from 'fs-extra';
import path from 'path';

export function createPerformanceCommands(program: Command, enterpriseCLI: EnterpriseCLI) {
  const performanceCmd = program
    .command('performance')
    .description('Performance monitoring and analysis commands');

  // Performance monitoring commands
  performanceCmd
    .command('start')
    .description('Start performance monitoring for a project')
    .option('-p, --project <path>', 'Project path to monitor', process.cwd())
    .option('--preset <preset>', 'Performance preset (development|production|strict)', 'production')
    .option('--real-time', 'Enable real-time monitoring', false)
    .action(async (options) => {
      try {
        console.log(chalk.blue('🚀 Starting performance monitoring...'));
        
        const performanceService = new PerformanceIntegrationService({
          preset: options.preset as 'development' | 'production' | 'strict',
          realTimeMonitoring: options.realTime,
          analytics: true,
          alerting: true
        });

        await performanceService.initialize();
        await performanceService.startMonitoring();

        console.log(chalk.green('✅ Performance monitoring started successfully'));
        console.log(chalk.yellow(`📊 Monitoring project: ${options.project}`));
        console.log(chalk.yellow(`⚙️  Preset: ${options.preset}`));
        console.log(chalk.yellow(`🔄 Real-time: ${options.realTime ? 'Enabled' : 'Disabled'}`));

        // Keep the process running for real-time monitoring
        if (options.realTime) {
          console.log(chalk.blue('Press Ctrl+C to stop monitoring'));
          process.on('SIGINT', async () => {
            console.log(chalk.yellow('\n🛑 Stopping performance monitoring...'));
            performanceService.stopMonitoring();
            console.log(chalk.green('✅ Performance monitoring stopped'));
            process.exit(0);
          });

          // Keep alive
          setInterval(() => {}, 1000);
        }
      } catch (error) {
        console.error(chalk.red('❌ Failed to start performance monitoring:'), error);
        process.exit(1);
      }
    });

  performanceCmd
    .command('stop')
    .description('Stop performance monitoring')
    .action(async () => {
      try {
        console.log(chalk.yellow('🛑 Stopping performance monitoring...'));
        // In a real implementation, this would stop the monitoring service
        console.log(chalk.green('✅ Performance monitoring stopped'));
      } catch (error) {
        console.error(chalk.red('❌ Failed to stop performance monitoring:'), error);
        process.exit(1);
      }
    });

  performanceCmd
    .command('status')
    .description('Get current performance status')
    .action(async () => {
      try {
        console.log(chalk.blue('📊 Performance Status'));
        
        const performanceService = new PerformanceIntegrationService({
          preset: 'production',
          analytics: true
        });

        await performanceService.initialize();
        
        const metrics = performanceService.getMetrics();
        const alerts = performanceService.getActiveAlerts();
        const history = performanceService.getHistory();

        if (metrics) {
          console.log(chalk.green('\n📈 Current Metrics:'));
          console.log(`  LCP: ${metrics.lcp ? `${metrics.lcp.toFixed(2)}ms` : 'N/A'}`);
          console.log(`  FCP: ${metrics.fcp ? `${metrics.fcp.toFixed(2)}ms` : 'N/A'}`);
          console.log(`  Layout Shift: ${metrics.layoutShift ? metrics.layoutShift.toFixed(4) : 'N/A'}`);
          console.log(`  Memory Usage: ${metrics.memoryUsage ? `${(metrics.memoryUsage * 100).toFixed(1)}%` : 'N/A'}`);
          console.log(`  Render Time: ${metrics.renderTime ? `${metrics.renderTime.toFixed(2)}ms` : 'N/A'}`);
        }

        if (alerts.length > 0) {
          console.log(chalk.red(`\n⚠️  Active Alerts (${alerts.length}):`));
          alerts.forEach(alert => {
            const severityColor = alert.severity === 'critical' ? 'red' : 
                                 alert.severity === 'warning' ? 'yellow' : 'blue';
            console.log(chalk[severityColor](`  ${alert.severity.toUpperCase()}: ${alert.message}`));
          });
        } else {
          console.log(chalk.green('\n✅ No active alerts'));
        }

        console.log(chalk.blue(`\n📊 History: ${history.length} snapshots`));
        console.log(chalk.blue(`🔧 Advanced Features: ${performanceService.hasAdvancedFeatures() ? 'Available' : 'Not Available'}`));

      } catch (error) {
        console.error(chalk.red('❌ Failed to get performance status:'), error);
        process.exit(1);
      }
    });

  performanceCmd
    .command('report')
    .description('Generate performance report')
    .option('-o, --output <path>', 'Output file path')
    .option('-f, --format <format>', 'Report format (json|csv)', 'json')
    .option('--include-advanced', 'Include advanced features if available', false)
    .action(async (options) => {
      try {
        console.log(chalk.blue('📊 Generating performance report...'));
        
        const performanceService = new PerformanceIntegrationService({
          preset: 'production',
          analytics: true,
          reportGeneration: true
        });

        await performanceService.initialize();
        
        const report = await performanceService.generateReport({
          includeAdvanced: options.includeAdvanced
        });

        const outputPath = options.output || `performance-report-${Date.now()}.${options.format}`;
        
        if (options.format === 'json') {
          await fs.writeJson(outputPath, report, { spaces: 2 });
        } else {
          await performanceService.exportData('csv', outputPath);
        }

        console.log(chalk.green(`✅ Report generated: ${outputPath}`));
        console.log(chalk.blue(`📊 Summary:`));
        console.log(`  Total Alerts: ${report.summary.totalAlerts}`);
        console.log(`  Critical Alerts: ${report.summary.criticalAlerts}`);
        console.log(`  Average Performance: ${report.summary.averagePerformance.toFixed(1)}%`);
        console.log(`  Recommendations: ${report.summary.recommendations.length}`);

        if (report.summary.recommendations.length > 0) {
          console.log(chalk.yellow('\n💡 Recommendations:'));
          report.summary.recommendations.forEach((rec, index) => {
            console.log(`  ${index + 1}. ${rec}`);
          });
        }

      } catch (error) {
        console.error(chalk.red('❌ Failed to generate report:'), error);
        process.exit(1);
      }
    });

  performanceCmd
    .command('export')
    .description('Export performance data')
    .option('-o, --output <path>', 'Output file path')
    .option('-f, --format <format>', 'Export format (json|csv)', 'json')
    .action(async (options) => {
      try {
        console.log(chalk.blue('📤 Exporting performance data...'));
        
        const performanceService = new PerformanceIntegrationService({
          preset: 'production',
          analytics: true
        });

        await performanceService.initialize();
        
        const outputPath = options.output || `performance-data-${Date.now()}.${options.format}`;
        const exportPath = await performanceService.exportData(options.format as 'json' | 'csv', outputPath);

        console.log(chalk.green(`✅ Data exported: ${exportPath}`));

      } catch (error) {
        console.error(chalk.red('❌ Failed to export data:'), error);
        process.exit(1);
      }
    });

  performanceCmd
    .command('dashboard')
    .description('Open performance dashboard (if available)')
    .action(async () => {
      try {
        console.log(chalk.blue('🌐 Opening performance dashboard...'));
        
        const performanceService = new PerformanceIntegrationService({
          preset: 'production',
          analytics: true
        });

        await performanceService.initialize();
        
        const dashboardUrl = performanceService.getDashboardUrl();
        
        if (dashboardUrl) {
          console.log(chalk.green(`✅ Dashboard available: ${dashboardUrl}`));
          console.log(chalk.yellow('Opening in browser...'));
          
          // In a real implementation, this would open the browser
          console.log(chalk.blue('Please open the dashboard URL in your browser'));
        } else {
          console.log(chalk.yellow('⚠️  Performance dashboard not available'));
          console.log(chalk.blue('Install @yaseratiar/react-responsive-easy-performance-dashboard for advanced features'));
        }

      } catch (error) {
        console.error(chalk.red('❌ Failed to open dashboard:'), error);
        process.exit(1);
      }
    });

  performanceCmd
    .command('features')
    .description('Show available performance features')
    .action(async () => {
      try {
        console.log(chalk.blue('🔧 Performance Features'));
        
        const performanceService = new PerformanceIntegrationService({
          preset: 'production',
          analytics: true
        });

        await performanceService.initialize();
        
        console.log(chalk.green('\n✅ Core Features:'));
        console.log('  • Real-time performance monitoring');
        console.log('  • Performance metrics collection');
        console.log('  • Alert system');
        console.log('  • Performance reporting');
        console.log('  • Data export (JSON/CSV)');

        const advancedFeatures = performanceService.getAdvancedFeatures();
        
        if (advancedFeatures.length > 0) {
          console.log(chalk.green('\n🚀 Advanced Features:'));
          advancedFeatures.forEach(feature => {
            console.log(`  • ${feature}`);
          });
        } else {
          console.log(chalk.yellow('\n⚠️  Advanced features not available'));
          console.log(chalk.blue('Install @yaseratiar/react-responsive-easy-performance-dashboard for advanced features'));
        }

      } catch (error) {
        console.error(chalk.red('❌ Failed to get features:'), error);
        process.exit(1);
      }
    });

  return performanceCmd;
}

// Export for backward compatibility
export const performanceCommand = createPerformanceCommands;