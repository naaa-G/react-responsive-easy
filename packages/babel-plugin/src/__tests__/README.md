# Babel Plugin Test Suite

This directory contains comprehensive tests for the `@react-responsive-easy/babel-plugin` package, following enterprise-grade testing practices.

## Test Structure

### Core Test Files

- **`babel-plugin.test.ts`** - Main plugin functionality tests
- **`transformation.test.ts`** - Transformation logic and edge cases
- **`integration.test.ts`** - Real-world usage scenarios
- **`performance.test.ts`** - Performance benchmarks and optimization tests
- **`fixtures.test.ts`** - Component fixture-based tests
- **`snapshots.test.ts`** - Snapshot tests for consistent output
- **`stress.test.ts`** - Stress tests and memory leak detection
- **`ci-cd.test.ts`** - CI/CD integration tests

### Component-Specific Tests

- **`cache-manager.test.ts`** - Cache management functionality
- **`scaling-engine.test.ts`** - Value scaling calculations
- **`hook-transformers.test.ts`** - Hook transformation logic
- **`config-loader.test.ts`** - Configuration loading and validation

### Test Utilities

- **`utils/test-helpers.ts`** - Basic test utilities and helpers
- **`utils/enterprise-test-helpers.ts`** - Enterprise-grade testing utilities
- **`setup.ts`** - Test setup and configuration

## Test Categories

### 1. Unit Tests
Test individual functions and components in isolation.

```typescript
describe('ScalingEngine', () => {
  it('should scale values correctly based on width ratio', () => {
    // Test individual scaling function
  });
});
```

### 2. Integration Tests
Test how different components work together.

```typescript
describe('Integration Tests', () => {
  it('should transform a complete React component', () => {
    // Test full component transformation
  });
});
```

### 3. Performance Tests
Measure and validate performance characteristics.

```typescript
describe('Performance Tests', () => {
  it('should transform simple useResponsiveValue calls quickly', () => {
    // Performance benchmark
  });
});
```

### 4. Stress Tests
Test behavior under extreme conditions.

```typescript
describe('Stress Tests', () => {
  it('should handle 1000 simple transformations efficiently', () => {
    // Stress test with high volume
  });
});
```

### 5. CI/CD Tests
Test compatibility with various CI/CD environments.

```typescript
describe('CI/CD Integration Tests', () => {
  it('should work correctly in GitHub Actions environment', () => {
    // CI/CD environment test
  });
});
```

## Test Utilities

### Enterprise Test Helpers

The `enterprise-test-helpers.ts` file provides advanced testing utilities:

#### Performance Benchmarking
```typescript
const benchmark = new PerformanceBenchmark();

const { time, memory } = await benchmark.measure('test-name', () => {
  // Your test code here
});
```

#### Memory Leak Detection
```typescript
const memoryDetector = new MemoryLeakDetector();

memoryDetector.takeSnapshot('initial');
// Perform operations
memoryDetector.takeSnapshot('final');

const leaks = memoryDetector.detectLeaks();
expect(leaks).toHaveLength(0);
```

#### Test Data Generation
```typescript
const responsiveValues = TestDataGenerator.generateResponsiveValues(10);
const styleObjects = TestDataGenerator.generateStyleObjects(5);
const complexComponents = TestDataGenerator.generateComplexComponents(3);
```

#### Enterprise Assertions
```typescript
EnterpriseAssertions.shouldTransform(output);
EnterpriseAssertions.shouldMeetPerformanceThreshold(metrics, 100);
EnterpriseAssertions.shouldMeetMemoryThreshold(metrics, 1024 * 1024);
```

## Running Tests

### Run All Tests
```bash
npm test
```

### Run Specific Test Categories
```bash
# Unit tests only
npm test -- --grep "Unit Tests"

# Performance tests only
npm test -- --grep "Performance Tests"

# Stress tests only
npm test -- --grep "Stress Tests"
```

### Run with Coverage
```bash
npm run test:coverage
```

### Run in Watch Mode
```bash
npm run test:watch
```

## Test Configuration

### Environment Variables

The tests support various environment variables for configuration:

- `TEST_PERFORMANCE_THRESHOLD` - Performance threshold in milliseconds
- `TEST_MEMORY_THRESHOLD` - Memory threshold in bytes
- `TEST_STRESS_ITERATIONS` - Number of iterations for stress tests
- `TEST_CI_ENVIRONMENT` - CI environment (github, jenkins, circleci, etc.)

### Test Presets

The tests use several configuration presets:

```typescript
const testConfigs = {
  development: {
    precompute: true,
    development: true,
    addComments: true,
    validateConfig: true
  },
  production: {
    precompute: true,
    development: false,
    addComments: false,
    validateConfig: false
  },
  performance: {
    precompute: true,
    enableCaching: true,
    cacheSize: 10000,
    enableMemoization: true
  }
};
```

## Test Data

### Fixtures

The test suite includes various fixtures for different scenarios:

- **Button Component** - Simple button with responsive values
- **Card Component** - Complex card with multiple responsive properties
- **Navigation Component** - Navigation with responsive layout
- **Form Component** - Form with responsive validation
- **Dashboard Layout** - Complex dashboard with responsive grid
- **Modal Component** - Modal with responsive animations

### Test Data Generation

The `TestDataGenerator` class provides methods to generate test data:

```typescript
// Generate responsive values
const values = TestDataGenerator.generateResponsiveValues(10);

// Generate style objects
const styles = TestDataGenerator.generateStyleObjects(5);

// Generate complex components
const components = TestDataGenerator.generateComplexComponents(3);

// Generate large input files
const largeInput = TestDataGenerator.generateLargeInput(1000);

// Generate malformed inputs for error testing
const malformedInputs = TestDataGenerator.generateMalformedInputs();
```

## Performance Benchmarks

### Baseline Performance

The test suite establishes baseline performance metrics:

- **Simple transformations**: < 10ms
- **Complex transformations**: < 30ms
- **Large input files**: < 100ms
- **Memory usage**: < 10MB per transformation

### Performance Regression Detection

The tests automatically detect performance regressions by:

1. Running baseline measurements
2. Calculating statistical thresholds
3. Comparing new measurements against thresholds
4. Failing tests that exceed thresholds

## Memory Management

### Memory Leak Detection

The test suite includes comprehensive memory leak detection:

1. **Snapshot-based detection** - Takes memory snapshots at key points
2. **Threshold-based detection** - Detects significant memory increases
3. **Garbage collection testing** - Ensures proper cleanup
4. **Long-running tests** - Tests memory stability over time

### Memory Optimization

Tests validate memory optimization features:

- **Cache eviction** - Ensures cache doesn't grow indefinitely
- **Resource cleanup** - Verifies proper cleanup after transformations
- **Memory efficiency** - Validates reasonable memory usage

## Error Handling

### Error Scenarios

The tests cover various error scenarios:

- **Malformed inputs** - Invalid syntax and structure
- **Missing dependencies** - Missing required modules
- **Configuration errors** - Invalid configuration options
- **Memory errors** - Out of memory conditions
- **Timeout errors** - Long-running operations

### Error Recovery

Tests validate error recovery mechanisms:

- **Graceful degradation** - Plugin continues working despite errors
- **Error reporting** - Proper error messages and logging
- **Resource cleanup** - Cleanup after errors
- **State consistency** - Maintains consistent state after errors

## CI/CD Integration

### Supported Environments

The tests support various CI/CD environments:

- **GitHub Actions** - GitHub's CI/CD platform
- **Jenkins** - Open-source automation server
- **CircleCI** - Cloud-based CI/CD platform
- **GitLab CI** - GitLab's integrated CI/CD
- **Azure DevOps** - Microsoft's DevOps platform

### Environment-Specific Tests

Each CI/CD environment has specific tests:

- **Resource constraints** - Tests under limited resources
- **Parallel execution** - Tests concurrent operations
- **Build matrix** - Tests different configurations
- **Pipeline stages** - Tests different build stages

## Test Reporting

### Coverage Reports

The test suite generates comprehensive coverage reports:

- **Line coverage** - Percentage of lines executed
- **Branch coverage** - Percentage of branches tested
- **Function coverage** - Percentage of functions called
- **Statement coverage** - Percentage of statements executed

### Performance Reports

Performance tests generate detailed reports:

- **Execution time** - Time taken for each test
- **Memory usage** - Memory consumed during tests
- **Cache performance** - Cache hit/miss ratios
- **Transformation counts** - Number of transformations performed

### Test Results

The test suite provides detailed result aggregation:

- **Test summary** - Overall test results
- **Category breakdown** - Results by test category
- **Priority analysis** - Results by test priority
- **Performance metrics** - Performance statistics

## Best Practices

### Writing Tests

1. **Use descriptive test names** - Clear, specific test descriptions
2. **Follow AAA pattern** - Arrange, Act, Assert
3. **Test edge cases** - Include boundary conditions
4. **Mock external dependencies** - Isolate units under test
5. **Use data-driven tests** - Test multiple scenarios

### Performance Testing

1. **Establish baselines** - Set performance benchmarks
2. **Test under load** - Validate performance under stress
3. **Monitor memory usage** - Detect memory leaks
4. **Measure consistently** - Use consistent measurement methods
5. **Document thresholds** - Document performance expectations

### Error Testing

1. **Test error conditions** - Validate error handling
2. **Test recovery** - Ensure graceful recovery
3. **Test logging** - Verify proper error logging
4. **Test user experience** - Ensure good error messages
5. **Test edge cases** - Cover unusual scenarios

## Troubleshooting

### Common Issues

1. **Test timeouts** - Increase timeout values for slow tests
2. **Memory issues** - Check for memory leaks in tests
3. **Flaky tests** - Make tests more deterministic
4. **Performance regressions** - Update performance thresholds
5. **CI/CD failures** - Check environment-specific issues

### Debugging

1. **Enable verbose logging** - Use `--verbose` flag
2. **Run individual tests** - Use `--grep` to run specific tests
3. **Check test data** - Verify test input data
4. **Monitor resources** - Watch memory and CPU usage
5. **Review test output** - Check test result details

## Contributing

### Adding New Tests

1. **Follow naming conventions** - Use descriptive test names
2. **Add to appropriate category** - Place tests in correct category
3. **Include documentation** - Document test purpose and approach
4. **Update coverage** - Ensure new code is covered
5. **Validate performance** - Check performance impact

### Test Maintenance

1. **Keep tests updated** - Update tests when code changes
2. **Remove obsolete tests** - Remove tests for removed features
3. **Optimize test performance** - Improve slow tests
4. **Update documentation** - Keep test docs current
5. **Review test coverage** - Ensure adequate coverage

## Resources

### Documentation

- [Vitest Documentation](https://vitest.dev/)
- [Babel Plugin Handbook](https://babeljs.io/docs/en/plugin-handbook)
- [Testing Best Practices](https://testingjavascript.com/)

### Tools

- [Vitest](https://vitest.dev/) - Test runner
- [@babel/core](https://babeljs.io/docs/en/babel-core) - Babel core
- [@babel/preset-env](https://babeljs.io/docs/en/babel-preset-env) - Babel preset
- [@babel/preset-typescript](https://babeljs.io/docs/en/babel-preset-typescript) - TypeScript preset

### Examples

- [Test Examples](./examples/) - Example test implementations
- [Fixture Examples](./fixtures/) - Example test fixtures
- [Utility Examples](./utils/) - Example test utilities
