# API Documentation

This document provides comprehensive documentation for all JavaScript functions and APIs used in the Claude Code Agents Hooks Documentation Guide project.

## Table of Contents

- [Core Application Functions](#core-application-functions)
- [Code Block Management](#code-block-management)
- [Search Functionality](#search-functionality)
- [UI Components](#ui-components)
- [Utility Functions](#utility-functions)
- [Event Handlers](#event-handlers)
- [External Dependencies](#external-dependencies)

## Core Application Functions

### Main Application Initialization

The application initializes when the DOM content is loaded, setting up all interactive features.

```javascript
document.addEventListener('DOMContentLoaded', function() { ... })
```

**Description**: Main entry point that initializes all application features when DOM is ready.

**Dependencies**: 
- Mermaid.js for diagram rendering
- Prism.js for syntax highlighting

**Side Effects**: 
- Initializes code blocks with copy functionality
- Sets up reading progress indicator
- Configures back-to-top button
- Activates search functionality

## Code Block Management

### initializeCodeBlocks()

```javascript
function initializeCodeBlocks()
```

**Description**: Processes all `<pre><code>` elements to add syntax highlighting and copy functionality.

**Parameters**: None

**Returns**: `void`

**Side Effects**: 
- Adds language classes to code blocks
- Inserts copy buttons with event handlers
- Triggers Prism.js syntax highlighting
- Wraps code blocks in container elements

**Dependencies**: Prism.js for syntax highlighting

---

### detectLanguage(code)

```javascript
function detectLanguage(code) -> string
```

**Description**: Automatically detects programming language based on code content patterns.

**Parameters**:
- `code` (string): The code content to analyze

**Returns**: `string` - Language identifier for Prism.js (bash, json, markdown, javascript, python)

**Algorithm**: 
1. Checks for bash/shell patterns (shebang, common commands)
2. Identifies JSON structure with specific keys
3. Detects YAML frontmatter patterns
4. Recognizes JavaScript keywords and syntax
5. Identifies Python-specific constructs
6. Defaults to 'bash' for unidentified code

**Examples**:
```javascript
detectLanguage('#!/bin/bash\necho "hello"') // Returns: 'bash'
detectLanguage('{"hooks": "PreToolUse"}')    // Returns: 'json' 
detectLanguage('function test() {}')         // Returns: 'javascript'
```

---

### copyToClipboard(text, button)

```javascript
function copyToClipboard(text, button)
```

**Description**: Copies text to clipboard with fallback support for older browsers.

**Parameters**:
- `text` (string): Text content to copy to clipboard
- `button` (HTMLElement): Copy button element for user feedback

**Returns**: `void`

**Side Effects**: 
- Modifies button text and styling to show copy status
- May create temporary DOM elements for fallback method

**Error Handling**: Gracefully falls back to `execCommand` if Clipboard API fails

**Browser Support**: 
- Modern browsers: Uses Clipboard API
- Older browsers: Uses `document.execCommand('copy')`
- Requires HTTPS for Clipboard API

---

### fallbackCopyToClipboard(text, button)

```javascript
function fallbackCopyToClipboard(text, button)
```

**Description**: Fallback clipboard method using deprecated `execCommand` API.

**Parameters**:
- `text` (string): Text content to copy
- `button` (HTMLElement): Button element for feedback

**Returns**: `void`

**Implementation**:
1. Creates temporary `<textarea>` element off-screen
2. Sets text value and selects content
3. Executes `document.execCommand('copy')`
4. Cleans up temporary element
5. Provides user feedback via button updates

**Error Handling**: Catches exceptions and displays "Failed" state

---

### showCopySuccess(button)

```javascript
function showCopySuccess(button)
```

**Description**: Displays success feedback when copy operation completes.

**Parameters**:
- `button` (HTMLElement): Copy button to update

**Returns**: `void`

**Behavior**:
- Changes button text to "Copied!"
- Adds 'copied' CSS class for styling
- Resets to normal state after 2 seconds

## Search Functionality

### performSearch()

```javascript
function performSearch()
```

**Description**: Executes search across page content with query highlighting and result filtering.

**Parameters**: None (reads from global `searchInput` element)

**Returns**: `void`

**Algorithm**:
1. Retrieves and normalizes search query
2. Returns early if query length < 2 characters
3. Searches through all content elements (h2, h3, h4, p, li, code, pre)
4. Creates result objects with context information
5. Displays formatted results with highlighting

**Performance**: 
- Debounced to execute 300ms after user stops typing
- Limits results to 5 items for display performance
- Case-insensitive matching

---

### findParentHeading(element)

```javascript
function findParentHeading(element) -> HTMLElement|null
```

**Description**: Finds the nearest parent heading element for providing section context.

**Parameters**:
- `element` (HTMLElement): Element to find parent heading for

**Returns**: `HTMLElement|null` - Parent heading element (h2, h3, h4) with ID attribute, or null

**Algorithm**:
1. Traverses up DOM tree from given element
2. Checks each ancestor for heading elements (h2, h3, h4)
3. Returns first heading with an ID attribute
4. Returns null if no suitable parent found

---

### displaySearchResults(results, query)

```javascript
function displaySearchResults(results, query)
```

**Description**: Renders formatted search results with highlighting and navigation links.

**Parameters**:
- `results` (Array): Array of search result objects
- `query` (string): Original search query for highlighting

**Returns**: `void`

**Features**:
- Deduplicates results by heading to avoid multiple entries
- Limits display to 5 results for performance
- Provides result count with overflow indication
- Highlights search terms in results
- Creates clickable links to result sections

---

### highlightText(text, query)

```javascript
function highlightText(text, query) -> string
```

**Description**: Highlights search query terms within text content using HTML spans.

**Parameters**:
- `text` (string): Text content to highlight
- `query` (string): Search terms to highlight

**Returns**: `string` - HTML string with highlighted terms wrapped in `<span class="search-highlight">`

**Features**:
- Case-insensitive matching
- Escapes regex special characters
- Returns original text if query is empty

---

### escapeRegExp(string)

```javascript
function escapeRegExp(string) -> string
```

**Description**: Escapes special regex characters to prevent regex injection.

**Parameters**:
- `string` (string): String to escape

**Returns**: `string` - Escaped string safe for regex use

**Escaped Characters**: `. * + ? ^ $ { } ( ) | [ ] \`

---

### clearSearchResults()

```javascript
function clearSearchResults()
```

**Description**: Clears search results display by emptying results container.

**Parameters**: None

**Returns**: `void`

**Usage**: Called when search query becomes too short or is manually cleared

## UI Components

### initializeReadingProgress()

```javascript
function initializeReadingProgress()
```

**Description**: Initializes reading progress indicator that tracks scroll position.

**Parameters**: None

**Returns**: `void`

**Features**:
- Updates progress bar width based on scroll percentage
- Handles cross-browser scroll position detection
- Provides initial progress state on page load
- Updates continuously during scroll events

**Implementation**: 
- Calculates scroll percentage: `(scrollTop / maxScroll) * 100`
- Updates progress bar CSS width property
- Caps progress at 100% maximum

---

### Back to Top Button

The back-to-top functionality is implemented inline within the main initialization:

```javascript
// Back to Top Button functionality
const backToTopButton = document.getElementById('backToTop');
if (backToTopButton) {
    // Show/hide based on scroll position
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTopButton.style.display = 'block';
        } else {
            backToTopButton.style.display = 'none';
        }
    });

    // Smooth scroll to top
    backToTopButton.addEventListener('click', function(e) {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}
```

**Features**:
- Appears when scrolled more than 300px from top
- Uses smooth scrolling behavior
- Prevents default anchor link behavior

## Event Handlers

### Scroll Events

**Reading Progress**: Updates progress bar width based on scroll position
- **Frequency**: Fires on every scroll event
- **Performance**: Lightweight calculation with cached elements

**Back to Top Visibility**: Shows/hides button based on scroll threshold
- **Threshold**: 300px from top
- **Performance**: Simple boolean check

### Input Events

**Search Input**: Debounced search execution
- **Debounce Delay**: 300ms
- **Trigger**: Any input change
- **Cleanup**: Clears previous timeout before setting new one

### Click Events

**Copy Buttons**: Individual handlers for each code block
- **Target**: Generated copy buttons
- **Action**: Copies associated code content
- **Feedback**: Visual state changes

**Search Result Links**: Navigation to content sections
- **Target**: Generated result links  
- **Action**: Smooth scroll to target heading
- **Behavior**: Uses browser's native anchor navigation

**Outside Click**: Clears search results when clicking outside search area
- **Target**: Document body
- **Condition**: Only when search input is empty
- **Purpose**: Improves UX by hiding stale results

## External Dependencies

### Mermaid.js

```javascript
mermaid.initialize({
    startOnLoad: true,
    theme: 'default', 
    securityLevel: 'loose'
});
```

**Purpose**: Renders diagrams and flowcharts
**Configuration**: 
- Auto-start on page load
- Default theme for consistency  
- Loose security for HTML content in diagrams

### Prism.js

```javascript
if (typeof Prism !== 'undefined') {
    Prism.highlightAll();
}
```

**Purpose**: Syntax highlighting for code blocks
**Usage**: Called after all code blocks are processed
**Languages Supported**: Bash, JavaScript, JSON, Markdown, Python (via components)

## Performance Considerations

### Search Performance
- **Debouncing**: 300ms delay prevents excessive searches
- **Result Limiting**: Max 5 displayed results
- **Query Minimum**: 2 character minimum prevents noise
- **DOM Caching**: Search elements cached on initialization

### Memory Management
- **Event Listeners**: Attached once during initialization
- **Temporary Elements**: Cleaned up immediately after use
- **Search Timeouts**: Properly cleared to prevent memory leaks

### Browser Compatibility
- **Graceful Degradation**: Fallback methods for older browsers
- **Feature Detection**: Checks for API availability before use
- **Cross-browser Events**: Compatible scroll position detection

## Error Handling

### Clipboard Operations
- **API Failure**: Falls back to `execCommand` method
- **Permission Denied**: Shows "Failed" state with auto-recovery
- **Unsupported Browsers**: Uses textarea selection method

### Missing Elements
- **Progress Bar**: Safely exits if element not found
- **Search Elements**: Assumes presence (critical for functionality)
- **Copy Buttons**: Individual failure doesn't affect others

### Search Errors
- **Empty Queries**: Handled gracefully with early returns
- **No Results**: Displays user-friendly "no results" message
- **Malformed Content**: Regex escaping prevents injection

## Testing

All functions are covered by comprehensive tests in the `tests/` directory:

- **Unit Tests**: Individual function testing
- **Integration Tests**: Complete workflow testing
- **Performance Tests**: Load and scalability testing
- **Error Handling Tests**: Edge case and failure scenario testing

For detailed testing information, see the [Testing Documentation](../tests/README.md).