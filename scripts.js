/**
 * Main application initialization
 * Runs when the DOM content is fully loaded to ensure all elements are available
 */
document.addEventListener('DOMContentLoaded', function() {
    // Initialize Mermaid diagram library with configuration
    // - startOnLoad: Automatically render diagrams on page load
    // - theme: Use default Mermaid theme for consistency
    // - securityLevel: Set to 'loose' to allow HTML content in diagrams
    mermaid.initialize({
        startOnLoad: true,
        theme: 'default',
        securityLevel: 'loose'
    });

    // Initialize syntax highlighting and copy buttons for all code blocks
    initializeCodeBlocks();
    
    // Initialize reading progress indicator that tracks scroll position
    initializeReadingProgress();

    // Setup Back to Top Button functionality
    const backToTopButton = document.getElementById('backToTop');
    
    if (backToTopButton) {
        // Show/hide button based on scroll position
        // Button appears when user has scrolled more than 300px from top
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                backToTopButton.style.display = 'block';
            } else {
                backToTopButton.style.display = 'none';
            }
        });

        // Smooth scroll to top when button is clicked
        // Prevents default anchor behavior and uses smooth scrolling API
        backToTopButton.addEventListener('click', function(e) {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    /**
     * Initialize all code blocks with syntax highlighting and copy functionality
     * Processes all <pre><code> elements on the page to add:
     * - Automatic language detection
     * - Syntax highlighting via Prism.js
     * - Copy-to-clipboard functionality
     * - Proper accessibility attributes
     */
    function initializeCodeBlocks() {
        // Find all code blocks in the document
        const codeBlocks = document.querySelectorAll('pre code');
        
        // Process each code block individually
        codeBlocks.forEach(function(codeBlock, index) {
            const pre = codeBlock.parentElement;
            const code = codeBlock.textContent;
            
            // Automatically determine programming language based on content patterns
            let language = detectLanguage(code);
            
            // Add language classes for Prism.js syntax highlighting
            codeBlock.className = `language-${language}`;
            pre.className = `language-${language}`;
            
            // Create container div to position the copy button relative to the code block
            const container = document.createElement('div');
            container.className = 'code-container';
            
            // Create accessible copy button with proper ARIA labeling
            const copyButton = document.createElement('button');
            copyButton.className = 'copy-button';
            copyButton.textContent = 'Copy';
            copyButton.setAttribute('aria-label', 'Copy code to clipboard');
            
            // Attach click handler for copy functionality
            // Passes the code content and button element for user feedback
            copyButton.addEventListener('click', function() {
                copyToClipboard(code, copyButton);
            });
            
            // Restructure DOM to wrap code block and add copy button
            // Container becomes the parent with pre and copy button as children
            pre.parentNode.insertBefore(container, pre);
            container.appendChild(pre);
            container.appendChild(copyButton);
        });
        
        // Re-run Prism syntax highlighting after all modifications
        // This ensures all newly added language classes are processed
        if (typeof Prism !== 'undefined') {
            Prism.highlightAll();
        }
    }

    /**
     * Automatically detect programming language from code content
     * Uses pattern matching to identify common language constructs
     * @param {string} code - The code content to analyze
     * @returns {string} - Detected language identifier for Prism.js
     */
    function detectLanguage(code) {
        // Bash/Shell script detection
        // Look for common shell commands and shebang
        if (code.includes('#!/bin/bash') || code.includes('echo ') || 
            code.includes('mkdir ') || code.includes('cd ') || 
            code.includes('ls ') || code.includes('git ') || 
            code.includes('claude ')) {
            return 'bash';
        } 
        // JSON detection
        // Look for JSON structure with specific project-related keys
        else if (code.includes('{') && code.includes('}') && 
                (code.includes('"hooks"') || code.includes('"PreToolUse"') || 
                 code.includes('"matcher"'))) {
            return 'json';
        } 
        // Markdown/YAML frontmatter detection
        // Look for YAML frontmatter patterns
        else if (code.includes('---\nname:') || code.includes('description:')) {
            return 'markdown';
        } 
        // JavaScript detection
        // Look for common JS keywords and syntax
        else if (code.includes('function') || code.includes('const ') || 
                 code.includes('let ')) {
            return 'javascript';
        } 
        // Python detection
        // Look for Python-specific keywords
        else if (code.includes('def ') || code.includes('import ') || 
                 code.includes('python')) {
            return 'python';
        } 
        // Default fallback to bash for generic code
        else {
            return 'bash';
        }
    }

    /**
     * Copy text to clipboard with graceful fallback for older browsers
     * @param {string} text - The text content to copy
     * @param {HTMLElement} button - The copy button element for user feedback
     */
    function copyToClipboard(text, button) {
        // Use modern Clipboard API if available and in secure context (HTTPS)
        if (navigator.clipboard && window.isSecureContext) {
            // Attempt to use modern clipboard API
            navigator.clipboard.writeText(text).then(function() {
                showCopySuccess(button);
            }).catch(function() {
                // Fallback if clipboard API fails
                fallbackCopyToClipboard(text, button);
            });
        } else {
            // Use fallback method for older browsers or insecure contexts
            fallbackCopyToClipboard(text, button);
        }
    }

    /**
     * Fallback clipboard copy method for older browsers
     * Uses the deprecated execCommand API as last resort
     * @param {string} text - The text content to copy
     * @param {HTMLElement} button - The copy button element for user feedback
     */
    function fallbackCopyToClipboard(text, button) {
        // Create temporary textarea element off-screen
        const textArea = document.createElement('textarea');
        textArea.value = text;
        // Position off-screen to avoid visual disruption
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        // Focus and select the text for copying
        textArea.focus();
        textArea.select();
        
        try {
            // Attempt to copy using deprecated execCommand
            document.execCommand('copy');
            showCopySuccess(button);
        } catch (err) {
            // Handle copy failure with user feedback
            console.error('Failed to copy text: ', err);
            button.textContent = 'Failed';
            button.classList.add('error');
            // Reset button state after 2 seconds
            setTimeout(function() {
                button.textContent = 'Copy';
                button.classList.remove('error');
            }, 2000);
        }
        
        // Clean up temporary element
        document.body.removeChild(textArea);
    }

    /**
     * Display success feedback when copy operation completes
     * @param {HTMLElement} button - The copy button to update
     */
    function showCopySuccess(button) {
        // Update button text and styling to indicate success
        button.textContent = 'Copied!';
        button.classList.add('copied');
        // Reset button to normal state after 2 seconds
        setTimeout(function() {
            button.textContent = 'Copy';
            button.classList.remove('copied');
        }, 2000);
    }

    /**
     * Initialize reading progress indicator at top of page
     * Creates a visual progress bar that fills as user scrolls
     */
    function initializeReadingProgress() {
        const progressBar = document.getElementById('progressBar');
        // Exit early if progress bar element not found
        if (!progressBar) return;

        /**
         * Calculate and update reading progress based on scroll position
         * Updates progress bar width to reflect how much of page has been read
         */
        function updateReadingProgress() {
            // Get current scroll position (cross-browser compatible)
            const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
            // Calculate total scrollable height
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            // Convert to percentage (0-100)
            const scrolled = (winScroll / height) * 100;
            
            // Update progress bar width, capped at 100%
            progressBar.style.width = Math.min(scrolled, 100) + '%';
        }

        // Update progress bar on every scroll event
        window.addEventListener('scroll', updateReadingProgress);
        
        // Set initial progress state on page load
        updateReadingProgress();
    }

    // ====== SEARCH FUNCTIONALITY ======
    // Initialize search elements and state
    const searchInput = document.getElementById('searchInput');
    const searchResults = document.getElementById('searchResults');
    const mainContent = document.querySelector('.main-content');
    let searchTimeout; // Used for debouncing search input

    // Implement debounced search to avoid excessive API calls
    // Waits 300ms after user stops typing before executing search
    searchInput.addEventListener('input', function() {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(performSearch, 300);
    });

    /**
     * Execute search across page content with query highlighting
     * Searches through headings, paragraphs, lists, and code blocks
     */
    function performSearch() {
        // Get and normalize search query
        const query = searchInput.value.toLowerCase().trim();
        
        // Clear results if query too short (avoid noise)
        if (query.length < 2) {
            clearSearchResults();
            return;
        }

        // Get all searchable content elements from main content area
        const sections = mainContent.querySelectorAll('h2, h3, h4, p, li, code, pre');
        const results = []; // Store matching results

        // Search through each content section
        sections.forEach(section => {
            const text = section.textContent.toLowerCase();
            const heading = findParentHeading(section);
            
            // Check if section contains search query
            if (text.includes(query)) {
                // Create result object with context information
                const result = {
                    element: section,           // DOM element containing match
                    heading: heading,           // Parent heading for context
                    text: section.textContent,  // Original text content
                    id: heading ? heading.id : null  // Anchor ID for navigation
                };
                
                // Prevent duplicate entries in results
                if (!results.some(r => r.element === section)) {
                    results.push(result);
                }
            }
        });

        // Display formatted results with highlighting
        displaySearchResults(results, query);
    }

    /**
     * Find the nearest parent heading element for context
     * Used to provide section context for search results
     * @param {HTMLElement} element - Element to find parent heading for
     * @returns {HTMLElement|null} - Parent heading element or null
     */
    function findParentHeading(element) {
        let current = element;
        // Traverse up DOM tree to find nearest heading
        while (current && current !== mainContent) {
            // Look for heading elements with ID attributes (for linking)
            if (current.matches('h2, h3, h4') && current.id) {
                return current;
            }
            // Check previous sibling or move up to parent
            current = current.previousElementSibling || current.parentElement;
        }
        return null; // No parent heading found
    }

    /**
     * Display formatted search results with highlighting and context
     * @param {Array} results - Array of search result objects
     * @param {string} query - Original search query for highlighting
     */
    function displaySearchResults(results, query) {
        // Handle no results case
        if (results.length === 0) {
            searchResults.innerHTML = `<div class="search-no-results">No results found for "${query}"</div>`;
            return;
        }

        // Deduplicate results by heading to avoid multiple entries per section
        const uniqueResults = [];
        const seenHeadings = new Set(); // Track processed headings

        // Process results and remove duplicates
        results.forEach(result => {
            if (result.heading && !seenHeadings.has(result.heading.id)) {
                seenHeadings.add(result.heading.id);
                uniqueResults.push(result);
            }
        });

        // Generate HTML for search results (limit to 5 for performance)
        const resultsHtml = uniqueResults.slice(0, 5).map(result => {
            // Extract heading text for display
            const headingText = result.heading ? result.heading.textContent : 'Content';
            // Truncate long content with ellipsis
            const snippet = result.text.length > 100 ? 
                result.text.substring(0, 100) + '...' : result.text;
            
            // Create HTML with highlighted search terms
            return `
                <div class="search-result">
                    <a href="#${result.id}">
                        ${highlightText(headingText, query)}
                    </a>
                    <div>
                        ${highlightText(snippet, query)}
                    </div>
                </div>
            `;
        }).join('');

        // Add result count information
        const totalResults = results.length > 5 ? ` (showing 5 of ${results.length})` : '';
        // Combine header and results into final HTML
        searchResults.innerHTML = `
            <div class="search-results-header">
                Found ${results.length} result${results.length !== 1 ? 's' : ''}${totalResults}
            </div>
            ${resultsHtml}
        `;
    }

    /**
     * Highlight search query terms within text content
     * @param {string} text - Text content to highlight
     * @param {string} query - Search query to highlight
     * @returns {string} - HTML string with highlighted terms
     */
    function highlightText(text, query) {
        if (!query) return text;
        // Create case-insensitive regex with escaped special characters
        const regex = new RegExp(`(${escapeRegExp(query)})`, 'gi');
        // Wrap matching terms in highlight spans
        return text.replace(regex, '<span class="search-highlight">$1</span>');
    }

    /**
     * Escape special regex characters in search query
     * Prevents regex injection and ensures literal string matching
     * @param {string} string - String to escape
     * @returns {string} - Escaped string safe for regex
     */
    function escapeRegExp(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    /**
     * Clear search results display
     * Used when search query becomes too short or is cleared
     */
    function clearSearchResults() {
        searchResults.innerHTML = '';
    }

    // Clear search results when clicking outside search container
    // Improves UX by hiding results when user focuses elsewhere
    document.addEventListener('click', function(e) {
        // Only clear if click was outside search container and input is empty
        if (!e.target.closest('.search-container')) {
            if (searchInput.value.trim() === '') {
                clearSearchResults();
            }
        }
    });

    // ====== FEEDBACK SYSTEM ======
    // Initialize feedback system elements
    const feedbackBtn = document.getElementById('feedbackBtn');
    const feedbackModal = document.getElementById('feedbackModal');
    const feedbackForm = document.getElementById('feedbackForm');
    const closeFeedback = document.getElementById('closeFeedback');
    const cancelFeedback = document.getElementById('cancelFeedback');
    const feedbackSuccess = document.getElementById('feedbackSuccess');
    const closeSuccess = document.getElementById('closeSuccess');

    // Open feedback modal when feedback button is clicked
    if (feedbackBtn) {
        feedbackBtn.addEventListener('click', function() {
            feedbackModal.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent background scrolling
            // Focus on first form element for accessibility
            setTimeout(() => {
                const firstInput = feedbackForm.querySelector('input[type="radio"], select, textarea');
                if (firstInput) firstInput.focus();
            }, 100);
        });
    }

    // Close feedback modal function
    function closeFeedbackModal() {
        feedbackModal.classList.remove('active');
        document.body.style.overflow = ''; // Restore scrolling
        // Reset form after closing
        setTimeout(() => {
            feedbackForm.reset();
            feedbackForm.style.display = 'block';
            feedbackSuccess.style.display = 'none';
        }, 300);
    }

    // Close modal when X button is clicked
    if (closeFeedback) {
        closeFeedback.addEventListener('click', closeFeedbackModal);
    }

    // Close modal when Cancel button is clicked
    if (cancelFeedback) {
        cancelFeedback.addEventListener('click', closeFeedbackModal);
    }

    // Close modal when clicking outside modal content
    if (feedbackModal) {
        feedbackModal.addEventListener('click', function(e) {
            if (e.target === feedbackModal) {
                closeFeedbackModal();
            }
        });
    }

    // Close success screen and modal
    if (closeSuccess) {
        closeSuccess.addEventListener('click', closeFeedbackModal);
    }

    // Handle form submission
    if (feedbackForm) {
        feedbackForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(feedbackForm);
            
            // Show loading state on submit button
            const submitBtn = feedbackForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;

            // For demo purposes, simulate form submission
            // In production, you would replace this with actual form submission to Formspree
            setTimeout(() => {
                // Hide form and show success message
                feedbackForm.style.display = 'none';
                feedbackSuccess.style.display = 'block';
                
                // Reset button state
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
                
                console.log('Feedback submitted:', Object.fromEntries(formData));
            }, 1000);

            // Uncomment the following code to enable actual Formspree submission:
            /*
            fetch(feedbackForm.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            }).then(response => {
                if (response.ok) {
                    // Hide form and show success message
                    feedbackForm.style.display = 'none';
                    feedbackSuccess.style.display = 'block';
                } else {
                    throw new Error('Network response was not ok');
                }
            }).catch(error => {
                console.error('Error:', error);
                alert('Sorry, there was an error sending your feedback. Please try again.');
            }).finally(() => {
                // Reset button state
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            });
            */
        });
    }

    // Enhanced rating button interactions
    const ratingBtns = document.querySelectorAll('.rating-btn');
    ratingBtns.forEach(btn => {
        btn.addEventListener('mouseenter', function() {
            // Add hover effect to rating buttons
            this.style.transform = 'scale(1.1)';
        });
        
        btn.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    });

    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && feedbackModal.classList.contains('active')) {
            closeFeedbackModal();
        }
    });
    
    // End of main DOMContentLoaded event handler
});
