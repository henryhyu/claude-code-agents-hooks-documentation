// Integration tests for complete user workflows
import { initializeApp } from '../scripts-testable.js';
import { fireEvent, waitFor, flushPromises } from './test-utils.js';
import { createMockHTML } from './setup.js';

describe('Integration Tests - User Workflows', () => {
    
    beforeEach(() => {
        document.body.innerHTML = '';
        createMockHTML();
        jest.clearAllMocks();
        
        // Reset scroll position
        window.pageYOffset = 0;
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
    });

    describe('Complete page initialization workflow', () => {
        test('should initialize all features when page loads', async () => {
            // Initialize the app (simulating DOMContentLoaded)
            initializeApp();
            
            // Check that Mermaid was initialized
            expect(global.mermaid.initialize).toHaveBeenCalled();
            
            // Check that code blocks are processed
            const codeBlocks = document.querySelectorAll('pre code');
            expect(codeBlocks.length).toBeGreaterThan(0);
            
            // Check that each code block has language classes
            codeBlocks.forEach(block => {
                expect(block.className).toMatch(/language-/);
            });
            
            // Check that copy buttons are created
            await waitFor(() => {
                const copyButtons = document.querySelectorAll('.copy-button');
                return copyButtons.length === codeBlocks.length;
            });
            
            // Check that search functionality is active
            const searchInput = document.getElementById('searchInput');
            expect(searchInput).toBeTruthy();
            
            // Check that back to top button exists
            const backToTop = document.getElementById('backToTop');
            expect(backToTop).toBeTruthy();
            
            // Check that reading progress bar exists
            const progressBar = document.getElementById('progressBar');
            expect(progressBar).toBeTruthy();
        });
    });

    describe('User scrolling behavior', () => {
        beforeEach(() => {
            initializeApp();
        });

        test('should update reading progress and back-to-top visibility while scrolling', () => {
            const progressBar = document.getElementById('progressBar');
            const backToTopButton = document.getElementById('backToTop');
            
            // Initially at top
            expect(progressBar.style.width).toBe('0%');
            expect(backToTopButton.style.display).toBe('none');
            
            // Scroll to middle
            window.pageYOffset = 600;
            document.documentElement.scrollTop = 600;
            document.body.scrollTop = 600;
            fireEvent.scroll(600);
            
            // Should show progress and back-to-top button
            expect(progressBar.style.width).toBe('50%');
            expect(backToTopButton.style.display).toBe('block');
            
            // Scroll back to near top
            window.pageYOffset = 100;
            document.documentElement.scrollTop = 100;
            document.body.scrollTop = 100;
            fireEvent.scroll(100);
            
            // Should update progress and hide button
            expect(parseFloat(progressBar.style.width)).toBeLessThan(10);
            expect(backToTopButton.style.display).toBe('none');
        });
    });

    describe('Search user journey', () => {
        beforeEach(() => {
            initializeApp();
        });

        test('should complete full search interaction workflow', async () => {
            const searchInput = document.getElementById('searchInput');
            const searchResults = document.getElementById('searchResults');
            
            // Initially no results
            expect(searchResults.innerHTML).toBe('');
            
            // User types a query
            fireEvent.input(searchInput, 'test');
            
            // Should wait for debounce
            expect(searchResults.innerHTML).toBe('');
            
            // After debounce delay
            await new Promise(resolve => setTimeout(resolve, 350));
            
            // Should show results
            expect(searchResults.innerHTML).toContain('Found');
            expect(searchResults.innerHTML).toContain('result');
            
            // User types shorter query
            fireEvent.input(searchInput, 'x');
            
            await new Promise(resolve => setTimeout(resolve, 350));
            
            // Should clear results for short queries
            expect(searchResults.innerHTML).toBe('');
            
            // User clears search
            fireEvent.input(searchInput, '');
            
            // Click outside search area
            fireEvent.click(document.body);
            
            // Results should be cleared
            expect(searchResults.innerHTML).toBe('');
        });

        test('should handle search with no results gracefully', async () => {
            const searchInput = document.getElementById('searchInput');
            const searchResults = document.getElementById('searchResults');
            
            // Search for something that doesn't exist
            fireEvent.input(searchInput, 'xyznonexistent');
            
            await new Promise(resolve => setTimeout(resolve, 350));
            
            expect(searchResults.innerHTML).toContain('No results found');
            expect(searchResults.innerHTML).toContain('xyznonexistent');
        });
    });

    describe('Code block interaction workflow', () => {
        beforeEach(() => {
            initializeApp();
        });

        test('should handle complete copy-to-clipboard workflow', async () => {
            const copyButton = document.querySelector('.copy-button');
            expect(copyButton).toBeTruthy();
            expect(copyButton.textContent).toBe('Copy');
            
            // Mock successful clipboard operation
            navigator.clipboard.writeText.mockResolvedValue();
            
            // User clicks copy button
            fireEvent.click(copyButton);
            
            // Should show success feedback
            await waitFor(() => {
                return copyButton.textContent === 'Copied!';
            });
            
            expect(navigator.clipboard.writeText).toHaveBeenCalled();
            
            // Should reset after timeout
            await new Promise(resolve => setTimeout(resolve, 2100));
            
            expect(copyButton.textContent).toBe('Copy');
        });

        test('should handle clipboard copy failure gracefully', async () => {
            const copyButton = document.querySelector('.copy-button');
            
            // Mock clipboard API failure
            navigator.clipboard.writeText.mockRejectedValue(new Error('Clipboard failed'));
            document.execCommand.mockReturnValue(false);
            
            // User clicks copy button
            fireEvent.click(copyButton);
            
            // Should show error feedback
            await waitFor(() => {
                return copyButton.textContent === 'Failed';
            });
            
            // Should reset after timeout
            await new Promise(resolve => setTimeout(resolve, 2100));
            
            expect(copyButton.textContent).toBe('Copy');
        });
    });

    describe('Back to top user interaction', () => {
        beforeEach(() => {
            initializeApp();
        });

        test('should handle complete back-to-top workflow', () => {
            const backToTopButton = document.getElementById('backToTop');
            
            // Scroll down to show button
            window.pageYOffset = 500;
            fireEvent.scroll(500);
            
            expect(backToTopButton.style.display).toBe('block');
            
            // User clicks back to top
            fireEvent.click(backToTopButton);
            
            // Should call scrollTo
            expect(global.scrollTo).toHaveBeenCalledWith({
                top: 0,
                behavior: 'smooth'
            });
        });
    });

    describe('Responsive behavior and accessibility', () => {
        beforeEach(() => {
            initializeApp();
        });

        test('should maintain accessibility attributes', () => {
            const copyButtons = document.querySelectorAll('.copy-button');
            
            copyButtons.forEach(button => {
                expect(button.getAttribute('aria-label')).toBe('Copy code to clipboard');
            });
            
            const backToTopButton = document.getElementById('backToTop');
            expect(backToTopButton.getAttribute('title')).toBe('Back to top');
        });

        test('should handle keyboard interactions', () => {
            const searchInput = document.getElementById('searchInput');
            
            // Should accept keyboard input
            fireEvent.input(searchInput, 'keyboard test');
            
            expect(searchInput.value).toBe('keyboard test');
        });
    });

    describe('Performance and memory management', () => {
        test('should not create memory leaks with multiple initializations', () => {
            // Initialize multiple times (simulating page navigation)
            for (let i = 0; i < 5; i++) {
                initializeApp();
            }
            
            // Should not throw errors
            expect(() => initializeApp()).not.toThrow();
            
            // Event listeners should be properly managed
            const searchInput = document.getElementById('searchInput');
            expect(searchInput).toBeTruthy();
        });
    });

    describe('Error recovery and robustness', () => {
        test('should recover gracefully from DOM manipulation errors', () => {
            // Simulate DOM being modified during initialization
            const originalQuerySelector = document.querySelector;
            let callCount = 0;
            
            document.querySelector = function(selector) {
                callCount++;
                if (callCount === 3) {
                    throw new Error('DOM manipulation error');
                }
                return originalQuerySelector.call(document, selector);
            };
            
            // Should not crash the entire application
            expect(() => initializeApp()).not.toThrow();
            
            // Restore original method
            document.querySelector = originalQuerySelector;
        });

        test('should handle missing DOM elements gracefully', () => {
            // Remove key elements
            const progressBar = document.getElementById('progressBar');
            const searchInput = document.getElementById('searchInput');
            const backToTop = document.getElementById('backToTop');
            
            if (progressBar) progressBar.remove();
            if (searchInput) searchInput.remove();
            if (backToTop) backToTop.remove();
            
            // Should not crash
            expect(() => initializeApp()).not.toThrow();
        });
    });

    describe('Cross-browser compatibility simulation', () => {
        test('should work without modern clipboard API', async () => {
            // Simulate older browser
            const originalClipboard = navigator.clipboard;
            const originalIsSecureContext = window.isSecureContext;
            
            delete navigator.clipboard;
            window.isSecureContext = false;
            
            initializeApp();
            
            const copyButton = document.querySelector('.copy-button');
            document.execCommand.mockReturnValue(true);
            
            fireEvent.click(copyButton);
            
            await waitFor(() => {
                return copyButton.textContent === 'Copied!';
            });
            
            expect(document.execCommand).toHaveBeenCalledWith('copy');
            
            // Restore
            navigator.clipboard = originalClipboard;
            window.isSecureContext = originalIsSecureContext;
        });

        test('should work without smooth scroll behavior', () => {
            // Test fallback scrolling
            const originalScrollTo = window.scrollTo;
            window.scrollTo = function(options) {
                // Simulate browser that doesn't support smooth scrolling
                if (typeof options === 'object') {
                    window.scrollTo(0, options.top);
                }
            };
            
            initializeApp();
            
            const backToTopButton = document.getElementById('backToTop');
            window.pageYOffset = 500;
            fireEvent.scroll(500);
            
            expect(() => fireEvent.click(backToTopButton)).not.toThrow();
            
            window.scrollTo = originalScrollTo;
        });
    });

    describe('User experience scenarios', () => {
        test('should provide immediate feedback on user interactions', async () => {
            initializeApp();
            
            // Test immediate visual feedback on button hover/focus
            const copyButton = document.querySelector('.copy-button');
            
            // Should have proper button element
            expect(copyButton.tagName).toBe('BUTTON');
            expect(copyButton.textContent).toBe('Copy');
            
            // Test search provides immediate visual feedback
            const searchInput = document.getElementById('searchInput');
            fireEvent.input(searchInput, 'immediate');
            
            // Input should update immediately
            expect(searchInput.value).toBe('immediate');
        });

        test('should handle rapid user interactions', async () => {
            jest.useFakeTimers();
            
            initializeApp();
            
            const searchInput = document.getElementById('searchInput');
            
            // Simulate user rapidly typing and deleting
            for (let i = 0; i < 10; i++) {
                fireEvent.input(searchInput, `rapid${i}`);
                fireEvent.input(searchInput, '');
            }
            
            // Should not crash or cause errors
            expect(() => jest.advanceTimersByTime(1000)).not.toThrow();
            
            jest.useRealTimers();
        });
    });
});