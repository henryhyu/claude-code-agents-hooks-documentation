# Contributing Guidelines

Welcome to the Anthropic Style GitHub Page project! We're excited that you're interested in contributing. This guide will help you get started and ensure your contributions align with the project's standards and goals.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [How to Contribute](#how-to-contribute)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Testing Requirements](#testing-requirements)
- [Documentation Standards](#documentation-standards)
- [Pull Request Process](#pull-request-process)
- [Issue Guidelines](#issue-guidelines)
- [Community Guidelines](#community-guidelines)

## Code of Conduct

### Our Commitment

We are committed to providing a welcoming and inclusive experience for everyone, regardless of age, body size, disability, ethnicity, gender identity and expression, level of experience, nationality, personal appearance, race, religion, or sexual identity and orientation.

### Expected Behavior

- **Be respectful**: Treat all community members with respect and kindness
- **Be inclusive**: Welcome newcomers and help them get involved
- **Be collaborative**: Work together constructively and assume good intentions
- **Be professional**: Keep discussions focused and constructive
- **Give credit**: Acknowledge others' contributions and ideas

### Unacceptable Behavior

- Harassment, discrimination, or intimidation of any kind
- Offensive, inappropriate, or unwelcome comments
- Personal attacks or trolling
- Publishing others' private information without permission
- Any conduct that would be inappropriate in a professional setting

### Reporting Issues

If you experience or witness unacceptable behavior, please report it by:
- Opening a confidential issue with the project maintainers
- Contacting maintainers directly via private message
- Using GitHub's reporting features

## Getting Started

### Prerequisites

Before contributing, ensure you have:

- **Node.js 16+** installed for running tests
- **Git** configured with your name and email
- **Modern browser** for testing (Chrome, Firefox, Safari, Edge)
- **Text editor** with JavaScript and HTML support

### Setting Up Development Environment

1. **Fork the repository** on GitHub
   ```bash
   # Click "Fork" button on GitHub, then clone your fork
   git clone https://github.com/YOUR_USERNAME/anthropic-style-github-page.git
   cd anthropic-style-github-page
   ```

2. **Add upstream remote**
   ```bash
   git remote add upstream https://github.com/ORIGINAL_OWNER/anthropic-style-github-page.git
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Run tests to verify setup**
   ```bash
   npm test
   ```

5. **Start local development server**
   ```bash
   # Option 1: Simple HTTP server
   npx http-server . -p 8080
   
   # Option 2: Live reload server
   npx live-server . --port=8080
   ```

### First Steps

1. **Explore the codebase** using the [Developer Guide](developer-guide.md)
2. **Run the test suite** to understand the testing approach
3. **Check existing issues** for good first contributions
4. **Read the architecture documentation** to understand design decisions

## How to Contribute

### Types of Contributions Welcome

#### 🐛 **Bug Reports**
- Found something that doesn't work as expected?
- Spotted a typo or broken link?
- Noticed accessibility issues?

#### 💡 **Feature Requests**
- Ideas for improving user experience
- Suggestions for new functionality
- Performance optimization opportunities

#### 📝 **Documentation**
- Improvements to existing documentation
- New tutorials or examples
- Translation contributions

#### 🧪 **Testing**
- Additional test cases
- Performance test improvements
- Cross-browser compatibility testing

#### 🎨 **Design Improvements**
- UI/UX enhancements
- Accessibility improvements
- Responsive design optimizations

#### ⚡ **Performance**
- Code optimization
- Bundle size reduction
- Loading speed improvements

### Good First Issues

Look for issues labeled with:
- `good first issue`: Perfect for newcomers
- `help wanted`: Community input needed
- `documentation`: Writing and editing tasks
- `testing`: Test-related contributions

## Development Workflow

### Branch Strategy

We use a **feature branch workflow**:

```
main (production-ready)
├── feature/search-improvements
├── bugfix/copy-button-issue
├── docs/update-api-documentation
└── performance/optimize-scroll-handling
```

### Development Process

#### 1. **Create Feature Branch**
```bash
# Start from latest main
git checkout main
git pull upstream main

# Create feature branch
git checkout -b feature/your-feature-name
# OR: git checkout -b bugfix/issue-description
# OR: git checkout -b docs/documentation-update
```

#### 2. **Make Changes**
- Write clean, well-commented code
- Follow existing code style and patterns
- Add tests for new functionality
- Update documentation as needed

#### 3. **Test Your Changes**
```bash
# Run full test suite
npm test

# Run tests in watch mode during development
npm run test:watch

# Check test coverage
npm run test:coverage

# Manual testing across browsers
```

#### 4. **Commit Changes**
```bash
# Stage changes
git add .

# Commit with descriptive message
git commit -m "feat: add search result highlighting

- Implement highlightText function for search results
- Add CSS styling for highlighted terms
- Include tests for highlight functionality
- Update documentation with search features

Fixes #123"
```

#### 5. **Push and Create Pull Request**
```bash
# Push feature branch
git push origin feature/your-feature-name

# Create pull request via GitHub interface
```

### Commit Message Format

We follow **Conventional Commits** for clear project history:

```
type(scope): brief description

Detailed explanation of what was changed and why.
Can be multiple paragraphs if needed.

- Bullet points for key changes
- Reference related issues

Fixes #123
Closes #456
```

#### Commit Types
- `feat`: New feature or enhancement
- `fix`: Bug fix
- `docs`: Documentation updates
- `style`: Code style changes (formatting, no logic changes)
- `refactor`: Code refactoring without changing functionality
- `test`: Adding or updating tests
- `perf`: Performance improvements
- `chore`: Build system or auxiliary tool changes

#### Examples
```bash
git commit -m "feat(search): add real-time search with highlighting

- Implement debounced search functionality
- Add search result highlighting
- Include keyboard navigation
- Update search tests and documentation

Closes #45"

git commit -m "fix(clipboard): handle HTTPS requirement for clipboard API

- Add fallback for non-HTTPS environments
- Improve error messaging for clipboard failures
- Update tests to cover both API paths

Fixes #78"

git commit -m "docs: update API documentation for search functions

- Add JSDoc comments to search-related functions
- Include usage examples in developer guide
- Fix typos in user guide"
```

## Coding Standards

### JavaScript Standards

#### Code Style
```javascript
// Use modern ES6+ features
const searchResults = [];
const { query, results } = searchData;

// Prefer arrow functions for callbacks
results.forEach(result => processResult(result));

// Use template literals for strings
const message = `Found ${results.length} results for "${query}"`;

// Prefer const/let over var
const immutableValue = 'constant';
let mutableValue = 'changes';
```

#### Function Documentation
```javascript
/**
 * Highlights search terms within text content
 * @param {string} text - The text content to highlight
 * @param {string} query - The search terms to highlight
 * @returns {string} HTML string with highlighted terms
 * @example
 * highlightText('Hello world', 'world')
 * // Returns: 'Hello <span class="highlight">world</span>'
 */
function highlightText(text, query) {
    // Implementation...
}
```

#### Error Handling
```javascript
// Always handle potential errors
function copyToClipboard(text, button) {
    try {
        if (navigator.clipboard && window.isSecureContext) {
            return navigator.clipboard.writeText(text)
                .then(() => showCopySuccess(button))
                .catch(error => {
                    console.warn('Clipboard API failed:', error);
                    return fallbackCopyToClipboard(text, button);
                });
        }
        return fallbackCopyToClipboard(text, button);
    } catch (error) {
        console.error('Copy operation failed:', error);
        showCopyError(button);
    }
}
```

#### Performance Considerations
```javascript
// Cache DOM queries
const elements = {
    searchInput: document.getElementById('searchInput'),
    searchResults: document.getElementById('searchResults')
};

// Debounce frequent operations
let searchTimeout;
function debounceSearch() {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(performSearch, 300);
}

// Use event delegation for dynamic content
container.addEventListener('click', function(event) {
    if (event.target.matches('.copy-button')) {
        handleCopyClick(event.target);
    }
});
```

### HTML Standards

#### Semantic Markup
```html
<!-- Use appropriate semantic elements -->
<main role="main">
    <article>
        <header>
            <h1>Page Title</h1>
        </header>
        
        <section id="content">
            <h2>Section Title</h2>
            <p>Content...</p>
        </section>
        
        <aside role="complementary">
            <nav aria-label="Page navigation">
                <!-- Navigation items -->
            </nav>
        </aside>
    </article>
</main>
```

#### Accessibility Attributes
```html
<!-- Include ARIA attributes for interactive elements -->
<button class="copy-button" 
        aria-label="Copy code to clipboard"
        data-code="example code">
    Copy
</button>

<!-- Use proper heading hierarchy -->
<h1>Main Title</h1>
  <h2>Major Section</h2>
    <h3>Subsection</h3>
    <h3>Another Subsection</h3>
  <h2>Another Major Section</h2>
```

### CSS Standards

#### Organization
```css
/* 1. CSS Reset/Normalize */
* { box-sizing: border-box; }

/* 2. CSS Variables */
:root {
    --primary-color: #3b82f6;
    --text-color: #1a1a1a;
}

/* 3. Base Elements */
body { font-family: system-ui, sans-serif; }

/* 4. Layout Components */
.content-wrapper { display: grid; }

/* 5. UI Components */
.search-container { position: relative; }

/* 6. Utility Classes */
.sr-only { position: absolute; left: -10000px; }

/* 7. Media Queries */
@media (max-width: 768px) {
    .content-wrapper { display: block; }
}
```

#### Naming Conventions
```css
/* Use descriptive, component-based class names */
.search-container { }
.search-input { }
.search-results { }
.search-result { }
.search-highlight { }

/* Use state classes for interactive elements */
.copy-button { }
.copy-button--copied { }
.copy-button--error { }

/* Use modifier classes for variations */
.info-box { }
.info-box--warning { }
.info-box--success { }
```

## Testing Requirements

### Test Coverage Goals

- **Statements**: > 90%
- **Branches**: > 85%  
- **Functions**: > 95%
- **Lines**: > 90%

### Testing Standards

#### Unit Tests
```javascript
describe('highlightText function', () => {
    test('should highlight search terms in text', () => {
        const text = 'The quick brown fox';
        const query = 'quick';
        const result = highlightText(text, query);
        
        expect(result).toBe('The <span class="search-highlight">quick</span> brown fox');
    });

    test('should handle empty query gracefully', () => {
        const text = 'Some text';
        const query = '';
        const result = highlightText(text, query);
        
        expect(result).toBe('Some text');
    });

    test('should escape special regex characters', () => {
        const text = 'Price: $10.99';
        const query = '$10.99';
        const result = highlightText(text, query);
        
        expect(result).toContain('search-highlight');
    });
});
```

#### Integration Tests
```javascript
describe('Search workflow', () => {
    test('should complete full search interaction', async () => {
        // Setup
        createMockDOM();
        const searchInput = document.getElementById('searchInput');
        const searchResults = document.getElementById('searchResults');
        
        // User types query
        fireEvent.input(searchInput, { target: { value: 'test query' } });
        
        // Wait for debounce
        await waitFor(() => {
            expect(searchResults.innerHTML).toContain('Found');
        });
        
        // Verify results
        const resultElements = searchResults.querySelectorAll('.search-result');
        expect(resultElements.length).toBeGreaterThan(0);
        
        // Click result navigates to section
        fireEvent.click(resultElements[0]);
        // Assert navigation occurred
    });
});
```

#### Performance Tests
```javascript
describe('Performance requirements', () => {
    test('search should complete within 100ms', () => {
        const startTime = performance.now();
        performSearch();
        const endTime = performance.now();
        
        expect(endTime - startTime).toBeLessThan(100);
    });

    test('should handle large DOM efficiently', () => {
        // Create large DOM structure
        createLargeTestDOM(1000);
        
        const startTime = performance.now();
        performSearch();
        const endTime = performance.now();
        
        expect(endTime - startTime).toBeLessThan(200);
    });
});
```

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run specific test file
npx jest search.test.js

# Run tests with coverage
npm run test:coverage

# Run performance tests specifically  
npx jest performance.test.js
```

## Documentation Standards

### Documentation Requirements

Every contribution should include appropriate documentation:

#### For New Features
- [ ] Update relevant documentation files
- [ ] Add JSDoc comments to new functions
- [ ] Include usage examples
- [ ] Update API documentation if needed

#### For Bug Fixes
- [ ] Document the issue and solution
- [ ] Update troubleshooting guide if applicable
- [ ] Add test cases to prevent regression

#### For Documentation Changes
- [ ] Ensure accuracy and clarity
- [ ] Test all code examples
- [ ] Check for broken links
- [ ] Maintain consistent style and tone

### Documentation Style Guide

#### Writing Style
- **Clear and concise**: Use simple, direct language
- **User-focused**: Write from the user's perspective
- **Scannable**: Use headers, lists, and code blocks for easy scanning
- **Consistent**: Follow established patterns and terminology

#### Code Examples
```javascript
// Good: Include context and explanation
/**
 * Example: Adding a new search filter
 */
function addSearchFilter(filterType, filterValue) {
    // Validate input parameters
    if (!filterType || !filterValue) {
        throw new Error('Both filterType and filterValue are required');
    }
    
    // Add filter to active filters
    activeFilters.push({ type: filterType, value: filterValue });
    
    // Re-run search with new filters
    performSearch();
}

// Usage
addSearchFilter('category', 'documentation');
```

#### Screenshots and Diagrams
- Use clear, high-resolution screenshots
- Highlight relevant UI elements
- Include alt text for accessibility
- Keep diagrams simple and focused

### Documentation Structure

```markdown
# Title (H1 - only one per document)

Brief description of what this document covers.

## Table of Contents (if document is long)

## Main Section (H2)

### Subsection (H3)

Content with proper formatting:

- **Bold** for emphasis
- `code` for inline code
- Links to [related documentation](link)

#### Code Examples (H4)

```javascript
// Well-commented example code
function exampleFunction() {
    // Implementation details
}
```

#### Notes and Warnings

> **Note**: Important information that users should be aware of.

> **Warning**: Critical information that could cause issues if ignored.
```

## Pull Request Process

### Before Submitting

#### Pre-submission Checklist
- [ ] **Tests pass**: `npm test` runs without errors
- [ ] **Code coverage**: Maintain or improve coverage percentage
- [ ] **Documentation updated**: All relevant docs are current
- [ ] **Code style**: Follows project conventions
- [ ] **Commit messages**: Follow conventional commit format
- [ ] **No merge conflicts**: Branch is up to date with main

#### Self-Review Process
1. **Review your own code** first - catch obvious issues
2. **Test in multiple browsers** if making UI changes
3. **Verify accessibility** with screen reader or keyboard navigation
4. **Check performance** if making changes that could impact speed
5. **Validate documentation** examples actually work

### Pull Request Template

When creating a pull request, use this template:

```markdown
## Description

Brief description of what this PR does.

## Type of Change

- [ ] Bug fix (non-breaking change that fixes an issue)
- [ ] New feature (non-breaking change that adds functionality)
- [ ] Breaking change (would cause existing functionality to change)
- [ ] Documentation update
- [ ] Performance improvement
- [ ] Refactoring (no functional changes)

## Changes Made

- Bullet point list of key changes
- Include any breaking changes
- Mention any new dependencies

## Testing

Describe how you tested your changes:

- [ ] Unit tests added/updated
- [ ] Integration tests added/updated  
- [ ] Manual testing performed
- [ ] Cross-browser testing completed

## Screenshots (if applicable)

Before/after screenshots for UI changes.

## Documentation

- [ ] Documentation updated
- [ ] JSDoc comments added
- [ ] API documentation updated
- [ ] User guide updated if needed

## Related Issues

Fixes #123
Closes #456
Related to #789

## Additional Notes

Any additional information reviewers should know.
```

### Review Process

#### What Reviewers Look For

1. **Functionality**: Does the code do what it's supposed to do?
2. **Code Quality**: Is the code readable, maintainable, and efficient?
3. **Testing**: Are there adequate tests with good coverage?
4. **Documentation**: Is documentation clear and complete?
5. **Compatibility**: Does it work across supported browsers?
6. **Performance**: Does it maintain good performance characteristics?

#### Responding to Feedback

- **Be responsive**: Reply to comments promptly
- **Be open**: Welcome suggestions and constructive criticism
- **Ask questions**: If feedback is unclear, ask for clarification
- **Make changes**: Address all reasonable feedback
- **Test again**: Verify changes don't introduce new issues

#### Approval Process

Pull requests require:
1. **Automated checks pass**: All CI/CD tests must pass
2. **Code review approval**: At least one maintainer approval
3. **No unresolved comments**: All feedback addressed
4. **Up-to-date branch**: No merge conflicts with main

## Issue Guidelines

### Before Creating an Issue

1. **Search existing issues** to avoid duplicates
2. **Check documentation** - issue might already be addressed
3. **Try latest version** - issue might already be fixed
4. **Reproduce the issue** reliably

### Bug Report Template

```markdown
## Bug Description

A clear, concise description of what the bug is.

## Steps to Reproduce

1. Go to '...'
2. Click on '...'
3. Scroll down to '...'
4. See error

## Expected Behavior

What you expected to happen.

## Actual Behavior

What actually happened.

## Environment

- **Browser**: Chrome 91, Firefox 89, etc.
- **Operating System**: macOS 12.0, Windows 10, Ubuntu 20.04
- **Device**: Desktop, Mobile, Tablet
- **Screen Size**: 1920x1080, iPhone 12, etc.

## Additional Context

- Console errors (if any)
- Screenshots or screen recordings
- Any workarounds you've found
- Related issues or discussions

## Possible Solution (Optional)

If you have ideas for fixing the issue.
```

### Feature Request Template

```markdown
## Feature Description

Clear description of the feature you'd like to see added.

## Problem Statement

What problem does this feature solve?

## Proposed Solution

Detailed description of how you envision this working.

## Alternatives Considered

Other approaches you've considered and why they weren't suitable.

## Use Cases

Specific examples of how this feature would be used.

## Additional Context

- Related features or issues
- Examples from other projects
- Screenshots or mockups
- Technical considerations
```

### Issue Labels

We use labels to categorize and prioritize issues:

#### Type Labels
- `bug`: Something isn't working correctly
- `feature`: New feature or enhancement request
- `documentation`: Documentation improvements needed
- `performance`: Performance-related issues
- `accessibility`: Accessibility improvements
- `security`: Security-related concerns

#### Priority Labels  
- `critical`: Severe issues that break core functionality
- `high`: Important issues that should be addressed soon
- `medium`: Standard priority issues
- `low`: Nice-to-have improvements

#### Status Labels
- `good first issue`: Good for newcomers to the project
- `help wanted`: Extra attention is needed from community
- `in progress`: Currently being worked on
- `blocked`: Waiting on external dependencies
- `wontfix`: This will not be worked on

## Community Guidelines

### Communication Channels

#### GitHub Issues
- **Bug reports and feature requests**
- **Technical discussions**
- **Project planning and roadmap**

#### GitHub Discussions (if enabled)
- **General questions and help**
- **Community showcase**
- **Ideas and brainstorming**

#### Pull Request Comments
- **Code review discussions**
- **Implementation details**
- **Technical feedback**

### Recognition

We value all contributions and want to recognize them:

#### Contributors
All contributors are listed in:
- **README.md**: Major contributors section
- **GitHub Contributors page**: Automatic recognition
- **Release notes**: Notable contributions mentioned

#### Types of Recognition
- **Code contributions**: Direct code improvements
- **Documentation**: Writing and editing help
- **Testing**: Bug reports and testing help  
- **Community support**: Helping other users
- **Design feedback**: UI/UX suggestions

### Getting Help

#### Where to Ask Questions
1. **GitHub Issues**: For bugs and feature requests
2. **GitHub Discussions**: For general questions and help
3. **Documentation**: Check existing docs first
4. **Code comments**: For implementation details

#### How to Ask Effective Questions
1. **Be specific**: Include exact error messages and steps
2. **Provide context**: What are you trying to achieve?
3. **Include environment details**: Browser, OS, etc.
4. **Show what you've tried**: What solutions have you attempted?
5. **Minimal reproducible example**: Simplest case that shows the issue

#### Response Expectations
- **Bug reports**: We aim to respond within 48 hours
- **Feature requests**: May take longer to evaluate and plan
- **Questions**: Community members often respond quickly
- **Pull requests**: Code review within 3-5 business days

Thank you for contributing to the Anthropic Style GitHub Page project! Your contributions help make this a better resource for everyone. If you have questions about these guidelines or need help getting started, please don't hesitate to ask.