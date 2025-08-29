# 🧪 Testing Suite Documentation

This directory contains the comprehensive testing infrastructure for React Responsive Easy, ensuring quality, performance, and reliability across all packages.

## 📁 Test Structure

```
tests/
├── e2e/                          # End-to-end tests
│   ├── responsive-hooks.spec.ts  # Responsive hooks behavior
│   ├── visual-regression.spec.ts # UI consistency tests
│   └── performance.spec.ts       # Performance benchmarks
├── unit/                         # Unit tests (in each package)
├── integration/                  # Integration tests
└── README.md                     # This file
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- pnpm 8+
- Git

### Running Tests

```bash
# Install dependencies
pnpm install

# Run all unit tests
pnpm test

# Run E2E tests
pnpm test:e2e

# Run specific test suites
pnpm test:visual        # Visual regression tests
pnpm test:performance   # Performance tests

# Run tests with UI (interactive)
pnpm test:e2e:ui

# Run tests with coverage
pnpm test:coverage
```

## 🧪 Test Categories

### 1. Unit Tests

**Location**: `packages/*/src/__tests__/`

**Purpose**: Test individual functions and components in isolation

**Coverage**:
- ✅ Core scaling engine algorithms
- ✅ React hooks behavior
- ✅ Utility functions
- ✅ Type definitions
- ✅ Error handling

**Example**:
```typescript
describe('ScalingEngine', () => {
  it('should scale values correctly', () => {
    const engine = new ScalingEngine(config);
    const result = engine.scale(24, 'fontSize');
    expect(result).toBe(20);
  });
});
```

### 2. Integration Tests

**Location**: `packages/*/src/__tests__/`

**Purpose**: Test how components work together

**Coverage**:
- ✅ Provider + Hooks integration
- ✅ Context propagation
- ✅ SSR compatibility
- ✅ Breakpoint detection

### 3. End-to-End Tests

**Location**: `tests/e2e/`

**Purpose**: Test complete user workflows in real browsers

**Coverage**:
- ✅ Responsive behavior across breakpoints
- ✅ Visual consistency
- ✅ Performance metrics
- ✅ Accessibility standards

**Technologies**: Playwright, Cross-browser testing

### 4. Visual Regression Tests

**Location**: `tests/e2e/visual-regression.spec.ts`

**Purpose**: Ensure UI consistency across different screen sizes

**Features**:
- Screenshot comparison
- Layout validation
- Typography scaling
- Interactive element accessibility

### 5. Performance Tests

**Location**: `tests/e2e/performance.spec.ts`

**Purpose**: Validate performance targets and catch regressions

**Metrics**:
- Scaling computation time (< 1ms)
- Memory usage (< 10MB increase)
- Bundle size limits
- Core Web Vitals

## 🔧 Test Configuration

### Playwright Configuration

```typescript
// playwright.config.ts
export default defineConfig({
  testDir: './tests/e2e',
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
    { name: 'Mobile Chrome', use: { ...devices['Pixel 5'] } },
    { name: 'Mobile Safari', use: { ...devices['iPhone 12'] } }
  ]
});
```

### CI/CD Pipeline

**File**: `.github/workflows/test.yml`

**Jobs**:
- Unit Tests (Node 18, 20, 22)
- Build Tests
- E2E Tests
- Cross-browser Tests
- Performance Tests
- Bundle Analysis
- Security Audit
- Test Coverage

## 📊 Test Coverage

### Current Coverage

- **Core Package**: 95%+
- **CLI Package**: 90%+
- **Plugin Packages**: 85%+
- **Overall**: 90%+

### Coverage Goals

- **Unit Tests**: 95%+
- **Integration Tests**: 90%+
- **E2E Tests**: 80%+
- **Performance Tests**: 100%

## 🎯 Test Scenarios

### Responsive Behavior

1. **Breakpoint Detection**
   - Desktop (1920x1080)
   - Tablet (768x1024)
   - Mobile (390x844)

2. **Scaling Validation**
   - Font size scaling
   - Spacing adjustments
   - Layout adaptations
   - Touch target sizes

3. **Performance Benchmarks**
   - Scaling computation speed
   - Memory usage patterns
   - Bundle size limits
   - Cache efficiency

### Accessibility Testing

1. **Screen Reader Support**
   - ARIA labels
   - Semantic markup
   - Focus management

2. **Touch Accessibility**
   - Minimum tap target size (44x44px)
   - Touch-friendly spacing
   - Gesture support

3. **Visual Accessibility**
   - Color contrast
   - Font readability
   - Layout consistency

## 🚨 Common Test Issues

### 1. Timing Issues

**Problem**: Tests fail due to async operations not completing

**Solution**: Use proper wait conditions
```typescript
// ❌ Bad
await page.waitForTimeout(1000);

// ✅ Good
await page.waitForSelector('[data-testid="element"]');
await page.waitForLoadState('networkidle');
```

### 2. Flaky Tests

**Problem**: Tests pass/fail inconsistently

**Solution**: Add retry logic and stable selectors
```typescript
// Use stable test IDs
await page.locator('[data-testid="hero-title"]').click();

// Add retry for flaky operations
await expect(page.locator('.element')).toBeVisible({ timeout: 10000 });
```

### 3. Cross-browser Differences

**Problem**: Tests pass in one browser but fail in another

**Solution**: Use browser-specific assertions
```typescript
test('should work in all browsers', async ({ page, browserName }) => {
  if (browserName === 'webkit') {
    // Safari-specific logic
  } else if (browserName === 'firefox') {
    // Firefox-specific logic
  }
});
```

## 📈 Performance Testing

### Metrics to Monitor

1. **Scaling Engine**
   - Computation time per value
   - Cache hit rate
   - Memory usage per operation

2. **React Performance**
   - Re-render frequency
   - Hook execution time
   - Context update speed

3. **Bundle Impact**
   - Core package size
   - Tree-shaking efficiency
   - Runtime overhead

### Performance Targets

- **Scaling Computation**: < 1ms
- **Memory Increase**: < 10MB
- **Bundle Size**: < 15KB (core)
- **LCP**: < 2.5s
- **Layout Shifts**: < 5

## 🔍 Debugging Tests

### Playwright Debug Mode

```bash
# Run tests in debug mode
npx playwright test --debug

# Run specific test with UI
npx playwright test --ui

# Generate trace files
npx playwright test --trace on
```

### Visual Debugging

```bash
# Take screenshots on failure
npx playwright test --screenshot=only-on-failure

# Record videos
npx playwright test --video=retain-on-failure

# Generate HTML report
npx playwright show-report
```

### Console Debugging

```typescript
// Add debug logging
test('should scale correctly', async ({ page }) => {
  console.log('Starting test...');
  
  // Your test code here
  
  console.log('Test completed successfully');
});
```

## 📝 Writing New Tests

### Test Structure

```typescript
import { test, expect } from '@playwright/test';

test.describe('Feature Name', () => {
  test.beforeEach(async ({ page }) => {
    // Setup code
    await page.goto('/');
    await page.waitForSelector('[data-testid="app"]');
  });

  test('should behave correctly', async ({ page }) => {
    // Arrange
    const element = page.locator('[data-testid="element"]');
    
    // Act
    await element.click();
    
    // Assert
    await expect(element).toHaveText('Expected Text');
  });
});
```

### Best Practices

1. **Use Descriptive Names**
   ```typescript
   // ❌ Bad
   test('test 1', async ({ page }) => {});
   
   // ✅ Good
   test('should scale font size from 24px to 20px on mobile', async ({ page }) => {});
   ```

2. **Test One Thing at a Time**
   ```typescript
   // ❌ Bad
   test('should handle everything', async ({ page }) => {
     // Multiple assertions and behaviors
   });
   
   // ✅ Good
   test('should scale font size correctly', async ({ page }) => {
     // Single focused test
   });
   ```

3. **Use Stable Selectors**
   ```typescript
   // ❌ Bad
   await page.locator('.button').click();
   
   // ✅ Good
   await page.locator('[data-testid="hero-button"]').click();
   ```

## 🚀 Continuous Integration

### GitHub Actions

The CI pipeline runs automatically on:
- Push to main/develop branches
- Pull requests
- Manual workflow dispatch

### Pre-commit Hooks

```bash
# Install husky
pnpm add -D husky

# Add pre-commit hook
npx husky add .husky/pre-commit "pnpm lint && pnpm test"
```

### Local Pre-flight Checks

```bash
# Run before committing
pnpm lint          # Check code quality
pnpm type-check    # Verify TypeScript
pnpm test          # Run unit tests
pnpm test:e2e      # Run E2E tests (optional)
```

## 📚 Additional Resources

- [Playwright Documentation](https://playwright.dev/)
- [Testing Best Practices](https://playwright.dev/docs/best-practices)
- [Visual Testing Guide](https://playwright.dev/docs/test-screenshots)
- [Performance Testing](https://playwright.dev/docs/test-performance)

## 🤝 Contributing to Tests

1. **Follow Test Patterns**: Use existing test structure and naming conventions
2. **Add Coverage**: Ensure new features have corresponding tests
3. **Update Documentation**: Keep this README current with new test types
4. **Performance**: Monitor test execution time and optimize slow tests
5. **Reliability**: Write stable, non-flaky tests

---

**Remember**: Good tests are the foundation of reliable software. Write tests that are:
- **Fast**: Execute quickly
- **Reliable**: Don't flake
- **Maintainable**: Easy to understand and modify
- **Comprehensive**: Cover all important scenarios
