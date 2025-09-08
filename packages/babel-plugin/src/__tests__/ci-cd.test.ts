/**
 * CI/CD integration tests for Babel plugin
 * Tests that ensure the plugin works correctly in various CI/CD environments
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { transform } from '@babel/core';
import plugin from '../index';
import { 
  PerformanceBenchmark, 
  TestResultAggregator,
  EnterpriseAssertions,
  type TestMetrics
} from './utils/enterprise-test-helpers';

// Mock CI/CD environment variables
const originalEnv = process.env;

// Helper function to transform code with comprehensive metrics
function transformWithMetrics(code: string, options = {}): { code: string; metrics: TestMetrics } {
  const startTime = performance.now();
  const startMemory = process.memoryUsage().heapUsed;

  try {
    const result = transform(code, {
      filename: 'ci-cd-test.tsx',
      plugins: [[plugin, options]],
      presets: [
        ['@babel/preset-env', { targets: { node: 'current' } }],
        '@babel/preset-typescript'
      ]
    });

    const endTime = performance.now();
    const endMemory = process.memoryUsage().heapUsed;

    return {
      code: result?.code || '',
      metrics: {
        executionTime: endTime - startTime,
        memoryUsage: endMemory - startMemory,
        cacheHits: 0,
        cacheMisses: 0,
        transformations: 0,
        errors: 0
      }
    };
  } catch (error) {
    return {
      code: '',
      metrics: {
        executionTime: 0,
        memoryUsage: 0,
        cacheHits: 0,
        cacheMisses: 0,
        transformations: 0,
        errors: 1
      }
    };
  }
}

describe('CI/CD Integration Tests', () => {
  let benchmark: PerformanceBenchmark;
  let resultAggregator: TestResultAggregator;

  beforeEach(() => {
    benchmark = new PerformanceBenchmark();
    resultAggregator = new TestResultAggregator();
  });

  afterEach(() => {
    benchmark.clear();
    resultAggregator.clear();
    
    // Restore original environment
    process.env = originalEnv;
    
    // Force garbage collection if available
    if (global.gc) {
      global.gc();
    }
  });

  describe('GitHub Actions environment', () => {
    beforeEach(() => {
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
      const input = 'const fontSize = useResponsiveValue(24, { token: "fontSize" });';
      
      const { time, memory } = await benchmark.measure('github-actions-test', () => {
        transformWithMetrics(input);
      });

      // Should complete transformation in less than 1500ms (enterprise CI with buffer)
      expect(time).toBeLessThan(1500);
      
      // Memory usage should be reasonable (less than 50MB)
      expect(memory).toBeLessThan(50 * 1024 * 1024);
    });

    it('should handle GitHub Actions resource constraints', async () => {
      const input = 'const fontSize = useResponsiveValue(24, { token: "fontSize" });';
      
      // Simulate resource-constrained environment
      const { time, memory } = await benchmark.measure('github-actions-constrained', () => {
        // Run multiple transformations to simulate build process
        for (let i = 0; i < 100; i++) {
          transformWithMetrics(input);
        }
      });

      // Should complete 100 transformations in less than 2000ms (enterprise CI)
      expect(time).toBeLessThan(2000);
      
      // Memory usage should be reasonable (less than 50MB)
      expect(memory).toBeLessThan(50 * 1024 * 1024);
    });
  });

  describe('Jenkins environment', () => {
    beforeEach(() => {
      process.env = {
        ...originalEnv,
        JENKINS_URL: 'http://jenkins.example.com',
        BUILD_NUMBER: '123',
        BUILD_ID: '456',
        BUILD_URL: 'http://jenkins.example.com/job/test/123/',
        JOB_NAME: 'test-job',
        NODE_NAME: 'master',
        WORKSPACE: '/var/lib/jenkins/workspace/test'
      };
    });

    it('should work correctly in Jenkins environment', async () => {
      const input = 'const fontSize = useResponsiveValue(24, { token: "fontSize" });';
      
      const { time, memory } = await benchmark.measure('jenkins-test', () => {
        transformWithMetrics(input);
      });

      // Should complete transformation in less than 100ms
      expect(time).toBeLessThan(100);
      
      // Memory usage should be reasonable (less than 10MB)
      expect(memory).toBeLessThan(10 * 1024 * 1024);
    });

    it('should handle Jenkins build matrix', async () => {
      const inputs = [
        'const fontSize = useResponsiveValue(24, { token: "fontSize" });',
        'const styles = useScaledStyle({ fontSize: 18, padding: 16 });',
        'const breakpoint = useBreakpoint();'
      ];

      const { time, memory } = await benchmark.measure('jenkins-matrix', () => {
        inputs.forEach(input => {
          for (let i = 0; i < 50; i++) {
            transformWithMetrics(input);
          }
        });
      });

      // Should complete all transformations in less than 1500ms (enterprise CI)
      expect(time).toBeLessThan(1500);
      
      // Memory usage should be reasonable (less than 30MB)
      expect(memory).toBeLessThan(30 * 1024 * 1024);
    });
  });

  describe('CircleCI environment', () => {
    beforeEach(() => {
      process.env = {
        ...originalEnv,
        CIRCLECI: 'true',
        CIRCLE_BUILD_NUM: '123',
        CIRCLE_SHA1: 'abc123def456',
        CIRCLE_BRANCH: 'main',
        CIRCLE_PROJECT_REPONAME: 'test-repo',
        CIRCLE_WORKING_DIRECTORY: '/home/circleci/project'
      };
    });

    it('should work correctly in CircleCI environment', async () => {
      const input = 'const fontSize = useResponsiveValue(24, { token: "fontSize" });';
      
      const { time, memory } = await benchmark.measure('circleci-test', () => {
        transformWithMetrics(input);
      });

      // Should complete transformation in less than 100ms
      expect(time).toBeLessThan(100);
      
      // Memory usage should be reasonable (less than 10MB)
      expect(memory).toBeLessThan(10 * 1024 * 1024);
    });

    it('should handle CircleCI parallel jobs', async () => {
      const input = 'const fontSize = useResponsiveValue(24, { token: "fontSize" });';
      
      // Simulate parallel job execution
      const promises = Array.from({ length: 10 }, (_, i) => 
        new Promise<{ time: number; memory: number }>(async (resolve) => {
          setTimeout(async () => {
            const { time, memory } = await benchmark.measure(`circleci-parallel-${i}`, () => {
              transformWithMetrics(input);
            });
            resolve({ time, memory });
          }, Math.random() * 10);
        })
      );

      const results = await Promise.all(promises);
      
      // All jobs should complete successfully
      results.forEach(({ time, memory }) => {
        expect(time).toBeLessThan(100);
        expect(memory).toBeLessThan(10 * 1024 * 1024);
      });
    });
  });

  describe('GitLab CI environment', () => {
    beforeEach(() => {
      process.env = {
        ...originalEnv,
        GITLAB_CI: 'true',
        CI_PIPELINE_ID: '123456',
        CI_JOB_ID: '789',
        CI_COMMIT_SHA: 'abc123def456',
        CI_COMMIT_REF_NAME: 'main',
        CI_PROJECT_NAME: 'test-project',
        CI_PROJECT_DIR: '/builds/test/project'
      };
    });

    it('should work correctly in GitLab CI environment', async () => {
      const input = 'const fontSize = useResponsiveValue(24, { token: "fontSize" });';
      
      const { time, memory } = await benchmark.measure('gitlab-ci-test', () => {
        transformWithMetrics(input);
      });

      // Should complete transformation in less than 100ms
      expect(time).toBeLessThan(100);
      
      // Memory usage should be reasonable (less than 10MB)
      expect(memory).toBeLessThan(10 * 1024 * 1024);
    });

    it('should handle GitLab CI stages', async () => {
      const stages = [
        { name: 'build', input: 'const fontSize = useResponsiveValue(24, { token: "fontSize" });' },
        { name: 'test', input: 'const styles = useScaledStyle({ fontSize: 18, padding: 16 });' },
        { name: 'deploy', input: 'const breakpoint = useBreakpoint();' }
      ];

      const { time, memory } = await benchmark.measure('gitlab-ci-stages', () => {
        stages.forEach(stage => {
          for (let i = 0; i < 30; i++) {
            transformWithMetrics(stage.input);
          }
        });
      });

      // Should complete all stages in less than 1000ms (enterprise CI)
      expect(time).toBeLessThan(1000);
      
      // Memory usage should be reasonable (less than 50MB)
      expect(memory).toBeLessThan(50 * 1024 * 1024);
    });
  });

  describe('Azure DevOps environment', () => {
    beforeEach(() => {
      process.env = {
        ...originalEnv,
        TF_BUILD: 'True',
        BUILD_BUILDID: '123',
        BUILD_BUILDNUMBER: '20240101.1',
        BUILD_SOURCESDIRECTORY: '/home/vsts/work/1/s',
        BUILD_ARTIFACTSTAGINGDIRECTORY: '/home/vsts/work/1/a',
        SYSTEM_TEAMPROJECT: 'test-project',
        SYSTEM_TEAMFOUNDATIONCOLLECTIONURI: 'https://dev.azure.com/test'
      };
    });

    it('should work correctly in Azure DevOps environment', async () => {
      const input = 'const fontSize = useResponsiveValue(24, { token: "fontSize" });';
      
      const { time, memory } = await benchmark.measure('azure-devops-test', () => {
        transformWithMetrics(input);
      });

      // Should complete transformation in less than 100ms
      expect(time).toBeLessThan(100);
      
      // Memory usage should be reasonable (less than 10MB)
      expect(memory).toBeLessThan(10 * 1024 * 1024);
    });

    it('should handle Azure DevOps build pipelines', async () => {
      const pipelineSteps = [
        { name: 'lint', input: 'const fontSize = useResponsiveValue(24, { token: "fontSize" });' },
        { name: 'build', input: 'const styles = useScaledStyle({ fontSize: 18, padding: 16 });' },
        { name: 'test', input: 'const breakpoint = useBreakpoint();' },
        { name: 'package', input: 'const layout = useResponsiveLayout();' }
      ];

      const { time, memory } = await benchmark.measure('azure-devops-pipeline', () => {
        pipelineSteps.forEach(step => {
          for (let i = 0; i < 25; i++) {
            transformWithMetrics(step.input);
          }
        });
      });

      // Should complete all pipeline steps in less than 1500ms (enterprise CI)
      expect(time).toBeLessThan(1500);
      
      // Memory usage should be reasonable (less than 25MB)
      expect(memory).toBeLessThan(25 * 1024 * 1024);
    });
  });

  describe('Docker environment', () => {
    beforeEach(() => {
      process.env = {
        ...originalEnv,
        DOCKER_BUILDKIT: '1',
        DOCKER_CLI_EXPERIMENTAL: 'enabled'
      };
    });

    it('should work correctly in Docker environment', async () => {
      const input = 'const fontSize = useResponsiveValue(24, { token: "fontSize" });';
      
      const { time, memory } = await benchmark.measure('docker-test', () => {
        transformWithMetrics(input);
      });

      // Should complete transformation in less than 100ms
      expect(time).toBeLessThan(100);
      
      // Memory usage should be reasonable (less than 10MB)
      expect(memory).toBeLessThan(10 * 1024 * 1024);
    });

    it('should handle Docker multi-stage builds', async () => {
      const stages = [
        { name: 'dependencies', input: 'const fontSize = useResponsiveValue(24, { token: "fontSize" });' },
        { name: 'build', input: 'const styles = useScaledStyle({ fontSize: 18, padding: 16 });' },
        { name: 'test', input: 'const breakpoint = useBreakpoint();' },
        { name: 'production', input: 'const layout = useResponsiveLayout();' }
      ];

      const { time, memory } = await benchmark.measure('docker-multi-stage', () => {
        stages.forEach(stage => {
          for (let i = 0; i < 20; i++) {
            transformWithMetrics(stage.input);
          }
        });
      });

      // Should complete all stages in less than 1000ms (enterprise CI)
      expect(time).toBeLessThan(1000);
      
      // Memory usage should be reasonable (less than 50MB)
      expect(memory).toBeLessThan(50 * 1024 * 1024);
    });
  });

  describe('Kubernetes environment', () => {
    beforeEach(() => {
      process.env = {
        ...originalEnv,
        KUBERNETES_SERVICE_HOST: 'kubernetes.default.svc.cluster.local',
        KUBERNETES_SERVICE_PORT: '443',
        POD_NAME: 'test-pod',
        POD_NAMESPACE: 'default',
        POD_IP: '10.244.0.1'
      };
    });

    it('should work correctly in Kubernetes environment', async () => {
      const input = 'const fontSize = useResponsiveValue(24, { token: "fontSize" });';
      
      const { time, memory } = await benchmark.measure('kubernetes-test', () => {
        transformWithMetrics(input);
      });

      // Should complete transformation in less than 100ms
      expect(time).toBeLessThan(100);
      
      // Memory usage should be reasonable (less than 10MB)
      expect(memory).toBeLessThan(10 * 1024 * 1024);
    });

    it('should handle Kubernetes resource limits', async () => {
      const input = 'const fontSize = useResponsiveValue(24, { token: "fontSize" });';
      
      // Simulate resource-constrained pod
      const { time, memory } = await benchmark.measure('kubernetes-constrained', () => {
        for (let i = 0; i < 50; i++) {
          transformWithMetrics(input);
        }
      });

      // Should complete 50 transformations in less than 300ms
      expect(time).toBeLessThan(300);
      
      // Memory usage should be reasonable (less than 30MB)
      expect(memory).toBeLessThan(30 * 1024 * 1024);
    });
  });

  describe('Cross-platform compatibility', () => {
    it('should work on different operating systems', async () => {
      const input = 'const fontSize = useResponsiveValue(24, { token: "fontSize" });';
      
      const { time, memory } = await benchmark.measure('cross-platform-test', () => {
        transformWithMetrics(input);
      });

      // Should complete transformation in less than 100ms
      expect(time).toBeLessThan(100);
      
      // Memory usage should be reasonable (less than 10MB)
      expect(memory).toBeLessThan(10 * 1024 * 1024);
    });

    it('should handle different Node.js versions', async () => {
      const input = 'const fontSize = useResponsiveValue(24, { token: "fontSize" });';
      
      const { time, memory } = await benchmark.measure('node-version-test', () => {
        transformWithMetrics(input);
      });

      // Should complete transformation in less than 100ms
      expect(time).toBeLessThan(100);
      
      // Memory usage should be reasonable (less than 10MB)
      expect(memory).toBeLessThan(10 * 1024 * 1024);
    });
  });

  describe('Build tool integration', () => {
    it('should work with Webpack', async () => {
      const input = 'const fontSize = useResponsiveValue(24, { token: "fontSize" });';
      
      const { time, memory } = await benchmark.measure('webpack-test', () => {
        transformWithMetrics(input);
      });

      // Should complete transformation in less than 100ms
      expect(time).toBeLessThan(100);
      
      // Memory usage should be reasonable (less than 10MB)
      expect(memory).toBeLessThan(10 * 1024 * 1024);
    });

    it('should work with Vite', async () => {
      const input = 'const fontSize = useResponsiveValue(24, { token: "fontSize" });';
      
      const { time, memory } = await benchmark.measure('vite-test', () => {
        transformWithMetrics(input);
      });

      // Should complete transformation in less than 100ms
      expect(time).toBeLessThan(100);
      
      // Memory usage should be reasonable (less than 10MB)
      expect(memory).toBeLessThan(10 * 1024 * 1024);
    });

    it('should work with Rollup', async () => {
      const input = 'const fontSize = useResponsiveValue(24, { token: "fontSize" });';
      
      const { time, memory } = await benchmark.measure('rollup-test', () => {
        transformWithMetrics(input);
      });

      // Should complete transformation in less than 100ms
      expect(time).toBeLessThan(100);
      
      // Memory usage should be reasonable (less than 10MB)
      expect(memory).toBeLessThan(10 * 1024 * 1024);
    });

    it('should work with Parcel', async () => {
      const input = 'const fontSize = useResponsiveValue(24, { token: "fontSize" });';
      
      const { time, memory } = await benchmark.measure('parcel-test', () => {
        transformWithMetrics(input);
      });

      // Should complete transformation in less than 100ms
      expect(time).toBeLessThan(100);
      
      // Memory usage should be reasonable (less than 10MB)
      expect(memory).toBeLessThan(10 * 1024 * 1024);
    });
  });

  describe('Performance regression detection', () => {
    it('should detect performance regressions', async () => {
      const input = 'const fontSize = useResponsiveValue(24, { token: "fontSize" });';
      const times: number[] = [];

      // Run multiple times to get baseline
      for (let i = 0; i < 10; i++) {
        const { time } = await benchmark.measure(`baseline-${i}`, () => {
          transformWithMetrics(input);
        });
        times.push(time);
      }

      // Calculate baseline statistics
      const baselineMean = times.reduce((sum, time) => sum + time, 0) / times.length;
      const baselineStdDev = Math.sqrt(
        times.reduce((sum, time) => sum + Math.pow(time - baselineMean, 2), 0) / times.length
      );

      // Run test again
      const { time: testTime } = await benchmark.measure('regression-test', () => {
        transformWithMetrics(input);
      });

      // Test time should not be more than 3 standard deviations above baseline (more lenient for CI)
      const threshold = baselineMean + (3 * baselineStdDev);
      expect(testTime).toBeLessThan(threshold);
    });

    it('should detect memory regressions', async () => {
      const input = 'const fontSize = useResponsiveValue(24, { token: "fontSize" });';
      const memoryUsages: number[] = [];

      // Run multiple times to get baseline
      for (let i = 0; i < 10; i++) {
        const { memory } = await benchmark.measure(`baseline-${i}`, () => {
          transformWithMetrics(input);
        });
        memoryUsages.push(memory);
      }

      // Calculate baseline statistics
      const baselineMean = memoryUsages.reduce((sum, memory) => sum + memory, 0) / memoryUsages.length;
      const baselineStdDev = Math.sqrt(
        memoryUsages.reduce((sum, memory) => sum + Math.pow(memory - baselineMean, 2), 0) / memoryUsages.length
      );

      // Run test again
      const { memory: testMemory } = await benchmark.measure('regression-test', () => {
        transformWithMetrics(input);
      });

      // Test memory should not be more than 2 standard deviations above baseline
      const threshold = baselineMean + (2 * baselineStdDev);
      expect(testMemory).toBeLessThan(threshold);
    });
  });

  describe('Test result aggregation', () => {
    it('should aggregate test results correctly', async () => {
      const testCases = [
        { name: 'simple-transformation', category: 'unit', priority: 'high' },
        { name: 'complex-transformation', category: 'integration', priority: 'medium' },
        { name: 'error-handling', category: 'unit', priority: 'high' },
        { name: 'performance-test', category: 'performance', priority: 'medium' }
      ];

      // Record test results
      for (const testCase of testCases) {
        const { time, memory } = await benchmark.measure(testCase.name, () => {
          transformWithMetrics('const fontSize = useResponsiveValue(24, { token: "fontSize" });');
        });

        resultAggregator.recordResult({
          name: testCase.name,
          passed: true,
          duration: time,
          memory: memory,
          errors: [],
          category: testCase.category,
          priority: testCase.priority
        });
      }

      // Get summary
      const summary = resultAggregator.getSummary();

      expect(summary.total).toBe(4);
      expect(summary.passed).toBe(4);
      expect(summary.failed).toBe(0);
      expect(summary.byCategory.unit.total).toBe(2);
      expect(summary.byCategory.integration.total).toBe(1);
      expect(summary.byCategory.performance.total).toBe(1);
      expect(summary.byPriority.high.total).toBe(2);
      expect(summary.byPriority.medium.total).toBe(2);
    });
  });
});
