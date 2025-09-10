#!/usr/bin/env node

/**
 * Enterprise Test Runner
 * 
 * Provides robust test execution with proper resource management,
 * error handling, and reporting for monorepo environments.
 */

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

// Test configuration
const TEST_CONFIG = {
  packages: [
    '@yaseratiar/react-responsive-easy-core',
    '@yaseratiar/react-responsive-easy-ai-optimizer', 
    '@yaseratiar/react-responsive-easy-performance-dashboard',
    '@yaseratiar/react-responsive-easy-babel-plugin',
    '@yaseratiar/react-responsive-easy-cli',
    '@yaseratiar/react-responsive-easy-postcss-plugin',
    '@yaseratiar/react-responsive-easy-storybook-addon',
    '@yaseratiar/react-responsive-easy-vite-plugin',
    '@yaseratiar/react-responsive-easy-next-plugin'
  ],
  maxConcurrency: 2, // Limit concurrent test runs
  timeout: 300000, // 5 minutes per package
  retries: 2
};

class TestRunner {
  constructor() {
    this.results = [];
    this.startTime = Date.now();
  }

  async runTests() {
    console.log('🚀 Starting Enterprise Test Suite');
    console.log(`📦 Testing ${TEST_CONFIG.packages.length} packages`);
    console.log(`⚡ Max concurrency: ${TEST_CONFIG.maxConcurrency}`);
    console.log('');

    // Run tests in batches to avoid resource conflicts
    const batches = this.createBatches(TEST_CONFIG.packages, TEST_CONFIG.maxConcurrency);
    
    for (let i = 0; i < batches.length; i++) {
      const batch = batches[i];
      console.log(`\n🔄 Running batch ${i + 1}/${batches.length} (${batch.length} packages)`);
      
      await this.runBatch(batch);
    }

    this.printSummary();
    return this.getExitCode();
  }

  createBatches(packages, maxConcurrency) {
    const batches = [];
    for (let i = 0; i < packages.length; i += maxConcurrency) {
      batches.push(packages.slice(i, i + maxConcurrency));
    }
    return batches;
  }

  async runBatch(packages) {
    const promises = packages.map(pkg => this.runPackageTest(pkg));
    await Promise.all(promises);
  }

  async runPackageTest(packageName) {
    const startTime = Date.now();
    const result = {
      package: packageName,
      status: 'pending',
      duration: 0,
      error: null,
      output: ''
    };

    try {
      console.log(`  ⏳ Testing ${packageName}...`);
      
      const output = execSync(`pnpm --filter=${packageName} test`, {
        encoding: 'utf8',
        timeout: TEST_CONFIG.timeout,
        stdio: 'pipe'
      });

      result.status = 'passed';
      result.duration = Date.now() - startTime;
      result.output = output;
      
      console.log(`  ✅ ${packageName} passed (${this.formatDuration(result.duration)})`);
      
    } catch (error) {
      result.status = 'failed';
      result.duration = Date.now() - startTime;
      result.error = error.message;
      result.output = error.stdout || error.stderr || '';
      
      console.log(`  ❌ ${packageName} failed (${this.formatDuration(result.duration)})`);
      
      // Retry logic
      if (TEST_CONFIG.retries > 0) {
        console.log(`  🔄 Retrying ${packageName}...`);
        TEST_CONFIG.retries--;
        return this.runPackageTest(packageName);
      }
    }

    this.results.push(result);
  }

  printSummary() {
    const totalDuration = Date.now() - this.startTime;
    const passed = this.results.filter(r => r.status === 'passed').length;
    const failed = this.results.filter(r => r.status === 'failed').length;
    
    console.log('\n' + '='.repeat(60));
    console.log('📊 TEST SUMMARY');
    console.log('='.repeat(60));
    console.log(`⏱️  Total Duration: ${this.formatDuration(totalDuration)}`);
    console.log(`✅ Passed: ${passed}`);
    console.log(`❌ Failed: ${failed}`);
    console.log(`📦 Total Packages: ${this.results.length}`);
    
    if (failed > 0) {
      console.log('\n❌ FAILED PACKAGES:');
      this.results
        .filter(r => r.status === 'failed')
        .forEach(r => {
          console.log(`  • ${r.package} (${this.formatDuration(r.duration)})`);
          if (r.error) {
            console.log(`    Error: ${r.error.split('\n')[0]}`);
          }
        });
    }
    
    console.log('='.repeat(60));
  }

  getExitCode() {
    const failed = this.results.filter(r => r.status === 'failed').length;
    return failed > 0 ? 1 : 0;
  }

  formatDuration(ms) {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    
    if (minutes > 0) {
      return `${minutes}m ${remainingSeconds}s`;
    }
    return `${remainingSeconds}s`;
  }
}

// Run the test suite
if (require.main === module) {
  const runner = new TestRunner();
  runner.runTests()
    .then(exitCode => {
      process.exit(exitCode);
    })
    .catch(error => {
      console.error('💥 Test runner failed:', error);
      process.exit(1);
    });
}

module.exports = TestRunner;
