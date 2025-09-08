# PostCSS Plugin Test Suite

This directory contains comprehensive tests for the `@react-responsive-easy/postcss-plugin` package, following enterprise-grade testing practices.

## Test Structure

### Core Test Files

- **`postcss-plugin.test.ts`** - Legacy tests for backward compatibility
- **`unit-tests.test.ts`** - Unit tests for core plugin functionality
- **`integration-tests.test.ts`** - Integration tests for real-world scenarios
- **`performance-tests.test.ts`** - Performance benchmarks and optimization tests
- **`stress-tests.test.ts`** - Stress tests and memory leak detection
- **`ci-cd-tests.test.ts`** - CI/CD integration tests
- **`snapshot-tests.test.ts`** - Snapshot tests for consistent output validation
- **`error-handling-tests.test.ts`** - Comprehensive error handling tests

### Test Utilities

- **`utils/test-helpers.ts`** - Basic test utilities and helpers
- **`utils/enterprise-test-helpers.ts`** - Enterprise-grade testing utilities
- **`setup.ts`** - Test setup and configuration
- **`index.test.ts`** - Main test index file

## Test Categories

### 1. Unit Tests
Test individual functions and components in isolation.

```typescript
describe('Basic rre() Function Processing', () => {
  it('should transform simple rre() function calls', async () => {
    // Test individual transformation function
  });
});
```

### 2. Integration Tests
Test how different components work together in real-world scenarios.

```typescript
describe('Real-World Component Scenarios', () => {
  it('should process a complete component stylesheet', async () => {
    // Test full component transformation
  });
});
```

### 3. Performance Tests
Measure and validate performance characteristics.

```typescript
describe('Performance Benchmarks', () => {
  it('should benchmark simple transformations', async () => {
    // Performance benchmark
  });
});
```

### 4. Stress Tests
Test behavior under extreme conditions.

```typescript
describe('High Volume Processing', () => {
  it('should handle 1000 simple transformations efficiently', async () => {
    // Stress test with high volume
  });
});
```

### 5. CI/CD Tests
Test compatibility with various CI/CD environments.

```typescript
describe('GitHub Actions Environment', () => {
  it('should work correctly in GitHub Actions environment', async () => {
    // CI/CD environment test
  });
});
```

### 6. Snapshot Tests
Test for consistent CSS output validation.

```typescript
describe('Basic CSS Transformations', () => {
  it('should generate consistent output for simple rre() functions', async () => {
    expect(output).toMatchSnapshot('simple-rre-functions');
  });
});
```

### 7. Error Handling Tests
Test comprehensive error handling and edge cases.

```typescript
describe('Malformed rre() Function Calls', () => {
  it('should handle empty rre() calls gracefully', async () => {
    // Error handling test
  });
});
```

## Test Utilities

### Basic Test Helpers

The `test-helpers.ts` file provides basic testing utilities:

#### CSS Processing
```typescript
const output = await processCss(input, options);
const { css, warnings, errors } = await processCssWithWarnings(input, options);
```

#### Test Data Generation
```typescript
const testCSS = generateTestCSS(10);
const complexCSS = generateComplexCSS();
const malformedCSS = generateMalformedCSS();
const largeCSS = generateLargeCSS(1000);
```

#### CSS Analysis
```typescript
const count = countOccurrences(css, /rre\(/g);
const customProps = extractCustomProperties(css);
const mediaQueries = extractMediaQueries(css);
const functions = extractRreFunctions(css);
```

#### CSS Validation
```typescript
const validation = validateCSS(css);
expect(validation.valid).toBe(true);
```

### Enterprise Test Helpers

The `enterprise-test-helpers.ts` file provides advanced testing utilities:

#### Performance Benchmarking
```typescript
const benchmark = new PerformanceBenchmark();

const { metrics } = await benchmark.measure('test-name', async () => {
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
const responsiveCSS = TestDataGenerator.generateResponsiveCSS(10);
const complexCSS = TestDataGenerator.generateComplexCSS();
const malformedCSS = TestDataGenerator.generateMalformedCSS();
const largeCSS = TestDataGenerator.generateLargeCSS();
```

#### Enterprise Assertions
```typescript
EnterpriseAssertions.shouldTransform(output, ['var(--rre-', ':root']);
EnterpriseAssertions.shouldMeetPerformanceThreshold(metrics, 100);
EnterpriseAssertions.shouldMeetMemoryThreshold(metrics, 1024 * 1024);
```

#### CSS Validation
```typescript
const validation = CSSValidator.validateSyntax(css);
const customPropsValidation = CSSValidator.validateCustomProperties(css);
```

#### Test Result Aggregation
```typescript
const aggregator = new TestResultAggregator();

aggregator.recordResult('test-name', passed, metrics);
const summary = aggregator.getSummary();
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

# Integration tests only
npm test -- --grep "Integration Tests"

# CI/CD tests only
npm test -- --grep "CI/CD"

# Snapshot tests only
npm test -- --grep "Snapshot Tests"

# Error handling tests only
npm test -- --grep "Error Handling"
```

### Run Tests with Debug Output
```bash
DEBUG_TESTS=true npm test
```

### Run Tests in Watch Mode
```bash
npm run test:watch
```

### Run Tests with Coverage
```bash
npm run test:coverage
```

## Test Configuration

### Environment Variables

- `DEBUG_TESTS` - Enable debug output during tests
- `NODE_ENV` - Set to 'test' for test environment
- `CI` - Set to 'true' for CI environment detection

### Test Options

```typescript
const defaultTestOptions: PostCSSPluginOptions = {
  generateCustomProperties: true,
  generateCustomMedia: true,
  customPropertyPrefix: '--rre',
  development: false
};

const developmentTestOptions: PostCSSPluginOptions = {
  ...defaultTestOptions,
  development: true
};

const productionTestOptions: PostCSSPluginOptions = {
  ...defaultTestOptions,
  development: false
};
```

## Test Coverage

The test suite aims for comprehensive coverage including:

- **Function Coverage**: All plugin functions are tested
- **Branch Coverage**: All conditional branches are tested
- **Line Coverage**: All code lines are executed
- **Statement Coverage**: All statements are executed
- **Edge Case Coverage**: Edge cases and error conditions are tested

## Performance Benchmarks

The test suite includes performance benchmarks for:

- **Small CSS**: < 50ms for 5 rules
- **Medium CSS**: < 200ms for 50 rules
- **Large CSS**: < 1000ms for 200 rules
- **Complex CSS**: < 500ms for complex scenarios
- **Memory Usage**: < 50MB for large CSS processing

## CI/CD Integration

The test suite is designed to work in various CI/CD environments:

- **GitHub Actions**
- **GitLab CI**
- **Jenkins**
- **CircleCI**
- **Travis CI**
- **Azure DevOps**

## Best Practices

### Test Organization
- Group related tests in describe blocks
- Use descriptive test names
- Follow AAA pattern (Arrange, Act, Assert)
- Keep tests focused and atomic

### Error Handling
- Test both success and failure scenarios
- Verify error messages and context
- Test graceful degradation
- Validate error recovery

### Performance Testing
- Set realistic performance thresholds
- Test under various conditions
- Monitor memory usage
- Detect memory leaks

### Snapshot Testing
- Use snapshots for output validation
- Update snapshots when behavior changes
- Test different configurations
- Validate regression prevention

## Contributing

When adding new tests:

1. Follow the existing test structure
2. Use appropriate test utilities
3. Add performance benchmarks if applicable
4. Include error handling tests
5. Update documentation
6. Ensure CI/CD compatibility

## Troubleshooting

### Common Issues

#### Tests Failing
- Check test environment setup
- Verify dependencies are installed
- Check for environment-specific issues
- Review test configuration

#### Performance Issues
- Check system resources
- Verify test data size
- Review performance thresholds
- Check for memory leaks

#### Snapshot Mismatches
- Review changes to plugin behavior
- Update snapshots if changes are intentional
- Check for environment differences
- Verify test data consistency

### Debug Commands

```bash
# Run specific test with debug output
DEBUG_TESTS=true npm test -- --grep "specific test"

# Run tests with verbose output
npm test -- --verbose

# Run tests with coverage report
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [PostCSS Documentation](https://postcss.org/)
- [Testing Best Practices](https://testingjavascript.com/)
- [Performance Testing Guide](https://web.dev/performance-testing/)
