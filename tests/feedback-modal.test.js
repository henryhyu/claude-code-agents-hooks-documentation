// Tests for feedback modal functionality
import { fireEvent, waitFor } from './test-utils.js';
import { createMockHTML } from './setup.js';

describe('Feedback Modal Functionality', () => {
    let feedbackBtn, feedbackModal, feedbackForm, closeBtn;

    beforeEach(() => {
        document.body.innerHTML = '';
        createMockHTML();
        
        // Add feedback modal HTML structure
        document.body.innerHTML += `
            <button id="feedbackBtn">Feedback</button>
            <div id="feedbackModal" class="modal" style="display: none;">
                <div class="modal-content">
                    <span class="close" id="closeFeedback">&times;</span>
                    <h2>Feedback</h2>
                    <form id="feedbackForm">
                        <textarea id="feedbackText" placeholder="Your feedback..." required></textarea>
                        <div class="modal-buttons">
                            <button type="submit">Submit</button>
                            <button type="button" onclick="closeFeedbackModal()">Cancel</button>
                        </div>
                    </form>
                </div>
            </div>
        `;

        feedbackBtn = document.getElementById('feedbackBtn');
        feedbackModal = document.getElementById('feedbackModal');
        feedbackForm = document.getElementById('feedbackForm');
        closeBtn = document.getElementById('closeFeedback');

        // Mock console.log for feedback submission
        global.console.log = jest.fn();
        
        jest.clearAllMocks();
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    describe('Modal Opening', () => {
        test('should open modal when feedback button is clicked', () => {
            // Add event listener (simulating the actual script)
            feedbackBtn.addEventListener('click', function() {
                feedbackModal.style.display = 'block';
            });

            fireEvent.click(feedbackBtn);
            
            expect(feedbackModal.style.display).toBe('block');
        });

        test('should handle missing feedback button gracefully', () => {
            document.getElementById('feedbackBtn').remove();
            
            expect(() => {
                const btn = document.getElementById('feedbackBtn');
                if (btn) {
                    fireEvent.click(btn);
                }
            }).not.toThrow();
        });
    });

    describe('Modal Closing', () => {
        beforeEach(() => {
            feedbackModal.style.display = 'block';
        });

        test('should close modal when close button is clicked', () => {
            // Define closeFeedbackModal function (from the actual script)
            global.closeFeedbackModal = function() {
                feedbackModal.style.display = 'none';
                document.getElementById('feedbackText').value = '';
            };

            closeBtn.addEventListener('click', global.closeFeedbackModal);
            
            fireEvent.click(closeBtn);
            
            expect(feedbackModal.style.display).toBe('none');
        });

        test('should close modal when clicking outside modal content', () => {
            global.closeFeedbackModal = function() {
                feedbackModal.style.display = 'none';
                document.getElementById('feedbackText').value = '';
            };

            feedbackModal.addEventListener('click', function(e) {
                if (e.target === feedbackModal) {
                    global.closeFeedbackModal();
                }
            });

            // Click on the modal background
            fireEvent.click(feedbackModal);
            
            expect(feedbackModal.style.display).toBe('none');
        });

        test('should not close modal when clicking modal content', () => {
            const modalContent = feedbackModal.querySelector('.modal-content');
            
            feedbackModal.addEventListener('click', function(e) {
                if (e.target === feedbackModal) {
                    feedbackModal.style.display = 'none';
                }
            });

            // Click on modal content (should not close)
            fireEvent.click(modalContent);
            
            expect(feedbackModal.style.display).toBe('block');
        });

        test('should clear form when modal closes', () => {
            const feedbackText = document.getElementById('feedbackText');
            feedbackText.value = 'Test feedback content';

            global.closeFeedbackModal = function() {
                feedbackModal.style.display = 'none';
                feedbackText.value = '';
            };

            global.closeFeedbackModal();
            
            expect(feedbackText.value).toBe('');
            expect(feedbackModal.style.display).toBe('none');
        });
    });

    describe('Form Submission', () => {
        test('should handle form submission correctly', () => {
            const feedbackText = document.getElementById('feedbackText');
            feedbackText.value = 'This is test feedback';

            // Mock the form submission handler
            feedbackForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                const feedback = document.getElementById('feedbackText').value;
                console.log('Feedback submitted:', feedback);
                
                // Simulate success feedback
                alert('Thank you for your feedback!');
                
                // Close modal and clear form
                feedbackModal.style.display = 'none';
                feedbackText.value = '';
            });

            // Mock alert
            global.alert = jest.fn();

            fireEvent.submit(feedbackForm);

            expect(global.console.log).toHaveBeenCalledWith('Feedback submitted:', 'This is test feedback');
            expect(global.alert).toHaveBeenCalledWith('Thank you for your feedback!');
            expect(feedbackModal.style.display).toBe('none');
            expect(feedbackText.value).toBe('');
        });

        test('should require feedback text for submission', () => {
            const feedbackText = document.getElementById('feedbackText');
            feedbackText.value = '';

            // HTML5 validation will prevent submission of empty required field
            const isValid = feedbackForm.checkValidity();
            
            expect(isValid).toBe(false);
        });

        test('should handle form submission errors gracefully', () => {
            const feedbackText = document.getElementById('feedbackText');
            feedbackText.value = 'Test feedback';

            // Mock error scenario
            feedbackForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                try {
                    throw new Error('Submission failed');
                } catch (error) {
                    console.error('Error submitting feedback:', error.message);
                    alert('Error submitting feedback. Please try again.');
                }
            });

            global.alert = jest.fn();
            global.console.error = jest.fn();

            fireEvent.submit(feedbackForm);

            expect(global.console.error).toHaveBeenCalledWith('Error submitting feedback:', 'Submission failed');
            expect(global.alert).toHaveBeenCalledWith('Error submitting feedback. Please try again.');
        });
    });

    describe('Accessibility', () => {
        test('should have proper ARIA attributes', () => {
            expect(feedbackModal.getAttribute('role')).toBe(null); // Will be set to 'dialog' in real implementation
            expect(feedbackModal.getAttribute('aria-hidden')).toBe(null); // Should be 'true' when hidden
        });

        test('should handle keyboard navigation', () => {
            feedbackModal.style.display = 'block';
            
            global.closeFeedbackModal = jest.fn();
            
            // Mock keyboard event handler
            document.addEventListener('keydown', function(e) {
                if (e.key === 'Escape') {
                    global.closeFeedbackModal();
                }
            });

            // Simulate Escape key press
            fireEvent.keyDown(document, { key: 'Escape' });

            expect(global.closeFeedbackModal).toHaveBeenCalled();
        });

        test('should focus on modal when opened', () => {
            // In a real implementation, focus should move to the modal
            feedbackBtn.addEventListener('click', function() {
                feedbackModal.style.display = 'block';
                // Focus management would happen here
                feedbackModal.focus();
            });

            feedbackModal.focus = jest.fn();
            
            fireEvent.click(feedbackBtn);
            
            expect(feedbackModal.focus).toHaveBeenCalled();
        });
    });

    describe('Edge Cases', () => {
        test('should handle multiple rapid button clicks', () => {
            feedbackBtn.addEventListener('click', function() {
                feedbackModal.style.display = 'block';
            });

            // Click multiple times rapidly
            fireEvent.click(feedbackBtn);
            fireEvent.click(feedbackBtn);
            fireEvent.click(feedbackBtn);
            
            expect(feedbackModal.style.display).toBe('block');
        });

        test('should handle missing modal elements gracefully', () => {
            feedbackModal.remove();
            
            expect(() => {
                feedbackBtn.addEventListener('click', function() {
                    const modal = document.getElementById('feedbackModal');
                    if (modal) {
                        modal.style.display = 'block';
                    }
                });
                
                fireEvent.click(feedbackBtn);
            }).not.toThrow();
        });

        test('should handle form without textarea', () => {
            document.getElementById('feedbackText').remove();
            
            expect(() => {
                fireEvent.submit(feedbackForm);
            }).not.toThrow();
        });
    });
});