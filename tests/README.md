# Testing Documentation

## Overview

This project includes comprehensive test suites to ensure the reliability, performance, and user experience of the Anthropic Style GitHub Page. The tests cover all JavaScript functionality including DOM manipulation, search functionality, code highlighting, clipboard operations, and user interactions.

## Test Structure

### Test Files

- **`setup.js`** - Jest configuration and test utilities
- **`test-utils.js`** - Helper functions for DOM testing and event simulation
- **`scripts.test.js`** - Unit tests for all core functionality
- **`integration.test.js`** - End-to-end user workflow tests
- **`performance.test.js`** - Performance and scalability tests

### Tested Components

1. **Mermaid Integration** - Diagram initialization and configuration
2. **Code Block Processing** - Language detection, syntax highlighting, copy functionality
3. **Reading Progress Indicator** - Scroll tracking and progress display
4. **Back to Top Button** - Visibility logic and smooth scrolling
5. **Search Functionality** - Input debouncing, result display, text highlighting
6. **Clipboard Operations** - Modern API and fallback methods
7. **Event Handling** - Scroll, click, input events
8. **Performance** - Large DOM handling, memory management
9. **Accessibility** - ARIA attributes, keyboard navigation
10. **Cross-browser Compatibility** - Fallback mechanisms

## Running Tests

### Prerequisites

```bash
# Install dependencies
npm install
```

### Test Commands

```bash
# Run all tests
npm test

# Run tests in watch mode (for development)
npm run test:watch

# Run tests with coverage report
npm run test:coverage

# Run specific test file
npx jest scripts.test.js

# Run tests matching a pattern
npx jest --testNamePattern="search"
```

### Coverage Reports

Coverage reports are generated in the `coverage/` directory and include:
- HTML report at `coverage/lcov-report/index.html`
- Text summary in the terminal
- LCOV format for CI integration

## Test Categories

### Unit Tests (`scripts.test.js`)

Tests individual functions in isolation:

- **Language Detection**: Tests for bash, JavaScript, Python, JSON, Markdown
- **Clipboard Functionality**: Modern API, fallback methods, error handling
- **DOM Manipulation**: Element creation, class management, event binding
- **Search Logic**: Query processing, result filtering, text highlighting
- **Progress Calculation**: Scroll position to percentage conversion
- **Utility Functions**: Regular expression escaping, parent element finding

### Integration Tests (`integration.test.js`)

Tests complete user workflows:

- **Page Initialization**: Full app startup sequence
- **Scrolling Behavior**: Progress updates and button visibility
- **Search Workflows**: Input → debounce → results → clear
- **Code Copying**: Button click → clipboard → feedback
- **Error Recovery**: Graceful handling of missing elements
- **Cross-browser Support**: Fallback method testing

### Performance Tests (`performance.test.js`)

Tests scalability and performance:

- **Large DOM Handling**: 100+ elements search performance
- **Memory Management**: No leaks with repeated operations
- **Event Handler Efficiency**: Rapid scroll/input event handling
- **Debounce Effectiveness**: Input rate limiting verification
- **Initialization Speed**: App startup time with large content

## Test Coverage Goals

- **Statements**: > 90%
- **Branches**: > 85%
- **Functions**: > 95%
- **Lines**: > 90%

Current coverage focuses on:
- All exported functions
- Error paths and edge cases
- Cross-browser compatibility scenarios
- Performance under load
- User interaction workflows

## Testing Philosophy

### 1. Test Behavior, Not Implementation

Tests focus on user-observable behavior rather than internal implementation details:

```javascript
// Good: Test the outcome
expect(progressBar.style.width).toBe('50%');

// Avoid: Test internal state
// expect(scrollCalculation).toHaveBeenCalled();
```

### 2. Comprehensive Edge Case Coverage

Tests include edge cases and error conditions:

```javascript
test('should handle missing DOM elements gracefully', () => {
    document.getElementById('progressBar').remove();
    expect(() => updateReadingProgress()).not.toThrow();
});
```

### 3. Real-world Usage Patterns

Tests simulate actual user interactions:

```javascript
test('should complete full search interaction workflow', async () => {
    // User types query → waits for debounce → sees results → clears search
});
```

### 4. Performance Considerations

Tests verify performance characteristics:

```javascript
test('should handle large DOM search efficiently', () => {
    const startTime = performance.now();
    const results = performSearch('query');
    const duration = performance.now() - startTime;
    expect(duration).toBeLessThan(100); // Must complete in < 100ms
});
```

## Mock Strategy

### External Dependencies

- **Mermaid**: Mocked with jest.fn() for initialization tracking
- **Prism.js**: Mocked for syntax highlighting verification
- **Clipboard API**: Mocked with Promise-based responses
- **ScrollTo**: Mocked to verify smooth scrolling calls

### DOM Environment

- **JSDOM**: Provides browser-like environment in Node.js
- **Event Simulation**: Custom utilities for realistic event dispatch
- **Element Creation**: Helper functions for consistent test DOM setup

## Common Testing Patterns

### Async Operations

```javascript
test('should handle async clipboard operations', async () => {
    navigator.clipboard.writeText.mockResolvedValue();
    
    await copyToClipboard('test', mockButton);
    
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('test');
});
```

### Timer-based Operations

```javascript
test('should debounce search input', () => {
    jest.useFakeTimers();
    
    fireEvent.input(searchInput, 'query');
    
    jest.advanceTimersByTime(300);
    
    expect(searchResults.innerHTML).toContain('Found');
    
    jest.useRealTimers();
});
```

### Event Handling

```javascript
test('should respond to scroll events', () => {
    window.pageYOffset = 500;
    fireEvent.scroll(500);
    
    expect(backToTopButton.style.display).toBe('block');
});
```

## Debugging Tests

### Running Individual Tests

```bash
# Run specific test file
npx jest scripts.test.js --verbose

# Run specific test case
npx jest --testNamePattern="clipboard"

# Run tests in debug mode
node --inspect-brk node_modules/.bin/jest --runInBand
```

### Common Issues

1. **Timer-related Tests**: Use `jest.useFakeTimers()` and `jest.advanceTimersByTime()`
2. **Async Operations**: Use `await` or `waitFor` helper
3. **DOM State**: Reset DOM in `beforeEach` hooks
4. **Mock Persistence**: Clear mocks with `jest.clearAllMocks()`

## Adding New Tests

### For New Features

1. **Unit Tests**: Test the function in isolation
2. **Integration Tests**: Test the feature in user workflows  
3. **Performance Tests**: Verify performance characteristics
4. **Accessibility Tests**: Check ARIA attributes and keyboard support

### Test File Structure

```javascript
describe('Feature Name', () => {
    beforeEach(() => {
        // Setup
    });

    describe('Core functionality', () => {
        test('should handle normal case', () => {
            // Test implementation
        });

        test('should handle edge case', () => {
            // Edge case testing
        });
    });

    describe('Error handling', () => {
        test('should recover from errors', () => {
            // Error scenario testing
        });
    });
});
```

## Continuous Integration

Tests are designed to run in CI environments:

- **Fast execution**: Most tests complete in < 5 seconds
- **No external dependencies**: All external APIs are mocked
- **Deterministic**: Tests produce consistent results
- **Environment agnostic**: Work in Node.js, headless browsers

## Contributing

When contributing new features:

1. Add unit tests for all new functions
2. Add integration tests for user-facing features
3. Include edge case and error handling tests
4. Verify performance impact with performance tests
5. Maintain > 90% code coverage
6. Update this documentation for new testing patterns