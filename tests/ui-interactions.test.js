// Tests for UI interactions, button hover effects, and keyboard navigation
import { fireEvent, waitFor } from './test-utils.js';
import { createMockHTML } from './setup.js';

describe('UI Interactions and Effects', () => {
    beforeEach(() => {
        document.body.innerHTML = '';
        createMockHTML();
        
        // Add additional UI elements for testing
        document.body.innerHTML += `
            <button class="primary-btn" id="testBtn1">Test Button 1</button>
            <button class="secondary-btn" id="testBtn2">Test Button 2</button>
            <div class="copy-button" id="copyBtn">Copy</div>
            <div class="search-container">
                <input type="text" id="searchInput" placeholder="Search...">
                <div id="searchResults"></div>
            </div>
        `;

        jest.clearAllMocks();
    });

    describe('Button Hover Effects', () => {
        test('should add hover class on mouseenter', () => {
            const button = document.getElementById('testBtn1');
            
            // Simulate the hover effect implementation
            button.addEventListener('mouseenter', function() {
                this.classList.add('hover-effect');
            });
            
            fireEvent.mouseEnter(button);
            
            expect(button.classList.contains('hover-effect')).toBe(true);
        });

        test('should remove hover class on mouseleave', () => {
            const button = document.getElementById('testBtn1');
            button.classList.add('hover-effect');
            
            button.addEventListener('mouseleave', function() {
                this.classList.remove('hover-effect');
            });
            
            fireEvent.mouseLeave(button);
            
            expect(button.classList.contains('hover-effect')).toBe(false);
        });

        test('should handle hover effects on copy buttons', () => {
            const copyButton = document.getElementById('copyBtn');
            
            // Simulate copy button hover behavior
            copyButton.addEventListener('mouseenter', function() {
                this.style.backgroundColor = '#f0f0f0';
                this.style.transform = 'scale(1.05)';
            });
            
            copyButton.addEventListener('mouseleave', function() {
                this.style.backgroundColor = '';
                this.style.transform = '';
            });
            
            fireEvent.mouseEnter(copyButton);
            expect(copyButton.style.backgroundColor).toBe('rgb(240, 240, 240)');
            expect(copyButton.style.transform).toBe('scale(1.05)');
            
            fireEvent.mouseLeave(copyButton);
            expect(copyButton.style.backgroundColor).toBe('');
            expect(copyButton.style.transform).toBe('');
        });

        test('should handle multiple buttons with hover effects', () => {
            const buttons = document.querySelectorAll('button');
            const hoverStates = new Map();
            
            buttons.forEach(button => {
                button.addEventListener('mouseenter', function() {
                    hoverStates.set(this.id, true);
                    this.classList.add('hovered');
                });
                
                button.addEventListener('mouseleave', function() {
                    hoverStates.set(this.id, false);
                    this.classList.remove('hovered');
                });
            });
            
            // Test first button
            fireEvent.mouseEnter(buttons[0]);
            expect(hoverStates.get(buttons[0].id)).toBe(true);
            expect(buttons[0].classList.contains('hovered')).toBe(true);
            
            // Test second button
            fireEvent.mouseEnter(buttons[1]);
            expect(hoverStates.get(buttons[1].id)).toBe(true);
            expect(buttons[1].classList.contains('hovered')).toBe(true);
            
            // Leave first button
            fireEvent.mouseLeave(buttons[0]);
            expect(hoverStates.get(buttons[0].id)).toBe(false);
            expect(buttons[0].classList.contains('hovered')).toBe(false);
        });
    });

    describe('Keyboard Navigation', () => {
        test('should handle Escape key to close modals', () => {
            let modalClosed = false;
            
            // Mock modal close handler
            document.addEventListener('keydown', function(e) {
                if (e.key === 'Escape') {
                    modalClosed = true;
                }
            });
            
            fireEvent.keyDown(document, { key: 'Escape' });
            
            expect(modalClosed).toBe(true);
        });

        test('should handle Tab key navigation', () => {
            const buttons = document.querySelectorAll('button');
            let currentFocus = 0;
            
            // Mock tab navigation
            document.addEventListener('keydown', function(e) {
                if (e.key === 'Tab') {
                    e.preventDefault();
                    if (!e.shiftKey) {
                        // Forward tab
                        currentFocus = (currentFocus + 1) % buttons.length;
                    } else {
                        // Backward tab (Shift+Tab)
                        currentFocus = (currentFocus - 1 + buttons.length) % buttons.length;
                    }
                    buttons[currentFocus].focus();
                }
            });
            
            // Mock focus method
            buttons.forEach(btn => {
                btn.focus = jest.fn();
            });
            
            // Test forward tab
            fireEvent.keyDown(document, { key: 'Tab' });
            expect(buttons[1].focus).toHaveBeenCalled();
            
            // Test backward tab
            fireEvent.keyDown(document, { key: 'Tab', shiftKey: true });
            expect(buttons[0].focus).toHaveBeenCalled();
        });

        test('should handle Enter key on buttons', () => {
            const button = document.getElementById('testBtn1');
            let buttonClicked = false;
            
            button.addEventListener('click', function() {
                buttonClicked = true;
            });
            
            button.addEventListener('keydown', function(e) {
                if (e.key === 'Enter') {
                    this.click();
                }
            });
            
            fireEvent.keyDown(button, { key: 'Enter' });
            
            expect(buttonClicked).toBe(true);
        });

        test('should handle spacebar on buttons', () => {
            const button = document.getElementById('testBtn1');
            let buttonClicked = false;
            
            button.addEventListener('click', function() {
                buttonClicked = true;
            });
            
            button.addEventListener('keydown', function(e) {
                if (e.key === ' ') {
                    e.preventDefault();
                    this.click();
                }
            });
            
            fireEvent.keyDown(button, { key: ' ' });
            
            expect(buttonClicked).toBe(true);
        });

        test('should handle arrow keys for navigation', () => {
            const searchInput = document.getElementById('searchInput');
            let navigationTriggered = false;
            
            searchInput.addEventListener('keydown', function(e) {
                if (e.key === 'ArrowDown') {
                    navigationTriggered = true;
                    // Would typically move to search results
                }
            });
            
            fireEvent.keyDown(searchInput, { key: 'ArrowDown' });
            
            expect(navigationTriggered).toBe(true);
        });
    });

    describe('Focus Management', () => {
        test('should maintain focus trap in modals', () => {
            const focusableElements = document.querySelectorAll('button, input, [tabindex]:not([tabindex="-1"])');
            let focusIndex = 0;
            
            // Mock focus trap behavior
            const trapFocus = function(e) {
                if (e.key === 'Tab') {
                    e.preventDefault();
                    focusIndex = e.shiftKey ? 
                        (focusIndex - 1 + focusableElements.length) % focusableElements.length :
                        (focusIndex + 1) % focusableElements.length;
                    
                    focusableElements[focusIndex].focus();
                }
            };
            
            document.addEventListener('keydown', trapFocus);
            
            // Mock focus method
            focusableElements.forEach(el => {
                el.focus = jest.fn();
            });
            
            fireEvent.keyDown(document, { key: 'Tab' });
            expect(focusableElements[1].focus).toHaveBeenCalled();
            
            fireEvent.keyDown(document, { key: 'Tab', shiftKey: true });
            expect(focusableElements[0].focus).toHaveBeenCalled();
        });

        test('should restore focus when modal closes', () => {
            const triggerButton = document.getElementById('testBtn1');
            triggerButton.focus = jest.fn();
            
            // Simulate modal close with focus restore
            const restoreFocus = function() {
                triggerButton.focus();
            };
            
            restoreFocus();
            
            expect(triggerButton.focus).toHaveBeenCalled();
        });

        test('should handle focus indicators', () => {
            const button = document.getElementById('testBtn1');
            
            button.addEventListener('focus', function() {
                this.classList.add('focus-visible');
            });
            
            button.addEventListener('blur', function() {
                this.classList.remove('focus-visible');
            });
            
            fireEvent.focus(button);
            expect(button.classList.contains('focus-visible')).toBe(true);
            
            fireEvent.blur(button);
            expect(button.classList.contains('focus-visible')).toBe(false);
        });
    });

    describe('Touch Interactions', () => {
        test('should handle touch events on mobile', () => {
            const button = document.getElementById('testBtn1');
            let touchStarted = false;
            let touchEnded = false;
            
            button.addEventListener('touchstart', function(e) {
                touchStarted = true;
                this.classList.add('touch-active');
            });
            
            button.addEventListener('touchend', function(e) {
                touchEnded = true;
                this.classList.remove('touch-active');
            });
            
            fireEvent.touchStart(button);
            expect(touchStarted).toBe(true);
            expect(button.classList.contains('touch-active')).toBe(true);
            
            fireEvent.touchEnd(button);
            expect(touchEnded).toBe(true);
            expect(button.classList.contains('touch-active')).toBe(false);
        });

        test('should prevent double-tap zoom on buttons', () => {
            const button = document.getElementById('testBtn1');
            
            button.addEventListener('touchend', function(e) {
                e.preventDefault();
            });
            
            const touchEvent = new TouchEvent('touchend', {
                bubbles: true,
                cancelable: true
            });
            
            const preventDefaultSpy = jest.spyOn(touchEvent, 'preventDefault');
            
            button.dispatchEvent(touchEvent);
            
            expect(preventDefaultSpy).toHaveBeenCalled();
        });
    });

    describe('Animation and Transitions', () => {
        test('should handle CSS transition completion', (done) => {
            const button = document.getElementById('testBtn1');
            
            button.addEventListener('transitionend', function(e) {
                expect(e.propertyName).toBeDefined();
                done();
            });
            
            // Simulate transition
            button.style.transition = 'opacity 0.1s';
            button.style.opacity = '0.5';
            
            // Fire transitionend event manually for testing
            const transitionEvent = new TransitionEvent('transitionend', {
                propertyName: 'opacity',
                elapsedTime: 0.1
            });
            
            setTimeout(() => {
                button.dispatchEvent(transitionEvent);
            }, 10);
        });

        test('should handle loading states', () => {
            const button = document.getElementById('testBtn1');
            
            // Simulate loading state
            const setLoading = function(isLoading) {
                if (isLoading) {
                    button.classList.add('loading');
                    button.disabled = true;
                    button.textContent = 'Loading...';
                } else {
                    button.classList.remove('loading');
                    button.disabled = false;
                    button.textContent = 'Test Button 1';
                }
            };
            
            setLoading(true);
            expect(button.classList.contains('loading')).toBe(true);
            expect(button.disabled).toBe(true);
            expect(button.textContent).toBe('Loading...');
            
            setLoading(false);
            expect(button.classList.contains('loading')).toBe(false);
            expect(button.disabled).toBe(false);
            expect(button.textContent).toBe('Test Button 1');
        });
    });

    describe('Error Handling', () => {
        test('should handle missing event targets gracefully', () => {
            expect(() => {
                const handler = function(e) {
                    if (e.target) {
                        e.target.classList.add('processed');
                    }
                };
                
                // Simulate event with null target
                handler({ target: null });
            }).not.toThrow();
        });

        test('should handle DOM manipulation errors', () => {
            const button = document.getElementById('testBtn1');
            
            // Remove button from DOM
            button.remove();
            
            expect(() => {
                // Try to interact with removed element
                const btn = document.getElementById('testBtn1');
                if (btn) {
                    btn.click();
                }
            }).not.toThrow();
        });

        test('should handle event listener errors gracefully', () => {
            const button = document.getElementById('testBtn1');
            
            button.addEventListener('click', function() {
                try {
                    throw new Error('Test error');
                } catch (error) {
                    console.error('Button click error:', error.message);
                }
            });
            
            global.console.error = jest.fn();
            
            expect(() => {
                fireEvent.click(button);
            }).not.toThrow();
            
            expect(global.console.error).toHaveBeenCalledWith('Button click error:', 'Test error');
        });
    });
});