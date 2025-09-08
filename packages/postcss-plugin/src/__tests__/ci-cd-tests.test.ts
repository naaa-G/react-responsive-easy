/**
 * CI/CD integration tests for PostCSS plugin
 * Tests that ensure the plugin works correctly in various CI/CD environments
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import postcss from 'postcss';
import plugin from '../index';
import type { PostCSSPluginOptions } from '../index';
import {
  processCss,
  generateTestCSS,
  generateComplexCSS,
  measureTimeAsync,
  defaultTestOptions
} from './utils/test-helpers';
import {
  processCssWithMetrics,
  PerformanceBenchmark,
  TestResultAggregator,
  EnterpriseAssertions,
  type TestMetrics
} from './utils/enterprise-test-helpers';

// Mock CI/CD environment variables
const originalEnv = process.env;

describe('CI/CD Integration Tests', () => {
  let benchmark: PerformanceBenchmark;
  let aggregator: TestResultAggregator;

  beforeEach(() => {
    benchmark = new PerformanceBenchmark();
    aggregator = new TestResultAggregator();
  });

  afterEach(() => {
    // Restore original environment
    process.env = originalEnv;
  });

  describe('GitHub Actions Environment', () => {
    beforeEach(() => {
      // Mock GitHub Actions environment
      process.env = {
        ...originalEnv,
        GITHUB_ACTIONS: 'true',
        GITHUB_WORKFLOW: 'test-workflow',
        GITHUB_RUN_ID: '123456',
        GITHUB_RUN_NUMBER: '1',
        GITHUB_REPOSITORY: 'test/repo',
        GITHUB_REF: 'refs/heads/main',
        GITHUB_SHA: 'abc123def456'
      };
    });

    it('should work correctly in GitHub Actions environment', async () => {
      const input = generateTestCSS(50);
      
      const { css, metrics } = processCssWithMetrics(input, defaultTestOptions);
      
      // Should process successfully
      expect(css).toContain('var(--rre-');
      expect(metrics.errors).toBe(0);
      
      // Should meet performance requirements
      EnterpriseAssertions.shouldMeetPerformanceThreshold(metrics, 500);
    });

    it('should handle GitHub Actions resource constraints', async () => {
      const input = generateTestCSS(100);
      
      const { time } = await measureTimeAsync(async () => {
        await processCss(input, defaultTestOptions);
      });
      
      // Should complete within reasonable time in CI environment
      expect(time).toBeLessThan(1000);
    });

    it('should provide consistent results in GitHub Actions', async () => {
      const input = generateTestCSS(25);
      const results: string[] = [];
      
      // Run multiple times to check consistency
      for (let i = 0; i < 5; i++) {
        const output = await processCss(input, defaultTestOptions);
        results.push(output);
      }
      
      // All results should be identical
      const firstResult = results[0];
      for (const result of results) {
        expect(result).toBe(firstResult);
      }
    });
  });

  describe('GitLab CI Environment', () => {
    beforeEach(() => {
      // Mock GitLab CI environment
      process.env = {
        ...originalEnv,
        GITLAB_CI: 'true',
        CI_PROJECT_NAME: 'test-project',
        CI_PIPELINE_ID: '123456',
        CI_COMMIT_SHA: 'abc123def456',
        CI_COMMIT_REF_NAME: 'main',
        CI_RUNNER_DESCRIPTION: 'gitlab-runner'
      };
    });

    it('should work correctly in GitLab CI environment', async () => {
      const input = generateTestCSS(50);
      
      const { css, metrics } = processCssWithMetrics(input, defaultTestOptions);
      
      // Should process successfully
      expect(css).toContain('var(--rre-');
      expect(metrics.errors).toBe(0);
      
      // Should meet performance requirements
      EnterpriseAssertions.shouldMeetPerformanceThreshold(metrics, 500);
    });

    it('should handle GitLab CI resource constraints', async () => {
      const input = generateTestCSS(100);
      
      const { time } = await measureTimeAsync(async () => {
        await processCss(input, defaultTestOptions);
      });
      
      // Should complete within reasonable time in CI environment
      expect(time).toBeLessThan(1000);
    });
  });

  describe('Jenkins Environment', () => {
    beforeEach(() => {
      // Mock Jenkins environment
      process.env = {
        ...originalEnv,
        JENKINS_URL: 'http://jenkins.example.com',
        BUILD_NUMBER: '123',
        BUILD_ID: '123',
        BUILD_URL: 'http://jenkins.example.com/job/test/123',
        JOB_NAME: 'test-job',
        NODE_NAME: 'master',
        WORKSPACE: '/var/lib/jenkins/workspace/test'
      };
    });

    it('should work correctly in Jenkins environment', async () => {
      const input = generateTestCSS(50);
      
      const { css, metrics } = processCssWithMetrics(input, defaultTestOptions);
      
      // Should process successfully
      expect(css).toContain('var(--rre-');
      expect(metrics.errors).toBe(0);
      
      // Should meet performance requirements
      EnterpriseAssertions.shouldMeetPerformanceThreshold(metrics, 500);
    });

    it('should handle Jenkins resource constraints', async () => {
      const input = generateTestCSS(100);
      
      const { time } = await measureTimeAsync(async () => {
        await processCss(input, defaultTestOptions);
      });
      
      // Should complete within reasonable time in CI environment
      expect(time).toBeLessThan(1000);
    });
  });

  describe('CircleCI Environment', () => {
    beforeEach(() => {
      // Mock CircleCI environment
      process.env = {
        ...originalEnv,
        CIRCLECI: 'true',
        CIRCLE_PROJECT_REPONAME: 'test-repo',
        CIRCLE_BUILD_NUM: '123',
        CIRCLE_SHA1: 'abc123def456',
        CIRCLE_BRANCH: 'main',
        CIRCLE_NODE_INDEX: '0',
        CIRCLE_NODE_TOTAL: '1'
      };
    });

    it('should work correctly in CircleCI environment', async () => {
      const input = generateTestCSS(50);
      
      const { css, metrics } = processCssWithMetrics(input, defaultTestOptions);
      
      // Should process successfully
      expect(css).toContain('var(--rre-');
      expect(metrics.errors).toBe(0);
      
      // Should meet performance requirements
      EnterpriseAssertions.shouldMeetPerformanceThreshold(metrics, 500);
    });

    it('should handle CircleCI resource constraints', async () => {
      const input = generateTestCSS(100);
      
      const { time } = await measureTimeAsync(async () => {
        await processCss(input, defaultTestOptions);
      });
      
      // Should complete within reasonable time in CI environment
      expect(time).toBeLessThan(1000);
    });
  });

  describe('Travis CI Environment', () => {
    beforeEach(() => {
      // Mock Travis CI environment
      process.env = {
        ...originalEnv,
        TRAVIS: 'true',
        TRAVIS_REPO_SLUG: 'test/repo',
        TRAVIS_BUILD_NUMBER: '123',
        TRAVIS_COMMIT: 'abc123def456',
        TRAVIS_BRANCH: 'main',
        TRAVIS_NODE_VERSION: '16'
      };
    });

    it('should work correctly in Travis CI environment', async () => {
      const input = generateTestCSS(50);
      
      const { css, metrics } = processCssWithMetrics(input, defaultTestOptions);
      
      // Should process successfully
      expect(css).toContain('var(--rre-');
      expect(metrics.errors).toBe(0);
      
      // Should meet performance requirements
      EnterpriseAssertions.shouldMeetPerformanceThreshold(metrics, 500);
    });

    it('should handle Travis CI resource constraints', async () => {
      const input = generateTestCSS(100);
      
      const { time } = await measureTimeAsync(async () => {
        await processCss(input, defaultTestOptions);
      });
      
      // Should complete within reasonable time in CI environment
      expect(time).toBeLessThan(1000);
    });
  });

  describe('Azure DevOps Environment', () => {
    beforeEach(() => {
      // Mock Azure DevOps environment
      process.env = {
        ...originalEnv,
        TF_BUILD: 'True',
        BUILD_BUILDID: '123',
        BUILD_SOURCESDIRECTORY: '/home/vsts/work/1/s',
        BUILD_REPOSITORY_NAME: 'test-repo',
        BUILD_SOURCEBRANCH: 'refs/heads/main',
        BUILD_SOURCEVERSION: 'abc123def456'
      };
    });

    it('should work correctly in Azure DevOps environment', async () => {
      const input = generateTestCSS(50);
      
      const { css, metrics } = processCssWithMetrics(input, defaultTestOptions);
      
      // Should process successfully
      expect(css).toContain('var(--rre-');
      expect(metrics.errors).toBe(0);
      
      // Should meet performance requirements
      EnterpriseAssertions.shouldMeetPerformanceThreshold(metrics, 500);
    });

    it('should handle Azure DevOps resource constraints', async () => {
      const input = generateTestCSS(100);
      
      const { time } = await measureTimeAsync(async () => {
        await processCss(input, defaultTestOptions);
      });
      
      // Should complete within reasonable time in CI environment
      expect(time).toBeLessThan(1000);
    });
  });

  describe('Local Development Environment', () => {
    beforeEach(() => {
      // Mock local development environment
      process.env = {
        ...originalEnv,
        NODE_ENV: 'development',
        USER: 'developer',
        HOME: '/home/developer',
        PWD: '/home/developer/project'
      };
    });

    it('should work correctly in local development environment', async () => {
      const input = generateTestCSS(50);
      
      const { css, metrics } = processCssWithMetrics(input, defaultTestOptions);
      
      // Should process successfully
      expect(css).toContain('var(--rre-');
      expect(metrics.errors).toBe(0);
      
      // Should meet performance requirements
      EnterpriseAssertions.shouldMeetPerformanceThreshold(metrics, 500);
    });

    it('should handle local development resource constraints', async () => {
      const input = generateTestCSS(100);
      
      const { time } = await measureTimeAsync(async () => {
        await processCss(input, defaultTestOptions);
      });
      
      // Should complete within reasonable time in local environment
      expect(time).toBeLessThan(1000);
    });
  });

  describe('Production Environment', () => {
    beforeEach(() => {
      // Mock production environment
      process.env = {
        ...originalEnv,
        NODE_ENV: 'production',
        PORT: '3000',
        HOST: '0.0.0.0'
      };
    });

    it('should work correctly in production environment', async () => {
      const input = generateTestCSS(50);
      
      const { css, metrics } = processCssWithMetrics(input, defaultTestOptions);
      
      // Should process successfully
      expect(css).toContain('var(--rre-');
      expect(metrics.errors).toBe(0);
      
      // Should meet performance requirements
      EnterpriseAssertions.shouldMeetPerformanceThreshold(metrics, 500);
    });

    it('should handle production resource constraints', async () => {
      const input = generateTestCSS(100);
      
      const { time } = await measureTimeAsync(async () => {
        await processCss(input, defaultTestOptions);
      });
      
      // Should complete within reasonable time in production environment
      expect(time).toBeLessThan(1000);
    });
  });

  describe('CI/CD Performance Benchmarks', () => {
    it('should meet CI/CD performance requirements', async () => {
      const input = generateTestCSS(100);
      
      const { metrics } = await benchmark.measure('ci-cd-performance', async () => {
        await processCss(input, defaultTestOptions);
      }, 5);
      
      // Should meet CI/CD performance thresholds
      expect(metrics.executionTime).toBeLessThan(500);
    });

    it('should provide consistent performance across environments', async () => {
      const input = generateTestCSS(50);
      const results: TestMetrics[] = [];
      
      // Test in different simulated environments
      const environments = [
        { name: 'github-actions', env: { GITHUB_ACTIONS: 'true' } },
        { name: 'gitlab-ci', env: { GITLAB_CI: 'true' } },
        { name: 'jenkins', env: { JENKINS_URL: 'http://jenkins.example.com' } },
        { name: 'circleci', env: { CIRCLECI: 'true' } },
        { name: 'travis', env: { TRAVIS: 'true' } }
      ];
      
      for (const env of environments) {
        process.env = { ...originalEnv, ...env.env };
        
        const { metrics } = processCssWithMetrics(input, defaultTestOptions);
        results.push(metrics);
      }
      
      // All environments should perform similarly
      const times = results.map(r => r.executionTime);
      const avgTime = times.reduce((sum, time) => sum + time, 0) / times.length;
      const maxTime = Math.max(...times);
      const minTime = Math.min(...times);
      
      // Max time should not be more than 3x the min time (allow for system variations)
      expect(maxTime).toBeLessThan(minTime * 3);
      
      // Average time should be reasonable
      expect(avgTime).toBeLessThan(200);
    });
  });

  describe('CI/CD Error Handling', () => {
    it('should handle errors gracefully in CI/CD environments', async () => {
      const input = `
        .valid { font-size: rre(16); }
        .malformed { font-size: rre(); }
        .another-valid { padding: rre(12); }
      `;
      
      const { css, errors } = processCssWithMetrics(input, defaultTestOptions);
      
      // Should not throw errors
      expect(errors).toHaveLength(0);
      
      // Should process valid parts
      expect(css).toContain('var(--rre-font-size)');
      expect(css).toContain('var(--rre-padding)');
    });

    it('should provide meaningful error messages in CI/CD', async () => {
      const input = `
        .test { font-size: rre(16); }
        .malformed { font-size: rre(); }
      `;
      
      const { css, errors } = processCssWithMetrics(input, defaultTestOptions);
      
      // Should not throw errors
      expect(errors).toHaveLength(0);
      
      // Should preserve malformed parts
      expect(css).toContain('rre()');
    });
  });

  describe('CI/CD Test Aggregation', () => {
    it('should aggregate test results correctly', async () => {
      const testCases = [
        { name: 'test-1', input: generateTestCSS(10), expected: true },
        { name: 'test-2', input: generateTestCSS(20), expected: true },
        { name: 'test-3', input: generateTestCSS(30), expected: true }
      ];
      
      for (const testCase of testCases) {
        const { css, metrics } = processCssWithMetrics(testCase.input, defaultTestOptions);
        const passed = css.includes('var(--rre-') && metrics.errors === 0;
        
        aggregator.recordResult(testCase.name, passed, metrics);
      }
      
      const summary = aggregator.getSummary();
      
      expect(summary.totalTests).toBe(3);
      expect(summary.totalPassed).toBe(3);
      expect(summary.totalFailed).toBe(0);
      expect(summary.averageExecutionTime).toBeGreaterThan(0);
    });

    it('should track performance metrics across CI/CD runs', async () => {
      const input = generateTestCSS(50);
      
      // Simulate multiple CI/CD runs
      for (let i = 0; i < 10; i++) {
        const { css, metrics } = processCssWithMetrics(input, defaultTestOptions);
        const passed = css.includes('var(--rre-') && metrics.errors === 0;
        
        aggregator.recordResult(`run-${i}`, passed, metrics);
      }
      
      const summary = aggregator.getSummary();
      
      expect(summary.totalTests).toBe(10);
      expect(summary.totalPassed).toBe(10);
      expect(summary.totalFailed).toBe(0);
      expect(summary.averageExecutionTime).toBeGreaterThan(0);
      expect(summary.averageMemoryUsage).toBeGreaterThanOrEqual(0);
    });
  });

  describe('CI/CD Configuration Tests', () => {
    it('should work with different CI/CD configurations', async () => {
      const input = generateTestCSS(50);
      
      const configs: PostCSSPluginOptions[] = [
        { generateCustomProperties: true, generateCustomMedia: true },
        { generateCustomProperties: true, generateCustomMedia: false },
        { generateCustomProperties: false, generateCustomMedia: true },
        { generateCustomProperties: false, generateCustomMedia: false },
        { customPropertyPrefix: '--ci-cd' },
        { development: true },
        { development: false }
      ];
      
      for (const config of configs) {
        const { css, metrics } = processCssWithMetrics(input, config);
        
        // Should not throw errors
        expect(metrics.errors).toBe(0);
        
        // Should generate valid CSS
        expect(css).toBeDefined();
        expect(css.length).toBeGreaterThan(0);
      }
    });

    it('should handle CI/CD environment-specific configurations', async () => {
      const input = generateTestCSS(50);
      
      // Test with CI-specific configuration
      const ciConfig: PostCSSPluginOptions = {
        ...defaultTestOptions,
        development: process.env.NODE_ENV === 'development'
      };
      
      const { css, metrics } = processCssWithMetrics(input, ciConfig);
      
      // Should process successfully
      expect(css).toContain('var(--rre-');
      expect(metrics.errors).toBe(0);
    });
  });

  describe('CI/CD Integration Validation', () => {
    it('should validate CI/CD integration requirements', async () => {
      const input = generateTestCSS(100);
      
      const { css, metrics } = processCssWithMetrics(input, defaultTestOptions);
      
      // Should meet CI/CD requirements
      expect(css).toContain('var(--rre-');
      expect(metrics.errors).toBe(0);
      expect(metrics.executionTime).toBeLessThan(1000);
      expect(metrics.memoryUsage).toBeLessThan(50 * 1024 * 1024);
    });

    it('should provide CI/CD-compatible output', async () => {
      const input = generateTestCSS(50);
      
      const { css, metrics } = processCssWithMetrics(input, defaultTestOptions);
      
      // Should generate valid CSS
      expect(css).toContain(':root');
      expect(css).toContain('@media');
      expect(css).toContain('var(--rre-');
      
      // Should have reasonable metrics
      expect(metrics.transformations).toBeGreaterThan(0);
      expect(metrics.customPropertiesGenerated).toBeGreaterThan(0);
      expect(metrics.mediaQueriesGenerated).toBeGreaterThan(0);
    });
  });
});
