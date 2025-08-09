// Basic test to verify the setup works (CommonJS)
const { 
    detectLanguage, 
    escapeRegExp, 
    initializeMermaid,
    updateReadingProgress,
    performSearch,
    showCopySuccess
} = require('../scripts-testable.cjs');

// Create mock HTML structure
const createMockHTML = () => {
  document.body.innerHTML = `
    <div class="reading-progress">
      <div class="reading-progress-bar" id="progressBar"></div>
    </div>
    
    <main>
      <div class="content-wrapper">
        <aside class="sidebar">
          <div class="search-container">
            <input type="text" class="search-box" placeholder="Search..." id="searchInput">
            <div class="search-results" id="searchResults"></div>
          </div>
        </aside>
        
        <div class="main-content">
          <h2 id="section1">Section 1</h2>
          <p>This is some content for testing search functionality.</p>
          
          <h3 id="subsection">Subsection</h3>
          <p>More content with <code>code snippets</code> for testing.</p>
          
          <pre><code>function test() {
  console.log("Testing");
}</code></pre>
          
          <pre><code>#!/bin/bash
echo "Testing bash detection"</code></pre>
        </div>
      </div>
    </main>
    
    <button id="backToTop" class="back-to-top" title="Back to top">↑</button>
  `;
};

describe('Basic Functionality Tests', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    createMockHTML();
    jest.clearAllMocks();
  });

  describe('Language Detection', () => {
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
      expect(detectLanguage(null)).toBe('bash');
      expect(detectLanguage(undefined)).toBe('bash');
    });
  });

  describe('Utility Functions', () => {
    test('should escape regex characters properly', () => {
      expect(escapeRegExp('test.with+special*chars?')).toBe('test\\.with\\+special\\*chars\\?');
      expect(escapeRegExp('normal text')).toBe('normal text');
      expect(escapeRegExp('')).toBe('');
      expect(escapeRegExp('(parentheses)')).toBe('\\(parentheses\\)');
      expect(escapeRegExp('[brackets]')).toBe('\\[brackets\\]');
      expect(escapeRegExp('{braces}')).toBe('\\{braces\\}');
    });
  });

  describe('Mermaid Initialization', () => {
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

  describe('Reading Progress', () => {
    test('should update progress bar width based on scroll position', () => {
      // Mock scroll properties
      window.pageYOffset = 600;
      document.documentElement.scrollTop = 600;
      document.body.scrollTop = 600;
      document.documentElement.scrollHeight = 2000;
      document.documentElement.clientHeight = 800;
      
      const progressBar = document.getElementById('progressBar');
      
      updateReadingProgress();
      
      expect(progressBar.style.width).toBe('50%');
    });

    test('should handle zero height gracefully', () => {
      // Mock properties for no scrollable content
      window.pageYOffset = 0;
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      document.documentElement.scrollHeight = 800;
      document.documentElement.clientHeight = 800;
      
      const progressBar = document.getElementById('progressBar');
      
      updateReadingProgress();
      
      expect(progressBar.style.width).toBe('0%');
    });

    test('should cap progress at 100%', () => {
      // Mock over-scrolled state
      window.pageYOffset = 2000;
      document.documentElement.scrollTop = 2000;
      document.body.scrollTop = 2000;
      document.documentElement.scrollHeight = 2000;
      document.documentElement.clientHeight = 800;
      
      const progressBar = document.getElementById('progressBar');
      
      updateReadingProgress();
      
      expect(progressBar.style.width).toBe('100%');
    });

    test('should handle missing progress bar gracefully', () => {
      document.getElementById('progressBar').remove();
      
      expect(() => updateReadingProgress()).not.toThrow();
    });
  });

  describe('Search Functionality', () => {
    test('should perform search and return results', () => {
      const results = performSearch('testing');
      
      expect(Array.isArray(results)).toBe(true);
      expect(results.length).toBeGreaterThan(0);
      
      if (results.length > 0) {
        expect(results[0]).toHaveProperty('element');
        expect(results[0]).toHaveProperty('text');
        expect(results[0]).toHaveProperty('heading');
      }
    });

    test('should return empty results for non-existent terms', () => {
      const results = performSearch('xyznonexistent');
      
      expect(Array.isArray(results)).toBe(true);
      expect(results.length).toBe(0);
    });

    test('should handle missing main content gracefully', () => {
      document.querySelector('.main-content').remove();
      
      const results = performSearch('test');
      
      expect(Array.isArray(results)).toBe(true);
      expect(results.length).toBe(0);
    });
  });

  describe('Copy Button Functionality', () => {
    test('should show copy success feedback', (done) => {
      jest.useFakeTimers();
      
      const mockButton = document.createElement('button');
      mockButton.textContent = 'Copy';
      
      // Mock classList methods
      const mockAdd = jest.fn();
      const mockRemove = jest.fn();
      mockButton.classList.add = mockAdd;
      mockButton.classList.remove = mockRemove;
      
      document.body.appendChild(mockButton);
      
      showCopySuccess(mockButton);
      
      expect(mockButton.textContent).toBe('Copied!');
      expect(mockAdd).toHaveBeenCalledWith('copied');
      
      // Fast-forward time
      jest.advanceTimersByTime(2000);
      
      expect(mockButton.textContent).toBe('Copy');
      expect(mockRemove).toHaveBeenCalledWith('copied');
      
      jest.useRealTimers();
      done();
    });
  });

  describe('DOM Elements', () => {
    test('should find required elements in DOM', () => {
      const progressBar = document.getElementById('progressBar');
      const searchInput = document.getElementById('searchInput');
      const searchResults = document.getElementById('searchResults');
      const backToTop = document.getElementById('backToTop');
      
      expect(progressBar).toBeTruthy();
      expect(searchInput).toBeTruthy();
      expect(searchResults).toBeTruthy();
      expect(backToTop).toBeTruthy();
    });

    test('should have proper element structure', () => {
      const mainContent = document.querySelector('.main-content');
      expect(mainContent).toBeTruthy();
      
      const codeBlocks = document.querySelectorAll('pre code');
      expect(codeBlocks.length).toBe(2);
      
      const headings = document.querySelectorAll('h2[id], h3[id]');
      expect(headings.length).toBe(2);
    });
  });

  describe('External Library Mocks', () => {
    test('should have mocked external libraries', () => {
      expect(global.mermaid).toBeDefined();
      expect(global.Prism).toBeDefined();
      expect(global.mermaid.initialize).toBeDefined();
      expect(global.Prism.highlightAll).toBeDefined();
    });

    test('should have mocked browser APIs', () => {
      expect(global.scrollTo).toBeDefined();
      expect(navigator.clipboard).toBeDefined();
      expect(navigator.clipboard.writeText).toBeDefined();
      expect(document.execCommand).toBeDefined();
    });
  });
});