#!/usr/bin/env node

/**
 * Comprehensive Error Collection System - Production Ready
 * 
 * This script runs all tests and builds without crashing, collecting all errors
 * and generating a detailed report for fixing issues in bulk.
 * 
 * Features:
 * - Proper process cleanup and timeout handling
 * - Graceful shutdown on SIGINT/SIGTERM
 * - Progress indicators and better logging
 * - Configurable timeouts and retries
 * - CI/CD optimization
 * - Resource cleanup and memory management
 */

const { execSync, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

class ErrorCollector {
  constructor(options = {}) {
    this.errors = [];
    this.warnings = [];
    this.packages = [];
    this.startTime = Date.now();
    this.reportPath = path.join(process.cwd(), 'error-report.json');
    this.summaryPath = path.join(process.cwd(), 'error-summary.md');
    this.skipE2E = options.skipE2E || false;
    this.isCI = process.env.CI || process.env.GITHUB_ACTIONS || process.env.GITHUB_WORKFLOW;
    this.activeProcesses = new Set();
    this.shouldStop = false;
    
    // Reports will be generated in the root directory
    
    // Configurable timeouts (in milliseconds)
    this.timeouts = {
      install: 120000,    // 2 minutes
      build: 180000,      // 3 minutes
      test: 300000,       // 5 minutes
      lint: 60000,        // 1 minute
      typeCheck: 120000,  // 2 minutes
      devServer: 30000,   // 30 seconds
      playwright: 300000  // 5 minutes
    };
    
    // Setup graceful shutdown
    this.setupGracefulShutdown();
  }

  setupGracefulShutdown() {
    const shutdown = (signal) => {
      this.log(`Received ${signal}, shutting down gracefully...`, 'warning');
      this.shouldStop = true;
      
      // Kill all active processes
      for (const process of this.activeProcesses) {
        try {
          if (!process.killed) {
            process.kill('SIGTERM');
            // Force kill after 5 seconds
            setTimeout(() => {
              if (!process.killed) {
                process.kill('SIGKILL');
              }
            }, 5000);
          }
        } catch (error) {
          this.log(`Error killing process: ${error.message}`, 'warning');
        }
      }
      
      // Give processes time to cleanup
      setTimeout(() => {
        this.log('Shutdown complete', 'info');
        process.exit(0);
      }, 2000);
    };
    
    process.on('SIGINT', () => shutdown('SIGINT'));
    process.on('SIGTERM', () => shutdown('SIGTERM'));
  }

  log(message, type = 'info') {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] [${type.toUpperCase()}] ${message}`;
    console.log(logMessage);
    
    if (type === 'error') {
      this.errors.push({ timestamp, message, type });
    } else if (type === 'warning') {
      this.warnings.push({ timestamp, message, type });
    }
  }

  async runCommand(command, options = {}) {
    const { cwd, timeout, continueOnError = true, retries = 0 } = options;
    const actualTimeout = timeout || this.timeouts.test;
    
    // Check if we should stop
    if (this.shouldStop) {
      return { exitCode: 1, stdout: '', stderr: 'Process stopped by user', success: false };
    }
    
    return new Promise((resolve) => {
      this.log(`Running: ${command}`, 'info');
      
      // Use appropriate shell for the platform
      const isWindows = process.platform === 'win32';
      const shell = isWindows ? 'cmd' : 'bash';
      const args = isWindows ? ['/c', command] : ['-c', command];
      
      const child = spawn(shell, args, {
        cwd: cwd || process.cwd(),
        stdio: ['pipe', 'pipe', 'pipe'],
        detached: false
      });

      // Track active process
      this.activeProcesses.add(child);
      
      let stdout = '';
      let stderr = '';
      let exitCode = 0;
      let isResolved = false;
      let timeoutId = null;

      const cleanup = () => {
        if (timeoutId) {
          clearTimeout(timeoutId);
          timeoutId = null;
        }
        this.activeProcesses.delete(child);
      };

      const resolveOnce = (result) => {
        if (isResolved) return;
        isResolved = true;
        cleanup();
        resolve(result);
      };

      child.stdout.on('data', (data) => {
        stdout += data.toString();
      });

      child.stderr.on('data', (data) => {
        stderr += data.toString();
      });

      child.on('close', (code) => {
        exitCode = code;
        
        if (exitCode !== 0) {
          this.log(`Command failed with exit code ${exitCode}: ${command}`, 'error');
          if (stdout) this.log(`STDOUT: ${stdout.substring(0, 500)}${stdout.length > 500 ? '...' : ''}`, 'error');
          if (stderr) this.log(`STDERR: ${stderr.substring(0, 500)}${stderr.length > 500 ? '...' : ''}`, 'error');
        } else {
          this.log(`Command succeeded: ${command}`, 'info');
        }

        resolveOnce({
          exitCode,
          stdout,
          stderr,
          success: exitCode === 0
        });
      });

      child.on('error', (error) => {
        this.log(`Command error: ${error.message}`, 'error');
        resolveOnce({
          exitCode: 1,
          stdout,
          stderr: error.message,
          success: false
        });
      });

      // Handle timeout
      if (actualTimeout > 0) {
        timeoutId = setTimeout(() => {
          if (!child.killed && !isResolved) {
            this.log(`Command timed out after ${actualTimeout}ms: ${command}`, 'error');
            child.kill('SIGTERM');
            
            // Force kill after 5 seconds
            setTimeout(() => {
              if (!child.killed) {
                child.kill('SIGKILL');
              }
            }, 5000);
            
            resolveOnce({
              exitCode: 124, // Standard timeout exit code
              stdout,
              stderr: `Command timed out after ${actualTimeout}ms`,
              success: false
            });
          }
        }, actualTimeout);
      }
    });
  }

  async discoverPackages() {
    this.log('Discovering packages...', 'info');
    
    const packagesDir = path.join(process.cwd(), 'packages');
    if (!fs.existsSync(packagesDir)) {
      this.log('No packages directory found', 'warning');
      return;
    }

    const entries = fs.readdirSync(packagesDir, { withFileTypes: true });
    
    for (const entry of entries) {
      if (this.shouldStop) break;
      
      if (entry.isDirectory()) {
        const packagePath = path.join(packagesDir, entry.name);
        const packageJsonPath = path.join(packagePath, 'package.json');
        
        if (fs.existsSync(packageJsonPath)) {
          try {
            const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
            this.packages.push({
              name: entry.name,
              path: packagePath,
              packageJson,
              hasTests: fs.existsSync(path.join(packagePath, 'src', '__tests__')) || 
                       fs.existsSync(path.join(packagePath, '__tests__')) ||
                       packageJson.scripts?.test,
              hasBuild: !!packageJson.scripts?.build,
              hasLint: !!packageJson.scripts?.lint,
              hasTypeCheck: !!packageJson.scripts?.['type-check']
            });
          } catch (error) {
            this.log(`Error reading package.json for ${entry.name}: ${error.message}`, 'warning');
          }
        }
      }
    }
    
    this.log(`Discovered ${this.packages.length} packages`, 'info');
  }

  async runPackageTests(packageInfo) {
    if (this.shouldStop) {
      return { package: packageInfo.name, tests: { success: false, errors: [] }, build: { success: false, errors: [] }, lint: { success: false, errors: [] }, typeCheck: { success: false, errors: [] } };
    }
    
    this.log(`Running tests for package: ${packageInfo.name}`, 'info');
    
    const results = {
      package: packageInfo.name,
      tests: { success: true, errors: [] },
      build: { success: true, errors: [] },
      lint: { success: true, errors: [] },
      typeCheck: { success: true, errors: [] }
    };

    // Run tests
    if (packageInfo.hasTests) {
      const testResult = await this.runCommand('pnpm test', {
        cwd: packageInfo.path,
        timeout: this.timeouts.test,
        continueOnError: true
      });
      
      results.tests.success = testResult.success;
      if (!testResult.success) {
        results.tests.errors.push({
          command: 'pnpm test',
          exitCode: testResult.exitCode,
          stdout: testResult.stdout,
          stderr: testResult.stderr
        });
      }
    }

    // Run build
    if (packageInfo.hasBuild) {
      const buildResult = await this.runCommand('pnpm build', {
        cwd: packageInfo.path,
        timeout: this.timeouts.build,
        continueOnError: true
      });
      
      results.build.success = buildResult.success;
      if (!buildResult.success) {
        results.build.errors.push({
          command: 'pnpm build',
          exitCode: buildResult.exitCode,
          stdout: buildResult.stdout,
          stderr: buildResult.stderr
        });
      }
    }

    // Run lint
    if (packageInfo.hasLint) {
      const lintResult = await this.runCommand('pnpm lint', {
        cwd: packageInfo.path,
        timeout: this.timeouts.lint,
        continueOnError: true
      });
      
      results.lint.success = lintResult.success;
      if (!lintResult.success) {
        results.lint.errors.push({
          command: 'pnpm lint',
          exitCode: lintResult.exitCode,
          stdout: lintResult.stdout,
          stderr: lintResult.stderr
        });
      }
    }

    // Run type check
    if (packageInfo.hasTypeCheck) {
      const typeCheckResult = await this.runCommand('pnpm type-check', {
        cwd: packageInfo.path,
        timeout: this.timeouts.typeCheck,
        continueOnError: true
      });
      
      results.typeCheck.success = typeCheckResult.success;
      if (!typeCheckResult.success) {
        results.typeCheck.errors.push({
          command: 'pnpm type-check',
          exitCode: typeCheckResult.exitCode,
          stdout: typeCheckResult.stdout,
          stderr: typeCheckResult.stderr
        });
      }
    }

    return results;
  }

  async runRootLevelChecks() {
    this.log('Running root-level checks...', 'info');
    
    const results = {
      install: { success: false, errors: [] },
      build: { success: false, errors: [] },
      test: { success: false, errors: [] },
      lint: { success: false, errors: [] },
      typeCheck: { success: false, errors: [] }
    };

    // Install dependencies
    const installResult = await this.runCommand('pnpm install --frozen-lockfile', {
      timeout: this.timeouts.install,
      continueOnError: true
    });
    results.install.success = installResult.success;
    if (!installResult.success) {
      results.install.errors.push({
        command: 'pnpm install --frozen-lockfile',
        exitCode: installResult.exitCode,
        stdout: installResult.stdout,
        stderr: installResult.stderr
      });
    }

    // Root build
    const buildResult = await this.runCommand('pnpm build', {
      timeout: this.timeouts.build,
      continueOnError: true
    });
    results.build.success = buildResult.success;
    if (!buildResult.success) {
      results.build.errors.push({
        command: 'pnpm build',
        exitCode: buildResult.exitCode,
        stdout: buildResult.stdout,
        stderr: buildResult.stderr
      });
    }

    // Root tests
    const testResult = await this.runCommand('pnpm test', {
      timeout: this.timeouts.test,
      continueOnError: true
    });
    results.test.success = testResult.success;
    if (!testResult.success) {
      results.test.errors.push({
        command: 'pnpm test',
        exitCode: testResult.exitCode,
        stdout: testResult.stdout,
        stderr: testResult.stderr
      });
    }

    // Root lint
    const lintResult = await this.runCommand('pnpm lint', {
      timeout: this.timeouts.lint,
      continueOnError: true
    });
    results.lint.success = lintResult.success;
    if (!lintResult.success) {
      results.lint.errors.push({
        command: 'pnpm lint',
        exitCode: lintResult.exitCode,
        stdout: lintResult.stdout,
        stderr: lintResult.stderr
      });
    }

    // Root type check
    const typeCheckResult = await this.runCommand('pnpm type-check', {
      timeout: this.timeouts.typeCheck,
      continueOnError: true
    });
    results.typeCheck.success = typeCheckResult.success;
    if (!typeCheckResult.success) {
      results.typeCheck.errors.push({
        command: 'pnpm type-check',
        exitCode: typeCheckResult.exitCode,
        stdout: typeCheckResult.stdout,
        stderr: typeCheckResult.stderr
      });
    }

    return results;
  }

  async runE2ETests() {
    this.log('Running E2E tests...', 'info');
    
    const results = {
      playwright: { success: false, errors: [] },
      devServer: { success: false, errors: [] }
    };

    // Skip E2E tests if requested or in CI
    if (this.skipE2E || this.isCI) {
      this.log('Skipping E2E tests (skipE2E flag or CI environment)', 'info');
      results.devServer.success = true; // Mark as success since we're skipping
      results.playwright.success = true; // Mark as success since we're skipping
      return results;
    }

    // Start dev server with a short timeout for local testing
    const devServerResult = await this.runCommand('pnpm dev', {
      timeout: this.timeouts.devServer,
      continueOnError: true
    });
    results.devServer.success = devServerResult.success;
    if (!devServerResult.success) {
      results.devServer.errors.push({
        command: 'pnpm dev',
        exitCode: devServerResult.exitCode,
        stdout: devServerResult.stdout,
        stderr: devServerResult.stderr
      });
    }

    // Run Playwright tests (skip if no dev server)
    if (results.devServer.success) {
      const playwrightResult = await this.runCommand('npx playwright test', {
        timeout: this.timeouts.playwright,
        continueOnError: true
      });
      results.playwright.success = playwrightResult.success;
      if (!playwrightResult.success) {
        results.playwright.errors.push({
          command: 'npx playwright test',
          exitCode: playwrightResult.exitCode,
          stdout: playwrightResult.stdout,
          stderr: playwrightResult.stderr
        });
      }
    } else {
      this.log('Skipping Playwright tests due to dev server issues', 'warning');
      results.playwright.success = false;
      results.playwright.errors.push({
        command: 'npx playwright test',
        exitCode: 1,
        stdout: '',
        stderr: 'Skipped due to dev server failure'
      });
    }

    return results;
  }

  generateReport(packageResults, rootResults, e2eResults) {
    const endTime = Date.now();
    const duration = endTime - this.startTime;

    const report = {
      summary: {
        startTime: new Date(this.startTime).toISOString(),
        endTime: new Date(endTime).toISOString(),
        duration: duration,
        totalErrors: this.errors.length,
        totalWarnings: this.warnings.length,
        packagesChecked: this.packages.length,
        packagesWithErrors: packageResults.filter(p => 
          !p.tests.success || !p.build.success || !p.lint.success || !p.typeCheck.success
        ).length
      },
      environment: {
        nodeVersion: process.version,
        platform: process.platform,
        arch: process.arch,
        cwd: process.cwd()
      },
      rootLevel: rootResults,
      packages: packageResults,
      e2e: e2eResults,
      errors: this.errors,
      warnings: this.warnings
    };

    // Ensure errors directory exists
    const errorsDir = path.dirname(this.reportPath);
    if (!fs.existsSync(errorsDir)) {
      fs.mkdirSync(errorsDir, { recursive: true });
    }

    // Write JSON report
    fs.writeFileSync(this.reportPath, JSON.stringify(report, null, 2));
    this.log(`Detailed report written to: ${this.reportPath}`, 'info');

    // Generate markdown summary
    this.generateMarkdownSummary(report);
    
    return report;
  }

  generateMarkdownSummary(report) {
    let markdown = `# Error Collection Report\n\n`;
    markdown += `**Generated:** ${new Date().toISOString()}\n`;
    markdown += `**Duration:** ${Math.round(report.summary.duration / 1000)}s\n`;
    markdown += `**Total Errors:** ${report.summary.totalErrors}\n`;
    markdown += `**Total Warnings:** ${report.summary.totalWarnings}\n\n`;

    // Root level summary
    markdown += `## Root Level Checks\n\n`;
    markdown += `| Check | Status |\n`;
    markdown += `|-------|--------|\n`;
    markdown += `| Install | ${report.rootLevel.install.success ? '✅' : '❌'} |\n`;
    markdown += `| Build | ${report.rootLevel.build.success ? '✅' : '❌'} |\n`;
    markdown += `| Test | ${report.rootLevel.test.success ? '✅' : '❌'} |\n`;
    markdown += `| Lint | ${report.rootLevel.lint.success ? '✅' : '❌'} |\n`;
    markdown += `| Type Check | ${report.rootLevel.typeCheck.success ? '✅' : '❌'} |\n\n`;

    // Package summary
    markdown += `## Package Results\n\n`;
    markdown += `| Package | Tests | Build | Lint | Type Check |\n`;
    markdown += `|---------|-------|-------|------|------------|\n`;
    
    for (const pkg of report.packages) {
      markdown += `| ${pkg.package} | ${pkg.tests.success ? '✅' : '❌'} | ${pkg.build.success ? '✅' : '❌'} | ${pkg.lint.success ? '✅' : '❌'} | ${pkg.typeCheck.success ? '✅' : '❌'} |\n`;
    }
    markdown += `\n`;

    // Error details
    if (report.summary.totalErrors > 0) {
      markdown += `## Error Details\n\n`;
      
      // Root level errors
      for (const [check, result] of Object.entries(report.rootLevel)) {
        if (!result.success && result.errors.length > 0) {
          markdown += `### Root Level: ${check}\n\n`;
          for (const error of result.errors) {
            markdown += `**Command:** \`${error.command}\`\n\n`;
            markdown += `**Exit Code:** ${error.exitCode}\n\n`;
            if (error.stdout) {
              markdown += `**STDOUT:**\n\`\`\`\n${error.stdout}\n\`\`\`\n\n`;
            }
            if (error.stderr) {
              markdown += `**STDERR:**\n\`\`\`\n${error.stderr}\n\`\`\`\n\n`;
            }
          }
        }
      }

      // Package errors
      for (const pkg of report.packages) {
        const hasErrors = !pkg.tests.success || !pkg.build.success || !pkg.lint.success || !pkg.typeCheck.success;
        if (hasErrors) {
          markdown += `### Package: ${pkg.package}\n\n`;
          
          for (const [check, result] of Object.entries(pkg)) {
            if (check !== 'package' && !result.success && result.errors.length > 0) {
              markdown += `#### ${check}\n\n`;
              for (const error of result.errors) {
                markdown += `**Command:** \`${error.command}\`\n\n`;
                markdown += `**Exit Code:** ${error.exitCode}\n\n`;
                if (error.stdout) {
                  markdown += `**STDOUT:**\n\`\`\`\n${error.stdout}\n\`\`\`\n\n`;
                }
                if (error.stderr) {
                  markdown += `**STDERR:**\n\`\`\`\n${error.stderr}\n\`\`\`\n\n`;
                }
              }
            }
          }
        }
      }
    }

    // Recommendations
    markdown += `## Recommendations\n\n`;
    markdown += `1. **Fix Critical Errors First**: Address build and type-check failures before tests\n`;
    markdown += `2. **Package-by-Package**: Fix one package at a time to avoid cascading failures\n`;
    markdown += `3. **Dependencies**: Ensure all dependencies are properly installed\n`;
    markdown += `4. **Environment**: Verify Node.js version and environment setup\n`;
    markdown += `5. **Incremental Fixes**: Make small, focused changes and test frequently\n\n`;

    fs.writeFileSync(this.summaryPath, markdown);
    this.log(`Summary report written to: ${this.summaryPath}`, 'info');
  }

  async run() {
    this.log('Starting comprehensive error collection...', 'info');
    
    if (this.isCI) {
      this.log('Running in CI environment - optimizing for speed and reliability', 'info');
    }
    
    try {
      // Discover packages
      await this.discoverPackages();
      
      if (this.shouldStop) {
        this.log('Process stopped by user', 'warning');
        return null;
      }
      
      // Run root level checks
      this.log('Running root-level checks...', 'info');
      const rootResults = await this.runRootLevelChecks();
      
      if (this.shouldStop) {
        this.log('Process stopped by user', 'warning');
        return null;
      }
      
      // Run package-level checks
      this.log('Running package-level checks...', 'info');
      const packageResults = [];
      for (let i = 0; i < this.packages.length; i++) {
        if (this.shouldStop) break;
        
        const packageInfo = this.packages[i];
        this.log(`Processing package ${i + 1}/${this.packages.length}: ${packageInfo.name}`, 'info');
        
        const result = await this.runPackageTests(packageInfo);
        packageResults.push(result);
      }
      
      if (this.shouldStop) {
        this.log('Process stopped by user', 'warning');
        return null;
      }
      
      // Run E2E tests (with CI optimization)
      this.log('Running E2E tests...', 'info');
      const e2eResults = await this.runE2ETests();
      
      if (this.shouldStop) {
        this.log('Process stopped by user', 'warning');
        return null;
      }
      
      // Generate report
      const report = this.generateReport(packageResults, rootResults, e2eResults);
      
      this.log('Error collection completed!', 'info');
      this.log(`Total errors found: ${report.summary.totalErrors}`, 'info');
      this.log(`Total warnings: ${report.summary.totalWarnings}`, 'info');
      this.log(`Report files: ${this.reportPath}, ${this.summaryPath}`, 'info');
      
      return report;
      
    } catch (error) {
      this.log(`Fatal error during collection: ${error.message}`, 'error');
      throw error;
    } finally {
      // Cleanup any remaining processes
      for (const process of this.activeProcesses) {
        try {
          if (!process.killed) {
            process.kill('SIGTERM');
          }
        } catch (error) {
          // Ignore cleanup errors
        }
      }
    }
  }
}

// Run if called directly
if (require.main === module) {
  // Parse command line arguments
  const args = process.argv.slice(2);
  const options = {};
  
  if (args.includes('--skip-e2e')) {
    options.skipE2E = true;
  }
  
  if (args.includes('--help') || args.includes('-h')) {
    console.log(`
Error Collection System

Usage: node tools/error-collector.js [options]

Options:
  --skip-e2e     Skip E2E tests (recommended for CI)
  --help, -h     Show this help message

Examples:
  node tools/error-collector.js
  node tools/error-collector.js --skip-e2e
    `);
    process.exit(0);
  }
  
  const collector = new ErrorCollector(options);
  collector.run().then(result => {
    if (result) {
      console.log('✅ Error collection completed successfully!');
      console.log(`📊 Summary:`);
      console.log(`   - Total errors: ${result.summary.totalErrors}`);
      console.log(`   - Total warnings: ${result.summary.totalWarnings}`);
      console.log(`   - Packages checked: ${result.summary.packagesChecked}`);
      console.log(`   - Packages with errors: ${result.summary.packagesWithErrors}`);
      console.log(`   - Duration: ${result.summary.duration}s`);
      console.log('');
      console.log('📁 Reports generated:');
      console.log(`   - JSON: ${collector.reportPath}`);
      console.log(`   - Markdown: ${collector.summaryPath}`);
      console.log('');
      if (result.summary.totalErrors > 0) {
        console.log(`⚠️  Found ${result.summary.totalErrors} errors that need attention.`);
        console.log('   Review the reports above for detailed information.');
      } else {
        console.log('🎉 No errors found!');
      }
    } else {
      console.log('❌ Error collection completed but no report was generated.');
    }
  }).catch(error => {
    console.error('❌ Error collection failed:', error.message);
    console.error('Stack trace:', error.stack);
    process.exit(1);
  });
}

module.exports = ErrorCollector;