#!/usr/bin/env node

/**
 * Enhanced Error Collection System - Focused on Error Lines Only
 * 
 * This script runs all tests and builds, collecting only error lines
 * and generating focused reports for quick debugging.
 * 
 * Features:
 * - Only captures error lines (filters out success messages)
 * - Includes detailed unit test error information
 * - Generates concise, actionable error reports
 * - CI/CD optimized with proper timeouts
 * - Resource cleanup and memory management
 */

const { execSync, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

class EnhancedErrorCollector {
  constructor(options = {}) {
    this.errors = [];
    this.testErrors = [];
    this.packages = [];
    this.startTime = Date.now();
    this.reportPath = path.join(process.cwd(), 'errors', 'focused-error-report.json');
    this.summaryPath = path.join(process.cwd(), 'errors', 'focused-error-summary.md');
    this.skipE2E = options.skipE2E || false;
    this.isCI = process.env.CI || process.env.GITHUB_ACTIONS || process.env.GITHUB_WORKFLOW;
    this.activeProcesses = new Set();
    this.shouldStop = false;
    
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
    const shutdown = () => {
      this.log('Received shutdown signal, cleaning up...', 'warn');
      this.shouldStop = true;
      
      // Kill all active processes
      for (const process of this.activeProcesses) {
        try {
          process.kill('SIGTERM');
        } catch (e) {
          // Process might already be dead
        }
      }
      
      process.exit(0);
    };

    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);
  }

  log(message, level = 'info') {
    const timestamp = new Date().toISOString();
    const prefix = level === 'error' ? '❌' : level === 'warn' ? '⚠️' : 'ℹ️';
    console.log(`[${timestamp}] ${prefix} ${message}`);
  }

  /**
   * Extract only error lines from command output
   */
  extractErrorLines(output) {
    if (!output) return [];
    
    const lines = output.split('\n');
    const errorLines = [];
    
    for (const line of lines) {
      const trimmed = line.trim();
      
      // Skip empty lines and success messages
      if (!trimmed) continue;
      
      // Look for error indicators
      if (
        trimmed.includes('❌') ||
        trimmed.includes('FAIL') ||
        trimmed.includes('Error:') ||
        trimmed.includes('error:') ||
        trimmed.includes('✖') ||
        trimmed.includes('AssertionError') ||
        trimmed.includes('TypeError') ||
        trimmed.includes('ReferenceError') ||
        trimmed.includes('SyntaxError') ||
        trimmed.includes('ELIFECYCLE') ||
        trimmed.includes('ERR_') ||
        trimmed.includes('at ') ||
        trimmed.includes('→') ||
        trimmed.includes('Failed Tests') ||
        trimmed.includes('Test Files') ||
        trimmed.includes('Test failed') ||
        trimmed.includes('exit code') ||
        trimmed.includes('Command failed')
      ) {
        errorLines.push(trimmed);
      }
    }
    
    return errorLines;
  }

  /**
   * Extract unit test specific errors
   */
  extractTestErrors(output) {
    if (!output) return [];
    
    const lines = output.split('\n');
    const testErrors = [];
    let inTestError = false;
    let currentError = null;
    
    for (const line of lines) {
      const trimmed = line.trim();
      
      // Start of a test error
      if (trimmed.includes('FAIL') || trimmed.includes('✖') || trimmed.includes('❌')) {
        inTestError = true;
        currentError = {
          type: 'test_failure',
          message: trimmed,
          details: []
        };
        continue;
      }
      
      // End of test error (next test or summary)
      if (inTestError && (trimmed.includes('✓') || trimmed.includes('✅') || trimmed.includes('Test Files') || trimmed.includes('='))) {
        if (currentError) {
          testErrors.push(currentError);
          currentError = null;
        }
        inTestError = false;
        continue;
      }
      
      // Collect error details
      if (inTestError && currentError) {
        if (trimmed.includes('AssertionError') || 
            trimmed.includes('TypeError') || 
            trimmed.includes('ReferenceError') ||
            trimmed.includes('SyntaxError') ||
            trimmed.includes('at ') ||
            trimmed.includes('→') ||
            trimmed.includes('expect(') ||
            trimmed.includes('toBeLessThan') ||
            trimmed.includes('toBeGreaterThan') ||
            trimmed.includes('toContain') ||
            trimmed.includes('toMatch')) {
          currentError.details.push(trimmed);
        }
      }
    }
    
    // Don't forget the last error if we're still in one
    if (currentError) {
      testErrors.push(currentError);
    }
    
    return testErrors;
  }

  async runCommand(command, options = {}) {
    const { cwd, timeout, continueOnError = true, retries = 0 } = options;
    const actualTimeout = timeout || this.timeouts.test;
    
    // Check if we should stop
    if (this.shouldStop) {
      return { exitCode: 1, stdout: '', stderr: 'Process stopped by user', success: false, errorLines: [], testErrors: [] };
    }
    
    return new Promise((resolve) => {
      this.log(`Running: ${command}`, 'info');
      
      const child = spawn('cmd', ['/c', command], {
        cwd: cwd || process.cwd(),
        shell: true,
        stdio: 'pipe'
      });
      
      this.activeProcesses.add(child);
      
      let stdout = '';
      let stderr = '';
      
      child.stdout.on('data', (data) => {
        stdout += data.toString();
      });
      
      child.stderr.on('data', (data) => {
        stderr += data.toString();
      });
      
      const timeoutId = setTimeout(() => {
        this.log(`Command timed out after ${actualTimeout}ms: ${command}`, 'warn');
        child.kill('SIGTERM');
        this.activeProcesses.delete(child);
        
        const errorLines = this.extractErrorLines(stdout + stderr);
        const testErrors = this.extractTestErrors(stdout + stderr);
        
        resolve({
          exitCode: 1,
          stdout,
          stderr,
          success: false,
          errorLines,
          testErrors,
          timedOut: true
        });
      }, actualTimeout);
      
      child.on('close', (code) => {
        clearTimeout(timeoutId);
        this.activeProcesses.delete(child);
        
        const success = code === 0;
        const errorLines = this.extractErrorLines(stdout + stderr);
        const testErrors = this.extractTestErrors(stdout + stderr);
        
        if (!success && errorLines.length > 0) {
          this.log(`Command failed with ${errorLines.length} error lines: ${command}`, 'error');
        }
        
        resolve({
          exitCode: code,
          stdout,
          stderr,
          success,
          errorLines,
          testErrors,
          timedOut: false
        });
      });
      
      child.on('error', (error) => {
        clearTimeout(timeoutId);
        this.activeProcesses.delete(child);
        
        this.log(`Command error: ${error.message}`, 'error');
        
        resolve({
          exitCode: 1,
          stdout,
          stderr: error.message,
          success: false,
          errorLines: [error.message],
          testErrors: [],
          timedOut: false
        });
      });
    });
  }

  async collectPackageErrors(packageInfo) {
    this.log(`Checking package: ${packageInfo.package}`, 'info');
    
    const results = {
      package: packageInfo.package,
      path: packageInfo.path,
      tests: { success: true, errors: [], errorLines: [], testErrors: [] },
      build: { success: true, errors: [], errorLines: [] },
      lint: { success: true, errors: [], errorLines: [] },
      typeCheck: { success: true, errors: [], errorLines: [] }
    };

    // Test
    try {
      const testResult = await this.runCommand('pnpm test', {
        cwd: packageInfo.path,
        timeout: this.timeouts.test,
        continueOnError: true
      });
      
      results.tests.success = testResult.success;
      results.tests.errorLines = testResult.errorLines;
      results.tests.testErrors = testResult.testErrors;
      
      if (!testResult.success) {
        results.tests.errors.push({
          command: 'pnpm test',
          exitCode: testResult.exitCode,
          errorLines: testResult.errorLines,
          testErrors: testResult.testErrors
        });
      }
    } catch (error) {
      results.tests.success = false;
      results.tests.errors.push({
        command: 'pnpm test',
        exitCode: 1,
        errorLines: [error.message],
        testErrors: []
      });
    }

    // Build
    try {
      const buildResult = await this.runCommand('pnpm build', {
        cwd: packageInfo.path,
        timeout: this.timeouts.build,
        continueOnError: true
      });
      
      results.build.success = buildResult.success;
      results.build.errorLines = buildResult.errorLines;
      
      if (!buildResult.success) {
        results.build.errors.push({
          command: 'pnpm build',
          exitCode: buildResult.exitCode,
          errorLines: buildResult.errorLines
        });
      }
    } catch (error) {
      results.build.success = false;
      results.build.errors.push({
        command: 'pnpm build',
        exitCode: 1,
        errorLines: [error.message]
      });
    }

    // Lint
    try {
      const lintResult = await this.runCommand('pnpm lint', {
        cwd: packageInfo.path,
        timeout: this.timeouts.lint,
        continueOnError: true
      });
      
      results.lint.success = lintResult.success;
      results.lint.errorLines = lintResult.errorLines;
      
      if (!lintResult.success) {
        results.lint.errors.push({
          command: 'pnpm lint',
          exitCode: lintResult.exitCode,
          errorLines: lintResult.errorLines
        });
      }
    } catch (error) {
      results.lint.success = false;
      results.lint.errors.push({
        command: 'pnpm lint',
        exitCode: 1,
        errorLines: [error.message]
      });
    }

    // Type Check
    try {
      const typeCheckResult = await this.runCommand('pnpm type-check', {
        cwd: packageInfo.path,
        timeout: this.timeouts.typeCheck,
        continueOnError: true
      });
      
      results.typeCheck.success = typeCheckResult.success;
      results.typeCheck.errorLines = typeCheckResult.errorLines;
      
      if (!typeCheckResult.success) {
        results.typeCheck.errors.push({
          command: 'pnpm type-check',
          exitCode: typeCheckResult.exitCode,
          errorLines: typeCheckResult.errorLines
        });
      }
    } catch (error) {
      results.typeCheck.success = false;
      results.typeCheck.errors.push({
        command: 'pnpm type-check',
        exitCode: 1,
        errorLines: [error.message]
      });
    }

    return results;
  }

  async collectRootLevelErrors() {
    this.log('Checking root level operations...', 'info');
    
    const results = {
      install: { success: true, errors: [], errorLines: [] },
      build: { success: true, errors: [], errorLines: [] },
      test: { success: true, errors: [], errorLines: [], testErrors: [] },
      lint: { success: true, errors: [], errorLines: [] },
      typeCheck: { success: true, errors: [], errorLines: [] }
    };

    // Install
    try {
      const installResult = await this.runCommand('pnpm install --frozen-lockfile', {
        timeout: this.timeouts.install,
        continueOnError: true
      });
      results.install.success = installResult.success;
      results.install.errorLines = installResult.errorLines;
      
      if (!installResult.success) {
        results.install.errors.push({
          command: 'pnpm install --frozen-lockfile',
          exitCode: installResult.exitCode,
          errorLines: installResult.errorLines
        });
      }
    } catch (error) {
      results.install.success = false;
      results.install.errors.push({
        command: 'pnpm install --frozen-lockfile',
        exitCode: 1,
        errorLines: [error.message]
      });
    }

    // Build
    try {
      const buildResult = await this.runCommand('pnpm build', {
        timeout: this.timeouts.build,
        continueOnError: true
      });
      results.build.success = buildResult.success;
      results.build.errorLines = buildResult.errorLines;
      
      if (!buildResult.success) {
        results.build.errors.push({
          command: 'pnpm build',
          exitCode: buildResult.exitCode,
          errorLines: buildResult.errorLines
        });
      }
    } catch (error) {
      results.build.success = false;
      results.build.errors.push({
        command: 'pnpm build',
        exitCode: 1,
        errorLines: [error.message]
      });
    }

    // Test
    try {
      const testResult = await this.runCommand('pnpm test', {
        timeout: this.timeouts.test,
        continueOnError: true
      });
      results.test.success = testResult.success;
      results.test.errorLines = testResult.errorLines;
      results.test.testErrors = testResult.testErrors;
      
      if (!testResult.success) {
        results.test.errors.push({
          command: 'pnpm test',
          exitCode: testResult.exitCode,
          errorLines: testResult.errorLines,
          testErrors: testResult.testErrors
        });
      }
    } catch (error) {
      results.test.success = false;
      results.test.errors.push({
        command: 'pnpm test',
        exitCode: 1,
        errorLines: [error.message],
        testErrors: []
      });
    }

    // Lint
    try {
      const lintResult = await this.runCommand('pnpm lint', {
        timeout: this.timeouts.lint,
        continueOnError: true
      });
      results.lint.success = lintResult.success;
      results.lint.errorLines = lintResult.errorLines;
      
      if (!lintResult.success) {
        results.lint.errors.push({
          command: 'pnpm lint',
          exitCode: lintResult.exitCode,
          errorLines: lintResult.errorLines
        });
      }
    } catch (error) {
      results.lint.success = false;
      results.lint.errors.push({
        command: 'pnpm lint',
        exitCode: 1,
        errorLines: [error.message]
      });
    }

    // Type Check
    try {
      const typeCheckResult = await this.runCommand('pnpm type-check', {
        timeout: this.timeouts.typeCheck,
        continueOnError: true
      });
      results.typeCheck.success = typeCheckResult.success;
      results.typeCheck.errorLines = typeCheckResult.errorLines;
      
      if (!typeCheckResult.success) {
        results.typeCheck.errors.push({
          command: 'pnpm type-check',
          exitCode: typeCheckResult.exitCode,
          errorLines: typeCheckResult.errorLines
        });
      }
    } catch (error) {
      results.typeCheck.success = false;
      results.typeCheck.errors.push({
        command: 'pnpm type-check',
        exitCode: 1,
        errorLines: [error.message]
      });
    }

    return results;
  }

  generateFocusedReport(packageResults, rootResults) {
    const endTime = Date.now();
    const duration = endTime - this.startTime;

    // Collect all error lines
    const allErrorLines = [];
    const allTestErrors = [];

    // Root level errors
    for (const [check, result] of Object.entries(rootResults)) {
      if (!result.success && result.errorLines) {
        allErrorLines.push(...result.errorLines.map(line => ({ source: `root:${check}`, line })));
      }
      if (result.testErrors) {
        allTestErrors.push(...result.testErrors.map(error => ({ source: `root:${check}`, ...error })));
      }
    }

    // Package errors
    for (const pkg of packageResults) {
      if (!pkg.tests.success && pkg.tests.errorLines) {
        allErrorLines.push(...pkg.tests.errorLines.map(line => ({ source: `${pkg.package}:test`, line })));
      }
      if (pkg.tests.testErrors) {
        allTestErrors.push(...pkg.tests.testErrors.map(error => ({ source: `${pkg.package}:test`, ...error })));
      }
      
      if (!pkg.build.success && pkg.build.errorLines) {
        allErrorLines.push(...pkg.build.errorLines.map(line => ({ source: `${pkg.package}:build`, line })));
      }
      
      if (!pkg.lint.success && pkg.lint.errorLines) {
        allErrorLines.push(...pkg.lint.errorLines.map(line => ({ source: `${pkg.package}:lint`, line })));
      }
      
      if (!pkg.typeCheck.success && pkg.typeCheck.errorLines) {
        allErrorLines.push(...pkg.typeCheck.errorLines.map(line => ({ source: `${pkg.package}:typeCheck`, line })));
      }
    }

    const report = {
      summary: {
        startTime: new Date(this.startTime).toISOString(),
        endTime: new Date(endTime).toISOString(),
        duration: duration,
        totalErrorLines: allErrorLines.length,
        totalTestErrors: allTestErrors.length,
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
      errorLines: allErrorLines,
      testErrors: allTestErrors
    };

    // Ensure errors directory exists
    const errorsDir = path.dirname(this.reportPath);
    if (!fs.existsSync(errorsDir)) {
      fs.mkdirSync(errorsDir, { recursive: true });
    }

    // Write JSON report
    fs.writeFileSync(this.reportPath, JSON.stringify(report, null, 2));
    this.log(`Focused error report written to: ${this.reportPath}`, 'info');

    // Generate markdown summary
    this.generateFocusedMarkdownSummary(report);
    
    return report;
  }

  generateFocusedMarkdownSummary(report) {
    let markdown = `# Focused Error Report - Error Lines Only\n\n`;
    markdown += `**Generated:** ${new Date().toISOString()}\n`;
    markdown += `**Duration:** ${Math.round(report.summary.duration / 1000)}s\n`;
    markdown += `**Total Error Lines:** ${report.summary.totalErrorLines}\n`;
    markdown += `**Total Test Errors:** ${report.summary.totalTestErrors}\n\n`;

    // Root level summary
    markdown += `## Root Level Status\n\n`;
    markdown += `| Check | Status | Error Lines |\n`;
    markdown += `|-------|--------|-------------|\n`;
    markdown += `| Install | ${report.rootLevel.install.success ? '✅' : '❌'} | ${report.rootLevel.install.errorLines?.length || 0} |\n`;
    markdown += `| Build | ${report.rootLevel.build.success ? '✅' : '❌'} | ${report.rootLevel.build.errorLines?.length || 0} |\n`;
    markdown += `| Test | ${report.rootLevel.test.success ? '✅' : '❌'} | ${report.rootLevel.test.errorLines?.length || 0} |\n`;
    markdown += `| Lint | ${report.rootLevel.lint.success ? '✅' : '❌'} | ${report.rootLevel.lint.errorLines?.length || 0} |\n`;
    markdown += `| Type Check | ${report.rootLevel.typeCheck.success ? '✅' : '❌'} | ${report.rootLevel.typeCheck.errorLines?.length || 0} |\n\n`;

    // Package summary
    markdown += `## Package Status\n\n`;
    markdown += `| Package | Tests | Build | Lint | Type Check |\n`;
    markdown += `|---------|-------|-------|------|------------|\n`;
    
    for (const pkg of report.packages) {
      const testErrors = pkg.tests.errorLines?.length || 0;
      const buildErrors = pkg.build.errorLines?.length || 0;
      const lintErrors = pkg.lint.errorLines?.length || 0;
      const typeErrors = pkg.typeCheck.errorLines?.length || 0;
      
      markdown += `| ${pkg.package} | ${pkg.tests.success ? '✅' : `❌ (${testErrors})`} | ${pkg.build.success ? '✅' : `❌ (${buildErrors})`} | ${pkg.lint.success ? '✅' : `❌ (${lintErrors})`} | ${pkg.typeCheck.success ? '✅' : `❌ (${typeErrors})`} |\n`;
    }
    markdown += `\n`;

    // Error lines only
    if (report.summary.totalErrorLines > 0) {
      markdown += `## Error Lines Only\n\n`;
      
      for (const errorLine of report.errorLines) {
        markdown += `**${errorLine.source}:**\n`;
        markdown += `\`\`\`\n${errorLine.line}\n\`\`\`\n\n`;
      }
    }

    // Test errors
    if (report.summary.totalTestErrors > 0) {
      markdown += `## Unit Test Errors\n\n`;
      
      for (const testError of report.testErrors) {
        markdown += `**${testError.source}:**\n`;
        markdown += `**Message:** ${testError.message}\n\n`;
        
        if (testError.details && testError.details.length > 0) {
          markdown += `**Details:**\n`;
          for (const detail of testError.details) {
            markdown += `- ${detail}\n`;
          }
          markdown += `\n`;
        }
      }
    }

    // Write markdown summary
    fs.writeFileSync(this.summaryPath, markdown);
    this.log(`Focused markdown summary written to: ${this.summaryPath}`, 'info');
  }

  async run() {
    try {
      this.log('Starting enhanced error collection...', 'info');
      
      // Get all packages
      const packagesDir = path.join(process.cwd(), 'packages');
      const packageDirs = fs.readdirSync(packagesDir, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => ({
          package: `@yaseratiar/react-responsive-easy-${dirent.name}`,
          path: path.join(packagesDir, dirent.name)
        }));

      this.packages = packageDirs;
      this.log(`Found ${packageDirs.length} packages to check`, 'info');

      // Collect root level errors
      const rootResults = await this.collectRootLevelErrors();

      // Collect package errors
      const packageResults = [];
      for (const packageInfo of packageDirs) {
        if (this.shouldStop) break;
        const results = await this.collectPackageErrors(packageInfo);
        packageResults.push(results);
      }

      // Generate focused report
      const report = this.generateFocusedReport(packageResults, rootResults);
      
      this.log('Enhanced error collection completed!', 'info');
      this.log(`Total error lines found: ${report.summary.totalErrorLines}`, 'info');
      this.log(`Total test errors found: ${report.summary.totalTestErrors}`, 'info');
      this.log(`Report files: ${this.reportPath}, ${this.summaryPath}`, 'info');

      return report;
    } catch (error) {
      this.log(`Error collection failed: ${error.message}`, 'error');
      throw error;
    }
  }
}

// Run the enhanced error collector
if (require.main === module) {
  const collector = new EnhancedErrorCollector();
  collector.run()
    .then(() => {
      process.exit(0);
    })
    .catch((error) => {
      console.error('Enhanced error collection failed:', error);
      process.exit(1);
    });
}

module.exports = EnhancedErrorCollector;
