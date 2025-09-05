# React Responsive Easy Browser Extension - Test Suite

This directory contains a comprehensive test suite for the React Responsive Easy Browser Extension, following enterprise-grade testing best practices.

## 📁 Test Structure

```
src/__tests__/
├── setup.ts                    # Test setup and mocks
├── global-setup.ts             # Global test setup
├── global-teardown.ts          # Global test teardown
├── core/                       # Unit tests for core components
│   └── ResponsiveDebugger.test.ts
├── background/                 # Unit tests for background script
│   └── background.test.ts
├── content/                    # Unit tests for content script
│   └── content-script.test.ts
├── popup/                      # Unit tests for popup interface
│   └── popup.test.ts
├── integration/                # Integration tests
│   └── extension-integration.test.ts
└── README.md                   # This file
```

## 🧪 Test Categories

### Unit Tests
- **ResponsiveDebugger**: Core debugging engine functionality
- **BackgroundScript**: Extension lifecycle and message handling
- **ContentScript**: Page interaction and debugger integration
- **PopupController**: User interface and data management

### Integration Tests
- **Extension Integration**: Cross-component communication and workflows
- **State Synchronization**: Data flow between components
- **Error Handling**: Graceful error handling across the extension
- **Performance Monitoring**: Performance data collection and analysis

## 🚀 Running Tests

### All Tests
```bash
npm test
```

### Watch Mode
```bash
npm run test:watch
```

### Coverage Report
```bash
npm run test:coverage
```

### CI Mode
```bash
npm run test:ci
```

### Unit Tests Only
```bash
npm run test:unit
```

### Integration Tests Only
```bash
npm run test:integration
```

### Debug Mode
```bash
npm run test:debug
```

## 📊 Coverage Requirements

The test suite enforces enterprise-grade coverage thresholds:

- **Global Coverage**: 80% minimum for branches, functions, lines, and statements
- **Core Components**: 90% minimum coverage (ResponsiveDebugger)
- **Background Script**: 85% minimum coverage

## 🔧 Test Configuration

### Jest Configuration
- **Environment**: jsdom (simulates browser environment)
- **Setup**: Custom setup file with Chrome API mocks
- **Transform**: TypeScript and Babel support
- **Coverage**: HTML, LCOV, and JSON reporters
- **Timeout**: 10 seconds per test

### Mock Strategy
- **Chrome APIs**: Complete mock of Chrome extension APIs
- **DOM APIs**: Mocked browser APIs (ResizeObserver, MutationObserver, etc.)
- **Performance APIs**: Mocked performance measurement
- **React Integration**: Mocked React DevTools hooks

## 🎯 Test Utilities

### Mock Helpers
- `createMockElement()`: Create mock DOM elements
- `createMockResponsiveElement()`: Create responsive elements with data attributes
- `createMockBreakpointInfo()`: Create breakpoint information
- `createMockExtensionState()`: Create extension state objects
- `createMockExtensionSettings()`: Create settings objects

### Custom Matchers
- `toBeValidBreakpointInfo()`: Validate breakpoint information structure
- `toBeValidResponsiveElementInfo()`: Validate responsive element information
- `toBeValidExtensionState()`: Validate extension state structure

## 🏗️ Test Architecture

### Setup Phase
1. **Global Setup**: Initialize test environment
2. **Mock Configuration**: Set up Chrome API and DOM mocks
3. **Test Isolation**: Each test runs in isolation with fresh mocks

### Test Execution
1. **Arrange**: Set up test data and mocks
2. **Act**: Execute the code under test
3. **Assert**: Verify expected behavior and outcomes

### Cleanup Phase
1. **Mock Reset**: Clear all mocks between tests
2. **DOM Cleanup**: Remove test elements from DOM
3. **Memory Cleanup**: Clear references and prevent leaks

## 🔍 Testing Patterns

### Unit Testing
- **Single Responsibility**: Each test focuses on one specific behavior
- **Isolation**: Tests don't depend on external state
- **Deterministic**: Tests produce consistent results
- **Fast Execution**: Unit tests run quickly

### Integration Testing
- **Component Interaction**: Test how components work together
- **Data Flow**: Verify data flows correctly between components
- **Error Propagation**: Test error handling across boundaries
- **End-to-End Workflows**: Test complete user scenarios

### Mock Strategy
- **Chrome APIs**: Comprehensive mocking of extension APIs
- **DOM APIs**: Mock browser APIs for consistent testing
- **External Dependencies**: Mock all external dependencies
- **Time-based Functions**: Mock timers and intervals

## 🚨 Error Handling Tests

### API Errors
- Chrome API failures
- Network communication errors
- Storage operation failures

### DOM Errors
- Element not found
- Invalid DOM operations
- Style calculation errors

### Runtime Errors
- Memory allocation failures
- Performance measurement errors
- Observer setup failures

## 📈 Performance Testing

### Memory Management
- Memory leak detection
- Garbage collection verification
- Resource cleanup validation

### Performance Monitoring
- Render time measurement
- Memory usage tracking
- Layout shift risk assessment

## 🔒 Security Testing

### Message Validation
- Secure message passing
- Input sanitization
- Permission validation

### Data Integrity
- State consistency
- Data persistence
- Export/import validation

## 🎨 UI Testing

### DOM Manipulation
- Element creation and removal
- Style application
- Event handling

### User Interactions
- Button clicks
- Form submissions
- Keyboard shortcuts

## 📝 Best Practices

### Test Naming
- Use descriptive test names
- Follow the pattern: "should [expected behavior] when [condition]"
- Group related tests in describe blocks

### Test Organization
- One test per behavior
- Clear setup and teardown
- Minimal test data

### Assertions
- Use specific assertions
- Test both positive and negative cases
- Verify side effects

### Mock Management
- Reset mocks between tests
- Use realistic mock data
- Verify mock interactions

## 🐛 Debugging Tests

### Common Issues
- **Async Operations**: Use proper async/await patterns
- **Mock Setup**: Ensure mocks are properly configured
- **DOM State**: Clean up DOM between tests
- **Memory Leaks**: Verify proper cleanup

### Debug Tools
- `--detectOpenHandles`: Detect open handles
- `--forceExit`: Force exit after tests
- `--verbose`: Detailed test output
- `--no-cache`: Disable Jest cache

## 📚 Additional Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Chrome Extension Testing](https://developer.chrome.com/docs/extensions/mv3/testing/)
- [Testing Best Practices](https://testingjavascript.com/)
- [Mock Service Worker](https://mswjs.io/) (for future API mocking)

## 🤝 Contributing

When adding new tests:

1. Follow the existing test structure
2. Use appropriate test utilities
3. Maintain coverage thresholds
4. Add integration tests for new features
5. Update this README if needed

## 📋 Test Checklist

Before submitting code:

- [ ] All tests pass
- [ ] Coverage thresholds met
- [ ] No memory leaks
- [ ] Error cases covered
- [ ] Integration tests updated
- [ ] Documentation updated

