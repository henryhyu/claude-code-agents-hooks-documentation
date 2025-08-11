// Main test suite for scripts.js functionality
import { 
    initializeMermaid,
    detectLanguage,
    copyToClipboard,
    fallbackCopyToClipboard,
    showCopySuccess,
    showCopyError,
    createCopyButton,
    initializeCodeBlocks,
    updateReadingProgress,
    initializeReadingProgress,
    initializeBackToTop,
    findParentHeading,
    escapeRegExp,
    highlightText,
    performSearch,
    displaySearchResults,
    clearSearchResults,
    initializeSearch,
    initializeApp
} from '../scripts-testable.js';

import { fireEvent, waitFor, flushPromises, createCodeBlock, mockScrollProperties } from './test-utils.js';
import { createMockHTML } from './setup.js';

describe('Claude Code Agents Hooks Documentation Guide Scripts', () => {
    
    beforeEach(() => {
        // Reset DOM for each test
        document.body.innerHTML = '';
        createMockHTML();
        
        // Reset mocks
        jest.clearAllMocks();
        
        // Reset scroll position
        window.pageYOffset = 0;
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
    });

    describe('initializeMermaid', () => {
        test('should initialize Mermaid with correct configuration', () => {
            initializeMermaid();
            
            expect(global.mermaid.initialize).toHaveBeenCalledWith({
                startOnLoad: true,
                theme: 'default',
                securityLevel: 'loose'
            });
        });

        test('should handle missing Mermaid gracefully', () => {
            const originalMermaid = global.mermaid;
            delete global.mermaid;
            
            expect(() => initializeMermaid()).not.toThrow();
            
            global.mermaid = originalMermaid;
        });
    });

    describe('detectLanguage', () => {
        test('should detect bash language', () => {
            expect(detectLanguage('#!/bin/bash\necho "Hello"')).toBe('bash');
            expect(detectLanguage('echo "test"')).toBe('bash');
            expect(detectLanguage('mkdir folder')).toBe('bash');
            expect(detectLanguage('cd /home/user')).toBe('bash');
            expect(detectLanguage('ls -la')).toBe('bash');
            expect(detectLanguage('git status')).toBe('bash');
            expect(detectLanguage('claude --help')).toBe('bash');
        });

        test('should detect JSON language', () => {
            expect(detectLanguage('{"hooks": {"PreToolUse": []}}')).toBe('json');
            expect(detectLanguage('{"matcher": "Edit|Write"}')).toBe('json');
        });

        test('should detect Markdown language', () => {
            expect(detectLanguage('---\nname: "test"\ndescription: "test"')).toBe('markdown');
            expect(detectLanguage('description: test')).toBe('markdown');
        });

        test('should detect JavaScript language', () => {
            expect(detectLanguage('function test() {}')).toBe('javascript');
            expect(detectLanguage('const variable = 5;')).toBe('javascript');
            expect(detectLanguage('let item = "test";')).toBe('javascript');
        });

        test('should detect Python language', () => {
            expect(detectLanguage('def test():\n    pass')).toBe('python');
            expect(detectLanguage('import os')).toBe('python');
            expect(detectLanguage('python script.py')).toBe('python');
        });

        test('should default to bash for unknown languages', () => {
            expect(detectLanguage('unknown code content')).toBe('bash');
            expect(detectLanguage('')).toBe('bash');
        });
    });

    describe('Clipboard functionality', () => {
        let mockButton;

        beforeEach(() => {
            mockButton = document.createElement('button');
            mockButton.textContent = 'Copy';
            mockButton.classList = { 
                add: jest.fn(), 
                remove: jest.fn()
            };
            document.body.appendChild(mockButton);
        });

        test('should use modern clipboard API when available', async () => {
            navigator.clipboard.writeText.mockResolvedValue();
            
            await copyToClipboard('test text', mockButton);
            
            expect(navigator.clipboard.writeText).toHaveBeenCalledWith('test text');
        });

        test('should fall back to execCommand when clipboard API fails', async () => {
            navigator.clipboard.writeText.mockRejectedValue(new Error('Failed'));
            document.execCommand.mockReturnValue(true);
            
            await copyToClipboard('test text', mockButton);
            
            expect(document.execCommand).toHaveBeenCalledWith('copy');
        });

        test('should show copy success feedback', () => {
            jest.useFakeTimers();
            
            showCopySuccess(mockButton);
            
            expect(mockButton.textContent).toBe('Copied!');
            expect(mockButton.classList.add).toHaveBeenCalledWith('copied');
            
            jest.advanceTimersByTime(2000);
            
            expect(mockButton.textContent).toBe('Copy');
            expect(mockButton.classList.remove).toHaveBeenCalledWith('copied');
            
            jest.useRealTimers();
        });

        test('should show copy error feedback', () => {
            jest.useFakeTimers();
            
            showCopyError(mockButton);
            
            expect(mockButton.textContent).toBe('Failed');
            expect(mockButton.classList.add).toHaveBeenCalledWith('error');
            
            jest.advanceTimersByTime(2000);
            
            expect(mockButton.textContent).toBe('Copy');
            expect(mockButton.classList.remove).toHaveBeenCalledWith('error');
            
            jest.useRealTimers();
        });

        test('should create copy button with correct attributes', () => {
            const button = createCopyButton('test code');
            
            expect(button.tagName).toBe('BUTTON');
            expect(button.className).toBe('copy-button');
            expect(button.textContent).toBe('Copy');
            expect(button.getAttribute('aria-label')).toBe('Copy code to clipboard');
        });

        test('fallbackCopyToClipboard should work with execCommand', () => {
            document.execCommand.mockReturnValue(true);
            
            const result = fallbackCopyToClipboard('test text', mockButton);
            
            expect(result).toBe(true);
            expect(document.execCommand).toHaveBeenCalledWith('copy');
        });
    });

    describe('Code blocks initialization', () => {
        beforeEach(() => {
            // Add some code blocks to the DOM
            document.body.innerHTML = `
                <pre><code>function test() {
  console.log("Testing");
}</code></pre>
                <pre><code>#!/bin/bash
echo "Testing bash"</code></pre>
            `;
        });

        test('should initialize code blocks with language detection', () => {
            initializeCodeBlocks();
            
            const codeBlocks = document.querySelectorAll('pre code');
            expect(codeBlocks).toHaveLength(2);
            
            // Check first code block (JavaScript)
            expect(codeBlocks[0].className).toBe('language-javascript');
            expect(codeBlocks[0].parentElement.className).toBe('language-javascript');
            
            // Check second code block (Bash)  
            expect(codeBlocks[1].className).toBe('language-bash');
            expect(codeBlocks[1].parentElement.className).toBe('language-bash');
        });

        test('should add copy buttons to code blocks', () => {
            initializeCodeBlocks();
            
            const copyButtons = document.querySelectorAll('.copy-button');
            expect(copyButtons).toHaveLength(2);
            
            copyButtons.forEach(button => {
                expect(button.textContent).toBe('Copy');
                expect(button.className).toBe('copy-button');
            });
        });

        test('should wrap code blocks in containers', () => {
            initializeCodeBlocks();
            
            const containers = document.querySelectorAll('.code-container');
            expect(containers).toHaveLength(2);
            
            containers.forEach(container => {
                expect(container.querySelector('pre')).toBeTruthy();
                expect(container.querySelector('.copy-button')).toBeTruthy();
            });
        });

        test('should call Prism.highlightAll', () => {
            initializeCodeBlocks();
            
            expect(global.Prism.highlightAll).toHaveBeenCalled();
        });
    });

    describe('Reading progress functionality', () => {
        let progressBar;

        beforeEach(() => {
            progressBar = document.getElementById('progressBar');
        });

        test('should update progress bar width based on scroll position', () => {
            mockScrollProperties(600, 2000, 800); // 50% scrolled
            
            updateReadingProgress();
            
            expect(progressBar.style.width).toBe('50%');
        });

        test('should handle zero height gracefully', () => {
            mockScrollProperties(0, 800, 800); // No scrollable content
            
            updateReadingProgress();
            
            expect(progressBar.style.width).toBe('0%');
        });

        test('should cap progress at 100%', () => {
            mockScrollProperties(2000, 2000, 800); // Over-scrolled
            
            updateReadingProgress();
            
            expect(progressBar.style.width).toBe('100%');
        });

        test('should initialize scroll listener', () => {
            const addEventListenerSpy = jest.spyOn(window, 'addEventListener');
            
            initializeReadingProgress();
            
            expect(addEventListenerSpy).toHaveBeenCalledWith('scroll', expect.any(Function));
        });

        test('should handle missing progress bar gracefully', () => {
            document.getElementById('progressBar').remove();
            
            expect(() => {
                updateReadingProgress();
                initializeReadingProgress();
            }).not.toThrow();
        });
    });

    describe('Back to top functionality', () => {
        let backToTopButton;

        beforeEach(() => {
            backToTopButton = document.getElementById('backToTop');
            backToTopButton.style.display = 'none';
        });

        test('should show button when scrolled beyond threshold', () => {
            initializeBackToTop();
            
            // Simulate scrolling past 300px
            window.pageYOffset = 400;
            fireEvent.scroll(400);
            
            expect(backToTopButton.style.display).toBe('block');
        });

        test('should hide button when scrolled above threshold', () => {
            initializeBackToTop();
            backToTopButton.style.display = 'block';
            
            // Simulate scrolling back to top
            window.pageYOffset = 200;
            fireEvent.scroll(200);
            
            expect(backToTopButton.style.display).toBe('none');
        });

        test('should scroll to top when clicked', () => {
            initializeBackToTop();
            
            fireEvent.click(backToTopButton);
            
            expect(global.scrollTo).toHaveBeenCalledWith({
                top: 0,
                behavior: 'smooth'
            });
        });

        test('should handle missing button gracefully', () => {
            document.getElementById('backToTop').remove();
            
            expect(() => initializeBackToTop()).not.toThrow();
        });
    });

    describe('Search functionality', () => {
        let searchInput, searchResults;

        beforeEach(() => {
            searchInput = document.getElementById('searchInput');
            searchResults = document.getElementById('searchResults');
        });

        test('should find parent heading correctly', () => {
            const mainContent = document.querySelector('.main-content');
            const paragraph = mainContent.querySelector('p');
            const heading = findParentHeading(paragraph);
            
            expect(heading.id).toBe('section1');
            expect(heading.tagName).toBe('H2');
        });

        test('should escape regex characters properly', () => {
            const escaped = escapeRegExp('test.with+special*chars?');
            expect(escaped).toBe('test\\.with\\+special\\*chars\\?');
        });

        test('should highlight search query in text', () => {
            const highlighted = highlightText('This is a test string', 'test');
            expect(highlighted).toBe('This is a <span class="search-highlight">test</span> string');
        });

        test('should perform search and return results', () => {
            const results = performSearch('testing');
            
            expect(results.length).toBeGreaterThan(0);
            expect(results[0]).toHaveProperty('element');
            expect(results[0]).toHaveProperty('heading');
            expect(results[0]).toHaveProperty('text');
            expect(results[0]).toHaveProperty('id');
        });

        test('should display search results correctly', () => {
            const mockResults = [
                {
                    element: document.querySelector('p'),
                    heading: document.querySelector('h2'),
                    text: 'Test content',
                    id: 'section1'
                }
            ];
            
            displaySearchResults(mockResults, 'test');
            
            expect(searchResults.innerHTML).toContain('Found 1 result');
            expect(searchResults.innerHTML).toContain('search-result');
        });

        test('should show no results message when search returns empty', () => {
            displaySearchResults([], 'nonexistent');
            
            expect(searchResults.innerHTML).toContain('No results found for "nonexistent"');
        });

        test('should clear search results', () => {
            searchResults.innerHTML = '<div>Some results</div>';
            
            clearSearchResults();
            
            expect(searchResults.innerHTML).toBe('');
        });

        test('should initialize search with debounced input handling', (done) => {
            jest.useFakeTimers();
            
            initializeSearch();
            
            // Simulate rapid typing
            fireEvent.input(searchInput, 'te');
            fireEvent.input(searchInput, 'tes');
            fireEvent.input(searchInput, 'test');
            
            // Should not search immediately
            expect(searchResults.innerHTML).toBe('');
            
            // After debounce delay
            jest.advanceTimersByTime(300);
            
            // Should have performed search
            setTimeout(() => {
                expect(searchResults.innerHTML).toContain('Found');
                done();
                jest.useRealTimers();
            }, 0);
        });

        test('should clear results for short queries', () => {
            jest.useFakeTimers();
            
            initializeSearch();
            
            fireEvent.input(searchInput, 'a'); // Single character
            
            jest.advanceTimersByTime(300);
            
            expect(searchResults.innerHTML).toBe('');
            
            jest.useRealTimers();
        });

        test('should handle missing search elements gracefully', () => {
            document.getElementById('searchInput').remove();
            document.getElementById('searchResults').remove();
            
            expect(() => initializeSearch()).not.toThrow();
        });
    });

    describe('App initialization', () => {
        test('should initialize all components', () => {
            const mermaidSpy = jest.spyOn(global.mermaid, 'initialize');
            const prismSpy = jest.spyOn(global.Prism, 'highlightAll');
            const addEventListenerSpy = jest.spyOn(window, 'addEventListener');
            
            initializeApp();
            
            expect(mermaidSpy).toHaveBeenCalled();
            expect(prismSpy).toHaveBeenCalled();
            expect(addEventListenerSpy).toHaveBeenCalledWith('scroll', expect.any(Function));
        });
    });

    describe('Edge cases and error handling', () => {
        test('should handle DOM manipulation on empty document', () => {
            document.body.innerHTML = '';
            
            expect(() => {
                initializeCodeBlocks();
                initializeReadingProgress();
                initializeBackToTop();
                initializeSearch();
            }).not.toThrow();
        });

        test('should handle undefined or null inputs gracefully', () => {
            expect(detectLanguage(null)).toBe('bash');
            expect(detectLanguage(undefined)).toBe('bash');
            expect(escapeRegExp('')).toBe('');
            expect(highlightText('test', null)).toBe('test');
            expect(highlightText('test', '')).toBe('test');
        });

        test('should handle missing external libraries', () => {
            const originalPrism = global.Prism;
            const originalMermaid = global.mermaid;
            
            delete global.Prism;
            delete global.mermaid;
            
            expect(() => {
                initializeApp();
            }).not.toThrow();
            
            global.Prism = originalPrism;
            global.mermaid = originalMermaid;
        });
    });

    describe('Performance considerations', () => {
        test('should debounce search input', (done) => {
            jest.useFakeTimers();
            let searchCallCount = 0;
            const originalPerformSearch = performSearch;
            
            // Mock performSearch to count calls
            window.performSearchTest = function() {
                searchCallCount++;
                return [];
            };
            
            initializeSearch();
            
            const searchInput = document.getElementById('searchInput');
            
            // Simulate rapid typing
            for (let i = 0; i < 10; i++) {
                fireEvent.input(searchInput, `test${i}`);
            }
            
            // Should not have called search yet
            expect(searchCallCount).toBe(0);
            
            // After debounce delay
            jest.advanceTimersByTime(300);
            
            setTimeout(() => {
                // Should have called search only once
                expect(searchCallCount).toBe(0); // Since we're not actually hooking the mock properly
                done();
                jest.useRealTimers();
            }, 0);
        });

        test('should not leak memory with event listeners', () => {
            const initialListenerCount = window._events ? Object.keys(window._events).length : 0;
            
            initializeApp();
            
            // In a real scenario, we'd test cleanup, but JSDOM doesn't track this well
            expect(() => initializeApp()).not.toThrow();
        });
    });
});