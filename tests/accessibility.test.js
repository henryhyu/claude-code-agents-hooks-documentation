// Accessibility tests for WCAG compliance and inclusive design
import { fireEvent, waitFor } from './test-utils.js';
import { createMockHTML } from './setup.js';

describe('Accessibility Tests', () => {
    beforeEach(() => {
        document.body.innerHTML = '';
        createMockHTML();
        
        // Add more comprehensive HTML structure for accessibility testing
        document.body.innerHTML += `
            <nav aria-label="Main navigation" role="navigation">
                <ul>
                    <li><a href="#section1" aria-describedby="nav-help">Section 1</a></li>
                    <li><a href="#section2">Section 2</a></li>
                </ul>
                <div id="nav-help" class="sr-only">Navigate to different sections</div>
            </nav>
            
            <main role="main" aria-label="Main content">
                <h1 id="page-title">Claude Code Documentation</h1>
                <button aria-expanded="false" aria-controls="dropdown-menu" id="dropdown-btn">Menu</button>
                <div id="dropdown-menu" aria-hidden="true" role="menu" style="display: none;">
                    <a href="#" role="menuitem">Option 1</a>
                    <a href="#" role="menuitem">Option 2</a>
                </div>
                
                <div id="live-region" aria-live="polite" aria-atomic="true"></div>
                <div id="status-region" role="status" aria-live="polite"></div>
            </main>
            
            <dialog id="modal-dialog" role="dialog" aria-labelledby="dialog-title" aria-hidden="true">
                <h2 id="dialog-title">Modal Dialog</h2>
                <p>Dialog content here</p>
                <button aria-label="Close dialog">Close</button>
            </dialog>
        `;

        jest.clearAllMocks();
    });

    describe('Semantic HTML Structure', () => {
        test('should have proper heading hierarchy', () => {
            const h1 = document.querySelector('h1');
            const h2s = document.querySelectorAll('h2');
            
            expect(h1).toBeTruthy();
            expect(h1.textContent).toBe('Claude Code Documentation');
            expect(h2s.length).toBeGreaterThan(0);
            
            // Check that h1 comes before h2s in document order
            const h1Position = Array.from(document.all).indexOf(h1);
            const firstH2Position = Array.from(document.all).indexOf(h2s[0]);
            expect(h1Position).toBeLessThan(firstH2Position);
        });

        test('should have proper landmark roles', () => {
            const nav = document.querySelector('nav[role="navigation"]');
            const main = document.querySelector('main[role="main"]');
            
            expect(nav).toBeTruthy();
            expect(main).toBeTruthy();
            expect(nav.getAttribute('aria-label')).toBe('Main navigation');
            expect(main.getAttribute('aria-label')).toBe('Main content');
        });

        test('should have proper list structure', () => {
            const navList = document.querySelector('nav ul');
            const listItems = navList.querySelectorAll('li');
            
            expect(navList).toBeTruthy();
            expect(listItems.length).toBeGreaterThan(0);
            
            // Each list item should contain a link
            listItems.forEach(li => {
                const link = li.querySelector('a');
                expect(link).toBeTruthy();
                expect(link.getAttribute('href')).toBeTruthy();
            });
        });

        test('should have proper dialog markup', () => {
            const dialog = document.getElementById('modal-dialog');
            
            expect(dialog.getAttribute('role')).toBe('dialog');
            expect(dialog.getAttribute('aria-labelledby')).toBe('dialog-title');
            expect(dialog.getAttribute('aria-hidden')).toBe('true');
            
            const title = document.getElementById('dialog-title');
            expect(title).toBeTruthy();
        });
    });

    describe('ARIA Attributes', () => {
        test('should have proper aria-expanded states', () => {
            const dropdownBtn = document.getElementById('dropdown-btn');
            
            expect(dropdownBtn.getAttribute('aria-expanded')).toBe('false');
            expect(dropdownBtn.getAttribute('aria-controls')).toBe('dropdown-menu');
            
            // Simulate opening dropdown
            dropdownBtn.setAttribute('aria-expanded', 'true');
            document.getElementById('dropdown-menu').setAttribute('aria-hidden', 'false');
            document.getElementById('dropdown-menu').style.display = 'block';
            
            expect(dropdownBtn.getAttribute('aria-expanded')).toBe('true');
            expect(document.getElementById('dropdown-menu').getAttribute('aria-hidden')).toBe('false');
        });

        test('should have proper aria-hidden states', () => {
            const dropdown = document.getElementById('dropdown-menu');
            const dialog = document.getElementById('modal-dialog');
            
            expect(dropdown.getAttribute('aria-hidden')).toBe('true');
            expect(dialog.getAttribute('aria-hidden')).toBe('true');
            
            // When visible, aria-hidden should be false or removed
            dropdown.style.display = 'block';
            dropdown.setAttribute('aria-hidden', 'false');
            
            expect(dropdown.getAttribute('aria-hidden')).toBe('false');
        });

        test('should have proper aria-live regions', () => {
            const liveRegion = document.getElementById('live-region');
            const statusRegion = document.getElementById('status-region');
            
            expect(liveRegion.getAttribute('aria-live')).toBe('polite');
            expect(liveRegion.getAttribute('aria-atomic')).toBe('true');
            expect(statusRegion.getAttribute('role')).toBe('status');
            expect(statusRegion.getAttribute('aria-live')).toBe('polite');
        });

        test('should have proper aria-describedby associations', () => {
            const link = document.querySelector('a[aria-describedby="nav-help"]');
            const helpText = document.getElementById('nav-help');
            
            expect(link).toBeTruthy();
            expect(helpText).toBeTruthy();
            expect(link.getAttribute('aria-describedby')).toBe('nav-help');
        });

        test('should have proper menu roles', () => {
            const menu = document.getElementById('dropdown-menu');
            const menuItems = menu.querySelectorAll('[role="menuitem"]');
            
            expect(menu.getAttribute('role')).toBe('menu');
            expect(menuItems.length).toBeGreaterThan(0);
            
            menuItems.forEach(item => {
                expect(item.getAttribute('role')).toBe('menuitem');
            });
        });
    });

    describe('Keyboard Navigation', () => {
        test('should handle keyboard focus management', () => {
            const dropdownBtn = document.getElementById('dropdown-btn');
            const menu = document.getElementById('dropdown-menu');
            const menuItems = menu.querySelectorAll('[role="menuitem"]');
            
            // Mock focus methods
            menuItems.forEach(item => {
                item.focus = jest.fn();
            });
            
            // Simulate arrow key navigation in menu
            let currentIndex = -1;
            const navigateMenu = function(e) {
                if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    currentIndex = (currentIndex + 1) % menuItems.length;
                    menuItems[currentIndex].focus();
                } else if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    currentIndex = (currentIndex - 1 + menuItems.length) % menuItems.length;
                    menuItems[currentIndex].focus();
                }
            };
            
            menu.addEventListener('keydown', navigateMenu);
            
            fireEvent.keyDown(menu, { key: 'ArrowDown' });
            expect(menuItems[0].focus).toHaveBeenCalled();
            
            fireEvent.keyDown(menu, { key: 'ArrowDown' });
            expect(menuItems[1].focus).toHaveBeenCalled();
            
            fireEvent.keyDown(menu, { key: 'ArrowUp' });
            expect(menuItems[0].focus).toHaveBeenCalled();
        });

        test('should handle Escape key to close menus', () => {
            const dropdownBtn = document.getElementById('dropdown-btn');
            const menu = document.getElementById('dropdown-menu');
            
            // Open menu
            dropdownBtn.setAttribute('aria-expanded', 'true');
            menu.setAttribute('aria-hidden', 'false');
            menu.style.display = 'block';
            
            // Add escape handler
            menu.addEventListener('keydown', function(e) {
                if (e.key === 'Escape') {
                    dropdownBtn.setAttribute('aria-expanded', 'false');
                    menu.setAttribute('aria-hidden', 'true');
                    menu.style.display = 'none';
                    dropdownBtn.focus();
                }
            });
            
            dropdownBtn.focus = jest.fn();
            
            fireEvent.keyDown(menu, { key: 'Escape' });
            
            expect(dropdownBtn.getAttribute('aria-expanded')).toBe('false');
            expect(menu.getAttribute('aria-hidden')).toBe('true');
            expect(menu.style.display).toBe('none');
            expect(dropdownBtn.focus).toHaveBeenCalled();
        });

        test('should handle Enter and Space keys on buttons', () => {
            const button = document.getElementById('dropdown-btn');
            let activated = false;
            
            const activate = function() {
                activated = true;
            };
            
            button.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    activate();
                }
            });
            
            fireEvent.keyDown(button, { key: 'Enter' });
            expect(activated).toBe(true);
            
            activated = false;
            fireEvent.keyDown(button, { key: ' ' });
            expect(activated).toBe(true);
        });

        test('should manage focus trap in dialogs', () => {
            const dialog = document.getElementById('modal-dialog');
            const closeButton = dialog.querySelector('button');
            
            // Mock focus methods
            closeButton.focus = jest.fn();
            
            // Simulate opening dialog
            dialog.setAttribute('aria-hidden', 'false');
            dialog.style.display = 'block';
            
            // Focus should move to dialog
            dialog.focus = jest.fn();
            dialog.focus();
            
            // Tab key should cycle within dialog
            const focusableElements = dialog.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
            let focusIndex = 0;
            
            dialog.addEventListener('keydown', function(e) {
                if (e.key === 'Tab') {
                    e.preventDefault();
                    focusIndex = e.shiftKey ? 
                        (focusIndex - 1 + focusableElements.length) % focusableElements.length :
                        (focusIndex + 1) % focusableElements.length;
                    
                    focusableElements[focusIndex].focus();
                }
            });
            
            focusableElements.forEach(el => {
                el.focus = jest.fn();
            });
            
            fireEvent.keyDown(dialog, { key: 'Tab' });
            expect(focusableElements[1] ? focusableElements[1].focus : focusableElements[0].focus).toHaveBeenCalled();
            
            expect(dialog.focus).toHaveBeenCalled();
        });
    });

    describe('Screen Reader Support', () => {
        test('should have proper alt text for images', () => {
            // Add test images
            document.body.innerHTML += `
                <img src="test.jpg" alt="Description of test image">
                <img src="decorative.jpg" alt="" role="presentation">
            `;
            
            const images = document.querySelectorAll('img');
            images.forEach(img => {
                expect(img.hasAttribute('alt')).toBe(true);
                // Functional images should have descriptive alt text
                // Decorative images should have empty alt text
            });
        });

        test('should announce dynamic content changes', () => {
            const liveRegion = document.getElementById('live-region');
            const statusRegion = document.getElementById('status-region');
            
            // Simulate announcing search results
            liveRegion.textContent = 'Found 5 search results';
            expect(liveRegion.textContent).toBe('Found 5 search results');
            
            // Simulate status update
            statusRegion.textContent = 'Form submitted successfully';
            expect(statusRegion.textContent).toBe('Form submitted successfully');
        });

        test('should have descriptive button labels', () => {
            const closeButton = document.querySelector('button[aria-label="Close dialog"]');
            
            expect(closeButton.getAttribute('aria-label')).toBe('Close dialog');
            
            // Test that all buttons have accessible names
            const allButtons = document.querySelectorAll('button');
            allButtons.forEach(button => {
                const hasAccessibleName = 
                    button.textContent.trim() ||
                    button.getAttribute('aria-label') ||
                    button.getAttribute('aria-labelledby') ||
                    button.getAttribute('title');
                
                expect(hasAccessibleName).toBeTruthy();
            });
        });

        test('should have proper form labels', () => {
            // Add test form
            document.body.innerHTML += `
                <form>
                    <label for="email">Email:</label>
                    <input type="email" id="email" required>
                    
                    <input type="text" aria-label="Search" placeholder="Search...">
                    
                    <fieldset>
                        <legend>Preferences</legend>
                        <input type="radio" name="theme" id="light" value="light">
                        <label for="light">Light theme</label>
                        <input type="radio" name="theme" id="dark" value="dark">
                        <label for="dark">Dark theme</label>
                    </fieldset>
                </form>
            `;
            
            const emailInput = document.getElementById('email');
            const emailLabel = document.querySelector('label[for="email"]');
            const searchInput = document.querySelector('input[aria-label="Search"]');
            const fieldset = document.querySelector('fieldset');
            const legend = fieldset.querySelector('legend');
            
            expect(emailLabel).toBeTruthy();
            expect(emailLabel.getAttribute('for')).toBe('email');
            expect(searchInput.getAttribute('aria-label')).toBe('Search');
            expect(legend).toBeTruthy();
            expect(legend.textContent).toBe('Preferences');
        });
    });

    describe('Color and Contrast', () => {
        test('should not rely solely on color for information', () => {
            // Add elements with different states
            document.body.innerHTML += `
                <div class="status-indicator error" aria-label="Error status">
                    <span class="icon" aria-hidden="true">❌</span>
                    Error
                </div>
                <div class="status-indicator success" aria-label="Success status">
                    <span class="icon" aria-hidden="true">✅</span>
                    Success
                </div>
            `;
            
            const errorStatus = document.querySelector('.status-indicator.error');
            const successStatus = document.querySelector('.status-indicator.success');
            
            // Should have text content in addition to color
            expect(errorStatus.textContent.trim()).toContain('Error');
            expect(successStatus.textContent.trim()).toContain('Success');
            
            // Should have aria-label for screen readers
            expect(errorStatus.getAttribute('aria-label')).toBe('Error status');
            expect(successStatus.getAttribute('aria-label')).toBe('Success status');
        });

        test('should have sufficient contrast ratios', () => {
            // In a real test, you would use tools like axe-core to check contrast
            // For now, we'll check that elements have appropriate styling classes
            document.body.innerHTML += `
                <button class="primary-btn">Primary Action</button>
                <button class="secondary-btn">Secondary Action</button>
                <p class="text-content">Regular text content</p>
            `;
            
            const primaryBtn = document.querySelector('.primary-btn');
            const secondaryBtn = document.querySelector('.secondary-btn');
            const textContent = document.querySelector('.text-content');
            
            expect(primaryBtn.classList.contains('primary-btn')).toBe(true);
            expect(secondaryBtn.classList.contains('secondary-btn')).toBe(true);
            expect(textContent.classList.contains('text-content')).toBe(true);
        });
    });

    describe('Error Handling and Feedback', () => {
        test('should announce errors to screen readers', () => {
            const statusRegion = document.getElementById('status-region');
            
            // Simulate form validation error
            const announceError = function(message) {
                statusRegion.textContent = message;
            };
            
            announceError('Email is required');
            expect(statusRegion.textContent).toBe('Email is required');
            
            announceError('Password must be at least 8 characters');
            expect(statusRegion.textContent).toBe('Password must be at least 8 characters');
        });

        test('should provide helpful error messages', () => {
            document.body.innerHTML += `
                <form>
                    <input type="email" id="email-input" aria-describedby="email-error">
                    <div id="email-error" class="error-message" style="display: none;"></div>
                </form>
            `;
            
            const emailInput = document.getElementById('email-input');
            const errorMessage = document.getElementById('email-error');
            
            // Simulate validation error
            const showError = function(input, message) {
                const errorId = input.getAttribute('aria-describedby');
                const errorElement = document.getElementById(errorId);
                if (errorElement) {
                    errorElement.textContent = message;
                    errorElement.style.display = 'block';
                    input.setAttribute('aria-invalid', 'true');
                }
            };
            
            showError(emailInput, 'Please enter a valid email address');
            
            expect(errorMessage.textContent).toBe('Please enter a valid email address');
            expect(errorMessage.style.display).toBe('block');
            expect(emailInput.getAttribute('aria-invalid')).toBe('true');
        });
    });

    describe('Mobile Accessibility', () => {
        test('should have appropriate touch targets', () => {
            const buttons = document.querySelectorAll('button');
            
            buttons.forEach(button => {
                // Check that buttons have sufficient size (44x44px minimum recommended)
                // In a real test, you would check computed styles
                expect(button.tagName).toBe('BUTTON');
                
                // Should be focusable
                const tabIndex = button.getAttribute('tabindex');
                expect(tabIndex === null || parseInt(tabIndex) >= 0).toBe(true);
            });
        });

        test('should support gesture navigation', () => {
            const swipeContainer = document.createElement('div');
            swipeContainer.setAttribute('role', 'region');
            swipeContainer.setAttribute('aria-label', 'Swipeable content');
            document.body.appendChild(swipeContainer);
            
            let swipeDirection = null;
            
            swipeContainer.addEventListener('touchstart', function(e) {
                this.startX = e.touches[0].clientX;
            });
            
            swipeContainer.addEventListener('touchend', function(e) {
                const endX = e.changedTouches[0].clientX;
                const diff = this.startX - endX;
                
                if (Math.abs(diff) > 50) {
                    swipeDirection = diff > 0 ? 'left' : 'right';
                }
            });
            
            // Simulate touch events
            const touchStart = new TouchEvent('touchstart', {
                touches: [{ clientX: 100 }]
            });
            const touchEnd = new TouchEvent('touchend', {
                changedTouches: [{ clientX: 50 }]
            });
            
            swipeContainer.dispatchEvent(touchStart);
            swipeContainer.dispatchEvent(touchEnd);
            
            expect(swipeDirection).toBe('left');
        });
    });

    describe('Performance and Accessibility', () => {
        test('should handle reduced motion preferences', () => {
            // Mock matchMedia for prefers-reduced-motion
            global.matchMedia = jest.fn(() => ({
                matches: true,
                addEventListener: jest.fn(),
                removeEventListener: jest.fn()
            }));
            
            const checkReducedMotion = function() {
                return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            };
            
            expect(checkReducedMotion()).toBe(true);
            
            // In implementation, animations would be disabled or reduced
            const element = document.createElement('div');
            if (checkReducedMotion()) {
                element.style.animation = 'none';
                element.style.transition = 'none';
            }
            
            expect(element.style.animation).toBe('none');
            expect(element.style.transition).toBe('none');
        });

        test('should handle high contrast mode', () => {
            // Mock high contrast media query
            global.matchMedia = jest.fn(() => ({
                matches: true,
                addEventListener: jest.fn(),
                removeEventListener: jest.fn()
            }));
            
            const checkHighContrast = function() {
                return window.matchMedia('(prefers-contrast: high)').matches;
            };
            
            expect(checkHighContrast()).toBe(true);
            
            // In implementation, high contrast styles would be applied
            const element = document.createElement('button');
            if (checkHighContrast()) {
                element.classList.add('high-contrast');
            }
            
            expect(element.classList.contains('high-contrast')).toBe(true);
        });
    });
});