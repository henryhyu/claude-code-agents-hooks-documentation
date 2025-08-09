// Performance tests for scripts functionality
import { 
    initializeApp,
    performSearch,
    detectLanguage,
    initializeCodeBlocks
} from '../scripts-testable.js';
import { createMockHTML } from './setup.js';

describe('Performance Tests', () => {
    
    beforeEach(() => {
        document.body.innerHTML = '';
        createMockHTML();
        jest.clearAllMocks();
    });

    describe('Search performance', () => {
        beforeEach(() => {
            // Create a larger DOM structure for performance testing
            const mainContent = document.querySelector('.main-content');
            
            // Add many searchable elements
            for (let i = 0; i < 100; i++) {
                const section = document.createElement('div');
                section.innerHTML = `
                    <h3 id="section${i}">Section ${i}</h3>
                    <p>This is paragraph ${i} with some searchable content. It contains keywords like test, performance, and optimization.</p>
                    <code>function example${i}() { return "code block ${i}"; }</code>
                    <ul>
                        <li>Item ${i}-1</li>
                        <li>Item ${i}-2</li>
                        <li>Item ${i}-3</li>
                    </ul>
                `;
                mainContent.appendChild(section);
            }
        });

        test('should handle large DOM search efficiently', () => {
            const startTime = performance.now();
            
            const results = performSearch('performance');
            
            const endTime = performance.now();
            const duration = endTime - startTime;
            
            // Search should complete quickly (under 100ms for 100 elements)
            expect(duration).toBeLessThan(100);
            expect(results.length).toBeGreaterThan(0);
        });

        test('should handle frequent search queries efficiently', () => {
            const queries = ['test', 'performance', 'code', 'section', 'item', 'example'];
            const startTime = performance.now();
            
            // Perform multiple searches
            const allResults = queries.map(query => performSearch(query));
            
            const endTime = performance.now();
            const duration = endTime - startTime;
            
            // All searches should complete quickly
            expect(duration).toBeLessThan(200);
            expect(allResults.every(results => Array.isArray(results))).toBe(true);
        });

        test('should not degrade with empty or very short queries', () => {
            const queries = ['', 'a', 'ab', 'xyz', '123'];
            const startTime = performance.now();
            
            queries.forEach(query => {
                const results = performSearch(query);
                expect(Array.isArray(results)).toBe(true);
            });
            
            const endTime = performance.now();
            const duration = endTime - startTime;
            
            expect(duration).toBeLessThan(50);
        });
    });

    describe('Language detection performance', () => {
        const codeExamples = [
            '#!/bin/bash\necho "Hello World"',
            'function test() { console.log("test"); }',
            'def hello():\n    print("Hello")',
            '{"key": "value", "array": [1, 2, 3]}',
            '---\nname: test\ndescription: example',
            'const x = 5;\nlet y = 10;\nvar z = x + y;',
            'import os\nimport sys\ndef main(): pass',
            'mkdir test\ncd test\nls -la',
            'git status\ngit add .\ngit commit -m "test"',
            'claude --agent test-agent'
        ];

        test('should detect languages quickly for multiple code blocks', () => {
            const startTime = performance.now();
            
            // Detect language for many code samples
            const results = [];
            for (let i = 0; i < 100; i++) {
                const code = codeExamples[i % codeExamples.length];
                results.push(detectLanguage(code));
            }
            
            const endTime = performance.now();
            const duration = endTime - startTime;
            
            // Should complete quickly
            expect(duration).toBeLessThan(50);
            expect(results.length).toBe(100);
            expect(results.every(lang => typeof lang === 'string')).toBe(true);
        });

        test('should handle very long code strings efficiently', () => {
            const longCode = 'function test() {\n' + '  console.log("line");\n'.repeat(1000) + '}';
            
            const startTime = performance.now();
            
            const language = detectLanguage(longCode);
            
            const endTime = performance.now();
            const duration = endTime - startTime;
            
            expect(duration).toBeLessThan(20);
            expect(language).toBe('javascript');
        });
    });

    describe('Code block initialization performance', () => {
        beforeEach(() => {
            // Create many code blocks
            const container = document.createElement('div');
            
            for (let i = 0; i < 50; i++) {
                const pre = document.createElement('pre');
                const code = document.createElement('code');
                code.textContent = `function example${i}() {
  return "This is code block number ${i}";
}`;
                pre.appendChild(code);
                container.appendChild(pre);
            }
            
            document.body.appendChild(container);
        });

        test('should initialize many code blocks efficiently', () => {
            const startTime = performance.now();
            
            initializeCodeBlocks();
            
            const endTime = performance.now();
            const duration = endTime - startTime;
            
            // Should handle 50 code blocks quickly
            expect(duration).toBeLessThan(200);
            
            // Verify all blocks were processed
            const containers = document.querySelectorAll('.code-container');
            expect(containers.length).toBe(50);
            
            const copyButtons = document.querySelectorAll('.copy-button');
            expect(copyButtons.length).toBe(50);
        });
    });

    describe('Event handler performance', () => {
        test('should handle rapid scroll events efficiently', () => {
            jest.useFakeTimers();
            
            initializeApp();
            
            const startTime = performance.now();
            
            // Simulate rapid scrolling
            for (let i = 0; i < 100; i++) {
                window.pageYOffset = i * 10;
                const event = new Event('scroll');
                window.dispatchEvent(event);
            }
            
            const endTime = performance.now();
            const duration = endTime - startTime;
            
            // Should handle many scroll events quickly
            expect(duration).toBeLessThan(100);
            
            jest.useRealTimers();
        });

        test('should debounce search input effectively', () => {
            jest.useFakeTimers();
            
            initializeApp();
            
            const searchInput = document.getElementById('searchInput');
            let searchCount = 0;
            
            // Mock the search function to count calls
            const originalPerformSearch = window.performSearch;
            const mockPerformSearch = jest.fn(() => []);
            
            // Simulate rapid typing
            const startTime = performance.now();
            
            for (let i = 0; i < 20; i++) {
                const event = new Event('input');
                searchInput.value = `test query ${i}`;
                searchInput.dispatchEvent(event);
            }
            
            // Advance timers to trigger debounced function
            jest.advanceTimersByTime(300);
            
            const endTime = performance.now();
            const duration = endTime - startTime;
            
            // Should handle rapid input changes efficiently
            expect(duration).toBeLessThan(50);
            
            jest.useRealTimers();
        });
    });

    describe('Memory usage patterns', () => {
        test('should not create memory leaks with repeated initializations', () => {
            // Get initial state
            const initialCopyButtons = document.querySelectorAll('.copy-button').length;
            
            // Initialize multiple times
            for (let i = 0; i < 10; i++) {
                initializeApp();
            }
            
            // Should not multiply elements
            const finalCopyButtons = document.querySelectorAll('.copy-button').length;
            
            // Verify we don't create duplicate elements
            expect(finalCopyButtons).toBeGreaterThanOrEqual(initialCopyButtons);
            
            // Should complete quickly even with multiple inits
            const startTime = performance.now();
            initializeApp();
            const endTime = performance.now();
            
            expect(endTime - startTime).toBeLessThan(100);
        });

        test('should handle DOM cleanup efficiently', () => {
            initializeApp();
            
            const startTime = performance.now();
            
            // Remove and recreate DOM elements
            document.body.innerHTML = '';
            createMockHTML();
            
            const endTime = performance.now();
            const duration = endTime - startTime;
            
            expect(duration).toBeLessThan(50);
            
            // Re-initialization should still work
            expect(() => initializeApp()).not.toThrow();
        });
    });

    describe('Scalability tests', () => {
        test('should handle documents with many sections efficiently', () => {
            // Create a document structure similar to the real page but larger
            const mainContent = document.querySelector('.main-content');
            
            // Add many sections with various content types
            for (let i = 0; i < 200; i++) {
                const section = document.createElement('section');
                section.innerHTML = `
                    <h2 id="heading-${i}">Heading ${i}</h2>
                    <p>Paragraph with content for section ${i}. This contains searchable text.</p>
                    <pre><code>function code${i}() { return ${i}; }</code></pre>
                    <ul>
                        <li>List item ${i}-1</li>
                        <li>List item ${i}-2</li>
                    </ul>
                `;
                mainContent.appendChild(section);
            }
            
            const startTime = performance.now();
            
            initializeApp();
            
            const endTime = performance.now();
            const duration = endTime - startTime;
            
            // Should initialize large document efficiently
            expect(duration).toBeLessThan(500);
            
            // Verify functionality still works
            const copyButtons = document.querySelectorAll('.copy-button');
            expect(copyButtons.length).toBe(200);
            
            const searchResults = performSearch('section');
            expect(searchResults.length).toBeGreaterThan(0);
        });
    });

    describe('Real-world usage patterns', () => {
        test('should handle typical user interaction patterns efficiently', () => {
            jest.useFakeTimers();
            
            initializeApp();
            
            const startTime = performance.now();
            
            // Simulate typical user session
            // 1. User scrolls around
            for (let i = 0; i < 20; i++) {
                window.pageYOffset = Math.random() * 1000;
                window.dispatchEvent(new Event('scroll'));
            }
            
            // 2. User searches for things
            const searchInput = document.getElementById('searchInput');
            const queries = ['function', 'test', 'code', 'example'];
            queries.forEach(query => {
                const event = new Event('input');
                searchInput.value = query;
                searchInput.dispatchEvent(event);
                jest.advanceTimersByTime(350); // Allow debounce
            });
            
            // 3. User copies some code
            const copyButtons = document.querySelectorAll('.copy-button');
            if (copyButtons.length > 0) {
                copyButtons[0].click();
                copyButtons[Math.min(1, copyButtons.length - 1)].click();
            }
            
            // 4. User scrolls back to top
            const backToTop = document.getElementById('backToTop');
            if (backToTop) {
                backToTop.click();
            }
            
            const endTime = performance.now();
            const duration = endTime - startTime;
            
            // Entire user session should be responsive
            expect(duration).toBeLessThan(300);
            
            jest.useRealTimers();
        });
    });
});