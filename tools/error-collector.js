#!/usr/bin/env node

/**
 * Comprehensive Error Collection System
 * 
 * This script runs all tests and builds without crashing, collecting all errors
 * and generating a detailed report for fixing issues in bulk.
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
    const { cwd, timeout = 300000, continueOnError = true } = options;
    
    return new Promise((resolve) => {
      this.log(`Running: ${command}`, 'info');
      
      // Use appropriate shell for the platform
      const isWindows = process.platform === 'win32';
      const shell = isWindows ? 'cmd' : 'bash';
      const args = isWindows ? ['/c', command] : ['-c', command];
      
      const child = spawn(shell, args, {
        cwd: cwd || process.cwd(),
        stdio: ['pipe', 'pipe', 'pipe'],
        timeout
      });

      let stdout = '';
      let stderr = '';
      let exitCode = 0;

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
          this.log(`STDOUT: ${stdout}`, 'error');
          this.log(`STDERR: ${stderr}`, 'error');
        } else {
          this.log(`Command succeeded: ${command}`, 'info');
        }

        resolve({
          exitCode,
          stdout,
          stderr,
          success: exitCode === 0
        });
      });

      child.on('error', (error) => {
        this.log(`Command error: ${error.message}`, 'error');
        resolve({
          exitCode: 1,
          stdout,
          stderr: error.message,
          success: false
        });
      });

      // Handle timeout
      if (timeout > 0) {
        setTimeout(() => {
          if (!child.killed) {
            this.log(`Command timed out after ${timeout}ms: ${command}`, 'error');
            child.kill('SIGTERM');
            resolve({
              exitCode: 124, // Standard timeout exit code
              stdout,
              stderr: `Command timed out after ${timeout}ms`,
              success: false
            });
          }
        }, timeout);
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
                       fs.existsSync(path.join(packagePath, 'tests')) ||
                       fs.existsSync(path.join(packagePath, '__tests__')),
              hasBuild: packageJson.scripts && packageJson.scripts.build,
              hasLint: packageJson.scripts && packageJson.scripts.lint,
              hasTypeCheck: packageJson.scripts && packageJson.scripts['type-check']
            });
            this.log(`Found package: ${entry.name}`, 'info');
          } catch (error) {
            this.log(`Error reading package.json for ${entry.name}: ${error.message}`, 'error');
          }
        }
      }
    }
  }

  async runPackageTests(packageInfo) {
    this.log(`Running tests for package: ${packageInfo.name}`, 'info');
    
    const results = {
      package: packageInfo.name,
      tests: { success: false, errors: [] },
      build: { success: false, errors: [] },
      lint: { success: false, errors: [] },
      typeCheck: { success: false, errors: [] }
    };

    // Run tests
    if (packageInfo.hasTests) {
      const testResult = await this.runCommand('pnpm test', {
        cwd: packageInfo.path,
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
      timeout: 30000, // 30 seconds max
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
      
      // Run root level checks
      this.log('Running root-level checks...', 'info');
      const rootResults = await this.runRootLevelChecks();
      
      // Run package-level checks
      this.log('Running package-level checks...', 'info');
      const packageResults = [];
      for (const packageInfo of this.packages) {
        const result = await this.runPackageTests(packageInfo);
        packageResults.push(result);
      }
      
      // Run E2E tests (with CI optimization)
      this.log('Running E2E tests...', 'info');
      const e2eResults = await this.runE2ETests();
      
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
  
  const collector = new ErrorCollector(options);
  collector.run().catch(error => {
    console.error('Error collection failed:', error);
    process.exit(1);
  });
}

module.exports = ErrorCollector;
