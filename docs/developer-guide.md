# Developer Guide

This comprehensive guide provides everything you need to understand, modify, and extend the Anthropic Style GitHub Page codebase. Whether you're fixing bugs, adding features, or adapting the code for your own projects, this guide will get you started quickly.

## Table of Contents

- [Development Setup](#development-setup)
- [Project Architecture](#project-architecture)
- [Code Organization](#code-organization)
- [Customization Guide](#customization-guide)
- [Adding New Features](#adding-new-features)
- [Testing and Quality Assurance](#testing-and-quality-assurance)
- [Performance Optimization](#performance-optimization)
- [Debugging Guide](#debugging-guide)
- [Best Practices](#best-practices)

## Development Setup

### Prerequisites

Before you begin development, ensure you have:

- **Node.js 16+**: For running tests and development tools
- **Modern browser**: Chrome, Firefox, Safari, or Edge for testing
- **Code editor**: VS Code, Sublime Text, or your preferred editor
- **Git**: For version control and collaboration

### Quick Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd anthropic-style-github-page
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development**
   ```bash
   # Open in browser
   open index.html
   
   # Or serve locally
   npx http-server . -p 8080
   ```

4. **Run tests**
   ```bash
   npm test
   ```

### Development Workflow

#### Recommended Development Process
1. **Create feature branch** from main
2. **Make incremental changes** with frequent testing
3. **Run tests** after each significant change
4. **Test across browsers** before finalizing
5. **Update documentation** as needed
6. **Submit pull request** with descriptive commit messages

#### File Watching and Live Reload
```bash
# Use live-server for automatic reloading
npm install -g live-server
live-server . --port=8080 --browser=chrome
```

## Project Architecture

### High-Level Structure

The project follows a **component-based architecture** with clear separation of concerns:

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Presentation  │    │   Behavior      │    │   Structure     │
│   (styles.css)  │◄───┤  (scripts.js)   │◄───┤  (index.html)   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         ▲                       ▲                       ▲
         │                       │                       │
         │              ┌─────────────────┐              │
         └──────────────┤  External Libs  ├──────────────┘
                        │ (Mermaid/Prism) │
                        └─────────────────┘
```

### Architectural Principles

#### 1. **Progressive Enhancement**
- Core content works without JavaScript
- Interactive features layer on top
- Graceful degradation for older browsers

#### 2. **Modular Design**
- Each feature is self-contained
- Functions can be tested independently  
- Easy to add or remove functionality

#### 3. **Performance First**
- Minimal external dependencies
- Efficient DOM manipulation
- Debounced user interactions

#### 4. **Accessibility Built-in**
- Semantic HTML structure
- ARIA attributes where needed
- Keyboard navigation support

### Core Components

#### 1. **Document Structure (index.html)**
- Semantic HTML5 markup
- Progressive enhancement baseline
- Accessible navigation structure

#### 2. **Visual Design (styles.css)**
- Modern CSS with fallbacks
- Responsive grid layout
- Component-based styling

#### 3. **Interactive Behavior (scripts.js)**
- Vanilla JavaScript (no frameworks)
- Event-driven architecture
- Modular function design

#### 4. **Testing Infrastructure (tests/)**
- Jest-based test suite
- Unit and integration tests
- Performance benchmarks

## Code Organization

### JavaScript Structure

The main `scripts.js` file is organized into logical sections:

```javascript
// 1. INITIALIZATION
document.addEventListener('DOMContentLoaded', function() {
    // Setup external libraries
    // Initialize core features
    // Bind event handlers
});

// 2. CODE BLOCK MANAGEMENT
function initializeCodeBlocks() { ... }
function detectLanguage(code) { ... }
function copyToClipboard(text, button) { ... }

// 3. SEARCH FUNCTIONALITY  
function performSearch() { ... }
function displaySearchResults(results, query) { ... }
function highlightText(text, query) { ... }

// 4. UI COMPONENTS
function initializeReadingProgress() { ... }
// Back to top button (inline)

// 5. UTILITY FUNCTIONS
function escapeRegExp(string) { ... }
function clearSearchResults() { ... }
```

#### Function Organization Principles
- **Single Responsibility**: Each function has one clear purpose
- **Pure Functions**: Utility functions avoid side effects when possible
- **Clear Naming**: Function names describe their exact behavior
- **Comprehensive Documentation**: JSDoc comments for all functions

### CSS Architecture

The stylesheet follows a **component-based approach**:

```css
/* 1. RESET AND GLOBALS */
* { box-sizing: border-box; }
html { scroll-behavior: smooth; }
body { font-family: ...; }

/* 2. LAYOUT COMPONENTS */
.content-wrapper { display: grid; }
.sidebar { position: sticky; }
.main-content { min-width: 0; }

/* 3. INTERACTIVE ELEMENTS */
.search-container { position: relative; }
.copy-button { position: absolute; }
.back-to-top { position: fixed; }

/* 4. RESPONSIVE DESIGN */
@media (max-width: 768px) { ... }
```

#### CSS Best Practices Used
- **Mobile-first responsive design**
- **BEM-inspired class naming**
- **CSS custom properties for themes**
- **Performance-optimized selectors**

### HTML Structure

The document follows **semantic HTML5** principles:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <!-- Meta and external resources -->
</head>
<body>
    <!-- Progress indicator -->
    <header><!-- Page title --></header>
    <main>
        <div class="content-wrapper">
            <aside class="sidebar">
                <!-- Navigation and search -->
            </aside>
            <div class="main-content">
                <!-- Article content -->
            </div>
        </div>
    </main>
    <footer><!-- Copyright --></footer>
    <script><!-- Inline scripts --></script>
</body>
</html>
```

## Customization Guide

### Changing Visual Design

#### Color Scheme
Modify the CSS custom properties for consistent theming:

```css
:root {
  --primary-color: #3b82f6;      /* Links and accents */
  --background-color: #ffffff;    /* Main background */
  --text-color: #1a1a1a;        /* Body text */
  --border-color: #e5e7eb;      /* Borders and dividers */
  --code-background: #f1f5f9;    /* Code block backgrounds */
}
```

#### Typography
Update font stacks in the body selector:

```css
body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 
                 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell',
                 'Fira Sans', 'Droid Sans', 'Helvetica Neue', 
                 sans-serif;
    font-size: 16px;
    line-height: 1.6;
}
```

#### Layout Adjustments
Modify the grid layout for different sidebar/content ratios:

```css
.content-wrapper {
    display: grid;
    grid-template-columns: 300px 1fr;  /* Wider sidebar */
    gap: 4em;                          /* More spacing */
}
```

### Customizing Behavior

#### Search Configuration
Adjust search behavior constants in `scripts.js`:

```javascript
// Search behavior constants
const SEARCH_DEBOUNCE_MS = 300;    // Typing delay
const MAX_SEARCH_RESULTS = 5;      // Results limit
const MIN_QUERY_LENGTH = 2;        // Minimum characters
```

#### Progress Bar Behavior
Modify the back-to-top button threshold:

```javascript
// Show button after scrolling 300px
if (window.pageYOffset > 300) {
    backToTopButton.style.display = 'block';
}
```

#### Language Detection
Add new language patterns to `detectLanguage()`:

```javascript
function detectLanguage(code) {
    // Add new language detection
    if (code.includes('<?php') || code.includes('$_')) {
        return 'php';
    }
    // ... existing detection logic
}
```

### Content Customization

#### Navigation Structure
Update the sidebar navigation in `index.html`:

```html
<nav class="nav-section">
    <h3>Your Section</h3>
    <ul>
        <li><a href="#your-anchor">Your Topic</a></li>
        <!-- Add more navigation items -->
    </ul>
</nav>
```

#### Adding New Sections
1. **Add content** to the main content area
2. **Create heading** with unique ID: `<h2 id="unique-id">Title</h2>`
3. **Update navigation** to include new section
4. **Test search** to ensure new content is indexed

## Adding New Features

### Feature Development Process

#### 1. Planning Phase
- **Define requirements** clearly
- **Consider user experience** implications  
- **Plan testing strategy** early
- **Review existing patterns** for consistency

#### 2. Implementation Phase
- **Start with HTML structure** if needed
- **Add CSS styling** following existing patterns
- **Implement JavaScript** with error handling
- **Test incrementally** during development

#### 3. Integration Phase
- **Test across browsers** and devices
- **Verify accessibility** compliance
- **Run full test suite** to prevent regressions
- **Update documentation** as needed

### Example: Adding a Dark Mode Toggle

#### Step 1: HTML Structure
```html
<div class="theme-toggle">
    <button id="themeToggle" aria-label="Toggle dark mode">
        🌓
    </button>
</div>
```

#### Step 2: CSS Styling  
```css
/* Light theme (default) */
:root {
    --bg-color: #ffffff;
    --text-color: #1a1a1a;
}

/* Dark theme */
[data-theme="dark"] {
    --bg-color: #1a1a1a;
    --text-color: #ffffff;
}

.theme-toggle {
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 1000;
}
```

#### Step 3: JavaScript Implementation
```javascript
function initializeThemeToggle() {
    const toggleButton = document.getElementById('themeToggle');
    if (!toggleButton) return;

    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);

    // Toggle functionality
    toggleButton.addEventListener('click', function() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    });
}

// Add to main initialization
document.addEventListener('DOMContentLoaded', function() {
    // ... existing initialization
    initializeThemeToggle();
});
```

#### Step 4: Testing
```javascript
// Add to test suite
describe('Theme Toggle', () => {
    test('should toggle theme attribute', () => {
        const button = document.getElementById('themeToggle');
        fireEvent.click(button);
        
        expect(document.documentElement.getAttribute('data-theme'))
            .toBe('dark');
    });

    test('should persist theme preference', () => {
        // Test localStorage integration
    });
});
```

### Feature Integration Checklist

- [ ] **HTML**: Semantic structure with accessibility attributes
- [ ] **CSS**: Responsive styling following existing patterns
- [ ] **JavaScript**: Error handling and graceful degradation
- [ ] **Testing**: Unit tests and integration tests
- [ ] **Documentation**: Update relevant documentation files
- [ ] **Cross-browser**: Test in multiple browsers
- [ ] **Performance**: Verify no significant performance impact

## Testing and Quality Assurance

### Testing Strategy

The project uses **comprehensive testing** to ensure reliability:

#### Test Categories
1. **Unit Tests**: Individual function testing
2. **Integration Tests**: Feature workflow testing
3. **Performance Tests**: Load and speed testing
4. **Accessibility Tests**: ARIA and keyboard testing

#### Running Tests
```bash
# Run all tests
npm test

# Watch mode for development
npm run test:watch

# Coverage report
npm run test:coverage

# Specific test files
npx jest scripts.test.js
npx jest integration.test.js
```

### Writing Tests

#### Unit Test Example
```javascript
describe('detectLanguage', () => {
    test('should detect bash from shebang', () => {
        const code = '#!/bin/bash\necho "hello"';
        expect(detectLanguage(code)).toBe('bash');
    });

    test('should detect JSON from structure', () => {
        const code = '{"hooks": "PreToolUse"}';
        expect(detectLanguage(code)).toBe('json');
    });
});
```

#### Integration Test Example
```javascript
describe('Search Workflow', () => {
    test('should complete full search interaction', async () => {
        // Setup DOM
        const searchInput = createSearchInput();
        const searchResults = createSearchResults();

        // User interaction
        fireEvent.input(searchInput, { target: { value: 'test' } });

        // Wait for debounce
        await waitFor(() => {
            expect(searchResults.innerHTML).toContain('Found');
        });

        // Verify results
        expect(searchResults.querySelectorAll('.search-result'))
            .toHaveLength.greaterThan(0);
    });
});
```

### Quality Standards

#### Code Coverage Requirements
- **Statements**: > 90%
- **Branches**: > 85%
- **Functions**: > 95%
- **Lines**: > 90%

#### Performance Benchmarks
- **Initial load**: < 1 second
- **Search response**: < 100ms
- **Scroll performance**: 60fps maintained
- **Memory usage**: < 10MB typical

## Performance Optimization

### Frontend Performance

#### JavaScript Optimization
- **Debounced events**: Prevent excessive function calls
- **DOM caching**: Store element references
- **Event delegation**: Minimize event listeners
- **Lazy loading**: Load resources when needed

#### CSS Optimization
- **Efficient selectors**: Avoid deep nesting
- **Critical CSS**: Inline essential styles
- **CSS Grid/Flexbox**: Modern layout methods
- **Hardware acceleration**: Use transforms for animations

#### Asset Optimization
- **Minification**: Compress CSS and JavaScript in production
- **External CDNs**: Use CDNs for libraries when possible
- **Image optimization**: Compress and optimize images
- **Caching headers**: Set appropriate cache policies

### Memory Management

#### Preventing Memory Leaks
```javascript
// Proper event cleanup
function setupFeature() {
    const handler = function(event) {
        // Handle event
    };
    
    element.addEventListener('click', handler);
    
    // Cleanup function for SPA transitions
    return function cleanup() {
        element.removeEventListener('click', handler);
    };
}
```

#### Efficient DOM Manipulation
```javascript
// Good: Batch DOM updates
function updateMultipleElements(elements, newClass) {
    // Use DocumentFragment for multiple insertions
    const fragment = document.createDocumentFragment();
    
    elements.forEach(element => {
        element.className = newClass;
        fragment.appendChild(element);
    });
    
    container.appendChild(fragment);
}

// Avoid: Individual DOM operations in loops
```

### Monitoring Performance

#### Browser DevTools
- **Performance tab**: Profile JavaScript execution
- **Network tab**: Monitor resource loading
- **Lighthouse**: Automated performance audits
- **Memory tab**: Check for memory leaks

#### Custom Performance Metrics
```javascript
// Custom timing measurements
function measureSearchPerformance() {
    const startTime = performance.now();
    
    performSearch();
    
    const endTime = performance.now();
    console.log(`Search took ${endTime - startTime} milliseconds`);
}
```

## Debugging Guide

### Development Tools

#### Browser Developer Tools
- **Console**: View errors and debug output
- **Elements**: Inspect and modify HTML/CSS
- **Sources**: Set breakpoints and step through code
- **Network**: Monitor resource loading
- **Application**: Check localStorage and other storage

#### Debugging Techniques

##### Console Debugging
```javascript
// Debug search functionality
function performSearch() {
    const query = searchInput.value.toLowerCase().trim();
    console.log('Search query:', query);  // Debug output
    
    if (query.length < 2) {
        console.log('Query too short, clearing results');
        clearSearchResults();
        return;
    }
    
    // ... rest of function
}
```

##### Conditional Breakpoints
```javascript
// Add conditional debugging
function displaySearchResults(results, query) {
    // Break when debugging specific query
    if (query === 'debug-query') {
        debugger;
    }
    
    // ... function logic
}
```

### Common Issues and Solutions

#### Search Not Working
**Symptoms**: No results appearing, console errors

**Debug Steps**:
1. Check console for JavaScript errors
2. Verify search elements exist in DOM
3. Test with simple queries
4. Check debounce timing

**Solutions**:
```javascript
// Add error handling to search
function performSearch() {
    try {
        const query = searchInput.value.toLowerCase().trim();
        // ... search logic
    } catch (error) {
        console.error('Search error:', error);
        searchResults.innerHTML = '<div>Search error occurred</div>';
    }
}
```

#### Copy Button Failures
**Symptoms**: Copy button shows "Failed" state

**Debug Steps**:
1. Check if site is served over HTTPS
2. Test clipboard permissions
3. Verify button event handlers
4. Test fallback method

**Solutions**:
```javascript
// Enhanced error handling for clipboard
function copyToClipboard(text, button) {
    console.log('Attempting to copy:', text.substring(0, 50) + '...');
    
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text)
            .then(() => {
                console.log('Clipboard API success');
                showCopySuccess(button);
            })
            .catch((error) => {
                console.warn('Clipboard API failed:', error);
                fallbackCopyToClipboard(text, button);
            });
    } else {
        console.log('Using fallback copy method');
        fallbackCopyToClipboard(text, button);
    }
}
```

#### Performance Issues
**Symptoms**: Slow scrolling, delayed interactions

**Debug Steps**:
1. Profile with browser DevTools
2. Check for memory leaks
3. Monitor event handler efficiency
4. Test with large content

**Solutions**:
```javascript
// Throttle scroll events
let scrollTimeout;
function throttledScrollHandler() {
    if (!scrollTimeout) {
        scrollTimeout = setTimeout(() => {
            updateReadingProgress();
            checkBackToTopVisibility();
            scrollTimeout = null;
        }, 16); // ~60fps
    }
}
```

### Error Handling Patterns

#### Graceful Degradation
```javascript
// Safe element access
function initializeOptionalFeature() {
    const element = document.getElementById('optional-element');
    if (!element) {
        console.warn('Optional feature not available');
        return;
    }
    
    // Initialize feature
}
```

#### User-Friendly Error Messages
```javascript
// Show helpful error messages
function handleSearchError(error) {
    console.error('Search error:', error);
    
    searchResults.innerHTML = `
        <div class="search-error">
            Search temporarily unavailable. Please try again.
        </div>
    `;
}
```

## Best Practices

### Code Quality

#### JavaScript Standards
- **Use strict mode**: `'use strict';` at function tops
- **Consistent naming**: camelCase for variables and functions
- **Descriptive names**: Functions and variables should be self-documenting
- **Error handling**: Always handle potential errors gracefully
- **Comments**: Explain why, not what

#### CSS Standards
- **Consistent indentation**: 4 spaces for nesting
- **Logical property order**: Position, display, dimensions, colors
- **Mobile-first**: Start with mobile styles, enhance for desktop
- **Performance**: Avoid expensive selectors and properties

#### HTML Standards  
- **Semantic markup**: Use appropriate HTML5 elements
- **Accessibility**: Include ARIA attributes where needed
- **Valid HTML**: Validate markup with W3C validator
- **Progressive enhancement**: Core content works without JavaScript

### Security Considerations

#### Input Sanitization
```javascript
// Sanitize search queries
function sanitizeQuery(query) {
    return query
        .replace(/[<>]/g, '') // Remove angle brackets
        .substring(0, 100);   // Limit length
}
```

#### Safe DOM Manipulation
```javascript
// Use textContent for user input
element.textContent = userInput; // Safe
// Avoid: element.innerHTML = userInput; // Dangerous
```

#### External Dependencies
- **Use CDN with integrity**: Include SRI hashes for external scripts
- **Regular updates**: Keep dependencies current
- **Minimal dependencies**: Only include what's necessary

### Performance Best Practices

#### Efficient Event Handling
```javascript
// Good: Event delegation
container.addEventListener('click', function(event) {
    if (event.target.matches('.copy-button')) {
        handleCopyClick(event.target);
    }
});

// Avoid: Individual listeners for each button
buttons.forEach(button => {
    button.addEventListener('click', handleCopyClick);
});
```

#### Smart DOM Queries
```javascript
// Cache elements at initialization
const elements = {
    searchInput: document.getElementById('searchInput'),
    searchResults: document.getElementById('searchResults'),
    progressBar: document.getElementById('progressBar')
};

// Use cached references
elements.searchInput.addEventListener('input', handleSearch);
```

### Maintainability

#### Modular Architecture
- **Single responsibility**: Each function does one thing well
- **Loose coupling**: Minimize dependencies between functions
- **High cohesion**: Group related functionality together
- **Clear interfaces**: Functions have predictable inputs and outputs

#### Documentation
- **Code comments**: Explain complex logic
- **Function documentation**: JSDoc for all public functions
- **README updates**: Keep documentation current
- **Change logs**: Document significant changes

#### Testing
- **Test-driven development**: Write tests first when possible
- **Comprehensive coverage**: Test both happy path and edge cases
- **Continuous integration**: Run tests on every commit
- **Performance testing**: Include performance regression tests

This developer guide provides a comprehensive foundation for working with the Anthropic Style GitHub Page codebase. For specific API details, see the [API Documentation](api.md), and for architectural decisions, see the [Architecture Documentation](architecture.md).